---
title: Listák részletesen
summary: Lista metódusok, szeletelés, rendezés, listaértelmezés és a lista mint dinamikus tömb.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a lista legfontosabb **metódusait**,
- a **szeletelést** és a **rendezést**,
- a **listaértelmezést** (list comprehension),
- hogyan működik a lista a háttérben (dinamikus tömb).

## Lista létrehozása

```python run
ures = []
szamok = [3, 1, 4, 1, 5]
vegyes = [1, "alma", 3.5, True, [1, 2]]   # Pythonban bármilyen elem lehet
betuk = list("hello")                      # ['h', 'e', 'l', 'l', 'o']
tiz = list(range(10))
print(ures, szamok, vegyes, betuk, tiz, sep="\n")
```

## A legfontosabb metódusok

| Metódus         | Mit csinál                                              |
| --------------- | ------------------------------------------------------- |
| `append(x)`     | x-et a végére fűzi                                      |
| `extend(lista)` | egy másik lista elemeit a végére fűzi                   |
| `insert(i, x)`  | x-et az i. helyre szúrja                                |
| `remove(x)`     | az első x értékű elemet törli (ValueError, ha nincs)    |
| `pop(i)`        | kiveszi és visszaadja az i. elemet (alapból az utolsót) |
| `index(x)`      | az első x indexe                                        |
| `count(x)`      | x előfordulásainak száma                                |
| `sort()`        | helyben rendez                                          |
| `reverse()`     | helyben megfordít                                       |
| `clear()`       | kiüríti                                                 |
| `copy()`        | sekély másolat                                          |

```python run
bevasarlas = ["tej", "kenyér"]
bevasarlas.append("alma")
bevasarlas.extend(["sajt", "vaj"])
bevasarlas.insert(1, "tojás")
print(bevasarlas)

bevasarlas.remove("kenyér")
utolso = bevasarlas.pop()
print(utolso, bevasarlas)
print(bevasarlas.index("alma"), bevasarlas.count("tej"))
```

## Szeletelés

Ugyanúgy működik, mint a szövegeknél: `lista[kezdet:vég:lépés]`, és **új listát** ad vissza.

```python run
t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(t[2:5])     # [2, 3, 4]
print(t[:3])      # [0, 1, 2]
print(t[-3:])     # [7, 8, 9]
print(t[::2])     # [0, 2, 4, 6, 8]
print(t[::-1])    # megfordítva

# Szelet értékadása: részlista cseréje
t[1:4] = ["a", "b"]
print(t)
```

## Rendezés

```python run
szamok = [5, 2, 9, 1, 7]

rendezett = sorted(szamok)          # ÚJ listát ad, az eredeti marad
print(rendezett, szamok)

szamok.sort()                       # HELYBEN rendez, None-t ad vissza
print(szamok)

szamok.sort(reverse=True)           # csökkenő sorrend
print(szamok)

nevek = ["éva", "Béla", "anna", "Csaba"]
print(sorted(nevek, key=str.lower))   # kis/nagybetű nélkül
print(sorted(nevek, key=len))         # hossz szerint
```

> Gyakori hiba: `szamok = szamok.sort()` – ezután a `szamok` értéke `None` lesz, mert a `sort()` nem ad vissza listát!

## Listaértelmezés (list comprehension)

Új lista előállítása egy meglévő gyűjteményből, egyetlen sorban:

```text
[kifejezés for elem in gyűjtemény if feltétel]
```

```python run
szamok = [1, 2, 3, 4, 5, 6]

negyzetek = [x * x for x in szamok]
parosak = [x for x in szamok if x % 2 == 0]
cimkek = ["páros" if x % 2 == 0 else "páratlan" for x in szamok]
print(negyzetek, parosak, cimkek, sep="\n")

# Mátrix létrehozása és lapítása
matrix = [[i * 3 + j for j in range(3)] for i in range(3)]
lapos = [x for sor in matrix for x in sor]
print(matrix, lapos)
```

## Hasznos beépített függvények listákra

```python run
t = [4, 8, 15, 16, 23, 42]
print(len(t), sum(t), min(t), max(t))
print(any(x > 40 for x in t), all(x > 0 for x in t))
print(list(reversed(t)))
print(list(enumerate(t))[:2])
```

## A lista a háttérben

A Python lista egy **dinamikus tömb**: a memóriában egy összefüggő tömböt foglal, kicsit nagyobbat, mint amennyi elem van benne. Ha betelik, egy nagyobb tömböt foglal (kb. másfélszereset), és átmásolja az elemeket. Emiatt az `append` **átlagosan** O(1), de az elejére szúrás (`insert(0, x)`) mindig O(n).

```python run
import sys
t = []
for i in range(10):
    t.append(i)
    print(len(t), sys.getsizeof(t), "bájt")   # a lefoglalt méret ugrásszerűen nő
```

## Összefoglalás

- Fontos metódusok: `append`, `extend`, `insert`, `remove`, `pop`, `index`, `count`, `sort`.
- `sorted()` új listát ad, a `sort()` helyben rendez és `None`-t ad.
- Listaértelmezés: `[kif for x in gy if felt]`.
- A lista dinamikus tömb: a végére fűzés gyors, az elejére szúrás lassú.
