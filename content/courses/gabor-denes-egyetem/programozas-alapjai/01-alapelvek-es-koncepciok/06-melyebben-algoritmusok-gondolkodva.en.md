---
title: Deeper – Thinking in Algorithms
summary: The same task can have several algorithms – Euclid's two methods for the greatest common divisor, counting steps and a step-count chart, breaking a task into smaller parts, and one task written in three paradigms, with small runnable programs.
minutes: 50
---

## What you will learn in this lesson

- that the same task has **several correct algorithms**, and they can differ hugely in speed,
- how to **count** an algorithm's steps, and why that's the right measure (not a stopwatch),
- how to **break down** a bigger task into smaller parts that can be written separately,
- what the same solution looks like in **imperative**, **functional** and **object-oriented** style.

## 1. Two algorithms for the same thing: the greatest common divisor

In the basic lesson we saw that an algorithm is a precise, finite sequence of steps. The greatest common divisor (gcd) is one of the oldest known algorithms: Euclid described it about 2300 years ago. The original version works by **subtraction**: while the two numbers differ, subtract the smaller from the larger. The modern version jumps ahead with **division with remainder**:

```python run
# Two algorithms for the greatest common divisor, with step counting
def gcd_subtraction(a, b):
    steps = 0
    while a != b:
        steps += 1
        if a > b:
            a -= b          # subtract the smaller from the larger
        else:
            b -= a
    return a, steps

def gcd_remainder(a, b):
    steps = 0
    while b != 0:
        steps += 1
        a, b = b, a % b     # the remainder becomes the new smaller number
    return a, steps

for a, b in [(48, 18), (1071, 462), (1000, 3), (100000, 7)]:
    print(f"gcd({a}, {b}): by subtraction {gcd_subtraction(a, b)}, by remainder {gcd_remainder(a, b)}")
```

Both give the same result, but for the pair `(100000, 7)` the subtraction version takes **more than fourteen thousand** steps, the remainder version only four. Division with remainder does in one step what subtraction does by repeating many times. The lesson: an algorithm's **correctness** and its **efficiency** are two separate questions.

## 2. Step count: why don't we measure with a stopwatch?

A program's running time depends on the machine, the other running programs, even the temperature. That's why we compare algorithms by their **number of steps**, as a function of the input size ($n$). Take searching: in an unsorted list you have to look through half the list on average, but in a **sorted** list binary search halves what's left at every step.

```plot
title: Steps for searching a list of n elements
x: 1, 1000
y: 0, 500
f: x/2 # linear search: n/2 steps on average
f: log2(x) # binary search (in a sorted list): about log₂ n steps
```

```python run
# Comparing step counts: linear and binary search
from math import ceil, log2

for n in [10, 1000, 1_000_000, 1_000_000_000]:
    linear = n // 2
    binary = ceil(log2(n + 1))
    print(f"{n:>13,} elements: linear about {linear:>11,} steps, binary at most {binary:>2} steps")
```

With a billion elements, linear search takes half a billion steps, binary at most 30. You can't make that up with a faster processor – but you can with a **better algorithm**. The price: binary search needs the list to be **sorted**, which is work too. Whether it pays off depends on how many times you search the same list.

## 3. Breaking down the task

In the basic lesson we saw **stepwise refinement**: we break the big task into smaller subtasks until each one is simple. Example: "Make statistics of a group's scores!" This falls into three separate parts, each of which can be tried out on its own:

```python run
# Stepwise refinement: the big task splits into three small functions
def read_scores(text):
    """Subtask 1: a list of numbers from the text."""
    return [int(x) for x in text.split(",")]

def statistics(scores):
    """Subtask 2: the calculations."""
    return {"count": len(scores), "mean": sum(scores) / len(scores), "max": max(scores), "min": min(scores)}

def report(stat):
    """Subtask 3: formatting the output."""
    return f"{stat['count']} people, mean {stat['mean']:.1f}, best {stat['max']}, weakest {stat['min']}"

# the main program just puts the parts together
print(report(statistics(read_scores("78,92,65,88,71"))))
```

The benefits of breaking down: every part **can be tested separately**, a bug is easier to find, and a part (e.g. `read_scores`) can later be replaced without touching the others – if tomorrow the data comes from a file, only the first function changes.

## 4. The same thing in three paradigms

Task: add up the squares of the **even** numbers in a list. The same thing with three ways of thinking:

```python run
# The same task in imperative, functional and object-oriented style
numbers = [3, 4, 7, 10, 12, 15]

# 1) imperative: we say step by step WHAT TO DO
total = 0
for x in numbers:
    if x % 2 == 0:
        total += x * x
print("imperative:     ", total)

# 2) functional: we describe WHAT the result is (filter, transform, sum)
print("functional:     ", sum(x * x for x in numbers if x % 2 == 0))

# 3) object-oriented: the data and the operation on it in one object
class NumberSeries:
    def __init__(self, items):
        self.items = items

    def even_square_sum(self):
        return sum(x * x for x in self.items if x % 2 == 0)

print("object-oriented:", NumberSeries(numbers).even_square_sum())
```

All three give 260. Which is better? For a small task the functional one-liner is the most readable; if many operations belong to the data and it's used in several places, the object keeps it tidy; if a beginner reads it, the imperative one is easiest to follow. A paradigm is a **tool**, not a religion.

| Viewpoint      | What does a "good algorithm" mean to them?                                       |
| -------------- | -------------------------------------------------------------------------------- |
| **user**       | it answers quickly and always gives the correct result                           |
| **programmer** | understandable, easy to write and test, with few chances for bugs                |
| **maintainer** | still understandable in six months, a part replaceable without breaking the rest |
| **computer**   | few steps and little memory – that's running time and energy                     |

## Summary

- A task can have several correct algorithms; correctness and efficiency are two separate questions.
- We compare algorithms by step count, as a function of input size; a better algorithm is worth more than a faster machine.
- Stepwise refinement breaks the task into small, separately testable parts.
- The same solution can be written in several paradigms; the situation decides which is best.

## Lesson exercise: Euclid's algorithm

Write the `gcd(a, b)` function, which returns the greatest common divisor of two positive integers using the **remainder** version of Euclid's algorithm! While `b` isn't zero, replace the pair `(a, b)` with `(b, a % b)`; at the end `a` is the result. (Using `math.gcd` doesn't count this time.)

```python starter required
def gcd(a, b):
    # while b isn't zero: a, b = b, a % b
    return a


print(gcd(48, 18))
```

<details>
<summary>Solution</summary>

```python solution
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a


print(gcd(48, 18))
```

</details>

```python test
assert gcd(48, 18) == 6, "gcd(48, 18) = 6"
assert gcd(1071, 462) == 21, "gcd(1071, 462) = 21"
assert gcd(17, 5) == 1, "1 for coprime numbers"
assert gcd(7, 7) == 7, "the number itself for equal numbers"
```
