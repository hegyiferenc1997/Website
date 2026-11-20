---
title: Deeper – The Same Data in Three Models
summary: A web shop's orders in relational, document and key-value models, designed from access patterns; embedding versus referencing with numbers; converting relational data to JSON and back (jsonb_build_object, jsonb_agg, jsonb_to_recordset); schema validation for JSON; cache patterns and eventual consistency on a timeline.
minutes: 40
---

## What you will learn in this lesson

- what **the same data** looks like in relational, document and key-value models,
- why **access patterns** ("what questions do we ask?") drive NoSQL design,
- when to **embed** and when to **reference** – backed by numbers,
- how to turn **relational data into JSON documents** and back with SQL,
- how a flexible-schema document can still be **validated**,
- how **caching** and **eventual consistency** work in practice.

## The data: one order

On 1 March 2025 Anna Kiss ordered a mouse (1 pc, 4,990 HUF) and a keyboard (1 pc, 24,990 HUF), to a shipping address in Budapest.

### 1. Relational model – "store everything once"

```text
customers:   (1, 'Anna Kiss', 'anna@example.com')
orders:      (1001, customer_id=1, '2025-03-01', 'Budapest, Main St 1')
order_items: (1001, product_id=1, qty=1, unit_price=4990)
             (1001, product_id=2, qty=1, unit_price=24990)
products:    (1, 'Mouse', …), (2, 'Keyboard', …)
```

The order is spread across four tables; displaying it requires **JOINs**. In return, every piece of data appears once, and any question (e.g. "which product sells best?") is easy to answer.

### 2. Document model – "store it the way you read it"

```json
{
  "_id": 1001,
  "date": "2025-03-01",
  "customer": { "id": 1, "name": "Anna Kiss" },
  "shipping_address": "Budapest, Main St 1",
  "items": [
    { "product": "Mouse", "qty": 1, "unit_price": 4990 },
    { "product": "Keyboard", "qty": 1, "unit_price": 24990 }
  ]
}
```

The order page can be displayed with **a single read**. In return, the customer's name is in every one of their orders (if they change their name, many documents must be updated – or we accept that old orders show the old name, which may even be correct here).

### 3. Key-value model – "one key, one value, lightning fast"

```text
order:1001             → { …the whole document… }
customer:1:orders      → [1001, 1017, 1042]
cart:1                 → { "mouse": 1, "keyboard": 1 }      (expires in 24 hours)
```

You can only search **by key**. The question "which orders contain a mouse?" has no answer unless we maintain a separate key for it. In return, reads take microseconds.

## NoSQL design is reverse thinking

In relational design you start from **the data** (what entities and relationships exist?) and trust that SQL can answer anything. In NoSQL design you start from **the questions** (access patterns):

1. Write down the **most frequent questions** (e.g. "all details of an order", "a customer's last 10 orders").
2. Estimate their **frequency** and **size**.
3. Shape the data so that the most frequent question is **a single read**.

**Analogy:** a relational database is a well-organised warehouse from which you can gather anything. A document database is a shelf of pre-packed parcels: whatever is in a parcel you grab in one move, but if you need something else, you have to unpack every parcel.

## Embedding or referencing – with numbers

| Question                                | Tips towards embedding             | Tips towards referencing                             |
| --------------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| How many "child" elements can there be? | few, bounded (order items: 1–50)   | many, unbounded (a product's reviews: up to 100,000) |
| Do you read them together?              | almost always                      | rarely                                               |
| Does the child change independently?    | no (the item lives with the order) | yes (the product's price, description)               |
| Is it shared with other documents?      | no                                 | yes (the same product in many orders)                |

**Numeric example:** in MongoDB a document can be at most **16 MB**. If we embedded a popular product's reviews, and a review averages 500 bytes, then after 16 MB / 500 B ≈ **32,000 reviews** the document can't grow any further. On top of that, every product page view would read all reviews. That's why reviews are a **referenced** separate collection, while order items are **embedded**.

## Relational to JSON and back – in PostgreSQL

PostgreSQL understands both worlds: you can build JSON documents from relational tables (e.g. for a web API response), and tables from JSON (e.g. to process an incoming file).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Relational → document

```sql run
-- Every course is a document with the list of enrolled students
SELECT jsonb_build_object(
         'code', c.code,
         'name', c.name,
         'enrolled', COALESCE(jsonb_agg(
             jsonb_build_object('neptun', e.neptun, 'grade', e.grade) ORDER BY e.neptun
           ) FILTER (WHERE e.neptun IS NOT NULL), '[]'::jsonb)
       ) AS document
FROM courses c
LEFT JOIN enrollments e ON e.code = c.code
GROUP BY c.code, c.name
ORDER BY c.code;
```

- `jsonb_build_object(key, value, …)` – builds a JSON object;
- `jsonb_agg(…)` – an aggregate function: builds a JSON array from the group's elements (like `COUNT`, but returns an array);
- `FILTER` and `COALESCE` make sure a course without enrollments gets an empty array, not `[null]`.

### Document → relational

```sql run
-- Break an incoming JSON order's items into rows
SELECT t.*
FROM jsonb_to_recordset('[
  {"product": "Mouse", "qty": 1, "unit_price": 4990},
  {"product": "Keyboard", "qty": 1, "unit_price": 24990},
  {"product": "Mouse pad", "qty": 2, "unit_price": 2990}
]'::jsonb) AS t(product TEXT, qty INT, unit_price NUMERIC);
```

`jsonb_to_recordset` turns the array into a table with the given column names and types – after that you can run any SQL on it (filtering, aggregation, inserting into a real table).

## Flexible schema ≠ no schema

A "schemaless" database still has a schema – it's just kept track of by **the application** rather than the database. If a document lacks a field or has the wrong type, you find out when the program runs. That's why modern document databases (and PostgreSQL too) allow **schema validation**:

```sql run
CREATE TABLE order_docs (
  id  INT PRIMARY KEY,
  doc JSONB NOT NULL,
  -- The document must have a "customer" and an "items" field, and items must be an array
  CHECK (doc ? 'customer' AND jsonb_typeof(doc -> 'items') = 'array')
);

INSERT INTO order_docs VALUES
  (1, '{"customer": "Anna Kiss", "items": [{"product": "Mouse", "qty": 1}]}');

SELECT id, doc ->> 'customer' AS customer, jsonb_array_length(doc -> 'items') AS item_count
FROM order_docs;
```

Try it: click Edit and insert a document without `"items"` – the `CHECK` rejects it. This way flexibility remains (any additional fields may come), but the **essential structure** is guaranteed.

## Key-value stores in practice: cache patterns

The most common role of Redis-like stores is a **cache** in front of a relational database.

**Cache-aside pattern:**

```text
1. The application checks the cache: GET product:42
2a. If it's there (hit): done, no database needed.
2b. If not (miss): it queries the database
    and stores the result in the cache with an expiry: SET product:42 … EX 300
3. When the product changes: update it in the database and delete the key: DEL product:42
```

**Numeric example:** a product page is opened 6,000 times per minute and the product data changes every 5 minutes. Without a cache that's 6,000 database queries per minute; with a 5-minute expiry it's **one** every five minutes – the other 29,999 come from memory.

Other typical patterns: **counter** (`INCR page:42:views`), **session** with expiry, **leaderboard** with a sorted set, **rate limiting** (how many requests came from an IP in the last minute).

## Eventual consistency on a timeline

In distributed NoSQL systems the data lives on several **replicas**. After a write, replicas update not immediately but **with a short delay** (eventual consistency):

```text
time  replica A (we write here)  replica B                reading user
 0    name := "Anna Kiss"        name = "Anna Kiss"
 1    name := "Anna Nagy"        name = "Anna Kiss"       reads from B → "Anna Kiss" (stale!)
 2                               ← synchronisation
 3    name = "Anna Nagy"         name = "Anna Nagy"       reads from B → "Anna Nagy" ✔
```

This is acceptable for a social site's "like" counter (nobody minds if it shows 99 instead of 100 for a second), but not for a **bank account** balance. That's why many systems offer **tunable** consistency: for critical reads they wait for a majority (quorum) answer, otherwise they accept the first replica's.

The "read-your-writes" guarantee means: **you** always see your own change (e.g. because your read after the write goes to the same replica), even if others see the old value for a moment.

## Summary

- **Relational:** store everything once, assemble with JOINs; any question can be answered.
- **Document:** store it the way you read it; one read, but duplication and less flexible queries.
- **Key-value:** by key only, but lightning fast; typically cache, counter, session.
- In NoSQL, **access patterns** drive the design; embed elements that are few, read together and have no life of their own.
- PostgreSQL: `jsonb_build_object`, `jsonb_agg` (relational → JSON), `jsonb_to_recordset` (JSON → relational), `CHECK` on JSON structure.
- **Eventual consistency:** replicas update with a delay; critical data needs strong consistency.

## Exercise

For every student who has an enrollment, build a **JSON document**: the result should have a `neptun` column and a `document` column, which is an object with the student's name (`"name"`) and an **alphabetically sorted** array of the codes of the courses they took (`"courses"`). Sort by student ID!

For example, for Anna Kiss: `{"name": "Anna Kiss", "courses": ["ADB", "DIG", "PROG"]}`

Hint: `jsonb_build_object` and `jsonb_agg(… ORDER BY …)`, with the student ID and name in `GROUP BY`.

```sql starter required
SELECT s.neptun,
       jsonb_build_object('name', s.name) AS document
FROM students s
ORDER BY s.neptun;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT s.neptun,
       jsonb_build_object('name', s.name, 'courses', jsonb_agg(e.code ORDER BY e.code)) AS document
FROM students s
JOIN enrollments e ON e.neptun = s.neptun
GROUP BY s.neptun, s.name
ORDER BY s.neptun;
```

</details>
