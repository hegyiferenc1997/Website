---
title: Practice – File Systems
summary: Review questions, command-line tasks with links and disks, summary worksheet.
minutes: 25
kind: practice
---

## Tasks in the Ubuntu VM

1. `cd ~ && echo "original" > a.txt`, then create a hard and a symbolic link: `ln a.txt hard.txt`, `ln -s a.txt sym.txt`.
2. `ls -li` – which two have the **same** inode number?
3. Delete `a.txt`. What do `cat hard.txt` and `cat sym.txt` print? Why?
4. Run `lsblk` and `df -h`. Which partition holds the root (`/`), and with what file system (`df -T /`)?
5. In VirtualBox add a second, 1 GB virtual disk to the machine (**Settings → Storage**) and check whether it appears in `lsblk` (`sdb`).

## Review questions

<details>
<summary>1. What is the answer to task 3?</summary>

`hard.txt` still prints "original", because it is another name of the same inode – the file is only deleted when its last name disappears. `sym.txt` gives an error (No such file or directory), because it points to the path `a.txt`, which no longer exists.

</details>

<details>
<summary>2. Why is a journaling file system recovered faster after a power cut?</summary>

Because only the last, unfinished entries of the journal have to be replayed or discarded; the whole disk structure does not have to be scanned (as chkdsk does with FAT).

</details>

<details>
<summary>3. Why are USB sticks often formatted as exFAT?</summary>

Because Windows, macOS and Linux can all read and write it, and it does not have FAT32's 4 GB file size limit.

</details>

<details>
<summary>4. You have RAID 1 mirroring. Do you still need a backup?</summary>

Yes. RAID only protects against disk failure; not against accidental deletion, ransomware or a stolen laptop. That is why a backup following the 3-2-1 rule is needed.

</details>

## Summary worksheet

```quiz required
? Which command shows the inode numbers of files?
+ ls -i
- ls -h
- df -h
- cat -n
! Names with the same inode number point to the same file.

? Which Linux folder holds the device files (e.g. sda)?
= /dev
! /dev/sda = the first disk, /dev/sda1 its first partition.

? How many TB of usable storage do 2 disks of 4 TB give in RAID 1?
= 4
! Mirroring halves the capacity.

? Which file system is Ubuntu's default?
+ ext4
- NTFS
- FAT32
- APFS
! Extents and journaling.

? Which partition table does a UEFI installation of Windows 11 use?
= GPT
! GUID Partition Table.

? Which file lists on Linux the file systems to be mounted automatically at boot?
= /etc/fstab
! File System TABle.
```
