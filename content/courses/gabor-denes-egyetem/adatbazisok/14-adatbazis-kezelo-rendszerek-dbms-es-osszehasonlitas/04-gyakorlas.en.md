---
title: Practice – Comparing DBMSs
summary: Review questions about relational and NoSQL systems, cloud services and the method of choosing, then five project descriptions for which you have to choose the most suitable database.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. How does SQLite differ from PostgreSQL and MySQL?</summary>

SQLite has no separate server process: the whole database is a single file that the application reads and writes directly through a library. That's why it works with zero configuration and is ideal inside mobile and desktop apps, but it isn't made to serve many concurrent writers.

</details>

<details>
<summary>2. What is vendor lock-in, and how can it be reduced?</summary>

It means that moving away from a system would be very hard and expensive, because the code and data are built on one vendor's own features. It can be reduced with standard SQL, open source systems, and by gathering the vendor-specific parts in one place in the application.

</details>

<details>
<summary>3. What doesn't a managed cloud database take off your shoulders?</summary>

Schema design, indexes and query optimisation, setting up users and privileges, restricting network access, and the responsibility for the data's content and legal compliance (e.g. GDPR).

</details>

<details>
<summary>4. Why can an unweighted average be misleading when scoring DBMSs?</summary>

Because it treats every criterion as equally important. If cost matters much more to a project than learnability, an unweighted average may rank an expensive system that's strong in many respects first.

</details>

<details>
<summary>5. When is it justified to add a NoSQL system alongside a relational database?</summary>

When there's a concrete need the relational database serves poorly: e.g. a lightning-fast cache or session store (Redis), a huge write load (Cassandra), complex relationship traversal (Neo4j) or full-text search (Elasticsearch). But not for fashion: every new system is an operational burden.

</details>

## The practice exercise

Five teams ask you for advice. Choose the best-fitting solution for each!

```quiz required
? A university student is writing a mobile app that stores their notes on the phone, even without internet. What do you suggest?
+ SQLite
- Oracle Database
- a Cassandra cluster
- a managed SQL Server
! Embedded, serverless, a single file on the phone.

? A medium-sized web shop's orders, stock and invoices: accuracy is needed, many complex queries, a small team, a tight budget.
- Redis
+ PostgreSQL (possibly as a managed service)
- Neo4j
- Oracle Database
! Open, ACID, strong SQL, no licence fee.

? A bank that has used Oracle for decades relies on many built-in enterprise features and has its own Oracle experts. What's the most sensible in the short term?
+ stay with Oracle, and examine the possibility of moving in a planned way
- move to MongoDB immediately
- put everything into Redis
- switch to SQLite
! Moving is risky and expensive; the decision should be preceded by thorough analysis.

? A real-time leaderboard for an online game: many thousands of score updates per second, the top 100 always needed, lightning fast.
- SQLite
+ Redis (sorted set)
- Neo4j
- an archive object store
! In memory, with a sorted set the leaderboard is instant.

? A start-up's traffic is unpredictable: sometimes there are barely any visitors for days, sometimes it suddenly grows tenfold after a campaign. They have little operations experience. What kind of hosting do you suggest?
- their own server in the office
+ a serverless managed database
- a big, fixed-size rented server
! They pay per use, and scaling is automatic.
```
