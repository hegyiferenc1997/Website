---
title: Scope
summary: Local and global variables.
---

A variable created inside a function is **local**: it only exists there.

```python
def double(x):
    result = x * 2     # local variable
    return result

print(double(4))       # 8
print(result)          # NameError: not visible outside
```

Good practice: a function receives data through its parameters and gives back the result with `return`, instead of changing global variables.
