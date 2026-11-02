---
title: Converting Between Number Systems
summary: Decimal to binary by repeated division, fractions by repeated multiplication, binary ↔ octal ↔ hexadecimal by grouping bits.
minutes: 20
---

## What you will learn

- decimal to binary (and any base) by **repeated division**,
- converting the **fractional part** by **repeated multiplication**,
- fast **binary ↔ octal ↔ hexadecimal** conversion with bit groups.

## Integer part: repeated division by the base

Divide the number by the new base, write down the **remainder**, and continue with the quotient until it becomes 0. Read the remainders **from bottom to top**.

**Example:** 45<sub>10</sub> = ?<sub>2</sub>

```text
 45 : 2 = 22  remainder 1   ← least significant bit (LSB)
 22 : 2 = 11  remainder 0
 11 : 2 =  5  remainder 1
  5 : 2 =  2  remainder 1
  2 : 2 =  1  remainder 0
  1 : 2 =  0  remainder 1   ← most significant bit (MSB)
```

Bottom to top: **45<sub>10</sub> = 101101<sub>2</sub>**. Check: 32 + 8 + 4 + 1 = 45 ✓

The same works for any base: 156<sub>10</sub> = 9C<sub>16</sub> (156 : 16 = 9, remainder 12 = C).

**Another method (subtraction):** find the largest power of two that still fits, subtract it, and repeat. 45 = 32 + 8 + 4 + 1 → put 1s at 32, 8, 4, 1: 101101.

## Fractional part: repeated multiplication by the base

Multiply the fraction by 2; the **integer part** (0 or 1) is the next bit, continue with the fraction. Read the result **from top to bottom**.

**Example:** 0.625<sub>10</sub> = ?<sub>2</sub>

```text
 0.625 · 2 = 1.25  → 1
 0.25  · 2 = 0.5   → 0
 0.5   · 2 = 1.0   → 1   (fraction became 0, done)
```

**0.625<sub>10</sub> = 0.101<sub>2</sub>**

> Careful: many decimal fractions are **infinite** in binary! For example 0.1<sub>10</sub> = 0.000110011…<sub>2</sub>. That is why Python gives `0.30000000000000004` for `0.1 + 0.2`.

## Binary ↔ hexadecimal and octal: grouping

Since 16 = 2<sup>4</sup> and 8 = 2<sup>3</sup>, one hex digit is exactly **4 bits** and one octal digit is exactly **3 bits**. Group the bits **from the right** (from the binary point), padding with zeros on the left if needed.

| hex | bin  | hex | bin  | hex | bin  | hex | bin  |
| --- | ---- | --- | ---- | --- | ---- | --- | ---- |
| 0   | 0000 | 4   | 0100 | 8   | 1000 | C   | 1100 |
| 1   | 0001 | 5   | 0101 | 9   | 1001 | D   | 1101 |
| 2   | 0010 | 6   | 0110 | A   | 1010 | E   | 1110 |
| 3   | 0011 | 7   | 0111 | B   | 1011 | F   | 1111 |

**Examples**

- 11010111<sub>2</sub> = 1101 0111 = **D7<sub>16</sub>**
- 3B<sub>16</sub> = 0011 1011 = **111011<sub>2</sub>**
- 101110<sub>2</sub> = 101 110 = **56<sub>8</sub>**
- Octal ↔ hex: go through binary! 56<sub>8</sub> = 101110<sub>2</sub> = 0010 1110 = **2E<sub>16</sub>**

```python run
# Converting from decimal: built-in functions and repeated division
print(bin(45), oct(45), hex(45))
print(format(45, "08b"))          # 8 bits with leading zeros

def convert(number, base):
    digits = "0123456789ABCDEF"
    if number == 0:
        return "0"
    result = ""
    while number > 0:
        number, remainder = divmod(number, base)
        result = digits[remainder] + result   # remainders bottom to top
    return result

print(convert(45, 2), convert(156, 16), convert(46, 8))
```

## Summary

- Integer part: repeated division, remainders read bottom to top.
- Fractional part: repeated multiplication, integer parts read top to bottom.
- 1 hex digit = 4 bits, 1 octal digit = 3 bits – group outwards from the point.

## Lesson exercise

```quiz required
? What is 200<sub>10</sub> in binary?
= 11001000
! Repeated division by 2, or: 200 = 128 + 64 + 8.

? What is 0.6875<sub>10</sub> in binary? (Format: 0.…)
= 0.1011
= 0,1011
! Multiply by 2 repeatedly: 1.375 → 1; 0.75 → 0; …

? What is 11010111<sub>2</sub> in hexadecimal?
= D7
= 0xD7
! Group by four from the right: 1101 0111.

? What is 3B<sub>16</sub> in binary (without leading zeros)?
= 111011
! 3 = 0011, B = 1011.

? What is 101110<sub>2</sub> in octal?
= 56
! Group by three from the right: 101 110.

? What is 156<sub>10</sub> in hexadecimal?
= 9C
= 0x9C
! 156 : 16 = 9, remainder 12.
```
