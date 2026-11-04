---
title: SQL Basics
summary: SELECT, WHERE, ORDER BY, aggregate functions, GROUP BY, JOIN, and INSERT, UPDATE, DELETE.
minutes: 20
---

## What you will learn

- how to query data in **SQL** (`SELECT`, `WHERE`, `ORDER BY`),
- how to **aggregate** (`COUNT`, `AVG`, `GROUP BY`) and **join** tables (`JOIN`),
- how to **insert**, **update** and **delete** data.

## SQL

**SQL** (Structured Query Language) is the standard, **declarative** language of relational databases: you describe _what_ you want, and the DBMS decides _how_ to find it. The examples below use the `students` table:

| neptun | name         | major    | term | gpa |
| ------ | ------------ | -------- | ---- | --- |
| ABC123 | Anna Kiss    | comp.eng | 1    | 4.5 |
| XYZ789 | Béla Nagy    | comp.eng | 3    | 3.8 |
| QWE456 | Cili Tóth    | bus.info | 1    | 4.1 |
| RTZ321 | Dénes Kovács | comp.eng | 1    | 3.2 |

## Querying

```sql
-- Every column, every row
SELECT * FROM students;

-- Only name and GPA, first-term students, by GPA descending
SELECT name, gpa
FROM students
WHERE term = 1
ORDER BY gpa DESC;
```

Result: Anna Kiss 4.5, Cili Tóth 4.1, Dénes Kovács 3.2.

In `WHERE` you can use: `=`, `<>`, `<`, `>`, `AND`, `OR`, `NOT`, `BETWEEN 3 AND 4`, `IN ('a', 'b')`, `LIKE 'K%'` (starts with K).

## Aggregation

```sql
SELECT COUNT(*) FROM students;                  -- 4
SELECT AVG(gpa) FROM students WHERE term = 1;
-- Head count per major
SELECT major, COUNT(*) AS headcount
FROM students
GROUP BY major;                                 -- comp.eng 3, bus.info 1
```

Aggregate functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

## Joining tables: JOIN

```sql
-- Who enrolled in which course? (enrolments: neptun, code; courses: code, name)
SELECT s.name, c.name AS course
FROM enrolments e
JOIN students s ON s.neptun = e.neptun
JOIN courses c  ON c.code = e.code;
```

## Changing data

```sql
INSERT INTO students (neptun, name, major, term, gpa)
VALUES ('NEW001', 'Emma Szabó', 'comp.eng', 1, 4.9);

UPDATE students SET term = 2 WHERE neptun = 'ABC123';

DELETE FROM students WHERE neptun = 'NEW001';
```

**Careful:** an `UPDATE` or `DELETE` without `WHERE` changes or deletes **every row of the table**!

## The same from Python – filtering and sorting a list

You can try the same idea in Python on a list:

```python run
students = [
    {"name": "Anna Kiss", "term": 1, "gpa": 4.5},
    {"name": "Béla Nagy", "term": 3, "gpa": 3.8},
    {"name": "Cili Tóth", "term": 1, "gpa": 4.1},
    {"name": "Dénes Kovács", "term": 1, "gpa": 3.2},
]
# SELECT name, gpa FROM students WHERE term = 1 ORDER BY gpa DESC
first_term = [s for s in students if s["term"] == 1]
for s in sorted(first_term, key=lambda s: s["gpa"], reverse=True):
    print(s["name"], s["gpa"])
```

## Summary

- `SELECT … FROM … WHERE … ORDER BY …` – query, filter, sort.
- `COUNT`, `AVG`, `GROUP BY` – aggregation; `JOIN … ON …` – joining tables.
- `INSERT`, `UPDATE`, `DELETE` – always with `WHERE`!

## Exercise

```quiz required
? Which SQL keyword **filters** rows by a condition?
- SELECT
+ WHERE
- ORDER BY
- FROM
! E.g. WHERE term = 1.

? How many rows does this return on the lesson's table: `SELECT * FROM students WHERE major = 'comp.eng';`?
= 3
! Anna Kiss, Béla Nagy, Dénes Kovács.

? What does `DELETE FROM students;` (without WHERE) do?
- Nothing, because the condition is missing.
- Deletes only the first row.
+ Deletes every row of the table.
- Deletes the table together with its structure.
! That is why you always need WHERE.

? Which aggregate function counts rows?
= COUNT
! COUNT(*).
```
