---
title: Practice – VLSI Circuits and SoC
summary: Review questions and a summary worksheet: the transistor-level structure of CMOS gates, manufacturing and yield, Moore's law, ASIC or FPGA, VLSI design steps, testability, SoC, IP blocks, AMBA, power management.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. Why are NAND and NOR the “natural” gates in CMOS, and why is the AND gate more expensive?</summary>

Because a CMOS stage always inverts: the output is the negation of the pull-down nMOS network's function. NAND (series nMOS) and NOR (parallel nMOS) are a single stage with 2n transistors. An AND gate needs an inverter after the NAND, so for 2 inputs it takes 6 transistors instead of 4.

</details>

<details>
<summary>2. Why does it pay to make a product's prototype on an FPGA and its mass production on an ASIC?</summary>

The FPGA has no one-time cost and can be fixed at any time – that is what matters during development. For large quantities, however, the ASIC is cheaper and better because of its low unit price and better speed/power; above the break-even quantity the large NRE pays off. Meanwhile the design can be tried out on the prototype before the expensive tape-out.

</details>

<details>
<summary>3. Why is verification the largest part of VLSI design?</summary>

Because after manufacturing, fixing a bug means new masks and a re-spin (millions in cost, months of delay), and in a shipped product a recall. So before tape-out every possible operating case is checked with simulation, formal verification and FPGA prototypes.

</details>

<details>
<summary>4. How does the scan chain make the inside of the chip testable?</summary>

In test mode the flip-flops are connected into a shift register whose start and end are each available on a pin. Through it the tester shifts in any state, lets the combinational logic operate in normal mode for one clock, then shifts out the result and compares it with the expected value. So every internal node can be controlled and observed.

</details>

<details>
<summary>5. Why does DVFS reduce power so effectively?</summary>

Because dynamic power is P = α·C·V²·f: proportional to frequency linearly and to voltage quadratically. At a lower frequency the transistors are fast enough even at a lower voltage, so both can be reduced together – e.g. 0.8 times the voltage and half the frequency cut the power to about one third.

</details>

## Summary worksheet

```quiz required
? How many transistors does a two-input CMOS NOR gate consist of?
= 4

? In the nMOS network of a CMOS gate, A and B are connected in parallel, with C in series with them. What is the output function?
expr: A, B, C -> ((A + B)·C)'
! Parallel = OR, series = AND; the output is the negation of the pull-down network's function.

? How are the pMOS transistors connected in a CMOS NOR gate?
+ in series
- in parallel
- there are no pMOS transistors in it
- in series with the nMOS, alternating

? An ASIC's NRE is €1,500,000, its unit price €5; the FPGA's unit price is €35. At how many units are the total costs equal?
= 50000
= 50 000

? 400 chips are made on a wafer, 300 of them are good. What is the yield in percent?
= 75

? The dynamic power of an SoC block is 2 W. What will it be in W if its frequency is halved (voltage unchanged)?
= 1

? Which step checks that the chip's layout really implements the schematic?
- DRC
+ LVS
- CTS
- ATPG

? Which statement is true of an SoC?
- It can contain only a single processor core.
+ It combines the processor cores, accelerators, memory controller and peripherals on one chip.
- It is always implemented on an FPGA.
- It cannot contain a memory controller.
```
