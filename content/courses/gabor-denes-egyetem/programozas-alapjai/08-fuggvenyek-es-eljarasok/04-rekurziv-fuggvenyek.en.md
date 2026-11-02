---
title: Recursive Functions
summary: A function that calls itself – base case, recursive case and first examples. More in the Recursion and Iteration topic.
minutes: 12
---

## What you will learn

- what a **recursive function** is,
- what the **base case** and the **recursive case** are,
- how to write a simple recursive function.

## What is recursion?

A function is **recursive** if it **calls itself**. It reduces the task to a smaller task of the same kind, until it reaches a case simple enough to solve directly.

Every recursive function has two parts:

1. **Base case:** the simplest case, where it doesn't call itself but returns a value directly.
2. **Recursive case:** splits the task into a **smaller** subtask and calls itself on it.

## Example: factorial

The definition of factorial is itself recursive: `n! = n · (n−1)!`, and `0! = 1`.

```python run
def factorial(n):
    if n == 0:                         # base case
        return 1
    return n * factorial(n - 1)        # recursive case: a smaller task

print(factorial(5))   # 120
```

This is how the call unfolds:

```text
factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= 5 * 4 * 3 * factorial(2)
= 5 * 4 * 3 * 2 * factorial(1)
= 5 * 4 * 3 * 2 * 1 * factorial(0)
= 5 * 4 * 3 * 2 * 1 * 1
= 120
```

## Example: countdown

```python run
def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)

countdown(3)
```

## Example: sum of a list

```python run
def total(values):
    if not values:                         # base case: an empty list sums to 0
        return 0
    return values[0] + total(values[1:])   # first element + sum of the rest

print(total([3, 1, 4, 1, 5]))   # 14
```

## If the base case is missing

Without a base case (or if the task doesn't get smaller) the function would call itself forever. Python stops it after a while:

```python
def bad(n):
    return n * bad(n - 1)   # no base case!

bad(5)   # RecursionError: maximum recursion depth exceeded
```

> **Checklist for a recursive function:** 1) Is there a base case? 2) Does every recursive call get closer to the base case? 3) Is the result correct in the base case?

How recursion works (the call stack), comparison with iteration and recursive algorithms are covered in detail in the **Recursion and Iteration** topic.

## Summary

- A recursive function calls itself on a smaller subtask.
- It needs a **base case** (stopping) and a **recursive case** (reducing the task).
- Without a base case a `RecursionError` occurs.
