---
title: Decoder, Encoder and Comparator
summary: Binary decoder (2→4, 3→8), implementing functions with a decoder, encoder and priority encoder, one- and multi-bit comparators.
minutes: 30
---

## What you will learn

- what a **decoder** is and how the **2→4** and **3→8** decoders work,
- how to implement a function with **a decoder and an OR gate**,
- what an **encoder** and a **priority encoder** are,
- how one- and multi-bit **(magnitude) comparators** are built.

## The decoder

For an n-bit input code a **binary decoder** activates **exactly one of 2<sup>n</sup> outputs** – the one whose number equals the input value. (An “n → 2<sup>n</sup>” decoder.)

### 2→4 decoder

| A1 A0 | Y0 | Y1 | Y2 | Y3 |
| ----- | -- | -- | -- | -- |
| 0 0   | 1  | 0  | 0  | 0  |
| 0 1   | 0  | 1  | 0  | 0  |
| 1 0   | 0  | 0  | 1  | 0  |
| 1 1   | 0  | 0  | 0  | 1  |

Y0 = A̅1·A̅0, **Y1 = A̅1·A0**, Y2 = A1·A̅0, Y3 = A1·A0 – every output is **one minterm**.

In practice the outputs are often **active low** (the selected output is 0, the others 1), and there is an **enable** input. The classic **74138** is a 3→8 decoder with three enable inputs (G1, G̅2A, G̅2B) – with them several decoders can be cascaded (two 3→8 → one 4→16).

**Applications:** **address decoding** (selecting from the processor's address bus which memory or peripheral chip should be active – “chip select”), displays, driving the rows of a keyboard matrix.

## A function with a decoder

Since every output is a minterm, **collecting the outputs corresponding to the function's minterms with an OR gate** implements any function. A 3→8 decoder + two OR gates = **full adder**:

- S = Σm(1, 2, 4, 7) → Y1 + Y2 + Y4 + Y7
- C<sub>out</sub> = Σm(3, 5, 6, 7) → Y3 + Y5 + Y6 + Y7

(With active-low outputs a **NAND** gate is needed instead of OR – De Morgan.)

## The encoder

The **encoder** is the inverse of the decoder: from 2<sup>n</sup> inputs it outputs the **number** of the active input on n bits. A plain encoder assumes that only one input is active at a time.

### Priority encoder

If several inputs are active at once, the **priority encoder** outputs the number of the one with the **highest priority** (here: the highest number). A **V** (valid) output shows whether any input is active at all.

4→2 priority encoder (D3 is the strongest):

| D3 D2 D1 D0 | Y1 Y0 | V |
| ----------- | ----- | - |
| 0 0 0 0     | X X   | 0 |
| 0 0 0 1     | 0 0   | 1 |
| 0 0 1 X     | 0 1   | 1 |
| 0 1 X X     | 1 0   | 1 |
| 1 X X X     | 1 1   | 1 |

**Y1 = D3 + D2**, **Y0 = D3 + D̅2·D1**, **V = D3 + D2 + D1 + D0**

**Applications:** interrupt controller (which device requests service most urgently), keyboard. Well-known IC: **74148** (8→3, active low).

## The comparator

A **magnitude comparator** compares two numbers and has three outputs: **A > B**, **A = B**, **A < B**.

### One-bit comparator

| A | B | G (A>B) | E (A=B) | L (A<B) |
| - | - | ------- | ------- | ------- |
| 0 | 0 | 0       | 1       | 0       |
| 0 | 1 | 0       | 0       | 1       |
| 1 | 0 | 1       | 0       | 0       |
| 1 | 1 | 0       | 1       | 0       |

**G = A·B̅**, **E = A ⊙ B** (XNOR), **L = A̅·B**

### Multi-bit comparator

Per bit E<sub>i</sub> = A<sub>i</sub> ⊙ B<sub>i</sub>. For four bits:

- **A = B** if all bits match: E = E3·E2·E1·E0
- **A > B** if A holds the 1 at the **highest differing** bit: G = G3 + E3·G2 + E3·E2·G1 + E3·E2·E1·G0
- **A < B**: the same with Ls (or L = (G + E)̅).

The **7485** is a cascadable 4-bit comparator IC (extendable to 8, 12 … bits with its cascade inputs).

```python run
# Priority encoder and a 4-bit comparator bit by bit
def priority(d3, d2, d1, d0):
    y1 = d3 | d2
    y0 = d3 | ((1 - d2) & d1)
    v = d3 | d2 | d1 | d0
    return y1, y0, v

print("priority 0110 →", priority(0, 1, 1, 0))   # D2 wins

def comparator(a, b):
    for i in range(3, -1, -1):                     # from the top bit downwards
        ai, bi = (a >> i) & 1, (b >> i) & 1
        if ai != bi:
            return "A>B" if ai else "A<B"
    return "A=B"

print("1011 vs 1001 →", comparator(0b1011, 0b1001))
```

## Summary

- Decoder: n inputs → 2<sup>n</sup> outputs, each a minterm; decoder + OR = any function.
- Encoder: the number of the active input; priority encoder: the number of the strongest active input + a V signal.
- Comparator: G = AB̅, E = A ⊙ B, L = A̅B; for several bits the highest differing bit decides.

## Lesson exercise

```quiz required
? Give the function of output Y1 of the 2→4 decoder!
expr: A1, A0 -> A1'·A0
! Y1 is active when the input is 01.

? How many outputs does a binary decoder with a 4-bit input have?
= 16
! 2^4.

? A full adder is built from a 3→8 decoder and an OR gate. Which outputs must be ORed to produce the sum (S)? (Numbers separated by commas, ascending!)
= 1, 2, 4, 7
! S = 1 if an odd number of inputs are 1.

? Write output Y0 of the 4→2 priority encoder as simply as possible (D3 is the strongest)!
expr: D3, D2, D1, D0 -> D3 + D2'D1
limit: 3
same: D3 + D3'D2'D1
! Y0 = 1 if the winner is input 3 or input 1.

? Fill in the truth table of the one-bit comparator (G: A>B, E: A=B, L: A<B)!
table: A, B -> G = A·B'; E = A ⊙ B; L = A'·B

? The outputs of a 74138 decoder are active low. What happens when the input ABC = 101 arrives (enabled)?
- Output Y5 is 1, the others 0.
+ Output Y5 is 0, the others 1.
- All outputs are 0.
- Output Y2 is 0, the others 1.
! Active low: the selected output goes to 0.
```
