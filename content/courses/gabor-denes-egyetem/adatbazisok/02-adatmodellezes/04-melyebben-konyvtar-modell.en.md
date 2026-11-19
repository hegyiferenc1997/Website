---
title: Deeper – Let's Model a Library Together
summary: A complete data model from a plain-text description to tables, step by step; the difference between a "book" and a "copy"; comparing several possible models; the classic data-type traps (money as floating point, dates as text, phone numbers as numbers) – with runnable examples.
minutes: 35
---

## What you will learn in this lesson

- how to get from an **everyday description** to a finished data model, step by step,
- why you must distinguish the **"kind of thing"** from the **"concrete item"** (book versus copy),
- that a task can have **several good models**, and how to choose between them,
- the most common **data-type mistakes** – and you will try them out yourself.

## The client's description

A small-town library writes to us:

> _"We'd like to keep track of our books. A book has a title, an author (sometimes several), a publication year and an ISBN. We have several copies of popular books. Our readers sign up (name, address, phone number) and can borrow books. We want to know who took which copy, when, and when they brought it back. We charge 50 HUF per day for late returns."_

### Step 1 – noun hunting

Underline the nouns: _book, title, author, publication year, ISBN, copy, reader, name, address, phone number, loan, date, late return, fee_.

Now sort them: which is an **independent thing** (entity), and which is just a **property** of a thing?

| Noun              | Entity or property?           | Why?                                                   |
| ----------------- | ----------------------------- | ------------------------------------------------------ |
| book              | **entity**                    | many properties, many other things relate to it        |
| title, ISBN, year | properties of the book        | not interesting on their own                           |
| author            | **entity** (!)                | a book can have several authors, an author several books |
| copy              | **entity**                    | borrowed separately, has its own condition             |
| reader            | **entity**                    | many properties, many loans                            |
| loan              | **entity** (an event)         | has its own data: when taken, when returned            |
| late fee          | **computed value**            | can be calculated from the dates, no need to store it  |

Note the last row: we usually don't store **computable** data, because if a date changes, the stored fee becomes outdated (contradiction!).

### Step 2 – the "book" versus "copy" trap

The most common beginner mistake is to put the book and the copy in one table:

```text
books_WRONG
| id | title             | author        | isbn          | on_loan |
|----|-------------------|---------------|---------------|---------|
| 1  | The Paul Street Boys | Ferenc Molnár | 9789631193… | yes     |
| 2  | The Paul Street Boys | Ferenc Molnár | 9789631193… | no      |
| 3  | The Paul Street Boys | Ferenc Molnár | 9789631193… | yes     |
```

Title, author and ISBN appear three times. Fixing a typo means fixing it three times. Instead:

- **book** = an edition of a work (title, ISBN, year) – the "kind";
- **copy** = a physical item on the shelf (inventory number, condition) – the "concrete item".

**Analogy:** "Toyota Corolla 2024" is a **model**, the car with a licence plate in the car park is an **instance**. A car rental company rents out the instance, not the model. Likewise, a cinema ticket is for a **screening**, not for the film.

This pattern shows up everywhere: product ↔ stock item, subject ↔ course offering (in a given semester), flight number ↔ a concrete flight on a given day.

### Step 3 – relationships

- a **book** has many **copies**, a copy belongs to exactly one book → **1:N**;
- a **book** has many **authors**, an **author** has many books → **N:M** (needs a junction table: `book_author`);
- a **reader** starts many **loans**, a loan belongs to one reader → **1:N**;
- a **copy** is borrowed many times (at different times) → **1:N** between copy and loan.

```text
  AUTHOR ──N:M── BOOK ──1:N── COPY ──1:N── LOAN ──N:1── READER
          (book_author)
```

### Step 4 – logical schema

```text
authors     (author_id PK, name)
books       (isbn PK, title, pub_year)
book_author (isbn FK, author_id FK, PK(isbn, author_id))
copies      (inventory_no PK, isbn FK, acquired_on, condition)
readers     (reader_id PK, name, address, phone)
loans       (loan_id PK, inventory_no FK, reader_id FK,
             taken_on, due_on, returned_on NULLABLE)
```

`returned_on` may be `NULL`: that means the book is **still out**. Here NULL really means "not known yet" – a proper use.

### Step 5 – checking with questions

You test a good model by "running" the client's questions on it in your head:

- _"How many copies of The Paul Street Boys are out right now?"_ → books → copies → loans where `returned_on IS NULL`. ✔
- _"Who is late?"_ → loans where `returned_on IS NULL AND due_on < today`. ✔
- _"Which books by Ferenc Molnár do we have?"_ → authors → book_author → books. ✔

If you can't answer a question, something is missing from the model.

## There is more than one good model

Several correct models can be given for the same description. Some decisions where debate is legitimate:

| Question                                  | Option A                              | Option B                                 | When which?                                          |
| ----------------------------------------- | ------------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Author: separate table or text?           | `authors` table + junction table      | `author` text field in the book          | if you need to search/filter by author → A; if only displayed → B is enough |
| Key: natural or surrogate?                | `isbn` is the key                     | `book_id SERIAL`, ISBN only unique       | old books have no ISBN → B is safer                  |
| Address: one field or several?            | `address TEXT`                        | `zip`, `city`, `street`, `number`        | if you need statistics by city → B                   |
| Late fee: stored or computed?             | `fee` column                          | computed in the query                    | if the fee rate may change and the old fee matters → stored |

The last row is interesting: if the library charges 100 HUF per day from tomorrow, **past** late returns still use the old 50 HUF. In that case we **save** the computed fee at return time, because it is now a closed, historical fact. So "don't store computed values" is not dogma – the point is to decide **consciously**.

## Data-type traps – try them!

The last step of modelling is choosing a **type** for every property. Many hidden mistakes lurk here. The examples below run on an empty database.

### Money as a floating-point number

The `REAL` / `DOUBLE PRECISION` (floating-point) types approximate decimal fractions **in binary**, so tiny errors appear:

```sql run
-- Floating point: 0.1 + 0.2 is not exactly 0.3!
SELECT 0.1::DOUBLE PRECISION + 0.2::DOUBLE PRECISION = 0.3 AS float_equal,
       0.1::NUMERIC + 0.2::NUMERIC = 0.3 AS numeric_equal;
```

For money and quantities where every cent counts, always use `NUMERIC(p, s)` (exact decimal). Floating point is fine for measurements (temperature, coordinates), where a tiny rounding error doesn't matter.

### Dates as text

If dates are stored as text, sorting is **alphabetical**, not chronological:

```sql run
-- As text: '2025-3-1' is "greater" than '2025-12-01', because '3' > '1'
SELECT '2025-3-1' > '2025-12-01' AS later_as_text,
       DATE '2025-03-01' > DATE '2025-12-01' AS later_as_date;
```

With the `DATE` type you can also calculate: the difference of two dates in days, adding days to a date:

```sql run
-- How many days late, if the due date is 10 March and it was returned on the 14th?
SELECT DATE '2025-03-14' - DATE '2025-03-10' AS days_late,
       (DATE '2025-03-14' - DATE '2025-03-10') * 50 AS fee_huf,
       DATE '2025-03-10' + 21 AS new_due_date_with_extension;
```

### Phone numbers and postcodes as numbers

A phone number is not a **number** but an **identifier text**: we never add phone numbers together, but the leading zero and the `+` sign matter.

```sql run
-- As a number, the leading 0 and the + are lost
SELECT CAST('06301234567' AS BIGINT) AS as_number,
       CAST('06301234567' AS VARCHAR(20)) AS as_text;
```

**Rule of thumb:** if you **don't calculate** with a value (phone number, postcode, student ID, ISBN, bank account number), it is **text**, even if it consists only of digits.

### Text too short or too long

```sql run
-- VARCHAR(5): a longer name doesn't fit – the DBMS raises an error, it doesn't silently truncate
CREATE TABLE test_names (name VARCHAR(5));
INSERT INTO test_names VALUES ('Anna');
SELECT * FROM test_names;
```

Click **Edit**, change `'Anna'` to `'Annabella'`, and run it: PostgreSQL rejects it. (Some older systems would silently truncate it – that's even worse!) Choose a **generous but sensible** length: 100 characters is plenty for a name, 254 for an e-mail address.

### Booleans as text

`'yes'`, `'Yes'`, `'Y'`, `'y'`, `'1'`… – if you store true/false values in text, sooner or later all of them will appear. That's what the `BOOLEAN` type (`TRUE` / `FALSE`) is for.

## Type cheat sheet

| Data                     | Good type              | Bad choice               |
| ------------------------ | ---------------------- | ------------------------ |
| price, balance           | `NUMERIC(12, 2)`       | `REAL`, `FLOAT`          |
| quantity, age            | `INT` (+ `CHECK >= 0`) | `VARCHAR`                |
| date                     | `DATE`                 | `VARCHAR`                |
| point in time            | `TIMESTAMP`            | two separate strings     |
| phone number, postcode   | `VARCHAR`              | `INT`                    |
| yes/no                   | `BOOLEAN`              | `CHAR(1)` 'Y'/'N'        |
| ISBN                     | `CHAR(13)`             | `BIGINT`                 |
| long description         | `TEXT`                 | `VARCHAR(50)`            |

## Summary

- Modelling steps: **noun hunting → entities and properties → relationships → logical schema → checking with questions**.
- Separate the **kind** (book) from the **concrete item** (copy).
- A task has **several good models**; the expected questions and changes guide the decision.
- `NUMERIC` for money, `DATE` for dates, **text** for identifiers (phone, ISBN), `BOOLEAN` for yes/no.

## Exercise

Create the library's `copies` table with the following rules:

- `inventory_no` – text of at most 12 characters, the **primary key**;
- `isbn` – text of exactly 13 characters, **mandatory**;
- `acquired_on` – date, **mandatory**;
- `price` – amount of money with two decimals (at most 8 digits), **cannot be negative** (0 is allowed, if it was a gift);
- `condition` – text of at most 10 characters, **mandatory**, default value `'good'`.

The check tries a few good and bad inserts.

```sql starter required
CREATE TABLE copies (
  inventory_no VARCHAR(12) PRIMARY KEY
  -- continue with the other columns!
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE copies (
  inventory_no VARCHAR(12) PRIMARY KEY,
  isbn         CHAR(13) NOT NULL,
  acquired_on  DATE NOT NULL,
  price        NUMERIC(8, 2) CHECK (price >= 0),
  condition    VARCHAR(10) NOT NULL DEFAULT 'good'
);
```

</details>

```sql test
-- Helper function: runs a statement and tells whether it succeeded.
CREATE FUNCTION try_it(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE results (test TEXT, result TEXT);
INSERT INTO results VALUES
  ('good row',        try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L1', '9789631193001', '2025-01-10', 3990)$q$)),
  ('gift (0 HUF)',    try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L2', '9789631193001', '2025-01-10', 0)$q$)),
  ('duplicate key',   try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L1', '9789631193001', '2025-01-10', 100)$q$)),
  ('no ISBN',         try_it($q$INSERT INTO copies (inventory_no, acquired_on, price) VALUES ('L3', '2025-01-10', 100)$q$)),
  ('no date',         try_it($q$INSERT INTO copies (inventory_no, isbn, price) VALUES ('L4', '9789631193001', 100)$q$)),
  ('negative price',  try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L5', '9789631193001', '2025-01-10', -1)$q$)),
  ('bad date',        try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L6', '9789631193001', 'yesterdayish', 100)$q$)),
  ('cents',           try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price) VALUES ('L7', '9789631193001', '2025-01-10', 12.5)$q$)),
  ('condition NULL',  try_it($q$INSERT INTO copies (inventory_no, isbn, acquired_on, price, condition) VALUES ('L8', '9789631193001', '2025-01-10', 1, NULL)$q$));

SELECT test, result FROM results
UNION ALL
SELECT 'default condition', condition FROM copies WHERE inventory_no = 'L1'
UNION ALL
SELECT 'stored price', price::TEXT FROM copies WHERE inventory_no = 'L7';
```
