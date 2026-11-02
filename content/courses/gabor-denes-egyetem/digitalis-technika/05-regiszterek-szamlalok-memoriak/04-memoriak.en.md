---
title: Semiconductor Memories – ROM, SRAM, DRAM, Flash
summary: Memory organisation (address, data, control signals), computing capacity, ROM types, static and dynamic RAM, Flash, the memory hierarchy and expansion.
minutes: 30
---

## What you will learn

- how a memory is built: **address lines, data lines, control signals**,
- how to compute **capacity** and the number of address lines needed,
- the types of **ROM** (mask ROM, PROM, EPROM, EEPROM, Flash),
- the difference between **static (SRAM)** and **dynamic (DRAM)** RAM,
- the **memory hierarchy** and memory **expansion**.

## Memory organisation

A memory stores **2<sup>n</sup> words of m bits**. The words sit in consecutively numbered locations; a location is selected by its **address**.

- **n address lines** (A0…A<sub>n−1</sub>) → 2<sup>n</sup> locations; the address goes to an internal **decoder** that selects the row.
- **m data lines** (D0…D<sub>m−1</sub>) – the word length.
- **Control signals** (typically active low): **CS̅** (chip select), **OE̅** (output enable – read), **WE̅** (write enable – write).

**Capacity = 2<sup>n</sup> · m bits.** Example: 16 address lines, 8 data lines → 2<sup>16</sup> = 65,536 locations × 8 bits = **64 KiB**.

Conversely: 1 Mi (2<sup>20</sup>) words need **20** address lines.

> Notation: 1 KiB = 1024 bytes, 1 MiB = 1024 KiB (binary prefixes). Manufacturers often use the decimal kB, MB notation.

## Read-only memories (ROM) – non-volatile

They keep their contents without power (**non-volatile**).

| type           | writing                                | note                                         |
| -------------- | -------------------------------------- | -------------------------------------------- |
| **mask ROM**   | at manufacture, with a mask            | cheap in large series, cannot be modified    |
| **PROM**       | once, programmed by the user           | fuse cells (OTP)                             |
| **EPROM**      | electrically; erasable with **UV light** | package with a quartz window               |
| **EEPROM**     | electrically writable and erasable **per byte** | small capacity, for storing settings  |
| **Flash**      | electrically, erasable **per block**   | large capacity, cheap: SSD, USB stick, microcontroller program |

Flash comes in two kinds: **NOR Flash** (directly addressable, programs can run from it) and **NAND Flash** (denser, cheaper, block access – SSD, memory card). Flash cells have a limited number of write/erase cycles (10<sup>3</sup>–10<sup>5</sup>), so the controller performs **wear levelling**.

**ROM as a combinational circuit:** a ROM implements any logic function – the inputs are the address, the outputs are the data, and the contents are the truth table itself (e.g. a 7-segment decoder in a 16 × 7-bit ROM). An FPGA LUT is the same thing in miniature.

## Read-write memories (RAM) – volatile

**RAM** (random access memory) **loses** its contents without power (**volatile**).

### Static RAM (SRAM)

One bit is stored by a **flip-flop**, typically **6 transistors** per cell (two cross-coupled CMOS inverters + two switches). It keeps the value as long as there is power.

- **fast** (ns access), no refresh needed,
- but **large area** and expensive → small capacity: **processor cache**, register file, FPGA block RAM.

### Dynamic RAM (DRAM)

One bit is stored by the **charge of a capacitor**, **1 transistor + 1 capacitor** per cell. The charge leaks, so the contents must be **refreshed regularly** (typically every row every 64 ms), and reading also “destroys” it, so it must be written back.

- **very dense, cheap** → large capacity: a computer's **main memory** (DDR4, DDR5 modules),
- but slower, and a refresh controller is needed.

## Memory hierarchy

| level                    | technology  | size (order)        | access time |
| ------------------------ | ----------- | ------------------- | ----------- |
| registers                | flip-flop   | ~1 KiB              | < 1 ns      |
| cache (L1–L3)            | SRAM        | KiB–MiB             | 1–20 ns     |
| main memory              | DRAM        | GiB                 | ~60–100 ns  |
| storage (SSD)            | NAND Flash  | TB                  | ~100 µs     |

The closer to the processor, the faster, smaller and more expensive per bit.

## Memory expansion

- **Increasing word length** (width): several chips **in parallel**, with a common address and CS̅, data lines side by side. Two 8K × 8 chips → 8K × 16.
- **Increasing capacity** (depth): the upper address bits select through a **decoder** which chip is active (CS̅). Four 8K × 8 chips + a 2→4 decoder → 32K × 8.
- The two can be combined: 32K × 16 needs 4 · 2 = **8** chips of 8K × 8.

```python run
# Computing memory capacity and address lines
import math

def capacity(address_lines, data_bits):
    locations = 2 ** address_lines
    return locations, locations * data_bits // 8      # number of locations and bytes

print("16 address, 8 data:", capacity(16, 8))
print("address lines for 1 Mi words:", int(math.log2(2 ** 20)))
print("32K×16 from 8K×8 chips:", (32 // 8) * (16 // 8), "pcs")
```

## Summary

- Memory: n address lines → 2<sup>n</sup> locations, m data bits; capacity 2<sup>n</sup> · m bits; CS̅, OE̅, WE̅.
- Non-volatile: mask ROM, PROM, EPROM, EEPROM, Flash (NOR / NAND).
- SRAM: flip-flop (6T), fast, cache; DRAM: capacitor (1T1C), needs refresh, main memory.
- Expansion: width in parallel, depth with a decoder.

## Lesson exercise

```quiz required
? A memory has 16 address lines and 8 data lines. How many bytes does it store?
= 65536
= 65 536
! 2^16 locations × 1 byte.

? How many address lines are needed to address 1 Mi (2^20) words?
= 20

? Why must DRAM be refreshed regularly?
- Because the flip-flops flip over time.
+ Because the charge of the capacitor storing the bit leaks away.
- Because the Flash cells wear out.
- Because the clock stops.

? How many transistors does an SRAM cell typically consist of?
- 1
- 2
- 4
+ 6
! Two cross-coupled CMOS inverters and two access transistors.

? Which memory is non-volatile (keeps its contents without power)?
- SRAM
- DRAM
+ Flash
- the processor's registers

? How many 8K × 8-bit memory chips are needed for a 32K × 16-bit memory?
= 8
! 4 times in depth, 2 times in width.
```
