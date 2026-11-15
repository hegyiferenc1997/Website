---
title: Practice – NoSQL
summary: Review questions about the NoSQL families, the CAP theorem and modelling, a "which database should we choose?" case study, and an extra exercise with embedded JSON documents.
minutes: 30
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
