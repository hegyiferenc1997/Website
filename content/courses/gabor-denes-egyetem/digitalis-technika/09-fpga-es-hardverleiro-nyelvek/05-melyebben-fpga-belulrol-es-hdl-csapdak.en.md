---
title: Deeper – Inside the FPGA and the Pitfalls of HDL
summary: A 4-input LUT tried out (its configuration is the truth table itself), how many LUTs larger functions need, the difference between blocking and non-blocking assignment in a simulator on a shift register, and a resource estimate for an LED blinker counter.
minutes: 40
---

## What you will learn in this lesson

- to **try out** that a LUT really is just a small memory whose content is the truth table,
- to estimate **how many LUTs** a function with many inputs needs,
- to **see** in a simulator why blocking (`=`) and non-blocking (`<=`) assignment give completely different results in a clocked block,
- to **calculate** how many flip-flops a simple LED blinker takes up in the FPGA.

## 1. The LUT tried out

The heart of an FPGA logic cell is the **look-up table** (LUT): a 4-input LUT is really a **16-bit memory**, and the 4 inputs are the **address**. It can implement any 4-input function – you just have to write the right 16 bits into it. Those 16 bits are the function's **truth table**, and the bitstream loads them at power-up.

```python run
# A 4-input LUT = a 16-bit memory: the "configuration" is the truth table itself
from itertools import product

def lut_config(f):
    # the 16 stored bits: the output for each address (a, b, c, d) in order
    return [f(a, b, c, d) for a, b, c, d in product([0, 1], repeat=4)]

def lut_read(config, a, b, c, d):
    return config[a * 8 + b * 4 + c * 2 + d]        # the inputs simply form an address

functions = {
    "4-input AND":          lambda a, b, c, d: a & b & c & d,
    "parity (XOR)":         lambda a, b, c, d: a ^ b ^ c ^ d,
    "majority (≥ 3 ones)":  lambda a, b, c, d: int(a + b + c + d >= 3),
    "2:1 MUX (d selects)":  lambda a, b, c, d: b if d else a,
}
for name, f in functions.items():
    k = lut_config(f)
    ok = all(lut_read(k, *x) == f(*x) for x in product([0, 1], repeat=4))
    print(f"{name:<22} configuration: {''.join(map(str, k))}  checked: {ok}")
```

Four completely different functions, the same hardware – only the 16 configuration bits differ. That's why we say an FPGA isn't **programmed** (like a processor) but **configured**: no instructions run on it; the bits loaded at power-up determine what circuit it **becomes**.

### How many LUTs does a larger function need?

A 5-input function can be split by one of its variables (**Shannon expansion**): F = E̅ · F<sub>0</sub> + E · F<sub>1</sub>, where F<sub>0</sub> and F<sub>1</sub> have only 4 inputs. So it needs **two 4-LUTs** and a **2:1 multiplexer**, which itself fits into one LUT. Splitting further in the same way:

| Inputs | 4-LUT (with Shannon expansion, at most) | 6-LUT (today's FPGAs) |
| ------ | --------------------------------------- | --------------------- |
| 4      | 1                                       | 1                     |
| 5      | 2 + 1 = 3                               | 1                     |
| 6      | 4 + 3 = 7                               | 1                     |
| 8      | 16 + 15 = 31                            | 4 + 1 = 5             |

(The first number is the LUTs of the sub-functions, the second that of the multiplexer tree. A 2:1 MUX fits into a 4-LUT, a whole 4:1 MUX into a 6-LUT.)

Every extra input roughly **doubles** the number of LUTs needed. That's why modern FPGAs switched to 6-input LUTs (64 configuration bits): fewer levels, shorter delay. Fortunately synthesis rarely meets the worst case – real functions (adders, comparators, MUXes) decompose well.

## 2. Blocking or non-blocking? – the most common HDL mistake

We want a three-stage shift register in Verilog: d → q1 → q2 → q3 on every clock. The two ways of writing it differ in a single character, but they behave completely differently:

```python run
# Blocking (=) and non-blocking (<=) assignment – a three-stage shift register
# In Verilog:  always @(posedge clk) begin q1 <= d; q2 <= q1; q3 <= q2; end
def clock_blocking(d, q):
    q1, q2, q3 = q
    q1 = d                 # q1 = d;   updated immediately...
    q2 = q1                # q2 = q1;  ...so q2 already gets the NEW q1
    q3 = q2
    return (q1, q2, q3)

def clock_non_blocking(d, q):
    q1, q2, q3 = q
    # every right-hand side uses the old values, and all are written at once (like flip-flops)
    return (d, q1, q2)

inputs = [1, 0, 0, 1, 0]
for name, step in [("non-blocking <=", clock_non_blocking), ("blocking =     ", clock_blocking)]:
    q = (0, 0, 0)
    row = []
    for d in inputs:
        q = step(d, q)
        row.append("".join(map(str, q)))
    print(f"{name}: " + "  ".join(row))
```

- The **non-blocking** (`<=`) version shifts correctly: the 1 bit moves one place to the right per clock (100 → 010 → 001). Here every right-hand side uses the **old** values, and the new values are written **at once** at the clock edge – exactly the way three real flip-flops work.
- In the **blocking** (`=`) version q1 is updated immediately, so q2 already gets the **new** q1, and q3 the new q2: the input **runs through** the whole chain in a single clock (111). Synthesis turns this into practically a single flip-flop and wires, not a shift register.

The rule worth knowing by heart: **in a clocked (sequential) block always use `<=`, in a combinational block `=`.** In VHDL the same difference is between a signal (`signal`, `<=`) and a variable (`variable`, `:=`).

**Analogy:** non-blocking assignment is like everyone in a classroom passing their test paper to the person behind them at the same moment. Blocking is as if the first row passed theirs back, the second row immediately passed on the one they just received, and so on – in the end the first paper ends up in the back row, and the rest are lost.

## 3. Resource estimate: an LED blinker

The first FPGA project is almost always a blinking LED. But how many bits does the counter need? The LED toggles every half period, so it must count f<sub>clock</sub> / (2 · f<sub>LED</sub>) cycles, which takes ⌈log₂(...)⌉ bits:

```python run
# Resource estimate: how many bits does the counter of an LED blinker need?
import math

for f_clock in [12e6, 50e6, 100e6]:
    for f_led in [1, 10]:
        # the LED toggles every half period: this many clock cycles must be counted
        count = f_clock / (2 * f_led)
        bits = math.ceil(math.log2(count))
        print(f"{f_clock / 1e6:>5.0f} MHz → {f_led:>2} Hz blinking: counts to {count:>12,.0f}, "
              f"{bits}-bit counter ({bits} flip-flops)")
```

On a 100 MHz board, 1 Hz blinking needs a **26-bit** counter (26 flip-flops and roughly as many LUTs for the increment). A mid-range FPGA has tens of thousands of flip-flops, so this is negligible – but it shows well why you can't "just" connect a 100 MHz signal to an LED: to our eyes it would be continuous light. The same principle gives the baud rate of a serial port or the timing of a VGA display: each is a **dividing counter**.

## Summary

- A k-input LUT is a 2<sup>k</sup>-bit memory whose content is the truth table; an FPGA is **configured**, not programmed.
- Shannon expansion: a (k + 1)-input function = two k-input ones + a MUX; every extra input roughly **doubles** the LUT count.
- In a clocked block use **`<=`** (non-blocking), in a combinational one **`=`**; blocking assignment turns a shift register into a "run-through" wire.
- A dividing counter needs ⌈log₂(f<sub>clock</sub> / (2 · f<sub>out</sub>))⌉ flip-flops.

## Lesson exercise

```quiz required
? How many configuration bits does a 6-input LUT store?
= 64
! 2^6 = 64 – the 6 inputs give 64 addresses.

? The configuration of a 4-input LUT is 0000000000000001 (from row ABCD = 0000 to 1111). Which function is it?
- 4-input OR
+ 4-input AND
- parity
- 4-input NAND
! 1 only in the last (1111) row.

? Fill in the content of a 3-input LUT that implements the majority function (at least two inputs are 1)!
table: A, B, C -> Y = A·B + A·C + B·C
! This is also the carry of a full adder.

? In a clocked Verilog block: q1 = d; q2 = q1; (blocking). Initially q1 = q2 = 0, d = 1. What is q2 after the first clock edge?
= 1
! Because of the blocking assignment q2 already gets the new q1 – that's why clocked blocks need <=.

? How many bits does the counter need for 1 Hz LED blinking on a 50 MHz board (it must count to 25,000,000)?
= 25
! 2^24 ≈ 16.8 million < 25 million ≤ 2^25 ≈ 33.6 million.
```
