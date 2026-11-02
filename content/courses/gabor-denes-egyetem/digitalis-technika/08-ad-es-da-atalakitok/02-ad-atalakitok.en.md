---
title: AD Converters
summary: The sample-and-hold circuit, how flash (comparator), successive-approximation (SAR), integrating (dual-slope) and delta–sigma AD converters work, and how they compare.
minutes: 35
---

## What you will learn

- what the **sample-and-hold** circuit is for,
- how the **flash** (parallel, comparator) ADC works,
- the halving search of the **successive-approximation** (SAR) ADC,
- the principle of the **integrating** (dual-slope) and the **delta–sigma** (ΔΣ) ADC,
- which type is used for what.

## Sample and hold

Conversion takes time, and the input must not change meanwhile. The **sample-and-hold** is a switch and a capacitor: in the “sample” phase the capacitor follows the input, in the “hold” phase the switch opens and the capacitor **keeps the voltage** until the conversion ends.

## Flash (parallel) ADC

A resistor-divider ladder produces **2<sup>N</sup> − 1** reference voltages, each with its own **comparator**. Every comparator whose reference is below the input outputs 1 – the result is a “thermometer code” (e.g. 0000111), from which a **priority encoder** (topic 4) makes a binary number.

- The **fastest** type: done in a single step (one clock) – GS/s speeds, **video**, oscilloscopes, radar.
- **Drawback:** the number of comparators grows exponentially (8 bits → **255**, 10 bits → 1023 comparators): large chip area, power and input capacitance; out-of-order “bubble” codes can cause errors.

## Successive-approximation (SAR) ADC

A **comparator**, a **DAC** and a **SAR register** (successive approximation register) determine the code by a **halving (binary) search** – bit by bit, starting from the top bit:

1. Set the top bit to 1 (half the range); the DAC converts it into a voltage.
2. The comparator compares it with the input: if the input is **greater or equal**, the bit **stays 1**, otherwise it becomes **0**.
3. The same with the next bit – the search range **halves** at every step.

N bits → **N steps** (N clocks).

**Example** (4 bits, DAC step 1 V, V<sub>in</sub> = 11.3 V):

| step  | trial | DAC   | V<sub>in</sub> ≥ DAC? | result   |
| ----- | ----- | ----- | --------------------- | -------- |
| 1     | 1000  | 8 V   | yes                   | 1xxx     |
| 2     | 1100  | 12 V  | no                    | 10xx     |
| 3     | 1010  | 10 V  | yes                   | 101x     |
| 4     | 1011  | 11 V  | yes                   | **1011** |

- **Medium speed** (kHz–MS/s), **8–18 bits**, low power → the built-in ADC of **microcontrollers** is almost always a SAR.

## Integrating (dual-slope) ADC

It converts the input into a **time interval**, measured by a counter:

1. **Integration:** an integrator integrates the input voltage for a **fixed time** (T<sub>1</sub>) – the output rises with a slope proportional to the input.
2. **De-integration:** the input is replaced by a known **U<sub>ref</sub>** of opposite polarity; the integrator output returns to zero with a **constant slope**.
3. **Time measurement:** the de-integration time T<sub>2</sub> is proportional to the input: **V<sub>in</sub> = U<sub>ref</sub> · T<sub>2</sub> / T<sub>1</sub>**. A counter measures it with the clock.

- **Very accurate**, the values of R and C drop out of the formula; if T<sub>1</sub> is an integer multiple of the mains period (20 ms), **50 Hz interference** integrates out.
- **Slow** (a few to a few tens of readings/s) → **digital multimeters** (e.g. ICL7106/7107 – for 3½-digit displays).

## Delta–sigma (ΔΣ) ADC

The **modulator** compares the input at a very high rate (**oversampling**) with the fed-back signal of a 1-bit DAC, integrates (**sigma**) the difference (**delta**), and outputs a **1-bit bit stream**. The proportion of 1s in the stream is proportional to the input. A **digital filter** (decimation filter) turns this into a slower but **many-bit** (up to **24-bit**) value.

- The modulator “pushes” the quantisation noise towards high frequencies (**noise shaping**), where the digital filter cuts it off.
- **High resolution**, excellent noise rejection, but medium speed and latency → **audio**, precision measurement (scales, thermometers).

## Comparison

| type         | speed             | resolution    | typical use                             |
| ------------ | ----------------- | ------------- | --------------------------------------- |
| **flash**    | fastest (GS/s)    | 6–8 bits      | video, oscilloscope, radar              |
| **SAR**      | medium (MS/s)     | 8–18 bits     | microcontrollers, data acquisition      |
| **ΔΣ**       | low–medium        | 16–24 bits    | audio, precision measurement            |
| **dual-slope** | slow (Hz)       | 12–20 bits    | multimeter, panel meter                 |

```python run
# Simulating a successive-approximation ADC: halving search bit by bit
def sar_adc(v_in, v_ref, n):
    code = 0
    for bit in range(n - 1, -1, -1):          # from the top bit downwards
        trial = code | (1 << bit)             # set the bit under test to 1
        dac = trial * v_ref / 2 ** n          # output of the internal DAC
        keep = v_in >= dac
        print(f"trial {trial:0{n}b} → DAC {dac:5.2f} V  {'keep' if keep else 'drop'}")
        if keep:
            code = trial
    return code

code = sar_adc(11.3, 16.0, 4)
print("result:", f"{code:04b}")
```

## Summary

- The sample-and-hold freezes the input for the duration of the conversion.
- Flash: 2<sup>N</sup> − 1 comparators, one step, fastest, expensive.
- SAR: comparator + DAC + halving search, N steps; microcontrollers.
- Dual-slope: measures time, accurate, rejects 50 Hz, slow; ΔΣ: oversampling + digital filter, 24 bits.

## Lesson exercise

```quiz required
? How many comparators does an 8-bit flash ADC need?
= 255
! 2^N − 1.

? In how many steps (clocks) does a 12-bit successive-approximation ADC finish?
= 12

? The internal DAC of a 4-bit SAR ADC has a step of 1 V (so code = volts). The input is 6.7 V. What is the result in binary?
= 0110
! 1000 (8 V) → drop; 0100 (4 V) → keep; 0110 (6 V) → keep; 0111 (7 V) → drop.

? Which ADC type is the fastest?
+ flash
- successive approximation
- dual-slope
- delta–sigma

? Which ADC type is used in digital multimeters for its accuracy and 50 Hz rejection?
- flash
- successive approximation
+ integrating (dual-slope)
- R–2R

? What is the sample-and-hold circuit for?
- Generating the clock.
+ It holds the input voltage constant for the duration of the conversion.
- Storing the output code.
- Stabilising the supply voltage.
```
