---
title: Elementary Functions
summary: Graphs and properties of linear, power, exponential, logarithmic and trigonometric functions.
minutes: 25
---

## What you will learn

- the shape of **linear** and **power functions**,
- the behaviour of the **exponential** and **logarithmic** functions,
- the **trigonometric functions** (sine, cosine, tangent) in radians.

## Linear functions

$f(x) = mx + b$: a straight line, $m$ is the **slope** (how much it rises for one unit to the right), $b$ the **intercept** ($f(0) = b$). The slope of the line through two points is $m = \dfrac{y_2 - y_1}{x_2 - x_1}$.

```plot
title: Line: slope and intercept
x: -5, 5
y: -5, 5
param: m = 1, -3, 3, 0.1
param: b = 0, -4, 4, 0.5
f: m x + b # mx + b
```

## Power functions

- $x^2$, $x^4$, …: even exponent, "U" shaped, an **even** function.
- $x^3$, $x^5$, …: odd exponent, "S" shaped, an **odd** function.
- $x^{-1} = \frac{1}{x}$: hyperbola, undefined at $0$.
- $\sqrt{x} = x^{1/2}$: only for $x \geq 0$, grows slowly.

```plot
title: Power functions
x: -3, 3
y: -3, 4
param: k = 2, -2, 5, 1
f: x^k # xᵏ
dash: x # x
```

## Exponential and logarithmic functions

$f(x) = a^x$ ($a > 0$, $a \neq 1$): always positive, $f(0) = 1$; strictly increasing for $a > 1$, decreasing for $0 < a < 1$. The most important base is $e$: $e^x$ (exponential growth, decay, compound interest).

$g(x) = \log_a x$ is the **inverse** of the exponential: $D_g = ]0; \infty[$, $R_g = \mathbb{R}$, $g(1) = 0$. It grows very slowly: $\log_2 10^6 \approx 20$.

## Trigonometric functions

Angles are measured in **radians**: $180^\circ = \pi$, $\ 90^\circ = \frac{\pi}{2}$. The point of the unit circle at angle $\alpha$ is $(\cos\alpha; \sin\alpha)$.

| Function    | $D_f$                                 | $R_f$         | Period   | Parity   |
| ----------- | ------------------------------------- | ------------- | -------- | -------- |
| $\sin x$    | $\mathbb{R}$                          | $[-1; 1]$     | $2\pi$   | odd      |
| $\cos x$    | $\mathbb{R}$                          | $[-1; 1]$     | $2\pi$   | even     |
| $\tan x$    | $x \neq \frac{\pi}{2} + k\pi$         | $\mathbb{R}$  | $\pi$    | odd      |

Special values: $\sin 0 = 0$, $\sin\frac{\pi}{6} = \frac{1}{2}$, $\sin\frac{\pi}{2} = 1$, $\cos 0 = 1$, $\cos\frac{\pi}{3} = \frac{1}{2}$, $\cos\pi = -1$. Basic identity: $\sin^2 x + \cos^2 x = 1$.

```plot
title: Sine, cosine, tangent
x: -7, 7
y: -3, 3
f: sin(x) # sin x
f: cos(x) # cos x
dash: tan(x) # tan x
```

Trigonometric functions describe **periodic** phenomena: vibration, sound, alternating current, and the Fourier series is built from them (topic 7).

## Summary

- Linear: $mx + b$; slope = rise / run.
- Power function: even exponent → even, odd exponent → odd function.
- $a^x > 0$, $a^0 = 1$; $\log_a$ is its inverse, only for positive numbers.
- $\sin, \cos$: period $2\pi$, range $[-1; 1]$; $\tan$: period $\pi$.

## Lesson exercise

```quiz required
? What is the slope of the line through $(1; 2)$ and $(4; 11)$?
= 3

? Give the equation of this line in the form $y = f(x)$!
fn: x -> 3x - 1
! $2 = 3 \cdot 1 + b$

? What is $\sin\dfrac{\pi}{6} + \cos\dfrac{\pi}{3}$?
= 1
! Both are $\frac{1}{2}$.

? How many radians is $270^\circ$? (Round to two decimals!)
= 4.71
! $\frac{3\pi}{2}$

? Which function has range $]0; \infty[$?
- $\ln x$
+ $2^x$
- $x^3$
- $\sin x$
```
