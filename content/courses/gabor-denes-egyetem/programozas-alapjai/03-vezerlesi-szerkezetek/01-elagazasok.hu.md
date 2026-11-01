---
title: Elágazások: if, elif, else
summary: Feltételtől függő végrehajtás.
minutes: 15
---

```python
pont = int(input("Pontszám: "))
if pont >= 85:
    print("jeles")
elif pont >= 70:
    print("jó")
elif pont >= 50:
    print("elégséges")
else:
    print("elégtelen")
```

Pythonban a **behúzás** (4 szóköz) jelöli, mi tartozik az elágazáshoz; nincs kapcsos zárójel. A feltételek sorban értékelődnek ki, és csak az első igaz ág fut le.
