---
title: Virtual Memory and Page Replacement
summary: Demand paging, the steps of a page fault, page replacement algorithms (FIFO, LRU, optimal), Bélády's anomaly and thrashing.
minutes: 30
---

## What you will learn

- what **virtual memory** and **demand paging** are,
- what happens on a **page fault**,
- how **FIFO**, **LRU** and **optimal** page replacement work, and what **thrashing** is.

## Virtual memory

**Virtual memory** allows a program to be **larger** than the free physical memory: only the pages actually in use are in RAM, the rest are on disk in the **page file** (Linux: a _swap_ partition or file, Windows: `pagefile.sys`).

**Demand paging**: a page is loaded only when the program **first refers to it**. That is why even a big program starts quickly.

## The page fault

If the program refers to a page that is not in memory (**invalid** in the page table), the MMU raises a **page fault**:

1. The kernel checks whether the reference is legal (if not: the process is stopped, e.g. _Segmentation fault_).
2. It looks for a **free frame**; if there is none, it chooses a **victim** page (replacement), and if that was modified ("dirty"), writes it to disk.
3. It reads the requested page from disk into the frame.
4. It updates the page table (valid bit = 1).
5. It **re-executes** the instruction that caused the fault.

A page fault is **expensive**: a disk operation is a thousand to a million times slower than a memory access.

## Page replacement algorithms

Example reference string with **3 frames**: `7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2`

| Algorithm    | Which page does it replace?                                | Page faults in the example |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| **FIFO**     | the one **loaded earliest**                                | 10                         |
| **LRU**      | the one **used least recently** (_Least Recently Used_)    | 9                          |
| **optimal** (OPT) | the one that will be needed **latest**                | 7                          |

The **optimal** algorithm is the best, but we do not know the future, so it is only a **baseline for comparison**. **LRU** approximates it well; real systems use cheap approximations of it (e.g. the **clock** / _second chance_ algorithm with the "referenced" bit).

Run the simulation and watch the frames step by step!

```python run
# Comparing page replacement algorithms: how many page faults with FIFO and LRU?
def fifo(references, frame_count):
    frames, faults = [], 0
    for page in references:
        if page not in frames:
            faults += 1
            if len(frames) == frame_count:
                frames.pop(0)           # the page loaded earliest goes out
            frames.append(page)
        print(f"{page}: {frames}")
    return faults

def lru(references, frame_count):
    frames, faults = [], 0          # the front of the list is the least recently used page
    for page in references:
        if page in frames:
            frames.remove(page)         # just used: moves to the end of the list
        else:
            faults += 1
            if len(frames) == frame_count:
                frames.pop(0)           # the least recently used page goes out
        frames.append(page)
    return faults

references = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
print("FIFO page faults:", fifo(references, 3))
print("LRU page faults:", lru(references, 3))
```

### Bélády's anomaly

We would expect more frames = fewer page faults. With **FIFO** this is not always true! For the string `1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5` there are **9** page faults with 3 frames and **10** with 4 frames. This was described in 1969 by **László Bélády**, a computer scientist of Hungarian origin. LRU and OPT never show this anomaly.

## Thrashing

If too many processes run with too little memory, each of them page-faults continuously: the system does almost nothing but paging, CPU utilisation **drops**, the machine "stops" and the disk works constantly. This is **thrashing**.

Fix: guarantee each process its **working set** – the pages it is actively using; if not everyone fits, some processes must be suspended. From the user's side: fewer programs at once, or more RAM.

```bash
free -h          # Swap row: how much swap space there is and how much is used
vmstat 1 5       # si/so columns: pages swapped in and out per second
```

## Summary

- Virtual memory: only the used pages are in RAM, the rest in the page file.
- Page fault: the kernel loads the page (with replacement if needed) and re-executes the instruction.
- FIFO, LRU, OPT: 10, 9, 7 page faults in the example; FIFO may show Bélády's anomaly.
- Thrashing: too little memory → constant paging → the system nearly stops.

## Lesson exercise

Reference string with **3 frames**, initially empty: `1, 2, 3, 1, 4, 1, 2, 5, 1, 2`

```quiz required
? How many page faults with FIFO replacement?
= 7
! 1, 2, 3 (3 faults), 1 hits, 4 evicts 1, 1 evicts 2, 2 evicts 3, 5 evicts 4, 1 and 2 hit → 7.

? How many page faults with LRU replacement?
= 6
! 1, 2, 3, 4 (2 goes), 2 (3 goes), 5 (4 goes); the rest hit → 6.

? How many page faults with the optimal algorithm?
= 5
! 1, 2, 3, 4 (3 goes, never referenced again), 5 (4 goes) → 5.

? With which algorithm can more frames lead to more page faults?
+ FIFO
- LRU
- optimal
- none of them
! This is Bélády's anomaly.

? What is the state called when the system does almost nothing but paging and CPU utilisation drops?
= thrashing
! Fix: fewer processes or more memory.
```
