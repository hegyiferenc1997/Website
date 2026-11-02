---
title: Structure of the Processor
summary: The main units of a computer, von Neumann and Harvard architectures, the parts of the CPU (ALU, registers, control unit), address, data and control buses, status flags.
minutes: 30
---

## What you will learn

- the **main units** of a computer and the **von Neumann principles**,
- the difference between the **von Neumann** and **Harvard architectures**,
- the parts of the processor (CPU): **ALU**, **registers**, **control unit**,
- the role of the **address, data and control buses**,
- the **status flags** of the ALU.

## Everything you have learned so far meets here

A processor is nothing but a collection of **combinational circuits** (adder, multiplexer, decoder) and **sequential circuits** (registers, counters, state machine) working to the beat of a **clock**. All the building blocks of the previous topics can be found in it.

## Main units of a computer

- **CPU** (central processing unit): executes instructions.
- **Memory**: stores the program and the data.
- **Input and output units** (I/O, peripherals): connection to the outside world.
- **Bus system**: groups of wires connecting the units.

**Von Neumann principles** (1945): the machine is binary, electronic, executes instructions sequentially, and the **program is stored in memory** together with the data (stored-program concept) – so the machine is programmable without rewiring.

## Von Neumann and Harvard architectures

|         | **von Neumann**                                                  | **Harvard**                                               |
| ------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| memory  | **shared** by program and data                                   | **separate** program memory and data memory               |
| bus     | one bus → reads either an instruction or data at a time          | separate buses → can read an instruction and data at once |
| feature | simpler, more flexible; bottleneck: the “von Neumann bottleneck” | faster                                                    |
| example | the memory model of classic PCs                                  | microcontrollers (AVR, PIC), DSPs                         |

Today's PC processors use a **modified Harvard** architecture: shared memory outside, but separate instruction and data caches inside (L1I, L1D).

## Parts of the CPU

### Arithmetic logic unit (ALU)

A combinational circuit that performs an operation on two operands: **addition, subtraction** (adder-subtractor, see topic 4), **AND, OR, XOR, NOT**, **shifts**, comparison. Which one is selected by the control unit with an **operation code** – essentially a large multiplexer in front of the results of the different operations.

### Registers

| register                            | role                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| **PC** (program counter)            | the **address of the next instruction** to execute         |
| **IR** (instruction register)       | the instruction being executed                             |
| **accumulator** / general registers | operands and intermediate results                          |
| **SP** (stack pointer)              | the address of the top of the stack                        |
| **status register** (flags, PSW)    | properties of the last ALU operation                       |
| **MAR / MDR**                       | memory address and memory data registers (towards the bus) |

### Control unit (CU)

A **state machine** that, based on the instruction in the IR, issues the control signals clock by clock: which register should load, what the ALU should do, whether memory should read or write. It can be **hard-wired** (from gates, fast) or **microprogrammed** (the control signals are stored in an internal ROM, flexible).

## Buses

- **Address bus**: the CPU outputs which memory location or peripheral it accesses – **unidirectional**. n address lines → 2<sup>n</sup> addresses (16 bits → 64 KiB, 32 bits → 4 GiB).
- **Data bus**: carries the data – **bidirectional** (read and write). Its width is related to the processor's word length (8, 16, 32, 64 bits).
- **Control bus**: read/write (RD̅, WR̅), clock, reset, interrupt request, bus enable, etc.

Only **three-state** (tri-state) outputs may be connected to a shared bus, so that only one device drives it at a time (topic 10).

## Status flags

| flag  | name     | when 1                                                    |
| ----- | -------- | --------------------------------------------------------- |
| **Z** | zero     | the result is **zero**                                    |
| **C** | carry    | a **carry** came out of the top bit (unsigned overflow)   |
| **N** | negative | the result's **top bit is 1** (negative when signed)      |
| **V** | overflow | **signed overflow** (V = C<sub>n</sub> ⊕ C<sub>n−1</sub>) |

Conditional jump instructions (e.g. “jump if zero”) test these – this is how `if` statements and loops are implemented.

**Example** – 8-bit ALU: 200 + 100 = 300, which does not fit in 8 bits: the result is **300 − 256 = 44**, and **C = 1**.

```python run
# 8-bit ALU addition with status flags
def alu_add(a, b):
    full = a + b
    result = full & 0xFF                           # only the low 8 bits remain
    z = int(result == 0)
    c = int(full > 0xFF)
    n = result >> 7
    # signed overflow: two operands of the same sign, result of a different sign
    v = int((a >> 7) == (b >> 7) and (a >> 7) != n)
    return result, dict(Z=z, C=c, N=n, V=v)

print("200 + 100 →", alu_add(200, 100))
print("100 +  50 →", alu_add(100, 50))
print("128 + 128 →", alu_add(128, 128))
```

## Summary

- A computer: CPU, memory, I/O, buses; the stored-program concept.
- Von Neumann: shared program and data memory; Harvard: separate (faster, microcontrollers).
- CPU: ALU (combinational), registers (PC, IR, SP, flags), control unit (state machine).
- Address bus unidirectional, data bus bidirectional; flags: Z, C, N, V.

## Lesson exercise

```quiz required
? What does the program counter (PC) store?
- The instruction being executed.
+ The address of the next instruction to execute.
- The address of the top of the stack.
- The result of the last operation.

? What characterises the Harvard architecture?
- Program and data are in a shared memory.
+ Separate program memory and data memory, with separate buses.
- It has no ALU.
- It can only be 8-bit.

? How many GiB of memory can a 32-bit address bus address (with byte addressing)?
= 4
! 2^32 bytes.

? An 8-bit ALU adds 200 and 100. What will the result register hold (in decimal)?
= 44
! 300 does not fit in 8 bits; the 256 place goes into the carry flag.

? When is the Z (zero) flag 1?
- When a carry occurred.
+ When the result of the operation is zero.
- When the result is negative.
- When the processor is in sleep mode.

? Which bus is bidirectional?
- the address bus
+ the data bus
- neither
- both, always
```
