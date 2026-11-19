---
title: Practice – AD and DA Converters
summary: Review questions and a summary worksheet: sampling, the Nyquist theorem, quantisation, LSB, ADC and DAC types, specifications.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **The code of an AD converter.** Write the `adc_code(u, u_ref, bits)` function, which returns the output code of an ideal AD converter: `⌊u / u_ref · 2^bits⌋`, clipped to the range 0 … 2^bits − 1 (an input that's too large gives the largest code)!

```python starter
def adc_code(u, u_ref, bits):
    return int(u / u_ref * 2 ** bits)
```

<details>
<summary>Solution</summary>

```python solution
def adc_code(u, u_ref, bits):
    code = int(u / u_ref * 2 ** bits)          # round down: which step we're on
    return min(max(code, 0), 2 ** bits - 1)    # saturation at the edges of the range
```

</details>

```python test
assert adc_code(3.21, 5.0, 8) == 164
assert adc_code(2.5, 5.0, 10) == 512
assert adc_code(5.0, 5.0, 8) == 255          # the reference itself doesn't fit: largest code
assert adc_code(-0.2, 5.0, 8) == 0
print("All checks passed!")
```

**2.** **Apparent frequency.** Write the `alias(f, fs)` function, which returns what frequency (Hz) a sine of frequency f appears to have after sampling at fs (the result lies between 0 and fs/2)!

```python starter
def alias(f, fs):
    return f
```

<details>
<summary>Solution</summary>

```python solution
def alias(f, fs):
    f = f % fs                     # for sampling, f and f ± k·fs look the same
    return min(f, fs - f)          # the part above the Nyquist frequency folds back
```

</details>

```python test
assert alias(1000, 8000) == 1000
assert alias(7000, 8000) == 1000
assert alias(9000, 8000) == 1000
assert alias(5000, 8000) == 3000
assert alias(44100, 44100) == 0
print("All checks passed!")
```

**3.** **R–2R DA converter.** Write the `dac(bits, u_ref)` function, where `bits` is a bit list **starting with the MSB**! The output: every 1 bit adds a voltage proportional to its weight (MSB: u_ref/2, the next u_ref/4, …). Round the result to 4 decimals.

```python starter
def dac(bits, u_ref):
    return 0.0
```

<details>
<summary>Solution</summary>

The third test is the SAR result familiar from the previous lesson: the code 10100100 converted back is 3.2031 V – within one LSB of the 3.21 V input.

```python solution
def dac(bits, u_ref):
    u = 0.0
    for i, b in enumerate(bits):
        u += b * u_ref / 2 ** (i + 1)      # the MSB's weight is 1/2, the next 1/4, …
    return round(u, 4)
```

</details>

```python test
assert dac([1, 0, 0, 0], 5.0) == 2.5
assert dac([1, 1, 1, 1], 5.0) == 4.6875      # 15/16 · 5 V: it never reaches the reference
assert dac([1, 0, 1, 0, 0, 1, 0, 0], 5.0) == 3.2031
print("All checks passed!")
```

### Quick check questions

```quiz
? At least what sampling frequency does an audio signal up to 20 kHz need (kHz)?
= 40
! The Nyquist condition: more than twice – that's why CDs use 44.1 kHz.

? What is the LSB of a 10-bit AD converter with a 3.3 V reference (mV, one decimal)?
= 3.2
= 3,2
! 3300 mV / 1024 ≈ 3.2 mV.

? Which AD converter is the fastest, but needs 255 comparators for 8 bits?
+ flash (parallel)
- successive approximation (SAR)
- dual-slope
- delta–sigma
! It decides in one step, but the number of comparators is 2^n − 1.

? What is the anti-aliasing filter for?
- reducing quantisation noise
+ cutting off the components above the Nyquist frequency before sampling
- smoothing the output signal after the DA converter
! After sampling, the folded-back components can no longer be separated.

? What does it mean that a DA converter is monotonic?
+ it never gives a lower output voltage for a larger code
- it gives exactly the ideal voltage for every code
- it can produce only one voltage level
! A non-monotonic DAC can cause instability in a control loop.
```
