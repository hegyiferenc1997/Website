---
title: Deeper – A File's Journey to the Disk
summary: How the OS finds /home/anna/notes.txt, how large a file can be with indirect pointers, what happens in a power cut with and without journaling (simulation), hard and symbolic links, the mystery of the "deleted but still space-consuming" file, and making your own file system inside a file on the virtual machine.
minutes: 45
---

## What you will learn in this lesson

- step by step, how the OS **finds** a file's data from its path,
- how to compute **how large a file can be** with the classic inode's indirect pointers,
- why **journaling** is needed – with a power-cut simulation,
- how **hard** and **symbolic links** behave in practice,
- why space isn't freed when you delete an **open** file, and the difference between `df` and `du`,
- how to make **your own file system** in an ordinary file and mount it.

## 1. Resolving a path

When a program opens the file `/home/anna/notes.txt`, the OS has to get from the names to the data blocks. On ext4 it looks like this:

1. The **root directory**'s (`/`) inode is at a known place (inode 2).
2. It reads the root directory's **data blocks**: a name → inode number table. It looks up the name `home` → say inode 131073.
3. It reads inode 131073, checks that it's a **directory** and that you have **permission** (x right), then finds the name `anna` in its data blocks → 262145.
4. The same way, in the `anna` directory, `notes.txt` → 262200.
5. It reads inode 262200: it holds the file's **permissions**, **size** and the location of its **data blocks**.

So a four-part path can mean up to 8 disk reads before reading a single byte of the file! That's why the kernel keeps recently resolved names (**dentry cache**) and inodes in memory – the second open is almost instant.

**Analogy:** in an office building you ask at reception where "Finance" is (root directory → `home`), there you ask where Anna sits (`anna`), and you ask Anna for the folder (`notes.txt`). Every step needs another "signpost".

Look at it on the lab machine:

```bash
ls -id / /home ~ ~/.bashrc          # inode numbers of the path's elements
stat ~/.bashrc                      # the inode's contents: size, blocks, permissions, timestamps, link count
```

## 2. How large can a file be? – indirect pointers

The classic UNIX inode contains 15 pointers:

- **12 direct** pointers: each points to a data block;
- **1 single indirect**: points to a block full of data block pointers;
- **1 double indirect**: a pointer block pointing to pointer blocks;
- **1 triple indirect**: one more level.

With 4 KB blocks and 4-byte pointers, a pointer block holds 4096 / 4 = **1024** pointers.

```python run
# The classic inode's largest file size with direct and indirect pointers.
block = 4096                    # bytes
pointer = 4                     # bytes
per_block = block // pointer    # this many pointers fit in a pointer block

parts = [
    ("12 direct", 12),
    ("single indirect", per_block),
    ("double indirect", per_block ** 2),
    ("triple indirect", per_block ** 3),
]

def readable(b):
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if b < 1024:
            return f"{b:.2f} {unit}"
        b /= 1024
    return f"{b:.2f} PB"

total = 0
for name, blocks in parts:
    total += blocks * block
    print(f"{name:25} +{readable(blocks * block):>8}  → total {readable(total)}")
```

The result: 48 KB + 4 MB + 4 GB + 4 TB ≈ **4 TB**. The same with **1 KB** blocks would only be ~16 GB (try it in the program!). That's why block size matters so much: a bigger block allows bigger files, but wastes more space on small files (internal fragmentation).

To read one byte of a 1 GB file in the double indirect part, **three** blocks must be read (two pointer blocks + the data). ext4's **extents** ("500 consecutive blocks from block 1000") save this too: a big, contiguous file is described by a few entries.

## 3. A power cut in the middle of a write – why the journal?

When a new block is appended to a file, the file system must change the disk in **three** places:

1. mark the new block as used in the **free block map** (bitmap),
2. write the **data** into the new block,
3. add the new block to the **inode** and increase the size.

These are separate disk writes. What happens if the power goes **in between**? The simulation goes through all possible "crash points":

```python run
# Power cut during an append: what state is the file system left in?
STEPS = ["bitmap", "data", "inode"]

def state(done):
    """What is the consequence if only the 'done' steps reached the disk?"""
    b, d, i = ("bitmap" in done), ("data" in done), ("inode" in done)
    if b and d and i:
        return "all fine"
    if not b and not i:
        return "fine (the append is lost, but there's no contradiction)"
    if b and not i:
        return "ERROR: lost block (marked as used, but belongs to nobody)"
    if i and not b:
        return "ERROR: the inode points to a block that looks free → it may be overwritten later!"
    if i and not d:
        return "ERROR: garbage (old data) at the end of the file"
    return "?"

from itertools import permutations

print("Without a journal – every possible write order, power cut after 1 or 2 steps:")
for order in permutations(STEPS):
    print(" → ".join(order))
    for n in (1, 2):
        print(f"    after {n} step(s): {state(order[:n])}")

print("\nWith a journal: first the whole operation is written to the journal, then a 'committed' entry.")
print("  power cut before the commit → the journal entry is discarded: fine (the append is lost)")
print("  power cut after the commit  → at boot it's replayed from the journal: all fine")
```

Notice: **there's no write order** that is safe at every crash point. Without a journal several intermediate states are **contradictory**: a lost block, or – worst of all – a block that a file uses but that looks free, so another file later overwrites it. That's why in the old days the `fsck` checker had to run for hours after every crash, combing through the whole disk.

**Journaling** borrows the idea of database transactions: it first writes the changes to a separate area, the **journal**, with a "committed" mark at the end. At boot only the journal has to be checked: what's committed is replayed, what isn't is discarded. So the operation is **atomic**: it either happens completely or not at all.

ext4 by default (in `data=ordered` mode) only journals the **metadata**, but always writes the data block before the metadata – so the "garbage at the end of the file" error can't happen either, yet not all data has to be written twice.

## 4. Links in practice

In the Ubuntu VM:

```bash
cd ~/lab
echo "original content" > original.txt
ln original.txt hard.txt             # hard link: a second name for the same inode
ln -s original.txt symbolic.txt      # symbolic link: a small file containing the path
ls -li                               # column 1: inode number, column 3: link count
```

What do you see? `original.txt` and `hard.txt` have the **same** inode number, and both have a link count of **2**. `symbolic.txt` got its own inode, and the listing shows `-> original.txt`.

```bash
rm original.txt
cat hard.txt            # works: the data is there, only one name disappeared (link count: 1)
cat symbolic.txt        # error: the link points to a name that no longer exists ("dangling" link)
```

| Property                          | Hard link        | Symbolic link |
| --------------------------------- | ---------------- | ------------- |
| own inode?                        | no, the same one | yes           |
| after deleting the original       | works            | "dangles"     |
| can point to a directory?         | no               | yes           |
| can point to another file system? | no               | yes           |

## 5. The deleted but space-consuming file – df versus du

A classic system administrator mystery: the disk is full, you delete a 5 GB log file, but according to `df` **nothing was freed**. What happened?

A file's data is only freed when **the link count is 0** and **no process keeps it open**. `rm` only deletes the name; if a program (e.g. the service writing the log) is still writing the file, the inode and blocks remain until it closes it.

Try it:

```bash
dd if=/dev/zero of=big.bin bs=1M count=200     # a 200 MB file
df -h ~                                        # note the used space
tail -f big.bin > /dev/null &                  # a process keeps it open
rm big.bin
df -h ~                                        # the space was NOT freed!
du -sh ~                                       # du no longer counts it, though
ls -l /proc/$!/fd | grep deleted               # here it is: (deleted)
kill $!                                        # the process closes it → the space is freed
df -h ~
```

The reason for the difference: **`df`** looks at the file system's own records (how many blocks are used), while **`du`** walks the directories and adds up the sizes of the files belonging to **names**. `du` can't see the nameless but open file. In practice the fix is restarting the service, or emptying the file instead of deleting it (`truncate -s 0 log.log`).

Useful commands when space is running out:

```bash
du -sh ~/* | sort -h           # what takes the most space in your folder
sudo du -xh / --max-depth=1 2>/dev/null | sort -h | tail   # the biggest folders under root
```

## 6. Your own file system in a file

A file system can be created not only on a partition but also in an ordinary file (**loop device**). This lets you experiment without risk:

```bash
truncate -s 100M disk.img             # a 100 MB "empty disk" (sparse file: takes almost no space)
mkfs.ext4 disk.img                    # create an ext4 file system in the file
sudo mkdir -p /mnt/test
sudo mount -o loop disk.img /mnt/test      # mount it
df -h /mnt/test                       # how much usable space?
df -i /mnt/test                       # how many inodes?
sudo touch /mnt/test/f{1..1000}       # 1000 empty files
df -i /mnt/test                       # 1000 fewer free inodes
sudo umount /mnt/test                 # unmount
```

Observations: the usable space isn't 100 MB (the journal, inode tables and reserved area take space too), and **you can run out of inodes** – with many tiny files, inodes run out before space. Then you get a "No space left on device" error, even though `df -h` says there's space.

## Summary

- Resolving a path costs an inode read and a directory block read per directory; the **dentry cache** speeds it up.
- With the classic inode and 4 KB blocks the largest file ≈ 48 KB + 4 MB + 4 GB + 4 TB; ext4 extents are even more efficient.
- Without a journal an interrupted write can leave a contradictory state (lost or doubly used block); the **journal** makes the operation atomic.
- A **hard link** points to the same inode, a **symbolic link** stores a path.
- A file's space is only freed when it has no name and nobody keeps it open; that's why **`df`** and **`du`** can show different values.
- `mkfs` + `mount -o loop` – your own file system in a file; inodes can run out too.

## Exercise

```quiz required
? 4 KB blocks, 4-byte pointers. How many pointers fit in a pointer block?
= 1024
! 4096 / 4 = 1024.

? With the classic inode's 12 direct pointers and 4 KB blocks, at most how many KB can a file be without indirect pointers?
= 48
! 12 · 4 KB = 48 KB.

? On a file system without a journal, the inode already points to the new block but the free block map still shows the block as free when the power goes. What is the danger?
- nothing, everything will be fine at the next boot
+ another file may get the block later and overwrite the data
- the disk is physically damaged
! That's why a journal or a full fsck check is needed.

? You create a hard link to a file, then delete the original name. What happens?
+ the file is still accessible under the other name
- the hard link will "dangle"
- the file's contents are deleted immediately
! A hard link points to the same inode; the data is only freed at link count 0.

? You delete a big log file, but df shows no space was freed. What is the most likely reason?
- df is faulty
+ a process still keeps the file open
- the file went to the recycle bin
! While it's open, the inode and blocks remain; du no longer counts it.

? df -h shows free space, yet you get a "No space left on device" error when creating many tiny files. What ran out?
= inode
= inodes
= az inode-ok
! df -i shows it.
```
