---
title: Recursion or Iteration?
summary: The same task in two ways, the naive Fibonacci trap, memoisation, and criteria for choosing.
minutes: 18
---

## What you will learn

- how to turn recursion into **iteration** (a loop) and back,
- why the naive recursive Fibonacci is **slow**,
- what **memoisation** is,
- when to choose which.

## Every recursion can be written as iteration

Any recursive algorithm can be written with a loop (using an explicit stack if needed), and vice versa.

```python run
def factorial_recursive(n):
    if n == 0:
        return 1
    return n * factorial_recursive(n - 1)

def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial_recursive(10), factorial_iterative(10))
```

## The Fibonacci trap

The Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, … – each element is the sum of the previous two. The definition is recursive, and the direct translation works:

```python run
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])
```

But it is very **slow**, because it computes the same values over and over:

```text
                     fib(5)
                /             \
           fib(4)              fib(3)
          /      \            /      \
      fib(3)    fib(2)    fib(2)    fib(1)
      /    \     /   \     /   \
  fib(2) fib(1) ...  ...  ...  ...
```

The number of calls grows exponentially (about 1.6ⁿ):

```python run
calls = 0

def fib_count(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib_count(n - 1) + fib_count(n - 2)

for n in [10, 20, 25]:
    calls = 0
    fib_count(n)
    print(f"fib({n}): {calls} calls")
```

## Fix 1: iteration

```python run
def fib_iterative(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib_iterative(100))   # instantly, in n steps
```

## Fix 2: memoisation

**Memoisation** means storing results already computed and reusing them. The recursive code stays, but each value is computed only once.

```python run
def fib_memo(n, store=None):
    if store is None:
        store = {}
    if n < 2:
        return n
    if n not in store:
        store[n] = fib_memo(n - 1, store) + fib_memo(n - 2, store)
    return store[n]

print(fib_memo(100))

# Python's built-in tool for the same:
from functools import cache

@cache
def fib_cache(n):
    return n if n < 2 else fib_cache(n - 1) + fib_cache(n - 2)

print(fib_cache(100))
```

This idea – storing the results of subproblems – is the basis of **dynamic programming**.

## When to use which?

| Aspect      | Recursion                                                            | Iteration                              |
| ----------- | -------------------------------------------------------------------- | -------------------------------------- |
| readability | very clean for naturally recursive tasks (trees, divide and conquer) | clearer for simple sequences, counting |
| memory      | every call takes a stack frame                                       | constant memory                        |
| speed       | usually slower because of call overhead                              | usually faster                         |
| limit       | recursion depth (about 1000 in Python)                               | none                                   |

**Rule of thumb:**

- If the task is **naturally recursive** (tree traversal, folder structures, divide and conquer, Towers of Hanoi), recursion is simpler and less error-prone.
- If it is **linear** (going through a list, counting, summing), use a **loop**.
- If the recursion **recomputes the same subtasks**, use **memoisation** or iteration.

> Some languages (e.g. Scheme, Haskell) automatically turn **tail recursion** (when the recursive call is the last step) into a loop, so there is no depth limit. Python deliberately does **not** do this.

## Summary

- Every recursion can be turned into a loop and vice versa.
- Naive recursive Fibonacci is exponential; with iteration or **memoisation** (`@cache`) it is linear.
- Use recursion for recursively structured tasks, loops for linear ones.
