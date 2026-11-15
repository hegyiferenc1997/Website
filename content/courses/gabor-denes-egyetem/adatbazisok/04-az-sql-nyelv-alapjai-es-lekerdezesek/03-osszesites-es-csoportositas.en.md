---
title: Aggregation and Grouping
summary: Aggregate functions (COUNT, SUM, AVG, MIN, MAX) and how they treat NULL, grouping with GROUP BY, filtering groups with HAVING, and the logical execution order of a query.
minutes: 30
---

## What you will learn

- how to **compute** a single value from many rows (count, sum, average),
- how to build a **per-group** report (`GROUP BY`),
- the difference between `WHERE` and `HAVING`,
- in what **order** the DBMS executes the parts of a query.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Aggregate functions

| Function        | Meaning                                    |
| --------------- | ------------------------------------------ |
| `COUNT(*)`      | how many rows there are                    |
| `COUNT(column)` | how many **non-NULL** values the column has |
| `SUM(column)`   | sum                                        |
| `AVG(column)`   | average                                    |
| `MIN`, `MAX`    | smallest, largest value                    |

```sql run
SELECT COUNT(*) AS enrollments, COUNT(grade) AS graded, ROUND(AVG(grade), 2) AS average, MIN(grade), MAX(grade)
FROM enrollments;
```

See the difference? There are 12 enrollments, but only 10 have a grade: `COUNT(grade)`, `AVG` and the other functions **skip NULLs**. So the average is the average of the 10 existing grades; we don't divide by 12.

## Grouping: GROUP BY

Imagine sorting the enrollment forms into **piles** by course, then counting each pile separately. That's exactly what `GROUP BY` does:

```text
 enrollments                      GROUP BY code
 ABC123 ADB 5      ┐
 CDE345 ADB 4      │  ADB  → COUNT = 4, AVG = 4.00
 DEF456 ADB 3      │
 FGH678 ADB NULL   ┘
 ABC123 DIG 4      ┐  DIG  → COUNT = 2, AVG = 4.50
 DEF456 DIG 5      ┘
 …
```

```sql run
SELECT code, COUNT(*) AS headcount, ROUND(AVG(grade), 2) AS average
FROM enrollments
GROUP BY code
ORDER BY code;
```

**The golden rule:** with `GROUP BY`, the `SELECT` may contain only two things:

1. columns you **group by** (here `code`),
2. **aggregate functions** (here `COUNT`, `AVG`).

Why? Because each group becomes a single row. If you also asked for `neptun`, which of the four students should it show? So PostgreSQL gives an error – try it!

## Filtering groups: HAVING

`WHERE` filters **rows before** grouping, `HAVING` filters **groups after** grouping. So you can only filter on an aggregate function in `HAVING`.

```sql run
-- Courses with at least 3 enrollments
SELECT code, COUNT(*) AS headcount
FROM enrollments
GROUP BY code
HAVING COUNT(*) >= 3;
```

```sql run
-- Counting only graded enrollments, the best grade per course
SELECT code, MAX(grade) AS best
FROM enrollments
WHERE grade IS NOT NULL
GROUP BY code
ORDER BY best DESC, code;
```

## The logical execution order

We start writing SQL with `SELECT`, but the DBMS (logically) processes it in this order:

```text
 1. FROM       – from where (which table, joins)
 2. WHERE      – filter rows
 3. GROUP BY   – sort into piles
 4. HAVING     – filter piles
 5. SELECT     – what to output (aliases are born here!)
 6. ORDER BY   – sort
 7. LIMIT      – the first few rows
```

A lot follows from this: you **can't** use an alias given in `SELECT` inside `WHERE` (it doesn't exist yet), but you can in `ORDER BY`.

## Summary

- `COUNT(*)` counts every row; the other functions skip NULL.
- `GROUP BY` builds piles; `SELECT` may only contain grouping columns and aggregate functions.
- `WHERE` filters rows before grouping, `HAVING` filters groups after.
- Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.

## Lesson exercise

Build a report of enrollments **per course code**: the `code`, the **number** of enrollments (`headcount`) and the **average** grade **rounded to two decimals** (`average`). Only courses with **at least 2** enrollments are needed. Sort by headcount **descending**, ties by code!

```sql starter required
SELECT code, COUNT(*) AS headcount
FROM enrollments;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, COUNT(*) AS headcount, ROUND(AVG(grade), 2) AS average
FROM enrollments
GROUP BY code
HAVING COUNT(*) >= 2
ORDER BY headcount DESC, code;
```

</details>
