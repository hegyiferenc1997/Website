---
title: Practice – FPGA and Hardware Description Languages
summary: Review questions and a summary worksheet: PLD types, LUT, FPGA architecture and design flow, pin assignment, VHDL and Verilog.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. How does HDL code differ from a software program?</summary>

An HDL describes hardware: concurrent assignments (VHDL `<=` outside a process, Verilog `assign`) are valid simultaneously and continuously, like gates, and their order does not matter. Synthesis turns the code into a circuit, not into a sequence of instructions.

</details>

<details>
<summary>2. Why do we say that a LUT implements “any” function?</summary>

Because a k-input LUT is a 2<sup>k</sup>-bit memory holding the truth table; the inputs form the address. Every k-variable function has a truth table, so any of them can be loaded – the complexity of the function does not matter.

</details>

<details>
<summary>3. Why is the pin assignment not in the HDL code?</summary>

Because the HDL code describes the logic, and the same module can be reused on different boards and FPGAs. The physical pins depend on the board's schematic, so a separate constraint file (XDC, QSF) specifies them, together with the clock constraints.

</details>

<details>
<summary>4. Why must non-blocking assignment be used in a clocked block in Verilog?</summary>

Because real flip-flops take their inputs simultaneously at the clock edge, based on the old values. `<=` models exactly this; blocking `=` can cause order-dependent behaviour in simulation that differs from the hardware.

</details>

<details>
<summary>5. What is the difference between synthesis and implementation?</summary>

Synthesis turns the HDL description into a network of logic elements (LUT, flip-flop, BRAM, DSP); implementation places them in specific cells of the FPGA (place) and chooses the wires between them (route). Only then are the exact delays known, so timing analysis is final after implementation.

</details>

## Summary worksheet

```quiz required
? How many bits does a 5-input LUT store?
= 32

? In which device are both the AND and the OR matrix programmable?
- PAL
+ PLA
- PROM
- GAL

? Which function does this VHDL line describe? Y <= (A or B) and (not C); – write it as an expression!
expr: A, B, C -> (A + B)·C'

? Which function does this Verilog line describe? assign Y = ~(A & B); – write it as an expression!
expr: A, B -> (A·B)'
! This is the NAND gate.

? An XDC file: create_clock -period 10.000. What is the clock in MHz?
= 100

? Which VHDL construct becomes an edge-triggered flip-flop?
- with SEL select … when others
- Y <= D1 when S = '1' else D0;
+ process (clk) … if rising_edge(clk) then
- signal cnt : unsigned(3 downto 0);

? In a Verilog module: a <= b; b <= a; (both in a clocked block). What happens at a clock edge?
+ The values of the two registers are swapped.
- Both get the value of b.
- Both get the value of a.
- Nothing changes.

? After which step is timing analysis final?
- after the HDL description
- after synthesis
+ after place and route (implementation)
- after functional simulation
```
