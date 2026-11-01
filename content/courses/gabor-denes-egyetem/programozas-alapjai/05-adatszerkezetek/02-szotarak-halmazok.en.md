---
title: Dictionaries, tuples and sets
summary: Key–value pairs, fixed sequences and unique items.
---

**Dictionary** (`dict`): key → value pairs.

```python
credits = {"Programming Fundamentals": 8, "Calculus": 6}
credits["Physics"] = 4
for course, c in credits.items():
    print(course, c)
```

**Tuple**: an immutable sequence, e.g. a point's coordinates: `p = (3, 4)`.

**Set**: every item appears only once.

```python
print(set([1, 2, 2, 3, 3]))  # {1, 2, 3}
```
