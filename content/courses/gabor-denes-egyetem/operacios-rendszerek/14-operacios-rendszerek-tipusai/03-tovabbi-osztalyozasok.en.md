---
title: Further Classifications
summary: Single- and multi-user, single- and multitasking, batch, interactive, network, distributed and cloud systems, open and closed source.
minutes: 20
---

## What you will learn

- by which **criteria** operating systems can be classified,
- what a **network**, a **distributed** and a **cloud-based** system is,
- the difference between **open** and **closed** source and "free software".

## Classification criteria

| Criterion             | Types                                                      | Example                              |
| --------------------- | ---------------------------------------------------------- | ------------------------------------ |
| number of users       | **single-user** / **multi-user**                           | MS-DOS / Linux, Windows              |
| tasks running at once | **single-tasking** / **multitasking**                      | MS-DOS / every modern OS             |
| mode of processing    | **batch** / **interactive (time-sharing)** / **real-time** | nightly payroll / desktop / airbag   |
| processors            | single-processor / **multiprocessor** (SMP)                | old PC / today's multi-core machines |
| place of use          | desktop, server, mobile, embedded                          | see the previous lessons             |
| kernel structure      | monolithic, microkernel, hybrid                            | Linux, QNX, Windows                  |
| source code           | **open** / **closed**                                      | Linux, FreeBSD / Windows, iOS        |

Note: "multi-user" does not only mean that several people sit at the machine at once – it also means the OS **separates** users (own files, permissions, processes). Windows 11 and Ubuntu on a laptop are multi-user systems too.

## Network, distributed and cloud systems

- **Network OS**: machines run their own OS but **share** their resources over the network (file sharing, printers, central user management). The user **knows** which machine they access (e.g. `\\fileserver\shared`). Example: Windows Server + Active Directory.
- **Distributed OS / distributed system**: many machines **look like a single system** to the user – they need not know where the computation runs or where the data is. Rare in pure form (research systems), but the principle lives on in practice: **Kubernetes** clusters, distributed file systems (HDFS, Ceph), database clusters.
- **Cloud-based systems**: resources (machines, storage, services) are provided by a provider **on demand**, over the internet. The virtualization topic covers this in detail (IaaS, PaaS, SaaS).

## Open and closed source

- **Closed source** (_proprietary_): the source code is the vendor's secret; the user buys a licence to **use** it (Windows, macOS, iOS).
- **Open source**: the source code is available and can be studied, modified and distributed under the licence's terms (Linux, FreeBSD, the base of Android).
- **Free software** (Richard Stallman, GNU, 1983): the emphasis is on the user's **four freedoms** – to run, study, modify and distribute. "Free" here means **freedom**, not zero price.

Examples of licences:

| Licence          | Type                       | Essence                                                       | Example                             |
| ---------------- | -------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| **GPL**          | "copyleft"                 | modified versions must also be released under GPL with source | Linux kernel                        |
| **BSD**, **MIT** | permissive                 | usable for almost anything, even in closed products           | FreeBSD (macOS partly builds on it) |
| **Apache 2.0**   | permissive + patent clause |                                                               | most of Android                     |

## Summary

- Criteria: number of users and tasks, mode of processing, processors, place of use, kernel structure, licence.
- Network OS: shared resources, but you know which machine; distributed: many machines look like one system; cloud: resources on demand.
- Open vs. closed source; GPL (copyleft) vs. BSD/MIT (permissive).

## Lesson exercise

```quiz required
? Which was a single-user, single-tasking system?
+ MS-DOS
- Windows 11
- Ubuntu
- macOS
! One program ran at a time, without users.

? In which type of system do many machines look like a single system to the user?
- network OS
+ distributed system
- embedded system
- batch system
! The user does not need to know where the computation runs.

? What does a "copyleft" licence (e.g. GPL) mean?
- The program cannot be modified.
+ Modified versions must also be released under the same licence, with source code.
- The program may only be used for education.
- The program may be freely built into closed products without source code.
! Permissive licences (BSD, MIT) do not require this.

? Who started the GNU project and the free software movement?
= Richard Stallman
= Stallman
! In 1983.

? Which mode of processing is typical of a payroll run every night?
+ batch
- interactive
- hard real-time
- soft real-time
! No user interaction, the jobs run in sequence.
```
