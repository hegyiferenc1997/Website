---
title: Practice – Multitasking and Time-Sharing
summary: An experiment with the nice value and cores, review questions and a summary worksheet.
minutes: 25
kind: practice
---

## Experiment: who gets more CPU?

Set the Ubuntu VM to **1 processor** (Settings → System → Processor), so the two processes surely compete.

```bash
# Two endless busy loops: one normal, the other with nice 19.
sh -c 'while :; do :; done' &
nice -n 19 sh -c 'while :; do :; done' &
top                     # watch the %CPU and NI columns, then q
kill %1 %2              # stop both
```

The normal process gets most of the CPU time, the "nice" one only the rest. Afterwards restore the number of processors.

## Review questions

<details>
<summary>1. Why is a 0.01 ms quantum not worth choosing if a context switch takes 0.005 ms?</summary>

Because efficiency would be q / (q + s) = 0.01 / 0.015 ≈ 67%: a third of the CPU time would go just to switching.

</details>

<details>
<summary>2. What is the difference between the goals of multiprogramming and time-sharing?</summary>

Multiprogramming increases CPU utilisation (it should not stand idle during I/O). Time-sharing reduces response time, so many interactive users feel they use the machine alone.

</details>

<details>
<summary>3. Why does Windows boost the priority of the foreground window's threads?</summary>

So that the program the user is currently using reacts quickly to clicks and typing, even if compute-heavy tasks run in the background.

</details>

<details>
<summary>4. Why is it not always good for the kernel to migrate a thread to the least loaded core?</summary>

Because the cache and TLB are cold on the new core, so the thread runs slower for a while. If the load difference is small, it is better to leave it on its original core (affinity).

</details>

## Summary worksheet

```quiz required
? The quantum is 19 ms, a context switch takes 1 ms. What is the efficiency in percent?
= 95
= 95%
! 19 / 20 = 95%.

? 4 processes alternate, q = 25 ms. At most how many ms pass between two runs of a process?
= 75
! (4 − 1) · 25 = 75 ms.

? Which command starts a program with lower priority on Linux?
+ nice -n 10 program
- kill -9 program
- sudo program
- top program
! For running processes: renice.

? Which kind of multitasking does every modern desktop operating system use?
- cooperative
+ preemptive
- batch
- single-tasking
! The OS can take the CPU away with the help of the timer.

? Which Windows priority class is the most dangerous because it can take the CPU even from the system?
+ Realtime
- High
- Normal
- Low
! Levels 16–31 always preempt ordinary threads.

? What do we call it when several tasks make progress in a period but run alternately on one core?
= concurrency
! Parallelism is truly simultaneous running on several cores.
```
