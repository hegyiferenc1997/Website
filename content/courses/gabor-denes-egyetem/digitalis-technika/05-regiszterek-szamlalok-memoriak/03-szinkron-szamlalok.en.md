---
title: Designing Synchronous Counters
summary: Counters with a common clock, design steps with excitation tables and Karnaugh maps, a modulo-5 counter with JK flip-flops, a counter with an arbitrary sequence, checking self-starting.
minutes: 40
---

## What you will learn

- how a **synchronous** counter differs from an asynchronous one,
- the **design steps** of a synchronous counter,
- the complete design of a **modulo-5** counter with **JK flip-flops**,
- designing a counter with an **arbitrary sequence** (also with an intuitive solution),
- how to check whether the counter finds its way back from **unused states**.

## Common clock

In a **synchronous** counter **every flip-flop receives the same clock**, so they switch simultaneously. Which one toggles is decided by **combinational logic** in front of the flip-flop inputs, based on the present state.

- **Advantage:** no accumulating delay, no transient false states; the outputs are valid together, one t<sub>cq</sub> after the edge.
- **Cost:** extra gates are needed.

**4-bit binary up counter** with T flip-flops: a bit toggles when **all the bits below it are 1**:

T0 = 1, T1 = Q0, T2 = Q1·Q0, **T3 = Q2·Q1·Q0**

(With JK flip-flops the same with J = K = T.) Well-known ICs: **74161** (4-bit binary, synchronous load), **74160** (decimal), **74193** (up/down).

## Design steps

1. Write the **state sequence** (state diagram).
2. The required **number of flip-flops**: the smallest n with 2<sup>n</sup> ≥ N.
3. **State table**: present state → next state.
4. For each flip-flop, the required inputs (J, K or D, T) from the **excitation table** (previous topic).
5. **Unused states** are don't cares (X).
6. **K-maps**, simplification → the input functions.
7. **Circuit diagram**, and checking **self-starting**.

## Example: modulo-5 counter with JK flip-flops

Sequence: 000 → 001 → 010 → 011 → 100 → 000. Five states need 3 flip-flops (Q2 Q1 Q0); 101, 110, 111 are unused.

The JK excitation table as a reminder: 0→0: J=0, K=X; 0→1: J=1, K=X; 1→0: J=X, K=1; 1→1: J=X, K=0.

| Q2 Q1 Q0    | next  | J2 K2 | J1 K1 | J0 K0 |
| ----------- | ----- | ----- | ----- | ----- |
| 0 0 0       | 0 0 1 | 0 X   | 0 X   | 1 X   |
| 0 0 1       | 0 1 0 | 0 X   | 1 X   | X 1   |
| 0 1 0       | 0 1 1 | 0 X   | X 0   | 1 X   |
| 0 1 1       | 1 0 0 | 1 X   | X 1   | X 1   |
| 1 0 0       | 0 0 0 | X 1   | 0 X   | 0 X   |
| 1 0 1–1 1 1 | –     | X X   | X X   | X X   |

After simplifying the K-maps (with many Xs):

- **J0 = Q̅2**, **K0 = 1** (K0 = Q̅2 would also do)
- **J1 = Q0**, **K1 = Q0**
- **J2 = Q1·Q0**, **K2 = 1**

Just **one AND gate and an inverter** (Q̅2 can also be taken directly from the flip-flop's inverted output).

### Self-starting

At power-on the counter may be in an **unused** state. Compute with the equations where it goes from there:

- 101 → 010, 110 → 010, 111 → 000

All of them return to the counting cycle, so the counter is **self-starting**. If an unused state led to itself or to another unused state (a closed loop), we would have to fix some of the don't-care entries.

## Arbitrary sequence: 000 → 010 → 100 → 110

A counter need not step by one. For this sequence:

- **Q0** is always 0 → **J0 = 0**, K0 = X (e.g. 1)
- **Q1** changes at every step (0, 1, 0, 1) → toggles: **J1 = K1 = 1**
- **Q2** changes when Q1 = 1 → **J2 = K2 = Q1**

The tabular method gives exactly this **intuitive solution**. In fact it is a two-bit counter counting in bit positions 1 and 2. For the reverse order (110 → 100 → 010 → 000) the wiring J2 = K2 = Q̅1 is needed.

## With D flip-flops

With D flip-flops the excitation table is trivial (**D = Q<sup>+</sup>**), so the bits of the next state go straight into the K-maps. A 2-bit up counter: **D0 = Q̅0**, **D1 = Q1 ⊕ Q0**. This is the solution used on FPGAs, where every flip-flop is of type D.

```python run
# Checking the modulo-5 counter with the JK equations, also from unused states
def jk(j, k, q):
    return (j & (1 - q)) | ((1 - k) & q)

def next_state(s):
    q2, q1, q0 = (s >> 2) & 1, (s >> 1) & 1, s & 1
    j0, k0 = 1 - q2, 1
    j1 = k1 = q0
    j2, k2 = q1 & q0, 1
    return (jk(j2, k2, q2) << 2) | (jk(j1, k1, q1) << 1) | jk(j0, k0, q0)

for s in range(8):
    print(f"{s:03b} → {next_state(s):03b}")
```

## Summary

- Synchronous counter: common clock, toggling controlled by combinational logic; fast, no transient states.
- Design: state table → excitation table → K-map (unused states = X) → equations.
- Modulo-5 with JK: J0 = Q̅2, K0 = 1, J1 = K1 = Q0, J2 = Q1Q0, K2 = 1.
- Always check self-starting!

## Lesson exercise

```quiz required
? In the modulo-5 counter the values of input J0 are: 000 → 1, 010 → 1, 100 → 0, the other rows are don't cares. Give the simplest form of J0!
expr: Q2, Q1, Q0 -> Q2'
limit: 1
dc: 1, 3, 5, 6, 7
! The 1s are all on the Q2 = 0 side, the 0 is on the Q2 = 1 side.

? In the modulo-5 counter J2 is 1 only in state 011, 0 in states 000, 001, 010, and the rest are don't cares. Give J2!
expr: Q2, Q1, Q0 -> Q1·Q0
limit: 2
dc: 4, 5, 6, 7

? In the modulo-5 counter K1 is 0 in state 010, 1 in state 011, and the rest are don't cares. Give K1!
expr: Q2, Q1, Q0 -> Q0
limit: 1
dc: 0, 1, 4, 5, 6, 7

? In a synchronous 4-bit binary up counter, when must bit Q3 toggle? Give T3!
expr: Q2, Q1, Q0 -> Q2·Q1·Q0
! A bit toggles when all the bits below it are 1.

? A 2-bit synchronous up counter is built with D flip-flops. What is the function of input D1?
expr: Q1, Q0 -> Q1 ⊕ Q0
! Q1 changes when Q0 = 1.

? At power-on the designed modulo-5 counter is in the unused state 101. Which state does it go to at the next clock? (Give it in decimal!)
= 2
! J0 = 0, K0 = 1 → Q0 = 0; J1 = K1 = 1 → Q1 toggles; J2 = 0, K2 = 1 → Q2 = 0.
```
