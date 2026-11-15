---
title: Types of Databases
summary: Hierarchical, network, relational, object-oriented, NoSQL and NewSQL databases; grouping by use (OLTP / OLAP), location (centralised / distributed) and mode (embedded / client-server).
minutes: 18
---

## What you will learn

- how data models evolved from hierarchical to NoSQL,
- other ways to group databases,
- which type suits which task.

## A bit of history: data models

**1. Hierarchical model (1960s, e.g. IBM IMS).** Data forms a **tree**: every element has exactly one parent, like folders in a file system.

```text
          University
          /        \
     Faculty A    Faculty B
      /    \          \
  Major 1  Major 2   Major 3
```

Fast when searching along the tree, but a "many-to-many" relationship (a student takes many courses, a course has many students) can only be expressed with duplication.

**2. Network model (CODASYL, 1970s).** An element can have **several parents**; the data forms a graph. More flexible, but programs have to step along "pointers", so querying is complex and any structural change affects every program.

**3. Relational model (E. F. Codd, 1970).** All data lives in **tables**; relationships come from shared values (keys), not pointers. Querying is declarative (SQL): you say **what** you want, not how to get there. Still the most widespread today (PostgreSQL, MySQL, Oracle, SQL Server, SQLite).

**4. Object-oriented and object-relational model (1990s).** The database stores objects, with inheritance and methods. Purely object databases became rare, but many of their ideas were absorbed by relational systems (e.g. PostgreSQL's custom types, arrays, JSON support – hence **object-relational**).

**5. NoSQL (late 2000s).** "Not only SQL": for the huge, fast-changing data of big web companies. Four main kinds: **key-value** (Redis), **document** (MongoDB), **column-family** (Cassandra), **graph** (Neo4j). Topics 11 and 12 cover them in detail.

**6. NewSQL (2010s).** Distributed systems that keep the relational model and SQL but **scale horizontally** (e.g. CockroachDB, Google Spanner, TiDB).

## Other ways to group databases

| Aspect        | Types                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use**       | **OLTP**: many small transactions (web shop order, bank transfer); **OLAP**: big analytical queries (monthly report) – see topic 18                                   |
| **Location**  | **centralised** (one server) or **distributed** (several machines, even on several continents)                                                                        |
| **Mode**      | **client-server** (separate server process reached over the network, e.g. PostgreSQL) or **embedded** (part of the program, a single file, e.g. SQLite in your phone) |
| **Storage**   | **disk-based** or **in-memory** (e.g. Redis – very fast)                                                                                                              |
| **Operation** | on your own server or **as a cloud service** (DBaaS, e.g. Amazon RDS, Neon, Supabase)                                                                                 |

## Which one when?

- **Web shop, banking system, Neptun**: relational (strict rules, transactions).
- **A mobile app's local data**: embedded relational (SQLite).
- **Sessions, cache, leaderboard**: key-value, in memory (Redis).
- **Product catalogue or content with varied structure**: document (MongoDB or PostgreSQL JSONB).
- **Social network, recommendation system**: graph (Neo4j).
- **Sensor data, monitoring**: time series (InfluxDB, TimescaleDB).

A large modern system often uses **several** at once (this is _polyglot persistence_): orders in PostgreSQL, the cart in Redis, search in Elasticsearch.

## Summary

- Evolution: hierarchical (tree) → network (graph, pointers) → relational (tables, keys, SQL) → object(-relational) → NoSQL → NewSQL.
- Also grouped by: OLTP / OLAP, centralised / distributed, client-server / embedded, disk / memory.
- There is no "best" database, only the one that fits the task.

## Lesson exercise

```quiz required
? In which model does data form a tree where every element has one parent?
+ hierarchical
- network
- relational
- graph
! Like folders in a file system.

? Who created the relational model in 1970?
- Bill Gates
+ E. F. Codd
- Linus Torvalds
- Tim Berners-Lee
! Edgar F. Codd was an IBM researcher.

? A mobile app stores its data in a single file on the phone, without a separate server. What mode of database is this?
- client-server
+ embedded
- distributed
- OLAP
! E.g. SQLite: part of the program.

? Which is a typical example of a NoSQL **key-value** database?
- PostgreSQL
- Neo4j
+ Redis
- Oracle
! Redis works with key-value pairs held in memory.

? What is a system called that uses several different databases at once (e.g. PostgreSQL + Redis)? (two words)
= polyglot persistence
= poliglott perzisztencia
! Each piece of data lives where it is handled best.
```
