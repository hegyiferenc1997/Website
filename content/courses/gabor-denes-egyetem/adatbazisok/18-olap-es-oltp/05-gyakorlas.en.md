---
title: Practice – OLAP and OLTP
summary: Review questions about the difference between OLTP and OLAP, the star schema and analytical SQL, a design case study, and an extra exercise with a window function: the best product per region.
minutes: 53
kind: practice
---

## Review questions

<details>
<summary>1. Why do OLAP systems often store data by column?</summary>

Because analytical queries read many rows but few columns (e.g. only revenue and date). With columnar storage only those columns have to be read, and values of the same type and similar content compress very well – so much less data has to be moved from disk.

</details>

<details>
<summary>2. Why isn't the star schema normalised, and why is that OK?</summary>

Because in analysis fast, simple queries matter: every dimension is one JOIN away from the fact table. Anomalies caused by duplication (topic 6) are less of a threat here, because we write to a data warehouse rarely, with controlled loading (ETL), not with many small transactions.

</details>

<details>
<summary>3. What does the grain of a fact table mean, and why is it worth choosing the finest?</summary>

It's what one row of the fact table represents (e.g. one item sold, or one store's turnover for a day). From a finer grain you can always aggregate to a coarser level (roll up), but not the other way round – the details can't be restored afterwards.

</details>

<details>
<summary>4. What's the difference between ROLLUP and CUBE for two columns?</summary>

`ROLLUP (a, b)` aggregates along the hierarchy: (a, b), (a) and (). `CUBE (a, b)` produces every combination: (a, b), (a), (b) and () – so the aggregation by b as well.

</details>

<details>
<summary>5. Why does every row stay with window functions, and why is that useful?</summary>

Because a window function doesn't merge rows like `GROUP BY` does, but writes the value computed over a group or ordering next to every row. So one row shows the detail (e.g. a category's revenue) and the comparison too (position, share, running total, previous period).

</details>

## Case study: a gym chain's data warehouse

A gym chain wants to analyse check-ins: how many people train in which gym, at what time of day, with which type of pass.

```quiz required
? What should one row of the fact table be?
+ one check-in (who, when, in which gym, with which pass)
- the data of one gym
- the description of one pass type
- one month's total data for all gyms
! The finest grain: one event.

? Which dimension table contains the gym's city and region?
- the fact table
+ the gym dimension
- the date dimension
! The dimension of the "where" question.

? The analyst wants to see quarterly figures from the monthly check-in counts. Which OLAP operation is this?
+ roll up
- drill down
- slice
! It aggregates to a coarser level.

? A gym moves to another region. Last year's reports must show the old region. How do you handle it?
- simply overwrite the region in the gym dimension
+ a type 2 slowly changing dimension: a new row with the new region and a validity period
- delete the gym's check-ins from last year
! That way the past belongs to the old row, the future to the new one.

? Which SQL construct gives, in a single query, the total per gym, per pass type and the grand total (without the breakdown by gym and pass type)?
- GROUP BY gym, pass_type
+ GROUP BY GROUPING SETS ((gym), (pass_type), ())
- GROUP BY ROLLUP (gym, pass_type)
! Exactly the listed groupings.
```

## Extra exercise: the best category per region

<details>
<summary>Creating the retail chain's data warehouse (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

For **each region**, give the **one** category that brought in the **most revenue**, together with the revenue. Columns: region, category, revenue; sorted by region. This exercise is optional.

Hint: rank the categories per region in a CTE (`RANK() OVER (PARTITION BY …)`), and outside keep only the first-placed ones.

```sql starter
SELECT s.region, p.category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.region, p.category
ORDER BY s.region, revenue DESC;
```

<details>
<summary>Solution</summary>

```sql solution
WITH ranking AS (
  SELECT s.region, p.category, SUM(f.revenue) AS revenue,
         RANK() OVER (PARTITION BY s.region ORDER BY SUM(f.revenue) DESC) AS position
  FROM fact_sales f
  JOIN dim_product p ON p.product_id = f.product_id
  JOIN dim_store s ON s.store_id = f.store_id
  GROUP BY s.region, p.category
)
SELECT region, category, revenue
FROM ranking
WHERE position = 1
ORDER BY region;
```

</details>

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The exercises run on the retail chain's star schema above (`fact_sales` + `dim_date`, `dim_product`, `dim_store`).

**1.** **Slicing along two dimensions.** What was the revenue in **2025** **per region and per quarter**? (Region, quarter, revenue; by region, then quarter.)

```sql starter
SELECT f.revenue
FROM fact_sales f;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.region, d.quarter, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d  ON d.date_id = f.date_id
JOIN dim_store s ON s.store_id = f.store_id
WHERE d.year = 2025                       -- slicing: we filter one dimension to one value
GROUP BY s.region, d.quarter
ORDER BY s.region, d.quarter;
```

</details>

**2.** **Subtotal and grand total (ROLLUP).** Total revenue per category, **plus a summary row** at the end. `GROUP BY ROLLUP (category)` gives this in one step; in the summary row the category is `NULL` – replace it with `'total'`! (Category, revenue; categories alphabetically, the total at the end.)

```sql starter
SELECT p.category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
GROUP BY p.category;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT COALESCE(p.category, 'total') AS category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
GROUP BY ROLLUP (p.category)
ORDER BY p.category NULLS LAST;           -- the summary (NULL) row goes to the end
```

</details>

**3.** **A report (pivot) with FILTER.** Per city, the **2025 and 2026** revenue **side by side, in two columns**, plus the change in percent (1 decimal). Sorted by city.

```sql starter
SELECT s.city, d.year, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d  ON d.date_id = f.date_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.city, d.year;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.city,
       SUM(f.revenue) FILTER (WHERE d.year = 2025) AS revenue_2025,
       SUM(f.revenue) FILTER (WHERE d.year = 2026) AS revenue_2026,
       ROUND(100.0 * (SUM(f.revenue) FILTER (WHERE d.year = 2026) - SUM(f.revenue) FILTER (WHERE d.year = 2025))
             / SUM(f.revenue) FILTER (WHERE d.year = 2025), 1) AS change_percent
FROM fact_sales f
JOIN dim_date d  ON d.date_id = f.date_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.city
ORDER BY s.city;
```

</details>

**4.** **Monthly change with LAG.** For every month of **2025**, give the revenue, the **previous month's** revenue and the difference! (Month, revenue, previous month, difference; by month.) January has no previous month: `NULL` is correct there.

```sql starter
SELECT d.month, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2025
GROUP BY d.month
ORDER BY d.month;
```

<details>
<summary>Solution</summary>

```sql solution
WITH monthly AS (
  SELECT d.month, SUM(f.revenue) AS revenue
  FROM fact_sales f
  JOIN dim_date d ON d.date_id = f.date_id
  WHERE d.year = 2025
  GROUP BY d.month
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS previous_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS difference
FROM monthly
ORDER BY month;
```

</details>

**5.** **Share of the whole.** Per store (city), what is the **total** revenue, and what **percentage** of the whole chain's revenue is it (1 decimal)? `SUM(...) OVER ()` puts the grand total on every row. By share descending.

```sql starter
SELECT s.city, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.city;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.city, SUM(f.revenue) AS revenue,
       ROUND(100.0 * SUM(f.revenue) / SUM(SUM(f.revenue)) OVER (), 1) AS share
FROM fact_sales f
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.city
ORDER BY share DESC, s.city;
```

</details>
