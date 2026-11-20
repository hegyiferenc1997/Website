---
title: Deeper – Parameter Passing in Practice
summary: What a function sees of the list it receives – modifying or rebinding, the mutable default parameter trap and its fix, *args and **kwargs, keyword-only and positional-only parameters, and eager versus lazy evaluation – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- what exactly happens when a function receives a **list**, and the difference between **modifying** and **rebinding**,
- why a **mutable default** parameter is dangerous, and the proven fix,
- how to write a function accepting **any number** of parameters (`*args`, `**kwargs`),
- what it means that Python evaluates parameters **eagerly**, and when **lazy** evaluation is better.

## 1. Modifying or rebinding?

In the basic lesson we saw that Python passes a parameter **by object reference**: the function's parameter is a new name for the same object. Two very different cases follow from this:

```python run
# Modifying (the caller sees it too) versus rebinding (the caller DOESN'T see it)
def modify(items):
    items.append(99)              # we change the object: the caller's list changes too

def rebind(items):
    items = [1, 2, 3]             # we point the local name to a new list: the caller's stays
    items.append(99)

def increment(n):
    n += 1                        # a number is immutable: this is just rebinding too
    return n

data = [10, 20]
modify(data)
print("after modify:  ", data)
rebind(data)
print("after rebind:  ", data)

x = 5
increment(x)
print("after increment x =", x, "| with the returned value:", increment(x))
```

The rule of thumb: if the function calls a **method** of the object it received (`append`, `sort`, `[i] = …`), the caller sees it; if it points the parameter name to a **new value** (`=`), the caller doesn't. That's why numbers and strings are always handed back as a **return value**. If a function deliberately modifies the list it receives, its name and documentation should say so (e.g. `items.sort()` sorts in place and returns `None`, `sorted(items)` returns a new list).

## 2. The mutable default parameter trap

A default value is created **once**, when the function is defined – not again on every call. With a list this causes a surprising bug:

```python run
# The classic trap: the [] default is THE SAME list on every call
def add_to_basket_bad(product, basket=[]):
    basket.append(product)
    return basket

print("Anna's basket:", add_to_basket_bad("apple"))
print("Ben's basket: ", add_to_basket_bad("milk"), " ← Anna's apple is in Ben's basket!")

# the fix: None as the default, and we create a new list inside the function
def add_to_basket_good(product, basket=None):
    if basket is None:
        basket = []                # a fresh list on every call
    basket.append(product)
    return basket

print("Anna's basket:", add_to_basket_good("apple"))
print("Ben's basket: ", add_to_basket_good("milk"))
```

In a web shop this would mean customers see each other's products in their baskets – a data protection incident because of a single line. The rule: only give **immutable** values as defaults (number, string, `None`, tuple); instead of a list or dictionary use `None`, and create it in the function.

## 3. *args, **kwargs and the kinds of parameters

`*args` collects any number of **positional** parameters into a tuple, `**kwargs` any number of **keyword** parameters into a dictionary. A parameter after `*` can only be given by name, one before `/` only by position:

```python run
# Kinds of parameters: positional, keyword, *args, **kwargs, keyword-only
def log(level, *messages, separator=" | ", **data):
    line = f"[{level}] " + separator.join(messages)
    if data:
        line += "  {" + ", ".join(f"{k}={v}" for k, v in data.items()) + "}"
    print(line)

log("INFO", "server started")
log("ERROR", "database", "timeout", user="anna", ms=5000)
log("INFO", "a", "b", "c", separator=" → ")

# unpacking in a call: * splits a list, ** a dictionary into parameters
messages = ["save", "done"]
extra = {"file": "grades.csv", "row": 120}
log("INFO", *messages, **extra)

def area(width, height, /, *, unit="m"):           # before / only by position, after * only by name
    return f"{width * height} {unit}²"
print(area(3, 4), "|", area(3, 4, unit="cm"))
try:
    area(3, 4, "cm")
except TypeError as e:
    print("TypeError:", e)
```

A **keyword-only** parameter (after `*`) is useful because the call is more readable, and the order can't be mixed up by accident: `area(3, 4, unit="cm")` is unambiguous, `area(3, 4, "cm")` doesn't even run. The `sep` and `end` parameters of `print` work this way too.

## 4. Eager and lazy evaluation

Python evaluates parameters **eagerly**: **before** the function is called, every parameter is computed, from left to right. That's usually natural, but sometimes it causes unnecessary work:

```python run
# Eager evaluation: the parameter is computed even if the function doesn't use it
def expensive_computation():
    print("   ...expensive computation running...")
    return 42

def log_eager(enabled, message):
    if enabled:
        print("log:", message)

def log_lazy(enabled, message_function):
    if enabled:
        print("log:", message_function())          # compute only if needed

print("eager, with logging off:")
log_eager(False, expensive_computation())
print("lazy, with logging off:")
log_lazy(False, expensive_computation)             # we pass the function, not its result
print("lazy, with logging on:")
log_lazy(True, lambda: expensive_computation() * 2)

# a generator is lazy too: it only computes as much as we ask for
squares = (x * x for x in range(10**12))           # no list of a trillion elements is created!
print("the first square above 1000:", next(n for n in squares if n > 1000))
```

With logging off, the eager version still ran the expensive computation, the lazy one didn't. The trick: we pass not the **result** but the **function**, and only call it if it's really needed. A generator expression does the same with sequences: the trillion-element "list" is ready in an instant, because it only computes its first few elements.

| Viewpoint           | What do they watch for in parameter passing?                                   |
| ------------------- | ------------------------------------------------------------------------------ |
| **caller**          | does the function modify my list? – the name and documentation must say so     |
| **function author** | `None` default instead of a list, keyword-only parameters where it's ambiguous |
| **reader**          | `send(address, retry=True)` says more than `send(address, True)`               |
| **performance**     | compute an expensive parameter only if needed (lazy evaluation)                |

## Summary

- The function sees the object it received: modifying via a method is visible to the caller, rebinding with `=` isn't.
- A default value is created once; use `None` instead of a mutable default.
- `*args` and `**kwargs` collect any number of parameters; a parameter after `*` can only be given by name.
- Parameters are evaluated eagerly, before the call; passing a function or a generator makes evaluation lazy.

## Lesson exercise: a flexible averager

Write the `mean(*numbers, rounding=2)` function, which receives any number of numbers and returns their average rounded to `rounding` decimals! `rounding` is a keyword-only parameter (it comes after `*numbers`, so it automatically is). If no numbers arrived at all, raise a `ValueError`.

```python starter required
def mean(*numbers, rounding=2):
    return sum(numbers) / len(numbers)


print(mean(1, 2, 4))
```

<details>
<summary>Solution</summary>

```python solution
def mean(*numbers, rounding=2):
    if not numbers:
        raise ValueError("at least one number is needed")
    return round(sum(numbers) / len(numbers), rounding)


print(mean(1, 2, 4))
```

</details>

```python test
assert mean(1, 2, 4) == 2.33, "(1 + 2 + 4) / 3 to two decimals is 2.33"
assert mean(1, 2, 4, rounding=0) == 2.0, "2.0 to zero decimals"
assert mean(5) == 5.0, "the mean of a single number is itself"
try:
    mean()
    assert False, "a ValueError is needed without numbers"
except ValueError:
    pass
```
