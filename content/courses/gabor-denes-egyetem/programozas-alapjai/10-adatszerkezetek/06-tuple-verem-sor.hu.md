---
title: Tuple, verem, sor – és melyiket válaszd?
summary: A megváltoztathatatlan tuple, a LIFO verem és a FIFO sor, valamint összefoglaló táblázat az adatszerkezetek választásához.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **tuple**, és mikor használd lista helyett,
- mi a **verem** (stack) és a **sor** (queue), és hogyan valósítod meg őket Pythonban,
- hogyan **választasz** adatszerkezetet egy feladathoz.

## Tuple – rendezett, megváltoztathatatlan

A **tuple** olyan, mint a lista, de létrehozás után **nem módosítható**. Összetartozó, rögzített adatokra használjuk (koordináta, dátum, rekord).

```python run
pont = (3, 4)
datum = (2026, 11, 2)
egyelemu = (5,)          # vessző kell, különben csak zárójelezett szám!

print(pont[0], len(datum))
x, y = pont              # kicsomagolás
print(x, y)
# pont[0] = 10  → TypeError: 'tuple' object does not support item assignment

# Mivel megváltoztathatatlan, lehet szótár kulcsa vagy halmaz eleme.
tavolsagok = {("Budapest", "Győr"): 121, ("Budapest", "Pécs"): 197}
print(tavolsagok[("Budapest", "Győr")])
```

Nevesített mezőkkel olvashatóbb a `namedtuple`:

```python run
from collections import namedtuple
Pont = namedtuple("Pont", ["x", "y"])
p = Pont(3, 4)
print(p.x, p.y, p)
```

## Verem (stack) – LIFO

A **verem** „utolsóként be, elsőként ki” (**LIFO** – Last In, First Out) elven működik, mint egy tányérkupac. Műveletei: **push** (rátesz), **pop** (levesz), **peek/top** (megnézi a tetejét).

Felhasználás: visszavonás (Ctrl+Z), böngésző „vissza” gombja, függvényhívások (hívási verem), zárójelek ellenőrzése.

```python run
verem = []
verem.append("A")     # push
verem.append("B")
verem.append("C")
print(verem[-1])      # peek: C
print(verem.pop())    # pop: C
print(verem.pop())    # pop: B
print(verem)          # ['A']
```

```python run
# Zárójelek helyes párosításának ellenőrzése veremmel.
def zarojelek_rendben(szoveg):
    parok = {")": "(", "]": "[", "}": "{"}
    verem = []
    for c in szoveg:
        if c in "([{":
            verem.append(c)
        elif c in parok:
            if not verem or verem.pop() != parok[c]:
                return False
    return not verem

print(zarojelek_rendben("(a[b]{c})"), zarojelek_rendben("(a[b)]"))
```

## Sor (queue) – FIFO

A **sor** „elsőként be, elsőként ki” (**FIFO** – First In, First Out) elven működik, mint a sorban állás. Műveletei: **enqueue** (a végére áll), **dequeue** (az elejéről kivesz).

Felhasználás: nyomtatási sor, feladatütemezés, üzenetsorok, szélességi keresés.

A lista elejéről törölni lassú (O(n)), ezért sorhoz a `collections.deque`-t használjuk:

```python run
from collections import deque

sor = deque()
sor.append("1. ügyfél")      # enqueue
sor.append("2. ügyfél")
sor.append("3. ügyfél")
print(sor.popleft())         # dequeue: 1. ügyfél – O(1)
print(sor.popleft())
print(list(sor))
```

## Melyik adatszerkezetet válaszd?

| Kérdés / igény | Választás |
| --- | --- |
| sorrend számít, index szerint érem el, módosítom | **lista** |
| rögzített, összetartozó értékek, nem változnak | **tuple** |
| csak az számít, benne van-e; ismétlődések kiszűrése | **halmaz** |
| kulcs alapján keresek értéket | **szótár (map)** |
| mindig az utoljára betett elem kell | **verem** (lista `append`/`pop`) |
| érkezési sorrendben dolgozom fel | **sor** (`deque`) |
| sok beszúrás/törlés az elején vagy közepén | **láncolt lista** / `deque` |

## Műveletek költsége – összefoglaló

| | lista | tuple | halmaz | szótár | deque |
| --- | --- | --- | --- | --- | --- |
| index szerinti elérés | O(1) | O(1) | – | – | O(n) |
| keresés (`in`) | O(n) | O(n) | **O(1)** | **O(1)** (kulcs) | O(n) |
| beszúrás a végére | O(1)* | – | O(1)* | O(1)* | O(1) |
| beszúrás az elejére | O(n) | – | – | – | **O(1)** |
| módosítható | igen | nem | igen | igen | igen |

\* átlagosan

## Összefoglalás

- A **tuple** megváltoztathatatlan lista; lehet szótár kulcsa.
- **Verem**: LIFO, Pythonban lista `append` + `pop`.
- **Sor**: FIFO, Pythonban `deque` `append` + `popleft`.
- A választásnál gondold végig: kell-e sorrend, index, gyors keresés, kulcs, módosíthatóság.
