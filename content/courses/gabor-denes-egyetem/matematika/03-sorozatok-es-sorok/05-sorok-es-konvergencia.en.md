---
title: Infinite Series and Their Convergence
summary: Partial sums, geometric series, the harmonic series, and convergence tests (necessary condition, ratio, root, comparison and Leibniz tests).
minutes: 30
---

## What you will learn

- what the sum of an **infinite series** means (the sequence of **partial sums**),
- the sum formula of the **geometric series**,
- why the harmonic series **diverges**, and what the **necessary condition** is,
- the most important **convergence tests**.

## Partial sums

The **infinite series** $\sum\limits_{n=1}^{\infty} a_n = a_1 + a_2 + a_3 + \dots$ means: form the **partial sums** $S_N = a_1 + \dots + a_N$. If the sequence $(S_N)$ converges, its limit is the **sum** of the series; if not, the series **diverges**.

## Geometric series

$$
\sum_{n=0}^{\infty} q^n = 1 + q + q^2 + \dots = \frac{1}{1 - q}, \qquad \text{if } \lvert q \rvert < 1,
$$

because $S_N = \frac{1 - q^{N+1}}{1 - q}$ and $q^{N+1} \to 0$. If $\lvert q \rvert \geq 1$, it diverges.

Examples: $\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dots = 1$, and $0.\overline{3} = \dfrac{3}{10} + \dfrac{3}{100} + \dots = \dfrac{3/10}{1 - 1/10} = \dfrac{1}{3}$.

```plot
title: Partial sums of the geometric series
x: 0, 20
y: 0, 5
param: q = 0.5, 0, 0.9, 0.05
seq: sum(k, 0, n, q^k) @ 0, 20 # Sₙ
dash: 1/(1 - q) # 1/(1 − q)
```

## The necessary condition and the harmonic series

If $\sum a_n$ converges, then $a_n \to 0$. **The converse is false!** The terms of the **harmonic series** tend to $0$, yet it diverges:

$$
1 + \frac{1}{2} + \underbrace{\frac{1}{3} + \frac{1}{4}}_{> \frac{1}{2}} + \underbrace{\frac{1}{5} + \dots + \frac{1}{8}}_{> \frac{1}{2}} + \dots = \infty.
$$

It grows very slowly: even the first million terms add up to only about $14.4$. In contrast, $\sum \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1.645$ converges. In general, $\sum \frac{1}{n^p}$ converges if and only if $p > 1$.

So: if $a_n \not\to 0$, the series certainly diverges (e.g. $\sum \frac{n}{n+1}$); if $a_n \to 0$, we have to examine it further.

## Convergence tests (for positive series)

- **Comparison:** if $0 \leq a_n \leq b_n$ and $\sum b_n$ converges, so does $\sum a_n$ (majorant). If $a_n \geq b_n \geq 0$ and $\sum b_n$ diverges, so does $\sum a_n$ (minorant).
- **Ratio test:** if $\dfrac{a_{n+1}}{a_n} \to L$, it converges for $L < 1$ and diverges for $L > 1$ ($L = 1$: inconclusive).
- **Root test:** if $\sqrt[n]{a_n} \to L$, the same.

Example: $\sum \dfrac{n}{2^n}$: $\dfrac{a_{n+1}}{a_n} = \dfrac{n + 1}{2n} \to \dfrac{1}{2} < 1$, convergent (its sum is $2$).

**Alternating series – Leibniz test:** if $a_n$ decreases monotonically to $0$, then $\sum (-1)^{n+1} a_n$ converges. For example $1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \dots = \ln 2$.

```python run
import math
# Partial sums: harmonic (divergent), 1/n^2 (convergent), alternating harmonic (ln 2).
for N in [10, 1000, 100000]:
    h = sum(1 / n for n in range(1, N + 1))
    q = sum(1 / n**2 for n in range(1, N + 1))
    v = sum((-1) ** (n + 1) / n for n in range(1, N + 1))
    print(f"N = {N:>6}: harmonic {h:7.3f} | 1/n² {q:.5f} | alternating {v:.5f}")
print("π²/6 =", round(math.pi**2 / 6, 5), " ln 2 =", round(math.log(2), 5))
```

## Summary

- Sum of a series = limit of the partial sums.
- Geometric series: $\sum q^n = \frac{1}{1-q}$ if $\lvert q \rvert < 1$.
- Necessary condition: $a_n \to 0$, but it is not sufficient (the harmonic series diverges); $\sum \frac{1}{n^p}$ converges $\iff p > 1$.
- Tests: comparison, ratio, root ($L < 1$ convergent), Leibniz for alternating series.

## Lesson exercise

```quiz required
? What is the sum of $\sum\limits_{n=0}^{\infty} \left(\dfrac{2}{3}\right)^n$?
= 3
! $\frac{1}{1 - 2/3}$

? What is the sum of $4 + 2 + 1 + \dfrac{1}{2} + \dots$?
= 8
! First term $4$, ratio $\frac{1}{2}$.

? Write $0.\overline{45} = 0.4545\ldots$ as a fraction (in lowest terms)!
= 5/11
= 45/99
! $\frac{45}{100} + \frac{45}{100^2} + \dots$

? Which series **converges**?
- $\sum \frac{1}{n}$
- $\sum \frac{1}{\sqrt n}$
+ $\sum \frac{1}{n^3}$
- $\sum \frac{n}{n + 1}$
! $\sum \frac{1}{n^p}$ converges if $p > 1$.

? Using the ratio test: what is $L = \lim \dfrac{a_{n+1}}{a_n}$ for $\sum \dfrac{3^n}{n!}$?
= 0
! $\frac{a_{n+1}}{a_n} = \frac{3}{n + 1}$, so the series converges.
```
