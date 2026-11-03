---
title: Deadlock
summary: The four necessary conditions of deadlock, the resource allocation graph, the dining philosophers and the handling strategies (banker's algorithm).
minutes: 25
---

## What you will learn

- what a **deadlock** is and its **four necessary conditions** (Coffman conditions),
- how a deadlock shows on a **resource allocation graph**,
- how it can be **prevented**, **avoided** (banker's algorithm), **detected** and **resolved**.

## What is a deadlock?

A **deadlock** occurs when in a group of processes **each** waits for an event (resource) that only **another** member of the group could cause – so nobody ever makes progress.

A classic example with two processes and two locks:

```text
process A:  lock(printer)  →  lock(scanner)   ← waits, B has it
process B:  lock(scanner)  →  lock(printer)   ← waits, A has it
```

In everyday life: an intersection where four cars arrived at the same time and everyone gives way to the one coming from the right.

## The four necessary conditions (Coffman, 1971)

A deadlock can only occur if **all four** hold at the same time:

1. **Mutual exclusion**: a resource can be used by only one process at a time.
2. **Hold and wait**: a process already holds a resource and waits for another one.
3. **No preemption**: a resource cannot be taken away, only released voluntarily.
4. **Circular wait**: there is a cycle P1 → P2 → … → Pn → P1 where everyone waits for a resource held by the next one.

## Resource allocation graph

- circle = process, square = resource,
- **resource → process** edge: the process **holds** the resource,
- **process → resource** edge: the process **requests** the resource.

```text
   ┌────┐  holds    (A)  requests ┌────┐
   │ R1 │ ───────►  ( )  ──────►  │ R2 │
   └────┘                         └────┘
     ▲                              │
     │ requests   (B)       holds   │
     └──────────  ( )  ◄────────────┘
```

If there is **one** instance of each resource, a **cycle** in the graph = deadlock.

## The dining philosophers

Five philosophers sit at a round table with five forks between them. Eating needs **two** forks (left and right). If all five pick up their **left** fork at the same time, everyone waits for the right one → deadlock. One solution: one philosopher reaches in the opposite order (right first) – this breaks the cycle.

## Handling strategies

| Strategy                   | Idea                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **prevention**             | make one of the four conditions impossible, e.g. take locks in a **fixed order** (no cycle)                 |
| **avoidance**              | on every request check whether we stay in a **safe** state (banker's algorithm)                             |
| **detection and recovery** | let it happen, periodically look for cycles, and kill or roll back a process                                |
| **ostrich algorithm**      | ignore it – it is rare and handling is expensive. Most desktop OSes do this; the user restarts the program. |

### The banker's algorithm in brief

A state is **safe** if there is an order in which every process can get its **declared maximum** need and finish.

Example: 12 units of a resource (e.g. 12 tape drives).

| Process | Maximum | Holds now | May still need |
| ------- | ------- | --------- | -------------- |
| P0      | 10      | 5         | 5              |
| P1      | 4       | 2         | 2              |
| P2      | 9       | 2         | 7              |

Free: 12 − (5 + 2 + 2) = **3**.

- P1 still needs 2 ≤ 3 → runs, returns 4 → free **5**.
- P0 needs 5 ≤ 5 → runs, returns 10 → free **10**.
- P2 needs 7 ≤ 10 → runs.

The order **⟨P1, P0, P2⟩** works, so the state is **safe**. The banker grants a request only if the state stays safe afterwards.

## Summary

- Deadlock: everyone waits for someone else, nobody progresses.
- Four necessary conditions: mutual exclusion, hold and wait, no preemption, circular wait.
- Handling: prevention (e.g. fixed lock order), avoidance (banker), detection and recovery, or the ostrich algorithm.

## Lesson exercise

```quiz required
? How many conditions must hold at the same time for a deadlock (Coffman conditions)?
= 4
= four
! Mutual exclusion, hold and wait, no preemption, circular wait.

? Which condition is eliminated if every process takes the locks in the same fixed order?
- mutual exclusion
- hold and wait
- no preemption
+ circular wait
! With a fixed order no cycle can form.

? In the banker example (12 units; P0 holds 5, P1 2, P2 2), how many units are free initially?
= 3
! 12 − 9 = 3.

? Which process can finish first in the example?
- P0
+ P1
- P2
- none of them
! P1 needs only 2 more units, and 3 are free.

? What is the strategy called when the OS simply ignores deadlock?
= ostrich algorithm
= ostrich
! It buries its head in the sand – defending against a rare bug would be expensive.
```
