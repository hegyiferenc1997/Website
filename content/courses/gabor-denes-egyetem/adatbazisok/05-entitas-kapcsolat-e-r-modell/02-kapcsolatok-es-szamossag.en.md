---
title: Relationships and Cardinality
summary: Relationship and relationship type, degree (unary, binary, ternary), cardinality (1:1, 1:N, N:M), mandatory and optional participation, relationship attributes, weak entities, and Chen and crow's foot notation.
minutes: 22
---

## What you will learn

- what a **relationship** is and how many entity sets it can connect,
- what **cardinality** (1:1, 1:N, N:M) and **participation** (mandatory / optional) mean,
- what a **weak entity** is,
- how to read **crow's foot** notation, used by most design tools.

## Relationship

A **relationship** is a connection between entities: _Anna Kiss **took** Databases_. On a diagram it is a **diamond**, named with a verb or verb phrase.

A relationship's **degree** says how many entity sets it connects:

- **unary** (recursive): an entity set with itself – _an employee's **boss** is another employee_, _a course is a **prerequisite** of another course_,
- **binary**: two – the most common (_student – takes – course_),
- **ternary**: three – _a lecturer **teaches** a course in a room_.

## Cardinality

Cardinality tells **at most how many** others an entity can be connected to. Always ask **from both directions**!

| Cardinality | Question from both directions                      | Example               |
| ----------- | -------------------------------------------------- | --------------------- |
| **1 : 1**   | An A has at most one B, and a B has at most one A. | person – ID card      |
| **1 : N**   | An A has many B, but a B has at most one A.        | department – lecturer |
| **N : M**   | An A has many B, and a B has many A too.           | student – course      |

A trick to check: say both sentences out loud! _"A department employs **many** lecturers." "A lecturer works in **one** department."_ → 1 : N, the "many" side is the lecturer.

## Participation (mandatory or optional)

Cardinality is the **upper** bound, participation is the **lower**: must every entity take part in the relationship?

- **Mandatory** (total) participation: every lecturer **must** belong to a department.
- **Optional** (partial) participation: a student **may** not have taken any course yet (Emma Varga in the sample database is like that).

In Chen notation mandatory participation is shown with a **double line**.

## A relationship can have attributes too

**Whose** is the grade? Not the student's (they have many grades), not the course's – the grade belongs to the **fact of taking** the course: _Anna Kiss got a 5 in Databases._ So `grade` is an **attribute of the relationship**. N : M relationships typically have such attributes (date, quantity, grade, role).

## Weak entity

A **weak entity** can't be identified on its own, only together with another ("strong" or owner) entity. The classic example: the **rooms** of a building. "Room 101" can exist in several buildings; only **building + room number** together is unique.

- Notation: **double rectangle**, the identifying relationship is a **double diamond**.
- Key: the owner's key + its own **partial key** (room number).
- If the owner disappears (the building is demolished), the weak entities disappear too.

## Chen and crow's foot

Chen notation is good for learning but gets crowded for big systems. In practice (e.g. dbdiagram, MySQL Workbench, draw.io) **crow's foot** notation is common: an entity set is a box listing its attributes, and a relationship is a line whose **ends** carry symbols showing cardinality.

```text
 Symbols at the line end:  ──┼─   exactly one (mandatory)
                           ──○┼   zero or one
                           ──┼<   one or many (mandatory, many)
                           ──○<   zero or many

 ┌────────────┐                     ┌────────────┐
 │ DEPARTMENT │ ──┼─────────────○< │ LECTURER   │
 │ id (PK)    │                     │ id (PK)    │
 │ name       │                     │ name       │
 └────────────┘                     └────────────┘
 "A department has zero or many lecturers; a lecturer belongs to exactly one department."
```

Reading rule: the symbol at the **far** end of the line tells how many of **that** entity belong to one entity at the **near** end.

## Summary

- Relationship (diamond): unary, binary, ternary.
- Cardinality (upper bound): 1:1, 1:N, N:M – always ask from both directions.
- Participation (lower bound): mandatory or optional.
- Weak entity: identifiable only together with its owner.
- Crow's foot: the symbols at the line ends give the cardinality.

## Lesson exercise

```quiz required
? An employee has at most one direct boss, who is also an employee. What is the degree of this relationship?
+ unary (recursive)
- binary
- ternary
! The entity set is related to itself.

? A country has one capital, and a capital is the capital of one country. What is the cardinality?
+ 1 : 1
- 1 : N
- N : M
! At most one from both directions.

? An author can write many books, and a book can have many authors. What is the cardinality?
- 1 : 1
- 1 : N
+ N : M
! Many from both directions.

? Where does the "loan date" belong in a reader – borrows – book model?
- to the reader
- to the book
+ to the borrows relationship
! The date describes the fact of borrowing.

? In a hotel the room number is unique only together with the hotel ("room 12" exists in many hotels). What is the room?
= weak entity
= gyenge egyed
! It can only be identified together with the owner's (hotel's) key.

? In crow's foot notation, what does the `○<` symbol at the line end mean?
- exactly one
- zero or one
- one or many
+ zero or many
! The circle = can be zero, the crow's foot = many.
```
