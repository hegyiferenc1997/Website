---
title: Practice – E-R Modelling
summary: Review questions and a complete modelling task (cinema ticket booking) from requirements to tables.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

**1.** **Querying a 1:N relationship.** We store a library's authors and books. For **every author**, show how many books they have – including those who have **none** (with 0)! Sorted by name.

```sql starter
CREATE TABLE authors (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
CREATE TABLE books (
  id        INT PRIMARY KEY,
  title     VARCHAR(60) NOT NULL,
  author_id INT REFERENCES authors (id)
);
INSERT INTO authors VALUES (1, 'Mor Jokai'), (2, 'Magda Szabo'), (3, 'Istvan Orkeny');
INSERT INTO books VALUES (1, 'The Man with the Golden Touch', 1), (2, 'The Baron''s Sons', 1), (3, 'The Door', 2);

SELECT a.name, b.title
FROM authors a JOIN books b ON b.author_id = a.id;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE authors (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
CREATE TABLE books (
  id        INT PRIMARY KEY,
  title     VARCHAR(60) NOT NULL,
  author_id INT REFERENCES authors (id)
);
INSERT INTO authors VALUES (1, 'Mor Jokai'), (2, 'Magda Szabo'), (3, 'Istvan Orkeny');
INSERT INTO books VALUES (1, 'The Man with the Golden Touch', 1), (2, 'The Baron''s Sons', 1), (3, 'The Door', 2);

SELECT a.name, COUNT(b.id) AS book_count      -- COUNT(b.id): a missing (NULL) book counts as 0
FROM authors a
LEFT JOIN books b ON b.author_id = a.id       -- LEFT JOIN: authors without books stay too
GROUP BY a.name
ORDER BY a.name;
```

</details>

**2.** **An N:M relationship with a junction table.** Pupils attend clubs; a pupil can attend several clubs, a club has several pupils. Create the `membership` junction table (`pupil_id`, `club_id`) with a **composite primary key** and **two foreign keys**!

```sql starter
CREATE TABLE pupils (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
CREATE TABLE clubs (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO pupils VALUES (1, 'Anna'), (2, 'Bela');
INSERT INTO clubs VALUES (1, 'Robotics'), (2, 'Chess');

CREATE TABLE membership (
  pupil_id INT
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE pupils (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
CREATE TABLE clubs (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO pupils VALUES (1, 'Anna'), (2, 'Bela');
INSERT INTO clubs VALUES (1, 'Robotics'), (2, 'Chess');

CREATE TABLE membership (
  pupil_id INT REFERENCES pupils (id),
  club_id  INT REFERENCES clubs (id),
  PRIMARY KEY (pupil_id, club_id)            -- a pupil is in a club only once
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'Anna in robotics', try_it($q$INSERT INTO membership VALUES (1, 1)$q$));
INSERT INTO results VALUES (2, 'Anna in chess too', try_it($q$INSERT INTO membership VALUES (1, 2)$q$));
INSERT INTO results VALUES (3, 'Anna twice in robotics', try_it($q$INSERT INTO membership VALUES (1, 1)$q$));
INSERT INTO results VALUES (4, 'non-existent club', try_it($q$INSERT INTO membership VALUES (2, 9)$q$));
SELECT * FROM results ORDER BY seq;
```

**3.** **A weak entity.** A room can only be identified together with its building: room 101 in building A is different from room 101 in building B. Create the `rooms` table (`building_code`, `room_number`, `capacity`) so that the key is **the building and the room number together**, and the building is a **foreign key**!

```sql starter
CREATE TABLE buildings (code CHAR(1) PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO buildings VALUES ('A', 'Main building'), ('B', 'Lab');

CREATE TABLE rooms (
  room_number INT PRIMARY KEY
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE buildings (code CHAR(1) PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO buildings VALUES ('A', 'Main building'), ('B', 'Lab');

CREATE TABLE rooms (
  building_code CHAR(1) REFERENCES buildings (code),
  room_number   INT,
  capacity      INT,
  PRIMARY KEY (building_code, room_number)   -- the "owner's" key + the partial key
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'A101', try_it($q$INSERT INTO rooms VALUES ('A', 101, 30)$q$));
INSERT INTO results VALUES (2, 'B101', try_it($q$INSERT INTO rooms VALUES ('B', 101, 20)$q$));
INSERT INTO results VALUES (3, 'A101 once more', try_it($q$INSERT INTO rooms VALUES ('A', 101, 50)$q$));
INSERT INTO results VALUES (4, 'non-existent building', try_it($q$INSERT INTO rooms VALUES ('C', 1, 10)$q$));
SELECT * FROM results ORDER BY seq;
```

**4.** **A 1:1 relationship.** Every person can have at most one ID card. Create the `id_cards` table (`number` key, `person_id`, `valid_until` date) so that a person **can't have two ID cards**!

```sql starter
CREATE TABLE persons (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO persons VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy');

CREATE TABLE id_cards (
  number VARCHAR(10) PRIMARY KEY
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE persons (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL);
INSERT INTO persons VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy');

CREATE TABLE id_cards (
  number      VARCHAR(10) PRIMARY KEY,
  person_id   INT NOT NULL UNIQUE REFERENCES persons (id),   -- UNIQUE makes it 1:1
  valid_until DATE
);
```

</details>

```sql test
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (seq INT, test TEXT, result TEXT);
INSERT INTO results VALUES (1, 'Anna''s ID card', try_it($q$INSERT INTO id_cards VALUES ('123456AB', 1, '2030-01-01')$q$));
INSERT INTO results VALUES (2, 'Anna''s second ID card', try_it($q$INSERT INTO id_cards VALUES ('654321CD', 1, '2031-01-01')$q$));
INSERT INTO results VALUES (3, 'Bela''s ID card', try_it($q$INSERT INTO id_cards VALUES ('111111EF', 2, '2029-06-30')$q$));
SELECT * FROM results ORDER BY seq;
```
