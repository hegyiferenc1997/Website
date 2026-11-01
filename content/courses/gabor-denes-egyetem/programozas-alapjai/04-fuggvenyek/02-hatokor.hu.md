---
title: Hatókör
summary: Helyi és globális változók.
minutes: 10
---

A függvényen belül létrehozott változó **helyi** (lokális): csak ott létezik.

```python
def duplaz(x):
    eredmeny = x * 2   # helyi változó
    return eredmeny

print(duplaz(4))       # 8
print(eredmeny)        # NameError: kívülről nem látszik
```

Jó gyakorlat, hogy a függvény a paraméterein keresztül kapja az adatot és `return`-nel adja vissza az eredményt, ne globális változókat módosítson.
