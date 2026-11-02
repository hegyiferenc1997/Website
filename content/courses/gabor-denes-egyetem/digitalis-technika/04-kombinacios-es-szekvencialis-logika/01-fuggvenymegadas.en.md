---
title: Function Forms – SOP, POS, Minterms and Maxterms
summary: From the truth table to the canonical sum-of-products (SOP) and product-of-sums (POS) forms; minterm, maxterm, Σm and ΠM notation.
minutes: 25
---

## What you will learn

- the design flow of a **combinational circuit**,
- what a **minterm** and a **maxterm** are,
- how to write the **canonical SOP** and **POS** forms from a truth table,
- the short **Σm** and **ΠM** notation.

## The design flow

The outputs of a **combinational circuit** depend only on the present values of the inputs. Design steps:

1. **Word problem** → choose inputs and outputs.
2. Write the **truth table**.
3. Write the **logic function** from the truth table (SOP or POS form).
4. **Simplify** (algebraically or with a Karnaugh map).
5. **Schematic**, implementation (with gates, in NAND–NAND form, on an FPGA …).

## Minterm and maxterm

Take a three-variable function (A, B, C). Each row of the truth table has:

- a **minterm** (m<sub>i</sub>): an AND term that is **1 in exactly that one row**. The row's 1 bits appear in true form, its 0 bits complemented.
- a **maxterm** (M<sub>i</sub>): an OR term that is **0 in exactly that one row**. Here it is reversed: 0 bits in true form, 1 bits complemented.

| row (i) | A B C | minterm m<sub>i</sub> | maxterm M<sub>i</sub> |
| ------- | ----- | --------------------- | --------------------- |
| 0       | 0 0 0 | A̅·B̅·C̅                 | A + B + C             |
| 1       | 0 0 1 | A̅·B̅·C                 | A + B + C̅             |
| 2       | 0 1 0 | A̅·B·C̅                 | A + B̅ + C             |
| 3       | 0 1 1 | A̅·B·C                 | A + B̅ + C̅             |
| 4       | 1 0 0 | A·B̅·C̅                 | A̅ + B + C             |
| 5       | 1 0 1 | A·B̅·C                 | A̅ + B + C̅             |
| 6       | 1 1 0 | A·B·C̅                 | A̅ + B̅ + C             |
| 7       | 1 1 1 | A·B·C                 | A̅ + B̅ + C̅             |

Observe: M<sub>i</sub> = (m<sub>i</sub>)̅ (De Morgan).

## SOP – sum of products (disjunctive normal form)

The function is the **OR of the minterms of the rows where the output is 1**.

**Example** – a three-person voting machine (majority): Y = 1 if at least two inputs are 1.

| row | A B C | Y   |
| --- | ----- | --- |
| 0   | 0 0 0 | 0   |
| 1   | 0 0 1 | 0   |
| 2   | 0 1 0 | 0   |
| 3   | 0 1 1 | 1   |
| 4   | 1 0 0 | 0   |
| 5   | 1 0 1 | 1   |
| 6   | 1 1 0 | 1   |
| 7   | 1 1 1 | 1   |

**Canonical SOP:** Y = A̅BC + AB̅C + ABC̅ + ABC
**Short notation:** Y = **Σm(3, 5, 6, 7)**

In the **canonical** form **every variable appears in every term**, in true or complemented form. After simplification: Y = AB + AC + BC.

## POS – product of sums (conjunctive normal form)

The function is the **AND of the maxterms of the rows where the output is 0**.

For the same table: Y = (A + B + C)(A + B + C̅)(A + B̅ + C)(A̅ + B + C)
**Short notation:** Y = **ΠM(0, 1, 2, 4)**

Σm and ΠM **complement each other**: whatever is not in the Σm list is in the ΠM list (and vice versa).

## Which one to choose?

- Few rows with **1** → SOP is shorter.
- Few rows with **0** → POS is shorter.
- SOP → AND–OR → **NAND–NAND**; POS → OR–AND → **NOR–NOR** implementation.

```python run
# Listing minterms and maxterms of a function
from itertools import product

def majority(a, b, c):
    return int(a + b + c >= 2)

minterms, maxterms = [], []
for i, (a, b, c) in enumerate(product((0, 1), repeat=3)):
    (minterms if majority(a, b, c) else maxterms).append(i)
print("Y = Σm", tuple(minterms))
print("Y = ΠM", tuple(maxterms))
```

## Summary

- Minterm: AND term, 1 in one row; maxterm: OR term, 0 in one row.
- SOP = sum of the minterms of the 1 rows, Σm(…); POS = product of the maxterms of the 0 rows, ΠM(…).
- The two lists complement each other.

## Lesson exercise

```quiz required
? What is the minterm of row 6 of a three-variable (A, B, C) function? Write it as an expression!
expr: A, B, C -> A·B·C'
! 6 = 110: A = 1, B = 1, C = 0.

? What is the maxterm of row 5 (A, B, C)? Write it as an expression!
expr: A, B, C -> A' + B + C'
! 5 = 101; in a maxterm the 1 bits appear complemented.

? Fill in: F = Σm(1, 2, 4, 7)
table: A, B, C -> F = A'B'C + A'BC' + AB'C' + ABC
! The output is 1 in rows 1, 2, 4, 7.

? A three-variable function is F = Σm(0, 3, 5, 6). What is the same in ΠM form? (Give the row numbers separated by commas, ascending!)
= 1, 2, 4, 7
= 1,2,4,7
! Whatever is not in the Σm list is in the ΠM list.

? Write the canonical SOP form, then simplify: F = Σm(2, 3, 6, 7)
expr: A, B, C -> B
limit: 1
same: A'BC' + A'BC + ABC' + ABC
! B = 1 in all four rows.
```
