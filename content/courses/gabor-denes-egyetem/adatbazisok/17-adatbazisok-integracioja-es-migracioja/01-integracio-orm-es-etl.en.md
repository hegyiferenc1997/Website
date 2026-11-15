---
title: Integration – Drivers, ORMs and ETL
summary: How an application reaches the database (drivers, connection details, handling secrets), what an ORM is and its advantages and pitfalls, why an API layer beats every system touching the tables directly, and ETL, ELT and change data capture (CDC).
minutes: 25
---

## What you will learn

- how a program **connects** to the database,
- what an **ORM** is, when it helps and when it hurts,
- why it's worth putting an **API layer** in front of the database,
- what **ETL**, **ELT** and **change data capture** (CDC) are.

## Drivers and connection details

A program doesn't "speak" SQL directly over the network – it needs a **driver** that knows the database's protocol. There's one for every language: `psycopg` in Python, `pg` in Node.js, the JDBC driver in Java, `Npgsql` in .NET.

The details needed to connect are often combined into a single **connection string**:

```text
postgresql://webshop_app:********@db.example.com:5432/webshop?sslmode=verify-full
            └──── user ────┘ └pass─┘ └──── server ────┘ └port┘ └database┘ └ TLS required ┘
```

The security rules (topics 10 and 15) apply here too:

- the password should **never be in the source code** or the git repository – it should come from an environment variable or a secrets manager,
- the connection should be encrypted with **TLS**,
- the application should connect with its **own, restricted** role, not as a superuser,
- use a **connection pool** (topic 16).

## ORM – object-relational mapping

In programming languages we work with **objects** (instances of a `Student` class), in the database with **tables and rows**. An **ORM** (_Object-Relational Mapper_) connects the two: you can handle tables as classes and rows as objects, and the ORM generates the SQL.

Well-known ORMs: **SQLAlchemy** and the **Django ORM** (Python), **Prisma**, **Drizzle**, **TypeORM** (JavaScript/TypeScript), **Hibernate** (Java), **Entity Framework** (.NET).

```text
# With an ORM (Python, SQLAlchemy style):
students = session.query(Student).filter(Student.semester == 3).order_by(Student.name).all()

# What the ORM actually sends (parameterised!):
SELECT neptun, name, major, semester FROM students WHERE semester = $1 ORDER BY name
```

| Advantages                                                     | Pitfalls                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| less repetitive code, convenient to use                        | it hides the SQL: it's easy to write a slow query without noticing |
| queries are **parameterised** (protects against SQL injection) | the **N+1 problem** (topic 16) because of "lazy loading"           |
| type checking, autocompletion in the editor                    | complex reports and window functions often need raw SQL anyway     |
| often comes with **migration management** (lesson 2)           | if you don't understand what happens underneath, debugging is hard |

> Tip: feel free to use an ORM, but **know SQL** – and look at the queries it generates now and then (most ORMs can log them).

## An API layer: not everyone should touch the tables

If at a company the web shop, the warehouse program, accounting and the mobile app **all directly** write to and read from the same database, chaos soon follows: renaming a column breaks four systems, and nobody knows who changes what.

The better solution: an **API layer** (e.g. a REST or GraphQL service) goes in front of the database, and the other systems reach the data **only through it**.

```text
   [web shop]  [mobile app]  [warehouse]
        \           |           /
         ▼          ▼          ▼
       [ API layer: rules, authorization, logging ]
                    │
                    ▼
               [ database ]
```

- Business rules and authorization checks are **in one place**.
- The internal schema can change as long as the API stays the same.
- Access can be logged and limited (e.g. rate limiting).

## ETL, ELT and change data capture

Data often has to be moved between systems: for example from the operational (OLTP) database to an analytical data warehouse (topic 18).

- **ETL** (_Extract, Transform, Load_): **extract** from the source → **transform** in an intermediate place (cleaning, merging, types) → **load** into the target.
- **ELT** (_Extract, Load, Transform_): the raw data first goes into the target system (e.g. a cloud data warehouse), and is transformed **there** with SQL – with today's powerful data warehouses this is more common.

ETL is traditionally **batch**: e.g. it copies the day's data every night. If fresher data is needed, **change data capture** (_CDC_) comes in: it continuously reads the changes (inserts, updates, deletes) from the source database's log (in PostgreSQL, the WAL, topic 9) and forwards them in near real time – e.g. with the **Debezium** tool into a **Kafka** message queue.

```text
  [ OLTP database ] ──WAL──► [ CDC: Debezium ] ──► [ Kafka ] ──► [ data warehouse, search, cache ]
```

## Summary

- Driver + connection details; no secrets in the code, TLS, a restricted role, a connection pool.
- ORM: convenient and parameterises, but watch out for N+1, and know SQL.
- API layer: other systems don't touch the tables directly.
- ETL / ELT: moving data in batches; CDC: continuously forwarding changes from the log.

## The lesson's exercise

```quiz required
? Where should the database password go in a web application?
- into the source code, in a constant
- into the git repository, in a README file
+ into an environment variable or a secrets manager
- into the connection string, in the middle of the code
! A secret should never go into the source code or version control.

? What is one of an ORM's biggest pitfalls in terms of performance?
+ because of lazy loading, N+1 queries can arise unnoticed
- it can't send parameterised queries
- it only works with SQLite
- it runs every query twice
! A separate query for every item of a list.

? Four internal systems write to and read from the same database directly. What's the main risk?
- the database will be too fast
+ a schema change can break several systems, and it's hard to track who changes what
- the database can't accept more connections
- backups don't work
! An API layer gathers the rules and access in one place.

? What's the difference between ETL and ELT?
- ETL only works with NoSQL databases
+ ETL transforms the data before loading, ELT in the target system, after loading
- ELT can't transform data
- there's no difference, only the name
! Extract-Transform-Load vs. Extract-Load-Transform.

? Where does a PostgreSQL-based CDC solution read the changes from?
- by scanning the tables fully every hour
+ from the database's log (WAL)
- from the users' browsers
- from the backups
! The WAL contains every change, in order.
```
