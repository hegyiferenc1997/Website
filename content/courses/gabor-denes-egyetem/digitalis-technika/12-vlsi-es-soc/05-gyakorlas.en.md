---
title: Practice – VLSI Circuits and SoC
summary: Review questions and a summary worksheet: the transistor-level structure of CMOS gates, manufacturing and yield, Moore's law, ASIC or FPGA, VLSI design steps, testability, SoC, IP blocks, AMBA, power management.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Yield and price.** Write the `yield_pct(d_per_cm2, area_mm2)` function (Poisson model, Y = e^(−D·A), result in %, one decimal), and the `price_per_good_chip(wafer_price, chips, yield_percent)` function, which returns the price of a flawless chip to two decimals!

```python starter
def yield_pct(d_per_cm2, area_mm2):
    return 100.0

def price_per_good_chip(wafer_price, chips, yield_percent):
    return wafer_price / chips
```

<details>
<summary>Solution</summary>

```python solution
import math

def yield_pct(d_per_cm2, area_mm2):
    a_cm2 = area_mm2 / 100                         # 100 mm² = 1 cm²
    return round(100 * math.exp(-d_per_cm2 * a_cm2), 1)

def price_per_good_chip(wafer_price, chips, yield_percent):
    good = chips * yield_percent / 100             # only the good chips carry the wafer's price
    return round(wafer_price / good, 2)
```

</details>

```python test
assert yield_pct(0.1, 100) == 90.5
assert yield_pct(0.1, 600) == 54.9
assert yield_pct(0, 600) == 100.0
assert price_per_good_chip(10000, 640, 90.5) == 17.27
print("All checks passed!")
```

**2.** **Break-even quantity.** Write the `breakeven(nre, c_fpga, c_asic)` function, which returns the **smallest whole** quantity from which the ASIC's total cost (NRE + n · c_asic) is no longer greater than the FPGA's (n · c_fpga)! If the ASIC's unit price isn't lower, return `None`.

```python starter
def breakeven(nre, c_fpga, c_asic):
    return nre / (c_fpga - c_asic)
```

<details>
<summary>Solution</summary>

```python solution
import math

def breakeven(nre, c_fpga, c_asic):
    if c_asic >= c_fpga:
        return None                               # it never pays off
    return math.ceil(nre / (c_fpga - c_asic))     # round up: a whole number of units is needed
```

</details>

```python test
assert breakeven(1_000_000, 25, 5) == 50000
assert breakeven(2_000_000, 40, 4) == 55556
assert breakeven(100, 10, 10) is None
print("All checks passed!")
```

**3.** **DVFS energy.** Write the `energy_j(c_farad, u_volt, cycles)` function (E = C · U² · number of cycles, three decimals), and the `saving(u_old, u_new)` function, which returns in % (rounded to a whole number) how much less energy a task needs at the lower voltage!

```python starter
def energy_j(c_farad, u_volt, cycles):
    return 0

def saving(u_old, u_new):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def energy_j(c_farad, u_volt, cycles):
    return round(c_farad * u_volt ** 2 * cycles, 3)     # the frequency drops out!

def saving(u_old, u_new):
    return round(100 * (1 - (u_new / u_old) ** 2))      # E ∝ U²
```

</details>

```python test
assert energy_j(1e-9, 1.2, 3e9) == 4.32
assert energy_j(1e-9, 0.7, 3e9) == 1.47
assert saving(1.2, 0.6) == 75
assert saving(1.0, 0.9) == 19
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the name of a technology node (e.g. "3 nm") mean today?
- the exact gate length of the transistor
+ rather the name of a generation; the real dimensions differ from it
- the total size of the chip
! In older technologies it matched the gate length; today it's a marketing name.

? What is a scan chain in an ASIC for?
+ linking the flip-flops into a shift register for post-manufacturing testing
- distributing the clock
- reducing power consumption
! This way every internal state can be set and read out.

? What is "tape-out"?
- packaging the chip
+ handing over the finished design data to the manufacturer
- powering up the chip for the first time
! The masks are made after this – a mistake from here on is very expensive.

? What does clock gating do?
+ it switches off the clock of blocks not currently in use, so they have no dynamic power
- it doubles the clock frequency
- it synchronises the clocks
! In the formula P = C · U² · f, f = 0 for the idle block.

? Which open instruction set architecture (ISA) can anyone use without licence fees?
= RISC-V
= risc-v
! ARM and x86 require a licence.
```
