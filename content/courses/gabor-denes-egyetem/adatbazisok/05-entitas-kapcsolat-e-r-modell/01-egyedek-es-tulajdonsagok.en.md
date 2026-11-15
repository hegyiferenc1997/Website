---
title: Entities and Attributes
summary: Entity and entity set, kinds of attributes (simple, composite, single-valued, multivalued, derived, key) and how to draw them on an E-R diagram.
minutes: 18
---

## What you will learn

- what an **entity** and an **entity set** are,
- the kinds of **attributes**,
- how to **draw** them on an E-R diagram.

## The E-R model

The **entity-relationship model** (E-R) is Peter Chen's 1976 idea: we describe the world through **things** (entities), their **characteristics** (attributes) and the **relationships** between things. It is the most popular **conceptual** modelling tool: a simple drawing the client can understand, from which tables can be built almost mechanically.

## Entity and entity set

- **Entity**: a concrete, distinguishable "thing" in reality: _Anna Kiss_, _the Databases course_, _room 101_.
- **Entity set** (entity type): all entities of the same kind: _Student_, _Course_, _Room_.

On a diagram an entity set is drawn as a **rectangle**. In everyday speech we often just call the entity set an "entity" – the context tells which one we mean.

An entity can be a **tangible** thing (car, book, product) or an **abstract** concept (order, loan, booking).

## Kinds of attributes

An attribute is a characteristic of an entity set. In Chen notation it is an **ellipse**, connected to the rectangle by a line.

| Kind               | Meaning                                          | Example                                | Notation              |
| ------------------ | ------------------------------------------------ | -------------------------------------- | --------------------- |
| **Simple**         | can't be split further                           | date of birth                          | ellipse               |
| **Composite**      | can be split into parts                          | address = postcode + city + street     | ellipse with more ellipses branching off |
| **Single-valued**  | has one value per entity                         | Neptun code                            | ellipse               |
| **Multivalued**    | can have several values per entity               | phone numbers, languages spoken        | **double** ellipse    |
| **Derived**        | can be computed from other attributes            | age (from date of birth)               | **dashed** ellipse    |
| **Key**            | uniquely identifies the entity                   | Neptun code                            | **underlined** name   |

```text
                (neptun)            ((phone))
                 ‾‾‾‾‾‾          double: multivalued
                   │                    │
   (name) ────── [ STUDENT ] ────── (address) ──┬── (postcode)
                   │                            ├── (city)
                (- age -)                       └── (street)
           dashed: derived                    composite
```

## Why does the kind matter?

Because each one is handled differently when turning it into tables (lesson 3):

- a **composite** attribute is usually split into its parts (`postcode`, `city`, `street` as separate columns – so you can search by city),
- a **multivalued** attribute goes into a **separate table** (a cell can't hold a list),
- a **derived** attribute is usually **not stored** but calculated at query time (age would change on every birthday!),
- the **key** becomes the primary key.

## Entity or attribute?

A common dilemma. Some rules of thumb:

- If something has **its own attributes** (a department has a name, building, head), make it an **entity**.
- If **several entities share it**, or it makes sense on its own, make it an entity.
- If it's just a single value describing one entity (a student's date of birth), make it an **attribute**.

## Summary

- Entity = a concrete thing; entity set = entities of the same kind (rectangle).
- Attribute (ellipse): simple / composite, single-valued / multivalued (double), derived (dashed), key (underlined).
- The kind determines what it becomes in the tables.

## Lesson exercise

```quiz required
? What is "Student" in the E-R model?
- an entity
+ an entity set
- a relationship
- an attribute
! The set of entities of the same kind; Anna Kiss is an entity.

? A person speaks several languages. What kind of attribute is "languages spoken"?
- composite
+ multivalued
- derived
- key
! An entity can have several values: double ellipse.

? What kind of attribute is **age** if the date of birth is already stored?
- composite
- multivalued
+ derived
- key
! It can be computed, so it's a dashed ellipse and usually not stored.

? How is a **key** attribute marked in a Chen diagram?
- with a double ellipse
- with a dashed ellipse
+ with an underlined name
- with a diamond
! The diamond is the sign of a relationship.

? "Address" can be split into postcode, city and street. What kind of attribute is it?
= composite
! An attribute that can be split into parts.
```
