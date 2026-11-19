---
title: Practice – AD and DA Converters
summary: Review questions and a summary worksheet: sampling, the Nyquist theorem, quantisation, LSB, ADC and DAC types, specifications.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Why is a low-pass filter needed before the ADC?</summary>

Because components above the Nyquist frequency (f<sub>s</sub>/2) would appear after sampling as false, lower frequencies (aliasing), and afterwards they could no longer be distinguished from the real signal. The anti-aliasing filter cuts them off before conversion.

</details>

<details>
<summary>2. What do we gain with one more bit of ADC resolution?</summary>

The number of levels doubles, the LSB (and the quantisation error) halves, and the signal-to-noise ratio improves by about 6 dB.

</details>

<details>
<summary>3. Why is almost every microcontroller ADC of the SAR type?</summary>

Because it is a good compromise: N bits need only one comparator, one DAC and one register (small, low power), yet it is fast enough (N clocks) and accurate enough (10–12 bits) for most sensor measurements.

</details>

<details>
<summary>4. Why do the values of R and C drop out of the dual-slope ADC's result?</summary>

Because the same integrator (the same RC) performs both the up- and the down-integration; the result depends on the ratio of the two times: V<sub>in</sub> = U<sub>ref</sub> · T<sub>2</sub> / T<sub>1</sub>. RC appears as the same factor in both slopes, so it cancels.

</details>

<details>
<summary>5. Are resolution and accuracy the same?</summary>

No. Resolution tells how many levels the converter distinguishes; accuracy is determined by offset, gain and non-linearity errors (INL, DNL). A high-resolution but non-linear converter can be inaccurate.

</details>

## Summary worksheet

```quiz required
? How many quantisation levels does a 10-bit ADC have?
= 1024

? A 10-bit ADC with a 3.3 V reference measures a 1.65 V input. What is the digital value (D = V_in / V_ref · (2^N − 1), with truncation)?
= 511
! 1.65 / 3.3 · 1023 = 511.5.

? Telephone speech transmission carries a signal up to about 4 kHz. At least what sampling rate in kHz is needed?
= 8

? The internal DAC of a 4-bit SAR ADC has a step of 1 V. The input is 9.6 V. What is the result in binary?
= 1001
! 8 → keep, 12 → drop, 10 → drop, 9 → keep.

? How many comparators does a 6-bit flash ADC need?
= 63

? The reference voltage of a 10-bit R–2R DAC is 10.24 V. What is the output in volts for D = 512?
= 5.12
= 5,12

? Which type is typical of audio AD and DA converters?
- flash
- weighted resistor
+ delta–sigma
- dual-slope

? Approximately how many dB is the signal-to-noise ratio of an ideal 12-bit converter (6.02 · N + 1.76)? Rounded to an integer!
= 74
```
