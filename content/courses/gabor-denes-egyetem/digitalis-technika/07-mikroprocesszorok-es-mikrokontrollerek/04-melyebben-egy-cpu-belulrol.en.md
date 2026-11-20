---
title: Deeper – A CPU from the Inside, in Numbers
summary: A simulator of a tiny accumulator processor that runs a loop instruction by instruction (fetch–decode–execute, PC, jumps); the speed-up of a pipeline in the ideal case and with stalls; a microcontroller timer with a prescaler and the baud rate error of the serial port.
minutes: 45
---

## What you will learn in this lesson

- to **follow** how a processor works instruction by instruction in a working simulator,
- to see how a **loop** is implemented at machine level (conditional jump, counter),
- to **calculate** how much a pipeline speeds things up, and how much of that jumps and data dependencies take away,
- to set up a microcontroller **timer**, and understand why not every **baud rate** works with every crystal.

## 1. A simulator of a tiny CPU

Let's build an **accumulator** processor: it has a single working register (ACC), a program counter (PC) and seven instructions. The program and the data are in **the same memory** (von Neumann principle). The program computes the sum 5 + 4 + 3 + 2 + 1 with a loop:

```python run
# A simulator of a tiny accumulator CPU: fetch – decode – execute
# Program: adds up 5 + 4 + 3 + 2 + 1; the result goes to memory address 21.
mem = [0] * 32
program = [
    ("LOAD", 20),     # 0: ACC ← mem[20]           (the counter)
    ("JZ", 8),        # 1: if ACC = 0, jump to 8   (end)
    ("ADD", 21),      # 2: ACC ← ACC + mem[21]     (add the sum so far)
    ("STORE", 21),    # 3: mem[21] ← ACC
    ("LOAD", 20),     # 4: ACC ← counter
    ("SUB", 22),      # 5: ACC ← ACC − mem[22]     (mem[22] = 1)
    ("STORE", 20),    # 6: counter ← ACC
    ("JMP", 0),       # 7: back to the start
    ("HALT", 0),      # 8: stop
]
mem[:len(program)] = program          # von Neumann principle: the program is in memory too
mem[20], mem[21], mem[22] = 5, 0, 1   # the data in the same memory

pc, acc, n = 0, 0, 0
while True:
    op, addr = mem[pc]                # FETCH: read the instruction from the PC's address
    if n < 9:
        print(f"PC={pc}  {op:<5} {addr:>2}   ACC before = {acc}")
    pc += 1                           # the PC already points to the next instruction
    n += 1
    if op == "LOAD":    acc = mem[addr]                # DECODE + EXECUTE
    elif op == "ADD":   acc = acc + mem[addr]
    elif op == "SUB":   acc = acc - mem[addr]
    elif op == "STORE": mem[addr] = acc
    elif op == "JMP":   pc = addr
    elif op == "JZ":    pc = addr if acc == 0 else pc
    elif op == "HALT":  break

print(f"…\nresult: mem[21] = {mem[21]}, {n} instructions executed in total")
```

Follow the output:

- In the **FETCH** step the CPU reads the instruction from the address the PC points to, and **immediately** steps the PC to the next address.
- **JMP 0** simply overwrites the PC – that's how the program becomes a **loop**. **JZ 8** only jumps if ACC = 0 (_jump if zero_) – that's how it becomes a **condition**. Every `while`, `for` and `if` compiles to such conditional and unconditional jumps at machine level.
- The loop body is 8 instructions, run 5 times, plus LOAD, JZ, HALT at the end: 5 · 8 + 3 = **43** instructions.

Notice too that the variables (counter, sum) are in **memory**, and have to be moved with LOAD/STORE at every step – an accumulator machine is slow because it goes to memory a lot. That's why modern (RISC) processors have many (16–32) registers: the variables can stay there.

## 2. How much does a pipeline speed things up?

If an instruction goes through 5 stages (IF – fetch, ID – decode, EX – execute, MEM – memory, WB – write-back), without a pipeline N instructions take N · 5 cycles. With a pipeline the first instruction finishes after 5 cycles, and after that **one** instruction completes **per cycle**: 5 + (N − 1) cycles. In reality, however, there are **bubbles** (stalls):

- at a **jump** the CPU doesn't know where to fetch the next instruction from until it has evaluated the condition (control hazard),
- with a **data dependency** an instruction waits for the previous one's result (data hazard).

```python run
# Pipeline: 5 stages (IF, ID, EX, MEM, WB), the ideal case and with stalls
def run_time(instructions, stages, stalls=0, pipeline=True):
    if not pipeline:
        return instructions * stages                 # every instruction goes through alone
    return stages + (instructions - 1) + stalls      # filling, then one finishes per cycle

N, K = 1000, 5
base = run_time(N, K, pipeline=False)
print(f"without pipeline:           {base:>5} cycles")
for name, bubbles in [("ideal pipeline", 0),
                      ("10% jumps, 2-cycle penalty", int(0.10 * N * 2)),
                      ("+ 20% data dep., 1 cycle", int(0.10 * N * 2 + 0.20 * N * 1))]:
    t = run_time(N, K, bubbles)
    print(f"{name:<27} {t:>5} cycles → speed-up {base / t:.2f}×")
```

The ideal speed-up is almost **5×** (the number of stages), but if every tenth instruction is a jump with a 2-cycle penalty and every fifth waits 1 cycle, it's only **3.56×**. That's why modern processors have a **branch predictor** (which predicts jumps with over 95% accuracy) and **forwarding** (the result goes on immediately, bypassing the register file). The programmer can help too: a predictable loop is faster than a series of unpredictable `if`s.

**Analogy:** a pipeline is like a car wash line: five cars are inside at once, each in a different phase. If someone stops in the middle of the line to think, everyone behind them waits.

## 3. Microcontroller: timer and serial port in numbers

A microcontroller program almost always needs an accurate **time base** (e.g. a 1 ms interrupt) and a **serial port** (UART). Both are made by dividing the system clock by a **whole number** – and that has interesting consequences:

```python run
# Microcontroller: a timer with a prescaler, and the baud error of the serial port (UART)
F_CPU = 16_000_000                                   # Hz, a typical 8-bit microcontroller

# 1) Timer: a 1 ms interrupt. TOP = F_CPU / (prescaler · f) − 1, and it must fit in 8 bits
print("1 kHz timer interrupt with an 8-bit counter (TOP ≤ 255):")
for prescaler in [1, 8, 64, 256]:
    top = F_CPU / (prescaler * 1000) - 1
    ok = "good" if top <= 255 and top == int(top) else "doesn't fit" if top > 255 else "not whole"
    print(f"  prescaler {prescaler:>3}: TOP = {top:>8.2f}  → {ok}")

# 2) UART: the divider is a whole number, so the baud rate is only approximate; above ±2% transfer fails
print("\nUART baud rate error (UBRR = F_CPU / (16 · baud) − 1, rounded to a whole number):")
for baud in [9600, 57600, 115200]:
    ubrr = round(F_CPU / (16 * baud) - 1)
    actual = F_CPU / (16 * (ubrr + 1))
    error = (actual - baud) / baud * 100
    print(f"  {baud:>6} baud: UBRR = {ubrr:>3}, actual {actual:>9.1f} baud, error {error:+.1f}%"
          + ("  ← risky!" if abs(error) > 2 else ""))
```

**Timer:** an 8-bit counter counts up to 255 at most, so the clock has to be slowed down with a prescaler. With a prescaler of 64, 16 MHz becomes 250 kHz, and 250 counts (0…249) are exactly 1 ms – a **whole number**, so it's accurate. With a prescaler of 256 it would need 62.5 counts, which can't be set, so the timing would be inaccurate.

**UART:** the baud rate divider can only be a whole number too, so the actual baud rate differs from the desired one. A mismatch between the two sides' clocks of more than about **±2%** can already cause bit errors. At 16 MHz, 115,200 baud comes out with a **−3.5%** error – which is why a fast serial link with a 16 MHz board sometimes "doesn't work". Solutions: double-speed mode (a divider of 8 instead of 16), a lower baud rate, or a special "baud rate crystal" (e.g. 18.432 MHz) that divides every standard speed exactly, without error.

## Summary

- The CPU cycle: **fetch** (instruction from the PC's address, step the PC), **decode**, **execute**; a jump overwrites the PC.
- Loops and branches are **conditional and unconditional jumps** at machine level.
- Pipeline: ideally k stages → nearly k-fold speed-up; the **bubbles** of jumps and data dependencies reduce this.
- Timer: TOP = f<sub>CPU</sub> / (prescaler · f) − 1, it must be a whole number and must fit; UART: the whole-number divider causes a baud rate error, risky above ±2%.

## Lesson exercise

```quiz required
? In the simulator's program, what happens to the PC after the FETCH step if the instruction isn't a jump?
- it's reset to zero
+ it increases by one, pointing to the next instruction
- it takes the value of ACC
- it doesn't change
! On a jump the execution overwrites the PC; otherwise it steps to the next address.

? How many instructions run in the simulator if the counter starts at 3 (instead of 5)?
= 27
! 3 · 8 + 3 = 27 (the loop body is 8 instructions, LOAD, JZ, HALT at the end).

? How many cycles does an ideal 5-stage pipeline need to run 100 instructions?
= 104
! 5 + (100 − 1) = 104.

? 16 MHz clock, prescaler 64: how many counts must the timer count for 1 ms?
= 250
! 16,000,000 / 64 = 250,000 Hz → 250 counts in 1 ms (TOP = 249).

? Why can 115,200 baud serial transfer be a problem on a 16 MHz microcontroller?
- because 16 MHz is too slow for it
+ because the whole-number divider makes the actual baud rate differ by about 3.5%
- because 115,200 isn't a power of two
- because the UART only knows 9600 baud
! Above ±2% the receiver may sample at the wrong moment.
```
