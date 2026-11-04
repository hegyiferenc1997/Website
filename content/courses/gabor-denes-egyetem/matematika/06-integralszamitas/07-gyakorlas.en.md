---
title: Practice – Integral Calculus
summary: Review questions and a summary worksheet on indefinite and definite integrals.
minutes: 35
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
