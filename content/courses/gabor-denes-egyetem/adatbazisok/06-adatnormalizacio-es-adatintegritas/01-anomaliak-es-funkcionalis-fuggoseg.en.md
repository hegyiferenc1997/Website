---
title: Anomalies and Functional Dependency
summary: Why "everything in one table" is a bad idea – insertion, update and deletion anomalies – and the basic concept of normalisation, functional dependency (full, partial, transitive).
minutes: 20
---

## What you will learn

- which **anomalies** appear in a badly designed table,
- what a **functional dependency** is and how to spot one,
- what **partial** and **transitive** dependencies are (the normal forms build on these).

## The "everything in one table" trap

A beginner developer stores enrollments like this – in a single, seemingly convenient table:

| neptun | name       | major    | code | course_name         | credits | grade |
| ------ | ---------- | -------- | ---- | ------------------- | ------- | ----- |
| ABC123 | Anna Kiss  | comp eng | ADB  | Databases           | 5       | 5     |
| ABC123 | Anna Kiss  | comp eng | DIG  | Digital Technology  | 5       | 4     |
| CDE345 | Cili Toth  | bus inf  | ADB  | Databases           | 5       | 4     |
| DEF456 | Dani Szabo | comp eng | ADB  | Databases           | 5       | 3     |

At first glance everything is fine. But look what happens in use:

- **Update anomaly**: the credits of Databases change to 6. You have to change three rows; miss one and the database contradicts itself.
- **Insertion anomaly**: a new course (Networks) starts, but nobody has taken it yet. You can't add it, because it has no Neptun code (which is part of the key).
- **Deletion anomaly**: Dani Szabo drops Databases. If that was their only row, the fact that they exist and which major they study disappears with it.

All three have the same cause: **several things** (student, course, enrollment) are mixed in one table, so the same information appears **many times**. **Normalisation** is the method for taking this apart systematically.

## Functional dependency

The key concept of normalisation. We say **A functionally determines B** (notation: **A → B**) if the value of A **uniquely determines** the value of B. If two rows have the same A, they must have the same B.

Examples from the table above:

- `neptun → name, major` – a Neptun code always comes with the same name and major.
- `code → course_name, credits` – a course code always comes with the same course name and credits.
- `(neptun, code) → grade` – the grade needs **both**: Anna got a 5 in ADB and a 4 in DIG.

The reverse is **not** true: `name → neptun` isn't a dependency (there may be two Anna Kisses), nor is `credits → code` (many courses are worth 5 credits).

An everyday analogy: **personal ID number → date of birth** is a dependency (the number reveals the date), but **date of birth → personal ID number** isn't (many people were born on the same day).

## Kinds of dependencies

Here the table's key is `(neptun, code)`. Dependencies are examined relative to the key:

- **Full dependency**: the attribute depends on the **whole** key, not on part of it. `(neptun, code) → grade` – this is the good kind.
- **Partial dependency**: the attribute depends on only **part** of the key. `code → course_name` – the course name has nothing to do with the Neptun code. This causes the duplication!
- **Transitive dependency**: a non-key attribute depends on **another non-key** attribute. If, for example, we stored `head_of_major` next to `major` for each student: `neptun → major → head_of_major`. The head of the major depends on the student only indirectly, through the major.

```text
  (neptun, code) ──► grade                  full dependency ✓
       │      └───► course_name, credits     partial (only on code) ✗
       └──────────► name, major              partial (only on neptun) ✗
  neptun ──► major ──► head_of_major         transitive ✗
```

In the next lesson the normal forms remove exactly these faulty dependencies, step by step.

## Summary

- Anomalies: update (fix in many places), insertion (can't add), deletion (information is lost).
- A → B: the value of A uniquely determines B.
- Full (good), partial (on part of the key), transitive (on a non-key) dependency.

## Lesson exercise

```quiz required
? Renaming a course requires changing 300 rows, and one is missed. Which anomaly is this?
+ update anomaly
- insertion anomaly
- deletion anomaly
! The same data appears in many places.

? You can't add a new product category until it has a product. Which anomaly is this?
- update anomaly
+ insertion anomaly
- deletion anomaly
! The data can't be stored on its own.

? Which one is a **real** functional dependency?
- name → neptun
- credits → code
+ neptun → date_of_birth
- grade → neptun
! A Neptun code always comes with the same date of birth.

? The key is `(order_no, product_code)`. `product_name` depends only on `product_code`. What kind of dependency is this?
- full
+ partial
- transitive
! It depends on part of the key.

? `employee_id → dept_id → dept_name`. What kind of dependency links `dept_name` to `employee_id`?
= transitive
= tranzitív
! Indirectly, through a non-key attribute.
```
