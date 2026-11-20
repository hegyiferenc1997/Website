---
title: Practice – Functions
summary: Review questions and a summary worksheet on functions, limits and continuity.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Composition.** Write the function `compose(f, g)`, which returns a **new function**: the one that computes $f(g(x))$ for an `x`!

```python starter
def compose(f, g):
    return lambda x: g(f(x))
```

<details>
<summary>Solution</summary>

The starter code swaps the order – composition isn't commutative.

```python solution
def compose(f, g):
    return lambda x: f(g(x))              # first g, then f
```

</details>

```python test
square = lambda x: x ** 2
plus3 = lambda x: x + 3
assert compose(square, plus3)(2) == 25     # (2 + 3)²
assert compose(plus3, square)(2) == 7      # 2² + 3
assert compose(abs, plus3)(-10) == 7
print("All checks passed!")
```

**2.** **Inverse of a linear function.** The inverse of $f(x) = ax + b$ ($a \ne 0$) is also linear: $f^{-1}(x) = cx + d$. Write the function `inverse(a, b)`, which returns the pair `(c, d)` rounded to 4 decimals!

```python starter
def inverse(a, b):
    return (a, -b)
```

<details>
<summary>Solution</summary>

```python solution
def inverse(a, b):
    # y = ax + b  →  x = (y − b) / a = (1/a)·y − b/a
    return (round(1 / a, 4), round(-b / a, 4))
```

</details>

```python test
assert inverse(3, -6) == (0.3333, 2.0)
assert inverse(2, 4) == (0.5, -2.0)
assert inverse(1.8, 32) == (0.5556, -17.7778)   # Fahrenheit → Celsius
assert inverse(-1, 5) == (-1.0, 5.0)
print("All checks passed!")
```

**3.** **Even or odd?** Write the function `parity(f)`, which examines $f(-x)$ at the points $x = 0.5, 1, 1.7, 2.3, 3$ and returns `"even"` if $f(-x) = f(x)$ everywhere, `"odd"` if $f(-x) = -f(x)$ everywhere, and `"neither"` otherwise! (Because of rounding errors, compare with `math.isclose`.)

```python starter
def parity(f):
    return "even"
```

<details>
<summary>Solution</summary>

Examining a few points is only a **check**, not a proof – but if it fails at one point, that's a definite refutation.

```python solution
import math

def parity(f):
    points = [0.5, 1, 1.7, 2.3, 3]
    if all(math.isclose(f(-x), f(x)) for x in points):
        return "even"                     # symmetric about the y axis
    if all(math.isclose(f(-x), -f(x)) for x in points):
        return "odd"                      # symmetric about the origin
    return "neither"
```

</details>

```python test
import math
assert parity(lambda x: x ** 2) == "even"
assert parity(math.cos) == "even"
assert parity(lambda x: x ** 3 - x) == "odd"
assert parity(math.sin) == "odd"
assert parity(lambda x: x ** 2 + x) == "neither"
assert parity(math.exp) == "neither"
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the smallest element of the domain of $f(x) = \sqrt{x - 4}$?
= 4
! Under the square root it can't be negative: $x \ge 4$.

? Give the inverse of the function $f(x) = 2x + 6$!
fn: x -> (x - 6)/2
! $x = \frac{y - 6}{2}$.

? $f(x) = 2x$, $g(x) = x - 1$. What is $f(g(5))$?
= 8
! $g(5) = 4$, $f(4) = 8$.

? Which function is odd?
- $x^2 + 1$
+ $x^3$
- $|x|$
- $\cos x$
! $(-x)^3 = -x^3$.

? Where does the function $f(x) = \dfrac{2x - 1}{x + 5}$ have a vertical asymptote? ($x = ?$)
= -5
! Where the denominator is $0$.
```
