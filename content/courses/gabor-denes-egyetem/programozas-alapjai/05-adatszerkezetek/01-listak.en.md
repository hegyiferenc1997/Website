---
title: Lists
summary: Sequences of items: indexing, adding, iterating.
---

```python
grades = [5, 3, 4]
grades.append(5)        # add to the end
print(grades[0])        # 5 – the first index is 0
print(grades[-1])       # 5 – the last item
print(len(grades))      # 4
print(grades[1:3])      # [3, 4] – a slice
print(sum(grades) / len(grades))  # average: 4.25
```

A list is **mutable**: `grades[1] = 4` overwrites the second item, and `remove()` and `pop()` delete items.
