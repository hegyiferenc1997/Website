---
title: Cartesian Product, Relations and Cardinality
summary: Ordered pairs, Cartesian product, relations, inclusion–exclusion, and the cardinality of infinite sets.
minutes: 25
---

## What you will learn

- what an **ordered pair** and the **Cartesian product** are,
- what a **relation** is and its important properties,
- how to count the elements of a union with the **inclusion–exclusion principle**,
- that even infinite sets can be "bigger" or "smaller" (**countable** and **continuum**).

## Cartesian product

In an **ordered pair** $(a, b)$ order matters: $(1, 2) \neq (2, 1)$. The **Cartesian product** of $A$ and $B$:

$$
A \times B = \{ (a, b) : a \in A,\ b \in B \}, \qquad \lvert A \times B \rvert = \lvert A \rvert \cdot \lvert B \rvert.
$$

Example: $\{1, 2\} \times \{x, y, z\} = \{(1,x), (1,y), (1,z), (2,x), (2,y), (2,z)\}$, $6$ elements. The points of the plane: $\mathbb{R} \times \mathbb{R} = \mathbb{R}^2$. The rows of a database table are a subset of a Cartesian product as well (SQL `CROSS JOIN` is exactly this).

## Relations

A **relation** on a set $A$ is a subset $R$ of $A \times A$; $a\,R\,b$ if $(a, b) \in R$. Important properties:

- **reflexive:** $a\,R\,a$ for every $a$ (e.g. $\leq$),
- **symmetric:** $a\,R\,b \Rightarrow b\,R\,a$ (e.g. "born in the same year"),
- **antisymmetric:** $a\,R\,b$ and $b\,R\,a \Rightarrow a = b$ (e.g. $\leq$),
- **transitive:** $a\,R\,b$ and $b\,R\,c \Rightarrow a\,R\,c$ (e.g. $<$).

A reflexive, symmetric and transitive relation is an **equivalence relation** (e.g. "gives the same remainder when divided by $3$"); it splits the set into classes. A reflexive, antisymmetric and transitive one is a **partial order** (e.g. $\subseteq$, divisibility).

## Inclusion–exclusion

The number of elements in the union of two sets:

$$
\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert,
$$

because the elements of the intersection were counted twice. For three:

$$
\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert A \cap C \rvert - \lvert B \cap C \rvert + \lvert A \cap B \cap C \rvert.
$$

**Example.** How many numbers from 1 to 100 are divisible by $2$ or $3$? $\lvert A \rvert = 50$, $\lvert B \rvert = 33$, those divisible by $6$: $\lvert A \cap B \rvert = 16$. So $50 + 33 - 16 = 67$.

```python run
# Checking inclusion-exclusion: 1..100, divisible by 2 or 3 or 5.
numbers = range(1, 101)
A = {n for n in numbers if n % 2 == 0}
B = {n for n in numbers if n % 3 == 0}
C = {n for n in numbers if n % 5 == 0}
direct = len(A | B | C)
formula = (len(A) + len(B) + len(C) - len(A & B) - len(A & C) - len(B & C)
           + len(A & B & C))
print(direct, formula)   # 74 74
```

## Cardinality of infinite sets

Two sets have **equal cardinality** if their elements can be paired one-to-one. Surprising consequences:

- There are as many even numbers as natural numbers ($n \leftrightarrow 2n$).
- $\mathbb{Z}$ and $\mathbb{Q}$ are **countable** too (can be listed as a sequence); their cardinality is $\aleph_0$.
- $\mathbb{R}$, however, is **not** countable (Cantor's diagonal argument): this is the cardinality of the **continuum**. There are "more" real numbers.

A consequence for computing: there are countably many programs (finite strings), but uncountably many functions $\mathbb{N} \to \{0, 1\}$ – so some problems cannot be solved by **any** program.

## Summary

- $A \times B$ is the set of ordered pairs, $\lvert A \times B \rvert = \lvert A \rvert \lvert B \rvert$.
- Relation: $R \subseteq A \times A$; equivalence = reflexive + symmetric + transitive.
- Inclusion–exclusion: $\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert$.
- $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$ are countable; $\mathbb{R}$ is not.

## Lesson exercise

```quiz required
? How many elements does $A \times B$ have if $\lvert A \rvert = 4$ and $\lvert B \rvert = 7$?
= 28

? In a class of 30, 18 learn Python, 15 learn Java and 8 learn both. How many learn at least one of them?
= 25
! $18 + 15 - 8$

? In the same class, how many learn neither?
= 5

? How many numbers from 1 to 60 are divisible by $4$ or $6$?
= 20
! Those divisible by both are the multiples of $12$.

? What kind of relation is "gives the same remainder when divided by $3$" on the integers?
+ an equivalence relation
- a partial order
- neither reflexive nor symmetric
! Reflexive, symmetric and transitive.
```
