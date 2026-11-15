---
title: From the E-R Model to Tables
summary: The mapping rules step by step – entity set, composite, multivalued and derived attributes, 1:1, 1:N and N:M relationships, weak entities and recursive relationships – with runnable SQL examples.
minutes: 25
---

## What you will learn

- how an E-R diagram becomes a **relational schema** (tables),
- **where the foreign key goes** for each relationship type,
- when you need a **new table**.

## The mapping rules

Turning an E-R diagram into tables is almost **mechanical** – that's part of its appeal. Seven rules are enough:

**1. Entity set → table.** Attributes become columns, the key becomes the primary key.

**2. Composite attribute → its parts become separate columns.** Instead of `address`: `postcode`, `city`, `street`.

**3. Derived attribute → usually not stored.** Age is computed from the date of birth at query time.

**4. Multivalued attribute → separate table.** E.g. `student_phones(neptun, phone)`, keyed by both together.

**5. 1 : N relationship → foreign key on the "many" side.** Every lecturer row gets a `department_id`. (The other way round wouldn't work: we can't put many lecturers into one cell of the department row.)

**6. N : M relationship → new junction table.** Both entities' keys go in as foreign keys, together they form the primary key, and the relationship's attributes (e.g. `grade`) go here too. This is exactly how the sample database's `enrollments` table was made.

**7. 1 : 1 relationship → foreign key on either side, with `UNIQUE`.** Preferably on the entity that participates **mandatorily** (so there won't be many NULLs). If both sides are mandatory, the two tables can even be merged.

Additions:

- **Weak entity** → a table whose key is the owner's key + the partial key: `rooms(building_id, room_no, capacity)`.
- **Recursive 1 : N relationship** → a foreign key to **its own** table: `employees(id, name, boss_id REFERENCES employees(id))`.

## A complete example

E-R description: _A department employs many lecturers (1:N, mandatory). Lecturers teach courses; a course can be taught by several lecturers, a lecturer can teach several courses (N:M), and we record in which semester. A lecturer can have several email addresses (multivalued)._

```text
 departments(department_id PK, name)
 lecturers(lecturer_id PK, name, department_id FK → departments)        ← rule 5
 lecturer_emails(lecturer_id FK → lecturers, email, PK(lecturer_id, email)) ← rule 4
 courses(code PK, name, credits)
 teaches(lecturer_id FK → lecturers, code FK → courses, semester,         ← rule 6
         PK(lecturer_id, code, semester))
```

```sql run
CREATE TABLE departments (department_id INT PRIMARY KEY, name VARCHAR(60) NOT NULL);
CREATE TABLE lecturers (
  lecturer_id   INT PRIMARY KEY,
  name          VARCHAR(60) NOT NULL,
  department_id INT NOT NULL REFERENCES departments (department_id)
);
CREATE TABLE lecturer_emails (
  lecturer_id INT REFERENCES lecturers (lecturer_id),
  email       VARCHAR(120),
  PRIMARY KEY (lecturer_id, email)
);
CREATE TABLE courses (code VARCHAR(6) PRIMARY KEY, name VARCHAR(60) NOT NULL, credits INT NOT NULL);
CREATE TABLE teaches (
  lecturer_id INT REFERENCES lecturers (lecturer_id),
  code        VARCHAR(6) REFERENCES courses (code),
  semester    VARCHAR(9),
  PRIMARY KEY (lecturer_id, code, semester)
);

INSERT INTO departments VALUES (1, 'Computer Science');
INSERT INTO lecturers VALUES (10, 'Dr. Peter Sample', 1);
INSERT INTO lecturer_emails VALUES (10, 'sample@university.edu'), (10, 'peter.sample@gmail.com');
INSERT INTO courses VALUES ('ADB', 'Databases', 5);
INSERT INTO teaches VALUES (10, 'ADB', '2026/27/1');

SELECT l.name, e.email FROM lecturers l JOIN lecturer_emails e ON e.lecturer_id = l.lecturer_id;
```

## Common mistakes

- **A list in a cell** (`'sample@university.edu, peter@gmail.com'`): you can't search it and it can't be unique. Multivalued attribute → separate table.
- **The foreign key on the wrong side** of a 1 : N relationship.
- **An N : M relationship without a junction table** – nowhere to record who took which course.
- **Storing derived data** (age, order total) without updating it – sooner or later it contradicts the source data.

## Summary

- Entity set → table; composite → part columns; multivalued → separate table; derived → not stored.
- 1 : N → FK on the "many" side; N : M → junction table; 1 : 1 → FK with `UNIQUE` (on the mandatory side).
- Weak entity → composite key including the owner's key; recursive → FK to its own table.

## Lesson exercise

```quiz required
? In a 1 : N relationship (one customer – many orders), which table gets the foreign key?
- the customers table
+ the orders table
- a new junction table
- both
! The "many" side: every order knows whose it is.

? What does an N : M relationship become?
- a foreign key in one of the tables
+ a new junction table with the two keys
- a multivalued attribute
- nothing, it needn't be stored
! E.g. enrollments(neptun, code, grade).

? An E-R diagram has 4 entity sets, two 1 : N relationships and one N : M relationship (no multivalued attributes). How many tables will there be?
= 5
! 4 entity sets + 1 junction table; the 1 : N relationships only add foreign keys.

? How do you store a student's **several** phone numbers?
- in one text cell, separated by commas
- in phone1, phone2, phone3 columns
+ in a separate table (neptun, phone)
- not at all
! Multivalued attribute → separate table.

? An employee has one boss who is also an employee. Which table does the `boss_id` foreign key refer to?
= employees
= employee
= itself
= its own
! Recursive relationship: the table refers to itself.
```
