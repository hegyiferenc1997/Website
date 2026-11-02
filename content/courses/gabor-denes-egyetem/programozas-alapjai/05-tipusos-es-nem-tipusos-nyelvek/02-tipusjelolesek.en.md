---
title: Type Hints in Python
summary: How to write types in a dynamic language, and how mypy checks them.
minutes: 15
---

## What you will learn

- how to add **type hints** to variables and functions,
- what **gradual typing** is,
- how to check types with the **mypy** tool.

## Type hint syntax

Since Python 3.5 types can be **annotated** in code. These annotations are **optional**, and Python **doesn't check** them at run time – they are for programmers and tools.

```python run
age: int = 20
name: str = "Anna"
average: float = 4.5

def greet(name: str, repeat: int = 1) -> str:
    # The part after -> is the return type.
    return ("Hi, " + name + "! ") * repeat

print(greet("Bela", 2))
```

## Compound types

```python run
def average(grades: list[int]) -> float:
    return sum(grades) / len(grades)

def lookup(phone_book: dict[str, str], name: str) -> str | None:
    # str | None: either a string or None (if there is no such name)
    return phone_book.get(name)

print(average([5, 4, 4]))
print(lookup({"Anna": "123"}, "Bela"))
```

| Annotation         | Meaning                                      |
| ------------------ | -------------------------------------------- |
| `list[int]`        | list of integers                             |
| `dict[str, float]` | dictionary with string keys and float values |
| `tuple[int, int]`  | an ordered pair of two integers              |
| `set[str]`         | set of strings                               |
| `int \| None`      | an integer or None                           |

## Python doesn't check at run time

```python run
def square(x: int) -> int:
    return x * x

# Despite the annotation it runs – Python doesn't check the type.
print(square(2.5))   # 6.25
```

## Static checking: mypy

**mypy** is an external tool that checks code using the annotations without running it – as if you were using a statically typed language.

```bash
pip install mypy
mypy program.py
```

```text
program.py:5: error: Argument 1 to "square" has incompatible type "float"; expected "int"
```

VS Code's Python extension (Pylance) uses the annotations too: it underlines errors and gives better completion.

## Gradual typing

Python follows **gradual typing**: you can annotate part of the code and leave the rest. It is rarely needed in small scripts, but in larger projects (teamwork, libraries) it prevents many bugs. JavaScript took the same path: **TypeScript** is JavaScript extended with static types.

## Summary

- Type hints: `variable: type`, for functions `def f(x: int) -> str:`.
- Hints are optional and Python doesn't check them at run time.
- **mypy** and the IDE find errors from the hints without running the code.
