---
title: Deeper – Counting in Pages: What Does a Query Cost?
summary: The I/O cost model step by step – full table scan, index lookup, random versus sequential reads, calculating the point where "the index loses", the cost of the three join algorithms (nested loop, hash join, merge join), external sorting, and observing buffer usage with EXPLAIN (ANALYZE, BUFFERS).
minutes: 40
---

## What you will learn in this lesson

- how to **estimate** a query's cost in page reads – as the optimiser does,
- why it matters whether we read **sequentially** or **jumping around**,
- how to calculate **when an index is slower** than a full table scan,
- how the three **join algorithms** work, and which wins when,
- how the DBMS sorts when the data **doesn't fit** in memory,
- how to see the actual **page reads** in PostgreSQL.

This lesson contains a lot of calculation – you don't need to memorise the formulas, the reasoning is what matters.

## Why count in pages?

The DBMS reads not rows but **pages** from disk (8 KB blocks in PostgreSQL). Reading a page from memory (the buffer) takes nanoseconds, from an SSD tenths of a millisecond, from an HDD as much as 5–10 milliseconds. Compared to this, CPU work (evaluating a row's condition) is negligible. So the first approximation of cost is: **how many pages must be read?**

**Analogy – borrowing from a library:** what matters isn't how many sentences you read, but how many books must be fetched from the stacks. Fetching a book is the slow part.

### Basic figures we calculate with

| Symbol  | Meaning                               | Example   |
| ------- | ------------------------------------- | --------- |
| N       | number of rows                        | 1,000,000 |
| R       | rows per page                         | 50        |
| P = N/R | number of pages                       | 20,000    |
| h       | height of the B+ tree (levels)        | 3         |
| t_s     | **sequential** read of one page (HDD) | ≈ 0.1 ms  |
| t_r     | **random** read of one page (HDD)     | ≈ 5 ms    |

Sequential reading is so much faster because the HDD's read head doesn't have to jump around, and the DBMS can request many consecutive pages at once. On an SSD the difference is smaller (about 2–4×), but it's still there.

## 1. Full table scan

Every page is read in order: **cost = P sequential reads.**

Example: 20,000 pages × 0.1 ms = **2 seconds** (on HDD). Independent of how many rows we're looking for – one or all of them.

## 2. Index lookup for one row

We descend the B+ tree from root to leaf (h pages), then read the page containing the row (1 page): **cost = h + 1 random reads.**

Example: (3 + 1) × 5 ms = **20 ms**. A hundred times faster than the full scan. (Actually even faster: the root and the upper level are almost always in the buffer.)

## 3. Index lookup for many rows – here's the trap

If the condition returns **k** rows and they're on **different pages** (in a heap file the rows aren't sorted by the indexed column), then: **cost ≈ h + k random reads.**

| k (matches) | Index cost         | Full scan            |
| ----------- | ------------------ | -------------------- |
| 10          | 13 × 5 ms = 65 ms  | 2 s                  |
| 100         | 103 × 5 ms ≈ 0.5 s | 2 s                  |
| 400         | 403 × 5 ms ≈ 2 s   | 2 s ← **break-even** |
| 5,000       | ≈ 25 s             | 2 s                  |

**The break-even point:** k · t_r ≈ P · t_s → k ≈ 20,000 × 0.1 / 5 = **400 rows**, which is just **0.04%** of the 1,000,000 rows! With more matches, the full table scan is faster on an HDD. (On an SSD the break-even is higher, a few percent – that's why the optimiser chooses indexes more boldly there.)

That's why PostgreSQL also has a **Bitmap Index Scan**: it first collects all affected page numbers from the index, **sorts** them, and then reads the pages in order – turning random reads partly into sequential ones.

## 4. The three join algorithms

Let's join the `customers` (C pages) and `orders` (O pages) tables. The DBMS chooses among three algorithms.

### a) Nested loop

```text
for each row c in customers:
    for each row o in orders:           ← with an index: only the matching ones
        if c.id = o.customer_id: output
```

- **Without an index:** reads the whole inner table for every outer row – catastrophic for large tables.
- **With an index on the inner table:** a quick index lookup for every outer row. With **few** outer rows this is the best (e.g. "orders of customer 42").

### b) Hash join

1. Builds an in-memory hash table from the **smaller** table (key → rows).
2. Reads through the larger table and looks up the partner of each row in the hash table.

**Cost ≈ C + O** (each table is read once). This wins when **large, unsorted** tables must be joined in full and the smaller one fits in memory.

**Analogy:** at a class party everyone has a number. Instead of comparing every guest with every other guest (nested loop), you write the numbers on a board (hash table), and everyone finds their partner at a glance.

### c) Merge join

1. **Sorts** both tables by the key (or they're already sorted, e.g. thanks to an index).
2. Like a zipper: walks through the two sorted lists simultaneously with two pointers.

**Cost ≈ C + O + (cost of sorting).** It wins when the data is **already sorted**, or the result must be sorted anyway.

| Algorithm   | When does it win?                               |
| ----------- | ----------------------------------------------- |
| Nested loop | few outer rows + an index on the inner table    |
| Hash join   | large tables, equality condition, unsorted data |
| Merge join  | already sorted input, or sorted output needed   |

## 5. Sorting when it doesn't fit in memory

If a 10 GB table must be sorted with 1 GB of memory, the DBMS performs an **external merge sort**:

1. **Runs:** reads 1 GB chunks, sorts them in memory and writes them to disk → 10 sorted runs.
2. **Merging:** reads the 10 runs simultaneously, always writing out the smallest element (like a zipper, but with 10 strands).

All data passes through the disk twice (in–out, then in–out): about **4 × P** page operations. That's why it helps a lot when an index already provides the sorted order (previous topic: `ORDER BY … LIMIT`). In PostgreSQL the `work_mem` setting determines how much memory a sort gets; if too little, `external merge` appears in the `EXPLAIN ANALYZE` output.

## 6. See it live: EXPLAIN (ANALYZE, BUFFERS)

<details>
<summary>Creating the web shop sample database (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
-- How many pages does the table have, and how many rows? (the optimiser's statistics)
ANALYZE orders;
SELECT relname, relpages AS pages, reltuples::BIGINT AS rows,
       ROUND(reltuples / NULLIF(relpages, 0)) AS rows_per_page
FROM pg_class
WHERE relname IN ('orders', 'order_items', 'customers');
```

The `BUFFERS` option shows how many pages the query read: `shared hit` = from the buffer (memory), `read` = from "disk".

```sql run
-- Full table scan: touches every page of orders
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF)
SELECT COUNT(*) FROM orders WHERE status = 'cancelled';
```

```sql run
-- Index lookup: touches only a few pages
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF)
SELECT * FROM orders WHERE order_id = 12345;
```

Compare the two `Buffers:` lines! The first reads every page of the table, the second only a few index pages and a single data page.

```sql run
-- A join: which algorithm does the optimiser choose?
ANALYZE;
EXPLAIN (COSTS OFF)
SELECT c.city, COUNT(*)
FROM orders o JOIN customers c ON c.customer_id = o.customer_id
GROUP BY c.city;
```

You'll probably see a `Hash Join`: two full tables must be joined, and the smaller one (`customers`) fits comfortably in memory.

```sql run
-- Orders of a single customer: here a nested loop is an option too
ANALYZE;
EXPLAIN (COSTS OFF)
SELECT o.* FROM customers c JOIN orders o ON o.customer_id = c.customer_id
WHERE c.customer_id = 42;
```

## Summary

- The first approximation of cost is the **number of pages read**; random reads are much more expensive than sequential ones.
- **Full scan** = P sequential reads; **index lookup** = h + k random reads.
- The **break-even point** where the index loses can be surprisingly low (a fraction of a percent of rows on HDD) – which is why the optimiser doesn't always use the index.
- **Nested loop** for few outer rows with an index, **hash join** for large unsorted tables, **merge join** for sorted input.
- Sorting that doesn't fit in memory uses **external merge**, with about 4 × P page operations.
- `EXPLAIN (ANALYZE, BUFFERS)` shows the actual page reads.

## Exercise

Calculate! A table has **2,000,000 rows**, **50 rows** fit on a page, and the page size is 8 KB.

```quiz required
? How many pages does the table have?
= 40000
= 40,000
! Number of pages = number of rows / rows per page = 2,000,000 / 50.

? The HDD's sequential read speed is 100 MB/s (calculate with 1 MB = 1000 KB). How many **seconds** does a full table scan take?
= 3.2
! 40,000 pages × 8 KB = 320,000 KB = 320 MB; 320 MB / (100 MB/s) = ?

? A node of the primary key's B+ tree can branch 400 ways. At least how many levels must the tree have to hold 2,000,000 keys?
= 3
! 400² = 160,000 is still too few, 400³ = 64,000,000 is enough.

? How many pages must be read to find a single row by primary key (the tree levels + the data page)?
= 4
! 1 page on every level of the tree (3), plus the data page holding the row (1).

? A condition returns 1000 rows, each on a different page. A random page read takes 5 ms. Which is faster on an HDD?
- the index lookup (about 1000 × 5 ms)
+ the full table scan (about 3.2 s)
- exactly the same
! 1000 × 5 ms = 5 s, which is more than the 3.2 s full scan.

? Two large, unsorted tables must be joined in full with an equality condition, and the smaller fits in memory. Which algorithm is most likely?
- nested loop without an index
+ hash join
- merge join without prior sorting
! A hash join reads each table once: it builds a hash table from the smaller one and scans the larger one.
```
