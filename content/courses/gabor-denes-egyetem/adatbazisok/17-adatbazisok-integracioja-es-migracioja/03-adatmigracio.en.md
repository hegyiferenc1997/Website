---
title: Data Migration
summary: Moving data from one system to another: inventory and mapping, transformation and cleaning (types, spaces, upper and lower case, missing values), validation with counts and checksums, and cutover strategies (all at once, phased, dual write) – tried out by loading an old text export with SQL.
minutes: 30
---

## What you will learn

- what **steps** a data migration has,
- how to **transform** and **clean** old data with SQL,
- how to **verify** that nothing was lost,
- which **cutover strategies** exist.

## When does data have to be migrated?

- An old system (spreadsheets, an outdated program, an old database) is replaced with a new one.
- The company moves to another DBMS (e.g. Oracle → PostgreSQL, topic 14).
- Two companies merge, and their customer databases have to be combined.
- The database moves to the cloud.

A data migration counts as a **project**, not an afternoon of copying: old data is almost always **dirtier** than you'd think.

## The steps

```text
 1. INVENTORY      What data is there, where, how big, who uses it?
 2. MAPPING        Which old field goes into which new column, with which type?
 3. TRANSFORMATION Formats, types, splitting, merging.
 4. CLEANING       Spaces, upper/lower case, duplicates, missing and invalid values.
 5. LOADING        Preferably in batches, repeatably (with a script).
 6. VALIDATION     Counts, totals, checksums, spot checks.
 7. CUTOVER        Users move over to the new system.
```

Important: the migration should be done by a **script**, not by copying by hand. That way you can try it as many times as you like in the test environment, and exactly the same thing runs in production.

## Let's try it: loading an old export file

An old student records program exported the students as text lines separated by semicolons. The data is typically "dirty": extra spaces, lower-case Neptun codes, a missing date of birth, a Hungarian date format.

<details>
<summary>Creating the old export and the new table (SQL)</summary>

```sql setup
-- The old system's export: one line = one student, separated by semicolons.
CREATE TABLE old_export (line TEXT);
INSERT INTO old_export VALUES
  ('ABC123;Anna Kiss;2005.03.14;computer engineering'),
  (' bcd234 ;Bela Nagy;2006.07.02;computer engineering'),
  ('CDE345;  Cili Toth ;2004.11.23;business informatics'),
  ('DEF456;Dani Szabo;;computer engineering'),
  ('efg567;Emma Varga;2006.01.30; business informatics');
-- The new system's table, with proper types and constraints.
CREATE TABLE new_students (
  neptun CHAR(6) PRIMARY KEY,
  name   VARCHAR(40) NOT NULL,
  born   DATE,
  major  VARCHAR(30) NOT NULL
);
```

</details>

Let's look at the raw data, and split it into fields with the `split_part(text, delimiter, which)` function:

```sql run
SELECT line,
       split_part(line, ';', 1) AS field1,
       split_part(line, ';', 2) AS field2,
       split_part(line, ';', 3) AS field3,
       split_part(line, ';', 4) AS field4
FROM old_export;
```

Useful functions for cleaning:

| Function                   | What is it for?                       | Example                                |
| -------------------------- | ------------------------------------- | -------------------------------------- |
| `TRIM(x)`                  | cutting spaces off the start and end  | `TRIM('  Cili Toth ')` → `'Cili Toth'` |
| `UPPER(x)`, `LOWER(x)`     | consistent lower or upper case        | `UPPER('bcd234')` → `'BCD234'`         |
| `NULLIF(x, '')`            | an empty string becomes NULL          | `NULLIF('', '')` → `NULL`              |
| `to_date(x, 'YYYY.MM.DD')` | a date from text, with a given format | `to_date('2005.03.14', 'YYYY.MM.DD')`  |
| `COALESCE(x, default)`     | a default instead of NULL             | `COALESCE(city, 'unknown')`            |

```sql run
SELECT UPPER(TRIM(split_part(line, ';', 1)))                          AS neptun,
       TRIM(split_part(line, ';', 2))                                 AS name,
       to_date(NULLIF(TRIM(split_part(line, ';', 3)), ''), 'YYYY.MM.DD') AS born
FROM old_export;
```

## Validation: was anything lost?

After loading you **always** have to check:

- **count**: are there as many rows in the source as in the target,
- **totals**: e.g. does the total of the invoices match,
- **checksum**: does a hash computed from all the data match (it reveals even the smallest difference),
- **spot checks**: comparing a few random records by hand,
- **rejected rows**: don't silently throw away what couldn't be loaded – collect it in an error table and review it!

```sql run
-- Checksum: one hash from all Neptun codes, sorted (so the order doesn't matter).
SELECT COUNT(*) AS row_count,
       md5(string_agg(UPPER(TRIM(split_part(line, ';', 1))), ',' ORDER BY UPPER(TRIM(split_part(line, ';', 1)))))
         AS checksum
FROM old_export;
```

If you compute the same in the target and the two values match, you can be sure every code came across.

## Cutover strategies

| Strategy                     | How?                                                                            | Pro / con                                                 |
| ---------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **All at once** (_big bang_) | the old system stops over a weekend, we migrate, the new one starts on Monday   | simple, but high risk, and a downtime window is needed    |
| **Phased**                   | we move part by part (e.g. faculty by faculty, module by module)                | lower risk, but two systems live side by side for a while |
| **Dual write** / **CDC**     | for a while both systems receive the changes (lesson 17/1), then we switch over | almost zero downtime, but complicated                     |

With every strategy, have a **rollback plan**: what to do if the new system fails in production after all? Only switch off the old system and its data for good once the new one has proven itself.

## Summary

- Steps: inventory → mapping → transformation → cleaning → loading → validation → cutover.
- SQL tools: `split_part`, `TRIM`, `UPPER`/`LOWER`, `NULLIF`, `to_date`, `COALESCE`.
- Validation: counts, totals, checksums, spot checks, an error table.
- Cutover: all at once, phased or with dual writes – always with a rollback plan.

## The lesson's exercise

Load the rows of the `old_export` table into the `new_students` table, **cleaned**:

- `neptun`: field 1, without spaces, in **upper case**,
- `name`: field 2, without spaces,
- `born`: field 3 **as a date** (`YYYY.MM.DD` format); if empty, it should be `NULL`,
- `major`: field 4, without spaces.

The starter code only shows the raw fields – write an `INSERT INTO … SELECT …` statement instead. The checker verifies the contents of the `new_students` table.

```sql starter required
SELECT split_part(line, ';', 1) AS neptun,
       split_part(line, ';', 2) AS name,
       split_part(line, ';', 3) AS born,
       split_part(line, ';', 4) AS major
FROM old_export;
```

<details>
<summary>Solution</summary>

```sql solution
INSERT INTO new_students (neptun, name, born, major)
SELECT UPPER(TRIM(split_part(line, ';', 1))),
       TRIM(split_part(line, ';', 2)),
       to_date(NULLIF(TRIM(split_part(line, ';', 3)), ''), 'YYYY.MM.DD'),
       TRIM(split_part(line, ';', 4))
FROM old_export;
```

</details>

```sql test
SELECT neptun, name, born, major FROM new_students ORDER BY neptun;
```
