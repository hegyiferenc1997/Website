---
title: Practice – Data Security
summary: Review questions about authentication, privileges, views and row-level security, then implementing a complete privilege plan in SQL: a group, a user, a column-level privilege and revoking an overly generous privilege.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between authentication and authorization?</summary>

Authentication checks **who you are** (e.g. with a password). Authorization decides **what** the identified user **may do** (e.g. whether they may read a table).

</details>

<details>
<summary>2. Why is it better to assign privileges to roles rather than directly to users?</summary>

Because when a rule changes you only have to change it in one place, and when a colleague arrives or leaves it's enough to grant or remove the group membership. There are fewer mistakes, and it's clearer who has which privilege.

</details>

<details>
<summary>3. How would you let an application see the students' names but not their dates of birth?</summary>

With a view that contains only the needed columns (`CREATE VIEW … AS SELECT neptun, name …`), and I grant the application's role `SELECT` only on the view, not on the table. (A column-level `GRANT SELECT (neptun, name)` works too.)

</details>

<details>
<summary>4. What is row-level security (RLS) good for compared to views?</summary>

If many users use the same table but everyone may see only their own rows, a single policy (`CREATE POLICY`) is enough, and the DBMS adds it to every query automatically. You don't have to write a view per user, and the application can't forget a `WHERE` condition either.

</details>

<details>
<summary>5. Why is it dangerous for a web application to connect to the database as a superuser?</summary>

Because if the application has a bug (e.g. SQL injection, topic 15), the attacker can do anything: drop tables, download all data, and bypass the row-level policies too. Following the principle of least privilege, the application should only get privileges on the tables and operations it needs.

</details>

## The practice exercise

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Implement the university's privilege plan! The first two lines of the starter code are the **current state**: long ago someone gave the intern every privilege. Keep these two lines, and write the rest below them:

1. Create the `lecturer` **group** (can't log in). It may read the `students`, `courses` and `enrollments` tables, and in the `enrollments` table it may change **only the `grade`** column.
2. Create the user `peter_kovacs` (can log in), and make him a member of the `lecturer` group.
3. The `intern` may only **read** the `students` table: revoke the insert, update and delete privileges.

The checker looks at the result in the system catalog (`pg_roles`, `pg_auth_members`) and with the privilege-checking functions.

```sql starter required
CREATE ROLE intern;
GRANT ALL ON students TO intern;

-- 1. the lecturer group and its privileges

-- 2. peter_kovacs

-- 3. narrowing the intern's privileges
```

<details>
<summary>Solution</summary>

```sql solution
CREATE ROLE intern;
GRANT ALL ON students TO intern;

-- 1. the lecturer group and its privileges
CREATE ROLE lecturer;
GRANT SELECT ON students, courses, enrollments TO lecturer;
GRANT UPDATE (grade) ON enrollments TO lecturer;

-- 2. peter_kovacs
CREATE ROLE peter_kovacs LOGIN;
GRANT lecturer TO peter_kovacs;

-- 3. narrowing the intern's privileges
REVOKE INSERT, UPDATE, DELETE ON students FROM intern;
```

</details>

```sql test
WITH r AS (
  SELECT (SELECT oid FROM pg_roles WHERE rolname = 'lecturer')     AS lecturer,
         (SELECT oid FROM pg_roles WHERE rolname = 'peter_kovacs') AS peter,
         (SELECT oid FROM pg_roles WHERE rolname = 'intern')       AS intern
)
SELECT (SELECT rolcanlogin FROM pg_roles WHERE oid = r.lecturer)              AS lecturer_login,
       (SELECT rolcanlogin FROM pg_roles WHERE oid = r.peter)                 AS peter_login,
       EXISTS (SELECT 1 FROM pg_auth_members
                WHERE roleid = r.lecturer AND member = r.peter)               AS peter_lecturer,
       has_table_privilege(r.lecturer, 'students', 'SELECT')
         AND has_table_privilege(r.lecturer, 'courses', 'SELECT')
         AND has_table_privilege(r.lecturer, 'enrollments', 'SELECT')         AS lecturer_read,
       has_column_privilege(r.lecturer, 'enrollments', 'grade', 'UPDATE')     AS lecturer_grade,
       has_table_privilege(r.lecturer, 'enrollments', 'UPDATE')               AS lecturer_whole_row,
       has_column_privilege(r.peter, 'enrollments', 'grade', 'UPDATE')        AS peter_grade,
       has_table_privilege(r.intern, 'students', 'SELECT')                    AS intern_read,
       has_table_privilege(r.intern, 'students', 'INSERT')
         OR has_table_privilege(r.intern, 'students', 'UPDATE')
         OR has_table_privilege(r.intern, 'students', 'DELETE')               AS intern_write
FROM r;
```
