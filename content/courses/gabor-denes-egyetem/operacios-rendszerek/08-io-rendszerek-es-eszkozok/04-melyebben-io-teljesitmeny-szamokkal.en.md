---
title: Deeper – I/O Performance in Numbers
summary: Computing the time of a hard disk access, IOPS and throughput (why random reads are 500 times slower), a disk scheduler simulator with C-SCAN and C-LOOK, the write-back cache and sync, and measuring I/O on the virtual machine.
minutes: 40
---

## What you will learn in this lesson

- how to compute the time of a **hard disk access** as the sum of seek time, rotational latency and transfer,
- what **IOPS** and **throughput** are, and why random access is **many times slower** than sequential,
- how a **simulator** compares all disk schedulers (including C-SCAN and C-LOOK),
- what a **write-back cache** is, and what `sync` is for,
- how to **measure** I/O on the lab machine.

## 1. Anatomy of a hard disk access

The data of a typical desktop hard disk: **7200 rpm**, average seek time **9 ms**, sequential transfer rate **150 MB/s**. How long does it take to read **one 4 KB block** from a random location?

1. **Seek time:** 9 ms (on average).
2. **Rotational latency:** one revolution is 60,000 ms / 7200 = 8.33 ms. On average we wait **half** a revolution: **4.17 ms**.
3. **Transfer:** 4 KB / 150 MB/s ≈ 4 / 150,000 s ≈ **0.027 ms**.

Total: 9 + 4.17 + 0.03 ≈ **13.2 ms**. **99.8%** of the time is spent moving and waiting, and only 0.2% actually reading data!

## 2. IOPS and throughput

We characterise storage with two metrics:

- **IOPS** (_I/O operations per second_): how many separate operations it can do per second – matters for **random** access (databases, many small files, booting an operating system);
- **throughput** (MB/s): how much data it can transfer continuously – matters for **sequential** access (copying a video, backups).

```python run
# Hard disk and SSD: random 4 KB reads versus sequential reads.
def hdd_random(rpm=7200, seek_ms=9.0, transfer_mb_s=150, block_kb=4):
    rotation_ms = 60_000 / rpm / 2               # half a revolution on average
    transfer_ms = block_kb / 1024 / transfer_mb_s * 1000
    return seek_ms + rotation_ms + transfer_ms

t = hdd_random()
iops = 1000 / t
print(f"HDD one random 4 KB read: {t:.2f} ms → {iops:.0f} IOPS")
print(f"HDD random reading:   {iops * 4 / 1024:.2f} MB/s")
print(f"HDD sequential read:  150 MB/s  (≈ {150 / (iops * 4 / 1024):.0f}× faster)")

ssd_ms = 0.1                                     # an SSD random read ~0.1 ms
print(f"\nSATA SSD random 4 KB: {1000 / ssd_ms:,.0f} IOPS (one request at a time)")
print("NVMe SSD with many parallel requests: several hundred thousand IOPS")

for rpm in (5400, 7200, 10_000, 15_000):
    print(f"{rpm:>6} rpm: {hdd_random(rpm=rpm):5.2f} ms / random read")
```

For random reads a hard disk manages about **75 IOPS**, which with 4 KB blocks is only **0.3 MB/s** – **five hundred times** slower than the sequential 150 MB/s! That's why booting a system from a hard disk is so slow (many small, scattered files), and that's why SSDs brought a huge leap: not because of sequential speed, but because random access is **a hundred to a thousand times** faster.

Faster rotation (15,000 rpm server drives) helps only moderately, because the seek time remains. That's why the OS tries to **order** requests (disk scheduling) and **merge** them (adjacent blocks into a single request).

## 3. A disk scheduler simulator

In the basic lesson we computed the results of FCFS, SSTF, SCAN and LOOK by hand. The simulator computes all of them – including **C-SCAN** and **C-LOOK**, which only serve in one direction and jump back at the end (we count the jump back as movement too).

```python run
# Comparing disk schedulers: total head movement in cylinders.
REQUESTS = [98, 183, 37, 122, 14, 124, 65, 67]
START, MAX_CYL = 53, 199

def movement(path):
    return sum(abs(b - a) for a, b in zip(path, path[1:]))

def fcfs():
    return [START] + REQUESTS

def sstf():
    path, left = [START], list(REQUESTS)
    while left:
        nxt = min(left, key=lambda c: abs(c - path[-1]))
        left.remove(nxt)
        path.append(nxt)
    return path

up = sorted(c for c in REQUESTS if c >= START)       # requests above the head
down = sorted((c for c in REQUESTS if c < START), reverse=True)

def scan():   return [START] + up + [MAX_CYL] + down              # goes to the edge, turns back
def look():   return [START] + up + down                          # only to the last request
def c_scan(): return [START] + up + [MAX_CYL, 0] + sorted(down)   # edge → back to 0 → up
def c_look(): return [START] + up + sorted(down)                  # last → to the smallest request

for name, f in [("FCFS", fcfs), ("SSTF", sstf), ("SCAN", scan), ("LOOK", look),
                ("C-SCAN", c_scan), ("C-LOOK", c_look)]:
    path = f()
    print(f"{name:7} {movement(path):4} cylinders   {' → '.join(map(str, path))}")
```

Results: FCFS 640, SSTF 236, SCAN 331, LOOK 299, C-SCAN 382, C-LOOK 322. The C variants involve **more** movement – so why are they used? Because **waiting is more even**: with SCAN, requests in the middle of the disk are "passed by" twice on the head's round trip, while those at the edges may wait up to two full trips. C-SCAN treats everyone the same – like a circular bus line that always goes in the same direction.

**Lesson:** the smallest total movement (SSTF) doesn't mean the best user experience – the same trade-off as in processor scheduling: average versus fairness.

## 4. The write-back cache and sync

When a program writes to a file, the `write()` call usually **returns immediately** – even though the data isn't on the disk yet! The OS only puts it into the **page cache** in memory, marks it "dirty", and writes it out later in batches (**write-back** cache). The advantage: many small writes combine into one big, ordered write, and the program doesn't wait for the slow disk.

The disadvantage: in a power cut, data not yet written out is **lost**. That's why:

- the `sync` command (and the `fsync()` call in programs) **forces** the write-out – databases call it after every committed transaction;
- that's why a USB drive must be **safely removed**: the system then writes out the dirty pages.

Look at it on the lab machine:

```bash
dd if=/dev/zero of=test.bin bs=1M count=300            # fast: only writes to the cache
grep -E 'Dirty|Writeback' /proc/meminfo                # dirty data not yet written out (kB)
sync                                                   # force the write-out
grep -E 'Dirty|Writeback' /proc/meminfo                # now close to 0
dd if=/dev/zero of=test.bin bs=1M count=300 conv=fdatasync    # also waits for the write-out at the end: slower!
rm test.bin
```

The difference between the speeds printed by the two `dd` commands shows how much the cache "lies" – and how much it speeds things up.

## 5. Measuring I/O on the lab machine

```bash
lsblk -o NAME,SIZE,ROTA,SCHED,TYPE,MOUNTPOINTS   # ROTA=1: spinning disk, 0: SSD; SCHED: I/O scheduler
cat /sys/block/sda/queue/scheduler               # the available and the active scheduler
sudo apt install sysstat iotop                   # install the measuring tools
iostat -x 1 5                                    # per device: r/s, w/s (IOPS), rkB/s, %util
sudo iotop -o                                    # which processes are reading/writing right now (quit: q)
```

In the `iostat` output `%util` shows what percentage of the time the device was busy; if it's persistently near 100%, it's the bottleneck. (On a virtual machine the numbers also reflect the host's disk.)

On Windows: **Resource Monitor → Disk** tab: read and write (B/s) per process, and at the bottom the disks' *Response Time* and *Active Time (%)*. The disk graph on Task Manager's **Performance** page also shows active time.

## Summary

- A random HDD read ≈ seek (9 ms) + half a revolution (7200 rpm: 4.17 ms) + transfer (~0.03 ms) ≈ 13 ms.
- On an HDD this is ~75 IOPS, with 4 KB blocks 0.3 MB/s – sequential reading is ~500 times faster. The SSD's advantage is mainly in random access.
- According to the simulator: FCFS 640, SSTF 236, SCAN 331, LOOK 299, C-SCAN 382, C-LOOK 322; the C variants give more even waiting.
- The **write-back cache** speeds things up, but data can be lost in a power cut; `sync`/`fsync()` forces the write-out.
- `lsblk`, `iostat -x`, `iotop`, and on Windows Resource Monitor show the I/O load.

## Exercise

```quiz required
? For a 7200 rpm hard disk, what is the average rotational latency (ms, to two decimals)?
= 4.17
= 4,17
! One revolution is 60,000 / 7200 = 8.33 ms, half of that.

? A random read takes 12.5 ms. How many IOPS can the disk do?
= 80
! 1000 ms / 12.5 ms = 80.

? Why did booting an operating system speed up so spectacularly with the arrival of SSDs?
- because the SSD's sequential speed is a thousand times higher
+ because random access (many small, scattered files) is a hundred to a thousand times faster
- because there's no file system on an SSD
! The hard disk spends most of its time moving the head and rotating.

? In the lesson's example, which algorithm gave the smallest total head movement?
+ SSTF
- SCAN
- C-SCAN
- FCFS
! 236 cylinders – but distant requests may starve.

? Why is C-SCAN used even though it involves more head movement than SCAN?
- because its hardware is simpler
+ because the waiting time of requests is more even
- because it's faster on an SSD
! It serves every request in the same direction, like a circular line.

? Which command forces on Linux that the "dirty" data in the cache is written out to the disk?
= sync
! In programs the fsync() call does the same.
```
