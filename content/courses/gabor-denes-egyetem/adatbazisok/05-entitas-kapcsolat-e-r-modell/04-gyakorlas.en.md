---
title: Practice – E-R Modelling
summary: Review questions and a complete modelling task (cinema ticket booking) from requirements to tables.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why do we say the E-R model is a conceptual model?</summary>

Because it describes the **concepts** of reality and their connections (entities, attributes, relationships) without technical details – data types, indexes, a specific DBMS. So it can be discussed with the client and converted to any relational system.

</details>

<details>
<summary>2. What is the difference between cardinality and participation?</summary>

Cardinality is the **upper bound** (at most how many related entities: one or many), participation is the **lower** one (is at least one required). For example: "a lecturer belongs to **exactly one** department" = upper bound 1, mandatory participation.

</details>

<details>
<summary>3. Why is storing age as a column a bad idea?</summary>

Because it is **derived** data: it can always be computed from the date of birth, but it changes on every birthday. If stored, someone would have to update it daily, otherwise it would contradict the date of birth.

</details>

<details>
<summary>4. Why is an order "line item" a weak entity?</summary>

Because the line number (1st, 2nd, 3rd item) is unique only within that order; on its own it doesn't identify the item. Its key: order number + line number, and if the order is deleted, its items lose their meaning too.

</details>

<details>
<summary>5. How do you turn a ternary relationship (lecturer – teaches – course – room) into a table?</summary>

The same way as an N : M relationship: a new table holds all three entities' keys as foreign keys (plus the relationship's attributes, e.g. time). The primary key is the combination of the keys (and the time, if needed).

</details>

## Summary task: cinema ticket booking

> A cinema shows **films** (title, length in minutes, age rating). The cinema has several **halls** (hall number, capacity). A **screening** shows a given film in a given hall at a given time. **Viewers** (name, email) make **bookings** for screenings; a booking can include several **seats** (row, seat). A viewer can't give several email addresses.

Design the E-R model and the tables in your head (or on paper), then answer!

```quiz required
? What is the cardinality between film and screening?
- 1 : 1
+ 1 : N
- N : M
! A film has many screenings, a screening shows one film.

? Which table gets the `film_id` foreign key?
- films
+ screenings
- halls
- viewers
! The "many" side (screening).

? The booking between viewer and screening is N : M (a viewer books many screenings, a screening has many viewers). What does it become in the tables?
- a foreign key in the viewers table
+ a bookings table with the viewer's and the screening's keys
- a multivalued column in the screenings table
- nothing
! A junction table, with its own id or a composite key.

? A booking can include several seats. How do you store the seats?
- in a text column: "5/7, 5/8, 5/9"
- in seat1, seat2, seat3 columns
+ in a separate table (booking id, row, seat)
! Multivalued data → separate table.

? What kind of attribute is the "screening end time" if the start and the film's length are known?
- key
- multivalued
+ derived
- composite
! Start + length: it can be computed.

? How many tables do you get in total? (films, halls, screenings, viewers + whatever bookings and seats need)
= 6
! films, halls, screenings, viewers, bookings, booked_seats.
```
