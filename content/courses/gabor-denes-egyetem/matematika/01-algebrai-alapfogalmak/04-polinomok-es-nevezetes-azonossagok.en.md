---
title: Polynomials and Special Products
summary: Algebraic expressions, polynomials, special products, factorisation and polynomial division.
minutes: 25
---

## What you will learn

- what an **algebraic expression** and a **polynomial** are (degree, coefficients),
- the **special products** (algebraic identities),
- how to **factorise** (taking out a common factor, grouping, identities),
- how to divide a polynomial by $(x - a)$ (**Horner's scheme**).

## Polynomials

An **algebraic expression** is built from numbers and variables with the basic operations and powers, e.g. $3x^2 - \frac{2}{y} + \sqrt{x}$. A (single-variable) **polynomial** is a special case:

$$
p(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0, \qquad a_n \neq 0.
$$

The numbers $a_i$ are the **coefficients**, $n$ is the **degree**, $a_0$ the **constant term**. For example $p(x) = 4x^3 - x + 7$ is cubic, with coefficients $4, 0, -1, 7$.

**Operations:** when adding, combine terms of the same degree; when multiplying, multiply every term by every term:

$$
(x + 2)(x^2 - 3x + 1) = x^3 - 3x^2 + x + 2x^2 - 6x + 2 = x^3 - x^2 - 5x + 2.
$$

## Special products

$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a - b)^2 &= a^2 - 2ab + b^2 \\
(a + b)(a - b) &= a^2 - b^2 \\
(a + b)^3 &= a^3 + 3a^2 b + 3ab^2 + b^3 \\
a^3 - b^3 &= (a - b)(a^2 + ab + b^2) \\
a^3 + b^3 &= (a + b)(a^2 - ab + b^2)
\end{aligned}
$$

Mental arithmetic trick: $49 \cdot 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$.

## Factorisation

1. **Common factor:** $6x^3 - 9x^2 = 3x^2(2x - 3)$.
2. **Grouping:** $x^3 + 2x^2 - 4x - 8 = x^2(x + 2) - 4(x + 2) = (x + 2)(x^2 - 4) = (x + 2)^2(x - 2)$.
3. **Identity backwards:** $x^2 - 10x + 25 = (x - 5)^2$, $\ 4x^2 - 9 = (2x - 3)(2x + 3)$.
4. **Root form:** if $x_1, x_2$ are the roots of $ax^2 + bx + c$, then $ax^2 + bx + c = a(x - x_1)(x - x_2)$. For example $x^2 - 5x + 6 = (x - 2)(x - 3)$.

## Polynomial division and Horner's scheme

If $p(a) = 0$, then $p(x)$ is divisible by $(x - a)$ (**factor theorem**). **Horner's scheme** does the division quickly: write the coefficients in a row, bring down the first one, then repeatedly "multiply by $a$ and add to the next".

Example: $p(x) = x^3 - 6x^2 + 11x - 6$, and $p(1) = 0$, so we divide by $(x - 1)$:

| $a = 1$ | $1$ | $-6$ | $11$ | $-6$ |
| ------- | --- | ---- | ---- | ---- |
|         | $1$ | $-5$ | $6$  | $0$  |

The quotient is $x^2 - 5x + 6 = (x-2)(x-3)$, the remainder is $0$. So $p(x) = (x - 1)(x - 2)(x - 3)$.

Horner's method is also the **fastest way to evaluate** a polynomial (the remainder $= p(a)$): this is how computers do it.

```python run
def horner(coefficients, a):
    """Divide the polynomial by (x - a): the quotient's coefficients and the remainder (= p(a))."""
    row = [coefficients[0]]
    for c in coefficients[1:]:
        row.append(row[-1] * a + c)
    return row[:-1], row[-1]

print(horner([1, -6, 11, -6], 1))   # ([1, -5, 6], 0)
print(horner([2, 0, -3, 5], 2))     # p(2) = 2·8 − 6 + 5 = 15
```

```plot
title: Roots of a cubic polynomial
x: -1, 5
y: -4, 4
param: d = 0, -3, 3, 0.1
f: (x - 1)(x - 2)(x - 3) + d # p(x) + d
```

At $d = 0$ the curve crosses the $x$ axis at $1$, $2$ and $3$; shifting it can change the number of roots.

## Summary

- Polynomial: $a_n x^n + \dots + a_0$; degree $n$, coefficients $a_i$.
- Special products: $(a\pm b)^2$, $a^2 - b^2$, $(a+b)^3$, $a^3 \pm b^3$.
- Factorisation: common factor, grouping, identities, root form.
- If $p(a) = 0$, then $(x - a) \mid p(x)$; Horner's scheme makes the division fast.

## Lesson exercise

```quiz required
? What is the degree of the polynomial $p(x) = 5x^4 - 2x^7 + x - 3$?
= 7

? Expand: $(2x - 3)^2$ (the variable is $x$).
fn: x -> 4x^2 - 12x + 9
! $(a - b)^2 = a^2 - 2ab + b^2$

? What is $103 \cdot 97$, using a special product?
= 9991
! $(100 + 3)(100 - 3) = 100^2 - 3^2$

? Which is the factorised form of $x^2 - 7x + 12$?
- $(x + 3)(x + 4)$
+ $(x - 3)(x - 4)$
- $(x - 2)(x - 6)$
- $(x - 1)(x - 12)$
! Two numbers whose product is $12$ and sum is $7$.

? $x = 2$ is a root of $p(x) = x^3 - 4x^2 + x + 6$. What is the quotient $p(x) : (x - 2)$?
fn: x -> x^2 - 2x - 3
! Horner: $1,\ -4 + 2 = -2,\ 1 - 4 = -3,\ 6 - 6 = 0$.
```
