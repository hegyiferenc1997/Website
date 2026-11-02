---
title: Parameter Evaluation
summary: When and in what order arguments are evaluated – eager and lazy evaluation, and the default value trap.
minutes: 15
---

## What you will learn

- when function arguments are evaluated (**eager** and **lazy** evaluation),
- in what **order** they are evaluated,
- why a **mutable default value** is dangerous,
- how to use lazy evaluation in Python (generators).

## Eager (strict) evaluation

Most languages, Python included, use **eager** (strict) evaluation: every argument is evaluated **before** the function is called, and the function receives the finished values.

```python run
def first(a, b):
    return a

def loud(x):
    print("  evaluating:", x)
    return x

# Both arguments are evaluated, although the function only uses the first.
print(first(loud(1), loud(2)))
```

## Order of evaluation

In Python arguments are evaluated **left to right**. (In C and C++ the order is unspecified – don't rely on it there!)

```python run
def loud(x):
    print("evaluated:", x)
    return x

print(max(loud(3), loud(7), loud(5)))
```

## Lazy evaluation

With **lazy** evaluation an expression is evaluated only when its value is **actually needed**. Haskell is a fully lazy language. In Python lazy evaluation appears in a few places:

- **short-circuiting** of logical operators (`and`, `or`),
- the conditional expression (`a if condition else b` – only one branch runs),
- **generators** and `range`.

```python run
def loud(x):
    print("  evaluating:", x)
    return x

print(loud(False) and loud(True))     # the second is never evaluated
print(loud(1) if True else loud(2))   # only one branch runs
```

### Generators

A generator produces elements **one by one, on demand**, so it can even describe an infinite sequence and doesn't need memory for the whole list.

```python run
def squares():
    n = 1
    while True:            # an infinite sequence – computed lazily, on demand
        yield n * n
        n += 1

gen = squares()
print(next(gen), next(gen), next(gen))   # 1 4 9

# Generator expression: with () parentheses, not [].
total = sum(x * x for x in range(1_000_000))   # doesn't build a million-element list
print(total)
```

## The default value trap

A default value is evaluated **once**, when the function is **defined** – not on every call! With a mutable object (list, dict) this leads to a surprising bug:

```python run
def add_bad(item, items=[]):   # [] is created once and every call shares it
    items.append(item)
    return items

print(add_bad(1))   # [1]
print(add_bad(2))   # [1, 2]  ← surprise!
print(add_bad(3))   # [1, 2, 3]
```

The correct pattern: use `None` as the default and create a new list inside the function.

```python run
def add(item, items=None):
    if items is None:
        items = []          # every call gets its own new list
    items.append(item)
    return items

print(add(1))   # [1]
print(add(2))   # [2]
```

## Summary

- Python is **eager**: arguments are evaluated before the call, **left to right**.
- Lazy evaluation in Python: short-circuiting, conditional expressions, **generators** (`yield`, `(… for …)`).
- A default value is evaluated once at definition time: use `None` for lists and dictionaries.

## Lesson exercise: The default value trap

The starter `collect(item, items=[])` function is buggy: the default list is created only **once**, when the function is defined, so it survives between calls and the items "pile up" in it. Run it and see!

Fix it with the usual pattern: make the default `None` and create a new list inside the function if none was given. If the caller passed a list, append to that one (and return it).

```python starter required
def collect(item, items=[]):
    items.append(item)
    return items


print(collect(1))   # [1]
print(collect(2))   # should be [2], but it becomes [1, 2]!
```

<details>
<summary>Solution</summary>

```python solution
def collect(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items


print(collect(1))   # [1]
print(collect(2))   # [2]
```

</details>

```python test
assert collect(1) == [1], "collect(1) → [1]"
assert collect(2) == [2], "collect(2) → [2] – the item of the previous call must not remain!"
mine = [0]
assert collect(3, mine) == [0, 3] and mine == [0, 3], "With a given list, append to it."
assert collect(4) == [4], "A fresh list again afterwards."
```
