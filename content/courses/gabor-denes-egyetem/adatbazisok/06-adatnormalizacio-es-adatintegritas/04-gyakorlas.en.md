---
title: Practice – Normalisation and Integrity
summary: Review questions and a normalisation task (library loans) from the raw table to 3NF, together with the integrity rules.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. What is the common cause of update, insertion and deletion anomalies?</summary>

That the data of **several different things** (e.g. student, course and enrollment) is mixed in one table, so the same information appears many times, and some data can only be stored together with other data.

</details>

<details>
<summary>2. Why can't a table with a single-column key break 2NF?</summary>

Because 2NF forbids **partial** dependency, i.e. an attribute depending on only part of the key. A key made of a single column has no real part.

</details>

<details>
<summary>3. What is the difference between ON DELETE CASCADE and ON DELETE SET NULL?</summary>

With `CASCADE`, deleting the parent row deletes the child rows referring to it too. With `SET NULL`, the child rows remain, only their foreign key becomes NULL. The first suits children that are meaningless without the parent (order items), the second children that stand on their own (a blog post after its author is deleted).

</details>

<details>
<summary>4. Why is it dangerous to create the foreign key pointing to invoices with CASCADE?</summary>

Because deleting a customer would take all their invoices with it, yet invoices must be kept for years by law. Here `RESTRICT` (or marking the customer "inactive" instead of deleting) is the safe solution.

</details>

<details>
<summary>5. If normalisation is so good, why do people sometimes denormalise?</summary>

Because a normalised schema needs many joins, which can be slow in very large, read-optimised (analytical) systems. Then we deliberately store duplicated or precomputed data, accepting that updates need extra care.

</details>

## Summary task: library loans

A library keeps loans in a single table:

| reader_id | reader_name | reader_phone | isbn | title      | author     | publisher | publisher_city | loan_date  |
| --------- | ----------- | ------------ | ---- | ---------- | ---------- | --------- | -------------- | ---------- |
| 1         | Anna Kiss   | 06301112222  | 111  | SQL Basics | Gabor Nagy | TechBooks | Budapest       | 2026-10-01 |
| 1         | Anna Kiss   | 06301112222  | 222  | Python     | Eva Toth   | CodePress | Szeged         | 2026-10-05 |
| 2         | Dani Szabo  | 06209998888  | 111  | SQL Basics | Gabor Nagy | TechBooks | Budapest       | 2026-10-07 |

The key is `(reader_id, isbn, loan_date)`. A book has one author and one publisher.

```quiz required
? Is 1NF satisfied (every cell atomic)?
+ yes
- no
! No cell holds a list.

? Which one is a partial dependency?
- (reader_id, isbn, loan_date) → nothing
+ isbn → title, author, publisher
- publisher → publisher_city
- reader_name → reader_id
! The book's data depends only on the ISBN, which is part of the key.

? Which transitive dependency remains in the books table after 2NF?
- isbn → title
+ isbn → publisher → publisher_city
- reader_id → reader_name
- isbn → author
! The publisher's city depends on the publisher, not directly on the book.

? How many tables do you get in 3NF? (readers, books, publishers, loans)
= 4
! readers, books, publishers, loans.

? We want to delete a reader but keep their loan history for statistics, without the reader. Which ON DELETE setting suits the loans' reader_id foreign key?
- CASCADE
+ SET NULL
- RESTRICT
! The loan stays, only the reader becomes unknown.

? Which kind of integrity does `CHECK (loan_date <= CURRENT_DATE)` ensure?
- entity integrity
- referential integrity
+ domain integrity
! It defines the allowed range of the value.
```
