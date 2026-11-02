---
title: Instructions and Program Execution
summary: The instruction cycle (fetch–decode–execute), instruction format and addressing modes, instruction types, stack and subroutines, interrupts, CISC and RISC, pipelining.
minutes: 35
---

## What you will learn

- how the processor executes an instruction (the **instruction cycle**),
- the **instruction format** and the **addressing modes**,
- the **types** of instructions, how the **stack** and **subroutine calls** work,
- what an **interrupt** is,
- the **CISC** and **RISC** philosophies and **pipelining**.

## The instruction cycle

From power-on to power-off the processor repeats a single thing:

1. **Fetch:** reads the instruction from the address pointed to by the PC into the IR, and advances the PC to the next instruction.
2. **Decode:** the control unit interprets the operation code and reads the operands.
3. **Execute:** the ALU performs the operation, the result goes to a register or to memory (write back).

A jump instruction simply **overwrites the PC** – so the next fetch happens from elsewhere.

## Instruction format and language levels

A machine instruction consists of an **operation code** (opcode – _what_ to do) and **operand(s)** (_with what_). The processor only understands binary **machine code**; its human-readable form is **assembly** (e.g. `ADD R1, R2`), and high-level languages (C, Python) are turned into machine code by a compiler or interpreter.

## Addressing modes

Where is the operand?

| addressing mode       | example (symbolic) | meaning                                                       |
| --------------------- | ------------------ | ------------------------------------------------------------- |
| **immediate**         | `LOAD #5`          | the operand is **in the instruction itself**: 5               |
| **direct** (absolute) | `LOAD 200`         | the value at **memory address 200**                           |
| **register**          | `ADD R1, R2`       | the operand is in a register                                  |
| **indirect**          | `LOAD (R1)`        | the contents of R1 are the **address** to read from (pointer) |
| **indexed**           | `LOAD 100(R2)`     | address = 100 + R2 (walking through arrays)                   |
| **relative**          | `JMP +8`           | address = PC + 8 (jumps)                                      |

## Types of instructions

- **Data movement:** LOAD, STORE, MOV, PUSH, POP.
- **Arithmetic:** ADD, SUB, INC, DEC, MUL, CMP (compare = subtract, only the flags change).
- **Logic and shift:** AND, OR, XOR, NOT, SHL, SHR.
- **Control transfer:** JMP (unconditional), conditional jumps (e.g. JZ – jump if Z = 1), CALL and RET.
- **Other:** disable/enable interrupts, NOP, HALT/SLEEP.

## Stack and subroutines

The **stack** is an area of memory that works on the **LIFO** principle (last in, first out); its top is pointed to by the **SP**.

- **CALL** subroutine: saves the **return address** (the current value of the PC) on the stack (PUSH), then jumps to the subroutine's address.
- **RET**: takes the return address off the stack (POP) into the PC.

Because it is a stack, subroutines can be **nested** (even recursive).

## Interrupts

A peripheral (timer, button press, received serial data) can signal with an **interrupt request** that it needs service. The processor:

1. finishes the current instruction,
2. saves the PC and the status register (on the stack),
3. jumps to the service routine (**ISR**) via the **interrupt vector**,
4. at the end of the routine (RETI) restores the saved state and continues where it left off.

This way the processor does not have to keep “asking” the peripheral (**polling**) – saving energy and time. Among several simultaneous requests a **priority** decides (priority encoder, topic 4).

## CISC and RISC

|               | **CISC** (complex instruction set)          | **RISC** (reduced instruction set)             |
| ------------- | ------------------------------------------- | ---------------------------------------------- |
| instructions  | many, complex, variable length              | few, simple, **fixed length**                  |
| memory access | many instructions work directly with memory | only LOAD and STORE access memory (load/store) |
| execution     | several clocks / instruction                | typically **1 instruction / clock** (pipeline) |
| example       | x86 (Intel, AMD)                            | ARM, RISC-V, AVR                               |

## Pipelining

Execution can be split into stages (e.g. fetch – decode – execute – memory – write back). As on an assembly line, **each stage works on a different instruction at the same time**. On a 5-stage pipeline an instruction still takes 5 clocks to pass through, but **one instruction finishes every clock**.

n instructions on a k-stage pipeline: **k + (n − 1)** clocks (without a pipeline k · n). E.g. 10 instructions, 5 stages: 5 + 9 = **14** clocks (instead of 50).

There are hazards here too: **data dependency** (an instruction waits for the previous result), **control** hazard (on a jump the instructions already fetched are useless – **branch prediction** mitigates this).

```python run
# Running the program of a simple accumulator machine
program = [
    ("LOAD", 5),     # A = 5
    ("ADD", 3),      # A = A + 3
    ("SHL", None),   # A = A * 2 (left shift)
    ("SUB", 4),      # A = A - 4
    ("HALT", None),
]

a, pc = 0, 0                                # accumulator and program counter
while True:
    op, operand = program[pc]               # fetch
    pc += 1
    if op == "LOAD":                        # decode and execute
        a = operand
    elif op == "ADD":
        a += operand
    elif op == "SUB":
        a -= operand
    elif op == "SHL":
        a <<= 1
    elif op == "HALT":
        break
    print(f"{op:5} → A = {a}")
```

## Summary

- Instruction cycle: fetch → decode → execute; a jump overwrites the PC.
- Addressing modes: immediate, direct, register, indirect, indexed, relative.
- Stack (LIFO, SP): CALL saves, RET restores the return address.
- Interrupt: save → ISR → return; instead of polling.
- RISC: simple, fixed-length instructions, load/store; pipeline: k + (n − 1) clocks.

## Lesson exercise

```quiz required
? In what order do the steps of the instruction cycle follow each other?
- decode → fetch → execute
+ fetch → decode → execute
- execute → fetch → decode
- fetch → execute → decode

? Which addressing mode appears in the instruction `LOAD #5`?
+ immediate – 5 itself is the operand
- direct – the contents of memory address 5
- indirect – the address pointed to by register 5
- relative – PC + 5

? The accumulator machine of the lesson runs the following program: LOAD 6, ADD 2, SHL, SUB 5, HALT. What is the value of the accumulator at the end?
= 11
! (6 + 2) · 2 − 5.

? How many clocks do 10 instructions take on a 5-stage pipeline (ideally)?
= 14
! k + (n − 1).

? On what principle does the stack work?
- FIFO – first in, first out
+ LIFO – last in, first out
- random access
- read-only

? What is characteristic of RISC processors?
- Many complex, variable-length instructions.
+ Few, simple, fixed-length instructions; only LOAD and STORE access memory.
- They have no registers.
- They do not use pipelining.

? What does the processor do on an interrupt request?
- Stops immediately in the middle of the instruction and restarts.
+ Finishes the instruction, saves the state, jumps to the service routine, then returns.
- Ignores it until the program ends.
- Clears the memory.
```
