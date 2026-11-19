---
title: Deeper – Normalisation in Practice
summary: Finding keys with attribute closure, deciding the normal form with a checklist, the difference between 3NF and BCNF on a classic example, lossless and lossy decomposition (tried out live with SQL), and the benefits and risks of deliberate denormalisation.
minutes: 40
---

## What you will learn in this lesson

- how to find a table's **keys** from its functional dependencies (the closure algorithm),
- how to decide **step by step** which normal form a table is in,
- how **3NF** and **BCNF** differ, and when it matters,
- what a **lossless** decomposition is – and what happens if you decompose badly (you'll try it!),
- when and why we **denormalise** on purpose.

## A one-sentence reminder

A **functional dependency** (FD) X → Y means: if two rows have the same X value, they also have the same Y value. (If I know the student ID, I know the name: `neptun → name`.) The essence of normalisation: **every fact is stored in exactly one place**.

## 1. Finding keys: attribute closure

The **closure** of an attribute set X (written X⁺) is the set of attributes that can be "deduced" from X using the dependencies. If X⁺ contains **all** columns of the table, X is a **superkey**; if, in addition, none of its elements can be dropped, it is a **key**.

**Analogy – the domino effect:** you knock over X and watch what else falls. If every domino falls, X is a key.

### The algorithm

1. Start with X⁺ = X.
2. Go through the dependencies: if the **left side** of a dependency A → B is entirely contained in X⁺, add its **right side** to X⁺.
3. Repeat until nothing new can be added.

### Worked example

An exam registration table: `R(neptun, name, code, course_name, credits, exam_date, room)`, with dependencies:

- `neptun → name`
- `code → course_name, credits`
- `code, exam_date → room` (a course's exam on a given day is in one room)

What is the key? Let's try `{neptun, code, exam_date}`:

| Step | FD used                     | X⁺                                    |
| ---- | --------------------------- | ------------------------------------- |
| 0.   | –                           | neptun, code, exam_date               |
| 1.   | neptun → name               | neptun, code, exam_date, **name**     |
| 2.   | code → course_name, credits | …, **course_name, credits**           |
| 3.   | code, exam_date → room      | …, **room** → every column is there ✔ |

So `{neptun, code, exam_date}` is a superkey. Can any element be dropped?

- `{code, exam_date}⁺` = code, exam_date, course_name, credits, room – **no** neptun, name → not a superkey.
- `{neptun, exam_date}⁺` = neptun, exam_date, name – far from it.
- `{neptun, code}⁺` = neptun, code, name, course_name, credits – exam_date and room are missing.

None is enough, so `{neptun, code, exam_date}` is the **key**.

**Quick tip:** a column that appears on the **right side of no dependency** (here: neptun, code, exam_date) is certainly part of every key – a good place to start.

## 2. Which normal form is it in? – a checklist

Go in order; stop where the answer is "no".

1. **1NF:** is every field **atomic** (no lists, no repeating column groups), and is there a key?
2. **2NF:** is there a non-key column that depends on **only part** of the key? (Only possible with a composite key!) If not → 2NF.
3. **3NF:** is there a non-key column that depends on **another non-key column** (transitive dependency)? If not → 3NF.
4. **BCNF:** is the left side (X) of every non-trivial X → Y dependency a **superkey**? If yes → BCNF.

Apply it to the exam table above:

- 1NF: ✔ (atomic fields, has a key).
- 2NF: ✘ – `name` depends only on `neptun`, `course_name, credits` only on `code`: these are **parts** of the key. **Partial dependency.**

Decomposition: `students(neptun, name)`, `courses(code, course_name, credits)`, `exam_sessions(code, exam_date, room)`, `registrations(neptun, code, exam_date)`. Each table's key is the left side of its own dependencies → all are **BCNF**.

## 3. 3NF versus BCNF – the classic example

Most tables in 3NF are also in BCNF. The rare exception occurs when there are **several overlapping** candidate keys. The textbook example:

`consultation(student, course, tutor)`, with the rules:

- a student has **one** tutor per course: `student, course → tutor`;
- each tutor teaches **only one** course: `tutor → course`.

Candidate keys: `{student, course}` and `{student, tutor}`. Since `course` is part of a key (a so-called prime attribute), 3NF allows the `tutor → course` dependency – the table is in **3NF**. But `tutor` is not a superkey, so the table is **not BCNF**.

What's the problem? If tutor Kovács has 30 students, it's stored in 30 rows that Kovács teaches ADB. If Kovács switches course, 30 rows must be updated – an **update anomaly**.

BCNF decomposition: `tutors(tutor, course)` and `consultation(student, tutor)`. The price: the rule "a student has one tutor per course" can no longer be enforced with a simple key in **either table** – only after joining the two.

**Lesson:** BCNF is stricter, but sometimes **loses a dependency**. In practice people often stop at 3NF in such cases. A dependency-preserving and lossless decomposition into 3NF always exists; into BCNF, not always.

## 4. Lossless and lossy decomposition – live

A decomposition is **lossless** if joining the pieces gives back **exactly** the original table – no fewer rows and no **more**. The rule for two pieces: the pieces' **common columns** must form a key of one of the pieces.

Let's see what happens if we decompose badly! We cut the students table into `(name, city)` and `(city, major)`. The common column is `city` – but it is **not a key in either piece** (several students may live in the same city).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
-- Bad decomposition: the common column (city) is a key in neither piece
CREATE TABLE piece1 AS SELECT DISTINCT name, city FROM students WHERE city IS NOT NULL;
CREATE TABLE piece2 AS SELECT DISTINCT city, major FROM students WHERE city IS NOT NULL;

-- Rejoining: how many rows will there be?
SELECT p1.name, p1.city, p2.major
FROM piece1 p1 JOIN piece2 p2 ON p1.city = p2.city
ORDER BY p1.name, p2.major;
```

The original table has 5 students with a city, but the rejoin returns **7 rows**: Anna Kiss and Cili Toth both live in Budapest, so the rejoin "claims" that Anna is also a business informatics student and Cili is also a computer engineering student. These are **spurious (made-up) rows**. So "lossy" doesn't mean rows disappear, but that **information** is lost: we no longer know which row is true.

Now the good decomposition: the common column is `neptun`, which is the key of the first piece.

```sql run
-- Good decomposition: the common column (neptun) is a key of one piece
CREATE TABLE person AS SELECT neptun, name, city FROM students;
CREATE TABLE study AS SELECT neptun, major, semester FROM students;

SELECT COUNT(*) AS rejoined,
       (SELECT COUNT(*) FROM students) AS original
FROM person p JOIN study s ON p.neptun = s.neptun;
```

Exactly as many rows as the original – the decomposition is lossless.

## 5. Deliberate denormalisation

Normalisation makes **updates** safe, but queries need more JOINs. Sometimes we step back on purpose:

| Situation                                                  | Denormalisation                                     | Risk and how to handle it                                           |
| ---------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| The product page always needs the review count and average | `products.review_count`, `avg_rating` columns       | may get stale → kept up to date by a trigger or a scheduled refresh |
| A reporting database (data warehouse) that is only read    | star schema, repeated dimension data (topic 18)     | no updates, so no anomalies                                         |
| The order keeps the price and address at purchase time     | `order_items.unit_price`, `orders.shipping_address` | this isn't really redundancy but a historical fact                  |
| A very frequent, expensive JOIN                            | materialised view (topic 16)                        | needs refreshing                                                    |

**Golden rule:** **normalise** first, and only denormalise when you have a **measured** performance problem – and even then document who and what keeps the copy in sync.

## Common mistakes

- **"I gave every table a surrogate `id` key, so it's normalised."** No: a surrogate key doesn't remove transitive dependencies (the `city → zip` dependency is still there next to `id`).
- **Over-normalisation:** because of `zip → city`, a separate postcode table is correct in theory, but in a small system it may be unnecessary complexity. Weigh it up!
- **Inferring dependencies from the data:** if every student from Budapest in the sample happens to be in computer engineering, the `city → major` dependency is still **not** true. Dependencies come from the **rules of reality**, not from coincidental data.

## Summary

- **Closure algorithm:** keep adding right sides of dependencies to X⁺ while possible; if every column is included, X is a superkey.
- **Checklist:** atomic? (1NF) → no partial dependency? (2NF) → no transitive dependency? (3NF) → every left side a superkey? (BCNF).
- **BCNF** is stricter than 3NF but may lose a dependency.
- **Lossless** decomposition: the common columns form a key of one piece; otherwise **spurious rows** appear.
- **Denormalise** only deliberately, for a measured reason, with a synchronisation plan.

## Exercise

The starter code creates an **unnormalised** order table (`orders_flat`), where every row contains the customer's name and city and the product's name and price. From it, using **CREATE TABLE … AS SELECT**, create the `products_n` table in which **every product appears exactly once** with its name (`product`) and price (`price`)!

The check queries the contents of `products_n`, ordered by name.

```sql starter required
CREATE TABLE orders_flat (
  order_id INT, order_date DATE, customer VARCHAR(40), city VARCHAR(30),
  product VARCHAR(40), price NUMERIC(10, 2), qty INT
);
INSERT INTO orders_flat VALUES
  (1, '2025-03-01', 'Anna Kiss',  'Budapest', 'Mouse',    4990, 1),
  (1, '2025-03-01', 'Anna Kiss',  'Budapest', 'Keyboard', 24990, 1),
  (2, '2025-03-02', 'Bela Nagy',  'Debrecen', 'Mouse',    4990, 2),
  (3, '2025-03-05', 'Anna Kiss',  'Budapest', 'Monitor',  69990, 1),
  (4, '2025-03-07', 'Cili Toth',  'Szeged',   'Keyboard', 24990, 1);

-- Create the products_n table!
CREATE TABLE products_n AS
SELECT ...
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE orders_flat (
  order_id INT, order_date DATE, customer VARCHAR(40), city VARCHAR(30),
  product VARCHAR(40), price NUMERIC(10, 2), qty INT
);
INSERT INTO orders_flat VALUES
  (1, '2025-03-01', 'Anna Kiss',  'Budapest', 'Mouse',    4990, 1),
  (1, '2025-03-01', 'Anna Kiss',  'Budapest', 'Keyboard', 24990, 1),
  (2, '2025-03-02', 'Bela Nagy',  'Debrecen', 'Mouse',    4990, 2),
  (3, '2025-03-05', 'Anna Kiss',  'Budapest', 'Monitor',  69990, 1),
  (4, '2025-03-07', 'Cili Toth',  'Szeged',   'Keyboard', 24990, 1);

CREATE TABLE products_n AS
SELECT DISTINCT product, price FROM orders_flat;
```

</details>

```sql test
SELECT product, price FROM products_n ORDER BY product;
```
