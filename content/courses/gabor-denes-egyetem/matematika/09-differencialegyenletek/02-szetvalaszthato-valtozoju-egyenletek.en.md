---
title: Separable Equations
summary: Solving equations of the form y' = f(x)·g(y), radioactive decay and half-life, Newton's law of cooling.
minutes: 30
---

## What you will learn

- to recognise and solve **separable** equations,
- to compute the **half-life**,
- to describe the **cooling** of a body (Newton's law).

## The method

If the equation has the form $y' = f(x)\,g(y)$, then writing $y' = \frac{dy}{dx}$ the variables can be **separated**:

$$
\frac{dy}{g(y)} = f(x)\,dx \quad \Rightarrow \quad \int \frac{dy}{g(y)} = \int f(x)\,dx + C.
$$

Integrate both sides, then (if possible) solve for $y$. Careful: where $g(y) = 0$, the constant $y \equiv$ const is also a solution (we may lose it when dividing).

**Example.** $y' = 2xy$, $y(0) = 1$.

$$
\int \frac{dy}{y} = \int 2x\,dx \;\Rightarrow\; \ln\lvert y \rvert = x^2 + c \;\Rightarrow\; y = C e^{x^2}.
$$

The initial condition gives $C = 1$, so $y = e^{x^2}$.

**Example.** $y' = \frac{x}{y}$, $y(0) = 2$. $\int y\,dy = \int x\,dx$, $\frac{y^2}{2} = \frac{x^2}{2} + c$, so $y^2 = x^2 + C$. The initial condition gives $C = 4$, and since $y(0) > 0$: $y = \sqrt{x^2 + 4}$.

## Radioactive decay and half-life

The solution of $N' = -\lambda N$ is $N(t) = N_0 e^{-\lambda t}$. The **half-life** is the time it takes for the amount to halve:

$$
N_0 e^{-\lambda T_{1/2}} = \frac{N_0}{2} \;\Rightarrow\; T_{1/2} = \frac{\ln 2}{\lambda}.
$$

After $n$ half-lives, a fraction $\left(\frac{1}{2}\right)^n$ remains. Radiocarbon dating is based on this (the half-life of $^{14}\mathrm{C}$ is about $5730$ years).

## Newton's law of cooling

A body's temperature changes faster the larger the difference from the ambient temperature $T_a$: $T' = -k(T - T_a)$. Separating ($u = T - T_a$, $u' = -ku$):

$$
T(t) = T_a + (T_0 - T_a)\,e^{-kt}.
$$

```plot
title: A cup of coffee cooling (t in minutes, T in °C)
x: 0, 60
y: 0, 100
param: T0 = 90, 40, 100, 1
param: Tk = 20, 0, 30, 1
param: k = 0.07, 0.01, 0.3, 0.01
f: Tk + (T0 - Tk) e^(-k x) # T(t)
dash: Tk # ambient
tangent: Tk + (T0 - Tk) e^(-k x) @ 0
value: T(10 min) = Tk + (T0 - Tk) e^(-10k)
value: half-life (min) = ln(2)/k
```

(On the sliders, $T_k$ is the ambient temperature.) The half-life of the temperature **difference** is $\frac{\ln 2}{k}$: in that time the gap between the coffee and the room halves. The initial tangent has slope $-k(T_0 - T_a)$: the coffee cools fastest at the start.

```python run
import math
# Checking the solution of the separable equation with numerical differentiation: y = e^(x²), y' = 2xy?
def y(x):
    return math.exp(x * x)

for x in [-1.0, -0.5, 0.0, 0.5, 1.0]:
    h = 1e-6
    derivative = (y(x + h) - y(x - h)) / (2 * h)
    print(f"x = {x:+.1f}: y' ≈ {derivative:.5f}, 2xy = {2 * x * y(x):.5f}")
```

## Summary

- $y' = f(x)g(y)$: $\int \frac{dy}{g(y)} = \int f(x)\,dx$, then the constant comes from the initial condition.
- Decay: $N = N_0 e^{-\lambda t}$, $T_{1/2} = \frac{\ln 2}{\lambda}$.
- Cooling: $T = T_a + (T_0 - T_a)e^{-kt}$.

## Lesson exercise

```quiz required
? Solve: $y' = 2xy$, $y(0) = 3$.
fn: x -> 3 e^(x^2)
domain: -1, 1

? Solve: $y' = \dfrac{x}{y}$, $y(0) = 2$ (where $y > 0$).
fn: x -> sqrt(x^2 + 4)

? Solve: $y' = y^2$, $y(0) = 1$ (on $x < 1$).
fn: x -> 1/(1 - x)
domain: -2, 0.5
! $\int y^{-2}\,dy = -\frac{1}{y}$, so $-\frac{1}{y} = x + c$.

? A substance has a half-life of $5730$ years. What fraction of the original amount remains after $11\,460$ years? (As a decimal or a fraction.)
= 0.25
= 1/4

? A $90$ °C coffee cools to $55$ °C in $10$ minutes in a $20$ °C room. What will its temperature be after $20$ minutes? (As a decimal.)
= 37.5
! The difference halved from $70$ to $35$ in $10$ minutes; after another $10$ minutes it is $17.5$.

? Which one is separable?
+ $y' = x^2 \cos y$
- $y' = x + y$
- $y' = \sin(xy) + 1$
- $y'' = y$
! Is the right-hand side of the form $f(x) \cdot g(y)$?
```
