---
title: Deeper – An Index Strategy for a Real Workload
summary: Calculating selectivity, rules for column order in a composite index (equality first, range last), covering indexes and index-only scans, indexes for sorting and LIMIT, indexing foreign keys, "search-friendly" conditions, and the write overhead in numbers – tried out with EXPLAIN.
minutes: 40
---

## What you will learn in this lesson

- how to estimate with numbers whether an index is **worth it** (selectivity),
- in which **order** to put columns into a composite index,
- what a **covering index** is, and why it can make a query even faster,
- how an index helps with **sorting** and "latest 10" style queries,
- why you (usually) have to index **foreign keys** by hand,
- how to write a **search-friendly** condition that can use the index,
- what an index costs on **writes**.

## The web shop sample database

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. Selectivity: is the index worth it?

**Selectivity** tells you what **fraction** of the rows a condition returns.

- `customer_id = 42` → about 4 rows out of 20,000 orders → selectivity ≈ 4 / 20,000 = **0.02%** – very selective, the index helps a lot.
- `status = 'done'` → 60% of orders → **60%** – hardly selective, the index does **not** help here: the DBMS would read most of the rows anyway, and jumping around at that.

**Analogy:** if you look up "photosynthesis" in a book, the index is great. If you look up "and", the index is pointless: it's on almost every page, so it's faster to leaf through the book.

**Rule of thumb:** if a condition returns more than roughly **5–10%** of the table, the optimiser will likely choose a full table scan even if there is an index. Let's see for ourselves:

```sql run
-- How many rows does each condition return? (raw data for selectivity)
SELECT status, COUNT(*) AS cnt,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS percent
FROM orders
GROUP BY status
ORDER BY cnt DESC;
```

```sql run
-- Index on status: the optimiser still doesn't use it for the common value
CREATE INDEX idx_orders_status ON orders (status);
ANALYZE orders;
EXPLAIN SELECT * FROM orders WHERE status = 'done';
```

The plan is probably a `Seq Scan` – from its **statistics** the optimiser knows that `'done'` is common. For the rare `'cancelled'` value, however, using the index may be worthwhile.

## 2. Composite index: column order matters

A composite index is like a **phone book**: sorted by last name, then by first name. You can't search it by first name alone, but you can by last name (**leftmost prefix rule**).

With several conditions, the rule is:

1. columns filtered by **equality** go first (`customer_id = 42`),
2. columns filtered by a **range** (`order_date >= …`, `BETWEEN`) or used for sorting go last.

Why? In the order of the index `(customer_id, order_date)`, customer 42's orders form **one contiguous section**, sorted by date – the DBMS jumps to its beginning and reads while the date is within range. In the reverse index `(order_date, customer_id)`, customer 42's rows are scattered throughout the date range.

```sql run
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
EXPLAIN SELECT * FROM orders
WHERE customer_id = 42 AND order_date >= DATE '2024-06-01';
```

## 3. Covering index and index-only scan

A normal index lookup has **two steps**: (1) find the row in the index, (2) "jump" to the table for the other columns. But if **every needed column is in the index**, the second step is skipped: that's an **index-only scan**.

**Analogy:** the book's index contains not only the page number but the definition too – no need to turn to the page.

```sql run
-- Only customer_id and order_date are needed: both are in the index
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
ANALYZE orders;
EXPLAIN SELECT customer_id, order_date FROM orders WHERE customer_id = 42;
```

In PostgreSQL the `INCLUDE` keyword lets you add a column to the index that you **don't** search by but want to read:

```sql
CREATE INDEX idx_orders_customer_incl ON orders (customer_id) INCLUDE (status);
```

The price: a bigger index and slower writes. Only worth it for **very frequent** queries.

## 4. An index for sorting: "the latest 10"

An index is **sorted**, so the DBMS can execute an `ORDER BY … LIMIT` query by simply reading 10 rows from the start (or end) of the index – without sorting.

```sql run
-- Without an index: all 20,000 rows must be sorted to get the 10 latest
EXPLAIN SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;
```

```sql run
-- With an index on the date: the DBMS reads the index backwards and stops after 10 rows
CREATE INDEX idx_orders_date ON orders (order_date);
EXPLAIN SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;
```

Notice in the second plan that the `Sort` operation disappears and you get a `Limit` + `Index Scan Backward` pair.

## 5. Indexing foreign keys

PostgreSQL automatically creates an index for the **primary key** and **UNIQUE** constraints, but **not for foreign keys**! Yet we often search on a foreign key column, for two reasons:

1. **In JOINs:** `orders.customer_id = customers.customer_id` – every "orders of one customer" query uses it.
2. **On delete:** when you delete a customer, the DBMS must check that no order refers to it – without an index, that's a full table scan on every delete!

**Rule of thumb:** put an index on every foreign key column (or make it the first column of a composite index), unless you're sure you'll never search on it.

## 6. Search-friendly (index-compatible) conditions

An index is sorted by the column's **original values**. If you apply a **function** to the column in `WHERE`, the index becomes unusable – the DBMS has to compute the function for every row.

| Not search-friendly ✘                           | Search-friendly ✔                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| `WHERE EXTRACT(YEAR FROM order_date) = 2024`    | `WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'`        |
| `WHERE price * 1.27 > 10000`                    | `WHERE price > 10000 / 1.27`                                            |
| `WHERE LOWER(email) = 'a@b.com'`                | expression index: `CREATE INDEX … ON customers (LOWER(email))`          |
| `WHERE name LIKE '%anna'` (start unknown)       | `WHERE name LIKE 'Anna%'` (start known)                                 |

```sql run
CREATE INDEX idx_orders_date ON orders (order_date);
-- ✘ function on the column: the index can't be used
EXPLAIN SELECT COUNT(*) FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2024;
```

```sql run
CREATE INDEX idx_orders_date ON orders (order_date);
-- ✔ the same question as a range: the index can be used
EXPLAIN SELECT COUNT(*) FROM orders
WHERE order_date >= DATE '2024-01-01' AND order_date < DATE '2025-01-01';
```

(If 2024 orders make up most of the table, the optimiser may still choose a full scan in the second case – selectivity matters here too. The point is that it **has the option** to use the index.)

## 7. The cost of an index in numbers

Every index is a **separate, sorted data structure** that must be **updated** on every `INSERT`, `UPDATE` (if the indexed column changes) and `DELETE`.

**Numeric example:** a table has 5 indexes. An `INSERT` thus modifies **6** structures (the table and 5 indexes). If 2,000 rows per second arrive in a log table, that's 12,000 write operations per second – 6,000 if 3 unnecessary indexes are dropped. Therefore:

- a **read**-optimised table (product catalogue): several indexes are fine;
- a **write**-optimised table (log, sensor data): only the most necessary indexes.

```sql run
-- How big are the indexes compared to the table?
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
SELECT relname AS name,
       pg_size_pretty(pg_relation_size(oid)) AS size
FROM pg_class
WHERE relname IN ('orders', 'orders_pkey', 'idx_orders_customer_date');
```

## Steps of an index strategy

1. **Collect** the most frequent and slowest queries (the real workload, not an imagined one).
2. For each: which columns are filtered by **equality**, which by **range**, what is **sorted**?
3. Design indexes: equality → range/sort order; always for foreign keys.
4. **Measure** with `EXPLAIN ANALYZE` before and after.
5. Regularly check which index **nobody uses** (in PostgreSQL: `pg_stat_user_indexes`) and drop it.

## Summary

- **Selectivity:** an index is worth most when searching for rare values; it doesn't help for conditions returning a large part of the table.
- **Composite index:** equality first, range / sort last; the leftmost prefix rule applies.
- **Covering index** (`INCLUDE`): index-only scan, no jump to the table.
- An index is **sorted**, so `ORDER BY … LIMIT` speeds up too.
- PostgreSQL does not index **foreign keys** automatically.
- **Search-friendly** condition: don't apply a function to the indexed column.
- Every index **slows down writes** – keep it only for a measured benefit.

## Exercise

The "My orders" page runs this query very often:

```sql
SELECT * FROM orders
WHERE customer_id = ? AND order_date >= ?
ORDER BY order_date DESC;
```

Create a **composite index** on the `orders` table that serves this query as well as possible – think about the column order! The index name is up to you. The check looks for an index on the table with the right column order.

```sql starter required
-- Create the index!
-- CREATE INDEX ... ON orders (...);
```

<details>
<summary>Solution</summary>

`customer_id`, filtered by equality, goes first; `order_date`, filtered by range and sorted, goes last:

```sql solution
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);
```

</details>

```sql test
SELECT COUNT(*) FILTER (WHERE pg_get_indexdef(indexrelid) LIKE '%(customer_id, order_date%') AS matching_index
FROM pg_index
WHERE indrelid = 'orders'::regclass;
```
