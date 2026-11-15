---
title: Designing a System from Scratch
summary: The whole design process on one example – gathering requirements, entities and relationships (E-R model), tables and keys, normalization, constraints, indexes and permissions – building the tables of a library loan system in SQL.
minutes: 30
---

## What you will learn in this lesson

- how to walk through the **whole design process** on a real task,
- how **requirements** turn into tables, keys and constraints,
- how to **check** that the schema really enforces the rules.

This is a summary lesson: at every step we point out which topic covered it in detail.

## The task: a library loan system

The faculty library tracks loans on paper and would like a simple system. Talking to the librarian, we collected these **requirements**:

1. Books are identified by their **ISBN**; they have a **title** (required) and a **publication year**.
2. **Members** have a name (required) and an **email address** (required, and no two members may share one).
3. A member can **borrow** a book; we record **when it was issued** (today by default) and **when it was returned** (empty while the member still has it).
4. The return date **cannot be earlier** than the issue date.
5. No loan may be recorded for a **non-existent** book or member.

## 1. Entities and relationships (topic 5)

From the requirements we pick out the **nouns** (entity candidates) and the **verbs** (relationships):

- entities: **Book**, **Member**,
- relationship: a Member **borrows** a Book – it has its own attributes (issued, returned), and one member borrows many books while one book is borrowed by many members over time → an **N:M relationship**, which becomes a **junction table**: **Loan**.

```text
  [Book] 1 ──────── N [Loan] N ──────── 1 [Member]
  isbn, title, year     issued, returned      member_id, name, email
```

## 2. Tables and keys (topics 3 and 5)

| Table     | Primary key                     | Foreign keys                               |
| --------- | ------------------------------- | ------------------------------------------ |
| `books`   | `isbn` (natural key)            | –                                          |
| `members` | `member_id` (surrogate key)     | –                                          |
| `loans`   | `loan_id` (automatic identity)  | `isbn` → `books`, `member_id` → `members`  |

Why a separate `loan_id`? Because the same member can borrow the same book **several times**, so the (isbn, member_id) pair is not unique.

## 3. Normalization (topic 6)

Let's check: does every non-key column depend on **the key, the whole key and nothing but the key**? The book's title depends on the book (the ISBN), the email on the member, the issue date on the loan. We do not store the book title in the loan (that would be repetition and cause update anomalies). The schema is in **3NF**.

## 4. Types and constraints (topics 2 and 6)

Every requirement becomes a **constraint** – so the database enforces the rules no matter which program writes to it:

| Requirement                                | Constraint                                             |
| ------------------------------------------ | ------------------------------------------------------ |
| title and name are required                | `NOT NULL`                                             |
| email is required and unique               | `NOT NULL UNIQUE`                                      |
| issue date defaults to today               | `DEFAULT CURRENT_DATE`                                 |
| return cannot be before issue              | `CHECK (returned IS NULL OR returned >= issued)`       |
| no loan for a non-existent book/member     | `REFERENCES` (foreign key)                             |

## 5. Indexes and permissions (topics 7 and 10)

- Primary keys and unique columns get an index automatically.
- For the frequent questions: "what does this member have out right now?" → an index on `loans (member_id)`; "who still has this book?" → an index on `loans (isbn)`, possibly a partial index `WHERE returned IS NULL`.
- The library program connects with its own role and gets only `SELECT`, `INSERT`, `UPDATE` on the three tables – no delete.

The design is done. Now it's your turn to write it!

## Lesson exercise

<details>
<summary>Empty database</summary>

This exercise needs no sample database – you create the tables yourself.

</details>

The starter code already contains the `books` table. Create the other two according to the design above:

**`members`**:

- `member_id`: integer, primary key,
- `name`: text of at most 60 characters, required,
- `email`: text of at most 120 characters, required and unique.

**`loans`**:

- `loan_id`: automatic identity (`INT GENERATED ALWAYS AS IDENTITY`), primary key,
- `isbn`: reference to the `books` table, required,
- `member_id`: reference to the `members` table, required,
- `issued`: date, required, defaults to today,
- `returned`: date, optional, but if filled in it cannot be earlier than the issue date.

The checker tries a few good and bad inserts and looks at which ones the schema accepts.

```sql starter required
CREATE TABLE books (
  isbn   VARCHAR(17) PRIMARY KEY,
  title  VARCHAR(200) NOT NULL,
  year   INT
);

CREATE TABLE members (

);

CREATE TABLE loans (

);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE books (
  isbn   VARCHAR(17) PRIMARY KEY,
  title  VARCHAR(200) NOT NULL,
  year   INT
);

CREATE TABLE members (
  member_id INT PRIMARY KEY,
  name      VARCHAR(60) NOT NULL,
  email     VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE loans (
  loan_id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isbn      VARCHAR(17) NOT NULL REFERENCES books (isbn),
  member_id INT NOT NULL REFERENCES members (member_id),
  issued    DATE NOT NULL DEFAULT CURRENT_DATE,
  returned  DATE,
  CHECK (returned IS NULL OR returned >= issued)
);
```

</details>

```sql test
-- Helper: runs a statement and tells whether it succeeded.
CREATE FUNCTION try_sql(stmt TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'accepted';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE outcome (nr INT, test TEXT, result TEXT);
INSERT INTO books VALUES ('978-963-00-0000-1', 'Databases for Beginners', 2026);
INSERT INTO outcome VALUES
  (1, 'valid member',         try_sql($q$INSERT INTO members VALUES (1, 'Anna Kiss', 'anna@example.com')$q$)),
  (2, 'duplicate email',      try_sql($q$INSERT INTO members VALUES (2, 'Other Anna', 'anna@example.com')$q$)),
  (3, 'member without name',  try_sql($q$INSERT INTO members (member_id, email) VALUES (3, 'x@example.com')$q$)),
  (4, 'valid loan',           try_sql($q$INSERT INTO loans (isbn, member_id) VALUES ('978-963-00-0000-1', 1)$q$)),
  (5, 'non-existent book',    try_sql($q$INSERT INTO loans (isbn, member_id) VALUES ('000', 1)$q$)),
  (6, 'non-existent member',  try_sql($q$INSERT INTO loans (isbn, member_id) VALUES ('978-963-00-0000-1', 99)$q$)),
  (7, 'return before issue',  try_sql($q$INSERT INTO loans (isbn, member_id, issued, returned)
                                         VALUES ('978-963-00-0000-1', 1, '2026-05-10', '2026-05-01')$q$)),
  (8, 'valid return',         try_sql($q$INSERT INTO loans (isbn, member_id, issued, returned)
                                         VALUES ('978-963-00-0000-1', 1, '2026-05-01', '2026-05-10')$q$));

SELECT test, result FROM outcome
UNION ALL
SELECT 'issue date defaults to today', (MIN(issued) = CURRENT_DATE)::TEXT
FROM loans WHERE returned IS NULL;
```
