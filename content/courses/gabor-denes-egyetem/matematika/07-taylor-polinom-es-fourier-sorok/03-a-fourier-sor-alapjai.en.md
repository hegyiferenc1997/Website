---
title: Fourier Series Basics
summary: Periodic functions, orthogonality of the trigonometric system, the formulas for the Fourier coefficients, and convergence.
minutes: 30
---

## What you will learn

- what a **periodic function** is, and why we approximate it with sines,
- what it means that the trigonometric system is **orthogonal**,
- how to compute the **Fourier coefficients**,
- what the Fourier series converges to (the **Dirichlet theorem**).

## Periodic functions

The function $f$ is **periodic with period $T$** if $f(x + T) = f(x)$ for every $x$. The period of $\sin x$ and $\cos x$ is $2\pi$; the period of $\sin(kx)$ and $\cos(kx)$ is $\frac{2\pi}{k}$, so these are all $2\pi$-periodic as well.

A Taylor polynomial approximates **near** one point. A **Fourier series**, by contrast, approximates "on average" across a whole period, which makes it suitable for describing signals (sound, current, vibration). The idea: every (nice enough) $2\pi$-periodic function can be written as a sum of **harmonic oscillations**:

$$
f(x) \sim \frac{a_0}{2} + \sum_{k=1}^{\infty} \big(a_k \cos(kx) + b_k \sin(kx)\big).
$$

The $k$-th term is the **$k$-th harmonic**: an oscillation with $k$ times the frequency.

```plot
title: Mixing harmonics
x: -7, 7
y: -3, 3
param: a = 1, -2, 2, 0.1
param: b = 0.5, -2, 2, 0.1
param: c = 0, -2, 2, 0.1
f: a sin(x) + b sin(2x) + c sin(3x) # sum
dash: a sin(x) # 1st harmonic
dash: b sin(2x) # 2nd harmonic
dash: c sin(3x) # 3rd harmonic
```

The sliders set the coefficients, that is, the **amplitude** of each harmonic. Whatever you choose, the sum stays $2\pi$-periodic.

## Orthogonality

The key is this property: on $[-\pi; \pi]$, the integral of the product of two **different** terms is zero. For all integers $m, k \geq 1$:

$$
\int_{-\pi}^{\pi} \sin(mx)\sin(kx)\,dx = \int_{-\pi}^{\pi} \cos(mx)\cos(kx)\,dx = \begin{cases} \pi, & m = k \\ 0, & m \neq k \end{cases}
\qquad
\int_{-\pi}^{\pi} \sin(mx)\cos(kx)\,dx = 0.
$$

We say that the system $1, \cos x, \sin x, \cos 2x, \sin 2x, \dots$ is **orthogonal** (by analogy with perpendicular vectors, where the integral plays the role of the dot product).

```plot
title: Orthogonality: the integral of the product on [−π; π]
x: -3.5, 3.5
y: -1.5, 1.5
param: m = 1, 1, 5, 1
param: k = 2, 1, 5, 1
f: sin(m x) sin(k x) # sin(mx)·sin(kx)
area: sin(m x) sin(k x) @ -pi, pi
```

Set $m = k$: the integral is $\pi \approx 3.1416$. For any $m \neq k$ the positive and negative parts cancel exactly.

## The Fourier coefficients

Multiplying the series by $\cos(kx)$ or $\sin(kx)$ and integrating from $-\pi$ to $\pi$, orthogonality leaves only one term. This gives the **Euler–Fourier formulas**:

$$
a_k = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\cos(kx)\,dx \quad (k \geq 0), \qquad
b_k = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\sin(kx)\,dx \quad (k \geq 1).
$$

The term $\frac{a_0}{2}$ is the **average** of the function over one period.

**Symmetry saves work:**

| If $f$ is…                | then                                                        | the series                   |
| ------------------------- | ----------------------------------------------------------- | ---------------------------- |
| **even** ($f(-x) = f(x)$) | $b_k = 0$, $a_k = \frac{2}{\pi}\int_0^\pi f(x)\cos(kx)\,dx$ | cosines only (cosine series) |
| **odd** ($f(-x) = -f(x)$) | $a_k = 0$, $b_k = \frac{2}{\pi}\int_0^\pi f(x)\sin(kx)\,dx$ | sines only (sine series)     |

**Example.** If $f(x) = 3 + 2\sin x - \cos(4x)$, this is already its own Fourier series: $\frac{a_0}{2} = 3$, so $a_0 = 6$; $b_1 = 2$; $a_4 = -1$, and every other coefficient is $0$.

**General period.** If the period is $T = 2L$, replace $kx$ with $\frac{k\pi x}{L}$ and $\frac{1}{\pi}\int_{-\pi}^{\pi}$ with $\frac{1}{L}\int_{-L}^{L}$. The **fundamental frequency** is $\frac{1}{T}$, and the $k$-th harmonic has frequency $\frac{k}{T}$.

## What does the series converge to?

**Dirichlet theorem.** If $f$ is $2\pi$-periodic and piecewise continuously differentiable on a period (with finitely many jumps), then its Fourier series converges at every point, namely

- to $f(x)$ where $f$ is continuous,
- to the **average** of the one-sided limits, $\frac{f(x^-) + f(x^+)}{2}$, where $f$ jumps.

For example, the series of a square wave jumping between $-1$ and $1$ tends to $0$ at the jump.

## Summary

- Fourier series: $\frac{a_0}{2} + \sum \big(a_k\cos(kx) + b_k\sin(kx)\big)$; the $k$-th harmonic has $k$ times the frequency.
- The coefficients come from orthogonality: $a_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f\cos(kx)$, $b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f\sin(kx)$.
- Even function: cosines only; odd function: sines only.
- At a jump the series tends to the average of the one-sided limits.

## Lesson exercise

```quiz required
? What is the (smallest positive) period of $\sin(3x)$?
- $3\pi$
- $\frac{\pi}{3}$
+ $\frac{2\pi}{3}$
- $6\pi$
! The period of $\sin(k x)$ is $\frac{2\pi}{k}$.

? What is $\displaystyle\int_{-\pi}^{\pi} \sin(2x)\cos(3x)\,dx$?
= 0
! Orthogonality.

? In the Fourier series of $f(x) = 3 + 2\sin x - \cos(4x)$, what is $a_0$? (Careful: the first term of the series is $\frac{a_0}{2}$.)
= 6

? In the same series, what is $a_4$?
= -1

? Which coefficients are zero in the Fourier series of an **odd** function?
+ every $a_k$ (the cosine terms and $a_0$)
- every $b_k$ (the sine terms)
- only $a_0$
- none of them
! Odd · even = odd, and an odd function integrates to $0$ over $[-\pi; \pi]$.

? A square wave equals $-1$ on $(-\pi; 0)$ and $1$ on $(0; \pi)$. What does its Fourier series converge to at $x = 0$?
= 0
! The Dirichlet theorem: the average of the one-sided limits at the jump.
```
