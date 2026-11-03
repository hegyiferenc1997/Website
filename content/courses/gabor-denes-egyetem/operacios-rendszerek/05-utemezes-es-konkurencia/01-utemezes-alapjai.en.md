---
title: Scheduling Basics
summary: CPU and I/O bursts, the scheduler's job, preemptive and non-preemptive scheduling, and the metrics.
minutes: 20
---

## What you will learn

- what a **CPU burst** and an **I/O burst** are, and why their alternation is what makes scheduling worthwhile,
- the difference between **preemptive** and **non-preemptive** scheduling,
- the **metrics** of scheduling: utilisation, throughput, turnaround, waiting and response time.

## Bursts

A process's life is an alternation of **CPU bursts** (computing) and **I/O bursts** (waiting for the disk, network or user):

```text
[ CPU 5 ms ] → [ disk read 8 ms ] → [ CPU 3 ms ] → [ waits for a key … ] → [ CPU 1 ms ] → end
```

- **CPU-bound** process: long CPU bursts (e.g. video encoding, compression).
- **I/O-bound** process: short CPU bursts, a lot of waiting (e.g. text editor, browser).

While a process waits for I/O, the processor can work for **someone else** – the scheduler makes this possible.

## The scheduler and the dispatcher

- The **short-term scheduler** (_CPU scheduler_) selects from the **ready queue** which process (thread) runs next. It runs many times a second, so it has to be fast.
- The **dispatcher** carries out the decision: a **context switch** (saves the old process's registers into its PCB, loads the new one's), switches to user mode and jumps to where the new process left off.

### When does the scheduler decide?

1. the running process starts **waiting** (I/O),
2. the running process **terminates**,
3. its **time slice** expires (timer interrupt),
4. a waiting process becomes **ready** (e.g. its I/O completed).

- **Non-preemptive** (cooperative): switches only in cases 1–2 – the process runs until it voluntarily gives up the CPU.
- **Preemptive**: may **take away** the CPU in cases 3–4 as well. Every modern desktop and server OS works this way.

## Metrics

| Metric              | Meaning                                        | Goal |
| ------------------- | ---------------------------------------------- | ---- |
| **CPU utilisation** | what percentage of the time the CPU is working | max. |
| **throughput**      | number of processes finished per time unit     | max. |
| **turnaround time** | time from arrival to completion                | min. |
| **waiting time**    | total time spent in the ready queue            | min. |
| **response time**   | time from arrival to the **first** run         | min. |

Two useful formulas (if the process does no I/O):

- **turnaround time = completion − arrival**
- **waiting time = turnaround time − CPU burst**

Example: a process arrives at 2 ms, needs 5 ms of CPU and finishes at 12 ms. Its turnaround time is 12 − 2 = **10 ms**, its waiting time 10 − 5 = **5 ms**.

## Summary

- Processes alternate CPU and I/O bursts; during I/O the CPU can run something else.
- The scheduler chooses from the ready queue, the dispatcher performs the context switch.
- With preemptive scheduling the OS can take away the CPU (time slice expiry), with non-preemptive it cannot.
- Turnaround = completion − arrival; waiting = turnaround − burst.

## Lesson exercise

```quiz required
? With which kind of scheduling can the OS take the CPU away from the running process, e.g. when the time slice expires?
+ preemptive
- non-preemptive (cooperative)
- batch
- static
! Every modern desktop OS is preemptive.

? A process arrives at 0 ms and finishes at 9 ms. What is its turnaround time (ms)?
= 9
! Completion − arrival = 9 − 0.

? A process has a turnaround time of 14 ms and a CPU burst of 6 ms (no I/O). What is its waiting time (ms)?
= 8
! 14 − 6 = 8.

? Which metric is the number of processes finished per time unit?
- response time
+ throughput
- waiting time
- CPU utilisation
! E.g. 30 processes per minute.

? What is the dispatcher's job?
- To select the next process.
+ To perform the context switch and start the selected process.
- To delete files.
- To divide memory into pages.
! The scheduler makes the decision, the dispatcher carries it out.
```
