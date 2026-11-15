---
title: Key-Value and Document Databases
summary: How key-value stores (Redis) work and what they're typically used for, document databases (MongoDB) and the question of embedding versus referencing, and storing and querying JSON documents in PostgreSQL (JSONB) – tried out in your browser.
minutes: 30
---

## What you will learn

- how a **key-value** store works, and what it's good for,
- what a **document database** is, and how to organise data in it,
- how to query **JSON documents** from SQL (PostgreSQL JSONB).

## Key-value stores

The simplest data model: every piece of data is a **value** stored under a **key**, like a giant dictionary or a cloakroom (ticket number → coat). The database doesn't "look into" the value, it only returns it by key.

The best known is **Redis**, which keeps data **in memory**, so it's incredibly fast (a request typically takes less than a millisecond). This is what it looks like in use:

```text
SET session:8f3a "{ user: 42, cart: [3, 8] }"   EX 1800
GET session:8f3a
INCR visitors:2026-11-15
EXPIRE cart:42 3600
```

- `SET key value` / `GET key` – writing and reading,
- `EX 1800` / `EXPIRE` – the value **expires** after 1800 seconds (30 minutes) and deletes itself,
- `INCR` – increments a counter in a single, indivisible step.

Typical uses:

- **cache**: we keep the result of a slow query for a few minutes,
- **sessions** (logged-in users), **shopping cart**,
- **counters**, leaderboards, message queues.

Limit: you can only search by key. "Give me all customers from Budapest" – a pure key-value store isn't made for that kind of question.

## Document databases

A document database (e.g. **MongoDB**) also stores by key, but the value is a **structured document** (JSON or a binary form of it), and you can **search** its fields and put **indexes** on them.

```json
{
  "_id": 1,
  "name": "27-inch monitor",
  "price": 69990,
  "category": "monitor",
  "specs": { "size": 27, "resolution": "2560x1440" },
  "tags": ["office", "gaming"]
}
```

Documents are organised into **collections** – roughly the equivalent of a table, but the documents don't need the same structure. In MongoDB a query looks like this:

```text
db.products.find({ tags: "gaming", price: { $lt: 50000 } })
```

### Embedding or referencing?

In a document database the most important design question is: do we **embed** an order's items in the order document, or store them in a separate collection and **reference** them?

| Embedding                                                  | Referencing                                             |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| one read gets everything (no JOIN)                         | no duplication, you change it in one place              |
| good if you **always read the data together**              | good if you **also use the data separately**, or many refer to it |
| e.g. an order's items, a blog post's tags                  | e.g. the data of a customer who has many orders         |

The rule of thumb: **store it the way you'll read it.** This is the exact opposite of relational normalisation (topic 6): there the goal was to avoid duplication, here it's fast reads.

## JSON documents in PostgreSQL

You don't necessarily need a separate system for documents: PostgreSQL's `JSONB` type stores any JSON document in a column and makes it searchable and indexable. That way you get relational safety and the flexibility of documents in one system.

<details>
<summary>Creating the product documents (SQL)</summary>

```sql setup
-- Products as JSON documents: every product has different properties.
CREATE TABLE products (
  id   INT PRIMARY KEY,
  data JSONB NOT NULL
);
INSERT INTO products VALUES
  (1, '{"name": "27-inch monitor", "price": 69990, "category": "monitor",
        "specs": {"size": 27, "resolution": "2560x1440"}, "tags": ["office", "gaming"]}'),
  (2, '{"name": "Wireless mouse", "price": 4990, "category": "peripheral",
        "specs": {"dpi": 1600}, "tags": ["office"]}'),
  (3, '{"name": "Gaming mouse", "price": 14990, "category": "peripheral",
        "specs": {"dpi": 16000}, "tags": ["gaming", "rgb"]}'),
  (4, '{"name": "24-inch monitor", "price": 44990, "category": "monitor",
        "specs": {"size": 24, "resolution": "1920x1080"}, "tags": ["office"]}'),
  (5, '{"name": "Headphones", "price": 15990, "category": "audio",
        "specs": {"wireless": true}, "tags": ["gaming"]}'),
  (6, '{"name": "Mechanical keyboard", "price": 24990, "category": "peripheral",
        "specs": {"switch": "brown"}, "tags": ["gaming", "rgb"]}');
```

</details>

```sql run
SELECT id, data FROM products ORDER BY id;
```

The most important operators:

| Operator       | Meaning                                            | Example                                    |
| -------------- | -------------------------------------------------- | ------------------------------------------ |
| `->`           | get a field **as JSON**                            | `data -> 'specs'`                          |
| `->>`          | get a field **as text**                            | `data ->> 'name'`                          |
| `#>>`          | a deeper field as text, by path                    | `data #>> '{specs,size}'`                  |
| `?`            | does this key (or array element) exist             | `data -> 'tags' ? 'rgb'`                   |
| `@>`           | does it contain this sub-document                  | `data @> '{"category": "monitor"}'`        |

```sql run
SELECT data ->> 'name' AS name,
       (data ->> 'price')::INT AS price,
       data #>> '{specs,size}' AS size
FROM products
WHERE data @> '{"category": "monitor"}'
ORDER BY price;
```

Notice: `->>` always returns **text**, so we convert the price to a number with `::INT` – otherwise sorting would happen as text ("100" < "20").

You can also split an array into rows, so you can count, for example, how often each tag appears:

```sql run
SELECT tag, COUNT(*) AS cnt
FROM products, jsonb_array_elements_text(data -> 'tags') AS tag
GROUP BY tag
ORDER BY cnt DESC, tag;
```

With many documents, searching is sped up by a **GIN index**, which indexes every key and value of the document:

```sql
CREATE INDEX products_data_gin ON products USING gin (data);
```

## Summary

- Key-value (Redis): key → value, in memory, very fast; cache, sessions, counters.
- Document (MongoDB): JSON documents in collections, searchable by fields.
- Embedding or referencing: store it the way you'll read it.
- PostgreSQL JSONB: `->`, `->>`, `@>`, `?`, `jsonb_array_elements_text`, GIN index.

## The lesson's exercise

Query the **name** and **price** (the price **as a number**) of the products tagged **`gaming`**, sorted by **price in descending** order.

Hint: you can filter on the tag with the `?` or the `@>` operator.

```sql starter required
SELECT data ->> 'name' AS name
FROM products;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT data ->> 'name' AS name,
       (data ->> 'price')::INT AS price
FROM products
WHERE data -> 'tags' ? 'gaming'
ORDER BY price DESC;
```

</details>
