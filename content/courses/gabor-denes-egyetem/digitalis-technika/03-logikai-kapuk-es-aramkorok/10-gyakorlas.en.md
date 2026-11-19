---
title: Practice – Logic Gates and Boolean Algebra
summary: Review questions and a summary worksheet: truth tables, De Morgan, algebraic simplification, universal gates, logic families.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. Why are there exactly 16 logic functions of two variables?</summary>

Because each of the 4 input combinations can be mapped to 0 or 1, so there are 2<sup>4</sup> = 16 different output columns.

</details>

<details>
<summary>2. When is the implication A → B false, and what is its expression?</summary>

Only when A = 1 and B = 0. Its expression: A̅ + B.

</details>

<details>
<summary>3. What is the difference between the dual and the complement of an expression?</summary>

In the dual we swap the · and + signs and the constants 0, 1, without touching the variables. In the complement (De Morgan) every variable is negated as well. E.g. the dual of A + B is A·B, its complement is A̅·B̅.

</details>

<details>
<summary>4. Why is the term BC redundant in AB + A̅C + BC?</summary>

Because if B = C = 1, then the term AB (for A = 1) or A̅C (for A = 0) is already 1, so BC never changes the output (consensus).

</details>

<details>
<summary>5. How does an AND–OR circuit become a NAND–NAND circuit?</summary>

Replace every gate with a NAND, the wiring stays the same (double negation + De Morgan). A variable going directly to the OR gate must be connected inverted.

</details>

<details>
<summary>6. Why must two totem-pole outputs never be connected?</summary>

Because if one drives 1 and the other 0, a short forms through the two output transistors between supply and ground, which can destroy the ICs.

</details>

## Summary worksheet

```quiz required
? Fill in: Y = (A ⊕ B)·C and Z = A·B + C
table: A, B, C -> Y = (A⊕B)·C; Z = A·B + C
! For each row compute A ⊕ B and A·B first.

? Simplify: F = A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
expr: A, B, C -> C'
limit: 1
same: A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
! Factor out C̅.

? Simplify: F = A'·B + A·B' + A·B
expr: A, B -> A + B
limit: 2
same: A'·B + A·B' + A·B
! You may use the A·B term twice.

? Simplify: F = A·B + B·C + B'·C
expr: A, B, C -> A·B + C
limit: 3
same: A·B + B·C + B'·C
! B·C + B̅·C = C.

? Simplify: F = X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
expr: X, Y, Z -> X·Y + X·Z + Y·Z
limit: 6
same: X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
! You can merge the XYZ term with each of its three neighbours.

? Transform so that negation is only on variables: ((A + B)'·C)'
expr: A, B, C -> A + B + C'
same: ((A + B)'·C)'
! Break the line twice.

? How many two-input NOR gates are needed to build a NAND gate?
= 4
! AND = 3 NORs, then one more NOR inverter.

? Which logic family uses almost no power at rest?
- TTL
+ CMOS
- both use the same
! Of the complementary transistor pair, one is always off at rest.

? Which form of A ⊙ B (XNOR) is correct?
- A·B' + A'·B
+ A·B + A'·B'
- (A + B)·(A' + B')
- A' + B
! XNOR is 1 when the two inputs are equal.
```
