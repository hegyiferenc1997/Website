---
title: Input and output
summary: input(), print() and formatted strings.
---

We ask the user for data with `input()`. It **always returns text**, so convert it before calculating:

```python
name = input("What's your name? ")
age = int(input("How old are you? "))
print(f"Hi {name}, next year you'll be {age + 1}!")
```

Inside an `f"..."` string (f-string), expressions in curly braces are replaced by their values. Decimal places: `f"{3.14159:.2f}"` → `3.14`.
