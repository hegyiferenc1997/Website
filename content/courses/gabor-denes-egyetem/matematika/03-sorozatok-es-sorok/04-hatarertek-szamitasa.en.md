---
title: Computing Limits
summary: Limit laws, dividing by the highest power, the squeeze theorem, important limits and the number e.
minutes: 25
---

## What you will learn

- the **limit laws**,
- the limits of **rational expressions** (dividing by the highest power),
- how to handle **differences of roots** (multiplying by the conjugate),
- the **squeeze theorem** and the **important limits**, including the number $e$.

## Limit laws

If $a_n \to A$ and $b_n \to B$ (finite numbers), then

$$
a_n \pm b_n \to A \pm B, \qquad a_n b_n \to AB, \qquad \frac{a_n}{b_n} \to \frac{A}{B} \ (B \neq 0), \qquad a_n^k \to A^k.
$$

**Indeterminate forms**, for which there is no general rule and which need rewriting: $\dfrac{\infty}{\infty}$, $\dfrac{0}{0}$, $\infty - \infty$, $0 \cdot \infty$, $1^\infty$.

## Rational expressions: divide by the highest power

$$
\lim_{n \to \infty} \frac{3n^2 - n + 5}{2n^2 + 7} = \lim_{n \to \infty} \frac{3 - \frac{1}{n} + \frac{5}{n^2}}{2 + \frac{7}{n^2}} = \frac{3}{2}.
$$

General rule (numerator degree $p$, denominator degree $q$):

- $p < q$: the limit is $0$;
- $p = q$: the **ratio of the leading coefficients**;
- $p > q$: $\pm\infty$ (divergent).

## Difference of roots: the conjugate

$\sqrt{n^2 + 4n} - n$ has the form $\infty - \infty$. Multiply by the "sum":

$$
\sqrt{n^2 + 4n} - n = \frac{(n^2 + 4n) - n^2}{\sqrt{n^2 + 4n} + n} = \frac{4n}{\sqrt{n^2 + 4n} + n} = \frac{4}{\sqrt{1 + \frac{4}{n}} + 1} \to \frac{4}{2} = 2.
$$

## Squeeze theorem

If $a_n \leq b_n \leq c_n$ and $a_n \to A$, $c_n \to A$, then $b_n \to A$ as well. Example: $-\dfrac{1}{n} \leq \dfrac{\sin n}{n} \leq \dfrac{1}{n}$, so $\dfrac{\sin n}{n} \to 0$.

## Important limits

| Sequence                          | Limit                                                              |
| --------------------------------- | ------------------------------------------------------------------ |
| $q^n$                             | $0$ if $\lvert q \rvert < 1$; $1$ if $q = 1$; $+\infty$ if $q > 1$ |
| $\sqrt[n]{a}$ ($a > 0$)           | $1$                                                                |
| $\sqrt[n]{n}$                     | $1$                                                                |
| $\dfrac{n^k}{a^n}$ ($a > 1$)      | $0$ (the exponential "wins")                                       |
| $\left(1 + \dfrac{1}{n}\right)^n$ | $e \approx 2.71828$                                                |
| $\left(1 + \dfrac{x}{n}\right)^n$ | $e^x$                                                              |

The **number $e$** also comes from compound interest: if $100\%$ annual interest is credited in $n$ instalments, $1$ HUF grows to $\left(1 + \frac{1}{n}\right)^n$ HUF in a year – and even as $n \to \infty$ this does not grow without bound but tends to $e$.

```plot
title: (1 + c/n)ⁿ → eᶜ
x: 0, 50
y: 0, 8
param: c = 1, 0.5, 2, 0.1
seq: (1 + c/n)^n @ 1, 50 # (1 + c/n)ⁿ
dash: e^c # eᶜ
```

```python run
import math
# (1 + 1/n)^n approaches e slowly.
for n in [1, 10, 100, 1000, 10**6]:
    print(f"n = {n:>7}: {(1 + 1/n) ** n:.6f}")
print("e        =", round(math.e, 6))
```

## Summary

- Limit laws for finite limits; indeterminate forms need rewriting.
- Rational expression: divide by the highest power of $n$; equal degrees give the ratio of leading coefficients.
- $\infty - \infty$ with roots: multiply by the conjugate; squeeze theorem for bounded · null sequences.
- $\left(1 + \frac{x}{n}\right)^n \to e^x$; $q^n \to 0$ if $\lvert q \rvert < 1$.

## Lesson exercise

```quiz required
? What is $\lim\limits_{n\to\infty} \dfrac{4n^3 - 2n}{2n^3 + n^2 + 1}$?
= 2

? What is $\lim\limits_{n\to\infty} \dfrac{7n + 1}{n^2 - 3}$?
= 0
! The denominator has the higher degree.

? What is $\lim\limits_{n\to\infty} \left(\sqrt{n^2 + 6n} - n\right)$?
= 3
! Multiply by $\sqrt{n^2 + 6n} + n$.

? What is $\lim\limits_{n\to\infty} \left(1 + \dfrac{1}{n}\right)^{2n}$? (Round to two decimals!)
= 7.39
! $\left(\left(1 + \frac{1}{n}\right)^n\right)^2 \to e^2$

? Which sequence tends to $0$?
- $\left(\frac{3}{2}\right)^n$
- $\sqrt[n]{5}$
+ $\frac{n^{10}}{2^n}$
- $\left(1 + \frac{1}{n}\right)^n$
! The exponential grows faster than any power.
```
