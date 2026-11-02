---
title: Recursion on the Call Stack
summary: What happens in memory during a recursive call, what a stack frame is, and why there is a recursion depth limit.
minutes: 15
---

## What you will learn

- what the **call stack** and a **stack frame** are,
- how the stack grows and shrinks during recursion,
- what **recursion depth** and **stack overflow** are,
- what **indirect** recursion is.

## The call stack

On every function call the program puts a **stack frame** on top of the call stack. It holds the call's **parameters**, **local variables** and the **return address**. When the function returns, its frame is removed. The stack is **LIFO**: the most recently called function is always the one running.

## Let's trace it

```python run
def factorial(n, depth=0):
    indent = "  " * depth
    print(f"{indent}→ factorial({n}) called")
    if n == 0:
        result = 1
    else:
        result = n * factorial(n - 1, depth + 1)
    print(f"{indent}← factorial({n}) = {result}")
    return result

factorial(4)
```

The state of the stack at the deepest point:

```text
┌──────────────────────┐  ← top of the stack (running now)
│ factorial(n=0)       │
├──────────────────────┤
│ factorial(n=1)       │  waiting: 1 * ?
├──────────────────────┤
│ factorial(n=2)       │  waiting: 2 * ?
├──────────────────────┤
│ factorial(n=3)       │  waiting: 3 * ?
├──────────────────────┤
│ factorial(n=4)       │  waiting: 4 * ?
├──────────────────────┤
│ main program         │
└──────────────────────┘
```

The two phases of recursion:

1. **Descending phase:** calls pile up until the base case is reached.
2. **Ascending phase:** the base case returns its value and the frames are removed one by one, each finishing its own computation.

## Recursion depth and stack overflow

Every frame uses memory and the stack is finite. Too deep recursion causes a **stack overflow**. Python prevents this with a limit (about 1000 levels by default):

```python run
import sys
print(sys.getrecursionlimit())

def depth(n):
    if n == 0:
        return 0
    return 1 + depth(n - 1)

print(depth(500))             # this still fits
try:
    depth(100_000)            # this doesn't
except RecursionError as error:
    print("RecursionError:", error)
```

> `sys.setrecursionlimit()` can raise the limit, but that's usually a bad fix: if you need such deep recursion, rewrite it iteratively.

## Indirect (mutual) recursion

Recursion can also be **indirect**: `A` calls `B`, and `B` calls `A`.

```python run
def is_even(n):
    return True if n == 0 else is_odd(n - 1)

def is_odd(n):
    return False if n == 0 else is_even(n - 1)

print(is_even(10), is_odd(7), is_even(3))
```

## Summary

- Every call gets a **stack frame** (parameters, local variables, return address).
- Recursion builds the stack in the **descending** phase and unwinds it in the **ascending** phase.
- Too deep recursion → `RecursionError` (stack overflow); Python's default limit is about 1000.
- Indirect recursion: functions call each other.

## Lesson exercise: Depth of nested lists

Write a **recursive** `depth(data)` function that tells how deeply lists are nested:

- anything that is not a list has depth 0;
- the depth of a list is 1 + the greatest depth of its elements (1 for an empty list).

For example `depth([1, [2, [3]], 4])` → 3. Think about how many stack frames are on the call stack at the same time during such a call!

```python starter required
def depth(data):
    if not isinstance(data, list):
        return 0
    # 1 + the depth of the deepest element
    pass


print(depth([1, [2, [3]], 4]))   # 3
```

<details>
<summary>Solution</summary>

```python solution
def depth(data):
    if not isinstance(data, list):
        return 0
    deepest = 0
    for item in data:
        deepest = max(deepest, depth(item))
    return 1 + deepest


print(depth([1, [2, [3]], 4]))   # 3
```

</details>

```python test
assert depth([1, [2, [3]], 4]) == 3, "The depth of [1, [2, [3]], 4] is 3."
assert depth(5) == 0, "Anything that is not a list has depth 0."
assert depth([]) == 1, "An empty list has depth 1."
assert depth([[], [[]]]) == 3, "The depth of [[], [[]]] is 3."
assert depth([1, 2, 3]) == 1, "A flat list has depth 1."
```
