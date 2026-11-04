---
title: What Is a Server?
summary: The client–server model, server types, physical, virtual and cloud servers, server hardware, RAID and redundancy.
minutes: 15
---

## What you will learn

- what a **server** is and how the **client–server** model works,
- what **services** servers provide,
- how **server hardware** differs, and what **RAID** is.

## The client–server model

A **server** is a computer (or program) that **provides a service** to other machines, the **clients**, over the network. Your browser is a client that sends requests; the web server answers. A server usually runs **around the clock**, without a monitor or keyboard, and is managed remotely.

| Server type          | What does it serve?                 | Example software              |
| -------------------- | ----------------------------------- | ----------------------------- |
| **web server**       | web pages, APIs                     | nginx, Apache, IIS            |
| **database server**  | storing and querying data           | PostgreSQL, MySQL, SQL Server |
| **file server**      | shared folders                      | Samba, Windows file sharing   |
| **mail server**      | sending and receiving e-mail        | Postfix, Exchange             |
| **DNS, DHCP server** | name resolution, address assignment | BIND, Windows Server          |
| **directory server** | users and permissions in one place  | Active Directory, LDAP        |

## Physical, virtual, cloud

- **Physical server** (bare metal): your own hardware in the company's server room or a rented rack space. Full control, but you also take care of the hardware.
- **Virtual machine** (VM): several isolated virtual servers run on one powerful physical machine (VMware, Hyper-V, Proxmox, KVM). Better utilisation, fast creation, snapshots.
- **Cloud server** (IaaS): a virtual machine rented from a provider (AWS EC2, Azure VM, Hetzner, DigitalOcean), in minutes, billed by the hour.
- **Container**: even lighter than a VM: one application with its dependencies, on a shared kernel (Docker) – see lesson 3.

## Server hardware

A server is not a “powerful PC” but a machine designed for **reliability**:

- **rack** form factor (mounted in a 19-inch cabinet, 1U = a 1.75-inch-high unit),
- **ECC memory**: detects and corrects memory errors,
- **redundant power supplies** and fans: if one fails, the other takes over,
- **remote management card** (iDRAC, iLO, IPMI): reachable even if the operating system has frozen,
- **RAID**: several disks together, for safety or speed.

| RAID    | How it works                          | On a disk failure     | Capacity (4 × 4 TB) |
| ------- | ------------------------------------- | --------------------- | ------------------- |
| RAID 0  | striping: data split across the disks | **all data is lost**  | 16 TB               |
| RAID 1  | mirroring: the same on two disks      | the mirror carries on | (with 2 disks) 4 TB |
| RAID 5  | striping + parity                     | 1 disk may fail       | 12 TB               |
| RAID 10 | mirrored pairs, striped               | 1 per pair may fail   | 8 TB                |

**RAID is not a backup!** If you accidentally delete a file, or ransomware encrypts it, RAID “faithfully” deletes or encrypts it on every disk at once.

## Summary

- Server = provides a service to clients over the network; web, database, file, mail, DNS servers.
- Physical, virtual, cloud servers and containers.
- Server hardware: rack, ECC, redundant power, remote management, RAID – but RAID is not a backup.

## Exercise

```quiz required
? What role does your browser play when you open a web page?
+ client
- server
- router
- DNS
! The client asks, the server serves.

? With which RAID level is **all data** lost if a single disk fails?
= RAID 0
= 0
! Striping without redundancy.

? What is the usable capacity in RAID 5 with 4 disks of 4 TB (in TB)?
= 12
! (4 − 1) · 4 TB: one disk's worth of space holds parity.

? Is it true that RAID replaces backups?
- Yes, because the data is on several disks.
+ No, because a deletion or ransomware appears on every disk immediately.
! You need backups alongside RAID too.
```
