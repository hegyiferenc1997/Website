---
title: Practice – Integral Calculus
summary: Review questions and a summary worksheet on indefinite and definite integrals.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why do we need +C for the indefinite integral but not for the definite one?</summary>

Because a function has infinitely many antiderivatives differing by a constant ($F + C$). For the definite integral we compute $F(b) - F(a)$, and the $C$ cancels.

</details>

<details>
<summary>2. What is the difference between the integral and the area?</summary>

The integral is signed: it counts the parts below the $x$ axis as negative. The area is always non-negative, so when the sign changes we split at the zeros and take the absolute value of the negative parts.

</details>

<details>
<summary>3. How do you know whether to use substitution or integration by parts?</summary>

If an expression and (up to a constant factor) its derivative both appear (e.g. $x e^{x^2}$), use substitution. If it is a product of two different kinds of function (polynomial · exponential/trigonometric, or $\ln x$), use integration by parts, differentiating the polynomial (or the $\ln x$).

</details>

<details>
<summary>4. How can an infinitely long region have a finite area?</summary>

If the function tends to $0$ fast enough: $\int_1^b \frac{1}{x^2}\,dx = 1 - \frac{1}{b}$ stays below $1$ for every $b$ and tends to $1$. It is the same idea as for the geometric series: infinitely many, ever smaller parts can have a finite sum.

</details>

## Summary worksheet

```quiz required
? Compute: $\displaystyle\int \left(4x^3 - \frac{3}{x^2} + \frac{1}{\sqrt x}\right) dx$ ($x > 0$).
fn: x -> x^4 + 3/x + 2 sqrt(x)
domain: 0.3, 4
+C

? Compute: $\displaystyle\int \frac{x}{x^2 + 9}\,dx$.
fn: x -> ln(x^2 + 9)/2
+C

? Compute: $\displaystyle\int x^2 e^{x^3}\,dx$.
fn: x -> e^(x^3)/3
domain: -1, 1
+C

? Compute: $\displaystyle\int x e^{2x}\,dx$.
fn: x -> (x/2 - 1/4) e^(2x)
domain: -1, 1
+C

? What is $\displaystyle\int_0^1 (x^3 + 2x)\,dx$? (As a decimal or a fraction.)
= 1.25
= 5/4

? What is $\displaystyle\int_1^{e^2} \frac{1}{x}\,dx$?
= 2

? What is the area between $y = x^2 - 4$ and the $x$ axis on $[0; 3]$? (As a fraction or to two decimals.)
= 23/3
= 7.67
! The zero is at $2$: $\frac{16}{3} + \frac{7}{3}$

? What is $\displaystyle\int_0^\infty x e^{-x^2}\,dx$? (As a fraction or decimal.)
= 1/2
! The antiderivative is $-\frac{1}{2} e^{-x^2}$.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Trapezoid rule.** Write the function `trapezoid(f, a, b, n)`, which approximates $\int_a^b f(x)\,dx$ with the trapezoid rule, dividing into $n$ equal parts, and returns it rounded to 4 decimals!

```python starter
def trapezoid(f, a, b, n):
    h = (b - a) / n
    return round(sum(f(a + i * h) for i in range(n)) * h, 4)
```

<details>
<summary>Solution</summary>

The starter code is the left rectangle rule: it errs even for a linear function, while the trapezoid rule is exact for one.

```python solution
def trapezoid(f, a, b, n):
    h = (b - a) / n
    inner = sum(f(a + i * h) for i in range(1, n))   # the inner points with double weight
    return round(h * (f(a) / 2 + inner + f(b) / 2), 4)
```

</details>

```python test
import math
assert trapezoid(lambda x: x, 0, 2, 4) == 2.0
assert trapezoid(lambda x: x * x, 0, 1, 100) == 0.3334
assert trapezoid(math.sin, 0, math.pi, 1000) == 2.0
print("All checks passed!")
```

**2.** **Average value of a function.** Write the function `average(f, a, b)`, which gives the average value of $f$ on the interval $[a, b]$: $\frac{1}{b - a}\int_a^b f(x)\,dx$! Compute the integral with the midpoint rule, dividing into $n = 10\,000$ parts, and round to 3 decimals.

```python starter
def average(f, a, b):
    return round((f(a) + f(b)) / 2, 3)
```

<details>
<summary>Solution</summary>

The third test is the average of an AC power: the average of $\sin^2$ over a period is $\frac12$ – that's where the RMS formula $\frac{U_{\max}}{\sqrt2}$ comes from.

```python solution
def average(f, a, b):
    n = 10_000
    h = (b - a) / n
    integral = sum(f(a + (i + 0.5) * h) for i in range(n)) * h   # rectangles at the midpoints
    return round(integral / (b - a), 3)
```

</details>

```python test
import math
assert average(lambda x: x * x, 0, 3) == 3.0
assert average(math.sin, 0, math.pi) == 0.637
assert average(lambda x: 325 * math.sin(x) ** 2, 0, 2 * math.pi) == 162.5
print("All checks passed!")
```

**3.** **Energy from measured data.** A solar panel's power (W) is measured at equal time intervals. Write the function `energy_kwh(measurements, step_hours)`, which computes the energy produced in kWh with the trapezoid rule, rounded to 2 decimals!

```python starter
def energy_kwh(measurements, step_hours):
    return round(sum(measurements) * step_hours / 1000, 2)
```

<details>
<summary>Solution</summary>

```python solution
def energy_kwh(measurements, step_hours):
    m = measurements
    wh = sum((m[i] + m[i + 1]) / 2 * step_hours for i in range(len(m) - 1))
    return round(wh / 1000, 2)            # Wh → kWh
```

</details>

```python test
assert energy_kwh([0, 1000, 2000, 1000, 0], 1) == 4.0
assert energy_kwh([0, 500, 1500, 3000, 3200, 2800, 1500, 400, 0], 1.5) == 19.35
assert energy_kwh([1000, 1000], 0.25) == 0.25
print("All checks passed!")
```

### Quick check questions

```quiz
? Give an antiderivative of $f(x) = 6x^2 - 2x$!
fn: x -> 2*x^3 - x^2
+C
domain: -2, 2
! $\int 6x^2\,dx = 2x^3$, $\int 2x\,dx = x^2$ (any constant can be added).

? What is $\displaystyle\int_0^2 3x^2\,dx$?
= 8
! $\left[x^3\right]_0^2 = 8$.

? What is $\displaystyle\int_0^{\pi} \sin x\,dx$?
= 2
! $\left[-\cos x\right]_0^{\pi} = 1 - (-1) = 2$.

? What is the area between the curves $y = x$ and $y = x^2$ on the interval $[0, 1]$? (fraction or decimal)
= 1/6
= 0,1667
= 0.1667
! $\int_0^1 (x - x^2)\,dx = \frac12 - \frac13 = \frac16$.

? Which improper integral converges?
- $\int_1^\infty \frac{1}{\sqrt{x}}\,dx$
- $\int_1^\infty \frac{1}{x}\,dx$
+ $\int_1^\infty \frac{1}{x^3}\,dx$
- $\int_1^\infty 1\,dx$
! $\int_1^\infty x^{-p}\,dx$ is finite if $p > 1$.
```
