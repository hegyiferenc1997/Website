---
title: Practice – Data Storage
summary: Review questions about disks, RAID, storage architectures and backups, then a case study: a storage and backup plan for a web shop's database, with calculation questions.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. Why does almost every production database run on SSDs today?</summary>

Because databases do many small, random reads and writes (index lookups, changing single pages, WAL writes). At this an SSD is orders of magnitude faster: much higher IOPS and much lower latency.

</details>

<details>
<summary>2. What's the difference between RAID 5 and RAID 10 from a database's point of view?</summary>

RAID 5 uses capacity better (only one disk's worth goes on parity), but every write has to calculate and write parity, which slows down many small writes. RAID 10 uses half the capacity, but writing is simple mirroring, which is why it's often recommended for databases.

</details>

<details>
<summary>3. Why aren't RAID and replication backups?</summary>

Because both immediately and faithfully copy wrong operations too: an accidental deletion, a software bug or ransomware encryption. A backup is an independent copy of an earlier state that you can restore from.

</details>

<details>
<summary>4. What do we gain by continuously archiving the WAL?</summary>

Together with the base backup, we can restore to any point in time (PITR), so the RPO drops to minutes or seconds, and even the moment before an accidental deletion can be restored.

</details>

<details>
<summary>5. When would you choose synchronous replication over asynchronous?</summary>

When not a single committed transaction may be lost (e.g. a financial system), and it's acceptable that writes are somewhat slower because `COMMIT` has to wait for the secondary server.

</details>

## Case study: the web shop's storage and backup plan

A web shop's database is 1.5 TB, and orders arrive continuously. Management's expectation: **at most 5 minutes** of data may be lost, and after a server failure the system must work again **within 15 minutes**.

```quiz required
? We build a RAID 6 array from six 1 TB SSDs. How many TB is the usable capacity?
= 4
! (n − 2) × C = 4 × 1 TB.

? Does the 1.5 TB database fit on a RAID 10 array built from four 1 TB disks?
+ yes, because the usable capacity is 2 TB
- no, because the usable capacity is 1 TB
- no, because the usable capacity is 0.5 TB
! RAID 10: half the capacity, 4 / 2 = 2 TB.

? Which of management's expectations is the RPO?
+ at most 5 minutes of data may be lost
- the system must work again within 15 minutes
! RPO = how much data; RTO = how much time.

? Which solution meets the 5-minute RPO if a disk or server is lost entirely?
- one full backup a day, at night
- an hourly incremental backup
+ a base backup + continuous WAL archiving to another site
- RAID 1 mirroring in the same server
! With continuous WAL archiving only the last moments may be lost.

? What helps most to reach the 15-minute RTO after a server failure?
- moving backups to the archive storage class
+ a replica that quickly takes over the primary's role on failure
- differential backups instead of incremental ones
- a bigger RAID 0 array
! Failover takes minutes; reloading a 1.5 TB backup may take longer.
```
