---
title: Practice – Differential Equations
summary: Review questions and a summary worksheet on differential equations.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. How do you decide which method a first-order equation needs?</summary>

First check whether it is **separable** (can it be written as $y' = f(x)g(y)$?). If not, check whether it is **linear** ($y' + p(x)y = q(x)$, i.e. $y$ and $y'$ appear only to the first power, without products). If neither, you usually need a numerical method.

</details>

<details>
<summary>2. Why is it enough to check a solution by substitution?</summary>

Because by definition a solution is a function that gives an identity when substituted and satisfies the initial conditions. The solution of an initial value problem (for nice enough $f$) is unique, so if a candidate passes the check, it is **the** solution, wherever it came from.

</details>

<details>
<summary>3. What is the physical meaning of complex roots of the characteristic equation?</summary>

The root pair $\lambda = \alpha \pm \beta i$ gives $e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$: $\beta$ is the **angular frequency** of the oscillation, and $\alpha$ the **damping** ($\alpha < 0$: decays, $\alpha = 0$: constant amplitude, $\alpha > 0$: grows).

</details>

<details>
<summary>4. Why is a very small step size not always a good idea in Euler's method?</summary>

Because the number of steps (and so the running time) is proportional to $\frac{1}{h}$, and with a huge number of steps rounding errors add up too. A higher-order method (Runge–Kutta), which is accurate with a larger step, is better.

</details>

## Summary worksheet

```quiz required
? Solve: $y' = 4y$, $y(0) = 0.5$.
fn: x -> 0.5 e^(4x)
domain: -1, 0.5

? Solve: $y' = 1 + y^2$, $y(0) = 0$ (on $-\frac{\pi}{2} < x < \frac{\pi}{2}$).
fn: x -> tan(x)
domain: -1, 1
! $\int \frac{dy}{1 + y^2} = \arctan y$.

? Solve: $y' + 2y = 4$, $y(0) = 0$.
fn: x -> 2 - 2 e^(-2x)

? Solve: $y'' + 9y = 0$, $y(0) = 0$, $y'(0) = 3$.
fn: x -> sin(3x)

? Solve: $y'' - y = 0$, $y(0) = 1$, $y'(0) = 1$.
fn: x -> e^x
domain: -2, 2

? What is the general solution of $y'' + 6y' + 9y = 0$?
- $C_1 e^{3x} + C_2 e^{-3x}$
+ $(C_1 + C_2 x)e^{-3x}$
- $C_1 \cos(3x) + C_2 \sin(3x)$
- $C_1 e^{-3x}$
! $\lambda^2 + 6\lambda + 9 = (\lambda + 3)^2$: a double root.

? An isotope has a half-life of $8$ days. In how many days does its amount drop to a quarter?
= 16

? For $y' = 2x$, $y(0) = 0$ we take two Euler steps with $h = 0.5$. What is $y_2$? (As a decimal.)
= 0.5
! The exact value is $y(1) = 1$; Euler's method underestimates here.
```
