---
title: Practice – Algebra and Equations
summary: Review questions and a summary worksheet on basic algebra and equations.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Simplifying a fraction.** Write the function `simplify(numerator, denominator)`, which returns the fraction in its simplest form as a `(numerator, denominator)` pair! The denominator must always be positive. (Hint: `math.gcd`.)

```python starter
def simplify(numerator, denominator):
    return (numerator, denominator)
```

<details>
<summary>Solution</summary>

```python solution
import math

def simplify(numerator, denominator):
    d = math.gcd(numerator, denominator)  # divide by the greatest common divisor
    if denominator < 0:
        d = -d                            # move the sign into the numerator
    return (numerator // d, denominator // d)
```

</details>

```python test
assert simplify(12, 18) == (2, 3)
assert simplify(-6, 8) == (-3, 4)
assert simplify(5, -10) == (-1, 2)
assert simplify(7, 7) == (1, 1)
print("All checks passed!")
```

**2.** **Quadratic equation.** Write the function `quadratic(a, b, c)`, which returns the real roots of the equation $ax^2 + bx + c = 0$ in increasing order, rounded to 3 decimals, in a list! If there's no real root, return an empty list; if there's one (a double root), a one-element list.

```python starter
def quadratic(a, b, c):
    return []
```

<details>
<summary>Solution</summary>

For negative $a$ the formula gives the roots in reverse order, so we sort at the end.

```python solution
import math

def quadratic(a, b, c):
    D = b * b - 4 * a * c                 # discriminant
    if D < 0:
        return []
    if D == 0:
        return [round(-b / (2 * a), 3)]
    x1 = (-b - math.sqrt(D)) / (2 * a)
    x2 = (-b + math.sqrt(D)) / (2 * a)
    return sorted([round(x1, 3), round(x2, 3)])
```

</details>

```python test
assert quadratic(1, -5, 6) == [2.0, 3.0]
assert quadratic(1, 2, 1) == [-1.0]
assert quadratic(1, 0, 1) == []
assert quadratic(2, 1, -1) == [-1.0, 0.5]
assert quadratic(-1, 0, 2) == [-1.414, 1.414]
print("All checks passed!")
```

**3.** **Compound interest.** Write the function `compound(principal, rate, years)`, which tells how much money we'll have after `years` years if an annual interest of `rate` percent is added to the principal each year! Round the result to a whole forint.

```python starter
def compound(principal, rate, years):
    return principal + principal * rate / 100 * years
```

<details>
<summary>Solution</summary>

The starter code computes simple interest (every year interest is paid only on the original principal) – over 10 years that's already a 12,889 Ft difference.

```python solution
def compound(principal, rate, years):
    return round(principal * (1 + rate / 100) ** years)   # multiply by (1 + p/100) every year
```

</details>

```python test
assert compound(100000, 5, 1) == 105000
assert compound(100000, 5, 10) == 162889
assert compound(1000000, 3, 20) == 1806111
assert compound(50000, 0, 7) == 50000
print("All checks passed!")
```

### Quick check questions

```quiz
? Expand: $(a - 3)^2 = a^2 - 6a + ?$
= 9
! $(a - b)^2 = a^2 - 2ab + b^2$.

? What is $\log_2 64$?
= 6
! $2^6 = 64$.

? What is $8^{2/3}$?
= 4
! $\sqrt[3]{8}^{\,2} = 2^2 = 4$.

? For which $x$ is $|x - 2| < 3$ true?
- $x < 5$
+ $-1 < x < 5$
- $x > -1$
- $-5 < x < 1$
! $-3 < x - 2 < 3$, that is, $-1 < x < 5$.

? Give in simplified form: $\dfrac{x^2 - 9}{x - 3}$ (where $x \ne 3$)
fn: x -> x + 3
domain: -5, 2
! $x^2 - 9 = (x - 3)(x + 3)$.
```
