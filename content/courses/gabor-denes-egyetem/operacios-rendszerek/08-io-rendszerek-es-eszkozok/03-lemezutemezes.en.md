---
title: Disk Scheduling
summary: Why the order of requests matters on a hard disk – FCFS, SSTF, SCAN and LOOK with computed head movement, and what about SSDs.
minutes: 25
---

## What you will learn

- what the time of a **hard disk access** consists of,
- how **FCFS**, **SSTF**, **SCAN** and **LOOK** disk scheduling work,
- how to compute the **total head movement**, and why it is different on an **SSD**.

## Access time

Reading a block on an HDD consists of three parts:

1. **seek time**: the head moves to the right **track** (cylinder) – the largest part, a few ms;
2. **rotational latency**: waiting until the requested sector rotates under the head (~4.2 ms on average at 7200 rpm);
3. **transfer time**: actually reading the data.

Seek time is proportional to the head's **movement**, so it is worth serving the waiting requests in a **smart order**.

## The example

Cylinders 0–199, the head is at cylinder **53**, the waiting requests in arrival order:

`98, 183, 37, 122, 14, 124, 65, 67`

### FCFS

In arrival order: 53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67.

Movement: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = **640 cylinders**. Fair, but it jumps around a lot.

### SSTF – nearest first

_Shortest Seek Time First_: always serves the request **closest** to the head.

53 → 65 → 67 → 37 → 14 → 98 → 122 → 124 → 183

Movement: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = **236 cylinders**.

Much better, but distant requests may **starve** if new requests keep arriving near the head.

### SCAN – the elevator

The head moves in one direction to the **edge of the disk**, serving everything on the way, then turns back (like an elevator). If it starts upwards:

53 → 65 → 67 → 98 → 122 → 124 → 183 → **199** (edge) → 37 → 14

Movement: (199 − 53) + (199 − 14) = 146 + 185 = **331 cylinders**.

### LOOK

Like SCAN, but it only goes as far as the **last request**, not the edge of the disk:

53 → … → 183 → 37 → 14

Movement: (183 − 53) + (183 − 14) = 130 + 169 = **299 cylinders**.

The **C-SCAN** / **C-LOOK** variants serve in one direction only and jump back to the start at the end – this gives more uniform waiting times.

| Algorithm  | Movement in the example | Starvation? |
| ---------- | ----------------------- | ----------- |
| FCFS       | 640                     | no          |
| SSTF       | 236                     | possible    |
| SCAN (up)  | 331                     | no          |
| LOOK (up)  | 299                     | no          |

## SSDs and modern Linux

An **SSD** has no moving head; access time **does not depend** on where the block is – the algorithms above make no sense there. Linux offers several I/O schedulers: often `none` on NVMe SSDs, `mq-deadline` on SATA, `bfq` on desktops (fair bandwidth sharing).

```bash
cat /sys/block/sda/queue/scheduler   # the active scheduler in square brackets, e.g. [mq-deadline]
```

## Summary

- On an HDD seek time is proportional to head movement, so the order of requests matters.
- FCFS: fair but lots of movement; SSTF: little movement but may starve; SCAN/LOOK: elevator-like, no starvation.
- SSDs have no head; other aspects (fairness, latency) matter there.

## Lesson exercise

Cylinders 0–199, the head is at cylinder **50**. Requests in arrival order: `82, 170, 43, 140, 24, 16, 190`.

```quiz required
? What is the total head movement with FCFS (cylinders)?
= 642
! 32 + 88 + 127 + 97 + 116 + 8 + 174 = 642.

? Which request does SSTF serve first?
- 82
+ 43
- 24
- 16
! |50 − 43| = 7 is the smallest distance.

? What is the total head movement with SSTF?
= 208
! 50 → 43 → 24 → 16 → 82 → 140 → 170 → 190: 7 + 19 + 8 + 66 + 58 + 30 + 20 = 208.

? What is the total head movement with LOOK if the head starts upwards?
= 314
! (190 − 50) + (190 − 16) = 140 + 174 = 314.

? Why are these algorithms not needed on an SSD?
+ Because there is no moving head; access time does not depend on where the block is.
- Because an SSD has no blocks.
- Because an SSD accepts only one request at a time.
- Because an SSD always uses FCFS in hardware.
! Order hardly affects speed on an SSD.
```
