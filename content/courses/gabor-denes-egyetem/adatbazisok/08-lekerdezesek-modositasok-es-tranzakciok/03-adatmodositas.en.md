---
title: Modifying Data – INSERT, UPDATE, DELETE
summary: Inserting rows (one, many, from a query), updating and deleting them, the danger of UPDATE / DELETE without WHERE, RETURNING and UPSERT (INSERT … ON CONFLICT).
minutes: 25
---

## What you will learn

- how to **insert**, **update** and **delete** rows,
- why `UPDATE` and `DELETE` without `WHERE` are dangerous,
- how to get the modified rows back (`RETURNING`),
- what an **UPSERT** is (insert, or update if it already exists).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## INSERT – new rows

```sql run
INSERT INTO courses (code, name, credits, semester)
VALUES ('NET', 'Computer Networks', 5, 4);

-- Several rows at once:
INSERT INTO courses (code, name, credits, semester) VALUES
  ('SEC', 'IT Security', 4, 4),
  ('WEB', 'Web Development', 4, 4);

SELECT * FROM courses ORDER BY semester, code;
```

- Always **list the columns** – if a new column is added to the table later, your program won't break.
- Omitted columns get their default (`DEFAULT`) or NULL.
- You can also insert **from a query's result**: `INSERT INTO archive SELECT * FROM enrollments WHERE grade IS NOT NULL;`

## UPDATE – changing existing rows

```sql run
UPDATE students
SET semester = semester + 1, city = 'Budapest'
WHERE neptun = 'BCD234';

SELECT * FROM students WHERE neptun = 'BCD234';
```

## DELETE – deleting rows

```sql run
DELETE FROM enrollments WHERE grade IS NULL;
SELECT COUNT(*) AS remaining FROM enrollments;
```

## ⚠️ The most expensive mistake

```sql
UPDATE students SET semester = 1;   -- EVERY student is now in semester 1!
DELETE FROM enrollments;            -- EVERY enrollment is gone!
```

`UPDATE` and `DELETE` without `WHERE` apply to **every row of the table**. On a live database that's a disaster. Good habits:

1. First write it as a `SELECT` with the same `WHERE` and check which rows it would affect.
2. Work inside a transaction (`BEGIN` … check … `COMMIT` or `ROLLBACK`, see next lesson).
3. Watch the DBMS's response: "UPDATE 1" or "UPDATE 50000"?

## RETURNING – what did I just do?

PostgreSQL can return the modified rows – no separate query needed afterwards:

```sql run
UPDATE courses SET credits = credits + 1
WHERE semester = 1
RETURNING code, name, credits;
```

This is especially handy on insert when the database generates the id (`INSERT … RETURNING id`).

## UPSERT – insert or update

A common task: "If the row doesn't exist yet, insert it; if it does, update it." That's what `ON CONFLICT` is for:

```sql run
INSERT INTO enrollments (neptun, code, grade)
VALUES ('ABC123', 'ADB', 4)
ON CONFLICT (neptun, code) DO UPDATE SET grade = EXCLUDED.grade;

SELECT * FROM enrollments WHERE neptun = 'ABC123';
```

Since Anna had already taken ADB, no new row was created; her grade changed to 4 instead. `EXCLUDED` means the row you tried to insert. The `DO NOTHING` variant simply skips the existing one.

## Modification and integrity

Constraints protect you during modification too: you can't insert an enrollment for a non-existent student, can't give a grade of 6 (`CHECK`), and can't delete a student who has enrollments (default `RESTRICT`). Try it: `DELETE FROM students WHERE neptun = 'ABC123';`

## Summary

- `INSERT INTO t (columns) VALUES (…), (…);` – or `INSERT … SELECT`.
- `UPDATE t SET c = value WHERE …;` and `DELETE FROM t WHERE …;` – **without WHERE they affect every row!**
- `RETURNING` – return the modified rows.
- `INSERT … ON CONFLICT … DO UPDATE / DO NOTHING` – UPSERT.

## Lesson exercise

Make the following changes **in this order**:

1. Delete the enrollments that **don't have a grade yet**.
2. Add the new student: `GHI789`, `Gabor Fekete`, `computer engineering`, semester 1, `Pecs`, born `2007-05-05`.
3. Enroll him in `PROG` (no grade yet).
4. Change the credits of Operating Systems (`OPR`) to **5**.

At the end the checker counts the students and enrollments and looks at OPR's credits.

```sql starter required
-- 1. delete enrollments without a grade

-- 2. new student

-- 3. enrollment in PROG

-- 4. OPR's credits
```

<details>
<summary>Solution</summary>

```sql solution
DELETE FROM enrollments WHERE grade IS NULL;

INSERT INTO students (neptun, name, major, semester, city, born)
VALUES ('GHI789', 'Gabor Fekete', 'computer engineering', 1, 'Pecs', '2007-05-05');

INSERT INTO enrollments (neptun, code) VALUES ('GHI789', 'PROG');

UPDATE courses SET credits = 5 WHERE code = 'OPR';
```

</details>

```sql test
SELECT
  (SELECT COUNT(*) FROM students) AS students,
  (SELECT COUNT(*) FROM enrollments) AS enrollments,
  (SELECT COUNT(*) FROM enrollments WHERE grade IS NULL) AS without_grade,
  (SELECT COUNT(*) FROM enrollments WHERE neptun = 'GHI789' AND code = 'PROG') AS new_enrollment,
  (SELECT credits FROM courses WHERE code = 'OPR') AS opr_credits,
  (SELECT SUM(credits) FROM courses) AS total_credits;
```
