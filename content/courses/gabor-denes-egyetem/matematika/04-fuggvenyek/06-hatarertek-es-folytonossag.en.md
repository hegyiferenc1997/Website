---
title: Limits and Continuity of Functions
summary: Limits at a point and at infinity, one-sided limits, asymptotes, continuity and discontinuities.
minutes: 30
---

## What you will learn

- what the **limit** of a function at a point and at **infinity** means,
- what **one-sided** limits and **vertical** and **horizontal asymptotes** are,
- how to handle the form $\frac{0}{0}$ and the important limit $\lim\limits_{x\to 0} \frac{\sin x}{x} = 1$,
- when a function is **continuous** and what kinds of **discontinuities** exist.

## Limit at a point

$\lim\limits_{x \to x_0} f(x) = A$ if, as $x$ approaches $x_0$ (but $x \neq x_0$), the values $f(x)$ approach $A$. More precisely: for every sequence $x_n \to x_0$ ($x_n \neq x_0$), $f(x_n) \to A$. It **does not matter** what $f(x_0)$ is, or even whether it is defined.

**The form $\frac{0}{0}$ – simplify:**

$$
\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} \frac{(x - 2)(x + 2)}{x - 2} = \lim_{x \to 2} (x + 2) = 4.
$$

**Important limit:** $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ (near $0$, $\sin x \approx x$).

## One-sided limits, vertical asymptotes

$\lim\limits_{x \to x_0^-} f(x)$ (from the left) and $\lim\limits_{x \to x_0^+} f(x)$ (from the right). The limit exists if both exist and are equal.

$f(x) = \dfrac{1}{x}$: $\lim\limits_{x \to 0^+} \frac{1}{x} = +\infty$, $\lim\limits_{x \to 0^-} \frac{1}{x} = -\infty$. The line $x = 0$ is a **vertical asymptote**.

## Limits at infinity, horizontal asymptotes

$\lim\limits_{x \to \infty} \dfrac{2x^2 + 1}{x^2 - 3} = 2$ (just as with sequences: divide by the highest power). The line $y = 2$ is a **horizontal asymptote**.

```plot
title: Asymptotes
x: -6, 6
y: -6, 8
f: (2x^2 + 1)/(x^2 - 3) # (2x² + 1)/(x² − 3)
dash: 2 # y = 2
```

## Continuity

$f$ is **continuous** at $x_0$ if

$$
\lim_{x \to x_0} f(x) = f(x_0),
$$

i.e. (1) $f$ is defined at $x_0$, (2) the limit exists, (3) they are equal. Intuitively: the graph can be drawn "without lifting the pencil".

The elementary functions (polynomials, $e^x$, $\ln x$, $\sin x$, …) and the functions obtained from them by operations and composition are **continuous at every point of their domain**.

**Discontinuities:**

- **removable:** the limit exists but $\neq f(x_0)$, or $f(x_0)$ is undefined (e.g. $\frac{x^2 - 4}{x - 2}$ at $2$);
- **jump:** both one-sided limits are finite but different (e.g. the sign function at $0$);
- **essential / infinite:** at least one one-sided limit does not exist or is infinite (e.g. $\frac{1}{x}$ at $0$).

```plot
title: A jump and a removable discontinuity
x: -4, 4
y: -2, 6
param: c = 1, -1, 3, 0.1
f: (x^2 - 4)/(x - 2) # (x² − 4)/(x − 2)
f: sgn(x) + c # sgn x + c
point: 2, 4 # "hole"
```

## Bolzano's theorem

If $f$ is continuous on $[a; b]$ and $f(a)$, $f(b)$ have opposite signs, then there is a $c \in \left]a; b\right[$ with $f(c) = 0$. The **bisection method** is based on this: always keep the half-interval where the sign changes.

```python run
def bisection(f, a, b, steps=40):
    """Find a zero by bisection: f(a) and f(b) have opposite signs."""
    for _ in range(steps):
        c = (a + b) / 2
        if f(a) * f(c) <= 0:
            b = c
        else:
            a = c
    return (a + b) / 2

# The zero of x³ − x − 2 between 1 and 2.
print(round(bisection(lambda x: x**3 - x - 2, 1, 2), 6))
```

## Summary

- $\lim_{x\to x_0} f(x)$: the behaviour of values near $x_0$, independent of $f(x_0)$; for $\frac{0}{0}$ simplify; $\frac{\sin x}{x} \to 1$.
- One-sided limits; vertical ($\pm\infty$ at a point) and horizontal (limit at infinity) asymptotes.
- Continuous: $\lim_{x\to x_0} f(x) = f(x_0)$; discontinuities: removable, jump, essential.
- Bolzano: a continuous function takes the value $0$ at a sign change → bisection.

## Lesson exercise

```quiz required
? What is $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x - 3}$?
= 6

? What is $\lim\limits_{x \to \infty} \dfrac{6x^2 - x}{3x^2 + 5}$?
= 2

? What is $\lim\limits_{x \to 0} \dfrac{\sin(5x)}{x}$?
= 5
! $\frac{\sin 5x}{x} = 5 \cdot \frac{\sin 5x}{5x}$

? What kind of discontinuity does $f(x) = \dfrac{1}{x - 1}$ have at $x = 1$?
- removable
- jump
+ essential (infinite), vertical asymptote
- it is continuous there
! The one-sided limits are $\pm\infty$.

? For which value of $a$ is $f(x) = \begin{cases} x + a, & x < 1 \\ 3x, & x \geq 1 \end{cases}$ continuous?
= 2
! The left-hand limit is $1 + a$, the value is $3$.
```
