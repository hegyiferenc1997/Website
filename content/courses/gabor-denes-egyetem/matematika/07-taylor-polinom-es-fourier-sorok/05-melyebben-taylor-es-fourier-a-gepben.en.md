---
title: Deeper – Taylor and Fourier Inside the Computer
summary: How a calculator computes e^x and sin x with Taylor series, why range reduction is needed, Taylor polynomials as approximations on a graph, the square wave's Fourier partial sums and the Gibbs phenomenon in numbers, and a home-made discrete Fourier transform that picks out the frequencies in a signal.
minutes: 45
---

## What you will learn in this lesson

- how the machine computes $e^x$ and $\sin x$ **with only addition and multiplication**,
- why a large angle must first be **brought back** into the interval $[-\pi, \pi]$,
- what the Gibbs phenomenon looks like **in numbers**,
- how a program "hears" the **frequencies** in a measured signal (the basis of the instrument tuner, Shazam and MP3).

## 1. e^x inside the machine: the Taylor series, while the term matters

The processor only knows the basic operations. The Taylor series of $e^x$ is

$$
e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \ldots = \sum_{k=0}^{\infty} \frac{x^k}{k!},
$$

and a clever trick: every term comes from the previous one with a single multiplication ($\frac{x^k}{k!} = \frac{x^{k-1}}{(k-1)!} \cdot \frac{x}{k}$), so there's no need to compute factorials separately.

```python run
# How does the machine compute e^x? Taylor series: 1 + x + x²/2! + x³/3! + …, while the term matters
import math

def exp_taylor(x):
    total, term, k = 1.0, 1.0, 0
    while abs(term) > 1e-16 * abs(total):   # the next term no longer changes the result
        k += 1
        term *= x / k                        # x^k / k! from the previous one: multiply by x/k
        total += term
    return total, k

for x in [0.5, 1, 5, 20]:
    value, terms = exp_taylor(x)
    print(f"e^{x:<4}: {terms:>2} terms, relative error {abs(value - math.exp(x)) / math.exp(x):.1e}")
```

For small $x$ few terms are enough, for large $x$ more and more are needed. Real libraries therefore play tricks: $e^{20} = \left(e^{20/32}\right)^{32}$ – the series converges quickly for the small exponent, and then we square five times.

## 2. sin x and range reduction

The series $\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \ldots$ converges for **every** $x$ – in theory. In practice, look at what happens at $x = 100$:

```python run
# Range reduction: sin(100) directly needs many terms, but sin is periodic – first subtract 2π's
import math

def sin_taylor(x, n_terms):
    total, term = 0.0, x
    for k in range(n_terms):
        total += term
        term *= -x * x / ((2 * k + 2) * (2 * k + 3))  # the next odd-degree term
    return total

x = 100.0
reduced = math.remainder(x, 2 * math.pi)              # x − k·2π, into the interval [−π, π]
print(f"100 → {reduced:.6f} (same sine)")
for n in [5, 20, 150]:
    print(f"{n:>3} terms: directly {sin_taylor(x, n):>14.4g} | reduced {sin_taylor(reduced, n):.10f}")
print(f"exact: math.sin(100) = {math.sin(100):.10f}")
```

Computed directly, the result is **useless**, even with 150 terms! Meanwhile the terms grow huge (the largest is about $\frac{100^{100}}{100!} \approx 10^{42}$), and when they are subtracted the rounding error swallows everything – the same phenomenon as with numerical differentiation. The solution: $\sin$ is periodic with period $2\pi$, so we first subtract the right multiple of $2\pi$, and use the series only for $|x| \le \pi$, where 10 terms are plenty.

```plot
title: sin x and its Taylor polynomials around 0
x: -6, 6
y: -3, 3
f: sin(x) # sin x
f: x # T₁
f: x - x^3/6 # T₃
f: x - x^3/6 + x^5/120 # T₅
f: x - x^3/6 + x^5/120 - x^7/5040 # T₇
```

The point is visible: the Taylor polynomial is excellent **near** the centre, but further away it breaks away from the function. The higher the degree, the wider the good range.

## 3. The square wave and the Gibbs phenomenon in numbers

The Fourier series of the square wave jumping between $\pm 1$ is $\frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \ldots\right)$. Let's look at the partial sums:

```python run
# Partial sums of the square wave's Fourier series: 4/π · (sin x + sin 3x / 3 + sin 5x / 5 + …)
import math

def partial_sum(x, n):
    return 4 / math.pi * sum(math.sin(k * x) / k for k in range(1, 2 * n, 2))

for n in [1, 3, 10, 100]:
    # the overshoot: the peak right after the jump (searched on a fine grid)
    peak = max(partial_sum(i / (50 * n), n) for i in range(1, 200))
    print(f"{n:>3} terms: f(π/2) = {partial_sum(math.pi / 2, n):.4f}, largest value = {peak:.4f}")
```

- Far from the jump ($x = \frac{\pi}{2}$) the partial sum gets closer and closer to $1$.
- Right after the jump, however, an **overshoot** up to about $1.179$ always remains – however many terms we take! That's about $9\%$ of the size of the jump ($2$). The peak gets narrower and moves closer to the jump, but it doesn't get lower: this is the **Gibbs phenomenon**.

```plot
title: The square wave's Fourier partial sum (3 and 5 terms)
x: -6.3, 6.3
y: -1.6, 1.6
f: 4/pi*(sin(x) + sin(3*x)/3 + sin(5*x)/5) # 3 terms
f: 4/pi*(sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7 + sin(9*x)/9) # 5 terms
dash: 1 # +1
dash: -1 # −1
```

In practice you see this as "ghost stripes" next to sharp edges in over-compressed JPEG images, and it's why digital filters ring at sharp signal transitions.

## 4. A home-made discrete Fourier transform

A microphone takes 1000 samples per second from a signal that is a mix of a 50 Hz hum and a quieter 120 Hz tone. Looking at the samples, we see nothing. The **discrete Fourier transform (DFT)** computes, for every frequency $k$, how much the signal "resembles" a cosine and a sine of that frequency – exactly as the formula for the Fourier coefficients does with an integral, only with a sum in place of the integral:

```python run
# Discrete Fourier transform: which frequencies are in a measured signal?
import math

N, fs = 200, 1000                    # 200 samples, 1000 samples/s (a 0.2 s recording)
signal = [1.0 * math.sin(2 * math.pi * 50 * n / fs)    # 50 Hz hum
          + 0.5 * math.sin(2 * math.pi * 120 * n / fs) # 120 Hz tone, half the amplitude
          for n in range(N)]

for k in range(N // 2):              # the k-th frequency = k · fs / N Hz
    re = sum(signal[n] * math.cos(2 * math.pi * k * n / N) for n in range(N))
    im = sum(signal[n] * math.sin(2 * math.pi * k * n / N) for n in range(N))
    amplitude = 2 * math.hypot(re, im) / N
    if amplitude > 0.1:              # print only the significant components
        print(f"{k * fs / N:>5.0f} Hz: amplitude {amplitude:.2f}")
```

The program returns the two components and their amplitudes exactly. For $N$ samples this method needs $N^2$ operations; in reality the **FFT** (fast Fourier transform) algorithm does the same in $N \log N$ steps – which is why your phone can analyse sound, filter noise or recognise music in real time.

## Summary

- The machine computes with Taylor series: every term comes from the previous one with one multiplication; it keeps adding while the term matters.
- For large $x$ the series converges in theory, but rounding spoils it – hence range reduction ($\sin$: by $2\pi$, $e^x$: halving and squaring).
- The Taylor polynomial is accurate near the centre; higher degree → wider good range.
- At a jump the Fourier partial sum overshoots by about $9\%$, for any number of terms (Gibbs phenomenon).
- The DFT computes the frequency components with sums; the FFT is its fast version.

## Lesson exercise

```quiz required
? In the Taylor series of $e^x$ the $k$-th term is $\frac{x^k}{k!}$. By what must the previous term be multiplied to get the next one, if $x = 6$ and $k = 3$?
= 2
! $\frac{x}{k} = \frac{6}{3} = 2$.

? Give the third-degree Taylor polynomial of $\sin x$ around $0$!
fn: x -> x - x^3/6
domain: -2, 2
! $\sin x \approx x - \frac{x^3}{3!}$

? Why is range reduction needed to compute $\sin 100$?
- because the Taylor series diverges at $x = 100$
+ because when the huge terms are subtracted, the rounding error swallows the result
- because the sine isn't periodic
- because $100$ radians is undefined
! The series converges in theory, but floating-point arithmetic can't extract an accurate $-0.5$ from terms of size $\approx 10^{42}$.

? Because of the Gibbs phenomenon, by roughly what percentage does the square wave's Fourier partial sum overshoot after the jump (relative to the size of the jump)?
= 9
! The peak is about $1.179$, the jump is $2$: $\frac{0.179}{2} \approx 9\%$.

? We compute a DFT on 200 samples of a 1000 samples/s recording. How many Hz is the frequency $k = 25$?
= 125
! $k \cdot \frac{f_s}{N} = 25 \cdot \frac{1000}{200} = 125$ Hz.
```
