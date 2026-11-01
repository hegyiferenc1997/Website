---
title: Összegzés és számlálás
summary: Két alapminta, amire szinte minden feladat épül.
minutes: 10
---

```python
szamok = [4, 7, 1, 8, 3]

osszeg = 0
for x in szamok:
    osszeg += x
print(osszeg)            # 23

db = 0
for x in szamok:
    if x % 2 == 0:
        db += 1
print(db)                # 2 páros szám
```

Pythonban ezekre beépített rövidítések is vannak: `sum(szamok)` és `sum(1 for x in szamok if x % 2 == 0)`. Vizsgán viszont gyakran a ciklusos változatot kérik.
