---
title: Deeper – Languages Examined with Programs
summary: Choosing a language with a weighted decision matrix, from several viewpoints, why Python's built-in functions are faster than a hand-written loop (measured), how C and Python divide integers with negative numbers, and how Python manages memory (reference counting, garbage collection) – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- how to make a **justified** language choice with a weighted decision matrix,
- why the same task runs faster with Python's **built-in** functions than with a hand-written loop,
- how languages **differ** in small but important rules (e.g. integer division with negative numbers),
- how Python manages **memory**, and how this differs from C or Rust.

## 1. Choosing a language with a decision matrix

In the basic lesson we saw the criteria for choosing a language. In a real decision the criteria are **not equally important**: for a mobile app the platform matters, for an embedded system speed and memory. A weighted decision matrix puts numbers on this:

```python run
# Weighted decision matrix: which language fits a given project?
scores = {   # 1–5 points per criterion (illustrative, not absolute truth)
    "Python":     {"speed": 2, "learnability": 5, "libraries": 5, "memory": 2, "team knows it": 5},
    "C":          {"speed": 5, "learnability": 2, "libraries": 3, "memory": 5, "team knows it": 3},
    "Java":       {"speed": 4, "learnability": 3, "libraries": 5, "memory": 3, "team knows it": 4},
    "JavaScript": {"speed": 3, "learnability": 4, "libraries": 5, "memory": 3, "team knows it": 4},
}

projects = {   # weights: how important the criterion is (1 in total)
    "data analysis":          {"speed": 0.1, "learnability": 0.2, "libraries": 0.4, "memory": 0.0, "team knows it": 0.3},
    "washing machine control": {"speed": 0.3, "learnability": 0.0, "libraries": 0.1, "memory": 0.5, "team knows it": 0.1},
    "banking back end":       {"speed": 0.3, "learnability": 0.1, "libraries": 0.3, "memory": 0.1, "team knows it": 0.2},
}

for project, weights in projects.items():
    values = {lang: sum(weights[c] * p for c, p in sc.items()) for lang, sc in scores.items()}
    ranking = sorted(values.items(), key=lambda t: -t[1])
    print(f"{project:<24}", " > ".join(f"{n} ({v:.1f})" for n, v in ranking))
```

From the same scores a **different** language wins for each project – there's no "best language", only the one that fits the task best. The method's strength is that the decision is **transparent**: if someone disputes it, you can see exactly which weight or score the disagreement is about. The scores are of course debatable – that's exactly why it's worth filling them in together with the team.

## 2. Why is a built-in function faster?

Python is an interpreted language, so every step of a hand-written loop means a lot of work for the interpreter. Built-in functions (`sum`, `max`, `sorted`), however, are written **in C**, and their loop runs as machine code:

```python run
# The same summing three ways – the built-in sum is the fastest
import time

numbers = list(range(1_000_000))

def measure(name, function):
    start = time.perf_counter()
    result = function()
    print(f"{name:<24} {result}  {(time.perf_counter() - start) * 1000:7.1f} ms")

def hand_loop():
    total = 0
    for x in numbers:
        total += x
    return total

measure("hand-written for loop:", hand_loop)
measure("generator expression:", lambda: sum(x for x in numbers))
measure("built-in sum:", lambda: sum(numbers))
```

The exact times differ by machine and browser, but the built-in `sum` is almost always by far the fastest, several times faster than the hand-written loop. This is Python's "secret": the slow interpreted part is only **glue**, the heavy work is done by libraries written in C (NumPy, pandas and the machine learning libraries work this way too). That's why Python can be one of the main languages of scientific computing, even though the interpreter itself is slow.

## 3. Small rules, big differences

Languages sometimes give the same operation **a different meaning**. A classic example is integer division with negative numbers. Python's `//` rounds down (towards minus infinity), while C, Java, C# and JavaScript's `Math.trunc` cut **towards zero**:

```python run
# Integer division with negative numbers: Python rounds down
import math

print(f"{'a':>3} {'b':>3} | {'Python //':>9} {'Python %':>8} | {'cut towards zero':>16}")
for a, b in [(7, 2), (-7, 2), (7, -2), (-7, -2)]:
    cut = math.trunc(a / b)                        # how C's integer division rounds
    print(f"{a:>3} {b:>3} | {a // b:>9} {a % b:>8} | {cut:>16}")
```

`-7 // 2` is `-4` in Python, `-3` in C. If you "translate" an algorithm from one language to another, such differences quietly give wrong results – the program runs, it just doesn't compute the right thing. A similar trap is JavaScript's `==` operator (`"0" == 0` is true), or that Java's `==` compares references for strings, not their content.

## 4. Memory management: who cleans up?

In C the programmer allocates (`malloc`) and frees (`free`) memory **themselves** – if they forget, the program eats more and more memory (a memory leak); if they free twice, it can crash. Python cleans up **automatically**: for every object it counts how many names refer to it, and when the count drops to zero, it frees it. Circular references are found by a garbage collector:

```python run
# Reference counting and garbage collection in Python
import gc
import sys

data = [1, 2, 3]
print("number of references:", sys.getrefcount(data) - 1)  # -1: getrefcount's own parameter
other = data
print("with another name:   ", sys.getrefcount(data) - 1)
del other
print("after deleting it:   ", sys.getrefcount(data) - 1)

class Node:
    def __init__(self, name):
        self.name, self.neighbour = name, None

a, b = Node("a"), Node("b")
a.neighbour, b.neighbour = b, a        # a circular reference: they point to each other
del a, b                               # the names are gone, but the two objects still point to each other
print("objects freed by the garbage collector:", gc.collect() >= 2)
```

Convenience has a price: reference counting means work on every assignment, and the garbage collector may "pause" the program for a moment now and then. **Rust** chose a third way: with its **ownership** rules the compiler checks at compile time that every piece of memory is freed exactly once – so neither a garbage collector nor a manual `free` is needed. That's why it's spreading in systems programming.

| Viewpoint      | What do they weigh when choosing a language?                                      |
| -------------- | --------------------------------------------------------------------------------- |
| **developer**  | whether progress is fast in it, whether the tools and error messages are good     |
| **operator**   | memory and CPU needs, deployability, long-term support                            |
| **management** | whether there are enough developers on the market, what training costs            |
| **security**   | manual memory management (C, C++) is the source of a large share of security bugs |

## Summary

- A weighted decision matrix makes language choice transparent; a different language can win for each project.
- Python's built-in functions run in C, so they're much faster than a hand-written loop.
- Languages differ in small rules (e.g. integer division with negative numbers) – translating code can cause silent bugs.
- Python cleans up with reference counting and garbage collection; C by hand, Rust with compile-time rules.

## Lesson exercise: division the C way

Write the `c_division(a, b)` function, which returns the quotient and remainder of two integers as a `(quotient, remainder)` pair the way C computes them: the quotient rounds **towards zero**, and the remainder is such that `quotient * b + remainder == a` holds (so the remainder has the sign of the dividend, `a`). Don't use floating-point division: compute it with absolute values, and then set the signs.

```python starter required
def c_division(a, b):
    return (a // b, a % b)


print(c_division(-7, 2))
```

<details>
<summary>Solution</summary>

```python solution
def c_division(a, b):
    quotient = abs(a) // abs(b)
    if (a < 0) != (b < 0):
        quotient = -quotient
    remainder = a - quotient * b
    return (quotient, remainder)


print(c_division(-7, 2))
```

</details>

```python test
assert c_division(7, 2) == (3, 1), "7 / 2 → (3, 1)"
assert c_division(-7, 2) == (-3, -1), "-7 / 2 → (-3, -1) rounded towards zero"
assert c_division(7, -2) == (-3, 1), "7 / -2 → (-3, 1)"
assert c_division(-7, -2) == (3, -1), "-7 / -2 → (3, -1)"
assert c_division(10**20 + 1, -3) == (-((10**20 + 1) // 3), 2), "exact for big numbers too (that's why float won't do)"
```
