---
title: Basic Concepts of Sets
summary: Sets, elements, notation, subsets, the empty set, the power set and intervals.
minutes: 20
---

## What you will learn

- what a **set** and an **element** are, and how to describe a set,
- what a **subset**, the **empty set** and **equality** of sets mean,
- what the **power set** is and how many elements it has,
- how to describe subsets of the reals with **intervals**.

## Sets and elements

A **set** is a well-defined collection of distinct objects, its **elements**. It is a primitive notion that we don't define; we only need to be able to decide about anything whether it is an element or not. Notation: $a \in A$ ($a$ is an element of $A$), $b \notin A$.

**Ways to describe a set:**

- **by listing:** $A = \{2, 3, 5, 7\}$ (order and repetition don't matter: $\{1, 2, 2\} = \{2, 1\}$),
- **by a property:** $A = \{ x \in \mathbb{N} : x < 10,\ x \text{ prime} \}$.

This is familiar from programming too: a Python `set` is exactly such an unordered collection without repetition.

```python run
A = {2, 3, 5, 7}
B = {x for x in range(10) if x % 2 == 1}   # by a property: odd numbers below 10
print(A, B)
print(3 in A, 4 in A)        # is it an element?
print({1, 2, 2} == {2, 1})   # True: repetition and order don't matter
```

## Subset, equality, empty set

- $A \subseteq B$ ($A$ is a **subset** of $B$) if every element of $A$ is also an element of $B$. If also $A \neq B$, it is a **proper subset**: $A \subset B$.
- $A = B$ if they have the same elements, i.e. $A \subseteq B$ and $B \subseteq A$. (This is how we prove that two sets are equal!)
- The **empty set** $\emptyset$ has no elements. It is a subset of every set.
- The number of elements (cardinality) of a finite set: $\lvert A \rvert$, e.g. $\lvert \{2, 3, 5, 7\} \rvert = 4$.

## Power set

The **power set** $\mathcal{P}(A)$ of $A$ is the set of all subsets of $A$. For $A = \{a, b\}$:

$$
\mathcal{P}(A) = \big\{ \emptyset, \{a\}, \{b\}, \{a, b\} \big\}.
$$

If $\lvert A \rvert = n$, then $\lvert \mathcal{P}(A) \rvert = 2^n$, because for every element there are two choices: in the subset or not. That is exactly an $n$-bit number: subsets can be encoded as **bit masks**.

## Intervals

The "connected" subsets of the reals ($a < b$):

| Notation                  | Meaning           | Endpoints          |
| ------------------------- | ----------------- | ------------------ |
| $[a; b]$                  | $a \leq x \leq b$ | closed             |
| $\left]a; b\right[$       | $a < x < b$       | open               |
| $[a; b[$                  | $a \leq x < b$    | closed on the left |
| $\left]-\infty; b\right]$ | $x \leq b$        | infinite           |

(Many books write the open interval as $(a; b)$.) $\infty$ is not a number, so the bracket is always open there.

## Summary

- Set: a collection of distinct elements; $a \in A$; described by listing or by a property.
- $A \subseteq B$: every element of $A$ is in $B$; $A = B \iff A \subseteq B$ and $B \subseteq A$; $\emptyset$ is a subset of everything.
- $\lvert \mathcal{P}(A) \rvert = 2^{\lvert A \rvert}$.
- Intervals: $[a; b]$ closed, $]a; b[$ open; always open at infinity.

## Lesson exercise

```quiz required
? How many elements does $\{x \in \mathbb{N} : 3 \leq x < 9\}$ have?
= 6
! $3, 4, 5, 6, 7, 8$

? How many subsets does a $5$-element set have (including the empty set and itself)?
= 32

? Is it true that $\emptyset \subseteq \{1, 2\}$?
+ true, the empty set is a subset of every set
- false, because the empty set is not an element
- only if the set is empty too
! Subset ≠ element: the empty set has no element that is missing from the set.

? How many integers are there in the interval $\left]-2; 3\right]$?
= 5
! $-1, 0, 1, 2, 3$

? Which statement is **false**?
- $\{1, 2, 3\} = \{3, 1, 2\}$
- $\{1, 1, 2\} = \{1, 2\}$
+ $\{1, 2\} \in \{1, 2, 3\}$
- $\{1, 2\} \subseteq \{1, 2, 3\}$
! $\{1, 2\}$ is a subset, but not an element of the set.
```
