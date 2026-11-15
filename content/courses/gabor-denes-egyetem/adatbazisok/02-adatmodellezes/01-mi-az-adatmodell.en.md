---
title: What Is a Data Model?
summary: The three parts of a data model (structure, operations, constraints) and the conceptual, logical and physical modelling levels through an everyday example.
minutes: 15
---

## What you will learn

- what a **data model** is and what it consists of,
- the difference between **conceptual**, **logical** and **physical** models,
- why it pays to model before creating a single table.

## Like a house plan

Nobody builds a house by just starting to lay bricks. First comes a sketch ("three rooms, big kitchen"), then a precise floor plan (wall thickness, dimensions), and finally a construction plan (which bricks, from which supplier). A database is built the same way: the **data model** is a simplified but precise description of a piece of reality, from which the database is later built.

## The three parts of a data model

1. **Structure**: what data we store and how it is connected (e.g. student, course, enrollment).
2. **Operations**: what can be done with the data (query, insert, update, delete).
3. **Constraints** (integrity rules): what counts as valid data (e.g. a grade is an integer from 1 to 5, every student has a name).

## The three levels of modelling

| Level          | Question                     | Audience            | Tool, example                             |
| -------------- | ---------------------------- | ------------------- | ----------------------------------------- |
| **Conceptual** | _What_ do we want to record? | client, users       | E-R (entity-relationship) diagram, text   |
| **Logical**    | In what _structure_?         | designer, developer | relational schema: tables, columns, keys  |
| **Physical**   | How in a _specific_ DBMS?    | developer, DBA      | `CREATE TABLE` statements, types, indexes |

Let's look at the same task on all three levels: _"A library records books and readers, and who borrowed which book."_

**Conceptual model** – just the concepts and their relationships, no technical details:

```text
 [Reader] ──── borrows ──── [Book]
   name, email      date      title, author, ISBN
```

**Logical model** – tables, fields, keys (still fine for any relational DBMS):

```text
 reader(reader_id PK, name, email)
 book(isbn PK, title, author)
 loan(reader_id FK, isbn FK, date)
```

**Physical model** – for a specific system (here PostgreSQL), with types:

```sql
CREATE TABLE reader (
  reader_id SERIAL PRIMARY KEY,
  name      VARCHAR(80) NOT NULL,
  email     VARCHAR(120) UNIQUE
);
```

## Why is it worth it?

- Mistakes are cheapest to fix **on paper**: redrawing a line on a diagram takes minutes; reshaping a live table with millions of rows takes days.
- You can discuss the conceptual model with the **client** ("Yes, a reader can borrow several books at once"); you can't discuss SQL with them.
- A good model stores data **once**, avoiding the redundancy and inconsistency seen in the previous topic.

## Summary

- Data model = structure + operations + constraints.
- Conceptual (what?), logical (in what structure?), physical (how, in which DBMS?).
- Model first, then build: fixing the plan is cheapest.

## Lesson exercise

```quiz required
? Which one is **not** part of a data model?
- structure
- operations
- constraints
+ the type of the server's processor
! A data model describes structure, operations and constraints.

? At which modelling level do `CREATE TABLE` statements and concrete data types appear?
- conceptual
- logical
+ physical
! The physical model is made for a specific DBMS.

? Which level's model should you discuss with the client?
+ conceptual
- logical
- physical
! Without technical details, in plain language.

? "A grade can only be an integer from 1 to 5." Which part of the data model does this rule belong to?
- structure
- operations
+ constraints
! An integrity rule = a constraint.
```
