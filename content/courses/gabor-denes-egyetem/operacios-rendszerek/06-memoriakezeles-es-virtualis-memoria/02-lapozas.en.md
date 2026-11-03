---
title: Paging and Address Translation
summary: Pages and frames, the page table, splitting the logical address into page number and offset, the TLB and multi-level page tables.
minutes: 30
---

## What you will learn

- what a **page** and a **frame** are, and how paging eliminates external fragmentation,
- how to split a logical address into **page number** and **offset**, and compute the physical address,
- what the **TLB** is, and why **multi-level** page tables are needed.

## Pages and frames

The essence of **paging**: we divide the process's logical address space into equal-sized **pages** and physical memory into **frames** of the same size. Any page can go into any free frame – the process does **not have to be in one piece**, so there is **no external fragmentation**.

Typical page size: **4 KB** (4096 bytes); large pages also exist (2 MB, 1 GB).

The **page table** tells, per process, which page is in which frame:

| Page | Frame |
| ---- | ----- |
| 0    | 3     |
| 1    | 1     |
| 2    | 5     |
| 3    | 2     |

## Address translation

The logical address has two parts:

```text
logical address = [ page number (p) | offset (d) ]
p = address div page size      (integer division)
d = address mod page size      (remainder)
physical address = frame(p) · page size + d
```

**Example** – page size 4096 bytes, the page table above, logical address **8200**:

1. p = 8200 div 4096 = **2**, d = 8200 − 2 · 4096 = **8**.
2. According to the page table, page 2 is in frame **5**.
3. Physical address = 5 · 4096 + 8 = 20,480 + 8 = **20,488**.

### In bits

If the page size is a power of 2, splitting is just **separating bits**. With 32-bit addresses and 4 KB (2¹² byte) pages:

- the offset is **12** bits,
- the page number is 32 − 12 = **20** bits → 2²⁰ = **1,048,576** pages → that many entries are needed in the page table.

If an entry is 4 bytes, one process's page table would be 4 MB – that is why **multi-level** page tables are used: lower-level tables are only created for the parts actually in use. Today's 64-bit x86 processors use 4 (or 5) levels.

## Internal fragmentation with paging

The last page is usually not full. A 10,000-byte program gets 3 pages of 4096 bytes (12,288 bytes); the 2288 bytes are **internal fragmentation**.

## TLB – the translation cache

The page table is in memory, so every memory access would need **one more** (with multi-level tables several) memory reads. The solution is the **TLB** (_Translation Lookaside Buffer_): a small, very fast cache in the MMU that stores the latest page → frame pairs.

- **TLB hit**: the translation is available immediately.
- **TLB miss**: it has to be read from the page table and written into the TLB.

Because of the **locality** of programs (they use the same pages again and again), the hit rate is typically above 99%.

## Protection in the page table

Every entry also has **bits**: **valid** (whether the page belongs to the process), **writable**, **executable**, **user** (whether user-mode code may access it). A code page, for example, is read-only and executable, the stack is writable but not executable.

## Summary

- Paging: pages (logical) and frames (physical) of equal size; no external fragmentation.
- p = address div page size, d = address mod page size, physical = frame · page size + d.
- 32-bit address, 4 KB page → 12-bit offset, 20-bit page number.
- The TLB speeds up translation; multi-level page tables save space.

## Lesson exercise

The page size is **1024 bytes**. The page table: page 0 → frame 4, page 1 → frame 9, page 2 → frame 0, page 3 → frame 7.

```quiz required
? Which page does logical address 3075 fall on?
= 3
! 3075 div 1024 = 3.

? What is the offset of address 3075 within the page?
= 3
! 3075 − 3 · 1024 = 3.

? What is the physical address of logical address 3075?
= 7171
! Page 3 is in frame 7: 7 · 1024 + 3 = 7171.

? With 32-bit addresses and 4 KB pages, how many bits is the offset?
= 12
! 4096 = 2¹², the page number is 20 bits.

? What is the TLB for?
- Caching files read from disk.
+ Quickly storing the latest page → frame translations.
- Scheduling processes.
- Queueing interrupts.
! Translation Lookaside Buffer – part of the MMU.
```
