---
title: Mealy Machine – Output from the Input Too
summary: Turning the lamp controller into a Mealy machine, designing an overlapping “101” sequence detector with Mealy and Moore models, comparing the two models.
minutes: 35
---

## What you will learn

- when a machine is a **Mealy machine**,
- how the lamp controller changes if the output **also depends on the buttons**,
- how to design a **sequence detector** (101) with Mealy and Moore models,
- the **advantages and dangers** of the Mealy machine.

## Modifying the lamp controller

Extend the task of the previous lesson: **while any push button is pressed, neither lamp should be lit.**

The state machine (D<sup>+</sup> = PZ̅ + DZ̅ + DP) **does not change** – only the output logic:

- **red lamp = D · (P + Z)̅ = D · P̅ · Z̅**
- **green lamp = D̅ · (P + Z)̅ = D̅ · P̅ · Z̅**

The output now depends on the state **and the inputs** – this is a **Mealy machine**. When a button is pressed the lamp goes out **immediately**, without waiting for the next clock.

## Sequence detector: “101”

Task: data arrives bit by bit, one per clock, on a serial input (x). The output (y) should be 1 when the **last three bits were 101**. Detections may **overlap**: in the sequence 10101 we detect twice.

### Mealy solution – 3 states

The state stores **how much of the pattern we have seen so far**:

- **A** – nothing (initial state),
- **B** – “1” arrived,
- **C** – “10” arrived.

| state   | x = 0     | x = 1     |
| ------- | --------- | --------- |
| A       | A / 0     | B / 0     |
| B       | C / 0     | B / 0     |
| C       | A / 0     | **B / 1** |

(The output follows the “/”.) A 1 arriving in state C completes the pattern: y = 1, and since this 1 may also be the start of a new pattern, we go to B – that makes it overlapping.

**Encoding:** A = 00, B = 01, C = 10 (Q1 Q0); 11 is unused (don't care). From the table:

- **Q0<sup>+</sup> = x** (for x = 1 we always go to B),
- **Q1<sup>+</sup> = Q0 · x̅** (C is reached only from B, with x = 0),
- **y = Q1 · x** – the output contains the input x: a Mealy machine.

Input 1, 0, 1, 0, 1 → output **0, 0, 1, 0, 1**.

### Moore solution – 4 states

In a Moore machine the output may depend only on the state, so a separate “**found it**” state is needed:

| state / output    | x = 0 | x = 1 |
| ----------------- | ----- | ----- |
| A / 0             | A     | B     |
| B / 0             | C     | B     |
| C / 0             | A     | D     |
| **D / 1**         | C     | B     |

From state D we continue “01” as “10” (C) or as “1” (B). The output appears **one clock later**, but **cleanly, aligned to the clock**.

## Mealy or Moore?

| aspect                | Mealy                                         | Moore                                   |
| --------------------- | --------------------------------------------- | --------------------------------------- |
| number of states      | fewer (3 here)                                | more (4 here)                           |
| reaction              | immediately, in the same cycle                | one clock later                         |
| output                | glitches and noise of the input **can pass** to the output | stable, changes only at a clock edge |
| timing                | longer combinational path (input → output)    | shorter, easier to time                 |

In practice the output of a Mealy machine is often **registered** with a flip-flop as well – this makes it clean, but delays it by one cycle, like a Moore machine.

```python run
# The "101" Mealy detector with the encoded equations
def step(q1, q0, x):
    return q0 & (1 - x), x, q1 & x        # Q1+, Q0+, y

q1 = q0 = 0
inputs = [1, 0, 1, 0, 1, 1, 0, 1]
outputs = []
for x in inputs:
    q1, q0, y = step(q1, q0, x)
    outputs.append(y)
print("in: ", inputs)
print("out:", outputs)
```

## Summary

- Mealy machine: the output is a function of the state and the input; it reacts immediately.
- Lamp controller with Mealy outputs: red = D·P̅·Z̅, green = D̅·P̅·Z̅.
- 101 detector: Mealy 3 states (Q0<sup>+</sup> = x, Q1<sup>+</sup> = Q0x̅, y = Q1x), Moore 4 states.
- Mealy: fewer states, faster, but input noise may reach the output.

## Lesson exercise

```quiz required
? Write the output function of the red lamp of the modified lamp controller (not lit while a button is pressed)!
expr: D, P, Z -> D·P'·Z'
! The lamp is lit only if the state is red and no button is pressed.

? How many states does the overlapping “101” detector need as a Mealy machine?
= 3

? And as a Moore machine?
= 4
! A separate state with output 1 is needed.

? The Mealy detector receives 1, 0, 1, 0, 1 in turn. What is the output sequence? (Write it together, e.g. 01010)
= 00101
! Overlap: the second 101 starts with the last 1 of the first.

? The Mealy detector is encoded as A = 00, B = 01, C = 10 (Q1 Q0), 11 is unused. Give the function of output y!
expr: Q1, Q0, X -> Q1·X
limit: 2
dc: 6, 7
! The output is 1 when a 1 arrives in state C.

? With the same encoding, give the next state of Q1!
expr: Q1, Q0, X -> Q0·X'
limit: 2
dc: 6, 7
! State C is reached only from B, with input 0.

? What is one danger of the Mealy machine compared with the Moore machine?
- It needs more flip-flops.
+ Glitches and noise of the input can pass directly to the output.
- It reacts one clock later.
- It cannot be implemented with D flip-flops.
```
