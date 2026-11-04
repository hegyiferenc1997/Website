---
title: The Binomial Theorem and Inclusion–Exclusion
summary: Pascal's triangle, the binomial theorem and its consequences, and the principle of inclusion–exclusion.
minutes: 25
---

## What you will learn

- **Pascal's triangle** and the properties of binomial coefficients,
- the **binomial theorem**, and how to compute a coefficient with it,
- the **principle of inclusion–exclusion** for two and three sets.

## Pascal's triangle

Arranging the numbers $\binom{n}{k}$ in a triangle, every number is the sum of the two above it:

$$
\binom{n}{k} = \binom{n - 1}{k - 1} + \binom{n - 1}{k}.
$$

| $n$ |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0   |     |     |     |     |     | 1   |     |     |     |     |     |
| 1   |     |     |     |     | 1   |     | 1   |     |     |     |     |
| 2   |     |     |     | 1   |     | 2   |     | 1   |     |     |     |
| 3   |     |     | 1   |     | 3   |     | 3   |     | 1   |     |     |
| 4   |     | 1   |     | 4   |     | 6   |     | 4   |     | 1   |     |
| 5   | 1   |     | 5   |     | 10  |     | 10  |     | 5   |     | 1   |

Properties: $\binom{n}{0} = \binom{n}{n} = 1$, symmetry: $\binom{n}{k} = \binom{n}{n - k}$, and a row sums to $2^n$ (an $n$-element set has $2^n$ subsets).

## The binomial theorem

$$
(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + b^n.
$$

Why? When expanding $(a + b)(a + b)\cdots(a + b)$, the term $a^{n-k}b^k$ appears as many times as there are ways to choose the $k$ factors (out of $n$) from which we take $b$: $\binom{n}{k}$ times.

**Example.** The coefficient of $x^2$ in $(2x - 1)^5$: $k = 3$ (we choose $-1$ three times), $\binom{5}{3}(2x)^2(-1)^3 = 10 \cdot 4 \cdot (-1)\,x^2 = -40x^2$.

**Consequences:** with $a = b = 1$, $\sum_k \binom{n}{k} = 2^n$; with $a = 1$, $b = -1$, $\sum_k (-1)^k\binom{n}{k} = 0$ (there are as many even-sized subsets as odd-sized ones).

```plot
title: (1 + x)^N and the first M + 1 terms of its expansion
x: -1, 1
y: -1, 8
param: N = 6, 1, 12, 1
param: M = 1, 0, 12, 1
f: (1 + x)^N # (1 + x)^N
dash: sum(k, 0, M, binom(N, k) x^k) # first M + 1 terms
```

With $M = 1$ you get the line $1 + Nx$, a good approximation for small $x$ (the basis of estimating compound interest or relative errors). With $M = N$ the two curves coincide exactly.

## Inclusion–exclusion

For two sets:

$$
\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert,
$$

because the elements of the intersection were counted twice. For three sets:

$$
\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert A \cap C \rvert - \lvert B \cap C \rvert + \lvert A \cap B \cap C \rvert.
$$

**Example.** How many of the numbers $1, \dots, 100$ are divisible by $2$ or $3$? $50 + 33 - 16 = 67$ (the multiples of $6$ form the intersection).

```python run
# Checking inclusion–exclusion: how many of 1..1000 are divisible by NONE of 2, 3, 5?
N = 1000
direct = sum(1 for i in range(1, N + 1) if i % 2 and i % 3 and i % 5)
sieve = N - (N // 2 + N // 3 + N // 5) + (N // 6 + N // 10 + N // 15) - N // 30
print(direct, sieve)
```

## Summary

- Pascal's triangle: $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$, row sum $2^n$.
- Binomial theorem: $(a + b)^n = \sum \binom{n}{k}a^{n-k}b^k$.
- Inclusion–exclusion: add the singles, subtract the pairwise intersections, add the triple ones…

## Lesson exercise

```quiz required
? What is the coefficient of $x^3$ in the expansion of $(1 + x)^7$?
= 35

? What is the coefficient of $x^2$ in the expansion of $(2x - 1)^5$?
= -40
! $\binom{5}{3}(2x)^2(-1)^3$

? What is $\displaystyle\sum_{k=0}^{10} \binom{10}{k}$?
= 1024

? Which one equals $\binom{9}{4}$?
- $\binom{9}{3}$
+ $\binom{9}{5}$
- $\binom{8}{4}$
- $\binom{10}{4} - \binom{9}{4}$
! Symmetry: $\binom{n}{k} = \binom{n}{n - k}$.

? In a class of $30$, $18$ can program in Python, $15$ in C, and $8$ in both. How many can program in neither?
= 5

? How many of the numbers $1, \dots, 1000$ are divisible by **none** of $2$, $3$ and $5$?
= 266
```
