---
title: Deeper – Sets in Programming and Probability
summary: Set operations and De Morgan's laws in Python, checking the inclusion–exclusion formula on 1000 numbers, listing every subset with a bitmask (why there are 2^n of them), and trying out the algebra of events with a hundred thousand simulated dice rolls.
minutes: 35
---

## What you will learn in this lesson

- how to **calculate with sets** in a program, and how to check De Morgan's laws by machine,
- the **inclusion–exclusion formula** for three sets, and why it gives an exact result,
- why an $n$-element set has **$2^n$ subsets**, and how a program lists them with a **bitmask**,
- how to **check by simulation** the formulas of the algebra of events.

## 1. Set operations in code

Python's `set` type is exactly the mathematical set: no repetition, no order, and similar operation symbols: `&` intersection, `|` union, `-` difference, `^` symmetric difference.

```python run
# Set operations in Python and checking De Morgan's laws
U = set(range(1, 21))                    # universal set: 1…20
A = {x for x in U if x % 2 == 0}         # even numbers
B = {x for x in U if x % 3 == 0}         # divisible by 3

print("A ∩ B =", sorted(A & B))
print("size of A ∪ B:", len(A | B))
print("A \\ B =", sorted(A - B))
print("A Δ B (symmetric difference) =", sorted(A ^ B))

# De Morgan: (A ∪ B)' = A' ∩ B'  and  (A ∩ B)' = A' ∪ B'
comp = lambda X: U - X
print("(A ∪ B)' = A' ∩ B' ?", comp(A | B) == comp(A) & comp(B))
print("(A ∩ B)' = A' ∪ B' ?", comp(A & B) == comp(A) | comp(B))
```

Let the universal set be $U = \{1, 2, \ldots, 20\}$, $A$ the set of even numbers and $B$ the set of numbers divisible by 3. Then $A \cap B$ is the set of numbers divisible by 6, and the machine says true for both De Morgan laws:

$$
\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.
$$

Important: this is **one example**, not a proof! An identity is proved by showing it holds for **every** set – this can be done by examining the sets element by element (or with a Venn diagram, thinking through all 8 possible regions). The machine, however, is excellent at **disproving**: if a supposed identity fails on even one example, it's false.

## 2. The inclusion–exclusion formula

How many numbers between 1 and 1000 are divisible by 2, 3 **or** 5? If we simply added up the sizes of the three sets, numbers belonging to several sets would be counted several times. The **inclusion–exclusion formula** corrects this:

$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|.
$$

```python run
# Inclusion–exclusion: |A ∪ B ∪ C| = |A| + |B| + |C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|
U = range(1, 1001)
A = {x for x in U if x % 2 == 0}
B = {x for x in U if x % 3 == 0}
C = {x for x in U if x % 5 == 0}

incl_excl = (len(A) + len(B) + len(C) - len(A & B) - len(A & C) - len(B & C) + len(A & B & C))
print("with inclusion–exclusion:", incl_excl)
print("counted directly:", len(A | B | C))
print("divisible by none of 2, 3, 5 between 1 and 1000:", 1000 - incl_excl)
```

On paper: $|A| = 500$, $|B| = 333$, $|C| = 200$, the pairwise intersections are $166$ (by 6), $100$ (by 10), $66$ (by 15), and the triple intersection $33$ (by 30). So $500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$ – matching the machine's direct count.

Why do we **add** the triple intersection at the end? The number 30, for example, is in all three sets: we added it three times, then subtracted it three times (it's in all three pairwise intersections), so it would be counted zero times – that's why it must be added once more. The same principle gives the formula $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ in probability.

## 3. Every subset: the bitmask

For the subsets of an $n$-element set, we decide for every element: **in or out**. That's $n$ yes/no decisions, that is, $n$ bits – and $2^n$ different numbers can be formed from $n$ bits. That's why the power set has $|\mathcal{P}(H)| = 2^n$ elements.

```python run
# Subsets with a bitmask: every subset of an n-element set is an n-bit number
items = ["apple", "pear", "plum"]
n = len(items)
for mask in range(2 ** n):                        # 0 … 2^n − 1
    subset = [items[i] for i in range(n) if mask >> i & 1]   # bit i: is item i in it?
    print(f"{mask:0{n}b} → {subset}")
print(f"{2 ** n} subsets in total")
```

The mask `101`, for example, means: item 0 (apple) is in, item 1 (pear) isn't, item 2 (plum) is. This is a very common technique in programming: permissions (read/write/execute = 3 bits), settings, or "try every combination" searches. But beware: $2^n$ grows very fast – with 30 elements there are already **more than a billion** subsets.

## 4. The algebra of events by simulation

In probability, **events** are sets: for two dice rolls the universal set is the 36 possible $(d_1, d_2)$ pairs. Let $A$ = "the first roll is a 6" and $B$ = "the sum is at least 10". Let's roll a hundred thousand times and count how often they occur!

```python run
# Algebra of events by simulation: two dice, A = "the first is a 6", B = "the sum is at least 10"
import random

r = random.Random(42)
N = 100_000
a_n = b_n = ab_n = aub_n = 0
for _ in range(N):
    d1, d2 = r.randint(1, 6), r.randint(1, 6)
    a, b = d1 == 6, d1 + d2 >= 10
    a_n += a
    b_n += b
    ab_n += a and b
    aub_n += a or b

print(f"P(A) ≈ {a_n / N:.3f}   (exactly 6/36 = {6 / 36:.3f})")
print(f"P(B) ≈ {b_n / N:.3f}   (exactly 6/36 = {6 / 36:.3f})")
print(f"P(A ∩ B) ≈ {ab_n / N:.3f}   (exactly 3/36 = {3 / 36:.3f})")
print(f"P(A ∪ B) ≈ {aub_n / N:.3f}   (by formula: P(A) + P(B) − P(A∩B) = {9 / 36:.3f})")
```

The simulated relative frequencies are very close to the exact values, and the formula $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ "comes out" too: $\frac{6}{36} + \frac{6}{36} - \frac{3}{36} = \frac{9}{36} = 0.25$. This kind of simulation is one of the most important practical tools of probability (the Monte Carlo method): if a problem is hard to solve with a formula, it can often be "played out" by machine.

## Summary

- Python `set`: `&` intersection, `|` union, `-` difference, `^` symmetric difference; an example doesn't prove an identity, but it can disprove one.
- Inclusion–exclusion: add the individual sets, subtract the pairwise intersections, add the triple intersection.
- An $n$-element set has $2^n$ subsets; a subset is an $n$-bit mask.
- Events = sets; $P(A \cup B) = P(A) + P(B) - P(A \cap B)$, which can be checked by simulation too.

## Lesson exercise

```quiz required
? In a year group of 40, 25 study English, 18 study German and 8 study both. How many study neither?
= 5
! $|E \cup G| = 25 + 18 - 8 = 35$, so $40 - 35 = 5$.

? How many subsets does a 6-element set have?
= 64
! $2^6 = 64$

? The subsets of $\{a, b, c, d\}$ are described by a 4-bit mask (bit 0 is $a$, …, bit 3 is $d$). Which subset does the mask $1010$ denote (bit 3 on the left)?
- $\{a, c\}$
+ $\{b, d\}$
- $\{a, b\}$
- $\{c, d\}$
! Bits 3 and 1 are 1: the elements $d$ and $b$.

? How many numbers between 1 and 100 are divisible by 2 or 5?
= 60
! $50 + 20 - 10 = 60$

? $P(A) = 0.5$, $P(B) = 0.4$, $P(A \cap B) = 0.2$. What is $P(A \cup B)$?
= 0.7
= 0,7
! $0.5 + 0.4 - 0.2 = 0.7$
```
