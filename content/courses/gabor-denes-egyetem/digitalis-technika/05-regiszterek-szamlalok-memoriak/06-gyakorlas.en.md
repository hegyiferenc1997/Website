---
title: Practice – Registers, Counters, Memories
summary: Review questions and a summary worksheet: shift register, ring and Johnson counters, asynchronous and synchronous counters, memories.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. How does a shift register convert serial data into parallel?</summary>

Every clock moves the data arriving bit by bit at the serial input one place further; after n clocks all n bits are in the register and can be read simultaneously (in parallel) at the flip-flop outputs (SIPO).

</details>

<details>
<summary>2. Why is there no decoding glitch with a Johnson counter?</summary>

Because only one bit changes between two consecutive states (as in Gray code), so there is no moment when, due to different bit delays, a third, false code would appear.

</details>

<details>
<summary>3. Why does a short false state appear in a modulo-N counter with asynchronous clear?</summary>

Because the clear is triggered by state N itself: the counter must first reach code N, the decoding gate must detect it, and only then are the flip-flops cleared. For this short time code N (e.g. 1010 in a decade counter) appears on the outputs.

</details>

<details>
<summary>4. Why are JK flip-flops popular for designing synchronous counters?</summary>

Because the JK excitation table has a don't-care entry for every transition, so the K-maps have many Xs and the control logic is simpler (a single AND gate is enough for the modulo-5 counter).

</details>

<details>
<summary>5. What does it mean that a counter is self-starting, and why must it be checked?</summary>

That from any state not in the cycle it reaches the counting cycle after a few clocks. At power-on the flip-flops may be in a random state; if a closed loop started from an unused state, the counter would never start counting correctly.

</details>

<details>
<summary>6. Why do processors use SRAM for cache and DRAM for main memory?</summary>

SRAM is fast and needs no refresh, but needs 6 transistors per cell, so it is expensive and small – ideal for the small, fast cache. A DRAM cell is 1 transistor + 1 capacitor, so it is very dense and cheap, and GiB-sized main memory can be built from it, although it is slower and needs refreshing.

</details>

## Summary worksheet

```quiz required
? A 4-bit shift register starts at 1111; the serial input enters the leftmost bit and the contents shift right. The input receives 0, 0, 1, 0 in turn. What are the contents after the 4th edge?
= 0100
! 0111 → 0011 → 1001 → 0100.

? How many states does a Johnson counter with 3 flip-flops have?
= 6

? An 8-stage asynchronous counter receives a 1.024 MHz clock. What is the frequency of the last stage's output (Q7) in kHz?
= 4
! 1024 kHz / 2^8.

? An asynchronous modulo-6 counter is built with active-low CLR̅ inputs. Which gate is needed for clearing?
+ NAND(Q2, Q1)
- NAND(Q2, Q0)
- NAND(Q1, Q0)
- NAND(Q2, Q1, Q0)
! 6 = 110.

? A 2-bit synchronous down counter (00 → 11 → 10 → 01 → 00) is built with D flip-flops. Give the function of input D1!
expr: Q1, Q0 -> Q1 ⊙ Q0
! Q1 changes when Q0 = 0.

? In the JK counter with sequence 000 → 010 → 100 → 110 the values of J2 are: 000 → 0, 010 → 1, the other rows are don't cares. Give J2!
expr: Q2, Q1, Q0 -> Q1
limit: 1
dc: 1, 3, 4, 5, 6, 7

? How many address lines does a 16K × 8-bit memory need?
= 14
! 16K = 2^14.

? What technology is a processor's cache?
+ SRAM
- DRAM
- NAND Flash
- EEPROM
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Shift register.** Write the `shift(reg, inp)` function, which shifts a bit list (the register's content, the first flip-flop on the left) to the right by one clock: the input bit enters on the left, and the rightmost bit drops out. Return the `(new_register, bit_out)` pair!

```python starter
def shift(reg, inp):
    return (reg, 0)
```

<details>
<summary>Solution</summary>

The last test is serial-to-parallel conversion: after 4 clocks the 4 bits that arrived one after another can be read out at once (the first one to arrive is on the far right).

```python solution
def shift(reg, inp):
    return ([inp] + reg[:-1], reg[-1])       # in on the left, out on the right
```

</details>

```python test
assert shift([0, 0, 0, 0], 1) == ([1, 0, 0, 0], 0)
assert shift([1, 0, 1, 1], 0) == ([0, 1, 0, 1], 1)
reg = [0, 0, 0, 0]
for b in [1, 0, 1, 1]:                       # serial → parallel conversion in 4 clocks
    reg, _ = shift(reg, b)
assert reg == [1, 1, 0, 1]
print("All checks passed!")
```

**2.** **LFSR period.** Write the `lfsr_period(bits, taps, start=1)` function! The register is a `bits`-bit integer; at every step the new bit is the XOR of the bit positions given in the `taps` list, the register shifts left, and the new bit goes into position 0. Return after how many steps it returns to the start state!

```python starter
def lfsr_period(bits, taps, start=1):
    return 2 ** bits
```

<details>
<summary>Solution</summary>

```python solution
def lfsr_period(bits, taps, start=1):
    state, steps = start, 0
    while True:
        new = 0
        for t in taps:
            new ^= (state >> t) & 1                          # XOR of the fed-back bits
        state = ((state << 1) | new) & (2 ** bits - 1)       # shift, keep only n bits
        steps += 1
        if state == start:
            return steps
```

</details>

```python test
assert lfsr_period(4, [3, 2]) == 15          # x^4 + x^3 + 1: maximal length
assert lfsr_period(3, [2, 1]) == 7
assert lfsr_period(4, [3, 1]) < 15           # bad choice of taps: a shorter period
print("All checks passed!")
```

**3.** **Address lines and capacity.** Write the `memory(address_lines, data_bits)` function, which returns the memory's capacity **in bytes**, and the `address_lines_needed(words)` function, which returns how many address lines a given number of words needs!

```python starter
def memory(address_lines, data_bits):
    return 0

def address_lines_needed(words):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
def memory(address_lines, data_bits):
    return 2 ** address_lines * data_bits // 8   # number of words × word width, in bytes

def address_lines_needed(words):
    k = 0
    while 2 ** k < words:                        # the smallest k for which 2^k ≥ words
        k += 1
    return k
```

</details>

```python test
assert memory(15, 8) == 32768                # 62256 SRAM: 32 KiB
assert memory(20, 16) == 2 * 1024 * 1024     # 1 Mi words × 16 bits = 2 MiB
assert address_lines_needed(65536) == 16
assert address_lines_needed(1000) == 10
assert address_lines_needed(1) == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? How many flip-flops does a modulo-10 (0…9) counter need?
= 4
! 2^3 = 8 < 10 ≤ 16 = 2^4.

? How many states does a 4-flip-flop ring counter have?
= 4
! A single 1 circulates in a ring counter: n flip-flops → n states.

? Why is the asynchronous (ripple) counter used less today?
+ because the delays add up, and false states appear during transitions
- because it needs more flip-flops
- because it can only count down
! In a synchronous counter every bit changes at once.

? Which memory loses its content without power?
- Flash
- EEPROM
+ SRAM
- mask-programmed ROM
! RAMs (SRAM, DRAM) are volatile; the ROM families and Flash are not.

? A 3-bit synchronous counter is in state 111. What is its next state?
= 000
! It overflows and starts from 0 again.
```
