---
title: Practice – Differential Calculus
summary: Review questions and a summary worksheet on differentiation and analysing functions.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. What is the geometric and the physical meaning of the derivative?</summary>

Geometrically it is the slope of the tangent at the point; physically it is the instantaneous rate of change (e.g. the derivative of distance is velocity, and that of velocity is acceleration).

</details>

<details>
<summary>2. When do you need the chain rule?</summary>

When the function is composite, i.e. the argument of a function is not simply $x$ but another expression: $\sin(3x)$, $e^{x^2}$, $(2x + 1)^5$, $\ln(\cos x)$. Then the derivative of the outer function must be multiplied by the derivative of the inner one.

</details>

<details>
<summary>3. Why isn't f′(x₀) = 0 enough for an extremum?</summary>

Because the derivative does not necessarily change sign: the derivative of $x^3$ is $0$ at $0$, but positive before and after, so the function increases all along (it is an inflection point, not an extremum).

</details>

<details>
<summary>4. When does Newton's method not work well?</summary>

If the starting value is far away, if at some step $f'(x_n) \approx 0$ (the tangent is almost horizontal and the next point jumps very far), or if the approximations go round in circles. Then it is safer to narrow down with bisection first.

</details>

## Summary worksheet

```quiz required
? Differentiate: $f(x) = x^3 \ln x$.
fn: x -> 3x^2 ln(x) + x^2
domain: 0.2, 4

? Differentiate: $f(x) = \dfrac{e^x}{x^2 + 1}$.
fn: x -> e^x (x - 1)^2/(x^2 + 1)^2
domain: -2, 2
! $\frac{e^x(x^2 + 1) - e^x \cdot 2x}{(x^2 + 1)^2}$

? Differentiate: $f(x) = \sqrt{1 + \sin^2 x}$.
fn: x -> sin(x) cos(x)/sqrt(1 + sin(x)^2)

? Write the tangent of $f(x) = e^{2x}$ at $x_0 = 0$ in the form $y = g(x)$!
fn: x -> 2x + 1

? What is $\lim\limits_{x \to 0} \dfrac{x - \sin x}{x^3}$? (As a fraction or decimal.)
= 1/6
! Apply L'Hôpital's rule three times.

? Where does $f(x) = 2x^3 - 9x^2 + 12x$ have a local **minimum**? (Give the $x$ value.)
= 2
! $f'(x) = 6(x - 1)(x - 2)$

? What is the first coordinate of the inflection point of $f(x) = 2x^3 - 9x^2 + 12x$? (As a decimal.)
= 1.5
= 3/2

? An open-top box with a square base and volume $V = 1$ litre needs $A(a) = a^2 + \frac{4}{a}$ (dm²) of material, where $a$ is the base edge (dm). For which $a$ is it minimal?
= 1.26
! $A'(a) = 2a - \frac{4}{a^2} = 0 \Rightarrow a^3 = 2$, $a = \sqrt[3]{2}$ (to two decimals).
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Numerical derivative.** Write the function `derivative(f, x)`, which approximates $f'(x)$ with the central difference ($h = 10^{-5}$) and returns it rounded to 4 decimals!

```python starter
def derivative(f, x):
    h = 1e-5
    return round((f(x + h) - f(x)) / h, 4)
```

<details>
<summary>Solution</summary>

The starter code uses the forward difference: for $x^3$ at $x = 2$ its error is about $6h = 6 \cdot 10^{-5}$, which already rounds to $12.0001$.

```python solution
def derivative(f, x):
    h = 1e-5
    return round((f(x + h) - f(x - h)) / (2 * h), 4)   # symmetric difference
```

</details>

```python test
import math
assert derivative(lambda x: x ** 3, 2) == 12.0
assert derivative(math.sin, 0) == 1.0
assert derivative(math.exp, 1) == 2.7183
assert derivative(lambda x: 1 / x, 2) == -0.25
print("All checks passed!")
```

**2.** **Newton's method.** The root of the equation $f(x) = 0$ can be approximated with the iteration $x_{k+1} = x_k - \dfrac{f(x_k)}{f'(x_k)}$ (where the tangent crosses the $x$ axis). Write the function `newton(f, df, x0, steps)`, which returns the approximation after `steps` steps, rounded to 6 decimals!

```python starter
def newton(f, df, x0, steps):
    return round(x0, 6)
```

<details>
<summary>Solution</summary>

The first test is exactly the Babylonian square root: $x - \frac{x^2 - 2}{2x} = \frac12\left(x + \frac2x\right)$.

```python solution
def newton(f, df, x0, steps):
    x = x0
    for _ in range(steps):
        x = x - f(x) / df(x)              # step to the tangent's zero
    return round(x, 6)
```

</details>

```python test
import math
assert newton(lambda x: x * x - 2, lambda x: 2 * x, 1, 6) == 1.414214    # √2
assert newton(lambda x: x ** 3 - 10, lambda x: 3 * x * x, 2, 8) == 2.154435
assert newton(lambda x: math.cos(x) - x, lambda x: -math.sin(x) - 1, 1, 6) == 0.739085
print("All checks passed!")
```

**3.** **Equation of the tangent.** Write the function `tangent(f, df, x0)`, which returns the tangent of the graph of $f$ at $x_0$ as a pair `(m, b)` ($y = mx + b$), rounded to 4 decimals!

```python starter
def tangent(f, df, x0):
    return (round(df(x0), 4), round(f(x0), 4))
```

<details>
<summary>Solution</summary>

The starter code is only correct when $x_0 = 0$ – that's why it passes the second and third tests but not the first.

```python solution
def tangent(f, df, x0):
    m = df(x0)                            # slope = the value of the derivative
    b = f(x0) - m * x0                    # y − f(x0) = m(x − x0)
    return (round(m, 4), round(b, 4))
```

</details>

```python test
import math
assert tangent(lambda x: x * x, lambda x: 2 * x, 3) == (6, -9)
assert tangent(math.exp, math.exp, 0) == (1.0, 1.0)
assert tangent(math.sin, math.cos, 0) == (1.0, 0.0)
assert tangent(lambda x: x ** 3, lambda x: 3 * x * x, 1) == (3, -2)
print("All checks passed!")
```

### Quick check questions

```quiz
? Differentiate: $f(x) = x^3 - 4x^2 + 7$
fn: x -> 3*x^2 - 8*x
domain: -3, 3

? Differentiate: $f(x) = x \cdot e^x$
fn: x -> e^x + x*e^x
domain: -2, 2
! Product rule: $(uv)' = u'v + uv'$.

? Differentiate: $f(x) = \sin(3x)$
fn: x -> 3*cos(3*x)
domain: -2, 2
! Chain rule: multiply by the derivative of the inner function.

? Where is the minimum of the function $f(x) = x^2 - 6x + 5$? ($x = ?$)
= 3
! $f'(x) = 2x - 6 = 0 \Rightarrow x = 3$.

? What is $\lim\limits_{x \to 0} \dfrac{e^x - 1}{x}$? (L'Hospital)
= 1
! $\frac{e^x}{1} \to 1$.
```
