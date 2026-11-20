---
title: Deeper – Number Representation and Codes Through the Machine's Eyes
summary: 8-bit addition with flags (carry, overflow, negative, zero) in a simulator, why 0.1 + 0.2 isn't 0.3 (an IEEE 754 floating-point number bit by bit), trying the Hamming(7,4) code on every one- and two-bit error, comparing the error-detecting power of parity and CRC, and the bytes of UTF-8.
minutes: 45
---

## What you will learn in this lesson

- how the processor signals **carry**, **overflow**, **sign** and **zero** after an addition,
- why the computer gives **0.30000000000000004** for 0.1 + 0.2, and how a **floating-point** number is built,
- to check by **experiment** that the Hamming(7,4) code corrects every single-bit error – and what happens with two errors,
- to **compare** the error-detecting power of parity and CRC,
- how an accented letter or an emoji becomes **several bytes** in UTF-8.

## 1. The processor's flags

The processor adds unsigned and two's complement numbers with the same adder – the bit pattern is the same! So that the programmer knows what happened, it sets **flags** after the addition:

| Flag  | Name     | When is it 1?                                  |
| ----- | -------- | ---------------------------------------------- |
| **C** | carry    | the unsigned result doesn't fit in 8 bits      |
| **V** | overflow | the **signed** result doesn't fit (−128 … 127) |
| **N** | negative | the top bit of the result is 1                 |
| **Z** | zero     | the result is 0                                |

```python run
# 8-bit addition with flags – the way the processor sees it
def add8(a, b):
    full = a + b
    result = full & 0xFF                              # only 8 bits remain
    C = int(full > 0xFF)                              # unsigned overflow
    # signed overflow: two numbers of the same sign give a result of the opposite sign
    V = int(((a ^ result) & (b ^ result) & 0x80) != 0)
    N = result >> 7
    Z = int(result == 0)
    return result, C, V, N, Z

def signed(x):
    return x - 256 if x >= 128 else x                 # two's complement reading of the pattern

print(f"{'a':>9} + {'b':>9} = {'result':>9} | C V N Z | unsigned        | signed")
for a, b in [(100, 50), (200, 100), (0b11111111, 1), (0b10000000, 0b10000000), (60, 60)]:
    r, C, V, N, Z = add8(a, b)
    print(f"{a:09_b} + {b:09_b} = {r:09_b} | {C} {V} {N} {Z} | "
          f"{a:>3} + {b:>3} = {r:>3}  | {signed(a):>4} + {signed(b):>4} = {signed(r):>4}")
```

(The `_` in the output only groups the bits by four for readability.) Look at it row by row:

- **100 + 50**: unsigned it's 150 – correct (C = 0). But signed, 100 + 50 = **−106**?! Two positive numbers gave a negative one → **V = 1**: the signed result doesn't fit.
- **200 + 100**: unsigned, 300 doesn't fit in 8 bits → **C = 1**, the result is 44. Signed, this is −56 + 100 = 44 – **correct** (V = 0)!
- **255 + 1**: unsigned overflow (C = 1, Z = 1); signed, −1 + 1 = 0 – correct.

So the processor doesn't "know" whether we're working with signed numbers: it computes **both** flags, and the program decides which one to look at. In C, the `unsigned` and `signed` types are exactly this decision.

## 2. Why isn't 0.1 + 0.2 equal to 0.3?

```python run
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

This isn't a bug in Python, it's the nature of **binary fractions**. You saw in the conversions lesson that the fractional part is converted by repeated multiplication by 2. In binary, 0.1 is an **infinite, repeating** fraction (0.000110011001100…₂) – like 1/3 in decimal (0.333…). On a finite number of bits it can only be stored **rounded**.

Computers store real numbers in **IEEE 754 floating-point** form, similar to scientific notation: **(−1)<sup>sign</sup> · 1.mantissa · 2<sup>exponent − bias</sup>**. A 32-bit (_single_) number consists of 1 sign bit, 8 exponent bits (bias: 127) and 23 mantissa bits.

```python run
# The bits of a 32-bit floating-point number – IEEE 754
import struct

def bits(x):
    n = struct.unpack(">I", struct.pack(">f", x))[0]   # the 4 bytes as one integer
    s = f"{n:032b}"
    sign, exponent, mantissa = s[0], s[1:9], s[9:]
    e = int(exponent, 2)
    print(f"{x:>8}: {sign} {exponent} {mantissa}  → exponent {e} − 127 = {e - 127:>3}")

for x in [1.0, 2.0, -2.0, 0.5, 0.75, 0.1]:
    bits(x)

stored = struct.unpack(">f", struct.pack(">f", 0.1))[0]
print(f"\nWhat 0.1 really stores on 32 bits: {stored:.12f}")
```

0.75 = 1.1₂ · 2⁻¹ can be represented exactly (the mantissa is `1000…`), but the mantissa of 0.1 is `1001100110011…` – its end is cut off. Practical lessons:

- **don't** compare floating-point numbers with `==`, use a small tolerance instead: `abs(a − b) < 1e-9` (in Python `math.isclose`),
- **never** store money as floating point: use whole cents or a decimal type (`decimal`, SQL `NUMERIC`).

## 3. The Hamming(7,4) code in an experiment

In the base lesson you saw on one example that the syndrome shows the position of the faulty bit. Now let's check **every** possible single-bit error – and see what happens when **two** bits go wrong!

```python run
# Hamming(7,4): encoding, syndrome, correction – for every one- and two-bit error
from itertools import combinations

def encode(d):                                  # d = [d1, d2, d3, d4]
    d1, d2, d3, d4 = d
    p1, p2, p4 = d1 ^ d2 ^ d4, d1 ^ d3 ^ d4, d2 ^ d3 ^ d4
    return [p1, p2, d1, p4, d2, d3, d4]         # positions 1..7

def correct(b):
    b = b[:]
    s1 = b[0] ^ b[2] ^ b[4] ^ b[6]
    s2 = b[1] ^ b[2] ^ b[5] ^ b[6]
    s4 = b[3] ^ b[4] ^ b[5] ^ b[6]
    pos = s4 * 4 + s2 * 2 + s1                  # the syndrome = the number of the faulty bit
    if pos:
        b[pos - 1] ^= 1
    return [b[2], b[4], b[5], b[6]]             # the data bits

data = [1, 0, 1, 1]
code = encode(data)
print("data:", data, "→ codeword:", "".join(map(str, code)))

ok1 = sum(correct([bit ^ (i == j) for j, bit in enumerate(code)]) == data for i in range(7))
print(f"single-bit errors: {ok1} / 7 corrected properly")

ok2 = 0
for i, k in combinations(range(7), 2):
    bad = [bit ^ (j in (i, k)) for j, bit in enumerate(code)]
    ok2 += correct(bad) == data
print(f"two-bit errors: {ok2} / 21 corrected properly")
```

It corrects all **7** single-bit errors, but **none** of the **21** two-bit errors: the syndrome then points at a third, innocent bit, and the "correction" introduces yet another error! That's why ECC memories use a **SECDED** code (_single error correction, double error detection_): with one extra parity bit over the whole codeword, two errors are at least **noticed** and not wrongly "fixed".

**Analogy:** the Hamming code is like questioning three witnesses: if only one of them lies, the pattern of their answers reveals who it was. If two of them collude, the pattern points at a third, innocent person.

## 4. Parity versus CRC – who notices more?

```python run
# Error detection: one parity bit versus CRC-4 (x^4 + x + 1), for every 2-bit error
from itertools import combinations

def crc(bits, gen=[1, 0, 0, 1, 1]):
    t = bits + [0] * (len(gen) - 1)
    for i in range(len(bits)):
        if t[i]:
            for j, g in enumerate(gen):
                t[i + j] ^= g                    # modulo-2 subtraction = XOR
    return t[-(len(gen) - 1):]

data = [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0]
msg_p = data + [sum(data) % 2]                  # even parity
msg_c = data + crc(data)

def detected(msg, check):
    n = total = 0
    for i, k in combinations(range(len(msg)), 2):
        bad = [b ^ (j in (i, k)) for j, b in enumerate(msg)]
        n += not check(bad)
        total += 1
    return n, total

parity_ok = lambda u: sum(u) % 2 == 0
crc_ok = lambda u: crc(u[:-4]) == u[-4:]

for name, u, f in [("parity", msg_p, parity_ok), ("CRC-4", msg_c, crc_ok)]:
    n, total = detected(u, f)
    print(f"{name:<8} two-bit errors: {n:>3} / {total} detected ({n / total:.0%})")

# Adjacent errors (bursts) up to 4 bits long
burst = sum(not crc_ok([b ^ (k <= j < k + h) for j, b in enumerate(msg_c)])
            for h in range(1, 5) for k in range(len(msg_c) - h + 1))
print(f"CRC-4: contiguous errors up to 4 bits long: all detected? "
      f"{burst == sum(len(msg_c) - h + 1 for h in range(1, 5))}")
```

Parity notices **not a single** two-bit error (two flipped bits don't change the evenness). CRC-4 catches most two-bit errors and **every** contiguous error run (_burst_) up to 4 bits long – and in reality (a scratched disc, a wire near lightning) errors typically come in clusters. That's why there's a CRC in every Ethernet frame (32-bit), USB packet and ZIP file.

## 5. UTF-8: how many bytes is a letter?

UTF-8 is a **variable-length** encoding: the English alphabet takes one byte (ASCII-compatible), accented letters two, many other symbols three, and emojis four bytes.

```python run
# The UTF-8 bytes of characters, bit by bit
for ch in ["A", "é", "ő", "€", "😀"]:
    b = ch.encode("utf-8")
    print(f"{ch!r:>5} U+{ord(ch):05X}: {len(b)} byte(s)  " + " ".join(f"{x:08b}" for x in b))

text = "Árvíztűrő tükörfúrógép"
print(f"\n{text!r}: {len(text)} characters, {len(text.encode())} bytes in UTF-8")
```

Look at the bit patterns: the start of the first byte reveals the length (`0…` = 1 byte, `110…` = 2, `1110…` = 3, `11110…` = 4), and the continuation bytes all start with `10…`. So the start of the next character can always be found, even from the middle of a text. A practical trap: is a database field "20 characters" or "20 bytes" long? For Hungarian text (the example above is a classic Hungarian test sentence full of accents) these aren't the same!

## Summary

- After an addition the processor sets the **C** (unsigned overflow), **V** (signed overflow), **N** and **Z** flags; the same bit pattern gets two interpretations.
- In binary, 0.1 is an **infinite** fraction, so in floating point it can only be stored rounded; don't compare floating-point numbers with `==`, and don't store money as floating point.
- IEEE 754 single: 1 sign + 8 exponent (bias 127) + 23 mantissa bits.
- Hamming(7,4) corrects every single-bit error, but corrects two-bit errors **wrongly** – that's why SECDED is needed.
- Parity doesn't see an even number of errors; CRC reliably detects contiguous error runs too.
- UTF-8: 1–4 bytes per character; accented Latin letters take 2 bytes.

## Lesson exercise

```quiz required
? 8-bit addition: 100 + 50 (01100100 + 00110010). Which flag becomes 1?
- only C (carry)
+ only V (signed overflow)
- both C and V
- neither
! Unsigned, 150 fits (C = 0); signed, two positives gave a negative (V = 1).

? What is the Hamming(7,4) codeword for the data 1001 (in p1 p2 d1 p4 d2 d3 d4 order)?
= 0011001
! p1 = d1⊕d2⊕d4 = 0, p2 = d1⊕d3⊕d4 = 0, p4 = d2⊕d3⊕d4 = 1.

? What happens if two bits go wrong in a Hamming(7,4) codeword?
- it corrects both
- it signals the error but doesn't correct
+ the syndrome points at a third bit, and the "correction" causes another error
! That's why SECDED has one extra parity bit.

? How many bytes does the letter "ő" take in UTF-8?
= 2
! Accented Latin letters take 2 bytes, the euro sign 3, emojis 4.

? How many bits make up the exponent field of an IEEE 754 single (32-bit) number?
= 8
! 1 sign bit + 8 exponent bits + 23 mantissa bits.
```
