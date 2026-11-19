---
title: Practice – Performance Optimisation
summary: Review questions about rewriting queries, materialised views, partitioning, caching and scaling, then writing keyset pagination with ordering by two columns.
minutes: 28
kind: practice
---

## Review questions

<details>
<summary>1. Why isn't the condition <code>WHERE LOWER(email) = 'anna@example.com'</code> index-friendly, and what can you do?</summary>

Because the index is sorted by the raw values of `email`, while the condition searches for a computed value (`LOWER(email)`). Solution: an expression index (`CREATE INDEX … ON customers (LOWER(email))`), or storing email addresses in lower case in the first place.

</details>

<details>
<summary>2. What is the N+1 problem, and how do you notice it?</summary>

1 query for a list, then one more for every item – N+1 round trips in total. You notice it in the query log (lots of almost identical queries differing only in the parameter) or in pg_stat_statements (a simple query runs a huge number of times). Solution: a single JOIN, or the ORM's "eager loading".

</details>

<details>
<summary>3. When is a materialised view better than a plain view?</summary>

When the query is expensive (many JOINs, aggregating many rows), it's read often, and it's acceptable for the result to be refreshed with some delay (e.g. hourly). A plain view is always fresh, but it runs again on every read.

</details>

<details>
<summary>4. Why is deleting old data faster in a partitioned table?</summary>

Because a whole partition can be dropped in a single operation (`DROP TABLE` or `DETACH PARTITION`), instead of deleting row by row, which would cause lots of WAL, dead row versions and VACUUM work.

</details>

<details>
<summary>5. What shouldn't you cache?</summary>

Data that must be exact at every moment, where an old value can cause harm: stock at the moment of payment, account balances, privileges, the state of password reset tokens.

</details>

## The practice exercise: keyset pagination with two columns

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

The customer service screen lists orders by **date descending**, and within the same date by **order ID descending**, 5 rows per page. Since there are many orders on a day, the date alone isn't unique – so for paging **both columns** have to be remembered.

The previous page's last row: date **2026-01-01**, ID **10000**. Write the **next page** with keyset pagination (without `OFFSET`)! Columns: order_id, order_date.

Hint: in PostgreSQL rows can be compared too: `(order_date, order_id) < ('2026-01-01', 10000)` – this means exactly "comes after this in the ordering".

```sql run
-- Row comparison: the first element decides first; if equal, the second.
SELECT (DATE '2026-01-01', 9000) < (DATE '2026-01-01', 10000) AS same_day_smaller_id,
       (DATE '2025-12-31', 99999) < (DATE '2026-01-01', 10000) AS earlier_day;
```

The starter code returns the first page – turn it into the next page.

```sql starter required
SELECT order_id, order_date
FROM orders
ORDER BY order_date DESC, order_id DESC
LIMIT 5;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT order_id, order_date
FROM orders
WHERE (order_date, order_id) < ('2026-01-01', 10000)
ORDER BY order_date DESC, order_id DESC
LIMIT 5;
```

In production this also needs a composite `(order_date, order_id)` index, so the DBMS can jump straight to the right place.

</details>
