---
title: Practice – FPGA and Hardware Description Languages
summary: Review questions and a summary worksheet: PLD types, LUT, FPGA architecture and design flow, pin assignment, VHDL and Verilog.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **LUT configuration.** Write the `lut(f, n)` function, which returns the configuration bits of an n-input LUT for an n-input logic function **as a string**, from address 00…0 to address 11…1!

```python starter
def lut(f, n):
    return "0" * 2 ** n
```

<details>
<summary>Solution</summary>

```python solution
from itertools import product

def lut(f, n):
    # the LUT's content is the truth table itself, in address order
    return "".join(str(f(*addr)) for addr in product([0, 1], repeat=n))
```

</details>

```python test
assert lut(lambda a, b: a ^ b, 2) == "0110"
assert lut(lambda a, b, c: int(a + b + c >= 2), 3) == "00010111"
assert lut(lambda a, b, c, d: a & b & c & d, 4) == "0000000000000001"
assert len(lut(lambda *x: 0, 6)) == 64
print("All checks passed!")
```

**2.** **Dividing counter.** Write the `divider_bits(f_clock, f_out)` function, which returns how many bits a counter needs to make an output blink at frequency f_out (the output toggles every half period, so it must count to f_clock / (2 · f_out))!

```python starter
def divider_bits(f_clock, f_out):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def divider_bits(f_clock, f_out):
    need = f_clock // (2 * f_out)      # this many cycles must be counted per half period
    bits = 0
    while 2 ** bits < need:
        bits += 1
    return bits
```

</details>

```python test
assert divider_bits(100_000_000, 1) == 26
assert divider_bits(50_000_000, 1) == 25
assert divider_bits(12_000_000, 10) == 20
print("All checks passed!")
```

**3.** **Blocking versus non-blocking.** Write the `shift_register(inputs, n, non_blocking=True)` function, which returns the states of an n-stage shift register (as strings, e.g. `"100"`) after every clock! In non-blocking mode every stage gets the **old** value of the previous stage; in blocking mode, in order, the **new** value.

```python starter
def shift_register(inputs, n, non_blocking=True):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def shift_register(inputs, n, non_blocking=True):
    q, rows = [0] * n, []
    for d in inputs:
        if non_blocking:
            q = [d] + q[:-1]               # everyone from the old values: a real shift
        else:
            q[0] = d
            for i in range(1, n):
                q[i] = q[i - 1]            # already sees the new value: it "runs through"
        rows.append("".join(map(str, q)))
    return rows
```

</details>

```python test
assert shift_register([1, 0, 0], 3) == ["100", "010", "001"]
assert shift_register([1, 0, 0], 3, non_blocking=False) == ["111", "000", "000"]
print("All checks passed!")
```

### Quick check questions

```quiz
? What stores the configuration of an SRAM-based FPGA while it's powered off?
- the LUTs themselves
+ an external (or built-in) Flash memory, from which it's loaded at power-up
- the JTAG cable
! SRAM is volatile, so the bitstream has to be loaded again at every power-up.

? Which is the correct Verilog for an edge-triggered D flip-flop?
+ always @(posedge clk) q <= d;
- always @(*) q = d;
- assign q = d;
! assign and always @(*) describe combinational logic.

? In VHDL, which condition means the rising clock edge?
= rising_edge(clk)
= rising_edge (clk)
! clk is in the process's sensitivity list.

? What is block RAM in an FPGA?
- the set of all LUTs
+ a dedicated, larger memory block inside the chip
- the external DDR memory
! Blocks of a few kilobits, much more efficient than building memory from LUTs.

? How many inputs does the LUT have in most of today's FPGAs?
= 6
! 6 inputs → 64 configuration bits.
```
