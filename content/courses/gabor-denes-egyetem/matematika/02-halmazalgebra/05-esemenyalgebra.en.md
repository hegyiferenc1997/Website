---
title: Algebra of Events
summary: Experiments, sample space, events and their operations – set algebra in probability.
minutes: 20
---

## What you will learn

- what a **random experiment**, an **outcome** and the **sample space** are,
- how **operations on events** correspond to set operations,
- what it means that two events are **mutually exclusive**, and what a **partition** of the sample space is,
- the formula of **classical probability**.

## Basic concepts

The possible results of a **random experiment** (e.g. rolling a die) are the **outcomes** (elementary events); their set is the **sample space** $\Omega$. For a die roll $\Omega = \{1, 2, 3, 4, 5, 6\}$.

An **event** is a subset of $\Omega$: $A$ = "we roll an even number" $= \{2, 4, 6\}$. The event **occurs** if the outcome of the experiment is an element of it.

- **Certain event:** $\Omega$ (always occurs).
- **Impossible event:** $\emptyset$ (never).

## Operations on events

| Event                     | Notation              | Set operation |
| ------------------------- | --------------------- | ------------- |
| $A$ **or** $B$ (sum)      | $A + B$ or $A \cup B$ | union         |
| $A$ **and** $B$ (product) | $AB$ or $A \cap B$    | intersection  |
| $A$ but **not** $B$       | $A - B$               | difference    |
| **not** $A$ (complement)  | $\overline{A}$        | complement    |

$A$ and $B$ are **mutually exclusive** if $AB = \emptyset$ (they cannot occur together). Events $A_1, \dots, A_n$ form a **partition** (complete system of events) if they are pairwise mutually exclusive and their sum is $\Omega$ – exactly one of them always occurs.

De Morgan's laws hold here too: "not ($A$ or $B$)" = "not $A$ and not $B$": $\overline{A + B} = \overline{A}\,\overline{B}$.

## Classical probability

If $\Omega$ is finite and all outcomes are **equally likely**, then

$$
P(A) = \frac{\lvert A \rvert}{\lvert \Omega \rvert} = \frac{\text{favourable outcomes}}{\text{all outcomes}}.
$$

Consequences: $P(\overline{A}) = 1 - P(A)$, and from inclusion–exclusion $P(A + B) = P(A) + P(B) - P(AB)$.

**Example.** We roll two dice. $\lvert\Omega\rvert = 36$. The probability of **at least one six**: the complement is "no six", which has $5 \cdot 5 = 25$ outcomes, so $P = 1 - \frac{25}{36} = \frac{11}{36}$.

```python run
import random
from itertools import product

# Exact value: by listing all outcomes.
omega = list(product(range(1, 7), repeat=2))
favourable = [d for d in omega if 6 in d]
print(len(favourable), "/", len(omega), "=", len(favourable) / len(omega))

# By simulation: after many rolls the relative frequency fluctuates around the probability.
random.seed(1)
n = 100_000
hits = sum(1 for _ in range(n) if 6 in (random.randint(1, 6), random.randint(1, 6)))
print("simulation:", hits / n)
```

## Summary

- Sample space $\Omega$ = set of outcomes; event = subset of $\Omega$.
- "or" = union, "and" = intersection, "not" = complement; mutually exclusive: $AB = \emptyset$.
- Classical probability: favourable / all; $P(\overline{A}) = 1 - P(A)$.

## Lesson exercise

```quiz required
? Rolling a die, $A$ = "even", $B$ = "greater than 3". How many outcomes does $AB$ contain?
= 2
! $AB = \{4, 6\}$

? With the same events, how many outcomes does $A + B$ contain?
= 4
! $\{2, 4, 5, 6\}$

? With the same events, what is the event $\overline{A + B}$ (list its elements separated by a comma)?
= 1,3
= 1, 3
= 3,1
! De Morgan: not even **and** not greater than 3.

? What is the probability that the sum of two dice is $7$? (As a fraction or decimal.)
= 1/6
! The favourable outcomes: $(1,6), (2,5), \dots, (6,1)$.

? Which pair forms a **partition** of the sample space for a die roll?
- "even" and "six"
+ "even" and "odd"
- "less than 3" and "greater than 3"
- "one" and "two"
! They are mutually exclusive, and together they give $\Omega$.
```
