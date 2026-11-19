---
title: Practice – Memory Management
summary: Review questions, calculations on address translation and page replacement, and an experiment in the VM.
minutes: 30
kind: practice
---

## Experiment: little memory in the VM

1. Take a **snapshot** of the Ubuntu VM.
2. Shut it down and under **Settings → System** reduce memory to **2048 MB**.
3. Start it, open many browser tabs and watch in a terminal: `vmstat 1`. Do you see the `si`/`so` columns (paging) grow?
4. Restore the memory (or the snapshot).

## Review questions

<details>
<summary>1. Why is there no external fragmentation with paging, but there is internal?</summary>

Because any page can go into any free frame, so every free frame can be used. Internal fragmentation remains: the process's last page is usually not full.

</details>

<details>
<summary>2. Why must the instruction that caused the page fault be re-executed?</summary>

Because the instruction could not complete: the referenced data was not in memory. After the page is loaded, the same instruction now runs successfully.

</details>

<details>
<summary>3. Why do real systems not use exact LRU?</summary>

Because on every single memory access they would have to record when each page was used – too expensive. Instead the hardware only sets a "referenced" bit and the OS approximates from it (clock algorithm).

</details>

<details>
<summary>4. What would you advise a student whose laptop is constantly "grinding the disk" and very slow?</summary>

Probably thrashing: too little RAM for the running programs. Close programs (especially many browser tabs), check memory usage in Task Manager and, if possible, upgrade the RAM.

</details>

## Summary worksheet

```quiz required
? Holes in order: 100, 500, 200, 300, 600 KB. Which one does worst fit choose for a 212 KB request? (in KB)
= 600
! The largest one.

? The page size is 4096 bytes, page 2 is in frame 6. What is the physical address of logical address 8300?
= 24684
! p = 2, d = 8300 − 8192 = 108; 6 · 4096 + 108 = 24,684.

? 32-bit address space, 4 KB pages: how many bits is the page number?
= 20
! 32 − 12 = 20.

? A 10,000-byte program gets 4096-byte pages. How many pages does it occupy?
= 3
! 10,000 / 4096 ≈ 2.44, rounded up to 3.

? Which page does the LRU algorithm replace?
- the one loaded earliest
+ the one used least recently
- the one that will be needed latest
- a randomly chosen one
! Least Recently Used.

? What is the name of the Windows page file?
= pagefile.sys
! On Linux a swap partition or swapfile.
```
