---
title: The Logarithm
summary: The logarithm as the "inverse" of raising to a power, its laws, and changing the base.
minutes: 20
---

## What you will learn

- what a **logarithm** means and when it is defined,
- the **laws** of logarithms,
- how to change to **another base**, and why $\log_2$ appears so often in computing.

## Definition

If $a > 0$, $a \neq 1$ and $b > 0$, then $\log_a b$ is the exponent to which $a$ must be raised to get $b$:

$$
\log_a b = c \iff a^c = b.
$$

Examples: $\log_2 8 = 3$, because $2^3 = 8$; $\log_{10} 0.01 = -2$; $\log_5 1 = 0$; $\log_3 3 = 1$.

Common notation: $\lg x = \log_{10} x$ (common logarithm), $\ln x = \log_e x$ (natural logarithm, $e \approx 2.718$), and in computing often $\log x = \log_2 x$.

The **conditions** matter: negative numbers and $0$ have **no** logarithm, and the base cannot be $1$ or non-positive.

## Laws

For $a > 0$, $a \neq 1$, $x, y > 0$:

$$
\log_a(xy) = \log_a x + \log_a y, \qquad \log_a \frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^k = k \log_a x.
$$

They follow from the laws of exponents: multiplication becomes addition. (That's why slide rules were once used for multiplying.)

**Change of base:**

$$
\log_a x = \frac{\log_b x}{\log_b a}, \qquad \text{e.g.}\quad \log_2 10 = \frac{\ln 10}{\ln 2} \approx 3.32.
$$

## Why it matters in computing

- **How many bits** are needed to store $N$ different values? $\lceil \log_2 N \rceil$. For $1000$ values: $\lceil 9.97 \rceil = 10$ bits.
- **Binary search:** in a sorted array of $N$ elements we find an element in at most about $\log_2 N$ steps: about $20$ steps for a million elements.
- The logarithm **grows slowly**: that is the secret of $O(\log n)$ algorithms.

```python run
import math
# How many bits for N different values, and how many binary search steps?
for n in [2, 10, 1000, 1_000_000, 4_000_000_000]:
    print(f"N = {n:>13,}: {math.ceil(math.log2(n)):>2} bits, about {math.log2(n):5.1f} steps")
```

```plot
title: The exponential and the logarithm function
x: -3, 8
y: -3, 8
param: a = 2, 1.2, 5, 0.1
f: a^x # aˣ
f: log(a, x) # logₐ x
dash: x # y = x
```

The two graphs are mirror images in the line $y = x$: the logarithm is the **inverse** of the exponential function (more on this in the functions topic).

## Summary

- $\log_a b = c \iff a^c = b$; defined only for $b > 0$ and $a > 0$, $a \neq 1$.
- $\log(xy) = \log x + \log y$, $\log(x/y) = \log x - \log y$, $\log x^k = k\log x$.
- Change of base: $\log_a x = \ln x / \ln a$; $N$ values need $\lceil \log_2 N \rceil$ bits.

## Lesson exercise

```quiz required
? What is $\log_2 32$?
= 5

? What is $\log_{10} 0.001$?
= -3

? What is $\log_6 4 + \log_6 9$?
= 2
! $\log_6 4 + \log_6 9 = \log_6 36$

? At least how many bits are needed to store $300$ different values?
= 9
! $2^8 = 256 < 300 \leq 512 = 2^9$

? Which expression is **not** defined over the real numbers?
- $\log_3 1$
- $\ln e$
+ $\log_2 (-4)$
- $\lg 0.5$
! The logarithm is defined only for positive numbers.
```
