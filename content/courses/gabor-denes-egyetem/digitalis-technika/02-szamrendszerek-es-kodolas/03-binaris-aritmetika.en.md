---
title: Binary Arithmetic
summary: Addition with carry, subtraction with borrow, multiplication and division in binary, overflow for unsigned numbers.
minutes: 20
---

## What you will learn

- the rules of binary **addition** and the **carry**,
- binary **subtraction** and the **borrow**,
- **multiplication** (shift + add) and the idea of division,
- when **overflow** happens with unsigned numbers.

Binary arithmetic works just like decimal – we only have two digits.

## Addition

| A | B | sum | carry |
| - | - | --- | ----- |
| 0 | 0 | 0   | 0     |
| 0 | 1 | 1   | 0     |
| 1 | 0 | 1   | 0     |
| 1 | 1 | 0   | **1** |

So 1 + 1 = 10<sub>2</sub>: write 0 and carry 1. The sum of three ones: 1 + 1 + 1 = 11<sub>2</sub> (write 1, carry 1).

```text
     carry:  1 1 1
             1 0 1 1      (11)
           + 0 1 1 0      ( 6)
           ─────────
           1 0 0 0 1      (17)
```

> Notice: the sum bit is exactly **XOR**, and the carry is **AND**. This is how half and full adders are built (topic 4).

## Subtraction

| A | B | difference | borrow |
| - | - | ---------- | ------ |
| 0 | 0 | 0          | 0      |
| 1 | 0 | 1          | 0      |
| 1 | 1 | 0          | 0      |
| 0 | 1 | 1          | **1**  |

For 0 − 1 we "borrow" from the next place (worth 2 there): 10<sub>2</sub> − 1 = 1, and at the next place we subtract one more.

```text
             1 1 0 0      (12)
           − 0 1 0 1      ( 5)
           ─────────
             0 1 1 1      ( 7)
```

In practice computers subtract by **adding the two's complement** – see the next lesson.

## Multiplication

The binary multiplication table is very short: 0·0 = 0, 0·1 = 0, 1·0 = 0, 1·1 = 1 (that is **AND**). Multiplication consists of **shifts and additions**: wherever the multiplier bit is 1, add the multiplicand shifted into place.

```text
         1 1 0 1      (13)
       ×   1 0 1      ( 5)
       ─────────
         1 1 0 1      ← 1 · 1101
       0 0 0 0        ← 0 · 1101, shifted left once
   + 1 1 0 1          ← 1 · 1101, shifted left twice
   ─────────────
     1 0 0 0 0 0 1    (65)
```

**Handy trick:** multiplying by 2 = shifting **left** by one (`x << 1`), dividing by 2 = shifting **right** by one (`x >> 1`, the remainder is lost).

## Division

Division follows long division: at each step decide whether the divisor "fits" (then the quotient bit is 1 and we subtract) or not (0). E.g. 1101<sub>2</sub> : 11<sub>2</sub> = 100<sub>2</sub>, remainder 1 (13 : 3 = 4, remainder 1).

## Overflow with unsigned numbers

If the result does not fit in the available bits, **overflow** occurs. For unsigned addition it is signalled by a **carry out of the top bit**: in 4 bits 1011 + 0110 = 1 0001 → the 4-bit result is 0001 (1), which is wrong; the 5th bit (carry) signals overflow.

```python run
# Binary operations in Python, limited to 4 bits
a, b = 0b1011, 0b0110
total = a + b
print(format(total, "b"), "=", total)
print("in 4 bits:", format(total & 0b1111, "04b"), "overflow:", total > 0b1111)
print(format(0b1101 * 0b101, "b"))          # multiplication: 13 · 5 = 65
print(0b1101 << 1, 0b1101 >> 1)             # shifts: ·2 and :2
```

## Summary

- 1 + 1 = 10<sub>2</sub> (sum = XOR, carry = AND).
- 0 − 1 → borrow from the next place.
- Multiplication = shifts and additions; shift left = ·2.
- Unsigned overflow: carry out of the top bit.

## Lesson exercise

```quiz required
? What is 1011<sub>2</sub> + 0111<sub>2</sub>? (in binary)
= 10010
! 11 + 7 = 18.

? What is 10010<sub>2</sub> − 00111<sub>2</sub>? (in binary, without leading zeros)
= 1011
! 18 − 7 = 11.

? What is 1101<sub>2</sub> · 11<sub>2</sub>? (in binary)
= 100111
! 13 · 3 = 39: 1101 + 11010.

? What is 1 + 1 + 1 in binary?
= 11
! Sum 1, carry 1.

? In 4-bit unsigned addition, which one overflows?
- 0011 + 0100
- 0111 + 0001
+ 1001 + 1000
- 0101 + 0101
! The largest 4-bit value is 15; check which sum is bigger.

? What is 00010110<sub>2</sub> shifted left by two (8 bits, in binary)?
= 01011000
= 1011000
! Shifting left by two = multiplying by 4: 22 · 4 = 88.
```
