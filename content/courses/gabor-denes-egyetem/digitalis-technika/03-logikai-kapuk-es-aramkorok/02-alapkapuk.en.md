---
title: The Basic Gates
summary: NOT, AND, OR, NAND, NOR, XOR and XNOR gates – their notation, truth tables, symbols and the matching ICs.
minutes: 20
---

## What you will learn

- how the seven basic gates work and their **truth tables**,
- the different **notations** for the operations,
- the gate **symbols** (American ANSI and European IEC standards),
- how multi-input gates behave and the common **74-series ICs**.

A **logic gate** is a circuit that implements a logic operation. Every digital system is built from gates – like Lego bricks.

## The seven basic gates

| Gate     | Operation name     | Expression          | When is the output 1?          | IEC symbol    | IC (4 gates) |
| -------- | ------------------ | ------------------- | ------------------------------ | ------------- | ------------ |
| **NOT**  | negation, inverter | Y = A̅               | if A = 0                       | `1` + bubble  | 7404 (6 pcs) |
| **AND**  | conjunction        | Y = A · B           | if **all** inputs are 1        | `&`           | 7408         |
| **OR**   | disjunction        | Y = A + B           | if **at least one** input is 1 | `≥1`          | 7432         |
| **NAND** | Sheffer stroke     | Y = (A · B)̅         | if **not all** are 1           | `&` + bubble  | 7400         |
| **NOR**  | Peirce arrow       | Y = (A + B)̅         | if **all** are 0               | `≥1` + bubble | 7402         |
| **XOR**  | exclusive OR       | Y = A ⊕ B           | if the inputs **differ**       | `=1`          | 7486         |
| **XNOR** | equivalence        | Y = (A ⊕ B)̅ = A ⊙ B | if the inputs are **equal**    | `=1` + bubble | 74266        |

The small **bubble** drawn at an output always means **negation**.

### All truth tables together

| A   | B   | AND | OR  | NAND | NOR | XOR | XNOR |
| --- | --- | --- | --- | ---- | --- | --- | ---- |
| 0   | 0   | 0   | 0   | 1    | 1   | 0   | 1    |
| 0   | 1   | 0   | 1   | 1    | 0   | 1   | 0    |
| 1   | 0   | 0   | 1   | 1    | 0   | 1   | 0    |
| 1   | 1   | 1   | 1   | 0    | 0   | 0   | 1    |

### Symbols

```text
 ANSI (American, "shaped")            IEC (European, rectangle)

 AND:   A ─┤‾‾╲                        A ─┤ & ├─ Y
        B ─┤__╱── Y                    B ─┤   │

 OR:    A ─╲‾‾╲                        A ─┤≥1 ├─ Y
        B ─╱__╱── Y                    B ─┤   │

 NOT:   A ──|▷o── Y                    A ─┤ 1 ├o─ Y
```

> ANSI symbols are used in most English literature and simulators (e.g. Logisim); IEC symbols on European standard drawings.

## Notations

| Operation | Notations                      |
| --------- | ------------------------------ |
| NOT       | A̅, A', ¬A, !A, ~A              |
| AND       | A · B, AB, A ∧ B, A & B, A * B |
| OR        | A + B, A ∨ B, A \| B           |
| XOR       | A ⊕ B, A ^ B                   |
| XNOR      | A ⊙ B, (A ⊕ B)̅                 |

In programming: bitwise operators `&`, `|`, `^`, `~` in C/Java/Python; logical operators `&&`, `||`, `!` (in Python `and`, `or`, `not`).

## Multi-input gates

- **AND:** 1 only if _all_ inputs are 1. **OR:** 1 if _any_ is 1.
- **NAND / NOR:** the negation of multi-input AND / OR.
- **XOR:** with several inputs it is 1 if an **odd number** of inputs are 1 – that is the **parity generator** (topic 2).

## XOR – the "controlled inverter"

A ⊕ 0 = A, A ⊕ 1 = A̅. So one input decides whether the other is passed through or inverted. This is used by the subtractor circuit (topic 4), encryption (_one-time pad_) and the Gray code converter.

```python run
# The basic gates as Python functions (with bitwise operators)
NOT = lambda a: 1 - a
AND = lambda a, b: a & b
OR = lambda a, b: a | b
NAND = lambda a, b: 1 - (a & b)
NOR = lambda a, b: 1 - (a | b)
XOR = lambda a, b: a ^ b
XNOR = lambda a, b: 1 - (a ^ b)

print("A B | AND OR NAND NOR XOR XNOR")
for a in (0, 1):
    for b in (0, 1):
        print(a, b, "|", AND(a, b), "  ", OR(a, b), " ", NAND(a, b), "  ",
              NOR(a, b), " ", XOR(a, b), "  ", XNOR(a, b))
```

## Summary

- AND: all 1 → 1; OR: any 1 → 1; NOT: inverts.
- NAND, NOR, XNOR = AND, OR, XOR + negation (bubble at the output).
- XOR: different → 1; with more inputs an odd number of 1s → 1.

## Lesson exercise

```quiz required
? Fill in the truth tables of the NAND and NOR gates!
table: A, B -> NAND = (A·B)'; NOR = (A+B)'
! NAND: 0 only for 1·1. NOR: 1 only for 0+0.

? Fill in the truth table of the three-input XOR (parity)!
table: A, B, C -> Y = A⊕B⊕C
! It is 1 if an odd number of inputs are 1.

? Which gate outputs 1 when the two inputs are **equal**?
- XOR
- NAND
+ XNOR
- OR
! Equivalence.

? What is the IEC symbol of the OR gate inside the rectangle?
- &
+ ≥1
- =1
- 1
! "At least one" input must be 1.

? What is A ⊕ 1? (Write it as an expression!)
expr: A -> A'
! Applying 1 to one input of an XOR inverts the other.

? Which IC contains four two-input NAND gates?
+ 7400
- 7404
- 7432
- 7486
! The "00" member of the 74 series.
```
