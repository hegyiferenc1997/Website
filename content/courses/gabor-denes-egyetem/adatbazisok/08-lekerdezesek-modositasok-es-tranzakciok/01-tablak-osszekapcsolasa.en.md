---
title: Joining Tables (JOIN)
summary: INNER JOIN, LEFT / RIGHT / FULL OUTER JOIN, CROSS JOIN and self-joins, table aliases, joining several tables, and the COUNT(*) trap with outer joins.
minutes: 30
---

## What you will learn

- how to join tables with **JOIN**,
- the difference between **inner** and **outer** (LEFT, RIGHT, FULL) joins,
- how to join **three** tables, or a table **with itself**.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Why join?

Because of normalisation the data is **split up**: an enrollment holds only the Neptun code and the course code; the student's name is in `students`, the course name in `courses`. For a readable report ("Anna Kiss – Databases – 5") you have to put them back together. That's **JOIN**.

## INNER JOIN – only the pairs

```sql run
SELECT s.name, e.code, e.grade
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
ORDER BY s.name, e.code;
```

- `JOIN` (full name `INNER JOIN`) is followed by the other table, and `ON` by the **matching condition**.
- `s` and `e` are **table aliases**: shorter, and when two tables have a column with the same name (`neptun`), they say which one you mean.
- Only rows that **have a pair** appear. Emma Varga didn't enroll in anything, so Emma is **left out**.

## Three tables

Just keep chaining: each new `JOIN` attaches another table.

```sql run
SELECT s.name AS student, c.name AS course, e.grade
FROM enrollments e
JOIN students s ON s.neptun = e.neptun
JOIN courses c  ON c.code = e.code
ORDER BY student, course;
```

## Outer joins – the unmatched ones too

What if you want to see **everyone**, including those without a pair?

```text
      students            enrollments
   ┌────────────┐       ┌────────────┐
   │  student ┌─┼───────┼─┐ enrollment│
   │   only   │ │ both  │ │   only    │
   │  (Emma)  └─┼───────┼─┘           │
   └────────────┘       └────────────┘
   INNER JOIN = only the shared part
   LEFT JOIN  = every row of the left table + their pairs (or NULL)
   RIGHT JOIN = every row of the right table + their pairs (or NULL)
   FULL JOIN  = every row of both
```

```sql run
SELECT s.name, e.code, e.grade
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
ORDER BY s.name;
```

Emma Varga now appears, with **NULL**s in the enrollment columns. With this trick you can answer "who has **no** …" questions too:

```sql run
-- Who hasn't enrolled in any course?
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
WHERE e.neptun IS NULL;
```

`RIGHT JOIN` is the same the other way round (rarely needed in practice: swap the tables and use LEFT JOIN), and `FULL JOIN` keeps the unmatched rows of both sides.

## The COUNT(*) trap

Let's count how many courses each student took – everyone, including those with zero:

```sql run
SELECT s.name, COUNT(*) AS wrong, COUNT(e.code) AS right_one
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
GROUP BY s.name
ORDER BY s.name;
```

For Emma `COUNT(*)` shows 1, though Emma has no course! The LEFT JOIN gave Emma one row (with NULLs), and `COUNT(*)` counts every row. `COUNT(e.code)` skips the NULL → 0. **With an outer join, count a column of the right-hand table!**

## CROSS JOIN and self-join

- **CROSS JOIN**: every row with every row (Cartesian product). Useful e.g. for filling in an "every student × every course" grid.
- **Self-join**: joining a table with itself, using two different aliases. For example: who lives in the same city?

```sql run
SELECT a.name, b.name, a.city
FROM students a
JOIN students b ON a.city = b.city AND a.neptun < b.neptun;
```

The `a.neptun < b.neptun` condition excludes pairing someone with themselves and listing the same pair twice (A–B and B–A).

## Summary

- `JOIN … ON condition` – only the pairs (INNER).
- `LEFT JOIN` – every row of the left table; unmatched rows get NULL. "Who has no…" → `LEFT JOIN … WHERE right.key IS NULL`.
- With outer joins use `COUNT(right_table.column)`, not `COUNT(*)`.
- Self-join: the same table under two aliases.

## Lesson exercise

List **every** student's **name** (`name`) and **how many courses** they took (`course_count`) – including those who took none (they need 0)! Sort by course count **descending**, ties by name.

```sql starter required
SELECT s.name, COUNT(*) AS course_count
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
GROUP BY s.name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name, COUNT(e.code) AS course_count
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
GROUP BY s.neptun, s.name
ORDER BY course_count DESC, s.name;
```

We also group by the Neptun code because two students could share a name – this way they still won't be merged.

</details>
