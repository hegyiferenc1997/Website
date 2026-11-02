---
title: Kinds of Parameters
summary: Positional and keyword parameters, default values, *args and **kwargs, keyword-only parameters.
minutes: 15
---

## What you will learn

- **positional** and **keyword** argument passing,
- **variable-length** parameters (`*args`, `**kwargs`),
- **unpacking** in calls (`*list`, `**dict`),
- keyword-only and positional-only parameters.

## Positional and keyword

```python run
def introduce(name, age, city):
    return f"{name}, {age} years old, {city}"

print(introduce("Anna", 20, "Budapest"))                  # positional: order matters
print(introduce(city="Gyor", name="Bela", age=22))        # keyword: by name
print(introduce("Csilla", city="Pecs", age=19))           # mixed: positional ones first
```

## Variable number of positional arguments: *args

A parameter with a `*` prefix collects **any number** of positional arguments into a **tuple**.

```python run
def total(*numbers):
    print("received tuple:", numbers)
    result = 0
    for x in numbers:
        result += x
    return result

print(total())
print(total(5))
print(total(1, 2, 3, 4))
```

This is how `print()` works too: it can take any number of values.

## Variable number of keyword arguments: **kwargs

A parameter with a `**` prefix collects the extra keyword arguments into a **dictionary**.

```python run
def profile(name, **data):
    print("Name:", name)
    for key, value in data.items():
        print(f"  {key}: {value}")

profile("Anna", programme="computer engineering", semester=1, city="Budapest")
```

## The ordering rule

```text
def f(positional, default=0, *args, keyword_only, **kwargs)
```

```python run
def full(a, b=2, *args, c, **kwargs):
    print(a, b, args, c, kwargs)

full(1, c=3)
full(1, 5, 6, 7, c=3, d=4)
```

## Keyword-only parameters

Parameters after a `*` can **only be given by name**. Useful when an argument's meaning wouldn't be clear without its name:

```python run
def save(filename, *, overwrite=False):
    return f"saving {filename} (overwrite: {overwrite})"

print(save("data.txt", overwrite=True))
# save("data.txt", True)  → TypeError: overwrite can only be given by name
```

Parameters before a `/` can **only be passed positionally** (e.g. `def f(x, /)`); many built-ins such as `len` work this way.

## Unpacking in calls

In a call `*` and `**` work the other way round: they **unpack** a list or dictionary into arguments.

```python run
def volume(a, b, c):
    return a * b * c

sizes = [2, 3, 4]
print(volume(*sizes))          # same as volume(2, 3, 4)

data = {"a": 1, "b": 5, "c": 10}
print(volume(**data))          # volume(a=1, b=5, c=10)
```

## Summary

| Notation | Meaning |
| --- | --- |
| `def f(a, b)` | positional (or keyword) parameters |
| `def f(a, b=0)` | default value |
| `def f(*args)` | any number of positional → tuple |
| `def f(**kwargs)` | any number of keyword → dictionary |
| `def f(*, x)` | keyword-only parameter |
| `def f(x, /)` | positional-only parameter |
| `f(*list)`, `f(**dict)` | unpacking in a call |
