---
title: Data Integrity and Constraints
summary: The kinds of integrity (entity, referential, domain and business integrity), how a foreign key behaves on delete and update (RESTRICT, CASCADE, SET NULL), and a hands-on exercise.
minutes: 25
---

## What you will learn

- what **data integrity** means and what kinds there are,
- what should happen to referencing rows when the referenced row is **deleted** (`ON DELETE`),
- how to write a table that protects its data **by itself**.

## What is integrity?

**Integrity** = the data is **correct and free of contradictions**. Normalisation removes the contradictions that come from structure; constraints make sure bad data **never gets in**. There are four kinds:

| Kind                     | Rule                                                        | Tool                            |
| ------------------------ | ----------------------------------------------------------- | ------------------------------- |
| **Entity integrity**     | every row is uniquely identifiable                          | `PRIMARY KEY`                   |
| **Referential integrity** | a foreign key may only point to an existing row            | `REFERENCES` (`FOREIGN KEY`)    |
| **Domain integrity**     | the value is in the allowed domain                          | type, `NOT NULL`, `CHECK`       |
| **Business rules**       | the company's own rules (e.g. "discount at most 30%")       | `CHECK`, triggers, application  |

## What about the orphans?

Referential integrity says: there can't be an order whose customer doesn't exist. But what should happen when a **customer with orders is deleted**? You can set a rule on the foreign key:

| Setting                   | What happens when the customer is deleted?                      | When is it right?                             |
| ------------------------- | --------------------------------------------------------------- | --------------------------------------------- |
| `ON DELETE RESTRICT` / `NO ACTION` (default) | the delete **fails** while they have orders | when the child rows are important (invoices!) |
| `ON DELETE CASCADE`       | their orders are **deleted** too                                | when the child is meaningless without the parent (order items) |
| `ON DELETE SET NULL`      | `customer_id` becomes **NULL** in the orders                    | when the child can live without an owner (the teacher leaves, the course stays) |
| `ON DELETE SET DEFAULT`   | `customer_id` is set to its default                             | rarely                                        |

The same options exist for `ON UPDATE` (when the referenced key changes).

```sql run
CREATE TABLE authors (author_id INT PRIMARY KEY, name VARCHAR(60) NOT NULL);
CREATE TABLE posts (
  post_id   INT PRIMARY KEY,
  title     VARCHAR(100) NOT NULL,
  author_id INT REFERENCES authors (author_id) ON DELETE SET NULL
);
INSERT INTO authors VALUES (1, 'Anna'), (2, 'Bela');
INSERT INTO posts VALUES (10, 'SQL tips', 1), (11, 'Normalisation', 2);
DELETE FROM authors WHERE author_id = 1;
SELECT * FROM posts;
```

After deleting Anna, the post remained, it just became "authorless". Try it (Edit): change it to `ON DELETE CASCADE`, then remove the setting entirely – what happens in the three cases?

## Multi-column CHECK conditions

A `CHECK` can refer not just to one column but to several columns of the row (a table-level constraint):

```sql
CREATE TABLE bookings (
  booking_id INT PRIMARY KEY,
  arrival    DATE NOT NULL,
  departure  DATE NOT NULL,
  CHECK (departure > arrival)        -- a booking can't have negative length
);
```

## Lesson exercise

The web shop already has a `customers` table:

```sql setup
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name        VARCHAR(60) NOT NULL
);
INSERT INTO customers VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy');
```

Create the `orders` table so that it **protects** its data by itself:

- `order_id`: integer, primary key,
- `customer_id`: integer, **required**, references the `customers` table so that **deleting a customer deletes their orders too**,
- `amount`: `NUMERIC(10, 2)`, required, **greater than 0**.

The checker tries it out: it inserts orders for an existing and a non-existent customer, with a negative amount, then deletes a customer and counts the remaining orders.

```sql starter required
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  customer_id INT,
  amount      NUMERIC(10, 2)
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers (customer_id) ON DELETE CASCADE,
  amount      NUMERIC(10, 2) NOT NULL CHECK (amount > 0)
);
```

</details>

```sql test
CREATE FUNCTION try_sql(stmt TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE outcome (test TEXT, result TEXT);
INSERT INTO outcome VALUES
  ('order for Anna',        try_sql($q$INSERT INTO orders VALUES (1, 1, 5000)$q$)),
  ('order for Bela',        try_sql($q$INSERT INTO orders VALUES (2, 2, 1200)$q$)),
  ('non-existent customer', try_sql($q$INSERT INTO orders VALUES (3, 99, 1000)$q$)),
  ('no customer',           try_sql($q$INSERT INTO orders VALUES (4, NULL, 1000)$q$)),
  ('negative amount',       try_sql($q$INSERT INTO orders VALUES (5, 1, -5)$q$)),
  ('delete Anna',           try_sql($q$DELETE FROM customers WHERE customer_id = 1$q$));

SELECT test, result FROM outcome
UNION ALL
SELECT 'remaining orders', COUNT(*)::TEXT FROM orders;
```

## Summary

- Entity (PK), referential (FK), domain (type, NOT NULL, CHECK) and business integrity.
- `ON DELETE`: `RESTRICT` (forbid), `CASCADE` (delete together), `SET NULL` (orphan).
- A rule in the database applies to everyone – the web front end, scripts and manual changes alike.
