---
title: What Is an Index, and Why Is It Fast?
summary: Full table scan versus index, the idea of binary search and the B-tree, how many steps a million rows need, and what an index costs.
minutes: 18
---

## What you will learn

- why a search **without** an index is slow,
- how an **index** speeds it up (binary search, B-tree),
- how much we **gain** and what it **costs**.

## A book's index

You are looking for the word "normalisation" in an 800-page textbook. You have two options:

1. Leaf through **all 800 pages** (you'll surely find it, but it takes ages).
2. Look at the **index** at the back: the word is there alphabetically, with the page numbers (152, 307). Two steps and you're there.

A database **index** is exactly such an index: a separate, **sorted** structure storing a column's values and the **location** of the matching rows.

## Without an index: full table scan

Without an index the DBMS has to look at every row: this is a **full table scan** (in PostgreSQL _Seq Scan_). With 20,000 orders it's still fast, but with 200 million rows and a thousand requests per second it isn't.

## Binary search – the secret of speed

An index is **sorted**, so it can be searched with **binary search**: look at the middle element and decide whether the value is before or after it. Every step **halves** what's left – like the "I'm thinking of a number between 1 and 100" game.

| Rows          | Full scan (worst case) | Binary search (about log₂ n steps) |
| ------------- | ---------------------- | ---------------------------------- |
| 1,000         | 1,000                  | 10                                 |
| 1,000,000     | 1,000,000              | 20                                 |
| 1,000,000,000 | 1,000,000,000          | 30                                 |

A thousand times more data → only **10 more steps**. That's why a well-indexed table finds something among a billion rows in milliseconds.

## B-tree: the structure of an index

The default index of most DBMSs is the **B-tree** (more precisely B+ tree). It's a balanced, very "flat" tree: a node holds not two but **hundreds** of keys (the size of a disk page, e.g. 8 KB). So the tree is just 3–4 levels high even for a billion rows.

```text
                        [ 500 | 1000 ]                    ← root
              ┌────────────┼────────────┐
         [100|200|…]   [600|700|…]   [1100|…]            ← inner nodes
          │                │
   [ 1..99 → rows ]   [ 600..699 → rows ]  …              ← leaves: key + row location,
                                                            linked together (for ranges)
```

The leaves are **linked together**, so a B-tree is good not only for equality (`= 42`) but also for **ranges** (`BETWEEN`, `<`, `>`) and **sorting** (`ORDER BY`). Topic 9 covers the details.

## What does an index cost?

An index isn't free:

- **Storage**: an index can be as big as the table itself.
- **Slower writes**: every `INSERT`, `UPDATE`, `DELETE` updates the index too. Ten indexes on a table = every insert modifies eleven structures.
- **Maintenance**: indexes can "bloat" over time and sometimes need rebuilding.

So we **don't** index every column, only where queries really search, sort or join.

## What the DBMS indexes automatically

- the **primary key** (always),
- columns with a **`UNIQUE`** constraint (it checks uniqueness with an index too).

PostgreSQL does **not** automatically index **foreign keys** – even though joins often use them. You have to do that yourself (next lesson).

## Summary

- Without an index: full table scan, every row is examined.
- An index is a sorted structure (B-tree); binary search needs ~log₂ n steps.
- Cost: storage and slower writes – add one only where queries use it.
- PK and UNIQUE are indexed automatically, foreign keys aren't.

## Lesson exercise

```quiz required
? What is it called when the DBMS examines every row of a table?
- index scan
+ full table scan
- binary search
- normalisation
! In PostgreSQL query plans it appears as Seq Scan.

? About how many steps does binary search need in a sorted list of 1,000,000 elements?
= 20
! 2^20 ≈ 1,048,576.

? About how many steps for 1,000,000,000 (a billion) elements?
= 30
! 2^30 ≈ 1.07 billion.

? What is the **downside** of an index?
- it slows down every SELECT
+ it slows down writes (INSERT, UPDATE, DELETE) and takes up storage
- it removes the primary key
- it only works on text columns
! Every change must update the index too.

? Which does PostgreSQL index **automatically**?
+ the primary key
- every foreign key
- every text column
- the most queried column
! The PK and UNIQUE columns yes, foreign keys no.
```
