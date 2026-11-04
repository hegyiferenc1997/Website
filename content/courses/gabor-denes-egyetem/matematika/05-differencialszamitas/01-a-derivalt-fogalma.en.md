---
title: The Concept of the Derivative
summary: From the difference quotient to the derivative – the slope of the tangent and instantaneous speed.
minutes: 20
---

## What you will learn

- what the **difference quotient** is (average rate of change),
- how a limit turns it into the **derivative** (instantaneous rate of change),
- the **geometric meaning** of the derivative (slope of the tangent), and when a function is **not** differentiable.

## Average change: the difference quotient

A car covers $s(t) = t^2$ metres in $t$ seconds. Its average speed over the interval $[1; 3]$ is:

$$
\frac{s(3) - s(1)}{3 - 1} = \frac{9 - 1}{2} = 4 \ \tfrac{\text{m}}{\text{s}}.
$$

In general, the **difference quotient** of $f$ between $x_0$ and $x_0 + h$ is

$$
\frac{f(x_0 + h) - f(x_0)}{h}.
$$

Geometrically it is the slope of the **secant** through the two points.

## Instantaneous change: the derivative

As $h$ gets smaller, the secant hugs the curve more and more closely and tends to the **tangent**. The **derivative** of $f$ at $x_0$ is

$$
f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h},
$$

if this limit exists and is finite. Then $f$ is called **differentiable** at $x_0$.

**Example.** $f(x) = x^2$ at any $x_0$:

$$
\frac{(x_0 + h)^2 - x_0^2}{h} = \frac{2x_0 h + h^2}{h} = 2x_0 + h \ \xrightarrow{h \to 0}\ 2x_0.
$$

So $(x^2)' = 2x$, and the car's instantaneous speed at $t = 1$ s is $2 \ \tfrac{\text{m}}{\text{s}}$.

## Try it: the tangent

Move the $t$ slider! The yellow line is the tangent of $f(x) = x^2$ at $x = t$; below you see its slope, which is always $2t$.

```plot
title: Tangent of x²
x: -3, 3
y: -2, 9
param: t = 1, -2.5, 2.5, 0.1
tangent: x^2 @ t # f(x) = x²
value: 2t = 2t
```

## Equation of the tangent

The line through $(x_0; f(x_0))$ with slope $f'(x_0)$ is

$$
y = f(x_0) + f'(x_0)\,(x - x_0).
$$

For example, the tangent of $f(x) = x^2$ at $x_0 = 1$ is $y = 1 + 2(x - 1) = 2x - 1$.

## When is a function not differentiable?

- **Jump or gap**: if $f$ is not **continuous** at $x_0$, it is not differentiable there either.
- **Corner**: $f(x) = \lvert x \rvert$ is continuous at $0$, but the slope is $-1$ from the left and $+1$ from the right, so the limit does not exist.
- **Vertical tangent**: $f(x) = \sqrt[3]{x}$ at $0$; the difference quotient tends to $+\infty$.

Important: **differentiability implies continuity**, but not the other way round (see $\lvert x \rvert$).

## Summary

- Difference quotient = slope of the secant = average rate of change.
- Derivative: $f'(x_0) = \lim_{h\to 0} \frac{f(x_0+h)-f(x_0)}{h}$ = slope of the tangent = instantaneous rate of change.
- Tangent: $y = f(x_0) + f'(x_0)(x - x_0)$.
- Differentiable ⇒ continuous, but a continuous function may fail to be differentiable (corner, vertical tangent).

## Lesson exercise

```quiz required
? What is the difference quotient of $f(x) = x^2$ between the points $2$ and $4$?
= 6
! $\frac{16 - 4}{4 - 2}$

? Write the derivative obtained from the definition: what is $(x^2)'$?
fn: x -> 2x
! The difference quotient is $2x_0 + h$, and $h \to 0$.

? What is the slope of the tangent of $f(x) = x^2$ at $x_0 = -1.5$?
= -3
! $f'(x_0) = 2x_0$

? The tangent of $f(x) = x^2$ at $x_0 = 3$ is $y = mx + b$. What is $b$?
= -9
! $y = 9 + 6(x - 3)$

? Which function is continuous but **not** differentiable at $0$?
- $f(x) = x^2$
+ $f(x) = \lvert x \rvert$
- $f(x) = 3x + 1$
- $f(x) = \sin x$
! Where the graph has a "corner", there is no unique tangent.
```
