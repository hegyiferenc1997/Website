---
title: Practice – Microprocessors and Microcontrollers
summary: Review questions and a summary worksheet: CPU structure, buses, flags, instruction cycle, pipelining, interrupts, bit handling and interfacing.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Register bits with masks.** You control a microcontroller's peripherals with register bits. Write the `bit_set(reg, n)`, `bit_clear(reg, n)`, `bit_toggle(reg, n)` and `bit_test(reg, n)` functions (set to 1, clear, toggle, query)! The other bits must not change.

```python starter
def bit_set(reg, n):
    return reg

def bit_clear(reg, n):
    return reg

def bit_toggle(reg, n):
    return reg

def bit_test(reg, n):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def bit_set(reg, n):
    return reg | (1 << n)            # OR: only bit n becomes 1

def bit_clear(reg, n):
    return reg & ~(1 << n)           # AND with the inverted mask: only bit n is cleared

def bit_toggle(reg, n):
    return reg ^ (1 << n)            # XOR: bit n flips

def bit_test(reg, n):
    return (reg >> n) & 1
```

</details>

```python test
assert bit_set(0b0000_0000, 5) == 0b0010_0000
assert bit_clear(0b1111_1111, 0) == 0b1111_1110
assert bit_toggle(0b1010_0000, 7) == 0b0010_0000
assert bit_test(0b0000_1000, 3) == 1 and bit_test(0b0000_1000, 2) == 0
assert bit_set(0b1000_0001, 0) == 0b1000_0001    # a bit that's already 1 stays 1
print("All checks passed!")
```

**2.** **Setting up a timer.** Write the `timer(f_cpu, f_target, max_top=255)` function, which finds the **smallest** of the prescalers `[1, 8, 64, 256, 1024]` for which `TOP = f_cpu / (prescaler · f_target) − 1` is a **whole number** and at most `max_top`. Return the `(prescaler, TOP)` pair, or `None` if none works!

```python starter
def timer(f_cpu, f_target, max_top=255):
    return None
```

<details>
<summary>Solution</summary>

```python solution
def timer(f_cpu, f_target, max_top=255):
    for prescaler in [1, 8, 64, 256, 1024]:
        divisor = prescaler * f_target
        if f_cpu % divisor == 0:               # an exact, whole-number division is needed
            top = f_cpu // divisor - 1
            if 0 <= top <= max_top:
                return (prescaler, top)
    return None
```

</details>

```python test
assert timer(16_000_000, 1000) == (64, 249)
assert timer(16_000_000, 1000, max_top=65535) == (1, 15999)   # 16-bit timer
assert timer(16_000_000, 50_000) == (8, 39)     # with prescaler 1 TOP would be 319: doesn't fit
assert timer(8_000_000, 100) is None            # no prescaler gives an exact result
print("All checks passed!")
```

**3.** **Pipeline run time.** Write the `pipeline_cycles(n, stages, bubbles=0)` function (n instructions, k stages, plus stall cycles) and the `speedup(n, stages, bubbles=0)` function, which returns, rounded to two decimals, how many times faster the pipeline is than running without one (n · k cycles)!

```python starter
def pipeline_cycles(n, stages, bubbles=0):
    return n * stages

def speedup(n, stages, bubbles=0):
    return 1.0
```

<details>
<summary>Solution</summary>

```python solution
def pipeline_cycles(n, stages, bubbles=0):
    return stages + (n - 1) + bubbles         # filling, then one finishes per cycle

def speedup(n, stages, bubbles=0):
    return round(n * stages / pipeline_cycles(n, stages, bubbles), 2)
```

</details>

```python test
assert pipeline_cycles(100, 5) == 104
assert pipeline_cycles(1, 5) == 5
assert speedup(1000, 5) == 4.98
assert speedup(1000, 5, bubbles=200) == 4.15
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the essence of the Harvard architecture?
- the program and the data are in the same memory
+ the program memory and the data memory are reached over separate buses
- it has no program counter
! So an instruction and data can be read at the same time – many microcontrollers are like this.

? What does the program counter (PC) contain?
+ the address of the next instruction to execute
- the number of instructions executed so far
- the result of the last operation
! On a jump the value of the PC is overwritten.

? What is the watchdog timer in a microcontroller for?
- measuring the exact time
+ if the program hangs and doesn't "feed" it in time, it restarts the microcontroller
- reducing power consumption
! In embedded systems this is the last line of defence against hanging.

? What happens when an interrupt arrives?
+ the CPU saves where it was, runs the service routine, then continues from there
- the CPU restarts
- the program ends
! The return address goes onto the stack.

? A register's value is 0b0000_0110. What is it after an AND with 0b0000_0100 (in decimal)?
= 4
! Only bit 2 remains: 0b0000_0100 = 4.
```
