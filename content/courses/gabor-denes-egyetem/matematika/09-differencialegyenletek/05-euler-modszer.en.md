---
title: Numerical Solution – Euler's Method
summary: When there is no formula: Euler's method, how the error depends on the step size, stability, and a small program for the solution.
minutes: 30
---

## What you will learn

- why most differential equations need a **numerical method**,
- how **Euler's method** works,
- how the **error** depends on the step size, and what **stability** is,
- how to write a **program** for it.

## The idea

Most practical differential equations (e.g. $y' = \sin(xy)$) have no closed-form solution. Then we approximate **step by step**: if we know where we are and the equation tells us the **slope**, we move on along the tangent by a small step $h$.

For the problem $y' = f(x, y)$, $y(x_0) = y_0$, **Euler's method** is:

$$
x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h \cdot f(x_n, y_n).
$$

**Example.** $y' = x + y$, $y(0) = 1$, $h = 0.5$.

- $y_1 = 1 + 0.5 \cdot (0 + 1) = 1.5$ (at $x_1 = 0.5$),
- $y_2 = 1.5 + 0.5 \cdot (0.5 + 1.5) = 2.5$ (at $x_2 = 1$).

The exact solution is $y = 2e^x - x - 1$, so $y(1) = 2e - 2 \approx 3.44$: the coarse step makes the error large.

## Step size and error

For $y' = y$, $y(0) = 1$ (exact solution $e^x$), the Euler step is $y_{n+1} = (1 + h)\,y_n$, so $y_n = (1 + h)^n$. The dashed line is Euler's piecewise-linear approximation.

```plot
title: Euler's method for y' = y, y(0) = 1
x: 0, 3
y: 0, 21
param: h = 0.5, 0.05, 1, 0.05
f: e^x # exact solution: eˣ
dash: (1 + h)^floor(x/h) (1 + x - h floor(x/h)) # Euler approximation
value: error at x = 2 = e^2 - (1 + h)^floor(2/h) (1 + 2 - h floor(2/h))
```

Notice: halving $h$ **roughly halves** the error. Euler's method is **first-order**: the error is proportional to $h$. That is why more accurate methods are used in practice (e.g. the **fourth-order Runge–Kutta** method, where halving $h$ cuts the error to a sixteenth), but they all build on the same idea.

## Stability

With too large a step, the method can be **unstable**. The solution of $y' = -2y$, $y(0) = 1$ is $e^{-2x}$, which decays nicely. With Euler's method, $y_{n+1} = (1 - 2h)\,y_n$: for $h = 1$, $y_n = (-1)^n$, the approximation oscillates, and for $h > 1$ it blows up. Stability here requires $\lvert 1 - 2h \rvert < 1$, that is, $h < 1$.

## With a program

```python run
import math
# Euler's method: y' = f(x, y), y(x0) = y0, n steps with step size h
def euler(f, x0, y0, h, n):
    x, y = x0, y0
    for _ in range(n):
        y = y + h * f(x, y)
        x = x + h
    return y

f = lambda x, y: x + y              # y' = x + y, y(0) = 1, exact: 2e^x - x - 1
exact = 2 * math.e - 2
for h in [0.5, 0.1, 0.01, 0.001]:
    approx = euler(f, 0.0, 1.0, h, round(1 / h))
    print(f"h = {h:<6} y(1) ≈ {approx:.6f}   error = {abs(exact - approx):.2e}")
```

## Summary

- Euler's method: $y_{n+1} = y_n + h\,f(x_n, y_n)$, stepping along the tangent.
- First-order: error $\sim h$; half the step size, about half the error (but twice the steps).
- Too large an $h$ can cause instability; in practice Runge–Kutta methods are used.

## Lesson exercise

```quiz required
? For $y' = y$, $y(0) = 1$ we take two Euler steps with $h = 0.1$. What is $y_2$? (As a decimal.)
= 1.21

? For $y' = x + y$, $y(0) = 1$ we take two steps with $h = 0.5$. What is $y_2 \approx y(1)$? (As a decimal.)
= 2.5

? What happens to the error of Euler's method if the step size is halved?
- it does not change
+ it roughly halves
- it drops to a quarter
- it drops to a sixteenth

? For $y' = -2y$, $y(0) = 1$ with $h = 1$, what is $y_1$?
= -1
! $y_1 = 1 + 1 \cdot (-2 \cdot 1)$.

? How many Euler steps are needed to go from $x = 0$ to $x = 2$ with step size $h = 0.01$?
= 200

? For $y' = y$, after $n$ steps $y_n = (1 + h)^n$. What does $(1 + h)^{1/h}$ (the approximation at $x = 1$) tend to as $h \to 0$?
+ $e$
- $1$
- $\infty$
- $2$
! This is the definition of $e$ (see the topic on sequences).
```
