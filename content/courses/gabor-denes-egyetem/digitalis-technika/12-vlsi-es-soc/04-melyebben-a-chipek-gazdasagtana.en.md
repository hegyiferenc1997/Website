---
title: Deeper – The Economics and Energy of Chips in Numbers
summary: How many good chips come out of a silicon wafer (chip size, yield, price per good chip), why chiplets are cheaper than one giant chip, the break-even quantity of ASIC versus FPGA, and the effect of voltage and frequency scaling (DVFS) on power and on the energy of a task.
minutes: 35
---

## What you will learn in this lesson

- to **calculate** how many chips fit on a 300 mm wafer, and how many of them will be flawless,
- to understand why the price of large chips grows **much faster** than their size – and why that's the main reason for chiplets,
- to estimate **from how many units** it pays to make an ASIC instead of using an FPGA,
- to see in numbers why a processor saves **energy** by working more slowly but at a lower voltage.

## 1. Yield: a large chip is an expensive business

A silicon wafer has randomly scattered **defects** (a speck of dust, a crystal defect). If a defect falls on a chip's area, that chip is scrap. The larger the chip, the more likely it is to get at least one defect. According to the simple Poisson model the **yield** (the share of flawless chips) is **Y = e<sup>−D · A</sup>**, where D is the defect density and A is the chip area.

```python run
# Yield and cost: how many good chips come out of a silicon wafer?
import math

WAFER_DIAMETER = 300                                 # mm
WAFER_PRICE = 10_000                                 # dollars for a processed wafer (example)
DEFECT_DENSITY = 0.1                                 # defects / cm² (example)

def chips_per_wafer(area_mm2):
    # approximate formula: the circle's area / chip, minus the pieces lost at the edge
    r = WAFER_DIAMETER / 2
    return int(math.pi * r ** 2 / area_mm2 - math.pi * WAFER_DIAMETER / math.sqrt(2 * area_mm2))

def yield_(area_mm2):
    return math.exp(-DEFECT_DENSITY * area_mm2 / 100)  # Poisson model: the chance of no defect

print(f"{'chip size':>10} | {'chips/wafer':>11} | {'yield':>9} | {'good':>7} | {'$/good chip':>11}")
for area in [25, 100, 300, 600]:
    n = chips_per_wafer(area)
    y = yield_(area)
    good = int(n * y)
    print(f"{area:>7} mm² | {n:>11} | {y:>8.0%} | {good:>7} | {WAFER_PRICE / good:>9.1f} $")

# Chiplets: 4 pieces of 150 mm² instead of one 600 mm² giant (extra packaging cost ignored here)
one_good = WAFER_PRICE / int(chips_per_wafer(150) * yield_(150))
print(f"\n1 chip of 600 mm²: {WAFER_PRICE / int(chips_per_wafer(600) * yield_(600)):.0f} $, "
      f"4 chiplets of 150 mm²: {4 * one_good:.0f} $")
```

Look at the "$/good chip" column: the chip area grows **24 times** (25 → 600 mm²), but the price of a good chip grows **more than 50 times**! Two effects multiply: fewer chips fit on the wafer (and more area is lost at the edge of the round wafer), **and** a smaller share of those is flawless.

This is the main reason for **chiplets**: instead of one giant chip, several smaller pieces are made and connected in one package. In the example, 4 chiplets of 150 mm² cost almost **half** as much as one 600 mm² chip – and a faulty chiplet can be thrown away on its own, not the whole large chip. AMD Ryzen/EPYC and many of today's server processors are built exactly this way.

## 2. ASIC or FPGA? – the break-even quantity

An ASIC (custom chip) has a very low unit price, but first comes a huge **one-off development cost** (_NRE – non-recurring engineering_): design, verification, masks. An FPGA has no NRE, but every unit is more expensive. Which is cheaper?

```python run
# ASIC or FPGA? One-off development cost (NRE) + unit price → break-even quantity
FPGA_UNIT = 40.0                                     # dollars / unit, no NRE
ASIC_NRE = 2_000_000                                 # dollars: design, masks, testing
ASIC_UNIT = 4.0                                      # dollars / unit

breakeven = ASIC_NRE / (FPGA_UNIT - ASIC_UNIT)       # the total costs are equal here
print(f"break-even quantity ≈ {breakeven:,.0f} units")
for n in [1_000, 10_000, 100_000, 1_000_000]:
    fpga = n * FPGA_UNIT
    asic = ASIC_NRE + n * ASIC_UNIT
    print(f"{n:>9,} units: FPGA {fpga / 1e6:>6.2f} M$, ASIC {asic / 1e6:>6.2f} M$ → "
          f"{'FPGA' if fpga < asic else 'ASIC'} is cheaper")
```

The two costs are equal where **NRE + n · c<sub>ASIC</sub> = n · c<sub>FPGA</sub>**, that is, **n = NRE / (c<sub>FPGA</sub> − c<sub>ASIC</sub>)**. In the example, below about **55,000** units the FPGA is cheaper, above it the ASIC. That's why:

- a low-volume measuring instrument, a prototype or a research project contains an **FPGA**,
- a smartphone (tens of millions of units) an **ASIC/SoC**,
- and many products start with an FPGA, then switch to an ASIC if they sell well.

At cutting-edge technology nodes the NRE can be tens of millions of dollars – there the break-even quantity is measured in millions. Beyond money, **time** matters too: an FPGA is ready immediately, an ASIC takes months, and after a mistake a re-spin takes months again.

## 3. DVFS: slower, but more economical

Dynamic power is **P = C · U² · f**. At a lower frequency the transistors have more time to switch, so the **voltage can be reduced too** – and voltage counts **quadratically**. This is **DVFS** (_dynamic voltage and frequency scaling_): the processor chooses a voltage–frequency pair according to the load.

```python run
# DVFS: reducing voltage and frequency – power and the energy of a task
# P = C · U² · f; simple model: the voltage can be lowered along with the frequency
C = 1e-9                                             # F, switched capacitance (example)
WORK = 3e9                                           # a task takes this many clock cycles

for f_ghz, u in [(3.0, 1.2), (2.0, 0.9), (1.0, 0.7)]:
    f = f_ghz * 1e9
    p = C * u ** 2 * f                               # W
    t = WORK / f                                     # s
    print(f"{f_ghz:.1f} GHz, {u:.1f} V: P = {p:5.2f} W, the task finishes in {t:.1f} s, "
          f"energy = {p * t:.2f} J")
```

Look at the last column: the same task takes three times as long at 1 GHz, yet uses **a third of the energy** it uses at 3 GHz (1.47 J versus 4.32 J). The energy is **E = P · t = C · U² · (number of cycles)** – the frequency drops out, only the square of the voltage remains!

That's why your phone's processor runs background tasks at a low clock, and why today's SoCs have **"big" and "little" cores** (e.g. ARM big.LITTLE): the fast cores for urgent work, the economical little cores for everything else. (In reality there's a lower limit: at a very low voltage leakage current starts to dominate, and running very slowly no longer pays off.)

## Summary

- Yield: Y = e<sup>−D·A</sup>; the price of a large chip grows **much faster** than its area (fewer chips / wafer × lower yield). That's why **chiplets** are spreading.
- ASIC vs FPGA: break-even quantity = NRE / (c<sub>FPGA</sub> − c<sub>ASIC</sub>); FPGA for small series, ASIC for large ones.
- DVFS: P = C · U² · f; the energy of a task ∝ U², so running more slowly at a lower voltage takes **less energy**.

## Lesson exercise

```quiz required
? The defect density is 0.1 defects/cm². What is the yield of a 100 mm² (1 cm²) chip according to the Poisson model (in %, rounded to a whole number)?
= 90
! Y = e^(−0.1 · 1) ≈ 0.905 → about 90%.

? Why does the price of a good chip grow much faster than the chip's area?
- because a large chip needs more expensive silicon
+ because fewer chips fit on the wafer, and a smaller share of those is flawless
- because a large chip takes longer to test
- because a large chip can only be packaged by hand
! The two effects multiply.

? An ASIC's NRE is $1,000,000 and its unit price $5; the FPGA costs $25/unit. At how many units are the two total costs equal?
= 50000
! 1,000,000 / (25 − 5) = 50,000 units.

? A processor's voltage is reduced from 1.2 V to 0.6 V. To what fraction does the dynamic energy of completing a task drop?
- to a half
+ to a quarter
- to an eighth
- it doesn't change, because it runs more slowly
! E ∝ U²: (0.6 / 1.2)² = 1/4.

? Why do phone SoCs have "big" and "little" processor cores?
- because little cores are cheaper, so more can be built in
+ because the little, economical cores do non-urgent work at a low voltage with much less energy
- because big cores can't run background tasks
- because that's the only way the operating system can schedule
! A fast core for urgent work, an economical one for everything else – so the battery lasts longer.
```
