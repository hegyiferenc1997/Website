---
title: Monotonicity and Boundedness
summary: Increasing and decreasing sequences, lower and upper bounds, and how to prove them.
minutes: 20
---

## What you will learn

- when a sequence is **increasing** or **decreasing**, and how to examine it (difference, ratio),
- what **lower** and **upper bounds** are and when a sequence is **bounded**,
- what the **least upper bound** (supremum) is.

## Monotonicity

The sequence $(a_n)$ is

- **increasing** if $a_{n+1} \geq a_n$ for every $n$ (**strictly** if $>$),
- **decreasing** if $a_{n+1} \leq a_n$ for every $n$ (**strictly** if $<$).

**Test with the difference:** look at the sign of $a_{n+1} - a_n$.

Example: $a_n = \dfrac{n}{n + 1}$.

$$
a_{n+1} - a_n = \frac{n + 1}{n + 2} - \frac{n}{n + 1} = \frac{(n+1)^2 - n(n+2)}{(n+1)(n+2)} = \frac{1}{(n+1)(n+2)} > 0,
$$

so the sequence is strictly increasing.

**Test with the ratio** (for positive sequences): if $\dfrac{a_{n+1}}{a_n} > 1$, it is increasing. Example: $a_n = \dfrac{2^n}{n!}$: $\dfrac{a_{n+1}}{a_n} = \dfrac{2}{n + 1} < 1$ for $n \geq 2$, so it is decreasing from $n = 2$ on.

The sequence $(-1)^n$ is **not monotonic**: it alternately rises and falls.

## Boundedness

- $K$ is an **upper bound** if $a_n \leq K$ for every $n$; $k$ is a **lower bound** if $a_n \geq k$.
- The sequence is **bounded** if it is bounded below and above, i.e. there is an $M$ with $\lvert a_n \rvert \leq M$ for every $n$.

Examples:

- $a_n = \dfrac{n}{n+1}$: lower bound $\frac{1}{2}$ (the first term, since it is increasing), upper bound $1$. **Bounded.**
- $a_n = n^2$: bounded below ($1$), not above. **Not bounded.**
- $a_n = (-1)^n$: $-1 \leq a_n \leq 1$. Bounded but not monotonic.

The least upper bound is the **supremum** ($\sup$), the greatest lower bound the **infimum** ($\inf$). For $\frac{n}{n+1}$, $\sup = 1$, although no term reaches $1$.

```plot
title: The sequence aₙ = n/(n + 1) with its bounds
x: 0, 25
y: 0, 1.3
seq: n/(n + 1) @ 1, 25 # aₙ = n/(n+1)
dash: 1 # upper bound: 1
dash: 0.5 # lower bound: 1/2
```

## How to prove a bound?

For an upper bound, write an estimate: $\dfrac{n}{n+1} < \dfrac{n + 1}{n + 1} = 1$. For a lower bound, if the sequence is increasing, the first term works.

## Summary

- Monotonicity: the sign of $a_{n+1} - a_n$, or (for positive terms) how $a_{n+1}/a_n$ compares with $1$.
- Bounded: $k \leq a_n \leq K$ for some $k, K$; an increasing sequence is bounded below by its first term.
- $\sup$ = least upper bound; not necessarily a term of the sequence.

## Lesson exercise

```quiz required
? What kind of sequence is $a_n = 5 - \dfrac{1}{n}$?
+ strictly increasing
- strictly decreasing
- not monotonic
! $a_{n+1} - a_n = \frac{1}{n} - \frac{1}{n + 1} > 0$

? What is the least upper bound (supremum) of $a_n = 5 - \dfrac{1}{n}$?
= 5

? What is the largest term of $a_n = \dfrac{3n + 1}{n}$?
= 4
! $a_n = 3 + \frac{1}{n}$, which is decreasing.

? Which sequence is **bounded but not monotonic**?
- $a_n = n$
- $a_n = \frac{1}{n}$
+ $a_n = \frac{(-1)^n}{n}$
- $a_n = 2^n$
! The sign alternates, and the absolute value is at most $1$.

? From which term is $a_n = \dfrac{2^n}{n!}$ decreasing? (Give the smallest $n$ with $a_{n+1} < a_n$.)
= 2
! $\frac{a_{n+1}}{a_n} = \frac{2}{n+1}$; at $n = 1$ it equals $1$, i.e. $a_2 = a_1$.
```
