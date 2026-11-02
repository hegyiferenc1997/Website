---
title: Paraméterkiértékelés
summary: Mikor és milyen sorrendben értékelődnek ki az argumentumok – mohó és lusta kiértékelés, és az alapértelmezett érték csapdája.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mikor értékelődnek ki a függvény argumentumai (**mohó** és **lusta** kiértékelés),
- milyen **sorrendben** értékelődnek ki,
- miért veszélyes a **megváltoztatható alapértelmezett érték**,
- hogyan használhatsz lusta kiértékelést Pythonban (generátorok).

## Mohó (szigorú) kiértékelés

A legtöbb nyelv, köztük a Python is, **mohó** (eager, strict) kiértékelést használ: a függvény hívása **előtt** minden argumentum kiértékelődik, és a függvény már a kész értékeket kapja.

```python run
def elso(a, b):
    return a

def hangos(x):
    print("  kiértékelem:", x)
    return x

# Mindkét argumentum kiértékelődik, pedig a függvény csak az elsőt használja.
print(elso(hangos(1), hangos(2)))
```

## A kiértékelés sorrendje

Pythonban az argumentumok **balról jobbra** értékelődnek ki. (C-ben és C++-ban a sorrend nincs rögzítve – ott nem szabad rá építeni!)

```python run
def hangos(x):
    print("kiértékelve:", x)
    return x

print(max(hangos(3), hangos(7), hangos(5)))
```

## Lusta kiértékelés

**Lusta** (lazy) kiértékelésnél egy kifejezés csak akkor értékelődik ki, amikor **tényleg szükség van** az értékére. Teljesen lusta nyelv a Haskell. Pythonban a lusta kiértékelés néhány helyen jelenik meg:

- a logikai operátorok **rövidzárja** (`and`, `or`),
- a feltételes kifejezés (`a if feltetel else b` – csak az egyik ág fut le),
- a **generátorok** és a `range`.

```python run
def hangos(x):
    print("  kiértékelem:", x)
    return x

print(hangos(False) and hangos(True))   # a második ki sem értékelődik
print(hangos(1) if True else hangos(2)) # csak az egyik ág fut
```

### Generátorok

A generátor az elemeket **egyesével, kérésre** állítja elő, ezért akár végtelen sorozatot is leírhatunk vele, és nem foglal memóriát az egész listának.

```python run
def negyzetek():
    n = 1
    while True:            # végtelen sorozat – lustán, csak kérésre számol
        yield n * n
        n += 1

gen = negyzetek()
print(next(gen), next(gen), next(gen))   # 1 4 9

# Generátorkifejezés: () zárójellel, nem []-lel.
osszeg = sum(x * x for x in range(1_000_000))   # nem épít milliós listát
print(osszeg)
```

## Az alapértelmezett érték csapdája

Az alapértelmezett érték **egyszer**, a függvény **definiálásakor** értékelődik ki – nem minden hívásnál! Megváltoztatható objektumnál (lista, szótár) ez meglepő hibához vezet:

```python run
def hozzaad_rossz(elem, lista=[]):   # a [] egyszer jön létre, minden hívás ugyanazt használja
    lista.append(elem)
    return lista

print(hozzaad_rossz(1))   # [1]
print(hozzaad_rossz(2))   # [1, 2]  ← meglepetés!
print(hozzaad_rossz(3))   # [1, 2, 3]
```

A helyes minta: `None` az alapértelmezett, és a függvényen belül hozunk létre új listát.

```python run
def hozzaad(elem, lista=None):
    if lista is None:
        lista = []          # minden hívás saját, új listát kap
    lista.append(elem)
    return lista

print(hozzaad(1))   # [1]
print(hozzaad(2))   # [2]
```

## Összefoglalás

- A Python **mohó**: az argumentumok a hívás előtt, **balról jobbra** értékelődnek ki.
- Lusta kiértékelés Pythonban: rövidzár, feltételes kifejezés, **generátorok** (`yield`, `(… for …)`).
- Az alapértelmezett érték a definíciókor értékelődik ki egyszer: listához, szótárhoz használj `None`-t.
