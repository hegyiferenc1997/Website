---
title: Schema, Materialised Views and Partitioning
summary: Schema-level performance tools: the right data types, deliberate denormalisation (precomputed totals), materialised views and refreshing them, and partitioning large tables – tried out on the web shop database.
minutes: 28
---

## What you will learn

- how **data types** affect performance,
- when **deliberate denormalisation** pays off,
- what a **materialised view** is, and how it's refreshed,
- what **partitioning** is good for.

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## The right data types

Smaller data takes up fewer pages (topic 9), so fewer disk operations and more fits into the buffer.

- Store numbers **as numbers**, not as text (`INT` is 4 bytes, the text `'123456789'` is 10 bytes – and it sorts wrongly as text too).
- Store dates as `DATE` or `TIMESTAMP`, not as text.
- Store money as `NUMERIC` (exact), not as `REAL`/`FLOAT` (rounding errors!).
- Joined columns should have the same type (joining an `INT` with a `BIGINT` or a text may cause conversion and a slower plan).

## Deliberate denormalisation

Normalisation (topic 6) eliminates duplication – but sometimes that means a query has to join many tables and sum many rows. If such a value is **needed very often** and **changes rarely**, it pays to store it precomputed:

- the order's **total** in the `orders` table (otherwise the items would have to be added up for every listing),
- a post's **number of likes** (otherwise the likes would always have to be counted).

The price: the stored value **has to be kept in sync** (e.g. with a trigger or in the application), otherwise contradictions arise. So it should always be a deliberate, documented decision!

## Materialised views

A plain **view** (topic 10) is just a saved query: it **runs again** every time it's used. A **materialised view**, by contrast, **actually stores** the result, like a table – so querying it is lightning fast, however complicated computing it was.

```sql run
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT date_trunc('month', o.order_date)::DATE AS month,
       SUM(i.qty * i.unit_price) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'done'
GROUP BY month;

SELECT * FROM monthly_revenue ORDER BY month LIMIT 6;
```

The difference shows in the plan: querying the materialised view is a simple table scan, with no JOIN or aggregation.

```sql run
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT date_trunc('month', o.order_date)::DATE AS month, SUM(i.qty * i.unit_price) AS revenue
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'done'
GROUP BY month;

EXPLAIN SELECT * FROM monthly_revenue;
```

### Refreshing

The price: a materialised view **doesn't update itself**. When a new order arrives, the view shows old data until you refresh it:

```sql
REFRESH MATERIALIZED VIEW monthly_revenue;
-- or so that readers don't wait meanwhile (needs a unique index):
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;
```

So it's good for data where some delay is acceptable: daily reports, dashboards, statistics – refreshed e.g. hourly or at night.

| Aspect           | View                       | Materialised view          | Denormalised column                |
| ---------------- | -------------------------- | -------------------------- | ---------------------------------- |
| Stores the data? | no                         | yes                        | yes                                |
| Always fresh?    | yes                        | no, it has to be refreshed | if you keep it in sync properly    |
| Reading          | as slow as the query       | fast                       | fast                               |
| Typical use      | simplification, privileges | reports, dashboards        | frequently needed totals, counters |

## Partitioning

Handling a table with hundreds of millions of rows (e.g. years of orders, logs, measurements) is cumbersome. **Partitioning** shows the table as **one logically**, but physically splits it into **smaller pieces** (partitions), for example by year or month.

```sql run
CREATE TABLE event_log (
  logged_on DATE NOT NULL,
  message   TEXT
) PARTITION BY RANGE (logged_on);

CREATE TABLE event_log_2025 PARTITION OF event_log FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE event_log_2026 PARTITION OF event_log FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

INSERT INTO event_log VALUES ('2025-05-10', 'old event'), ('2026-03-02', 'new event');

EXPLAIN SELECT * FROM event_log WHERE logged_on >= '2026-01-01';
```

Only the `event_log_2026` partition appears in the plan: based on the condition, the DBMS **skipped** the partitions that weren't affected (_partition pruning_).

Advantages:

- queries only read the partition they need,
- deleting old data is lightning fast: dropping a whole partition (`DROP TABLE event_log_2025`) instead of a row-by-row `DELETE` – this is the basis of retention rules (topic 12),
- maintenance (VACUUM, index builds) can happen per partition, in smaller pieces.

For a small table it makes no sense – partitioning is a tool for **very large** tables that grow over time.

## Summary

- Suitable, small data types; matching types on joined columns.
- Deliberate denormalisation: a precomputed value, but it has to be kept in sync.
- Materialised view: a stored result, fast reads, updated with `REFRESH`.
- Partitioning: one logical table, several physical pieces; partition pruning, fast deletion.

## The lesson's exercise

The management dashboard shows **revenue per category**. The starter code computes it with a plain view – which joins and sums the 40,000 items on every load. Turn it into a **materialised view**: `category_revenue` should be a materialised view giving, per category, the total value (`qty * unit_price`) of the items of **done** orders. Columns: category, revenue.

The checker verifies both the view's content and its type (whether it's materialised).

```sql starter required
CREATE VIEW category_revenue AS
SELECT p.category, SUM(i.qty * i.unit_price) AS revenue
FROM order_items i
JOIN products p ON p.product_id = i.product_id
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'done'
GROUP BY p.category;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE MATERIALIZED VIEW category_revenue AS
SELECT p.category, SUM(i.qty * i.unit_price) AS revenue
FROM order_items i
JOIN products p ON p.product_id = i.product_id
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'done'
GROUP BY p.category;
```

</details>

```sql test
-- relkind: 'm' = materialised view, 'v' = plain view, 'r' = table
SELECT c.category, c.revenue,
       (SELECT relkind::TEXT FROM pg_class WHERE relname = 'category_revenue') AS kind
FROM category_revenue c
ORDER BY c.category;
```
