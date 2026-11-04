---
title: Equations and Inequalities
summary: Linear and quadratic, absolute value and rational equations, inequalities, systems of equations and word problems.
minutes: 30
---

## What you will learn

- **equivalent transformations** and the role of the **domain**,
- the **quadratic formula** and the **discriminant**,
- **absolute value** and **rational** equations and **inequalities**,
- **systems** of two equations and setting up **word problems**.

## Equivalent transformations

We may do the same operation on both sides of an equation if it doesn't change the solution set: add the same thing, multiply by the same **non-zero** number. If we multiply by an **expression containing the variable** or square both sides, **extraneous roots** may appear – then we must **check** at the end!

**Linear:** $3(x - 2) + 4 = x + 6 \Rightarrow 3x - 2 = x + 6 \Rightarrow 2x = 8 \Rightarrow x = 4$.

## Quadratic equations

The solutions of $ax^2 + bx + c = 0$ ($a \neq 0$):

$$
x_{1,2} = \frac{-b \pm \sqrt{D}}{2a}, \qquad D = b^2 - 4ac.
$$

- $D > 0$: two distinct real roots; $D = 0$: one (double) root; $D < 0$: no real root.
- **Vieta's formulas:** $x_1 + x_2 = -\dfrac{b}{a}$, $\ x_1 x_2 = \dfrac{c}{a}$.

Example: $x^2 - 2x - 8 = 0$: $D = 4 + 32 = 36$, $x_{1,2} = \dfrac{2 \pm 6}{2}$, so $x_1 = 4$, $x_2 = -2$.

```plot
title: The quadratic function and its roots
x: -6, 6
y: -10, 10
param: a = 1, -3, 3, 0.1
param: b = -2, -6, 6, 0.5
param: c = -8, -10, 10, 0.5
f: a x^2 + b x + c # ax² + bx + c
value: D = b^2 - 4a c
```

Notice: if $D < 0$, the parabola does not meet the $x$ axis.

## Quadratic inequality

$x^2 - 2x - 8 < 0$: the parabola opens upwards, its roots are $-2$ and $4$, and it is **below** the axis between the roots. Solution: $-2 < x < 4$, i.e. $x \in \left]-2; 4\right[$.

## Absolute value equations

$\lvert x - 3 \rvert = 5$ means: the distance of $x$ from $3$ is $5$. So $x - 3 = 5$ or $x - 3 = -5$: $x = 8$ or $x = -2$.

**Inequality:** $\lvert x - 3 \rvert < 5 \iff -5 < x - 3 < 5 \iff -2 < x < 8$. (With $>$ you get two separate intervals: $x < -2$ or $x > 8$.)

In more complex cases, **split into cases**: solve separately according to the sign of the expression inside the absolute value, and check whether the solution falls into that case.

## Rational equations and inequalities

$\dfrac{x + 1}{x - 2} = 3$, restriction: $x \neq 2$. Multiplying: $x + 1 = 3x - 6 \Rightarrow x = 3.5$, which satisfies the restriction.

In a rational **inequality** we cannot simply multiply by the denominator (its sign is unknown)! Instead, bring everything to one side and make a **sign chart**:

$$
\frac{x + 1}{x - 2} \geq 0 \quad\Longrightarrow\quad x \leq -1 \ \text{ or } \ x > 2.
$$

## Systems of equations

$$
\begin{cases} 2x + y = 7 \\ x - y = -1 \end{cases}
$$

**Substitution:** from the second, $x = y - 1$; into the first: $2(y - 1) + y = 7 \Rightarrow y = 3$, $x = 2$. **Elimination:** adding the two equations gives $3x = 6$. Always check: $2 \cdot 2 + 3 = 7$ ✓.

## Word problems

1. Name the unknown (what is asked?), 2. write the relations as equations, 3. solve, 4. **check against the text**, and answer in a sentence.

_Example:_ A rectangle has perimeter $34$ cm and area $60$ cm². With sides $a$ and $b$: $a + b = 17$, $ab = 60$. By Vieta, $a, b$ are the roots of $t^2 - 17t + 60 = 0$: $t = 12$ and $t = 5$. The sides are $12$ cm and $5$ cm.

## Summary

- Equivalent transformations; check after multiplying by a variable expression or squaring.
- $x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$; the sign of $D$ decides the number of roots.
- $\lvert x - a \rvert = r \iff x = a \pm r$; use a sign chart for rational inequalities.
- Systems: substitution or elimination.

## Lesson exercise

```quiz required
? Solve: $5x - 7 = 2x + 8$. What is $x$?
= 5

? The equation $x^2 + x - 12 = 0$ has two roots. What is the **larger** one?
= 3
! $D = 1 + 48 = 49$

? How many real roots does $2x^2 - 4x + 5 = 0$ have?
= 0
! $D = 16 - 40 < 0$

? What is the **smaller** root of $\lvert 2x - 1 \rvert = 7$?
= -3

? Which is the solution of $x^2 - 9 > 0$?
- $-3 < x < 3$
+ $x < -3$ or $x > 3$
- $x > 3$
- $x > 9$
! An upward parabola is positive outside its roots.

? Solve: $\begin{cases} x + 2y = 8 \\ 3x - y = 3 \end{cases}$. What is $y$?
= 3
! $x = 2$, $y = 3$
```
