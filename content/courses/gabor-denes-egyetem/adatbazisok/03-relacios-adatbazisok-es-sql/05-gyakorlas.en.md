---
title: Practice – Relational Model and SQL
summary: Review questions, translating a relational algebra expression to SQL, and a summary worksheet on keys, relational algebra and DDL.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why can't a relation have two completely identical rows?</summary>

Because mathematically a relation is a **set**, and every element appears in a set only once. In practice the **primary key** ensures this: if two rows have different keys, the rows can't be identical.

</details>

<details>
<summary>2. What is the difference between a candidate key and the primary key?</summary>

A candidate key is **any** minimal, uniquely identifying set of attributes (there can be several, e.g. Neptun code and tax number). The primary key is **the chosen one** among them; the rest become alternate keys (with a `UNIQUE` constraint).

</details>

<details>
<summary>3. Why is a surrogate key (e.g. a sequence number) often chosen over a natural one?</summary>

Because a natural key comes from the real world, and reality can change (new licence plate, name change, mistyped ISBN). If a primary key changes, every foreign key referring to it must be updated too. A surrogate key has no meaning, so it never needs to change.

</details>

<details>
<summary>4. Why do you have to write DISTINCT explicitly for a projection in SQL?</summary>

Because relational algebra works with sets (duplicates vanish automatically), while SQL works with **multisets** (tables that may contain duplicates) – removing duplicates is costly, so it only does it on request.

</details>

<details>
<summary>5. What is the difference between DROP TABLE and TRUNCATE?</summary>

`DROP TABLE` deletes the table itself (structure, constraints and data). `TRUNCATE` only deletes the rows; the table remains, empty.

</details>

## Practice SQL exercise (optional)

Translate this relational algebra expression into SQL: `π name, semester ( σ major = 'business informatics' (students) )`

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql starter
SELECT ...
FROM students
WHERE ...;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, semester
FROM students
WHERE major = 'business informatics';
```

</details>

## Summary worksheet

```quiz required
? The relation `accounts(account_no, customer, balance, opened_on)` has 1200 rows. What is its degree?
= 4
! Degree is the number of attributes; the number of rows (1200) is the cardinality.

? In a car table both the licence plate and the VIN uniquely identify a car. If the VIN is chosen as primary key, what does the licence plate become?
- a foreign key
+ an alternate key
- a superkey but not a key
- a composite key
! A candidate key that wasn't chosen = alternate key.

? Which relational algebra operation corresponds to SQL's `WHERE` part?
+ selection (σ)
- projection (π)
- rename (ρ)
- union (∪)
! WHERE filters rows.

? How many rows does the Cartesian product of a 4-row and a 7-row table have?
= 28
! 4 · 7.

? Which SQL keyword makes a column a foreign key in `CREATE TABLE`?
- PRIMARY KEY
- UNIQUE
+ REFERENCES
- CHECK
! e.g. department_id INT REFERENCES departments (department_id)

? Which statement adds a new column to an existing table? (two words)
= ALTER TABLE
! ALTER TABLE … ADD COLUMN …
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

**1.** **Selection and projection.** In relational algebra: π<sub>name, credits</sub>(σ<sub>credits ≥ 5</sub>(courses)). Write it in SQL, sorted by name!

```sql starter
SELECT *
FROM courses;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, credits         -- projection (π)
FROM courses
WHERE credits >= 5           -- selection (σ)
ORDER BY name;
```

</details>

**2.** **Union.** Who (Neptun code) has **already got a 5** in something, **or** is in the **5th semester**? Every code should appear once, sorted.

```sql starter
SELECT neptun FROM enrollments WHERE grade = 5;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT neptun FROM enrollments WHERE grade = 5
UNION                                   -- UNION removes duplicates
SELECT neptun FROM students WHERE semester = 5
ORDER BY 1;
```

</details>

**3.** **Intersection.** Who took **both** `ADB` **and** `DIG`? (Neptun code, sorted.)

```sql starter
SELECT neptun FROM enrollments WHERE code = 'ADB';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT neptun FROM enrollments WHERE code = 'ADB'
INTERSECT
SELECT neptun FROM enrollments WHERE code = 'DIG'
ORDER BY 1;
```

</details>

**4.** **Join.** The **name and grade** of the students who took _Programming Basics_, sorted by name. You'll need to join the students, enrollments and courses tables.

```sql starter
SELECT *
FROM enrollments;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name, e.grade
FROM enrollments e
JOIN students s ON s.neptun = e.neptun
JOIN courses c  ON c.code = e.code
WHERE c.name = 'Programming Basics'
ORDER BY s.name;
```

</details>

**5.** **Cartesian product.** How many rows does the `students × courses` product have? Work it out in your head first (6 students, 5 courses), then check with SQL!

```sql starter
SELECT *
FROM students CROSS JOIN courses;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT COUNT(*) AS row_count
FROM students CROSS JOIN courses;       -- 6 × 5 = 30
```

</details>
