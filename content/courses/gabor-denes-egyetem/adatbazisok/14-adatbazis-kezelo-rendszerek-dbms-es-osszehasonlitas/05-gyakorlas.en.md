---
title: Practice – Comparing DBMSs
summary: Review questions about relational and NoSQL systems, cloud services and the method of choosing, then five project descriptions for which you have to choose the most suitable database.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. How does SQLite differ from PostgreSQL and MySQL?</summary>

SQLite has no separate server process: the whole database is a single file that the application reads and writes directly through a library. That's why it works with zero configuration and is ideal inside mobile and desktop apps, but it isn't made to serve many concurrent writers.

</details>

<details>
<summary>2. What is vendor lock-in, and how can it be reduced?</summary>

It means that moving away from a system would be very hard and expensive, because the code and data are built on one vendor's own features. It can be reduced with standard SQL, open source systems, and by gathering the vendor-specific parts in one place in the application.

</details>

<details>
<summary>3. What doesn't a managed cloud database take off your shoulders?</summary>

Schema design, indexes and query optimisation, setting up users and privileges, restricting network access, and the responsibility for the data's content and legal compliance (e.g. GDPR).

</details>

<details>
<summary>4. Why can an unweighted average be misleading when scoring DBMSs?</summary>

Because it treats every criterion as equally important. If cost matters much more to a project than learnability, an unweighted average may rank an expensive system that's strong in many respects first.

</details>

<details>
<summary>5. When is it justified to add a NoSQL system alongside a relational database?</summary>

When there's a concrete need the relational database serves poorly: e.g. a lightning-fast cache or session store (Redis), a huge write load (Cassandra), complex relationship traversal (Neo4j) or full-text search (Elasticsearch). But not for fashion: every new system is an operational burden.

</details>

## The practice exercise

Five teams ask you for advice. Choose the best-fitting solution for each!

```quiz required
? A university student is writing a mobile app that stores their notes on the phone, even without internet. What do you suggest?
+ SQLite
- Oracle Database
- a Cassandra cluster
- a managed SQL Server
! Embedded, serverless, a single file on the phone.

? A medium-sized web shop's orders, stock and invoices: accuracy is needed, many complex queries, a small team, a tight budget.
- Redis
+ PostgreSQL (possibly as a managed service)
- Neo4j
- Oracle Database
! Open, ACID, strong SQL, no licence fee.

? A bank that has used Oracle for decades relies on many built-in enterprise features and has its own Oracle experts. What's the most sensible in the short term?
+ stay with Oracle, and examine the possibility of moving in a planned way
- move to MongoDB immediately
- put everything into Redis
- switch to SQLite
! Moving is risky and expensive; the decision should be preceded by thorough analysis.

? A real-time leaderboard for an online game: many thousands of score updates per second, the top 100 always needed, lightning fast.
- SQLite
+ Redis (sorted set)
- Neo4j
- an archive object store
! In memory, with a sorted set the leaderboard is instant.

? A start-up's traffic is unpredictable: sometimes there are barely any visitors for days, sometimes it suddenly grows tenfold after a campaign. They have little operations experience. What kind of hosting do you suggest?
- their own server in the office
+ a serverless managed database
- a big, fixed-size rented server
! They pay per use, and scaling is automatic.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

In every exercise you get a query written in **another DBMS's dialect** as a comment. Rewrite it in **standard SQL / PostgreSQL** so that it gives the same result!

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

**1.** **MySQL → standard paging.** MySQL's `LIMIT 2, 3` means: "skip 2 rows and return 3". Rewrite it in the standard `OFFSET … FETCH` form! (Course code and name, sorted by code.)

```sql starter
-- MySQL: SELECT code, name FROM courses ORDER BY code LIMIT 2, 3;
SELECT code, name
FROM courses
ORDER BY code;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, name
FROM courses
ORDER BY code
OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;      -- SQL:2008 standard, Oracle and SQL Server understand it too
```

</details>

**2.** **Oracle `NVL` → `COALESCE`.** Rewrite it: the students' name and city, with the text `'unknown'` instead of an unknown city, by name.

```sql starter
-- Oracle: SELECT name, NVL(city, 'unknown') FROM students ORDER BY name;
SELECT name, city
FROM students
ORDER BY name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, COALESCE(city, 'unknown') AS city   -- COALESCE: standard, works in every DBMS
FROM students
ORDER BY name;
```

</details>

**3.** **MySQL `GROUP_CONCAT` → `string_agg`.** Per student (Neptun code), the codes of their courses **separated by commas, alphabetically**, sorted by Neptun code.

```sql starter
-- MySQL: SELECT neptun, GROUP_CONCAT(code ORDER BY code SEPARATOR ', ')
--        FROM enrollments GROUP BY neptun ORDER BY neptun;
SELECT neptun, code
FROM enrollments;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT neptun, string_agg(code, ', ' ORDER BY code) AS courses
FROM enrollments
GROUP BY neptun
ORDER BY neptun;
```

</details>

**4.** **Oracle `DECODE` → `CASE`.** `DECODE(semester, 1, 'first', 3, 'third', 'other')` is Oracle-specific. Rewrite it with a standard `CASE`! (Name, semester as text, by name.)

```sql starter
-- Oracle: SELECT name, DECODE(semester, 1, 'first', 3, 'third', 'other') FROM students ORDER BY name;
SELECT name, semester
FROM students
ORDER BY name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name,
       CASE semester
         WHEN 1 THEN 'first'
         WHEN 3 THEN 'third'
         ELSE 'other'
       END AS semester_text
FROM students
ORDER BY name;
```

</details>

**5.** **SQL Server `DATEDIFF` → PostgreSQL.** How old were the students on **1 September 2025**? (Name, age; only with a known birth date, by name.) In PostgreSQL `AGE(date1, date2)` gives the exact difference, and `EXTRACT(YEAR FROM …)` takes the years from it.

```sql starter
-- SQL Server (inaccurate: it only subtracts the years!):
-- SELECT name, DATEDIFF(year, born, '2025-09-01') FROM students ...;
SELECT name, born
FROM students
ORDER BY name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, EXTRACT(YEAR FROM AGE(DATE '2025-09-01', born)) AS age
FROM students
WHERE born IS NOT NULL
ORDER BY name;
```

</details>
