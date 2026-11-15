---
title: Reports with SQL
summary: How a business question becomes a reliable report: clarifying the question, filtering and joining, the double-counting trap, a cross-tab with FILTER, a monthly trend with LAG and a running total, and share of total with a window function.
minutes: 30
---

## What you will learn in this lesson

- how to **clarify** a vague business question before writing SQL,
- how to avoid the most common reporting mistake, **double counting**,
- how to build a **cross-tab**, a **monthly trend** and a **percentage share**.

The examples run on the **web shop** sample database (familiar from topics 4 and 16).

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. First the question, then the SQL

The manager asks: "How much did we sell in the first quarter per category?" Before writing a single line, settle these:

| Question                      | Decision                                                           |
| ----------------------------- | ------------------------------------------------------------------ |
| What counts as a sale?        | only **done** orders (cancelled ones don't, shipping ones not yet) |
| Which period?                 | 1 January – 31 March 2026, with an interval **open at the end**    |
| What do we measure?           | revenue = quantity × unit price, plus the number of orders         |
| What is one row of the report? | one **category** (this is the report's "grain")                   |

These four decisions give you the `WHERE`, the `SELECT` and the `GROUP BY`. If you skip them, two colleagues will give two different numbers for the same question – and both will be "right".

**Date tip:** `order_date >= '2026-01-01' AND order_date < '2026-04-01'`. This way you don't need to know how many days the month has, and with timestamps the afternoon of 31 March isn't lost either.

## 2. The double-counting trap

When you join orders with their items, **every order shows up in as many rows as it has items**. `COUNT(*)` then counts items, not orders:

```sql run
SELECT COUNT(*) AS row_count, COUNT(DISTINCT o.order_id) AS order_count
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.order_date = DATE '2026-03-02';
```

There were 30 orders that day, but 60 rows after the JOIN. The fix: `COUNT(DISTINCT order_id)`, or first aggregate the items per order (in a CTE) and join only afterwards. **Rule:** when you join a "1"-side table with an "N"-side table, don't simply sum the "1"-side data.

## 3. Cross-tab: columns from categories

A frequent request: statuses as **columns**, months as **rows**. That's what `FILTER` (or the older `SUM(CASE WHEN … THEN 1 ELSE 0 END)`) is for:

```sql run
SELECT to_char(order_date, 'YYYY-MM') AS month,
       COUNT(*) FILTER (WHERE status = 'done')      AS done,
       COUNT(*) FILTER (WHERE status = 'shipping')  AS shipping,
       COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders
WHERE order_date >= DATE '2026-01-01' AND order_date < DATE '2026-04-01'
GROUP BY month
ORDER BY month;
```

## 4. Trend: change and running total

Half of all reports are time series. In a CTE we compute monthly revenue, then use window functions (topic 18) for the change and the running total:

```sql run
WITH monthly AS (
  SELECT to_char(o.order_date, 'YYYY-MM') AS month, SUM(i.qty * i.unit_price) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'done'
    AND o.order_date >= DATE '2026-01-01' AND o.order_date < DATE '2026-07-01'
  GROUP BY month
)
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       SUM(revenue) OVER (ORDER BY month)           AS running_total
FROM monthly
ORDER BY month;
```

- `LAG(revenue)` is the value of the **previous row** – the first month has none, so it's NULL.
- `SUM(...) OVER (ORDER BY month)` is the **running total**: from the start up to the current row.

## 5. Share: a piece of the whole

"What percentage of revenue does this category bring?" For that you need the **grand total** on every row too. A window function gives it without collapsing rows:

```text
SUM(SUM(i.qty * i.unit_price)) OVER ()
 └ inner SUM: the group's (category's) revenue
     └ outer SUM … OVER (): the total of those over the whole result
```

It looks odd but it's logical: after `GROUP BY` the inner sum is one number per row, and the outer one adds them up over the empty window (`OVER ()` = all rows).

## 6. What makes a good report

- **Clear definitions:** at the bottom of the report or in a query comment you state what counts as a sale.
- **Round at the end:** compute at full precision and round only for display (`ROUND(..., 1)`).
- **Ordering:** the most important first (usually by value, descending).
- **Sanity check:** do the subtotals add up to the total? Do the shares sum to 100%?

## Lesson exercise

Build the report the manager asked for: **done** orders of **Q1 2026** (1 January – 31 March) **per category**. Columns:

1. `category`,
2. `orders`: in how many **distinct** orders the category appeared,
3. `revenue`: the sum of quantity × unit price,
4. `share`: the category's revenue as a percentage of the total quarterly revenue, rounded to **1 decimal**.

Order: by revenue, descending.

The starter code already joins the tables, but it counts every order and every period, and two columns are missing.

```sql starter required
SELECT p.category,
       COUNT(*) AS orders,
       SUM(i.qty * i.unit_price) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p    ON p.product_id = i.product_id
GROUP BY p.category
ORDER BY revenue DESC;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT p.category,
       COUNT(DISTINCT o.order_id) AS orders,
       SUM(i.qty * i.unit_price) AS revenue,
       ROUND(100 * SUM(i.qty * i.unit_price) / SUM(SUM(i.qty * i.unit_price)) OVER (), 1) AS share
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p    ON p.product_id = i.product_id
WHERE o.status = 'done'
  AND o.order_date >= DATE '2026-01-01' AND o.order_date < DATE '2026-04-01'
GROUP BY p.category
ORDER BY revenue DESC;
```

According to the result, monitors bring more than a third of the revenue even though they appear in the fewest orders (tied with network gear) – expensive products. A good report: one glance reveals something you can't see in the raw data.

</details>
