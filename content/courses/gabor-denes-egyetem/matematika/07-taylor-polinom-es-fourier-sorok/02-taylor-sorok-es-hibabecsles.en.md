---
title: Important Taylor Series and Error Estimates
summary: The Taylor series, the interval of convergence, the Lagrange remainder, and how many terms a given accuracy needs.
minutes: 25
---

## What you will learn

- what a **Taylor series** is and when it represents the function,
- the most important **standard series**,
- how to estimate the **error** of the approximation (Lagrange remainder),
- how to decide **how many terms** a desired accuracy needs.

## Taylor series

Going with the degree to infinity gives the **Taylor series**: $\sum_{k=0}^{\infty} \frac{f^{(k)}(a)}{k!}(x - a)^k$. It is a **power series**, equal to the function inside an **interval of convergence**.

| Function          | Taylor series about $0$                           | Valid                 |
| ----------------- | ------------------------------------------------- | --------------------- |
| $e^x$             | $1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots$ | for every $x$         |
| $\sin x$          | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots$     | for every $x$         |
| $\cos x$          | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots$     | for every $x$         |
| $\frac{1}{1 - x}$ | $1 + x + x^2 + x^3 + \dots$ (geometric series)    | $\lvert x \rvert < 1$ |
| $\ln(1 + x)$      | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$       | $-1 < x \leq 1$       |

A nice consequence: putting $x = 1$ into the series of $\ln(1 + x)$ gives $\ln 2 = 1 - \frac{1}{2} + \frac{1}{3} - \dots$ (the alternating harmonic series), and the series of $e^{ix}$ gives **Euler's formula**: $e^{ix} = \cos x + i \sin x$.

```plot
title: The Taylor polynomials of ln(1 + x) only approximate on −1 < x ≤ 1
x: -1.5, 3
y: -3, 3
param: N = 3, 1, 20, 1
f: ln(1 + x) # ln(1 + x)
dash: sum(k, 1, N, (-1)^(k + 1) x^k/k) # Tₙ(x)
```

The slider shows: for $x > 1$ the polynomials swing more and more wildly, however much the degree grows – the series diverges there.

## The error: Lagrange remainder

The error of the approximation is $R_n(x) = f(x) - T_n(x)$. By the **Lagrange form** there is a $\xi$ between $a$ and $x$ such that

$$
R_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!} (x - a)^{n+1}.
$$

If $\lvert f^{(n+1)} \rvert \leq M$ on the interval, then $\lvert R_n(x) \rvert \leq \dfrac{M}{(n + 1)!}\lvert x - a\rvert^{n+1}$.

**Example.** How many terms are needed for $e$ with accuracy $10^{-6}$? $f(x) = e^x$, $a = 0$, $x = 1$, $\lvert f^{(n+1)}(\xi) \rvert \leq e < 3$. We need $\frac{3}{(n + 1)!} < 10^{-6}$, i.e. $(n + 1)! > 3 \cdot 10^6$. Since $10! = 3\,628\,800$, $n = 9$ is enough.

```python run
import math
# How many terms are needed to approximate e^x with a given accuracy?
def taylor_exp(x, n):
    return sum(x**k / math.factorial(k) for k in range(n + 1))

for n in range(4, 11):
    error = abs(math.e - taylor_exp(1, n))
    print(f"n = {n:>2}: T_n(1) = {taylor_exp(1, n):.10f}, error = {error:.2e}")
```

## Summary

- Taylor series: the "infinite-degree" Taylor polynomial; equal to the function only within the interval of convergence.
- The series of $e^x$, $\sin x$, $\cos x$ converge everywhere; those of $\frac{1}{1-x}$ and $\ln(1+x)$ only for $\lvert x \rvert < 1$.
- Lagrange error: $\lvert R_n \rvert \leq \frac{M}{(n+1)!}\lvert x - a \rvert^{n+1}$.

## Lesson exercise

```quiz required
? Which function has the Taylor series $1 + x + x^2 + x^3 + \dots$?
- $e^x$
+ $\frac{1}{1 - x}$
- $\ln(1 + x)$
- $\cos x$
! Geometric series, $q = x$.

? What is the coefficient of $x^2$ in the Taylor series of $\ln(1 + x)$? (As a fraction or decimal.)
= -1/2

? From the series of $e^{x}$: what is the coefficient of $x^3$ in the series of $e^{2x}$? (As a fraction or decimal.)
= 4/3
! $\frac{(2x)^3}{3!} = \frac{8x^3}{6}$

? At least what degree of Taylor polynomial is needed to get $e$ with an error below $10^{-3}$ (using the Lagrange estimate with $M = 3$)?
= 6
! $\frac{3}{(n + 1)!} < 10^{-3} \iff (n + 1)! > 3000$, and $7! = 5040$.

? Give the Taylor polynomial of $\dfrac{1}{1 + x^2}$ about $0$ up to the fourth-degree term (from the geometric series with $q = -x^2$)!
fn: x -> 1 - x^2 + x^4
domain: -0.5, 0.5
```
