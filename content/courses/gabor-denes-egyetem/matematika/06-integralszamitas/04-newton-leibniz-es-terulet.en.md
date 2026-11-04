---
title: The Newton–Leibniz Formula and Areas
summary: Computing definite integrals with antiderivatives, area under a curve and between two curves.
minutes: 25
---

## What you will learn

- the **Newton–Leibniz formula**, which links definite and indefinite integrals,
- how to compute the area **under a curve** (minding the sign),
- how to compute the area **between two curves**.

## The Newton–Leibniz formula

If $f$ is continuous on $[a; b]$ and $F$ is an antiderivative, then

$$
\int_a^b f(x)\,dx = \big[F(x)\big]_a^b = F(b) - F(a).
$$

This is the **fundamental theorem of calculus**: instead of the complicated limit of Riemann sums, it is enough to find an antiderivative. (The $+C$ cancels in the difference.)

**Examples:**

- $\displaystyle\int_0^2 x^2\,dx = \left[\frac{x^3}{3}\right]_0^2 = \frac{8}{3} - 0 = \frac{8}{3}$ – the same as the limit of the Riemann sums!
- $\displaystyle\int_0^{\pi} \sin x\,dx = \big[-\cos x\big]_0^{\pi} = 1 - (-1) = 2$.
- $\displaystyle\int_1^e \frac{1}{x}\,dx = \big[\ln x\big]_1^e = 1$.

## Area under a curve

If $f \geq 0$ on $[a; b]$, the area is $\int_a^b f(x)\,dx$. If $f$ changes sign, **split at the zeros** and take the absolute value of the negative parts:

$f(x) = x^2 - 1$ on $[0; 2]$: zero at $x = 1$.

$$
T = \left\lvert \int_0^1 (x^2 - 1)\,dx \right\rvert + \int_1^2 (x^2 - 1)\,dx = \left\lvert -\frac{2}{3} \right\rvert + \frac{4}{3} = 2.
$$

(The signed integral $\int_0^2 (x^2 - 1)\,dx = \frac{2}{3}$ – that is not the area!)

```plot
title: The integral as (signed) area
x: -1, 3
y: -2, 4
param: a = 0, -1, 2.5, 0.1
param: b = 2, -0.5, 3, 0.1
area: x^2 - 1 @ a, b # f(x) = x² − 1
```

## Area between two curves

If $f(x) \geq g(x)$ on $[a; b]$, the area between them is

$$
T = \int_a^b \big(f(x) - g(x)\big)\,dx.
$$

The limits are often the **intersection points**. Example: the area between $y = x$ and $y = x^2$. Intersections: $x^2 = x \Rightarrow x = 0, 1$. On $[0; 1]$, $x \geq x^2$:

$$
T = \int_0^1 (x - x^2)\,dx = \left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1 = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}.
$$

```plot
title: The area between y = x and y = x²
x: -0.5, 1.5
y: -0.5, 1.5
area: x - x^2 @ 0, 1 # x − x² (the difference)
f: x # y = x
f: x^2 # y = x²
```

## Summary

- Newton–Leibniz: $\int_a^b f = F(b) - F(a)$.
- Area: when the sign changes, split at the zeros and take the absolute value of the negative parts.
- Area between two curves: $\int_a^b (\text{upper} - \text{lower})\,dx$, with the intersection points as limits.

## Lesson exercise

```quiz required
? What is $\displaystyle\int_1^3 (2x + 1)\,dx$?
= 10
! $\big[x^2 + x\big]_1^3 = 12 - 2$

? What is $\displaystyle\int_0^{\pi/2} \cos x\,dx$?
= 1

? What is $\displaystyle\int_0^1 e^x\,dx$? (Rounded to two decimals.)
= 1.72
! $e - 1$

? What is the area enclosed by the graph of $f(x) = 4 - x^2$ and the $x$ axis? (As a fraction or to two decimals.)
= 32/3
= 10.67
! The zeros are $\pm 2$.

? What is the area between $y = x^2$ and $y = 2x$? (As a fraction or to two decimals.)
= 4/3
= 1.33
! Intersections: $0$ and $2$; $\int_0^2 (2x - x^2)\,dx$.
```
