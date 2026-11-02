---
title: DA Converters and Converter Specifications
summary: Weighted-resistor, R–2R ladder, current-steering, delta–sigma and PWM DA converters; resolution, settling time, INL, DNL, monotonicity, reconstruction filter.
minutes: 30
---

## What you will learn

- how the **weighted-resistor** and **R–2R ladder** DACs work, and their output formula,
- the principle of the **current-steering** and the **delta–sigma** DAC,
- how **PWM** becomes an analog voltage,
- the **quality parameters** of ADCs and DACs: resolution, speed, **INL**, **DNL**, monotonicity.

## The task of the DAC

A DAC produces a **voltage** (or current) **proportional** to an N-bit number D. Each bit contributes to the output **weighted by its place value**: the MSB the most, the LSB the least. Ideally:

**V<sub>out</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>**

The output is a **staircase** signal; a low-pass **reconstruction filter** smooths it into a continuous one.

## Weighted-resistor DAC

Each bit has a resistor whose value is **inversely proportional** to its place value: MSB → R, the next → 2R, then 4R, 8R … A switch connects it to the reference or to ground depending on the bit, and an **op-amp summing amplifier** adds the currents.

- Simple in principle, but for N bits the resistor ratio is **2<sup>N−1</sup>** (4 bits → 1 : 8, 12 bits → 1 : 2048). Making accurate resistors over such a wide range is hard → only for few bits.

## R–2R ladder DAC

Only **two** resistor values (R and 2R) are needed. At every node of the ladder the current **halves**, so each bit automatically contributes to the output with the weight of its place value:

**V<sub>out</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>**

**Example:** 8 bits, V<sub>ref</sub> = 5.12 V, D = 100 → V<sub>out</sub> = 5.12 · 100 / 256 = **2.00 V** (one step is 20 mV).

- Accurate, scales well, easy to make in an **integrated circuit** (the _ratio_ of the resistors matters, not their absolute value) → the most common DAC structure.

## Current-steering DAC

Each bit has a **current source** that delivers a current matching the bit's weight (the MSB the largest); the bits switch whether that current contributes to the output. The sum of the currents can be turned into a voltage across a resistor. Very **fast** – high-speed communication and video DACs work like this.

## Delta–sigma (ΔΣ) DAC

1. An **interpolation filter** raises the sample rate (e.g. 48 kHz → several MHz) by inserting new samples between the existing ones.
2. The **ΔΣ modulator** turns the many-bit signal into a high-speed **1-bit** sequence whose average follows the signal.
3. A **1-bit DAC** (a simple switch) converts it into a voltage.
4. A low-pass **output filter** smooths it.

Almost every **audio DAC** (phone, sound card) is like this: cheap and very linear, because the 1-bit DAC has only two levels.

## PWM as a DAC

A microcontroller's **PWM** output (topic 7) with an **RC low-pass filter** is a simple DAC: the output is a DC voltage proportional to the duty cycle, **V = D · V<sub>supply</sub>** (e.g. 3.3 V, 40 % → **1.32 V**). Cheap, but slow, and some ripple remains.

## Converter specifications

| parameter                            | meaning                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| **resolution**                       | how many bits, i.e. how many discrete levels it distinguishes (2<sup>N</sup>)         |
| **sample rate**                      | how many conversions per second (S/s)                                                 |
| **settling time** (DAC)              | how long after a code change the output settles within ±½ LSB                         |
| **offset error**                     | deviation from zero of the output for code 0                                          |
| **gain error**                       | deviation of the full-scale slope                                                     |
| **DNL** (differential non-linearity) | deviation of **consecutive steps** from the ideal 1 LSB                               |
| **INL** (integral non-linearity)     | the **largest deviation** of the real transfer curve from the ideal line              |
| **monotonicity**                     | for increasing codes the output **never decreases** (DAC); guaranteed if DNL > −1 LSB |
| **missing code** (ADC)               | a code that appears for no input at all (DNL ≤ −1 LSB)                                |

So resolution is not the same as **accuracy**: a 16-bit converter with poor INL can be less accurate than a good 12-bit one.

```python run
# R–2R DAC output and the staircase signal
v_ref, n = 5.12, 8
for d in (0, 1, 100, 128, 255):
    v_out = v_ref * d / 2 ** n
    print(f"D = {d:3d} ({d:08b}) → {v_out:.3f} V")

# Average voltage of PWM + RC filter
for duty in (0.25, 0.40, 0.75):
    print(f"PWM {duty:.0%} → {3.3 * duty:.2f} V")
```

## Summary

- Ideal DAC: V<sub>out</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>; a reconstruction filter smooths the staircase.
- Weighted resistor: R, 2R, 4R … (ratio 2<sup>N−1</sup>); R–2R: only two values, the most common.
- Current-steering: fast; ΔΣ: interpolation + 1-bit DAC + filter, audio; PWM + RC: a cheap DAC.
- Specifications: resolution, speed, settling time, offset, gain error, DNL, INL, monotonicity.

## Lesson exercise

```quiz required
? The reference voltage of an 8-bit R–2R DAC is 5.12 V. What is the output in volts for D = 100?
= 2
= 2.0
= 2,0
! V = V_ref · D / 2^N.

? The smallest resistor of a 4-bit weighted-resistor DAC is R. How many times larger is the largest resistor?
= 8
! R, 2R, 4R, 8R.

? What is the biggest advantage of the R–2R ladder DAC over the weighted-resistor DAC?
- It is faster than any other DAC.
+ Only two resistor values are needed, so it is accurate and easy to manufacture.
- It needs no reference voltage.
- It is 1-bit, so it is very linear.

? A 3.3 V PWM output is smoothed with an RC filter; the duty cycle is 40 %. What is the average output voltage in volts?
= 1.32
= 1,32

? What does it mean that a DAC is monotonic?
+ For increasing input codes the output never decreases.
- Its output is always a perfectly straight line.
- It gives only one output voltage.
- It has no offset error.

? What does DNL (differential non-linearity) describe?
- The largest deviation of the real curve from the ideal line.
+ The deviation of consecutive quantisation steps from the ideal 1 LSB.
- The deviation of the output for code 0.
- The conversion time.
```
