---
title: First-Order Linear Equations
summary: The equation y' + p(x)·y = q(x): homogeneous and inhomogeneous cases, variation of constants, the integrating factor, and charging an RC circuit.
minutes: 30
---

## What you will learn

- what a **first-order linear** differential equation is,
- how to solve it by **variation of constants** (and with an integrating factor),
- how a **capacitor** charges in an RC circuit.

## The structure of the equation

A **first-order linear** equation has the form

$$
y' + p(x)\,y = q(x).
$$

If $q \equiv 0$ it is **homogeneous**, otherwise **inhomogeneous**. The structure of the solution (a consequence of linearity):

$$
y = y_h + y_p, \qquad \text{(general solution of the homogeneous equation + one particular solution).}
$$

## Steps of the solution

**1. Homogeneous equation:** $y' = -p(x)\,y$ is separable, with solution $y_h = C e^{-P(x)}$, where $P$ is an antiderivative of $p$.

**2. Variation of constants:** look for the solution of the inhomogeneous equation in the form $y = C(x)\,e^{-P(x)}$. Substituting, the terms with $C(x)$ cancel and $C'(x) = q(x)\,e^{P(x)}$ remains; integrate to get $C(x)$.

(The **integrating factor** gives the same: multiplying by $\mu = e^{P(x)}$ turns the left-hand side into $(\mu y)'$, so $\mu y = \int \mu q\,dx$.)

**Example.** $y' + y = 1$, $y(0) = 0$.

- Homogeneous: $y_h = Ce^{-x}$.
- Variation: $y = C(x)e^{-x}$, $C'(x)e^{-x} = 1$, so $C'(x) = e^x$, $C(x) = e^x + K$.
- $y = 1 + Ke^{-x}$; the initial condition gives $K = -1$, so $y = 1 - e^{-x}$.

**Shortcut for constant coefficients:** if $p$ and $q$ are constant, the particular solution often "has the same form as $q$". For example, for $y' - 2y = e^x$, trying $y_p = Ae^x$ gives $A - 2A = 1$, $A = -1$.

## The RC circuit

Connecting a voltage $U$ to a circuit with resistance $R$ and capacitance $C$, the capacitor voltage $u(t)$ satisfies

$$
RC\,u' + u = U, \qquad u(0) = 0 \quad \Rightarrow \quad u(t) = U\left(1 - e^{-t/\tau}\right), \quad \tau = RC.
$$

$\tau$ is the **time constant**: at $t = \tau$ the voltage is $1 - e^{-1} \approx 63\%$ of the final value, and after $5\tau$ it is above $99\%$.

```plot
title: Charging a capacitor (t in ms, u in V)
x: 0, 10
y: 0, 6
param: U = 5, 1, 5.5, 0.5
param: tau = 1.5, 0.2, 5, 0.1
f: U (1 - e^(-x/tau)) # u(t)
dash: U # final value
tangent: U (1 - e^(-x/tau)) @ 0
point: tau, U (1 - e^(-1)) # t = τ: 63%
```

The tangent at $0$ reaches the final value exactly at $t = \tau$: a quick graphical way to read the time constant off an oscilloscope measurement.

## Summary

- $y' + p y = q$: $y = y_h + y_p$, where $y_h = Ce^{-P(x)}$.
- Variation of constants: $y = C(x)e^{-P(x)}$, $C' = q\,e^{P}$.
- RC circuit: $u = U(1 - e^{-t/RC})$, time constant $\tau = RC$.

## Lesson exercise

```quiz required
? Solve: $y' + y = 1$, $y(0) = 0$.
fn: x -> 1 - e^(-x)

? Solve: $y' = y + x$, $y(0) = 0$.
fn: x -> e^x - x - 1
domain: -2, 2
! Try $y_p = Ax + B$: $A = Ax + B + x$.

? Solve: $y' - 2y = e^x$, $y(0) = 0$.
fn: x -> e^(2x) - e^x
domain: -2, 1

? Solve: $x y' + y = 2x$, $y(1) = 2$ ($x > 0$).
fn: x -> x + 1/x
domain: 0.5, 3
! The left-hand side is exactly $(xy)'$.

? An RC circuit has $R = 2\ \mathrm{k\Omega}$, $C = 50\ \mathrm{\mu F}$. What is the time constant in seconds? (As a decimal.)
= 0.1
! $\tau = RC = 2000 \cdot 50 \cdot 10^{-6}$.

? In an RC circuit, how long after charging starts does the voltage reach about $63\%$ of its final value?
+ $\tau$
- $\frac{\tau}{2}$
- $\tau \ln 2$
- $5\tau$
```
