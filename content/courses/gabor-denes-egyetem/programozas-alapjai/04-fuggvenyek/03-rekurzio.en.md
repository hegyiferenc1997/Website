---
title: Recursion
summary: Functions that call themselves.
---

A **recursive** function calls itself. It needs a **base case** where it stops, otherwise it never ends.

```python
def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)

print(factorial(5))     # 120
```

It evaluates as `5 * 4 * 3 * 2 * 1`. Many problems (such as walking a tree) are much simpler to express with recursion.
