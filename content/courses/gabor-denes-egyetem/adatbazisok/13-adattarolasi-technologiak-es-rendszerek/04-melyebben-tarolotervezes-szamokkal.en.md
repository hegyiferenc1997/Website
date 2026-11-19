---
title: Deeper – Designing Storage with Numbers
summary: Sizing a database server's storage step by step – forecasting data growth, choosing a RAID level based on capacity, write penalty and rebuild time, IOPS calculation, backup window and retention space (grandfather–father–son scheme), and the solution that fits the RPO/RTO targets – with SQL calculators.
minutes: 40
---

## What you will learn in this lesson

- how to **estimate** how much storage you'll need in 3 years,
- how to choose a **RAID level** based not only on capacity but also on **write performance** and **rebuild risk**,
- what the **write penalty** is, and how to calculate IOPS with it,
- how long a **backup** and a **restore** take, and how much space backups need,
- how to match a **solution** to RPO and RTO targets.

The calculations below are simplified, but this is exactly how a systems engineer thinks when requesting a quote for a server.

## The task

A university student records system's database is **800 GB** today and grows by **35%** a year. At peak times (course registration) **3,000 reads** and **1,000 writes** per second hit the disks. The university requires: at most **15 minutes** of data may be lost (RPO), and after a failure the system must be back within **1 hour** (RTO).

## Step 1 – capacity 3 years ahead

Growth works like **compound interest**: every year it grows by 35% of the previous year's size.

size(after n years) = 800 GB · 1.35ⁿ

```sql run
-- Growth forecast per year
SELECT year, ROUND(800 * POWER(1.35, year)) AS size_gb
FROM generate_series(0, 5) AS year;
```

In 3 years it's about **1,968 GB**. Add to that:

- **indexes and log** (WAL): about 30–50% of the data size → let's count +40%;
- **free space**: never fill a disk above 70–80% (performance degrades, maintenance needs space).

Required usable capacity ≈ 1968 · 1.4 / 0.75 ≈ **3,700 GB**, rounded to **4 TB**.

## Step 2 – IOPS and the write penalty

An **IOPS** is one read or write operation per second. RAID levels **multiply writes**, because the redundancy has to be updated too:

| RAID        | How many physical writes per logical write? | Why?                                      |
| ----------- | ------------------------------------------- | ----------------------------------------- |
| RAID 0      | 1                                           | no redundancy                             |
| RAID 1 / 10 | 2                                           | both mirrors must be written              |
| RAID 5      | 4                                           | read old data + old parity, write new data + new parity |
| RAID 6      | 6                                           | the same with two parities                |

Physical load on the disks: **reads + writes · penalty**.

```sql run
-- Physical IOPS at peak load (3000 reads + 1000 writes / s)
SELECT raid, penalty, 3000 + 1000 * penalty AS physical_iops
FROM (VALUES ('RAID 10', 2), ('RAID 5', 4), ('RAID 6', 6)) AS t(raid, penalty);
```

The same load means 5,000 physical IOPS on RAID 10, but **9,000** on RAID 6! If one disk can handle about 200 IOPS (HDD) or 50,000 (SSD):

- with HDDs, RAID 10 would need 5000 / 200 = **25 disks** – that's a lot;
- with SSDs, even 2–4 disks are plenty for speed – here **capacity** decides.

**Lesson:** for a write-heavy database, the write penalty of RAID 5/6 is a serious drawback. That's why **RAID 10** is the usual recommendation for databases.

## Step 3 – the risk of rebuilding

When a disk fails, RAID **rebuilds** its contents onto a new disk from the other disks' data. During this time:

- the system is **slower** (the disks are busy with the rebuild too),
- with RAID 5 there is **no spare**: if a second disk fails now (or a read error occurs), **all data is lost**.

**Numeric example:** rewriting a 16 TB HDD at 150 MB/s: 16,000,000 MB / 150 MB/s ≈ 107,000 s ≈ **30 hours** – under load even several days. A RAID 5 array is unprotected for that long. That's why for large disks **RAID 6** or **RAID 10** is recommended instead of RAID 5. SSDs rebuild faster, but it still matters.

### Comparison for our case (4 TB usable, with 1.92 TB SSDs)

```sql run
-- How many 1.92 TB SSDs are needed for 4 TB usable, per level?
SELECT raid,
       disks AS number_of_disks,
       ROUND(usable_formula, 2) AS usable_tb,
       tolerance AS survives_disk_failures
FROM (VALUES
  ('RAID 10', 6, 6 / 2.0 * 1.92, '1 (1 per pair)'),
  ('RAID 5',  4, (4 - 1) * 1.92, '1'),
  ('RAID 6',  5, (5 - 2) * 1.92, '2')
) AS t(raid, disks, usable_formula, tolerance);
```

RAID 10 needs two more disks, but gives the best write performance and the fastest rebuild – for a write-intensive student records system that's the right choice.

## Step 4 – backup: window, space, restore

### Backup window

Backup time = amount of data / throughput. 2 TB of data at 400 MB/s:

2,000,000 MB / 400 MB/s = 5,000 s ≈ **1 hour 23 minutes**.

If the backup has to run between 2 and 4 am (backup window), it fits. At 5 TB it doesn't – then come **incremental** backups (only the changes), or **continuous** backups of the running database (base backup + WAL archiving).

### Retention: the grandfather–father–son (GFS) scheme

A proven retention scheme:

- **son:** daily incremental backup, kept for 7 days;
- **father:** weekly full backup, kept for 4 weeks;
- **grandfather:** monthly full backup, kept for 12 months.

```sql run
-- How much space do the backups need? (full backup 2 TB, one daily increment 2% = 0.04 TB)
SELECT 'daily increment (7)' AS type, 7 * 0.04 AS tb
UNION ALL SELECT 'weekly full (4)', 4 * 2.0
UNION ALL SELECT 'monthly full (12)', 12 * 2.0
UNION ALL SELECT 'TOTAL', 7 * 0.04 + 4 * 2.0 + 12 * 2.0;
```

About **32 TB** of backup storage for 2 TB of data! (With compression and deduplication a fraction of this may suffice – but the order of magnitude is instructive.) And per the 3-2-1 rule, one copy should be at **another site**.

### Restore: the often-forgotten half

Restoring is typically **slower** than backing up: files must be copied back, indexes rebuilt, the log replayed. If copying back 2 TB takes 1.5 hours, an RTO of 1 hour **can't be met** from backups alone!

**Golden rule:** a backup you've **never test-restored** is just a hope, not a backup.

## Step 5 – RPO and RTO → solution

| Target                  | Nightly backup only | Backup + WAL archiving (PITR)  | Synchronous replica with automatic failover |
| ----------------------- | ------------------- | ------------------------------ | ------------------------------------------- |
| RPO (max. data loss)    | up to 24 hours      | a few minutes                  | ≈ 0                                         |
| RTO (recovery time)     | hours               | hours (restore + replay)       | seconds–minutes                             |
| Cost                    | low                 | medium                         | high (second server, network)               |

Our case: RPO = 15 minutes, RTO = 1 hour. PITR meets the RPO, but the restore takes 1.5 hours – not the RTO. Solution: a **replica** (a second server that continuously follows the first) for fast failover **and** backup + WAL archiving against logical errors (e.g. an accidental `DELETE`) – because the replica copies the faulty delete instantly too!

**Analogy:** a replica is like a spare key in your pocket (you get in quickly if you lose the first); a backup is like a photo of your flat's furnishings (if burglars take something, you know what was there).

## Summary

- **Capacity:** compound growth (size · (1 + r)ⁿ) + indexes and log + 25–30% free space.
- **IOPS:** physical load = reads + writes · penalty (RAID 10: 2, RAID 5: 4, RAID 6: 6).
- **Rebuild:** can take days with large disks; RAID 5 is unprotected meanwhile → RAID 6 or 10.
- **Backup:** window = size / speed; GFS retention; restores must also be measured and tested.
- **RPO/RTO:** backup → PITR → replica; a replica doesn't replace backups.

## Exercise

Calculate! (You can type decimals with a point or a comma.)

```quiz required
? What is the usable capacity in TB of a RAID 5 array of 4 disks of 4 TB each?
= 12
! RAID 5: (n − 1) · C, because one disk's worth of space holds parity.

? What is the usable capacity in TB of a RAID 6 array of 6 disks of 8 TB each?
= 32
! RAID 6: (n − 2) · C.

? An application performs 2000 reads and 500 writes per second. How many physical IOPS hit the disks with RAID 5 (write penalty: 4)?
= 4000
! Reads + writes · penalty = 2000 + 500 · 4.

? How many physical IOPS is the same load with RAID 10 (write penalty: 2)?
= 3000
! 2000 + 500 · 2.

? How many seconds does it take to back up 2 TB (= 2,000,000 MB) of data at 200 MB/s?
= 10000
= 10,000
! Time = amount of data / speed.

? The only backup runs every night at 1:00, and the log (WAL) is not archived. The next day at 17:00 the disk dies. At most how many hours of data are lost?
= 16
! The last backup was at 1:00; 16 hours passed between 1:00 and 17:00.

? We have a synchronous replica. Someone accidentally runs a DELETE without WHERE. What saves us?
- the replica, because it's on another server
+ the backup (and the WAL archive), from which the state before the delete can be restored
- RAID 10, because it mirrors the data
! The replica and RAID copy the faulty delete instantly too – only backups protect against logical errors.
```
