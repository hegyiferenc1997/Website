---
title: Szótárak, tuple-ök és halmazok
summary: Kulcs–érték párok, rögzített sorozatok és egyedi elemek.
minutes: 15
---

**Szótár** (`dict`): kulcs → érték párok.

```python
kredit = {"Programozási alapok": 8, "Analízis": 6}
kredit["Fizika"] = 4
for targy, k in kredit.items():
    print(targy, k)
```

**Tuple**: nem módosítható sorozat, pl. egy pont koordinátái: `p = (3, 4)`.

**Halmaz** (`set`): minden elem csak egyszer szerepel.

```python
print(set([1, 2, 2, 3, 3]))  # {1, 2, 3}
```
