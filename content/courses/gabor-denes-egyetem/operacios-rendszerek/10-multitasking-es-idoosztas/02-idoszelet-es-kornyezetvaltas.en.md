---
title: Time Slices and Context Switching
summary: The timer interrupt, the steps and cost of a context switch, choosing the quantum with worked examples.
minutes: 20
---

## What you will learn

- how the **timer** makes time-sharing possible,
- what happens during a **context switch** and what it costs,
- how the size of the **quantum** (time slice) affects efficiency and response time.

## The timer

Next to the processor, a hardware **timer** requests an **interrupt** regularly – e.g. every 4 ms. The kernel then checks whether the running process's time slice has expired and, if so, calls the scheduler. On Linux the base rate is the `HZ` value (e.g. 250 Hz → 4 ms); modern kernels can also stay "quiet" when idle (_tickless_), which saves battery on a laptop.

## The context switch

A **context switch** stops one process (thread) and starts another:

1. the kernel saves the running process's **registers** (program counter, stack pointer, general registers) into its **PCB**,
2. it updates the process's state (**ready** or **waiting**),
3. the scheduler picks the next one,
4. it loads that one's registers and – if it is a different process – switches the **memory map** (page table),
5. it switches back to user mode, and the process continues where it left off.

### The cost

The direct cost is a few microseconds, but there is a **hidden cost** too: the new process's data is not in the **cache** and the **TLB**, so it runs slower for the first moments. Switching between threads (in the same process) is cheaper, because the address space stays.

## Choosing the quantum

Let **q** be the quantum and **s** the time of one context switch. If every process uses up its quantum:

- **efficiency** = q / (q + s) – what share of CPU time goes to useful work,
- **overhead** = s / (q + s).

Example: q = 10 ms, s = 1 ms → efficiency 10 / 11 ≈ **91%**, overhead ≈ **9%**.

It also affects response time: if **n** processes alternate, at most **(n − 1) · q** time passes between two runs of a process (ignoring the switches). With 5 processes and a 20 ms quantum that is 4 · 20 = **80 ms** – not yet disturbing.

| Quantum       | Effect                                                      |
| ------------- | ----------------------------------------------------------- |
| **too small** | many switches, large overhead, the CPU "only switches"      |
| **too large** | slow reactions, the system becomes FCFS-like                |
| **good**      | ~80% of CPU bursts fit into one quantum; typically 1–100 ms |

## See it in practice

```bash
vmstat 1 5                                  # cs column: context switches per second
grep ctxt_switches /proc/$$/status          # your shell's voluntary and forced switches
```

A **voluntary** switch happens when the process itself waits (I/O); a **nonvoluntary** one when its time slice has expired.

## Summary

- The timer's regular interrupt gives control back to the scheduler.
- Context switch: saving registers into the PCB, loading the new process, switching the memory map; its hidden cost is the cold cache and TLB.
- Efficiency = q / (q + s); the longest wait between two runs is (n − 1) · q.

## Lesson exercise

```quiz required
? The quantum is 4 ms, a context switch takes 1 ms. What is the overhead in percent?
= 20
= 20%
! s / (q + s) = 1 / 5 = 20%.

? The quantum is 9 ms, a context switch takes 1 ms. What is the efficiency in percent?
= 90
= 90%
! q / (q + s) = 9 / 10 = 90%.

? 6 processes alternate with Round Robin, q = 10 ms. At most how many ms pass between two runs of a process (ignoring the switches)?
= 50
! (n − 1) · q = 5 · 10 = 50 ms.

? Where does the kernel save the running process's registers during a context switch?
+ into the process's PCB
- to disk, into the page file
- into the TLB
- into the user's home folder
! Process Control Block.

? Why is switching between two threads of the same process cheaper?
+ Because the address space (page table) stays; no memory map switch is needed.
- Because threads have no registers.
- Because threads do not use the CPU.
- Because threads are scheduled by the BIOS.
! The cache and TLB contents also partly stay useful.
```
