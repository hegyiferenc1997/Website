---
title: Deeper – Functions in Practice
summary: The order of composition and the inverse function in numbers (Celsius ↔ Fahrenheit), asymptotes from approximate values and on a graph, the limit sin x / x and the small-angle approximation, and a piecewise tariff as a function.
minutes: 35
---

## What you will learn in this lesson

- to see **in numbers** that the order matters in composition, and that the inverse "undoes" the function,
- to recognise horizontal and vertical asymptotes **from a table**,
- why $\frac{\sin x}{x}$ tends to $1$, and what that's good for in engineering practice,
- to write an everyday situation (a tariff) as a **piecewise function**.

## 1. Composition and inverse in numbers

Let $f(x) = x^2$ and $g(x) = x + 3$. $f(g(x))$ means: **first** $g$, then $f$; $g(f(x))$ is the other way round.

```python run
# Composition: the order matters! f(x) = x², g(x) = x + 3
f = lambda x: x ** 2
g = lambda x: x + 3

print(" x | f(g(x)) = (x + 3)² | g(f(x)) = x² + 3")
for x in [-2, 0, 1, 4]:
    print(f"{x:>2} | {f(g(x)):>17} | {g(f(x)):>16}")

# Inverse: Celsius → Fahrenheit and back; their composition is the identity
c_to_f = lambda c: 9 / 5 * c + 32
f_to_c = lambda fh: 5 / 9 * (fh - 32)
for c in [-40, 0, 37, 100]:
    print(f"{c:>4} °C → {c_to_f(c):>6.1f} °F → back: {f_to_c(c_to_f(c)):>6.1f} °C")
```

$f(g(x)) = (x + 3)^2$ and $g(f(x)) = x^2 + 3$ are quite different functions – composition is **not commutative**. (As in everyday life: first you put on your socks, then your shoes – the other way round isn't the same.)

The **inverse** function undoes the original: $f^{-1}(f(x)) = x$. The Celsius → Fahrenheit conversion is $F = \frac95 C + 32$; you get its inverse by expressing $C$: $C = \frac59 (F - 32)$. The table shows that converting there and back always returns the starting value. A curiosity: $-40$ degrees is the same in Celsius and Fahrenheit – that's where the graphs of the two functions intersect.

## 2. Asymptotes from a table

The behaviour of the function $f(x) = \dfrac{2x^2 + 1}{x^2 - 1}$ is worth looking at in two places: for very large $x$, and where the denominator is $0$ ($x = \pm 1$).

```python run
# Asymptotes in numbers: f(x) = (2x² + 1) / (x² − 1)
f = lambda x: (2 * x ** 2 + 1) / (x ** 2 - 1)

print("x → ∞:          ", "  ".join(f"f({x:g}) = {f(x):.6f}" for x in [10, 100, 1000]))
print("x → 1 from right:", "  ".join(f"f({x:g}) = {f(x):.1f}" for x in [1.1, 1.01, 1.001]))
print("x → 1 from left: ", "  ".join(f"f({x:g}) = {f(x):.1f}" for x in [0.9, 0.99, 0.999]))
```

- $x \to \infty$: the values approach $2$ → **horizontal asymptote** $y = 2$. On paper: divide by $x^2$: $\dfrac{2 + \frac{1}{x^2}}{1 - \frac{1}{x^2}} \to \dfrac{2}{1} = 2$.
- $x \to 1$: it "runs away" to $+\infty$ from the right and to $-\infty$ from the left → **vertical asymptote** $x = 1$ (and likewise at $x = -1$).

```plot
title: The asymptotes of a rational function
x: -4, 4
y: -8, 10
f: (2x^2 + 1)/(x^2 - 1) # f(x)
dash: 2 # y = 2
```

A table of numbers is a good **check**, but not a proof: the limit must be established by algebraic manipulation. It helps a lot the other way round, though: if you get $3$ on paper but the table tends to $2$, you made a mistake somewhere.

## 3. sin x / x and the small-angle approximation

In the limit $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ the function isn't defined at $0$ (0/0), yet it has a limit:

```python run
# A famous limit: sin x / x → 1 as x → 0 (in radians!)
import math

for x in [1, 0.1, 0.01, 0.001]:
    print(f"x = {x:<6}: sin x / x = {math.sin(x) / x:.8f}")

deg = math.radians(1)                       # 1 degree in radians
print(f"\n1° = {deg:.6f} rad, sin(1°) = {math.sin(deg):.6f} – almost the same (small-angle approximation)")
```

This means that for small angles **$\sin x \approx x$** (in radians!). Engineering practice uses this in countless places: simplifying the equation of motion of a pendulum, in optics, estimating slopes and tilt angles. For 1° the error is less than two millionths. Beware: measured in degrees this is **not** true – that's why every programming language's `sin` function works in radians.

## 4. A piecewise function: a tariff

Everyday "rules" are often **piecewise functions**. A mobile data plan: a $3000$ Ft base fee up to $5$ GB, then $400$ Ft/GB, but at most $9000$ Ft.

$$
d(x) = \begin{cases} 3000, & 0 \le x \le 5 \\ 3000 + 400\,(x - 5), & 5 < x \le 20 \\ 9000, & x > 20 \end{cases}
$$

```python run
# A piecewise function: the monthly fee of a mobile data plan as a function of usage (GB)
def monthly_fee(gb):
    if gb <= 5:
        return 3000                         # base fee, 5 GB included
    elif gb <= 20:
        return 3000 + (gb - 5) * 400        # 400 Ft/GB above 5 GB
    else:
        return 9000                         # fee cap above 20 GB

for gb in [0, 5, 10, 20, 30]:
    print(f"{gb:>2} GB → {monthly_fee(gb):>5} Ft")
```

It's worth thinking through the function's properties: it's **continuous** (there's no jump at the boundaries: $d(20) = 3000 + 400 \cdot 15 = 9000$), **monotonically increasing** (but not strictly), and **bounded** ($3000 \le d(x) \le 9000$). If the cap were, say, $8000$ Ft while the middle formula stayed the same, the fee would suddenly **jump** from $9000$ down to $8000$ at $20$ GB – the function wouldn't be continuous there, and more data would be cheaper. In a program, an `if–elif–else` structure is exactly a piecewise function.

## Summary

- Composition isn't commutative: in general $f(g(x)) \ne g(f(x))$; the inverse: $f^{-1}(f(x)) = x$.
- Horizontal asymptote: the limit as $x \to \pm\infty$; vertical: where the denominator is $0$ and the function tends to infinity.
- $\lim\limits_{x \to 0} \frac{\sin x}{x} = 1$, so for small angles $\sin x \approx x$ (in radians).
- A piecewise function is the mathematical counterpart of an `if–elif–else` in a program.

## Lesson exercise

```quiz required
? Give the inverse of the function $f(x) = 3x - 6$!
fn: x -> x/3 + 2
! Express $x$: $y = 3x - 6 \Rightarrow x = \frac{y + 6}{3}$.

? $f(x) = x^2$, $g(x) = x + 3$. What is $g(f(-2))$?
= 7
! $f(-2) = 4$, $g(4) = 7$.

? What is the horizontal asymptote of the function $f(x) = \dfrac{6x^2 - x}{2x^2 + 5}$? ($y = ?$)
= 3
! The ratio of the highest-degree terms: $\frac{6}{2} = 3$.

? Where does the function $f(x) = \dfrac{x + 1}{x - 4}$ have a vertical asymptote? ($x = ?$)
= 4
! Where the denominator is $0$ (and the numerator isn't).

? According to the tariff ($3000$ Ft up to $5$ GB, then $400$ Ft/GB, at most $9000$ Ft), what is the fee at $12$ GB (Ft)?
= 5800
! $3000 + 400 \cdot 7 = 5800$
```
