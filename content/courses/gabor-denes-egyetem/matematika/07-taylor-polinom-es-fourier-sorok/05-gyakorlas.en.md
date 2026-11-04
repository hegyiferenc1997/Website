---
title: Practice – Taylor Polynomials, Fourier Series
summary: Review questions and a summary worksheet on Taylor polynomials and Fourier series.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. How does the approximation of a Taylor polynomial differ from that of a Fourier series?</summary>

A Taylor polynomial approximates **near** one point (the function value and the derivatives match there); further away the error can grow fast. A Fourier series approximates on average across a **whole period**, and it also works for functions with jumps (that are not differentiable).

</details>

<details>
<summary>2. Why is $n = 9$ enough to get $e$ with $10^{-6}$ accuracy?</summary>

By the Lagrange remainder, the error is at most $\frac{3}{(n + 1)!}$. For $n = 9$ this is $\frac{3}{3\,628\,800} \approx 8.3 \cdot 10^{-7} < 10^{-6}$, while for $n = 8$ it is $\frac{3}{362\,880} \approx 8.3 \cdot 10^{-6}$, which is still too large.

</details>

<details>
<summary>3. How can you quickly write down the Taylor polynomial of $\sin(x^2)$ or $x e^x$?</summary>

No differentiation needed: **substitute** into, or **multiply** a known series. $\sin(x^2) = x^2 - \frac{x^6}{6} + \dots$, and $x e^x = x + x^2 + \frac{x^3}{2} + \dots$

</details>

<details>
<summary>4. Why does the Fourier series of the square wave contain only sines, and only odd ones?</summary>

The square wave is an odd function, so every $a_k = 0$. In $b_k = \frac{2}{\pi}\cdot\frac{1 - \cos(k\pi)}{k}$, for even $k$ we have $\cos(k\pi) = 1$, so $b_k = 0$. Intuitively: the signal is "half-wave symmetric", $f(x + \pi) = -f(x)$, which even harmonics cannot do.

</details>

## Summary worksheet

```quiz required
? Give the third-degree Taylor polynomial of $f(x) = e^x$ around $a = 0$!
fn: x -> 1 + x + x^2/2 + x^3/6
domain: -1, 1

? Give the second-degree Taylor polynomial of $f(x) = \sqrt{1 + x}$ around $a = 0$!
fn: x -> 1 + x/2 - x^2/8
domain: -0.5, 0.5
! $f'(0) = \frac{1}{2}$, $f''(0) = -\frac{1}{4}$, and $\frac{f''(0)}{2!} = -\frac{1}{8}$.

? Give the second-degree Taylor polynomial of $f(x) = \ln x$ around $a = 1$!
fn: x -> (x - 1) - (x - 1)^2/2
domain: 0.5, 1.5

? What is the coefficient of $x^4$ in the Taylor series of $x \mapsto \cos x$? (As a fraction or a decimal.)
= 1/24

? On which interval does the series $1 + x + x^2 + \dots$ converge?
- for every real $x$
- $0 \leq x < 1$
+ $-1 < x < 1$
- $-1 \leq x \leq 1$

? The $2\pi$-periodic function $f(x) = x^2$ ($-\pi \leq x \leq \pi$) is even. What is $b_5$ in its Fourier series?
= 0

? In the Fourier series of $f(x) = 5 - 3\cos(2x) + 4\sin(7x)$, what is $a_0$?
= 10

? In the same series, what is $b_7$?
= 4

? A signal equals $2$ on $(0; \pi)$ and $0$ on $(-\pi; 0)$. What does its Fourier series converge to at the jump $x = 0$?
= 1
! The average of the one-sided limits: $\frac{0 + 2}{2}$.

? Which signal's Fourier coefficients decrease the fastest?
- the square wave
- the sawtooth wave
+ the periodic extension of $\lvert x \rvert$ (triangle wave)
- all three equally fast
! A continuous signal without jumps: $\frac{1}{k^2}$ decay.
```
