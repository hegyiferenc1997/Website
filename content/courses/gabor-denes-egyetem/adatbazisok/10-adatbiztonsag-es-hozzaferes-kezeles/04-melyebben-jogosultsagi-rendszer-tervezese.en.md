---
title: Deeper – Designing a Permission System for a Real Application
summary: Building a CRUD matrix per role, the principles of least privilege and separation of duties, separating the owner from the application account, revoking PUBLIC rights, a controlled "gateway" with a SECURITY DEFINER function, auditing with a trigger, and the most common permission mistakes – with runnable examples.
minutes: 40
---

## What you will learn in this lesson

- how to design permissions **methodically**, using a CRUD matrix,
- what the principles of **least privilege** and **separation of duties** mean in practice,
- why the application should not be the **owner** of the database,
- how to grant controlled access through a **SECURITY DEFINER** function,
- how to **audit** who changed what,
- the most common **mistakes** that lead to real incidents.

## The sample database

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. Paper first: the CRUD matrix

Before writing a single `GRANT`, make a table: **roles** as rows, **tables** as columns, and in each cell what that role may do: **C**reate (INSERT), **R**ead (SELECT), **U**pdate, **D**elete.

| Role                  | students | courses | enrollments       |
| --------------------- | -------- | ------- | ----------------- |
| student (application) | R (own)  | R       | C, R (own)        |
| lecturer              | R        | R       | R, U (grade only) |
| registrar's office    | C, R, U  | C, R, U | C, R, U           |
| statistician          | –        | R       | R (without names) |
| DBA / migration       | all      | all     | all               |

The `GRANT` statements follow almost mechanically from this table – and even a non-technical manager can read and approve it. **This is the most important step:** permissions are a business decision, not a technical detail.

Notice: **D (delete)** appears almost nowhere. In a student records system we rarely delete – we mark a "withdrawn" status instead, so the past stays traceable.

## 2. Two principles

### The principle of least privilege

Everyone gets **exactly** the rights their work requires – no more. If an account is compromised, the damage is as large as the account's rights.

**Analogy:** the cleaner's key opens the corridors and offices, but not the safe. If they lose the key, the safe stays secure.

### Separation of duties

Critical operations should require **two different** actors. For example: whoever enters a grade (lecturer) shouldn't be able to delete the log (DBA); whoever transfers money shouldn't be the one approving it. This way a single person (or a single compromised account) can't abuse the system without a trace.

## 3. Owner ≠ application

A common, dangerous pattern: the web application connects with the same account that created the tables (or worse: with the `postgres` superuser). Then, in case of an SQL injection bug (topic 15), the attacker can do **anything**: `DROP TABLE`, read all data, and with some configurations even run commands on the server.

The correct setup:

| Account     | Purpose                                  | Rights                                   |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| `app_owner` | schema owner, used only for migrations   | CREATE, ALTER, DROP – on its own objects |
| `app_user`  | the running application connects with it | only DML per the CRUD matrix             |
| `readonly`  | reports, analysts                        | SELECT only, maybe only on views         |

```sql run
-- Separating the three accounts (groups)
CREATE ROLE app_owner;
CREATE ROLE app_user;
CREATE ROLE readonly;

-- The application can only read and record enrollments
GRANT SELECT ON students, courses, enrollments TO app_user;
GRANT INSERT ON enrollments TO app_user;
-- The reporting account only reads
GRANT SELECT ON courses, enrollments TO readonly;

-- Check: a small matrix with has_table_privilege
SELECT r.role_name, t.table_name,
       has_table_privilege(r.role_name, t.table_name, 'SELECT') AS r,
       has_table_privilege(r.role_name, t.table_name, 'INSERT') AS c,
       has_table_privilege(r.role_name, t.table_name, 'UPDATE') AS u,
       has_table_privilege(r.role_name, t.table_name, 'DELETE') AS d
FROM (VALUES ('app_user'), ('readonly')) AS r(role_name)
CROSS JOIN (VALUES ('students'), ('courses'), ('enrollments')) AS t(table_name)
ORDER BY r.role_name, t.table_name;
```

This query is the **CRUD matrix** itself – you can verify the table back from the database and compare it with the one approved on paper.

### The PUBLIC trap

In PostgreSQL every role is a member of an invisible `PUBLIC` group. Whatever is allowed to `PUBLIC` is allowed to **everyone**. In older versions, for example, anyone could create tables in the `public` schema. A safe default for a new database:

```sql
REVOKE ALL ON SCHEMA public FROM PUBLIC;            -- nobody may create anything in it
GRANT USAGE ON SCHEMA public TO app_user, readonly; -- only designated roles may see it
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
```

With `ALTER DEFAULT PRIVILEGES` you can define rights for new tables in advance, so you won't forget them after a migration.

## 4. A controlled gateway: a SECURITY DEFINER function

Sometimes a rule **can't** be expressed with a simple permission: _"A student may enroll in courses, but in at most 3."_ If the application has `INSERT` rights, it can insert as many as it likes. The solution: the application **gets no** direct write right, but may only call a **function** that checks and writes with the owner's rights.

**Analogy:** in a bank you don't walk into the vault; you go to the teller, who checks your identity and balance, and they go to the vault.

```sql run
CREATE ROLE student_app;   -- has no table rights at all!

CREATE FUNCTION enroll(p_neptun CHAR(6), p_code VARCHAR(6)) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER            -- the function runs with its OWNER's rights
SET search_path = public    -- security: prevents "hijacking" with a fake table
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM enrollments WHERE neptun = p_neptun) >= 3 THEN
    RETURN 'rejected: at most 3 courses allowed';
  END IF;
  INSERT INTO enrollments (neptun, code) VALUES (p_neptun, p_code);
  RETURN 'enrolled successfully';
END $$;

REVOKE ALL ON FUNCTION enroll FROM PUBLIC;          -- nobody by default
GRANT EXECUTE ON FUNCTION enroll TO student_app;    -- only the application

SET ROLE student_app;
SELECT enroll('BCD234', 'ADB') AS bela,   -- has 2 courses → succeeds
       enroll('ABC123', 'MAT') AS anna;   -- already has 3 → rejected
RESET ROLE;
```

The `student_app` role has no rights on any table, yet it can enroll – but **only** according to the function's rules. Try it: after `SET ROLE`, write a direct `INSERT INTO enrollments …` – **permission denied**.

Two security rules for SECURITY DEFINER functions:

1. always set `SET search_path`, otherwise an attacker could "hijack" the function with a same-named table created in their own schema;
2. revoke `PUBLIC`'s execute right and grant it only to the designated role.

## 5. Who did it? – auditing with a trigger

Permissions **prevent**, the log **detects**. A trigger automatically records who changed what and when, on every modification:

```sql run
CREATE TABLE audit_log (
  at_time   TIMESTAMP DEFAULT now(),
  who       TEXT DEFAULT current_user,
  operation TEXT,
  old_row   TEXT,
  new_row   TEXT
);

CREATE FUNCTION grade_auditor() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_log (operation, old_row, new_row)
  VALUES (TG_OP, row_to_json(OLD)::TEXT, row_to_json(NEW)::TEXT);
  RETURN NEW;
END $$;

CREATE TRIGGER enrollment_audit
AFTER UPDATE ON enrollments
FOR EACH ROW EXECUTE FUNCTION grade_auditor();

UPDATE enrollments SET grade = 5 WHERE neptun = 'BCD234' AND code = 'PROG';

SELECT who, operation, old_row, new_row FROM audit_log;
```

Everyday roles should get only `INSERT` on the log table (through the trigger), and **nobody** should be able to update or delete it – so traces can't be erased. (In real systems the log is often forwarded to a separate server too.)

## 6. Mistakes that lead to real incidents

| Mistake                                             | Consequence                                             | The right way                                  |
| --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| the application connects as a superuser             | one SQL injection = complete takeover                   | a separate `app_user` with DML rights only     |
| a shared account for several people ("admin/admin") | can't tell who did it; can't revoke one person's access | personal accounts, group roles                 |
| a departed employee's account stays active          | a former employee has access                            | on/offboarding process, regular access reviews |
| `GRANT ALL` "to make it work"                       | violates least privilege                                | rights derived from the CRUD matrix            |
| password in the source code                         | leaking the code leaks the password                     | environment variable, secret manager           |
| database port open to the internet                  | password-guessing attacks                               | firewall, reachable only from the app server   |

## Summary

- Design with a **CRUD matrix**: role × table → C, R, U, D. Permissions are a business decision.
- **Least privilege** and **separation of duties**.
- Separate the **owner** (migrations) from the **application account** (DML only); revoke unnecessary `PUBLIC` rights.
- For rules that permissions can't express: a **SECURITY DEFINER** function with `SET search_path` and a restricted `EXECUTE` right.
- **Audit** with a trigger; nobody should be able to modify the log.

## Exercise

Implement the "statistician" row of the CRUD matrix! Create the `statistician` role, which:

- may **read** the `courses` table **in full**;
- may read **only the `code` and `grade` columns** of `enrollments` (not the student ID – so grades can't be tied to names);
- has **no** rights at all on the `students` table, and can't write anywhere.

The check examines the rights with the `has_table_privilege` and `has_column_privilege` functions.

```sql starter required
CREATE ROLE statistician;
-- Grant the rights!
```

<details>
<summary>Solution</summary>

```sql solution
CREATE ROLE statistician;
GRANT SELECT ON courses TO statistician;
GRANT SELECT (code, grade) ON enrollments TO statistician;
```

</details>

```sql test
SELECT has_table_privilege('statistician', 'courses', 'SELECT')                AS courses_read,
       has_table_privilege('statistician', 'courses', 'INSERT')                AS courses_write,
       has_column_privilege('statistician', 'enrollments', 'code', 'SELECT')   AS code_read,
       has_column_privilege('statistician', 'enrollments', 'grade', 'SELECT')  AS grade_read,
       has_column_privilege('statistician', 'enrollments', 'neptun', 'SELECT') AS neptun_read,
       has_table_privilege('statistician', 'students', 'SELECT')               AS students_read,
       has_column_privilege('statistician', 'enrollments', 'grade', 'UPDATE')  AS grade_write;
```
