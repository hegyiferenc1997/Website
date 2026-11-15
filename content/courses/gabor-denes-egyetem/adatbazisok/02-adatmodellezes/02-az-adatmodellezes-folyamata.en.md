---
title: The Data Modelling Process
summary: From gathering requirements to the finished schema – picking entities and attributes out of a text, relationships, validation, naming conventions and the data dictionary.
minutes: 18
---

## What you will learn

- the **steps** of building a data model,
- how to find **entities**, **attributes** and **relationships** in a text description,
- which **naming conventions** to follow.

## The steps

```text
 1. Gather         →  2. Entities and   →  3. Relationships  →  4. Logical schema  →  5. Validation
    requirements         attributes           and cardinality      (tables, keys)        (normalisation,
    (interviews, forms)                                                                    sample data)
```

The process is **not one-way**: validation often reveals a misunderstanding, and you have to step back.

### 1. Gathering requirements

Talk to the future users, look at existing **forms, spreadsheets and reports**. Ask about the exceptions too: _"Can a student have two majors?"_, _"What happens when a course is discontinued?"_ Most modelling mistakes come from someone not asking.

### 2. Entities and attributes – "noun hunting"

A simple but very effective trick: in the requirements text, **nouns** are often **entities** or **attributes**, and **verbs** are often **relationships**.

> A **gym** records its **members** (**name**, **email**, **date of birth**) and **trainers** (**name**, **speciality**). Every **class** (**title**, **time**, **room**) is **led** by a trainer, and members **sign up** for classes.

- Entities (independent "things" there are many of): **member**, **trainer**, **class**.
- Attributes (describe an entity): name, email, date of birth, speciality, title, time, room.
- Relationships (verbs): a trainer **leads** a class, a member **signs up** for a class.

Tip: if a noun has **its own attributes**, or we'd refer to it **in several places**, it is probably an entity. "Room" could be an entity too (capacity, floor), if those are needed.

### 3. Relationships and cardinality

For every relationship, clarify: **how many** can be connected from each side?

- A trainer leads **many** classes, a class is led by **one** trainer → **1 : N**.
- A member signs up for **many** classes, a class has **many** members → **N : M**.

In topic 5 (E-R model) you will learn to draw this in detail.

### 4. Logical schema

```text
 member(member_id PK, name, email, born)
 trainer(trainer_id PK, name, speciality)
 class(class_id PK, title, time, room, trainer_id FK → trainer)
 signup(member_id FK → member, class_id FK → class)   ← the N:M relationship gets its own table
```

### 5. Validation

- "Play it through" with **sample data**: can you enter a real week's classes? Can you query who attends Anna's classes?
- Check for **repeated** data (topic 6: normalisation).
- Show it to the client.

## Naming conventions

It doesn't matter which one you choose, but use it **consistently within a project**:

- lowercase names with underscores: `date_of_birth` (not `DateOfBirth`, not `date of birth`),
- no accents or spaces (many tools can't handle them),
- tables: plural or singular – pick one (`students` or `student`),
- primary key: `id` or `table_id`; foreign key: referenced table's name + `_id`.

## Data dictionary

A **data dictionary** is a table that describes every field: what it means, its type, whether it's required, and what values it may take. It is worth its weight in gold when a new colleague (or you, six months later) tries to work out what `stat_code` means.

| Field   | Meaning            | Type       | Required | Rule                   |
| ------- | ------------------ | ---------- | -------- | ---------------------- |
| `email` | the member's email | text (120) | yes      | unique                 |
| `born`  | date of birth      | date       | no       | can't be in the future |

## Summary

- Steps: requirements → entities and attributes → relationships → logical schema → validation (and back if needed).
- Nouns ≈ entities / attributes, verbs ≈ relationships.
- Consistent naming and a data dictionary.

## Lesson exercise

Read the description and answer!

> A **rental company** rents **cars** (licence plate, model, daily rate) to **customers** (name, driving licence number). A customer can rent several cars (in different periods), and a car is rented by many customers over the years.

```quiz required
? How many **entities** are in the description (not counting the rental company itself)?
= 2
! Car and customer.

? What is the "daily rate"?
- an entity
+ an attribute
- a relationship
! It describes the car.

? What is the cardinality of the "rents" relationship between customer and car?
- 1 : 1
- 1 : N
+ N : M
! A customer rents many cars, a car is rented by many customers.

? How many tables do we get in the logical schema if the N : M relationship gets its own table?
= 3
! customer, car, rental.

? Which column name follows the lesson's naming conventions?
- Date Of Birth
- DateOfBirth
+ date_of_birth
- d.o.b.
! Lowercase, underscores, no accents or spaces.
```
