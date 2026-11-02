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

| Notation                | Meaning                            |
| ----------------------- | ---------------------------------- |
| `def f(a, b)`           | positional (or keyword) parameters |
| `def f(a, b=0)`         | default value                      |
| `def f(*args)`          | any number of positional → tuple   |
| `def f(**kwargs)`       | any number of keyword → dictionary |
| `def f(*, x)`           | keyword-only parameter             |
| `def f(x, /)`           | positional-only parameter          |
| `f(*list)`, `f(**dict)` | unpacking in a call                |

## Lesson exercise: Average with any number of parameters

Write an `average(*numbers, digits=2)` function that:

- accepts any number of positional numbers (`*numbers`),
- returns their average rounded to `digits` decimals,
- `digits` can be given **only as a keyword** (because it comes after `*numbers`),
- returns `None` if it received no numbers at all.

A list can also be passed unpacked: `average(*[1, 2, 3])`.

```python starter required
def average(*numbers, digits=2):
    # numbers is a tuple
    pass


print(average(1, 2, 2))              # 1.67
print(average(1, 2, 2, digits=0))    # 2.0
```

<details>
<summary>Solution</summary>

```python solution
def average(*numbers, digits=2):
    if not numbers:
        return None
    return round(sum(numbers) / len(numbers), digits)


print(average(1, 2, 2))              # 1.67
print(average(1, 2, 2, digits=0))    # 2.0
```

</details>

```python test
assert average(1, 2, 2) == 1.67, "average(1, 2, 2) → 1.67"
assert average(1, 2, 2, digits=0) == 2.0, "With digits=0: 2.0"
assert average(10) == 10, "The average of a single number is itself."
assert average() is None, "Without parameters: None."
assert average(*[4, 5, 6]) == 5, "It must work with an unpacked list too."
assert average(1, 2, 3, 4) == 2.5, "digits must not swallow a positional number (1, 2, 3, 4 → 2.5)."
```
