---
title: Antiderivatives and the Indefinite Integral
summary: Reversing differentiation, the table of basic integrals and the linearity rules.
minutes: 25
---

## What you will learn

- what an **antiderivative** is and why there are infinitely many,
- what the **indefinite integral** is and how it is written,
- the **basic integrals** and the **linearity** rules of integration,
- integrals of the form $\int f(ax + b)\,dx$.

## Antiderivatives

$F$ is an **antiderivative** (primitive) of $f$ (on an interval) if $F'(x) = f(x)$. Integration is thus the **reverse** of differentiation.

Example: an antiderivative of $f(x) = 2x$ is $F(x) = x^2$, but so are $x^2 + 5$ and $x^2 - 7$, because the derivative of a constant is $0$. On an interval **any two antiderivatives differ only by a constant**.

## The indefinite integral

The set of all antiderivatives of $f$ is the **indefinite integral**:

$$
\int f(x)\,dx = F(x) + C, \qquad C \in \mathbb{R}.
$$

$f(x)$ is the **integrand**, $dx$ indicates the variable of integration, $C$ is the **constant of integration**.

## Basic integrals

| $f(x)$                      | $\int f(x)\,dx$              |
| --------------------------- | ---------------------------- |
| $x^n$ ($n \neq -1$)         | $\dfrac{x^{n+1}}{n + 1} + C$ |
| $\dfrac{1}{x}$              | $\ln \lvert x \rvert + C$    |
| $e^x$                       | $e^x + C$                    |
| $a^x$                       | $\dfrac{a^x}{\ln a} + C$     |
| $\sin x$                    | $-\cos x + C$                |
| $\cos x$                    | $\sin x + C$                 |
| $\dfrac{1}{\cos^2 x}$       | $\tan x + C$                 |
| $\dfrac{1}{1 + x^2}$        | $\arctan x + C$              |
| $\dfrac{1}{\sqrt{1 - x^2}}$ | $\arcsin x + C$              |

You can check every row by differentiating! For example $\left(\ln\lvert x \rvert\right)' = \frac{1}{x}$ both for $x > 0$ and for $x < 0$.

## Linearity

$$
\int \big(a f(x) + b g(x)\big)\,dx = a \int f(x)\,dx + b \int g(x)\,dx.
$$

Example: $\displaystyle\int \left(6x^2 - \frac{4}{x} + 3\cos x\right) dx = 2x^3 - 4\ln\lvert x \rvert + 3 \sin x + C$.

Roots and fractions as powers: $\displaystyle\int \sqrt{x}\,dx = \int x^{1/2}\,dx = \frac{2}{3} x^{3/2} + C$, $\ \displaystyle\int \frac{1}{x^3}\,dx = \frac{x^{-2}}{-2} + C = -\frac{1}{2x^2} + C$.

## Linear inner function

If $\int f(x)\,dx = F(x) + C$, then

$$
\int f(ax + b)\,dx = \frac{1}{a} F(ax + b) + C \qquad (a \neq 0).
$$

Examples: $\int e^{3x}\,dx = \frac{1}{3} e^{3x} + C$, $\ \int \cos(2x + 1)\,dx = \frac{1}{2}\sin(2x + 1) + C$, $\ \int (5x - 2)^4\,dx = \frac{(5x - 2)^5}{25} + C$.

```plot
title: Antiderivatives of the same function: F(x) + C
x: -3, 3
y: -4, 6
param: C = 0, -3, 3, 0.5
f: x^2 + C # F(x) = x² + C
dash: 2x # f(x) = 2x
```

The $C$ slider shifts the antiderivative vertically, but its slope (its derivative) is the same at every point: $2x$.

## Summary

- $F$ is an antiderivative of $f$ if $F' = f$; they differ only by a constant.
- $\int f(x)\,dx = F(x) + C$.
- $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ ($n \neq -1$), $\int \frac{1}{x}\,dx = \ln\lvert x\rvert + C$.
- $\int f(ax + b)\,dx = \frac{1}{a}F(ax + b) + C$.

## Lesson exercise

You don't have to type $+C$; the checker accepts answers that differ by a constant.

```quiz required
? Compute: $\displaystyle\int (3x^2 + 4x - 1)\,dx$.
fn: x -> x^3 + 2x^2 - x
+C

? Compute: $\displaystyle\int \left(\frac{2}{x} + e^x\right) dx$ ($x > 0$).
fn: x -> 2 ln(x) + e^x
domain: 0.2, 4
+C

? Compute: $\displaystyle\int \sqrt[3]{x}\,dx$ ($x > 0$).
fn: x -> 3/4 x^(4/3)
domain: 0.2, 4
+C
! The integral of $x^{1/3}$ is $\frac{x^{4/3}}{4/3}$.

? Compute: $\displaystyle\int \sin(4x)\,dx$.
fn: x -> -cos(4x)/4
+C

? Which one is **not** an antiderivative of $2\cos(2x)$?
- $\sin(2x)$
- $\sin(2x) + 7$
+ $2\sin(2x)$
- $\sin(2x) - \pi$
! Check by differentiating: $(2\sin 2x)' = 4\cos 2x$.
```
