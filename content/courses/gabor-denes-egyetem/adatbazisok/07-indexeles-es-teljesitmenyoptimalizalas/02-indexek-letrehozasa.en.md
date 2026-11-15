---
title: Creating Indexes
summary: CREATE INDEX, unique, composite (and the leftmost prefix rule), partial and expression indexes, when an index doesn't help, and how to decide where an index is needed – tried on a web shop with 20,000 orders.
minutes: 28
---

## What you will learn

- how to create an **index** (`CREATE INDEX`),
- its kinds: **unique**, **composite**, **partial**, **expression**,
- when the DBMS **can't** use an index,
- how to decide **where** an index is needed.

## The web shop sample database

In this topic we work with a larger, made-up web shop: **5000 customers**, **20 products**, **20,000 orders** and **40,000 order items**. The data is produced by the `generate_series` function, so it's always the same.

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
SELECT * FROM orders ORDER BY order_id LIMIT 5;
```

## The first index

On the "My orders" page a customer views their own orders: `WHERE customer_id = 42`. Let's see how the DBMS executes this – `EXPLAIN` shows the **query plan** (the next lesson covers it in detail):

```sql run
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
```

`Seq Scan` – a full table scan, examining all 20,000 rows for four hits. Now create an index and look again:

```sql run
CREATE INDEX idx_orders_customer ON orders (customer_id);
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
```

`Bitmap Index Scan on idx_orders_customer` – the DBMS now searches the index and reads only the four relevant rows. The index name is free to choose; the convention is `idx_table_column`.

## Kinds of indexes

### Unique index

`CREATE UNIQUE INDEX idx_customers_email ON customers (email);` – speeds things up **and** forbids duplicates. A `UNIQUE` constraint achieves the same (it creates a unique index behind the scenes).

### Composite (multi-column) index

`CREATE INDEX idx_orders_status_date ON orders (status, order_date);`

A composite index is like a phone book: sorted by **surname, then first name**. This gives the **leftmost prefix rule**:

- `WHERE status = 'done' AND order_date >= '2026-01-01'` → **usable** (both columns),
- `WHERE status = 'done'` → **usable** (the first column – like searching by surname only),
- `WHERE order_date >= '2026-01-01'` → **not** (or only poorly) usable – a phone book doesn't help with first names!

So the **order of columns matters**: put first the one you filter by equality and that appears in every query.

### Partial index

Indexes only part of the rows: `CREATE INDEX idx_shipping ON orders (order_date) WHERE status = 'shipping';` Smaller and faster when queries always target the same subset (e.g. unfulfilled orders).

### Expression index

If the search is on an **expression**, the index must be on it too:

```sql
-- For case-insensitive email search:
CREATE INDEX idx_customers_email_lower ON customers (LOWER(email));
SELECT * FROM customers WHERE LOWER(email) = 'customer42@example.com';
```

## When an index doesn't help

1. **A function on the column**: `WHERE EXTRACT(YEAR FROM order_date) = 2026` – the `order_date` index can't be used, because we search a computed value, not `order_date`. Rewrite it as a **range**: `WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`. (Such index-friendly conditions are called _sargable_.)
2. **The middle of the text instead of the start**: `LIKE '%mouse'` – a B-tree is sorted by the **start** of the text, so only `LIKE 'mouse%'` can be sped up.
3. **Poor selectivity**: if the condition returns most rows (`WHERE status = 'done'` – 60% of orders!), reading everything is faster than jumping around in the index. The DBMS decides this by itself.
4. **A small table**: for 20 rows a full scan beats using an index.

## Where to add indexes? – a simple method

1. Collect the **most frequent** and the **slowest** queries.
2. Look at which columns they filter (`WHERE`), join (`JOIN … ON`) and sort (`ORDER BY`) on.
3. **Foreign keys** almost always need an index.
4. Measure with `EXPLAIN ANALYZE` before and after.
5. Drop unused indexes (`DROP INDEX`) – they only slow down writes.

## Summary

- `CREATE [UNIQUE] INDEX name ON table (columns);`
- Composite index: leftmost prefix rule, column order matters.
- Partial (`WHERE …`) and expression (`LOWER(email)`) indexes.
- Doesn't help: function on the column, `LIKE '%…'`, poor selectivity, small table.

## Lesson exercise

Two frequent operations in the web shop are slow:

1. the "My orders" page: `SELECT * FROM orders WHERE customer_id = …`,
2. registration, which must check that the email address is **not taken yet** – and this must be guaranteed at database level too.

Create an **index** on `orders.customer_id` and a **unique index** (or `UNIQUE` constraint) on `customers.email`! The checker verifies it from the system catalog (`pg_indexes`).

```sql starter required
-- 1. index on orders.customer_id

-- 2. unique index on customers.email
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE UNIQUE INDEX idx_customers_email ON customers (email);
```

</details>

```sql test
SELECT
  (SELECT COUNT(*) FROM pg_indexes
    WHERE tablename = 'orders' AND indexdef LIKE '%(customer_id)') AS customer_index,
  (SELECT COUNT(*) FROM pg_indexes
    WHERE tablename = 'customers' AND indexdef LIKE 'CREATE UNIQUE%(email)') AS unique_email;
```
