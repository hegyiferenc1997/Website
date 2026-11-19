---
title: Deeper – Signal Processing and Error Correction in Numbers
summary: The frequency response of a moving-average filter (which frequencies it lets through, and how much) and filtering a noisy signal, fixed-point multiply-accumulate in Q15 format with saturation, the way a DSP block calculates, and how many check bits ECC memory needs – and why a server memory word is 72 bits.
minutes: 40
---

## What you will learn in this lesson

- to **calculate** how much of each frequency a moving-average filter lets through, and see how it removes a hum,
- how a DSP block calculates with **fixed-point** numbers (Q15), and why **saturation** is needed instead of overflow,
- to **calculate** how many check bits ECC needs for a given word length – and understand from this why a server memory word is 72 bits.

## 1. The moving average as a filter

An N-point moving average outputs the average of the last N samples: **y[n] = (x[n] + x[n−1] + … + x[n−N+1]) / N**. This is a **FIR filter** whose coefficients are all 1/N. But what does it do with different frequencies? The frequency response shows how much of each it lets through (1 = all of it, 0 = nothing):

```python run
# The moving-average filter as a FIR: how much does it pass at different frequencies?
import cmath, math

def fir_gain(coefficients, f, fs):
    # the magnitude of the frequency response: |Σ h[k] · e^(−j·2π·f·k/fs)|
    return abs(sum(h * cmath.exp(-2j * math.pi * f * k / fs) for k, h in enumerate(coefficients)))

FS = 1000                                            # Hz, sampling frequency
for n in [4, 8]:
    h = [1 / n] * n                                  # N-point moving average: every coefficient is 1/N
    row = ", ".join(f"{f} Hz: {fir_gain(h, f, FS):.2f}" for f in [0, 10, 50, 125, 250])
    print(f"{n}-point moving average → {row}")

# Filtering a noisy signal: a 10 Hz sine + a 250 Hz "hum"
signal = [math.sin(2 * math.pi * 10 * n / FS) + 0.5 * math.sin(2 * math.pi * 250 * n / FS) for n in range(40)]
filtered = [sum(signal[n - k] for k in range(4)) / 4 for n in range(3, 40)]
print("\nunfiltered start:", " ".join(f"{x:+.2f}" for x in signal[3:11]))
print("4-point average: ", " ".join(f"{x:+.2f}" for x in filtered[:8]))
```

- Slow signals (0–10 Hz) pass through almost **unchanged**, faster ones are **attenuated** more and more – this is a **low-pass** filter.
- The 4-point average **completely cancels** 250 Hz (0.00): the period of that frequency is exactly 4 samples, and the sum of 4 consecutive samples is always 0. The 8-point one cancels 125 Hz as well.
- In the noisy signal example the 250 Hz hum disappears, and only the 10 Hz sine remains (with a small **delay**: the average "lags behind" the signal, which is the price of every filter).

If a 50 Hz mains hum has to be removed, we choose an N for which the period of 50 Hz is exactly N samples – for example **N = 20** at 1000 Hz sampling. Digital scales, thermometers and many sensors filter the displayed value with exactly this kind of simple averaging.

## 2. Fixed-point arithmetic: how a DSP block calculates

A floating-point multiplier is large and expensive. That's why DSPs and the DSP blocks of FPGAs often work with **fixed-point** numbers. The **Q15** format interprets a 16-bit integer as a fraction between −1 and +1: value = integer / 32,768. The product of two Q15 numbers is Q30, and the products are collected in a **wide accumulator** (multiply-accumulate, _MAC_):

```python run
# Fixed-point multiply-accumulate (MAC) in Q15 format, the way a DSP block calculates
def q15(x):
    return max(-32768, min(32767, round(x * 32768)))  # −1 ≤ x < 1 → 16-bit integer, with saturation

def q15_back(n):
    return n / 32768

samples = [0.5, -0.25, 0.75, 0.125]
coefficients = [0.3, 0.3, 0.2, 0.2]

acc = 0                                              # wide (e.g. 40-bit) accumulator
for x, h in zip(samples, coefficients):
    acc += q15(x) * q15(h)                           # integer multiplication: Q15 · Q15 = Q30
fixed = acc / 2 ** 30
floating = sum(x * h for x, h in zip(samples, coefficients))
print(f"In Q15: 0.5 = {q15(0.5)}, −0.25 = {q15(-0.25)}, 0.3 ≈ {q15(0.3)}")
print(f"fixed-point result {fixed:.6f}, floating-point {floating:.6f}, difference {abs(fixed - floating):.1e}")

# Saturation versus overflow: 0.75 + 0.75 doesn't fit in the −1…1 range
raw = (q15(0.75) + q15(0.75) + 32768) % 65536 - 32768    # 16-bit wrap-around
print(f"0.75 + 0.75 with overflow: {q15_back(raw):+.3f}, with saturation: {q15_back(q15(1.5)):+.3f}")
```

- The fixed-point result differs from the floating-point one only **in the order of 10<sup>−5</sup>** – plenty for audio processing, and the hardware is a fraction of the size.
- 0.75 + 0.75 = 1.5 doesn't fit in the −1 … +1 range. With plain integer overflow the result becomes **−0.5** – in an audio signal that's a huge click! That's why DSPs use **saturating** arithmetic: a value that's too large is set to the largest representable one (≈ +1). That's a distortion too (the signal is "clipped"), but much less noticeable.

A 32-coefficient FIR filter on 48 kHz audio needs 32 MAC operations per sample, that is **1.5 million** MACs per second per channel. An FPGA has hundreds of DSP blocks, each doing one MAC per clock – that's why an FPGA can filter dozens of channels in real time at once.

## 3. ECC memory: why is the word 72 bits?

In topic 2 you saw the Hamming(7,4) code. Server memory uses the same principle for larger words, plus a parity bit (**SECDED**: corrects one error, detects two). How many check bits do m data bits need? The syndrome of the Hamming bits must be able to name **every one** of the m + r bits, plus the "no error" case: **2<sup>r</sup> ≥ m + r + 1**.

```python run
# ECC memory: how many check bits do m data bits need (Hamming + 1 bit for SECDED)?
def check_bits(m):
    r = 0
    while 2 ** r < m + r + 1:                        # the syndrome must name every bit + "no error"
        r += 1
    return r

for m in [4, 8, 32, 64, 128]:
    r = check_bits(m)
    print(f"{m:>3} data bits: {r} Hamming bits + 1 = {r + 1} check bits (SECDED) → "
          f"{m + r + 1}-bit word, overhead {(r + 1) / m:.1%}")
```

64 data bits need 7 Hamming bits + 1 SECDED bit = **8 check bits**, so the word is **72 bits**. That's why an ECC memory module has **9 memory chips** (per rank) instead of 8, and why it costs about 12.5% more. Notice: the longer the word, the smaller the **overhead** – 100% for 4 data bits, only 7% for 128.

Why is this needed? In a large data centre, cosmic radiation and electrical noise flip several bits in memory **every day**. Without ECC these cause silent data corruption or crashes; with ECC the memory controller corrects them on the fly and just logs the event. This is how the codes of digital technology protect your data stored in the cloud.

## Summary

- The moving average is a low-pass FIR filter; an N-point average cancels the frequency whose period is exactly N samples (and its multiples).
- Q15: a 16-bit integer, value = integer / 32,768; a DSP multiplies and accumulates with a wide accumulator, and **saturates** instead of overflowing.
- ECC: 2<sup>r</sup> ≥ m + r + 1 Hamming bits + 1 SECDED bit; 64 data bits → 8 check bits → a 72-bit word.

## Lesson exercise

```quiz required
? The input of a 4-point moving average is 2, 4, 6, 8. What is the output once all four samples have arrived?
= 5
! (2 + 4 + 6 + 8) / 4 = 5.

? At 1000 Hz sampling, how many points must a moving average have to cancel the 50 Hz mains hum exactly?
= 20
! The period of 50 Hz is 20 ms = 20 samples.

? Which 16-bit integer represents 0.5 in Q15 format?
= 16384
! 0.5 · 32,768 = 16,384.

? Why do DSPs use saturating arithmetic?
- because it's faster than addition
+ because on overflow the wrapped-around value (e.g. +1.5 → −0.5) would cause a huge error
- because then no multiplier is needed
- because saturation is more accurate than floating-point calculation
! Saturation distorts too, but much less noticeably.

? How many check bits do 32 data bits need with SECDED ECC (Hamming bits + 1)?
= 7
! 2^6 = 64 ≥ 32 + 6 + 1 = 39, so 6 Hamming bits + 1 = 7.
```
