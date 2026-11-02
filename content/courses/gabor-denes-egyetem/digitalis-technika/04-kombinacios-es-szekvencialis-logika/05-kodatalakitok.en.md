---
title: Code Converters – Gray Code and the 7-Segment Decoder
summary: Binary ↔ Gray converters with XOR gates, designing a BCD → 7-segment decoder with Karnaugh maps, common-anode and common-cathode displays, driver ICs.
minutes: 35
---

## What you will learn

- what a **code converter** is,
- how the **binary → Gray** and **Gray → binary** converters are built,
- how to design a **BCD → 7-segment** decoder with a truth table and K-maps,
- the difference between **common-cathode** and **common-anode** displays,
- which ready-made **driver ICs** exist.

## What is a code converter?

A combinational circuit that translates a number arriving in one code **into another code** (e.g. binary → Gray, BCD → 7-segment, binary → BCD). It is designed the usual way: truth table → one function per output → simplification.

## Binary → Gray converter

In Gray code (topic 2) neighbouring values differ in one bit only. The conversion rule: the **top bit is unchanged**, every other bit is the **XOR of two adjacent bits** of the binary number.

**G<sub>n−1</sub> = B<sub>n−1</sub>**, **G<sub>i</sub> = B<sub>i+1</sub> ⊕ B<sub>i</sub>**

For four bits: G3 = B3, G2 = B3 ⊕ B2, G1 = B2 ⊕ B1, G0 = B1 ⊕ B0 – **three XOR gates**, in parallel.

| B3 B2 B1 B0 | G3 G2 G1 G0 |
| ----------- | ----------- |
| 0 1 0 1     | 0 1 1 1     |
| 1 0 1 1     | 1 1 1 0     |

## Gray → binary converter

Here the top bit is also unchanged, but the others are the XOR of the **already computed binary bit** and the Gray bit:

**B<sub>n−1</sub> = G<sub>n−1</sub>**, **B<sub>i</sub> = B<sub>i+1</sub> ⊕ G<sub>i</sub>**

Expanded: B2 = G3 ⊕ G2, B1 = G3 ⊕ G2 ⊕ G1, B0 = G3 ⊕ G2 ⊕ G1 ⊕ G0. The XOR gates form a **chain** here – every bit waits for the previous one.

## The 7-segment display

Seven LED segments (a–g) form one digit:

```text
 ─a─
f   b
 ─g─
e   c
 ─d─
```

- **Common cathode (CC):** the LED cathodes are shared (GND); a segment lights when its control is **1** (active high).
- **Common anode (CA):** the anodes are shared (+V<sub>CC</sub>); a segment lights when its control is **0** (active low).

Each segment needs a **current-limiting resistor**.

## Designing the BCD → 7-segment decoder

Input: one BCD digit (A B C D, A the most significant). Output: seven segments (common cathode, so 1 = lit).

| digit | A B C D | a | b | c | d | e | f | g |
| ----- | ------- | - | - | - | - | - | - | - |
| 0     | 0 0 0 0 | 1 | 1 | 1 | 1 | 1 | 1 | 0 |
| 1     | 0 0 0 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 2     | 0 0 1 0 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 3     | 0 0 1 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1 |
| 4     | 0 1 0 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 5     | 0 1 0 1 | 1 | 0 | 1 | 1 | 0 | 1 | 1 |
| 6     | 0 1 1 0 | 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 7     | 0 1 1 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 |
| 8     | 1 0 0 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 9     | 1 0 0 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| 10–15 | 1010…1111 | X | X | X | X | X | X | X |

Codes **10–15** never occur in BCD → they are **don't-care** entries, which simplify the K-maps a lot.

**Example – segment “e”:** e = Σm(0, 2, 6, 8) + d(10…15)

| AB \ CD | 00 | 01 | 11 | 10 |
| ------- | -- | -- | -- | -- |
| 00      | 1  | 0  | 0  | 1  |
| 01      | 0  | 0  | 0  | 1  |
| 11      | X  | X  | X  | X  |
| 10      | 1  | 0  | X  | X  |

- The four corners (0, 2, 8, 10 – 10 is a don't care) → **B̅D̅**
- The CD = 10 column (2, 6, 14, 10) → **CD̅**

**e = B̅D̅ + CD̅**

The simplified forms of all seven segments:

| segment | simplified function         |
| ------- | --------------------------- |
| a       | A + C + BD + B̅D̅             |
| b       | B̅ + C̅D̅ + CD                 |
| c       | B + C̅ + D                   |
| d       | A + B̅D̅ + B̅C + BC̅D + CD̅      |
| e       | B̅D̅ + CD̅                     |
| f       | A + C̅D̅ + BC̅ + BD̅            |
| g       | A + BC̅ + B̅C + CD̅            |

For a common-anode display the same signals must be output **inverted**.

## Ready-made driver ICs

| IC                  | feature                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| **CD4511** (CMOS)   | BCD → 7-segment, active-high outputs → for **common-cathode** displays, with built-in latch |
| **74LS47 / 7447** (TTL) | active-low, open-collector outputs → for **common-anode** displays        |
| **74LS48 / 7448** (TTL) | active-high version of the 7447 → for common-cathode displays            |
| **MAX7219 / MAX7221** | serial (SPI-like) control, 8 digits multiplexed, with current regulation    |
| **CD4543**          | also usable for LCDs (with a phase input)                                     |

An **LCD** must not be driven with DC voltage (it gets damaged), so AC (square-wave) drive is needed – e.g. CD4056B, ICM7211, the I²C PCF85176. **Nixie tubes** have 10 separate cathodes and need about 170 V (e.g. SN74141).

```python run
# Binary → Gray and Gray → binary on four bits
def bin_gray(b):
    return b ^ (b >> 1)            # every bit XOR the one above it

def gray_bin(g):
    b = 0
    while g:                       # the XOR of the upper bits accumulates downwards
        b ^= g
        g >>= 1
    return b

for n in (5, 11):
    g = bin_gray(n)
    print(f"{n:04b} → Gray {g:04b} → back {gray_bin(g):04b}")
```

## Summary

- Binary → Gray: G<sub>i</sub> = B<sub>i+1</sub> ⊕ B<sub>i</sub> (parallel XORs); Gray → binary: B<sub>i</sub> = B<sub>i+1</sub> ⊕ G<sub>i</sub> (XOR chain).
- The 7-segment decoder is a combinational circuit with 4 inputs and 7 outputs; codes 10–15 are don't cares.
- Common cathode: active high (e.g. CD4511, 7448); common anode: active low (e.g. 7447).

## Lesson exercise

```quiz required
? Give output G1 of the binary → Gray converter from bits B2, B1, B0!
expr: B2, B1, B0 -> B2 ⊕ B1
! A Gray bit is the XOR of two adjacent bits of the binary number.

? Give output B1 of the Gray → binary converter from bits G2, G1, G0 (three-bit code)!
expr: G2, G1, G0 -> G2 ⊕ G1
! B2 = G2, then B1 = B2 ⊕ G1.

? Which segments are lit for digit 4? (Write the letters in alphabetical order, together!)
= bcfg
= b, c, f, g
! The two verticals on the right, the top left and the middle one.

? Which digit does the display show if only segments a, b and c are lit?
= 7
! The top horizontal and the two verticals on the right.

? Simplify the function of segment “e”: e = Σm(0, 2, 6, 8) + d(10, 11, 12, 13, 14, 15)!
expr: A, B, C, D -> B'D' + CD'
limit: 4
dc: 10, 11, 12, 13, 14, 15
same: A'B'C'D' + A'B'CD' + A'BCD' + AB'C'D'
! The four corners and the CD = 10 column.

? Which IC suits a common-anode display?
- CD4511
- 7448
+ 7447
- MAX7219
! With a common anode a segment lights at 0: an active-low output is needed.
```
