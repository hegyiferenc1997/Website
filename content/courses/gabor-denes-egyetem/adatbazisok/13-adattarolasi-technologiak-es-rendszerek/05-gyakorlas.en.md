---
title: Practice – Data Storage
summary: Review questions about disks, RAID, storage architectures and backups, then a case study: a storage and backup plan for a web shop's database, with calculation questions.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. Each one has a solution – try it yourself first, and only then look!

Here we use SQL as a "calculator" for storage decisions. In every exercise, estimate the result in your head first, and only then run it!

<details>
<summary>Creating the storage arrays table (SQL)</summary>

```sql setup
-- Disk arrays: RAID level, number of disks, size of one disk in TB.
CREATE TABLE arrays (
  name     VARCHAR(20) PRIMARY KEY,
  raid     VARCHAR(8) NOT NULL,
  disks    INT NOT NULL,
  disk_tb  NUMERIC(5, 1) NOT NULL
);
INSERT INTO arrays VALUES
  ('fast',     'RAID0',  2, 2),
  ('mirror',   'RAID1',  2, 4),
  ('database', 'RAID10', 8, 2),
  ('archive',  'RAID5',  5, 8),
  ('backup',   'RAID6',  6, 8);
```

</details>

**1.** **Usable capacity.** Compute the **usable capacity** of every array in TB with `CASE`! Reminder: RAID0 = n·c; RAID1 and RAID10 = n/2·c (every piece of data twice); RAID5 = (n−1)·c; RAID6 = (n−2)·c. (Name, RAID, usable TB; by name.)

```sql starter
SELECT name, raid, disks, disk_tb
FROM arrays;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, raid,
       CASE raid
         WHEN 'RAID0'  THEN disks * disk_tb
         WHEN 'RAID1'  THEN disks / 2 * disk_tb       -- mirroring: half is usable
         WHEN 'RAID10' THEN disks / 2 * disk_tb
         WHEN 'RAID5'  THEN (disks - 1) * disk_tb     -- one disk's worth of parity
         WHEN 'RAID6'  THEN (disks - 2) * disk_tb     -- two disks' worth of parity
       END AS usable_tb
FROM arrays
ORDER BY name;
```

</details>

**2.** **Efficiency.** With the previous formula, compute the **storage efficiency** in percent (usable / raw · 100, rounded to an integer), and sort the arrays by efficiency descending, then by name!

```sql starter
SELECT name, raid, disks * disk_tb AS raw_tb
FROM arrays;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT name, raid,
       ROUND(100 * CASE raid
         WHEN 'RAID0'  THEN disks
         WHEN 'RAID1'  THEN disks / 2.0
         WHEN 'RAID10' THEN disks / 2.0
         WHEN 'RAID5'  THEN disks - 1
         WHEN 'RAID6'  THEN disks - 2
       END / disks) AS efficiency
FROM arrays
ORDER BY efficiency DESC, name;
```

</details>

**3.** **When does it fill up?** A database is **500 GB** now and grows **4%** a month. In which month does it first exceed **750 GB**? Generate the months (`generate_series(0, 24)`), compute the size (`500 * 1.04 ^ month`), and take the first month where it's greater than 750!

```sql starter
SELECT month, 500 * 1.04 ^ month AS size_gb
FROM generate_series(0, 24) AS month;
```

<details>
<summary>Solution</summary>

```sql solution
SELECT MIN(month) AS first_month
FROM generate_series(0, 24) AS month
WHERE 500 * 1.04 ^ month > 750;          -- 1.04^11 ≈ 1.54 → in month 11
```

</details>

**4.** **Backup window.** A **2 TB** backup has to be transferred over different networks. How many hours does it take (2 decimals)? 1 TB = 8000 Gbit, time = data / speed. (Network, hours; by hours ascending.)

```sql starter
CREATE TABLE networks (name VARCHAR(20), gbit_s NUMERIC(6, 2));
INSERT INTO networks VALUES ('100 Mbit', 0.1), ('1 Gbit', 1), ('10 Gbit', 10);

SELECT name, gbit_s FROM networks;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE networks (name VARCHAR(20), gbit_s NUMERIC(6, 2));
INSERT INTO networks VALUES ('100 Mbit', 0.1), ('1 Gbit', 1), ('10 Gbit', 10);

SELECT name, ROUND(2 * 8000 / gbit_s / 3600, 2) AS hours   -- Gbit / (Gbit/s) = s, then converted to hours
FROM networks
ORDER BY hours;
```

</details>

**5.** **Which storage tier?** Monthly prices per TB: SSD €40, HDD €12, tape €2. **20 TB** of data must be stored, but the application tolerates at most **20 ms** latency. Compute the monthly cost per tier, and mark whether it **meets** the latency requirement (by cost ascending)!

```sql starter
CREATE TABLE tiers (name VARCHAR(10), eur_per_tb INT, latency_ms NUMERIC(10, 2));
INSERT INTO tiers VALUES ('SSD', 40, 0.1), ('HDD', 12, 8), ('tape', 2, 60000);

SELECT * FROM tiers;
```

<details>
<summary>Solution</summary>

```sql solution
CREATE TABLE tiers (name VARCHAR(10), eur_per_tb INT, latency_ms NUMERIC(10, 2));
INSERT INTO tiers VALUES ('SSD', 40, 0.1), ('HDD', 12, 8), ('tape', 2, 60000);

SELECT name, 20 * eur_per_tb AS monthly_eur, latency_ms <= 20 AS meets
FROM tiers
ORDER BY monthly_eur;
```

</details>
