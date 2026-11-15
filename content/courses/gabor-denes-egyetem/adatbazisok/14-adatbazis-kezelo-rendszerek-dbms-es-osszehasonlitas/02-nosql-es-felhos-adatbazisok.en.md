---
title: NoSQL and Cloud Databases
summary: Comparing the best-known NoSQL systems (MongoDB, Redis, Cassandra, Neo4j, DynamoDB), the difference between self-hosting and managed cloud database services (DBaaS), shared responsibility and serverless databases.
minutes: 22
---

## What you will learn

- how the best-known **NoSQL** systems compare,
- the difference between a **self-hosted** and a **managed cloud** database,
- what **shared responsibility** and a **serverless** database mean.

## NoSQL systems at a glance

In topics 11–12 you met the families. Here are their best-known representatives side by side:

| System          | Family          | Strength                                                  | Not for                                      |
| --------------- | --------------- | --------------------------------------------------------- | -------------------------------------------- |
| **MongoDB**     | document        | flexible schema, convenient development, good scaling     | reports joining many tables                  |
| **Redis**       | key-value       | in memory, lightning fast; cache, counters, queues        | a primary, large, durable data store         |
| **Cassandra**   | wide-column     | huge write load, multiple data centres, no single point of failure | ad hoc queries, JOINs               |
| **Neo4j**       | graph           | traversing relationships, shortest path, recommendations  | simple aggregate reports, bulk writes        |
| **DynamoDB**    | key-value / document | fully managed (AWS), automatic scaling              | flexible queries, moving out of the cloud    |

A larger system often uses **several** at once – this is called **polyglot persistence**: PostgreSQL for orders, Redis for caching, Elasticsearch for text search.

## Self-hosting or a managed service?

You can run a database **yourself** (on your own server or a rented virtual machine), or use a cloud provider's **managed database** (_DBaaS, Database as a Service_).

Some managed services:

| Provider      | Relational                                                | NoSQL                          |
| ------------- | --------------------------------------------------------- | ------------------------------ |
| AWS           | Amazon RDS (PostgreSQL, MySQL, …), Aurora                 | DynamoDB, ElastiCache (Redis)  |
| Microsoft     | Azure SQL Database, Azure Database for PostgreSQL         | Cosmos DB                      |
| Google        | Cloud SQL, AlloyDB, Spanner                               | Firestore, Bigtable            |
| Independent   | Neon, Supabase (PostgreSQL), PlanetScale (MySQL)          | MongoDB Atlas, Redis Cloud     |

### Who is responsible for what?

In the cloud, responsibility is **shared** between the provider and the customer:

| Task                                                 | Own server    | Managed (DBaaS)    |
| ---------------------------------------------------- | ------------- | ------------------ |
| hardware, power, cooling, data centre                | you           | provider           |
| installing and updating the OS and the DBMS          | you           | provider           |
| automatic backups, replication, failover             | you           | provider (you configure it) |
| **schema design, indexes, queries**                  | you           | **you**            |
| **users, privileges, network access**                | you           | **you**            |
| **the data's content and legal compliance**          | you           | **you**            |

So a managed service does **not** take database design and secure configuration off your shoulders – only the "boring" part of operations.

| Aspect            | Self-hosting                                    | Managed (DBaaS)                                     |
| ----------------- | ----------------------------------------------- | --------------------------------------------------- |
| Control           | full (any extension, any setting)               | limited (whatever the provider allows)              |
| Work              | a lot: updates, backups, monitoring             | little: a few clicks                                |
| Cost              | predictable, can be cheaper at large scale      | cheap at small scale, can be expensive at large scale |
| Expertise         | a database administrator is needed              | less expertise is enough to get started             |

## Serverless databases

With a **serverless** database you don't rent a server of a given size, you pay for actual usage. When nobody uses it, compute capacity scales down **to zero**; when traffic spikes, it grows automatically. Examples include Neon, Aurora Serverless and DynamoDB.

- **Pro**: nothing to do about sizing, very cheap with variable traffic (e.g. a university project or a new product).
- **Con**: after "waking up" the first request may be slower (_cold start_), and with continuous heavy load it can be more expensive than a fixed server.

## Summary

- MongoDB (document), Redis (key-value, memory), Cassandra (wide-column), Neo4j (graph), DynamoDB (managed key-value).
- Polyglot persistence: the right database for each job.
- DBaaS: the provider operates it, but design, privileges and data protection remain your responsibility.
- Serverless: pay per use, automatic scaling, cold starts.

## The lesson's exercise

```quiz required
? A company uses PostgreSQL for orders, Redis for caching and Elasticsearch for text search. What is this called?
- vendor lock-in
+ polyglot persistence
- serverless architecture
- sharding
! The right database for each job.

? With a managed cloud database, who is responsible for setting up indexes and privileges correctly?
- the cloud provider
+ the customer (you)
- nobody, these are automatic
! In the shared responsibility model, schema design and access belong to the customer.

? What is the main advantage of a managed database service (DBaaS) over self-hosting?
+ the provider handles installation, updates, backups and replication
- full control over every setting
- it's always cheaper at large scale
- you don't need to set up privileges
! The "boring" part of operations comes off your shoulders.

? What does a cold start mean for a serverless database?
- backups are put into cold storage
+ the first request to a stopped (scaled-to-zero) database is slower because it has to wake up first
- the database is only available in winter
- the server shuts down from overheating
! In exchange you don't pay for compute while it's idle.

? Which system would you choose as the primary, durable data store for an accounting program?
- Redis
- Cassandra
+ PostgreSQL
- Neo4j
! Financial data needs ACID transactions and complex queries.
```
