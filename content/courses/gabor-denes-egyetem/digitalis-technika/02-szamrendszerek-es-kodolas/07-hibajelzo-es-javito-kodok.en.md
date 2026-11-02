---
title: Error-Detecting and Error-Correcting Codes
summary: Parity bit, Hamming distance, the Hamming(7,4) code with syndrome, and CRC cyclic redundancy check by modulo-2 division.
minutes: 30
---

## What you will learn

- how a **parity bit** signals an error,
- what **Hamming distance** is and what it tells about a code,
- how the **Hamming(7,4)** code **corrects** a bit error,
- how to compute a **CRC** by modulo-2 division.

## Why do we need them?

During transmission and storage, noise, radiation or a faulty cell can **flip a bit** (0 ↔ 1). So we add **redundant** bits to the data (extra, but useful for checking):

- an **error-detecting** code notices the error (we ask for retransmission),
- an **error-correcting** code also tells which bit went wrong and fixes it.

## Parity bit

A **parity bit** is appended to the data bits so that the number of ones becomes

- **even** with even parity,
- **odd** with odd parity.

**Example (even parity):** 1011001 → four ones → parity bit **0** → 1011001**0**.
The parity bit is really the **XOR** of the data bits: 1 ⊕ 0 ⊕ 1 ⊕ 1 ⊕ 0 ⊕ 0 ⊕ 1 = 0.

The receiver recomputes it: if it does not match, an error happened. Limitation: it detects **one** (or any odd number of) bit errors, but not two, and it **cannot tell which** bit is wrong.

## Hamming distance

**Richard Wesley Hamming** (1915–1998), an American mathematician at Bell Labs, designed a whole family of error-correcting codes and opened a new field of research; he received the **Turing Award** in 1968.

The **Hamming distance** of two codewords of equal length is the number of positions where they differ (= the number of ones in their XOR).

```text
 1011101
 1001001
   ↑ ↑        → Hamming distance 2
```

The **minimum Hamming distance** (d<sub>min</sub>) of a code is the smallest distance between its codewords. From it:

| d<sub>min</sub> | Detects             | Corrects           | Example                            |
| --------------- | ------------------- | ------------------ | ---------------------------------- |
| 1               | –                   | –                  | every bit combination is valid     |
| 2               | 1 bit               | –                  | parity bit                         |
| 3               | 2 bits              | 1 bit              | Hamming(7,4)                       |
| *d*             | *d* − 1 bits        | ⌊(*d* − 1) / 2⌋ bits | –                                |

## The Hamming(7,4) code

For 4 data bits (d<sub>1</sub>…d<sub>4</sub>) we add 3 parity bits (p<sub>1</sub>, p<sub>2</sub>, p<sub>4</sub>); the parity bits go to positions that are **powers of 2**:

| position | 1              | 2              | 3              | 4              | 5              | 6              | 7              |
| -------- | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- | -------------- |
| bit      | p<sub>1</sub>  | p<sub>2</sub>  | d<sub>1</sub>  | p<sub>4</sub>  | d<sub>2</sub>  | d<sub>3</sub>  | d<sub>4</sub>  |

Each parity bit checks (with even parity) the positions whose index has its bit set:

- p<sub>1</sub> = d<sub>1</sub> ⊕ d<sub>2</sub> ⊕ d<sub>4</sub> (positions 1, 3, 5, 7)
- p<sub>2</sub> = d<sub>1</sub> ⊕ d<sub>3</sub> ⊕ d<sub>4</sub> (positions 2, 3, 6, 7)
- p<sub>4</sub> = d<sub>2</sub> ⊕ d<sub>3</sub> ⊕ d<sub>4</sub> (positions 4, 5, 6, 7)

**Encoding – example:** data = 1011 (d<sub>1</sub>=1, d<sub>2</sub>=0, d<sub>3</sub>=1, d<sub>4</sub>=1)
p<sub>1</sub> = 1⊕0⊕1 = 0, p<sub>2</sub> = 1⊕1⊕1 = 1, p<sub>4</sub> = 0⊕1⊕1 = 0 → codeword: **0110011**.

**Correction – syndrome:** the receiver recomputes the three checks (s<sub>1</sub>, s<sub>2</sub>, s<sub>4</sub>). If all are 0, there is no error. Otherwise **the binary number s<sub>4</sub>s<sub>2</sub>s<sub>1</sub> is the position of the wrong bit**!

If **0110111** arrives instead of 0110011 (bit 5 flipped):
s<sub>1</sub> = b<sub>1</sub>⊕b<sub>3</sub>⊕b<sub>5</sub>⊕b<sub>7</sub> = 0⊕1⊕1⊕1 = 1, s<sub>2</sub> = b<sub>2</sub>⊕b<sub>3</sub>⊕b<sub>6</sub>⊕b<sub>7</sub> = 1⊕1⊕1⊕1 = 0, s<sub>4</sub> = b<sub>4</sub>⊕b<sub>5</sub>⊕b<sub>6</sub>⊕b<sub>7</sub> = 0⊕1⊕1⊕1 = 1
→ syndrome 101<sub>2</sub> = **5** → flip bit 5 back ✓

An extended version of the Hamming code (SECDED) protects the **ECC memory** of servers.

## CRC – cyclic redundancy check

**CRC** is an error-detecting code: we compute the remainder of a **modulo-2 division** of the data by a **generator polynomial**, and append it to the data. The receiver divides the whole message by the same polynomial: **if the remainder is 0, the data is error-free**.

In modulo-2 arithmetic there is no carry: addition and subtraction are both **XOR**.

**Steps** (generator of *k*+1 bits → *k*-bit CRC):

1. Append *k* zeros to the data.
2. Do modulo-2 division: wherever the remainder starts with 1, write the generator below and XOR.
3. The last *k* bits are the CRC.

**Example:** data = 1101011011, generator = 10011 (x<sup>4</sup> + x + 1) → append 4 zeros.

```text
 11010110110000      ← data + 4 zeros
 10011               ← XOR (under the first 1)
 ──────────────
 01001110110000
  10011              ← XOR
 ──────────────
 00000010110000
       10011         ← XOR
 ──────────────
 00000000101000
         10011       ← XOR
 ──────────────
 00000000001110      → remainder (CRC) = 1110
```

The message sent: 1101011011 **1110**. Dividing it by 10011 the receiver gets remainder 0.

| CRC type  | Length   | Common use                             |
| --------- | -------- | -------------------------------------- |
| CRC-8     | 8 bits   | simple protocols (e.g. SMBus)          |
| CRC-16    | 16 bits  | industrial serial links (e.g. Modbus, USB) |
| CRC-32    | 32 bits  | Ethernet, ZIP, PNG files               |
| CRC-64    | 64 bits  | systems needing high data integrity    |

```python run
# CRC by modulo-2 division (XOR)
def crc(data, generator):
    k = len(generator) - 1
    bits = [int(b) for b in data + "0" * k]       # append k zeros
    gen = [int(b) for b in generator]
    for i in range(len(data)):
        if bits[i] == 1:                            # where there is a 1, XOR with the generator
            for j in range(len(gen)):
                bits[i + j] ^= gen[j]
    return "".join(str(b) for b in bits[-k:])

remainder = crc("1101011011", "10011")
print("CRC:", remainder)
```

> CRC is simple in hardware: a **shift register** and a few **XOR gates** (topic 5) compute it bit by bit, one bit per clock.

## Summary

- Parity: detects 1 bit error, does not correct.
- Hamming distance: number of differing bits; d<sub>min</sub> = 3 → 1 bit correctable.
- Hamming(7,4): the syndrome gives the position of the wrong bit.
- CRC: remainder of modulo-2 division; remainder 0 = error-free.

## Lesson exercise

```quiz required
? What is the **even** parity bit for the data 1101001?
= 0
! Count the ones: if even, the parity bit is 0.

? What is the **odd** parity bit for the same data (1101001)?
= 1
! With odd parity the number of ones including the parity bit is odd.

? What is the Hamming distance between 1011101 and 1001001?
= 2
! Count the positions where they differ.

? How many bit errors can a code with d<sub>min</sub> = 5 **correct**?
= 2
! ⌊(d − 1) / 2⌋.

? What is the Hamming(7,4) codeword of the data 1001 (in the order p<sub>1</sub> p<sub>2</sub> d<sub>1</sub> p<sub>4</sub> d<sub>2</sub> d<sub>3</sub> d<sub>4</sub>)?
= 0011001
! p<sub>1</sub> = d<sub>1</sub>⊕d<sub>2</sub>⊕d<sub>4</sub>, p<sub>2</sub> = d<sub>1</sub>⊕d<sub>3</sub>⊕d<sub>4</sub>, p<sub>4</sub> = d<sub>2</sub>⊕d<sub>3</sub>⊕d<sub>4</sub>.

? For a Hamming(7,4) codeword the syndrome s<sub>4</sub>s<sub>2</sub>s<sub>1</sub> = 110. Which bit is wrong?
= 6
! The binary value of the syndrome is the position of the wrong bit.

? What is the CRC of the data 11010110 with the generator 1011 (3 bits)?
= 111
! Append 3 zeros to the data and do modulo-2 (XOR) division.
```
