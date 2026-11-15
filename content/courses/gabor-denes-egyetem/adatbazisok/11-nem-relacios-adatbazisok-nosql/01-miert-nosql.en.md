---
title: Why NoSQL?
summary: When the relational model isn't always enough, what horizontal scaling and a flexible schema mean, the four main families of NoSQL databases, the CAP theorem, and comparing the ACID and BASE approaches.
minutes: 22
---

## What you will learn

- which problems **NoSQL** databases were born to solve,
- the difference between **vertical** and **horizontal scaling**,
- the **four main families** of NoSQL,
- what the **CAP theorem** says, and the difference between **ACID** and **BASE**.

## Where did NoSQL come from?

In the 2000s Google, Amazon and Facebook ran into scales that traditional relational databases weren't designed for: **billions** of users, **millions** of requests per second, data centres all over the world. They built new systems, and these became the **NoSQL** movement.

Today the name is better read as **"Not only SQL"** – it isn't against SQL, it says that besides the relational model other tools exist too. Many NoSQL systems now have an SQL-like query language as well.

## Vertical and horizontal scaling

If the database can't cope with the load, there are two ways:

```text
 Vertical scaling (scale up):            Horizontal scaling (scale out):
 one server, but stronger                many ordinary servers together

     ┌────────┐                          ┌────┐ ┌────┐ ┌────┐ ┌────┐
     │        │                          │ A–F│ │ G–L│ │ M–R│ │ S–Z│
     │  BIG   │                          └────┘ └────┘ └────┘ └────┘
     │ MACHINE│                          data split up (sharding)
     └────────┘
```

- **Vertical** (_scale up_): a bigger processor, more memory. Simple, but it has an **upper limit**, and it gets very expensive.
- **Horizontal** (_scale out_): more machines, with the data **split** between them (_sharding_, _partitioning_). In principle it can grow without limit – but coordinating the machines is hard.

Relational databases traditionally scale vertically (JOINs and transactions across several machines are hard). Most NoSQL systems were designed **for horizontal scaling from the start**.

## Flexible schema

In a relational database you first have to design the tables (the schema), and every row has the same columns. But in a web shop a monitor has a screen size and resolution, a T-shirt has a size and colour, a book has an author and page count. Many NoSQL systems are **schemaless** or have a **flexible schema**: every record (document) may contain different fields.

> Note: "schemaless" doesn't mean there's no structure – it means **the application** is responsible for the structure, not the database. It's freedom, but also responsibility.

## The four main families of NoSQL

| Family          | How does it store data?                           | Examples              | Typical job                           |
| --------------- | ------------------------------------------------- | --------------------- | ------------------------------------- |
| **Key-value**   | key → any value, like a giant dictionary          | Redis, DynamoDB       | cache, sessions, shopping cart        |
| **Document**    | key → JSON-like document, searchable by fields    | MongoDB, Couchbase    | product catalogue, content management |
| **Wide-column** | rows with flexible columns, split into partitions | Cassandra, HBase      | huge write load, time series data     |
| **Graph**       | nodes and edges                                   | Neo4j, Amazon Neptune | social network, recommendation system |

In the next lessons we look at the first three, and at graph databases in topic 12.

## The CAP theorem

In a **distributed** system (several machines connected by a network) we'd like three good properties:

- **C – Consistency**: every read sees the latest write, whichever machine you read from.
- **A – Availability**: every request gets an answer.
- **P – Partition tolerance**: the system keeps working even if the network splits and some machines can't reach the others.

According to the **CAP theorem**, during a network split (partition) **only one of C and A** can be kept. Since network failures always happen in reality, we can't give up P, so the question is: **what do we choose during a split?**

```text
          network split
  [node 1] ───────/ /─────── [node 2]
   x = 5                      x = 5
   write: x = 7 ──► doesn't get through

  Reading from node 2:
   CP: "I can't give a reliable answer right now" → returns an error (consistent, not available)
   AP: "x = 5" → answers, but maybe with old data (available, not consistent)
```

- A **CP** system (e.g. a bank account): better not to answer than to say something wrong.
- An **AP** system (e.g. a social site's like counter): better to answer with slightly old data than to stop.

## ACID and BASE

Relational databases promise **ACID** transactions (topic 8). Many NoSQL systems – for the sake of performance and availability – follow a looser principle, **BASE**:

- **B**asically **A**vailable,
- **S**oft state – the state may change temporarily while the machines synchronise,
- **E**ventual consistency – if no new writes arrive, all machines will show the same thing within a short time.

> Analogy: news spreading in a group of friends. Not everyone hears it at the same moment, but after a while everyone knows the same thing.

| Aspect          | ACID (relational)        | BASE (many NoSQL)                        |
| --------------- | ------------------------ | ---------------------------------------- |
| Consistency     | immediate, strict        | eventual (with a short delay)            |
| Main goal       | correctness              | availability and scalability             |
| Good choice for | finance, stock, bookings | news feeds, likes, logs, recommendations |

Today the line is blurring: MongoDB can do ACID transactions spanning several documents, and PostgreSQL handles JSON documents excellently (lesson 2).

## Summary

- NoSQL = "Not only SQL": born for huge scale, horizontal scaling and flexible schemas.
- Four main families: key-value, document, wide-column, graph.
- CAP: during a network split only one of consistency and availability can be kept.
- ACID = strict, immediate correctness; BASE = availability and eventual consistency.

## The lesson's exercise

```quiz required
? A web shop's database can't cope with the load anymore, so the team buys three more servers and splits the data between them. What kind of scaling is this?
- vertical
+ horizontal
! Scale out: more machines, split data.

? Which NoSQL family does Redis belong to?
+ key-value
- document
- wide-column
- graph
! Key → value, like a giant dictionary.

? According to the CAP theorem, which two properties do you have to choose between during a network split?
- partition tolerance and availability
+ consistency and availability
- consistency and partition tolerance
- durability and atomicity
! In reality we can't give up partition tolerance.

? What does "eventual consistency" mean?
- the data will never be the same on the machines
- every write is visible on every machine immediately
+ if no new writes arrive, all machines show the same thing within a short time
- data only reaches the disk when the system shuts down
! The "E" in BASE.

? Which application suits an AP (availability-first) system best?
- bank transfers
- booking the last seat on a plane
+ a social site's like counter
- recording university grades
! Here it's no problem if an old number shows for a second or two.
```
