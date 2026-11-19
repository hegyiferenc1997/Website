---
title: Deeper – The Same Task in Five DBMSs
summary: SQL dialect differences side by side (paging, auto-generated IDs, string concatenation, NULL replacement, dates, boolean type, UPSERT, case sensitivity), trying the standard forms in PostgreSQL (FETCH FIRST, IDENTITY, MERGE), portability strategies, and a short "what to check when switching DBMS" checklist.
minutes: 35
---

## What you will learn in this lesson

- that "SQL" in practice means **dialects**, and what the most common differences are,
- how to write **the same** query in PostgreSQL, MySQL, SQL Server, Oracle and SQLite,
- which **standard** forms work in several systems,
- how to keep your code **portable**,
- what to watch out for when moving an application to **another DBMS**.

## Why isn't SQL the same everywhere?

SQL has an international standard (ISO/IEC 9075, latest edition 2023), but the big systems implemented many features **before** the standard described them – each with its own syntax. Later the standard prescribed a third form, and the systems adopted it too (or didn't).

**Analogy – regional words:** "soda", "pop" and "soft drink" mean the same; everyone understands the neutral form, but at home everyone uses their own. In SQL, the standard form is the neutral one.

## The differences in one table

| Task                          | PostgreSQL                         | MySQL / MariaDB                   | SQL Server (T-SQL)              | Oracle                                 | SQLite                       |
| ----------------------------- | ---------------------------------- | --------------------------------- | ------------------------------- | -------------------------------------- | ---------------------------- |
| first 10 rows                 | `LIMIT 10` or `FETCH FIRST 10 ROWS ONLY` | `LIMIT 10`                  | `TOP 10` or `OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY` | `FETCH FIRST 10 ROWS ONLY` (formerly `ROWNUM`) | `LIMIT 10` |
| auto-generated ID             | `GENERATED ALWAYS AS IDENTITY` (formerly `SERIAL`) | `AUTO_INCREMENT`  | `IDENTITY(1,1)`                 | `GENERATED AS IDENTITY` (formerly sequence) | `INTEGER PRIMARY KEY`   |
| string concatenation          | `a \|\| b`, `CONCAT(a, b)`          | `CONCAT(a, b)`                    | `a + b`, `CONCAT(a, b)`         | `a \|\| b`, `CONCAT(a, b)`              | `a \|\| b`                    |
| value instead of NULL         | `COALESCE(x, 0)`                   | `COALESCE`, `IFNULL(x, 0)`        | `COALESCE`, `ISNULL(x, 0)`      | `COALESCE`, `NVL(x, 0)`                | `COALESCE`, `IFNULL`         |
| today's date                  | `CURRENT_DATE`                     | `CURRENT_DATE`, `CURDATE()`       | `CAST(GETDATE() AS DATE)`       | `TRUNC(SYSDATE)`, `CURRENT_DATE`       | `DATE('now')`                |
| boolean type                  | `BOOLEAN`                          | `BOOLEAN` (= `TINYINT(1)`)        | `BIT`                           | `BOOLEAN` (from 23c), formerly `NUMBER(1)` | none, integer 0/1        |
| insert or update              | `ON CONFLICT … DO UPDATE`, `MERGE` | `ON DUPLICATE KEY UPDATE`         | `MERGE`                         | `MERGE`                                | `ON CONFLICT … DO UPDATE`    |
| quoting identifiers           | `"name"`                           | `` `name` ``                      | `[name]` or `"name"`            | `"name"`                               | `"name"`                     |
| string comparison by default  | **case-sensitive**                 | usually **case-insensitive**      | usually **case-insensitive**    | **case-sensitive**                     | case-sensitive on ASCII (`=`), `LIKE` is not |

"Usually" appears because the behaviour is determined by the **collation**, which can be configured per database.

### The sneakiest difference: case sensitivity

The same query, `WHERE name = 'anna kiss'`, **finds** Anna Kiss in MySQL with default settings, but **not** in PostgreSQL. If you move an application from MySQL to PostgreSQL, login may suddenly "break", because e-mail addresses used to be compared case-insensitively. Solution in PostgreSQL: `LOWER(email) = LOWER(?)` (with an expression index), or the `citext` extension type.

## Trying the standard forms

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Standard paging

```sql run
-- Standard (ISO) paging: PostgreSQL, Oracle, SQL Server (with ORDER BY), DB2 understand it
SELECT name, semester FROM students
ORDER BY semester DESC, name
OFFSET 1 ROWS FETCH FIRST 3 ROWS ONLY;
```

### Standard auto-generated IDs

```sql run
-- IDENTITY column: the DBMS supplies the value (PostgreSQL 10+, Oracle 12c+, DB2; IDENTITY(1,1) in SQL Server)
CREATE TABLE messages (
  id    INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  body  VARCHAR(100) NOT NULL
);
INSERT INTO messages (body) VALUES ('Hi!'), ('How are you?'), ('Fine, thanks.');
SELECT * FROM messages;
```

Because of `GENERATED ALWAYS` you can't even supply an `id` by hand – so nobody can "tamper" with the counter and cause a collision.

### MERGE – the standard UPSERT

`MERGE` is the standard "synchronising" statement: it compares a source's rows with the target table and decides which to update, insert or (if needed) delete. SQL Server and Oracle have had it for a long time, PostgreSQL since version 15.

```sql run
-- New grades arrived from a file: existing ones are updated, new ones inserted
MERGE INTO enrollments AS target
USING (VALUES ('BCD234', 'MAT', 4), ('EFG567', 'PROG', 5)) AS source(neptun, code, grade)
ON target.neptun = source.neptun AND target.code = source.code
WHEN MATCHED THEN
  UPDATE SET grade = source.grade
WHEN NOT MATCHED THEN
  INSERT (neptun, code, grade) VALUES (source.neptun, source.code, source.grade);

SELECT * FROM enrollments WHERE neptun IN ('BCD234', 'EFG567') ORDER BY neptun, code;
```

Bela's MAT grade (NULL so far) was updated to 4, and Emma's PROG enrollment was inserted as a new row.

### The same query in several dialects

**Task:** the names of the 3 students in the highest semesters and a "city – major" description; if there's no city, show "?" instead.

```sql
-- SQL Server (T-SQL)
SELECT TOP 3 name, ISNULL(city, '?') + ' – ' + major AS description
FROM students ORDER BY semester DESC, name;

-- MySQL
SELECT name, CONCAT(IFNULL(city, '?'), ' – ', major) AS description
FROM students ORDER BY semester DESC, name LIMIT 3;

-- Oracle
SELECT name, NVL(city, '?') || ' – ' || major AS description
FROM students ORDER BY semester DESC, name FETCH FIRST 3 ROWS ONLY;
```

None of these runs unchanged on the others. In the lesson's exercise you'll write the **standard** version that runs in PostgreSQL (and largely in Oracle too).

## Portability strategies

1. **Standard SQL where possible:** `COALESCE` (not `ISNULL`/`NVL`), `CASE` (not `IF()`/`DECODE`), `FETCH FIRST` or at least paging gathered in one place, `CURRENT_DATE`.
2. **An abstraction layer:** an ORM or query builder (e.g. Drizzle, Hibernate, Entity Framework) hides most dialect differences (topic 17). The price: special features (JSONB, window functions) often still need raw SQL.
3. **Deliberate "lock-in":** it's often better to use a system's strengths (PostgreSQL's JSONB, Oracle's partitioning) than to restrict yourself to the lowest common denominator. Switching DBMS is a rare and big project – it's not worth paying every day so that it might be cheaper once.
4. **Tests:** if several DBMSs must be supported, the tests should run on each.

## Checklist when switching DBMS

- **Data types:** does every type have an equivalent (e.g. MySQL `TINYINT(1)` → PostgreSQL `BOOLEAN`, Oracle `NUMBER` → `NUMERIC`/`BIGINT`)? What happens to precision and character set?
- **Collation:** case, accents, sort order (e.g. where language-specific letters sort).
- **NULL and empty string:** in Oracle the empty string `''` **counts as NULL** – elsewhere it doesn't!
- **Auto-generated IDs:** continuing the counters from the old maximum value.
- **Stored procedures, triggers:** PL/SQL, T-SQL, PL/pgSQL – these almost always have to be rewritten.
- **Transactions and locking:** default isolation level (e.g. MySQL InnoDB: REPEATABLE READ, PostgreSQL: READ COMMITTED).
- **Performance:** the same query may run with a different plan – measure!

## Summary

- SQL has a standard, but every DBMS also has its **own dialect**.
- Most common differences: paging, auto-generated IDs, concatenation, NULL replacement, dates, boolean type, UPSERT, identifier quoting, case sensitivity.
- Standard forms: `FETCH FIRST … ROWS ONLY`, `GENERATED … AS IDENTITY`, `COALESCE`, `CASE`, `MERGE`, `||`.
- Portability: standard SQL, ORM, tests – or a deliberate decision for a system's strengths.

## Exercise

Rewrite the **SQL Server** query above into **standard SQL** that runs in PostgreSQL: the names (`name`) of the 3 students in the highest semesters (ties broken by name) and a description (`description`) in the form "city – major" (space, en dash, space), with `?` in place of a missing city.

Replace `TOP`, `ISNULL` and the `+` concatenation with their standard equivalents!

```sql starter required
SELECT TOP 3 name, ISNULL(city, '?') + ' – ' + major AS description
FROM students
ORDER BY semester DESC, name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, COALESCE(city, '?') || ' – ' || major AS description
FROM students
ORDER BY semester DESC, name
FETCH FIRST 3 ROWS ONLY;
```

</details>
