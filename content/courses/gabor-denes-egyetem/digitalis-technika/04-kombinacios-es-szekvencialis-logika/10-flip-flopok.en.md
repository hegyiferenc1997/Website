---
title: Flip-flops – D, JK and T
summary: The edge-triggered D flip-flop and the master–slave structure, JK and T flip-flops, characteristic equations, excitation tables, conversions and frequency division.
minutes: 35
---

## What you will learn

- how two latches make an **edge-triggered** flip-flop (**master–slave**),
- how the **D**, **JK** and **T** flip-flops work and their **characteristic equations**,
- the **excitation table** needed for design,
- how to **convert** one flip-flop into another,
- applications of flip-flops (frequency divider, counter, register).

## Edge-triggered D flip-flop

Two D latches are connected in series; the first (**master**) is transparent while CLK = 0, the second (**slave**) while CLK = 1. When CLK **rises**, the master “closes” (remembers D) and the slave outputs that value. Seen from outside, the output changes **only at the rising edge**:

**Q<sup>+</sup> = D** (at the next active edge)

| CLK   | D   | Q<sup>+</sup> |
| ----- | --- | ------------- |
| ↑     | 0   | 0             |
| ↑     | 1   | 1             |
| other | X   | Q (hold)      |

The D flip-flop is a **one-clock delay** (hence “D” = delay/data). It is the basic building block of modern digital design: every register, FPGA cell and processor pipeline consists of D flip-flops. Well-known IC: **7474** (two D flip-flops with PRE̅ and CLR̅ inputs).

## JK flip-flop

The **JK** flip-flop is an improved SR with **no forbidden state**: for J = K = 1 it **toggles**. The letters J and K honour its inventor, **Jack Kilby**.

| J   | K   | Q<sup>+</sup> | operation |
| --- | --- | ------------- | --------- |
| 0   | 0   | Q             | hold      |
| 0   | 1   | 0             | reset     |
| 1   | 0   | 1             | set       |
| 1   | 1   | Q̅             | toggle    |

**Q<sup>+</sup> = J·Q̅ + K̅·Q**

With the old level-triggered JK latch, for J = K = 1 and a long clock pulse the output toggled **round and round** (race-around). The **master–slave** structure or edge triggering eliminates this. Well-known ICs: **74112**, **7476**.

## T flip-flop

The **T** (toggle) flip-flop has one control input: for T = 1 it **toggles** at every active edge, for T = 0 it **holds**.

| T   | Q<sup>+</sup> |
| --- | ------------- |
| 0   | Q             |
| 1   | Q̅             |

**Q<sup>+</sup> = T ⊕ Q**

It is rarely available ready-made: it is made from a JK flip-flop by wiring **J = K = T**.

## Excitation tables

The characteristic table tells **what the next state will be**. In design we ask the reverse: **what control is needed for a given Q → Q<sup>+</sup> transition?** That is what the **excitation table** is for (X = don't care):

| Q → Q<sup>+</sup> | D   | T   | J   | K   | S   | R   |
| ----------------- | --- | --- | --- | --- | --- | --- |
| 0 → 0             | 0   | 0   | 0   | X   | 0   | X   |
| 0 → 1             | 1   | 1   | 1   | X   | 1   | 0   |
| 1 → 0             | 0   | 1   | X   | 1   | 0   | 1   |
| 1 → 1             | 1   | 0   | X   | 0   | X   | 0   |

Because of the many **X**s of the JK, control logic is often simplest with JK flip-flops – we will exploit this with counters in the next topic.

## Conversions

| from | to  | wiring        |
| ---- | --- | ------------- |
| JK   | D   | J = D, K = D̅  |
| JK   | T   | J = K = T     |
| D    | T   | D = T ⊕ Q     |
| D    | JK  | D = J·Q̅ + K̅·Q |
| SR   | D   | S = D, R = D̅  |

General method: for each row of the target flip-flop's characteristic table, read the required inputs from the existing flip-flop's excitation table, then simplify with a K-map.

## Frequency division

A T flip-flop tied to T = 1 (or a D flip-flop with Q̅ → D feedback) outputs one full period for every **second** edge: the output frequency is **f/2**, with a 50 % duty cycle. n toggling stages in series divide by **f / 2<sup>n</sup>** – this is how 15 divisions turn a 32,768 Hz watch crystal into exactly **1 Hz**.

**Applications:** counters, frequency dividers, shift registers, storage registers, debouncing, memory.

```python run
# JK flip-flop: simulating a clock sequence
def jk(j, k, q):
    return (j & (1 - q)) | ((1 - k) & q)    # Q+ = J·Q̅ + K̅·Q

q = 0
for j, k in [(1, 0), (0, 0), (1, 1), (1, 1), (0, 1), (1, 1)]:
    q = jk(j, k, q)
    print(f"J={j} K={k} → Q={q}")
```

## Summary

- Edge-triggered D flip-flop: Q<sup>+</sup> = D, master–slave structure.
- JK: Q<sup>+</sup> = JQ̅ + K̅Q, J = K = 1 → toggle; T: Q<sup>+</sup> = T ⊕ Q.
- The excitation table gives the inputs required for a Q → Q<sup>+</sup> transition (many Xs for JK).
- A toggling stage halves the frequency; n stages divide by 2<sup>n</sup>.

## Lesson exercise

```quiz required
? Write the characteristic equation of the JK flip-flop!
expr: J, K, Q -> J·Q' + K'·Q
! Toggles for J = K = 1, holds for J = K = 0.

? Fill in the state table of the JK flip-flop (Q: present, QN: next state)!
table: J, K, Q -> QN = J·Q' + K'·Q

? Write the characteristic equation of the T flip-flop!
expr: T, Q -> T ⊕ Q
! T = 1: toggle, T = 0: hold.

? What J and K control is needed on a JK flip-flop for the 0 → 1 transition?
- J = 0, K = 1
+ J = 1, K = X
- J = X, K = 0
- J = 1, K = 1
! Setting (J = 1, K = 0) or toggling (J = 1, K = 1) both give 1.

? How do you wire a JK flip-flop to work as a D flip-flop?
+ J = D, K = D̅
- J = K = D
- J = D̅, K = D
- J = 1, K = D

? A 16 MHz clock passes through three T flip-flops in series, each tied to T = 1. What is the output frequency in MHz?
= 2
= 2MHz
! Each stage halves: 16 / 2³.
```
