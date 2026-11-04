---
title: The Definite Integral and Riemann Sums
summary: Approximating the area under a curve with rectangles, the definition of the definite integral and its properties.
minutes: 25
---

## What you will learn

- how to approximate the **area under a curve** with rectangles (**Riemann sum**),
- the precise meaning of the **definite integral**,
- the **properties** of the definite integral (signed area, additivity).

## The problem: area under a curve

What is the area between the graph of $f(x) = x^2$, the $x$ axis and the lines $x = 0$, $x = 2$? Divide the interval $[a; b]$ into $n$ equal parts ($\Delta x = \frac{b - a}{n}$), and over each part put a rectangle whose height is the function value at some point $\xi_i$ of the part:

$$
S_n = \sum_{i=1}^{n} f(\xi_i)\, \Delta x.
$$

This is the **Riemann sum** (approximating sum). As $n$ grows, the rectangles fill the area better and better.

```plot
title: Riemann sum with midpoints
x: -0.5, 3
y: -0.5, 5
param: k = 4, 1, 40, 1
param: b = 2, 0.5, 2.5, 0.1
riemann: x^2 @ 0, b, k # f(x) = x²
```

Increase the number of rectangles $k$: the approximating sum tends to the exact value $\frac{8}{3} \approx 2.6667$ (for $b = 2$).

## The definite integral

If the limit of the Riemann sums ($n \to \infty$, finer and finer partitions) exists and does not depend on the choice of the points $\xi_i$, then $f$ is **Riemann integrable** on $[a; b]$, and

$$
\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(\xi_i)\,\Delta x.
$$

Every **continuous** function (in fact every bounded function with finitely many discontinuities) is integrable. The integral sign is an elongated S (*summa*), and $dx$ is the "infinitely small" version of $\Delta x$.

## Signed area

Where $f < 0$, the rectangles have negative height, so the integral counts the area **below** the $x$ axis with a **negative** sign. For example $\int_0^{2\pi} \sin x\,dx = 0$, because the positive and negative parts cancel. For the **actual area** take the absolute value of the negative parts.

## Properties

- **Linearity:** $\int_a^b (c f + g)\,dx = c\int_a^b f\,dx + \int_a^b g\,dx$.
- **Additivity:** $\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$.
- $\int_a^a f\,dx = 0$, and $\int_b^a f\,dx = -\int_a^b f\,dx$.
- **Monotonicity:** if $f \leq g$, then $\int_a^b f\,dx \leq \int_a^b g\,dx$.

```python run
# Riemann sum (with midpoints) for x² on [0; 2].
def riemann(f, a, b, n):
    dx = (b - a) / n
    return sum(f(a + (i + 0.5) * dx) for i in range(n)) * dx

for n in [2, 10, 100, 1000]:
    print(f"n = {n:>4}: {riemann(lambda x: x * x, 0, 2, n):.6f}")
print("exact:  ", 8 / 3)
```

## Summary

- Riemann sum: $\sum f(\xi_i)\Delta x$, the total area of rectangles.
- $\int_a^b f(x)\,dx$ = the limit of Riemann sums; it exists for continuous functions.
- Signed area: the part below the $x$ axis is negative.
- Linear, additive; $\int_b^a = -\int_a^b$.

## Lesson exercise

```quiz required
? What is the midpoint Riemann sum for $f(x) = x^2$ on $[0; 2]$ with $n = 2$ parts? (As a decimal.)
= 2.5
! The midpoints are $0.5$ and $1.5$, $\Delta x = 1$.

? What is $\displaystyle\int_{-3}^{3} x^3\,dx$?
= 0
! An odd function on a symmetric interval.

? If $\displaystyle\int_0^2 f\,dx = 5$ and $\displaystyle\int_2^5 f\,dx = -1$, what is $\displaystyle\int_0^5 f\,dx$?
= 4

? If $\displaystyle\int_1^4 f\,dx = 6$, what is $\displaystyle\int_4^1 3f\,dx$?
= -18

? What is $\displaystyle\int_0^{2\pi} \sin x\,dx$?
= 0
```
