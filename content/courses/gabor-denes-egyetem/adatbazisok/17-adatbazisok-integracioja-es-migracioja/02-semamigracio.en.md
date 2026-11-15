---
title: Schema Migrations
summary: How to change the schema of a live database safely: migration files and versioning (Flyway, Alembic, Prisma), stepping up and down, dangerous and safe changes, and the "expand, then contract" pattern for introducing a required column with zero downtime.
minutes: 28
---

## What you will learn

- what a **schema migration** is, and why the schema has to be **versioned**,
- how **migration tools** work,
- which schema changes are **dangerous** on a live system,
- how to introduce a required column **in steps**, with zero downtime.

## Why version the schema too?

We version the program's code with git – but what about the database? If every developer runs `ALTER TABLE`s by hand on their own machine, on the test server and in production, soon nobody knows what the schema looks like in which environment. The result: "works on my machine", and crashes in production.

The solution is **schema migrations**: every schema change is a **numbered file** that goes into the git repository together with the code:

```text
migrations/
  V001__students_table.sql
  V002__courses_and_enrollments.sql
  V003__email_column.sql          ← the new change
```

A **migration tool** (e.g. **Flyway**, **Liquibase**, **Alembic** in Python, **Prisma Migrate** or **Drizzle Kit** in JavaScript) records in a **bookkeeping table** in the database which migrations have already run, and only runs the new ones – in every environment, in the same order.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

This is what such a bookkeeping table looks like (simplified):

```sql run
CREATE TABLE schema_versions (
  version     INT PRIMARY KEY,
  description TEXT NOT NULL,
  applied_at  TIMESTAMP NOT NULL DEFAULT now()
);
INSERT INTO schema_versions (version, description) VALUES
  (1, 'students table'), (2, 'courses and enrollments');

-- The tool checks where the database is, and only runs files newer than this:
SELECT MAX(version) AS current_version FROM schema_versions;
```

## Up and down

With many tools a migration has two parts:

- **up**: the change (e.g. `ALTER TABLE … ADD COLUMN`),
- **down**: undoing it (e.g. `ALTER TABLE … DROP COLUMN`), if something went wrong.

Careful: not everything can be undone without data loss. Undoing a column drop brings the column back – but not its data. So before running a migration in production **always have a fresh backup** (topic 13).

A golden rule: **never modify** a migration file that has **already run** – if it was wrong, write a new one that fixes it.

## Dangerous and safe changes

On a live system, where thousands are using the database right now, a schema change needs a **lock**. During a long lock the table is unavailable – that's effectively downtime.

| Change                                              | Risk          | Why?                                                                    |
| --------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| a new, **optional** column (`NULL` allowed)         | low           | only the catalogue changes, instant                                     |
| a new column **with a default**                     | low (in newer PostgreSQL) | the default isn't written into every row                    |
| a new column **`NOT NULL` without a default**       | **error**     | the existing rows would violate the constraint                          |
| **renaming** or **dropping** a column               | **high**      | the old program version still running breaks immediately                |
| changing a column's **type**                        | **high**      | often rewrites the whole table, with a long lock                        |
| creating an index                                   | medium        | may block writes; `CREATE INDEX CONCURRENTLY` doesn't                   |

## The "expand, then contract" pattern

How do you introduce a **required** (`NOT NULL`), **unique** column into a live table? Not in one step, but in **small, safe** steps (_expand and contract_):

```text
 1. EXPAND:    a new column, optional for now               → nothing breaks
 2. BACKFILL:  fill in the existing rows (even in batches) + the new code already writes it
 3. CONTRACT:  NOT NULL and UNIQUE constraints              → now every row has a value
```

Likewise, **renaming** a column isn't a single `RENAME`: new column → write to both → copy data → the code switches to the new one → drop the old column. Slower, but the system never stops for a moment.

```sql run
-- 1. expand: a new, optional column
ALTER TABLE students ADD COLUMN active BOOLEAN;
-- 2. backfill
UPDATE students SET active = TRUE;
-- 3. contract: default and required
ALTER TABLE students ALTER COLUMN active SET DEFAULT TRUE;
ALTER TABLE students ALTER COLUMN active SET NOT NULL;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'students' AND column_name = 'active';
```

Tip: in PostgreSQL schema changes can run **in a transaction** too (`BEGIN; … COMMIT;`) – if there's an error halfway through a migration, everything rolls back and no half-finished schema remains. (This isn't so in every DBMS: MySQL, for example, commits most schema changes immediately.)

## Summary

- Schema migrations: numbered files in the git repository, run and recorded by a tool.
- Up and down; don't modify a migration that has run; take a backup first.
- Dangerous on a live system: a required column without a default, renaming, dropping, changing types.
- "Expand, then contract": small, reversible steps, with zero downtime.

## The lesson's exercise

Write migration **V003**! The `students` table should get an `email` column (`VARCHAR(120)`), which in the end is **required** and **unique**. Follow the steps of "expand, then contract":

1. **expand**: add the column (this is already in the starter code),
2. **backfill**: every existing student's email address should be the Neptun code **in lower case**, then `@student.example.com` (e.g. `abc123@student.example.com`),
3. **contract**: `NOT NULL` and `UNIQUE`.

The checker verifies the column's type, whether it's required, whether it's unique, and a sample value.

```sql starter required
-- V003: email column for students

-- 1. expand
ALTER TABLE students ADD COLUMN email VARCHAR(120);

-- 2. backfill

-- 3. contract
```

<details>
<summary>Solution</summary>

```sql solution
-- V003: email column for students

-- 1. expand
ALTER TABLE students ADD COLUMN email VARCHAR(120);

-- 2. backfill
UPDATE students SET email = LOWER(neptun) || '@student.example.com';

-- 3. contract
ALTER TABLE students ALTER COLUMN email SET NOT NULL;
ALTER TABLE students ADD CONSTRAINT students_email_unique UNIQUE (email);
```

</details>

```sql test
SELECT c.data_type, c.character_maximum_length, c.is_nullable,
       EXISTS (SELECT 1 FROM pg_indexes
               WHERE tablename = 'students' AND indexdef LIKE 'CREATE UNIQUE%(email)') AS is_unique,
       (SELECT email FROM students WHERE neptun = 'ABC123') AS sample
FROM information_schema.columns c
WHERE c.table_name = 'students' AND c.column_name = 'email';
```
