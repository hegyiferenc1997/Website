---
title: ROLLUP, CUBE and Window Functions
summary: Analytical SQL: subtotals and a grand total in one query (ROLLUP), aggregating every combination (CUBE, GROUPING SETS), the GROUPING function, and window functions for reports: ranking, running totals, share and change from the previous period.
minutes: 30
---

## What you will learn

- how to get **subtotals and a grand total** with a single query (`ROLLUP`),
- what `CUBE` and `GROUPING SETS` are for,
- how to build a **ranking**, a **running total** and a **percentage share** with window functions.

<details>
<summary>Creating the retail chain's data warehouse (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

## Subtotals: ROLLUP

A classic report: revenue **per category and per year**, with a **subtotal** per category and a **grand total** at the end – like in a spreadsheet pivot table. With a plain `GROUP BY` this would need three queries glued together with `UNION ALL`. `ROLLUP` does it in one go:

```sql run
SELECT p.category, d.year, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY ROLLUP (p.category, d.year)
ORDER BY p.category, d.year;
```

`ROLLUP (a, b)` produces these groupings:

```text
 (category, year)  → rows by category and year
 (category)        → subtotal per category   (the year column is NULL)
 ()                → grand total             (both are NULL)
```

In the subtotal rows the "missing" column is `NULL`. To make this more readable, the `GROUPING()` function tells you whether a `NULL` is real data or marks an aggregate row (1 = aggregate):

```sql run
SELECT CASE WHEN GROUPING(p.category) = 1 THEN 'GRAND TOTAL' ELSE p.category END AS category,
       CASE WHEN GROUPING(d.year) = 1 THEN 'total' ELSE d.year::TEXT END AS year,
       SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY ROLLUP (p.category, d.year)
ORDER BY GROUPING(p.category), p.category, GROUPING(d.year), d.year;
```

## CUBE and GROUPING SETS

- `CUBE (a, b)`: **every** combination: (a, b), (a), (b) and (). That way you get totals per region and per category at once.
- `GROUPING SETS ((a), (b), ())`: exactly the groupings you list.

```sql run
SELECT s.region, p.category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY GROUPING SETS ((s.region), (p.category), ())
ORDER BY s.region, p.category;
```

## Window functions in reports

In topic 12 you already saw the moving average and `LAG`. Window functions (`… OVER (…)`) are so useful in analysis because **every row stays**, and a value computed over a group or an ordering is added next to it.

### Ranking

```sql run
SELECT p.name, SUM(f.revenue) AS revenue,
       RANK() OVER (ORDER BY SUM(f.revenue) DESC) AS position
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
GROUP BY p.name
ORDER BY position;
```

On a tie `RANK` skips positions (1, 2, 2, 4), `DENSE_RANK` doesn't (1, 2, 2, 3), and `ROW_NUMBER` always gives a unique number.

### Ranking per group, and share

`PARTITION BY` restarts the calculation per group – so, for example, you get the best category **per region**, and also what percentage of the region's revenue it brings in:

```sql run
SELECT s.region, p.category, SUM(f.revenue) AS revenue,
       RANK() OVER (PARTITION BY s.region ORDER BY SUM(f.revenue) DESC) AS position_in_region,
       ROUND(100.0 * SUM(f.revenue) / SUM(SUM(f.revenue)) OVER (PARTITION BY s.region), 1) AS share_percent
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.region, p.category
ORDER BY s.region, position_in_region;
```

(`SUM(SUM(f.revenue)) OVER (…)` looks odd at first: the inner `SUM` is the `GROUP BY` aggregate, the outer one is the window function that adds these up per region.)

### Running total and change

```sql run
SELECT d.year, d.month, SUM(f.revenue) AS revenue,
       SUM(SUM(f.revenue)) OVER (PARTITION BY d.year ORDER BY d.month) AS running_total_for_year,
       SUM(f.revenue) - LAG(SUM(f.revenue)) OVER (ORDER BY d.year, d.month) AS change_from_previous_month
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2026 AND d.month <= 6
GROUP BY d.year, d.month
ORDER BY d.year, d.month;
```

## Summary

- `ROLLUP (a, b)`: (a, b) + (a) subtotal + () grand total; `CUBE`: every combination; `GROUPING SETS`: the ones listed.
- `GROUPING(column) = 1`: that row is an aggregate row.
- Window functions: `RANK`/`DENSE_RANK`/`ROW_NUMBER`, `PARTITION BY` per group, running totals, shares, `LAG`.

## The lesson's exercise

Make a report with `ROLLUP`: revenue **per region and per category**, with a **subtotal per region** and a **grand total**. Columns: region, category, revenue; sorted **by region, then by category** (the `NULL` values of the aggregate rows go to the end of their group – this is PostgreSQL's default for ascending order).

```sql starter required
SELECT s.region, p.category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY s.region, p.category
ORDER BY s.region, p.category;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.region, p.category, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
GROUP BY ROLLUP (s.region, p.category)
ORDER BY s.region, p.category;
```

</details>
