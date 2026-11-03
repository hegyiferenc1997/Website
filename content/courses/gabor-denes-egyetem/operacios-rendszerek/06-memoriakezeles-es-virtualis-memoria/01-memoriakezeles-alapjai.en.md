---
title: Memory Management Basics
summary: Logical and physical addresses, the MMU, base and limit registers, contiguous allocation and fragmentation.
minutes: 25
---

## What you will learn

- the difference between a **logical** (virtual) and a **physical** address, and what the **MMU** does,
- how the **base** and **limit** registers protect memory,
- how **contiguous allocation** (first, best, worst fit) works and what **fragmentation** is.

## Logical and physical address

- A **logical address** is what the program "sees" and uses (e.g. the address of a variable in a C program).
- A **physical address** is the real location in the RAM chips.

The translation between them is done by the **MMU** (_Memory Management Unit_) built into the processor, on **every single** memory access, in hardware, very fast. So every process can believe that memory starts at address 0 and belongs to it alone.

## Base and limit registers

The simplest solution uses two registers:

- **base register**: where the process starts in physical memory,
- **limit register**: how large the process's area is.

```text
logical address ──► [ address < limit ? ] ── no ──► error (trap to the OS)
                         │ yes
                         ▼
                    address + base ──► physical address
```

Example: base = 30,000, limit = 12,000.

- Logical address 500 → physical address **30,500**.
- Logical address 13,000 ≥ 12,000 → **protection fault**: the process may not reach outside its own area.

## Contiguous allocation

If every process gets memory **in one piece**, **holes** (free segments) appear after releases. For a new request a hole has to be chosen:

| Strategy      | Which hole does it choose?                    |
| ------------- | --------------------------------------------- |
| **first fit** | the **first** one that is big enough          |
| **best fit**  | the **smallest** one that is still big enough |
| **worst fit** | the **largest** one                           |

Example: the free holes in order are **100, 500, 200, 300, 600 KB**, the request is **212 KB**.

- first fit → **500 KB** (the first big enough one; 288 KB left),
- best fit → **300 KB** (the smallest big enough one; 88 KB left),
- worst fit → **600 KB** (388 KB left).

## Fragmentation

- **External fragmentation**: in total there is enough free memory, but **scattered** in small holes, so a larger request does not fit. (In the example above, leftovers of 100 + 88 + … KB.) **Compaction** (sliding the processes together) can help, but it is slow.
- **Internal fragmentation**: the process got **more** memory than it uses (e.g. we allocate in 4 KB units but only 1 KB is needed) – the excess is lost **inside** the allocated area.

The real solution to external fragmentation is **paging** (next lesson): memory does not have to be in one piece.

## See it in practice

```bash
free -h                     # total, used, free and cache memory
cat /proc/$$/maps | head    # parts of your shell's address space (code, heap, stack, libraries)
```

## Summary

- A program uses logical addresses; the MMU translates them to physical ones on every access.
- Base + limit register: physical = logical + base if logical < limit, otherwise a protection fault.
- Contiguous allocation: first, best, worst fit; its problem is external fragmentation.
- Internal fragmentation: unused space inside the allocated unit.

## Lesson exercise

```quiz required
? Which hardware unit translates logical addresses to physical addresses?
= MMU
! Memory Management Unit, inside the processor.

? Base = 4000, limit = 1000. What is the physical address of logical address 250?
= 4250
! 250 < 1000, so 250 + 4000 = 4250.

? Base = 4000, limit = 1000. What happens with logical address 1200?
- The physical address will be 5200.
- The physical address will be 1200.
+ Protection fault (trap): the address is outside the process's area.
- The OS automatically increases the limit.
! 1200 ≥ 1000, so the MMU signals an error.

? Holes in order: 100, 500, 200, 300, 600 KB. Which one does best fit choose for a 212 KB request? (in KB)
= 300
! The smallest one that is still big enough.

? What is it called when there is enough free memory in total, but scattered in small pieces?
+ external fragmentation
- internal fragmentation
- thrashing
- page fault
! Internal fragmentation is waste inside the allocated area.
```
