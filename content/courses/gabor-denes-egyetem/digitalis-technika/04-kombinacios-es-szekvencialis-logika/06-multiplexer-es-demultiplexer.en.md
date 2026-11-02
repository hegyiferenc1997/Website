---
title: Multiplexer and Demultiplexer
summary: Structure of the data selector (MUX) and data distributor (DEMUX), select and enable inputs, the 4:1 MUX and 1:4 DEMUX, implementing a logic function with a multiplexer.
minutes: 30
---

## What you will learn

- what a **multiplexer** (MUX, data selector) and a **demultiplexer** (DEMUX, data distributor) are,
- how the **select** and **enable** inputs work,
- the functions of the **2:1, 4:1** MUX and the **1:4** DEMUX,
- how to implement **any logic function** with a multiplexer,
- where they are used in practice.

## The multiplexer

A **multiplexer** connects **one of several data inputs to the output** – the one whose number is given in binary by the **select inputs**. It is like a rotary switch, only electronic.

- 2<sup>n</sup> data inputs need **n select** inputs: 2:1 → 1, 4:1 → 2, 8:1 → 3, 16:1 → 4.
- There is often an **enable** input (E̅, frequently active low): when disabled, the output is 0.

### 2:1 multiplexer

| S | Y  |
| - | -- |
| 0 | D0 |
| 1 | D1 |

**Y = S̅·D0 + S·D1**

### 4:1 multiplexer

| S1 S0 | Y  |
| ----- | -- |
| 0 0   | D0 |
| 0 1   | D1 |
| 1 0   | D2 |
| 1 1   | D3 |

**Y = S̅1·S̅0·D0 + S̅1·S0·D1 + S1·S̅0·D2 + S1·S0·D3**

Each data input has an AND gate that passes it only for its “own” select combination; an OR gate collects the four AND gates. The AND gates are effectively driven by a **2→4 decoder** (next lesson).

## The demultiplexer

A **demultiplexer** works the other way round: it routes **one** data input to **one of several outputs** according to the select inputs; the other outputs are 0.

### 1:4 demultiplexer

| S1 S0 | Y0 | Y1 | Y2 | Y3 |
| ----- | -- | -- | -- | -- |
| 0 0   | D  | 0  | 0  | 0  |
| 0 1   | 0  | D  | 0  | 0  |
| 1 0   | 0  | 0  | D  | 0  |
| 1 1   | 0  | 0  | 0  | D  |

Y0 = D·S̅1·S̅0, Y1 = D·S̅1·S0, **Y2 = D·S1·S̅0**, Y3 = D·S1·S0

If input D is regarded as an enable, the demultiplexer is a **decoder with enable** – which is why catalogues often call it a “decoder/demultiplexer” (e.g. 74139, 74155).

## A logic function with a multiplexer

A multiplexer is a **universal function generator**:

**Method 1 – 2<sup>n</sup>:1 MUX, n variables:** the variables go to the select inputs and the output column of the truth table (constant 0 or 1) goes to the data inputs. An 8:1 MUX implements any three-variable function.

**Method 2 – 2<sup>n−1</sup>:1 MUX, n variables:** the first n−1 variables are the select inputs, and the last variable (or its complement, 0, 1) goes to the data inputs. This is the **Shannon expansion**: F = A̅·F(A=0) + A·F(A=1).

**Example – the majority function with a 4:1 MUX** (select: A, B; data from C):

| A B | F as a function of C | data input |
| --- | -------------------- | ---------- |
| 0 0 | 0 (always)           | D0 = 0     |
| 0 1 | 1 if C = 1           | D1 = C     |
| 1 0 | 1 if C = 1           | D2 = C     |
| 1 1 | 1 (always)           | D3 = 1     |

The logic cells of FPGAs (**LUT**, look-up table) work exactly like this: a small memory stores the truth table and a multiplexer selects the row given by the inputs.

## Applications

- **Data path selection:** a MUX in front of a processor's ALU selects where an operand comes from (register or constant).
- **Parallel → serial conversion:** a counter steps the select inputs, so the parallel bits appear at the output one after another.
- **Time-division multiplexing** (TDM): several signals on one wire; a DEMUX distributes them at the receiver.
- **Display multiplexing:** several 7-segment digits receive data in turn.

Well-known ICs: **74157** (4× 2:1), **74153** (2× 4:1), **74151** (8:1), **74139** (2× 1:4 DEMUX / 2→4 decoder).

```python run
# A 4:1 multiplexer and the majority function implemented with it
def mux4(s1, s0, d):
    return d[2 * s1 + s0]          # the select bits give the index in binary

for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            f = mux4(a, b, [0, c, c, 1])
            print(a, b, c, "→", f)
```

## Summary

- MUX: 2<sup>n</sup> data inputs, n select inputs, 1 output; DEMUX: 1 input, n select inputs, 2<sup>n</sup> outputs.
- 4:1 MUX: Y = S̅1S̅0D0 + S̅1S0D1 + S1S̅0D2 + S1S0D3.
- Any logic function can be implemented with a multiplexer (Shannon expansion, FPGA LUT).

## Lesson exercise

```quiz required
? Fill in the truth table of the 2:1 multiplexer!
table: S, D0, D1 -> Y = S'·D0 + S·D1
! For S = 0, D0 reaches the output; for S = 1, D1.

? How many select inputs does an 8:1 multiplexer have?
= 3
! 2^3 = 8.

? On a 4:1 multiplexer S1 S0 = 10. Which data input (D number) reaches the output?
= 2
= D2
! 10 in binary is 2.

? The data inputs of a 4:1 multiplexer are D0 = 0, D1 = 1, D2 = 1, D3 = 0. Which function of the select inputs (S1, S0) does it implement? Write it as an expression!
expr: S1, S0 -> S1 ⊕ S0
! The output is 1 when S1 S0 = 01 or 10.

? Give output Y2 of the 1:4 demultiplexer!
expr: D, S1, S0 -> D·S1·S0'
! Y2 receives D when S1 S0 = 10.

? The three-variable majority function is implemented with a 4:1 MUX (select: A, B). What goes to inputs D0, D1, D2, D3?
- 0, 0, 0, 1
+ 0, C, C, 1
- C, 0, 0, C
- 1, C, C, 0
! AB = 00: never a majority; 11: always; for 01 and 10, C decides.
```
