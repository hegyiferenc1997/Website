---
title: Applications – Optimisation and Newton's Method
summary: Practical extremum problems, linear approximation, and Newton's method for solving equations by computer.
minutes: 30
---

## What you will learn

- how to set up and solve an **optimisation** (extremum) problem,
- what **linear approximation** is (the tangent as an approximation),
- how **Newton's method** works and why it is so fast.

## Optimisation

**Steps:** (1) what do we want to maximise/minimise? (2) write it as a function of **one** variable (substituting the constraint), (3) domain, (4) differentiate, stationary points, (5) endpoints and check, (6) answer.

**Example – the largest box.** From the corners of a $12 \times 12$ cm card we cut out squares of side $x$ cm and fold up the sides. For which $x$ is the volume of the box maximal?

$$
V(x) = x (12 - 2x)^2, \qquad 0 < x < 6.
$$

$V'(x) = (12 - 2x)^2 + x \cdot 2(12 - 2x)(-2) = (12 - 2x)(12 - 6x)$. Stationary point in the domain: $x = 2$. Here $V(2) = 2 \cdot 8^2 = 128$ cm³, and $V \to 0$ at the endpoints, so this is the maximum.

```plot
title: Volume of the box as a function of the cut size
x: 0, 6
y: 0, 150
param: t = 1, 0.1, 5.9, 0.05
tangent: x (12 - 2x)^2 @ t # V(x) = x(12 − 2x)²
value: V(t) = t (12 - 2t)^2
```

Optimisation is everywhere in computing: **machine learning** minimises an error function using its derivative (gradient) – **gradient descent**.

## Linear approximation

Near the point, the tangent approximates the function well:

$$
f(x_0 + h) \approx f(x_0) + f'(x_0)\, h.
$$

For example $\sqrt{4.1}$: $f(x) = \sqrt x$, $x_0 = 4$, $f'(4) = \frac{1}{4}$, so $\sqrt{4.1} \approx 2 + \frac{0.1}{4} = 2.025$ (exactly $2.02485\ldots$).

## Newton's method

We look for a solution of $f(x) = 0$. Starting from $x_0$, we take the zero of the tangent as the next approximation:

$$
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}.
$$

With a good starting value it converges **very fast**: the number of correct digits roughly **doubles** at every step. Calculators and libraries compute square roots this way too: $\sqrt{a}$ solves $x^2 - a = 0$, and the step is $x_{n+1} = \frac{1}{2}\left(x_n + \frac{a}{x_n}\right)$ (Heron's method).

```plot
title: Newton's method: the zero of the tangent is the next approximation
x: 0, 4
y: -3, 8
param: t = 3, 0.5, 3.8, 0.05
tangent: x^2 - 2 @ t # f(x) = x² − 2
value: next approximation = t - (t^2 - 2)/(2t)
```

```python run
def newton(f, df, x, steps=6):
    """Newton's method: x_{n+1} = x_n - f(x_n) / f'(x_n)."""
    for n in range(steps):
        x = x - f(x) / df(x)
        print(f"step {n + 1}: {x:.15f}")
    return x

# √2 is the positive root of x² − 2 = 0.
newton(lambda x: x * x - 2, lambda x: 2 * x, 3.0)
print("exact:  ", 2 ** 0.5)
```

## Summary

- Optimisation: single-variable objective → derivative $= 0$ → endpoints → answer.
- Linear approximation: $f(x_0 + h) \approx f(x_0) + f'(x_0)h$.
- Newton: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$; very fast, but needs a good starting value.

## Lesson exercise

```quiz required
? A rectangle has perimeter $40$ m. What is its area when the area is maximal?
= 100
! $T(x) = x(20 - x)$, maximum at $x = 10$.

? In the box problem above (the $12 \times 12$ card), for which $x$ is the volume maximal?
= 2

? By linear approximation, what is $\sqrt{9.3}$? ($x_0 = 9$, to three decimals.)
= 3.05
= 3.050
! $3 + \frac{0.3}{6}$

? We solve $x^2 - 10 = 0$ with Newton's method from $x_0 = 3$. What is $x_1$? (Rounded to four decimals.)
= 3.1667
! $x_1 = 3 - \frac{9 - 10}{6}$

? What is the Newton step for $f(x) = x^3 - a$ (cube root)? Give $x_{n+1}$ as a function of $x$ (= $x_n$) and $a$!
fn: x, a -> x - (x^3 - a)/(3x^2)
domain: 1, 4
```
