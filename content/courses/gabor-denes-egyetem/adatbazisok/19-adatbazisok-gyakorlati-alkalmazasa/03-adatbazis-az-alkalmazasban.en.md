---
title: The Database in a Real Application
summary: What happens when a web application uses the database: connection pool, parameterized queries, a transaction when placing an order, the lost update problem, and two defenses against it: pessimistic locking (FOR UPDATE) and optimistic locking with a version number.
minutes: 30
---

## What you will learn in this lesson

- how an application **talks** to the database,
- why placing an order must happen **in one transaction**,
- what a **lost update** is, and how **pessimistic** and **optimistic locking** protect against it.

## 1. From the click to the database

When a customer clicks "Place order" in the web shop:

```text
  browser ──HTTP──▶ application server ──SQL──▶ database
                    (e.g. Node.js, Python)       (PostgreSQL)
                    │
                    ├ checks who the user is and what they ask for
                    ├ borrows a connection from the pool
                    ├ runs the transaction
                    └ returns the connection, sends the response
```

- **Connection pool:** opening a database connection is expensive (network, authentication, memory on the server). So the application keeps a few connections open and requests borrow them – like library books.
- **Parameterized query:** data coming from the user never goes into the SQL as text; it travels as a separate parameter (topic 15, SQL injection).
- **ORM:** many applications don't write SQL by hand; a library generates it (topic 17). The same thing happens underneath – it's worth knowing what SQL comes out.

## 2. Placing an order: one transaction

An order is several steps: decreasing the stock and recording the order. If only one of them succeeds (the server stops right in between), the data becomes wrong: either a product vanished from the warehouse without an order, or there is an order not covered by stock. So the steps go into **one transaction** (topic 8): **either all of them happen, or none**.

<details>
<summary>Creating the mini warehouse (SQL)</summary>

```sql setup
-- A small warehouse: products with stock and a version number, plus the orders.
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name       VARCHAR(40) NOT NULL,
  stock      INT NOT NULL CHECK (stock >= 0),
  version    INT NOT NULL
);
CREATE TABLE orders (
  order_id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products (product_id),
  qty        INT NOT NULL CHECK (qty > 0)
);
INSERT INTO products VALUES
  (1, 'Mouse', 10, 1),
  (2, 'Keyboard', 5, 3),
  (3, 'Monitor', 2, 7),
  (4, 'Webcam', 0, 2);
```

</details>

```sql run
BEGIN;
UPDATE products SET stock = stock - 3 WHERE product_id = 1;
INSERT INTO orders (product_id, qty) VALUES (1, 3);
COMMIT;

SELECT * FROM products WHERE product_id = 1;
```

Notice the `CHECK (stock >= 0)` constraint: if someone tried to order more webcams than there are, the database refuses – this is the **last line of defense**, even when the application has a bug.

## 3. The lost update

Applications often work like this: they **read** the data, **compute** the new value in the program, then **write it back**. With two simultaneous requests this is dangerous:

| Time | Anna's request        | Béla's request        | Stock in the database |
| ---- | --------------------- | --------------------- | --------------------- |
| 1    | reads: stock = 2      |                       | 2                     |
| 2    |                       | reads: stock = 2      | 2                     |
| 3    | writes: 2 − 1 = **1** |                       | 1                     |
| 4    |                       | writes: 2 − 1 = **1** | 1 (!)                 |

We sold two monitors, yet the stock dropped by only one: **Anna's update was lost**. There are three fixes:

**a) Atomic update.** Don't compute in the program; compute in the database, in one statement, with a condition:

```text
UPDATE products SET stock = stock - 1
WHERE product_id = 3 AND stock >= 1;
```

The database locks the row for the duration of the change, so the two requests run one after the other. If the number of affected rows is 0, the product is sold out. In most cases this is the best option.

**b) Pessimistic locking: `SELECT … FOR UPDATE`.** If the program needs to compute something from the data it read, lock the row when reading: the other request **waits** until you finish.

```sql run
BEGIN;
SELECT stock FROM products WHERE product_id = 3 FOR UPDATE;  -- row locked until the transaction ends
UPDATE products SET stock = stock - 1 WHERE product_id = 3;
COMMIT;                                                        -- the lock is released here

SELECT * FROM products WHERE product_id = 3;
```

"Pessimistic" because it expects a conflict up front. Downside: while the lock lives, others wait – never hold a lock while the user is thinking!

**c) Optimistic locking with a version number.** Every row has a `version` number. You remember it when reading, and when writing back you write only **if it is still the same** – increasing the version by one at the same time:

```text
UPDATE products SET stock = stock - 1, version = version + 1
WHERE product_id = 3 AND version = 7;     -- it was 7 when I read it
```

If someone changed the row in the meantime, the version is now 8, the condition fails and **0 rows** change – that's how the application knows to re-read and tell the user ("The data changed in the meantime"). "Optimistic" because it doesn't lock in advance, it only checks at the end. A good choice when conflicts are rare and a long time can pass between reading and saving (for example an edit form).

## 4. Record only if it worked: data-modifying CTE

The order may be recorded only if the stock deduction **really happened**. In PostgreSQL you can write this in a single statement: `UPDATE … RETURNING` returns the modified rows, and the `INSERT` after the `WITH` block inserts only from those:

```sql run
WITH deduction AS (
  UPDATE products SET stock = stock - 1
  WHERE product_id = 4 AND stock >= 1      -- there are no webcams in stock
  RETURNING product_id
)
INSERT INTO orders (product_id, qty)
SELECT product_id, 1 FROM deduction;       -- so 0 rows go in

SELECT COUNT(*) AS webcam_orders FROM orders WHERE product_id = 4;
```

## Lesson exercise

Three customers place orders almost at the same time. For each one, the application read the product's version earlier:

| Product      | Quantity | Version read |
| ------------ | -------- | ------------ |
| 2 – Keyboard | 2        | 3            |
| 3 – Monitor  | 1        | 6            |
| 4 – Webcam   | 1        | 2            |

Write the three orders **in one transaction**, with **optimistic locking**: for each one, deduct the stock (and increase the version) only if the version is still the one read and there is enough stock – and record the order **only if** the deduction succeeded (data-modifying CTE).

The starter code is the "naive" version: it checks neither the version nor the stock. If you run it, you get an error at the webcam – the `CHECK` catches it. After a correct solution the checker looks at the stock, the versions and the number of orders per product.

```sql starter required
BEGIN;
UPDATE products SET stock = stock - 2 WHERE product_id = 2;
INSERT INTO orders (product_id, qty) VALUES (2, 2);

UPDATE products SET stock = stock - 1 WHERE product_id = 3;
INSERT INTO orders (product_id, qty) VALUES (3, 1);

UPDATE products SET stock = stock - 1 WHERE product_id = 4;
INSERT INTO orders (product_id, qty) VALUES (4, 1);
COMMIT;
```

<details>
<summary>Solution</summary>

```sql solution
BEGIN;
WITH deduction AS (
  UPDATE products SET stock = stock - 2, version = version + 1
  WHERE product_id = 2 AND version = 3 AND stock >= 2
  RETURNING product_id
)
INSERT INTO orders (product_id, qty) SELECT product_id, 2 FROM deduction;

WITH deduction AS (
  UPDATE products SET stock = stock - 1, version = version + 1
  WHERE product_id = 3 AND version = 6 AND stock >= 1
  RETURNING product_id
)
INSERT INTO orders (product_id, qty) SELECT product_id, 1 FROM deduction;

WITH deduction AS (
  UPDATE products SET stock = stock - 1, version = version + 1
  WHERE product_id = 4 AND version = 2 AND stock >= 1
  RETURNING product_id
)
INSERT INTO orders (product_id, qty) SELECT product_id, 1 FROM deduction;
COMMIT;
```

The result: the keyboard order succeeded (stock 5 → 3, version 3 → 4). For the monitor the version had grown to 7 in the meantime – someone else changed it, so we overwrote nothing; the application would re-read. There are no webcams in stock, so there's no order either – without an error.

</details>

```sql test
SELECT p.product_id, p.stock, p.version, COUNT(o.order_id) AS orders
FROM products p
LEFT JOIN orders o ON o.product_id = p.product_id
GROUP BY p.product_id
ORDER BY p.product_id;
```
