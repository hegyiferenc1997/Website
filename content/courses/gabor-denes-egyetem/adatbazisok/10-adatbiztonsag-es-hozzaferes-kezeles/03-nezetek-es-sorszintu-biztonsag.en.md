---
title: Views and Row-Level Security
summary: How to show only certain columns (views as a security layer), how to let every user see only their own rows (row-level security, RLS), and how to log important changes with a trigger.
minutes: 28
---

## What you will learn

- how to hide **columns** with a **view**,
- how to restrict who can see **which rows** (**row-level security**, RLS),
- how to build a simple **audit log** of changes.

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## A view as a security layer

The `students` table also contains the date of birth and the city – these are personal data. A public list of names doesn't need them. The solution: a **view** that shows only the needed columns, and we grant the privilege **on the view**, not on the table.

```sql run
CREATE VIEW students_list AS
  SELECT neptun, name, major FROM students;

CREATE ROLE guest;
GRANT SELECT ON students_list TO guest;      -- on the view: yes
                                              -- on the table: no!
SET ROLE guest;
SELECT * FROM students_list ORDER BY neptun;
RESET ROLE;
```

The guest sees the list of names, but if you change the query in the editor to `SELECT * FROM students;`, the answer is **permission denied**: they can't get to the dates of birth.

> Analogy: a view is like a shop window. Customers see what's on display, but they can't walk into the storeroom.

A view can filter **rows** too, for example only computer engineering students:

```sql run
CREATE VIEW comp_eng_students AS
  SELECT neptun, name, semester FROM students WHERE major = 'computer engineering';

SELECT * FROM comp_eng_students ORDER BY neptun;
```

## Row-level security (RLS)

What if everyone uses the **same** table, but everyone may only see **their own** rows? For example in a web shop, every customer sees only their own orders. We don't want to write a thousand views – this is what **row-level security** (RLS) is for.

Two steps:

1. switch it on for the table: `ALTER TABLE … ENABLE ROW LEVEL SECURITY;`
2. define one or more **policies** that decide whether a row is visible.

In the example below, students can see only **their own enrollments**. The role name is the Neptun code in lowercase, and the policy compares `current_user` (the name of the logged-in role) with the row's Neptun code:

```sql run
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_enrollment ON enrollments
  FOR SELECT
  USING (neptun = UPPER(current_user));

CREATE ROLE abc123;                          -- Anna Kiss's role
GRANT SELECT ON enrollments TO abc123;

SET ROLE abc123;
SELECT * FROM enrollments;                   -- only Anna's rows!
RESET ROLE;
```

Anna wrote the same `SELECT * FROM enrollments` query, yet got an answer with only her own rows. The DBMS adds the policy to **every** query automatically – the application can't "forget" a `WHERE` condition.

- `USING (…)`: which **existing** rows they can see, update or delete.
- `WITH CHECK (…)`: which **new** or modified rows they may write (e.g. so they can't insert in someone else's name).
- The table owner and the superuser bypass the policies by default – that's why the application must not run as a superuser!

## Auditing with a trigger

Who changed the grades, and when? A **trigger** (a function that runs on an event) can write a row into a log table on every change:

```sql run
CREATE TABLE grade_log (
  changed_at TIMESTAMP DEFAULT now(),
  changed_by TEXT DEFAULT current_user,
  neptun     CHAR(6),
  code       VARCHAR(6),
  old_grade  INT,
  new_grade  INT
);

CREATE FUNCTION log_grade() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO grade_log (neptun, code, old_grade, new_grade)
  VALUES (OLD.neptun, OLD.code, OLD.grade, NEW.grade);
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER grade_change AFTER UPDATE OF grade ON enrollments
  FOR EACH ROW EXECUTE FUNCTION log_grade();

UPDATE enrollments SET grade = 4 WHERE neptun = 'DEF456' AND code = 'ADB';
SELECT changed_by, neptun, code, old_grade, new_grade FROM grade_log;
```

Ordinary users shouldn't get `UPDATE` and `DELETE` privileges on the log table – that way the tracks can't be erased.

## Summary

- View: only the needed columns and rows; the privilege is on the view, not on the table.
- RLS: `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY … USING (…)`; added to every query automatically.
- The application shouldn't run as a superuser (that would bypass the policies).
- Trigger + log table: who changed what, and when.

## The lesson's exercise

On the faculty's website a **guest** role (`guest`) displays the list of students. The starter code already creates the role.

1. Create a **view** called `students_public` that shows **only** the `neptun`, `name` and `major` columns of the `students` table (in this order).
2. Give the `guest` role **read** privilege on the view – but **not** on the `students` table!

The checker verifies the view's columns and the guest's privileges.

```sql starter required
CREATE ROLE guest;

-- 1. the view

-- 2. the privilege
```

<details>
<summary>Solution</summary>

```sql solution
CREATE ROLE guest;

CREATE VIEW students_public AS
  SELECT neptun, name, major FROM students;

GRANT SELECT ON students_public TO guest;
```

</details>

```sql test
SELECT (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
          FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'students_public') AS view_columns,
       has_table_privilege('guest', to_regclass('students_public'), 'SELECT') AS reads_view,
       has_table_privilege('guest', 'students', 'SELECT') AS reads_table;
```
