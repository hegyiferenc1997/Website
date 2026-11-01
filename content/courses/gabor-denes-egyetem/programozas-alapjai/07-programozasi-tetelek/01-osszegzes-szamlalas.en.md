---
title: Sum and count
summary: Two basic patterns behind almost every task.
---

```python
numbers = [4, 7, 1, 8, 3]

total = 0
for x in numbers:
    total += x
print(total)             # 23

count = 0
for x in numbers:
    if x % 2 == 0:
        count += 1
print(count)             # 2 even numbers
```

Python has built-in shortcuts too: `sum(numbers)` and `sum(1 for x in numbers if x % 2 == 0)`. Exams, however, often ask for the loop version.
