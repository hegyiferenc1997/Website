---
title: Deeper – Think in SQL
summary: The logical evaluation order of a query, three-valued logic (true, false, unknown), conditional values with CASE, NULL handling with COALESCE and NULLIF, string and date functions, and conditional aggregation – with lots of runnable examples.
minutes: 35
---

## What you will learn in this lesson

- in which **order** the DBMS evaluates the parts of a query (and why not in the order you write them),
- **three-valued logic**: when a condition becomes "unknown", and what happens then,
- how to produce **condition-dependent** values with the `CASE` expression,
- how to handle missing values with `COALESCE` and `NULLIF`,
- the most useful **string** and **date functions**,
- how to count **conditionally** in a single query (`COUNT(*) FILTER`, `SUM(CASE …)`).

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. Writing order versus evaluation order

We write SQL like this: `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT`. But the DBMS processes it **logically** in a different order:

```text
  1. FROM / JOIN   – which tables, joined how?
  2. WHERE         – which ROWS remain?
  3. GROUP BY      – how do we group?
  4. HAVING        – which GROUPS remain?
  5. SELECT        – which columns do we compute? (aliases are born here)
  6. DISTINCT      – removing duplicates
  7. ORDER BY      – sorting
  8. LIMIT/OFFSET  – paging
```

**Analogy – doing laundry:** first you collect the dirty clothes (FROM), pick what can go in the machine (WHERE), sort by colour (GROUP BY), discard empty piles (HAVING), wash and fold (SELECT), arrange them in the wardrobe (ORDER BY), and take the top three (LIMIT).

This explains many "mysterious" errors:

- you **can't** use an alias defined in `SELECT` inside `WHERE` (it doesn't exist yet);
- you **can't** use an aggregate function (`COUNT`, `AVG`) in `WHERE` – groups haven't been formed yet; that's what `HAVING` is for;
- in `ORDER BY` you **can** already use the alias.

```sql run
-- ORDER BY already sees the alias (it comes after step 5)
SELECT name, semester * 30 AS credits_approx
FROM students
ORDER BY credits_approx DESC;
```

## 2. Three-valued logic: true, false, unknown

If a comparison involves `NULL`, the result is neither true nor false but **unknown** (`UNKNOWN`, in SQL `NULL`). Logical operators behave like this:

| A       | B       | A AND B   | A OR B   | NOT A   |
| ------- | ------- | --------- | -------- | ------- |
| true    | unknown | unknown   | **true** | false   |
| false   | unknown | **false** | unknown  | true    |
| unknown | unknown | unknown   | unknown  | unknown |

It makes sense if you think it through: "false AND anything" is always false, so the unknown doesn't matter; "true OR anything" is always true.

**The key point:** `WHERE` keeps only rows where the condition is **true** – unknowns drop out.

```sql run
-- Feri Kovacs's city is NULL: he appears in neither group!
SELECT name, city, 'from Budapest' AS grp FROM students WHERE city = 'Budapest'
UNION ALL
SELECT name, city, 'not from Budapest' FROM students WHERE city <> 'Budapest';
```

Count them: there are 6 students, but only 5 rows come back. The missing Feri Kovacs has an unknown city, so neither `=` nor `<>` is true for him.

### The NOT IN trap

```sql run
-- Who is NOT from the listed cities? If the list contains NULL: NOBODY!
SELECT name FROM students
WHERE city NOT IN ('Budapest', NULL);
```

Why empty? `city NOT IN ('Budapest', NULL)` means `city <> 'Budapest' AND city <> NULL`. The second term is always unknown, so the whole thing can never be true. This bug is most insidious with subqueries (`NOT IN (SELECT …)`) – there `NOT EXISTS` is the safe choice.

## 3. CASE – "if… then…" in a query

The `CASE` expression is like a programming language's `if–elif–else`: it returns the value of the first true branch.

```sql run
SELECT name, semester,
       CASE
         WHEN semester <= 2 THEN 'beginner'
         WHEN semester <= 4 THEN 'intermediate'
         ELSE 'nearly graduating'
       END AS year_group
FROM students;
```

If you compare a single value to several options, there is a shorter form:

```sql run
SELECT code,
       CASE code WHEN 'ADB' THEN 'databases' WHEN 'PROG' THEN 'programming' ELSE 'other' END AS area
FROM courses;
```

Important details:

- branches are checked **in order**, the first true one wins – so put narrower conditions first;
- if there is no `ELSE` and no branch is true, the result is `NULL`;
- `CASE` can appear anywhere a value can: in `SELECT`, in `ORDER BY`, even inside an aggregate function.

```sql run
-- Custom sort: computer engineering students first, then the rest, each by name
SELECT name, major FROM students
ORDER BY CASE WHEN major = 'computer engineering' THEN 0 ELSE 1 END, name;
```

## 4. NULL handling: COALESCE and NULLIF

- `COALESCE(a, b, c, …)` – returns the **first non-NULL** value. Typical use: a default for display.
- `NULLIF(a, b)` – returns `NULL` if `a = b`, otherwise `a`. Typical use: avoiding division by zero.

```sql run
SELECT name,
       COALESCE(city, 'unknown') AS city,
       COALESCE(born::TEXT, 'not given') AS born
FROM students;
```

```sql run
-- NULL instead of division by zero: 10 / NULLIF(0, 0) = NULL, not an error
SELECT 10 / NULLIF(0, 0) AS safe_division;
```

## 5. String functions

| Function                    | What it does                | Example → result                           |
| --------------------------- | --------------------------- | ------------------------------------------ |
| `UPPER(s)`, `LOWER(s)`      | upper / lower case          | `UPPER('anna')` → `ANNA`                   |
| `LENGTH(s)`                 | length in characters        | `LENGTH('Béla')` → 4                       |
| `TRIM(s)`                   | trims spaces from both ends | `TRIM('  x ')` → `x`                       |
| `SUBSTRING(s FROM i FOR n)` | substring                   | `SUBSTRING('ABC123' FROM 4 FOR 3)` → `123` |
| `s1 \|\| s2`                | concatenation               | `'Anna' \|\| ' ' \|\| 'Kiss'`              |
| `SPLIT_PART(s, sep, n)`     | n-th piece by separator     | `SPLIT_PART('Anna Kiss', ' ', 2)` → `Kiss` |
| `REPLACE(s, what, with)`    | replace                     | `REPLACE('a-b', '-', '/')` → `a/b`         |

```sql run
SELECT name,
       SPLIT_PART(name, ' ', 1) AS first_name,
       SPLIT_PART(name, ' ', 2) AS last_name,
       UPPER(LEFT(major, 3)) || '-' || neptun AS identifier
FROM students;
```

Case-insensitive search: `WHERE LOWER(name) LIKE '%anna%'` (shorter in PostgreSQL: `name ILIKE '%anna%'`).

## 6. Date functions

```sql run
SELECT name, born,
       EXTRACT(YEAR FROM born) AS year,
       EXTRACT(MONTH FROM born) AS month,
       AGE(DATE '2026-01-01', born) AS age_at_start_of_2026,
       born + INTERVAL '18 years' AS came_of_age
FROM students
WHERE born IS NOT NULL;
```

- `EXTRACT(part FROM date)` – year, month, day, day of week (`DOW`), etc.
- `AGE(a, b)` – the difference of two dates in years, months, days.
- `date + INTERVAL '…'` – adding a duration.
- `CURRENT_DATE` – today (the examples use a fixed date so the result doesn't change).

## 7. Conditional aggregation

A common question: _"How many students enrolled per course, and how many of them got a 4 or 5?"_ – in a single query. Two methods:

```sql run
SELECT code,
       COUNT(*) AS enrolled,
       COUNT(*) FILTER (WHERE grade >= 4) AS good_grades,          -- PostgreSQL / standard
       SUM(CASE WHEN grade >= 4 THEN 1 ELSE 0 END) AS good_grades_2 -- works in every DBMS
FROM enrollments
GROUP BY code
ORDER BY code;
```

`FILTER` is standard and readable; the `SUM(CASE …)` trick works in older systems too. You can build a **cross-tab** (pivot) the same way: one row per course, one column per grade count.

## Summary

- Logical order: **FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT**.
- Comparing with `NULL` is **unknown**; `WHERE` keeps only true rows. `NOT IN` with NULL is dangerous.
- `CASE WHEN … THEN … ELSE … END` – conditional value; the first true branch wins.
- `COALESCE` = first non-NULL; `NULLIF` = NULL if equal.
- Strings: `UPPER`, `TRIM`, `SUBSTRING`, `||`, `SPLIT_PART`; dates: `EXTRACT`, `AGE`, `INTERVAL`.
- Conditional aggregation: `COUNT(*) FILTER (WHERE …)` or `SUM(CASE …)`.

## Exercise

Create a report on enrollments: each row should contain the **student ID** (`neptun`), the **course code** (`code`) and a **text rating** of the grade (`rating`):
5 → `excellent`, 4 → `good`, 3 → `satisfactory`, 2 → `pass`, 1 → `fail`, missing grade (NULL) → `no grade`.
Sort by student ID, then by course code.

```sql starter required
SELECT neptun, code,
       CASE
         WHEN grade = 5 THEN 'excellent'
         -- continue!
       END AS rating
FROM enrollments
ORDER BY neptun, code;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT neptun, code,
       CASE
         WHEN grade = 5 THEN 'excellent'
         WHEN grade = 4 THEN 'good'
         WHEN grade = 3 THEN 'satisfactory'
         WHEN grade = 2 THEN 'pass'
         WHEN grade = 1 THEN 'fail'
         ELSE 'no grade'
       END AS rating
FROM enrollments
ORDER BY neptun, code;
```

</details>
