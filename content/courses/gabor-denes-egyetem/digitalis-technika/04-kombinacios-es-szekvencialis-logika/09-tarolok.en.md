---
title: Latches – SR, S̅R̅ and D Latch
summary: The basic storage element from two cross-coupled gates; NOR-based SR and NAND-based S̅R̅ latches, the forbidden state, SR and RS priority, gated and D latches, switch debouncing.
minutes: 30
---

## What you will learn

- how two cross-coupled gates **remember**,
- how the **NOR-based SR** and **NAND-based S̅R̅** latches work, and their **forbidden state**,
- the **state table** and the **characteristic equation**,
- the difference between the **set-priority (SR)** and **reset-priority (RS)** latch,
- the **gated** (enabled) SR latch and the **D latch**,
- a classic application: **debouncing** a switch.

## Two gates that remember

Connect two NOR gates **crosswise**: the output of each goes to one input of the other. The free inputs are **S** (set) and **R** (reset), the outputs **Q** and **Q̅**.

```text
Q  = NOR(R, Q̅)      ← one gate's inputs: R and the other gate's output
Q̅  = NOR(S, Q)      ← the other gate's inputs: S and the first gate's output
```

- **S = 1, R = 0** → Q = 1 (set).
- **S = 0, R = 1** → Q = 0 (reset).
- **S = 0, R = 0** → the feedback **keeps** the previous state – this is **storage**.
- **S = 1, R = 1** → Q = Q̅ = 0, which contradicts the name Q̅; if both then return to 0 simultaneously, the final state is **undefined** (race). This is the **forbidden** state.

## State table and characteristic equation

Q is the present, Q<sup>+</sup> the next state:

| S | R | Q<sup>+</sup> | operation |
| - | - | ------------- | --------- |
| 0 | 0 | Q             | hold      |
| 0 | 1 | 0             | reset     |
| 1 | 0 | 1             | set       |
| 1 | 1 | –             | forbidden |

The **characteristic equation** (treating the forbidden row as don't care): **Q<sup>+</sup> = S + R̅·Q**, with the condition **S·R = 0**.

## NAND-based S̅R̅ latch

With two cross-coupled **NAND** gates the inputs are **active low**: S̅ = 0 sets, R̅ = 0 resets, S̅ = R̅ = 1 holds, and **S̅ = R̅ = 0 is forbidden** (then Q = Q̅ = 1). Such a latch is found, for example, inside the **555 timer** IC.

## SR and RS priority

The forbidden state can also be handled by **giving one input priority** (as is usual in PLC programming):

- **SR latch (set priority):** for S = R = 1, **Q = 1**. Equation: **Q<sup>+</sup> = S + R̅·Q**
- **RS latch (reset priority):** for S = R = 1, **Q = 0**. Equation: **Q<sup>+</sup> = R̅·(S + Q)**

In emergency-stop circuits reset priority is the safe choice: if both signals are present, the machine should stop.

## Gated SR latch and D latch

With an added **E** (enable) input, S and R act only when E = 1; when E = 0 the latch **holds** its state.

The **D latch** eliminates the forbidden state: it has a single **D** (data) input, with S = D and R = D̅. So:

| E | D | Q<sup>+</sup> |
| - | - | ------------- |
| 0 | X | Q (hold)      |
| 1 | 0 | 0             |
| 1 | 1 | 1             |

**Q<sup>+</sup> = E·D + E̅·Q** – while E = 1, the output **transparently follows** D; when E goes to 0, it remembers the last value. (Well-known IC: **74373** – 8-bit D latch, used for address latching in bus systems.)

## Preset and clear

Many latches also have two **asynchronous** inputs that override everything else: **PRE** (preset, Q = 1) and **CLR** (clear, Q = 0) – often active low. They set the system's **initial state** at power-on (reset).

## Application: debouncing

The contact of a mechanical switch **bounces** for a few ms while closing: it switches between 0 and 1 many times. If the two positions of a **changeover switch** drive the S̅ and R̅ inputs of an S̅R̅ latch, the first contact already sets the latch and further bouncing only causes the “hold” state – the output is **one clean** transition. (For a simple push button the solution is an RC filter + Schmitt trigger or a software delay.)

```python run
# Simulating an SR latch for an input sequence (Q+ = S + R'Q)
q = 0
sequence = [(1, 0), (0, 0), (0, 0), (0, 1), (0, 0), (1, 0)]
for s, r in sequence:
    assert not (s and r), "forbidden state"
    q = s | ((1 - r) & q)
    print(f"S={s} R={r} → Q={q}")
```

## Summary

- Two cross-coupled NOR (or NAND) gates store the state.
- NOR SR: S = R = 1 forbidden; NAND S̅R̅: S̅ = R̅ = 0 forbidden (active low).
- Q<sup>+</sup> = S + R̅Q (SR, set priority); Q<sup>+</sup> = R̅(S + Q) (RS, reset priority).
- D latch: Q<sup>+</sup> = ED + E̅Q, level-triggered, no forbidden state.

## Lesson exercise

```quiz required
? On a NOR-based SR latch S = 0, R = 1. What will Q be?
= 0
! R is the reset.

? Fill in the state table of the set-priority SR latch (Q: present, QN: next state)!
table: S, R, Q -> QN = S + R'·Q
! S = 1 always sets; S = 0, R = 1 resets; S = R = 0 holds.

? Write the characteristic equation of the reset-priority (RS) latch!
expr: S, R, Q -> R'·(S + Q)
! For R = 1 always 0; otherwise set or hold.

? At what level are the inputs of a latch built from NAND gates active, and which combination is forbidden?
- Active high; S = R = 1 is forbidden.
+ Active low; S̅ = R̅ = 0 is forbidden.
- Active low; S̅ = R̅ = 1 is forbidden.
- It has no forbidden combination.

? Write the next state of the D latch as a function of the enable input E and the data input D!
expr: E, D, Q -> E·D + E'·Q
! E = 1: follows D; E = 0: holds.

? What can an S̅R̅ latch be used for next to a changeover switch?
- Frequency division.
+ Filtering out the switch's contact bounce.
- Level shifting.
- Generating the clock.
```
