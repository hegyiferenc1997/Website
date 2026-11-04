---
title: NoSQL and the Rules of Data Management
summary: Document, key–value, graph and wide-column databases; data quality, transactions, backups, GDPR.
minutes: 16
---

## What you will learn

- what **NoSQL** databases exist and when they beat relational ones,
- what a **transaction** is and what **ACID** means,
- the rules of data management: **data quality**, **backups**, **GDPR**.

## NoSQL

**NoSQL** (“not only SQL”) databases are not table-based and offer a more flexible structure or greater scalability.

| Type            | How does it store?           | Example   | Good for                              |
| --------------- | ---------------------------- | --------- | ------------------------------------- |
| **document**    | in JSON-like documents       | MongoDB   | data with varying structure, web apps |
| **key–value**   | a value for a key, in memory | Redis     | cache, sessions                       |
| **graph**       | vertices and edges           | Neo4j     | social networks, recommendations      |
| **wide-column** | huge, distributed tables     | Cassandra | massive write load, time series       |

```json
{
  "neptun": "ABC123",
  "name": "Anna Kiss",
  "courses": ["Fundamentals of Computer Science", "Mathematics"],
  "contact": { "email": "anna@example.com" }
}
```

There is no “better”: relational databases are strong in **consistency** and complex queries; NoSQL in **flexibility** and **horizontal scaling** (spread over many servers). Many systems use both.

## Transactions and ACID

A **transaction** is a group of operations that runs **either entirely or not at all**. In a transfer, taking the money from one account and crediting the other must succeed together.

| Letter | Meaning     | In short                                       |
| ------ | ----------- | ---------------------------------------------- |
| **A**  | Atomicity   | all or nothing                                 |
| **C**  | Consistency | the rules (keys, constraints) always hold      |
| **I**  | Isolation   | parallel transactions don't disturb each other |
| **D**  | Durability  | a committed change survives a power cut        |

## Rules of data management

**Data quality:** bad data leads to bad decisions (“garbage in, garbage out”). Validate input (format, required fields), avoid duplicates, and keep the data up to date.

**Backups and access:** regular, tested backups (the 3-2-1 rule), and only those whose work needs a piece of data should access it.

**GDPR** (the EU General Data Protection Regulation, since 2018) governs the handling of **personal data** (name, e-mail, IP address, photo…). Its main principles:

- a **legal basis** is needed for processing (e.g. consent, contract),
- **purpose limitation** and **data minimisation**: only the necessary data, only for the stated purpose,
- **storage limitation**: don't keep it longer than needed,
- the data subject's **rights**: access, rectification, **erasure** (“right to be forgotten”), portability,
- a data breach must be reported to the authority **within 72 hours** (in Hungary to the NAIH).

## Summary

- NoSQL: document (MongoDB), key–value (Redis), graph (Neo4j), wide-column (Cassandra).
- Transaction: all or nothing; ACID = atomicity, consistency, isolation, durability.
- Data management: data quality, backups, access rights; GDPR: legal basis, minimisation, right to erasure, 72-hour reporting.

## Exercise

```quiz required
? What type of database is MongoDB?
- relational
+ document
- graph
- key–value
! It stores JSON-like documents.

? Which ACID property means a transaction is “all or nothing”?
+ atomicity
- consistency
- isolation
- durability
! Atomicity.

? Within how many hours must a data breach be reported under the GDPR?
= 72
! In Hungary to the NAIH.

? Which database type fits the friend connections of a social network best?
- key–value
- wide-column
+ graph
- spreadsheet
! People are vertices, friendships are edges.
```
