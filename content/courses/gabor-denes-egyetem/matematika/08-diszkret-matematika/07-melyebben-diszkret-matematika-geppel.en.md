---
title: Deeper – Discrete Mathematics by Machine
summary: Checking logical equivalence with a truth table from a program, counting passwords and the time of a brute-force attack, the birthday paradox by formula and simulation, fast modular exponentiation (the engine of RSA), and Dijkstra's algorithm for the shortest path.
minutes: 45
---

## What you will learn in this lesson

- how to check **by machine** whether two logical formulas are equivalent,
- why a password's **length** matters more than anything else,
- why the chance of two shared birthdays is surprisingly **large**,
- how $7^{10^{18}}$ (modulo $m$) can be computed **in 60 steps**,
- how navigation finds the **shortest path** in a graph.

## 1. A truth table by program

Two formulas are **equivalent** if they give the same value for every possible assignment of truth values. With $n$ variables that's $2^n$ cases – child's play for a machine to try them all:

```python run
# Truth table by machine: are two logical formulas equivalent? (we try every possible assignment)
from itertools import product

def impl(a, b):
    return (not a) or b                       # A → B is false only if A is true and B is false

formulas = {
    "A → B  vs  ¬B → ¬A (contrapositive)": (lambda a, b: impl(a, b), lambda a, b: impl(not b, not a)),
    "A → B  vs  B → A   (converse)":       (lambda a, b: impl(a, b), lambda a, b: impl(b, a)),
    "¬(A ∧ B)  vs  ¬A ∨ ¬B (De Morgan)":   (lambda a, b: not (a and b), lambda a, b: (not a) or (not b)),
}
for name, (f, g) in formulas.items():
    diff = [(a, b) for a, b in product([False, True], repeat=2) if f(a, b) != g(a, b)]
    print(f"{name}: {'EQUIVALENT' if not diff else 'NOT equivalent, counterexample: ' + str(diff[0])}")
```

- The **contrapositive** ($A \to B \equiv \lnot B \to \lnot A$) always holds – indirect proof is based on it.
- The **converse** ($B \to A$), however, is not equivalent: "if it rains, the road is wet" is true, but "if the road is wet, it's raining" is not (maybe it was sprinkled). The counterexample: $A$ false, $B$ true.

Hardware designers' verification programs work the same way: they prove that the simplified circuit gives the same output as the original for every input.

## 2. Combinatorics in security: passwords

A password of length $n$ in which every character can be one of $k$ kinds has $k^n$ possibilities (variation with repetition). For an attacker trying 10 billion passwords per second:

```python run
# Combinatorics in security: how many passwords are there, and how long does it take to try them all?
speed = 10 ** 10                              # 10 billion attempts per second (a strong GPU)
cases = {
    "4-digit PIN":                 10 ** 4,
    "8 lowercase letters":         26 ** 8,
    "8 chars (lower+upper+digit)": 62 ** 8,
    "12 chars (lower+upper+digit)": 62 ** 12,
}
for name, count in cases.items():
    s = count / speed
    t = f"{s:.2g} s" if s < 60 else f"{s / 3600:.1f} hours" if s < 86400 * 365 else f"{s / (86400 * 365):,.0f} years"
    print(f"{name:<29}: {count:>24,} possibilities → {t}")
```

The **length** is in the exponent, so it's worth more than enlarging the character set: 12 characters instead of 8 increase the cracking time from hours to **thousands of years**. That's why security experts recommend long passphrases ("four random words").

## 3. The birthday paradox

How many people must be in a room for the chance that two share a birthday to be **greater than 50%**? Most people guess 183. Let's compute via the complementary event: the probability that **everyone** was born on a different day is $\frac{365}{365} \cdot \frac{364}{365} \cdot \ldots \cdot \frac{365 - n + 1}{365}$.

```python run
# The birthday paradox: what is the chance that two people in a group share a birthday?
import random

def exact(n):
    different = 1.0
    for i in range(n):
        different *= (365 - i) / 365          # person i was born on a day different from the others
    return 1 - different

r = random.Random(7)
for n in [10, 23, 50]:
    trial = sum(len(set(r.randrange(365) for _ in range(n))) < n for _ in range(20_000)) / 20_000
    print(f"{n} people: by formula {exact(n):.3f}, by simulation {trial:.3f}")
```

With just **23** people it's above $50\%$, with 50 it's $97\%$! The reason for the surprise: we don't compare with one particular person, we look at **every pair**, and 23 people form $\binom{23}{2} = 253$ pairs. This matters in computing too: for an $n$-bit hash function, after about $2^{n/2}$ attempts we are likely to find a collision (two inputs with the same hash) – that's why hashes must be long enough.

## 4. Fast modular exponentiation

RSA needs powers with huge exponents computed modulo a number. Computing $7^{1000}$ with 999 multiplications would be slow; for $7^{10^{18}}$ it's impossible. The trick: look at the exponent **in binary**, square in every round ($a, a^2, a^4, a^8, \ldots$), and multiply in where the bit is $1$. Taking the remainder after every step keeps the numbers from ever growing large.

```python run
# Fast modular exponentiation (square and multiply): a^k mod m in few steps
def fast_power(a, k, m):
    result, steps = 1, 0
    a %= m
    while k > 0:
        if k % 2 == 1:                        # if the current bit of the exponent is 1, multiply in
            result = result * a % m
        a = a * a % m                         # square for the next bit
        k //= 2
        steps += 1
    return result, steps

for k in [13, 1000, 10 ** 18]:
    value, steps = fast_power(7, k, 1_000_003)
    print(f"7^{k} mod 1000003 = {value:>7} | {steps} rounds (naively {k:,} multiplications)")
print("check with the built-in pow:", pow(7, 10 ** 18, 1_000_003))
```

The number of rounds is the **number of bits** of the exponent, about $\log_2 k$: even $10^{18}$ needs only 60 rounds. This is also the heart of Python's built-in `pow(a, k, m)`, and it's why encryption is fast – while for the prime factorisation needed to break it we know no such fast method.

## 5. Shortest path: Dijkstra's algorithm

Breadth-first search gives the path that is shortest in **number of steps**. If the edges have a **length** (weight) – say, kilometres – we need **Dijkstra's algorithm**: always take out the nearest vertex not yet processed, and check whether going through it gives a shorter path to its neighbours.

```python run
# Dijkstra's algorithm: the shortest path in a weighted graph (cities, km)
import heapq

roads = {
    "Budapest":     {"Győr": 121, "Kecskemét": 86, "Miskolc": 182, "Székesfehérvár": 65},
    "Győr":         {"Budapest": 121, "Székesfehérvár": 87, "Szombathely": 115},
    "Székesfehérvár": {"Budapest": 65, "Győr": 87, "Pécs": 160, "Szombathely": 160},
    "Kecskemét":    {"Budapest": 86, "Szeged": 87, "Pécs": 190},
    "Szeged":       {"Kecskemét": 87, "Pécs": 190},
    "Pécs":         {"Székesfehérvár": 160, "Kecskemét": 190, "Szeged": 190},
    "Miskolc":      {"Budapest": 182},
    "Szombathely":  {"Győr": 115, "Székesfehérvár": 160},
}

def dijkstra(start):
    dist, prev = {start: 0}, {}
    queue = [(0, start)]                      # priority queue: always take out the nearest
    while queue:
        d, v = heapq.heappop(queue)
        if d > dist[v]:
            continue                          # outdated entry
        for w, length in roads[v].items():
            if d + length < dist.get(w, float("inf")):
                dist[w], prev[w] = d + length, v
                heapq.heappush(queue, (d + length, w))
    return dist, prev

dist, prev = dijkstra("Szombathely")
path, v = ["Szeged"], "Szeged"
while v != "Szombathely":                     # follow the path backwards
    v = prev[v]
    path.append(v)
print(" → ".join(reversed(path)), f"= {dist['Szeged']} km")
```

The algorithm gives the path that is actually shortest in the graph: via Székesfehérvár, Budapest and Kecskemét it's 398 km, while via Pécs it would be $160 + 160 + 190 = 510$ km. This algorithm (and its improved versions) runs in navigation apps and in internet routers (e.g. in the OSPF protocol).

## Summary

- Equivalence: the same value for every ($2^n$) assignment; the contrapositive is equivalent, the converse isn't.
- A password of length $n$ from $k$ characters: $k^n$ – the length is in the exponent.
- Birthday paradox: with 23 people already $> 50\%$, because the number of pairs $\binom{n}{2}$ grows.
- Fast exponentiation: about $\log_2 k$ rounds, squaring + multiplying, with a remainder at every step.
- Dijkstra: shortest path in a weighted graph, always processing the nearest vertex.

## Lesson exercise

```quiz required
? Which formula is equivalent to the implication $A \to B$?
- $B \to A$
+ $\lnot B \to \lnot A$
- $\lnot A \to \lnot B$
- $A \land B$
! The contrapositive: $A \to B \equiv \lnot B \to \lnot A$.

? How many 4-digit PIN codes are there, if every digit can be 0–9?
= 10000
! Variation with repetition: $10^4 = 10000$.

? At least how many people must be in a group for the chance that two share a birthday to be greater than $50\%$?
= 23
! At $n = 23$ the probability is $\approx 0.507$.

? How many rounds does fast modular exponentiation need for the exponent $k = 1000$? (That's how many bits 1000 has in binary.)
= 10
! $1000 = 1111101000_2$, 10 bits.

? The edges of a graph and their lengths: A–B: 4, A–C: 1, C–B: 2, B–D: 5, C–D: 8. How long is the shortest path from A to D?
= 8
! A → C → B → D: $1 + 2 + 5 = 8$ (the direct A → C → D would be 9).
```
