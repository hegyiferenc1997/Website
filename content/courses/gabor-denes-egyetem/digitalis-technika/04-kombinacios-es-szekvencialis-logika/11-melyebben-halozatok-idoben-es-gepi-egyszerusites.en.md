---
title: Deeper – Networks in Time and Machine Simplification
summary: The Quine–McCluskey method as the machine version of the Karnaugh map (prime implicants, essential terms), simulating a static hazard step by step, the delay of ripple-carry and carry-lookahead adders by bit count, and metastability and the two-stage synchronizer in numbers.
minutes: 45
---

## What you will learn in this lesson

- how a **program** simplifies without a Karnaugh map (the Quine–McCluskey method), and what an **essential prime implicant** is,
- to follow **in time** how a hazard glitch is born, and how the redundant term removes it,
- to **calculate** why a ripple-carry adder is slow at 64 bits, and how much carry-lookahead gains,
- to **estimate** how often metastability causes a failure with one and with two flip-flops.

## 1. The machine version of the Karnaugh map: Quine–McCluskey

The Karnaugh map is convenient up to 4–5 variables, after that it becomes unreadable. The machine uses the same idea **systematically**: two minterms can be merged if they differ in exactly one bit (e.g. 0101 and 0111 → 01-1, where `-` means "this variable dropped out"). It repeats the merging as long as possible; what can't be merged any further is a **prime implicant** – the largest group of the Karnaugh map that can't be extended.

```python run
# Quine–McCluskey: the "machine" version of the Karnaugh map – finding prime implicants
from itertools import combinations

def merge(x, y):
    # two terms can be merged if they differ in exactly one place (e.g. 0101 and 0111 → 01-1)
    diff = [i for i in range(len(x)) if x[i] != y[i]]
    if len(diff) == 1 and "-" not in (x[diff[0]], y[diff[0]]):
        i = diff[0]
        return x[:i] + "-" + x[i + 1:]
    return None

def prime_implicants(minterms, n):
    terms = {format(m, f"0{n}b") for m in minterms}
    primes = set()
    while terms:
        new, used = set(), set()
        for x, y in combinations(sorted(terms), 2):
            z = merge(x, y)
            if z:
                new.add(z)
                used |= {x, y}
        primes |= terms - used                      # what can't be merged any further
        terms = new
    return primes

def expression(term, names="ABCD"):
    return "·".join(names[i] + ("'" if b == "0" else "") for i, b in enumerate(term) if b != "-") or "1"

def covers(term, m, n):
    return all(t in ("-", b) for t, b in zip(term, format(m, f"0{n}b")))

def analyse(minterms, n):
    primes = sorted(prime_implicants(minterms, n))
    for p in primes:
        cov = [m for m in minterms if covers(p, m, n)]
        # essential if there is a minterm that only this prime covers
        essential = any(sum(covers(q, m, n) for q in primes) == 1 for m in cov)
        print(f"  {p} = {expression(p):<8} covers: {cov}" + ("  ← essential" if essential else ""))

print("F1(A,B,C,D) = Σm(0, 2, 5, 7, 8, 10, 13, 15):")
analyse([0, 2, 5, 7, 8, 10, 13, 15], 4)
print("F2(A,B,C) = Σm(0, 1, 2, 5, 6, 7):")
analyse([0, 1, 2, 5, 6, 7], 3)
```

What do you see?

- **F1** has two prime implicants, and both are **essential**: there is a minterm (e.g. 0 or 5) that only that prime covers. These will certainly be in the simplified form: **F1 = B̅·D̅ + B·D**. On the Karnaugh map these are the four corners and the group of four in the middle.
- **F2** has **six** prime implicants, but **none is essential** – every minterm is covered by at least two primes. This is the _cyclic_ case: you have to choose, and **three** primes are enough (e.g. A̅·C̅ + B̅·C + A·B). On the Karnaugh map this is a chain of groups that "wraps around", with several equally good solutions.

Real design tools (e.g. synthesis for FPGA development) use improved, fast versions of this – your job is the design, the simplification is done by the machine today. But you have to understand what it does, otherwise you can't check it.

## 2. The birth of a hazard – step by step

With B = C = 1, the function F = A·B + A̅·C is **always 1**, whatever A is. Yet when A switches from 1 to 0, a 0 appears at the output for a moment. Why? Because the A̅ signal arrives through an inverter, **late**. Let's simulate it, giving every gate a delay of 1 time unit:

```python run
# A static hazard in time: F = A·B + A'·C, B = C = 1, and A switches 1 → 0
# Every gate has a delay of 1 time unit; we compute the signals step by step.
def simulate(redundant_term):
    B = C = 1
    nA, t1, t2, F = 0, 1, 0, 1                       # the initial stable state at A = 1
    t3 = 1 if redundant_term else 0
    row = []
    for t in range(6):
        A = 1 if t < 1 else 0                        # A falls at t = 1
        # every gate computes from the PREVIOUS step's signals (that's the delay)
        nA, t1, t2, t3, F = (1 - A, A & B, nA & C, B & C if redundant_term else 0,
                             t1 | t2 | t3)
        row.append(F)
    return row

print("time:           0 1 2 3 4 5")
print("F = AB + A'C:  ", " ".join(map(str, simulate(False))), "  ← glitch!")
print("F with BC term:", " ".join(map(str, simulate(True))))
```

Follow the time:

- **t = 1**: A falls. The A·B gate still computes from the old A = 1, and the inverter still gives the old A̅ = 0.
- **t = 2**: the A·B term is already 0, but the A̅·C term is still 0, because the inverter's output has only just become 1 → **F = 0**: that's the glitch!
- **t = 3**: the A̅·C term has become 1 too, F returns to 1.

The redundant **B·C** term (the consensus term) doesn't depend on A, so it keeps the output at 1 during the transition as well. On the Karnaugh map it's the group that "bridges" the border between the two neighbouring groups.

**Analogy:** at the changing of the guard, one guard has already left and the other hasn't arrived yet – for a moment nobody is guarding the gate. The redundant term is a third guard who stays there all the time.

## 3. Why isn't ripple carry enough at 64 bits?

In a ripple-carry adder every bit's carry waits for the previous one: about **2 gate levels** per bit. A carry-lookahead adder computes the carries in advance in 4-bit blocks and arranges the blocks in a tree, so the delay grows with the **logarithm** of the bit count.

```python run
# Delay of ripple-carry and carry-lookahead adders
T = 1.0                                              # ns, the delay of one gate level

def ripple(n):
    return 2 * n * T                                 # 2 gate levels per bit on the carry path

def lookahead(n):
    # 4-bit CLA blocks arranged in a tree: about 2 gate levels per level + 2 at the end
    levels, block = 1, 4
    while block < n:                                 # how many levels the tree of 4s has
        levels, block = levels + 1, block * 4
    return (2 * levels + 2) * T

print(f"{'bits':>4} | {'ripple-carry':>12} | {'carry-lookahead':>15}")
for n in [4, 8, 16, 32, 64]:
    print(f"{n:>4} | {ripple(n):>9.0f} ns | {lookahead(n):>12.0f} ns")
```

At 64 bits the ripple version takes **128 ns** (that would allow a clock of at most ~8 MHz!), the lookahead one **8 ns** – sixteen times faster. The price: many more gates. This is the eternal bargain of digital design: **speed versus area (gate count)**. That's why the ALU of modern processors always has some kind of lookahead (or even more advanced, e.g. Kogge–Stone) adder.

## 4. Metastability in numbers

If a flip-flop's input changes right in the critical window around the clock edge (setup + hold), its output can become **metastable**: for a while it's neither 0 nor 1, and only "settles" after a random time. With an external, asynchronous signal (a button, a sensor, another clock domain) this inevitably happens sometimes. The only question is **how often** it causes a failure. The usual estimate:

**MTBF = e<sup>t<sub>resolve</sub> / τ</sup> / (T<sub>0</sub> · f<sub>clock</sub> · f<sub>data</sub>)**

where t<sub>resolve</sub> is the time the flip-flop can "think" before someone uses its output.

```python run
# Metastability: mean time between failures (MTBF) with one and two flip-flops
import math

TAU = 0.2e-9           # s, the flip-flop's "resolution" time constant (datasheet value, example)
T0 = 100e-12           # s, the dangerous time window (example)
F_CLK = 100e6          # Hz, clock
F_DATA = 1e6           # Hz, how many times per second the external (asynchronous) signal changes

def mtbf_s(t_resolve):
    return math.exp(t_resolve / TAU) / (T0 * F_CLK * F_DATA)

T_CLK = 1 / F_CLK
one = mtbf_s(0.2 * T_CLK)        # 1 FF: only a small part of the period is left for resolving
two = mtbf_s(1.0 * T_CLK)        # 2 FFs: a whole clock period is available

year = 365 * 24 * 3600
print(f"1 flip-flop:  MTBF ≈ {one:.3g} s")
print(f"2 flip-flops: MTBF ≈ {two:.3g} s ≈ {two / year:.3g} years")
```

With a single flip-flop the system can fail **every few seconds**! If we put a second flip-flop behind it (a **two-stage synchronizer**), the first one has a whole clock period to settle – and because t<sub>resolve</sub> is in the **exponent**, the MTBF grows to over **ten billion years** (longer than the age of the Universe). That's why there are two flip-flops behind every asynchronous input: this is one of the most important "always do it this way" rules of digital design.

## Summary

- The Quine–McCluskey method is the machine version of the Karnaugh map: it finds **prime implicants** by merging; the **essential** ones must always be included, in the cyclic case you have to choose.
- Static hazard: because the negated signal arrives late, the output drops out for a moment; the **consensus term** removes it.
- Ripple-carry: delay ∝ n; carry-lookahead: ∝ log n – at the cost of more gates.
- Metastability: the MTBF grows **exponentially** with the time margin; an asynchronous signal needs a **two-flip-flop synchronizer**.

## Lesson exercise

```quiz required
? Simplify: F = A'·B'·C' + A'·B·C' + A·B'·C + A·B·C
expr: A, B, C -> A'·C' + A·C
limit: 4
same: A'·B'·C' + A'·B·C' + A·B'·C + A·B·C
! Two groups of two: A̅·C̅ (minterms 0 and 2) and A·C (minterms 5 and 7).

? Which term removes the static hazard in the function F = A·B + A'·C?
- A·C
+ B·C
- A'·B
- there is no such term, the hazard can't be removed
! The consensus term doesn't depend on A, so it keeps the output at 1 during the switch.

? Fill in the truth table of the full adder's carry out (K)! (C is the carry in.)
table: A, B, C -> K = A·B + C·(A ⊕ B)
! K = 1 if at least two inputs are 1.

? In a ripple-carry adder there are 2 gate levels per bit on the carry path, and one gate level is 1 ns. What is the delay of a 32-bit adder (ns)?
= 64
! 2 · 32 · 1 ns.

? Why does the MTBF grow so dramatically when a second flip-flop is added to the synchronizer?
- because the second flip-flop is faster
- because the second flip-flop filters out the noise
+ because the time available for resolving is in the exponent, and it grows by a whole period
- because there can be no metastability between two flip-flops
! MTBF ∝ e^(t/τ): even a small increase in time gives a huge factor.
```
