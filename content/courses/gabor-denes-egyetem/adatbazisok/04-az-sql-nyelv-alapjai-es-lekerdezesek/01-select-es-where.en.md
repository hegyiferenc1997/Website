---
title: SELECT and WHERE – Your First Queries
summary: Choosing columns, aliases, filtering rows with comparisons, AND / OR / NOT, BETWEEN, IN, LIKE and IS NULL.
minutes: 25
---

## What you will learn

- how to fetch data from a table with **SELECT**,
- how to filter rows with a **WHERE** condition,
- the handy filters: **BETWEEN**, **IN**, **LIKE**, **IS NULL**.

## A query is like asking a librarian

Imagine the database is a huge archive and you ask the librarian: _"I'd like the **names** and **majors** of the students, but only those from **Budapest**!"_ SQL is made of exactly such sentences, just with a strict word order:

```sql
SELECT name, major        -- WHAT I want (columns)
FROM students             -- FROM WHERE (table)
WHERE city = 'Budapest';  -- WHICH rows (condition)
```

You don't say **how** to find the data (that is the DBMS's job), only **what** you want. That is why SQL is called a **declarative** language.

## The sample database

The examples and the exercise run on a small university database, right in your browser (on a real PostgreSQL). It has three tables: `students`, `courses` and `enrollments` (who took which course and what grade they got).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Feel free to experiment: every run starts on a fresh copy, so you cannot break anything.

## Choosing columns

```sql run
SELECT * FROM students;
```

The `*` means **every column**. It is handy for exploring, but in real programs list the columns you actually use. You can give columns an **alias** with `AS`, and you can calculate with them too:

```sql run
SELECT name AS student, semester, semester * 30 AS approx_credits_earned
FROM students;
```

## Filtering rows: WHERE

`WHERE` is followed by a **condition**; only the rows for which it is true remain.

| Operator              | Meaning               | Example                              |
| --------------------- | --------------------- | ------------------------------------ |
| `=`, `<>` (or `!=`)   | equal, not equal      | `major = 'computer engineering'`     |
| `<`, `<=`, `>`, `>=`  | less, greater         | `semester >= 3`                      |
| `AND`, `OR`, `NOT`    | and, or, not          | `semester = 3 AND city = 'Budapest'` |

Note: **text** goes in single quotes (`'Budapest'`), numbers don't.

```sql run
SELECT name, major, semester
FROM students
WHERE major = 'computer engineering' AND semester >= 3;
```

If a condition has both `AND` and `OR`, `AND` binds tighter (like multiplication before addition). When in doubt, use **parentheses**: `WHERE (city = 'Budapest' OR city = 'Szeged') AND semester = 3`.

## Handy filters

- **BETWEEN a AND b** – between the two bounds (inclusive): `semester BETWEEN 1 AND 3`
- **IN (…)** – any of the listed values: `city IN ('Budapest', 'Gyor')`
- **LIKE** – pattern matching on text: `%` = any number of characters, `_` = exactly one character. `name LIKE 'K%'` = starts with K.
- **IS NULL / IS NOT NULL** – checking for a missing value.

```sql run
SELECT name, city FROM students WHERE city IN ('Budapest', 'Gyor');
```

```sql run
SELECT name FROM students WHERE name LIKE '%a%';
```

### The NULL trap

`NULL` is not zero and not an empty string; it means **"we don't know"**. So `city = NULL` is never true (not even when the city is missing) – you can't say an unknown value equals something. Always use `IS NULL` instead:

```sql run
SELECT name, city FROM students WHERE city IS NULL;
```

Try it: change the query above to `WHERE city = NULL` (Edit button) and see that you get no rows at all!

## Summary

- `SELECT columns FROM table WHERE condition;` – what, from where, which rows.
- `AS` = alias; `*` means every column.
- Filters: comparisons, `AND`/`OR`/`NOT`, `BETWEEN`, `IN`, `LIKE` (`%`, `_`), `IS NULL`.
- `NULL` means "unknown": you can only find it with `IS NULL`.

## Lesson exercise

List the **name** and **city** of the students who study **computer engineering** and are in **semester 1–3** (the order doesn't matter this time)!

```sql starter required
SELECT name, city
FROM students
WHERE ...;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, city
FROM students
WHERE major = 'computer engineering' AND semester BETWEEN 1 AND 3;
```

</details>
