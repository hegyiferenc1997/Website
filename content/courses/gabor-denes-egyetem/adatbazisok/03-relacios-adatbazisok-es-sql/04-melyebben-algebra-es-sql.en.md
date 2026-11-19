---
title: Deeper – Relational Algebra and SQL Hand in Hand
summary: Translating algebra expressions to SQL and back, expression trees, sets versus multisets (UNION versus UNION ALL), INTERSECT and EXCEPT, relational division ("who took all of them") in three ways, and the equivalent rewrites the optimiser uses to speed things up.
minutes: 35
---

## What you will learn in this lesson

- how to **translate** a relational algebra expression into SQL – and an SQL query into algebra,
- what an **expression tree** is, and why this is how the DBMS "thinks",
- the difference between a **set** and a **multiset** (`UNION` versus `UNION ALL`),
- how to use `INTERSECT` and `EXCEPT`,
- how to solve the famous **"who took all of them"** questions (relational division),
- why **two different expressions can give the same result** – and how the optimiser exploits this.

## Why think in algebra too?

SQL says **what** you want; relational algebra says **which steps** can produce it. When the DBMS receives an SQL query, it first translates it into an algebraic **expression tree**, then rearranges that tree into a faster one. If you can see the tree too, you'll write complex queries much more easily and understand better why something is slow.

**Analogy – order and cooking:** SQL is the guest's order ("fried cheese with rice, please"), algebra is the kitchen workflow ("slice → bread → fry; meanwhile cook the rice → serve together"). The same order can be produced by several workflows; a good cook (the optimiser) chooses the fastest.

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Translation step by step

**Question:** _Who (name) took Databases (ADB) and got a grade of 4 or better?_

### In algebra, from the inside out

1. Filter the enrollments: σ<sub>code='ADB' ∧ grade≥4</sub>(enrollments)
2. Join with the students: students ⋈ (result 1)
3. Project onto the name: π<sub>name</sub>(result 2)

All in one: **π<sub>name</sub>(students ⋈ σ<sub>code='ADB' ∧ grade≥4</sub>(enrollments))**

### As an expression tree

```text
            π name
              │
              ⋈  (neptun = neptun)
            ┌─┴──────────────┐
        students      σ code='ADB' ∧ grade≥4
                              │
                         enrollments
```

Read the tree **from the bottom up**: the leaves are tables, every node is an operation, the root holds the final result.

### In SQL

```sql run
SELECT s.name                                  -- π name
FROM students s
JOIN enrollments e ON e.neptun = s.neptun      -- ⋈
WHERE e.code = 'ADB' AND e.grade >= 4;         -- σ
```

| Algebra             | SQL                                       |
| ------------------- | ----------------------------------------- |
| σ (selection)       | `WHERE`                                   |
| π (projection)      | the column list after `SELECT`            |
| ⋈ (join)            | `JOIN … ON …`                             |
| × (product)         | `CROSS JOIN` (or a comma in `FROM`)       |
| ρ (rename)          | `AS`                                      |
| ∪, ∩, −             | `UNION`, `INTERSECT`, `EXCEPT`            |

## Set or multiset?

In pure relational algebra a relation is a **set**: no two rows are identical. SQL, however, works with **multisets** (_bags_): it **keeps** duplicates unless you explicitly ask for their removal.

```sql run
-- Projection: which cities do the students come from? (SQL: with duplicates)
SELECT city FROM students;
```

```sql run
-- The algebraic π is actually this: without duplicates
SELECT DISTINCT city FROM students;
```

Why doesn't SQL remove them automatically? Because removing duplicates is **expensive** (it requires sorting or hashing), and often the count is exactly what matters (e.g. how many enrollments there were).

### UNION versus UNION ALL

- `UNION` = set union: **removes** duplicates.
- `UNION ALL` = multiset union: simply **appends** the two results.

```sql run
-- Course codes referenced as a 3rd-semester course OR in an enrollment
SELECT code FROM courses WHERE semester = 3
UNION
SELECT code FROM enrollments;
```

```sql run
-- The same with UNION ALL: every occurrence is kept
SELECT code FROM courses WHERE semester = 3
UNION ALL
SELECT code FROM enrollments;
```

**Rule:** if you know there can be no duplicates, or you need them, use `UNION ALL` – it's faster. For set operations the two sides must have the same **number and types of columns** (in algebra: "union-compatible" relations).

## Intersection and difference

```sql run
-- ∩: students who took both ADB AND PROG
SELECT neptun FROM enrollments WHERE code = 'ADB'
INTERSECT
SELECT neptun FROM enrollments WHERE code = 'PROG';
```

```sql run
-- −: students who didn't take any course
SELECT neptun FROM students
EXCEPT
SELECT neptun FROM enrollments;
```

Notice: difference is **not symmetric**. `A − B` gives what is in A but not in B; `B − A` gives something completely different.

**Analogy:** two shopping lists. Intersection: what both of you wrote down. Difference: what is on my list but not on yours.

## Relational division: "who … all of them"

The trickiest questions sound like this: _"Who took **all** 3rd-semester courses?"_ This is the **division** (÷) operation of relational algebra. SQL has no keyword for it, but it can be written in three ways.

The 3rd-semester courses are ADB and DIG. Anna Kiss (ABC123) and Dani Szabo (DEF456) took both – so they should appear.

### Method 1: by counting

"They took as many 3rd-semester courses as there are 3rd-semester courses."

```sql run
SELECT e.neptun
FROM enrollments e
JOIN courses c ON c.code = e.code
WHERE c.semester = 3
GROUP BY e.neptun
HAVING COUNT(*) = (SELECT COUNT(*) FROM courses WHERE semester = 3);
```

### Method 2: double negation (NOT EXISTS)

Turn the sentence around: "There is no 3rd-semester course they didn't take."

```sql run
SELECT s.neptun, s.name
FROM students s
WHERE NOT EXISTS (                 -- there is no course…
  SELECT 1 FROM courses c
  WHERE c.semester = 3
    AND NOT EXISTS (               -- …that they didn't enroll in
      SELECT 1 FROM enrollments e
      WHERE e.neptun = s.neptun AND e.code = c.code));
```

This is the logical rewrite "∀ = ¬∃¬": took _every_ course ⇔ there _does not exist_ a course they did _not_ take.

### Method 3: with difference

"From the set of 3rd-semester courses, subtract what they took – if nothing remains, they took them all."

```sql run
SELECT s.neptun, s.name
FROM students s
WHERE NOT EXISTS (
  SELECT code FROM courses WHERE semester = 3
  EXCEPT
  SELECT code FROM enrollments e WHERE e.neptun = s.neptun);
```

All three give the same result. Which to choose? Counting is the easiest to read; `NOT EXISTS` is the most general (it works even if enrollments could contain duplicates); `EXCEPT` is closest to set-based thinking.

## Equivalent expressions – the optimiser's tricks

Two expressions are **equivalent** if they give the same result on every database. The DBMS exploits this: it rewrites your expression into a cheaper but equivalent form. The most important rules:

1. **Pushing selection down:** σ<sub>F</sub>(R ⋈ S) = σ<sub>F</sub>(R) ⋈ S, if F only refers to columns of R. Filter first, join afterwards – far fewer rows need to be paired.
2. **Merging selections:** σ<sub>F</sub>(σ<sub>G</sub>(R)) = σ<sub>F ∧ G</sub>(R).
3. **Early projection:** unnecessary columns are dropped as early as possible.
4. **Joins are commutative and associative:** (R ⋈ S) ⋈ T = R ⋈ (S ⋈ T) – the optimiser picks the order.

**Numeric example:** the students table has 10,000 rows, enrollments has 100,000, and there are only 500 ADB enrollments. If we join everything first and filter afterwards, we pair 100,000 rows; if we filter first, only 500. **Two hundred times less work**, same result.

That's why you don't have to worry about writing the `WHERE` condition in the "right place": the optimiser rearranges the tree. But deciding **what** you want is your job – the optimiser can't guess that.

## Common mistakes

- **Union with incompatible columns:** `SELECT name FROM students UNION SELECT credits FROM courses` – text and numbers can't be combined.
- **`<>` instead of `EXCEPT`:** "didn't take ADB" is not the same as `WHERE code <> 'ADB'` (that also returns those who took something else besides ADB!).
- **Division with `IN`:** `WHERE code IN ('ADB', 'DIG')` returns those who took **at least one**, not **all**.

## Summary

- The DBMS translates SQL into an **expression tree**: σ = `WHERE`, π = `SELECT`, ⋈ = `JOIN`.
- SQL works with **multisets**: `DISTINCT`, and `UNION` (removes) versus `UNION ALL` (keeps).
- `INTERSECT` = intersection, `EXCEPT` = difference (not symmetric).
- The **"all of them"** question is relational division: solvable by counting, double `NOT EXISTS`, or `EXCEPT`.
- The optimiser speeds things up with **equivalent rewrites** (e.g. pushing selections down).

## Exercise

List the **IDs (neptun)** of students who did **not** take Databases (`ADB`) – including those who took nothing at all! Use set difference (`EXCEPT`). (Order doesn't matter.)

Careful: `WHERE code <> 'ADB'` is **not** a correct solution – think about why!

```sql starter required
SELECT neptun FROM students
-- the difference goes here
;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT neptun FROM students
EXCEPT
SELECT neptun FROM enrollments WHERE code = 'ADB';
```

</details>
