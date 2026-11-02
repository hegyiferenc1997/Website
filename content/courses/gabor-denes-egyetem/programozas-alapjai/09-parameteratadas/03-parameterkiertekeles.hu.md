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

## A lecke feladata: Az alapértelmezett érték csapdája

A kiinduló `gyujt(elem, lista=[])` függvény hibás: az alapértelmezett lista csak **egyszer**, a függvény definiálásakor jön létre, ezért a hívások között megmarad, és „összegyűlnek” benne az elemek. Futtasd le, és nézd meg!

Javítsd ki a szokásos mintával: az alapérték legyen `None`, és a függvényen belül készíts új listát, ha nem kaptál. Ha a hívó adott listát, ahhoz fűzd hozzá (és azt add vissza).

```python starter required
def gyujt(elem, lista=[]):
    lista.append(elem)
    return lista


print(gyujt(1))   # [1]
print(gyujt(2))   # [2] kellene, de [1, 2] lesz!
```

<details>
<summary>Megoldás</summary>

```python solution
def gyujt(elem, lista=None):
    if lista is None:
        lista = []
    lista.append(elem)
    return lista


print(gyujt(1))   # [1]
print(gyujt(2))   # [2]
```

</details>

```python test
assert gyujt(1) == [1], "gyujt(1) → [1]"
assert gyujt(2) == [2], "gyujt(2) → [2] – az előző hívás eleme nem maradhat meg!"
sajat = [0]
assert gyujt(3, sajat) == [0, 3] and sajat == [0, 3], "Kapott listánál ahhoz kell hozzáfűzni."
assert gyujt(4) == [4], "Utána is friss lista jár."
```
