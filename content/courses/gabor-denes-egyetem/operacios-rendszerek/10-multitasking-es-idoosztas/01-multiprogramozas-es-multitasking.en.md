---
title: Multiprogramming and Multitasking
summary: Batch systems, multiprogramming, time-sharing, and cooperative and preemptive multitasking.
minutes: 20
---

## What you will learn

- how we got from **batch** processing through **multiprogramming** to **time-sharing**,
- the difference between **parallelism** and **concurrency**,
- how **cooperative** and **preemptive** multitasking differ.

## Batch processing

In the 1950s–60s programs (**jobs**) arrived on punched cards and ran **one after another**. While a job waited for the tape unit, the expensive processor stood **idle**.

```text
CPU: [A computes]  ..(A waits for tape)..  [A computes]  [B computes] ..(B prints).. [B computes]
                   ↑      unused       ↑                              ↑   unused  ↑
```

## Multiprogramming

Idea: keep **several** jobs in memory. If one waits for I/O, the CPU runs **another**.

```text
CPU: [A] [B] [A] [C] [B] [A] …   ← almost always working
```

This required memory protection (jobs must not overwrite each other), scheduling and interrupts. **CPU utilisation** and throughput grew – but you still had to wait hours for a job's result.

## Time-sharing

In the 1960s (CTSS, MULTICS) **time-sharing** appeared: many users sit at **terminals** at once, and the CPU serves them in **very short time slices**, switching quickly. Everyone feels the machine is theirs. The goal is no longer just utilisation but a **short response time**.

The same happens on your laptop today: the browser, the music player, VS Code and the background services take turns in **time slices** – this is **multitasking**.

## Parallelism and concurrency

- **Concurrency**: several tasks **make progress** during a period, but not necessarily at the same instant – they run alternately on one core.
- **Parallelism**: several tasks run **truly at the same instant**, on separate cores.

A single-core machine can do concurrent but not truly parallel execution; an 8-core one runs at most 8 threads in parallel.

## Cooperative and preemptive multitasking

| Aspect        | Cooperative                                  | Preemptive                                  |
| ------------- | -------------------------------------------- | ------------------------------------------- |
| who switches? | the program gives up the CPU **voluntarily** | the **OS** takes it away (timer interrupt)  |
| danger        | a frozen program stops **the whole machine** | a frozen program only freezes itself        |
| examples      | Windows 3.1, (classic) Mac OS 9              | Windows NT and later, Linux, macOS, Android |

The cooperative principle still lives **inside programs**: tasks of the JavaScript event loop or Python `asyncio` voluntarily give up control at `await`.

## Summary

- Batch: one after another, the CPU is often idle. Multiprogramming: another job runs during I/O.
- Time-sharing: short time slices, short response time, many users/programs at once.
- Concurrency = progressing alternately; parallelism = truly at once, on several cores.
- Cooperative: the program gives up the CPU; preemptive: the OS takes it – every modern OS is preemptive.

## Lesson exercise

```quiz required
? What was the main goal of multiprogramming?
+ that the CPU does not stand idle while a job waits for I/O
- that several users can type at once
- that programs become smaller
- that no memory protection is needed
! Increasing CPU utilisation.

? Which concept means that several tasks really run at the same instant, on separate cores?
- concurrency
+ parallelism
- batching
- spooling
! Concurrency can also mean alternating progress on one core.

? With which multitasking can a badly written program freeze the whole machine?
+ cooperative
- preemptive
- both
- neither
! If the program never gives back the CPU, nobody else runs.

? On an 8-core processor, at most how many threads can truly run in parallel (without hyperthreading)?
= 8
! One per core.
```
