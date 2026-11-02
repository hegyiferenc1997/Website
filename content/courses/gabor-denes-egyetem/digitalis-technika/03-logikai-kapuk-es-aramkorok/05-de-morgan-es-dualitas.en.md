---
title: De Morgan, Duality and More Identities
summary: De Morgan's laws for two and more variables, the principle of duality, consensus, XOR identities, Shannon expansion and the majority function.
minutes: 25
---

## What you will learn

- **De Morgan's laws** and the "break the line, change the sign" rule,
- the **principle of duality**,
- the **consensus** (redundancy) theorem,
- the **XOR** identities, the **Shannon expansion** and the **majority function**.

## De Morgan's laws

The two key transformation rules of **Augustus De Morgan** (1806–1871):

- **(A + B)̅ = A̅ · B̅** – "not (A or B)" = "neither A nor B"
- **(A · B)̅ = A̅ + B̅** – "not (A and B)" = "at least one of A and B is false"

**Proof with a truth table:**

| A | B | (A + B)̅ | A̅ · B̅ | (A · B)̅ | A̅ + B̅ |
| - | - | ------- | ----- | ------- | ----- |
| 0 | 0 | 1       | 1     | 1       | 1     |
| 0 | 1 | 0       | 0     | 1       | 1     |
| 1 | 0 | 0       | 0     | 1       | 1     |
| 1 | 1 | 0       | 0     | 0       | 0     |

**General form, *n* variables:**
(A<sub>1</sub> + A<sub>2</sub> + … + A<sub>n</sub>)̅ = A̅<sub>1</sub> · A̅<sub>2</sub> · … · A̅<sub>n</sub>, and (A<sub>1</sub> · A<sub>2</sub> · … · A<sub>n</sub>)̅ = A̅<sub>1</sub> + A̅<sub>2</sub> + … + A̅<sub>n</sub>

**Rule of thumb:** *"Break the line and change the sign!"* Cut the long overline at the operator, and replace · with + (and vice versa).

**With gates:** a NOR gate = an AND gate with inverted inputs, a NAND gate = an OR gate with inverted inputs. This is the basis of **NAND and NOR conversion** (two lessons later).

**Extended example:** (A · B̅ + C)̅ = (A · B̅)̅ · C̅ = (A̅ + B) · C̅

## The principle of duality

From every valid identity of Boolean algebra we **automatically get another valid identity** if we

- **swap the · and + operations**, and
- **swap the constants 0 and 1** (variables and negations stay as they are).

| Identity               | Its dual                 |
| ---------------------- | ------------------------ |
| A + 0 = A              | A · 1 = A                |
| A · A = A              | A + A = A                |
| A · (A + B) = A        | A + A · B = A            |
| A + B·C = (A + B)(A + C) | A · (B + C) = AB + AC  |

So it is enough to remember one half of each identity.

> **Careful:** the dual expression is **not** the same as the complement! The dual of A + B is A · B, but its complement is A̅ · B̅.

## Consensus (redundancy) theorem

**A·B + A̅·C + B·C = A·B + A̅·C**

The term B·C is **redundant**: if both B and C are true, then depending on A either A·B or A̅·C is true anyway. You recognise the consensus term when two terms contain one variable in true and complemented form (A and A̅), and the third term is the **product of their remainders** (B·C).

Its dual: (A + B)·(A̅ + C)·(B + C) = (A + B)·(A̅ + C)

> The consensus term can be dropped – but in **hazard elimination** (topic 4) we add exactly this term back on purpose!

A related identity: (A + B)·(A̅ + C) = A·C + A̅·B

## XOR and XNOR identities

- definition: A ⊕ B = A·B̅ + A̅·B, A ⊙ B = A·B + A̅·B̅ = (A ⊕ B)̅
- commutative and associative: A ⊕ B = B ⊕ A, (A ⊕ B) ⊕ C = A ⊕ (B ⊕ C)
- with constants: A ⊕ 0 = A, A ⊕ 1 = A̅, A ⊕ A = 0, A ⊕ A̅ = 1
- AND distributes over XOR: A·(B ⊕ C) = A·B ⊕ A·C
- OR can be expressed with XOR: A + B = A ⊕ B ⊕ A·B

## Shannon expansion theorem

Every Boolean function can be expanded around a chosen variable:

**f(A, B, C, …) = A · f(1, B, C, …) + A̅ · f(0, B, C, …)**

That is, we split the function into two "halves": what is the output if A = 1, and what if A = 0. This is the basis of **multiplexer** implementation (topic 4), binary decision diagrams (BDD) and the LUTs of FPGAs.

**Example:** f = A·B + A̅·C → f(1, B, C) = B, f(0, B, C) = C → f = A·B + A̅·C – exactly a 2:1 multiplexer with A as the select signal!

## The majority function

With three inputs it is 1 if **at least two** inputs are 1:

**M = A·B + A·C + B·C = (A + B)·(A + C)·(B + C)**

This function gives the **carry** of a full adder (topic 4), and it is used in "two out of three" voting circuits of fault-tolerant systems (e.g. aircraft, spacecraft).

## Summary

- De Morgan: (A + B)̅ = A̅·B̅, (A·B)̅ = A̅ + B̅ – "break the line, change the sign".
- Duality: swapping + ↔ · and 0 ↔ 1 gives another valid identity.
- Consensus: AB + A̅C + BC = AB + A̅C.
- Shannon: f = A·f(1, …) + A̅·f(0, …).

## Lesson exercise

```quiz required
? Transform with De Morgan (negation only on the variables): (A + B + C)'
expr: A, B, C -> A'·B'·C'
same: (A + B + C)'
! Break the line and change the sign: + → ·.

? Transform with De Morgan (negation only on the variables): (A·B')'
expr: A, B -> A' + B
same: (A·B')'
! (A·B̅)̅ = A̅ + B̿ = A̅ + B.

? Simplify with the consensus theorem: A·B + A'·C + B·C
expr: A, B, C -> A·B + A'·C
limit: 4
same: A·B + A'·C + B·C
! B·C is the consensus term.

? What is the **dual** of A + B·0?
- A' · B' + 1
+ A · (B + 1)
- A + B · 1
- (A + B·0)'
! Swap · and +, and change 0 to 1.

? What is A ⊕ A'? (simplest form)
expr: A -> 1
same: A ⊕ A'
! The XOR of two different values is always 1.

? Fill in the truth table of the three-input majority function!
table: A, B, C -> M = A·B + A·C + B·C
! It is 1 if at least two inputs are 1.
```
