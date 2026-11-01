---
title: Függvények definiálása
summary: A def kulcsszó, paraméterek és visszatérési érték.
minutes: 15
---

A függvény egy névvel ellátott kódrészlet, amit többször is meghívhatunk:

```python
def negyzet(x):
    return x * x

def koszon(nev, udvarias=True):
    if udvarias:
        return f"Jó napot, {nev}!"
    return f"Szia, {nev}!"

print(negyzet(5))              # 25
print(koszon("Péter"))         # Jó napot, Péter!
print(koszon("Péter", False))  # Szia, Péter!
```

- A `return` visszaadja az eredményt, és befejezi a függvényt. Ha nincs `return`, az eredmény `None`.
- A paramétereknek lehet **alapértéke** (`udvarias=True`).
