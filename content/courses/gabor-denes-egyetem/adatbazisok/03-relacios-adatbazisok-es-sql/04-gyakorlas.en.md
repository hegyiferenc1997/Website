---
title: Practice – Relational Model and SQL
summary: Review questions, translating a relational algebra expression to SQL, and a summary worksheet on keys, relational algebra and DDL.
minutes: 25
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
