---
title: Practice – Digital Fundamentals
summary: Review questions and a summary worksheet for the first topic.
minutes: 20
kind: practice
---

## Review questions

Try to answer in your head first, and only then open the answer!

<details>
<summary>1. What is the difference between a discrete-time and a digital signal?</summary>

A discrete-time signal has a value only at certain instants, but the value can be anything (continuous amplitude). A digital signal is also discrete in amplitude: it can take only a finite number of levels.

</details>

<details>
<summary>2. Why can a digital signal be restored without error after noise?</summary>

Because the receiver only decides between two levels using a threshold. As long as the noise is smaller than the noise margin, the decision is correct and the signal can be regenerated cleanly.

</details>

<details>
<summary>3. What does a noise margin of 0.4 V mean for a logic family?</summary>

At most 0.4 V of interference may be added to the signal between two gates while the receiver still surely sees the correct logic value.

</details>

<details>
<summary>4. Why can't the clock frequency of a circuit be arbitrarily high?</summary>

Because between two clock edges the signal must travel through the longest (critical) path. The clock period cannot be shorter than the critical path delay (plus the storage elements' own timing).

</details>

<details>
<summary>5. What are the two main parts of a sequential circuit?</summary>

Combinational logic and memory (storage elements), connected by feedback.

</details>

## Summary worksheet

```quiz required
? For a 74HC (5 V CMOS) gate V<sub>OH</sub> = 4.4 V and V<sub>IH</sub> = 3.5 V. What is NM<sub>H</sub> in volts?
= 0.9
= 0.9 V
= 0,9
! NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>.

? For a 74HC gate V<sub>IL</sub> = 1.5 V and V<sub>OL</sub> = 0.1 V. What is NM<sub>L</sub> in volts?
= 1.4
= 1.4 V
= 1,4
! NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.

? A processor runs at 2.5 GHz. What is its clock period in ns?
= 0.4
= 0.4 ns
= 0,4
! T = 1 / f = 1 / (2.5 · 10<sup>9</sup> Hz).

? A 1 kHz PWM signal has a 30% duty cycle. For how many µs is it high in one period?
= 300
= 300 µs
! T = 1 ms = 1000 µs; take 30% of it.

? The critical path goes through 5 gates of 4 ns each. What is the maximum clock frequency in MHz (ignoring storage element timing)?
= 50
= 50 MHz
! The period must be at least 5 · 4 ns = 20 ns; f = 1 / T.

? What characterises **negative logic**?
- the voltage is negative
+ the lower voltage level means logic 1
- gate outputs are always inverted
- it is used only in TTL circuits
! Active-low signals (e.g. RESET̅) follow this view.

? Which one is not sequential?
- counter
- shift register
+ full adder
- processor
! A full adder's output depends only on the present values of its three inputs.
```
