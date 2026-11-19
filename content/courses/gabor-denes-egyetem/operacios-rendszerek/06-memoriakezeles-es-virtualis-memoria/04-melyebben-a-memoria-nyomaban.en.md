---
title: Deeper – On the Trail of Memory
summary: Address translation with a multi-level page table (the pieces of a 48-bit address), the effective memory access time computed with a TLB and page faults, simulating the clock (second-chance) algorithm and Bélády's anomaly, lazy allocation and the OOM killer, and measuring memory on the virtual machine.
minutes: 45
---

## What you will learn in this lesson

- how the processor splits a **64-bit** machine's virtual address to walk the multi-level page table,
- how to compute the **effective memory access time** with a TLB and page faults – and why even a rare page fault is enough to hurt,
- how the **clock** (second-chance) page replacement algorithm works, which real systems use instead of LRU,
- how **Bélády's anomaly** shows up in a program,
- what **lazy allocation**, overcommit and the **OOM killer** are,
- how to measure memory use on the lab machine.

## 1. Four levels, one address – walking the page table

In the previous lesson you saw: with 32-bit addresses and 4 KB pages, the page table would have 2²⁰ entries, so a **multi-level** table is used. Today's x86-64 processors use 48 of the 64 bits for addressing and split them like this:

```text
 47        39 38        30 29        21 20        12 11            0
[  level 1  ][  level 2  ][  level 3  ][  level 4  ][    offset    ]
    9 bits       9 bits       9 bits       9 bits       12 bits
```

Every level is a table of 512 entries (2⁹) pointing to the next level's table; the lowest gives the frame, to which the 12-bit offset is added. So on a **TLB miss** the processor has to "walk down" the tree with **four** memory reads before it can read the data at all.

**Analogy:** in a library store the shelf mark is "floor 3 / row 12 / shelf 7 / box 41 / page 9". Every level steers towards a smaller area; the advantage of a multi-level page table is that empty floors don't need a shelving system.

The program takes an address apart – change the address and watch which part changes!

```python run
# The pieces of a 48-bit virtual address for x86-64's four-level page table.
addr = 0x7F3A_9C2B_1D48

offset = addr & 0xFFF                      # the lowest 12 bits
indices = [(addr >> (12 + 9 * i)) & 0x1FF for i in range(4)]   # 4 × 9 bits, from the bottom
indices.reverse()                          # level 1 (top bits) first

print(f"address: {addr:#x} = {addr:048b}")
for level, idx in enumerate(indices, start=1):
    print(f"  level {level} table index: {idx:3}  ({idx:09b})")
print(f"  offset within the page: {offset}  ({offset:012b})")
print(f"addressable space: 2^48 bytes = {2**48 // 2**40} TB")
```

## 2. How long does a memory access take? – let's calculate!

### With a TLB

Let a TLB access be 1 ns, a memory read 100 ns, and (for simplicity) a **single-level** page table. On a hit: 1 + 100 ns. On a miss: 1 + 100 (page table) + 100 (data) ns. With hit ratio *h*:

```text
EAT = h · (1 + 100) + (1 − h) · (1 + 100 + 100)
```

At a 98% hit ratio: 0.98 · 101 + 0.02 · 201 = 98.98 + 4.02 = **103 ns**. So address translation causes only a **3%** slowdown – without the TLB it would be 100% (every access would be two).

### With page faults

A page fault (loading a page from disk) is on the order of **8 ms = 8,000,000 ns**. If a fraction *p* of accesses are page faults:

```text
EAT = (1 − p) · 100 + p · 8,000,000   [ns]
```

```python run
# Page fault rate and the effective memory access time (EAT).
memory_ns = 100
page_fault_ns = 8_000_000              # 8 ms: reading the page from disk

for p in [0, 1 / 1_000_000, 1 / 100_000, 1 / 10_000, 1 / 1_000]:
    eat = (1 - p) * memory_ns + p * page_fault_ns
    print(f"every {round(1 / p) if p else '∞':>9}th access a page fault → EAT = {eat:9.1f} ns "
          f"({eat / memory_ns:6.1f}× slower)")

# How large can p be at most if we tolerate no more than a 10% slowdown?
max_p = (1.1 * memory_ns - memory_ns) / (page_fault_ns - memory_ns)
print(f"\n10% slowdown limit: at most every {1 / max_p:,.0f}th access may be a page fault")
```

The result is shocking: if **one in a thousand** accesses is a page fault, the machine is **81 times** slower! For the slowdown to stay under 10%, there may be at most about one page fault per **800,000** accesses. That's why **thrashing** is so dramatic: if memory is too small, the page fault rate rises and the machine almost stops. That's also why an SSD (~0.1 ms page fault) helps a lot – but even it can't replace memory.

## 3. The clock algorithm (second chance)

LRU is good but expensive: on every memory access it would have to update when each page was used. Real systems use a cheap approximation. Every page has a **referenced bit** (_accessed bit_), which the **hardware** sets to 1 when the page is used.

The **clock algorithm** imagines the frames in a circle, with a "hand":

1. When a replacement is needed, it looks at the page at the hand.
2. If its bit is **1** → it gets a **second chance**: the bit is set to 0, and the hand moves on.
3. If its bit is **0** → this one is replaced.

**Analogy:** a porter does rounds of the rooms. Whoever they find awake (bit = 1) they tell: "I'll check next time" (bit = 0), and move on. Whoever is found asleep the second time gets put out.

```python run
# Comparing FIFO, clock (second chance) and LRU on the same reference string.
def fifo(refs, n):
    frames, faults = [], 0
    for page in refs:
        if page not in frames:
            faults += 1
            if len(frames) == n:
                frames.pop(0)
            frames.append(page)
    return faults

def clock(refs, n):
    frames, bit, hand, faults = [None] * n, [0] * n, 0, 0
    for page in refs:
        if page in frames:
            bit[frames.index(page)] = 1          # the hardware signals: it was used
            continue
        faults += 1
        while bit[hand] == 1:                    # second chance: clear the bit, move on
            bit[hand] = 0
            hand = (hand + 1) % n
        frames[hand], bit[hand] = page, 1        # replace; the new page's bit is 1
        hand = (hand + 1) % n
    return faults

def lru(refs, n):
    frames, faults = [], 0
    for page in refs:
        if page in frames:
            frames.remove(page)
        else:
            faults += 1
            if len(frames) == n:
                frames.pop(0)
        frames.append(page)
    return faults

refs = [1, 2, 3, 1, 4, 1, 5, 1, 2, 1, 3, 1, 4]   # page 1 is very "popular"
for name, f in [("FIFO", fifo), ("clock", clock), ("LRU", lru)]:
    print(f"{name:5}: {f(refs, 3)} page faults")
```

On this string, where page 1 is used again and again, FIFO regularly throws it out (10 page faults), clock mostly keeps it because its referenced bit is almost always 1 (9 page faults), and LRU is best with 8. Clock is **almost as good** as LRU, but costs only one bit per page.

## 4. Bélády's anomaly live

Common sense says: **more frames → fewer page faults**. With FIFO this is **not always true**!

```python run
# Bélády's anomaly: with FIFO, more frames can mean MORE page faults.
def fifo(refs, n):
    frames, faults = [], 0
    for page in refs:
        if page not in frames:
            faults += 1
            if len(frames) == n:
                frames.pop(0)
            frames.append(page)
    return faults

refs = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
for n in range(1, 6):
    print(f"{n} frames: {fifo(refs, n):2} page faults")
```

With 3 frames **9**, with 4 frames **10** page faults! This can't happen with LRU and the optimal algorithm (these are so-called **stack algorithms**: the pages in memory with n frames are always a subset of those with n + 1 frames).

## 5. Lazy allocation, overcommit and the OOM killer

If a program asks for 1 GB of memory (`malloc`), Linux says **yes** immediately – but **doesn't actually allocate** anything. It only reserves space in the virtual address space; a page gets a physical frame when the program **first writes** to it (a page fault then provides a new, zeroed frame). This is **lazy allocation** (_demand paging_). That's why you saw in the processes topic that `VmSize` can be much larger than `VmRSS`.

**Overcommit** follows from this: the kernel may "promise" more memory in total than exists, trusting that not everyone will use it all. If memory and swap do run out, the kernel's last resort is the **OOM killer** (_Out Of Memory_): it picks a process (typically the one using the most memory) and terminates it so that the system survives. You see its traces in the log: `journalctl -k | grep -i "out of memory"`.

**Analogy:** airlines also sell more tickets than there are seats (overbooking), because some passengers don't show up. If everyone does appear, someone has to be taken off the plane.

## 6. Measuring on the lab machine

```bash
getconf PAGESIZE                      # page size in bytes (usually 4096)
free -h                               # total, used, free, cache (buff/cache), swap (Swap)
swapon --show                         # the swap file or partition
grep -E 'MemTotal|MemAvailable|Cached|SwapTotal' /proc/meminfo
vmstat 1 5                            # for 5 seconds: si/so columns = paging in and out of swap
```

Watch **lazy allocation**! Open two terminals. In the first:

```bash
python3 -c "x = bytearray(0); input('Enter = allocate 500 MB '); x = bytearray(500 * 1024 * 1024); input('Enter = exit ')"
```

In the second, follow memory (`watch -n 1 free -m`), and press Enter in the first: the `used` value grows by about 500 MB (`bytearray` fills it with zeros, i.e. writes to the pages). After exiting it drops back.

In the `free` output the **buff/cache** column is the page cache: the OS uses free memory to cache files read from disk, but gives it back immediately if a program needs it. That's why it's no problem if Linux has "little free memory" – the **available** column is what counts.

On Windows: **Resource Monitor** (`resmon`) → **Memory** tab. The *Hard Faults/sec* column shows which program causes page faults that need loading from disk; the bar at the bottom shows the *Hardware Reserved / In Use / Modified / Standby / Free* parts.

## Summary

- On x86-64 a 48-bit address splits into 4 × 9 bits of page table indices and a 12-bit offset; a TLB miss needs four memory reads for the translation.
- **EAT** with a TLB: at 98% hits 103 ns (3% slowdown). With page faults: even one in a thousand is a ~81× slowdown – page faults must be extremely rare.
- The **clock algorithm** approximates LRU with one referenced bit; FIFO can suffer from **Bélády's anomaly** (3 frames: 9, 4 frames: 10 page faults).
- Linux **allocates lazily** and **overcommits**; if everything runs out, the **OOM killer** terminates a process.
- `free`, `vmstat`, `/proc/meminfo`, and on Windows Resource Monitor show the state of memory; on Linux the **available** column is what matters.

## Exercise

```quiz required
? On x86-64, how many bits of a 48-bit virtual address are the offset within a 4 KB page?
= 12
! 2^12 = 4096 bytes.

? TLB access 1 ns, memory read 100 ns, single-level page table, 98% TLB hits. What is the effective memory access time (ns)?
= 103
! 0.98 · 101 + 0.02 · 201 = 103.

? A page fault takes 8 ms, a memory read 100 ns. Roughly how many times slower is the machine if one in a thousand accesses is a page fault?
- about 2 times
- about 10 times
+ about 80 times
- about 1000 times
! 0.999 · 100 + 0.001 · 8,000,000 ≈ 8100 ns.

? What does the clock algorithm do if the referenced bit of the page at the hand is 1?
- replaces the page immediately
+ sets the bit to 0 and moves to the next page (second chance)
- writes the page to disk but keeps it in memory
! It only replaces a page whose bit is 0.

? FIFO page replacement on the string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5: with 3 frames there are 9 page faults. How many page faults will there be with 4 frames?
= 10
! This is Bélády's anomaly.

? Which column of Linux's free output shows how much memory a new program can still get?
- free
+ available
- buff/cache
! The OS frees the cache immediately when needed.
```
