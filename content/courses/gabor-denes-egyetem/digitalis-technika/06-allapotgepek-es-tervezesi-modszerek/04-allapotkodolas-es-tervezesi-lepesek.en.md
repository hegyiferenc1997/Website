---
title: State Encoding, State Minimisation and the Design Flow
summary: Binary, Gray and one-hot state encoding, merging equivalent states, the complete design procedure of a sequential circuit, simulating a state machine with a program.
minutes: 30
---

## What you will learn

- the three most common **state encodings**: binary, Gray, one-hot,
- when to choose which,
- how to **merge equivalent states** (state minimisation),
- the **complete design flow** of a synchronous sequential circuit,
- how to **simulate** a state machine with a program before building it.

## State encoding

For implementation the states (A, B, C …) must be replaced by **binary codes**. The choice affects the number of flip-flops and the complexity of the logic.

| encoding    | 4 states (S0…S3)         | flip-flops for N states  | feature                                     |
| ----------- | ------------------------ | ------------------------ | ------------------------------------------- |
| **binary**  | 00, 01, 10, 11           | ⌈log₂ N⌉                 | the fewest flip-flops                       |
| **Gray**    | 00, 01, 11, 10           | ⌈log₂ N⌉                 | **1 bit** changes between consecutive states |
| **one-hot** | 0001, 0010, 0100, 1000   | **N**                    | always **exactly one** flip-flop is 1       |

- **Binary:** few flip-flops – where flip-flops are expensive (discrete ICs, ASIC).
- **Gray:** if the machine mostly steps in order (counter-like), fewer bits change at once → lower power, fewer hazards on decoded outputs.
- **One-hot:** many flip-flops, but the next-state and output logic is very **simple and fast** (each state is one bit, an output is often the flip-flop itself). It is the default on **FPGAs**, where flip-flops are plentiful and small logic is faster.

## State minimisation

A state diagram written from a word problem often contains **more states** than necessary. Two states are **equivalent** if

1. their **outputs** are the same for every input, and
2. for every input they go to **equivalent states**.

Equivalent states can be **merged** – the machine's behaviour does not change from outside, but fewer states, perhaps fewer flip-flops, are needed.

**Example** (Moore machine):

| state / output    | x = 0 | x = 1 |
| ----------------- | ----- | ----- |
| S0 / 0            | S1    | S2    |
| S1 / 0            | S0    | S3    |
| S2 / 0            | S0    | S3    |
| S3 / 1            | S3    | S0    |

S1 and S2 have the same output (0) and go to the same places (x = 0 → S0, x = 1 → S3) → **S1 ≡ S2**, they can be merged. The machine will have 3 states instead of 4 – the number of flip-flops does not decrease here (both need 2), but the logic gets simpler.

The systematic method is **partitioning** (group the states by their outputs, then keep splitting groups until the members of each group go to the same groups) or the **implication table**.

## The complete design flow

1. Clarify the **word specification**: inputs, outputs, what should happen in every case (reset, simultaneous signals!).
2. **Choose the model:** Moore or Mealy.
3. Draw the **state diagram** – every state needs an arrow for every input!
4. **State table**, then **state minimisation**.
5. **State encoding** (binary, Gray, one-hot).
6. Choose the **flip-flop type** (D, JK, T) and derive the excitation from the **excitation table**.
7. **K-maps**, simplification: next-state logic and output logic.
8. Check the **unused states** (self-starting, safe return).
9. **Simulation** (program or HDL testbench) and **implementation** (gates, FPGA).

In modern practice steps 6–7 are done by the **synthesis tool**: the designer describes the state machine in an HDL (VHDL, Verilog), and the tool chooses an encoding and simplifies. The way of thinking – states, transitions, outputs – is the same.

## Simulating a state machine with a program

In a program a state table is a **dictionary**: (state, input) → (next state, output). This lets you try the design before building it.

```python run
# The state table of the "101" Moore detector as a dictionary, and running it
transition = {
    ("A", 0): "A", ("A", 1): "B",
    ("B", 0): "C", ("B", 1): "B",
    ("C", 0): "A", ("C", 1): "D",
    ("D", 0): "C", ("D", 1): "B",
}
output = {"A": 0, "B": 0, "C": 0, "D": 1}    # Moore: the output belongs to the state

state = "A"
for x in [1, 0, 1, 0, 1, 1, 0, 1]:
    state = transition[(state, x)]
    print(f"x={x} → {state}, y={output[state]}")
```

## Summary

- Binary: ⌈log₂ N⌉ flip-flops; Gray: 1 bit changes per step; one-hot: N flip-flops, simple logic (FPGA).
- Equivalent states: same output and equivalent next states → can be merged.
- Design: specification → diagram → table → minimisation → encoding → excitation → simplification → verification.

## Lesson exercise

```quiz required
? How many flip-flops does a 6-state machine need with one-hot encoding?
= 6

? And with binary encoding?
= 3

? In a 4-state one-hot machine S0 = 0001, S1 = 0010. What is the code of S2?
= 0100

? Why is one-hot encoding popular on FPGAs?
- Because flip-flops are scarce there.
+ Because flip-flops are plentiful, and the next-state logic is then simple and fast.
- Because an FPGA can store only one bit.
- Because then no clock is needed.

? When are two states equivalent?
- If the same number of arrows leave them.
- If their codes differ in only one bit.
+ If their outputs are the same and for every input they go to equivalent states.
- If both are initial states.

? In the minimisation example of the lesson, which two states can be merged?
- S0 and S3
+ S1 and S2
- S0 and S1
- S2 and S3
```
