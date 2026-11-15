---
title: What a DBMS Does and How It Is Built
summary: The three-level (ANSI/SPARC) architecture, physical and logical data independence, the DDL, DML, DCL and TCL languages, and the roles around a database.
minutes: 18
---

## What you will learn

- what the **three-level architecture** is (external, conceptual, internal level),
- what **data independence** means and why it is so valuable,
- which **languages** a DBMS has (DDL, DML, DCL, TCL),
- who works with a database.

## The three-level architecture

In a restaurant the guest sees the **menu**, the chef sees the **recipes**, the storekeeper sees the **shelves**. Everyone talks about the same kitchen, just from a different angle. A database works the same way (ANSI/SPARC model):

```text
  External level   [ Neptun view ]  [ Library view ]  [ Statistics view ]
  (users)                \                |                 /
                          \               |                /
  Conceptual level      [  Logical structure of the whole database: ]
  (the "what")          [  tables, relationships, constraints       ]
                                          |
  Internal level        [  How it sits on disk: files, pages,       ]
  (the "how")           [  indexes, compression                     ]
```

- **External level** (views): what a given user group sees. The porter sees only the name and photo, the registrar sees the grades too.
- **Conceptual (logical) level**: the structure of the whole database – which tables, fields, relationships and rules exist. How the machine stores them doesn't matter here.
- **Internal (physical) level**: how all this lands on disk – files, pages, indexes, compression.

## Data independence

The reward for separating the levels is **data independence**: changing one level doesn't break the one above it.

- **Physical data independence**: if the DBA creates a new index or moves the data to an SSD, programs don't need rewriting – the same queries work, just faster.
- **Logical data independence**: if a new column or table is added to the conceptual schema, old views and applications keep running unchanged.

This is one of the biggest differences from file-based storage, where the program knows exactly (and depends on) at which byte the address starts.

## The languages of a DBMS

SQL consists of several "sublanguages" – you will try all of them in the following topics:

| Sublanguage | Used for                                | Example statements                      |
| ----------- | --------------------------------------- | --------------------------------------- |
| **DDL**     | describing structure (_Data Definition_) | `CREATE TABLE`, `ALTER TABLE`, `DROP`  |
| **DML**     | handling data (_Data Manipulation_)     | `SELECT`, `INSERT`, `UPDATE`, `DELETE`  |
| **DCL**     | permissions (_Data Control_)            | `GRANT`, `REVOKE`                       |
| **TCL**     | transactions (_Transaction Control_)    | `BEGIN`, `COMMIT`, `ROLLBACK`           |

A simple memory aid: DDL builds the **shelf**, DML stacks the **books**, DCL hands out the **keys**, and TCL makes sure a stacking job either happens completely or not at all.

## The main parts of a DBMS

- **Query processor**: interprets the SQL and works out the fastest way to execute it (optimiser).
- **Storage manager**: reads and writes pages from disk, manages buffers.
- **Transaction manager**: makes sure concurrent operations don't interfere and that recovery is possible after a failure.
- **Data dictionary** (catalog): the database's "data about data" (metadata) – which tables, columns and permissions exist.

## Who works with a database?

- **Database administrator (DBA)**: installs, backs up, tunes, grants permissions, monitors operation.
- **Database designer**: designs the schema (tables, relationships).
- **Application developer**: writes programs that talk to the database in SQL.
- **End user**: uses it through an application (often without knowing SQL runs in the background).

## Summary

- Three levels: external (views), conceptual (logical structure), internal (physical storage).
- Physical data independence: storage can change without rewriting programs; logical: the schema can grow without changing views.
- Languages: DDL (structure), DML (data), DCL (permissions), TCL (transactions).

## Lesson exercise

```quiz required
? Which level describes **how** the data sits on disk (files, indexes)?
- external level
- conceptual level
+ internal level
! The internal (physical) level is the "how".

? The DBA creates a new index and programs don't need rewriting. Which property is this?
+ physical data independence
- logical data independence
- redundancy
- inconsistency
! Physical storage changed, programs didn't.

? Which sublanguage does `CREATE TABLE` belong to?
- DML
+ DDL
- DCL
- TCL
! It creates structure: Data Definition Language.

? Which sublanguage does `GRANT` (giving permissions) belong to? (abbreviation)
= DCL
! Data Control Language.

? What do we call the "data about data" (which tables and columns exist)?
= metadata
= data dictionary
= catalog
! The DBMS stores metadata in the data dictionary (catalog).
```
