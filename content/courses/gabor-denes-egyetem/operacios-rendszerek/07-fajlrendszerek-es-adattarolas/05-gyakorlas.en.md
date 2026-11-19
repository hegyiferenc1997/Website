---
title: Practice – File Systems
summary: Review questions, command-line tasks with links and disks, summary worksheet.
minutes: 50
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Blocks and wasted space.** A file always occupies a whole number of blocks. Write the `allocation(size, block=4096)` function, which returns a pair: how many blocks the file occupies, and how many bytes are left unused in the last block!

```python starter
def allocation(size, block=4096):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def allocation(size, block=4096):
    n = -(-size // block)             # division rounded up
    return (n, n * block - size)
```

</details>

```python test
assert allocation(10000) == (3, 2288)
assert allocation(4096) == (1, 0)
assert allocation(1) == (1, 4095)
assert allocation(0) == (0, 0)
print("All checks passed!")
```

**2.** **The inode's largest file.** An inode has 12 direct pointers, one single, one double and one triple indirect pointer. A pointer is 4 bytes. Write the `max_file(block)` function, which returns the largest representable file size in bytes!

```python starter
def max_file(block):
    return 12 * block
```

<details>
<summary>Solution</summary>

```python solution
def max_file(block):
    n = block // 4                    # this many pointers fit in a block
    blocks = 12 + n + n**2 + n**3     # direct + single + double + triple
    return blocks * block
```

</details>

```python test
assert max_file(1024) == (12 + 256 + 256**2 + 256**3) * 1024
assert max_file(4096) == (12 + 1024 + 1024**2 + 1024**3) * 4096
print(f"with 4 KB blocks: {max_file(4096) / 2**40:.2f} TiB")
print("All checks passed!")
```

**3.** **Following a FAT chain.** In the FAT table every block maps to the number of the file's **next** block, with `-1` for the last. Write the `chain(fat, start)` function, which returns the list of the file's blocks in order!

```python starter
def chain(fat, start):
    return [start]
```

<details>
<summary>Solution</summary>

```python solution
def chain(fat, start):
    blocks = []
    b = start
    while b != -1:
        blocks.append(b)
        b = fat[b]                    # the number of the next block
    return blocks
```

</details>

```python test
fat = {2: 9, 9: 4, 4: -1, 5: 6, 6: -1}
assert chain(fat, 2) == [2, 9, 4]
assert chain(fat, 5) == [5, 6]
assert chain({7: -1}, 7) == [7]
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the inode store?
+ the file's metadata (size, permissions, owner, timestamps) and the location of the data blocks – not its name
- the file's name and contents
- only the file's name
! The name is stored by the directory entry, which is why a file can have several names (hard links).

? What happens to a symbolic link if the original file is deleted?
+ it "dangles": it points to a path that doesn't exist
- it's deleted automatically
- it keeps working, because it points to the data
! A hard link, however, keeps working.

? What is journaling in a file system for?
+ after a crash the file system can be quickly brought back to a consistent state
- logging users' activity
- compressing files
! It first writes the intention to the journal, and only then to its place.

? Which file system do you recommend for a USB stick you want to use on Windows, macOS and Linux, storing files larger than 4 GB?
- FAT32
+ exFAT
- ext4
! FAT32 handles files of at most 4 GB, and Windows can't read ext4 by default.

? What does the df -h command show?
+ the size, used and free space of the mounted file systems
- the size of directories
- the running processes
! du -sh shows the size of directories.
```
