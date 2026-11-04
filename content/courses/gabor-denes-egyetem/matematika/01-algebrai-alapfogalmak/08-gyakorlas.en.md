---
title: Practice – Algebra and Equations
summary: Review questions and a summary worksheet on the week-0 algebra material.
minutes: 30
kind: practice
---

## Review questions

Try to answer in your head first, then open the answer!

<details>
<summary>1. Why is (a + b)² = a² + b² false?</summary>

Because $(a + b)^2 = (a + b)(a + b) = a^2 + 2ab + b^2$: multiplying produces the "mixed" terms ($ab$ and $ba$) too. For example with $a = b = 1$ the left side is $4$, the right side $2$.

</details>

<details>
<summary>2. When must you check the solution of an equation at the end?</summary>

When we used a non-equivalent step: squaring, multiplying by an expression containing the variable, or ignoring the restriction of a logarithm/root along the way. Then extraneous roots may appear.

</details>

<details>
<summary>3. What is the difference between √9 and the solutions of x² = 9?</summary>

$\sqrt{9} = 3$ is a single (non-negative) number. The equation $x^2 = 9$ has two solutions: $x = 3$ and $x = -3$, because $x = \pm\sqrt 9$.

</details>

<details>
<summary>4. How many bits are needed to encode one card of a 64-card deck, and why?</summary>

$\log_2 64 = 6$ bits, because $2^6 = 64$: six bits give exactly 64 different codes.

</details>

<details>
<summary>5. Why can't we multiply the inequality (x + 1)/(x − 2) ≥ 0 by the denominator?</summary>

Because the sign of the denominator depends on $x$: if it is negative, the direction of the relation would flip. Instead we make a sign chart with the zeros of the numerator and the denominator ($-1$ and $2$).

</details>

## Worked example

Solve over the reals: $\lg(x + 6) - \lg(x - 3) = 1$.

1. Restriction: $x + 6 > 0$ and $x - 3 > 0$, so $x > 3$.
2. Law: $\lg \dfrac{x + 6}{x - 3} = 1 \Rightarrow \dfrac{x + 6}{x - 3} = 10$.
3. $x + 6 = 10x - 30 \Rightarrow 9x = 36 \Rightarrow x = 4$.
4. Check: $4 > 3$ ✓, $\lg 10 - \lg 1 = 1$ ✓.

## Summary worksheet

```quiz required
? What is $\left(\dfrac{27}{8}\right)^{-2/3}$? (You may give it as a fraction.)
= 4/9
! Cube root first: $\frac{3}{2}$, then square and take the reciprocal.

? Simplify: $\dfrac{x^3 - 8}{x^2 - 4}$ ($x \neq \pm 2$).
fn: x -> (x^2 + 2x + 4)/(x + 2)
domain: -1, 1.5
! $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$

? One root of $x^2 + px + 12 = 0$ is $3$. What is $p$?
= -7
! Vieta: the other root is $4$, and their sum is $-p$.

? Solve: $2^{x+3} - 2^x = 56$. What is $x$?
= 3
! $2^x (8 - 1) = 56$

? Solve: $\lg(x + 6) - \lg(x - 3) = 1$. What is $x$?
= 4

? Solve: $\sqrt{x + 1} = x - 1$. What is $x$?
= 3
! Squaring also gives $x = 0$, but it is an extraneous root.

? How many integers satisfy $\lvert x + 2 \rvert \leq 3$?
= 7
! $-5 \leq x \leq 1$

? A product's price was raised by $20\%$, then the new price was cut by $20\%$. By how many percent is it cheaper than the original?
= 4
! $1.2 \cdot 0.8 = 0.96$
```
