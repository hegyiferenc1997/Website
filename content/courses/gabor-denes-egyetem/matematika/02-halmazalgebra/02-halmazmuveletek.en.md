---
title: Set Operations
summary: Union, intersection, difference, complement and symmetric difference – with Venn diagrams and Python.
minutes: 20
---

## What you will learn

- the notions of **union**, **intersection**, **difference**, **complement** and **symmetric difference**,
- how to draw them on a **Venn diagram**,
- what it means that two sets are **disjoint**.

## The operations

Let $U$ be the **universal set**, $A, B \subseteq U$.

| Operation               | Notation         | Definition                                  | Python      |
| ----------------------- | ---------------- | ------------------------------------------- | ----------- |
| union                   | $A \cup B$       | $\{x : x \in A \text{ or } x \in B\}$       | `A \| B`    |
| intersection            | $A \cap B$       | $\{x : x \in A \text{ and } x \in B\}$      | `A & B`     |
| difference              | $A \setminus B$  | $\{x : x \in A \text{ and } x \notin B\}$   | `A - B`     |
| complement              | $\overline{A}$   | $\{x \in U : x \notin A\}$                  | `U - A`     |
| symmetric difference    | $A \triangle B$  | $(A \setminus B) \cup (B \setminus A)$      | `A ^ B`     |

"Or" here is **inclusive**: elements in both sets are in the union too. If $A \cap B = \emptyset$, the two sets are **disjoint** (no common element).

## Venn diagram

```text
        U
  ┌───────────────────────────┐
  │     A ┌─────┐             │
  │   ┌───┼──┐  │ B           │
  │   │ 1 │ 2│ 3│             │      1 = A \ B
  │   │   │  │  │             │      2 = A ∩ B
  │   └───┼──┘  │             │      3 = B \ A
  │       └─────┘          4  │      4 = complement of A ∪ B
  └───────────────────────────┘
```

The four regions contain every element exactly once: this is the basis of inclusion–exclusion and of probability.

## Example

$U = \{1, 2, \dots, 10\}$, $A = \{1, 2, 3, 4, 5, 6\}$ (not greater than 6), $B = \{2, 4, 6, 8, 10\}$ (the even numbers).

- $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$, $\ A \cap B = \{2, 4, 6\}$,
- $A \setminus B = \{1, 3, 5\}$, $\ B \setminus A = \{8, 10\}$,
- $\overline{A} = \{7, 8, 9, 10\}$, $\ A \triangle B = \{1, 3, 5, 8, 10\}$.

```python run
U = set(range(1, 11))
A = {x for x in U if x <= 6}
B = {x for x in U if x % 2 == 0}
print("union:       ", A | B)
print("intersection:", A & B)
print("A \\ B:       ", A - B)
print("complement A:", U - A)
print("sym. diff.:  ", A ^ B)
print("disjoint?", A.isdisjoint({7, 9}))
```

Databases use the same operations: SQL `UNION`, `INTERSECT` and `EXCEPT` work on the result sets of two queries.

## Summary

- $A \cup B$: in at least one; $A \cap B$: in both; $A \setminus B$: in $A$ but not in $B$; $\overline{A}$: in $U$ but not in $A$.
- $A \triangle B$: in exactly one. Disjoint: $A \cap B = \emptyset$.
- In Python: `|`, `&`, `-`, `^`; in SQL: `UNION`, `INTERSECT`, `EXCEPT`.

## Lesson exercise

```quiz required
? $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$. How many elements does $A \cup B$ have?
= 5

? With the same sets: how many elements does $A \cap B$ have?
= 2

? With the same sets: what is the largest element of $A \setminus B$?
= 2
! $A \setminus B = \{1, 2\}$

? $U = \{1, \dots, 10\}$ and $C$ is the set of primes in $U$. How many elements does $\overline{C}$ have?
= 6
! The primes: $2, 3, 5, 7$.

? Which set equals $A \triangle B$?
- $A \cup B$
- $A \cap B$
+ $(A \cup B) \setminus (A \cap B)$
- $\overline{A} \cap \overline{B}$
! The symmetric difference is the set of elements in exactly one of them.
```
