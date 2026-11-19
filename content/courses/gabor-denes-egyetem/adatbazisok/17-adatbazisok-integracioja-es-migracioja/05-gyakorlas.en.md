---
title: Practice – Integration and Migration
summary: Review questions about ORMs, the API layer, ETL, schema migrations and data migration, then a migration case study with decision questions.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Why is it important that the application doesn't connect as a superuser, and that the password isn't in the code?</summary>

Because of the principle of least privilege: if the application has a bug or the password leaks, the attacker can only do as much as the restricted account allows. And a password written into the code reaches everyone who sees the code through version control, and it doesn't disappear from the git history either.

</details>

<details>
<summary>2. What do we gain if the other systems reach the database through an API?</summary>

The rules and authorization checks are in one place, the internal schema can change freely as long as the API stays the same, and access can be logged and limited. Systems don't break each other by renaming a column.

</details>

<details>
<summary>3. Why must a migration file that has already run not be modified?</summary>

Because the migration tool has already marked it as run, and would never run the change again in the other environments (where it has already run) – so the environments' schemas would diverge. The mistake has to be fixed with a new migration.

</details>

<details>
<summary>4. How would you safely rename a column in a live system?</summary>

With the "expand, then contract" pattern: create the new column, the application writes to both, copy the old data over, switch reading to the new column, and finally – when nothing uses it anymore – drop the old column. An immediate `RENAME` would break the old code still running.

</details>

<details>
<summary>5. What checks would you do after a data migration?</summary>

Matching counts between source and target, comparing important totals (e.g. invoice totals), a checksum over the key fields, spot checks, reviewing the error table of rejected rows, and finally testing the application on the new data.

</details>

## Case study: migrating a student records system

A university is replacing its twenty-year-old, in-house student records program (with an old database) with a new, PostgreSQL-based system. 30,000 students, 2 million grade entries. The system can't stop for long during the semester.

```quiz required
? What should the first step of the migration be?
+ an inventory: what data there is, where, in what quality, and who uses it
- copy every table into the new system right away
- delete the old system's data so there's no confusion
- buy the most powerful server
! Without a thorough survey, mapping and cleaning are flying blind.

? In the old system dates are text in the format "2005.03.14". What's the right solution in the new system?
- take them over as text, as they are
+ a `DATE` column, converted with `to_date(…, 'YYYY.MM.DD')` while loading
- three separate number columns (year, month, day)
! The date type checks validity and sorts properly.

? After loading, the source has 2,000,000 grade entries and the target 1,999,412. What should be done?
- nothing, it's a negligible difference
+ find and analyse the missing 588 rows (e.g. from the error table), and fix the script
- delete 588 rows from the source too
- restart the server
! Silently lost data in a student records system is unacceptable.

? Which cutover strategy fits best if the system can't stop for long during the semester?
- all at once (big bang), on a weekday morning
+ dual writes or change data capture (CDC), then switching over in a short window
- first switch off the old one, then start the migration
! That way the two systems run in sync for a while, and the switch is short.

? A week after the new system goes live, a serious bug is discovered. What's needed to survive this?
+ a rollback plan worked out in advance, and keeping the old system's data until the new one has proven itself
- deleting the old system immediately on cutover day
- nothing, bugs can't happen
! Always have a plan B.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

We have to load "dirty" product data exported from an old system. The data is in an all-text **staging table**.

<details>
<summary>Creating the staging table (SQL)</summary>

```sql setup
-- Staging: every column is text, no constraints – just as it was in the file.
CREATE TABLE stg_products (code TEXT, name TEXT, price TEXT, added TEXT, sku TEXT);
INSERT INTO stg_products VALUES
  ('1', '  wireless MOUSE ',   '4990',     '2024.03.01.', 'ABC-1234'),
  ('2', 'Keyboard',            '24 990',   '2024-05-12',  'ABC-2345'),
  ('3', 'monitor   27 inch',   '69990 Ft', '12/06/2024',  'XYZ-99'),
  ('4', 'Webcam',              'n/a',      '2024-07-30',  'ABC-4567'),
  ('5', 'headphones',          '15990',    '',            'abc-5678');
```

</details>

**1.** **Tidying the names.** Clean the product names: trim spaces from the ends, replace repeated inner spaces with a single one, and **capitalise** every word (`initcap`). (Code as an integer, clean name; by code.)

```sql starter
SELECT code, name
FROM stg_products;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code::INT AS code,
       initcap(regexp_replace(TRIM(name), '\s+', ' ', 'g')) AS name
FROM stg_products
ORDER BY code;
```

</details>

**2.** **Converting prices to numbers.** The prices contain spaces, `Ft` and a meaningless value (`n/a`). Remove every **non-digit** character and convert to an integer; where this leaves empty text, it should be `NULL` (`NULLIF` helps). (Code, original price, clean price; by code.)

```sql starter
SELECT code, price
FROM stg_products;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code::INT AS code, price,
       NULLIF(regexp_replace(price, '[^0-9]', '', 'g'), '')::INT AS clean_price   -- '[^0-9]': anything that isn't a digit
FROM stg_products
ORDER BY code;
```

</details>

**3.** **Dates in several formats.** The date added appears in three forms (`YYYY-MM-DD`, `YYYY.MM.DD.`, `DD/MM/YYYY`) or is empty. Convert all of them to `DATE` with `CASE` and regular expressions; anything matching none of the patterns should be `NULL`. (Code, date; by code.)

```sql starter
SELECT code, added
FROM stg_products;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code::INT AS code,
       CASE
         WHEN added ~ '^\d{4}-\d{2}-\d{2}$'     THEN to_date(added, 'YYYY-MM-DD')
         WHEN added ~ '^\d{4}\.\d{2}\.\d{2}\.$' THEN to_date(added, 'YYYY.MM.DD.')
         WHEN added ~ '^\d{2}/\d{2}/\d{4}$'     THEN to_date(added, 'DD/MM/YYYY')
       END AS added                              -- without ELSE, CASE gives NULL
FROM stg_products
ORDER BY code;
```

</details>

**4.** **A log of rejected rows.** The correct form of the SKU is **3 capital letters, a hyphen, 4 digits** (e.g. `ABC-1234`). Collect the rows with an invalid SKU together with the reason (code, SKU, `'invalid SKU'`), by code!

```sql starter
SELECT code, sku
FROM stg_products;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code::INT AS code, sku, 'invalid SKU' AS reason
FROM stg_products
WHERE sku !~ '^[A-Z]{3}-\d{4}$'            -- !~ : does NOT match the pattern
ORDER BY code;
```

</details>

**5.** **Reconciliation after loading.** The `products_target` table loaded into the target system has to be compared with the source. Give in one row: the **row counts** of source and target, and whether the **sum of prices** matches (true/false)! For the source, only sum the prices that can be converted to numbers.

```sql starter
CREATE TABLE products_target (code INT PRIMARY KEY, price INT);
INSERT INTO products_target VALUES (1, 4990), (2, 24990), (3, 69990), (4, NULL), (5, 1599);

SELECT COUNT(*) FROM products_target;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE products_target (code INT PRIMARY KEY, price INT);
INSERT INTO products_target VALUES (1, 4990), (2, 24990), (3, 69990), (4, NULL), (5, 1599);

SELECT (SELECT COUNT(*) FROM stg_products) AS source_rows,
       (SELECT COUNT(*) FROM products_target) AS target_rows,
       (SELECT SUM(NULLIF(regexp_replace(price, '[^0-9]', '', 'g'), '')::INT) FROM stg_products) =
       (SELECT SUM(price) FROM products_target) AS sum_matches;   -- false: product 5's price lost a digit!
```

</details>
