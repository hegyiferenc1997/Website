---
title: Digital Signal Processing
summary: The signal-processing chain, signal-to-noise ratio in decibels, the colours of noise and its useful role (dithering, masking, stochastic resonance), digital filters (moving average, FIR), DSP hardware: multiply-accumulate unit, DSP blocks in the FPGA.
minutes: 40
---

## What you will learn

- how a **digital signal-processing chain** is built,
- how to compute the **signal-to-noise ratio** in decibels,
- what the **colours of noise** are, and when noise is **useful** (**dithering**),
- how a simple **digital filter** works (moving average, FIR),
- what hardware does signal processing (**MAC**, **DSP block**).

## The signal-processing chain

**Digital signal processing** (DSP) turns the analogue signals of the real world (sound, image, radio signal, sensor signal) into numbers, processes them with computations, then converts them back if needed:

```text
sensor → amplifier → low-pass filter → ADC → digital processing → DAC → smoothing filter → speaker
(microphone)        (anti-aliasing)         (filtering, compression,      (reconstruction)
                                             recognition)
```

You learnt about the ADC and DAC, sampling and quantisation in topic 8. The advantage of digital processing is that it is **exactly repeatable**, does not age, does not depend on temperature, and the processing can be **changed** by software or reprogramming.

## Signal-to-noise ratio in decibels

**Noise** is any unwanted signal superimposed on the useful signal (topic 1). Signal quality is measured by the **signal-to-noise ratio** (SNR), in **decibels**:

**SNR<sub>dB</sub> = 10 · log<sub>10</sub>(P<sub>signal</sub> / P<sub>noise</sub>)**

If you know **voltages** (amplitudes) instead of powers – power is proportional to the square of the voltage –:

**SNR<sub>dB</sub> = 20 · log<sub>10</sub>(U<sub>signal</sub> / U<sub>noise</sub>)**

| power ratio | SNR   |
| ----------- | ----- |
| 10          | 10 dB |
| 100         | 20 dB |
| 1000        | 30 dB |
| 1,000,000   | 60 dB |

In voltage, a 10-fold ratio is 20 dB. The SNR of an ideal N-bit ADC due to quantisation noise is ≈ 6.02·N + 1.76 dB (topic 8): the 16 bits of a CD give ≈ 98 dB.

## The colours of noise

Noises are characterised by “colours” according to their frequency distribution:

- **white noise:** contains every frequency with **equal** intensity – it fills the whole frequency band evenly. It is used as a reference signal in measurements (examining the frequency response of systems), for testing filters and algorithms (it models random disturbances well), and for masking (it covers distracting sounds).
- **pink noise:** lower sounds are stronger (power is inversely proportional to frequency, equal energy per octave) – more “balanced” to the human ear. It is used for acoustic measurement of concert halls and studios, in sleep machines and in treating tinnitus.

## When noise is useful

We usually consider noise a disturbance, but in certain situations artificially added noise **improves** quality:

- **Dithering in images:** when an image has to be displayed with fewer colours, ugly stepped **bands** (banding) appear in smooth transitions. Adding fine noise “scatters” the quantisation error, the bands disappear, and the eye sees a smooth transition.
- **Dithering in audio:** when a 24-bit studio recording is converted to 16 bits (CD), in quiet passages the quantisation error causes audible **distortion** correlated with the signal. Adding a quiet, barely audible noise floor turns the distortion into an even, less disturbing noise.
- **Texture:** completely noise-free digital images look “plastic”; a little grain makes them more realistic.
- **Stochastic resonance:** a very weak signal below the threshold becomes measurable by adding noise – the noise occasionally pushes it over the threshold, in step with the signal. It is being researched in medical applications.

The essence of dithering in the language of digital technology: it turns the **deterministic** error of quantisation (which causes patterns, bands, distortion) into **random**, even noise, which is much less noticeable.

## Digital filters

The simplest digital filter is the **moving average**: every output sample is the average of the last few input samples. For four samples:

**y[n] = (x[n] + x[n−1] + x[n−2] + x[n−3]) / 4**

This is a **low-pass** filter: it smooths out fast fluctuations (noise) and passes slow changes. E.g. the average of the samples 4, 8, 6, 2 is 5.

In general the **FIR** (finite impulse response) filter is a **weighted** sum of the input samples:

**y[n] = h<sub>0</sub>·x[n] + h<sub>1</sub>·x[n−1] + … + h<sub>k−1</sub>·x[n−k+1]**

The h coefficients determine what kind of filter it is (low-, high-, band-pass). A FIR filter with k coefficients (k “taps”) performs **k multiplications and additions per sample** – in hardware the samples move along a **shift register** (topic 5).

## DSP hardware

The basic operation of signal processing is **multiplication and addition** (MAC – multiply-accumulate): acc ← acc + h·x.

- **DSP processors:** perform one (or more) MAC operations per clock, with special addressing (circular buffer).
- **FPGA DSP blocks:** an FPGA has built-in, fast multiply-accumulate units (topic 9), even thousands of them. Since they work in parallel, an FPGA can perform hundreds of MAC operations in one clock – that is why it is popular in radio, image-processing and measurement equipment.
- **Fixed-point representation:** hardware DSP often works not with floating-point but with fixed-point numbers (the position of the binary point is fixed) – smaller and faster hardware, but overflow and rounding must be watched.

```python run
# Moving-average filter on a noisy signal, and computing the SNR
import math, random

random.seed(1)
signal = [math.sin(2 * math.pi * n / 40) for n in range(200)]   # clean sine wave
noisy = [s + random.gauss(0, 0.3) for s in signal]              # added noise

def moving_average(x, k=4):
    return [sum(x[max(0, n - k + 1): n + 1]) / min(k, n + 1) for n in range(len(x))]

def snr_db(clean, measured):
    p_signal = sum(s * s for s in clean)
    p_noise = sum((m - s) ** 2 for s, m in zip(clean, measured))
    return 10 * math.log10(p_signal / p_noise)

filtered = moving_average(noisy, 4)
print(f"SNR before filtering: {snr_db(signal, noisy):.1f} dB")
print(f"SNR after filtering:  {snr_db(signal, filtered):.1f} dB")
print("average of the samples 4, 8, 6, 2:", (4 + 8 + 6 + 2) / 4)
print("10 log10(1000) =", 10 * math.log10(1000), "dB")
```

## Summary

- Chain: sensor → anti-aliasing filter → ADC → digital processing → DAC → reconstruction.
- SNR = 10·lg(P<sub>signal</sub>/P<sub>noise</sub>) = 20·lg(U<sub>signal</sub>/U<sub>noise</sub>) dB.
- White noise: every frequency equally; pink: lower sounds stronger. Dithering: turns the quantisation error into even noise (against banding, distortion).
- Moving average and FIR filter: weighted sum, k taps → k MACs per sample; hardware: DSP processor, FPGA DSP blocks, fixed-point numbers.

## Lesson exercise

```quiz required
? The power of the useful signal is 1000 times that of the noise. What is the signal-to-noise ratio in dB?
= 30
! 10 · lg 1000.

? The amplitude (voltage) of the signal is 10 times that of the noise. What is the signal-to-noise ratio in dB?
= 20
! For a voltage ratio, 20 · lg.

? At the input of a four-sample moving-average filter the last four samples are 4, 8, 6, 2. What is the output?
= 5

? How many multiplications per sample does a FIR filter with 8 coefficients (8 taps) perform?
= 8

? What is dithering good for when an image is displayed with fewer colours?
- It increases the resolution of the image.
+ It scatters the quantisation error with fine noise, so we see a smooth transition instead of stepped bands.
- It compresses the image.
- It removes all noise from the image.

? Which noise contains every frequency with equal intensity?
+ white noise
- pink noise
- quantisation noise
- none of them

? Which operation are DSP processors and the DSP blocks of FPGAs optimised for?
- division
+ multiplication and addition (MAC)
- string comparison
- floating-point square root
```
