---
title: Deeper – Through the Eyes of Attacker and Defender
summary: The anatomy of a fictional data breach step by step and defense in depth; threat modelling with STRIDE; lesser-known forms of injection (second-order, column names and sorting, LIKE wildcards) and defending with format('%I') and allow-lists; data minimisation, retention periods and k-anonymity with SQL, and data masking with a view.
minutes: 45
---

## What you will learn in this lesson

- how a **realistic data breach** unfolds step by step, and which defensive layer could have stopped it where,
- how to think through threats **methodically** (STRIDE),
- **lesser-known** forms of injection against which parameterisation alone isn't enough,
- how to implement **data minimisation** and **retention periods** with SQL,
- what **k-anonymity** is, and how to check it on a report,
- how to **mask** data with a view.

## 1. Anatomy of an incident

The story below is fictional, but every step has occurred in real incidents. A small web shop:

1. **Entry point.** In the product search, the developer built the query by string concatenation. The attacker types `' UNION SELECT email, password_hash FROM users --` into the search box, and e-mail addresses and password hashes appear in the result list.
2. **Too many rights.** The application connected as the `postgres` superuser, so the attacker can read every table and even creates an account for themselves.
3. **Weak password storage.** Passwords were stored with a fast, unsalted hash. Common passwords are cracked in minutes from a precomputed table.
4. **Unnecessary data.** The shop kept every customer's full address, phone number and birth date going back 8 years – although invoicing needed only a fraction of this.
5. **Nobody noticed.** There was no logging or alerting on unusual queries; the breach came to light months later from a database dump surfacing on a forum.

### Where could it have been stopped?

| Step | Defensive layer                                | Topic             |
| ---- | ---------------------------------------------- | ----------------- |
| 1.   | parameterised queries, input validation        | 15/1              |
| 2.   | least privilege, separate application account  | 10                |
| 3.   | slow, salted password hash (bcrypt, Argon2)    | 15/2              |
| 4.   | data minimisation, retention, pseudonymisation | 15/3, this lesson |
| 5.   | logging, alerting, regular review              | 10/4              |

This is the principle of **defense in depth**: we don't rely on a single perfect wall but on **several independent** layers. If one breaks, the next may still stop the attack – or at least reduce the damage.

**Analogy:** a castle isn't just a wall, but a moat, a drawbridge, guards, an inner keep and a treasury. Whoever gets over the wall isn't at the treasure yet.

## 2. Threat modelling with STRIDE

STRIDE is a checklist: six attack types we think through for every part of a system.

| Letter | Threat                     | Database example                        | Defence                               |
| ------ | -------------------------- | --------------------------------------- | ------------------------------------- |
| S      | **S**poofing               | logging in with a stolen password       | strong authentication, two-factor     |
| T      | **T**ampering              | changing grades after the fact          | permissions, log, checksums           |
| R      | **R**epudiation            | "I didn't delete it"                    | personal accounts, immutable log      |
| I      | **I**nformation disclosure | injection, unencrypted backup           | parameterisation, encryption, masking |
| D      | **D**enial of service      | overloading with masses of slow queries | timeouts, rate limits, indexes        |
| E      | **E**levation of privilege | hijacking a SECURITY DEFINER function   | fixed `search_path`, narrow rights    |

## 3. Lesser-known forms of injection

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Column names and sort direction: these can't be parameterised!

On a table page the user can click to choose which column to sort by. Parameters can only stand in place of **values**, not column names or `ASC`/`DESC`. If the program concatenates the column name in, the door is open again.

The solution has two steps: an **allow-list** (only pre-approved columns), and safe **quoting** of the identifier with `format('%I', …)`.

```sql run
-- Safe dynamic sorting: allow-list + format('%I') for the identifier
CREATE FUNCTION students_sorted(col TEXT) RETURNS SETOF students
LANGUAGE plpgsql AS $$
BEGIN
  IF col NOT IN ('name', 'semester', 'city') THEN     -- allow-list
    RAISE EXCEPTION 'column not allowed: %', col;
  END IF;
  RETURN QUERY EXECUTE format('SELECT * FROM students ORDER BY %I', col);
END $$;

SELECT neptun, name, semester FROM students_sorted('semester');
```

Try it: click Edit and call it as `students_sorted('name; DROP TABLE students')` – the allow-list stops it immediately. `%I` alone would quote the "weird" name (`"name; DROP TABLE students"`), so it wouldn't run as a command – but the allow-list also makes the error message clearer.

### Values in dynamic SQL: USING

If the dynamic query also contains a **value**, don't concatenate it into the text; pass it as a parameter with the `USING` keyword (it replaces `$1`, `$2`):

```sql run
CREATE FUNCTION from_city(c TEXT) RETURNS SETOF students
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY EXECUTE 'SELECT * FROM students WHERE city = $1' USING c;
END $$;

-- The "attack" here is simply a strange city name with no match
SELECT name FROM from_city($$Budapest' OR '1'='1$$);
```

Empty result: `' OR '1'='1` didn't become a command, but part of the city name being searched for.

### Second-order injection

At registration the attacker gives this username: `anna' --`. The registration form is parameterised, so the name gets into the database **harmlessly**. Weeks later a **different** program (e.g. a nightly report) reads the name and builds it into a new query by **concatenation** – that's when it goes off. **Lesson:** data read from the database isn't "trusted" either – every query should be parameterised, regardless of where the value comes from.

### LIKE wildcards

Even with a parameterised search, a user typing `%` or `_` can surprise you: with `WHERE name LIKE '%' || $1 || '%'`, typing `%` returns **every** row. This isn't injection, but it can leak data (e.g. a "search by e-mail" feature) and cause slow full table scans. Solution: escape the wildcard characters, and require a search term of at least a few characters.

## 4. Data minimisation and retention with SQL

The best protection is data **you don't store**. Two GDPR principles – data minimisation and storage limitation – look like this in practice:

```sql run
-- A log containing the IP address of every login
CREATE TABLE logins (neptun CHAR(6), login_date DATE, ip TEXT);
INSERT INTO logins VALUES
  ('ABC123', '2024-01-10', '192.0.2.10'), ('ABC123', '2025-02-01', '192.0.2.11'),
  ('BCD234', '2024-06-15', '198.51.100.7'), ('BCD234', '2025-02-20', '198.51.100.8');

-- Retention rule: remove the IP address from rows older than 1 year (statistics remain)
UPDATE logins SET ip = NULL WHERE login_date < DATE '2025-03-01' - INTERVAL '1 year';

SELECT * FROM logins ORDER BY login_date;
```

In a real system a **scheduled job** runs this daily. The rule is documented ("we keep IP addresses for 1 year for security purposes"), and anyone can verify it.

## 5. k-anonymity: is removing the name enough?

We removed the names from a report – is it anonymous now? Not necessarily! If a row says "Szeged, born in 2004, business informatics" and there's only one such student, they are **identifiable**. **k-anonymity** means: every row matches at least **k** people based on the "quasi-identifiers" (e.g. city, birth year, major).

```sql run
-- How many students share the same (city, major, birth year) combination?
SELECT city, major, EXTRACT(YEAR FROM born) AS year, COUNT(*) AS people
FROM students
GROUP BY city, major, year
ORDER BY people, city;
```

Every group has 1 person: k = 1, i.e. **everyone is identifiable**! The solution is **generalisation**: we publish less precise data.

```sql run
-- Generalised: "Budapest / elsewhere" instead of city, decade instead of birth year
SELECT CASE WHEN city = 'Budapest' THEN 'Budapest' ELSE 'elsewhere / unknown' END AS place,
       (EXTRACT(YEAR FROM born)::INT / 10) * 10 AS decade,
       COUNT(*) AS people
FROM students
GROUP BY place, decade
ORDER BY place, decade;
```

Now some groups contain several people. With real data (thousands of rows) the goal might be k ≥ 5: any group smaller than that is generalised further or left out of the report.

## 6. Masking with a view

The help desk needs to see **which** e-mail address it's about, but not the full address. A **masked view** shows the real data only partially – you'll build one in the lesson's exercise.

## Summary

- **Defense in depth:** several independent layers (parameterisation, permissions, hashing, minimisation, logging).
- **STRIDE:** spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.
- Column names and sort direction can't be parameterised: **allow-list** + `format('%I')`; for values `EXECUTE … USING`.
- Because of **second-order** injection, data read from the database isn't trusted either.
- **Data minimisation** and **retention**: what you don't store can't leak.
- **k-anonymity:** removing the name isn't enough; generalisation ensures every row matches at least k people.

## Exercise

The starter code creates the `users` table. Create a **view** called `helpdesk_view` that shows each user's name (`name`) and **masked** e-mail address (`email`): the **first character** of the e-mail, then **three asterisks** (`***`), then the address **from the `@` sign** to the end. For example `anna.kiss@example.com` → `a***@example.com`.

Hint: `LEFT(text, 1)`, `POSITION('@' IN text)` and `SUBSTRING(text FROM start)`, concatenated with `||`.

```sql starter required
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(60), email VARCHAR(80));
INSERT INTO users VALUES
  (1, 'Anna Kiss',  'anna.kiss@example.com'),
  (2, 'Bela Nagy',  'bela@university.edu'),
  (3, 'Cili Toth',  'cili.toth@mail.com');

CREATE VIEW helpdesk_view AS
SELECT name, email
FROM users;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(60), email VARCHAR(80));
INSERT INTO users VALUES
  (1, 'Anna Kiss',  'anna.kiss@example.com'),
  (2, 'Bela Nagy',  'bela@university.edu'),
  (3, 'Cili Toth',  'cili.toth@mail.com');

CREATE VIEW helpdesk_view AS
SELECT name,
       LEFT(email, 1) || '***' || SUBSTRING(email FROM POSITION('@' IN email)) AS email
FROM users;
```

</details>

```sql test
SELECT name, email FROM helpdesk_view ORDER BY name;
```
