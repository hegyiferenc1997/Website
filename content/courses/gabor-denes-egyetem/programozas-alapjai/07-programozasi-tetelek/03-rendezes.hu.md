---
title: Egyszerű rendezések
summary: Buborékrendezés és a beépített sort.
minutes: 15
---

**Buborékrendezés**: a szomszédos elemeket cserélgetjük, amíg sorba nem kerülnek.

```python
def buborek(lista):
    n = len(lista)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
    return lista

print(buborek([5, 2, 9, 1]))   # [1, 2, 5, 9]
```

A gyakorlatban a beépített `sorted(lista)` vagy `lista.sort()` gyorsabb, de a rendezőalgoritmusok működését érdemes érteni.
