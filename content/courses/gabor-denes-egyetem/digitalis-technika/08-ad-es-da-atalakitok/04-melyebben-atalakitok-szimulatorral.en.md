---
title: Deeper – AD and DA Converters with a Simulator
summary: Aliasing in numbers (why a 7 kHz signal looks like 1 kHz when sampled at 8 kHz), a successive approximation AD converter bit by bit, quantisation noise simulated and compared with the 6.02·N + 1.76 dB formula, and a delta–sigma modulator that produces an analogue value from a single bit.
minutes: 40
---

## What you will learn in this lesson

- to see **sample by sample** how a signal that's too fast "disguises" itself as a slow one (aliasing), and calculate the apparent frequency,
- to follow the binary search of a **SAR** AD converter bit by bit,
- to check **by simulation** that every extra bit improves the signal-to-noise ratio by about 6 dB,
- to understand how a **delta–sigma** modulator gives an accurate average from a single bit.

## 1. Aliasing sample by sample

According to the Nyquist–Shannon theorem, the sampling frequency must be **more than twice** the highest frequency of the signal. What happens if we break this rule? Let's sample a 7 kHz sine at 8 kHz and compare it with a 1 kHz (phase-inverted) sine:

```python run
# Aliasing: a 7 kHz and a 1 kHz sine sampled at 8 kHz
import math

FS = 8000                                            # Hz, sampling frequency
def sample(f, n):
    return math.sin(2 * math.pi * f * n / FS)

print(" n |  7 kHz sample | −1 kHz sample")
for n in range(8):
    print(f"{n:>2} | {sample(7000, n):>12.3f} | {sample(-1000, n):>12.3f}")

def apparent(f, fs):
    # the frequency "seen" in the samples: the distance from the nearest multiple of fs
    return abs(f - fs * round(f / fs))

for f in [1000, 3000, 5000, 7000, 9000]:
    print(f"{f:>5} Hz signal sampled at {FS} Hz → looks like {apparent(f, FS):>5} Hz")
```

The two columns **match sample by sample**! So from the samples it's impossible to tell whether we measured a 7 kHz or a 1 kHz signal – the reconstruction will give back 1 kHz. This is **aliasing**: a signal above the Nyquist frequency (here 4 kHz) "folds back" below it. Rule: apparent frequency = |f − k · f<sub>s</sub>|, where k · f<sub>s</sub> is the multiple of the sampling frequency nearest to the signal.

It's the same phenomenon as a wagon wheel **turning backwards** in a film: the camera's frames (the sampling) are too sparse compared with the movement of the spokes. That's why every AD converter has an **anti-aliasing filter** (a low-pass filter) in front of it, which cuts off the components above the Nyquist frequency **before** sampling – afterwards they can no longer be separated.

## 2. The SAR converter bit by bit

The successive approximation (SAR) converter works with a **binary search**, like the "I'm thinking of a number" game: starting from the MSB it sets each bit to 1 as a trial, produces the trial voltage with its internal DA converter, and decides with a comparator whether to keep it.

```python run
# Successive approximation (SAR) AD converter: binary search bit by bit
U_REF = 5.0
BITS = 8
U_IN = 3.21                                          # V, the voltage to be measured

code = 0
for i in reversed(range(BITS)):                      # from the MSB towards the LSB
    trial = code | (1 << i)                          # set the bit to 1 as a trial
    u_dac = trial * U_REF / 2 ** BITS                # the voltage of the internal DA converter
    keep = U_IN >= u_dac                             # comparator: is the trial small enough?
    if keep:
        code = trial
    print(f"bit {i}: trial {trial:08b} = {u_dac:.4f} V → {'keep' if keep else 'clear'}")

print(f"result: {code:08b} = {code} → {code * U_REF / 2 ** BITS:.4f} V "
      f"(LSB = {U_REF / 2 ** BITS * 1000:.1f} mV)")
```

8 bits need exactly **8 steps** (n bits need n), regardless of the input. The result is 3.2031 V, and the error is less than one LSB (19.5 mV) – you can't be more accurate on 8 bits. That's why SAR is the typical ADC of microcontrollers: moderately fast (a few MS/s), accurate, and low-power. A flash converter, by contrast, decides **in one step**, but 8 bits need 2<sup>8</sup> − 1 = 255 comparators.

## 3. Every bit is 6 dB – by simulation

Quantisation rounds, and the rounding error behaves like noise. For a full-scale sine the approximate formula of the signal-to-noise ratio is **SNR ≈ 6.02 · N + 1.76 dB**. Let's check it: quantise a sine on N bits, and measure the power of the error relative to the signal!

```python run
# Quantisation noise: simulated signal-to-noise ratio versus the 6.02·N + 1.76 dB formula
import math

def snr_db(bits, samples=10000):
    levels = 2 ** bits
    sig_e = noise_e = 0.0
    for n in range(samples):
        x = math.sin(2 * math.pi * n * 0.01234)              # full-scale sine (−1…1)
        q = round((x + 1) / 2 * (levels - 1)) / (levels - 1) * 2 - 1   # quantisation
        sig_e += x * x
        noise_e += (x - q) ** 2                              # the rounding error = noise
    return 10 * math.log10(sig_e / noise_e)

for n in [4, 8, 12, 16]:
    print(f"{n:>2} bits: simulated SNR ≈ {snr_db(n):5.1f} dB, formula: {6.02 * n + 1.76:5.1f} dB")
```

The simulation matches the formula to a tenth of a dB. What it means in practice:

- **8 bits** (~50 dB): a simple sensor, telephone audio in the old days,
- **16 bits** (~98 dB): CD-quality audio – the difference between the quiet and loud parts is bigger than between a quiet room and a rock concert,
- **24 bits** (~146 dB in theory): studio – here the noise of the analogue circuits is the limit, not the bit count.

Every extra bit **doubles** the number of levels, and that's a **6 dB** improvement (20 · lg 2 ≈ 6.02).

## 4. Delta–sigma: one bit, but very fast

The delta–sigma converter follows the opposite strategy: it uses a **single-bit** quantiser, but samples much faster than necessary (oversampling), and continuously **feeds back** the error. The **average** of the output bit stream gives the measured value:

```python run
# First-order delta–sigma modulator: an "analogue" value from a single bit
def delta_sigma(x, n=40):
    integrator, output = 0.0, []
    for _ in range(n):
        bit = 1 if integrator >= 0 else 0            # 1-bit quantiser (comparator)
        integrator += x - bit                        # accumulate the error and feed it back
        output.append(bit)
    return output

for x in [0.25, 0.5, 0.8]:
    bits = delta_sigma(x)
    print(f"input {x:.2f}: {''.join(map(str, bits))}  → average {sum(bits) / len(bits):.3f}")
```

With an input of 0.25 every fourth bit is 1, with 0.8 four out of five – the average is **exactly** the input. If a digital filter averages (and decimates) this bit stream, we get a high-resolution number. That's why delta–sigma is the converter of most **sound cards** and precision instruments: a simple analogue part (a comparator and an integrator), with the accuracy provided by digital processing. Notice the kinship with PWM (topic 1): there too, the average of 0s and 1s gives an analogue value.

## Summary

- Aliasing: a signal above the Nyquist frequency **folds back**; apparent frequency = |f − k · f<sub>s</sub>|. Only a filter **before** sampling protects against it.
- SAR: binary search, n steps for n bits; flash takes one step, but needs 2<sup>n</sup> − 1 comparators.
- SNR ≈ 6.02 · N + 1.76 dB: every bit is about **6 dB**.
- Delta–sigma: 1-bit quantiser + oversampling + feedback; the average of the bit stream is the measured value.

## Lesson exercise

```quiz required
? A 9 kHz sine is sampled at 8 kHz. What frequency does it appear to have in the samples (Hz)?
= 1000
! |9000 − 1 · 8000| = 1000 Hz.

? In how many steps (comparator decisions) does a 12-bit SAR converter finish?
= 12
! n steps for n bits, from the MSB to the LSB.

? Roughly what is the signal-to-noise ratio of an ideal 12-bit converter (dB, rounded to a whole number)?
= 74
! 6.02 · 12 + 1.76 ≈ 74 dB.

? What happens to the quantisation signal-to-noise ratio if the bit count is increased by one?
- it doubles
+ it improves by about 6 dB
- it gets worse by about 3 dB
- it doesn't change
! The number of levels doubles: 20 · lg 2 ≈ 6 dB.

? The output of a delta–sigma modulator is 1011 1011 1011 1011 (16 bits). What is the input (in the 0…1 range, as a decimal)?
= 0.75
= 0,75
! 12 ones out of 16 bits: 12 / 16 = 0.75.
```
