---
title: Functional Programming
summary: Pure functions, immutable data, higher-order functions, lambda, map and filter.
minutes: 15
---

## What you will learn

- what a **pure function** is and why it is useful,
- what it means that functions are **"first-class citizens"**,
- how to use `lambda`, `map`, `filter` and `sorted`.

## The core idea

In **functional programming** a program is built by combining functions. The main principles:

- **Pure functions:** the same input always gives the same output, with no side effects.
- **Immutable data:** instead of modifying existing data we create new data.
- **Functions are values:** they can be passed as arguments, returned, and stored in variables.

## Pure and impure functions

```python run
# Pure function: depends only on its parameters and modifies nothing.
def square(x):
    return x * x

# Impure: modifies an outside variable (side effect).
counter = 0
def increment():
    global counter
    counter += 1
    return counter

print(square(4), square(4))         # always 16 16
print(increment(), increment())     # 1 2 – same call, different result
```

A pure function is easy to test and safe to reuse.

## Functions as values

```python run
def double(x):
    return 2 * x

def apply(function, value):
    # Higher-order function: it receives a function as a parameter.
    return function(value)

print(apply(double, 21))   # 42
```

## Lambda – an anonymous function

For short one-line functions we use the `lambda` keyword:

```python run
double = lambda x: 2 * x
print(double(5))   # 10
```

## map, filter, sorted

```python run
numbers = [1, 2, 3, 4, 5, 6]

# map: applies a function to every element.
squares = list(map(lambda x: x * x, numbers))
print(squares)              # [1, 4, 9, 16, 25, 36]

# filter: keeps only the elements that satisfy a condition.
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)                # [2, 4, 6]

# sorted with a key: the sorting criterion is a function.
names = ["Zoltan", "Eva", "Bence"]
print(sorted(names, key=len))   # by length: ['Eva', 'Bence', 'Zoltan']
```

> In Python a **list comprehension** is often more readable than `map` and `filter`: `[x * x for x in numbers]` or `[x for x in numbers if x % 2 == 0]`.

## Functional features in other languages

Besides purely functional languages (Haskell, Elm), almost every language has adopted functional features: Java's Stream API and lambdas, C# LINQ, JavaScript `map`/`filter`/`reduce`.

## Summary

- The functional style relies on **pure functions** and **immutable data**.
- Functions are values: they can be passed and returned (**higher-order functions**).
- Python tools: `lambda`, `map`, `filter`, `sorted(key=…)`, list comprehensions.

## Lesson exercise: A pure function with map, filter and sorted

Write a **pure** `process(numbers)` function that:

1. keeps the positive numbers (`filter`),
2. squares each of them (`map`),
3. sorts them in descending order (`sorted`),

and returns the result in a new list. Use `lambda` functions! The input list must not change, and the same input must always give the same output.

```python starter required
def process(numbers):
    # positives = filter(lambda x: ..., numbers)
    # squares = map(lambda x: ..., positives)
    # return sorted(..., reverse=True)
    pass


print(process([3, -1, 2, 0, -5, 4]))   # [16, 9, 4]
```

<details>
<summary>Solution</summary>

```python solution
def process(numbers):
    positives = filter(lambda x: x > 0, numbers)
    squares = map(lambda x: x * x, positives)
    return sorted(squares, reverse=True)


print(process([3, -1, 2, 0, -5, 4]))   # [16, 9, 4]
```

</details>

```python test
data = [3, -1, 2, 0, -5, 4]
assert process(data) == [16, 9, 4], "process([3, -1, 2, 0, -5, 4]) → [16, 9, 4]"
assert process(data) == [16, 9, 4], "It must give the same result the second time too (pure function)."
assert data == [3, -1, 2, 0, -5, 4], "The input list must not change."
assert process([]) == [], "An empty list gives an empty list."
assert isinstance(process([1]), list), "Return a list (sorted() returns a list)."
```
