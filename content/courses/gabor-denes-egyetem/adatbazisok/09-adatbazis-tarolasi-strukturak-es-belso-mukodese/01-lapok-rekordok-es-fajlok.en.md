---
title: Pages, Records and Files
summary: The speed gap between memory and disk, the page (block) as the unit of reading, the heap file and how records are placed, the row identifier (ctid), storing large values (TOAST), and row versus column storage.
minutes: 20
---

## What you will learn

- why the **disk** is the slow part, and how the DBMS adapts to it,
- what a **page** (block) is, and how records are laid out in it,
- the difference between **row** and **column** storage.

## Why does this matter?

So far we've looked at tables through "logical" eyes. Now we peek under the hood – this is the **internal level** of the three-level architecture. You don't have to memorise every detail, but if you understand why something is fast or slow, you'll design much better databases.

## Memory and disk

| Storage         | Access time (order of magnitude) | If 1 ns were 1 second |
| --------------- | -------------------------------- | --------------------- |
| CPU cache       | ~1 ns                            | 1 second              |
| RAM             | ~100 ns                          | about 2 minutes       |
| NVMe SSD        | ~20,000 ns (20 µs)               | about 6 hours         |
| Hard disk (HDD) | ~5,000,000 ns (5 ms)             | about 2 months        |

A database is durable (it lives on disk), but the disk is **orders of magnitude** slower than memory. So every trick a DBMS uses is about touching the disk **as rarely as possible**.

## The page (block) – the unit of reading

A DBMS doesn't read and write byte by byte, but in **pages** (_blocks_). In PostgreSQL a page is **8 KB**. Even if you ask for a single row, the whole page is brought into memory – like photocopying a whole page of a book instead of a single word.

The layout of a page (simplified):

```text
 ┌──────────────────────────────────────────────┐
 │ header (page info)                           │
 │ pointers: [1]→  [2]→  [3]→  …                 │  ← grows downward from the top
 │                                              │
 │               (free space)                   │
 │                                              │
 │  … [record 3] [record 2] [record 1]          │  ← grows upward from the end
 └──────────────────────────────────────────────┘
```

The pointers and the records grow towards each other from two directions, with the free space in the middle. When the page is full, the next row goes onto a new page.

## Heap file and row identifier

A table is a sequence of pages in a file. Without an index the rows are **not sorted**: a new row goes wherever there is room – that's why it's called a **heap file**. That's why you need `ORDER BY` in a query when you want an order!

Every row has a physical address: **which page, and which slot on it**. In PostgreSQL this is the hidden `ctid` column, and this is exactly what an index stores (key → ctid).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT ctid, neptun, name FROM students;
```

`(0,1)` means: page 0, slot 1. Now update a row and look again:

```sql run
UPDATE students SET semester = 4 WHERE neptun = 'ABC123';
SELECT ctid, neptun, name, semester FROM students;
```

Anna's row has moved to a **new place**! When updating, PostgreSQL doesn't overwrite the old row but creates a new version (this is MVCC, lesson 3).

```sql run
SELECT pg_size_pretty(pg_relation_size('students')) AS table_size,
       pg_size_pretty(pg_total_relation_size('students')) AS with_indexes;
```

## Large values: TOAST

What if a row is bigger than a page (e.g. a long text or JSON)? PostgreSQL **compresses** large fields, and if they're still large, chops them into pieces in a separate "side" table (this is called **TOAST** – _The Oversized-Attribute Storage Technique_). Only a reference stays in the main row. That's why scanning a table doesn't slow down just because some column contains long texts.

## Row or column storage?

```text
 Row-based (PostgreSQL, MySQL):       Column-based (ClickHouse, Redshift):
 page 1: [ABC123, Anna Kiss, 3, …]    neptun:   [ABC123, BCD234, CDE345, …]
         [BCD234, Bela Nagy, 1, …]    name:     [Anna Kiss, Bela Nagy, …]
         [CDE345, Cili Toth, 3, …]    semester: [3, 1, 3, 5, 1, 3, …]
```

- **Row-based**: all the data of a row sits together. Ideal when you read and write **whole rows** (the data of one order) – this is **OLTP**.
- **Column-based**: all values of a column sit together. Ideal when you read **few columns but a huge number of rows** ("what is the average of all sales?") – this is **OLAP** (topic 18). On top of that, values of the same type and similar content **compress** very well.

## Summary

- The disk is orders of magnitude slower than memory → the goal is to reduce the number of disk operations.
- Page (PostgreSQL: 8 KB) = the unit of reading and writing.
- Heap file: unsorted rows; every row has a physical address (ctid), which the index stores.
- TOAST: large values compressed and stored separately.
- Row-based → OLTP, column-based → OLAP.

## The lesson's exercise

```quiz required
? How big is a page (block) in PostgreSQL?
- 512 bytes
- 1 KB
+ 8 KB
- 1 MB
! It's the basic unit of reading and writing.

? Roughly how many 100-byte rows fit on an 8192-byte page (ignore the header for now, round down)?
= 81
! 8192 / 100 = 81.92 → 81.

? On average 50 rows fit on a page of a 1,000,000-row table. How many pages does the table have?
= 20000
= 20,000
! 1,000,000 / 50.

? Why is the order of rows not guaranteed without `ORDER BY`?
+ because in a heap file rows go wherever there is room
- because the DBMS shuffles them randomly
- because the size of pages changes
- because SQL doesn't know about order
! What's more, a row may move to a new place when updated.

? Which storage layout is better if you compute the average of a single column over a billion rows?
- row-based
+ column-based
! Only that one column has to be read.
```
