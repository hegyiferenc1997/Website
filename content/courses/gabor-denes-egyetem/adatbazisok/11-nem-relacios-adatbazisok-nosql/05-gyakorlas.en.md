---
title: Practice – NoSQL
summary: Review questions about the NoSQL families, the CAP theorem and modelling, a "which database should we choose?" case study, and an extra exercise with embedded JSON documents.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. What exactly does the name "NoSQL" mean, and is the relational database its enemy?</summary>

Today it's read as "Not only SQL": besides the relational model other data models exist too, and each is good for different jobs. They aren't enemies: in a large system they often work together (e.g. PostgreSQL for orders, Redis for caching).

</details>

<details>
<summary>2. Why is it hard to scale a relational database horizontally?</summary>

Because for JOINs and transactions touching several tables, the machines would constantly have to coordinate with each other over the network, which is slow and complicated. That's why NoSQL systems usually give up JOINs or strict consistency.

</details>

<details>
<summary>3. In a web shop, would you embed an order's items in the order document, or store them separately?</summary>

I'd embed them: the items are almost always read together with the order, and they don't change once the order is closed. The customer's data, however, I'd handle by reference, because many orders belong to it and their address may change.

</details>

<details>
<summary>4. What's the difference between relational and query-driven (Cassandra-style) data modelling?</summary>

Relationally we start from the data, normalise, and afterwards we can write any query. Query-driven, we first collect the queries and design a separate, denormalised table for each, which serves exactly that query.

</details>

<details>
<summary>5. What do we gain and what do we lose with eventual consistency?</summary>

We gain: faster writes, better availability (the system answers even during a network failure) and easier scaling. We lose: for a short time different machines may show different (old) data, and the application has to be prepared for that.

</details>

## Case study: which database should we choose?

A start-up is building an application with the following parts. Decide for each which type of database suits it best!

```quiz required
? Sessions of logged-in users: read by key, they expire after 30 minutes, it has to be very fast.
+ key-value (e.g. Redis)
- graph (e.g. Neo4j)
- wide-column (e.g. Cassandra)
- relational (e.g. PostgreSQL)
! In memory, with an expiry time.

? A product catalogue where every product category has different properties, and products must be filterable by these properties.
- key-value (e.g. Redis)
+ document (e.g. MongoDB or PostgreSQL JSONB)
- wide-column (e.g. Cassandra)
! Flexible structure, searchable by fields.

? Heart-rate data sent every second by smartwatches of a million users; we always query one user's given time period.
- document (e.g. MongoDB)
- key-value (e.g. Redis)
+ wide-column (e.g. Cassandra)
- graph (e.g. Neo4j)
! Huge write load, partition = user, ordering = time.

? Invoicing and payments: it's about money, every item has to be exactly right.
+ relational (e.g. PostgreSQL), with ACID transactions
- key-value (e.g. Redis), with eventual consistency
- wide-column (e.g. Cassandra), with the ONE consistency level
! Here correctness matters most.

? The replication factor is 5. At least how many machines' answers do you need to wait for on read, if you wait for 3 machines on write and want to be sure to read the latest data?
= 3
! W + R > N: 3 + R > 5, so R is at least 3.
```

## Extra exercise: embedded items

Orders are stored as documents, with the items **embedded**. Calculate the **total** of each order (quantity × price, summed), sorted by order ID. This exercise is optional.

<details>
<summary>Creating the order documents (SQL)</summary>

```sql setup
-- Orders as JSON documents, with the items embedded.
CREATE TABLE orders (
  id  INT PRIMARY KEY,
  doc JSONB NOT NULL
);
INSERT INTO orders VALUES
  (1, '{"customer": "Anna Kiss", "items": [
        {"product": "Gaming mouse", "qty": 1, "price": 14990},
        {"product": "Mouse pad", "qty": 2, "price": 2990}]}'),
  (2, '{"customer": "Bela Nagy", "items": [
        {"product": "27-inch monitor", "qty": 2, "price": 69990}]}'),
  (3, '{"customer": "Cili Toth", "items": [
        {"product": "HDMI cable", "qty": 3, "price": 1990},
        {"product": "Webcam", "qty": 1, "price": 12990},
        {"product": "Microphone", "qty": 1, "price": 19990}]}');
```

</details>

```sql starter
SELECT o.id, i ->> 'product' AS product
FROM orders o, jsonb_array_elements(o.doc -> 'items') AS i;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT o.id,
       o.doc ->> 'customer' AS customer,
       SUM((i ->> 'qty')::INT * (i ->> 'price')::INT) AS total
FROM orders o, jsonb_array_elements(o.doc -> 'items') AS i
GROUP BY o.id, o.doc ->> 'customer'
ORDER BY o.id;
```

</details>

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

The first four exercises work on the order documents above (`orders` table, `doc` JSONB column), the last one imitates a key-value store.

**1.** **Array length.** Per order, show the customer's name and **how many items** are in the order (`jsonb_array_length`), by ID!

```sql starter
SELECT id, doc
FROM orders;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT id,
       doc ->> 'customer' AS customer,                -- ->> returns text
       jsonb_array_length(doc -> 'items') AS items    -- -> returns JSON (here an array)
FROM orders
ORDER BY id;
```

</details>

**2.** **Containment (`@>`).** Which order (ID, customer) contains a **webcam**? Use the `@>` operator: "does the document contain this sub-document?"

```sql starter
SELECT id, doc ->> 'customer' AS customer
FROM orders;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT id, doc ->> 'customer' AS customer
FROM orders
WHERE doc @> '{"items": [{"product": "Webcam"}]}';     -- with a GIN index this is very fast
```

</details>

**3.** **Expanding an array.** List all items **more expensive than 10,000 HUF** (product, price) from all orders, by price descending!

```sql starter
SELECT i
FROM orders o, jsonb_array_elements(o.doc -> 'items') AS i;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT i ->> 'product' AS product, (i ->> 'price')::INT AS price
FROM orders o, jsonb_array_elements(o.doc -> 'items') AS i
WHERE (i ->> 'price')::INT > 10000                     -- the text has to be converted to a number
ORDER BY price DESC;
```

</details>

**4.** **A new field in the document.** Order 2 is done: extend its document with a `"status": "done"` field (the `||` operator merges two JSON objects)! Then query every order's ID and status.

```sql starter
SELECT id, doc ->> 'status' AS status
FROM orders
ORDER BY id;
```

<details>
<summary>Solution</summary>

```sql solution
UPDATE orders
SET doc = doc || '{"status": "done"}'
WHERE id = 2;

SELECT id, doc ->> 'status' AS status        -- NULL where there is no such field
FROM orders
ORDER BY id;
```

</details>

**5.** **A key-value store in SQL.** We imitate a page-view counter: in the `counters` table (`key` text, primary key; `value` integer) we increase the value of the `home` key by 1 on every page view – if there's no such key yet, it's created with 1. Run the "increment" **three times**, then query the table!

```sql starter
CREATE TABLE counters (key TEXT PRIMARY KEY, value INT NOT NULL);
-- INSERT ... ON CONFLICT ... (three times)
SELECT * FROM counters;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE counters (key TEXT PRIMARY KEY, value INT NOT NULL);
INSERT INTO counters VALUES ('home', 1)
  ON CONFLICT (key) DO UPDATE SET value = counters.value + 1;
INSERT INTO counters VALUES ('home', 1)
  ON CONFLICT (key) DO UPDATE SET value = counters.value + 1;
INSERT INTO counters VALUES ('home', 1)
  ON CONFLICT (key) DO UPDATE SET value = counters.value + 1;   -- in Redis: INCR home
SELECT * FROM counters;
```

</details>
