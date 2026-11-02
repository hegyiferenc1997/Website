---
title: Constants
summary: Values that don't change – constants in other languages and Python's naming convention.
minutes: 10
---

## What you will learn

- what a **constant** is and why it's worth using,
- how constants are marked in Python and other languages,
- what a "**magic number**" is and why we avoid it.

## What is a constant?

A **constant** is a named value that **doesn't change** while the program runs: e.g. the value of π, the maximum score, the VAT rate.

Why is it useful?

- **Readability:** `MAX_SCORE` says more than `100`.
- **Easy changes:** if the value changes, you edit it in one place.
- **Avoiding mistakes:** you don't mistype the value in different parts of the code.

## Constants in other languages

In most static languages the compiler **enforces** that a constant doesn't change:

```java
// Java
final double VAT = 0.27;
VAT = 0.5;   // compile error
```

```c
/* C */
const int MAX_SCORE = 100;
#define PI 3.14159   /* preprocessor macro */
```

## Constants in Python

Python has **no real constants**: any variable can be overwritten. By convention an **ALL CAPS** name signals that the value must not be changed. Constants usually go at the top of the file.

```python run
# Constants at the top of the file.
MAX_SCORE = 100
PASS_MARK = 50
VAT_RATE = 0.27

score = 72
percent = score / MAX_SCORE * 100
print(f"{percent:.0f}%")
print("Passed" if score >= PASS_MARK else "Failed")

net = 10_000
print("Gross:", net * (1 + VAT_RATE))
```

If you want to tell the tools, you can use the `Final` annotation – mypy warns if you overwrite it:

```python run
from typing import Final

GRAVITY: Final = 9.81   # m/s²
print(GRAVITY * 2)
```

## Magic numbers

A **magic number** is a value written into code without explanation. Someone reading it doesn't know what it means.

```python run
# Bad: what do 86400 and 0.27 mean?
print(3 * 86400)
print(5000 * 1.27)

# Good: descriptive constants.
SECONDS_PER_DAY = 24 * 60 * 60
VAT_RATE = 0.27
print(3 * SECONDS_PER_DAY)
print(5000 * (1 + VAT_RATE))
```

## Literal versus constant

Don't mix them up: a **literal** writes a value directly (`100`, `"apple"`), a **constant** is a **name** bound to an unchanging value (usually given by a literal) (`MAX_SCORE = 100`).

## Built-in constants

```python run
import math
print(math.pi, math.e)        # mathematical constants
print(True, False, None)      # the language's built-in constants
```

## Summary

- A constant is a named, unchanging value; it makes code more readable and easier to change.
- Java uses `final`, C uses `const`; in Python the convention is an **ALL_CAPS** name (optionally `Final`).
- Avoid **magic numbers**, use descriptive constants.
