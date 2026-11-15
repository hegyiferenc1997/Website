---
title: Roles, GRANT and REVOKE
summary: Creating roles (CREATE ROLE), granting and revoking privileges (GRANT, REVOKE) on tables and columns, nesting roles, WITH GRANT OPTION, and checking privileges – all on a PostgreSQL running in your browser.
minutes: 28
---

## What you will learn

- how to create a **role** (`CREATE ROLE`),
- how to grant and revoke **privileges** (`GRANT`, `REVOKE`), even at column level,
- how to put a user into a **group**,
- how to **check** who has which privilege.

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

In this lesson you are the **owner** of the database (superuser), and you hand out privileges to the others.

## Creating a role

```sql
CREATE ROLE analyst;                        -- group: can't log in
CREATE ROLE anna_kiss LOGIN PASSWORD '…';   -- user: can log in
```

In PostgreSQL both are **roles**; the only difference is the `LOGIN` flag. (In real life you never write a password into code that others can see!)

## Granting privileges: GRANT

Its form: `GRANT privilege(s) ON table TO role;`

| Privilege    | What does it allow?           |
| ------------ | ----------------------------- |
| `SELECT`     | reading                       |
| `INSERT`     | inserting a new row           |
| `UPDATE`     | modifying an existing row     |
| `DELETE`     | deleting a row                |
| `ALL`        | all of these (and a few more) |

```sql run
CREATE ROLE analyst;
GRANT SELECT ON students, courses, enrollments TO analyst;

SELECT has_table_privilege('analyst', 'students', 'SELECT') AS can_read,
       has_table_privilege('analyst', 'students', 'DELETE') AS can_delete;
```

The `has_table_privilege(role, table, privilege)` function tells you whether the privilege exists. The analyst can read but can't delete.

## Try it "through someone else's eyes": SET ROLE

With the `SET ROLE` statement you can turn into another role and see what it sees:

```sql run
CREATE ROLE analyst;
GRANT SELECT ON students TO analyst;

SET ROLE analyst;
SELECT current_user AS who_am_i, neptun, name FROM students ORDER BY neptun LIMIT 3;
RESET ROLE;
```

Experiment: click edit, and replace the `SELECT` with a `DELETE FROM students;` statement. PostgreSQL answers: **permission denied for table students** – authorization works!

## Column-level privileges

You don't have to grant privileges on a whole table. For example, a lecturer may change the **grade**, but not the student's Neptun code or the course code:

```sql run
CREATE ROLE lecturer;
GRANT SELECT ON enrollments TO lecturer;
GRANT UPDATE (grade) ON enrollments TO lecturer;

SELECT has_column_privilege('lecturer', 'enrollments', 'grade', 'UPDATE')  AS can_write_grade,
       has_column_privilege('lecturer', 'enrollments', 'neptun', 'UPDATE') AS can_write_neptun;
```

## Revoking privileges: REVOKE

`REVOKE` is the opposite of `GRANT`: `REVOKE privilege ON table FROM role;`

```sql run
CREATE ROLE intern;
GRANT ALL ON students TO intern;              -- oops, too much
REVOKE INSERT, UPDATE, DELETE ON students FROM intern;

SELECT has_table_privilege('intern', 'students', 'SELECT') AS can_read,
       has_table_privilege('intern', 'students', 'DELETE') AS can_delete;
```

## Groups: a role inside a role

The **group** gets the privileges, and the user becomes a member of the group and **inherits** them:

```sql run
CREATE ROLE lecturer;
GRANT SELECT ON students, courses, enrollments TO lecturer;
GRANT UPDATE (grade) ON enrollments TO lecturer;

CREATE ROLE peter_kovacs LOGIN;
GRANT lecturer TO peter_kovacs;    -- Peter joins the lecturers' group

SELECT pg_has_role('peter_kovacs', 'lecturer', 'MEMBER') AS is_member,
       has_column_privilege('peter_kovacs', 'enrollments', 'grade', 'UPDATE') AS can_write_grade;
```

Peter didn't get a single privilege directly, yet he can change grades – he inherited it from the group. If Peter leaves, a single `REVOKE lecturer FROM peter_kovacs;` is enough.

## Passing privileges on: WITH GRANT OPTION

```sql
GRANT SELECT ON courses TO head_of_department WITH GRANT OPTION;
```

This way the head of department **can pass on** the read privilege to others. Be careful with it: the privilege can slip out of your hands. When revoking, `REVOKE … CASCADE` also revokes the privileges that were passed on.

## Default privileges

- The **owner** of an object (e.g. a table) can do anything with it, and can grant privileges.
- Every other role can do **nothing** with a table until it gets a privilege.
- There's a special `PUBLIC` group that **everyone** belongs to. `GRANT … TO PUBLIC` = to everyone – be very careful with it!

## Summary

- `CREATE ROLE name [LOGIN]` – a role (group or user).
- `GRANT privilege ON table TO role` / `REVOKE privilege ON table FROM role`.
- Column-level privilege: `GRANT UPDATE (column) ON table TO …`.
- `GRANT group TO user` – membership, privileges are inherited.
- Checking: `has_table_privilege`, `has_column_privilege`, `pg_has_role`.

## The lesson's exercise

The university creates a **registrar** role (`registrar`) – the starter code already creates it. Set up its privileges following the principle of least privilege:

- it may **read** the `students` and `enrollments` tables,
- in the `enrollments` table it may change **only the `grade` column**,
- it **can't delete** anything.

The checker verifies the privileges with the `has_table_privilege` and `has_column_privilege` functions.

```sql starter required
CREATE ROLE registrar;

-- write the GRANT statements here
```

<details>
<summary>Solution</summary>

```sql solution
CREATE ROLE registrar;

GRANT SELECT ON students, enrollments TO registrar;
GRANT UPDATE (grade) ON enrollments TO registrar;
```

</details>

```sql test
SELECT has_table_privilege('registrar', 'students', 'SELECT')                 AS students_read,
       has_table_privilege('registrar', 'enrollments', 'SELECT')              AS enrollments_read,
       has_column_privilege('registrar', 'enrollments', 'grade', 'UPDATE')    AS grade_update,
       has_column_privilege('registrar', 'enrollments', 'neptun', 'UPDATE')   AS neptun_update,
       has_table_privilege('registrar', 'enrollments', 'DELETE')              AS enrollment_delete,
       has_table_privilege('registrar', 'students', 'DELETE')                 AS student_delete;
```
