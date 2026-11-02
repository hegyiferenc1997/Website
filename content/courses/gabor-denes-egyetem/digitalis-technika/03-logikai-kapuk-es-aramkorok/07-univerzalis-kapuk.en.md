---
title: Universal Gates – NAND and NOR
summary: Why one gate type is enough: NOT, AND, OR and XOR from NAND only or NOR only; converting two-level circuits to NAND–NAND and NOR–NOR form.
minutes: 25
---

## What you will learn

- what it means that a gate is **universal**,
- how to build NOT, AND, OR and XOR **from NAND only** and **from NOR only**,
- how to convert an AND–OR circuit to **NAND–NAND** and an OR–AND circuit to **NOR–NOR** form.

## Universal gate

A gate type is **universal** (functionally complete) if **any logic function** can be built from it. Since every function can be written with AND, OR and NOT, it is enough to show that these three can be built.

**Both NAND and NOR are universal.** That is why they are made in the largest numbers, and why logic on a chip can be built from a single, optimised cell type. (In CMOS technology NAND and NOR are also the simplest and fastest gates: 4 transistors, while AND and OR need 6.)

## Everything from NAND

| Gate | NAND implementation                                  | NAND count |
| ---- | ---------------------------------------------------- | ---------- |
| NOT  | A̅ = (A · A)̅ – the two inputs tied together           | 1          |
| AND  | A · B = ((A · B)̅)̅ – NAND followed by a NAND inverter | 2          |
| OR   | A + B = (A̅ · B̅)̅ – invert the inputs (De Morgan)      | 3          |
| NOR  | OR + inverter                                        | 4          |
| XOR  | N = (AB)̅, Y = ((A·N)̅ · (B·N)̅)̅                        | 4          |

```text
 NOT from NAND:       OR from NAND:

 A ──┬─┤NAND├── A̅     A ─┤NAND├─ A̅ ─┐
     └─┤    │            A ─┤    │     ├─┤NAND├── A + B
                       B ─┤NAND├─ B̅ ─┘
                       B ─┤    │
```

## Everything from NOR

| Gate | NOR implementation             | NOR count |
| ---- | ------------------------------ | --------- |
| NOT  | A̅ = (A + A)̅                    | 1         |
| OR   | A + B = ((A + B)̅)̅              | 2         |
| AND  | A · B = (A̅ + B̅)̅ (De Morgan)    | 3         |
| NAND | AND + inverter                 | 4         |
| XNOR | the dual of the NAND-based XOR | 4         |

## Conversion: AND–OR → NAND–NAND

A **two-level AND–OR** circuit (sum of products, SOP) can be converted **directly** into a NAND–NAND circuit: replace every gate with a NAND, the wiring stays the same.

**Why does it work?** Double negation and De Morgan:

F = A·B + C·D = ((A·B + C·D)̅)̅ = ((A·B)̅ · (C·D)̅)̅

```text
 AND–OR:                          NAND–NAND:
 A ─┤AND ├─┐                      A ─┤NAND├─┐
 B ─┤    │  ├─┤ OR ├── F    ⇒     B ─┤    │  ├─┤NAND├── F
 C ─┤AND ├─┘                      C ─┤NAND├─┘
 D ─┤    │                        D ─┤    │
```

If a variable stands **alone** at the OR input (e.g. F = A·B + C), it must be fed **inverted** to the second-level NAND: F = ((A·B)̅ · C̅)̅.

## Conversion: OR–AND → NOR–NOR

Dually, a **two-level OR–AND** circuit (product of sums, POS) becomes a NOR–NOR circuit:

F = (A + B)·(C + D) = ((A + B)̅ + (C + D)̅)̅

## Bubble pushing

On schematics we often "push bubbles": a negation (bubble) can be moved from one end of a wire to the other if the gate type flips according to De Morgan (AND ↔ OR). Two bubbles on the same wire **cancel** each other.

## Summary

- NAND and NOR are universal: any function can be built from them.
- From NAND: NOT = 1, AND = 2, OR = 3, XOR = 4 gates.
- AND–OR (SOP) → NAND–NAND; OR–AND (POS) → NOR–NOR, the wiring is unchanged.

## Lesson exercise

```quiz required
? How many two-input NAND gates are needed to build an OR gate?
= 3
! Two NAND inverters at the inputs, one NAND at the end (De Morgan).

? How many two-input NAND gates are needed for an XOR gate (minimum)?
= 4
! N = (AB)̅, then (AN)̅ and (BN)̅, finally their NAND.

? What function does this NAND–NAND circuit implement: Y = ((A·B)'·(C·D)')' ? Write it in AND–OR form!
expr: A, B, C, D -> A·B + C·D
limit: 4
same: ((A·B)'·(C·D)')'
! Double negation and De Morgan.

? What function does this circuit implement: Y = ((A·(A·B)')'·(B·(A·B)')')' ?
expr: A, B -> A ⊕ B
same: ((A·(A·B)')'·(B·(A·B)')')'
! The classic four-NAND circuit – fill in the truth table in your head!

? Which gate is not universal?
- NAND
- NOR
+ AND
! AND gates alone cannot invert.

? How many two-input NOR gates are needed to build an AND gate?
= 3
! Two NOR inverters at the inputs, one NOR at the end.
```
