---
title: Practice – Databases and Data Management
summary: Review questions and a summary worksheet on the relational model, SQL, NoSQL and the GDPR.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. Design tables for a library: books, readers, loans. What are the keys?</summary>

`books(isbn PK, title, author, year)`, `readers(card_no PK, name, email)`, `loans(id PK, isbn FK, card_no FK, issued, returned)`. The loan links the book and the reader (an N : M relationship with a junction table).

</details>

<details>
<summary>2. Write an SQL query that lists the names of students with a GPA above 4.0 in alphabetical order!</summary>

```sql
SELECT name FROM students WHERE gpa > 4.0 ORDER BY name;
```

</details>

<details>
<summary>3. A web shop requires the customer's date of birth and mother's name for an order. Which GDPR principle does it violate?</summary>

Data minimisation (and purpose limitation): this data isn't needed to fulfil an order.

</details>

```python run
# GROUP BY in Python: head count and average per major
students = [
    ("Anna Kiss", "comp.eng", 4.5),
    ("Béla Nagy", "comp.eng", 3.8),
    ("Cili Tóth", "bus.info", 4.1),
    ("Dénes Kovács", "comp.eng", 3.2),
]
groups = {}
for name, major, gpa in students:
    groups.setdefault(major, []).append(gpa)
for major, gpas in groups.items():
    print(major, len(gpas), round(sum(gpas) / len(gpas), 2))
```

## Summary worksheet

```quiz required
? What are the two main properties of a primary key?
+ unique and never empty
- always text and short
- always the first column and a number
- anyone may modify it
! It uniquely identifies a record.

? Which SQL statement **modifies** existing rows?
- INSERT
+ UPDATE
- SELECT
- JOIN
! UPDATE … SET … WHERE …

? What is the average of the comp.eng major in the Python example above (two decimals)?
= 3.83
! (4.5 + 3.8 + 3.2) / 3 = 3.83.

? Which SQL clause groups rows by the values of a column?
= GROUP BY
! E.g. GROUP BY major.

? Which database is typically an **in-memory** key–value store used as a cache?
- PostgreSQL
- Neo4j
+ Redis
- MongoDB
! Very fast, often used as a cache.

? Which right does the data subject **not** have under the GDPR?
- access to their own data
- rectification of the data
- erasure of the data
+ requesting other people's data
! Their rights concern their own data only.
```
