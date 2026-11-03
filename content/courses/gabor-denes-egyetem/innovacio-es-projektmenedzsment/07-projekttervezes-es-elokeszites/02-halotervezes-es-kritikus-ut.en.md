---
title: Network Planning and the Critical Path
summary: The network diagram, the forward and backward pass (ES, EF, LS, LF), float and the critical path method (CPM) step by step, on a worked example.
minutes: 30
---

## What you will learn

- how to draw a **network diagram** from the activities,
- how to calculate the **earliest** and **latest** start and finish times,
- what **float** is and what the **critical path** is.

## The network diagram

A **network diagram** shows activities and the dependencies between them. The most common form is **Activity on Node** (AON): every box is an activity, the arrows are dependencies (usually FS).

## The worked example

Activities of a small web project:

| Activity | Description             | Duration (days) | Predecessor |
| -------- | ----------------------- | --------------- | ----------- |
| A        | gather requirements     | 3               | –           |
| B        | design the database     | 2               | A           |
| C        | design the UI           | 4               | A           |
| D        | develop the back end    | 3               | B           |
| E        | integration and testing | 2               | C, D        |

```text
            ┌───► B (2) ───► D (3) ───┐
 A (3) ─────┤                         ├───► E (2)
            └───► C (4) ──────────────┘
```

## 1. Forward pass – earliest times

- **ES** (Early Start) = the **maximum** of the predecessors' **EF** (0 for the first activity).
- **EF** (Early Finish) = **ES + duration**.

| Act. | ES            | EF         |
| ---- | ------------- | ---------- |
| A    | 0             | 0 + 3 = 3  |
| B    | 3             | 3 + 2 = 5  |
| C    | 3             | 3 + 4 = 7  |
| D    | 5             | 5 + 3 = 8  |
| E    | max(7, 8) = 8 | 8 + 2 = 10 |

The project's **shortest duration** is the EF of the last activity: **10 days**.

## 2. Backward pass – latest times

- **LF** (Late Finish) = the **minimum** of the successors' **LS** (for the last one, the project end, 10).
- **LS** (Late Start) = **LF − duration**.

| Act. | LF            | LS         |
| ---- | ------------- | ---------- |
| E    | 10            | 10 − 2 = 8 |
| D    | 8             | 8 − 3 = 5  |
| C    | 8             | 8 − 4 = 4  |
| B    | 5             | 5 − 2 = 3  |
| A    | min(3, 4) = 3 | 3 − 3 = 0  |

## 3. Float and the critical path

**Total float** shows how much an activity can slip without delaying the end of the project:

> **float = LS − ES = LF − EF**

| Act. | ES  | LS  | Float |
| ---- | --- | --- | ----- |
| A    | 0   | 0   | **0** |
| B    | 3   | 3   | **0** |
| C    | 3   | 4   | 1     |
| D    | 5   | 5   | **0** |
| E    | 8   | 8   | **0** |

The **critical path** is the chain of activities with **zero float**, which is also the **longest** path through the network: **A → B → D → E** (3 + 2 + 3 + 2 = 10 days). The other path, A → C → E, is only 9 days.

> **Every day of delay** on a critical-path activity delays the project end too. That is why we watch them most closely. Activity C can slip 1 day "for free".

## In one box: node notation

```text
 ┌──────┬──────┬──────┐
 │  ES  │ dur. │  EF  │
 ├──────┴──────┴──────┤
 │      activity      │
 ├──────┬──────┬──────┤
 │  LS  │float │  LF  │
 └──────┴──────┴──────┘
```

## Summary

- Forward: ES = max(predecessors' EF), EF = ES + duration.
- Backward: LF = min(successors' LS), LS = LF − duration.
- Float = LS − ES; the critical path is the longest path with zero float.
- The project duration is the length of the critical path.

## Lesson exercise

```quiz required
? What is the shortest duration of the example project above, in days?
= 10
= 10 days
! The earliest finish (EF) of activity E.

? What is the float of activity C, in days?
= 1
= 1 day
! LS − ES = 4 − 3.

? Which is the critical path of the example?
- A → C → E
+ A → B → D → E
- A → B → C
- B → D → E
! The chain of zero-float activities, 10 days.

? An activity's predecessors have EF values of 6 and 9 days. What is the activity's ES?
= 9
= 9 days
! ES = the maximum of the predecessors' EF.

? If activity D slips 2 days, how many days will the project take?
= 12
= 12 days
! D is on the critical path (float 0), so the whole delay pushes the project end.
```
