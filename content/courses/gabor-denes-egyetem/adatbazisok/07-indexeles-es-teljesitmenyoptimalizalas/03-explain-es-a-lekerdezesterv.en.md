---
title: EXPLAIN and the Query Plan
summary: How the query optimiser decides, what Seq Scan, Index Scan and Bitmap Scan mean, how to read cost and estimated rows, what EXPLAIN ANALYZE is, the role of statistics and the join algorithms.
minutes: 25
---

## What you will learn

- how the DBMS **decides** how to execute a query,
- how to **read** a query plan (`EXPLAIN`),
- what `EXPLAIN ANALYZE` shows,
- why **statistics** matter.

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## The optimiser – a GPS

In SQL you say **what** you want, not how. The "how" is worked out by the **query optimiser**, like a GPS: it calculates several possible routes (execution plans), estimates the **cost** of each, and picks the cheapest. It uses **statistics** for this: how many rows a table has, how many distinct values a column has, how frequent they are.

## EXPLAIN – what does the DBMS plan?

```sql run
EXPLAIN SELECT * FROM orders WHERE order_id = 1234;
```

Read the line like this: `Index Scan using orders_pkey on orders (cost=0.29..8.30 rows=1 width=20)`

- **Index Scan using orders_pkey** – uses the primary key's index,
- **cost=0.29..8.30** – estimated cost (in arbitrary units): this much until the first row, this much for all. Only good for **comparison** (which plan is cheaper), not milliseconds!
- **rows=1** – the number of rows expected,
- **width=20** – the average row size in bytes.

## The most common operations

| Operation            | What it does                                                      | When it's good                   |
| -------------------- | ----------------------------------------------------------------- | -------------------------------- |
| **Seq Scan**         | reads through the whole table                                     | small table, or most rows needed |
| **Index Scan**       | searches the index, then fetches rows from the table one by one   | few matches                      |
| **Index Only Scan**  | all needed data is in the index; the table isn't touched          | the fastest                      |
| **Bitmap Heap Scan** | collects match locations from the index, then reads in page order | a moderate number of matches     |
| **Sort**             | sorts (when there's no index for it)                              | `ORDER BY`, `GROUP BY`           |
| **HashAggregate**    | groups using a hash table                                         | `GROUP BY`                       |

```sql run
EXPLAIN SELECT status, COUNT(*) FROM orders GROUP BY status;
```

## Joins in the plan

There are three main algorithms for joining two tables:

- **Nested Loop**: for every row of the outer table it looks up the matching row in the inner table (fast with an index). Good for few rows.
- **Hash Join**: builds an in-memory hash table from the smaller table, then reads the larger one and looks up each row. Good for large, unindexed tables.
- **Merge Join**: sorts both tables by the join column, then merges them "like a zip".

```sql run
EXPLAIN SELECT c.name, o.order_date
FROM orders o JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_id < 100;
```

Read the plan **from the inside out** (from the most indented line upwards): the innermost operations run first and their results "flow" upwards.

## EXPLAIN ANALYZE – what really happened?

`EXPLAIN` only **plans**; `EXPLAIN ANALYZE` also **runs** the query and adds the real time and row counts next to the estimates:

```sql run
EXPLAIN ANALYZE SELECT * FROM orders WHERE order_date = '2026-03-15';
```

Watch `actual time` and `actual rows`, and compare them with the estimated `rows`. If estimate and reality **differ greatly** (e.g. 10 expected, 100,000 arrive), the optimiser may have chosen a bad plan – often the statistics are out of date.

Careful: `EXPLAIN ANALYZE` really executes the statement – with a `DELETE` it actually deletes! (Inside a transaction with `ROLLBACK` it's safe.)

## Statistics: ANALYZE

The DBMS regularly samples tables (in PostgreSQL the `ANALYZE` command and the automatic _autovacuum_ do this). After a big data load it's worth running it manually: `ANALYZE orders;`

## Try it: before and after an index

```sql run
EXPLAIN ANALYZE SELECT COUNT(*) FROM orders WHERE customer_id = 42;
CREATE INDEX idx_orders_customer ON orders (customer_id);
EXPLAIN ANALYZE SELECT COUNT(*) FROM orders WHERE customer_id = 42;
```

Compare the two `Execution Time` values and the operations!

## Summary

- The optimiser picks a plan by cost estimation, using statistics.
- `EXPLAIN` = plan; `EXPLAIN ANALYZE` = plan + real run (careful, it executes!).
- Seq Scan, Index Scan, Index Only Scan, Bitmap Scan; joins: Nested Loop, Hash Join, Merge Join.
- A big gap between estimated and actual rows → `ANALYZE`.

## Lesson exercise

```quiz required
? What does `Seq Scan` mean in a query plan?
+ a full table scan
- using an index
- sorting
- a join
! Sequential scan: reads through the table in order.

? What is the difference between `EXPLAIN` and `EXPLAIN ANALYZE`?
- there is none
+ ANALYZE also runs the query and shows real times
- ANALYZE only shows indexes
- ANALYZE deletes the statistics
! So be careful with a DELETE!

? Which is the fastest read, where the DBMS doesn't even touch the table because all data is in the index? (three words)
= Index Only Scan
! Index Only Scan.

? The plan estimated `rows=10`, but 150,000 rows actually came back. What is the most likely cause?
- too many indexes
+ outdated statistics
- an SQL syntax error
- too little memory
! Run ANALYZE.

? Which join algorithm builds an in-memory lookup table from the smaller table?
- Nested Loop
+ Hash Join
- Merge Join
! Hash table → Hash Join.
```
