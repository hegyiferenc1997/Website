---
title: Deeper – One Database from Several Viewpoints
summary: The same database through the eyes of a student, an administrator, a developer and a database administrator; spreadsheet versus DBMS in a real scenario; data independence and the data dictionary live, tried out with SQL.
minutes: 30
---

## What you will learn in this lesson

- how a student, an administrator, a developer and a DBA each **see something different** in the same database,
- why **a spreadsheet is not enough** when many people work with lots of data at the same time – followed through a concrete scenario,
- how **data independence** works in practice (you will try it!),
- how the database **describes itself** (data dictionary, `information_schema`),
- the most common **misconceptions** about databases.

This lesson ties together the ideas of the previous three lessons (data, DBMS, three-level architecture, types) and gives them tangible examples. You don't need any SQL knowledge yet: every runnable example comes with an explanation of what it does.

## Same data – four people, four viewpoints

Think of a university student information system. There is a single database behind it, yet everyone sees something different and wants something different from it:

| Who?                         | What do they see?                       | What do they do with it?                 | What matters to them?               |
| ---------------------------- | --------------------------------------- | ---------------------------------------- | ----------------------------------- |
| **Student**                  | their own courses, grades, timetable    | registers for courses and exams          | speed, and nothing gets lost        |
| **Registrar's office clerk** | all students of a programme, the grades | corrects grades, creates reports         | accurate, consistent data           |
| **Developer**                | tables, columns, relationships          | writes queries and programs              | clear structure, a stable interface |
| **Database administrator**   | disks, backups, permissions             | backs up, tunes, grants rights, upgrades | security, availability, speed       |

This is exactly the **three-level architecture** in practice:

- the student and the clerk are on the **external level** – each sees a _view_;
- the developer thinks on the **conceptual level** – in tables and relationships;
- the DBA also deals with the **internal level** – files, disks, indexes.

**Analogy – the theatre:** the audience sees the stage (external level), the director sees the script and the scenes (conceptual level), the stagehand sees the pulleys, ropes and storage (internal level). If the stagehand installs a new pulley, the audience notices nothing – except that the show runs more smoothly. That is **data independence**.

## Scenario: why isn't a spreadsheet enough?

A student union has kept track of event sign-ups in a shared spreadsheet file. Let's see what happens as traffic grows!

1. **Two people edit at once.** Anna and Ben both open the file, both type a new attendee into row 51, then both save. The later save overwrites the other: **a sign-up is lost**. A DBMS solves this with **concurrency control** (locking, transactions): both inserts survive.
2. **The same student three times.** Once as "Anna Kiss", once as "Anna Kiss" (two spaces), once as "anna kiss". The spreadsheet doesn't prevent it; in a DBMS a **unique key** (e.g. a student ID) can.
3. **Invalid data.** Someone types "lots" into the headcount column. The spreadsheet accepts it; the DBMS rejects it through **type checking** (`INT`).
4. **Who may see what?** Either someone can see the spreadsheet or not. In a DBMS you can let the organiser see e-mail addresses while others see only names (**permissions, views**).
5. **The machine crashes while saving.** A half-saved file may even be unreadable. The DBMS restores the last consistent state from its **log** (more on this in topic 9).
6. **A million rows.** The spreadsheet slows down or won't even open; the DBMS finds a row in milliseconds using **indexes**.

| Aspect                | Spreadsheet                 | DBMS                            |
| --------------------- | --------------------------- | ------------------------------- |
| Concurrent editing    | limited, conflicts          | transactions, locking           |
| Enforcing data types  | none or weak                | strict (`INT`, `DATE`, `CHECK`) |
| Preventing duplicates | by hand                     | primary and unique keys         |
| Permissions           | file level                  | table, column and row level     |
| Fault tolerance       | last save                   | log, recovery, replication      |
| Size                  | a few hundred thousand rows | billions of rows                |

This does **not** mean spreadsheets are bad! They are perfect for a quick calculation or a one-person list. The question is always **how many people, how much data and how critical** the work is.

## The database, live

Now you start a real PostgreSQL in your browser. The sample database contains students, courses and enrollments.

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Every run starts on a fresh copy – feel free to experiment.

### 1. The external level: a view for the receptionist

The receptionist only needs a student's name and ID; birth date and city are none of their business. That is what a **view** (`VIEW`) is for: a saved query that behaves like a table.

```sql run
-- View: the receptionist only sees these two columns
CREATE VIEW reception_view AS
SELECT neptun, name FROM students;

SELECT * FROM reception_view;
```

### 2. Logical data independence: the table grows, the view stays the same

Suppose the developers add a new column (e-mail address) to the `students` table. The receptionist's view **doesn't need to know anything about it** – it works exactly as before:

```sql run
CREATE VIEW reception_view AS
SELECT neptun, name FROM students;

-- The conceptual schema changes: a new column
ALTER TABLE students ADD COLUMN email VARCHAR(80);

-- The external level (the view) still works unchanged
SELECT * FROM reception_view;
```

In a file-based program (where the program "knows" that the name occupies bytes 7 to 66), inserting a new field would break every program. Here it doesn't.

### 3. Physical data independence: an index, and the query stays the same

Creating an index changes the **internal level**. The text and result of the query stay exactly the same; at most it gets faster:

```sql run
-- Internal level: a new index on the city
CREATE INDEX idx_students_city ON students (city);

-- The query is unchanged
SELECT name FROM students WHERE city = 'Budapest';
```

### 4. The data dictionary: the database describes itself

A DBMS stores not only the data but also **data about the data** (metadata): which tables, columns and types exist. You can query this with SQL too, from a "catalogue" called `information_schema`:

```sql run
-- Which columns does the students table have, and of what type?
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'students'
ORDER BY ordinal_position;
```

Notice: the `is_nullable` column shows where a field is mandatory (`NO`) – the DBMS checks these rules on every insert.

```sql run
-- Which tables exist in the database?
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 5. The DBMS guards the rules

Try inserting invalid data! A grade may only be between 1 and 5 (a `CHECK` rule says so):

```sql run
-- This works: a valid grade
INSERT INTO enrollments VALUES ('EFG567', 'PROG', 4);
SELECT * FROM enrollments WHERE neptun = 'EFG567';
```

Now click **Edit**, change the grade 4 to 7, and run it again: the DBMS rejects it with an error message. A spreadsheet would accept it without a word.

## Common misconceptions

<details>
<summary>"A database is a program I install."</summary>

Imprecise. The **database** is the collection of data itself; the **DBMS** is the program that manages it (PostgreSQL, MySQL, Oracle…). One DBMS can manage many databases, and a database can (in principle) be moved under another DBMS.

</details>

<details>
<summary>"SQL is a database."</summary>

No: SQL is a **language** we use to "talk" to relational databases. It appears in the names "MySQL" and "PostgreSQL" because they understand this language.

</details>

<details>
<summary>"NoSQL is better because it is more modern."</summary>

It is neither better nor worse, it is meant for **different tasks**. Relational databases are strong with strictly structured, interrelated data and transactions; NoSQL with flexible structure and horizontal scaling. Many systems use both (topic 11).

</details>

<details>
<summary>"If I have a backup, I don't need a log."</summary>

A backup is a **point in time**; the log holds **all changes** between two backups. With a nightly backup but no log, an afternoon failure would lose the whole day's work.

</details>

## Case study: course registration rush

At 8:00 on Monday morning course registration opens and 10,000 students click at the same time. What does the DBMS have to handle?

- **Concurrency:** if one seat is left in a course and two students click at once, only one may get it. The transaction manager guarantees this (topic 8: ACID).
- **Performance:** without indexes, the "is there still a seat?" query would have to read every enrollment each time.
- **Fault tolerance:** if a server goes down at 8:03, registrations already recorded must not be lost (log, replication).
- **Permissions:** a student may only modify their own registrations.

Everything you learn in this course helps somewhere in those eight minutes.

## Summary

- Everyone sees the same database through a different **view** – that's the three-level architecture in practice.
- Compared to a spreadsheet, a DBMS offers **concurrency, type checking, keys, permissions, recovery and scaling**.
- **Logical data independence:** schema growth doesn't break views. **Physical data independence:** an index doesn't change the query.
- The **data dictionary** (`information_schema`) stores metadata and can be queried with SQL.

## Exercise

The registrar's office wants a **view** called `clerk_view` that shows every student's **ID (neptun), name and major** (in this order), but not the city or birth date. Create the view! (The check queries the view, ordered by ID.)

Hint: look at the receptionist view example above and extend it by one column.

```sql starter required
-- Create the clerk_view view!
CREATE VIEW clerk_view AS
SELECT ...
```

<details>
<summary>Solution</summary>

```sql solution
CREATE VIEW clerk_view AS
SELECT neptun, name, major FROM students;
```

</details>

```sql test
SELECT * FROM clerk_view ORDER BY neptun;
```
