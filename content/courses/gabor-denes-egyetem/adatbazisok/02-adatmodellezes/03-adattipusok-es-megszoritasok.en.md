---
title: Data Types and Constraints
summary: Domains and data types, the most common SQL types (integer, decimal, text, date, boolean), and the NOT NULL, UNIQUE, PRIMARY KEY, CHECK and DEFAULT constraints – your first own table in the browser.
minutes: 25
---

## What you will learn

- what a **domain** and a **data type** are, and how to choose,
- the most common **SQL data types**,
- how to protect a table from bad data with **constraints**,
- how to create your first own table (`CREATE TABLE`).

## Domain and type

Every attribute has a **domain**: the set of values it can take. A grade's domain is {1, 2, 3, 4, 5}, a date of birth's is past dates, an email's is text shaped like `something@something.com`. In a database the domain is described by a **data type** plus a few **constraints**.

## The most common types (PostgreSQL)

| Type                        | For                                     | Example               |
| --------------------------- | --------------------------------------- | --------------------- |
| `INT` / `BIGINT`            | integer (about ±2 billion / huge)       | quantity, identifier  |
| `NUMERIC(p, s)`             | **exact** decimal number                | price, money          |
| `REAL` / `DOUBLE PRECISION` | approximate floating-point number       | measurement           |
| `VARCHAR(n)`                | text of at most n characters            | name, email           |
| `TEXT`                      | text of any length                      | description, comment  |
| `CHAR(n)`                   | text of exactly n characters            | Neptun code           |
| `DATE` / `TIMESTAMP`        | date / date + time                      | birthday, order time  |
| `BOOLEAN`                   | true / false                            | is active             |

Two important tips:

- **Never store money in a floating-point type!** In floating point `0.1 + 0.2` is `0.30000000000000004` – in a bank that causes trouble. That is what `NUMERIC(10, 2)` is for (10 digits, 2 of them after the decimal point).
- Phone numbers and postcodes are **text**, not numbers: we never calculate with them, and a leading zero would be lost.

## Constraints – the table's "house rules"

| Constraint    | Meaning                                       | Example                           |
| ------------- | --------------------------------------------- | --------------------------------- |
| `NOT NULL`    | must be filled in                             | `name VARCHAR(80) NOT NULL`       |
| `UNIQUE`      | can't repeat                                  | `email VARCHAR(120) UNIQUE`       |
| `PRIMARY KEY` | unique identifier (= `UNIQUE` + `NOT NULL`)   | `code VARCHAR(10) PRIMARY KEY`    |
| `CHECK (…)`   | any condition that must hold                  | `CHECK (grade BETWEEN 1 AND 5)`   |
| `DEFAULT …`   | the value used when none is given             | `stock INT DEFAULT 0`             |

A constraint is like a strict doorman: bad data **doesn't even get in**. It is much better when the database rejects an error immediately than finding out months later that something has a negative price.

```sql run
CREATE TABLE members (
  member_id INT PRIMARY KEY,
  name      VARCHAR(80) NOT NULL,
  email     VARCHAR(120) UNIQUE,
  active    BOOLEAN DEFAULT TRUE,
  joined    DATE NOT NULL
);
INSERT INTO members (member_id, name, email, joined) VALUES (1, 'Anna Kiss', 'anna@example.com', '2026-09-01');
SELECT * FROM members;
```

Now see what happens when you break a rule! Click **Edit** and set the name to `NULL` in the `INSERT`, or insert a second row with the same email. PostgreSQL rejects it with an error message.

## Summary

- Domain = the possible values; described by a data type + constraints.
- Use `NUMERIC` for money and text for phone numbers.
- `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `CHECK`, `DEFAULT` – bad data never gets in.

## Lesson exercise

Create the web shop's `products` table with these rules:

- `code`: text of at most 10 characters, this is the **primary key**,
- `name`: text of at most 80 characters, **required**,
- `price`: exact decimal number (`NUMERIC(10, 2)`), **required**, and **greater than 0**,
- `stock`: integer, **required**, default value **0**.

The checker tries it out: it inserts a valid row, then attempts a duplicate code, a product without a name and a price of 0 – the table must reject these.

```sql starter required
CREATE TABLE products (
  code  VARCHAR(10),
  name  VARCHAR(80),
  price NUMERIC(10, 2),
  stock INT
);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE products (
  code  VARCHAR(10) PRIMARY KEY,
  name  VARCHAR(80) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock INT NOT NULL DEFAULT 0
);
```

</details>

```sql test
-- Helper function: runs a statement and tells whether it succeeded.
CREATE FUNCTION try_sql(stmt TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE stmt;
  RETURN 'succeeded';
EXCEPTION WHEN others THEN
  RETURN 'rejected';
END $$ LANGUAGE plpgsql;

CREATE TABLE outcome (test TEXT, result TEXT);
INSERT INTO outcome VALUES
  ('valid row',      try_sql($q$INSERT INTO products (code, name, price) VALUES ('T1', 'Mouse', 4990)$q$)),
  ('duplicate code', try_sql($q$INSERT INTO products (code, name, price) VALUES ('T1', 'Other', 100)$q$)),
  ('no name',        try_sql($q$INSERT INTO products (code, price) VALUES ('T2', 100)$q$)),
  ('zero price',     try_sql($q$INSERT INTO products (code, name, price) VALUES ('T3', 'Free', 0)$q$)),
  ('no stock',       try_sql($q$INSERT INTO products (code, name, price, stock) VALUES ('T4', 'Bad', 5, NULL)$q$));

SELECT test, result FROM outcome
UNION ALL
SELECT 'default stock', stock::TEXT FROM products WHERE code = 'T1';
```
