---
title: Operators and expressions
summary: Arithmetic, comparison and logical operators.
---

```python
print(7 + 2, 7 - 2, 7 * 2)  # 9 5 14
print(7 / 2)                 # 3.5  – division
print(7 // 2)                # 3    – integer division
print(7 % 2)                 # 1    – remainder
print(2 ** 10)               # 1024 – power
```

Comparison (gives a `bool`): `==`, `!=`, `<`, `<=`, `>`, `>=`.

Logical operators: `and`, `or`, `not`.

```python
x = 15
print(10 <= x and x < 20)  # True
print(10 <= x < 20)        # the same, shorter
```

The `%` operator makes it easy to check whether a number is even: `x % 2 == 0`.
