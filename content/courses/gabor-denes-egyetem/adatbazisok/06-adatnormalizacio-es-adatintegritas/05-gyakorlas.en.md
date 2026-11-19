---
title: Practice – Normalisation and Integrity
summary: Review questions and a normalisation task (library loans) from the raw table to 3NF, together with the integrity rules.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The exercises work on a slightly larger version of the library example above. Look at the last row: Dani Szabo's phone number is different there – a typical trace of an **update anomaly**!

<details>
<summary>Creating the flat loans table (SQL)</summary>

```sql setup
-- Unnormalised ("flat") table: every loan with all of its data.
CREATE TABLE loans_flat (
  reader_id      INT,
  reader_name    VARCHAR(40),
  reader_phone   VARCHAR(15),
  isbn           VARCHAR(5),
  title          VARCHAR(40),
  author         VARCHAR(40),
  publisher      VARCHAR(40),
  publisher_city VARCHAR(40),
  loan_date      DATE
);
INSERT INTO loans_flat VALUES
  (1, 'Anna Kiss',  '06301112222', '111', 'SQL Basics', 'Gabor Nagy', 'TechBooks', 'Budapest', '2026-10-01'),
  (1, 'Anna Kiss',  '06301112222', '222', 'Python',     'Eva Toth',   'CodePress', 'Szeged',   '2026-10-05'),
  (2, 'Dani Szabo', '06209998888', '111', 'SQL Basics', 'Gabor Nagy', 'TechBooks', 'Budapest', '2026-10-07'),
  (3, 'Emma Varga', '06705554444', '333', 'Networks',   'Peter Kiss', 'TechBooks', 'Budapest', '2026-10-08'),
  (2, 'Dani Szabo', '06201234567', '222', 'Python',     'Eva Toth',   'CodePress', 'Szeged',   '2026-10-12');
```

</details>

**1.** **Is the dependency violated?** The dependency `reader_id → reader_phone` should hold. Find the readers who have **several different phone numbers** (`reader_id`, the number of different numbers)!

```sql starter
SELECT reader_id, reader_phone
FROM loans_flat;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT reader_id, COUNT(DISTINCT reader_phone) AS phone_numbers
FROM loans_flat
GROUP BY reader_id
HAVING COUNT(DISTINCT reader_phone) > 1;  -- where one reader has several numbers
```

</details>

**2.** **Checking a dependency.** Does `isbn → title, author, publisher` hold? Per ISBN, count how many **different (title, author, publisher) variants** there are – if it's 1 everywhere, the dependency holds. Sorted by ISBN.

```sql starter
SELECT isbn, title, author, publisher
FROM loans_flat;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT isbn, COUNT(DISTINCT title || '|' || author || '|' || publisher) AS variants
FROM loans_flat
GROUP BY isbn
ORDER BY isbn;
```

</details>

**3.** **Decomposing towards 3NF.** The publisher's city depends on the publisher (a transitive dependency). Create the `publishers_n` table from the flat table (`publisher`, `publisher_city`, without duplicates), then query it sorted by publisher!

```sql starter
SELECT publisher, publisher_city
FROM loans_flat;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE publishers_n AS
SELECT DISTINCT publisher, publisher_city
FROM loans_flat;

SELECT * FROM publishers_n ORDER BY publisher;
```

</details>

**4.** **Lossless reconstruction.** Create the `books_n` (`isbn`, `title`, `publisher`) and `publishers_n` (`publisher`, `publisher_city`) tables, then **rebuild with a JOIN** the title and publisher city per book (`isbn`, `title`, `publisher_city`, by ISBN). If the decomposition is good, nothing is lost and nothing is duplicated.

```sql starter
-- 1. CREATE TABLE books_n AS SELECT DISTINCT ...
-- 2. CREATE TABLE publishers_n AS SELECT DISTINCT ...
-- 3. SELECT ... JOIN ...
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE books_n      AS SELECT DISTINCT isbn, title, publisher FROM loans_flat;
CREATE TABLE publishers_n AS SELECT DISTINCT publisher, publisher_city FROM loans_flat;

SELECT b.isbn, b.title, p.publisher_city
FROM books_n b
JOIN publishers_n p ON p.publisher = b.publisher   -- the common column (publisher) links them
ORDER BY b.isbn;
```

</details>

**5.** **Integrity afterwards.** Use `ALTER TABLE` to add a **primary key** on the `(reader_id, isbn, loan_date)` columns of the flat table, so that the same loan can't get in twice! The check tries it out.

```sql starter
ALTER TABLE loans_flat ...;
```

<details>
<summary>Solution</summary>

```sql solution
ALTER TABLE loans_flat ADD PRIMARY KEY (reader_id, isbn, loan_date);
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
INSERT INTO results VALUES (1, 'new loan',
  try_it($q$INSERT INTO loans_flat VALUES (3, 'Emma Varga', '06705554444', '111', 'SQL Basics', 'Gabor Nagy', 'TechBooks', 'Budapest', '2026-10-20')$q$));
INSERT INTO results VALUES (2, 'the same once more',
  try_it($q$INSERT INTO loans_flat VALUES (3, 'Emma Varga', '06705554444', '111', 'SQL Basics', 'Gabor Nagy', 'TechBooks', 'Budapest', '2026-10-20')$q$));
SELECT * FROM results ORDER BY seq;
```
