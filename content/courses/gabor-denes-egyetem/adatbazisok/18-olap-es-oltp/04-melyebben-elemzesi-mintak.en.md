---
title: Deeper – Advanced Window Functions and Analysis Patterns
summary: ROW_NUMBER, RANK and DENSE_RANK with ties, the window frame (ROWS versus RANGE) and the default-frame trap, year-over-year comparison, median and percentiles, quartiles with NTILE, and Pareto (ABC) analysis with cumulative share – on a retail chain's star schema.
minutes: 45
---

## What you will learn in this lesson

- the difference between **ROW_NUMBER**, **RANK** and **DENSE_RANK** when there are ties,
- what the **window frame** is, and why `LAST_VALUE` gives a surprising result by default,
- how to compare a period with the same period of the **previous year**,
- how to compute the **median** and **percentiles**,
- how to divide products into **quarters** (quartiles),
- how a **Pareto analysis** is built ("do 20% of products bring 80% of revenue?").

## The sample database: a retail chain's star schema

<details>
<summary>Creating the star schema (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

One fact table (`fact_sales`) and three dimensions (`dim_date`, `dim_product`, `dim_store`), with daily sales for two years (2025–2026).

## 1. Three ranking functions with ties

Imagine a race where two runners tie for second place. What place is the next one?

| Function        | Numbers      | When to use it?                                          |
| --------------- | ------------ | -------------------------------------------------------- |
| `ROW_NUMBER()`  | 1, 2, 3, 4   | a unique number is needed (e.g. paging, removing duplicates) – breaks ties arbitrarily |
| `RANK()`        | 1, 2, 2, 4   | "Olympic" ranking: a place is skipped after a tie        |
| `DENSE_RANK()`  | 1, 2, 2, 3   | "dense" ranking: no gaps (e.g. "the top 3 price levels") |

```sql run
-- Ranking products by price: prices are all different,
-- so let's create ties by rounding the price down to tens of thousands
SELECT name, price,
       FLOOR(price / 10000) * 10000 AS price_band,
       ROW_NUMBER() OVER (ORDER BY FLOOR(price / 10000) DESC) AS row_number,
       RANK()       OVER (ORDER BY FLOOR(price / 10000) DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY FLOOR(price / 10000) DESC) AS dense_rank
FROM dim_product
ORDER BY price_band DESC, name;
```

Look at the 20,000 and 0 price bands: several products fall into the same band. `RANK` then skips a place, `DENSE_RANK` doesn't.

## 2. The window frame – which rows does the function see?

For each row, a window function looks at a **frame**: a subset of the partition's rows. If `OVER (…)` contains `ORDER BY`, the **default frame** is "from the start of the partition **up to the current row** (and its peers with the same sort value)". That's why `SUM(...) OVER (ORDER BY ...)` automatically becomes a **running total**.

| Frame                                               | Meaning                                       |
| --------------------------------------------------- | --------------------------------------------- |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`  | from the start to the current row (running total) |
| `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`          | the previous 2 and the current row (3-element moving average) |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | the whole partition                    |
| `RANGE …`                                           | counts a **value range**, not rows: rows with the same sort value move together |

### The LAST_VALUE trap

```sql run
-- "What was the last monthly revenue of the year?" – the first version is wrong!
WITH monthly AS (
  SELECT d.year, d.month, SUM(f.revenue) AS revenue
  FROM fact_sales f JOIN dim_date d ON d.date_id = f.date_id
  WHERE d.year = 2025
  GROUP BY d.year, d.month
)
SELECT month, revenue,
       LAST_VALUE(revenue) OVER (ORDER BY month) AS wrong_last,
       LAST_VALUE(revenue) OVER (ORDER BY month
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS correct_last
FROM monthly
ORDER BY month;
```

The `wrong_last` column shows each row's **own** monthly revenue – because the default frame ends at the current row, so its "last" element is the current row itself. For the correct version, the frame must be extended **to the end of the partition**. (`FIRST_VALUE` doesn't have this problem, since the frame starts at the beginning of the partition by default.)

## 3. Year-over-year comparison

Business reports' favourite question: _"How much did revenue grow compared to the same month last year?"_ `LAG(column, 12)` gives the value 12 rows (months) earlier – or, more elegantly, we fetch the same month of the previous year with `PARTITION BY month` + `LAG`:

```sql run
WITH monthly AS (
  SELECT d.year, d.month, SUM(f.revenue) AS revenue
  FROM fact_sales f JOIN dim_date d ON d.date_id = f.date_id
  GROUP BY d.year, d.month
)
SELECT year, month, revenue,
       LAG(revenue) OVER (PARTITION BY month ORDER BY year) AS last_year,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (PARTITION BY month ORDER BY year))
             / LAG(revenue) OVER (PARTITION BY month ORDER BY year), 1) AS change_percent
FROM monthly
WHERE month <= 3
ORDER BY month, year;
```

Because of `PARTITION BY month`, every month is a separate "group" with the two years in sequence; `LAG` thus always returns the same month of the previous year. 2025 has no previous year – it shows `NULL`, and that's correct.

## 4. Median and percentiles

The **average** is sensitive to outliers: if one store had a huge sale on a single day, the average jumps. The **median** (the middle element of the sorted values) is more robust.

```sql run
-- Per store: average, median and 90th percentile of daily revenue in 2025
WITH daily AS (
  SELECT f.store_id, f.date_id, SUM(f.revenue) AS revenue
  FROM fact_sales f JOIN dim_date d ON d.date_id = f.date_id
  WHERE d.year = 2025
  GROUP BY f.store_id, f.date_id
)
SELECT s.city,
       ROUND(AVG(dl.revenue)) AS average,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dl.revenue) AS median,
       PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY dl.revenue) AS p90
FROM daily dl JOIN dim_store s ON s.store_id = dl.store_id
GROUP BY s.city
ORDER BY s.city;
```

- `PERCENTILE_CONT(0.5)` – median (interpolates between the two middle values);
- `PERCENTILE_CONT(0.9)` – the value below which 90% of days fall (e.g. "the threshold of the best 10% of days");
- `WITHIN GROUP (ORDER BY …)` says by what we sort to find the middle.

**Analogy:** a single billionaire classmate sends a class's average salary sky-high – but the median barely moves.

## 5. Quartiles with NTILE

`NTILE(4)` divides the sorted rows into **4 equal groups** and tells you which one each row falls into. This makes "top quarter", "bottom quarter" reports easy:

```sql run
WITH product_revenue AS (
  SELECT p.name, SUM(f.revenue) AS revenue
  FROM fact_sales f JOIN dim_product p ON p.product_id = f.product_id
  GROUP BY p.name
)
SELECT name, revenue, NTILE(4) OVER (ORDER BY revenue DESC) AS quarter
FROM product_revenue
ORDER BY revenue DESC;
```

## 6. Pareto (ABC) analysis

According to the **Pareto principle**, a small share of items (e.g. 20%) often produces most of the effect (e.g. 80%). **ABC analysis** classifies products on this basis:

- **A:** products making up the first ~80% of revenue – watch these most closely (stock, price);
- **B:** the next ~15%;
- **C:** the remaining ~5% – many products, little revenue.

Steps: revenue per product → descending order → **cumulative sum** → divided by total revenue.

```sql run
WITH product_revenue AS (
  SELECT p.name, SUM(f.revenue) AS revenue
  FROM fact_sales f JOIN dim_product p ON p.product_id = f.product_id
  GROUP BY p.name
),
cumulative AS (
  SELECT name, revenue,
         100.0 * SUM(revenue) OVER (ORDER BY revenue DESC ROWS UNBOUNDED PRECEDING)
               / SUM(revenue) OVER () AS cum_percent
  FROM product_revenue
)
SELECT name, revenue, ROUND(cum_percent, 1) AS cum_percent,
       CASE WHEN cum_percent <= 80 THEN 'A'
            WHEN cum_percent <= 95 THEN 'B'
            ELSE 'C' END AS class
FROM cumulative
ORDER BY revenue DESC;
```

Two windows appear: `SUM(revenue) OVER (ORDER BY … ROWS UNBOUNDED PRECEDING)` is the running total, `SUM(revenue) OVER ()` (an empty window) is the **grand** total on every row. `ROWS` is needed so that two products with equal revenue don't share the same running total (the default `RANGE` frame would do that).

## Summary

- `ROW_NUMBER` = unique number, `RANK` = skips after a tie, `DENSE_RANK` = doesn't skip.
- A window with `ORDER BY` has a default frame up to the current row → running total; for `LAST_VALUE` the frame must be extended.
- Year over year: `LAG(…) OVER (PARTITION BY month ORDER BY year)`.
- Median and percentile: `PERCENTILE_CONT(p) WITHIN GROUP (ORDER BY …)`; more robust than the average.
- Quartile: `NTILE(4)`.
- Pareto/ABC: running total / grand total (`SUM() OVER ()`), thresholds 80% and 95%.

## Exercise

Build the **2025** monthly revenue report **with a running total**: the columns are `month`, `revenue` (the month's total revenue) and `running_total` (revenue accumulated from the start of the year to the end of that month), sorted by month.

```sql starter required
SELECT d.month, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2025
GROUP BY d.month
ORDER BY d.month;
```

<details>
<summary>Solution</summary>

The window function works on the aggregated value (`SUM(f.revenue)`), which is why `SUM` appears twice:

```sql solution
SELECT d.month,
       SUM(f.revenue) AS revenue,
       SUM(SUM(f.revenue)) OVER (ORDER BY d.month) AS running_total
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2025
GROUP BY d.month
ORDER BY d.month;
```

</details>
