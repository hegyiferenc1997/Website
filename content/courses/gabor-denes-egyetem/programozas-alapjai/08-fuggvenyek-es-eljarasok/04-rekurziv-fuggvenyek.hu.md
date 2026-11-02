---
title: Rekurzív függvények
summary: Függvény, amely önmagát hívja – alapeset, rekurzív eset, és az első példák. Részletesen a Rekurzió és iteráció témakörben.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mi a **rekurzív függvény**,
- mi az **alapeset** és a **rekurzív eset**,
- hogyan írsz egyszerű rekurzív függvényt.

## Mi a rekurzió?

**Rekurzív** az a függvény, amely **önmagát hívja meg**. A feladatot egy kisebb, ugyanolyan feladatra vezeti vissza, egészen addig, amíg el nem jut egy olyan egyszerű esetig, amit közvetlenül meg tud oldani.

Minden rekurzív függvénynek két része van:

1. **Alapeset (báziseset):** az a legegyszerűbb eset, ahol nem hív tovább, hanem közvetlenül visszaad egy értéket.
2. **Rekurzív eset:** a feladatot egy **kisebb** részfeladatra bontja, és arra meghívja önmagát.

## Példa: faktoriális

A faktoriális definíciója maga is rekurzív: `n! = n · (n−1)!`, és `0! = 1`.

```python run
def faktorialis(n):
    if n == 0:                         # alapeset
        return 1
    return n * faktorialis(n - 1)      # rekurzív eset: kisebb feladat

print(faktorialis(5))   # 120
```

Így bomlik ki a hívás:

```text
faktorialis(5)
= 5 * faktorialis(4)
= 5 * 4 * faktorialis(3)
= 5 * 4 * 3 * faktorialis(2)
= 5 * 4 * 3 * 2 * faktorialis(1)
= 5 * 4 * 3 * 2 * 1 * faktorialis(0)
= 5 * 4 * 3 * 2 * 1 * 1
= 120
```

## Példa: visszaszámlálás

```python run
def visszaszamlal(n):
    if n == 0:
        print("Start!")
        return
    print(n)
    visszaszamlal(n - 1)

visszaszamlal(3)
```

## Példa: lista elemeinek összege

```python run
def osszeg(lista):
    if not lista:                      # alapeset: üres lista összege 0
        return 0
    return lista[0] + osszeg(lista[1:])   # első elem + a maradék összege

print(osszeg([3, 1, 4, 1, 5]))   # 14
```

## Ha hiányzik az alapeset

Alapeset nélkül (vagy ha a feladat nem lesz kisebb) a függvény a végtelenségig hívná magát. A Python ezt egy idő után leállítja:

```python
def rossz(n):
    return n * rossz(n - 1)   # nincs alapeset!

rossz(5)   # RecursionError: maximum recursion depth exceeded
```

> **Ellenőrzőlista rekurzív függvényhez:** 1) Van alapeset? 2) Minden rekurzív hívás közelebb visz az alapesethez? 3) Helyes az eredmény az alapesetben?

A rekurzió működését (hívási verem), az iterációval való összehasonlítást és a rekurzív algoritmusokat a **Rekurzió és iteráció** témakör tárgyalja részletesen.

## Összefoglalás

- A rekurzív függvény önmagát hívja, kisebb részfeladatra.
- Kell **alapeset** (megállás) és **rekurzív eset** (a feladat csökkentése).
- Alapeset nélkül `RecursionError` keletkezik.
