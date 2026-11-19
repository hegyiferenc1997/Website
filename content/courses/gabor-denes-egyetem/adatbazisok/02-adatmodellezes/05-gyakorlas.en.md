---
title: Practice – Data Modelling
summary: Review questions and a summary worksheet on modelling levels, the modelling steps, data types and constraints.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between the logical and the physical model?</summary>

The **logical** model describes tables, fields and keys, but is still fine for any relational DBMS. The **physical** model is made for a specific system: exact data types (`VARCHAR(80)`, `NUMERIC(10,2)`), indexes, storage settings, `CREATE TABLE` statements.

</details>

<details>
<summary>2. Why ask about exceptions when gathering requirements?</summary>

Because the model's structure often depends on exactly those exceptions. If it turns out a student can have two majors, the student–major relationship becomes N : M instead of 1 : N, which means a new table. That takes minutes on paper but days in a live system.

</details>

<details>
<summary>3. Why not store money as REAL or DOUBLE PRECISION?</summary>

Because floating-point numbers are approximations in binary, so for example `0.1 + 0.2` isn't exactly `0.3`. After many transactions the rounding errors add up. `NUMERIC` stores an exact decimal number.

</details>

<details>
<summary>4. What is the difference between PRIMARY KEY and UNIQUE?</summary>

Both forbid duplicates, but a `PRIMARY KEY` also **can't be NULL**, and a table has only **one** – it is the row's "official" identifier. There can be several `UNIQUE` constraints (e.g. email, tax number), and they usually allow NULL.

</details>

<details>
<summary>5. Why is it better for the database to reject bad data, rather than only the application checking it?</summary>

Because several programs may use one database (a web front end, a mobile app, an import script, an admin by hand). If the rule lives in only one program, bad data can get in through the others. A database constraint applies to everyone.

</details>

## Summary worksheet

A **dog shelter** wants to record dogs (name, breed, year of birth, chip number), adopters (name, phone number, address) and adoptions (which dog was adopted by whom, when). A dog is adopted at most once, but a family can take several dogs home.

```quiz required
? How many entities are in the description (not counting the adoption relationship)?
= 2
! Dog and adopter.

? What is the cardinality of the adopter–dog relationship?
- 1 : 1
+ 1 : N
- N : M
! A family takes many dogs, a dog goes to one family.

? Which type should store the **phone number**?
- INT
- NUMERIC(11, 0)
+ VARCHAR(20)
- REAL
! We never calculate with it, and a leading 0 or + sign matters.

? Which constraint ensures that no two dogs share a chip number (if it isn't the primary key)?
- NOT NULL
+ UNIQUE
- DEFAULT
- CHECK
! UNIQUE ensures uniqueness.

? Write the CHECK condition saying the year of birth is at least 2000 (only the part inside the parentheses, e.g. price > 0).
= birth_year >= 2000
= birth_year>=2000
= year >= 2000
= year>=2000
! CHECK (birth_year >= 2000)

? At which modelling level do we decide that the chip number will be `VARCHAR(15)`?
- conceptual
- logical
+ physical
! A concrete data type = physical model.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

**1.** **Types and constraints.** Create the `product` table: `id` integer, primary key; `name` at most 40 characters, mandatory; `price` an amount of money with two decimals (`NUMERIC(10, 2)`), **greater than 0**; `stock` integer, mandatory, **default 0**. The check tries a few inserts.

```sql starter
CREATE TABLE product (
  id INT
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE product (
  id    INT PRIMARY KEY,
  name  VARCHAR(40) NOT NULL,
  price NUMERIC(10, 2) CHECK (price > 0),
  stock INT NOT NULL DEFAULT 0            -- if not given, it will be 0
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'valid row', try_it($q$INSERT INTO product (id, name, price) VALUES (1, 'Mouse', 4990)$q$));
INSERT INTO results VALUES (2, 'price of 0', try_it($q$INSERT INTO product (id, name, price) VALUES (2, 'Free', 0)$q$));
INSERT INTO results VALUES (3, 'no name', try_it($q$INSERT INTO product (id, name, price) VALUES (3, NULL, 100)$q$));
INSERT INTO results VALUES (4, 'duplicate id', try_it($q$INSERT INTO product (id, name, price) VALUES (1, 'Other', 100)$q$));
INSERT INTO results SELECT 5, 'default stock', stock::TEXT FROM product WHERE id = 1;
SELECT * FROM results ORDER BY seq;
```

**2.** **A 1:N relationship with a foreign key.** At a company every employee belongs to exactly one department. Create the `departments` (`id` key, `name` mandatory) and `employees` (`id` key, `name` mandatory, `department_id` **mandatory, foreign key**) tables! The check tries out that an employee can't be added to a non-existent department.

```sql starter
CREATE TABLE departments (
  id INT PRIMARY KEY
);
CREATE TABLE employees (
  id INT PRIMARY KEY
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE departments (
  id   INT PRIMARY KEY,
  name VARCHAR(40) NOT NULL
);
CREATE TABLE employees (
  id            INT PRIMARY KEY,
  name          VARCHAR(40) NOT NULL,
  department_id INT NOT NULL REFERENCES departments (id)   -- the foreign key is on the "N" side
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'new department', try_it($q$INSERT INTO departments VALUES (1, 'Development')$q$));
INSERT INTO results VALUES (2, 'employee in existing department', try_it($q$INSERT INTO employees VALUES (1, 'Anna Kiss', 1)$q$));
INSERT INTO results VALUES (3, 'employee in non-existent department', try_it($q$INSERT INTO employees VALUES (2, 'Bela Nagy', 99)$q$));
INSERT INTO results VALUES (4, 'employee without department', try_it($q$INSERT INTO employees VALUES (3, 'Cili Toth', NULL)$q$));
SELECT * FROM results ORDER BY seq;
```

**3.** **Why is the date type good?** Use SQL to compute how many days pass between **1 March 2025** and **24 December 2025**! (The difference of two `DATE`s is an integer: the number of days. With dates stored as text this wouldn't work.)

```sql starter
SELECT '2025-12-24', '2025-03-01';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT DATE '2025-12-24' - DATE '2025-03-01' AS days;
```

</details>

**4.** **Uniqueness.** Create the `users` table: `id` key; `email` at most 80 characters, **mandatory and unique**; `born` a date **before 1 January 2010** (only adults may register – simplified).

```sql starter
CREATE TABLE users (
  id INT PRIMARY KEY
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE users (
  id    INT PRIMARY KEY,
  email VARCHAR(80) NOT NULL UNIQUE,
  born  DATE CHECK (born < DATE '2010-01-01')
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'valid row', try_it($q$INSERT INTO users VALUES (1, 'anna@example.com', '2004-05-06')$q$));
INSERT INTO results VALUES (2, 'e-mail taken', try_it($q$INSERT INTO users VALUES (2, 'anna@example.com', '2003-01-01')$q$));
INSERT INTO results VALUES (3, 'too young', try_it($q$INSERT INTO users VALUES (3, 'kid@example.com', '2015-01-01')$q$));
INSERT INTO results VALUES (4, 'no e-mail', try_it($q$INSERT INTO users VALUES (4, NULL, '2000-01-01')$q$));
SELECT * FROM results ORDER BY seq;
```
