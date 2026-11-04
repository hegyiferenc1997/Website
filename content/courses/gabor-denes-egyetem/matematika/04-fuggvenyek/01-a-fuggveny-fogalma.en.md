---
title: The Concept of a Function
summary: Assignment, domain, range, ways of defining a function and its graph.
minutes: 20
---

## What you will learn

- what a **function** is (a unique assignment),
- what the **domain** and the **range** are and how to find them,
- how a function can be given (formula, table, graph, program) and what its **graph** means.

## Definition

A **function** $f : A \to B$ assigns to **every** element of the set $A$ **exactly one** element of $B$. If $x \in A$, the element assigned to $x$ is $f(x)$, the **value** of the function at $x$.

- $D_f = A$ is the **domain** (the allowed inputs),
- $R_f = \{ f(x) : x \in D_f \} \subseteq B$ is the **range** (the values actually taken).

In programming a function is exactly this: every allowed input has **one** output. (A "function" returning a random number is not a function in the mathematical sense.)

## The natural domain

If only the formula is given, $D_f$ is the set of real numbers where the formula makes sense:

- denominator $\neq 0$,
- under an even root $\geq 0$,
- argument of a logarithm $> 0$.

Example: $f(x) = \dfrac{\sqrt{x + 3}}{x - 1}$. Conditions: $x + 3 \geq 0$ and $x \neq 1$, so $D_f = [-3; 1[ \ \cup\ ]1; \infty[$.

## Ways of defining a function

1. **Formula:** $f(x) = x^2 - 2x$.
2. **Table:** for measured data (e.g. hourly temperature).
3. **Graph:** the set of points $\{(x; f(x)) : x \in D_f\}$ in the plane.
4. **Program / algorithm:** e.g. `def f(x): return x*x - 2*x`.
5. **Piecewise:** $\ f(x) = \begin{cases} -x, & x < 0 \\ x^2, & x \geq 0 \end{cases}$

**Vertical line test:** a curve is the graph of a function if every vertical line meets it in **at most one** point. That is why a circle ($x^2 + y^2 = 1$) is not the graph of a function.

## Finding the range

$f(x) = x^2 - 2x = (x - 1)^2 - 1$ (completing the square). Since $(x - 1)^2 \geq 0$, $f(x) \geq -1$, and every value $y \geq -1$ is taken. So $R_f = [-1; \infty[$.

```plot
title: The function f(x) = x² − 2x
x: -3, 5
y: -2, 8
param: a = 3, -2.5, 4.5, 0.1
f: x^2 - 2x # f(x) = x² − 2x
point: a, a^2 - 2a # (a; f(a))
value: f(a) = a^2 - 2a
```

Move the point with the slider: you can see that the value is never smaller than $-1$.

## Summary

- Function: for every $x \in D_f$ **exactly one** $f(x)$.
- $D_f$: allowed inputs (denominator $\neq 0$, under an even root $\geq 0$, log argument $> 0$); $R_f$: the values taken.
- Graph: the points $(x; f(x))$; vertical line test.

## Lesson exercise

```quiz required
? What is $f(-2)$ if $f(x) = x^2 - 2x$?
= 8

? What is the smallest element of the range of $f(x) = x^2 - 2x$?
= -1
! $(x - 1)^2 - 1$

? Which number is **not** in the domain of $f(x) = \dfrac{\sqrt{x + 3}}{x - 1}$?
- $-3$
- $0$
+ $1$
- $5$
! The denominator cannot be $0$.

? What is the smallest integer that is **not** in the domain of $g(x) = \lg(5 - x)$?
= 5
! $5 - x > 0 \iff x < 5$

? Which is **not** the graph of a function?
- a non-vertical line
- an upward-opening parabola
+ the unit circle centred at the origin
- the "V" shape of the absolute value function
! A vertical line can meet the circle at two points.
```
