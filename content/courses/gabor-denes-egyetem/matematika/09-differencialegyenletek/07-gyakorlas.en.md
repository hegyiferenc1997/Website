---
title: Practice – Differential Equations
summary: Review questions and a summary worksheet on differential equations.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Euler's method.** Write the function `euler(f, y0, h, steps)`, which approximates the initial value problem $y' = f(t, y)$, $y(0) = y_0$ with `steps` steps of length `h`, and returns the final value of $y$ rounded to 4 decimals!

```python starter
def euler(f, y0, h, steps):
    return round(y0 + f(0, y0) * h * steps, 4)
```

<details>
<summary>Solution</summary>

The starter code steps with the initial slope all the way – that's only correct if the slope is constant.

```python solution
def euler(f, y0, h, steps):
    t, y = 0.0, y0
    for _ in range(steps):
        y += h * f(t, y)                  # step with the current slope
        t += h
    return round(y, 4)
```

</details>

```python test
assert euler(lambda t, y: y, 1, 0.5, 2) == 2.25
assert euler(lambda t, y: y, 1, 0.001, 1000) == 2.7169
assert euler(lambda t, y: 2 * t, 0, 0.1, 10) == 0.9
assert euler(lambda t, y: -0.5 * y, 10, 1, 3) == 1.25
print("All checks passed!")
```

**2.** **Half-life.** The solution of the decay $N' = -kN$ is $N(t) = N_0 e^{-kt}$. Write the functions `half_life(k)` and `remaining(n0, k, t)`: the first returns the half-life to 2 decimals, the second the amount remaining after time $t$, rounded to 2 decimals!

```python starter
def half_life(k):
    return round(1 / k, 2)

def remaining(n0, k, t):
    return round(n0 - k * t, 2)
```

<details>
<summary>Solution</summary>

```python solution
import math

def half_life(k):
    return round(math.log(2) / k, 2)      # e^(−kT) = 1/2  →  T = ln 2 / k

def remaining(n0, k, t):
    return round(n0 * math.exp(-k * t), 2)
```

</details>

```python test
assert half_life(0.1) == 6.93
assert half_life(0.000121) == 5728.49     # carbon-14, in years
assert remaining(100, 0.1, 6.931) == 50.0
assert remaining(80, 0.5, 2) == 29.43
print("All checks passed!")
```

**3.** **Newton's law of cooling.** The solution of the equation $T' = -k(T - T_k)$ is $T(t) = T_k + (T_0 - T_k)e^{-kt}$. Write the function `cooling_time(T0, Tk, k, target)`, which tells how many minutes it takes the object to cool down to the `target` temperature (rounded to 1 decimal)!

```python starter
def cooling_time(T0, Tk, k, target):
    return round((T0 - target) / k, 1)
```

<details>
<summary>Solution</summary>

Hot coffee (90 °C) in a 20 °C room reaches a drinkable 55 °C in about 14 minutes, but getting to 30 °C takes almost three times as long – the closer it is to the surroundings, the slower it cools.

```python solution
import math

def cooling_time(T0, Tk, k, target):
    # target = Tk + (T0 − Tk)·e^(−kt)  →  t = ln((T0 − Tk) / (target − Tk)) / k
    return round(math.log((T0 - Tk) / (target - Tk)) / k, 1)
```

</details>

```python test
assert cooling_time(90, 20, 0.05, 55) == 13.9
assert cooling_time(90, 20, 0.05, 30) == 38.9
assert cooling_time(200, 25, 0.1, 60) == 16.1
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the order of the differential equation $y'' + 3y' - y = \sin x$?
= 2
! The highest derivative that appears is the second.

? Give the solution of the initial value problem $y' = -3y$, $y(0) = 5$!
fn: x -> 5*e^(-3*x)
domain: 0, 1
! $y = Ce^{-3x}$, $C = 5$.

? A substance has a half-life of 10 days. What fraction of the initial amount remains after 30 days? (fraction or decimal)
= 1/8
= 0,125
= 0.125
! Three halvings: $\left(\frac12\right)^3 = \frac18$.

? The characteristic roots of the equation $y'' + 4y = 0$ are $\pm 2i$. What motion does it describe?
- exponentially decaying motion, without oscillation
+ undamped harmonic oscillation
- exponentially growing motion
- uniform motion
! $y = C_1 \cos 2x + C_2 \sin 2x$.

? The time constant of an RC circuit is $\tau = RC$. What is $\tau$ (s) if $R = 10\,\text{k}\Omega$ and $C = 100\,\mu\text{F}$?
= 1
! $10^4 \cdot 10^{-4} = 1$ s.
```
