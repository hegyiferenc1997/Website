---
title: CMOS Gates and Chip Manufacturing
summary: The MOSFET as a switch, the transistor-level structure of the CMOS inverter, NAND and NOR gates, complex gates; the steps of chip manufacturing (wafer, photolithography, layers), process node, yield, Moore's law.
minutes: 40
---

## What you will learn

- how the **MOSFET** works as a switch,
- how the **CMOS inverter**, **NAND** and **NOR** gates are built from transistors,
- how to read the function of a **complex CMOS gate**,
- what steps **chip manufacturing** consists of,
- what **Moore's law** says, and what an “nm process” means.

## The MOSFET as a switch

In **VLSI** (very large scale integration) circuits billions of **MOSFET** transistors work. From a digital point of view, each one is a **voltage-controlled switch**:

- **nMOS:** **1** (high) on the gate → **closed** (conducts); 0 → open. Good at pulling **down**, towards ground.
- **pMOS:** **0** (low) on the gate → **closed** (conducts); 1 → open. Good at pulling **up**, towards the supply.

**CMOS** (complementary MOS) logic uses both: a **pMOS pull-up network** (between the supply and the output) and an **nMOS pull-down network** (between the output and ground). The two networks always work **oppositely**: when one conducts, the other is open – so at rest no current flows from supply to ground (that is why CMOS static power is small, topic 3).

## The inverter, the NAND and the NOR

**Inverter** (2 transistors): a pMOS on top, an nMOS below, with the gates connected.

```text
      VDD
       |
  A ──o[pMOS]          A = 0: the pMOS conducts → Y = 1
       |
       ├──── Y
       |
  A ───[nMOS]          A = 1: the nMOS conducts → Y = 0
       |
      GND
```

**NAND2** (4 transistors): the two nMOS in **series** (it pulls down only if A **and** B are both 1), the two pMOS in **parallel** (any 0 input pulls up).

**NOR2** (4 transistors): the other way round – the nMOS in **parallel** (any 1 pulls down), the pMOS in **series**.

The rule: **series nMOS = AND, parallel nMOS = OR**, and the output is the **negation** of the pull-down network's function. The pMOS network is its **dual** (series ↔ parallel). An n-input NAND or NOR consists of **2n** transistors.

That is why in CMOS the **NAND and NOR** (and the inverter) are the “natural”, cheapest gates; an AND gate is in fact NAND + inverter (6 transistors).

## Complex gates

A more complex, inverting function can be implemented in a single CMOS stage (**AOI** – AND-OR-INVERT, **OAI**). If in the nMOS network A and B are in series, with C in parallel to them, the pull-down network's function is AB + C, and the output is:

**Y = (A·B + C)'** – this is an AOI21 gate with only 6 transistors (separate gates would need 10).

## The steps of chip manufacturing

1. **Wafer:** a 300 mm disc cut from high-purity single-crystal silicon; several hundred chips (dies) are made on one wafer at once.
2. **Photolithography:** a light-sensitive layer (photoresist) is applied to the wafer and exposed through a **mask**; after development the surface is etched, doped or metallised according to the pattern. For the smallest patterns, **EUV** (extreme ultraviolet, 13.5 nm) light is used today.
3. This is **repeated many times**: the transistor layers at the bottom, above them up to 10–15 **metal layers** for wiring – a modern chip needs 50–100 masks.
4. **Wafer testing**, dicing, **packaging**, final testing.

**Process node** (“7 nm”, “3 nm”): originally the channel length of the transistor, today rather just the name of a generation – the smaller, the more, faster and more efficient transistors fit in a given area. Today's transistors are no longer planar: they are **FinFET** or **GAA** (gate-all-around) structures.

**Yield:** the proportion of good chips. A single crystal defect can ruin a chip, so large chips have a worse yield. E.g. 600 chips/wafer and 80 % yield → 480 good chips.

## Moore's law

The 1965 observation of Gordon Moore (a co-founder of Intel), as refined in 1975: the number of transistors that can be placed on a chip **doubles roughly every two years**. This held for decades: the 1971 Intel 4004 had 2300 transistors, today's top processors have tens of billions. Over 10 years this is a 2<sup>5</sup> = **32-fold** increase. Scaling is slowing down now (physical limits, cost), so 3D packaging and chiplets (lesson 3) are becoming more and more important.

```python run
# Evaluating a CMOS gate from its pull-down (nMOS) network: Y = (A·B + C)'
from itertools import product

def aoi21(a, b, c):
    pulls_down = (a and b) or c     # does the nMOS network conduct to ground?
    return 0 if pulls_down else 1   # pulled down → 0, otherwise the pMOS network pulls up → 1

print("A B C | Y")
for a, b, c in product((0, 1), repeat=3):
    print(a, b, c, "|", aoi21(a, b, c))

# Moore's law: doubling every two years from the Intel 4004
for year in (1971, 1981, 1991, 2001, 2011, 2021):
    print(year, f"{2300 * 2 ** ((year - 1971) / 2):,.0f}")
```

## Summary

- nMOS: conducts on 1, pulls down well; pMOS: conducts on 0, pulls up well; CMOS = pMOS pull-up + nMOS pull-down network, working oppositely.
- Inverter: 2 transistors; n-input NAND/NOR: 2n; NAND: series nMOS, parallel pMOS; NOR: the other way round.
- Complex gate: the output is the negation of the pull-down network's function (series = AND, parallel = OR).
- Manufacturing: wafer, photolithography with masks, many layers, packaging; yield; Moore's law: doubling every two years.

## Lesson exercise

```quiz required
? How many transistors does a three-input CMOS NAND gate consist of?
= 6

? How are the nMOS transistors connected in a CMOS NAND gate?
+ in series
- in parallel
- there are no nMOS transistors in it
- cross-coupled, like in a latch

? In the nMOS network of a CMOS gate, A and B are connected in series, with C in parallel to them. What is the output function?
expr: A, B, C -> (A·B + C)'
! The pull-down network's function is AB + C, the output is its negation.

? 600 chips are made on a wafer, the yield is 80 %. How many good chips do we get?
= 480

? According to Moore's law (doubling every two years), by what factor does the transistor count grow in 10 years?
= 32
! 10 years = 5 doublings.

? Why is the quiescent (static) power of CMOS gates small?
- Because they consist only of nMOS transistors.
+ Because of the pull-up and pull-down networks only one conducts at rest, so there is no current path from supply to ground.
- Because their supply voltage is very small.
- Because they have no metal layer.
```
