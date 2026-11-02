---
title: Numbers in Detail
summary: Integer and float operations, floor division and remainder, rounding, and why 0.1 + 0.2 isn't 0.3.
minutes: 15
---

## What you will learn

- the **operations** on numbers and their order,
- how to use **floor division** and the **remainder**,
- the inaccuracy of **floating-point numbers** and how to deal with it.

## Arithmetic operations

| Operator | Meaning                      | Example  | Result |
| -------- | ---------------------------- | -------- | ------ |
| `+`      | addition                     | `7 + 2`  | `9`    |
| `-`      | subtraction                  | `7 - 2`  | `5`    |
| `*`      | multiplication               | `7 * 2`  | `14`   |
| `/`      | division (always float)      | `7 / 2`  | `3.5`  |
| `//`     | floor division (rounds down) | `7 // 2` | `3`    |
| `%`      | remainder (modulo)           | `7 % 2`  | `1`    |
| `**`     | exponentiation               | `7 ** 2` | `49`   |

```python run
print(7 / 2)     # 3.5   – / always gives a float
print(8 / 2)     # 4.0   – even if the result is whole
print(7 // 2)    # 3
print(-7 // 2)   # -4    – rounds down, not towards zero!
print(7 % 2)     # 1
print(2 ** 10)   # 1024
```

## What are // and % good for?

```python run
# Is a number even? Its remainder modulo 2 is 0.
number = 14
print(number % 2 == 0)   # True

# Converting seconds into minutes + seconds.
total = 135
minutes = total // 60
seconds = total % 60
print(f"{minutes} min {seconds} s")   # 2 min 15 s

# The last digit of a number and the rest.
n = 2026
print(n % 10, n // 10)   # 6 202
```

## Operator precedence

The order known from maths applies: first exponentiation, then multiplication/division, finally addition/subtraction. Parentheses override it.

```python run
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20
print(-2 ** 2)        # -4  – exponentiation binds tighter than the sign!
print((-2) ** 2)      # 4
```

## Floating-point inaccuracy

The computer stores real numbers in binary on a finite number of bits. `0.1` is an infinite fraction in binary (like 1/3 in decimal), so it can only be stored approximately.

```python run
print(0.1 + 0.2)           # 0.30000000000000004
print(0.1 + 0.2 == 0.3)    # False!

# Correct comparison: approximate equality.
import math
print(math.isclose(0.1 + 0.2, 0.3))   # True

# Round when printing.
print(round(0.1 + 0.2, 2))            # 0.3
print(f"{0.1 + 0.2:.2f}")             # 0.30
```

> **Rule:** never compare floats with `==`! For money use integers (cents) or the `decimal` module.

```python run
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))   # exactly 0.3
```

## Useful built-in functions

```python run
import math

print(abs(-5))           # 5      absolute value
print(round(3.14159, 2)) # 3.14   round to 2 decimals
print(round(2.5), round(3.5))   # 2 4 – "banker's rounding": towards even!
print(min(3, 8, 1), max(3, 8, 1))   # 1 8
print(math.sqrt(16))     # 4.0    square root
print(math.floor(3.7), math.ceil(3.2))   # 3 4
print(math.pi)           # 3.141592653589793
```

## Summary

- `/` always gives a `float`, `//` is floor division (rounds down), `%` is the remainder.
- Precedence: `**`, then `* / // %`, then `+ -`; parentheses change it.
- Floats are inexact: use `math.isclose()` or rounding.
