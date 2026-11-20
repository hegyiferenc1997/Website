---
title: Deeper – Functions as Values
summary: A function is a value too – it can be passed as a parameter and returned as a result: numerical integration for any function, closures and nonlocal, the LEGB rule of scopes, and your own caching decorator that makes recursive Fibonacci a thousand times faster.
minutes: 50
---

## What you will learn in this lesson

- that in Python a function is a **value** too: it can be put in a variable, passed as a parameter, returned as a result,
- what a **closure** is, and how a function "remembers" the variables from when it was created,
- how Python looks up a name (the **LEGB rule**), and what `global` and `nonlocal` are for,
- what a **decorator** is, and how **memoisation** speeds things up.

## 1. A function as a parameter: numerical integration

In the basic lesson we saw that a function is a named, reusable piece of code. A function's name is really a variable pointing to a function object – so we can **pass** a function to another one. With this we can write, for example, an integration function that computes the area under the curve of **any** function (with the trapezoidal rule):

```python run
# A function as a parameter: trapezoidal integration for any function f
import math

def integral(f, a, b, steps=1000):
    h = (b - a) / steps
    total = (f(a) + f(b)) / 2
    for i in range(1, steps):
        total += f(a + i * h)                # here we call the function we received
    return total * h

def square(x):
    return x * x

print("∫₀¹ x² dx      ≈", round(integral(square, 0, 1), 6), " (exactly 1/3)")
print("∫₀^π sin x dx  ≈", round(integral(math.sin, 0, math.pi), 6), " (exactly 2)")
print("∫₁² 1/x dx     ≈", round(integral(lambda x: 1 / x, 1, 2), 6), " (exactly ln 2 =", round(math.log(2), 6), ")")
```

`integral` doesn't know, and doesn't need to know, what it's integrating: it only expects that `f` can be called with a number. In the third line, `lambda` is an **anonymous** function written on the spot. The same idea is behind `sorted(..., key=...)`, `max(..., key=...)` and the functions called on a button click (event handlers).

## 2. A function as a result: closures

A function can **create and return** another function. The inner function then "takes along" the outer function's variables – that's a **closure**:

```python run
# Closure: the inner function remembers the outer function's variables
def multiplier(k):
    def multiply(x):
        return k * x                         # k comes from the outer function
    return multiply

double = multiplier(2)
triple = multiplier(3)
print(double(10), triple(10))

# it can store state too: nonlocal lets us modify the outer variable
def counter():
    count = 0
    def increment():
        nonlocal count                       # without it count would be local, and we'd get an error
        count += 1
        return count
    return increment

visitors = counter()
downloads = counter()
for _ in range(3):
    visitors()
downloads()
print("visitors:", visitors(), "| downloads:", downloads())
```

`double` and `triple` were made from the same code, but each keeps its own value of `k`. The two counters are independent too – each sees its own `count` variable. It's a lightweight alternative to classes when you only need a single operation and a little state.

## 3. Scopes: the LEGB rule

When Python looks up a name, it checks four places in order: **L**ocal (inside the function), **E**nclosing (in the surrounding function), **G**lobal (at module level), **B**uilt-in (built-in names, e.g. `len`, `print`). The first match wins:

```python run
# The LEGB rule: Local → Enclosing → Global → Built-in
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print("in the inner function: ", x)  # L: local
    inner()
    print("in the outer function: ", x)      # seen from E, this is the "local" one
outer()
print("at module level:       ", x)          # G

print("built-in len:          ", len("apple"))   # B
len = lambda s: 42                               # BAD IDEA: we hide the built-in
print("hidden len:            ", len("apple"))
del len                                          # restore it
print("restored len:          ", len("apple"))
```

Two lessons. An assignment inside a function always creates a **local** variable, even if there's one with the same name outside – that's why you need `global`/`nonlocal` if you do want to modify the outer one (but using `global` usually points to poor design: pass it as a parameter, and return the result). And never name a variable `list`, `len` or `sum`: you hide the built-in function with it.

## 4. Decorators and memoisation

A **decorator** is a function that receives another function and returns an "improved" version of it. Its best-known use is **memoisation**: we remember results already computed, and don't compute them again. The naive recursive Fibonacci computes the same thing a huge number of times:

```python run
# Our own caching decorator: comparing the call counts of recursive Fibonacci
def memoise(function):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = function(n)               # compute only if we don't know it yet
        return cache[n]
    return wrapper

calls = {"naive": 0, "memo": 0}

def fib_naive(n):
    calls["naive"] += 1
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)

@memoise
def fib_memo(n):
    calls["memo"] += 1
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

print("fib(25) naively:  ", fib_naive(25), f"({calls['naive']:,} calls)")
print("fib(25) memoised: ", fib_memo(25), f"({calls['memo']} calls)")
print("fib(200) memoised:", fib_memo(200))
```

The naive version makes a quarter of a million calls for fib(25), the memoised one 26 – and fib(200) is instant too, which the naive version wouldn't compute in the lifetime of the universe. The `@memoise` line means the same as `fib_memo = memoise(fib_memo)`. Python has a ready-made version too: `@functools.cache`.

| Viewpoint       | What do they gain from functions?                                                            |
| --------------- | -------------------------------------------------------------------------------------------- |
| **programmer**  | reuse: integration, sorting, caching written once                                            |
| **reader**      | with a good name a function call is a sentence: `mean(grades)` – no need to read its insides |
| **tester**      | a small function doing one thing can be tested separately                                    |
| **performance** | memoisation speeds up repeated computations by orders of magnitude                           |

## Summary

- A function is a value: it can be passed as a parameter (e.g. `integral(f, …)`, `key=`), and returned as a result.
- A closure keeps the variables from when it was created; `nonlocal` lets you modify them.
- Names are resolved in LEGB order; don't hide the built-in names.
- A decorator wraps a function; memoisation reuses results already computed.

## Lesson exercise: repeating a function

Write the `repeat(f, n)` function, which returns a **new function**! This new function applies `f` to a value `x` `n` times in a row: `f(f(…f(x)…))`. If `n` = 0, the new function returns `x` unchanged. For example `repeat(lambda x: x * 2, 3)(1)` is `8`.

```python starter required
def repeat(f, n):
    def new(x):
        # apply f to x n times
        return x
    return f


double = lambda x: x * 2
print(repeat(double, 3)(1))
```

<details>
<summary>Solution</summary>

```python solution
def repeat(f, n):
    def new(x):
        for _ in range(n):
            x = f(x)
        return x
    return new


double = lambda x: x * 2
print(repeat(double, 3)(1))
```

</details>

```python test
assert repeat(lambda x: x * 2, 3)(1) == 8, "1 doubled three times is 8"
assert repeat(lambda x: x + 5, 4)(0) == 20, "adding 5 to 0 four times is 20"
assert repeat(lambda x: x * 2, 0)(7) == 7, "x unchanged for n = 0"
assert repeat(str.upper, 1)("apple") == "APPLE", "it works with any function"
```
