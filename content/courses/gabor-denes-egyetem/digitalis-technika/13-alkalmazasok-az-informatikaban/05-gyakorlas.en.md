---
title: Practice – Digital Technology in Computing
summary: Review questions and a summary worksheet: signal-to-noise ratio, dithering, digital filters, DSP hardware, ECC, accelerators, the design decisions of the stopwatch project – and a few course-wide review questions.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why can dithering be called “useful noise”?</summary>

Because without dithering the quantisation error is correlated with the signal and appears as a regular pattern: as bands in an image, as distortion in audio – which people notice easily. The small added noise turns this error into random, even noise that is much less noticeable, so the overall impression improves even though the signal is “noisier”.

</details>

<details>
<summary>2. Why is the FPGA suitable for signal processing?</summary>

Because its many built-in DSP blocks (multiply-accumulate units) work in parallel, so it can perform all the multiplications of a FIR filter in a single clock, while the samples move along a shift register. A processor would do the same sequentially, instruction by instruction. Moreover, the processing can be changed by reprogramming.

</details>

<details>
<summary>3. What is the difference between the roles of an error-detecting (CRC) and an error-correcting (ECC) code?</summary>

CRC only notices that an error has occurred (e.g. in a network frame), and the frame must be resent. ECC (e.g. a Hamming code in memory) also determines the location of the error and corrects it – where there is no way to resend, e.g. on a memory read.

</details>

<details>
<summary>4. Which topics does the stopwatch project use?</summary>

Codes (BCD, seven-segment code), combinational networks (multiplexer, decoder, code converter), synchronous counters and registers, a state machine, a hardware description language (Verilog), FPGA and pin assignment, timing and synchronous design (enable signal, synchroniser), simulation with a testbench, debugging – that is, almost the whole course.

</details>

<details>
<summary>5. Why is almost every modern computing system digital?</summary>

Because the digital signal is noise-tolerant: as long as the noise stays below the threshold, the information can be restored without error, and it can be protected further with error-correcting codes. Digital circuits can be manufactured cheaply in CMOS technology, with low power and billions of transistors; their operation is exactly repeatable, and it can be changed by programming or reconfiguration.

</details>

## Summary worksheet

```quiz required
? The signal power is 100 times that of the noise. What is the SNR in dB?
= 20

? At the input of a two-sample moving-average filter the last two samples are 7 and 3. What is the output?
= 5

? How many check bits does a single-error-correcting Hamming code need for 8 data bits?
= 4
! 2^4 = 16 ≥ 8 + 4 + 1.

? In the stopwatch, state 5 of the mod-6 digit (tens of seconds) must be recognised (Q2 Q1 Q0); the codes 6 and 7 never occur. Give the simplest expression!
expr: Q2, Q1, Q0 -> Q2·Q0
limit: 2
dc: 6, 7

? A 50 MHz board needs a 1 kHz tick pulse. Every how many clocks should the tick come?
= 50000
= 50 000

? Which unit performs neural-network computation most efficiently in a phone?
- the high-performance core of the CPU
+ the NPU (neural accelerator)
- the memory controller
- the USB controller

? What is the correct signal-processing chain for real-time audio filtering?
- DAC → digital filter → ADC
+ anti-aliasing filter → ADC → digital filter → DAC → smoothing filter
- ADC → DAC → anti-aliasing filter
- digital filter → anti-aliasing filter → ADC

? Which statement is true about the effect of dithering?
- The quantisation error disappears completely.
+ The quantisation error appears as even, less noticeable noise instead of a regular pattern.
- The bit count of the signal increases.
- The sampling frequency doubles.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Moving-average filter.** Write the `moving_average(signal, n)` function, which returns the outputs of an n-point moving average from the sample where n samples are already available (rounded to two decimals)!

```python starter
def moving_average(signal, n):
    return signal
```

<details>
<summary>Solution</summary>

The last test shows the signal at half the sampling frequency (the fastest possible): the 2-point average cancels it completely.

```python solution
def moving_average(signal, n):
    out = []
    for i in range(n - 1, len(signal)):
        window = signal[i - n + 1:i + 1]      # the last n samples
        out.append(round(sum(window) / n, 2))
    return out
```

</details>

```python test
assert moving_average([2, 4, 6, 8], 4) == [5.0]
assert moving_average([1, 2, 3, 4, 5], 2) == [1.5, 2.5, 3.5, 4.5]
assert moving_average([1, -1, 1, -1, 1, -1], 2) == [0.0, 0.0, 0.0, 0.0, 0.0]   # the fastest signal disappears
print("All checks passed!")
```

**2.** **Q15 with saturation.** Write the `q15(x)` function (real number → 16-bit integer, rounded, saturated to −32768 … 32767) and the `q15_add(a, b)` function, which adds two Q15 integers **with saturation**!

```python starter
def q15(x):
    return round(x * 32768)

def q15_add(a, b):
    return a + b
```

<details>
<summary>Solution</summary>

```python solution
def q15(x):
    return max(-32768, min(32767, round(x * 32768)))

def q15_add(a, b):
    return max(-32768, min(32767, a + b))     # the extreme value instead of overflow
```

</details>

```python test
assert q15(0.5) == 16384
assert q15(-0.25) == -8192
assert q15(1.0) == 32767                      # +1 can't be represented: saturation
assert q15_add(q15(0.75), q15(0.75)) == 32767
assert q15_add(-30000, -10000) == -32768
assert q15_add(1000, 2000) == 3000
print("All checks passed!")
```

**3.** **ECC bits.** Write the `secded_bits(m)` function, which returns how many check bits m data bits need with a SECDED code (the smallest r for which 2^r ≥ m + r + 1, plus 1 parity bit)!

```python starter
def secded_bits(m):
    return 8
```

<details>
<summary>Solution</summary>

```python solution
def secded_bits(m):
    r = 0
    while 2 ** r < m + r + 1:      # the syndrome names every bit + the "no error" case
        r += 1
    return r + 1                   # + one parity bit to detect a double error
```

</details>

```python test
assert secded_bits(64) == 8        # 72-bit server memory
assert secded_bits(32) == 7
assert secded_bits(4) == 4
assert secded_bits(128) == 9
print("All checks passed!")
```

### Quick check questions

```quiz
? How many MAC operations per second does a 32-coefficient FIR filter perform at 48 kHz sampling (on one channel)?
= 1536000
! 32 · 48,000 = 1,536,000.

? In which application is ECC memory NOT usually used?
- a data centre server
- an aircraft's controller
+ a cheap games console
! ECC is more expensive, so it's used where a silent data error can cause serious damage.

? What is dithering?
+ adding a small, deliberate noise before quantisation, so the quantisation error isn't a distortion correlated with the signal
- amplifying the signal
- removing the noise completely
! With quiet sounds, an even, less disturbing noise is heard instead of distortion.

? What is the job of the multiply-accumulate (MAC) unit in a DSP?
+ it computes acc + a · b in one step
- it compares two numbers
- it addresses the memory
! The basic operation of FIR filters, matrix multiplication and neural networks.

? How many bits is a server memory word with 64 data bits and SECDED ECC?
= 72
! 64 data bits + 8 check bits.
```
