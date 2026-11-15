---
title: DAS, NAS, SAN and Object Storage
summary: How storage connects to the server: direct-attached storage (DAS), network-attached storage (NAS), storage area networks (SAN), plus object storage (e.g. Amazon S3) and cloud storage classes – and which one is for what around a database.
minutes: 22
---

## What you will learn

- the difference between **block**, **file** and **object** level storage,
- what **DAS**, **NAS** and **SAN** are,
- what **object storage** is, and what we use it for alongside databases,
- what cloud **storage classes** are.

## Three levels: block, file, object

| Level      | What does the server see?                                            | Example                                            |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------- |
| **Block**  | a "raw" disk with numbered blocks; it manages the file system itself | local SSD, SAN, cloud block storage (e.g. AWS EBS) |
| **File**   | a shared folder with files and directories                           | NAS (NFS, SMB share)                               |
| **Object** | "buckets" holding key → object (file + metadata), accessed over HTTP | Amazon S3, Azure Blob, Google Cloud Storage        |

Databases like **block-level** storage: they want to decide themselves what goes where on the disk (pages, WAL – topic 9), and they need very low latency.

## DAS – direct-attached storage

**DAS** (_Direct-Attached Storage_) is a disk built into the server or cabled directly to it.

- **Pro**: the fastest, lowest latency, simple, cheap.
- **Con**: only that one server can reach it; if the server goes down, the storage is unreachable too; hard to expand.

A smaller database server or a developer machine typically uses DAS (e.g. a built-in NVMe SSD).

## NAS – network-attached storage

A **NAS** (_Network-Attached Storage_) is a storage device on the network that provides **file sharing** (NFS, SMB). Many machines reach it at once, as if it were a shared network drive.

- **Pro**: easy sharing, common files, storing backups.
- **Con**: file-level access and the network mean higher latency – we usually do **not** put a production database's data files on a NAS (or only with very careful configuration).

Typical use: the target for **backups**, shared documents, media files.

## SAN – storage area network

A **SAN** (_Storage Area Network_) is a separate, high-speed network (Fibre Channel or iSCSI) over which servers get **block-level** storage from a central storage system. To the server, the area it gets from the SAN looks like a local disk.

- **Pro**: high performance, centrally managed and expandable; if a server fails, another server can take over its storage; snapshots and replication within the storage system.
- **Con**: expensive, and needs expertise.

Enterprise database servers classically run on a SAN. In the cloud, **block storage** (AWS EBS, Azure Managed Disk) plays the same role.

```text
  DAS:   [server]═[disk]                       directly

  NAS:   [server]─┐
         [server]─┼── LAN ── [NAS]             files, over the shared network
         [server]─┘

  SAN:   [server]═╗
         [server]═╬══ separate storage network ══ [storage system]   blocks
         [server]═╝
```

## Object storage

**Object storage** (e.g. **Amazon S3**) doesn't think in folders and blocks but in **objects**: every object is a file, a unique **key** (e.g. `backups/2026-11-15/webshop.dump`) and **metadata**. We access it over HTTP (`PUT`, `GET`, `DELETE`).

- **Pro**: practically unlimited size, very cheap, extremely durable (S3, for example, promises 99.999999999% – "eleven nines" – durability), reachable from anywhere.
- **Con**: higher latency, an object can't be modified "inside", only overwritten as a whole – not suitable for a database's live data files.

What is it good for alongside a database?

- **backups** and archiving the WAL (lesson 3),
- storing large files (images, PDFs) – the database only stores their key (path),
- **data lakes**: raw data for analysis (topic 18).

## Cloud storage classes

Cloud providers offer object storage in classes of different "temperatures":

| Class       | Access               | Price (storage) | For what?                          |
| ----------- | -------------------- | --------------- | ---------------------------------- |
| **Hot**     | immediate, frequent  | most expensive  | actively used files                |
| **Cool**    | immediate, rare      | cheaper         | last month's backups               |
| **Archive** | retrievable in hours | very cheap      | data kept for years, rarely needed |

With a **lifecycle policy**, objects can "cool down" automatically: e.g. a backup moves to the cool class after 30 days, to archive after 90 days, and is deleted after a year.

## Summary

- Block (databases' favourite), file (sharing), object (cheap, unlimited, HTTP).
- DAS: direct, fast, but belongs to one server; NAS: network file sharing; SAN: central block storage on a separate network.
- Object storage: for backups, large files, data lakes – not for live database files.
- Storage classes: hot, cool, archive; can be automated with lifecycle policies.

## The lesson's exercise

```quiz required
? What level of storage does a server see in an area it gets from a SAN?
+ block level, as if it were a local disk
- file level, a shared folder
- object level, over HTTP
! A SAN provides blocks, the server manages the file system.

? Which form of storage is best for keeping several years of backups cheaply?
- DAS
- SAN
+ object storage in the archive class
- the server's memory
! Very cheap, very durable; retrieval is slow, but rarely needed.

? Why don't we usually put a production database's data files into object storage?
- because object storage isn't durable
+ because latency is high, and an object can't be modified inside, only overwritten as a whole
- because object storage can only store images
- because object storage isn't reachable over the network
! A database does many small, random writes to its pages.

? What is a NAS's typical job in a database environment?
- storing the live data files with the lowest latency
+ the target for backups, storing shared files
- writing the WAL before COMMIT
! File-level sharing over the network.

? Where should a web shop's product images go, and what should we store of them in the database?
+ into object storage; in the database only their key (path)
- into a BYTEA column of the database, every image in full
- into the server's memory
! Keep the database small and fast; large files belong in object storage.
```
