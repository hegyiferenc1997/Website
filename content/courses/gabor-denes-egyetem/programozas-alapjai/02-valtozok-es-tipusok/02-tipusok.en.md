---
title: Numbers, strings and booleans
summary: The int, float, str and bool types.
---

Every value has a **type**. The most common ones:

| Type    | Meaning      | Example         |
| ------- | ------------ | --------------- |
| `int`   | whole number | `42`            |
| `float` | real number  | `3.14`          |
| `str`   | text         | `"apple"`       |
| `bool`  | truth value  | `True`, `False` |

```python
print(type(42))      # <class 'int'>
print(type("42"))    # <class 'str'>
print(int("42") + 1) # 43 – converting text to a number
print(str(3.5) + "!")# 3.5!
```

Type conversion: `int()`, `float()`, `str()`, `bool()`.
