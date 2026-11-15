---
title: Relational DBMSs
summary: An introduction to PostgreSQL, MySQL/MariaDB, Microsoft SQL Server, Oracle Database and SQLite: strengths, typical uses, licences, and the differences between SQL dialects (paging, auto-generated IDs, string concatenation).
minutes: 25
---

## What you will learn

- which are the most widespread **relational DBMSs**, and what they're good at,
- what **open source** and **commercial** licences mean,
- that SQL is standard, but every DBMS has its own **dialect**.

## The big five

| DBMS                      | Licence                         | Strengths                                                                     | Typical home                                  |
| ------------------------- | ------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------- |
| **PostgreSQL**            | open (PostgreSQL License)       | standards-compliant, very many features (JSONB, window functions, extensions: PostGIS, TimescaleDB, pgvector) | web applications, start-ups, data analysis |
| **MySQL** / **MariaDB**   | open (GPL) + commercial edition | simple, fast reads, huge community, offered by many hosting providers         | websites (WordPress), web shops               |
| **Microsoft SQL Server**  | commercial (with free Express/Developer editions) | tight integration with the Microsoft world (.NET, Azure, Power BI), good tools | enterprise systems, Windows environments |
| **Oracle Database**       | commercial                      | enterprise features, huge loads, clustering (RAC), long-established           | banks, telecoms, government                   |
| **SQLite**                | public domain                   | **no server**: a single file, embeddable, zero configuration                  | mobile apps, browsers, small programs         |

A few interesting facts:

- **SQLite** is the most widely deployed database in the world: it's in every smartphone, every browser, many cars and aeroplanes. It doesn't replace a server (only one writer at a time), but it's perfect for an application's own data.
- **MariaDB** is MySQL's "sibling": it was started by the original MySQL developers after Oracle bought MySQL.
- **PostgreSQL** has for years been counted among developers' most loved databases – and it's what runs in this course too, in your browser.

## Open source or commercial licence?

| Aspect                 | Open source (PostgreSQL, MySQL, MariaDB)       | Commercial (Oracle, SQL Server)               |
| ---------------------- | ---------------------------------------------- | --------------------------------------------- |
| Licence fee            | none                                           | often per processor core, a significant sum   |
| Support                | community, or paid support companies           | from the vendor, under contract               |
| Dependence on the vendor | small: the code is available to anyone       | larger (_vendor lock-in_)                     |
| Special features       | very many through extensions                   | many built-in enterprise features             |

"No licence fee" doesn't mean "free": operations, experts and support cost money here too. This is called the **total cost of ownership** (_TCO_).

## SQL dialects

SQL is standard (ISO/IEC 9075), but every DBMS extends it, and differs from it here and there. If you move from one system to another (topic 17), you have to watch out for these:

| Task                          | PostgreSQL                         | MySQL / MariaDB                  | SQL Server                         | Oracle                                |
| ----------------------------- | ---------------------------------- | -------------------------------- | ---------------------------------- | ------------------------------------- |
| first 5 rows                  | `LIMIT 5`                          | `LIMIT 5`                        | `SELECT TOP 5 …`                   | `FETCH FIRST 5 ROWS ONLY`             |
| auto-generated ID             | `GENERATED … AS IDENTITY`, `SERIAL` | `AUTO_INCREMENT`                | `IDENTITY(1,1)`                    | `GENERATED … AS IDENTITY`             |
| string concatenation          | `'a' \|\| 'b'`                     | `CONCAT('a', 'b')`               | `'a' + 'b'`                        | `'a' \|\| 'b'`                        |
| current time                  | `now()`                            | `NOW()`                          | `GETDATE()`                        | `SYSDATE`                             |
| boolean type                  | `BOOLEAN`                          | `BOOLEAN` (really `TINYINT(1)`)  | `BIT`                              | `BOOLEAN` (only in newer versions)    |

The good news: the **standard** forms work in more and more places. PostgreSQL, for example, knows the standard `FETCH FIRST` and `IDENTITY` too:

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT neptun, name, semester
FROM students
ORDER BY name
FETCH FIRST 3 ROWS ONLY;      -- standard, same as LIMIT 3
```

```sql run
CREATE TABLE lecturers (
  id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- standard auto-generated ID
  name VARCHAR(40) NOT NULL
);
INSERT INTO lecturers (name) VALUES ('Dr. Peter Example'), ('Dr. Mary Sample');
SELECT * FROM lecturers;
```

```sql run
SELECT version();
```

> Tip: where you can, write **standard SQL**, and use DBMS-specific features (e.g. JSONB) deliberately, in one place. That way a later move hurts much less.

## Summary

- PostgreSQL: open, standards-compliant, lots of features; MySQL/MariaDB: simple, web; SQL Server: the Microsoft world; Oracle: enterprise; SQLite: serverless, embedded.
- Open source = no licence fee, less vendor dependence; but the total cost (TCO) still matters.
- SQL is standard, but it has dialects (paging, IDs, concatenation, dates).

## The lesson's exercise

```quiz required
? Which DBMS works without a server, in a single file, and is therefore popular in mobile apps?
- PostgreSQL
- Oracle Database
+ SQLite
- Microsoft SQL Server
! An embedded database with zero configuration.

? Which SQL Server statement corresponds to PostgreSQL's `LIMIT 5`?
+ SELECT TOP 5 …
- SELECT FIRST 5 …
- SELECT … ROWNUM 5
- SELECT … MAX 5
! The standard form: FETCH FIRST 5 ROWS ONLY.

? What does total cost of ownership (TCO) mean?
- only the licence fee
+ besides the licence fee, the cost of operations, experts and support too
- the server's power consumption
- the size of the database
! Running a system with a free licence costs money too.

? Which string concatenation is standard SQL (and works in both PostgreSQL and Oracle)?
- 'a' + 'b'
+ 'a' || 'b'
- 'a' & 'b'
- 'a' . 'b'
! + is SQL Server's own.

? Why is it worth writing standard SQL where you can?
- because it runs faster
+ because moving to another DBMS is much simpler that way
- because DBMS-specific features aren't secure
- because the dialects will soon disappear
! Less vendor dependence.
```
