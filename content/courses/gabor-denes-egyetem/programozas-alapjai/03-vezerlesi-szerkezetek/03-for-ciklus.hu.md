---
title: A for ciklus és a range
summary: Bejárás és számlálós ciklus.
minutes: 15
---

A `for` ciklus egy sorozat elemein megy végig:

```python
for gyumolcs in ["alma", "körte", "szilva"]:
    print(gyumolcs)

for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11, 2): # 1, 3, 5, 7, 9
    print(i)
```

A `range(start, stop, lépés)` a `stop` értéket már **nem** tartalmazza.
