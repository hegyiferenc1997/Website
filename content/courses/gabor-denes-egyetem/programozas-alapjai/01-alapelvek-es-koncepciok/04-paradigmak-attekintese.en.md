---
title: Overview of Programming Paradigms
summary: A paradigm is a "way of thinking" about programming – a short map before we cover it in detail in the next topic.
minutes: 8
---

## What is a paradigm?

A **programming paradigm** is a style of thinking: which concepts we use to describe a program and how we organise the code. The same task can be solved in several paradigms.

| Paradigm        | Core idea                                                           | Typical languages          |
| --------------- | ------------------------------------------------------------------- | -------------------------- |
| imperative      | step by step we say **how** the state should change                 | C, Pascal, Python          |
| procedural      | imperative code split into **procedures / functions**               | C, Python                  |
| object-oriented | data and the operations on it live together in **objects**          | Java, C#, Python, Ruby     |
| functional      | the program is a **composition of functions**, without side effects | Haskell, F#, partly Python |
| declarative     | we describe **what** we want, not how                               | SQL, HTML, Prolog          |

## The same task in two ways

Task: the sum of the squares of the even numbers from 1 to 10.

```python run
# Imperative style: we modify the total variable step by step.
total = 0
for i in range(1, 11):
    if i % 2 == 0:
        total += i * i
print(total)   # 220

# Declarative / functional style: we describe WHAT to sum.
print(sum(i * i for i in range(1, 11) if i % 2 == 0))   # 220
```

> Python is a **multi-paradigm** language: you can program in it imperatively, object-oriented and with functional elements. That is one reason it is a good first language.

Paradigms are covered in detail, with examples, in the **Programming Languages and Paradigms** topic.

## Summary

- A paradigm is a way of structuring programs.
- Main paradigms: imperative (procedural), object-oriented, functional, declarative.
- Python supports several paradigms.

## Lesson exercise: The same thing in two styles

Compute the sum of the squares of the **odd** numbers between 1 and `n` in two ways:

- `imperative(n)`: step by step, with an accumulator variable and a `for` loop;
- `declarative(n)`: in a single expression with the `sum()` function (as in the lesson's example).

For example, for `n = 5`: 1² + 3² + 5² = 35.

```python starter required
def imperative(n):
    total = 0
    # loop from 1 to n, add the squares of the odd numbers
    return total


def declarative(n):
    # a single line: return sum(...)
    pass
```

<details>
<summary>Solution</summary>

```python solution
def imperative(n):
    total = 0
    for i in range(1, n + 1):
        if i % 2 == 1:
            total += i * i
    return total


def declarative(n):
    return sum(i * i for i in range(1, n + 1) if i % 2 == 1)
```

</details>

```python test
assert imperative(5) == 35, "imperative(5): 1 + 9 + 25 = 35"
assert declarative(5) == 35, "declarative(5): 1 + 9 + 25 = 35"
for n in [0, 1, 10, 99]:
    assert imperative(n) == declarative(n), f"The two solutions differ for n = {n}."
assert imperative(10) == 165, "imperative(10) should be 165."
```
