---
title: Listák
summary: Elemek sorozata: indexelés, bővítés, bejárás.
minutes: 15
---

```python
jegyek = [5, 3, 4]
jegyek.append(5)        # hozzáfűzés a végére
print(jegyek[0])        # 5 – az első elem indexe 0
print(jegyek[-1])       # 5 – az utolsó elem
print(len(jegyek))      # 4
print(jegyek[1:3])      # [3, 4] – szelet
print(sum(jegyek) / len(jegyek))  # átlag: 4.25
```

A lista **módosítható**: `jegyek[1] = 4` felülírja a második elemet, a `remove()` és a `pop()` töröl.
