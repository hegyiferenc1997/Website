---
title: Properties of Functions
summary: Zeros, intercepts, parity, monotonicity, extrema, boundedness and periodicity.
minutes: 25
---

## What you will learn

- how to find **zeros** and **intercepts**,
- when a function is **even** or **odd**,
- the notions of **monotonicity**, **extremum** (minimum, maximum), **boundedness** and **periodicity**,
- how to **describe** a function from its graph.

## Zeros and intercepts

- **Zero:** an $x_0$ with $f(x_0) = 0$ – here the graph crosses (or touches) the $x$ axis. The solutions of $f(x) = 0$.
- **$y$ intercept:** $f(0)$, if $0 \in D_f$.

Example: $f(x) = x^2 - 4x + 3 = (x - 1)(x - 3)$: zeros $1$ and $3$, $y$ intercept $3$.

## Parity

- **Even:** $f(-x) = f(x)$ for every $x \in D_f$; the graph is **symmetric** about the $y$ axis. E.g. $x^2$, $\lvert x \rvert$, $\cos x$.
- **Odd:** $f(-x) = -f(x)$; the graph is symmetric about the **origin**. E.g. $x^3$, $\frac{1}{x}$, $\sin x$.
- Most functions are **neither**, e.g. $x^2 + x$. (Condition: $D_f$ must be symmetric about $0$.)

## Monotonicity and extrema

- $f$ is **strictly increasing** on the interval $I$ if $x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$ (decreasing: $f(x_1) > f(x_2)$).
- **Absolute (global) maximum** at $x_0$: $f(x) \leq f(x_0)$ for every $x \in D_f$. **Local maximum:** this holds only in a neighbourhood of $x_0$. The minimum is similar.

$x^2 - 4x + 3 = (x - 2)^2 - 1$ decreases on $]-\infty; 2]$ and increases on $[2; \infty[$; its minimum is $-1$ at $x = 2$; it has no maximum.

## Boundedness and periodicity

- **Bounded** if there is a $K$ with $\lvert f(x) \rvert \leq K$ for every $x$. E.g. $\sin x$ ($K = 1$), $\frac{1}{1 + x^2}$.
- **Periodic** with period $p > 0$ if $f(x + p) = f(x)$ for every $x$. E.g. $\sin x$ ($2\pi$), $\tan x$ ($\pi$), the fractional part $x - \lfloor x \rfloor$ ($1$).

```plot
title: Describing a function
x: -2, 6
y: -3, 6
param: t = 1, -1.5, 5.5, 0.1
tangent: x^2 - 4x + 3 @ t # f(x) = x² − 4x + 3
point: 2, -1 # minimum
```

The slope of the tangent shows monotonicity: negative where the function decreases, positive where it increases, and $0$ at the minimum. (We justify this precisely in differential calculus.)

## Checklist for describing a function

1. $D_f$, 2. zeros and $f(0)$, 3. parity, periodicity, 4. intervals of monotonicity, 5. extrema, 6. $R_f$ and boundedness, 7. behaviour at the edges of $D_f$ (limits, asymptotes).

## Summary

- Zero: $f(x) = 0$; $y$ intercept: $f(0)$.
- Even: $f(-x) = f(x)$ (symmetric about the $y$ axis); odd: $f(-x) = -f(x)$ (symmetric about the origin).
- Monotonicity on intervals; absolute and local extrema; boundedness; period.

## Lesson exercise

```quiz required
? Which function is **odd**?
- $x^4 - x^2$
+ $x^3 - 5x$
- $x^2 + x$
- $\cos x + 1$
! $f(-x) = -x^3 + 5x = -f(x)$

? Where does $f(x) = x^2 - 6x + 2$ take its minimum? (Give the $x$ value.)
= 3
! $(x - 3)^2 - 7$

? What is the minimum of this function?
= -7

? What is the smallest positive period of $g(x) = \cos(2x)$? (Round to two decimals!)
= 3.14

? Which function is **bounded**?
- $x^2$
- $e^x$
+ $\dfrac{1}{1 + x^2}$
- $\ln x$
! $0 < \frac{1}{1 + x^2} \leq 1$
```
