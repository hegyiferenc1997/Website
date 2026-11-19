---
title: Deeper – A Tuning Case Study from Slow Report to Fast Page
summary: Which query to tackle first (frequency × duration), then diagnosing and fixing four typical slow queries with EXPLAIN ANALYZE – a correlated subquery in SELECT, OR across columns, a full COUNT(*) for paging, and an unnecessary DISTINCT – and finally a checklist of tuning steps.
minutes: 45
---

## What you will learn in this lesson

- how to decide **which** query is worth speeding up first,
- how to **recognise** four common slow patterns in a query plan,
- how to **fix** each – and **measure** that it really got faster,
- a **repeatable workflow** you can apply to any system.

## The web shop sample database

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 0. Where do I start? – frequency × duration

A web shop operator complains that "the site is slow". From the log (in PostgreSQL the `pg_stat_statements` extension collects it) we see:

| Query               | One run | Runs per day | Total per day |
| ------------------- | ------- | ------------ | ------------- |
| A) monthly report   | 40 s    | 1            | 40 s          |
| B) product page     | 30 ms   | 200,000      | **6,000 s**   |
| C) "My orders" page | 120 ms  | 20,000       | 2,400 s       |
| D) search           | 800 ms  | 2,000        | 1,600 s       |

The slowest (A) looks like the main villain, but it takes only 40 seconds a day. Query **B** is fast individually, but because it runs so often it makes up the largest part of the total load: speeding it up from 30 ms to 10 ms saves **4,000 seconds** a day – a hundred times more than bringing A down to zero.

**Lesson:** start not with the slowest query, but with the one taking the **most total time**. (For user experience, of course, the 800 ms search D is annoying too – that's the second criterion.)

**Analogy:** in a household, the bulk of the electricity bill comes not from the rarely used but power-hungry oven, but from the fridge running day and night.

## Case 1 – a correlated subquery in SELECT

**Task:** per city, the number of customers and the number of orders they placed.

```sql run
-- ✘ A separate subquery runs for each customer!
EXPLAIN (COSTS OFF)
SELECT c.city,
       COUNT(*) AS customers,
       SUM((SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id)) AS orders
FROM customers c
GROUP BY c.city;
```

In the plan, the `SubPlan` runs for every customer (5,000 times!), and since there's no index on `orders.customer_id`, each one is a full table scan. **Fix:** a single join and grouping.

```sql run
-- ✔ First count orders per customer (once), then join
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT c.city, COUNT(*) AS customers, SUM(COALESCE(o.cnt, 0)) AS orders
FROM customers c
LEFT JOIN (SELECT customer_id, COUNT(*) AS cnt FROM orders GROUP BY customer_id) o
       ON o.customer_id = c.customer_id
GROUP BY c.city;
```

We only look at the first version with `EXPLAIN` (actually running it would mean 5,000 full table scans – try it patiently by adding the word `ANALYZE` if you're curious). The second reads orders once and pairs them with a hash join. (An index on `orders.customer_id` would also speed up the first version a lot – but the right structure is fast even without an index.)

## Case 2 – OR across two different columns

**Task:** the search box receives a number; it may be an order number **or** a customer ID.

```sql run
CREATE INDEX idx_orders_customer ON orders (customer_id);
-- ✘ OR across two different columns: older systems often switch to a full scan here
EXPLAIN (COSTS OFF)
SELECT * FROM orders WHERE order_id = 4242 OR customer_id = 4242;
```

PostgreSQL is clever: it merges the results of two indexes with a `BitmapOr` operation. Many other systems (and PostgreSQL too, with more complex conditions) give up and read everything. The safe, system-independent rewrite is **UNION**:

```sql run
CREATE INDEX idx_orders_customer ON orders (customer_id);
-- ✔ Two simple, indexable queries, union of the results
EXPLAIN (COSTS OFF)
SELECT * FROM orders WHERE order_id = 4242
UNION
SELECT * FROM orders WHERE customer_id = 4242;
```

`UNION` (not `UNION ALL`) is needed so a row matching both conditions doesn't appear twice.

## Case 3 – a full COUNT(*) on every page

At the bottom of the product list it says: "results 1–20 of **20,000**". For the full count PostgreSQL has to **count every row** (because of MVCC it can't know "by heart" how many rows are visible) – on every single page load.

```sql run
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT COUNT(*) FROM orders;
```

Options, from the simplest:

1. **Don't show the exact number.** "More than 1000 results" – for this it's enough to query with `LIMIT 1001` and check whether the 1001st row exists.
2. **An estimate** from the statistics (practically free):

```sql run
-- The optimiser's estimate: very fast, roughly accurate (refreshed by ANALYZE)
SELECT reltuples::BIGINT AS estimated_rows FROM pg_class WHERE relname = 'orders';
```

3. **A counter table** updated by a trigger or a scheduled job – exact, but needs maintenance.

## Case 4 – the unnecessary DISTINCT

**Task:** the customers who have ever ordered a monitor.

```sql run
-- ✘ With JOINs, a row comes for every monitor item, then DISTINCT removes the many duplicates
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT DISTINCT c.customer_id, c.name
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
WHERE p.category = 'monitor';
```

The JOINs first **inflate** the result (a customer appears as many times as they have monitor items), and `DISTINCT` shrinks it back with an expensive sort or hash. In fact we're only asking: **is there** such an order?

```sql run
-- ✔ EXISTS: stops at the first match, no inflation and no DISTINCT
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT c.customer_id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  JOIN products p ON p.product_id = i.product_id
  WHERE o.customer_id = c.customer_id AND p.category = 'monitor');
```

The optimiser executes this as a **semi-join**. **Telltale sign:** if you write a `DISTINCT` only because "duplicates came from somewhere", suspect that a JOIN actually wanted to be an `EXISTS`.

## The tuning workflow – a checklist

1. **Measure and rank:** frequency × duration (`pg_stat_statements`, slow query log).
2. **Look at the plan:** `EXPLAIN (ANALYZE, BUFFERS)`. Look for the most expensive node, a `Seq Scan` on a large table, a `SubPlan`, a large `Sort`, a big gap between estimated and actual row counts.
3. **One change at a time:** an index _or_ a rewrite _or_ a statistics refresh (`ANALYZE`) – otherwise you won't know what helped.
4. **Measure again** with the same data, several times (the first run is slower because of a cold buffer).
5. **Check the result:** does the rewritten query return **the same** thing? (A fast but wrong query is worse than a slow one.)
6. **Document it:** why the index is there, what it fixed.

## Summary

- Rank by **total time** (frequency × duration), not by the length of individual runs.
- A **correlated subquery** in `SELECT` runs per row → a pre-aggregated JOIN.
- **OR across several columns** → a `UNION` of two indexable queries (or BitmapOr).
- A **full `COUNT(*)`** is expensive → don't count exactly, estimate, or keep a counter.
- **JOIN + DISTINCT** is often a disguised "is there?" question → `EXISTS`.
- Always: one change, re-measure, verify the result.

## Exercise

Create a report: **per city**, the number of **non-cancelled** orders (`orders`) and the **revenue** from them (`revenue` = the sum of the items' `qty * unit_price`), sorted by city. Write it as **a single query** with joins and grouping – without a correlated subquery!

Careful: an order has several items, so count orders with `COUNT(DISTINCT …)`, otherwise each order would count as many times as it has items!

```sql starter required
SELECT c.city
FROM customers c
GROUP BY c.city
ORDER BY c.city;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT c.city,
       COUNT(DISTINCT o.order_id) AS orders,
       SUM(i.qty * i.unit_price) AS revenue
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status <> 'cancelled'
GROUP BY c.city
ORDER BY c.city;
```

</details>
