---
title: Practice – Functions
summary: Review questions and a summary worksheet on functions, limits and continuity.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why does f(x − 3) shift to the right although it contains a minus?</summary>

Because at $x$ the function $f(x - 3)$ takes the value that $f$ takes at $x - 3$: every value appears $3$ units "later", i.e. $3$ units to the right.

</details>

<details>
<summary>2. What is the difference between the limit and the value of a function at a point?</summary>

The limit describes where the values approach as $x \to x_0$; the value is $f(x_0)$. They can differ, and the limit may exist even if $f(x_0)$ is undefined. If they are equal, the function is continuous there.

</details>

<details>
<summary>3. How do you decide whether a function has an inverse?</summary>

If it is one-to-one: every horizontal line meets its graph in at most one point (horizontal line test). Strictly monotonic functions always are. If not, a restriction (e.g. $x^2$ to $x \geq 0$) gives an invertible function.

</details>

<details>
<summary>4. Why is bisection useful in programming?</summary>

Because it only needs continuity and a sign change, it always converges, and every step halves the error: after $40$ steps the accuracy is $2^{-40}$ times the original interval. Binary search is the same idea.

</details>

## Summary worksheet

```quiz required
? What is the largest element of the domain of $f(x) = \sqrt{6 - 2x}$?
= 3

? From $f(x) = x^2 + 2$ and $g(x) = \sqrt{x}$, give the formula of $f(g(x))$ ($x \geq 0$)!
fn: x -> x + 2
domain: 0.1, 5

? Give the inverse of $f(x) = \dfrac{2x - 1}{x + 3}$!
fn: x -> (3x + 1)/(2 - x)
domain: -1, 1.5
! $y(x + 3) = 2x - 1 \Rightarrow x(y - 2) = -3y - 1$

? At how many points does $f(x) = x^2 - 2x - 3$ meet the $x$ axis?
= 2

? What is $\lim\limits_{x \to -1} \dfrac{x^2 + 3x + 2}{x + 1}$?
= 1
! $x^2 + 3x + 2 = (x + 1)(x + 2)$

? What is $\lim\limits_{x \to \infty} \dfrac{4x - 7}{\sqrt{x^2 + 1}}$?
= 4

? Which function is **even**?
- $x^3 + x$
+ $x^2 \cos x$
- $e^x$
- $\sin x + 1$
! $(-x)^2 \cos(-x) = x^2 \cos x$

? The range of $-3\sin(2x) + 1$ is $[m; M]$. What is $M$?
= 4
```
