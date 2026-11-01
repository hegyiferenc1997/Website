---
title: Simple sorting
summary: Bubble sort and the built-in sort.
---

**Bubble sort**: keep swapping neighbouring items until they are in order.

```python
def bubble(items):
    n = len(items)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items

print(bubble([5, 2, 9, 1]))    # [1, 2, 5, 9]
```

In practice the built-in `sorted(items)` or `items.sort()` is faster, but it is worth understanding how sorting algorithms work.
