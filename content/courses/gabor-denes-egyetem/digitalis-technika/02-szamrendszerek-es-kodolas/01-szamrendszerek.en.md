---
title: Positional Number Systems
summary: Decimal, binary, octal and hexadecimal; place value, base, conversion to decimal.
minutes: 20
---

## What you will learn

- what the **base** of a number system and **place value** mean,
- the **decimal**, **binary**, **octal** and **hexadecimal** systems,
- how to convert **from any base to decimal**.

## A little history

The weights of the Indus Valley civilisation (2500–1700 BC) already followed a **binary** scheme: 1, 2, 4, 8, 16, 32 … units, while their length measures were decimal. The modern binary system was described by **Gottfried Wilhelm Leibniz** in 1703; Frederick the Great called him "an academy in himself". Binary became the language of computers because circuits can distinguish two states (no voltage / voltage) easily and reliably.

## Positional notation

A number system is a set of rules for writing numbers using a given **base** (_b_, radix). In a positional system the value of each digit depends on its **position**: the place values are powers of the base.

The value of a base-_b_ number:

N = a<sub>n</sub>·b<sup>n</sup> + … + a<sub>1</sub>·b<sup>1</sup> + a<sub>0</sub>·b<sup>0</sup> + a<sub>−1</sub>·b<sup>−1</sup> + …

**Example (decimal):** 472 = 4·100 + 7·10 + 2·1.

## The four important systems

| System      | Base | Digits   | Notation                   | Use                              |
| ----------- | ---- | -------- | -------------------------- | -------------------------------- |
| decimal     | 10   | 0–9      | 472, 472<sub>10</sub>      | everyday life                    |
| binary      | 2    | 0, 1     | 1011<sub>2</sub>, `0b1011` | the computer's internal language |
| octal       | 8    | 0–7      | 157<sub>8</sub>, `0o157`   | old machines, Unix permissions   |
| hexadecimal | 16   | 0–9, A–F | 2F<sub>16</sub>, `0x2F`    | memory addresses, colours, bytes |

In hexadecimal A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.

> **Always check which base you are in!** "10" is ten in decimal, two in binary and sixteen in hexadecimal.

## Powers of two – worth memorising

| 2<sup>n</sup> | 2<sup>0</sup> | 2<sup>1</sup> | 2<sup>2</sup> | 2<sup>3</sup> | 2<sup>4</sup> | 2<sup>5</sup> | 2<sup>6</sup> | 2<sup>7</sup> | 2<sup>8</sup> | 2<sup>10</sup> | 2<sup>16</sup> |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | -------------- | -------------- |
| value         | 1             | 2             | 4             | 8             | 16            | 32            | 64            | 128           | 256           | 1024           | 65 536         |

A **bit** (_binary digit_) is one binary digit; 8 bits = 1 **byte**; 4 bits = 1 **nibble** (= one hexadecimal digit). With _n_ bits **2<sup>n</sup>** different values can be represented (0 … 2<sup>n</sup> − 1).

## Converting to decimal: sum of place values

**From binary:** 1011<sub>2</sub> = 1·8 + 0·4 + 1·2 + 1·1 = **11**

**From octal:** 157<sub>8</sub> = 1·64 + 5·8 + 7·1 = **111**

**From hexadecimal:** 1A3<sub>16</sub> = 1·256 + 10·16 + 3·1 = **419**

**Fraction:** 10.11<sub>2</sub> = 2 + 1·½ + 1·¼ = **2.75**

```python run
# Conversion to decimal: built-in int(text, base) and our own place-value method
print(int("1011", 2), int("157", 8), int("1A3", 16))

def to_decimal(digits, base):
    value = 0
    for digit in digits:
        # Horner's scheme: multiply the value so far by the base and add the digit
        value = value * base + int(digit, 16)
    return value

print(to_decimal("1011", 2), to_decimal("157", 8), to_decimal("1A3", 16))
```

## Summary

- In a positional system a digit's value = digit × base<sup>position</sup>.
- Binary (2), octal (8), hexadecimal (16) – hex digits are 0–9 and A–F.
- _n_ bits represent 2<sup>n</sup> different values.
- To convert to decimal, add up the weighted place values.

## Lesson exercise

```quiz required
? What is 10110<sub>2</sub> in decimal?
= 22
! 16 + 4 + 2.

? What is 2F<sub>16</sub> in decimal?
= 47
! 2·16 + 15.

? What is 157<sub>8</sub> in decimal?
= 111
! 1·64 + 5·8 + 7.

? What is 101.01<sub>2</sub> in decimal?
= 5.25
= 5,25
! The place values after the binary point are ½, ¼, …

? How many different values can be represented with 10 bits?
= 1024
! 2<sup>10</sup>.

? What is the largest unsigned number that fits in 8 bits?
= 255
! 2<sup>8</sup> − 1.
```
