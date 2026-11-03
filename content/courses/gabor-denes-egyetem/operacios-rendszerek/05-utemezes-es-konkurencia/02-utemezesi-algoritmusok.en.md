---
title: Scheduling Algorithms
summary: FCFS, SJF, SRTF, Round Robin, priority and multilevel scheduling – with Gantt charts and worked examples.
minutes: 30
---

## What you will learn

- how **FCFS**, **SJF**, **SRTF**, **Round Robin** and **priority** scheduling work,
- how to draw a **Gantt chart** and compute the **average waiting time**,
- what **starvation** is and how **aging** helps.

## The common example

All three processes arrive at **0 ms**, in this order:

| Process | CPU burst |
| ------- | --------- |
| P1      | 9 ms      |
| P2      | 3 ms      |
| P3      | 3 ms      |

## FCFS – first come, first served

_First Come, First Served_: a simple queue (FIFO), **non-preemptive**.

```text
| P1                         | P2      | P3      |
0                            9         12        15
```

Waiting: P1 = 0, P2 = 9, P3 = 12 → average **(0 + 9 + 12) / 3 = 7 ms**.

Its drawback is the **convoy effect**: short processes wait a lot behind a long one.

## SJF – shortest first

_Shortest Job First_: chooses the ready process with the **shortest burst** (non-preemptive).

```text
| P2      | P3      | P1                         |
0         3         6                            15
```

Waiting: P2 = 0, P3 = 3, P1 = 6 → average **(0 + 3 + 6) / 3 = 3 ms**.

SJF gives the **smallest average waiting time** – but in practice the burst length is not known in advance; it can only be **estimated** from previous bursts.

## SRTF – shortest remaining time

The **preemptive** version of SJF (_Shortest Remaining Time First_): if a new process arrives whose burst is shorter than the running process's **remaining** time, it takes the CPU.

Example: P1 (arrives 0, burst 7), P2 (arrives 2, burst 4), P3 (arrives 4, burst 1).

```text
| P1    | P2    | P3 | P2    | P1                |
0       2       4    5       7                   12
```

- At 2, P2 (4) < P1 remaining (5) → P2 runs. At 4, P3 (1) < P2 remaining (2) → P3 runs.
- Waiting: P1 = 12 − 0 − 7 = 5, P2 = 7 − 2 − 4 = 1, P3 = 5 − 4 − 1 = 0 → average **2 ms**.

## Round Robin

Each process may run for at most one **time slice** (_quantum_, _q_), then goes to the **end** of the ready queue. It is **preemptive** and has a small response time – the basis of time-sharing systems.

The common example with **q = 3 ms**:

```text
| P1      | P2      | P3      | P1                 |
0         3         6         9                    15
```

Completion: P1 = 15, P2 = 6, P3 = 9. Waiting = completion − burst: P1 = 6, P2 = 3, P3 = 6 → average **5 ms**.

Run the simulation and try it with another quantum or other bursts!

```python run
# Round Robin scheduling simulation: everyone arrives at 0, order is the list order.
from collections import deque

processes = {"P1": 9, "P2": 3, "P3": 3}   # name: CPU burst (ms)
quantum = 3

queue = deque(processes)         # ready queue
left = dict(processes)           # remaining time
time = 0
finish = {}
while queue:
    p = queue.popleft()
    run = min(quantum, left[p])
    print(f"{time:2}–{time + run:2} ms: {p}")
    time += run
    left[p] -= run
    if left[p] > 0:
        queue.append(p)          # back to the end of the queue
    else:
        finish[p] = time

for p, burst in processes.items():
    print(p, "finish:", finish[p], "waiting:", finish[p] - burst)
average = sum(finish[p] - processes[p] for p in processes) / len(processes)
print("average waiting time:", average, "ms")
```

Choosing the quantum is delicate: **too large** → it becomes FCFS; **too small** → the many context switches eat up the time.

## Priority and multilevel scheduling

- **Priority**: every process has a priority, the highest one runs. Its danger is **starvation**: a low-priority process never gets its turn. The fix is **aging**: whatever waits a lot gradually gets a higher priority.
- **Multilevel queues**: separate queues for interactive (foreground) and background processes, each with its own algorithm (e.g. foreground: RR, background: FCFS).
- **Multilevel feedback queues** (_MLFQ_): a process **moves** between queues – one that uses up its whole quantum (CPU-bound) moves down; I/O-bound ones stay at the top. This keeps the machine interactive.

## Summary

- FCFS: simple, but convoy effect. SJF: minimal average waiting, but the burst must be known. SRTF: the preemptive version of SJF.
- Round Robin: rotates per quantum, good response time; the quantum size matters.
- Priority scheduling risks starvation, aging helps; MLFQ is the basis of practical systems.

## Lesson exercise

Three processes arrive at 0 ms, in this order: **P1 = 5 ms**, **P2 = 2 ms**, **P3 = 1 ms**.

```quiz required
? What is the average waiting time (ms) with FCFS scheduling?
= 4
! Waiting: 0, 5, 7 → 12 / 3 = 4.

? With SJF scheduling, which process runs first?
- P1
- P2
+ P3
- all at once
! The one with the shortest burst: P3 (1 ms).

? What is the total (not average!) waiting time (ms) with SJF scheduling?
= 4
! Order: P3 (0–1), P2 (1–3), P1 (3–8). Waiting: 0 + 1 + 3 = 4.

? What is the average waiting time (ms) with Round Robin scheduling, quantum q = 2 ms?
= 3
! P1 0–2, P2 2–4, P3 4–5, P1 5–8. Waiting: P1 = 8 − 5 = 3, P2 = 4 − 2 = 2, P3 = 5 − 1 = 4 → 9 / 3 = 3.

? Which technique prevents starvation in priority scheduling?
+ aging
- convoy effect
- context switching
- batching
! A process that waits a lot gradually gets a higher priority.
```
