---
title: BCD, Excess-3 and Gray Code
summary: Weighted and non-weighted numeric codes; BCD addition with correction, self-complementing Excess-3, and Gray code conversion.
minutes: 25
---

## What you will learn

- the difference between a **binary number** and a **binary code**,
- **weighted** (BCD 8421) and **non-weighted** (Excess-3, Gray) codes,
- the +6 correction in **BCD addition**,
- **binary ↔ Gray** conversion by hand and in code.

## Number and code

- **Binary number:** the value of a number written in base two (e.g. 59 = 111011).
- **Binary code:** bits that stand for *some information* by agreement (e.g. 59 in BCD is 0101 1001, a letter in ASCII, a colour in RGB).

**Encoding** turns elements of one symbol set into another by a rule; the reverse is **decoding**.

## Weighted codes: BCD (8421)

**BCD** (*Binary Coded Decimal*) encodes a decimal number **digit by digit** in 4 bits. The bit weights are 8-4-2-1.

| decimal | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| BCD     | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 |

**Example:** 59<sub>10</sub> = **0101 1001**<sub>BCD</sub> (whereas in binary it is 111011).
The combinations 1010 … 1111 are **invalid** in BCD.

**What is it for?** Displays (each digit drives a 7-segment display directly), financial calculations (no rounding error with decimal fractions), clocks, counters.

### BCD addition and the +6 correction

If the sum of two BCD digits is **greater than 9** (invalid code or a carry), add **6** (0110), because we "skip" 16 − 10 = 6 combinations.

```text
    8 = 1000
  + 5 = 0101
  ──────────
       1101   → greater than 9: +0110
  +    0110
  ──────────
     1 0011   → 0001 0011 = 13 in BCD ✓
```

## Non-weighted codes

### Excess-3

Each decimal digit is mapped to its binary value **+3**: 0 → 0011, 5 → 1000, 9 → 1100.
It is **self-complementing**: inverting the bits gives the digit's **nines' complement** (e.g. 2 = 0101 → inverted 1010 = 7, and 2 + 7 = 9). This made subtraction easier in old calculators.

### Gray code (reflected code)

Named after **Frank Gray**, who used it in 1947 and patented it. The point: **two neighbouring values differ in only one bit** – also when wrapping from the last back to the first (**cyclic**).

| dec | bin  | Gray | dec | bin  | Gray |
| --- | ---- | ---- | --- | ---- | ---- |
| 0   | 0000 | 0000 | 8   | 1000 | 1100 |
| 1   | 0001 | 0001 | 9   | 1001 | 1101 |
| 2   | 0010 | 0011 | 10  | 1010 | 1111 |
| 3   | 0011 | 0010 | 11  | 1011 | 1110 |
| 4   | 0100 | 0110 | 12  | 1100 | 1010 |
| 5   | 0101 | 0111 | 13  | 1101 | 1011 |
| 6   | 0110 | 0101 | 14  | 1110 | 1001 |
| 7   | 0111 | 0100 | 15  | 1111 | 1000 |

The name "reflected" comes from how the table is built: the *n*-bit code is the (*n*−1)-bit code followed by the same list in reverse order, with 0 prefixed to the first half and 1 to the second.

**Why does it matter?** When several bits change at once (e.g. 0111 → 1000: all four!), in reality they do not switch at exactly the same instant, and a **false value** (hazard) may briefly appear. In Gray code only one bit changes at a time, so this cannot happen. That is why it is used in **rotary encoders**, **A/D converters**, pointers of asynchronous FIFOs – and the rows and columns of a **Karnaugh map** are in Gray order too (topic 4).

## Binary → Gray and Gray → binary

**Binary → Gray:** the top bit stays; every further Gray bit is the **XOR of the binary bit and the binary bit to its left**: g<sub>i</sub> = b<sub>i+1</sub> ⊕ b<sub>i</sub>. In short: **G = B ⊕ (B >> 1)**.

```text
 binary:   1   0   1   1
           │ ⊕ │ ⊕ │ ⊕ │
 Gray:     1   1   1   0        1011 → 1110
```

**Gray → binary:** the top bit stays; every further binary bit is the XOR of the **binary bit already computed** (to the left) and the current Gray bit: b<sub>i</sub> = b<sub>i+1</sub> ⊕ g<sub>i</sub>.

```text
 Gray:     1   1   0   1
           ↓  ⊕↓  ⊕↓  ⊕↓
 binary:   1 → 0 → 0 → 1        1101 → 1001
```

In hardware both converters are made of **XOR gates** (3 of them for 4 bits). The first is parallel (all gates compute at once), the second is a chain (each gate waits for the previous result).

## Summary

- BCD: 4 bits per decimal digit (8421); +6 correction above 9 when adding.
- Excess-3: digit + 3, self-complementing.
- Gray: neighbouring values differ in one bit; G = B ⊕ (B >> 1).
- Gray → binary: cumulative XOR from left to right.

## Lesson exercise: Gray code converters

Write both converter functions for integers! `bin_to_gray(n)` returns the Gray code of the binary number *n* (as an integer), and `gray_to_bin(g)` does the reverse. You may use the `^` (XOR) and `>>` (right shift) operators.

```python starter required
def bin_to_gray(n):
    return n


def gray_to_bin(g):
    return g


print(format(bin_to_gray(0b1011), "04b"))   # 1110
print(format(gray_to_bin(0b1101), "04b"))   # 1001
```

<details>
<summary>Solution</summary>

```python solution
def bin_to_gray(n):
    # Each bit XOR the bit to its left
    return n ^ (n >> 1)


def gray_to_bin(g):
    # Cumulative XOR from left to right: XOR in every shifted copy
    n = 0
    while g:
        n ^= g
        g >>= 1
    return n


print(format(bin_to_gray(0b1011), "04b"))   # 1110
print(format(gray_to_bin(0b1101), "04b"))   # 1001
```

</details>

```python test
assert bin_to_gray(0b1011) == 0b1110, "bin_to_gray(1011) should be 1110"
assert bin_to_gray(0) == 0, "the Gray code of 0 is 0"
assert gray_to_bin(0b1101) == 0b1001, "gray_to_bin(1101) should be 1001"
for i in range(256):
    g = bin_to_gray(i)
    assert gray_to_bin(g) == i, f"converting there and back does not return {i}"
    if i:
        diff = g ^ bin_to_gray(i - 1)
        assert bin(diff).count("1") == 1, f"the Gray codes of {i - 1} and {i} do not differ in one bit"
```
