---
title: Number Systems and Conversion
summary: Binary, decimal and hexadecimal, and converting between them by hand and in Python.
minutes: 18
---

## What you will learn

- how a **positional** number system works,
- how to convert **binary to decimal** and back,
- why the **hexadecimal** system is handy.

## Place value

In decimal, every place is a power of 10: `347 = 3·100 + 4·10 + 7·1`. The same works with any **base**. Binary has base 2, and its only digits are `0` and `1`:

```text
 place value: 128  64  32  16   8   4   2   1
 bits:          0   1   1   0   1   0   0   1
 value:         0 +64 +32 + 0 + 8 + 0 + 0 + 1  = 105
```

So `01101001₂ = 105₁₀`.

## Decimal to binary: repeated division

Divide the number by 2 again and again and write down the **remainders**. The binary form is the remainders read **from bottom to top**.

```text
 105 : 2 = 52  remainder 1   ↑
  52 : 2 = 26  remainder 0   │
  26 : 2 = 13  remainder 0   │
  13 : 2 =  6  remainder 1   │  read upwards:
   6 : 2 =  3  remainder 0   │  1101001
   3 : 2 =  1  remainder 1   │
   1 : 2 =  0  remainder 1   │
```

## Hexadecimal

Hexadecimal has base 16, its digits are `0–9` and `A–F` (A = 10, …, F = 15). One hex digit is exactly **4 bits**, so long bit strings are easy to rewrite in groups of four:

```text
 1101 0110₂  →  D 6  →  D6₁₆ = 13·16 + 6 = 214
```

You see hex in colour codes (`#FF8800`), memory addresses (`0x7ffe…`) and MAC addresses.

## In Python

```python run
# Conversions with built-in functions
print(bin(105))          # 0b1101001
print(int("1101001", 2)) # 105
print(hex(214))          # 0xd6
print(int("D6", 16))     # 214
print(f"{105:08b}")      # 01101001 (padded to 8 digits)
```

## Summary

- In a positional system the digits are multiplied by powers of the base.
- Decimal to binary: divide by 2 repeatedly, read the remainders bottom-up.
- One hex digit = 4 bits; hex is popular because it is shorter.

## Exercise

```quiz required
? What is `1011₂` in decimal?
= 11
! 8 + 2 + 1 = 11.

? Write 26 in binary (no leading zeros)!
= 11010
! 16 + 8 + 2 = 26.

? What is `2F₁₆` in decimal?
= 47
! 2·16 + 15 = 47.

? How many bits does one hexadecimal digit correspond to?
- 2
+ 4
- 8
- 16
! 16 = 2⁴, so one hex digit is 4 bits.
```
