---
title: A while ciklus
summary: Ismétlés, amíg egy feltétel igaz.
minutes: 10
---

A `while` ciklus addig ismétli a magját, amíg a feltétel igaz:

```python
szam = int(input("Adj meg egy pozitív számot: "))
while szam <= 0:
    szam = int(input("Pozitív legyen! Újra: "))
print("Köszönöm:", szam)
```

Vigyázz: ha a feltétel sosem lesz hamis, **végtelen ciklust** kapsz. Ilyenkor a terminálban a `Ctrl+C` állítja le a programot.
