---
title: Relational Algebra
summary: The basic operations of relational algebra (selection, projection, Cartesian product, join, union, difference, intersection, rename) and how they map to SQL – with runnable examples.
minutes: 22
---

## What you will learn

- what **relational algebra** is and why it's worth knowing,
- the basic operations: **σ**, **π**, **×**, **⋈**, **∪**, **−**, **∩**, **ρ**,
- which operation corresponds to which **SQL** construct.

## Tables from tables

Relational algebra is the "mathematics" of relational databases: a set of operations that build **tables from tables**. Just as adding or multiplying two numbers gives a number, here two tables give a table. So operations can be **nested**.

Why know it? Because the DBMS thinks this way too: it turns your SQL query into a relational algebra expression, rearranges (optimises) it and executes that. If you understand the algebra, you will understand **query plans** too (topic 7).

The examples run on the familiar university sample database.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Single-table operations

### Selection – σ

Picks **rows** based on a condition. Like a filter in a spreadsheet.

`σ semester = 3 (students)` – the 3rd-semester students.

```sql run
SELECT * FROM students WHERE semester = 3;
```

### Projection – π

Picks **columns**. Since a relation is a set, duplicate rows disappear (in SQL this needs `DISTINCT`!).

`π major (students)` – which majors exist.

```sql run
SELECT DISTINCT major FROM students;
```

Memory aid: **σ = rows** (**s**election → **s**ift rows), **π = columns** (**p**rojection → **p**ick columns).

### Rename – ρ

Gives a new name to a relation or attribute: `ρ pupil (students)`. In SQL this is `AS`.

## Two-table operations

### Cartesian product – ×

Pairs every row with every row. 6 students × 5 courses = 30 rows. Rarely useful on its own (most pairs are meaningless), but it is the basis of joins.

```sql run
SELECT s.name, c.name AS course FROM students s CROSS JOIN courses c;
```

### Join – ⋈

Cartesian product + selection: only the **matching** pairs remain. A **natural join** pairs rows on equal values of the columns with the same name.

`students ⋈ enrollments` – every student with their enrollments.

```sql run
SELECT s.name, e.code, e.grade
FROM students s
JOIN enrollments e ON e.neptun = s.neptun;
```

Topic 8 covers joins in detail.

### Set operations – ∪, −, ∩

Only for tables with the **same structure** (same number and types of columns):

- **Union (∪)**: what is in one **or** the other – SQL: `UNION`
- **Difference (−)**: what is in the first but **not** in the second – SQL: `EXCEPT`
- **Intersection (∩)**: what is in **both** – SQL: `INTERSECT`

Which students haven't taken a single course yet? `π neptun (students) − π neptun (enrollments)`

```sql run
SELECT neptun FROM students
EXCEPT
SELECT neptun FROM enrollments;
```

## Nesting operations

Question: _"In which courses did someone get a 5?"_

```text
π code ( σ grade = 5 ( enrollments ) )
   ▲          ▲            ▲
   │          │            └── 3. from this table
   │          └── 2. only the fives
   └── 1. only the course code (without duplicates)
```

Read it from the inside out! In SQL:

```sql run
SELECT DISTINCT code FROM enrollments WHERE grade = 5;
```

## Summary

| Algebra | Meaning        | SQL                            |
| ------- | -------------- | ------------------------------ |
| σ       | filter rows    | `WHERE`                        |
| π       | pick columns   | `SELECT DISTINCT columns`      |
| ρ       | rename         | `AS`                           |
| ×       | every pair     | `CROSS JOIN`                   |
| ⋈       | matching pairs | `JOIN … ON`                    |
| ∪, −, ∩ | set operations | `UNION`, `EXCEPT`, `INTERSECT` |

## Lesson exercise

The questions refer to the sample database above. Feel free to run the examples and count the rows!

```quiz required
? Which operation picks **rows** based on a condition?
+ selection (σ)
- projection (π)
- union (∪)
- Cartesian product (×)
! σ = rows, π = columns.

? How many rows does `π major (students)` return?
= 2
! computer engineering and business informatics – duplicates disappear.

? How many rows does the Cartesian product `students × courses` have?
= 30
! 6 · 5 = 30.

? How many rows does `π neptun (students) − π neptun (enrollments)` return?
= 1
! Only Emma Varga (EFG567) hasn't enrolled in anything.

? How many rows does `π code (σ grade = 5 (enrollments))` return?
= 3
! ADB, PROG, DIG.

? Which SQL keyword corresponds to difference (−)?
- UNION
+ EXCEPT
- INTERSECT
- JOIN
! EXCEPT: what is in the first but not in the second.
```
