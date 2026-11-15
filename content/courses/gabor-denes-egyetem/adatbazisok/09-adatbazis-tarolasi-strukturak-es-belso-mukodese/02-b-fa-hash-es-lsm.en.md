---
title: B+ Tree, Hash Index and LSM Tree
summary: How an index is built inside: the levels of a B+ tree and why 3–4 steps are enough for millions of rows, the hash index (equality only), and the write-optimised LSM tree used by many NoSQL systems.
minutes: 25
---

## What you will learn

- what a **B+ tree** looks like inside, and why it's so fast,
- how to calculate the **height** of a B+ tree,
- what a **hash index** is good for, and what it isn't,
- what an **LSM tree** is, and why write-heavy systems love it.

## Recap: what does an index do?

You saw it in topic 7: an index is like the index at the back of a book – next to each key there's a "page number" (the physical address of the row, the `ctid`). Now let's see **how this index is arranged** so that a search takes only a few steps.

## The B+ tree

A **B+ tree** is a balanced, "wide and short" tree. Each node is **one page** (8 KB), so **hundreds of keys** fit into a single node.

```text
                       ┌───────────────┐
 root                  │   30  |  60   │
                       └──┬─────┬────┬─┘
             ┌────────────┘     │    └─────────────┐
       ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐
 inner │ 10  |  20 │      │ 40  |  50 │      │ 70  |  80 │
       └┬────┬────┬┘      └┬────┬────┬┘      └┬────┬────┬┘
        ▼    ▼    ▼        ▼    ▼    ▼        ▼    ▼    ▼
 leaves:  [1..9]⇄[10..19]⇄[20..29]⇄[30..39]⇄ … ⇄[80..99]
          (key → row address)      leaves chained, in order
```

Its most important properties:

- **Balanced**: every leaf is the same distance from the root, so every search takes the same number of steps.
- **Data lives only in the leaves** (key → row address); inner nodes are just "signposts".
- **The leaves are chained together**, in order. That's why **range searches** (`BETWEEN`, `>`, `<`) and sorting are fast: you find the starting point, then just walk along the chain.
- On insert, if a node fills up, it **splits** in two and the middle key moves up. So the tree always stays balanced and grows **upward**.

> Analogy: a big warehouse. At the entrance (root) a sign says: "A–H: left aisle". At the end of the aisle another sign: "A–C: shelf 1". On the shelf (leaf) is the box. After reading a few signs you can find anything.

## How tall is a B+ tree?

If you can step on from a node in **f** directions (this is the **fan-out**), then:

| Number of levels | Reachable keys (f = 200)    |
| ---------------- | --------------------------- |
| 1                | 200                         |
| 2                | 200² = 40,000               |
| 3                | 200³ = 8,000,000            |
| 4                | 200⁴ = 1,600,000,000        |

So even **100 million** rows need only **4 levels**, i.e. 4 page reads – and the upper levels are almost always in memory, so in practice often just 1–2 disk reads are needed. Without an index this could mean reading hundreds of thousands of pages!

As a formula: the number of levels ≈ the smallest **h** for which **fʰ ≥ N** (N is the number of keys).

## The hash index

A **hash index** uses a hash function to compute directly from the key which "bucket" to look in – like a cloakroom, where your ticket number tells you instantly which hook your coat is on.

- **Pro**: for equality (`WHERE email = '…'`) on average **one step**.
- **Con**: hashing scrambles the order, so it **can't be used for ranges or sorting** (`>`, `BETWEEN`, `ORDER BY`).

In practice a B+ tree is almost always good enough for equality too, which is why PostgreSQL's default index is the B-tree (`CREATE INDEX` = B-tree). You can ask for a hash index like this:

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
CREATE INDEX customers_email_hash ON customers USING hash (email);
EXPLAIN SELECT * FROM customers WHERE email = 'customer42@example.com';
```

The `customers_email_hash` index appears in the plan. Now try it with a range – the hash index doesn't help here:

```sql run
CREATE INDEX customers_email_hash ON customers USING hash (email);
EXPLAIN SELECT * FROM customers WHERE email > 'customer42@example.com';
```

## The LSM tree – when there are lots of writes

A B+ tree writes each key into "its place" on every insert, which means many **scattered** writes on disk. In a system receiving a hundred thousand events per second (logs, sensors, messages), this becomes a bottleneck.

An **LSM tree** (_Log-Structured Merge tree_) thinks differently:

```text
 write ──► [ memory: sorted table (memtable) ]
                     │ when full: written out in one go
                     ▼
 disk:   [ small file ] [ small file ] [ small file ]   ← level 0
                     │ merged in the background (compaction)
                     ▼
         [      larger sorted file      ]               ← level 1
         [          even larger file          ]         ← level 2
```

1. A write first goes into **memory** (and, to be safe, into a log).
2. When the memtable is full, it's written out **in one go, sequentially** into a sorted file – sequential writing is the disk's favourite operation.
3. In the background, the system **merges** small files into bigger ones (_compaction_) and throws away old versions.

- **Pro**: very fast writes.
- **Con**: reads may have to look in several files (Bloom filters speed this up), and the background merging uses resources.

LSM trees are used by **Cassandra**, **RocksDB**, **LevelDB** and **ScyllaDB**, for example – more on this in the NoSQL topic (11).

## B+ tree, hash or LSM?

| Aspect            | B+ tree                | Hash index             | LSM tree                  |
| ----------------- | ---------------------- | ---------------------- | ------------------------- |
| Equality          | fast (a few steps)     | very fast (~1 step)    | good                      |
| Range, sorting    | fast (chained leaves)  | not supported          | good                      |
| Writes            | medium                 | medium                 | very fast                 |
| Typical home      | relational DBMSs       | in-memory tables       | write-heavy NoSQL systems |

## Summary

- A B+ tree is balanced, wide and short; data only in the leaves, leaves chained → good for ranges too.
- Height: the smallest h with fʰ ≥ N; a few levels are enough even for a table with hundreds of millions of rows.
- A hash index is good only for equality.
- An LSM tree collects in memory, writes sequentially and merges in the background → optimised for writes.

## The lesson's exercise

```quiz required
? A B+ tree has a fan-out of 100. At least how many levels are needed for 1,000,000 keys?
= 3
! 100³ = 1,000,000.

? In the same tree (f = 100), at most how many keys can be reached with 2 levels?
= 10000
= 10,000
! 100².

? Why is a range search like `BETWEEN` fast in a B+ tree?
- because every node of the tree is in memory
+ because the leaves are chained together in order
- because the hash function sorts the keys
- because the root stores the range
! You find the starting point, then walk along the chain.

? Which query can a hash index NOT serve?
- WHERE email = 'a@b.com'
+ WHERE price BETWEEN 1000 AND 5000
! Hashing scrambles the order.

? Which data structure suits a logging system receiving a hundred thousand events per second best?
- hash index
- B+ tree
+ LSM tree
! It collects in memory and writes to disk sequentially, in one go.
```
