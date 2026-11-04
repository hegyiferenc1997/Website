---
title: Practice – Set Algebra
summary: Review questions and a summary worksheet on sets, inclusion–exclusion and the algebra of events.
minutes: 25
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between ∈ and ⊆?</summary>

$\in$ relates an element to a set ($2 \in \{1, 2\}$), $\subseteq$ relates two sets ($\{2\} \subseteq \{1, 2\}$). $2 \subseteq \{1,2\}$ is meaningless and $\{2\} \in \{1, 2\}$ is false.

</details>

<details>
<summary>2. How do we prove that two sets are equal?</summary>

By two-way inclusion ($A \subseteq B$ and $B \subseteq A$), or with a membership table: if in every possible case (the element is / is not in each set) the two sides give the same result.

</details>

<details>
<summary>3. Why do we subtract the intersection in inclusion–exclusion?</summary>

Because in $\lvert A \rvert + \lvert B \rvert$ the elements in both sets appear twice; they must be subtracted once.

</details>

<details>
<summary>4. What is the complement event and what is it good for?</summary>

$\overline{A}$ occurs when $A$ does not. Since $P(\overline{A}) = 1 - P(A)$, for "at least one" questions it is often easier to compute the complement ("none").

</details>

## Summary worksheet

```quiz required
? $U = \{1, \dots, 12\}$, $A$ = even numbers, $B$ = multiples of $3$. How many elements does $\overline{A \cup B}$ have?
= 4
! $\{1, 5, 7, 11\}$

? With the same sets, how many elements does $A \triangle B$ have?
= 6
! $\lvert A \rvert = 6$, $\lvert B \rvert = 4$, $\lvert A \cap B \rvert = 2$.

? Fill in the membership table: $Y = \overline{A} \cap (B \cup C)$.
table: A, B, C -> Y = A'·(B + C)

? How many subsets of $\{a, b, c, d\}$ contain the element $a$?
= 8
! We decide freely about the other three elements: $2^3$.

? How many numbers from 1 to 100 are divisible **neither** by $2$ nor by $5$?
= 40
! $100 - (50 + 20 - 10)$

? We toss three coins. What is the probability of at least one head? (As a fraction or decimal.)
= 7/8
! The complement: all three tails, $\frac{1}{8}$.

? Which relation is **not** transitive?
- "less than" on the reals
- "divides" on the positive integers
+ "perpendicular to" on the lines of the plane
- "subset of" on sets
! If $a \perp b$ and $b \perp c$, then $a \parallel c$.
```
