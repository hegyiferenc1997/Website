---
title: The Relational Model
summary: Relation, tuple, attribute, domain, degree and cardinality; kinds of keys (superkey, candidate, primary, alternate and foreign key) and Codd's most important rules.
minutes: 20
---

## What you will learn

- the **concepts** of the relational model and their "official" names,
- the kinds of **keys**, and how to choose a primary key,
- how a **foreign key** connects tables.

## Relation = table (almost)

In the relational model all data lives in **relations**. In practice a relation is a **table**, but mathematically it is a set, so it has a few rules:

```text
                 attributes (columns) – degree = 4
             ┌────────┬───────────┬───────────┬──────────┐
 students    │ neptun │ name      │ major     │ semester │  ← schema (header)
             ├────────┼───────────┼───────────┼──────────┤
             │ ABC123 │ Anna Kiss │ comp eng  │    3     │  ← row (record, tuple)
             │ BCD234 │ Bela Nagy │ comp eng  │    1     │
             │ CDE345 │ Cili Toth │ bus inf   │    3     │
             └────────┴───────────┴───────────┴──────────┘
                     cardinality = 3 (number of rows)
```

| Official name               | Everyday name   | Meaning                                              |
| --------------------------- | --------------- | ---------------------------------------------------- |
| **relation**                | table           | a set of rows with the same structure                |
| **attribute**               | column, field   | a property, with a name and a domain                 |
| **tuple**                   | row, record     | the data of one entity                               |
| **domain**                  | type            | the possible values of the attribute                 |
| **degree**                  | number of columns | how many attributes it has                         |
| **cardinality**             | number of rows  | how many rows it has (this changes constantly)       |
| **schema**                  | header          | the relation's name and attributes: `students(neptun, name, major, semester)` |

The **rules** of a relation:

- every cell holds **a single, indivisible** value (not a list!),
- there are no two **completely identical** rows,
- the **order of rows doesn't matter** (if you want a sorted result, you must ask for it),
- the order of columns doesn't matter either, because we refer to them by name.

## Keys

Keys are the most important tools of the relational model: they identify and connect.

- **Superkey**: a set of attributes that uniquely identifies every row. E.g. `{neptun}`, but also `{neptun, name}` (the name is just unnecessary).
- **Candidate key**: a **minimal** superkey – no attribute can be left out. For a student, both `neptun` and `tax_id` could be candidate keys.
- **Primary key** (PK): the **chosen** one of the candidate keys. It can't be NULL and can't repeat.
- **Alternate key**: the other candidate keys (we put a `UNIQUE` constraint on them).
- **Composite key**: a key made of several attributes, e.g. `(neptun, code)` in the `enrollments` table.
- **Foreign key** (FK): an attribute that refers to the primary key of **another** (or the same) table.

### Natural or surrogate key?

- **Natural key**: comes from the real world (Neptun code, ISBN, licence plate). Meaningful, but if reality changes (new plate), there's trouble.
- **Surrogate key**: a meaningless sequence number (`id SERIAL` or a UUID). It never changes, so it is very common in practice.

## A foreign key connects

```text
 students                  enrollments                   courses
 ┌────────────┐           ┌──────────────┬───────────┐   ┌──────────┐
 │ neptun (PK)│◄──────────│ neptun (FK)  │ code (FK) │──►│ code (PK)│
 │ name       │           │ grade        │           │   │ name     │
 └────────────┘           └──────────────┴───────────┘   └──────────┘
```

`enrollments.neptun` can only take a value that **exists** as a Neptun code in `students`. This is called **referential integrity**: there can't be an "orphan" enrollment for a non-existent student.

## Codd's rules in brief

In 1985 E. F. Codd summed up in 12 (+1) rules what makes a system truly relational. The most important ones:

1. **Information rule**: all data appears as values in table cells.
2. **Guaranteed access**: any value can be reached by table name + primary key + column name.
3. **Systematic treatment of NULLs**: missing data is marked uniformly.
4. **Self-describing catalog**: the database's structure can also be queried as tables (in PostgreSQL e.g. `information_schema`).
5. **Comprehensive language**: one language (today: SQL) handles structure, data, permissions and transactions.

## Summary

- Relation (table), attribute (column), tuple (row), domain, degree (number of columns), cardinality (number of rows).
- Superkey ⊇ candidate key (minimal) → one becomes primary, the rest alternate.
- A foreign key refers to another table's primary key (referential integrity).

## Lesson exercise

```quiz required
? What is the **degree** of the relation `students(neptun, name, major, semester)`?
= 4
! It has four attributes.

? What is the official name for the **number of rows** in a table?
- degree
+ cardinality
- domain
- schema
! Degree is the number of columns.

? `{neptun, name}` uniquely identifies a student, but the name can be dropped from it. What is it?
+ a superkey, but not a candidate key
- a candidate key
- a foreign key
- a primary key
! A candidate key is minimal.

? `enrollments.code` refers to the primary key `courses.code`. What kind of key is `enrollments.code`?
= foreign key
= FK
= idegen kulcs
! It points to another table's primary key.

? Which statement is **true** for a relation?
- The order of rows is fixed.
- A cell can hold a list.
+ It can't have two completely identical rows.
- Columns are referred to by position.
! A relation is a set: it has no duplicate elements.
```
