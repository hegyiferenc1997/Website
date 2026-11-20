---
title: Deeper – Boolean Algebra on the Machine
summary: Proving identities by brute force (comparing truth tables and searching for a counterexample), an experiment on which of the 16 two-input gates is universal on its own, XOR from four NANDs in a simulator, and why the NAND–NAND form is cheaper in transistors.
minutes: 40
---

## What you will learn in this lesson

- how a program can **prove** any Boolean identity, and find a **counterexample** for a false "identity",
- to see by **experiment** which of the 16 two-input gates is universal on its own (and why AND or XOR isn't),
- to follow the signals of an XOR built **from NANDs only**, and estimate its delay,
- to calculate why a NAND–NAND network needs **fewer transistors** than an AND–OR one.

## 1. Proof by brute force

Algebraic manipulation is elegant, but easy to get wrong. An identity of n variables has only **2<sup>n</sup>** input combinations – a machine tries them all in an instant. If the two sides agree in every row, the identity is **proved** (this is the method of _exhaustive checking_); if they differ in even one row, we have a **counterexample**.

```python run
# Proving identities by "brute force": we try every input combination
from itertools import product

def equivalent(f, g, n):
    for inputs in product([0, 1], repeat=n):
        if f(*inputs) != g(*inputs):
            return inputs                        # counterexample
    return None                                  # they agree in every row

identities = [
    ("distributive: A + B·C = (A + B)·(A + C)",
     lambda a, b, c: a | (b & c), lambda a, b, c: (a | b) & (a | c)),
    ("absorption: A + A·B = A",
     lambda a, b, c: a | (a & b), lambda a, b, c: a),
    ("De Morgan: (A·B·C)' = A' + B' + C'",
     lambda a, b, c: 1 - (a & b & c), lambda a, b, c: (1 - a) | (1 - b) | (1 - c)),
    ("consensus: A·B + A'·C + B·C = A·B + A'·C",
     lambda a, b, c: (a & b) | ((1 - a) & c) | (b & c), lambda a, b, c: (a & b) | ((1 - a) & c)),
    ("FALSE: A + B·C = (A + B)·C",
     lambda a, b, c: a | (b & c), lambda a, b, c: (a | b) & c),
]
for name, f, g in identities:
    ce = equivalent(f, g, 3)
    print(f"{name:<44} → " + ("true (in all 8 rows)" if ce is None else f"FALSE, counterexample A,B,C = {ce}"))
```

Two lessons:

- The **consensus theorem** (A·B + A̅·C + B·C = A·B + A̅·C) looks suspicious at first – the B·C term just "disappears". The machine finds agreement in all 8 rows: if B·C = 1, then depending on A either the A·B or the A̅·C term is already 1, so the B·C term is redundant.
- For the false "identity" the counterexample is **A = 1, B = 0, C = 0**: the left side is 1, the right side is (1 + 0)·0 = 0. A single counterexample is enough to disprove it.

This method also works by hand up to 3–4 variables (it is simply the truth table), but with 30 variables it's 2<sup>30</sup> ≈ 1 billion rows – real design tools use cleverer methods there (e.g. BDDs, SAT solvers). The principle is the same: **two networks are equivalent if they give the same output for every input**.

## 2. Which gate is universal on its own? – an experiment

For two inputs there are **16** different logic functions (the outputs of the four rows can be chosen in 2<sup>4</sup> ways). From which one can all 16 be built **on its own**? The program starts from the inputs A and B, and keeps connecting the gate to the signals built so far, as long as new functions appear.

```python run
# Which two-input gate is universal on its own? We try all 16.
# A function = a 4-bit truth table: bit i is the output of row (A, B) = (i >> 1, i & 1).
A, B = 0b1100, 0b1010                            # the "columns" of the two inputs

def apply(gate, x, y):
    # applying the gate (a 4-bit table) to two columns, row by row
    z = 0
    for i in range(4):
        row = ((x >> i) & 1) * 2 + ((y >> i) & 1)
        z |= ((gate >> row) & 1) << i
    return z

def reachable(gate):
    # what can be built from this one gate (in any number of copies)?
    funcs = {A, B}
    while True:
        new = {apply(gate, x, y) for x in funcs for y in funcs} | funcs
        if new == funcs:
            return funcs
        funcs = new

names = {0b1000: "AND", 0b1110: "OR", 0b0110: "XOR", 0b0111: "NAND",
         0b0001: "NOR", 0b1001: "XNOR", 0b1011: "IMPLICATION (A → B)"}
for gate in range(16):
    n = len(reachable(gate))
    if gate in names or n == 16:
        print(f"{names.get(gate, '?'):<20} table {gate:04b}: {n:>2} / 16 functions buildable"
              + ("  ← UNIVERSAL" if n == 16 else ""))
```

The result of the experiment: of the 16 gates, **only NAND and NOR** are universal on their own. Why the others aren't can be read off too:

- **AND, OR** are _monotone_ gates: if an input rises from 0 to 1, the output never falls. Negation (A̅) can never be put together from monotone gates.
- **XOR, XNOR** are _linear_ gates: they only give parity-like functions (e.g. A ⊕ B), never AND.
- **IMPLICATION** is almost there: given a **constant 0** as well, it becomes universal (A → 0 = A̅). On its own, however, it can't produce 0.

**Analogy:** NAND is like the basic LEGO brick: you can build anything from one kind of piece. An AND gate is like having bricks that only fit "upwards" – you can never build downwards.

## 3. XOR from four NANDs – following the signals

In the universal gates lesson you saw that XOR is built from 4 NANDs. Let's follow the internal signals too, and see how long the signal takes to get through!

```python run
# XOR from NAND gates only (4 of them) – check and delay
def nand(x, y):
    return 1 - (x & y)

T_NAND = 8                                       # ns, the delay of one 74HC00 gate (approx.)

print(" A B | N1 N2 N3 |  Y  | A⊕B")
for a in (0, 1):
    for b in (0, 1):
        n1 = nand(a, b)                          # level 1
        n2, n3 = nand(a, n1), nand(b, n1)        # level 2
        y = nand(n2, n3)                         # level 3
        print(f" {a} {b} |  {n1}  {n2}  {n3} |  {y}  |  {a ^ b}")

print(f"\nThe longest path goes through 3 gates → delay ≈ 3 · {T_NAND} = {3 * T_NAND} ns")
```

The Y column matches the A ⊕ B column in every row – the network is correct. The trick is sharing the signal N1 = (A·B)̅: N2 = (A·N1)̅ is 0 only when A = 1 and B = 0, and N3 only when B = 1 and A = 0. The output NAND combines them like an OR ("any 0 → 1").

The signal passes through **3 gate levels**, so with a 74HC00 chip the output settles in about 24 ns. That's why manufacturers also make a dedicated XOR gate (74HC86): it's optimised at transistor level inside, and faster.

## 4. Transistor count: why is NAND so popular?

In CMOS a two-input **NAND or NOR is 4 transistors**, while **AND and OR are 6** (because they are really a NAND/NOR + an inverter). Let's calculate for the function F = A·B + C·D:

| Implementation | Gates              | Transistors    |
| -------------- | ------------------ | -------------- |
| AND–OR         | 2 × AND2 + 1 × OR2 | 3 × 6 = **18** |
| NAND–NAND      | 3 × NAND2          | 3 × 4 = **12** |

The same function (thanks to De Morgan), but **a third fewer** transistors, smaller chip area, lower power and shorter delay (one inverter fewer on the signal path). In a processor with a billion transistors that's a huge difference – which is why synthesis tools automatically convert networks to NAND/NOR-based form.

## Summary

- A Boolean identity can be proved by **exhaustive checking** (2<sup>n</sup> rows), and a single **counterexample** disproves it.
- The consensus theorem: A·B + A̅·C + B·C = A·B + A̅·C – the B·C term is redundant.
- Of the 16 two-input gates, **only NAND and NOR** are universal on their own; AND/OR are monotone, XOR/XNOR are linear, so they aren't.
- XOR = 4 NANDs, 3 gate levels deep.
- In CMOS NAND2/NOR2 = 4 transistors, AND2/OR2 = 6 – the NAND–NAND form is cheaper and faster.

## Lesson exercise

```quiz required
? Fill in the truth table! (This is a network built from NANDs – which well-known gate is it?)
table: A, B -> Y = (A'·B')'
! De Morgan: (A̅·B̅)̅ = A + B, so it's OR.

? Which of the 16 two-input gates is universal on its own?
- AND
- XOR
+ NOR
- IMPLICATION
! Only NAND and NOR; AND is monotone, XOR is linear, and implication also needs a constant 0.

? Simplify with the consensus theorem: F = A·B + A'·C + B·C
expr: A, B, C -> A·B + A'·C
limit: 4
same: A·B + A'·C + B·C
! The B·C term can be dropped.

? How many NAND gates are needed to build XOR (at least)?
= 4
! N1 = (AB)̅, N2 = (A·N1)̅, N3 = (B·N1)̅, Y = (N2·N3)̅.

? How many transistors does the function F = A·B + C·D need in CMOS in NAND–NAND form (3 NAND2 gates)?
= 12
! A CMOS NAND2 is 4 transistors.
```
