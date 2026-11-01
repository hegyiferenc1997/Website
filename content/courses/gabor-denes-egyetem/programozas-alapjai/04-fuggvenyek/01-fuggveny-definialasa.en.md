---
title: Defining functions
summary: The def keyword, parameters and return values.
---

A function is a named piece of code that you can call many times:

```python
def square(x):
    return x * x

def greet(name, polite=True):
    if polite:
        return f"Good day, {name}!"
    return f"Hi, {name}!"

print(square(5))             # 25
print(greet("Peter"))        # Good day, Peter!
print(greet("Peter", False)) # Hi, Peter!
```

- `return` hands back the result and ends the function. Without `return`, the result is `None`.
- Parameters can have **default values** (`polite=True`).
