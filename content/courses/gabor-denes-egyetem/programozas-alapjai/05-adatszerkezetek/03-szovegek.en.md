---
title: Working with strings
summary: Common string operations.
---

```python
s = "  Computer Engineering  "
print(s.strip())          # trim spaces
print(s.upper())          # UPPERCASE
print("Engin" in s)       # True
print("a,b,c".split(","))   # ['a', 'b', 'c']
print("-".join(["a", "b"])) # a-b
print(len("apple"))       # 5
print("apple"[::-1])      # elppa – reversed
```

Strings are **immutable**: operations return a new string and leave the original unchanged.
