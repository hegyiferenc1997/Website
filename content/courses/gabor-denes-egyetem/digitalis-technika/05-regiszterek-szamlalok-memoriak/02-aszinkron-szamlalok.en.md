---
title: Asynchronous (Ripple) Counters
summary: Asynchronous counters built from toggle flip-flops, counting up and down, modulo-N counters with clearing, frequency division, accumulating delays.
minutes: 25
---

## What you will learn

- how an **asynchronous** (ripple) counter counts,
- how it becomes an **up** or **down** counter,
- how to make a **modulo-N** counter (e.g. a decade counter) with asynchronous clearing,
- why **delays accumulate** and which **transient states** appear.

## The counter

A **counter** is a sequential circuit that stores the number of clock pulses (events), and whose states follow each other in a predefined **order**. If the number of states is N, it is a **modulo-N** counter; n flip-flops can have at most 2<sup>n</sup> states.

## The asynchronous binary counter

Chain **falling-edge triggered** T flip-flops (JK, J = K = 1):

- the clock of the **first** flip-flop (Q0) is the input pulse,
- the clock of every further flip-flop is the **Q output of the previous flip-flop**.

Q0 toggles at every falling edge; Q1 when Q0 changes 1 → 0; Q2 when Q1 changes 1 → 0 … The result is the binary sequence: 0000, 0001, 0010, …, 1111, then 0000 again.

```text
CLK  _|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_
Q0   ___|‾‾‾|___|‾‾‾|___|‾‾‾|___|‾‾‾|_
Q1   _______|‾‾‾‾‾‾‾|_______|‾‾‾‾‾‾‾|_
Q2   _______________|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|_
```

Every stage **halves** the frequency: Q0 = f/2, Q1 = f/4, Q2 = f/8, Q3 = f/16 – the counter is also a **frequency divider**.

## Up and down

- **Up** counter: falling-edge triggered flip-flops, the next stage is clocked by **Q**.
- **Down** counter: the next stage is clocked by **Q̅** (or rising-edge flip-flops with Q): 1111, 1110, 1101, …
- **Up/down counter:** a control signal selects between Q and Q̅ with a multiplexer in front of every stage.

## Modulo-N counter with asynchronous clear

If N is not a power of 2, the counter is **cleared when state N is reached**. A gate watches for the code of N to appear and drives the flip-flops' **asynchronous CLR** inputs.

**Decade (decimal) counter:** 0000 … 1001, then 0000. The first forbidden state is **1010** (10): in it Q3 = Q1 = 1, which never happen together between 0 and 9. So a single **NAND(Q3, Q1)** gate driving the active-low CLR̅ inputs is enough.

Drawback: state 1010 **appears briefly** (until the clear completes) – a glitch on the outputs. Such counters are the **7490** (decimal) and **7493** (4-bit binary) ICs.

**How many flip-flops?** The smallest n with 2<sup>n</sup> ≥ N. E.g. N = 60 → 2<sup>6</sup> = 64 ≥ 60 → **6** flip-flops.

## Accumulating delays

Since every stage waits for the previous output, the delays **add up**: for n stages the worst case (e.g. 0111 → 1000) is **n · t<sub>pd</sub>**. Meanwhile **transient, false states** are visible on the outputs – 0111 → 0110 → 0100 → 0000 → 1000.

Because of this the asynchronous counter is:

- **simple** and uses few parts (no extra logic),
- but **slow** for many bits, and **decoding** its outputs may cause **glitches**.

It is excellent for frequency division (e.g. watch crystal 32,768 Hz → 1 Hz, the **4060** IC); where the counter state must be read exactly, a **synchronous** counter is used (next lesson).

```python run
# 4-bit asynchronous counter: printing the transient states of the 0111 → 1000 change
state = [1, 1, 1, 0]                   # Q0, Q1, Q2, Q3 (0111)
print("start:    ", "".join(map(str, reversed(state))))
i = 0
while True:                            # Q0 toggles, and while it changes 1 → 0 it clocks the next stage
    old = state[i]
    state[i] = 1 - old
    print("transient:" if old == 1 and i < 3 else "final:    ", "".join(map(str, reversed(state))))
    if old == 0 or i == 3:
        break
    i += 1
```

## Summary

- Asynchronous counter: toggle flip-flops in a chain, each clocked by the previous output.
- Every stage halves the frequency (Q<sub>i</sub> = f / 2<sup>i+1</sup>).
- Modulo-N: decoding state N and asynchronous clearing (decade counter: NAND(Q3, Q1)).
- Drawback: accumulating delay (n · t<sub>pd</sub>) and transient states.

## Lesson exercise

```quiz required
? What is the largest number a 4-bit asynchronous binary counter reaches?
= 15
! 2^4 − 1.

? A 4-bit asynchronous counter receives a 1 MHz clock. What is the frequency of output Q3 in kHz?
= 62.5
= 62,5
! Every stage halves: 1000 kHz / 16.

? An asynchronous decade counter is built from flip-flops with active-low CLR̅ inputs. Which gate is needed for clearing?
- NAND(Q2, Q0)
+ NAND(Q3, Q1)
- NOR(Q3, Q1)
- AND(Q3, Q2, Q1, Q0)
! The clear is triggered by state 10 = 1010.

? At least how many flip-flops does a modulo-60 counter need?
= 6
! The smallest n with 2^n ≥ 60.

? Each flip-flop of a 4-stage asynchronous counter has a delay of 10 ns. In the worst case, after how many ns is the final state settled?
= 40
= 40ns
! The delays add up.

? What is the main drawback of the asynchronous counter?
- It needs many extra gates.
+ The delays accumulate and transient false states appear.
- It cannot be used for frequency division.
- It can only count down.
```
