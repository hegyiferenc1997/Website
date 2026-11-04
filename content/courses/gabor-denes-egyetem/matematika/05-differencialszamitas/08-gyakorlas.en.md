---
title: Practice – Differential Calculus
summary: Review questions and a summary worksheet on differentiation and analysing functions (material of test 2).
minutes: 35
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
