---
title: Practice – Queries, Modifications, Transactions
summary: Review questions, practice exercises on joins, subqueries and modifications, and a summary reporting exercise.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. When do you use LEFT JOIN instead of INNER JOIN?</summary>

When you want to see **every** row of the left table, including those with no pair on the right (e.g. students who haven't taken any course). Unmatched rows get NULL in the right-hand columns.

</details>

<details>
<summary>2. Why can <code>WHERE neptun NOT IN (SELECT neptun FROM …)</code> return an empty result?</summary>

Because if the subquery's result contains a **NULL**, `NOT IN` gives an "unknown" result for every row (it can't be known for sure that the value isn't equal to the NULL). `NOT EXISTS` is the safe solution then.

</details>

<details>
<summary>3. What does <code>UPDATE products SET price = price * 1.1;</code> do?</summary>

It raises the price of **every** product by 10%, because there's no `WHERE`. If that was the goal, fine – if not, it's the classic fatal mistake. That's why it's worth trying the condition with a `SELECT` first and working in a transaction.

</details>

<details>
<summary>4. What is the difference between atomicity and durability?</summary>

**Atomicity** guarantees that a transaction either happens completely or leaves no trace. **Durability** guarantees that an already **committed** change (after COMMIT) survives a crash.

</details>

<details>
<summary>5. How can deadlock be prevented?</summary>

If every transaction locks resources **in the same order** (e.g. always the smaller id first) and transactions are **short** (they don't wait for user input). If it happens anyway, the DBMS aborts one transaction, which the application must retry.

</details>

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Practice exercises (optional)

**a)** Which courses (`name`) did a student from **Budapest** enroll in? Each course once, sorted by name.

```sql starter
SELECT c.name
FROM courses c;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT DISTINCT c.name
FROM courses c
JOIN enrollments e ON e.code = c.code
JOIN students s ON s.neptun = e.neptun
WHERE s.city = 'Budapest'
ORDER BY c.name;
```

</details>

**b)** Which students (`name`) have **no 5 at all**? Sorted by name.

```sql starter
SELECT name FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name FROM students s
WHERE NOT EXISTS (
  SELECT 1 FROM enrollments e WHERE e.neptun = s.neptun AND e.grade = 5
)
ORDER BY s.name;
```

</details>

## Summary exercise

Build a report of **every course** (including any that nobody enrolled in): the course **name** (`course`), the **number** of enrolled students (`headcount`) and the **average** grade **to two decimals** (`average`). Sort by course name.

```sql starter required
SELECT c.name AS course
FROM courses c;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT c.name AS course, COUNT(e.neptun) AS headcount, ROUND(AVG(e.grade), 2) AS average
FROM courses c
LEFT JOIN enrollments e ON e.code = c.code
GROUP BY c.code, c.name
ORDER BY c.name;
```

</details>

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

**1.** **Those left out.** Which student **hasn't enrolled in any course**? (Name.) Solve it with `NOT EXISTS` or with `LEFT JOIN … IS NULL`!

```sql starter
SELECT name FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
WHERE e.neptun IS NULL;          -- no matching enrollment
```

</details>

**2.** **A subquery with aggregation.** Whose **own average grade** is higher than **the average of all grades**? (Name, own average to two decimals, sorted by name.)

```sql starter
SELECT AVG(grade) FROM enrollments;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name, ROUND(AVG(e.grade), 2) AS average
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
GROUP BY s.neptun, s.name
HAVING AVG(e.grade) > (SELECT AVG(grade) FROM enrollments)   -- scalar subquery
ORDER BY s.name;
```

</details>

**3.** **CTE: the best in each course.** Per course, who got **the best grade**? (Course code, student name, grade; by code, then by name.) As a first step, compute the maximum per course in a `WITH` block!

```sql starter
WITH maxima AS (
  SELECT code, MAX(grade) AS best
  FROM enrollments
  GROUP BY code
)
SELECT * FROM maxima;
```

<details>
<summary>Solution</summary>

```sql solution
WITH maxima AS (
  SELECT code, MAX(grade) AS best
  FROM enrollments
  GROUP BY code
)
SELECT e.code, s.name, e.grade
FROM enrollments e
JOIN maxima m ON m.code = e.code AND m.best = e.grade      -- only those reaching the maximum
JOIN students s ON s.neptun = e.neptun
ORDER BY e.code, s.name;
```

</details>

**4.** **Modify and check.** Feri Kovacs (`FGH678`) passed Databases with a **4**. Enter his grade, then query the **average** of the `ADB` course to two decimals!

```sql starter
SELECT * FROM enrollments WHERE code = 'ADB';
```

<details>
<summary>Solution</summary>

```sql solution
UPDATE enrollments
SET grade = 4
WHERE neptun = 'FGH678' AND code = 'ADB';    -- without WHERE every row would be a 4!

SELECT ROUND(AVG(grade), 2) AS average FROM enrollments WHERE code = 'ADB';
```

</details>

**5.** **Bulk insert from a query.** Enrol every **first-semester** student in `OPR` (without a grade) – but don't try again for those already enrolled (`ON CONFLICT DO NOTHING`)! Then give the **number** of `OPR` enrollments.

```sql starter
SELECT neptun FROM students WHERE semester = 1;
```

<details>
<summary>Solution</summary>

```sql solution
INSERT INTO enrollments (neptun, code)
SELECT neptun, 'OPR' FROM students WHERE semester = 1
ON CONFLICT DO NOTHING;                      -- skips on a conflict (already enrolled)

SELECT COUNT(*) AS headcount FROM enrollments WHERE code = 'OPR';
```

</details>

**6.** **Deleting with a condition.** Delete the enrollments that **don't have a grade yet** (NULL), then query how many enrollments are left!

```sql starter
SELECT * FROM enrollments WHERE grade IS NULL;
```

<details>
<summary>Solution</summary>

```sql solution
DELETE FROM enrollments WHERE grade IS NULL;

SELECT COUNT(*) AS remaining FROM enrollments;
```

</details>
