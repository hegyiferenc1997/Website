---
title: Deeper – Algebra Through the Machine's Eyes
summary: Comparing exact fractions with floating-point numbers, Horner's scheme (a polynomial's value with far fewer multiplications), solving an exponential equation that has "no formula" by bisection, and doubling time with logarithms versus the rule of 72.
minutes: 40
---

## What you will learn in this lesson

- why the machine calculates **inexactly** with decimal fractions, and how you can calculate **exactly** with fractions,
- how to evaluate a polynomial with **Horner's scheme** using far fewer multiplications,
- how to solve an equation for which **there is no formula** (bisection),
- how to calculate **doubling time** with logarithms, and how good the mental-arithmetic "rule of 72" is.

## 1. Exact fraction or floating-point number?

In binary, $\frac{1}{10}$ is an infinite, repeating fraction (like $\frac{1}{3} = 0.333\ldots$ in decimal), so the machine stores it only **rounded**. If we add it up many times, the rounding errors accumulate. Rational numbers, however, can also be stored exactly: as a **numerator and a denominator**, both integers.

```python run
# Exact fractions versus floating-point numbers
from fractions import Fraction

total = 0.0
for _ in range(10):
    total += 0.1                       # step by step, as a simple loop would
print("0.1 added ten times (floating point):", total, "→ equal to 1?", total == 1)

exact = sum([Fraction(1, 10)] * 10)    # the sum of fractions is exact
print("1/10 added ten times (exact fraction):", exact, "→ equal to 1?", exact == 1)

# A rational expression, exactly: (1/2 + 1/3) / (1 − 1/7)
k = (Fraction(1, 2) + Fraction(1, 3)) / (1 - Fraction(1, 7))
print("(1/2 + 1/3) / (1 − 1/7) =", k, "≈", float(k))
```

The floating-point sum is $0.9999999999999999$ – not exactly $1$! The `Fraction` type calculates with fractions the way you do on paper: it finds a common denominator and simplifies, so

$$
\frac{\frac12 + \frac13}{1 - \frac17} = \frac{\frac56}{\frac67} = \frac{35}{36}
$$

comes out exactly. Lesson: when you need **exactness** (money, geometric decisions, equality tests), calculate with integers or fractions; when you need **speed** (graphics, physics simulation), use floating point – and know that there will be tiny errors in it.

## 2. Horner's scheme: the same value, less work

You would compute the value of the polynomial $p(x) = 2x^4 - 3x^3 + 5x - 1$ "naively" by calculating every power separately. It's cleverer to factor out $x$ wherever possible:

$$
p(x) = \Big(\big((2x - 3)\,x + 0\big)\,x + 5\Big)\,x - 1.
$$

This is **Horner's scheme**: working from the inside out, every step is one multiplication and one addition.

```python run
# Horner's scheme: a polynomial's value with fewer multiplications
def naive(coefficients, x):
    # a_n x^n + … + a_0, computing every power separately
    n = len(coefficients) - 1
    mults, value = 0, 0
    for i, a in enumerate(coefficients):
        power = 1
        for _ in range(n - i):
            power *= x
            mults += 1
        value += a * power
        mults += 1
    return value, mults

def horner(coefficients, x):
    # (((a_n·x + a_{n-1})·x + …)·x + a_0
    value, mults = coefficients[0], 0
    for a in coefficients[1:]:
        value = value * x + a
        mults += 1
    return value, mults

p = [2, -3, 0, 5, -1]                  # 2x⁴ − 3x³ + 5x − 1
for x in [2, -1, 3]:
    print(f"x = {x:>2}: naive {naive(p, x)}, Horner {horner(p, x)}   (value, number of multiplications)")
```

For a quartic polynomial, **4** multiplications instead of **15** – for degree $n$ the naive method needs about $\frac{n^2}{2}$, Horner only $n$ multiplications. That's how calculators and program libraries do it, and the same procedure is **polynomial division** (by $x - c$) on paper (Horner's table): if the last value is $0$, then $c$ is a root, and the polynomial can be factored.

## 3. An equation without a formula: bisection

For the equation $2^x = x + 3$ there is no algebraic manipulation that expresses $x$. Yet it can be solved to any accuracy! Let $f(x) = 2^x - (x + 3)$. Since $f(2) = -1 < 0$ and $f(3) = 2 > 0$, and $f$ is continuous, there is a root in the interval $[2,\,3]$. Let's halve the interval, always keeping the half where the sign changes:

```python run
# An equation with no "formula": 2^x = x + 3 – solved by bisection
def f(x):
    return 2 ** x - (x + 3)            # the root is where f(x) = 0

a, b = 2.0, 3.0                        # f(2) = −1 < 0, f(3) = 2 > 0 → there is a root between them
steps = 0
while b - a > 1e-6:
    m = (a + b) / 2
    if f(a) * f(m) <= 0:               # the sign change is in the left half
        b = m
    else:
        a = m
    steps += 1
print(f"x ≈ {(a + b) / 2:.6f}, after {steps} halvings; check: 2^x = {2 ** a:.5f}, x + 3 = {a + 3:.5f}")
```

```plot
title: The two sides of the equation 2^x = x + 3
x: -4, 4
y: -1, 9
f: 2^x # 2ˣ
f: x + 3 # x + 3
point: 2.4449, 5.4449 # intersection
```

Every step **halves** the uncertainty: after $k$ steps the interval's length is $\frac{1}{2^k}$. For an accuracy of one millionth, **20 steps** are enough, since $2^{20} \approx 10^6$. The graph shows that there is **another** solution on the negative side ($x \approx -2.86$) – bisection only ever finds the root you trapped. (It's the same method as binary search in computing.)

## 4. Doubling time: logarithm versus mental arithmetic

If a quantity grows by a ratio $r$ every year (an investment, the number of users, an amount of data), after $t$ years it grows $(1 + r)^t$-fold. When does it double?

$$
(1 + r)^t = 2 \quad\Longrightarrow\quad t = \frac{\ln 2}{\ln (1 + r)}.
$$

The mental-arithmetic approximation known in finance is the **rule of 72**: $t \approx \frac{72}{r\,\%}$.

```python run
# Doubling time: the exact formula (ln 2 / ln(1 + r)) versus the "rule of 72"
import math

for r_percent in [1, 3, 7, 10, 20]:
    r = r_percent / 100
    exact = math.log(2) / math.log(1 + r)
    print(f"{r_percent:>2}% growth: exactly {exact:5.1f} years, rule of 72: {72 / r_percent:5.1f} years")
```

Between 1% and 10% the rule is surprisingly good (a few tenths of a year off), and it gets worse for large growth. Why does it work? For small $r$, $\ln(1 + r) \approx r$, and $\ln 2 \approx 0.693$, so $t \approx \frac{69.3}{r\,\%}$ – 72 was chosen only because it has many divisors (2, 3, 4, 6, 8, 9, 12), which makes it easy to divide in your head.

## Summary

- Floating-point numbers are stored rounded, and the errors can accumulate; exact calculation needs integers or fractions.
- **Horner's scheme:** the value of a degree-$n$ polynomial with $n$ multiplications; also good for polynomial division.
- **Bisection:** if $f(a)$ and $f(b)$ have different signs, after $k$ steps the root is known to within $\frac{b - a}{2^k}$.
- Doubling time: $t = \frac{\ln 2}{\ln(1 + r)}$, approximately $\frac{72}{r\,\%}$.

## Lesson exercise

```quiz required
? Calculate with Horner's scheme: $p(x) = x^3 - 2x^2 + 3x - 4$, $p(2) = ?$
= 2
! $((1 \cdot 2 - 2) \cdot 2 + 3) \cdot 2 - 4 = 2$

? Starting from an interval of length $1$, at least how many halvings are needed to know the root to better than $0.001$?
= 10
! $2^{10} = 1024 > 1000$, but $2^9 = 512 < 1000$.

? Simplify: $\dfrac{x^2 - 1}{x - 1}$ (where $x \neq 1$)
fn: x -> x + 1
domain: 2, 6
! A special product: $x^2 - 1 = (x - 1)(x + 1)$.

? According to the rule of 72, in how many years does an amount growing by $6\%$ a year double?
= 12
! $72 / 6 = 12$

? Which statement is true?
- the computer stores every decimal fraction exactly
+ $0.1$ is an infinite fraction in binary, so it can only be stored rounded
- calculating with fractions (numerator/denominator) is always inexact
- Horner's scheme gives a different result from the naive calculation
! Horner only changes the order of the calculation, not the result.
```
