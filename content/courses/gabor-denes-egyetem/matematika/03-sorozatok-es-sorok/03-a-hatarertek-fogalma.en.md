---
title: The Concept of a Limit
summary: Convergent and divergent sequences, the ε–threshold definition, and the monotone convergence theorem.
minutes: 25
---

## What you will learn

- what it means that a sequence **tends** to a number (**converges**),
- the **precise definition** of the limit ($\varepsilon$ and threshold index),
- when a sequence **diverges** and what tending to $+\infty$ means,
- the theorem on **monotonic and bounded** sequences.

## Intuitively

The terms of $a_n = \dfrac{1}{n}$ get closer and closer to $0$: $1;\ 0.5;\ 0.33;\ \dots;\ 0.01;\ \dots$ However small a distance we choose, after a while **every** term will be closer to $0$ than that. The definition says exactly this.

## Definition

The **limit** of the sequence $(a_n)$ is the number $A$ if for every $\varepsilon > 0$ there is a **threshold index** $N$ such that

$$
\lvert a_n - A \rvert < \varepsilon \quad \text{for every } n > N.
$$

Notation: $\lim\limits_{n \to \infty} a_n = A$ or $a_n \to A$. Then the sequence is **convergent**; if there is no such $A$, it is **divergent**.

Intuitively: only **finitely many** terms can lie outside the "strip" of radius $\varepsilon$ around $A$.

```plot
title: The sequence and the ε-strip
x: 0, 40
y: 0.5, 1.6
param: e = 0.1, 0.02, 0.3, 0.01
seq: (n + 2)/n @ 1, 40 # aₙ = (n + 2)/n
dash: 1 + e # A + ε
dash: 1 - e # A − ε
value: threshold index N = ceil(2/e)
```

**Example.** $a_n = \dfrac{n + 2}{n} = 1 + \dfrac{2}{n} \to 1$. For a given $\varepsilon$: $\lvert a_n - 1 \rvert = \dfrac{2}{n} < \varepsilon \iff n > \dfrac{2}{\varepsilon}$. So $N = \dfrac{2}{\varepsilon}$ is a suitable threshold; for $\varepsilon = 0.1$, $N = 20$. Check it with the slider: after the threshold index every point lies inside the strip.

## Divergence

- **Tends to $+\infty$** ($a_n \to +\infty$) if for every $K$ there is an $N$ with $a_n > K$ for $n > N$. E.g. $n^2$, $2^n$, $\sqrt n$. (This is also a divergent sequence, just a "nice" one.)
- **Oscillates** if it tends to nothing: e.g. $(-1)^n$ jumps between $-1$ and $1$.

## Important theorems

1. The limit is **unique**: a sequence has at most one limit.
2. Every convergent sequence is **bounded**. (Not conversely: $(-1)^n$ is bounded but divergent.)
3. **Monotonic and bounded ⇒ convergent.** An increasing sequence bounded above tends to its supremum. This is how we prove, for example, that $\left(1 + \frac{1}{n}\right)^n$ converges (its limit is the number $e$, see the next lesson).

## Summary

- $a_n \to A$: for every $\varepsilon > 0$ there is an $N$ such that $\lvert a_n - A \rvert < \varepsilon$ for $n > N$.
- Divergent: no finite limit (it may tend to $\pm\infty$ or oscillate).
- Convergent ⇒ bounded; monotonic + bounded ⇒ convergent.

## Lesson exercise

```quiz required
? What is the limit of $a_n = \dfrac{n + 2}{n}$?
= 1

? For $a_n = 1 + \dfrac{2}{n}$ and $\varepsilon = 0.05$, what is the smallest integer threshold $N$ such that $\lvert a_n - 1 \rvert < \varepsilon$ for every $n > N$?
= 40
! $\frac{2}{n} < 0.05 \iff n > 40$

? Which sequence is **divergent**?
- $\frac{1}{n^2}$
- $\frac{n}{2n + 1}$
+ $(-1)^n \cdot \frac{n}{n + 1}$
- $\frac{(-1)^n}{n}$
! Even-indexed terms tend to $1$, odd-indexed ones to $-1$.

? What is the limit of $a_n = \dfrac{5n - 3}{2n}$? (As a decimal or a fraction.)
= 2.5
= 5/2
! $\frac{5n - 3}{2n} = \frac{5}{2} - \frac{3}{2n}$

? Which statement is **true**?
- Every bounded sequence is convergent.
+ Every convergent sequence is bounded.
- Every monotonic sequence is convergent.
- A convergent sequence may have several limits.
```
