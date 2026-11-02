---
title: Combinational and Sequential Circuits, Levels of Abstraction
summary: The two big groups of digital circuits, how systems are built from transistor to processor, and a map of the course.
minutes: 15
---

## What you will learn

- the difference between **combinational** and **sequential** circuits,
- the **levels of abstraction** of digital systems,
- how the 13 topics of the course build on each other.

## The two big groups

Digital circuits fall into two main groups:

1. **Combinational circuit** – the output depends **only on the present values of the inputs**. It has no memory: the same input always gives the same output.
   *Examples:* adder, decoder, multiplexer, code converter, 7-segment display driver.
2. **Sequential circuit** – the output depends on the inputs **and on the previous state**. It has **memory** (state).
   *Examples:* flip-flop, register, counter, state machine, processor.

```text
 combinational: inputs ──► [ logic ] ──► outputs

 sequential:    inputs ──► [ logic ] ──► outputs
                              ▲    │
                              └─[memory]◄┘   (feedback)
```

> Sequential logic = **combinational logic + memory**. In practice every digital device is a mix of both.

**Everyday example:** a lift call button is combinational (press → it lights up), but the lift itself is sequential: which way it goes also depends on **where it is now** and where it was heading.

## Levels of abstraction

A modern processor contains billions of transistors. It can only be designed by stacking levels and hiding the details of the level below at each level.

| Level                        | Building block                  | Where you learn it      |
| ---------------------------- | ------------------------------- | ----------------------- |
| physics, devices             | transistor (MOSFET)             | topic 12 (VLSI)          |
| gates                        | NOT, AND, OR, NAND …            | topic 3                  |
| combinational modules        | adder, MUX, decoder             | topic 4                  |
| storage, registers           | flip-flop, counter, memory      | topics 4–5               |
| control                      | state machine                   | topic 6                  |
| microarchitecture            | ALU, register file, control unit | topic 7                 |
| system                       | processor, bus, peripherals     | topics 7, 10, 12         |

Design goes **top-down** (from specification to gates); understanding often goes **bottom-up**. Today most work below gate level is done by **synthesis tools**: the engineer describes behaviour in a hardware description language (VHDL, Verilog – topic 9).

## Map of the course

1. Fundamentals of digital systems *(this topic)*
2. Number systems and coding – representing numbers with bits
3. Logic gates and Boolean algebra – the building blocks of logic
4. Combinational and sequential logic – design from truth table to circuit
5. Registers, counters, memories
6. State machines and design methods
7. Microprocessors and microcontrollers
8. A/D and D/A converters – the link to the analog world
9. FPGAs and hardware description languages
10. Bus systems and interfaces
11. Design, simulation and debugging
12. VLSI and SoC technologies
13. Applications of digital electronics in computing

## Summary

- Combinational: output = f(inputs). Sequential: output = f(inputs, state).
- A sequential circuit consists of combinational logic plus memory.
- Complex systems are designed by splitting them into levels of abstraction.

## Lesson exercise

```quiz required
? Which one is a **combinational** circuit?
- counter
- flip-flop
+ adder
- state machine
! Combinational: no memory, the output depends only on the present inputs.

? Which one is a **sequential** circuit?
- multiplexer
+ register
- 7-segment decoder
- comparator
! A register stores bits, so it has memory.

? What must be added to combinational logic to make it a sequential circuit?
+ memory (a storage element) with feedback
- more inputs
- a higher supply voltage
- an XOR gate
! Sequential logic = combinational logic + memory.

? A traffic light controller always switches from red to red-amber, and from green to amber. What kind of circuit is it?
- combinational
+ sequential
! For the same "switch" event it gives different outputs depending on where it currently is.
```
