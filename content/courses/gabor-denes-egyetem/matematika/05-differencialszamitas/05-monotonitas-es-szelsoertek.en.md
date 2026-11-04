---
title: Monotonicity and Extrema
summary: The sign of the derivative and monotonicity, stationary points, conditions for local extrema and absolute extrema on a closed interval.
minutes: 25
---

## What you will learn

- how the **sign of the derivative** decides monotonicity,
- the **necessary** and **sufficient** conditions for an extremum,
- how to find the **absolute** extrema of a function on a closed interval.

## Monotonicity

If on an interval

- $f'(x) > 0$, then $f$ is **strictly increasing** there,
- $f'(x) < 0$, then $f$ is **strictly decreasing** there,
- $f'(x) = 0$ everywhere, then $f$ is **constant**.

(This follows from the **mean value theorem**: $f(b) - f(a) = f'(\xi)(b - a)$ for some $\xi \in \left]a; b\right[$.)

## Local extrema

**Necessary condition:** if $f$ is differentiable and has a local extremum at $x_0$, then $f'(x_0) = 0$. Such points are **stationary points**. The converse is false: $x^3$ has $f'(0) = 0$ but no extremum at $0$.

**Sufficient condition (1):** if $f'$ **changes sign** at $x_0$:

- from $+$ to $-$ → **local maximum**,
- from $-$ to $+$ → **local minimum**.

**Sufficient condition (2):** if $f'(x_0) = 0$ and $f''(x_0) > 0$ → minimum; $f''(x_0) < 0$ → maximum.

## Worked example

$f(x) = x^3 - 6x^2 + 9x + 1$.

1. $f'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$.
2. Stationary points: $x = 1$ and $x = 3$.
3. Sign chart:

| $x$     | $x < 1$ | $1$     | $1 < x < 3$ | $3$     | $x > 3$ |
| ------- | ------- | ------- | ----------- | ------- | ------- |
| $f'(x)$ | $+$     | $0$     | $-$         | $0$     | $+$     |
| $f(x)$  | increasing | max: $5$ | decreasing | min: $1$ | increasing |

```plot
title: f(x) = x³ − 6x² + 9x + 1 and its tangent
x: -1, 5
y: -3, 8
param: t = 0, -0.8, 4.8, 0.05
tangent: x^3 - 6x^2 + 9x + 1 @ t # f(x)
point: 1, 5 # max
point: 3, 1 # min
```

Move the $t$ slider: at $1$ and $3$ the tangent is horizontal, and the sign of the slope changes there.

## Absolute extrema on a closed interval

A continuous $f$ on $[a; b]$ attains its largest and smallest values (**Weierstrass theorem**). To find them:

1. compute $f$ at the **stationary points** (inside $[a; b]$),
2. at the **endpoints** ($f(a)$, $f(b)$),
3. and where $f$ is not differentiable;
4. the largest of these is the maximum, the smallest the minimum.

Example: the $f$ above on $[0; 4]$: $f(0) = 1$, $f(1) = 5$, $f(3) = 1$, $f(4) = 5$. Maximum $5$ (at $x = 1$ and $x = 4$), minimum $1$ (at $x = 0$ and $x = 3$).

## Summary

- $f' > 0$ → increasing, $f' < 0$ → decreasing.
- Local extremum: $f'(x_0) = 0$ is necessary; a sign change or $f''(x_0) \neq 0$ is sufficient.
- On a closed interval: compare stationary points and endpoints.

## Lesson exercise

```quiz required
? Where does $f(x) = x^2 - 8x + 3$ have a local minimum? (Give the $x$ value.)
= 4

? Where does $f(x) = x^3 - 3x$ have a local **maximum**? (Give the $x$ value.)
= -1
! $f'(x) = 3(x - 1)(x + 1)$; $f'$ changes from $+$ to $-$ at $-1$.

? What is the largest value of $f(x) = x^3 - 3x$ on $[-2; 3]$?
= 18
! Endpoints: $f(-2) = -2$, $f(3) = 18$; stationary: $f(-1) = 2$, $f(1) = -2$.

? On which interval is $f(x) = x^3 - 6x^2 + 9x + 1$ **decreasing**?
- $]-\infty; 1[$
+ $]1; 3[$
- $]3; \infty[$
- $]0; 4[$

? Is it true that if $f'(x_0) = 0$, then $f$ certainly has an extremum at $x_0$?
- true
+ false, e.g. $x^3$ at $0$
! The derivative must change sign.
```
