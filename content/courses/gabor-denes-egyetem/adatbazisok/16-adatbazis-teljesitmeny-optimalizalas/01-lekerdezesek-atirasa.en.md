---
title: Rewriting Queries
summary: Measure first, then optimise: index-friendly (sargable) conditions, fetching only the needed columns, the N+1 query problem, using EXISTS and JOIN properly, and keyset pagination instead of OFFSET – checked with EXPLAIN on the web shop database.
minutes: 30
---

## What you will learn

- why you should **measure first** and only then optimise,
- what an **index-friendly** (_sargable_) condition is,
- what the **N+1 problem** is, and how to avoid it,
- why **keyset pagination** beats `OFFSET`.

## Measure first!

> "Premature optimization is the root of all evil." – Donald Knuth

Don't guess what's slow. `EXPLAIN`, which you met in topic 7 (and `EXPLAIN ANALYZE`, which actually runs the query and measures the time), shows what the DBMS really does. In production, the **pg_stat_statements** extension collects which query takes the most time in total – often not the slowest one, but a moderately slow one that runs a thousand times a minute.

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. Index-friendly (sargable) conditions

A condition is **index-friendly** if the index can "search into" it: the column stands **on its own**, unchanged, on one side of the comparison. If you apply a function or operation to the column, the index can't be used, because it's sorted by the raw values.

| Not index-friendly                              | Index-friendly rewrite                                            |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| `WHERE EXTRACT(YEAR FROM order_date) = 2025`    | `WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'`  |
| `WHERE price * 1.27 > 10000`                    | `WHERE price > 10000 / 1.27`                                      |
| `WHERE LOWER(email) = 'a@b.com'`                | an expression index: `CREATE INDEX … ON customers (LOWER(email))` |
| `WHERE name LIKE '%mouse'`                      | (unknown start: a B-tree doesn't help; full-text search is needed) |
| `WHERE customer_id + 0 = 42`                    | `WHERE customer_id = 42`                                          |

See the difference! Let's put an index on the date and compare the two plans:

```sql run
CREATE INDEX orders_date_idx ON orders (order_date);
EXPLAIN SELECT * FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2025 AND EXTRACT(MONTH FROM order_date) = 6;
```

```sql run
CREATE INDEX orders_date_idx ON orders (order_date);
EXPLAIN SELECT * FROM orders WHERE order_date >= '2025-06-01' AND order_date < '2025-07-01';
```

The first is a `Seq Scan` (it looks through all 20,000 rows), the second uses the index (`Bitmap Index Scan`).

## 2. Ask only for what you need

`SELECT *` is convenient, but:

- it moves unnecessarily much data over the network (think of a long description or a JSON column),
- it prevents the DBMS from answering from the index alone (_index-only scan_),
- if a new column is added to the table later, the program unexpectedly gets more.

The same for rows: if you only need the first 20, use `LIMIT`; if only the count, `COUNT(*)` – don't download everything just to count it in the program.

## 3. The N+1 problem

A programmer lists the latest 100 orders, with the customer's name next to each:

```text
orders = query("SELECT * FROM orders ORDER BY order_date DESC LIMIT 100")        -- 1 query
for o in orders:
    customer = query("SELECT name FROM customers WHERE customer_id = $1", o.customer_id)  -- +100 queries
```

That's **101** queries! Each is a round trip over the network (maybe 1 ms), plus processing. This is the **N+1 problem** – often caused unnoticed by the "lazy loading" of ORMs (topic 17). The solution: a **single** query with a JOIN.

```sql run
SELECT o.order_id, o.order_date, c.name
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
ORDER BY o.order_date DESC, o.order_id DESC
LIMIT 10;
```

## 4. EXISTS for "is there any?" questions

"Which customers have a cancelled order?" If you write it with a JOIN, a customer appears as many times as they have cancelled orders, and you have to filter with `DISTINCT` afterwards. `EXISTS` stops at the first match – it's the natural form of an "is there any?" question:

```sql run
SELECT COUNT(*) AS customers_with_cancelled_order
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.customer_id AND o.status = 'cancelled');
```

## 5. Keyset pagination instead of OFFSET

Classic pagination: `ORDER BY order_id LIMIT 20 OFFSET 10000`. The problem: because of `OFFSET 10000`, the DBMS **has to produce and throw away** 10,000 rows – the further back you page, the slower it gets.

**Keyset pagination** remembers where you were and continues from there – the index jumps straight to it:

```sql run
-- The previous page's last row was order 10000; the next page:
SELECT order_id, order_date, status
FROM orders
WHERE order_id > 10000
ORDER BY order_id
LIMIT 5;
```

```sql run
EXPLAIN SELECT order_id, order_date FROM orders ORDER BY order_id LIMIT 5 OFFSET 15000;
```

```sql run
EXPLAIN SELECT order_id, order_date FROM orders WHERE order_id > 15000 ORDER BY order_id LIMIT 5;
```

Compare the estimated cost of the two plans (the second number of `cost=…`): the `OFFSET` one is much more expensive.

## Summary

- Measure first (`EXPLAIN`, `EXPLAIN ANALYZE`, pg_stat_statements).
- Index-friendly condition: the column should appear unchanged in the comparison.
- Ask only for the columns and rows you need.
- One JOIN instead of N+1; `EXISTS` for "is there any?".
- Keyset pagination: `WHERE key > last ORDER BY key LIMIT n`.

## The lesson's exercise

The starter code creates an index on the `order_date` column, and a **view** called `march_orders` for the orders of March 2025 – but the view's condition is **not index-friendly**, so the DBMS can't use the index. Rewrite the view's condition so that it returns **the same rows**, but the index can be used.

The checker counts the view's rows, and uses `EXPLAIN` to see whether the plan uses the index.

```sql starter required
CREATE INDEX orders_date_idx ON orders (order_date);

CREATE VIEW march_orders AS
  SELECT * FROM orders
  WHERE EXTRACT(YEAR FROM order_date) = 2025 AND EXTRACT(MONTH FROM order_date) = 3;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX orders_date_idx ON orders (order_date);

CREATE VIEW march_orders AS
  SELECT * FROM orders
  WHERE order_date >= '2025-03-01' AND order_date < '2025-04-01';
```

</details>

```sql test
-- Helper function: returns a query's execution plan as text.
CREATE FUNCTION query_plan(query TEXT) RETURNS TEXT AS $$
DECLARE
  line TEXT;
  result TEXT := '';
BEGIN
  FOR line IN EXECUTE 'EXPLAIN ' || query LOOP
    result := result || line || E'\n';
  END LOOP;
  RETURN result;
END $$ LANGUAGE plpgsql;

SELECT (SELECT COUNT(*) FROM march_orders) AS row_count,
       query_plan('SELECT * FROM march_orders') LIKE '%Index%' AS uses_index;
```
