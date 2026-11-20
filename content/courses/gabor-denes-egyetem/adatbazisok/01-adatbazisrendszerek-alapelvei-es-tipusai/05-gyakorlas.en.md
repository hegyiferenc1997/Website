---
title: Practice – Database System Basics
summary: Review questions and a summary worksheet on databases, the DBMS, the three-level architecture and database types.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Why is it a bad idea for every department of a company to keep customers in its own Excel file?</summary>

Because the same data appears in several places (**redundancy**), so sooner or later the copies contradict each other (**inconsistency**). It is also hard to merge the files for a query, several people can't work safely at the same time, and you can't finely control who sees what.

</details>

<details>
<summary>2. What is the difference between a database and a DBMS?</summary>

The **database** is the related, persistently stored data itself. The **DBMS** is the program that manages it: stores, queries, protects and backs it up, and organises multi-user access. Analogy: the book collection and the librarian.

</details>

<details>
<summary>3. What do we gain from the three-level architecture?</summary>

**Data independence.** Physical storage (indexes, disks) can change without rewriting programs, and the logical schema can grow while old views and applications keep working. Also, every user group sees only the view meant for it.

</details>

<details>
<summary>4. Why did the relational model replace the network model?</summary>

In the network model programs had to step along pointers, so queries were complex and any structural change affected the programs. In the relational model relationships come from shared values, querying is declarative (SQL), and the DBMS decides how to execute it.

</details>

<details>
<summary>5. Give a task that needs an OLTP system and one that needs an OLAP system!</summary>

**OLTP**: a web shop's orders, bank transfers, course registration in Neptun – many short, concurrent transactions. **OLAP**: "How did the average per course change over the past five years?" – few queries, but each scans a huge amount of data.

</details>

## Summary worksheet

A starting team is building a **food delivery app**. Help them decide!

```quiz required
? Orders and payments must be stored transactionally, with strict rules. Which database do you suggest?
+ relational (e.g. PostgreSQL)
- graph (e.g. Neo4j)
- time series (e.g. InfluxDB)
- no database is needed
! Transactions and integrity: relational.

? Couriers' GPS positions update every second; only the latest value is needed, very fast. What fits best?
- hierarchical database
+ in-memory key-value store (e.g. Redis)
- an Excel file
- OLAP data warehouse
! Fast, simple key → value, in memory.

? The app shows favourite restaurants on the phone even offline. Which database goes on the phone?
- client-server Oracle
+ embedded SQLite
- distributed Cassandra
- NewSQL
! An embedded, single-file database.

? The developers add a new index to the orders table without touching the program code. Which principle makes this possible? (three words)
= physical data independence
= fizikai adatfüggetlenség
! The internal level changed; the conceptual and external ones didn't.

? Which SQL sublanguage does `ROLLBACK` (undoing an unfinished operation) belong to?
- DDL
- DML
- DCL
+ TCL
! Transaction Control Language.

? Analysts want monthly reports on orders going back years. Which processing mode is this?
- OLTP
+ OLAP
! Online Analytical Processing.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

**1.** First steps in the sample database: list the **name and city** of students whose **city is known**, in alphabetical order by name.

```sql starter
SELECT name, city
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, city
FROM students
WHERE city IS NOT NULL       -- the unknown (NULL) city is left out
ORDER BY name;
```

</details>

**2.** **The external level in practice.** The dormitory porter only sees students from Budapest. Create the `budapest_students` **view** (with the `neptun` and `name` columns), then query it sorted by Neptun code!

```sql starter
-- 1. CREATE VIEW budapest_students AS ...
-- 2. SELECT ... FROM budapest_students ...
```

<details>
<summary>Solution</summary>

```sql solution
CREATE VIEW budapest_students AS
SELECT neptun, name
FROM students
WHERE city = 'Budapest';

SELECT * FROM budapest_students ORDER BY neptun;
```

</details>

**3.** **The DBMS can also give data about itself** (the data dictionary). Query the **names and data types of the columns** of the `students` table from the `information_schema.columns` view, in their order in the table (`ordinal_position`)!

```sql starter
SELECT column_name, data_type
FROM information_schema.columns;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
```

</details>

**4.** How many **tables** are there in the `public` schema? (The `information_schema.tables` view helps.)

```sql starter
SELECT table_name
FROM information_schema.tables;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT COUNT(*) AS table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';    -- only real tables, not views
```

</details>

**5.** **Physical data independence, tried out.** Create an index on the `students.city` column, then run _the same_ query as without the index: the names of students from Szeged and Debrecen, sorted by name. Notice: nothing in the query had to change!

```sql starter
SELECT name
FROM students
WHERE city IN ('Szeged', 'Debrecen')
ORDER BY name;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE INDEX idx_students_city ON students (city);   -- only the internal level changes

SELECT name
FROM students
WHERE city IN ('Szeged', 'Debrecen')
ORDER BY name;
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'students' AND indexdef LIKE '%(city)%') AS has_index,
       (SELECT string_agg(name, ', ' ORDER BY name) FROM students WHERE city IN ('Szeged', 'Debrecen')) AS names;
```
