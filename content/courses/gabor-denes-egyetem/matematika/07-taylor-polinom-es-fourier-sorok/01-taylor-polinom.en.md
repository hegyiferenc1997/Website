---
title: The Taylor Polynomial
summary: Approximating a function near a point by a polynomial whose derivatives match those of the function.
minutes: 25
---

## What you will learn

- what a **Taylor polynomial** is and why it is a good approximation,
- how its coefficients come from the **derivatives**,
- how the approximation improves as the **degree** grows (on an interactive graph).

## The idea

Near the point, the tangent (a first-degree polynomial) approximates the function well: $f(x) \approx f(a) + f'(a)(x - a)$. We get an even better approximation if we also require agreement in the **second**, **third**, … derivatives. The **Taylor polynomial of degree $n$** of $f$ about $a$:

$$
T_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!} (x - a)^k = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \dots + \frac{f^{(n)}(a)}{n!}(x - a)^n.
$$

It is the only polynomial of degree at most $n$ whose value and first $n$ derivatives at $a$ agree with those of $f$. For $a = 0$ it is also called the **Maclaurin polynomial**.

## Example: $e^x$ about $0$

Every derivative is $e^x$, so $f^{(k)}(0) = 1$:

$$
T_n(x) = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots + \frac{x^n}{n!}.
$$

For example $e^{0.5} \approx T_3(0.5) = 1 + 0.5 + 0.125 + 0.0208 = 1.6458$ (exactly $1.6487\ldots$).

```plot
title: eˣ and its Taylor polynomials
x: -4, 4
y: -2, 12
param: N = 2, 0, 10, 1
f: e^x # eˣ
dash: sum(k, 0, N, x^k/k!) # Tₙ(x)
value: Tₙ(1) = sum(k, 0, N, 1/k!)
```

Increase the degree: the polynomial hugs the curve on a larger and larger range, and $T_N(1)$ approximates $e \approx 2.71828$ better and better.

## Example: $\sin x$ about $0$

The derivatives: $\sin, \cos, -\sin, -\cos, \sin, \dots$; at $0$: $0, 1, 0, -1, 0, 1, \dots$ Only the odd-degree terms remain:

$$
\sin x \approx x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + \dots
$$

```plot
title: sin x and its Taylor polynomials
x: -8, 8
y: -3, 3
param: N = 1, 0, 8, 1
f: sin(x) # sin x
dash: sum(k, 0, N, (-1)^k x^(2k + 1)/(2k + 1)!) # T₂ₙ₊₁(x)
```

## Where is it used?

- **Calculators and libraries** compute $\sin$, $e^x$, $\ln$ this way (and with refined versions of it).
- **Physics and engineering approximations:** for small angles $\sin x \approx x$, $\cos x \approx 1 - \frac{x^2}{2}$ (pendulum, optics).
- Error analysis of **numerical methods** (e.g. Newton's method and differential equation solvers).

## Summary

- $T_n(x) = \sum_{k=0}^n \frac{f^{(k)}(a)}{k!}(x - a)^k$: its value and first $n$ derivatives agree with $f$ at $a$.
- $e^x \approx \sum \frac{x^k}{k!}$; $\sin x \approx x - \frac{x^3}{6} + \frac{x^5}{120} - \dots$
- Higher degree → better approximation on a larger range.

## Lesson exercise

```quiz required
? Give the second-degree Taylor polynomial of $e^x$ about $0$!
fn: x -> 1 + x + x^2/2

? What is $T_2(0.2)$ for $e^x$? (To four decimals.)
= 1.22
= 1.2200
! $1 + 0.2 + 0.02$

? Give the fourth-degree Taylor polynomial of $\cos x$ about $0$!
fn: x -> 1 - x^2/2 + x^4/24
! The derivatives at $0$: $1, 0, -1, 0, 1$.

? What is the coefficient of $x^3$ in the Taylor polynomial of $\sin x$? (As a fraction.)
= -1/6

? Give the first-degree Taylor polynomial of $f(x) = \ln x$ about $a = 1$!
fn: x -> x - 1
domain: 0.5, 2
```
