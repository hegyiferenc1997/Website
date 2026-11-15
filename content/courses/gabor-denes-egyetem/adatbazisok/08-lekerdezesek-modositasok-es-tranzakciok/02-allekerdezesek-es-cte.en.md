---
title: Subqueries, EXISTS and CTEs
summary: Subqueries in WHERE (scalar, IN, EXISTS), in FROM and in SELECT, correlated subqueries, WITH (CTE) for readable queries, and the set operations (UNION, INTERSECT, EXCEPT).
minutes: 28
---

## What you will learn

- how to nest one query **inside another** (subquery),
- when to use `IN` and when `EXISTS`,
- how to make a complex query **readable** with `WITH` (CTE),
- the **set operations**: `UNION`, `INTERSECT`, `EXCEPT`.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## A question inside a question

Sometimes answering a question first requires answering **another** one. _"Who got a grade better than the average?"_ – first you need to know the average. A **subquery** is a `SELECT` in parentheses whose result the outer query uses.

### Scalar subquery – a single value

```sql run
SELECT neptun, code, grade
FROM enrollments
WHERE grade > (SELECT AVG(grade) FROM enrollments)
ORDER BY grade DESC;
```

The inner query returns a single number (3.9), and the outer one compares against it.

### IN – a list

```sql run
-- Who took Databases?
SELECT name FROM students
WHERE neptun IN (SELECT neptun FROM enrollments WHERE code = 'ADB');
```

`NOT IN` is the opposite – but careful: if the inner list contains a **NULL**, `NOT IN` returns no rows at all (NULL is "unknown", so nothing can be said for sure to be absent from the list). `NOT EXISTS` is safer then.

### EXISTS – is there at least one?

`EXISTS` only checks whether the inner query **returns at least one row**.

```sql run
-- Who has at least one 5?
SELECT s.name FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e
  WHERE e.neptun = s.neptun AND e.grade = 5
);
```

This is a **correlated** subquery: the inner query refers to the current row of the outer one (`s.neptun`), so logically it runs again for every student.

### Subquery in FROM

A subquery's result can also be used **as a table** (it needs an alias):

```sql run
-- Each student's average, then those above 4
SELECT name, average FROM (
  SELECT s.name, ROUND(AVG(e.grade), 2) AS average
  FROM students s JOIN enrollments e ON e.neptun = s.neptun
  GROUP BY s.neptun, s.name
) AS averages
WHERE average > 4;
```

## WITH – the CTE

Lots of nested parentheses are hard to read. A **CTE** (_Common Table Expression_) uses `WITH` to **name** an intermediate result up front, like a variable in a program:

```sql run
WITH averages AS (
  SELECT s.name, ROUND(AVG(e.grade), 2) AS average
  FROM students s JOIN enrollments e ON e.neptun = s.neptun
  GROUP BY s.neptun, s.name
)
SELECT name, average FROM averages WHERE average > 4 ORDER BY average DESC;
```

The same as before – but readable top-down, **step by step**. A `WITH` can hold several CTEs separated by commas, and later ones can refer to earlier ones. (In topic 12 we'll traverse graphs with recursive CTEs.)

## Set operations

They combine the results of two queries with **the same number and types of columns**:

| Operation    | Result                                         |
| ------------ | ---------------------------------------------- |
| `UNION`      | rows of both, without duplicates               |
| `UNION ALL`  | rows of both, with duplicates (faster)         |
| `INTERSECT`  | only rows present in both                      |
| `EXCEPT`     | rows in the first but not in the second        |

```sql run
-- Those who took both ADB AND DIG
SELECT neptun FROM enrollments WHERE code = 'ADB'
INTERSECT
SELECT neptun FROM enrollments WHERE code = 'DIG';
```

## Summary

- Subqueries: scalar (one value), `IN` (list), `EXISTS` (is there any), in `FROM` as a table.
- `NOT IN` + NULL = empty result → use `NOT EXISTS`.
- `WITH name AS (…)` – a named intermediate result, a more readable query.
- `UNION [ALL]`, `INTERSECT`, `EXCEPT`.

## Lesson exercise

List the **names** of the students who have **at least one grade better than the average of all grades**! Everyone should appear only once, sorted by name.

```sql starter required
SELECT s.name
FROM students s
WHERE ...
ORDER BY s.name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name
FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e
  WHERE e.neptun = s.neptun
    AND e.grade > (SELECT AVG(grade) FROM enrollments)
)
ORDER BY s.name;
```

Other correct solutions exist too, for example `WHERE s.neptun IN (SELECT neptun FROM enrollments WHERE grade > (SELECT AVG(grade) FROM enrollments))`.

</details>
