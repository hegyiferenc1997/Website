---
title: Practice – Digital Design and Simulation
summary: Review questions and a summary worksheet: design steps, setup and hold, critical path, synchronous design, testbenches, test vectors, debugging and measurement.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. Why does it pay to find bugs as early as possible, already in simulation?</summary>

Because every later step is more expensive: in simulation every internal signal is visible and a fix can be rerun in minutes. On the real board you can measure only at the pins, reprogramming takes minutes, and for a custom chip a bug discovered after manufacturing can mean a re-spin costing millions.

</details>

<details>
<summary>2. What can you do if a path does not fit into the clock period (negative slack)?</summary>

You can lower the clock frequency; simplify or restructure the combinational logic (e.g. a faster adder); or cut the long path into two shorter ones with a pipeline register – then a higher clock is possible, but the result comes one clock later.

</details>

<details>
<summary>3. Why must a signal from a button be both synchronised and debounced?</summary>

The button changes independently of the clock, so it can violate the flip-flop's setup/hold time and cause metastability – the two-flip-flop synchroniser protects against this. In addition the mechanical contact bounces for a few ms, so one press would look like several pulses – debouncing protects against that.

</details>

<details>
<summary>4. What is the difference between a logic analyser and an oscilloscope?</summary>

A logic analyser records only the logic level (0/1) on many channels, triggers on patterns and decodes protocols – it is for examining the logic of operation. An oscilloscope shows the real voltage waveform (levels, edges, noise, overshoot) on a few channels – for signal-integrity, analogue-like problems.

</details>

<details>
<summary>5. How do you test a 32-bit adder if an exhaustive test is impossible?</summary>

With random input vectors (many thousands or millions), complemented by the corner cases: 0, maximum value, overflow, a carry rippling through every bit (e.g. 0xFFFFFFFF + 1). The self-checking testbench compares the result with the value of a reference model (e.g. integer addition).

</details>

## Summary worksheet

```quiz required
? On a path t_cq = 0.5 ns, the logic is 3.5 ns, t_su = 1 ns. What is the maximum clock frequency in MHz?
= 200
! 1 / 5 ns.

? How many test vectors are needed to test a 6-input combinational circuit exhaustively?
= 64

? Based on the exhaustive test of the testbench, fill in the truth table of the module! assign Y = A ^ (B & C);
table: A, B, C -> Y = A ⊕ B·C

? In a Verilog testbench (timescale 1ns/1ps): always #10 clk = ~clk; What is the clock in MHz?
= 50
! The period is 20 ns.

? What is the bit time in μs of a 9600 bit/s UART signal? (Round to an integer!)
= 104

? A scope has 1 MSa of memory and a sample rate of 100 MSa/s. How many ms can it record?
= 10

? According to the measurement, a wire is always 0, whatever the circuit does. What is the most likely fault?
- floating input
+ stuck-at signal (e.g. a short to ground)
- metastability
- too high a sample rate

? What is the correct way to stop a register from being clocked?
- Gate its clock with an AND gate.
+ Use an enable input and leave the clock unchanged.
- Put an inverter into the clock.
- Tie its clock input to ground.
```
