---
title: Storage Devices, Partitions and Backup
summary: HDD and SSD, MBR and GPT partition tables, mounting, RAID levels with capacity calculations and the 3-2-1 backup rule.
minutes: 25
---

## What you will learn

- how an **HDD** and an **SSD** differ (and what **TRIM** is),
- what a **partition**, **MBR** and **GPT** are, and how a file system is **mounted**,
- how **RAID 0, 1, 5** work and what the **3-2-1** backup rule is.

## HDD and SSD

| Aspect             | HDD (hard disk)                          | SSD (solid state)                     |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| working            | spinning magnetic platters, moving head  | flash memory cells, no moving parts   |
| random access      | ~10 ms (the head has to move there)      | ~0.1 ms or less                       |
| speed (sequential) | 100–250 MB/s                             | 500 MB/s (SATA) – 7000+ MB/s (NVMe)   |
| price / TB         | cheap                                    | more expensive                        |
| typical use        | archive, large data store                | system disk, laptop                   |

SSD cells can only be rewritten after **erasing a whole block**, and they tolerate a limited number of writes. The SSD controller therefore spreads the writes (_wear leveling_), and the OS uses the **TRIM** command to signal which blocks became free. HDDs used to need **defragmentation**; SSDs do not (and it causes needless wear).

## Partitions

A disk can be divided into **partitions**; each can get its own file system (e.g. Windows + Linux on one machine). The list of partitions is stored in the **partition table**:

| Aspect                 | MBR (old)                          | GPT (new, with UEFI)             |
| ---------------------- | ---------------------------------- | -------------------------------- |
| max. disk size         | **2 TB**                           | practically unlimited            |
| number of partitions   | **4** primary (or 3 + extended)    | **128** on Windows               |
| backup copy            | none                               | yes (at the end of the disk)     |

Windows 11 and a modern Ubuntu installation use **GPT**, with a small separate **EFI system partition** (FAT32) holding the boot loaders.

```bash
lsblk                    # disks and partitions as a tree
sudo fdisk -l            # partition tables in detail
df -h                    # usage of the mounted file systems
```

On Windows: **Disk Management** (Win + X → Disk Management), or in PowerShell `Get-Disk`, `Get-Partition`.

## Mounting

On Linux a partition's file system becomes accessible when we **mount** it at a point of the directory tree (mount point):

```bash
sudo mkdir /mnt/data
sudo mount /dev/sdb1 /mnt/data    # the first partition of the second disk
sudo umount /mnt/data             # unmount (don't pull the USB stick out before this!)
cat /etc/fstab                    # what is mounted automatically at boot
```

The graphical interface mounts USB sticks automatically under `/media/<user>/`.

## RAID

**RAID** (_Redundant Array of Independent Disks_) handles several disks as one unit, for speed and/or safety. With **n** disks of capacity **C** each:

| Level      | How it works                                     | Usable capacity   | How many disk failures does it survive? |
| ---------- | ------------------------------------------------ | ----------------- | ------------------------- |
| **RAID 0** | striping: data goes to the disks alternately     | n · C             | **0** (if any fails, everything is lost) |
| **RAID 1** | mirroring: the same on every disk                | C                 | n − 1                     |
| **RAID 5** | striping + distributed parity                    | (n − 1) · C       | 1                         |
| **RAID 10**| striped mirrored pairs                           | n · C / 2         | 1 per pair                |

Example: 4 disks of 2 TB in RAID 5 → (4 − 1) · 2 = **6 TB** usable space.

**RAID is not a backup!** If you accidentally delete a file or ransomware encrypts it, RAID faithfully "mirrors" that too.

## Backup: the 3-2-1 rule

- **3** copies of the data (the original + 2 backups),
- on **2** different media (e.g. laptop SSD + external hard disk),
- **1** in another location (e.g. in the cloud or at your parents' home).

For your thesis and assignments this is a lifesaver. Tools: Windows **File History**, Ubuntu **Déjà Dup** (Backups), `rsync`, cloud storage, **git** for code.

## Summary

- SSDs are much faster at random access; TRIM yes, defragmentation no.
- MBR: max. 2 TB and 4 primary partitions; GPT: modern, for large disks, with UEFI.
- On Linux file systems are mounted (`mount`, `/etc/fstab`).
- RAID 0: fast, no protection; RAID 1: mirror; RAID 5: (n − 1) · C. RAID is not a backup – 3-2-1!

## Lesson exercise

```quiz required
? What is the largest disk the MBR partition table can handle (TB)?
= 2
! Larger disks need GPT.

? How many TB of usable capacity do 3 disks of 4 TB have in RAID 5?
= 8
! (3 − 1) · 4 = 8 TB.

? How many disk failures does RAID 0 survive without data loss?
= 0
! Striping provides no redundancy.

? Which command tells the SSD which blocks have become free?
+ TRIM
- defrag
- mount
- fsck
! Defragmentation is pointless on an SSD.

? What does the "1" mean in the 3-2-1 backup rule?
- 1 storage medium
- 1 backup per day
+ at least 1 copy in another location
- 1 password
! E.g. the cloud or another building – against fire or theft.
```
