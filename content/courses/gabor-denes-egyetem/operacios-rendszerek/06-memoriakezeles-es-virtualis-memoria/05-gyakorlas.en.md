---
title: Practice – Memory Management
summary: Review questions, calculations on address translation and page replacement, and an experiment in the VM.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Address translation with a page table.** Write the `physical(addr, page_table, page_size=4096)` function: split the virtual address into a page number and an offset, look up the frame for the page number in the `page_table` dictionary, and return the physical address. If the page isn't in the table, return `None` (page fault)!

```python starter
def physical(addr, page_table, page_size=4096):
    return addr
```

<details>
<summary>Solution</summary>

```python solution
def physical(addr, page_table, page_size=4096):
    page, offset = divmod(addr, page_size)   # page number and offset within the page
    if page not in page_table:
        return None                          # page fault
    return page_table[page] * page_size + offset
```

</details>

```python test
table = {0: 5, 1: 2, 3: 7}
assert physical(100, table) == 5 * 4096 + 100
assert physical(4096 + 10, table) == 2 * 4096 + 10
assert physical(2 * 4096, table) is None
assert physical(3 * 4096 + 4095, table) == 7 * 4096 + 4095
print("All checks passed!")
```

**2.** **LRU page faults.** Write the `lru_faults(references, frames)` function, which counts the page faults with LRU replacement: if memory is full, the **least recently used** page must be evicted.

```python starter
def lru_faults(references, frames):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def lru_faults(references, frames):
    memory = []                      # least recently used at the front
    faults = 0
    for page in references:
        if page in memory:
            memory.remove(page)      # hit: moves to the end (most recently used)
        else:
            faults += 1
            if len(memory) == frames:
                memory.pop(0)        # the least recently used goes
        memory.append(page)
    return faults
```

</details>

```python test
refs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]
assert lru_faults(refs, 3) == 9
assert lru_faults([1, 2, 1, 2], 2) == 2
assert lru_faults([1, 2, 3, 1, 2, 3], 2) == 6
print("All checks passed!")
```

**3.** **Effective memory access time.** A TLB lookup takes `tlb` ns, a memory read `mem` ns. A TLB hit needs 1 memory read, a TLB miss 2 (page table + data; assuming a single-level page table). Write the `eat(tlb, mem, hit_ratio)` function!

```python starter
def eat(tlb, mem, hit_ratio):
    return mem
```

<details>
<summary>Solution</summary>

```python solution
def eat(tlb, mem, hit_ratio):
    hit = tlb + mem                  # TLB + the data
    miss = tlb + 2 * mem             # TLB + page table + the data
    return hit_ratio * hit + (1 - hit_ratio) * miss
```

</details>

```python test
assert round(eat(20, 100, 0.8), 1) == 140.0
assert round(eat(20, 100, 0.98), 1) == 122.0
assert round(eat(0, 100, 1.0), 1) == 100.0
print("All checks passed!")
```

### Quick check questions

```quiz
? In a 32-bit address space we use 4 KB pages. How many bits are used for the offset?
= 12
! 4096 = 2¹², the remaining 20 bits are the page number.

? What is thrashing?
+ the system spends more time paging than doing useful work, because there's too little memory for the running processes
- the physical vibration of the hard disk
- flushing the TLB too often
! The fix: fewer concurrent processes or more RAM.

? What is the difference between internal and external fragmentation?
+ internal: unused space remains inside an allocated block; external: free space is scattered in many small pieces
- internal occurs in RAM, external on disk
- there's no difference
! Paging eliminates external fragmentation but causes a little internal (at the end of the page).

? What is Bélády's anomaly?
- the number of page faults drops with fewer frames
+ with FIFO replacement, more frames sometimes cause more page faults
- LRU is always the best
! It doesn't happen with LRU or the optimal algorithm.

? Which page replacement algorithm is the best in theory but impossible to implement in practice?
+ the optimal (OPT): it evicts the page that will be used again the latest
- FIFO
- LRU
- clock
! We don't know the future – it's used as a benchmark.
```
