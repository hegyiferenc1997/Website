---
title: HDD, SSD and RAID
summary: How hard disks and SSDs work, what IOPS, throughput and latency mean, why databases love SSDs, and the RAID levels (0, 1, 5, 6, 10): fault tolerance, performance and calculating usable capacity.
minutes: 25
---

## What you will learn

- how a **hard disk** (HDD) and an **SSD** work,
- what **IOPS**, **throughput** and **latency** mean,
- what **RAID** is, and its most common levels,
- how to calculate the **usable capacity** of a RAID array.

## The hard disk (HDD)

Inside a hard disk, magnetic platters spin (typically at 7200 revolutions per minute), and a **read/write head** on a moving arm finds the data. For a random read:

1. the head has to move to the right track (**seek time**, about 4–9 ms),
2. you have to wait for the wanted sector to rotate under it (**rotational latency**, about 4 ms on average).

> Analogy: like a record player where you have to move the needle to the right groove for every song. Listening to an album in order is fast – jumping around, moving the needle eats up the time.

That's why an HDD is **fast when reading sequentially** (hundreds of MB/s), but **slow at random access** (about 100–200 operations per second).

## The SSD

An SSD has no moving parts: data sits in **flash memory cells** and is accessed electronically. Random access is therefore **orders of magnitude faster**. **NVMe** SSDs connect directly to the PCIe bus and are even faster.

Its limits: it's more expensive (per GB), and the cells can only take a finite number of writes (the controller handles this by spreading writes evenly, _wear leveling_). That's why large, rarely read archives often still live on HDDs or tape today.

## Three performance metrics

| Metric         | Meaning                                   | HDD (approx.) | NVMe SSD (approx.)  |
| -------------- | ----------------------------------------- | ------------- | ------------------- |
| **IOPS**       | random operations per second              | 100–200       | 100,000 – 1,000,000 |
| **Throughput** | data read/written sequentially per second | 150–250 MB/s  | 3000–7000 MB/s      |
| **Latency**    | the time of a single operation            | 5–10 ms       | 0.02–0.1 ms         |

For an OLTP database (many small, random reads and writes: index lookups, updating single rows) **IOPS** and **latency** matter most – that's why almost every production database runs on SSDs today. A data warehouse that scans huge tables needs **throughput** more.

## RAID – several disks together

**RAID** (_Redundant Array of Independent Disks_) combines several physical disks into one logical disk so that it's

- **faster** (reads from several disks in parallel),
- and/or **fault tolerant** (if a disk fails, no data is lost).

### RAID 0 – striping

It cuts data into pieces and writes them to the disks alternately.

```text
  disk 1: [A1] [A3] [A5]
  disk 2: [A2] [A4] [A6]
```

- Fast (two disks work in parallel), the full capacity is usable.
- **No fault tolerance**: if any disk dies, **all** data is lost. Not for production databases!

### RAID 1 – mirroring

All data goes onto both disks.

```text
  disk 1: [A1] [A2] [A3]
  disk 2: [A1] [A2] [A3]
```

- Survives the failure of one disk, can even be faster for reads.
- **Half** of the capacity is usable.

### RAID 5 – striping with parity

Data is striped across the disks, and every stripe has a **parity** (a checksum, XOR) that moves from disk to disk. If a disk fails, the missing data can be **recalculated** from the others and the parity.

```text
  disk 1: [A1] [B1] [Cp]
  disk 2: [A2] [Bp] [C1]
  disk 3: [Ap] [B2] [C2]      p = parity
```

- Needs at least 3 disks; survives the failure of **one** disk.
- Usable capacity: **(n − 1)** disks' worth.
- Writes are slower (the parity has to be updated too), and with big disks a rebuild takes hours or days – a second failure meanwhile is fatal.

### RAID 6 – double parity

Like RAID 5, but with **two** parities: it survives **two** disks failing at the same time. Usable capacity: **(n − 2)** disks' worth, at least 4 disks needed.

### RAID 10 (1+0) – mirrored pairs, striped

It mirrors the disks in pairs (RAID 1), and stripes across the pairs (RAID 0).

- Fast writes and reads, good fault tolerance (one disk per pair may fail).
- **Half** of the capacity is usable, at least 4 disks needed.
- For **databases** this is often the recommended level, because writes need no parity calculation.

### Summary table (n disks, each with capacity C)

| Level   | Min. disks | Usable capacity | How many disks may fail? | Characteristic               |
| ------- | ---------- | --------------- | ------------------------ | ---------------------------- |
| RAID 0  | 2          | n × C           | 0                        | fast but dangerous           |
| RAID 1  | 2          | C (half)        | 1                        | simple, safe                 |
| RAID 5  | 3          | (n − 1) × C     | 1                        | good capacity, slower writes |
| RAID 6  | 4          | (n − 2) × C     | 2                        | for large arrays             |
| RAID 10 | 4          | n × C / 2       | 1 per pair               | databases' favourite         |

> Important: **RAID is not a backup!** If someone accidentally drops a table, or ransomware encrypts the data, RAID faithfully "mirrors" that onto every disk. RAID protects against disk failure, a backup against data loss (lesson 3).

## Summary

- HDD: moving head, fast sequentially, slow at random; SSD: no moving parts, very high IOPS.
- For OLTP, IOPS and latency matter; for a data warehouse, throughput.
- RAID 0 is fast but has no fault tolerance; RAID 1 mirrors; RAID 5/6 use parity; RAID 10 stripes mirrored pairs.
- RAID doesn't replace backups.

## The lesson's exercise

```quiz required
? Why is a hard disk slow at random access?
- because the flash cells wear out
+ because the read/write head has to move for every operation, and you have to wait for the platter to rotate
- because a hard disk can only write sequentially
- because a hard disk has no controller
! Seek time + rotational latency.

? We build a RAID 5 array from four 2 TB disks. How many TB is the usable capacity?
= 6
! (n − 1) × C = 3 × 2 TB.

? We build a RAID 10 array from the same four 2 TB disks. How many TB is the usable capacity?
= 4
! Half of the capacity: 8 / 2.

? Which RAID level provides no fault tolerance at all?
+ RAID 0
- RAID 1
- RAID 5
- RAID 10
! One disk failing = all data lost.

? A colleague accidentally drops the orders table on a RAID 1 array. What happens?
- RAID automatically restores it from the mirror disk
+ the drop happens on both disks, so it has to be restored from a backup
- it's deleted from only one of the disks
! RAID is not a backup: it faithfully mirrors the wrong operation too.
```
