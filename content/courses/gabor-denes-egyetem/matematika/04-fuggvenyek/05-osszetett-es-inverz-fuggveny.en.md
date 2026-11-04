---
title: Operations on Functions, Composite and Inverse Functions
summary: Sum, product, quotient, composition, one-to-one functions and the inverse.
minutes: 25
---

## What you will learn

- the **sum**, **product** and **quotient** of functions and their domain,
- the **composite function** (composition), and that order matters,
- when a function has an **inverse** and how to compute it.

## Basic operations

$(f + g)(x) = f(x) + g(x)$, $\ (f g)(x) = f(x) g(x)$, $\ \left(\dfrac{f}{g}\right)(x) = \dfrac{f(x)}{g(x)}$. The domain is $D_f \cap D_g$, and for the quotient the zeros of $g$ must also be removed.

Example: $f(x) = \sqrt{x}$, $g(x) = x - 2$. Then $\dfrac{f}{g}(x) = \dfrac{\sqrt x}{x - 2}$ with domain $[0; 2[ \ \cup\ ]2; \infty[$.

## Composite functions

$f \circ g$ (read "$f$ composed with $g$") is the **composite function**: $(f \circ g)(x) = f\big(g(x)\big)$. First the **inner** function ($g$) computes, and the **outer** one ($f$) receives the result.

$f(x) = x^2$, $g(x) = x + 3$:

$$
(f \circ g)(x) = (x + 3)^2, \qquad (g \circ f)(x) = x^2 + 3.
$$

So order **matters**: in general $f \circ g \neq g \circ f$. In programming this is nesting function calls: `f(g(x))`, or a command-line pipe (`g | f`).

Decomposing a composite function: $h(x) = \sin^2(3x + 1)$ = outer $u^2$, middle $\sin u$, inner $3x + 1$. We will use this for the chain rule (differentiation).

## Inverse functions

$f$ is **one-to-one** (injective) if it takes different values at different points: $x_1 \neq x_2 \Rightarrow f(x_1) \neq f(x_2)$. Strictly monotonic functions are like this. Then the **inverse** $f^{-1}$ exists and maps "backwards":

$$
f^{-1}(y) = x \iff f(x) = y, \qquad D_{f^{-1}} = R_f, \quad R_{f^{-1}} = D_f.
$$

**Computing it:** express $x$ from $y = f(x)$, then swap the variables.

Example: $f(x) = 2x + 6$. $\ y = 2x + 6 \Rightarrow x = \dfrac{y - 6}{2}$, so $f^{-1}(x) = \dfrac{x - 6}{2} = \dfrac{x}{2} - 3$.

The graph of the inverse is the **mirror image of the original in the line $y = x$**. Well-known pairs: $e^x$ and $\ln x$, $x^2$ (restricted to $x \geq 0$) and $\sqrt x$, $\sin x$ (restricted to $[-\frac{\pi}{2}; \frac{\pi}{2}]$) and $\arcsin x$.

```plot
title: A function and its inverse: reflection in y = x
x: -4, 6
y: -4, 6
param: m = 2, 0.3, 3, 0.1
param: b = -1, -3, 3, 0.5
f: m x + b # f(x) = mx + b
f: (x - b)/m # f⁻¹(x) = (x − b)/m
dash: x # y = x
```

## Summary

- $f \pm g$, $fg$, $f/g$: domain $D_f \cap D_g$ (for the quotient $g \neq 0$).
- $(f \circ g)(x) = f(g(x))$: inner first; order matters.
- Only one-to-one functions have an inverse; express $x$ from $y = f(x)$; the graph is reflected in $y = x$.

## Lesson exercise

```quiz required
? $f(x) = x^2$, $g(x) = x + 3$. What is $(f \circ g)(2)$?
= 25

? With the same functions, what is $(g \circ f)(2)$?
= 7

? $f(x) = 3x - 1$, $g(x) = x^2$. Give the formula of $f(g(x))$!
fn: x -> 3x^2 - 1

? Give the inverse of $f(x) = \dfrac{x + 4}{3}$!
fn: x -> 3x - 4
! $y = \frac{x + 4}{3} \Rightarrow x = 3y - 4$

? Which function has **no** inverse on the whole of $\mathbb{R}$?
- $x^3$
- $e^x$
+ $x^2$
- $2x + 1$
! $(-2)^2 = 2^2$: it is not one-to-one.
```
