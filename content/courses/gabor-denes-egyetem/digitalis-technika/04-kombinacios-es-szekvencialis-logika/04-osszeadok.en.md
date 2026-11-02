---
title: Adders – Half, Full and Multi-bit Adders
summary: Half adder, full adder, ripple-carry and carry-lookahead adders, subtraction with two's complement, overflow.
minutes: 30
---

## What you will learn

- the truth table and formulas of the **half adder** and the **full adder**,
- how a **multi-bit** adder is built from full adders,
- what **carry propagation delay** is and how **carry-lookahead** speeds it up,
- how an adder becomes a **subtractor** (two's complement),
- how **overflow** is detected.

## Half adder

It adds two one-bit numbers: its outputs are the **sum** (S) and the **carry** (C).

| A | B | S | C |
| - | - | - | - |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

**S = A ⊕ B**, **C = A · B** – one XOR and one AND gate.

It is called “half” because it **cannot accept an incoming carry**, so it can only be used in the least significant position.

## Full adder

It adds three bits: A, B and the incoming carry **C<sub>in</sub>**. Outputs: S and C<sub>out</sub>.

| A | B | C<sub>in</sub> | S | C<sub>out</sub> |
| - | - | -------------- | - | --------------- |
| 0 | 0 | 0              | 0 | 0               |
| 0 | 0 | 1              | 1 | 0               |
| 0 | 1 | 0              | 1 | 0               |
| 0 | 1 | 1              | 0 | 1               |
| 1 | 0 | 0              | 1 | 0               |
| 1 | 0 | 1              | 0 | 1               |
| 1 | 1 | 0              | 0 | 1               |
| 1 | 1 | 1              | 1 | 1               |

- **S = A ⊕ B ⊕ C<sub>in</sub>** – the sum is 1 if an odd number of inputs are 1.
- **C<sub>out</sub> = A·B + C<sub>in</sub>·(A ⊕ B)** – or, simplified with a K-map, the **majority function**: C<sub>out</sub> = AB + AC<sub>in</sub> + BC<sub>in</sub>.

It can be built from **two half adders and an OR gate**: the first half adder adds A and B, the second adds C<sub>in</sub> to the result, and an OR gate combines the two carries.

## Multi-bit ripple-carry adder

For n-bit numbers, **n full adders** are chained: the C<sub>out</sub> of stage i drives the C<sub>in</sub> of stage i+1. The C<sub>in</sub> of the lowest stage is 0 (or a half adder is used there).

**Example:** 0111 + 0101

```text
carry:     1 1 1 0
           0 1 1 1   (7)
         + 0 1 0 1   (5)
         ---------
           1 1 0 0   (12)
```

**Drawback:** the carry **ripples** through stage after stage. If the carry delay of one stage is t<sub>c</sub>, then in the worst case an n-bit adder gives the correct result only after about **n · t<sub>c</sub>**. At 32–64 bits this is too slow.

## Carry-lookahead (CLA)

Two auxiliary signals are formed for each stage:

- **G<sub>i</sub> = A<sub>i</sub> · B<sub>i</sub>** – **generate**: this stage *produces* a carry in any case;
- **P<sub>i</sub> = A<sub>i</sub> ⊕ B<sub>i</sub>** – **propagate**: this stage *passes on* the incoming carry.

Then C<sub>i+1</sub> = G<sub>i</sub> + P<sub>i</sub>·C<sub>i</sub>, and by expanding it every carry can be computed **directly** from the inputs:

C<sub>2</sub> = G<sub>1</sub> + P<sub>1</sub>G<sub>0</sub> + P<sub>1</sub>P<sub>0</sub>C<sub>0</sub>

Thanks to the two-level logic the carry time **does not grow** with the number of bits (only the gates' fan-in does). In practice 4-bit CLA blocks are cascaded (e.g. 74283 – 4-bit fast adder, 74182 – lookahead carry generator).

## Subtraction: adder-subtractor

Because of two's complement, **A − B = A + B̅ + 1**. With a control signal (M) the adder becomes a subtractor:

- every bit of B passes through an **XOR gate**: B<sub>i</sub> ⊕ M (inverts when M = 1),
- and **C<sub>in</sub> = M** (that is the “+1”).

M = 0 → A + B; M = 1 → A − B.

**Example:** 0110 − 0011 = 0110 + 1100 + 1 = **1 0011** → dropping the carry, **0011** (6 − 3 = 3).

## Overflow

For signed (two's complement) numbers, overflow happens when **the sum of two numbers of the same sign has the opposite sign**. In hardware: **V = C<sub>n</sub> ⊕ C<sub>n−1</sub>** (the carry into the sign bit differs from the carry out of it). For unsigned numbers, the final carry (C<sub>n</sub>) signals overflow.

This is the flag that a processor's **ALU** (arithmetic logic unit) writes into its carry (C) and overflow (V) flag bits.

```python run
# Full adder and a 4-bit ripple-carry adder bit by bit
def full_adder(a, b, c):
    s = a ^ b ^ c
    c_out = (a & b) | (c & (a ^ b))
    return s, c_out

def ripple(a_bits, b_bits):
    # bit lists start from the least significant position
    c, total = 0, []
    for a, b in zip(a_bits, b_bits):
        s, c = full_adder(a, b, c)
        total.append(s)
    return total, c

a = [1, 1, 1, 0]   # 0111 = 7 (reversed order)
b = [1, 0, 1, 0]   # 0101 = 5
s, c = ripple(a, b)
print("sum:", "".join(map(str, reversed(s))), "carry:", c)
```

## Summary

- Half adder: S = A ⊕ B, C = AB. Full adder: S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = AB + C<sub>in</sub>(A ⊕ B).
- The ripple-carry adder is simple, but the carry ripples through it (n · t<sub>c</sub>).
- Carry-lookahead computes the carries in parallel with the signals G = AB and P = A ⊕ B.
- Subtraction: A + B̅ + 1; overflow: V = C<sub>n</sub> ⊕ C<sub>n−1</sub>.

## Lesson exercise

```quiz required
? Fill in the truth table of the half adder (S: sum, C: carry)!
table: A, B -> S = A ⊕ B; C = A·B
! The carry is 1 only for 1 + 1.

? Fill in the truth table of the full adder! (The third input, C, is the incoming carry; Co is the outgoing carry.)
table: A, B, C -> S = A ⊕ B ⊕ C; Co = A·B + C·(A ⊕ B)
! S is 1 if an odd number of inputs are 1; Co if at least two are.

? Simplify the outgoing carry into two-level AND–OR form: Co = AB + C(A ⊕ B)!
expr: A, B, C -> AB + AC + BC
limit: 6
same: A·B + C·(A ⊕ B)
! This is the majority function.

? What is 0111 + 0101 on four bits (in binary)?
= 1100
! 7 + 5 = 12.

? Compute with two's complement on four bits: 0110 − 0011 (in binary)!
= 0011
! 0110 + 1100 + 1, dropping the outgoing carry.

? In a carry-lookahead adder, what is the “generate” signal?
+ G = A·B
- G = A + B
- G = A ⊕ B
- G = A̅·B̅
! A stage produces a carry when both bits are 1.

? In a 16-bit ripple-carry adder the carry delay of one stage is 3 ns. In the worst case, how many ns does the carry take to ripple through?
= 48
= 48ns
! n · t_c
```
