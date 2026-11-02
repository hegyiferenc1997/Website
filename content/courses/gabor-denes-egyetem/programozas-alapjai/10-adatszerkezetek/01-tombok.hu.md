---
title: Tömbök és műveleteik
summary: A tömb mint egymás utáni memóriacellák sora: indexelés, bejárás, keresés, beszúrás, törlés – és kétdimenziós tömbök.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **tömb**, és hogyan tárolódik a memóriában,
- a tömb alapműveleteit és azok **költségét**,
- hogyan használsz tömböt Pythonban (`list`, `array`),
- mi a **kétdimenziós tömb** (mátrix).

## Mi a tömb?

A **tömb** azonos típusú elemek sorozata, amelyek a memóriában **közvetlenül egymás után** helyezkednek el. Minden elemet az **indexével** érünk el (0-tól számozva).

```text
index:     0     1     2     3     4
        ┌─────┬─────┬─────┬─────┬─────┐
érték:  │  12 │   7 │  33 │   5 │  21 │
        └─────┴─────┴─────┴─────┴─────┘
cím:    1000  1004  1008  1012  1016     (4 bájtos egészek)
```

Mivel az elemek egyforma méretűek és egymás után állnak, az i-edik elem címe kiszámolható: `kezdőcím + i · elemméret`. Ezért az **index szerinti elérés konstans idejű**, O(1) – mindegy, hányadik elemet kérjük.

Klasszikus (statikus) tömbnél a méretet **létrehozáskor** meg kell adni, és később nem változtatható:

```java
int[] pontok = new int[5];   // Java: 5 elemű egész tömb, mindegyik 0
pontok[2] = 33;
```

## Tömb Pythonban

Pythonban a beépített **lista** (`list`) tölti be a tömb szerepét. Valójában **dinamikus tömb**: automatikusan nő, és különböző típusú elemeket is tárolhat. Számok tömör tárolására az `array` modul is használható.

```python run
pontok = [12, 7, 33, 5, 21]
print(pontok[2])        # 33 – elérés index alapján, O(1)
pontok[2] = 40          # módosítás, O(1)
print(pontok, len(pontok))

import array
szamok = array.array("i", [1, 2, 3])   # "i" = csak egész számok, tömören tárolva
print(szamok[1])
```

## Alapműveletek és költségük

| Művelet                        | Python                 | Költség                                 |
| ------------------------------ | ---------------------- | --------------------------------------- |
| elérés index szerint           | `t[i]`                 | O(1)                                    |
| módosítás index szerint        | `t[i] = x`             | O(1)                                    |
| hozzáfűzés a végére            | `t.append(x)`          | átlagosan O(1)                          |
| beszúrás az elejére / közepére | `t.insert(i, x)`       | O(n) – a többi elemet arrébb kell tolni |
| törlés a végéről               | `t.pop()`              | O(1)                                    |
| törlés az elejéről / közepéről | `t.pop(i)`, `del t[i]` | O(n)                                    |
| keresés érték szerint          | `x in t`, `t.index(x)` | O(n)                                    |

```python run
t = [10, 20, 30]
t.append(40)        # [10, 20, 30, 40]
t.insert(0, 5)      # [5, 10, 20, 30, 40] – minden elem eggyel jobbra csúszik
t.pop()             # eltávolítja a 40-et
t.pop(0)            # eltávolítja az 5-öt – minden elem eggyel balra csúszik
print(t)
print(20 in t, t.index(30))
```

## Bejárás

```python run
homersekletek = [12.5, 14.0, 9.8, 16.2]

# index szerint
for i in range(len(homersekletek)):
    print(i, homersekletek[i])

# elemenként (pythonosabb)
for t in homersekletek:
    print(t, end=" ")
print()
```

> **Indexhatár:** az utolsó érvényes index `len(t) - 1`. A `t[len(t)]` már `IndexError`. Ez az egyik leggyakoribb hiba („off-by-one”).

## Kétdimenziós tömb (mátrix)

Egy táblázat (sorok és oszlopok) **listák listájaként** írható le. Az elemet `m[sor][oszlop]` alakban érjük el.

```python run
# 3 sor, 4 oszlop
m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]
print(m[1][2])          # 7 – 2. sor, 3. oszlop
print(len(m), len(m[0]))  # sorok és oszlopok száma

# Soronkénti összeg
for sor in m:
    print(sum(sor))

# Oszloponkénti összeg
for j in range(len(m[0])):
    print(sum(m[i][j] for i in range(len(m))), end=" ")
print()
```

Üres mátrix létrehozásánál vigyázz:

```python run
rossz = [[0] * 3] * 2           # a két sor UGYANAZ a lista!
rossz[0][0] = 1
print(rossz)                    # [[1, 0, 0], [1, 0, 0]]

jo = [[0] * 3 for _ in range(2)]   # minden sor külön lista
jo[0][0] = 1
print(jo)                       # [[1, 0, 0], [0, 0, 0]]
```

## Összefoglalás

- A tömb egymás után tárolt, azonos típusú elemek sora; az index szerinti elérés **O(1)**.
- A beszúrás és törlés az elején/közepén **O(n)**, mert az elemeket tolni kell.
- Pythonban a `list` dinamikus tömb; mátrixhoz listák listáját használjuk (`[[0]*m for _ in range(n)]`).
