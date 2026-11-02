---
title: Rekurzió a hívási veremben
summary: Mi történik a memóriában rekurzív híváskor, mi a veremkeret, és miért van rekurziós mélységi korlát.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **hívási verem** (call stack) és a **veremkeret**,
- hogyan épül fel és bomlik le a verem rekurzió közben,
- mi a **rekurziós mélység** és a **veremtúlcsordulás**,
- mi a **közvetett** rekurzió.

## A hívási verem

Minden függvényhíváskor a program egy **veremkeretet** (stack frame) tesz a hívási verem tetejére. Ebben vannak a hívás **paraméterei**, **lokális változói** és a **visszatérési cím**. Amikor a függvény visszatér, a kerete lekerül a veremről. A verem **LIFO**: mindig a legutóbb hívott függvény fut.

## Kövessük végig

```python run
def faktorialis(n, melyseg=0):
    behuzas = "  " * melyseg
    print(f"{behuzas}→ faktorialis({n}) hívás")
    if n == 0:
        eredmeny = 1
    else:
        eredmeny = n * faktorialis(n - 1, melyseg + 1)
    print(f"{behuzas}← faktorialis({n}) = {eredmeny}")
    return eredmeny

faktorialis(4)
```

A verem állapota a legmélyebb ponton:

```text
┌──────────────────────┐  ← verem teteje (most ez fut)
│ faktorialis(n=0)     │
├──────────────────────┤
│ faktorialis(n=1)     │  vár: 1 * ?
├──────────────────────┤
│ faktorialis(n=2)     │  vár: 2 * ?
├──────────────────────┤
│ faktorialis(n=3)     │  vár: 3 * ?
├──────────────────────┤
│ faktorialis(n=4)     │  vár: 4 * ?
├──────────────────────┤
│ főprogram            │
└──────────────────────┘
```

A rekurzió két fázisa:

1. **Leszálló ág:** a hívások egymásra épülnek, amíg el nem érjük az alapesetet.
2. **Felszálló ág:** az alapeset visszaadja az értékét, és a keretek sorban lekerülnek, mindegyik befejezi a maga számítását.

## Rekurziós mélység és veremtúlcsordulás

Minden keret memóriát foglal, és a verem mérete véges. Túl mély rekurzió **veremtúlcsordulást** (stack overflow) okoz. A Python ezt egy korláttal előzi meg (alapból kb. 1000 szint):

```python run
import sys
print(sys.getrecursionlimit())

def melyseg(n):
    if n == 0:
        return 0
    return 1 + melyseg(n - 1)

print(melyseg(500))           # ez még belefér
try:
    melyseg(100_000)          # ez már nem
except RecursionError as hiba:
    print("RecursionError:", hiba)
```

> A korlátot a `sys.setrecursionlimit()` növelheti, de ez általában rossz megoldás: ha ilyen mély rekurzió kell, írd át iteratívra.

## Közvetett (kölcsönös) rekurzió

A rekurzió lehet **közvetett** is: `A` hívja `B`-t, `B` hívja `A`-t.

```python run
def paros(n):
    return True if n == 0 else paratlan(n - 1)

def paratlan(n):
    return False if n == 0 else paros(n - 1)

print(paros(10), paratlan(7), paros(3))
```

## Összefoglalás

- Minden hívás egy **veremkeretet** kap (paraméterek, lokális változók, visszatérési cím).
- A rekurzió **leszálló** ágon építi, **felszálló** ágon bontja le a vermet.
- Túl mély rekurzió → `RecursionError` (veremtúlcsordulás); a Python alapkorlátja kb. 1000.
- Közvetett rekurzió: függvények kölcsönösen hívják egymást.
