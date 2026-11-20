---
title: Deeper – Checking Types
summary: When does a type error show up – at compile time, or only while running, in a rarely executed branch? Duck typing, strong and weak typing, your own run-time type checker based on type hints, the None error, and why True isn't an integer – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- why it's dangerous that in a dynamic language a type error only shows up **when** that line runs,
- what **duck typing** is, and the difference between **strong** and **weak** typing,
- how you can use **type hints** for checking too,
- how to avoid the most common type error: **None**.

## 1. When does the error show up?

In the basic lesson we saw that in a static language (C, Java) the compiler checks the types before running, while in a dynamic language (Python, JavaScript) the error only shows up while running. In practice this means a bug can hide for months in a **rarely executed branch**:

```python run
# A type error that only appears in a rare branch
def shipping_fee(amount, country):
    if country == "HU":
        return 0 if amount >= 15000 else 1490
    else:
        return "Abroad: " + 4990            # BUG: string + number, but it only runs for foreign orders

for order in [(20000, "HU"), (8000, "HU"), (12000, "AT")]:
    try:
        print(order, "→", shipping_fee(*order))
    except TypeError as e:
        print(order, "→ TypeError:", e)
```

The first two orders run fine – if the developer only tried it with a Hungarian address, the bug is found by the **foreign customer** in production. In a static language this code wouldn't even compile. In Python it can be prevented with **tests** and a **type checker** (e.g. mypy, Pyright), which goes through the code based on type hints without running it.

## 2. Duck typing, strong and weak typing

"If it quacks like a duck, it's a duck." Python doesn't look at **what type** a value is, but at whether it **can do** what we ask of it. `len()` works with anything that has a length:

```python run
# Duck typing: the function works with anything that "can do" what we ask
def longest(*things):
    return max(things, key=len)

print(longest("apple", "pear", "banana"))            # strings
print(longest([1, 2], [1, 2, 3, 4], [5]))             # lists
print(longest({"a": 1}, {"a": 1, "b": 2}))            # dictionaries

# Strong typing: Python doesn't convert a string to a number "by itself"
try:
    print("3" + 4)
except TypeError as e:
    print("Python: TypeError –", e)
print("In JavaScript the same would be '34', in PHP 7 – that's weak typing")
```

Python is **dynamically** but **strongly** typed: the type is decided at run time, but it doesn't quietly mix strings and numbers. JavaScript is dynamic and **weak**: `"3" + 4` gives `"34"`, and `"3" * 4` gives `12` – convenient, but a source of countless hidden bugs. The two axes are independent: C is static but fairly weak (a character is also a number).

## 3. Type hints: documentation and checking

A type hint (`def f(x: int) -> str`) does **nothing** at run time by default, it only documents, and tools (the editor, mypy) use it. But we can also read it and write our own checker from it:

```python run
# Our own run-time checker based on type hints (with a decorator)
import inspect
from typing import get_type_hints

def type_checked(function):
    hints = get_type_hints(function)
    signature = inspect.signature(function)

    def wrapper(*args, **kwargs):
        for name, value in signature.bind(*args, **kwargs).arguments.items():
            expected = hints.get(name)
            if expected and not isinstance(value, expected):   # check the hinted type
                raise TypeError(f"{name}: expected {expected.__name__}, got {type(value).__name__}")
        return function(*args, **kwargs)
    return wrapper

@type_checked
def mean(total: float, count: int) -> float:
    return total / count

print(mean(17.5, 5))
try:
    mean(17.5, "5")
except TypeError as e:
    print("TypeError:", e)
```

The `@type_checked` line is a **decorator**: it wraps the function and checks before every call. In real projects there are ready-made libraries for this (e.g. pydantic validates data arriving from forms and APIs this way). The lesson: type hints are free documentation, and if needed, they can become checks too.

## 4. None: the most common type error

`None` means "no value". The problem is that a function **sometimes** returns `None` (e.g. if it found nothing), and the caller forgets to handle it. The inventor of the null reference, Tony Hoare, later called it his "billion-dollar mistake":

```python run
# The None error and two solutions: checking or a default value
from typing import Optional

price_list = {"bread": 650, "milk": 420}

def price(product: str) -> Optional[int]:      # Optional: int OR None
    return price_list.get(product)             # None for a non-existent product

basket = ["bread", "milk", "cocoa"]
try:
    print("total:", sum(price(p) for p in basket))
except TypeError as e:
    print("TypeError:", e)

# solution 1: handle the missing value explicitly
missing = [p for p in basket if price(p) is None]
print("no price:", missing, "| total for the rest:", sum(price(p) for p in basket if price(p) is not None))

# solution 2: a sensible default (only if 0 really is the right meaning!)
print("total with default:", sum(price_list.get(p, 0) for p in basket))
```

The `Optional[int]` hint tells the caller (and the type checker): "this may be `None` too, handle it!". mypy even complains if someone adds it up without checking. Important: a default (`get(p, 0)`) is only good if 0 is truly meaningful – for a missing price it's better to report an error than to give the cocoa away for free.

| Viewpoint          | Static typing                                 | Dynamic typing                                  |
| ------------------ | --------------------------------------------- | ----------------------------------------------- |
| **beginner**       | more typing, strict rules                     | quick to experiment                             |
| **large codebase** | the compiler catches many bugs, safe renaming | risky without tests and type hints              |
| **editor**         | precise code completion                       | almost as good with hints                       |
| **end user**       | fewer type errors in production               | bugs in rare branches may show up in production |

## Summary

- In a dynamic language a type error only shows up when the line runs; tests and type checkers prevent this.
- Python is duck-typed, dynamic but strongly typed: it doesn't quietly mix strings and numbers.
- Type hints document, and they can be read – even run-time checking can be built on them.
- `None` is the most common source of type errors; `Optional` signals that it must be handled.

## Lesson exercise: type-safe summing

Write the `sum_numbers(items)` function, which adds up the list's elements, but only if each one is an `int` or a `float`! If any is of another type, raise a `TypeError`. Careful: in Python `True` and `False` also count as `int` (`isinstance(True, int)` is true), but **don't** accept them this time – you can filter them out with an `isinstance(x, bool)` check.

```python starter required
def sum_numbers(items):
    return sum(items)


print(sum_numbers([1, 2.5, 3]))
```

<details>
<summary>Solution</summary>

```python solution
def sum_numbers(items):
    for x in items:
        if isinstance(x, bool) or not isinstance(x, (int, float)):
            raise TypeError(f"not a number: {x!r}")
    return sum(items)


print(sum_numbers([1, 2.5, 3]))
```

</details>

```python test
assert sum_numbers([1, 2.5, 3]) == 6.5, "1 + 2.5 + 3 = 6.5"
assert sum_numbers([]) == 0, "0 for an empty list"
for bad in ([1, "2"], [True, 2], [None]):
    try:
        sum_numbers(bad)
        assert False, f"{bad} needs a TypeError"
    except TypeError:
        pass
```
