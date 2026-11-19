---
title: Deeper – Advanced Queries and Safe Modifications
summary: The ON versus WHERE trap of outer joins, three forms of the "anti-join", "top N per group" with LATERAL, UPDATE … FROM and DELETE … USING, UPSERT with the EXCLUDED row, data-modifying CTEs, and the lost update and its solutions (SELECT … FOR UPDATE, optimistic locking with a version number).
minutes: 45
---

## What you will learn in this lesson

- why the same condition gives **different results** in `LEFT JOIN … ON` and in `WHERE`,
- how to find rows **"without a partner"** in three ways,
- how to fetch the **top N rows per group**,
- how to **update or delete** based on another table,
- how **UPSERT** works ("insert it, or if it already exists, update it"),
- what a **lost update** is, and how to prevent it with pessimistic and optimistic locking.

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. LEFT JOIN: ON or WHERE? – the most common trap

**Task:** _List all students, with their ADB grade next to them if they have one._

```sql run
-- ✔ Condition in ON: every student stays, grade is NULL if they didn't take it
SELECT s.name, e.grade AS adb_grade
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun AND e.code = 'ADB'
ORDER BY s.name;
```

```sql run
-- ✘ Same condition in WHERE: students without a partner disappear!
SELECT s.name, e.grade AS adb_grade
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
WHERE e.code = 'ADB'
ORDER BY s.name;
```

Why? Remember the evaluation order: `FROM … LEFT JOIN` runs first (rows without a partner survive with `NULL`s), **then** `WHERE`. `WHERE e.code = 'ADB'` is **unknown** for rows with a `NULL` code, so it throws them away – the LEFT JOIN effectively becomes an INNER JOIN.

**Rule:** filters on the **right-hand** table of a LEFT JOIN go into `ON`; only filters on the **left-hand** table go into `WHERE`.

**Analogy:** ON says **whom to pair up with** (all guests stay, possibly without a partner); WHERE says **who may stay in the room** after pairing.

## 2. The anti-join: "those without a partner"

**Task:** _Which course did nobody take?_ Three equivalent solutions:

```sql run
-- a) NOT EXISTS – the safest, correct with NULLs too
SELECT c.code, c.name FROM courses c
WHERE NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.code = c.code);
```

```sql run
-- b) LEFT JOIN + IS NULL – "pair up, and keep those without a partner"
SELECT c.code, c.name FROM courses c
LEFT JOIN enrollments e ON e.code = c.code
WHERE e.code IS NULL;
```

```sql run
-- c) EXCEPT – set difference (keys only)
SELECT code FROM courses
EXCEPT
SELECT code FROM enrollments;
```

The result may be empty if every course has an enrollment – in the sample, someone took every course. Try it: click Edit, insert a new course first (`INSERT INTO courses VALUES ('NET', 'Networks', 5, 3);`), and run again!

Avoid the `NOT IN (SELECT …)` form: if the subquery returns even a single `NULL`, the result is **always empty** (see three-valued logic in topic 4).

## 3. Top N per group – LATERAL

**Task:** _For each student, their best-graded course._ `GROUP BY` gives the best grade (`MAX(grade)`), but not **which course** it was. A `LATERAL` subquery runs **separately for each outer row** and can refer to the outer row's columns – like a loop in programming:

```sql run
SELECT s.name, best.code, best.grade
FROM students s
CROSS JOIN LATERAL (
  SELECT e.code, e.grade
  FROM enrollments e
  WHERE e.neptun = s.neptun AND e.grade IS NOT NULL   -- refers to the outer row!
  ORDER BY e.grade DESC, e.code
  LIMIT 1                                              -- N = 1; change it to 2!
) AS best
ORDER BY s.name;
```

`CROSS JOIN LATERAL` skips those for whom the subquery is empty; to see them too, use `LEFT JOIN LATERAL (…) ON TRUE`. (The same can be solved with window functions, see topic 18.)

## 4. Updating and deleting based on another table

Often a table's rows must be updated or deleted **based on data in another table**.

```sql run
-- UPDATE … FROM: raise the grade (if any) of every 3rd-semester course by one, max 5
UPDATE enrollments e
SET grade = LEAST(e.grade + 1, 5)
FROM courses c
WHERE c.code = e.code AND c.semester = 3 AND e.grade IS NOT NULL
RETURNING e.neptun, e.code, e.grade;
```

```sql run
-- DELETE … USING: delete ungraded enrollments in 1st-semester courses
DELETE FROM enrollments e
USING courses c
WHERE c.code = e.code AND c.semester = 1 AND e.grade IS NULL
RETURNING e.neptun, e.code;
```

`RETURNING` shows exactly **which rows** changed – always worth using before running a modification for real (and before that, check what you'll affect with a `SELECT` using the same condition).

### Data-modifying CTE: archiving in one step

```sql run
-- Copy the deleted rows into an archive table in a single statement
CREATE TABLE archived_enrollments (LIKE enrollments);

WITH deleted AS (
  DELETE FROM enrollments WHERE grade IS NULL
  RETURNING *
)
INSERT INTO archived_enrollments SELECT * FROM deleted;

SELECT * FROM archived_enrollments;
```

Since this is **a single statement**, either both parts happen or neither does – a row can't be deleted without ending up in the archive.

## 5. UPSERT – insert or update

A shipment arrives at a warehouse. If a product isn't in stock yet, it must be **inserted**; if it is, its quantity must be **increased**. `INSERT … ON CONFLICT` does this in one step, without a race condition.

```sql run
CREATE TABLE stock (product VARCHAR(20) PRIMARY KEY, qty INT NOT NULL);
INSERT INTO stock VALUES ('mouse', 10), ('monitor', 3);

INSERT INTO stock (product, qty) VALUES ('mouse', 5), ('webcam', 7)
ON CONFLICT (product) DO UPDATE
SET qty = stock.qty + EXCLUDED.qty;   -- EXCLUDED = the row we tried to insert (conflicting)

SELECT * FROM stock ORDER BY product;
```

- `ON CONFLICT (product)` – which unique key's conflict we watch for;
- `EXCLUDED.qty` – the new value we tried to insert; `stock.qty` – the value already stored;
- `DO NOTHING` – simply skips the row on conflict.

Why isn't "SELECT first, then INSERT or UPDATE" good enough? Because between two concurrent requests there's a **race condition**: both see that the product doesn't exist, both try to insert, and one fails with a key conflict.

## 6. The lost update and two solutions

Anna and Ben each sell one item of the same product at the same time (stock: 10).

```text
time  Anna                                Ben
 1    SELECT qty → 10
 2                                        SELECT qty → 10
 3    UPDATE qty = 10 - 1 = 9
 4                                        UPDATE qty = 10 - 1 = 9   ← Anna's sale is lost!
```

Two items went out, yet the stock is 9 – this is a **lost update**. Solutions:

### a) Don't read, compute in the database

```sql
UPDATE stock SET qty = qty - 1 WHERE product = 'mouse';
```

`qty = qty - 1` is atomic **inside** the DBMS: the second update waits for the first and subtracts from 9. This is the simplest and best solution when possible.

### b) Pessimistic locking: SELECT … FOR UPDATE

If the program must see the value first (e.g. to check there's enough stock), lock the row when reading:

```sql
BEGIN;
SELECT qty FROM stock WHERE product = 'mouse' FOR UPDATE;  -- Ben will wait here
-- … the program checks that qty >= 1 …
UPDATE stock SET qty = qty - 1 WHERE product = 'mouse';
COMMIT;                                                     -- now Ben can continue
```

**Analogy:** the "occupied" sign on a bathroom door – whoever goes in locks it, the others wait.

### c) Optimistic locking: a version number

In web applications, minutes may pass between opening a form and saving it – we can't hold a lock that long. Instead we use a `version` column:

```sql run
CREATE TABLE articles (id INT PRIMARY KEY, body TEXT, version INT NOT NULL DEFAULT 1);
INSERT INTO articles VALUES (1, 'First version', 1);

-- Anna and Ben both opened version 1. Anna saves first:
UPDATE articles SET body = 'Anna''s version', version = version + 1
WHERE id = 1 AND version = 1;

-- Ben tries to save too, but he started from version 1: 0 rows are updated!
UPDATE articles SET body = 'Ben''s version', version = version + 1
WHERE id = 1 AND version = 1;

SELECT * FROM articles;
```

Ben's save updates **0 rows** – from this the program knows that someone else saved in the meantime and tells Ben: "The article was modified meanwhile, please reload!". This method doesn't lock, so it scales well; it's good when conflicts are **rare**.

| Method                | When is it good?                                  | Drawback                                 |
| --------------------- | ------------------------------------------------- | ---------------------------------------- |
| `qty = qty - 1`       | simple arithmetic                                 | not enough for complex business logic    |
| `FOR UPDATE`          | short transaction, frequent conflicts             | waiting, risk of deadlock                |
| Version number        | long "thinking time" (form), rare conflicts       | on conflict the user has to start over   |

## Summary

- In a LEFT JOIN, filters on the **right-hand** table go into `ON`, otherwise it becomes an INNER JOIN.
- Anti-join: `NOT EXISTS` (safest), `LEFT JOIN … IS NULL`, `EXCEPT`; `NOT IN` with NULL is dangerous.
- **Top N per group:** `CROSS JOIN LATERAL (… ORDER BY … LIMIT N)`.
- `UPDATE … FROM`, `DELETE … USING`, `RETURNING`; data-modifying CTE in a single atomic step.
- **UPSERT:** `INSERT … ON CONFLICT (key) DO UPDATE SET … EXCLUDED.column`.
- Against the **lost update**: compute in the database, `SELECT … FOR UPDATE`, or a version number.

## Exercise

A new shipment arrives at the warehouse. The starter code creates the `stock` table (`product` is the primary key) with 3 products. Rewrite the insert as an **UPSERT**: if the product already exists, **add** the incoming quantity to its count; if not, insert it as a new row!

```sql starter required
CREATE TABLE stock (product VARCHAR(20) PRIMARY KEY, qty INT NOT NULL);
INSERT INTO stock VALUES ('mouse', 10), ('monitor', 3), ('cable', 25);

-- The shipment: mouse 5, cable 10, webcam 4 (this one is new)
INSERT INTO stock (product, qty) VALUES ('mouse', 5), ('cable', 10), ('webcam', 4);

SELECT * FROM stock ORDER BY product;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE stock (product VARCHAR(20) PRIMARY KEY, qty INT NOT NULL);
INSERT INTO stock VALUES ('mouse', 10), ('monitor', 3), ('cable', 25);

INSERT INTO stock (product, qty) VALUES ('mouse', 5), ('cable', 10), ('webcam', 4)
ON CONFLICT (product) DO UPDATE
SET qty = stock.qty + EXCLUDED.qty;

SELECT * FROM stock ORDER BY product;
```

</details>
