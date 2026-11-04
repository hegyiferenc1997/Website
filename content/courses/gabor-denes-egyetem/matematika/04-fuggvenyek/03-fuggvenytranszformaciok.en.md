---
title: Transformations of Functions
summary: Shifting, reflecting, stretching and shrinking – a·f(b(x − c)) + d, tried out with sliders.
minutes: 20
---

## What you will learn

- how a graph changes under $f(x) + d$, $f(x - c)$, $a \cdot f(x)$ and $f(bx)$,
- how to sketch a more complicated function step by step from a **basic function**,
- how to get the **reflections**.

## The four basic steps

Let $f$ be the basic function (e.g. $x^2$, $\sqrt x$, $\sin x$).

| New function     | Effect on the graph                                                 |
| ---------------- | ------------------------------------------------------------------- |
| $f(x) + d$       | **vertical** shift by $d$ (upwards if $d > 0$)                      |
| $f(x - c)$       | **horizontal** shift by $c$ (to the **right** if $c > 0$!)          |
| $a \cdot f(x)$   | **vertical stretch** by a factor $a$ ($\lvert a \rvert < 1$: shrink); $a < 0$: reflection in the $x$ axis |
| $f(b x)$         | **horizontal shrink** to $1/b$ ($\lvert b \rvert > 1$); $b < 0$: reflection in the $y$ axis |

The most common mistake: $f(x - 3)$ shifts to the **right**, not to the left. Think about it: $f(x - 3)$ takes the same value $3$ units later (at a larger $x$).

## Try it!

```plot
title: a · f(b(x − c)) + d
x: -6, 6
y: -5, 7
param: a = 1, -3, 3, 0.1
param: b = 1, -3, 3, 0.1
param: c = 0, -4, 4, 0.5
param: d = 0, -4, 4, 0.5
f: a (b (x - c))^2 + d # a·(b(x − c))² + d
dash: x^2 # x²
```

```plot
title: Transformed sine: A · sin(ω(x − φ))
x: -7, 7
y: -4, 4
param: A = 1, -3, 3, 0.1
param: w = 1, 0.2, 4, 0.1
param: p = 0, -3.2, 3.2, 0.1
f: A sin(w (x - p)) # A·sin(ω(x − φ))
dash: sin(x) # sin x
value: period 2π/ω = 2 pi/w
```

In the second graph $A$ is the **amplitude**, $\omega$ the **angular frequency** (the period is $\frac{2\pi}{\omega}$), $\varphi$ the **phase shift** – this is how signals are described in signal processing.

## Sketching step by step

$g(x) = -2(x + 1)^2 + 3$ from $x^2$: (1) $(x + 1)^2$: $1$ to the **left**; (2) $2(x+1)^2$: stretched vertically by $2$; (3) $-2(x+1)^2$: reflected in the $x$ axis; (4) $+3$: up by $3$. The vertex is $(-1; 3)$ and the parabola opens downwards.

**Order:** the "inner" transformations (on $x$: shift, shrink) and the "outer" ones (on the value of $f$: stretch, shift) can be handled separately; for the outer ones stretch/reflect first, then shift.

## Summary

- $f(x) + d$: up/down; $f(x - c)$: right/left (opposite sign!).
- $a f(x)$: vertical stretch, $a < 0$ reflects in the $x$ axis; $f(bx)$: horizontal shrink, $b < 0$ reflects in the $y$ axis.
- $A \sin(\omega(x - \varphi))$: amplitude, period $\frac{2\pi}{\omega}$, phase shift.

## Lesson exercise

```quiz required
? How do we get the graph of $\sqrt{x - 4}$ from $\sqrt{x}$?
- shift it $4$ to the left
+ shift it $4$ to the right
- shift it $4$ up
- shift it $4$ down

? What is the **first** coordinate of the vertex of the parabola $g(x) = -2(x + 1)^2 + 3$?
= -1

? What is the largest element of the range of $g(x) = -2(x + 1)^2 + 3$?
= 3

? Write the formula of the function obtained from the graph of $x^2$ by shifting it $2$ to the right and then $5$ down!
fn: x -> (x - 2)^2 - 5

? What is the period of $3\sin(4x)$? (Round to two decimals!)
= 1.57
! $\frac{2\pi}{4} = \frac{\pi}{2}$
```
