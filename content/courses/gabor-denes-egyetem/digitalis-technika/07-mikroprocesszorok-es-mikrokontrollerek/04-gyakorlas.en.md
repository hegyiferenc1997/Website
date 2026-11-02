---
title: Practice – Microprocessors and Microcontrollers
summary: Review questions and a summary worksheet: CPU structure, buses, flags, instruction cycle, pipelining, interrupts, bit handling and interfacing.
minutes: 30
kind: practice
---

## Review questions

<details>
<summary>1. Which building blocks learned so far make up a processor?</summary>

The ALU consists of an adder-subtractor, logic gates and multiplexers (a combinational circuit); the registers of D flip-flops; the program counter is a loadable counter; address decoding is done with decoders; and the control unit is a state machine.

</details>

<details>
<summary>2. What is the “von Neumann bottleneck”?</summary>

In the von Neumann architecture program and data come from memory over the same bus, so the processor can read only one of them at a time; the bus speed limits performance. The Harvard architecture (and separate instruction and data caches) mitigates this.

</details>

<details>
<summary>3. Why is the stack needed for subroutine calls?</summary>

Because CALL must save the return address. If the subroutine calls another subroutine, that address must also be saved without overwriting the previous one – the LIFO stack returns the addresses in exactly the right order.

</details>

<details>
<summary>4. Why is a 5-stage pipeline not exactly five times faster?</summary>

Because filling it takes k − 1 clocks, and hazards (data dependencies, jumps) sometimes force waiting or discarding fetched instructions. In addition, the registers between the stages add delay too.

</details>

<details>
<summary>5. Why must a bit of a peripheral register be modified with a mask?</summary>

Because the other bits of the register control other functions (other pins, settings). Simply writing a new value would overwrite those too; an OR / AND NOT / XOR mask changes only the selected bit.

</details>

## Summary worksheet

```quiz required
? How many KiB of memory can a 16-bit address bus address (with byte addressing)?
= 64
! 2^16 = 65,536 bytes.

? An 8-bit ALU adds 100 and 100 as signed numbers (result 200 = 11001000). What will the V (overflow) flag be?
= 1
! The sum of two positive numbers appears negative (top bit 1).

? How many clocks do 20 instructions take on a 4-stage pipeline (ideally)?
= 23

? What does the CALL instruction do?
- Takes the return address off the stack.
+ Saves the return address on the stack and jumps to the subroutine's address.
- Requests an interrupt.
- Clears the PC.

? A register holds 10100000. What will it hold if bit 2 is toggled with XOR? (on 8 bits)
= 10100100

? The accumulator machine's program: LOAD 7, SUB 3, SHL, SHL, HALT. What is the accumulator at the end?
= 16
! (7 − 3) · 2 · 2.

? Why is interrupt-driven handling better than polling?
+ The processor does not have to watch the peripheral continuously, saving time and energy.
- Its hardware is simpler, because no stack is needed.
- No program is needed for it.
- It always completes in exactly one clock.

? What architecture does the Arduino Uno's ATmega328P microcontroller have?
- von Neumann
+ Harvard
- CISC von Neumann
- it has no CPU
```
