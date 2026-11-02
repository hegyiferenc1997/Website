---
title: Registers – Storage and Shift Registers
summary: Parallel storage register, shift register (SISO, SIPO, PISO, PIPO), bidirectional shifting, ring and Johnson counters, serial–parallel conversion.
minutes: 30
---

## What you will learn

- what a **register** is and how it is built from D flip-flops,
- how the **storage register** and the **shift register** work,
- the four shifting modes: **SISO, SIPO, PISO, PIPO**,
- how shifting becomes **multiplication and division by two**,
- the **ring** and **Johnson counters**.

## What is a register?

A **register** is n flip-flops with a **common clock** that store an n-bit word. A processor's registers are its fastest storage: they hold the data and addresses being processed and the program counter.

## Storage register (parallel register)

Each bit is a D flip-flop; at the clock edge they take the values of inputs D<sub>0</sub>…D<sub>n−1</sub> **simultaneously**. A **LOAD** (or enable) signal controls whether it loads at a given edge:

**Q<sub>i</sub><sup>+</sup> = LOAD·D<sub>i</sub> + LOAD̅·Q<sub>i</sub>**

(This is a 2:1 multiplexer in front of every flip-flop: it feeds back either the new data or its own output.) Common additions are **clear** (CLR) and a **three-state output**, so that the register can be connected to a bus.

## Shift register

The flip-flops are **chained**: each D input is the previous Q output. At every clock edge each bit **moves one place along**, and the first flip-flop receives the value of the **serial input** (SI).

**Example** – a 4-bit register; the serial input enters the leftmost bit and the contents shift right. Initially 0000, the input receives 1, 1, 0, 1 in turn:

| edge | SI  | contents |
| ---- | --- | -------- |
| –    | –   | 0000     |
| 1    | 1   | 1000     |
| 2    | 1   | 1100     |
| 3    | 0   | 0110     |
| 4    | 1   | 1011     |

### The four modes of operation

| mode     | input    | output   | use                                                    |
| -------- | -------- | -------- | ------------------------------------------------------ |
| **SISO** | serial   | serial   | delay by n clocks                                      |
| **SIPO** | serial   | parallel | serial → parallel (e.g. UART receiver, **74HC595**)    |
| **PISO** | parallel | serial   | parallel → serial (e.g. UART transmitter, **74HC165**) |
| **PIPO** | parallel | parallel | storage register                                       |

The **74HC595** is popular in Arduino projects: three wires control 8 (when cascaded, 16, 24 …) outputs.

**Bidirectional (universal) shift register:** a control signal selects left or right shift, parallel load and hold (e.g. **74194**).

## Shifting = multiplication and division

For a binary number, shifting one place **left multiplies by 2**, shifting **right divides by 2** (taking the integer part):

- 0011 (3) ← left → 0110 (6)
- 0110 (6) → right → 0011 (3)

For signed numbers the sign bit must be repeated during a right shift (**arithmetic** shift). That is why processors multiply quickly by powers of 2 (`x << 3` = 8x).

## Ring counter and Johnson counter

If the output of a shift register is **fed back** to its input, we get a counter:

- **Ring counter:** Q<sub>n−1</sub> → D<sub>0</sub>. It circulates a single 1: 1000 → 0100 → 0010 → 0001 → 1000. n flip-flops → **n states**. Its outputs can be used without decoding (e.g. stepper motor phases).
- **Johnson counter** (twisted ring): Q̅<sub>n−1</sub> → D<sub>0</sub>. 0000 → 1000 → 1100 → 1110 → 1111 → 0111 → 0011 → 0001 → 0000. n flip-flops → **2n states**, and only **one bit changes** at a time (no decoding glitches).

**Outlook – LFSR:** if the feedback is the XOR of a few bits, we get a **linear-feedback shift register**, which produces a pseudo-random sequence (CRC computation, encryption, test patterns).

```python run
# Simulating a 4-bit shift register, ring and Johnson counters
def shift(reg, inp):
    return [inp] + reg[:-1]         # the serial input enters on the left, every bit moves right

reg = [0, 0, 0, 0]
for inp in [1, 1, 0, 1]:
    reg = shift(reg, inp)
print("shift register:", "".join(map(str, reg)))

ring, johnson = [1, 0, 0, 0], [0, 0, 0, 0]
for _ in range(8):
    print("ring:", "".join(map(str, ring)), " Johnson:", "".join(map(str, johnson)))
    ring = shift(ring, ring[-1])
    johnson = shift(johnson, 1 - johnson[-1])
```

## Summary

- Register: n D flip-flops with a common clock; storage register with a LOAD signal.
- Shift register: SISO, SIPO, PISO, PIPO; serial ↔ parallel conversion.
- Left shift ×2, right shift ÷2.
- Ring counter: n states; Johnson counter: 2n states.

## Lesson exercise

```quiz required
? A 4-bit shift register starts at 0000; the serial input enters the leftmost bit and every edge shifts the contents right. The input receives 1, 0, 1, 1 in turn. What are the contents after the 4th edge?
= 1101
! 1000 → 0100 → 1010 → 1101.

? Which mode converts serial data into parallel?
- SISO
+ SIPO
- PISO
- PIPO
! Serial input, parallel output.

? The binary number 0101 (5) is shifted one place left (on 4 bits). What is the result in decimal?
= 10
! A left shift = multiplication by 2.

? How many different states does a ring counter with 4 flip-flops have?
= 4

? How many different states does a Johnson counter with 4 flip-flops have?
= 8
! 2n states.

? One bit of a storage register controlled by a LOAD signal: what is the next state (Q: present, L: LOAD, D: data)?
expr: L, D, Q -> L·D + L'·Q
! LOAD = 1: load, LOAD = 0: hold.
```
