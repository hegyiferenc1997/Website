---
title: Programmable Logic Devices
summary: From fixed-gate ICs to programmable logic: PROM, PLA, PAL, GAL, CPLD and FPGA; how the look-up table (LUT) works; ASIC or FPGA.
minutes: 25
---

## What you will learn

- why **programmable logic** was created,
- the difference between **PLA**, **PAL**, **GAL**, **CPLD** and **FPGA**,
- how a **LUT** (look-up table) implements any function,
- when to choose an **ASIC** and when an **FPGA**.

## From fixed gates to programmable logic

In the previous topics we built circuits from gates (74- and 4000-series ICs). A serious design would consist of **dozens of ICs** and lots of wiring, and every change would mean a new printed circuit board.

A **programmable logic device** (PLD) is an IC whose internal connections are **defined by the user** – the circuit can be changed “in software”.

## Simple PLDs: the AND–OR matrix

From topic 4 we know that any function can be written in **SOP form** (an OR of AND terms). Simple PLDs implement exactly this with an **AND matrix** and an **OR matrix**:

| device   | AND matrix                          | OR matrix        | note                                                                                                       |
| -------- | ----------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| **PROM** | fixed (full decoder: every minterm) | **programmable** | storing a truth table                                                                                      |
| **PLA**  | **programmable**                    | **programmable** | most flexible, but slower, more expensive                                                                  |
| **PAL**  | **programmable**                    | fixed            | fast, cheap; one-time programmable                                                                         |
| **GAL**  | programmable                        | fixed            | an **erasable, rewritable** (EEPROM) version of the PAL, with an output macrocell (containing a flip-flop) |

## CPLD

A **CPLD** (complex PLD) connects several **PAL-like blocks** (macrocells) with a central switch matrix.

- Its configuration is **non-volatile** (Flash/EEPROM) → it works **immediately** after power-on.
- Predictable, short delays; a few dozen to a few hundred macrocells.
- Typical use: “glue logic” – address decoding, signal adaptation, simple control.

## FPGA

An **FPGA** (field-programmable gate array) is not built on an AND–OR matrix but on **thousands to millions of small logic cells**, connected by a programmable **interconnect**.

- A cell is based on a **LUT** (look-up table) and a **D flip-flop**.
- The configuration (the **bitstream**) is typically in **SRAM** → **lost at power-off**, so at power-on it is loaded from an external **Flash** (this takes a few ms to s).
- Many built-in units: block RAM, DSP multipliers, PLLs, high-speed serial transceivers, even processor cores (see next lesson).

## The LUT – look-up table

A **k-input LUT** is a **small 2<sup>k</sup>-bit memory** and a **multiplexer**: the inputs form the address, and the memory contents are the **truth table** itself (cf. “a function with a multiplexer”, topic 4).

**Example** – a 2-input LUT with contents (at addresses 00, 01, 10, 11): **0, 1, 1, 0** → this is the function **A ⊕ B**. If the contents were 0, 0, 0, 1, the same hardware would be an **AND gate**.

- 4-input LUT → 16 bits, 6-input LUT → **64 bits** (today's FPGAs typically use 6-input LUTs).
- **Any** k-variable function can be implemented with a single LUT – its complexity does not matter. For larger functions the synthesis tool cascades several LUTs.

## ASIC or FPGA?

|                     | **ASIC** (application-specific IC)           | **FPGA**                                     |
| ------------------- | -------------------------------------------- | -------------------------------------------- |
| one-time cost (NRE) | very high (masks: up to millions of dollars) | none                                         |
| unit price          | **cheap** in large volumes                   | more expensive                               |
| speed, power        | **best**                                     | worse (because of the programmable switches) |
| modification        | impossible (new manufacture)                 | **any time**, even in the field              |
| development time    | months–years                                 | days–weeks                                   |

That is why the FPGA is ideal for **prototypes**, small and medium volumes, and wherever the hardware must be updated later (telecommunications, instruments, AI accelerators). ASICs are often tried out on an FPGA first.

```python run
# A 3-input LUT: the memory contents are the truth table itself
def lut(contents, *inputs):
    address = 0
    for b in inputs:               # the inputs form the address in binary
        address = address * 2 + b
    return contents[address]

majority = [0, 0, 0, 1, 0, 1, 1, 1]  # truth table of the majority function
parity = [0, 1, 1, 0, 1, 0, 0, 1]    # three-variable XOR
for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            print(a, b, c, "→ majority:", lut(majority, a, b, c), " parity:", lut(parity, a, b, c))
```

## Summary

- PLD: programmable internal connections; PROM, PLA, PAL, GAL – AND–OR matrices.
- CPLD: several PAL blocks, non-volatile, instant-on.
- FPGA: LUT + flip-flop cells, programmable interconnect, SRAM-based configuration.
- A k-input LUT = 2<sup>k</sup>-bit memory + multiplexer → any k-variable function.

## Lesson exercise

```quiz required
? How many bits does a 4-input LUT store?
= 16

? And a 6-input LUT?
= 64

? In which device is the AND matrix programmable but the OR matrix fixed?
- PROM
- PLA
+ PAL
- FPGA

? The contents of a 2-input LUT at addresses 00, 01, 10, 11 are 0, 1, 1, 0. Which function does it implement? Write it as an expression!
expr: A, B -> A ⊕ B

? Why must an FPGA's configuration be loaded from an external Flash at power-on?
- Because Flash is faster than a LUT.
+ Because the configuration is in SRAM, which loses its contents at power-off.
- Because an FPGA has no pins.
- Because a new program must be written at every power-on.

? When is an ASIC a better choice than an FPGA?
- When making a prototype.
- When the hardware must be updated later.
+ For very large volumes, where unit price, speed and power are decisive.
- When it must be ready within a few weeks.
```
