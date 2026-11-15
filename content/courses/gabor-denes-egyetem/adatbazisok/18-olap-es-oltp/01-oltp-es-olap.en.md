---
title: OLTP and OLAP – Two Worlds
summary: The difference between databases serving daily operations (OLTP) and those serving analysis (OLAP): workload, queries, schema, storage; why we analyse in a separate system, and what a data warehouse, a data lake and a lakehouse are.
minutes: 22
---

## What you will learn

- what **OLTP** and **OLAP** are, and how they differ,
- why we don't run analyses on the production database,
- what a **data warehouse**, a **data lake** and a **lakehouse** are.

## Two very different jobs

Imagine two "users" of a web shop:

- **Vera the customer** logs in, puts a mouse in the cart, pays. This needs a few rows read and written, in **milliseconds** – and thousands are doing the same at once.
- **Ernie the analyst** asks: "How did revenue develop by category and region over the last two years, per quarter?" This needs **millions** of rows read and summed – but rarely, and it may take a few seconds.

Two kinds of systems were born for the two jobs:

| Aspect            | **OLTP** (_Online Transaction Processing_)                     | **OLAP** (_Online Analytical Processing_)         |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| Goal              | daily operations: orders, bookings, recording grades           | analysis, reports, decision support               |
| Typical operation | many short transactions: `INSERT`, `UPDATE`, few-row `SELECT`s | few but huge `SELECT`s with aggregation           |
| One query touches | a few rows                                                     | millions of rows, but few columns                 |
| Users             | many thousands (customers, applications)                       | few (analysts, managers, reports)                 |
| Data              | the **current** state, always fresh                            | **historical** data, going back years             |
| Schema            | normalised (3NF, topic 6)                                      | denormalised, star schema (lesson 2)              |
| Storage           | row-based (topic 9)                                            | often column-based, with strong compression       |
| Key metric        | transactions per second, response time                         | query time on large data                          |
| Examples          | PostgreSQL, MySQL, SQL Server, Oracle                          | Snowflake, BigQuery, Redshift, ClickHouse, DuckDB |

## Why don't we analyse on the production database?

For a small system you can – but as the data grows, three problems come up:

1. **Performance**: one of Ernie's huge aggregate queries takes away the disk and CPU power, and Vera's cart slows down. Customers don't wait.
2. **Structure**: on a normalised schema a report needs ten tables joined; analysis needs a more convenient, "flat" structure.
3. **History and multiple sources**: OLTP stores the present (today's price of a product), analysis needs the past too. And data comes from several systems (web shop, warehouse, accounting, marketing).

That's why for analysis we copy the data into a **separate system** (ETL/ELT or CDC, topic 17).

## Data warehouse, data lake, lakehouse

- **Data warehouse**: historical data collected from several sources, **cleaned and uniformly structured**, designed specifically for analysis (star schema). Here everything has a precise meaning: "revenue" means the same everywhere.
- **Data lake**: a store for **raw** data in almost any form (CSV, JSON, logs, images), in cheap object storage (topic 13). Flexible, but if it isn't kept in order, it becomes a "data swamp".
- **Lakehouse**: a blend of the two: data lives in cheap object storage (e.g. in Parquet files), but with a table format (e.g. Delta Lake, Apache Iceberg) that allows transactions and SQL queries too.

```text
  [web shop DB] ─┐
  [warehouse DB]─┼─► ETL / ELT ─► [ data warehouse ] ─► reports, dashboards, analyses
  [accounting]  ─┘                     ▲
  [logs, clicks] ─► [ data lake ] ─────┘
```

A smaller slice of the data warehouse tailored to one area (e.g. sales only) is called a **data mart**.

## HTAP – both in one?

There are also **HTAP** (_Hybrid Transactional/Analytical Processing_) systems that try to serve both workloads on the same data (e.g. keeping a row-based and a column-based copy in sync). These are still for special cases – in most places the two worlds live in separate systems.

## Summary

- OLTP: many small transactions, fresh data, normalised schema, row-based storage.
- OLAP: few big aggregating queries, historical data, denormalised schema, often column-based storage.
- Analysis runs in a separate system so it doesn't slow down daily operations.
- Data warehouse: clean, uniform, ready for analysis; data lake: raw and cheap; lakehouse: a blend of the two.

## The lesson's exercise

```quiz required
? Which is a typical OLTP operation?
+ a customer places an order, and the stock decreases
- analysing the last five years' revenue by region
- preparing a quarterly management report
- aggregating millions of clicks per product
! A short transaction writing a few rows.

? Why isn't it a good idea to run big analytical queries on the production web shop database?
- because SQL can't aggregate
+ because they'd take resources away from customers' transactions and slow down daily operations
- because there's no data in the production database
- because an OLTP database can only write
! That's why we copy the data into a separate analytical system.

? What kind of storage is typical of OLAP systems?
- row-based, without compression
+ column-based, with strong compression
- in-memory key-value storage only
! Few columns, lots of rows: only the needed columns have to be read.

? What's the difference between a data warehouse and a data lake?
+ a data warehouse stores cleaned, uniformly structured data for analysis, a data lake raw data in almost any form
- a data lake is always more expensive
- a data warehouse can only store images
- there's no difference
! A data lake is cheap and flexible, but it has to be kept in order.

? Which schema is more typical of OLTP databases?
+ normalised (e.g. 3NF)
- star schema
- a single table containing all the data
! Avoiding duplication matters because of frequent writes.
```
