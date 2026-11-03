---
title: Practice – Scheduling and Concurrency
summary: Review questions and a calculation-based summary worksheet on scheduling, semaphores and deadlock.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why can pure SJF not be used in practice?</summary>

Because the length of the next CPU burst is not known in advance. It can be estimated (e.g. with an exponential average of previous bursts), but not known exactly.

</details>

<details>
<summary>2. What happens with Round Robin if the quantum is larger than the longest burst?</summary>

Every process finishes within a single quantum and is never interrupted, so scheduling becomes exactly FCFS.

</details>

<details>
<summary>3. Why is a plain `if (free) free = false;` not enough for locking?</summary>

Because testing and setting are two separate steps: two threads may both see that it is free at the same time, and both enter. An atomic hardware instruction (e.g. test-and-set, compare-and-swap) or a mutex provided by the OS is needed.

</details>

<details>
<summary>4. What is the difference between deadlock and starvation?</summary>

In a deadlock none of the participants progresses; they wait for each other in a cycle. With starvation the system progresses, only one (low-priority) process never gets its turn.

</details>

<details>
<summary>5. How does allowing at most four philosophers to sit down at a time break the deadlock?</summary>

With four philosophers and five forks at least one of them surely gets both forks, eats and returns them – so circular wait cannot form.

</details>

## Summary worksheet

Three processes arrive at 0 ms in this order: **P1 = 4 ms**, **P2 = 8 ms**, **P3 = 2 ms**.

```quiz required
? What is the total waiting time (ms) with FCFS?
= 16
! Waiting: P1 = 0, P2 = 4, P3 = 12 → 16.

? What is the total waiting time (ms) with SJF?
= 8
! Order: P3 (0–2), P1 (2–6), P2 (6–14). Waiting: 0 + 2 + 6 = 8.

? What is the total waiting time (ms) with Round Robin, q = 4 ms?
= 14
! P1 0–4, P2 4–8, P3 8–10, P2 10–14. Waiting: P1 = 0, P2 = 14 − 8 = 6, P3 = 10 − 2 = 8 → 14.

? A semaphore has initial value 2. Four threads call `wait()`, then one thread calls `signal()`. How many threads are blocked afterwards?
= 1
! Two get in, two wait; signal wakes one of them.

? Which is NOT a necessary condition of deadlock?
- mutual exclusion
- hold and wait
- circular wait
+ preemptive scheduling
! The fourth condition is "no preemption".

? Which scheduling gives the smallest average waiting time if the bursts are known and everyone arrives at once?
+ SJF
- FCFS
- Round Robin
- priority, with random priorities
! It can be proven that SJF is optimal for average waiting.
```
