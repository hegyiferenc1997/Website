---
title: Deeper – Data Cleaning and Reconciliation During Migration
summary: Staging tables, the typical errors of dirty data and fixing them with SQL (spaces, letter case, date formats, invalid values via regular expressions), removing duplicates with ROW_NUMBER, logging rejected rows, then reconciliation with row counts, totals and checksums.
minutes: 45
---

## What you will learn in this lesson

- why it's worth loading data into a **staging table** first,
- the **most common errors** of "dirty" data, and how to fix them with SQL,
- how to validate formats with **regular expressions**,
- how to remove **duplicates** while keeping the right one,
- how to **log** unfixable rows instead of silently dropping them,
- how to **reconcile** source and target so that nothing is lost.

## Three-stage loading

A file exported from an old system is never loaded **directly** into the final table. The proven path:

```text
  source file ──► 1. STAGING table ──► 2. cleaning, validation ──► 3. final table
                  (every column TEXT,      (with SQL, step by step)    (strict types,
                   no constraints)                                      constraints)
                                       └──► rejected rows table (why?)
```

Why is every column `TEXT` in the staging table? Because if a date in the file looks like `2025.03.01.`, a `DATE` column would reject it already at load time – and we wouldn't see **how many** and **what kind** of bad rows there are. Everything gets into a text staging table, and we can examine it calmly with SQL.

**Analogy:** you don't put vegetables from the market straight into the pot: first they go into the sink (staging), where you wash and peel them and throw out the rotten ones (cleaning), and only then do you cook them (final table).

## The staging table – a typical dirty export

```sql run
CREATE TABLE stg_customers (id TEXT, name TEXT, email TEXT, born TEXT, zip TEXT);
INSERT INTO stg_customers VALUES
  ('1', '  Anna Kiss ',  'Anna.Kiss@Example.com',  '2001.03.14.', '1111'),
  ('2', 'Bela Nagy',     'bela@example.com ',      '2002-07-02',  '4025'),
  ('3', 'anna kiss',     'anna.kiss@example.com',  '14/03/2001',  '1111'),
  ('4', 'Cili Toth',     'cili[at]example.com',    '2000-11-23',  '67200'),
  ('5', 'Dani Szabo',    'dani@example.com',       '',            '6720'),
  ('6', 'Emma  Varga',   'emma@example.com',       '2003-01-30',  '9021');

SELECT * FROM stg_customers;
```

How many errors can you see? Extra spaces, mixed letter case, three date formats, an empty date, an invalid e-mail, a five-digit postcode, and Anna Kiss twice (once in lower case, with a different date format).

## 1. Spaces and letter case

```sql run
CREATE TABLE stg_customers (id TEXT, name TEXT, email TEXT, born TEXT, zip TEXT);
INSERT INTO stg_customers VALUES
  ('1', '  Anna Kiss ',  'Anna.Kiss@Example.com',  '2001.03.14.', '1111'),
  ('2', 'Bela Nagy',     'bela@example.com ',      '2002-07-02',  '4025'),
  ('6', 'Emma  Varga',   'emma@example.com',       '2003-01-30',  '9021');

SELECT id,
       '[' || name || ']' AS original,
       '[' || regexp_replace(TRIM(name), '\s+', ' ', 'g') || ']' AS cleaned_name,
       LOWER(TRIM(email)) AS cleaned_email
FROM stg_customers;
```

- `TRIM` – removes spaces from both ends;
- `regexp_replace(…, '\s+', ' ', 'g')` – replaces repeated inner spaces with one ("Emma  Varga" → "Emma Varga");
- `LOWER` – e-mail addresses aren't case-sensitive, so we make them uniformly lower case (that's how we can spot duplicates).

The square brackets are just there so we can see the invisible spaces.

## 2. Dates in several formats

`to_date(text, pattern)` turns text in a given format into a date. If several formats occur, `CASE` and a regular expression decide which pattern to use:

```sql run
SELECT raw,
       CASE
         WHEN raw ~ '^\d{4}-\d{2}-\d{2}$'     THEN to_date(raw, 'YYYY-MM-DD')
         WHEN raw ~ '^\d{4}\.\d{2}\.\d{2}\.$' THEN to_date(raw, 'YYYY.MM.DD.')
         WHEN raw ~ '^\d{2}/\d{2}/\d{4}$'     THEN to_date(raw, 'DD/MM/YYYY')
         ELSE NULL                              -- unknown format or empty
       END AS parsed_date
FROM (VALUES ('2001.03.14.'), ('2002-07-02'), ('14/03/2001'), (''), ('yesterday-ish')) AS t(raw);
```

The `~` operator checks whether the text matches the **regular expression**: `^` = start, `$` = end, `\d{4}` = exactly 4 digits, `\.` = a dot character. (Careful: `03/04/2001` may be 4 March or 3 April! In that case the source system's documentation or a known pattern decides – if there's neither, it's better to reject the row than store a wrong date.)

## 3. Validity checks

```sql run
SELECT email,
       email ~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AS valid_email,
       zip,
       zip ~ '^\d{4}$' AS valid_zip
FROM (VALUES ('anna.kiss@example.com', '1111'), ('cili[at]example.com', '67200'),
             ('dani@example.com', '6720')) AS t(email, zip);
```

The e-mail pattern is simplified ("something @ something . at least two letters") – perfect e-mail validation with a regular expression is almost impossible, but it catches the obvious errors. A Hungarian postcode is exactly 4 digits.

## 4. Removing duplicates with ROW_NUMBER

Anna Kiss appears twice (with IDs 1 and 3). Which one do we keep? We need a **rule**, e.g. "the one with the smallest ID" or "the most recently modified". The `ROW_NUMBER()` window function numbers rows within a group, and we keep those numbered 1:

```sql run
SELECT id, name, email_norm, rn,
       CASE WHEN rn = 1 THEN 'keep' ELSE 'duplicate' END AS decision
FROM (
  SELECT id::INT AS id, TRIM(name) AS name, LOWER(TRIM(email)) AS email_norm,
         ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY id::INT) AS rn
  FROM (VALUES ('1', '  Anna Kiss ', 'Anna.Kiss@Example.com'),
               ('2', 'Bela Nagy', 'bela@example.com '),
               ('3', 'anna kiss', 'anna.kiss@example.com')) AS t(id, name, email)
) x
ORDER BY id;
```

- `PARTITION BY` – what makes two rows count as the same (here: the normalised e-mail);
- `ORDER BY` within the `PARTITION` – which row gets number 1 (here: the smallest ID).

Important: **don't** just throw duplicates away. Often the other record holds valuable data (e.g. the phone number is only filled in there) – then you need **merging**, not deletion.

## 5. Logging rejected rows

Whatever can't be fixed shouldn't vanish without a trace! Put it in a separate table, together with the **reason**, so the data owner can fix it at the source:

```sql run
CREATE TABLE stg_customers (id TEXT, name TEXT, email TEXT, born TEXT, zip TEXT);
INSERT INTO stg_customers VALUES
  ('1', '  Anna Kiss ',  'Anna.Kiss@Example.com',  '2001.03.14.', '1111'),
  ('4', 'Cili Toth',     'cili[at]example.com',    '2000-11-23',  '67200'),
  ('5', 'Dani Szabo',    'dani@example.com',       '',            '6720');

CREATE TABLE rejected (id TEXT, reason TEXT);
INSERT INTO rejected
SELECT id, 'invalid e-mail' FROM stg_customers
WHERE NOT LOWER(TRIM(email)) ~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
UNION ALL
SELECT id, 'invalid postcode' FROM stg_customers WHERE NOT zip ~ '^\d{4}$'
UNION ALL
SELECT id, 'missing birth date' FROM stg_customers WHERE TRIM(born) = '';

SELECT * FROM rejected ORDER BY id, reason;
```

The empty birth date needs a decision: reject the row, or load it with `NULL`? If birth date isn't mandatory in the target table, the second is right – but it's still worth logging as a **warning**.

## 6. Reconciliation: was anything lost?

After loading, we always check that source and target **match**. On three levels:

1. **Row count:** source rows = loaded + rejected + removed duplicates?
2. **Totals:** for financial data, do the totals match (e.g. invoice totals)?
3. **Checksum:** does the content as a whole match? We compute a hash over all (sorted) rows and compare.

```sql run
-- Comparing two tables' contents with a single hash
CREATE TABLE source (id INT, name TEXT);
CREATE TABLE target (id INT, name TEXT);
INSERT INTO source VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy'), (3, 'Cili Toth');
INSERT INTO target VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy'), (3, 'Cili Tothh');  -- typo!

SELECT (SELECT COUNT(*) FROM source) AS source_rows,
       (SELECT COUNT(*) FROM target) AS target_rows,
       (SELECT md5(string_agg(id || '|' || name, ',' ORDER BY id)) FROM source) =
       (SELECT md5(string_agg(id || '|' || name, ',' ORDER BY id)) FROM target) AS content_matches;
```

The row counts match, but the checksum doesn't – there's a difference somewhere. Exactly where is shown by `EXCEPT`:

```sql run
CREATE TABLE source (id INT, name TEXT);
CREATE TABLE target (id INT, name TEXT);
INSERT INTO source VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy'), (3, 'Cili Toth');
INSERT INTO target VALUES (1, 'Anna Kiss'), (2, 'Bela Nagy'), (3, 'Cili Tothh');

SELECT 'only in source' AS location, * FROM (SELECT * FROM source EXCEPT SELECT * FROM target) a
UNION ALL
SELECT 'only in target', * FROM (SELECT * FROM target EXCEPT SELECT * FROM source) b;
```

## Summary

- **Staging table** (every column text) → cleaning with SQL → strict final table.
- Cleaning: `TRIM`, `regexp_replace`, `LOWER`; dates with `CASE` + `~` + `to_date`.
- Validity: **regular expressions** (`~`); rather reject ambiguous data than store it wrongly.
- Duplicates: `ROW_NUMBER() OVER (PARTITION BY normalised_key ORDER BY rule)`; consider merging.
- **Rejected rows** go into a separate table, with the reason.
- **Reconciliation:** row counts, totals, checksums, and `EXCEPT` to find the differences.

## Exercise

The starter code loads a dirty customer export. Produce a **clean list** from it: every customer should appear **once**; decide duplicates by the **normalised e-mail** (spaces trimmed, lower case), and among duplicates keep the row with the **smallest ID**!

The result's columns: `id` (integer), `name` (with spaces trimmed from both ends), `email` (normalised), sorted by ID.

```sql starter required
CREATE TABLE stg (id TEXT, name TEXT, email TEXT);
INSERT INTO stg VALUES
  ('1', '  Anna Kiss ', 'Anna.Kiss@Example.com'),
  ('2', 'Bela Nagy',    'bela@example.com '),
  ('3', 'anna kiss',    'anna.kiss@example.com'),
  ('4', 'Cili Toth',    'cili@example.com'),
  ('5', 'B. Nagy',      ' BELA@example.com');

-- Write the cleaning query!
SELECT id, name, email FROM stg;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE stg (id TEXT, name TEXT, email TEXT);
INSERT INTO stg VALUES
  ('1', '  Anna Kiss ', 'Anna.Kiss@Example.com'),
  ('2', 'Bela Nagy',    'bela@example.com '),
  ('3', 'anna kiss',    'anna.kiss@example.com'),
  ('4', 'Cili Toth',    'cili@example.com'),
  ('5', 'B. Nagy',      ' BELA@example.com');

SELECT id, name, email
FROM (
  SELECT id::INT AS id, TRIM(name) AS name, LOWER(TRIM(email)) AS email,
         ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY id::INT) AS rn
  FROM stg
) x
WHERE rn = 1
ORDER BY id;
```

</details>
