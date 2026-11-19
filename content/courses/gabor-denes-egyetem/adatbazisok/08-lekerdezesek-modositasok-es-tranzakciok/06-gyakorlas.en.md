---
title: Practice – Queries, Modifications, Transactions
summary: Review questions, practice exercises on joins, subqueries and modifications, and a summary reporting exercise.
minutes: 35
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
