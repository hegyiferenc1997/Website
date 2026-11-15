---
title: Buffer, Log and Recovery
summary: The buffer manager (buffer pool) and page replacement (LRU), the write-ahead log (WAL) and checkpoints, crash recovery, and multi-version concurrency control (MVCC) and VACUUM.
minutes: 25
---

## What you will learn

- what the **buffer manager** is, and how it decides which page stays in memory,
- how the DBMS guarantees **durability** if the power suddenly goes out (**WAL**, **checkpoint**),
- how many users can read and write at the same time without disturbing each other (**MVCC**),
- why cleaning up is needed (**VACUUM**).

## The buffer manager (buffer pool)

You know from the previous lessons: the disk is slow, so the DBMS keeps pages in memory. This memory area is the **buffer** (_buffer pool_, in PostgreSQL _shared buffers_).

```text
 query: "I need page 42"
        │
        ▼
 ┌──────────── buffer (memory) ─────────────┐
 │ [page 7] [page 42] [page 3] [page 99] […] │ ── is it there? → done at once (hit)
 └───────────────────────────────────────────┘
        │ not there (miss)
        ▼
 read it from disk, and if needed, evict an old page
```

- **Hit**: the page is already in memory – very fast.
- **Miss**: it has to be read from disk – slow.

In a well-tuned database **over 99%** of requests are hits. When the buffer is full, some page has to be evicted. The classic rule is **LRU** (_Least Recently Used_): evict the page that was used **longest ago** – like moving the book you haven't touched for the longest time from your shelf to the basement.

A page that has been modified but not yet written to disk is called a **dirty page**. It must be written out before it's evicted.

## The problem: what if the power goes out?

Changes first happen only on the pages in memory. If the power goes out after `COMMIT` but before the page is written, the contents of memory are lost. Yet the **D** in ACID (durability) promises: whatever got a `COMMIT` stays!

Writing every page immediately would be slow (scattered writes). The solution is the log.

## The write-ahead log (WAL)

The rule of the **WAL** (_Write-Ahead Log_) is simple:

> Before a modified page reaches the disk, **the description of the change** must be written to the log first – and `COMMIT` is only done when the log is on disk.

```text
 1. UPDATE ...              → the buffer page changes (becomes dirty)
 2. description of change   → goes into the WAL
 3. COMMIT                  → the WAL is written to disk (sequentially, fast!) → "done"
 4. later, at leisure       → the dirty page is also written to its place
```

Why is this faster? We write to the end of the log **sequentially** – the disk's favourite operation – and we can write the scattered pages later, in one batch.

> Analogy: a waiter doesn't run to the kitchen with every order, they write it in a notepad. If they drop the tray, the notepad tells them what needs to be made again.

## Checkpoint and recovery

If the log grew forever, after a crash the whole thing would have to be replayed. So from time to time the DBMS makes a **checkpoint**: it writes out all dirty pages and notes: "everything up to here is on disk".

During **recovery** after a crash, it:

1. finds the last checkpoint,
2. **replays** (_redo_) the changes in the log from there,
3. **does not apply** the effects of transactions that didn't reach `COMMIT` (as if they never happened).

```text
 ──────[checkpoint]──────T1 COMMIT──────T2 (no COMMIT)──── ⚡ power cut
       replays from here: T1 is kept    T2 is lost
```

The WAL is good for more: **replication** is built on it (the standby server receives and replays the log), and it lets you restore to a given **point in time** (_point-in-time recovery_, topic 13).

## MVCC – multi-version concurrency control

In lesson 1 you saw that an updated row moved to a **new place**. The reason is **MVCC** (_Multi-Version Concurrency Control_). When updating, PostgreSQL doesn't overwrite the row but creates a **new version**, and marks the old one as "expired". Every row version gets two hidden fields:

- **xmin**: which transaction created it,
- **xmax**: which transaction deleted or overwrote it (0 if it's still alive).

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT xmin, xmax, ctid, neptun, name, semester FROM students WHERE neptun = 'ABC123';
```

Now update the row in a transaction, and see which transaction's ID ends up in the new version:

```sql run
BEGIN;
SELECT txid_current() AS my_transaction;
UPDATE students SET semester = 4 WHERE neptun = 'ABC123';
SELECT xmin, xmax, ctid, neptun, name, semester FROM students WHERE neptun = 'ABC123';
COMMIT;
```

The `xmin` of the new version is your transaction's ID, and the `ctid` has changed too: this is a new row version.

Why is this good? Because every transaction sees a **snapshot**: the versions that were already final when it started. So:

- **readers don't wait for writers**, and writers don't wait for readers,
- a long report sees the same consistent state all the way through while others are writing.

> Analogy: the version history of a shared document. While you read yesterday's version, someone else can happily edit today's.

## VACUUM – cleaning up

The price of MVCC: old, "dead" row versions (_dead tuples_) take up space. Once nobody can see them anymore, **VACUUM** frees their space so new rows can go there. In PostgreSQL this is done automatically in the background by **autovacuum**, which also refreshes the statistics (`ANALYZE`) the optimiser needs.

If the cleanup doesn't happen (e.g. because of a transaction left open for days), the table "bloats": it gets bigger and slower even though it doesn't contain more live data.

## Summary

- Buffer: keeping pages in memory; a hit is fast, a miss is slow; page replacement e.g. by LRU.
- WAL: the log reaches the disk first, then the page; `COMMIT` is done when the log is written.
- Checkpoint: everything up to here is on disk; recovery replays the log from here.
- MVCC: an update creates a new row version (xmin, xmax); readers and writers don't block each other.
- VACUUM: freeing the space of dead row versions.

## The lesson's exercise

```quiz required
? What does the WAL rule mean?
- pages must be written immediately after every change
+ the description of the change must be written to the log first, and only then may the page reach the disk
- the log needs to be saved only once a week
- the log must be deleted after COMMIT
! Write-Ahead: the log goes first.

? 1000 page requests arrived at a buffer, and 990 of them were already in memory. What is the hit ratio in percent?
= 99
! 990 / 1000 = 0.99.

? Which page does the LRU strategy evict when the buffer is full?
- the one used most often
+ the one used longest ago
- the largest one
- a random one
! Least Recently Used.

? After a crash, what happens to a transaction that didn't reach COMMIT?
+ its effect is not kept
- recovery finishes it automatically
- it's half kept
! Atomicity: all or nothing.

? In PostgreSQL, what happens to the old row version after an UPDATE?
- it's overwritten immediately
+ it becomes a dead row version that VACUUM cleans up later
- it moves into the log and is deleted from there
! As long as an older snapshot may see it, it must stay.
```
