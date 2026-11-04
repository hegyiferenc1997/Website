---
title: What Is a Differential Equation?
summary: What a differential equation is, its order and its solutions, general and particular solutions, and the initial value problem.
minutes: 25
---

## What you will learn

- what a **differential equation** is, and why we use it to describe changing processes,
- what the **order** is, and when a function is a **solution**,
- what the **general** and the **particular** solution are,
- what an **initial value problem** is.

## Why differential equations?

For many processes we know not the quantity itself but the **rate at which it changes**. For example, a bacterial culture grows faster the more bacteria there are: $y'(t) = k \cdot y(t)$. An equation like this, where the unknown is a **function** and its derivatives appear, is called a **differential equation**.

- The **order** is the order of the highest derivative: $y' = ky$ is first-order, $y'' + y = 0$ is second-order.
- A function $y(x)$ is a **solution** if substituting it gives an identity.

**Example.** Is $y = e^{3x}$ a solution of $y' = 3y$? $y' = 3e^{3x} = 3y$. ✓ So is $y = 5e^{3x}$, and in fact every $y = Ce^{3x}$.

## General and particular solutions

The **general solution** contains all solutions; for an $n$-th order equation it (usually) has $n$ arbitrary constants. The general solution of $y' = ky$ is $y = Ce^{kx}$. The solution for a specific $C$ is a **particular** solution.

An **initial value problem** (Cauchy problem) also gives the initial state, e.g. $y(0) = y_0$. This determines the constant: $y(0) = C e^0 = C$, so $C = y_0$. (For a nice enough equation the solution is then **unique**.)

```plot
title: Solutions of y' = k·y: y = C·e^(kx)
x: -3, 3
y: -6, 6
param: C = 1, -3, 3, 0.1
param: k = 0.5, -2, 2, 0.1
f: C e^(k x) # the chosen solution
dash: e^(k x) # C = 1
dash: -e^(k x) # C = −1
point: 0, C # initial value: y(0) = C
tangent: C e^(k x) @ 0
```

The $C$ slider moves you along the "family" of solution curves; the initial value picks one of them. Watch the tangent: its slope at $x = 0$ is exactly $k \cdot C$, as the equation requires.

## What is it good for?

| Process                              | Equation            | Meaning                                                 |
| ------------------------------------ | ------------------- | ------------------------------------------------------- |
| population growth, compound interest | $y' = ky$, $k > 0$  | growth is proportional to the amount                    |
| radioactive decay                    | $y' = -\lambda y$   | decay is proportional to the remaining material         |
| Newton's law of cooling              | $T' = -k(T - T_a)$  | cooling is proportional to the temperature difference   |
| spring, LC circuit                   | $y'' = -\omega^2 y$ | the restoring force is proportional to the displacement |
| free fall                            | $y'' = -g$          | constant acceleration                                   |

## Summary

- Differential equation: the unknown is a function and its derivatives appear; the order is the highest derivative's order.
- General solution: $n$ free constants; an initial condition determines them.
- The solution of $y' = ky$ is $y = y_0 e^{kx}$.

## Lesson exercise

```quiz required
? What is the order of the differential equation $y''' - 2y' + y = \sin x$?
= 3

? Which function is a solution of $y'' + 9y = 0$?
- $y = e^{3x}$
+ $y = \cos(3x)$
- $y = \sin(9x)$
- $y = x^3$
! $(\cos 3x)'' = -9\cos 3x$.

? Solve the initial value problem: $y' = 3y$, $y(0) = 2$.
fn: x -> 2 e^(3x)
domain: -1, 1

? Solve: $y' = -0.5\,y$, $y(0) = 10$.
fn: x -> 10 e^(-0.5x)

? How many free constants does the general solution of a second-order differential equation (usually) have?
= 2

? A solution of $y' = ky$ has $y(0) = 4$, and the slope of the tangent there is $2$. What is $k$? (As a decimal or a fraction.)
= 0.5
= 1/2
! $y'(0) = k \cdot y(0)$.
```
