---
title: Designing a Moore Machine – Lamp Control with Two Push Buttons
summary: The complete design of a Moore state machine from the word problem through the state diagram, state table and Karnaugh map to the circuit built with a D flip-flop.
minutes: 35
---

## What you will learn

- how to get from a **word problem** to a finished circuit,
- how to draw a **state diagram** and write a **state table**,
- how to obtain the **next-state logic** algebraically and with a K-map,
- how the **output logic** of a Moore machine is made.

## 1. The word problem

There are two push buttons – **Red** (P) and **Green** (Z) – and two lamps – red and green.

- If the **red** lamp is on and we press the **Green** button, the **green** lamp should light.
- If the **green** lamp is on and we press the **Red** button, the **red** lamp should light.
- If we press **neither** button, or **both**, the machine should **not change** state.

Inputs: P, Z (1 = pressed). Outputs: the two lamps. (The letters come from the Hungarian names: **P**iros = red, **Z**öld = green.)

## 2. States and state diagram

Two states are enough: **RED** (the red lamp is on) and **GREEN** (the green lamp is on).

```text
            P·Z̅ (only the Red button)
   ┌──────────────────────────────┐
   │                              ▼
 (GREEN / green lamp)        (RED / red lamp)
   ▲   ↺ otherwise                │  ↺ otherwise
   └──────────────────────────────┘
            Z·P̅ (only the Green button)
```

Moore machine: the output (which lamp is on) depends **only on the state**, so it is written in the state circle.

## 3. State encoding and outputs

Two states need **one** flip-flop (D). Encoding: **D = 1 → RED**, **D = 0 → GREEN**.

The output logic is then trivial: **red lamp = D**, **green lamp = D̅** – the two outputs of the flip-flop drive the lamps directly.

## 4. State table

For a D flip-flop the **next state** must be applied to the input: D<sup>+</sup> (the notation D(N+1) is also common).

| D   | P   | Z   | D<sup>+</sup> | explanation                   |
| --- | --- | --- | ------------- | ----------------------------- |
| 0   | 0   | 0   | 0             | green, no button → stays      |
| 0   | 0   | 1   | 0             | green, Green button → stays   |
| 0   | 1   | 0   | 1             | green, **Red button → red**   |
| 0   | 1   | 1   | 0             | both buttons → stays          |
| 1   | 0   | 0   | 1             | red, no button → stays        |
| 1   | 0   | 1   | 0             | red, **Green button → green** |
| 1   | 1   | 0   | 1             | red, Red button → stays       |
| 1   | 1   | 1   | 1             | both buttons → stays          |

## 5. Writing and simplifying the function

**Sum of products** (the 1 rows): D<sup>+</sup> = D̅PZ̅ + DP̅Z̅ + DPZ̅ + DPZ

**Graphical simplification** (row: D, column: PZ):

| D \ PZ | 00  | 01  | 11  | 10  |
| ------ | --- | --- | --- | --- |
| 0      | 0   | 0   | 0   | 1   |
| 1      | 1   | 0   | 1   | 1   |

- the PZ = 10 column (2, 6) → **P·Z̅**
- cells 00 and 10 of the D = 1 row (4, 6) → **D·Z̅**
- cells 11 and 10 of the D = 1 row (7, 6) → **D·P**

**D<sup>+</sup> = P·Z̅ + D·Z̅ + D·P**

Curiosity: this is the **majority function** of three signals – D, P and Z̅ –: the state becomes 1 if at least two of the three are 1.

**Algebraically** we arrive at the same: D<sup>+</sup> = D·(Z̅ + P) + D̅·P·Z̅ – after expansion and the consensus theorem.

## 6. Circuit implementation

- one **D flip-flop** (e.g. one half of a 7474),
- the majority logic at its D input: three two-input AND gates and a three-input OR gate (or four NAND gates in NAND–NAND form), plus an inverter for Z̅,
- the Q output drives the red lamp, the Q̅ output the green lamp (through a driver transistor).

The buttons must be **debounced** and **synchronised** (a two-flip-flop chain), since they are asynchronous external signals.

```python run
# Simulating the lamp-control Moore machine for a sequence of button presses
def next_state(d, p, z):
    return (p & (1 - z)) | (d & (1 - z)) | (d & p)   # D+ = P·Z̅ + D·Z̅ + D·P

d = 1                                                # start: red lamp
for p, z in [(0, 0), (0, 1), (0, 0), (1, 1), (1, 0), (0, 0)]:
    d = next_state(d, p, z)
    print(f"P={p} Z={z} → {'red' if d else 'green'} lamp")
```

## Summary

- Design steps: words → state diagram → encoding → state table → function → simplification → circuit.
- Two states → one D flip-flop; Moore outputs: red = D, green = D̅.
- D<sup>+</sup> = PZ̅ + DZ̅ + DP (majority function).

## Lesson exercise

```quiz required
? How many states does the lamp-control machine have?
= 2

? Fill in the state table of the lamp controller (D = 1: red lamp; DN is the next state)!
table: D, P, Z -> DN = P·Z' + D·Z' + D·P
! There is a change only when exactly the “other” button is pressed.

? Write the simplified function of the next state (D+)!
expr: D, P, Z -> P·Z' + D·Z' + D·P
limit: 6
same: D·(Z' + P) + D'·P·Z'
! K-map: the PZ = 10 column, and the two pairs of the D = 1 row.

? What is the output function of the red lamp in this Moore machine?
+ D
- D̅
- D·P
- P·Z̅

? Why is the output of a Moore machine stable between two clocks?
- Because a Moore machine has no clock.
+ Because the output depends only on the state, which changes only at a clock edge.
- Because the inputs are filtered by double negation.
- Because the output logic also consists of flip-flops.
```
