---
title: The Chain Rule and the Derivative of the Inverse
summary: Differentiating composite functions, derivatives of the inverse trigonometric functions and logarithmic differentiation.
minutes: 25
---

## What you will learn

- differentiating composite functions (**chain rule**),
- the derivative of the **inverse function** and of the **inverse trigonometric functions**,
- **logarithmic differentiation** (for functions like $x^x$).

## The chain rule

If $h(x) = f\big(g(x)\big)$, then

$$
h'(x) = f'\big(g(x)\big) \cdot g'(x),
$$

i.e. "the derivative of the outer function at the inner value, times the derivative of the inner function".

**Examples:**

- $\left((3x + 1)^5\right)' = 5(3x + 1)^4 \cdot 3 = 15(3x + 1)^4$.
- $\left(e^{-x^2}\right)' = e^{-x^2} \cdot (-2x)$.
- $\left(\sin^2 x\right)' = 2 \sin x \cdot \cos x = \sin 2x$.
- $\left(\ln(x^2 + 1)\right)' = \dfrac{2x}{x^2 + 1}$.
- Multiple composition: $\left(\sqrt{\cos 3x}\right)' = \dfrac{1}{2\sqrt{\cos 3x}} \cdot (-\sin 3x) \cdot 3$.

An important special case: $\big(f(ax + b)\big)' = a\,f'(ax + b)$.

## Derivative of the inverse function

If $f$ is strictly monotonic and differentiable with $f'(x) \neq 0$, its inverse is differentiable too:

$$
\left(f^{-1}\right)'(y) = \frac{1}{f'(x)}, \quad \text{where } y = f(x).
$$

Intuitively: reflection turns the slope of the tangent into its reciprocal. This gives:

| $f(x)$         | $f'(x)$                        |
| -------------- | ------------------------------ |
| $\arcsin x$    | $\dfrac{1}{\sqrt{1 - x^2}}$    |
| $\arccos x$    | $-\dfrac{1}{\sqrt{1 - x^2}}$   |
| $\arctan x$    | $\dfrac{1}{1 + x^2}$           |

For example $\ln x$ is the inverse of $e^x$: $(\ln x)' = \dfrac{1}{e^{\ln x}} = \dfrac{1}{x}$.

## Logarithmic differentiation

Functions of the form $f(x)^{g(x)}$ are rewritten with base $e$: $x^x = e^{x \ln x}$, so

$$
\left(x^x\right)' = e^{x \ln x} \cdot \left(\ln x + x \cdot \frac{1}{x}\right) = x^x (\ln x + 1).
$$

```plot
title: The chain rule visually: sin(kx)
x: -4, 4
y: -4, 4
param: k = 2, 0.5, 3, 0.1
param: t = 0.5, -3.5, 3.5, 0.05
tangent: sin(k x) @ t # sin(kx)
value: k·cos(kt) = k cos(k t)
```

The inner function is $kx$: with a larger $k$ the curve is "squeezed" and the tangents are $k$ times steeper – this is the factor $k$ in the chain rule.

## Summary

- Chain rule: $\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)$; work from the outside in.
- Inverse: $(f^{-1})' = 1 / f'$; $(\arctan x)' = \frac{1}{1 + x^2}$, $(\arcsin x)' = \frac{1}{\sqrt{1 - x^2}}$.
- For $f^g$: write $e^{g \ln f}$ and differentiate that.

## Lesson exercise

```quiz required
? Differentiate: $f(x) = (2x - 5)^4$.
fn: x -> 8(2x - 5)^3

? Differentiate: $f(x) = e^{3x^2}$.
fn: x -> 6x e^(3x^2)
domain: -1, 1

? Differentiate: $f(x) = \ln(x^2 + 4)$.
fn: x -> 2x/(x^2 + 4)

? Differentiate: $f(x) = \cos(5x + 1)$.
fn: x -> -5 sin(5x + 1)

? Differentiate: $f(x) = \arctan(2x)$.
fn: x -> 2/(1 + 4x^2)

? What is the derivative of $f(x) = x^x$ at $x = 1$?
= 1
! $x^x (\ln x + 1)$ at $1$.
```
