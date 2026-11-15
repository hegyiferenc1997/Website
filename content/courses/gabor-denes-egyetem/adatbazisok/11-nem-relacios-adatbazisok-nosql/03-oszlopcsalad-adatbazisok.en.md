---
title: Wide-Column Databases
summary: How a wide-column database (Cassandra) stores data: partition key and clustering key, query-driven modelling and deliberate denormalisation, replication and tunable consistency (quorum).
minutes: 25
---

## What you will learn

- how a **wide-column database** (e.g. Cassandra) organises data,
- what the **partition key** and the **clustering key** are,
- why design starts from **the queries**,
- how **replication** and **quorum** work.

## What is a wide-column database?

Wide-column databases (_wide-column stores_) – for example **Apache Cassandra**, **ScyllaDB** or **HBase** – use tables with rows and columns at first sight, but they work very differently:

- data is split into **partitions**, and each partition goes onto one of the machines of the **cluster**,
- within a partition, rows are stored in order by a **clustering key**,
- writes go into an LSM tree (topic 9), so they're **extremely fast**,
- there are no JOINs, and filtering is limited.

Typical use: **huge write load** and **queries known in advance** – messages, sensor data, event logs, histories. Discord, for example, stored billions of messages this way.

## Partition key and clustering key

Cassandra's query language, **CQL**, looks very much like SQL:

```text
CREATE TABLE messages_by_channel (
  channel_id  int,
  sent_at     timestamp,
  message_id  uuid,
  author      text,
  body        text,
  PRIMARY KEY ((channel_id), sent_at, message_id)
) WITH CLUSTERING ORDER BY (sent_at DESC);
```

The primary key has two parts:

- **Partition key** – `(channel_id)`: this decides **which machine** the data goes to. All messages of a channel go into one partition, one place.
- **Clustering key** – `sent_at, message_id`: within the partition, rows are stored in this **order** (here the newest first).

```text
 node A                         node B                        node C
 ┌──────────────────────┐       ┌──────────────────────┐      ┌───────────────┐
 │ channel 7:           │       │ channel 12:          │      │ channel 3:    │
 │  15:42 "Hi all!"     │       │  09:10 "Who's in?"   │      │  …            │
 │  15:40 "Any updates?" │       │  09:05 "Me!"         │      │               │
 │  15:31 "Done with…"  │       │  …                   │      │               │
 └──────────────────────┘       └──────────────────────┘      └───────────────┘
```

That's why this query is lightning fast: one machine, one partition, and the rows are already sorted:

```text
SELECT author, body FROM messages_by_channel
WHERE channel_id = 7 LIMIT 50;
```

But this one **doesn't work** (or only very slowly, with explicit permission), because every partition on every machine would have to be scanned:

```text
SELECT * FROM messages_by_channel WHERE author = 'anna';
```

## Query-driven modelling

In relational design we start from the **data** (entities, relationships, normalisation), and afterwards we can write any query. With a wide-column database it's the other way round: first we list the **queries**, and design **a separate table for each**, which serves exactly that query.

If messages also need to be queried by author, we need a second table:

```text
CREATE TABLE messages_by_author (
  author      text,
  sent_at     timestamp,
  message_id  uuid,
  channel_id  int,
  body        text,
  PRIMARY KEY ((author), sent_at, message_id)
);
```

So the same message is in **two tables** – this is **deliberate denormalisation**. Storage is cheap, fast reads are valuable. The price: every write has to go into both tables, and the application has to make sure they match.

> Analogy: in a library the same list of books exists sorted by author and sorted by title. It's duplicated, but you find the answer to either question instantly.

## Replication and quorum

Every partition is put on **several machines**; this is the **replication factor** (e.g. 3). If one machine fails, the other two serve the requests.

In Cassandra you can **tune**, per query, how many copies' answers to wait for:

- `ONE`: one machine's answer is enough – fastest, but we may get old data,
- `QUORUM`: the majority (**2** out of 3 copies) – the middle ground,
- `ALL`: all of them – safest, but if a machine is down, the request fails.

The golden rule: if the number of machines waited for on **write** and on **read** together is **more than the number of copies** (W + R > N), the read is guaranteed to see the latest write, because the two groups share a machine. For example N = 3, write `QUORUM` (2) and read `QUORUM` (2): 2 + 2 = 4 > 3.

## When to choose it, and when not?

| Good choice                                        | Bad choice                                       |
| -------------------------------------------------- | ------------------------------------------------ |
| huge, continuous write load                        | little data, one server is plenty                |
| simple queries known in advance                    | many ad hoc queries, JOINs, reports              |
| several data centres, continuous availability      | strict transactions (finance, stock)             |

## Summary

- Wide-column (Cassandra): tables split into partitions, fast writes, no JOINs.
- Partition key = which machine; clustering key = what order within the partition.
- Query-driven design: a separate table per query, deliberate denormalisation.
- Replication + tunable consistency: if W + R > N, the read sees the latest write.

## The lesson's exercise

```quiz required
? In a Cassandra table, what decides which machine a row goes to?
+ the partition key
- the clustering key
- the time the row was inserted
- the name of the table
! Its location is calculated from the partition key.

? In what order are rows stored within a partition?
- randomly
- in the order they were inserted
+ by the clustering key
! Clustering key.

? Why is the same message stored in two tables (by channel and by author)?
- by mistake, this should be avoided
+ because every query needs its own table that serves exactly that query
- because it needs less storage this way
- because Cassandra duplicates everything automatically
! Deliberate denormalisation for fast reads.

? The replication factor is 3. How many machines' answers are needed for the QUORUM level?
= 2
! The majority: 2 out of 3.

? Which job is a wide-column database least suited for?
- per-minute measurements from millions of sensors
- a chat application's messages per channel
+ monthly financial reports joining many tables
- a user activity log
! JOINs and ad hoc queries are what relational databases are for.
```
