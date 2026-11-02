---
title: Practice – Digital Technology in Computing
summary: Review questions and a summary worksheet: signal-to-noise ratio, dithering, digital filters, DSP hardware, ECC, accelerators, the design decisions of the stopwatch project – and a few course-wide review questions.
minutes: 35
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
