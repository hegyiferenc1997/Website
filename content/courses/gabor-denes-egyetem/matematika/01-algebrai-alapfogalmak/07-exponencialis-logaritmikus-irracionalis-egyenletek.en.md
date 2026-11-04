---
title: Exponential, Logarithmic and Irrational Equations
summary: Same base, taking logarithms, substitution, and the extraneous roots of equations with square roots.
minutes: 25
---

## What you will learn

- how to solve an **exponential** equation (same base, taking logs, substitution),
- how to solve a **logarithmic** equation (restrictions, laws),
- how to solve an **irrational** (radical) equation and why you must **check**,
- how to handle such **inequalities**.

## Exponential equations

**1. Same base.** Since $a^x$ ($a > 0$, $a \neq 1$) is one-to-one, $a^u = a^v \iff u = v$.

$$
4^{x+1} = 8^x \ \Rightarrow\ 2^{2x + 2} = 2^{3x} \ \Rightarrow\ 2x + 2 = 3x \ \Rightarrow\ x = 2.
$$

**2. Take logarithms** if a common base is not possible: $3^x = 20 \Rightarrow x = \log_3 20 = \dfrac{\ln 20}{\ln 3} \approx 2.727$.

**3. Substitution.** $4^x - 6 \cdot 2^x + 8 = 0$. Let $y = 2^x > 0$: $y^2 - 6y + 8 = 0$, $y = 2$ or $y = 4$, so $x = 1$ or $x = 2$.

## Logarithmic equations

First the **restriction**: the argument of the logarithm is positive. Then use the laws to get a single logarithm and "drop" it.

$$
\log_2 x + \log_2 (x - 2) = 3, \quad x > 2.
$$

$\log_2 \big(x(x - 2)\big) = 3 \Rightarrow x^2 - 2x = 8 \Rightarrow x = 4$ or $x = -2$. Because of the restriction only $x = 4$ works.

## Irrational (radical) equations

Restriction: the expression under the root is $\geq 0$, and since a square root is non-negative, the other side must be $\geq 0$ too. After squaring **always check**, because squaring is not an equivalent transformation.

$$
\sqrt{x + 7} = x - 5.
$$

Squaring: $x + 7 = x^2 - 10x + 25 \Rightarrow x^2 - 11x + 18 = 0 \Rightarrow x = 9$ or $x = 2$.

Check: $x = 9$: $\sqrt{16} = 4 = 9 - 5$ ✓. $\ x = 2$: $\sqrt 9 = 3$, but $2 - 5 = -3$ ✗ (**extraneous root**). The solution: $x = 9$.

```plot
title: Graphs of the two sides
x: -8, 14
y: -6, 8
f: sqrt(x + 7) # √(x + 7)
f: x - 5 # x − 5
point: 9, 4 # solution
```

The two graphs meet at only one point; $x = 2$ would solve $-\sqrt{x+7} = x - 5$.

## Inequalities

- **Exponential:** if $a > 1$, $a^x$ is **increasing**, so $a^u < a^v \iff u < v$; if $0 < a < 1$, the direction **flips**. For example $\left(\frac{1}{2}\right)^x > 8 \iff x < -3$.
- **Logarithmic:** the same for $\log_a$, but also take the restriction into account: $\log_3 (x - 1) < 2 \iff 0 < x - 1 < 9 \iff 1 < x < 10$.

## Summary

- Exponential: same base → equal exponents; otherwise take logs; for $a^{2x}$ forms use substitution.
- Logarithmic: restriction (argument $> 0$), laws, then check against the restriction.
- Radical: restriction, squaring, **check** (extraneous roots!).
- In inequalities with base $0 < a < 1$ the relation flips.

## Lesson exercise

```quiz required
? Solve: $9^x = 27$. What is $x$?
= 1.5
= 3/2
! $3^{2x} = 3^3$

? Solve: $\log_3 (2x + 1) = 2$. What is $x$?
= 4

? Solve: $9^x - 4 \cdot 3^x + 3 = 0$. What is the **larger** root?
= 1
! Let $y = 3^x$: $y^2 - 4y + 3 = 0$, so $y = 1$ or $y = 3$.

? Solve: $\sqrt{2x + 3} = x$. What is $x$?
= 3
! The root $x = -1$ obtained after squaring is extraneous.

? Which is the solution of $\left(\frac{1}{3}\right)^x < 9$?
- $x < -2$
+ $x > -2$
- $x < 2$
- $x > 2$
! With base $0 < a < 1$ the relation flips: $3^{-x} < 3^2$.
```
