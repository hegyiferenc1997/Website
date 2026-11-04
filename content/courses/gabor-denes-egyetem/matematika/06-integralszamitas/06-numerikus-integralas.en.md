---
title: Numerical Integration
summary: When there is no formula for the antiderivative: midpoint, trapezoidal and Simpson's rules, their errors and Python implementations.
minutes: 25
---

## What you will learn

- why **numerical** integration is needed,
- the **midpoint**, **trapezoidal** and **Simpson's** rules,
- how the **error** decreases with the step size, and how to program them.

## Why is it needed?

Many functions have **no elementary antiderivative**, e.g. $e^{-x^2}$ (the density of the normal distribution), $\frac{\sin x}{x}$, $\sqrt{1 + x^4}$. With measured data we don't even have a formula, only values. Then we use an approximation formula – this is how libraries (e.g. `scipy.integrate`) work too.

## The three basic rules

Divide $[a; b]$ into $n$ parts, $h = \frac{b - a}{n}$, $x_i = a + ih$.

**Midpoint (rectangle):**

$$
\int_a^b f \approx h \sum_{i=0}^{n-1} f\!\left(x_i + \tfrac{h}{2}\right).
$$

**Trapezoidal:** approximate the curve by a straight line on each part:

$$
\int_a^b f \approx h \left( \frac{f(x_0)}{2} + f(x_1) + \dots + f(x_{n-1}) + \frac{f(x_n)}{2} \right).
$$

**Simpson** ($n$ even): approximate the curve by a **parabola** on each pair of parts:

$$
\int_a^b f \approx \frac{h}{3} \big( f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \dots + 4f(x_{n-1}) + f(x_n) \big).
$$

## The error

| Method        | Order of the error | Error after doubling $n$     |
| ------------- | ------------------ | ---------------------------- |
| midpoint      | $h^2$              | about a quarter              |
| trapezoidal   | $h^2$              | about a quarter              |
| Simpson       | $h^4$              | about a sixteenth            |

Simpson's rule is **exact** for polynomials up to degree three.

```python run
import math

def midpoint(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + (i + 0.5) * h) for i in range(n))

def trapezoid(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + i * h) for i in range(1, n)) + f(b) / 2)

def simpson(f, a, b, n):
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3

# Exact value: ∫_0^π sin x dx = 2.
for n in [4, 8, 16]:
    print(f"n = {n:>2}: midpoint {midpoint(math.sin, 0, math.pi, n):.8f}  "
          f"trapezoid {trapezoid(math.sin, 0, math.pi, n):.8f}  "
          f"Simpson {simpson(math.sin, 0, math.pi, n):.8f}")

# Without an elementary antiderivative: ∫_0^1 e^(-x²) dx ≈ 0.746824
print("e^(-x²):", round(simpson(lambda x: math.exp(-x * x), 0, 1, 100), 6))
```

```plot
title: Midpoint rule for a function with no elementary antiderivative
x: -0.2, 2.2
y: -0.1, 1.2
param: k = 4, 1, 30, 1
riemann: e^(-x^2) @ 0, 2, k # e^(−x²)
```

## Summary

- Numerical integration is needed when there is no elementary antiderivative, or we only have measured data.
- Midpoint and trapezoidal: error $\sim h^2$; Simpson: error $\sim h^4$ (much more accurate).
- Simpson's weights: $1, 4, 2, 4, \dots, 4, 1$, multiplied by $\frac{h}{3}$.

## Lesson exercise

```quiz required
? Using the trapezoidal rule with $n = 2$ parts, what is the approximation of $\displaystyle\int_0^2 x^2\,dx$?
= 3
! $h = 1$: $1 \cdot \left(\frac{0}{2} + 1 + \frac{4}{2}\right)$

? Using Simpson's rule with $n = 2$ parts, what is the approximation of $\displaystyle\int_0^2 x^2\,dx$? (As a fraction or to two decimals.)
= 8/3
= 2.67
! $\frac{1}{3}(0 + 4 \cdot 1 + 4)$ – exact, because Simpson approximates with parabolas.

? If we double $n$ in the trapezoidal rule, roughly by what factor does the error shrink?
= 4
= 1/4
! The error is proportional to $h^2$.

? Which function has **no** elementary antiderivative?
- $x e^{x^2}$
+ $e^{-x^2}$
- $\frac{1}{1 + x^2}$
- $\cos^2 x$
! That is why the integral of the normal distribution is taken from tables or computed numerically.

? How many function values does Simpson's rule need with $n = 10$ parts?
= 11
```
