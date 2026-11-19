---
title: Practice – SQL Queries
summary: Review questions and query exercises on filtering, sorting, paging, aggregation and grouping.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

**1.** **Average per group, with filtered groups.** Per course (`code`), the **average grade rounded to two decimals** – but only for courses with **at least 2 grades**. Sorted by the average descending, ties by code.

```sql starter
SELECT code, AVG(grade)
FROM enrollments
GROUP BY code;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, ROUND(AVG(grade), 2) AS average
FROM enrollments
GROUP BY code
HAVING COUNT(grade) >= 2         -- HAVING filters the groups (a NULL grade doesn't count)
ORDER BY average DESC, code;
```

</details>

**2.** **Paging.** We sort courses by credits descending, then by name, with **2** courses per page. Query the **2nd page** (code, name, credits)!

```sql starter
SELECT code, name, credits
FROM courses
ORDER BY credits DESC, name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, name, credits
FROM courses
ORDER BY credits DESC, name
LIMIT 2 OFFSET 2;                -- skip the first 2 rows
```

</details>

**3.** **Missing data.** Whose **city or birth date is unknown**? (Name, city, birth date, by name.)

```sql starter
SELECT name, city, born
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, city, born
FROM students
WHERE city IS NULL OR born IS NULL     -- NULL can only be searched with IS NULL
ORDER BY name;
```

</details>

**4.** **Grouping with several aggregates.** Per major, the **number** of students and the **lowest and highest semester**. Sorted by major.

```sql starter
SELECT major
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT major, COUNT(*) AS headcount, MIN(semester) AS min_semester, MAX(semester) AS max_semester
FROM students
GROUP BY major
ORDER BY major;
```

</details>

**5.** **Ranges.** The name and birth date of students born **in 2005**, in order of birth. (It can be solved two ways: with `BETWEEN` or with two comparisons.)

```sql starter
SELECT name, born
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, born
FROM students
WHERE born BETWEEN DATE '2005-01-01' AND DATE '2005-12-31'
ORDER BY born;
```

</details>

**6.** **A computed column.** For every course, show how many **hours of work** it means (1 credit ≈ 30 hours of student work): code, credits, `hours`. Sorted by hours descending, then by code.

```sql starter
SELECT code, credits
FROM courses;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, credits, credits * 30 AS hours
FROM courses
ORDER BY hours DESC, code;
```

</details>
