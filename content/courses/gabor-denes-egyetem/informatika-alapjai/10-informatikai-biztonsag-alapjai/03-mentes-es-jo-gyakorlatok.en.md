---
title: Backups and Good Practices
summary: The 3-2-1 backup rule, updates, firewall and antivirus, public Wi-Fi, the principle of least privilege.
minutes: 15
---

## What you will learn

- how to back up well: the **3-2-1 rule**,
- what the **everyday security habits** are,
- what the principle of **least privilege** is and what to do after an **incident**.

## The 3-2-1 backup rule

- **3** copies of the data (the original + two backups),
- on **2** different storage media (e.g. the laptop's SSD and an external drive),
- **1** copy elsewhere, **offline** or in the cloud (against fire, theft, ransomware).

```text
 laptop (original) ──► external drive (weekly, then disconnected)
        └───────────► cloud backup (continuous, with versions)
```

Ransomware also encrypts connected drives, which is why you need a **disconnected** or **versioned** backup. And: **try a restore** – a never-tested backup is not a backup.

| Backup type      | What does it save?                           |
| ---------------- | -------------------------------------------- |
| **full**         | everything, every time                       |
| **incremental**  | only files changed since the previous backup |
| **differential** | files changed since the last full backup     |

## Everyday habits

1. **Update** – operating system, browser, apps; turn on automatic updates.
2. **Firewall and antivirus** – on Windows the built-in Microsoft Defender is a good base; keep it on.
3. **Public Wi-Fi** – don't do banking there; if you must, use mobile data or a VPN.
4. **Screen lock** – lock the machine when you step away (`Win + L`).
5. Install **only from trusted sources**, and don't enable Office macros in unknown files.
6. **Encrypted disk** – BitLocker (Windows), FileVault (macOS): if the laptop is stolen, the data can't be read.

## The principle of least privilege

Everyone (user, program) should get **only as many rights** as their task needs. Don't do everyday work with an **administrator** account: if malware starts, it runs with your rights, so it can do less damage.

## When things go wrong (incident)

1. Disconnect the machine from the network (Wi-Fi off, cable out).
2. Tell the company's or university's IT staff immediately – don't be embarrassed; the sooner, the better.
3. Change your passwords (from **another**, clean machine), and check where you used the same password.
4. Restore the system from backup.

## Summary

- 3-2-1: three copies, two media, one elsewhere/offline; test restoring.
- Updates, firewall, antivirus, screen lock, encrypted disk, caution on public Wi-Fi.
- Least privilege: don't work as administrator; on an incident: disconnect, report, change passwords, restore.

## Exercise

```quiz required
? How many copies of the data does the 3-2-1 rule require?
= 3
! The original and two backups.

? Why must at least one backup be **offline** or elsewhere?
- Because the cloud is always expensive.
+ Because ransomware, fire or theft can take the local, connected copies too.
- Because it makes the machine faster.
- Because the law requires it.
! Malware can't reach the disconnected copy.

? Which backup type saves only files changed **since the previous backup**?
- full
+ incremental
- differential
! Incremental backup.

? What is the first thing to do if you suspect your machine is infected?
+ disconnect it from the network
- restart the router
- delete the browsing history
- wait and hope it goes away
! This way it doesn't spread and can't send data out.
```
