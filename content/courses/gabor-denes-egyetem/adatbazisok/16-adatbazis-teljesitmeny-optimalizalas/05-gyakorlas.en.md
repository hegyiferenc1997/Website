---
title: Practice – Performance Optimisation
summary: Review questions about rewriting queries, materialised views, partitioning, caching and scaling, then writing keyset pagination with ordering by two columns.
minutes: 53
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The exercises run on the webshop database above. For each one it's worth looking with `EXPLAIN ANALYZE` too at how long it takes and what plan it gets.

**1.** **A top list in one step.** Which **5 products** brought the most revenue (sum of `qty * unit_price`) from **non-cancelled** orders? (Product name, revenue; by revenue descending.)

```sql starter
SELECT product_id, qty, unit_price
FROM order_items;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT p.name, SUM(oi.qty * oi.unit_price) AS revenue
FROM order_items oi
JOIN orders o   ON o.order_id = oi.order_id
JOIN products p ON p.product_id = oi.product_id
WHERE o.status <> 'cancelled'
GROUP BY p.product_id, p.name
ORDER BY revenue DESC
LIMIT 5;
```

</details>

**2.** **Keyset paging.** `OFFSET 10000` reads through 10,000 rows every time. It's faster to continue from the **last key** of the previous page. Query the 5 orders **after** ID 10,000 (ID, date), by ID!

```sql starter
SELECT order_id, order_date
FROM orders
ORDER BY order_id
OFFSET 10000 LIMIT 5;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT order_id, order_date
FROM orders
WHERE order_id > 10000             -- finds the starting point immediately from the key's index
ORDER BY order_id
LIMIT 5;
```

</details>

**3.** **EXISTS instead of COUNT.** "Is there a customer from Pecs who placed a **cancelled** order?" You don't need to count them all for this: `EXISTS` stops at the **first match**. Give a true/false answer!

```sql starter
SELECT COUNT(*)
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE c.city = 'Pecs' AND o.status = 'cancelled';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT EXISTS (
  SELECT 1
  FROM orders o
  JOIN customers c ON c.customer_id = o.customer_id
  WHERE c.city = 'Pecs' AND o.status = 'cancelled'
) AS exists_one;
```

</details>

**4.** **Pre-aggregated data.** The management report asks for monthly revenue a hundred times a day. Create a `monthly_revenue` **materialised view** (month, revenue) from non-cancelled orders, then query the 3 best months from it (by revenue descending)!

```sql starter
SELECT date_trunc('month', o.order_date) AS month, SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status <> 'cancelled'
GROUP BY month;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT date_trunc('month', o.order_date) AS month, SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status <> 'cancelled'
GROUP BY month;                    -- the result is stored; refresh: REFRESH MATERIALIZED VIEW

SELECT * FROM monthly_revenue ORDER BY revenue DESC LIMIT 3;
```

</details>

**5.** **Index-friendly date filtering.** `WHERE EXTRACT(MONTH FROM order_date) = 3 AND EXTRACT(YEAR FROM order_date) = 2025` can't use an index, because there's a function on the column. Rewrite it as a **range** (`order_date >= … AND order_date < …`), and count the orders of March 2025!

```sql starter
SELECT COUNT(*)
FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2025 AND EXTRACT(MONTH FROM order_date) = 3;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT COUNT(*)
FROM orders
WHERE order_date >= DATE '2025-03-01' AND order_date < DATE '2025-04-01';   -- the column is "bare" → indexable
```

</details>
