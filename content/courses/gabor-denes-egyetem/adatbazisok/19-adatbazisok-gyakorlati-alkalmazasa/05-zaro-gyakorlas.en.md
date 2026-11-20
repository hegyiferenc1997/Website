---
title: Final Practice – the Whole Course in One
summary: Review questions on the course's key ideas from design to performance, then a final SQL exercise that ties several topics together: joins, LEFT JOIN, grouping, filtered aggregation, NULL handling and ordering.
minutes: 55
kind: practice
---

## Review questions

Try to answer in your head first, and only then open the answer!

<details>
<summary>1. Why turn requirements into constraints (NOT NULL, UNIQUE, CHECK, foreign key) if the application checks anyway?</summary>

Because over time many programs write to a database: the web interface, an import script, a colleague by hand. The application's check protects only that one path; a constraint protects all of them. Besides, the program can have bugs – the database is the last line of defense.

</details>

<details>
<summary>2. How do you notice double counting in a report?</summary>

When you join a "1"-side table (e.g. orders) with an "N"-side one (items), the "1"-side rows repeat. A warning sign is when `COUNT(*)` gives more than `COUNT(DISTINCT key)`, or when the subtotals don't add up to the total. Fix: `COUNT(DISTINCT …)`, or aggregate first in a CTE and join afterwards.

</details>

<details>
<summary>3. What is the difference between pessimistic and optimistic locking?</summary>

Pessimistic locking (`SELECT … FOR UPDATE`) locks the row when reading, and others wait. Optimistic locking doesn't lock; on save it checks with a version number whether the row changed in the meantime; if it did, 0 rows change and the application retries. With rare conflicts and long edits, optimistic is better.

</details>

<details>
<summary>4. Why do you need LEFT JOIN to see every student, including those with no enrollments?</summary>

INNER JOIN keeps only rows that have a match on both sides – a student without enrollments would drop out. LEFT JOIN keeps every row of the left side and puts NULL in place of the missing right-side values.

</details>

<details>
<summary>5. What do AVG, SUM and COUNT return when every value is NULL or there are no rows?</summary>

`COUNT(column)` returns 0 (it doesn't count NULLs), but `SUM` and `AVG` return NULL. If you want to see 0 in the report, use `COALESCE(SUM(...), 0)`. For the average, NULL is often the right answer: someone with no grades has no average – 0 would be misleading.

</details>

## The final exercise: student summary

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

The student records system asks for a summary of **every student** – including those who haven't enrolled in anything yet. Columns:

1. `name`: the student's name,
2. `courses`: how many courses they enrolled in,
3. `credits`: the sum of credits of **completed** courses (grade at least 2); if there are none, **0** (not NULL),
4. `average`: the average of the grades rounded to **2 decimals** (an enrollment without a grade yet doesn't count; for someone with no grades it stays NULL).

Order: by credits descending, then by name ascending for equal credits.

A reminder of the useful tools: `LEFT JOIN` (topic 4), `FILTER (WHERE …)` after the aggregate function (this topic), `COALESCE` (a default instead of NULL), `ROUND`. `AVG` and `COUNT(column)` skip NULL values by themselves.

The starter code is almost right, but one student is missing from it, and it also counts the credits of failed courses.

```sql starter required
SELECT s.name,
       COUNT(e.code) AS courses,
       SUM(c.credits) AS credits,
       ROUND(AVG(e.grade), 2) AS average
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
JOIN courses c ON c.code = e.code
GROUP BY s.neptun, s.name
ORDER BY credits DESC, s.name;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.name,
       COUNT(e.code) AS courses,
       COALESCE(SUM(c.credits) FILTER (WHERE e.grade >= 2), 0) AS credits,
       ROUND(AVG(e.grade), 2) AS average
FROM students s
LEFT JOIN enrollments e ON e.neptun = s.neptun
LEFT JOIN courses c ON c.code = e.code
GROUP BY s.neptun, s.name
ORDER BY credits DESC, s.name;
```

Why each part is there:

- **both** JOINs are `LEFT`, otherwise the second JOIN would "cut back" Emma Varga (her `e.code` is NULL, so there's no matching course);
- `COUNT(e.code)` and not `COUNT(*)`: for Emma the LEFT JOIN produces one row full of NULLs, which `COUNT(*)` would count as 1;
- `FILTER (WHERE e.grade >= 2)` sums only the credits of completed courses – an enrollment without a grade (NULL) doesn't count either, because `NULL >= 2` is not true;
- `COALESCE` turns Emma's NULL sum into 0, while her average stays NULL;
- `GROUP BY s.neptun, s.name`: we group by the key, so two students with the same name wouldn't merge.

Congratulations, you've made it through the Databases course! This single query needs your knowledge of design, SQL, NULL logic and reporting all at once.

</details>

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

Mixed, "real-life" exercises: trying out design patterns and a few typical questions on the study database.

**1.** **Course recommender.** Which courses has Anna Kiss (`ABC123`) **not taken yet**? (Code, name; by code.)

```sql starter
SELECT code FROM enrollments WHERE neptun = 'ABC123';
```

<details>
<summary>Solution</summary>

```sql solution
SELECT code, name
FROM courses
WHERE code NOT IN (SELECT code FROM enrollments WHERE neptun = 'ABC123')
ORDER BY code;
```

</details>

**2.** **Status with a lookup table.** Create the `statuses` lookup table (`code` key, `name` mandatory) with the codes `'new'`, `'paid'`, `'shipped'`, and the `purchases` table (`id` key, `status` a mandatory **foreign key** to the lookup table)! The check tries out that a misspelled status can't get in.

```sql starter
CREATE TABLE statuses (code VARCHAR(10) PRIMARY KEY);
CREATE TABLE purchases (id INT PRIMARY KEY);
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE statuses (code VARCHAR(10) PRIMARY KEY, name VARCHAR(30) NOT NULL);
INSERT INTO statuses VALUES ('new', 'New'), ('paid', 'Paid'), ('shipped', 'Shipped');

CREATE TABLE purchases (
  id     INT PRIMARY KEY,
  status VARCHAR(10) NOT NULL REFERENCES statuses (code)   -- only the lookup table's values
);
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
INSERT INTO results VALUES (1, 'paid', try_it($q$INSERT INTO purchases VALUES (1, 'paid')$q$));
INSERT INTO results VALUES (2, 'Paid (capitalised)', try_it($q$INSERT INTO purchases VALUES (2, 'Paid')$q$));
INSERT INTO results VALUES (3, 'no status', try_it($q$INSERT INTO purchases VALUES (3, NULL)$q$));
INSERT INTO results SELECT 4, 'number of statuses', COUNT(*)::TEXT FROM statuses;
SELECT * FROM results ORDER BY seq;
```

**3.** **Undoing a soft delete.** The "Monitor" product was deleted (logically) by mistake. **Restore it**, then query the active products from the view, by ID!

```sql starter
CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL, deleted_at TIMESTAMP);
INSERT INTO products VALUES (1, 'Mouse', NULL), (2, 'Monitor', '2025-03-01 10:00'), (3, 'Keyboard', NULL);
CREATE VIEW active_products AS SELECT id, name FROM products WHERE deleted_at IS NULL;

SELECT * FROM active_products ORDER BY id;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL, deleted_at TIMESTAMP);
INSERT INTO products VALUES (1, 'Mouse', NULL), (2, 'Monitor', '2025-03-01 10:00'), (3, 'Keyboard', NULL);
CREATE VIEW active_products AS SELECT id, name FROM products WHERE deleted_at IS NULL;

UPDATE products SET deleted_at = NULL WHERE name = 'Monitor';    -- restoring is a single UPDATE

SELECT * FROM active_products ORDER BY id;
```

</details>

**4.** **A history table.** What was **every product's price on 15 March 2025**? (Product ID, price; by ID.)

```sql starter
CREATE TABLE price_history (product_id INT, price NUMERIC(10, 2), valid_from DATE NOT NULL, valid_to DATE);
INSERT INTO price_history VALUES
  (1, 4490, '2024-01-01', '2024-09-30'), (1, 4990, '2024-10-01', '2025-05-31'), (1, 5490, '2025-06-01', NULL),
  (2, 21990, '2024-01-01', '2025-02-28'), (2, 24990, '2025-03-01', NULL);

SELECT * FROM price_history;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE price_history (product_id INT, price NUMERIC(10, 2), valid_from DATE NOT NULL, valid_to DATE);
INSERT INTO price_history VALUES
  (1, 4490, '2024-01-01', '2024-09-30'), (1, 4990, '2024-10-01', '2025-05-31'), (1, 5490, '2025-06-01', NULL),
  (2, 21990, '2024-01-01', '2025-02-28'), (2, 24990, '2025-03-01', NULL);

SELECT product_id, price
FROM price_history
WHERE valid_from <= DATE '2025-03-15'
  AND (valid_to IS NULL OR valid_to >= DATE '2025-03-15')        -- NULL = still valid today
ORDER BY product_id;
```

</details>

**5.** **Rows instead of a comma-separated list.** An old table stores tags in a single field, separated by commas (an anti-pattern!). Split the list into one tag per row (`string_to_table`), and count **how many times each tag** occurs! (Tag, count; by count descending, then by tag.)

```sql starter
CREATE TABLE articles (id INT PRIMARY KEY, tags TEXT);
INSERT INTO articles VALUES (1, 'sale,new'), (2, 'new'), (3, 'sale,featured,new'), (4, 'featured');

SELECT id, tags FROM articles;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE articles (id INT PRIMARY KEY, tags TEXT);
INSERT INTO articles VALUES (1, 'sale,new'), (2, 'new'), (3, 'sale,featured,new'), (4, 'featured');

SELECT tag, COUNT(*) AS cnt
FROM articles, string_to_table(tags, ',') AS tag          -- every tag becomes a separate row
GROUP BY tag
ORDER BY cnt DESC, tag;
```

</details>

**6.** **Flexible extra data in JSONB.** The products' common data is in proper columns, the type-specific extras in an `extra` JSONB column. Which products have a screen of **at least 27 inches**? (Name, size; by size descending.)

```sql starter
CREATE TABLE products_x (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL, extra JSONB);
INSERT INTO products_x VALUES
  (1, '24-inch monitor', '{"size_inch": 24, "panel": "IPS"}'),
  (2, '27-inch monitor', '{"size_inch": 27, "panel": "VA"}'),
  (3, 'Gaming mouse',    '{"dpi": 16000}'),
  (4, '32-inch monitor', '{"size_inch": 32, "panel": "IPS"}');

SELECT name, extra FROM products_x;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE products_x (id INT PRIMARY KEY, name VARCHAR(40) NOT NULL, extra JSONB);
INSERT INTO products_x VALUES
  (1, '24-inch monitor', '{"size_inch": 24, "panel": "IPS"}'),
  (2, '27-inch monitor', '{"size_inch": 27, "panel": "VA"}'),
  (3, 'Gaming mouse',    '{"dpi": 16000}'),
  (4, '32-inch monitor', '{"size_inch": 32, "panel": "IPS"}');

SELECT name, (extra ->> 'size_inch')::INT AS size
FROM products_x
WHERE (extra ->> 'size_inch')::INT >= 27     -- NULL for the mouse → left out
ORDER BY size DESC;
```

</details>
