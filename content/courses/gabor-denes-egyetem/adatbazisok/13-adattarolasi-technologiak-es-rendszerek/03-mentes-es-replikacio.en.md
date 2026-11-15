---
title: Backup, Replication and Recovery
summary: Full, incremental and differential backups, the 3-2-1 rule, logical and physical backups (pg_dump, base backup + WAL), point-in-time recovery, RPO and RTO, plus synchronous and asynchronous replication and failover.
minutes: 28
---

## What you will learn

- which **backup types** exist, and what the **3-2-1 rule** is,
- the difference between **logical** and **physical** backups,
- what **RPO** and **RTO** mean,
- how **replication** works, and how it differs from backups.

## Why back up?

Data can be lost in many ways: disk failure, a badly written `DELETE` without a `WHERE`, a software bug, ransomware, a fire in the data centre. RAID (lesson 1) only protects against disk failure. A **backup** is an **independent** copy of an earlier state of the data that you can restore from.

> Golden rule: **a backup is worth as much as the restore.** You only find out on the day of disaster that a never-tested backup is useless. Restoring has to be practised regularly!

## Backup types

| Type                  | What does it save?                                  | Backup      | Restore                                   |
| --------------------- | --------------------------------------------------- | ----------- | ----------------------------------------- |
| **Full**              | everything                                          | slow, large | simple: only this one is needed           |
| **Incremental**       | what changed since the **last backup of any kind**  | fast, small | the full + **all** incrementals in order  |
| **Differential**      | what changed since the **last full** backup         | medium, grows day by day | the full + **the latest** differential |

Example: a full backup on Sunday, and from Monday an extra backup every day. On Thursday disaster strikes:

```text
          Sun      Mon      Tue      Wed      Thu
 full     [████]
 incr.             [▒]      [▒]      [▒]           → restore: Sun + Mon + Tue + Wed (4 backups)
 diff.             [▒]      [▒▒]     [▒▒▒]         → restore: Sun + Wed (2 backups)
```

## The 3-2-1 rule

- **3** copies of the data (production + 2 backups),
- on **2** different media (e.g. disk and cloud object storage),
- **1** copy **at another site** (offsite) – so a fire or flood can't take them all.

Today it's often extended: also keep an **immutable** or offline copy that even ransomware can't encrypt or delete.

## Logical and physical backups

**Logical backup**: writes out the contents of the database as SQL statements or in a special format. In PostgreSQL, `pg_dump`:

```text
pg_dump --format=custom --file=webshop.dump webshop      (backup)
pg_restore --dbname=webshop_new webshop.dump             (restore)
```

- Pro: portable (to another version, another machine), individual tables can be restored.
- Con: slow for a large database, and it only captures the moment of the backup.

**Physical backup**: copies the database's **files** (pages, topic 9). In PostgreSQL, `pg_basebackup` makes a **base backup**, and alongside it we continuously **archive the WAL** (the log).

## Point-in-time recovery (PITR)

The base backup + the archived WAL together give something very useful: you can restore to **any point in time**. The restore starts from the base backup and replays the log **exactly up to** the moment we ask for.

```text
 Sunday 02:00            Thursday 14:31      14:32
 [base backup] ─── WAL ──── WAL ──── WAL ────┤ ⚠ someone: DELETE FROM orders;
                                             ↑
                          restore up to: 14:31:59
```

So we can go back to the moment before an accidental deletion, and almost nothing is lost. This is called **PITR** (_Point-In-Time Recovery_).

## RPO and RTO

Two questions to decide together with the company's management:

- **RPO** (_Recovery Point Objective_): **how much data** may we lose at most? Measured in time: "at most 15 minutes of data may be lost".
- **RTO** (_Recovery Time Objective_): **how quickly** must the system work again? "At most 1 hour of downtime."

```text
     last backup              disaster                   working again
  ────────●─────────────────────⚡─────────────────────────●──────►
          │◄──── RPO: this ─────►│◄─────── RTO: this ──────►│
             much data is lost       long the system is down
```

Example: if there's only a backup at 2 a.m. and the server burns down at 6 p.m., **16 hours** of data are lost. If that's too much, you have to back up more often, archive the WAL continuously, or replicate. The smaller the RPO and RTO, the more expensive the solution.

## Replication

With **replication**, one or more **secondary** servers (_replica_, _standby_) continuously follow the changes of the **primary** server. In PostgreSQL, the primary sends the WAL across and the secondaries replay it (_streaming replication_).

| Kind             | How does it work?                                                    | Pro / con                                         |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| **Synchronous**  | `COMMIT` is only done when the secondary has received the log too    | no data lost (RPO ≈ 0), but slower writes         |
| **Asynchronous** | `COMMIT` is done immediately, the log goes across afterwards         | fast, but if the primary crashes the last few seconds may be lost |

What is replication good for?

- **High availability**: if the primary fails, a secondary **takes over** its role (_failover_) – within minutes or seconds, with a small RTO.
- **Spreading read load**: reports and searches can run on the secondary server.
- **Geographic distribution**: there's a fresh copy in another data centre too.

> Important: **replication isn't a backup either!** An accidental `DROP TABLE` reaches the replica within milliseconds. Replication protects against outages, backups (and PITR) against data loss – together they give real safety.

## Summary

- Full, incremental (since the last backup of any kind), differential (since the last full).
- 3-2-1: three copies, two media, one at another site; plus an immutable copy.
- Logical (`pg_dump`) and physical backups (base backup + WAL archive → PITR).
- RPO = how much data may be lost; RTO = how long the system may be down.
- Replication (synchronous/asynchronous) for availability; it doesn't replace backups.

## The lesson's exercise

```quiz required
? A full backup is made on Sunday, and from Monday to Saturday an incremental one every day. On Friday, after the backup, disaster strikes. How many backups are needed for the restore?
= 6
! The full + the Monday, Tuesday, Wednesday, Thursday and Friday incrementals: 1 + 5.

? Same situation, but the daily backups are differential. How many backups are needed for the restore?
= 2
! The full + the latest (Friday) differential.

? A system is backed up once a day, at 2:00 a.m. At 6:00 p.m. (18:00) the disk fails. At most how many hours of data are lost?
= 16
! From 2:00 to 18:00.

? What does RTO mean?
- how much data we may lose at most
+ how quickly the system has to work again
- how many backup copies are needed
- how often to replicate
! Recovery Time Objective.

? A colleague accidentally runs `DROP TABLE orders;`. The asynchronous replica follows within seconds. How can you recover with the least data loss?
- by switching to the replica (failover)
+ with point-in-time recovery (base backup + WAL up to the moment before the drop)
- with the RAID mirror disk
- you can't, the data is lost for good
! The replica copied the drop too; PITR goes back to the moment before it.
```
