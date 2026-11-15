---
title: The SQL Language and Managing Tables
summary: The history and standards of SQL, the language's writing rules (keywords, quotes, comments), and the DDL statements – CREATE TABLE with a foreign key, ALTER TABLE, DROP TABLE – tried out in the browser.
minutes: 25
---

## What you will learn

- where **SQL** comes from and why almost every database speaks it,
- the language's **writing rules**,
- the **DDL** statements that manage structure: `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`.

## A bit of history

SQL (_Structured Query Language_, pronounced "ess-cue-ell" or "sequel") was born at IBM in the 1970s, based on Codd's relational model. It has been a **standard** since 1986 (ANSI, then ISO) and keeps growing (SQL-92, SQL:1999, …, SQL:2023). That is why the basics **work the same in every relational DBMS** – what you learn here in PostgreSQL works in MySQL, SQL Server or SQLite too. Systems differ in small extensions (these are "dialects").

## Writing rules

- **Keywords** can be written in upper or lower case (`SELECT` = `select`); by convention uppercase, so they stand out from names.
- **Text** goes in single quotes: `'Budapest'`. Double quotes (`"…"`) are for **names** (rarely needed).
- A statement ends with a **semicolon**.
- **Comments**: `-- single line` or `/* multi-line */`.
- Line breaks and spaces are free – write so that it's readable!

## Creating tables with a foreign key

You already created a table in topic 2. Now we connect two: the `REFERENCES` keyword makes a column a **foreign key**.

```sql run
CREATE TABLE departments (
  department_id INT PRIMARY KEY,
  name          VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE lecturers (
  lecturer_id   INT PRIMARY KEY,
  name          VARCHAR(60) NOT NULL,
  department_id INT REFERENCES departments (department_id)
);

INSERT INTO departments VALUES (1, 'Computer Science'), (2, 'Mathematics');
INSERT INTO lecturers VALUES (10, 'Dr. Peter Sample', 1), (11, 'Dr. Mary Example', 2);
SELECT * FROM lecturers;
```

Try it (Edit): insert a lecturer with the non-existent department `99`! PostgreSQL rejects it, because it would break **referential integrity**.

Order matters: the **referenced** table (`departments`) must exist first, and when dropping it's the other way round – you can't drop the departments while lecturers refer to them.

## Changing a table: ALTER TABLE

A live database's structure changes over time. You don't need to recreate the table (with its data); just alter it:

```sql
ALTER TABLE students ADD COLUMN email VARCHAR(120);        -- new column
ALTER TABLE students DROP COLUMN email;                     -- drop a column
ALTER TABLE students RENAME COLUMN city TO hometown;        -- rename
ALTER TABLE students ALTER COLUMN name TYPE VARCHAR(100);   -- change type
ALTER TABLE students ADD CONSTRAINT semester_ok CHECK (semester BETWEEN 1 AND 14);
```

## Deleting a table: DROP TABLE

`DROP TABLE lecturers;` – the table **and all its data** are gone, with no undo (unless you're inside a transaction, see topic 8). Think twice on a live system! `DROP TABLE IF EXISTS lecturers;` gives no error if the table doesn't exist.

It has a faster relative: `TRUNCATE lecturers;` deletes every **row** but keeps the table's structure.

## The database knows about itself

By Codd's rule, structure can also be queried as tables. The standard `information_schema` shows, for example, a table's columns:

```sql run
CREATE TABLE sample (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL, note TEXT);
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'sample'
ORDER BY ordinal_position;
```

## Summary

- SQL is standard: the basics work in every relational DBMS.
- Text in `'…'`, `;` at the end of a statement, comments with `--`.
- DDL: `CREATE TABLE` (foreign key: `REFERENCES`), `ALTER TABLE`, `DROP TABLE`, `TRUNCATE`.

## Lesson exercise

Extend the university sample database (the tables already exist).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

1. Add an `email` column to the `students` table (text of at most 120 characters, `VARCHAR(120)`).
2. Create a `lecturers` table: `lecturer_id` integer, primary key; `name` text of at most 60 characters, required; `department` text of at most 40 characters (optional).

The checker uses `information_schema` to check the columns of the two tables.

```sql starter required
-- 1. new column in the students table

-- 2. the lecturers table
CREATE TABLE lecturers (

);
```

<details>
<summary>Solution</summary>

```sql solution
ALTER TABLE students ADD COLUMN email VARCHAR(120);

CREATE TABLE lecturers (
  lecturer_id INT PRIMARY KEY,
  name        VARCHAR(60) NOT NULL,
  department  VARCHAR(40)
);
```

</details>

```sql test
SELECT table_name, column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('students', 'lecturers')
ORDER BY table_name, ordinal_position;
```
