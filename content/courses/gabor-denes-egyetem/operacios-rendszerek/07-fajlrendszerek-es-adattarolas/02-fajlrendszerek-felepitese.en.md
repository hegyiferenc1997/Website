---
title: The Structure of File Systems
summary: Blocks, contiguous, linked and indexed allocation, FAT, inode and NTFS, journaling and a comparison of today's file systems.
minutes: 25
---

## What you will learn

- how a file system stores files in **blocks**,
- what **contiguous**, **linked** (FAT) and **indexed** (inode) allocation are,
- what **journaling** is, and how FAT32, exFAT, NTFS, ext4 and APFS differ.

## Blocks

The file system divides the disk into equal-sized **blocks** (on Windows: _clusters_), typically **4 KB** each. A file always occupies a **whole number** of blocks: a 10 KB file takes 3 blocks (12 KB) – the remaining 2 KB is internal fragmentation.

The file system has to keep track of:

- which block is **free** (bitmap or free list),
- which file is in **which blocks**,
- the files' **metadata** and the **directories**.

## Allocation methods

| Method         | How?                                                | Advantage                 | Drawback                             |
| -------------- | --------------------------------------------------- | ------------------------- | ------------------------------------ |
| **contiguous** | the file is in consecutive blocks (start + length)  | fast reading              | external fragmentation, hard to grow |
| **linked**     | every block tells which one comes next              | no external fragmentation | slow random access                   |
| **indexed**    | an **index block** lists all the blocks of the file | fast random access        | the index takes space                |

CDs/DVDs (ISO 9660) use contiguous allocation – files do not change there.

### FAT – linked allocation in a table

**FAT** (_File Allocation Table_) stores the chain in a separate **table**: element _i_ of the table tells which block comes after block _i_ in the file.

```text
directory entry: "photo.jpg" → first block: 4

FAT:   index:  2    3    4    5    6    7
       value:  0    0    7    0    0   EOF
→ blocks of photo.jpg: 4 → 7 → end
```

It is simple, so every device understands it (USB stick, camera, car radio).

### Inode – indexed allocation on UNIX

On Linux (ext4) every file has an **inode**: a small record with the file's metadata (size, owner, permissions, timestamps) and the references **pointing to its blocks**. Interesting: the file's **name is not in the inode** – the name is in the directory, which is why a file can have several names (hard links).

A classic inode has 12 **direct** pointers; with 4 KB blocks this is enough up to 12 · 4 = **48 KB**. Larger files need **indirect** pointers (a block that contains further pointers). ext4 uses **extents** instead: "500 blocks starting at block 1000" – much more compact for large files.

```bash
ls -i                    # inode numbers of the files
df -i /                  # how many inodes there are and how many are free
```

### NTFS

The Windows file system, **NTFS**, stores the data of every file in a record of the **Master File Table** (MFT); the contents of small files can even fit inside the MFT record itself. It supports permissions (ACL), encryption, compression and journaling.

## Journaling

What happens if the power goes out while a file is being written? The file system may become **inconsistent** (e.g. a block is already allocated but belongs to no file). A **journaling** file system first writes the change into a **journal** and only then performs it. After a crash the system can be recovered quickly from the journal, without scanning the whole disk.

## Today's file systems

| File system        | Where?                         | Max. file size        | Journaling          | Note                             |
| ------------------ | ------------------------------ | --------------------- | ------------------- | -------------------------------- |
| **FAT32**          | old USB sticks, UEFI partition | **4 GB**              | no                  | readable everywhere              |
| **exFAT**          | USB stick, SD card             | practically unlimited | no                  | successor of FAT32 for big files |
| **NTFS**           | Windows                        | 16 TB+                | yes                 | ACL, encryption, compression     |
| **ext4**           | Linux (Ubuntu default)         | 16 TB                 | yes                 | extents, reliable                |
| **Btrfs**, **ZFS** | Linux servers                  | huge                  | copy-on-write (CoW) | snapshots, checksums             |
| **APFS**           | macOS, iOS                     | huge                  | CoW                 | snapshots, encryption            |

## Summary

- A file system stores data in blocks; a file occupies a whole number of blocks.
- Contiguous (fast but fragments), linked (FAT), indexed (inode, MFT) allocation.
- The inode stores the metadata and block pointers, but not the name.
- Journaling gives fast recovery after a crash; FAT32 has a 4 GB file size limit.

## Lesson exercise

```quiz required
? How many 4 KB blocks does a 10 KB file occupy?
= 3
! 10 / 4 = 2.5 → rounded up to 3.

? Which allocation method does the FAT file system use?
- contiguous
+ linked (with the chain stored in a table)
- indexed
- random
! Each table element stores the number of the next block.

? What is NOT stored in a Linux inode?
- the file size
- the owner
+ the file name
- the references to the blocks
! The name is stored by the directory.

? What is the largest file you can write to FAT32, roughly, in GB?
= 4
! That is why even the large install.wim file of the Windows ISO does not fit on it.

? With 12 direct pointers and 4 KB blocks, up to how many KB do the direct pointers reach?
= 48
! 12 · 4 KB = 48 KB.
```
