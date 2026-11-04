---
title: Relational Databases
summary: Database and DBMS, table, record, field, primary and foreign key, types of relationships.
minutes: 16
---

## What you will learn

- what a **database** and a **database management system** (DBMS) are,
- the concepts of the relational model: **table**, **record**, **field**, **key**,
- what **relationships** can exist between tables.

## Why isn't a spreadsheet enough?

A spreadsheet is fine for small amounts of data, but when many users write at once, there are millions of rows, or the data is related (students, courses, enrolments), you need a **database**: a collection of related data stored in an organised way without repetition. The **database management system** (DBMS) is the program that stores, queries, protects and backs up the data, and makes sure many people can work on it safely at the same time.

Well-known relational DBMSs: **PostgreSQL**, **MySQL / MariaDB**, **Microsoft SQL Server**, **Oracle**, **SQLite** (it is in your phone too).

## The relational model

Data lives in **tables** (relations).

```text
 students
 ┌────────────┬──────────────┬──────────┬───────┐
 │ neptun (PK)│ name         │ major    │ term  │   ← fields (columns)
 ├────────────┼──────────────┼──────────┼───────┤
 │ ABC123     │ Anna Kiss    │ comp.eng │   1   │   ← record (row)
 │ XYZ789     │ Béla Nagy    │ comp.eng │   3   │
 │ QWE456     │ Cili Tóth    │ bus.info │   1   │
 └────────────┴──────────────┴──────────┴───────┘
```

- **Field** (column, attribute): one property, with a given **type** (text, integer, date…).
- **Record** (row): all data of one entity.
- **Primary key** (PK): a field that **uniquely** identifies the record; it can't be empty or repeat (e.g. Neptun code, product ID).
- **Foreign key** (FK): a field pointing to another table's primary key – this links tables together.

## Relationships

| Relationship | Example                                                  |
| ------------ | -------------------------------------------------------- |
| **1 : 1**    | one person – one ID card                                 |
| **1 : N**    | one department – many lecturers                          |
| **N : M**    | many students – many courses (with a **junction table**) |

An N : M relationship is resolved by a third table:

```text
 students            enrolments                    courses
 ┌──────────┐       ┌──────────────┬───────────┐   ┌───────────┐
 │neptun(PK)│◄──────│neptun (FK)   │code (FK)  │──►│code (PK)  │
 │name      │       │              │           │   │name       │
 └──────────┘       └──────────────┴───────────┘   └───────────┘
```

## Normalisation in brief

The goal of **normalisation** is that every piece of data appears **once**. If we wrote the course name again for every enrolment, a rename would need fixing in a hundred places and contradictions would easily arise. Instead the course name is in the `courses` table once, and an enrolment only refers to its code.

## Summary

- Database = related, organised data; DBMS = the program managing it.
- Table, field, record; primary key = unique identifier, foreign key = reference to another table.
- Relationships: 1:1, 1:N, N:M (with a junction table); normalisation: every piece of data once.

## Exercise

```quiz required
? What is a **row** of a table called?
+ record
- field
- key
- schema
! A field is a column.

? Which field could be a good **primary key** in a student table?
- name
- year of birth
+ Neptun code
- major
! Unique and never empty.

? What is the relationship between students and courses (a student takes many courses, a course has many students)?
- 1 : 1
- 1 : N
+ N : M
! We implement it with a junction table.

? What is a field called that points to another table's primary key?
= foreign key
! FK.
```
