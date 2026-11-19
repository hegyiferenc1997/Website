---
title: Deeper – Counters, LFSRs and Memories in Numbers
summary: The false intermediate states of an asynchronous counter nanosecond by nanosecond, ring and Johnson counters simulated, pseudo-random numbers from a shift register (LFSR), and address lines, capacity and DRAM refresh in numbers.
minutes: 40
---

## What you will learn in this lesson

- to see **in time** which false states an asynchronous counter passes through, and why that's dangerous after a decoder,
- to compare the states of **ring** and **Johnson counters** with a simulator,
- how a shift register and an XOR gate produce a **pseudo-random** bit sequence (LFSR), and where it's used,
- to **calculate** the number of address lines of a memory and the refresh rate of DRAM.

## 1. The false states of an asynchronous counter

In an asynchronous (ripple) counter every flip-flop is toggled by the previous one's **output**, so the delays add up. Let's see what happens at the 7 → 8 (0111 → 1000) transition if a flip-flop toggles in 10 ns:

```python run
# Asynchronous (ripple) counter: at 0111 → 1000 the flip-flops toggle one after another
T_FF = 10                                            # ns, the delay of one flip-flop

def ripple_transition(old, bits=4):
    state, t = old, 0
    print(f"  t = {t:>2} ns: {state:0{bits}b}  (the clock edge arrives)")
    for i in range(bits):                            # Q0 toggles, its falling edge toggles Q1...
        t += T_FF
        old_bit = (state >> i) & 1
        state ^= 1 << i
        print(f"  t = {t:>2} ns: {state:0{bits}b}")
        if old_bit == 0:                             # 0 → 1 change: no falling edge, the chain stops
            break

print("Ripple counter, 7 → 8:")
ripple_transition(0b0111)
print(f"\nIn a synchronous counter every bit changes at once: after {T_FF} ns 0111 → 1000, with no intermediate states.")
```

The counter passes through **three false states** (6, 4, 0) in 40 ns before it reaches 8! If a decoder is connected to its output (e.g. "if the value is 0, turn on the alarm"), the decoder gives a short glitch in state 0 – even though the counter was "really" never at 0. These are the two main weaknesses of a ripple counter:

- it's **slow**: with n bits the worst-case delay is n · t<sub>FF</sub>, so the maximum clock frequency drops too;
- **false transitions**: its output may only be used once it has settled.

In a synchronous counter every flip-flop toggles on the same clock edge, so they change **at once** – without false transitions. That's why today's designs almost always use synchronous counters; the ripple counter survives only as a simple frequency divider.

## 2. Ring and Johnson counters simulated

```python run
# Ring and Johnson counters with 4 flip-flops
def ring(steps, n=4):
    q = [1] + [0] * (n - 1)                          # a single 1 circulates
    for _ in range(steps):
        print("".join(map(str, q)), end=" ")
        q = [q[-1]] + q[:-1]                         # the last one goes back to the start
    print()

def johnson(steps, n=4):
    q = [0] * n
    for _ in range(steps):
        print("".join(map(str, q)), end=" ")
        q = [1 - q[-1]] + q[:-1]                     # the NEGATION of the last one goes back
    print()

print("ring (4 states):    ", end=""); ring(8)
print("Johnson (8 states):", end=" "); johnson(10)
```

Both are a shift register connected in a loop; the difference is a single inverter:

| Counter | Feedback           | Number of states with n flip-flops | Advantage                                                      |
| ------- | ------------------ | ---------------------------------- | -------------------------------------------------------------- |
| ring    | Q<sub>n</sub> → D₁ | **n**                              | every state has its own output even without a decoder          |
| Johnson | Q̅<sub>n</sub> → D₁ | **2n**                             | twice as many states; only **one** bit changes per step (Gray) |

The Johnson counter changes only one bit per step (like the Gray code), so decoding it is **hazard-free** – no false glitches, unlike the ripple counter.

## 3. Pseudo-random numbers from a shift register: the LFSR

If we connect the **XOR** of a few outputs to the feedback of a shift register, we get a **linear feedback shift register** (LFSR). With well-chosen feedback a 4-bit LFSR goes through all 2<sup>4</sup> − 1 = 15 non-zero states before repeating:

```python run
# LFSR: a 4-bit shift register with XOR feedback → a pseudo-random bit sequence
def lfsr4(start=0b1001, steps=18):
    state = start
    seen = []
    for _ in range(steps):
        seen.append(state)
        new_bit = ((state >> 3) ^ (state >> 2)) & 1      # x^4 + x^3 + 1 feedback
        state = ((state << 1) | new_bit) & 0b1111        # shift left, new bit in
    return seen

seq = lfsr4()
print(" ".join(f"{s:04b}" for s in seq))
period = seq[1:].index(seq[0]) + 1
print(f"period: {period} steps (of the 16 states only 0000 is missing)")
print("output bit sequence:", "".join(str(s >> 3) for s in seq[:15]))
```

The output bit sequence looks "random" (roughly as many 0s as 1s, varied runs), yet it's fully determined – hence **pseudo-random**. The state 0000 must be avoided: from it the XOR would always give 0, and the register would get "stuck".

Where will you meet it?

- **CRC calculation**: the CRC of topic 2 is computed in hardware with exactly such an LFSR (the feedback is the generator polynomial),
- **scrambling**: USB, PCIe and SATA mix the bit stream this way so there are no long runs of 0s or 1s,
- **built-in self-test**: the chip generates test patterns for itself with an LFSR,
- simple **game random numbers**: old arcade machines "rolled the dice" like this too. (But it's **not** suitable for encryption: it can be reverse-engineered from a few output bits.)

The period of an n-bit LFSR is at most 2<sup>n</sup> − 1: at 32 bits that's more than 4 billion steps – with only 32 flip-flops and a few XOR gates.

## 4. Memories in numbers

A memory with **k** address lines can address **2<sup>k</sup>** words. Conversely: N words need ⌈log₂ N⌉ address lines. Capacity = number of words × word width.

```python run
# Memories: address lines, capacity and DRAM refresh
import math

def size(nbytes):
    # readable unit (with binary prefixes)
    for unit in ["B", "KiB", "MiB", "GiB"]:
        if nbytes < 1024:
            return f"{nbytes:.0f} {unit}"
        nbytes /= 1024
    return f"{nbytes:.0f} TiB"

for name, words, width in [("EEPROM 24C02", 256, 8),
                           ("SRAM 62256", 32 * 1024, 8),
                           ("microcontroller flash", 1024 * 1024, 8),
                           ("16-bit words, 1 Mi words", 1024 * 1024, 16),
                           ("32-bit address, bytes", 2 ** 32, 8)]:
    addr = math.ceil(math.log2(words))
    print(f"{name:<26} {words:>11} words × {width:>2} bits → {addr:>2} address lines, {size(words * width / 8)}")

# DRAM: every row must be refreshed every 64 ms
ROWS = 8192
TIME_MS = 64
print(f"\nDRAM: {ROWS} rows / {TIME_MS} ms → one row refresh every {TIME_MS * 1000 / ROWS:.2f} µs")
```

Two practical lessons:

- **Every extra address line doubles** the addressable space. That's why 32-bit processors could "only" see 4 GiB of memory directly – one of the main reasons for the switch to 64 bits.
- The cells of **DRAM** are small capacitors that slowly discharge, so every row has to be rewritten regularly (typically every 64 ms). With 8192 rows that's one refresh operation **about every 7.8 µs**, continuously, in the background – done by the memory controller. SRAM (built from flip-flops) doesn't need this, so it's faster, but it takes 6 transistors per cell, compared with DRAM's 1 transistor + 1 capacitor: it's more expensive and smaller in capacity. That's why SRAM is the processor's cache and DRAM the main memory.

## Summary

- An asynchronous counter passes through **false states** during a transition (e.g. 7 → 6 → 4 → 0 → 8), and it's slow; a synchronous counter changes all at once.
- Ring counter: n flip-flops → n states; Johnson: → **2n** states, with one bit change per step.
- LFSR: shift register + XOR feedback → pseudo-random sequence, period at most **2<sup>n</sup> − 1**; CRC, scrambling, self-test.
- k address lines → 2<sup>k</sup> words; DRAM must be refreshed continuously, SRAM doesn't.

## Lesson exercise

```quiz required
? A 4-bit asynchronous counter steps from 0111 to 1000. Which false state does it pass through on the way?
- 1111
+ 0000
- 1001
- none, it changes all at once
! The bits toggle one after another: 0111 → 0110 → 0100 → 0000 → 1000.

? How many states does a Johnson counter with 5 flip-flops have?
= 10
! Johnson: 2n states.

? What is the largest possible period of a 5-bit LFSR?
= 31
! 2^5 − 1 = 31 (the all-zero state is left out).

? How many address lines does a 64 KiB byte-organised memory need?
= 16
! 64 Ki = 65,536 = 2^16.

? Why does DRAM need regular refreshing, but SRAM doesn't?
- because DRAM's flip-flops forget their state over time
+ because a DRAM cell is a capacitor that slowly discharges
- because the processor reads SRAM continuously
- because DRAM has no address decoder
! SRAM is built from flip-flops; as long as it has power, it keeps its state.
```
