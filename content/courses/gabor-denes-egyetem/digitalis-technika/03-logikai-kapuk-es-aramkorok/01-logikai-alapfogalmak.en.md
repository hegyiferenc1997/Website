---
title: Logic Variables and Truth Tables
summary: Logic variables and values, true and complemented forms, turning a word problem into a logic expression, writing a truth table.
minutes: 15
---

## What you will learn

- what a **logic variable** is and what values it can take,
- what the **true** and **complemented** forms mean,
- how to turn a **word problem** into a logic expression,
- how a **truth table** is built.

## Logic variable

A **logic variable** can take only **two values**. These two values have many names:

| 1         | 0       |
| --------- | ------- |
| true      | false   |
| yes       | no      |
| on        | off     |
| high (H)  | low (L) |
| asserted  | negated |

Variables are usually written with **capital letters** (A, B, C …). The **true** form of a variable is the variable itself (A); the **complemented** form is its opposite (A̅, also written A', ¬A, !A).

## Three basic operations in everyday life

- **AND:** *If it is raining AND it is cold → I wear a coat.* True only if both conditions are true.
- **OR:** *If I have a ticket OR a pass → I can board.* True if at least one is true.
- **NOT:** *If the light is NOT green → I stop.* Turns the condition into its opposite.

## From words to a logic expression

**Problem:** *The alarm sounds if the door is open and the code has not been entered.*

1. **Choose variables:**
   A = the door is open, K = the code has been entered, R = the alarm sounds.
2. **Logic expression:** R = A AND NOT K, that is **R = A · K̅**.
3. **Truth table:** compute the output for every input combination.

| A | K | R |
| - | - | - |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | **1** |
| 1 | 1 | 0 |

## The truth table

A **truth table** is a **complete description** of a logic function: it gives the output for every possible input combination.

- With *n* inputs there are **2<sup>n</sup> rows** (2 → 4, 3 → 8, 4 → 16).
- Rows are written in **binary counting order** of the inputs (000, 001, 010, …), so no combination is missed.
- The row number (in decimal) is the binary value of the input combination – the basis of **minterm notation** (topic 4).

**Three-input example:** *The machine starts (Y) only if the guard door is closed (Z) and either the right (J) or the left (B) start button is pressed.* → **Y = Z · (J + B)**

| Z | J | B | Y |
| - | - | - | - |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 |

```python run
# Generating a truth table: Y = Z AND (J OR B)
from itertools import product

print("Z J B | Y")
for z, j, b in product((0, 1), repeat=3):   # in the order 000, 001, ... 111
    y = z and (j or b)
    print(z, j, b, "|", int(y))
```

> **Notation in this course:** AND = `·` (or juxtaposition: AB), OR = `+`, NOT = overline (A̅) or apostrophe (A'). When typing on worksheets the apostrophe is the most convenient: `A·K'`.

## Summary

- A logic variable has two values (0/1); true form: A, complemented: A̅.
- Word problem: choose variables → expression → truth table.
- *n* inputs → 2<sup>n</sup> rows, in binary order.

## Lesson exercise

```quiz required
? Fill in the truth table of the alarm: R = A · K̅
table: A, K -> R = A·K'
! R is 1 only when A = 1 and K = 0.

? How many rows does the truth table of a 4-input function have?
= 16
! 2<sup>n</sup>.

? Fill in: Y = Z · (J + B)
table: Z, J, B -> Y = Z·(J + B)
! Y can be 1 only in the rows where Z = 1, and even there only if J or B is 1.

? *The lamp (L) is on if it is night (E) and the sensor detects motion (M), or if it is switched on by hand (K).* Write the expression for L!
expr: E, M, K -> E·M + K
! AND: `·`, OR: `+`.

? *The boiler (Y) starts if it is cold (H) and the window (A) is not open.* Write the expression for Y!
expr: H, A -> H·A'
! "Not open" is the complemented form: A'.
```
