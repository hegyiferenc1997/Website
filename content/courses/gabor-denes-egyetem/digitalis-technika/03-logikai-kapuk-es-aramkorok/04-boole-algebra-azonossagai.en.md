---
title: Identities of Boolean Algebra
summary: The axioms; identity, null, idempotent, complement, double negation, commutative, associative, distributive and absorption laws – with truth-table proofs.
minutes: 25
---

## What you will learn

- the basics of **Boolean algebra**,
- the most important **identities** (laws) and their pairs,
- how to **prove** an identity with a truth table or algebraically.

## What is Boolean algebra?

The English mathematician **George Boole** described the algebra of logic in 1854; in 1937 **Claude Shannon** showed that relay (switching) circuits can be designed with it. Boolean algebra is a system in which

- there are two values: **0** (false) and **1** (true),
- there are three basic operations: **AND** (·), **OR** (+), **NOT** (¯),
- **commutativity**, **associativity** and **distributivity** hold, **identity elements** exist (0 for OR, 1 for AND), and every element has a **complement**.

These guarantee that algebraic manipulations are valid – so we can transform logic expressions much like numbers, just with a few new rules.

## The identities

The identities come **in pairs**: the right one is the **dual** of the left one (swap + ↔ ·, 0 ↔ 1; see the next lesson).

| #   | Law                              | OR form                   | AND form                  |
| --- | -------------------------------- | ------------------------- | ------------------------- |
| 1   | identity                         | A + 0 = A                 | A · 1 = A                 |
| 2   | null / domination                | A + 1 = 1                 | A · 0 = 0                 |
| 3   | idempotent                       | A + A = A                 | A · A = A                 |
| 4   | complement                       | A + A̅ = 1                 | A · A̅ = 0                 |
| 5   | double negation                  | A̿ = A                     |                           |
| 6   | commutative                      | A + B = B + A             | A · B = B · A             |
| 7   | associative                      | A + (B + C) = (A + B) + C | A · (B · C) = (A · B) · C |
| 8   | distributive                     | A + B·C = (A + B)·(A + C) | A · (B + C) = A·B + A·C   |
| 9   | absorption                       | A + A·B = A               | A · (A + B) = A           |
| 10  | redundancy (extended absorption) | A + A̅·B = A + B           | A · (A̅ + B) = A · B       |

> **Careful:** the left side of row 8 (A + B·C = (A + B)·(A + C)) is **not** true in ordinary algebra, but it is in Boolean algebra! Likewise A + A = A (and not 2A).

## Proof with a truth table

An identity is true if the truth tables of both sides agree **in every row**.

**Absorption: A + A·B = A**

| A   | B   | A·B | A + A·B |
| --- | --- | --- | ------- |
| 0   | 0   | 0   | 0       |
| 0   | 1   | 0   | 0       |
| 1   | 0   | 0   | 1       |
| 1   | 1   | 1   | 1       |

The last column is exactly A. ✓

**Redundancy: A + A̅·B = A + B**

| A   | B   | A̅·B | A + A̅·B | A + B |
| --- | --- | --- | ------- | ----- |
| 0   | 0   | 0   | 0       | 0     |
| 0   | 1   | 1   | 1       | 1     |
| 1   | 0   | 0   | 1       | 1     |
| 1   | 1   | 0   | 1       | 1     |

## Algebraic proof

**A + A·B = A:**
A + A·B = A·1 + A·B _(identity)_ = A·(1 + B) _(factoring, distributivity)_ = A·1 _(domination: 1 + B = 1)_ = **A**

**A + A̅·B = A + B:**
A + A̅·B = (A + A̅)·(A + B) _(OR form of distributivity)_ = 1·(A + B) _(complement)_ = **A + B**

**(A + B)·(A + B̅) = A:**
= A·A + A·B̅ + B·A + B·B̅ = A + A·B̅ + A·B + 0 = A·(1 + B̅ + B) = **A**

## Proof by computer

Two variables need 4 rows, three need 8 – the computer checks them in a flash:

```python run
# Checking identities for every input combination
from itertools import product

def identical(left, right, nvars):
    return all(left(*v) == right(*v) for v in product((0, 1), repeat=nvars))

NOT = lambda x: 1 - x
print("A + A·B = A:          ", identical(lambda a, b: a | (a & b), lambda a, b: a, 2))
print("A + A'·B = A + B:     ", identical(lambda a, b: a | (NOT(a) & b), lambda a, b: a | b, 2))
print("A + B·C = (A+B)(A+C): ", identical(lambda a, b, c: a | (b & c),
                                          lambda a, b, c: (a | b) & (a | c), 3))
print("A·(A+B) = A·B ?       ", identical(lambda a, b: a & (a | b), lambda a, b: a & b, 2))
```

The last line is `False`: A·(A + B) is **not** A·B but A (absorption)!

## Summary

- The identities come in pairs (OR and AND form).
- Especially important: complement (A + A̅ = 1, A·A̅ = 0), absorption (A + AB = A), redundancy (A + A̅B = A + B).
- In Boolean algebra A + BC = (A + B)(A + C) is also true.
- Proof: with a truth table or by step-by-step transformation.

## Lesson exercise

```quiz required
? Simplify: A + A·B
expr: A, B -> A
limit: 1
same: A + A·B
! Absorption.

? Simplify: A + A'·B
expr: A, B -> A + B
limit: 2
same: A + A'·B
! Redundancy: A + A̅B = A + B.

? Simplify: A·(A' + B)
expr: A, B -> A·B
limit: 2
same: A·(A' + B)
! Multiply out: A·A̅ + A·B.

? Simplify: (A + B)·(A + C)
expr: A, B, C -> A + B·C
limit: 3
same: (A + B)·(A + C)
! The OR form of distributivity, backwards.

? Which identity is **false** in Boolean algebra?
- A + B·C = (A + B)·(A + C)
- A + A = A
+ A · (A + B) = A · B
- A · A̅ = 0
! Check it with A = 1, B = 0.

? What is A·B·0 + C·1 + C·C̅? (Write the simplest form!)
expr: A, B, C -> C
limit: 1
same: A·B·0 + C·1 + C·C'
! Domination, identity and complement laws.
```
