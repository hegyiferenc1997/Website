---
title: Practice – Taylor Polynomials, Fourier Series
summary: Review questions and a summary worksheet on Taylor polynomials and Fourier series.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **e^x with a Taylor polynomial.** Write the function `exp_approx(x, n)`, which adds up the first `n` terms ($k = 0, 1, \ldots, n - 1$) of the Taylor series of $e^x$ and rounds to 6 decimals! Don't use `math.factorial`: compute every term from the previous one.

```python starter
def exp_approx(x, n):
    return round(1 + x, 6)
```

<details>
<summary>Solution</summary>

```python solution
def exp_approx(x, n):
    total, term = 0.0, 1.0
    for k in range(n):
        total += term
        term *= x / (k + 1)               # x^(k+1)/(k+1)! from the previous one
    return round(total, 6)
```

</details>

```python test
assert exp_approx(1, 1) == 1.0
assert exp_approx(1, 2) == 2.0
assert exp_approx(1, 10) == 2.718282
assert exp_approx(2, 5) == 7.0
assert exp_approx(-1, 15) == 0.367879
print("All checks passed!")
```

**2.** **How many terms are needed?** Write the function `terms_needed(x, eps)`, which tells at least how many terms of the Taylor series of $\sin x$ ($x - \frac{x^3}{3!} + \frac{x^5}{5!} - \ldots$) must be added so that the difference from `math.sin(x)` is less than `eps`!

```python starter
def terms_needed(x, eps):
    return 1
```

<details>
<summary>Solution</summary>

The further $x$ is from $0$, the more terms are needed – that's why it's worth bringing large angles into the interval $[-\pi, \pi]$ first.

```python solution
import math

def terms_needed(x, eps):
    total, term, count = 0.0, x, 0
    while abs(total - math.sin(x)) >= eps:
        total += term
        count += 1
        term *= -x * x / ((2 * count) * (2 * count + 1))   # the next odd-degree term
    return count
```

</details>

```python test
assert terms_needed(0.1, 1e-6) == 2
assert terms_needed(1, 1e-6) == 5
assert terms_needed(3, 1e-6) == 8
assert terms_needed(3, 1e-2) == 5
print("All checks passed!")
```

**3.** **Fourier series of the sawtooth wave.** The Fourier series of the sawtooth wave ($f(x) = x$ on the interval $(-\pi, \pi)$, periodically) is $2\left(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \ldots\right) = \sum_{k=1}^{\infty} \frac{2(-1)^{k+1}}{k}\sin kx$. Write the function `sawtooth(x, n)`, which returns the sum of the first `n` terms rounded to 4 decimals!

```python starter
def sawtooth(x, n):
    import math
    return round(sum(2 / k * math.sin(k * x) for k in range(1, n + 1)), 4)
```

<details>
<summary>Solution</summary>

The starter code is missing the alternating sign. With many terms the partial sum tends to $x$ (with $1000$ terms, $0.9989$ at $x = 1$).

```python solution
import math

def sawtooth(x, n):
    return round(sum(2 * (-1) ** (k + 1) / k * math.sin(k * x) for k in range(1, n + 1)), 4)
```

</details>

```python test
import math
assert sawtooth(math.pi / 2, 1) == 2.0
assert sawtooth(math.pi / 2, 3) == 1.3333
assert sawtooth(1, 1000) == 0.9989
assert sawtooth(0, 50) == 0.0
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the second-degree Taylor polynomial of $\cos x$ around $0$?
fn: x -> 1 - x^2/2
domain: -1, 1
! $\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \ldots$

? What is the third derivative of $f(x) = e^{2x}$ at $0$?
= 8
! $f'''(x) = 8e^{2x}$.

? What is the coefficient of $x^3$ in the Taylor series of $\ln(1 + x)$? (fraction or decimal)
= 1/3
= 0,3333
= 0.3333
! $\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \ldots$

? Which terms appear in the Fourier series of an odd function?
- only cosine terms
+ only sine terms
- only the constant term
- both sine and cosine terms
! Cosine is an even function, so for an odd function $a_k = 0$.

? In the Fourier series of a function periodic with $2\pi$, what is the frequency of the $\sin 5x$ term if the fundamental frequency is 50 Hz? (Hz)
= 250
! The frequency of the $k$-th harmonic is $k \cdot f_0 = 5 \cdot 50 = 250$ Hz.
```
