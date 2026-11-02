---
title: Sampling and Quantisation
summary: The two steps of digitising an analog signal, the Nyquist–Shannon theorem and aliasing, resolution, LSB and MSB, computing the digital value, quantisation error and signal-to-noise ratio.
minutes: 30
---

## What you will learn

- the two steps of digitisation: **sampling** (in time) and **quantisation** (in amplitude),
- the **Nyquist–Shannon theorem** and the phenomenon of **aliasing**,
- what the **resolution**, the **LSB** and the **MSB** of a converter are,
- how to compute the **digital code** of a voltage,
- what **quantisation error** is and how it depends on the number of bits.

## The ADC and the DAC

The signals of the world (sound, temperature, light, pressure) are **analog**, but processing is digital. Two converters stand between them:

- **ADC** (analog-to-digital converter): analog signal → digital number,
- **DAC** (digital-to-analog converter): digital number → analog signal.

The analog → digital path consists of two steps.

## 1. Sampling – in time

We take samples of the continuous signal at **equal intervals** (T<sub>s</sub>); the sampling frequency is **f<sub>s</sub> = 1 / T<sub>s</sub>**. The resulting signal is **discrete in time**, but its value can still be anything.

### Nyquist–Shannon theorem

A signal can be **reconstructed perfectly** from its samples if the sampling frequency is **greater than twice the highest frequency in the signal**:

**f<sub>s</sub> > 2 · f<sub>max</sub>**

f<sub>s</sub>/2 is the **Nyquist frequency**. Example: human hearing extends to about 20 kHz → at least **40 kHz** sampling is needed; that is why the CD samples at **44.1 kHz**.

### Aliasing

If the signal contains a frequency above f<sub>s</sub>/2, it appears in the samples as a **false, lower frequency** – this is **aliasing**. (The same effect makes a wheel seem to turn backwards on film.) Protection: a **low-pass filter** (anti-aliasing filter) before the ADC cuts off components above f<sub>s</sub>/2.

## 2. Quantisation – in amplitude

The sample is rounded to one of a **finite number of levels**. An **N-bit** converter distinguishes **2<sup>N</sup>** levels (8 bits → 256 levels, 0…255).

**Example:** input range 0–5 V, resolution 8 bits.

**LSB** (least significant bit, the voltage of the smallest step):

**LSB = (V<sub>max</sub> − V<sub>min</sub>) / (2<sup>N</sup> − 1) = 5 V / 255 ≈ 19.6 mV**

**MSB** (the weight of the top bit, 128 for 8 bits): MSB = 128 · LSB ≈ **2.51 V**

> The definition LSB = V<sub>ref</sub> / 2<sup>N</sup> is also common in the literature (5 V / 256 = 19.5 mV). The difference comes from how the end point of the full scale is interpreted; always check which one the datasheet or the exercise uses. In this topic we use the (2<sup>N</sup> − 1) form for the ADC and the 2<sup>N</sup> form for the R–2R DAC.

### Computing the digital value

**D = (V<sub>in</sub> / V<sub>ref</sub>) · (2<sup>N</sup> − 1)**, truncated to an integer.

V<sub>in</sub> = 2.3 V, V<sub>ref</sub> = 5 V, N = 8: D = 2.3 / 5 · 255 = 117.3 → **117** → in binary **0111 0101**.

The decimals are lost – this is the **quantisation error**.

### Back to analog

Converting code 117 back with a DAC: V = 117 · 19.6 mV ≈ **2.294 V** – about 6 mV less than the original 2.3 V.

## Quantisation error and signal-to-noise ratio

- With rounding the error is at most **±½ LSB**, with truncation 0…1 LSB.
- The error behaves like added noise (**quantisation noise**).
- The **signal-to-noise ratio** (SNR) of an ideal N-bit converter for a sine wave: **SNR ≈ 6.02 · N + 1.76 dB**. Every extra bit improves it by about **6 dB**. (16 bits → ≈ 98 dB, 24 bits → ≈ 146 dB.)

**Dithering:** interestingly, a small, deliberately added noise can **improve** the result: instead of coarse steps the error is “smoothed” into even, less disturbing noise (in audio when converting 24 → 16 bits, in images against colour banding).

```python run
# 8-bit ADC: digital code, binary form and back-conversion
v_ref, n = 5.0, 8
lsb = v_ref / (2 ** n - 1)
print(f"LSB = {lsb * 1000:.1f} mV, MSB = {128 * lsb:.2f} V")

for v_in in (0.0, 1.0, 2.3, 4.99):
    d = int(v_in / v_ref * (2 ** n - 1))       # truncation to an integer
    back = d * lsb
    print(f"{v_in:5.2f} V → D = {d:3d} = {d:08b} → back {back:.3f} V")
```

## Summary

- Digitisation: sampling (in time) + quantisation (in amplitude) + coding.
- Nyquist: f<sub>s</sub> > 2 f<sub>max</sub>; otherwise aliasing → anti-aliasing filter.
- N bits → 2<sup>N</sup> levels; LSB = range / (2<sup>N</sup> − 1); D = V<sub>in</sub> / V<sub>ref</sub> · (2<sup>N</sup> − 1).
- Quantisation error ≈ ½ LSB; SNR ≈ 6.02 N + 1.76 dB.

## Lesson exercise

```quiz required
? How many quantisation levels does an 8-bit ADC distinguish?
= 256

? What is the LSB of an 8-bit ADC with a 0–5 V range (5 V / 255), in millivolts, to one decimal place?
= 19.6
= 19,6

? What digital value (in decimal) does an 8-bit ADC with a 5 V reference give for a 2.3 V input (with truncation)?
= 117
! D = 2.3 / 5 · 255 = 117.3.

? Write 117 as an 8-bit binary number!
= 01110101

? At least what sampling frequency in kHz is needed for an audio signal extending to 20 kHz?
= 40
! Nyquist: f_s > 2 · f_max.

? What is aliasing?
- The rounding error between quantisation levels.
+ A component above the Nyquist frequency appears in the samples as a false, lower frequency.
- Overloading the ADC.
- Delay of the digital signal.

? Approximately how many dB is the signal-to-noise ratio of an ideal 16-bit converter (6.02 · N + 1.76)? Round to an integer!
= 98
```
