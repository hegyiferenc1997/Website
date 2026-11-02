---
title: The 16 Two-Variable Logic Functions
summary: All 16 possible two-variable functions: constant functions, conjunction, disjunction, inhibition, implication, exclusive OR, equivalence.
minutes: 20
---

## What you will learn

- why there are exactly **16** two-variable logic functions,
- the **name**, **expression** and an **everyday example** of each,
- the role of **implication** and **inhibition**.

## How many functions are there?

Two inputs have 2<sup>2</sup> = 4 combinations (00, 01, 10, 11). Each of the 4 rows can hold 0 or 1, so there are **2<sup>4</sup> = 16** different output columns – i.e. 16 different functions. In general there are **2<sup>2<sup>n</sup></sup>** functions of *n* variables (already 256 for 3 variables).

## The complete list

The output column shows the values for the rows AB = 00, 01, 10, 11, in this order.

| Output (00 01 10 11) | Expression    | Name                                | Example                                                      |
| -------------------- | ------------- | ----------------------------------- | ------------------------------------------------------------ |
| 0 0 0 0              | 0             | **constant zero**                   | always false, regardless of the inputs                       |
| 0 0 0 1              | A · B         | **conjunction** (AND)               | *I go hiking if it is sunny and I have a day off*            |
| 0 0 1 0              | A · B̅         | **inhibition** (A but not B)        | *the machine starts if START = 1 and STOP = 0*               |
| 0 0 1 1              | A             | variable A (transfer)               | the output follows A                                          |
| 0 1 0 0              | A̅ · B         | **inhibition** (B but not A)        | the same with roles swapped                                   |
| 0 1 0 1              | B             | variable B                          | the output follows B                                          |
| 0 1 1 0              | A ⊕ B         | **exclusive OR** (XOR)              | *either the red light is on or the green, but not both*      |
| 0 1 1 1              | A + B         | **disjunction** (OR)                | *it is raining or the wind is blowing*                        |
| 1 0 0 0              | (A + B)̅       | **Peirce arrow** (NOR)              | *I relax if there is neither a test nor a midterm*            |
| 1 0 0 1              | A ⊙ B         | **equivalence** (XNOR)              | *you get an A if and only if you solve every problem*         |
| 1 0 1 0              | B̅             | complement of B                     | –                                                            |
| 1 0 1 1              | A + B̅         | **implication** B → A               | *if B, then A*                                                |
| 1 1 0 0              | A̅             | complement of A                     | *it is not true that today is Monday*                         |
| 1 1 0 1              | A̅ + B         | **implication** A → B               | *if you study, you will pass the exam*                        |
| 1 1 1 0              | (A · B)̅       | **Sheffer stroke** (NAND)           | –                                                            |
| 1 1 1 1              | 1             | **constant one** (tautology)        | always true                                                   |

## Implication

**A → B** ("if A, then B") is **false only when A is true and B is false**: *if you studied but still failed*, the promise was broken. If you didn't study (A = 0), the statement is not violated whatever the exam result – so it is true then.

| A | B | A → B |
| - | - | ----- |
| 0 | 0 | 1     |
| 0 | 1 | 1     |
| 1 | 0 | **0** |
| 1 | 1 | 1     |

Its expression: **A → B = A̅ + B**.

The **contrapositive** is equivalent: A → B = B̅ → A̅.
*If it rains, the street is wet* ⇔ *if the street is not wet, it did not rain.*

## Inhibition

The function **A · B̅** lets the signal A through only if the **inhibiting** signal B is not active. In industrial control this is the basis of **START–STOP** logic: STOP always wins.

## Which are really two-variable functions?

6 of the 16 do not actually depend on both variables: the two constants (0, 1), and A, B, A̅, B̅. The remaining **10** are true two-variable functions.

## Summary

- There are 2<sup>2<sup>n</sup></sup> functions of *n* variables; 16 for two.
- Implication: A → B = A̅ + B, false only for 1 → 0.
- Inhibition: A · B̅, B inhibits A.
- Exclusive OR = XOR, equivalence = XNOR.

## Lesson exercise

```quiz required
? Fill in the truth table of the implication A → B!
table: A, B -> Y = A' + B
! It is false only when A is true and B is false.

? *The conveyor (Y) runs if the START button (S) is pressed and the emergency STOP (V) is not pressed.* Write the expression for Y!
expr: S, V -> S·V'
! Inhibition: V inhibits S.

? How many different three-variable logic functions exist?
= 256
! 2<sup>2<sup>n</sup></sup>, n = 3.

? Which function has the output column 1 0 0 1 (for the rows AB = 00, 01, 10, 11)?
- exclusive OR
+ equivalence
- Peirce arrow
- implication
! It is 1 when the two inputs are equal.

? Which statement is equivalent to "If it rains, the street is wet"?
- If the street is wet, it rained.
- If it does not rain, the street is not wet.
+ If the street is not wet, it did not rain.
! A → B = B̅ → A̅ (contrapositive).

? Write the implication B → A as an expression!
expr: A, B -> A + B'
! X → Y = X̅ + Y, here X = B and Y = A.
```
