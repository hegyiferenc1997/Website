---
title: Practice – Database System Basics
summary: Review questions and a summary worksheet on databases, the DBMS, the three-level architecture and database types.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. Why is it a bad idea for every department of a company to keep customers in its own Excel file?</summary>

Because the same data appears in several places (**redundancy**), so sooner or later the copies contradict each other (**inconsistency**). It is also hard to merge the files for a query, several people can't work safely at the same time, and you can't finely control who sees what.

</details>

<details>
<summary>2. What is the difference between a database and a DBMS?</summary>

The **database** is the related, persistently stored data itself. The **DBMS** is the program that manages it: stores, queries, protects and backs it up, and organises multi-user access. Analogy: the book collection and the librarian.

</details>

<details>
<summary>3. What do we gain from the three-level architecture?</summary>

**Data independence.** Physical storage (indexes, disks) can change without rewriting programs, and the logical schema can grow while old views and applications keep working. Also, every user group sees only the view meant for it.

</details>

<details>
<summary>4. Why did the relational model replace the network model?</summary>

In the network model programs had to step along pointers, so queries were complex and any structural change affected the programs. In the relational model relationships come from shared values, querying is declarative (SQL), and the DBMS decides how to execute it.

</details>

<details>
<summary>5. Give a task that needs an OLTP system and one that needs an OLAP system!</summary>

**OLTP**: a web shop's orders, bank transfers, course registration in Neptun – many short, concurrent transactions. **OLAP**: "How did the average per course change over the past five years?" – few queries, but each scans a huge amount of data.

</details>

## Summary worksheet

A starting team is building a **food delivery app**. Help them decide!

```quiz required
? Orders and payments must be stored transactionally, with strict rules. Which database do you suggest?
+ relational (e.g. PostgreSQL)
- graph (e.g. Neo4j)
- time series (e.g. InfluxDB)
- no database is needed
! Transactions and integrity: relational.

? Couriers' GPS positions update every second; only the latest value is needed, very fast. What fits best?
- hierarchical database
+ in-memory key-value store (e.g. Redis)
- an Excel file
- OLAP data warehouse
! Fast, simple key → value, in memory.

? The app shows favourite restaurants on the phone even offline. Which database goes on the phone?
- client-server Oracle
+ embedded SQLite
- distributed Cassandra
- NewSQL
! An embedded, single-file database.

? The developers add a new index to the orders table without touching the program code. Which principle makes this possible? (three words)
= physical data independence
= fizikai adatfüggetlenség
! The internal level changed; the conceptual and external ones didn't.

? Which SQL sublanguage does `ROLLBACK` (undoing an unfinished operation) belong to?
- DDL
- DML
- DCL
+ TCL
! Transaction Control Language.

? Analysts want monthly reports on orders going back years. Which processing mode is this?
- OLTP
+ OLAP
! Online Analytical Processing.
```
