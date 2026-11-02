---
title: Hazards – Static, Dynamic and Functional
summary: Why a glitch appears at the output of a combinational circuit, how to spot it on a Karnaugh map, and how to remove it with a redundant term.
minutes: 25
---

## What you will learn

- what a **hazard** and a **glitch** are,
- the difference between **static-1**, **static-0**, **dynamic** and **functional** hazards,
- how to spot a static hazard on a **Karnaugh map**,
- how to remove it with a **redundant (consensus) term**,
- why hazards are less dangerous in a **synchronous** system.

## What is a hazard?

A **hazard** is an unwanted, short-lived transition at the output. It is caused by the **delay** of real gates and by the fact that **different paths** from input to output have **different delays**. The short error that disappears by itself is called a **glitch**.

The ideal logic model (truth table, Boolean algebra) **knows nothing about time** – so a hazard cannot be seen from the simplified formula, only from the implementation.

## The classic example

Take the function **F = A·B + A̅·C**. If **B = 1 and C = 1**, then F = A + A̅ = **1**, whatever the value of A.

Suppose B = C = 1 and **A switches from 1 to 0**:

- one branch (A·B) switches off **immediately**,
- the other branch (A̅·C) only switches on **after the inverter delay**.

For a short time **both AND gates output 0**, so the OR gate's output also drops to 0 – although it should stay 1. This is the **static-1 hazard**. The glitch lasts roughly as long as the extra delay of the slower branch (here the inverter's).

```text
A      ‾‾‾‾‾‾‾‾|_______________
A̅      ________|‾‾‾ (late) ‾‾‾‾  ← because of the inverter delay
A·B    ‾‾‾‾‾‾‾‾|_______________
A̅·C    ___________|‾‾‾‾‾‾‾‾‾‾‾‾
F      ‾‾‾‾‾‾‾‾|__|‾‾‾‾‾‾‾‾‾‾‾‾  ← glitch
```

## Types of hazards

| type               | expected behaviour        | what happens       |
| ------------------ | ------------------------- | ------------------ |
| static-1           | stays 1                   | 1 → 0 → 1          |
| static-0           | stays 0                   | 0 → 1 → 0          |
| dynamic            | switches once (0 → 1)     | 0 → 1 → 0 → 1      |
| functional         | several inputs change at once | the intermediate state shows |

- The **static-1** hazard typically appears in **SOP** (AND–OR), the **static-0** in **POS** (OR–AND) implementations.
- The **dynamic** hazard occurs in multi-level circuits, where a signal reaches the output via three or more paths with different delays.
- The **functional** hazard is caused by **two inputs not changing at exactly the same time** (e.g. during 01 → 10, 00 or 11 is visible briefly). It is a property of the function and **cannot** be removed by a redundant term.

## Spotting it on a Karnaugh map

A static-1 hazard may occur where **two adjacent 1 cells are covered by different groups and no group covers both**. The transition happens across that “border”.

The map of F = AB + A̅C (row: A, column: BC):

| A \ BC | 00 | 01 | 11 | 10 |
| ------ | -- | -- | -- | -- |
| 0      | 0  | 1  | 1  | 0  |
| 1      | 0  | 0  | 1  | 1  |

The A̅C group (1, 3) and the AB group (7, 6) touch at **cells 3 and 7** (B = C = 1), but there is no common group.

## Removal: a redundant (consensus) term

Add an **overlapping group** across the border of the two groups: the cell pair 3–7 → **B·C**.

**F = AB + A̅C + BC**

Logically it is the same function (this is the **consensus theorem**: XY + X̅Z + YZ = XY + X̅Z), but when B = C = 1 the BC term holds the output at 1 all the time, whenever A changes. The redundant term is **deliberately “unnecessary”**.

A **static-0** hazard in POS form is removed the same way, with an overlapping OR term between the groups of 0s.

## Other countermeasures

- **Synchronous design:** a clocked storage element samples the output **only at the clock edge**, when the glitches have died away. That is why combinational glitches are mostly harmless in modern (FPGA) design – as long as the signal is not a clock, reset or asynchronous control signal!
- **Delay balancing** or **filtering** the output (RC network) – rarely, rather a workaround.
- Gray-code counters, so that only one bit changes at a time (against functional hazards).

## Summary

- Hazards are caused by different path delays; a glitch appears at the output.
- Static-1 / static-0, dynamic and functional hazards.
- On a K-map: adjacent cells in separate groups → can be removed with a consensus term.
- In a synchronous system the storage element samples only at the clock edge, so a glitch mostly causes no error.

## Lesson exercise

```quiz required
? What is a static-1 hazard?
- The output gets stuck at 1 permanently.
+ The output should stay 1, but drops to 0 for a short time.
- The output bounces several times during a 0 → 1 change.
- Two inputs change at the same time.
! “Static”: the output should not change at all.

? In the circuit F = AB + A̅C, which redundant term removes the static-1 hazard?
+ BC
- AC
- A̅B
- AB̅
! The two groups touch at the B = C = 1 cells.

? Which term removes the hazard in the function F = A̅B̅ + AC?
- A̅C
+ B̅C
- AB̅
- BC̅
! Consensus theorem: XY + X̅Z → YZ, here X = A.

? The inverter delay is 8 ns, the other gates are identical. Approximately how many ns long is the glitch in the classic F = AB + A̅C example?
= 8
= 8ns
! The A̅ branch lags the other by the inverter delay.

? What is a dynamic hazard?
- The output briefly switches to the opposite value, then returns.
+ Instead of a single change the output switches several times (e.g. 0 → 1 → 0 → 1).
- The clock and the data change at the same time.
- The circuit oscillates.
! One change is expected, but several happen.

? Why is a combinational glitch mostly harmless in a synchronous system?
- Because there is no delay in a synchronous system.
- Because the storage elements filter out high-frequency noise.
+ Because the storage elements sample only at the clock edge, by which time the signal has settled.
- Because only NAND gates are used there.
```
