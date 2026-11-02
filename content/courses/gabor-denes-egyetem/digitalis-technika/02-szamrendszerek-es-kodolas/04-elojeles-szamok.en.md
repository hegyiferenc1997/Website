---
title: Signed Numbers and Two's Complement
summary: Sign-magnitude, ones' and two's complement; subtraction by addition; range of representation and signed overflow.
minutes: 25
---

## What you will learn

- three ways to represent negative numbers: **sign-magnitude**, **ones' complement**, **two's complement**,
- how a computer **subtracts by adding**,
- the **range** of _n_-bit numbers,
- how to recognise **signed overflow**.

## 1. Sign-magnitude

The top bit is the **sign** (0 = positive, 1 = negative), the rest is the magnitude.
In 8 bits: +5 = 0000 0101, −5 = **1000 0101**.

Drawbacks: there are **two zeros** (+0 = 0000 0000, −0 = 1000 0000), and addition needs extra logic to compare signs.

## 2. Ones' complement

A negative number is obtained by **inverting every bit** of the positive one (0 → 1, 1 → 0).
In 8 bits: +5 = 0000 0101, −5 = **1111 1010**.

There are two zeros here too (0000 0000 and 1111 1111), so it is rarely used today (it still appears in the Internet checksum, for example).

## 3. Two's complement – what every modern computer uses

**How to form it:** ones' complement + 1 (invert the bits, then add 1).

```text
 +5        = 0000 0101
 invert    = 1111 1010   (ones' complement)
 + 1       = 1111 1011   = −5 in two's complement
```

**Quick trick:** going from right to left, copy the bits **up to and including the first 1**, then invert all the rest. 0001 0010 (18) → 1110 1110 (−18).

**Converting back:** if the top bit is 1, the number is negative; you get its magnitude by forming the two's complement again. 1111 0110 → invert 0000 1001 → +1 → 0000 1010 = 10, so the value is **−10**.

**Weighted view:** the top bit has a **negative** weight: −128 in 8 bits.
1111 0110 = −128 + 64 + 32 + 16 + 4 + 2 = **−10**.

### Advantages

- there is **a single zero** (0000 0000),
- addition and subtraction use **the same adder**, regardless of sign.

## Range

| Representation       | in _n_ bits                                  | in 8 bits      |
| -------------------- | -------------------------------------------- | -------------- |
| unsigned             | 0 … 2<sup>n</sup> − 1                        | 0 … 255        |
| sign-magnitude       | −(2<sup>n−1</sup> − 1) … 2<sup>n−1</sup> − 1 | −127 … 127     |
| ones' complement     | −(2<sup>n−1</sup> − 1) … 2<sup>n−1</sup> − 1 | −127 … 127     |
| **two's complement** | **−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1**   | **−128 … 127** |

## Subtraction by addition

A − B = A + (−B), where −B is the two's complement of B. The carry out of the top bit is **discarded**.

**Example:** 7 − 12, in 8 bits

```text
  12      = 0000 1100
  −12     = 1111 0100      (two's complement)
  7       = 0000 0111
  7 + (−12) = 1111 1011   → negative; back: 0000 0101 = 5, so −5 ✓
```

**Example:** 12 − 7

```text
  0000 1100 + 1111 1001 = 1 0000 0101 → discard the carry out: 0000 0101 = 5 ✓
```

## Signed overflow

In two's complement **overflow** happens when **two numbers of the same sign** are added and the result has the **opposite** sign. (Adding numbers of different signs can never overflow.)

```text
  100 + 50:   0110 0100 + 0011 0010 = 1001 0110 → looks negative (−106) → OVERFLOW
```

That is why processors have separate **C** (carry, unsigned overflow) and **V** (overflow, signed overflow) flags.

```python run
# Two's complement in 8 bits
def twos_complement(value, bits=8):
    # Masking gives exactly the two's complement bit pattern for negative numbers
    return format(value & (2**bits - 1), f"0{bits}b")

def interpret(pattern):
    value = int(pattern, 2)
    # If the top bit is 1, the number is negative: subtract 2^n
    return value - 2 ** len(pattern) if pattern[0] == "1" else value

print(twos_complement(-5), twos_complement(-18), twos_complement(-128))
print(interpret("11110110"), interpret("01111111"), interpret("10000000"))
print(twos_complement(7 - 12))
```

## Summary

- Two's complement = invert the bits + 1; the top bit weighs −2<sup>n−1</sup>.
- In _n_ bits: −2<sup>n−1</sup> … 2<sup>n−1</sup> − 1 (in 8 bits −128 … 127).
- Subtraction: A − B = A + (−B), discard the carry out.
- Overflow: the sum of two same-sign numbers has the opposite sign.

## Lesson exercise

```quiz required
? What is the 8-bit two's complement of −18?
= 11101110
! 18 = 00010010; invert the bits, then add 1.

? What is the value of the bit pattern 10011100 as 8-bit two's complement (in decimal)?
= -100
! The top bit weighs −128: −128 + 16 + 8 + 4.

? What is 25 − 40 in 8-bit two's complement?
= 11110001
! 25 + (−40); the result is −15.

? What is the smallest (most negative) number in 6-bit two's complement?
= -32
! −2<sup>n−1</sup>.

? What does −1 look like in 8-bit two's complement?
= 11111111
! 0000 0001 → inverted 1111 1110 → +1.

? Which 8-bit two's complement addition causes **signed overflow**?
- 00000011 + 11111110
+ 01010000 + 01000000
- 11110000 + 00010000
- 10000001 + 01111111
! Only the sum of two same-sign numbers can overflow; then the sign of the result flips.
```
