---
title: Sorting, Duplicates and Paging
summary: ORDER BY (ascending, descending, several keys, where NULLs go), DISTINCT, LIMIT and OFFSET, calculated columns, text functions, COALESCE and CASE.
minutes: 25
---

## What you will learn

- how to **sort** results by one or more keys,
- how to remove **duplicates**,
- how to ask for **just a few rows** (paging),
- how to **calculate** and shape text inside a query (`COALESCE`, `CASE`).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Sorting: ORDER BY

Remember: in a relation the order of rows is **not defined**. If you want sorted results, ask for them! `ORDER BY` always goes at the **end** of the query.

```sql run
SELECT name, semester FROM students ORDER BY semester DESC, name;
```

- `ASC` = ascending (the default, no need to write it), `DESC` = descending.
- **Several keys**: first by `semester` descending, and among students in the same semester by name. Like a phone book: surname, then first name.
- In PostgreSQL `NULL`s go to the **end** in ascending order; `NULLS FIRST` / `NULLS LAST` changes this.

```sql run
SELECT name, city FROM students ORDER BY city NULLS FIRST;
```

## Removing duplicates: DISTINCT

```sql run
SELECT DISTINCT city FROM students ORDER BY city;
```

`DISTINCT` applies to the **whole row**: `SELECT DISTINCT major, semester` gives the (major, semester) pairs that occur at least once.

## Just a few rows: LIMIT and OFFSET

A web shop's product list doesn't load all 100,000 products at once, but 20 **per page**. That's what these are for:

- `LIMIT n` – at most n rows,
- `OFFSET k` – skips the first k rows.

```sql run
-- The two oldest students (whose date of birth is known)
SELECT name, born FROM students
WHERE born IS NOT NULL
ORDER BY born
LIMIT 2;
```

Page 3 with 20 per page: `LIMIT 20 OFFSET 40`. Important: `LIMIT` only makes sense together with `ORDER BY`, otherwise you get "random" rows.

## Calculated columns and functions

After `SELECT` you can write not only columns but any **expression**:

| Expression                           | Result                                    |
| ------------------------------------ | ----------------------------------------- |
| `credits * 30`                       | multiplication (+, −, \*, /, % exist too) |
| `name \|\| ' (' \|\| major \|\| ')'` | concatenating text                        |
| `UPPER(name)`, `LOWER(name)`         | upper / lower case                        |
| `LENGTH(name)`                       | length of text                            |
| `EXTRACT(YEAR FROM born)`            | the year of a date                        |
| `ROUND(x, 2)`                        | rounding to 2 decimals                    |

Careful: dividing two integers in PostgreSQL gives an **integer** (`7 / 2 = 3`)! For a decimal result at least one must be decimal: `7 / 2.0 = 3.5`.

```sql run
SELECT UPPER(name) AS shouting, credits * 30 AS work_hours, name || ' – semester ' || semester AS label
FROM courses;
```

### A default instead of a missing value: COALESCE

`COALESCE(a, b, …)` returns the first **non-NULL** value:

```sql run
SELECT name, COALESCE(city, 'unknown') AS city FROM students;
```

### Conditional value: CASE

`CASE` is like `if – else if – else` in programming:

```sql run
SELECT name, semester,
  CASE
    WHEN semester <= 2 THEN 'beginner'
    WHEN semester <= 4 THEN 'intermediate'
    ELSE 'almost graduating'
  END AS level
FROM students
ORDER BY semester;
```

## Summary

- `ORDER BY column [ASC|DESC], …` – always at the end; several keys from left to right.
- `DISTINCT` – without duplicate rows; `LIMIT` / `OFFSET` – paging (always with sorting).
- Expressions: arithmetic, `||`, `UPPER`, `LENGTH`, `ROUND`, `COALESCE`, `CASE`.

## Lesson exercise

List the **name** and **semester** of the **computer engineering** students: highest semester first, and within the same semester alphabetically by name!

```sql starter required
SELECT name, semester
FROM students
WHERE major = 'computer engineering';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, semester
FROM students
WHERE major = 'computer engineering'
ORDER BY semester DESC, name;
```

</details>
