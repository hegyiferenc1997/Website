---
title: Describing and Designing Algorithms
summary: Pseudocode, flowcharts and breaking a task into smaller parts – this is how we plan before coding.
minutes: 15
---

## What you will learn

- how to describe an algorithm with **pseudocode** and a **flowchart**,
- what **stepwise refinement** (top-down design) is,
- which **three control structures** every algorithm can be built from.

## The three basic structures

Every algorithm can be built from three building blocks (the core theorem of **structured programming**):

1. **Sequence** – statements one after the other.
2. **Selection (branching)** – a different branch runs depending on a condition.
3. **Iteration (loop)** – repeating statements while a condition holds.

## Pseudocode

**Pseudocode** describes an algorithm in a precise form close to human language. It needs no specific programming language and ignores syntax details.

Task: compute the average of the elements of a list.

```text
Algorithm Average(list):
    sum := 0
    For each element x in the list:
        sum := sum + x
    End for
    If length of list > 0 then
        Return: sum / length of list
    else
        Return: 0
    End if
End algorithm
```

The same in Python, almost word for word:

```python run
def average(values):
    total = 0
    for x in values:
        total = total + x
    if len(values) > 0:
        return total / len(values)
    else:
        return 0

print(average([4, 5, 3, 4]))   # 4.0
```

## Flowcharts

A **flowchart** is a drawn description. The standard symbols:

| Symbol        | Meaning                             |
| ------------- | ----------------------------------- |
| oval          | START / STOP                        |
| parallelogram | input or output (reading, printing) |
| rectangle     | operation, assignment               |
| diamond       | decision (condition, yes/no branch) |
| arrow         | direction of execution              |

A text sketch of a simple flowchart (even or odd number):

```text
 (START)
    ↓
 /Read n/
    ↓
 <n % 2 == 0 ?> ──yes──→ /Print: even/ ──┐
    │ no                                 │
    ↓                                    │
 /Print: odd/                            │
    ↓  ←─────────────────────────────────┘
 (STOP)
```

## Stepwise refinement

A big task cannot be solved in one go. In **top-down design** we first split it into large steps, then refine each step further until every part is easy to write. This is **decomposition**.

Example: "Write a grade average calculator."

1. Read the grades.
2. Check that every grade is between 1 and 5.
3. Compute the average.
4. Print the result and a rating.

Step 3 refined: summing, dividing by the count, rounding to two decimals. Each small step will later become a **function**.

> **Tip:** before you start coding, write the steps down on paper or as comments. If you can't explain the solution in words, you won't manage it in code either.

## Abstraction

**Abstraction** means hiding the details and dealing only with what matters. When you use `print()`, you don't need to know how the screen draws the letters – it is enough to know _what_ it does. Good programs are built from such layers too.

## Summary

- Every algorithm can be built from **sequence, selection and iteration**.
- **Pseudocode** and **flowcharts** are language-independent design tools.
- **Stepwise refinement** (decomposition) and **abstraction** are the key to handling big tasks.

## Lesson exercise: Maximum search from pseudocode

Implement the pseudocode below in Python in the `largest(items)` function (without using the built-in `max()`):

```text
function largest(items):
    if items is empty: return "nothing" (None)
    best ← first element of items
    for each element x in items:
        if x > best: best ← x
    return best
```

```python starter required
def largest(items):
    # Follow the pseudocode step by step!
    pass


print(largest([3, 9, 2]))   # 9
```

<details>
<summary>Solution</summary>

```python solution
def largest(items):
    if len(items) == 0:
        return None
    best = items[0]
    for x in items:
        if x > best:
            best = x
    return best


print(largest([3, 9, 2]))   # 9
```

</details>

```python test
assert largest([3, 9, 2]) == 9, "largest([3, 9, 2]) should return 9."
assert largest([-5, -2, -8]) == -2, "It must work with all-negative numbers too (-2)."
assert largest([7]) == 7, "In a one-element list that element is the largest."
assert largest([]) is None, "For an empty list return None."
```
