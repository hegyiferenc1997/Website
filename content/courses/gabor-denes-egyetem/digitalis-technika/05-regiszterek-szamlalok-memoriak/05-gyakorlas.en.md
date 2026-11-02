---
title: Practice – Registers, Counters, Memories
summary: Review questions and a summary worksheet: shift register, ring and Johnson counters, asynchronous and synchronous counters, memories.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. How does a shift register convert serial data into parallel?</summary>

Every clock moves the data arriving bit by bit at the serial input one place further; after n clocks all n bits are in the register and can be read simultaneously (in parallel) at the flip-flop outputs (SIPO).

</details>

<details>
<summary>2. Why is there no decoding glitch with a Johnson counter?</summary>

Because only one bit changes between two consecutive states (as in Gray code), so there is no moment when, due to different bit delays, a third, false code would appear.

</details>

<details>
<summary>3. Why does a short false state appear in a modulo-N counter with asynchronous clear?</summary>

Because the clear is triggered by state N itself: the counter must first reach code N, the decoding gate must detect it, and only then are the flip-flops cleared. For this short time code N (e.g. 1010 in a decade counter) appears on the outputs.

</details>

<details>
<summary>4. Why are JK flip-flops popular for designing synchronous counters?</summary>

Because the JK excitation table has a don't-care entry for every transition, so the K-maps have many Xs and the control logic is simpler (a single AND gate is enough for the modulo-5 counter).

</details>

<details>
<summary>5. What does it mean that a counter is self-starting, and why must it be checked?</summary>

That from any state not in the cycle it reaches the counting cycle after a few clocks. At power-on the flip-flops may be in a random state; if a closed loop started from an unused state, the counter would never start counting correctly.

</details>

<details>
<summary>6. Why do processors use SRAM for cache and DRAM for main memory?</summary>

SRAM is fast and needs no refresh, but needs 6 transistors per cell, so it is expensive and small – ideal for the small, fast cache. A DRAM cell is 1 transistor + 1 capacitor, so it is very dense and cheap, and GiB-sized main memory can be built from it, although it is slower and needs refreshing.

</details>

## Summary worksheet

```quiz required
? A 4-bit shift register starts at 1111; the serial input enters the leftmost bit and the contents shift right. The input receives 0, 0, 1, 0 in turn. What are the contents after the 4th edge?
= 0100
! 0111 → 0011 → 1001 → 0100.

? How many states does a Johnson counter with 3 flip-flops have?
= 6

? An 8-stage asynchronous counter receives a 1.024 MHz clock. What is the frequency of the last stage's output (Q7) in kHz?
= 4
! 1024 kHz / 2^8.

? An asynchronous modulo-6 counter is built with active-low CLR̅ inputs. Which gate is needed for clearing?
+ NAND(Q2, Q1)
- NAND(Q2, Q0)
- NAND(Q1, Q0)
- NAND(Q2, Q1, Q0)
! 6 = 110.

? A 2-bit synchronous down counter (00 → 11 → 10 → 01 → 00) is built with D flip-flops. Give the function of input D1!
expr: Q1, Q0 -> Q1 ⊙ Q0
! Q1 changes when Q0 = 0.

? In the JK counter with sequence 000 → 010 → 100 → 110 the values of J2 are: 000 → 0, 010 → 1, the other rows are don't cares. Give J2!
expr: Q2, Q1, Q0 -> Q1
limit: 1
dc: 1, 3, 4, 5, 6, 7

? How many address lines does a 16K × 8-bit memory need?
= 14
! 16K = 2^14.

? What technology is a processor's cache?
+ SRAM
- DRAM
- NAND Flash
- EEPROM
```
