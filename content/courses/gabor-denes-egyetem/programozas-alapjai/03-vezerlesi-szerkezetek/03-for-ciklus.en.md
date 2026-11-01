---
title: The for loop and range
summary: Iterating and counting loops.
---

A `for` loop goes through the items of a sequence:

```python
for fruit in ["apple", "pear", "plum"]:
    print(fruit)

for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11, 2): # 1, 3, 5, 7, 9
    print(i)
```

`range(start, stop, step)` does **not** include `stop`.
