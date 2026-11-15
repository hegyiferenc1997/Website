---
title: Practice – Data Modelling
summary: Review questions and a summary worksheet on modelling levels, the modelling steps, data types and constraints.
minutes: 20
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
