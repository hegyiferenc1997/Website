---
title: Fourier Series Examples and Applications
summary: The Fourier series of the square wave, the sawtooth wave and |x|, the Gibbs phenomenon, famous sums, and Fourier analysis in signal processing.
minutes: 30
---

## What you will learn

- to compute the Fourier series of the **square wave** and the **sawtooth wave**,
- what the **Gibbs phenomenon** is,
- how Fourier series give **famous sums** (e.g. $\sum \frac{1}{k^2}$),
- where engineers use Fourier analysis.

## The square wave

Let $f(x) = -1$ on $(-\pi; 0)$ and $f(x) = 1$ on $(0; \pi)$, extended $2\pi$-periodically. It is **odd**, so $a_k = 0$ and

$$
b_k = \frac{2}{\pi}\int_0^\pi \sin(kx)\,dx = \frac{2}{\pi} \cdot \frac{1 - \cos(k\pi)}{k} = \begin{cases} \dfrac{4}{k\pi}, & k \text{ odd} \\ 0, & k \text{ even.} \end{cases}
$$

So only the **odd harmonics** appear:

$$
f(x) = \frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \dots\right) = \frac{4}{\pi}\sum_{k=1}^{\infty} \frac{\sin\big((2k - 1)x\big)}{2k - 1}.
$$

```plot
title: N-term Fourier approximation of the square wave
x: -7, 7
y: -1.6, 1.6
param: N = 3, 1, 40, 1
dash: sgn(sin(x)) # square wave
f: sum(k, 1, N, 4/pi * sin((2k - 1) x)/(2k - 1)) # S_N(x)
value: S_N(π/2) = sum(k, 1, N, 4/pi * sin((2k - 1) pi/2)/(2k - 1))
```

Drag the slider: the approximation hugs the square wave more and more closely, but next to the jumps there is always an **overshoot of about 9%**. This is the **Gibbs phenomenon**: the "bump" gets narrower, but its height does not shrink. At a jump, the Fourier series does not converge uniformly.

Substituting $x = \frac{\pi}{2}$ gives the **Leibniz series**: $1 = \frac{4}{\pi}\left(1 - \frac{1}{3} + \frac{1}{5} - \dots\right)$, that is, $1 - \frac{1}{3} + \frac{1}{5} - \dots = \frac{\pi}{4}$.

## The sawtooth wave

Let $f(x) = x$ on $(-\pi; \pi)$, extended periodically. It is also odd, and integration by parts gives

$$
b_k = \frac{2}{\pi}\int_0^\pi x\sin(kx)\,dx = \frac{2(-1)^{k+1}}{k}, \qquad
f(x) = 2\left(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \dots\right).
$$

```plot
title: Fourier approximation of the sawtooth wave
x: -7, 7
y: -4, 4
param: N = 3, 1, 40, 1
dash: mod(x + pi, 2pi) - pi # sawtooth
f: sum(k, 1, N, 2 (-1)^(k + 1) sin(k x)/k) # S_N(x)
```

Here every harmonic appears, and the coefficients decrease like $\frac{1}{k}$, just as slowly as for the square wave. The slow decay is caused by the **jump**.

## A continuous signal: |x|

$f(x) = \lvert x \rvert$ ($-\pi \leq x \leq \pi$) is **even** and **continuous**, so only cosines are needed: $\frac{a_0}{2} = \frac{\pi}{2}$, and $a_k = -\frac{4}{\pi k^2}$ for odd $k$, $0$ for even $k$:

$$
\lvert x \rvert = \frac{\pi}{2} - \frac{4}{\pi}\left(\cos x + \frac{\cos 3x}{9} + \frac{\cos 5x}{25} + \dots\right).
$$

The coefficients now decrease like $\frac{1}{k^2}$, so even a few terms are almost perfect. **Rule:** the smoother the function, the faster the coefficients decrease.

```plot
title: Fourier approximation of |x|: 2–3 terms are already very good
x: -7, 7
y: -0.5, 4
param: N = 1, 1, 10, 1
dash: abs(mod(x + pi, 2pi) - pi) # |x| periodically
f: pi/2 - sum(k, 1, N, 4/pi * cos((2k - 1) x)/(2k - 1)^2) # S_N(x)
```

At $x = 0$: $0 = \frac{\pi}{2} - \frac{4}{\pi}\sum \frac{1}{(2k - 1)^2}$, hence $1 + \frac{1}{9} + \frac{1}{25} + \dots = \frac{\pi^2}{8}$. Similarly, the series of $x^2$ gives the solution of the famous **Basel problem**: $\sum_{k=1}^\infty \frac{1}{k^2} = \frac{\pi^2}{6}$.

## Let's compute it by machine!

The coefficients are integrals, so they can be computed numerically. This is the core idea of the **discrete Fourier transform** (DFT; its fast version is the FFT).

```python run
import math
# The b_k coefficients of the square wave by numerical integration (midpoint rule)
def f(x):
    return 1.0 if math.sin(x) > 0 else -1.0

def b(k, n=20000):
    h = 2 * math.pi / n
    return sum(f(-math.pi + (i + 0.5) * h) * math.sin(k * (-math.pi + (i + 0.5) * h)) for i in range(n)) * h / math.pi

for k in range(1, 7):
    exact = 4 / (k * math.pi) if k % 2 else 0.0
    print(f"b_{k} ≈ {b(k):+.5f}   (exact: {exact:+.5f})")
```

## Applications

- **Sound and music:** the timbre of an instrument depends on the ratio of its harmonics. A spectrum analyzer shows the Fourier coefficients of a signal.
- **Compression:** MP3 and JPEG (the latter with the related cosine transform) drop the small coefficients, because they are barely audible or visible.
- **Filtering:** a low-pass filter attenuates the high harmonics. This turns a square wave into a "rounded" signal (just like the few-term approximation).
- **Electrical engineering:** splitting a non-sinusoidal current into harmonics lets us compute each harmonic separately (superposition).

## Summary

- Square wave: $\frac{4}{\pi}\sum \frac{\sin((2k-1)x)}{2k-1}$, odd harmonics only.
- Sawtooth: $2\sum (-1)^{k+1}\frac{\sin(kx)}{k}$.
- With a jump: $\frac{1}{k}$ decay and Gibbs overshoot; with a continuous signal (e.g. $\lvert x \rvert$): $\frac{1}{k^2}$ decay, fast convergence.
- Substitution gives famous sums: $\frac{\pi}{4}$, $\frac{\pi^2}{8}$, $\frac{\pi^2}{6}$.

## Lesson exercise

```quiz required
? What is $b_3$ in the Fourier series of the square wave?
- $\frac{4}{\pi}$
+ $\frac{4}{3\pi}$
- $\frac{1}{3}$
- $0$
! $b_k = \frac{4}{k\pi}$ for odd $k$.

? What is $b_4$ in the Fourier series of the square wave?
= 0
! For even $k$, $1 - \cos(k\pi) = 0$.

? What happens to the Gibbs overshoot as the number of terms grows?
- it tends to zero
+ it gets narrower, but its height (about 9%) remains
- it gets taller
- it disappears at 10 terms

? Give the first three terms of the Fourier series of the sawtooth wave ($f(x) = x$, $-\pi < x < \pi$)!
fn: x -> 2 sin(x) - sin(2x) + (2/3) sin(3x)
domain: -3, 3
! $b_k = \frac{2(-1)^{k+1}}{k}$, $k = 1, 2, 3$.

? Which sum follows from the Fourier series of $\lvert x \rvert$ at $x = 0$?
- $\sum \frac{1}{k^2} = \frac{\pi^2}{6}$
+ $\sum \frac{1}{(2k - 1)^2} = \frac{\pi^2}{8}$
- $\sum \frac{(-1)^{k+1}}{2k - 1} = \frac{\pi}{4}$
- $\sum \frac{1}{2k - 1} = \infty$

? What is the frequency (in Hz) of the third nonzero harmonic of a $50$ Hz square wave? (Counting the first one, $50$ Hz, too.)
= 250
! Only odd harmonics appear: $50, 150, 250, \dots$ Hz.
```
