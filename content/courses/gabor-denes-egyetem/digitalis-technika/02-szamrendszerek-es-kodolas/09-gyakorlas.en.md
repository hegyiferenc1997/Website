---
title: Practice – Number Systems and Codes
summary: Review questions and a mixed summary worksheet with conversions, two's complement, BCD, Gray and Hamming codes.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why do programmers use hexadecimal instead of binary?</summary>

Because one hex digit is exactly 4 bits, so long bit strings can be written four times shorter and still converted back one-to-one (e.g. one byte = two hex digits).

</details>

<details>
<summary>2. Why can't 0.1 be represented exactly in binary?</summary>

Because 0.1 = 1/10, and the prime factor 5 in the denominator is not a power of two; such fractions can only be written as infinite repeating fractions in binary.

</details>

<details>
<summary>3. Why do computers use two's complement for signed numbers?</summary>

Because there is a single zero, and addition and subtraction can be done with the same adder circuit regardless of the signs.

</details>

<details>
<summary>4. What is the difference between the overflow (V) and carry (C) flags?</summary>

C (carry) signals overflow of the unsigned result (carry out of the top bit); V (overflow) signals overflow of the signed two's complement result (two same-sign numbers give a result of the opposite sign).

</details>

<details>
<summary>5. Why is a +6 correction needed in BCD addition?</summary>

Because 4 bits have 16 combinations but only 10 are valid in BCD; above 9 the 6 unused combinations must be skipped to produce the correct decimal carry.

</details>

<details>
<summary>6. Why do rotary encoders use Gray code?</summary>

Because neighbouring positions differ in only one bit, so no false, distant value can appear during a transition (there is no multi-bit change that does not happen simultaneously).

</details>

<details>
<summary>7. What can a parity bit do, and what can't it?</summary>

It detects one (an odd number of) bit errors, but misses two bit errors, and it cannot tell which bit is wrong, so it cannot correct.

</details>

## Summary worksheet

```quiz required
? What is A5<sub>16</sub> in decimal?
= 165
! 10·16 + 5.

? What is 1011.101<sub>2</sub> in decimal?
= 11.625
= 11,625
! 8 + 2 + 1 + ½ + ⅛.

? What is 755<sub>8</sub> in binary?
= 111101101
! Each octal digit is 3 bits: 7 = 111, 5 = 101.

? What is the BCD code of 75<sub>10</sub> (8 bits, no space)?
= 01110101
! Digit by digit: 7 = 0111, 5 = 0101.

? What is the 8-bit two's complement of −45?
= 11010011
! 45 = 00101101.

? What is the value of the bit pattern 11010011 as an 8-bit **unsigned** number?
= 211
! No negative weight here: 128 + 64 + 16 + 2 + 1.

? What is the Gray code of the binary number 1001?
= 1101
! G = B ⊕ (B >> 1).

? Which binary number does the Gray code 0111 stand for?
= 0101
= 101
! b<sub>3</sub> = g<sub>3</sub>, then b<sub>i</sub> = b<sub>i+1</sub> ⊕ g<sub>i</sub>.

? Instead of a Hamming(7,4) codeword, 1011011 arrived (p<sub>1</sub> p<sub>2</sub> d<sub>1</sub> p<sub>4</sub> d<sub>2</sub> d<sub>3</sub> d<sub>4</sub>). What is the **corrected data** (d<sub>1</sub>d<sub>2</sub>d<sub>3</sub>d<sub>4</sub>)?
= 1010
! Compute the syndrome (s<sub>4</sub>s<sub>2</sub>s<sub>1</sub>), flip the indicated bit back, then read bits 3, 5, 6, 7.

? Which one is not a valid BCD code?
- 1001
- 0000
+ 1100
- 0111
! Only 0000 … 1001 are valid in BCD.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Conversion to any base.** Write the `convert(n, base)` function, which converts a non-negative integer to the given base (2…16) and returns it as a string (digits above 9: A–F)! The built-in `bin`, `hex`, `format` may not be used this time.

```python starter
def convert(n, base):
    return str(n)
```

<details>
<summary>Solution</summary>

This is the method of repeated division: the remainders read from bottom to top give the result, which is why we always prepend.

```python solution
def convert(n, base):
    digits = "0123456789ABCDEF"
    if n == 0:
        return "0"
    s = ""
    while n > 0:
        s = digits[n % base] + s     # the remainder is the next digit (going to the left)
        n //= base
    return s
```

</details>

```python test
assert convert(13, 2) == "1101"
assert convert(255, 16) == "FF"
assert convert(100, 8) == "144"
assert convert(0, 2) == "0"
assert convert(2026, 16) == "7EA"
print("All checks passed!")
```

**2.** **Two's complement.** Write the `twos_complement(x, bits)` function, which returns an integer (possibly negative) in two's complement form with the given number of bits, as a string! If the number doesn't fit, return `None`.

```python starter
def twos_complement(x, bits):
    return format(x, "b")
```

<details>
<summary>Solution</summary>

```python solution
def twos_complement(x, bits):
    if not -(2 ** (bits - 1)) <= x < 2 ** (bits - 1):
        return None                                  # doesn't fit in the signed range
    return format(x % 2 ** bits, f"0{bits}b")        # for negatives: 2^n + x
```

</details>

```python test
assert twos_complement(5, 8) == "00000101"
assert twos_complement(-5, 8) == "11111011"
assert twos_complement(-128, 8) == "10000000"
assert twos_complement(128, 8) is None
assert twos_complement(-1, 4) == "1111"
print("All checks passed!")
```

**3.** **Gray code there and back.** Write the `gray(n)` and `gray_back(g)` functions! Binary → Gray conversion: g = n XOR (n >> 1). Backwards, starting from the top bit, every bit = the previous (already converted) bit XOR the Gray bit.

```python starter
def gray(n):
    return n

def gray_back(g):
    return g
```

<details>
<summary>Solution</summary>

```python solution
def gray(n):
    return n ^ (n >> 1)

def gray_back(g):
    n = 0
    while g:
        n ^= g          # the XOR of all higher bits accumulates
        g >>= 1
    return n
```

</details>

```python test
assert [gray(i) for i in range(8)] == [0, 1, 3, 2, 6, 7, 5, 4]
assert all(gray_back(gray(i)) == i for i in range(256))
assert all(bin(gray(i) ^ gray(i + 1)).count("1") == 1 for i in range(255))   # neighbours: 1 bit difference
print("All checks passed!")
```

### Quick check questions

```quiz
? What is 0x2F in decimal?
= 47
! 2 · 16 + 15 = 47.

? Which is the two's complement form of −1 on 8 bits?
- 10000001
+ 11111111
- 01111111
! All bits are 1: 256 − 1 = 255 = 11111111.

? What is the BCD code of 7?
= 0111
! BCD represents every decimal digit in binary on 4 bits.

? What is the largest 8-bit unsigned number?
= 255
! 2^8 − 1 = 255.

? What is the most important property of the Gray code?
+ the codes of two neighbouring numbers differ in exactly one bit
- it's shorter than the binary code
- it can correct errors
! That's why it's used e.g. in rotary encoders: no false value appears during a transition.
```
