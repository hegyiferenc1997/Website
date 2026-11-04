---
title: Rational Expressions
summary: Simplifying, adding, multiplying and dividing algebraic fractions – with domain restrictions.
minutes: 20
---

## What you will learn

- what a **rational expression** (algebraic fraction) is and why we need **restrictions**,
- how to **simplify** by factorising,
- how to **add**, **multiply** and **divide** algebraic fractions.

## Rational expression and restrictions

A **rational expression** is the quotient of two polynomials, e.g. $\dfrac{x^2 - 1}{x^2 + 3x + 2}$. We cannot divide by zero, so we always state a **restriction**: the denominator cannot be $0$. Here $x^2 + 3x + 2 = (x + 1)(x + 2) \neq 0$, so $x \neq -1$ and $x \neq -2$.

## Simplifying

Only **factors** can be cancelled, never terms of a sum! So factorise first:

$$
\frac{x^2 - 1}{x^2 + 3x + 2} = \frac{(x - 1)(x + 1)}{(x + 1)(x + 2)} = \frac{x - 1}{x + 2}, \qquad x \neq -1,\ x \neq -2.
$$

The restriction remains after simplifying: the original expression is undefined at $x = -1$, even though you could substitute it into the simplified form.

Typical mistake: $\dfrac{x + 3}{x} \neq 3$, because $x$ is not a factor of the numerator.

## Addition, subtraction: common denominator

The common denominator is the **least common multiple** of the denominators:

$$
\frac{2}{x - 1} - \frac{1}{x + 1} = \frac{2(x + 1) - (x - 1)}{(x - 1)(x + 1)} = \frac{x + 3}{x^2 - 1}, \qquad x \neq \pm 1.
$$

## Multiplication and division

Multiply numerator by numerator and denominator by denominator (cancel first if you can); to divide, multiply by the **reciprocal**:

$$
\frac{x^2 - 4}{3x} : \frac{x + 2}{6x^2} = \frac{(x - 2)(x + 2)}{3x} \cdot \frac{6x^2}{x + 2} = 2x(x - 2), \qquad x \neq 0,\ x \neq -2.
$$

## Compound fractions

$$
\frac{1 + \frac{1}{x}}{1 - \frac{1}{x^2}} = \frac{\frac{x + 1}{x}}{\frac{(x - 1)(x + 1)}{x^2}} = \frac{x + 1}{x} \cdot \frac{x^2}{(x - 1)(x + 1)} = \frac{x}{x - 1}, \qquad x \neq 0,\ \pm 1.
$$

```plot
title: Where the denominator is zero
x: -5, 5
y: -6, 6
f: (x - 1)/(x + 2) # (x − 1)/(x + 2)
```

The graph "breaks" at $x = -2$: there the denominator is $0$ and the function is undefined (vertical asymptote).

## Summary

- Rational expression = polynomial / polynomial; always restrict: denominator $\neq 0$.
- Only factors can be cancelled → factorise first.
- Addition: common denominator (LCM); division: multiply by the reciprocal.

## Lesson exercise

```quiz required
? Simplify: $\dfrac{x^2 - 9}{x^2 + 3x}$ (the variable is $x$; restriction: $x \neq 0, -3$).
fn: x -> (x - 3)/x
domain: 0.5, 4
! $x^2 - 9 = (x - 3)(x + 3)$ and $x^2 + 3x = x(x + 3)$.

? Which value must be excluded for $\dfrac{5}{x^2 - 4x}$ besides $0$?
= 4
! $x^2 - 4x = x(x - 4)$

? Bring to a common denominator and simplify: $\dfrac{1}{x} + \dfrac{1}{x + 1}$.
fn: x -> (2x + 1)/(x^2 + x)
domain: 0.5, 4

? What is the value of $\dfrac{x^2 - 4}{3x} : \dfrac{x + 2}{6x^2}$ for $x = 5$?
= 30
! The simplified form is $2x(x - 2)$.

? Which simplification is **correct**?
- $\dfrac{x + 3}{x} = 3$
- $\dfrac{x^2 + 1}{x + 1} = x + 1$
+ $\dfrac{2x + 4}{x + 2} = 2$
- $\dfrac{a + b}{a} = b$
! Only factors can be cancelled: $2x + 4 = 2(x + 2)$.
```
