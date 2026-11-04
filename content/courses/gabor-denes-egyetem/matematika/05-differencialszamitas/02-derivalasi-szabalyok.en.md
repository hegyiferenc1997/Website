---
title: Differentiation Rules
summary: Derivatives of elementary functions and the rules for sums, constant multiples, products and quotients.
minutes: 25
---

## What you will learn

- the derivatives of the **elementary functions** (table of derivatives),
- the **constant multiple**, **sum**, **product** and **quotient** rules,
- how to differentiate polynomials and rational functions quickly.

## Table of derivatives

| $f(x)$           | $f'(x)$               |
| ---------------- | --------------------- |
| $c$ (constant)   | $0$                   |
| $x^n$ ($n$ real) | $n x^{n-1}$           |
| $e^x$            | $e^x$                 |
| $a^x$            | $a^x \ln a$           |
| $\ln x$          | $\dfrac{1}{x}$        |
| $\log_a x$       | $\dfrac{1}{x \ln a}$  |
| $\sin x$         | $\cos x$              |
| $\cos x$         | $-\sin x$             |
| $\tan x$         | $\dfrac{1}{\cos^2 x}$ |

The power rule works for roots and fractions too: $(\sqrt x)' = \left(x^{1/2}\right)' = \dfrac{1}{2\sqrt x}$, $\left(\dfrac{1}{x^2}\right)' = (x^{-2})' = -\dfrac{2}{x^3}$.

## Rules for operations

$$
(c f)' = c f', \qquad (f \pm g)' = f' \pm g',
$$

$$
(f g)' = f' g + f g', \qquad \left(\frac{f}{g}\right)' = \frac{f' g - f g'}{g^2}.
$$

Careful: the derivative of a product is **not** the product of the derivatives!

## Examples

**Polynomial:** $\left(4x^3 - 5x^2 + 7x - 2\right)' = 12x^2 - 10x + 7$.

**Product:** $\left(x^2 e^x\right)' = 2x e^x + x^2 e^x = e^x (x^2 + 2x)$.

**Quotient:**

$$
\left(\frac{x}{x^2 + 1}\right)' = \frac{1 \cdot (x^2 + 1) - x \cdot 2x}{(x^2 + 1)^2} = \frac{1 - x^2}{(x^2 + 1)^2}.
$$

## See it: a function and its derivative

```plot
title: f and f′: where f increases, f′ > 0
x: -4, 4
y: -6, 6
param: t = 0.5, -3.5, 3.5, 0.1
tangent: x^3 - 3x @ t # f(x) = x³ − 3x
dash: 3x^2 - 3 # f′(x) = 3x² − 3
point: t, 3t^2 - 3 # f′(t)
```

The dashed curve is the derivative. The slope of the tangent (shown below) always equals the value of the dashed curve at the same point. Where $f'(x) = 0$ ($x = \pm 1$), the tangent is horizontal.

## Summary

- $(x^n)' = n x^{n-1}$, $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$, $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$.
- Sums term by term, constants factor out.
- $(fg)' = f'g + fg'$; $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$.

## Lesson exercise

Type the formulas using the notation below the field (e.g. `3x^2 - 4`, `e^x*(x+1)`, `cos(x)`).

```quiz required
? Differentiate: $f(x) = 2x^5 - 3x^2 + 4x - 9$.
fn: x -> 10x^4 - 6x + 4

? Differentiate: $f(x) = \sqrt{x} + \dfrac{1}{x}$.
fn: x -> 1/(2 sqrt(x)) - 1/x^2
domain: 0.2, 4

? Differentiate: $f(x) = x \sin x$.
fn: x -> sin(x) + x cos(x)
! Product rule.

? Differentiate: $f(x) = \dfrac{x - 1}{x + 1}$.
fn: x -> 2/(x + 1)^2
domain: 0, 4
! Quotient rule: $\frac{(x + 1) - (x - 1)}{(x + 1)^2}$

? What is the derivative of $f(x) = x^3 - 3x$ at $x = 2$?
= 9
```
