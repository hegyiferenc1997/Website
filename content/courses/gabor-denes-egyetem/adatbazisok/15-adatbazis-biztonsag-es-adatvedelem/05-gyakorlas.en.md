---
title: Practice – Security and Data Protection
summary: Review questions about SQL injection, encryption, passwords and the GDPR, then a security audit: five code snippets and situations in which you have to find the flaw and the right solution.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why does a parameterised query protect against SQL injection?</summary>

Because the query's structure and the data reach the database separately: the query only contains a placeholder, and the DBMS always treats the value as data, never interpreting it as SQL code. So apostrophes and keywords in the input are harmless.

</details>

<details>
<summary>2. If there's parameterisation, why is the principle of least privilege needed too?</summary>

Because protection has several layers: if a flaw remains somewhere anyway (e.g. a forgotten concatenated query or a stolen password), the attacker can only do as much as the application's account allows. A read-only account can't drop a table.

</details>

<details>
<summary>3. What's the difference between encryption and a hash, and which one is for passwords?</summary>

Encryption is reversible with the key, a hash is one-way. Passwords need a hash – with a unique salt and a deliberately slow function (Argon2id, bcrypt) – because a password never needs to be read back, only checked.

</details>

<details>
<summary>4. Why is a Neptun code personal data, even though it doesn't contain the name?</summary>

Because it identifies indirectly: in the university's records it clearly belongs to one living person. Under the GDPR, data that identifies only when combined with other data is personal data too.

</details>

<details>
<summary>5. What's the difference between pseudonymised and anonymous data?</summary>

In pseudonymised data the identifier is replaced with a pseudonym, but the link (stored separately) can be restored – so it's still personal data. From anonymous data the person can't be identified by any reasonable means, so the GDPR no longer applies to it.

</details>

## The practice exercise: a security audit

You're examining a web shop's code and operations. For each situation, choose the best solution!

```quiz required
? The product search code: `db.query("SELECT * FROM products WHERE name LIKE '%" + term + "%'")`. What's the right fix?
- remove the apostrophes from the search term
+ a parameterised query: `db.query("SELECT * FROM products WHERE name LIKE $1", ["%" + term + "%"])`
- convert the search term to upper case
- put the query into a stored procedure, but still with concatenation
! The % signs are part of the value; only the placeholder stays in the structure.

? In the users table, the password column stores a SHA-256 hash, without a salt. What's the biggest problem?
+ identical passwords have identical hashes, and because the hash is fast, passwords can be tried en masse
- SHA-256 can be decrypted with the key
- the hash takes up too much space
- nothing, this is secure
! A salt + a slow password hash (Argon2id, bcrypt) are needed.

? The web application connects to the database as the `postgres` superuser. What do you suggest?
- nothing, this way everything is sure to work
+ a separate role with access only to the needed tables and operations
- changing the superuser's password once a year
! The principle of least privilege.

? The nightly backups go unencrypted into an object storage bucket that's also publicly accessible. What should be done?
- nothing, the rules don't apply to backups
+ encrypt the backups, and strictly restrict access to the bucket
- make backups less often
- just change the backup's file name
! A backup contains as much personal data as the database.

? A customer asks for their data to be deleted. Their data is in seven tables. What's the right approach?
- delete the row only from the customers table
+ delete or anonymise their data in every table (except data under a legal retention obligation, e.g. invoices), and document it
- refuse, because it's too complicated
- mark the customer as inactive, but keep all their data
! The right to erasure applies to all data that doesn't have to be retained.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

**1.** **Masking.** In the registry's report only the **first two characters** of the Neptun code may be visible, with `****` in place of the rest (e.g. `AB****`). Show the masked code and the name, by name!

```sql starter
SELECT neptun, name
FROM students
ORDER BY name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT LEFT(neptun, 2) || '****' AS neptun, name
FROM students
ORDER BY name;
```

</details>

**2.** **Pseudonymisation.** A researcher analyses the grades but mustn't find out whose grade it is. Replace the Neptun code with a **pseudonym**: the first 8 characters of the code's `md5` hash! (Pseudonym, course code, grade; only existing grades, sorted by pseudonym and course code.) The same student always gets the same pseudonym, so the analysis still works.

```sql starter
SELECT neptun, code, grade
FROM enrollments;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT LEFT(md5(neptun), 8) AS pseudonym, code, grade
FROM enrollments
WHERE grade IS NOT NULL
ORDER BY pseudonym, code;
```

</details>

**3.** **Checking k-anonymity.** If only **one** student belongs to a (major, city) combination, they can be identified even from "anonymous" data. Find these combinations (major, city, headcount)! Treat the unknown city as a separate group too. Sorted by major, then city.

```sql starter
SELECT major, city
FROM students;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT major, city, COUNT(*) AS headcount
FROM students
GROUP BY major, city
HAVING COUNT(*) < 2                -- k = 2: a smaller group is already risky
ORDER BY major, city;
```

</details>

**4.** **A parameter, not concatenation.** Write a `headcount(v TEXT)` SQL function that gives how many students are from city `v`! Because `v` goes into the query **as a parameter**, an SQL injection attempt simply returns 0. Call it with `'Budapest'` and with the attack text `Budapest' OR '1'='1`!

```sql starter
-- CREATE FUNCTION headcount(v TEXT) RETURNS BIGINT LANGUAGE sql AS $$ ... $$;
SELECT COUNT(*) FROM students WHERE city = 'Budapest';
```

<details>
<summary>Solution</summary>

```sql solution
CREATE FUNCTION headcount(v TEXT) RETURNS BIGINT LANGUAGE sql AS $$
  SELECT COUNT(*) FROM students WHERE city = v        -- v is a value, never SQL code
$$;

SELECT headcount('Budapest') AS normal,
       headcount($t$Budapest' OR '1'='1$t$) AS attack;
```

</details>

**5.** **Logging with a trigger.** Every grade change must be logged: who (Neptun), which course, old and new grade. Create the `grade_log` table and an `AFTER UPDATE` trigger, then change Cili Toth's (`CDE345`) maths grade from 2 to **3**, and query the log!

```sql starter
CREATE TABLE grade_log (neptun CHAR(6), code VARCHAR(6), old_grade INT, new_grade INT);
-- trigger function + trigger, then UPDATE
SELECT * FROM grade_log;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE grade_log (neptun CHAR(6), code VARCHAR(6), old_grade INT, new_grade INT);

CREATE FUNCTION log_grade() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO grade_log VALUES (NEW.neptun, NEW.code, OLD.grade, NEW.grade);   -- OLD: before, NEW: after
  RETURN NEW;
END $$;

CREATE TRIGGER grade_change AFTER UPDATE OF grade ON enrollments
FOR EACH ROW EXECUTE FUNCTION log_grade();

UPDATE enrollments SET grade = 3 WHERE neptun = 'CDE345' AND code = 'MAT';

SELECT * FROM grade_log;
```

</details>
