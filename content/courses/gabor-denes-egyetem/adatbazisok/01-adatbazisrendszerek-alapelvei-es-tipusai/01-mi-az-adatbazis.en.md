---
title: What Is a Database, and Why Do We Need One?
summary: Data versus information, the problems of file-based storage, and the concept and benefits of databases and database management systems (DBMS).
minutes: 15
---

## What you will learn

- the difference between **data** and **information**,
- why storing data in plain **files** causes trouble,
- what a **database** and a **database management system** (DBMS) are.

## Data or information?

**Data** is a raw fact that doesn't say much on its own: `42`, `"ABC123"`, `2026-01-15`. **Information** is data **interpreted** in context: _"The student with Neptun code ABC123 scored 42 points on 15 January 2026."_ A database's job is to store data so that information can be extracted from it at any time.

## Life without a database

Imagine every office of a university keeps its own Excel file of students: the registrar, the dormitory and the library. What happens?

| Problem                      | Example                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| **Redundancy** (duplication) | Anna Kiss's address appears in three files.                                                        |
| **Inconsistency**            | Anna moves; the registrar updates it, the dorm doesn't – which address is the real one?            |
| **Hard to query**            | "Which 3rd-semester students from Budapest owe the library?" – three files must be merged by hand. |
| **Concurrent access**        | Two people edit the same file at once: one change is lost.                                         |
| **Security**                 | Either everyone sees the file or no one – you can't say the porter may see only the name.          |
| **Data loss**                | A power cut during saving: the file is half-written and corrupted.                                 |

Databases were invented to solve exactly these problems.

## Database and DBMS

- **Database**: an organised, persistent collection of logically related data, built to serve a purpose (e.g. running a university).
- **Database management system** (DBMS): the software that creates, stores, queries, modifies and protects the database. Examples: **PostgreSQL**, **MySQL**, **Oracle**, **Microsoft SQL Server**, **SQLite**.
- **Database system**: the database + the DBMS + the applications that use it.

An analogy: the database is the library's **collection** (the books), and the DBMS is the **librarian** who knows where everything is, fetches what you ask for, records the loans, and doesn't let anyone take the rare manuscripts home.

```text
 Applications (web shop, Neptun, mobile app)
            │  requests (e.g. SQL)
            ▼
 ┌───────────────────────────────┐
 │            DBMS               │  ← queries, permissions, transactions, backups
 └───────────────────────────────┘
            │
            ▼
 ┌───────────────────────────────┐
 │   Database (files on disk)     │
 └───────────────────────────────┘
```

## Why is a DBMS good?

- It stores data **once** (less redundancy), so there are no contradictions.
- It provides a **query language** (SQL) in which even complex questions fit in a few lines.
- It enforces **integrity rules** (e.g. a grade can only be 1–5, no two identical Neptun codes).
- It is **multi-user**: thousands can work at once without overwriting each other's work.
- **Access control**: who may see and change what.
- **Backup and recovery**: it returns to a consistent state even after a power cut.

It has a price: a DBMS is more complex, needs resources and has to be learned – you don't need PostgreSQL for a shopping list. But when the data is important, large and used by many, there is no better solution.

## Summary

- Data = raw fact; information = interpreted data.
- Problems of file-based storage: redundancy, inconsistency, hard queries, concurrency, security, data loss.
- Database = organised collection of related data; DBMS = the software that manages it.

## Lesson exercise

```quiz required
? Which one is **information** (not just data)?
- 42
- ABC123
+ Anna Kiss is a 3rd-semester student from Budapest.
- 2026-01-15
! Information is data interpreted in context.

? Anna's address differs in two offices because only one updated it. What is this problem called?
- redundancy
+ inconsistency
- normalisation
- replication
! Contradicting data = inconsistency (caused by redundancy).

? What is the name of the software that manages a database (abbreviation)?
= DBMS
= database management system
! Database Management System.

? Which one is **not** a DBMS?
- PostgreSQL
- SQLite
+ Microsoft Excel
- Oracle
! Excel is a spreadsheet, not a database management system.
```
