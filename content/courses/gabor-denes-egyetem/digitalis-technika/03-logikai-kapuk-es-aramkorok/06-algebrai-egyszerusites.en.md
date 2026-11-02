---
title: Algebraic Simplification of Logic Functions
summary: Step-by-step worked examples: factoring, complement, absorption, De Morgan; simplifying minterm and maxterm forms.
minutes: 30
---

## What you will learn

- **why** we simplify,
- a proven **sequence of steps** for algebraic simplification,
- many **worked examples**, with the identity used at each step.

## Why simplify?

The same function can be written by many expressions. The **fewer literals** (variable occurrences) and terms, the **fewer gates** are needed: the circuit is cheaper, smaller, faster and uses less power.

## The proven sequence of steps

1. **Multiply out** brackets (distributivity): A(B + C) = AB + AC.
2. Remove **zero terms**: X·X̅ = 0, and anything multiplied by 0 disappears.
3. Merge **repetitions**: X + X = X, X·X = X.
4. **Factor out** the common factor, then use the **complement**: XY + XY̅ = X(Y + Y̅) = X.
5. **Absorption**: X + XY = X, and X + X̅Y = X + Y.
6. If needed, **De Morgan**, so that negation is only on variables.

After each step it is worth checking with one or two input combinations!

## Worked examples

### Example 1: F = A·B + A(B + C) + B(B + C)

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | AB + AB + AC + BB + BC | multiply out |
| 2 | AB + AC + B + BC | idempotence (AB + AB = AB, BB = B) |
| 3 | AB + AC + B | absorption (B + BC = B) |
| 4 | **B + AC** | absorption (B + AB = B) |

### Example 2: F = A + A̅·C

Redundancy: X + X̅Y = X + Y → **F = A + C**.
*Another proof:* A = A(C + C̅) → F = AC + AC̅ + A̅C = AC + AC̅ + AC + A̅C = A(C + C̅) + C(A + A̅) = **A + C**.

### Example 3: F = A·B̅·C + A + A̅·B·C

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | A + A̅BC | absorption (A + AB̅C = A) |
| 2 | **A + BC** | redundancy (X + X̅Y = X + Y) |

### Example 4: F = A(B + C(AB + AC))

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | A(B + ABC + AC) | multiply out the inner bracket (C·C = C) |
| 2 | A(B + AC) | absorption (B + ABC = B) |
| 3 | AB + AAC = AB + AC | multiply out, idempotence |
| 4 | **A(B + C)** | factoring |

### Example 5: F = W·X·Y̅ + W·X·Y + W̅·X·Y + W·X̅·Y + W·X̅·Y̅

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | WX(Y̅ + Y) + W̅XY + WX̅(Y + Y̅) | factoring |
| 2 | WX + W̅XY + WX̅ | complement (Y + Y̅ = 1) |
| 3 | W(X + X̅) + W̅XY = W + W̅XY | factoring, complement |
| 4 | **W + XY** | redundancy |

### Example 6: F = (A + B)(A + B + D)·D̅

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | (A + B)·D̅ | absorption: X·(X + D) = X, with X = A + B |
| 2 | **A·D̅ + B·D̅** | distributivity |

### Example 7: minterm form – F(A, B, C) = Σm(0, 1, 6, 7)

The output is 1 in rows 0, 1, 6, 7: 000, 001, 110, 111.

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | A̅B̅C̅ + A̅B̅C + ABC̅ + ABC | writing the minterms |
| 2 | A̅B̅(C̅ + C) + AB(C̅ + C) | factoring |
| 3 | **A̅B̅ + AB** = A ⊙ B | complement, identity |

The result is the **equivalence** (XNOR) of A and B – it does not depend on C at all!

### Example 8: maxterm form – F(A, B, C) = ΠM(2, 3, 4, 5)

The output is 0 in rows 2, 3, 4, 5. A maxterm ORs the **complements** of the row's bits (0 → true, 1 → complemented): 010 → (A + B̅ + C).

| Step | Expression | Identity |
| ---- | ---------- | -------- |
| 1 | (A + B̅ + C)(A + B̅ + C̅)(A̅ + B + C)(A̅ + B + C̅) | writing the maxterms |
| 2 | (A + B̅)(A̅ + B) | (X + Y)(X + Y̅) = X, twice |
| 3 | **A·B + A̅·B̅** = A ⊙ B | multiply out (AA̅ = BB̅ = 0) |

This is the same function as Example 7 – since Σm(0, 1, 6, 7) and ΠM(2, 3, 4, 5) describe the same truth table!

```python run
# Check: do the original and simplified forms agree for every input?
from itertools import product

def same(f, g, n):
    return all(f(*v) == g(*v) for v in product((0, 1), repeat=n))

N = lambda x: 1 - x
original = lambda w, x, y: (w & x & N(y)) | (w & x & y) | (N(w) & x & y) | (w & N(x) & y) | (w & N(x) & N(y))
simple = lambda w, x, y: w | (x & y)
print("Example 5:", same(original, simple, 3))

original7 = lambda a, b, c: (a, b, c) in {(0, 0, 0), (0, 0, 1), (1, 1, 0), (1, 1, 1)}
print("Example 7:", same(lambda a, b, c: int(original7(a, b, c)), lambda a, b, c: 1 - (a ^ b), 3))
```

## Summary

- Goal: fewer literals and terms → fewer gates.
- Steps: multiply out → zero terms → repetitions → factoring + complement → absorption → De Morgan.
- Always check the result with a truth table or a few substitutions.
- For larger functions the graphical (Karnaugh map) method is faster – coming in topic 4.

## Lesson exercise

```quiz required
? Simplify: F = A·B + A·B'
expr: A, B -> A
limit: 1
same: A·B + A·B'
! Factor out, then B + B̅ = 1.

? Simplify: F = A'·B'·C + A'·B·C + A·B'·C + A·B·C
expr: A, B, C -> C
limit: 1
same: A'·B'·C + A'·B·C + A·B'·C + A·B·C
! Factor out C; what remains is every AB combination.

? Simplify: F = A'·B·C + A·B'·C + A·B·C' + A·B·C
expr: A, B, C -> A·B + A·C + B·C
limit: 6
same: A'·B·C + A·B'·C + A·B·C' + A·B·C
! You may use the ABC term three times (X + X = X), merging it with each neighbour.

? Simplify: F = (A + B)·(A + B')
expr: A, B -> A
limit: 1
same: (A + B)·(A + B')
! (X + Y)(X + Y̅) = X.

? Simplify: F = A·B + A·(B + C) + B·(B + C)
expr: A, B, C -> B + A·C
limit: 3
same: A·B + A·(B + C) + B·(B + C)
! This is worked example 1 – try it without peeking!

? Simplify: F = (A·B + C)'·A (at the end, negation only on variables)
expr: A, B, C -> A·B'·C'
limit: 3
same: (A·B + C)'·A
! De Morgan: (AB + C)̅ = (A̅ + B̅)·C̅, then multiply by A.
```
