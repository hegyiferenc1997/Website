---
title: Data Warehouse and Star Schema
summary: Fact tables and dimension tables, the star schema and the snowflake schema, grain, slowly changing dimensions, and the operations of the OLAP cube (roll up, drill down, slice, dice) – tried out in SQL on a retail chain's data warehouse.
minutes: 30
---

## What you will learn

- what a **fact table** and a **dimension table** are,
- what the **star schema** and the **snowflake schema** look like,
- what **grain** and a **slowly changing dimension** are,
- what the operations of the **OLAP cube** are, and how to write them in SQL.

## Facts and dimensions

A data warehouse has two kinds of tables:

- **Fact table**: the **measurable events**, with numbers – how much we sold, with how much revenue. It has very many rows (every sale is a row), and mostly contains **numbers** and **foreign keys**.
- **Dimension tables**: the **"who, what, where, when"** – the descriptive context of the facts: product, store, date, customer. They have few rows, but many descriptive columns.

Analytical questions almost always sound like this: "show the **measure** (revenue, quantity) broken down **by dimensions** (per category, per region, per quarter)".

## The star schema

The fact table stands in the middle, connected **directly** to every dimension – that's why it looks like a star:

```text
                     ┌──────────────┐
                     │   dim_date   │
                     │ date_id   PK │
                     │ year, quarter│
                     │ month        │
                     └──────┬───────┘
                            │
  ┌──────────────┐   ┌──────┴───────┐   ┌──────────────┐
  │ dim_product  │   │  fact_sales  │   │  dim_store   │
  │ product_id PK├───┤ date_id   FK ├───┤ store_id  PK │
  │ name         │   │ product_id FK│   │ city         │
  │ category     │   │ store_id  FK │   │ region       │
  │ price        │   │ qty, revenue │   └──────────────┘
  └──────────────┘   └──────────────┘
```

Notice: the `dim_date` table contains a row **for every day**, with the year, quarter and month precomputed. That way reports don't need to fiddle with date functions, and it's easy to mark public holidays, weekends and business quarters.

The star schema is **deliberately not normalised**: in `dim_product` the category name repeats for every product. That's no problem here, because we rarely write to a data warehouse but read a lot – and this way every report is at most **one step** of JOINs.

### The snowflake schema

If we normalise the dimensions after all (e.g. the category goes into a separate table, and the region separately from the city), the star's branches branch further – this is the **snowflake schema**. There's less duplication, but more JOINs, and queries are more complicated. In practice the star schema is more widespread.

## Grain

The first question in designing a fact table is the **grain**: **what does one row mean?** One item sold? A whole basket? A store's total turnover for one day? The **finer** the grain, the more questions you can answer (monthly figures can be computed from daily data, not the other way round), but the more rows there are.

## Slowly changing dimensions

What if a store moves to another region, or a product changes category? If we simply overwrite it, **past** sales also count towards the new region – last year's report suddenly shows something else. This is handled by **slowly changing dimensions** (_SCD_):

- **Type 1**: overwrite (history is lost – fine for fixing typos),
- **Type 2**: add a **new row** with the new value and a validity period (`valid_from`, `valid_to`), so past sales belong to the old row and new ones to the new row.

## Let's try it

<details>
<summary>Creating the retail chain's data warehouse (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

```sql run
SELECT f.*, d.full_date, p.name, s.city
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
JOIN dim_product p ON p.product_id = f.product_id
JOIN dim_store s ON s.store_id = f.store_id
ORDER BY f.date_id, f.store_id, f.product_id
LIMIT 8;
```

## The operations of the OLAP cube

Imagine the data as a **cube** whose axes are the dimensions (time, product, store), with the measures (revenue) in the cells. The analyst rotates and cuts this cube:

| Operation      | Meaning                                                         | In SQL                               |
| -------------- | --------------------------------------------------------------- | ------------------------------------ |
| **Roll up**    | aggregates to a coarser level (month → quarter → year)          | fewer columns in `GROUP BY`          |
| **Drill down** | breaks down to a finer level (year → quarter → month)           | more columns in `GROUP BY`           |
| **Slice**      | fixes one value of a dimension ("only 2026")                    | one `WHERE` condition                |
| **Dice**       | narrows in several dimensions ("2026, East and West, monitors") | several `WHERE` conditions           |
| **Pivot**      | swaps rows and columns                                          | `SUM(…) FILTER (WHERE …)` (topic 14) |

Rolling up to years:

```sql run
SELECT d.year, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
GROUP BY d.year
ORDER BY d.year;
```

Drilling down to quarters, and slicing: monitors only:

```sql run
SELECT d.year, d.quarter, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
JOIN dim_product p ON p.product_id = f.product_id
WHERE p.category = 'monitor'
GROUP BY d.year, d.quarter
ORDER BY d.year, d.quarter;
```

## Summary

- Fact table: measurable events (numbers + foreign keys); dimension table: the descriptive "who, what, where, when".
- Star schema: the fact table connects directly to every dimension; snowflake: normalised dimensions.
- Grain: what one row means; slowly changing dimensions: preserving history.
- OLAP operations: roll up, drill down, slice, dice, pivot.

## The lesson's exercise

Make a report on the year **2026**: total revenue **per region**, from **largest** to smallest. Columns: region, revenue.

Hint: join the fact table with `dim_date` (to filter on the year) and `dim_store` (for the region).

```sql starter required
SELECT f.store_id, SUM(f.revenue) AS revenue
FROM fact_sales f
GROUP BY f.store_id
ORDER BY f.store_id;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.region, SUM(f.revenue) AS revenue
FROM fact_sales f
JOIN dim_date d ON d.date_id = f.date_id
JOIN dim_store s ON s.store_id = f.store_id
WHERE d.year = 2026
GROUP BY s.region
ORDER BY revenue DESC;
```

</details>
