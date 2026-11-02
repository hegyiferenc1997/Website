---
title: Graphical Simplification – the Karnaugh Map
summary: Two-, three- and four-variable Karnaugh maps, Gray-code ordering, grouping rules, don't-care entries and reading the POS form.
minutes: 35
---

## What you will learn

- how the **Karnaugh map** (K-map) is built for 2, 3 and 4 variables,
- why rows and columns follow **Gray-code** order,
- the **grouping rules** (1, 2, 4, 8 … cells, adjacency, wrap-around),
- how to use **don't-care** (X) entries,
- how to read the **POS** form from the 0s.

## Why do we need it?

Algebraic simplification (previous topic) easily gets stuck: it is not always obvious which identity to apply. The **Karnaugh map** arranges the truth table so that **adjacent cells differ in exactly one variable**. Merges of the form A·B + A·B̅ = A become visible **at a glance**.

## Structure of the map

Row and column headers follow **Gray-code** order: **00, 01, 11, 10**. So two neighbouring cells differ in one bit only – and the **edges of the map are adjacent too** (after 10 comes 00 again, as if the map were a cylinder).

**Three-variable map** (row: A, column: BC) – each cell holds its minterm number:

| A \ BC | 00  | 01  | 11  | 10  |
| ------ | --- | --- | --- | --- |
| 0      | 0   | 1   | 3   | 2   |
| 1      | 4   | 5   | 7   | 6   |

**Four-variable map** (row: AB, column: CD):

| AB \ CD | 00  | 01  | 11  | 10  |
| ------- | --- | --- | --- | --- |
| 00      | 0   | 1   | 3   | 2   |
| 01      | 4   | 5   | 7   | 6   |
| 11      | 12  | 13  | 15  | 14  |
| 10      | 8   | 9   | 11  | 10  |

Notice that the 3rd and 4th columns (and rows) are “swapped” compared with binary order – that is the Gray code.

## Grouping rules

1. Group only **1** cells (for SOP); don't-care (X) cells may be used but need not be covered.
2. A group has a size that is a **power of 2**: 1, 2, 4, 8, 16 cells, and it is a **rectangle**.
3. Make groups **as large as possible** – the larger the group, the shorter the term. 2<sup>k</sup> cells eliminate k variables.
4. Every 1 must be covered by at least one group; groups may **overlap**.
5. Use **as few** groups as possible: do not add one whose cells are all already covered.
6. Edges wrap around: the left and right columns, the top and bottom rows are adjacent, and the **four corners** can form one group.

**Reading a group:** keep the variables that have **the same value in every cell** of the group (1 → true, 0 → complemented form). Whatever changes drops out.

## Example 1 – corners and centre

F = Σm(0, 2, 5, 7, 8, 10, 13, 15)

| AB \ CD | 00  | 01  | 11  | 10  |
| ------- | --- | --- | --- | --- |
| 00      | 1   | 0   | 0   | 1   |
| 01      | 0   | 1   | 1   | 0   |
| 11      | 0   | 1   | 1   | 0   |
| 10      | 1   | 0   | 0   | 1   |

- The **four corners** (0, 2, 8, 10): B = 0 and D = 0 in each → **B̅·D̅**.
- The **central four** (5, 7, 13, 15): B = 1 and D = 1 → **B·D**.

**F = B̅D̅ + BD** (which is B ⊙ D, i.e. XNOR). The 8 four-literal terms of the canonical form became 2 two-literal terms.

## Example 2 – don't-care entries

A **don't care** (**X** or **d**) row is one whose output **does not matter** – for example because that input combination never occurs (codes 1010…1111 in BCD). We may take them as 0 or 1, whichever gives larger groups.

F = Σm(1, 3, 7, 11, 15) + d(0, 2, 5)

| AB \ CD | 00  | 01  | 11  | 10  |
| ------- | --- | --- | --- | --- |
| 00      | X   | 1   | 1   | X   |
| 01      | 0   | X   | 1   | 0   |
| 11      | 0   | 0   | 1   | 0   |
| 10      | 0   | 0   | 1   | 0   |

- The **CD = 11 column** (3, 7, 15, 11) → **C·D**.
- The remaining 1 (cell 1) is covered with help from the Xs: the quad 1, 3, 5, 7 (5 is a don't care) → **A̅·D**. (The quad 0, 1, 3, 2 → A̅·B̅ is just as good.)

**F = CD + A̅D** – there can be several equally short solutions!

## Reading the POS form

Group the **0** cells the same way; this gives the SOP form of the **complemented function**, which becomes POS by De Morgan. In Example 1 the 0s give F̅ = B̅D + BD̅, therefore

**F = (B + D̅)·(B̅ + D)**

You can also read it directly: write OR terms from the groups of 0s, where a value of 0 gives a true and 1 a complemented variable (as with maxterms).

## Outlook

- It is still usable **up to 5–6 variables** (two to four adjacent 4×4 maps); beyond that it becomes unmanageable.
- The algorithmic method is the **Quine–McCluskey** procedure (tabular merging), or the **Espresso** heuristic – these are used by synthesis tools.
- The **Veitch diagram** is a relative of the K-map with a different placement of variables.

```python run
# Printing a four-variable function's Karnaugh map in Gray order
gray = ["00", "01", "11", "10"]
ones = {0, 2, 5, 7, 8, 10, 13, 15}

print("AB\\CD " + "  ".join(gray))
for ab in gray:
    row = []
    for cd in gray:
        i = int(ab + cd, 2)        # minterm number of the cell
        row.append(" 1" if i in ones else " 0")
    print(ab + "    " + "  ".join(row))
```

## Summary

- The K-map uses Gray order, so adjacent cells differ in one bit, and the edges are adjacent too.
- Group: a rectangle of 2<sup>k</sup> cells, as large and as few as possible; k variables drop out.
- Don't-care cells may freely be taken as 0 or 1.
- 1s → SOP, 0s → POS.

## Lesson exercise

```quiz required
? In what order do the column headers of a K-map follow each other for two variables?
- 00, 01, 10, 11
+ 00, 01, 11, 10
- 00, 10, 01, 11
- 11, 10, 01, 00
! Adjacent headers may differ in one bit only (Gray code).

? On a four-variable map, how many variables does a 4-cell group eliminate?
= 2
! 2^k cells eliminate k variables.

? Simplify with a K-map: F = Σm(0, 1, 2, 3, 6, 7) (A, B, C)!
expr: A, B, C -> A' + B
limit: 2
same: A'B'C' + A'B'C + A'BC' + A'BC + ABC' + ABC
! The whole A = 0 row as a quad, plus the BC = 1x column pair.

? Simplify: F = Σm(0, 2, 5, 7, 8, 10, 13, 15) (A, B, C, D)!
expr: A, B, C, D -> B'D' + BD
limit: 4
same: A'B'C'D' + A'B'CD' + A'BC'D + A'BCD + AB'C'D' + AB'CD' + ABC'D + ABCD
! The four corners and the central quad.

? Simplify using the don't-care entries: F = Σm(1, 3, 7, 11, 15) + d(0, 2, 5) (A, B, C, D)!
expr: A, B, C, D -> A'D + CD
limit: 4
dc: 0, 2, 5
! The CD = 11 column is a quad; cell 1 is covered by a quad that includes Xs.
```
