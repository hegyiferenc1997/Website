---
title: Practice – SQL Queries
summary: Review questions and query exercises on filtering, sorting, paging, aggregation and grouping.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why does <code>WHERE city = NULL</code> find nothing?</summary>

Because `NULL` means an "unknown" value, and any comparison with an unknown value is also unknown (not true). `WHERE` keeps only the rows where the condition is **true**. Correctly: `WHERE city IS NULL`.

</details>

<details>
<summary>2. What is the difference between <code>COUNT(*)</code> and <code>COUNT(grade)</code>?</summary>

`COUNT(*)` counts every row, `COUNT(grade)` only those where `grade` isn't NULL. In the sample database: 12 and 10.

</details>

<details>
<summary>3. What's wrong with <code>SELECT code, neptun, COUNT(*) FROM enrollments GROUP BY code</code>?</summary>

A course code has several Neptun codes, but each group becomes a single row – the DBMS doesn't know which one to show. `SELECT` may only contain grouping columns or aggregate functions.

</details>

<details>
<summary>4. Why doesn't an alias given in <code>SELECT</code> work in <code>WHERE</code>?</summary>

Because in the logical execution order `WHERE` (2nd) runs before `SELECT` (5th), so the alias doesn't exist there yet. `ORDER BY` (6th) comes after `SELECT`, so it can be used there.

</details>

<details>
<summary>5. Why does <code>LIMIT</code> need <code>ORDER BY</code>?</summary>

Because without sorting the order of rows isn't defined, so "the first 10 rows" can be any 10 rows and may even change between runs.

</details>

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Warm-up exercises (optional)

**a)** Students (name, date of birth) born **in 2005 or later**, youngest first.

```sql starter
SELECT name, born
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, born
FROM students
WHERE born >= '2005-01-01'
ORDER BY born DESC;
```

</details>

**b)** How many courses are there per semester, and how many credits are they worth in total? (`semester`, `course_count`, `total_credits`, sorted by semester)

```sql starter
SELECT semester
FROM courses;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT semester, COUNT(*) AS course_count, SUM(credits) AS total_credits
FROM courses
GROUP BY semester
ORDER BY semester;
```

</details>

## Summary exercise

List **how many students come from each city** (`city`, `headcount`)! Leave out the unknown city (NULL). Sort by headcount descending, ties by city name.

```sql starter required
SELECT city
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT city, COUNT(*) AS headcount
FROM students
WHERE city IS NOT NULL
GROUP BY city
ORDER BY headcount DESC, city;
```

</details>
