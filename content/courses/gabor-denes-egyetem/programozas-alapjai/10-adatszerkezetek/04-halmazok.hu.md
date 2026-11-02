---
title: Halmazok
summary: Ismétlődés nélküli, rendezetlen gyűjtemény gyors tartalmazás-vizsgálattal; unió, metszet, különbség.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mi a **halmaz** (set), és mik a tulajdonságai,
- hogyan működnek a **halmazműveletek** (unió, metszet, különbség),
- miért **gyors** a halmazban keresés (hasítás).

## Tulajdonságok

A **halmaz**:

- minden elemet **csak egyszer** tartalmaz,
- **rendezetlen**: nincs indexe, a bejárás sorrendje nem garantált,
- elemei **megváltoztathatatlanok** (számok, szövegek, tuple-k – lista nem lehet halmaz eleme),
- a „benne van-e?” kérdést átlagosan **O(1)** idő alatt dönti el.

```python run
gyumolcsok = {"alma", "körte", "alma", "szilva"}
print(gyumolcsok)            # az ismétlődő „alma” csak egyszer szerepel
print(len(gyumolcsok))       # 3
print("körte" in gyumolcsok) # True

ures = set()                 # FIGYELEM: a {} üres szótárat jelent, nem halmazt!
ures.add(5)
ures.add(5)
print(ures)                  # {5}
```

## Ismétlődések kiszűrése

```python run
jegyek = [5, 3, 4, 5, 3, 5, 2]
kulonbozo = set(jegyek)
print(kulonbozo, len(kulonbozo))
print(sorted(kulonbozo))     # rendezett listaként
```

## Módosítás

```python run
h = {1, 2, 3}
h.add(4)          # elem hozzáadása
h.discard(10)     # törlés, ha benne van (nincs hiba, ha nincs)
h.remove(1)       # törlés (KeyError, ha nincs benne)
print(h)
```

## Halmazműveletek

```python run
python = {"Anna", "Béla", "Csilla", "Dóra"}
java = {"Csilla", "Dóra", "Ede"}

print(python | java)    # unió: aki legalább az egyiket tanulja
print(python & java)    # metszet: aki mindkettőt
print(python - java)    # különbség: aki csak Pythont
print(python ^ java)    # szimmetrikus különbség: aki pontosan az egyiket

print({"Csilla"} <= python)   # részhalmaz-e
```

| Művelet                | Jel      | Metódus                     |
| ---------------------- | -------- | --------------------------- |
| unió                   | `a \| b` | `a.union(b)`                |
| metszet                | `a & b`  | `a.intersection(b)`         |
| különbség              | `a - b`  | `a.difference(b)`           |
| szimmetrikus különbség | `a ^ b`  | `a.symmetric_difference(b)` |
| részhalmaz             | `a <= b` | `a.issubset(b)`             |

## Miért gyors? – Hasítás

A halmaz (és a szótár) **hasítótáblát** (hash table) használ. Minden elemből egy **hash függvény** egy számot (hash értéket) képez, ami megmondja, a tábla melyik „rekeszébe” kerül. Kereséskor nem kell az összes elemet végignézni, elég kiszámolni a hash-t, és megnézni azt az egy rekeszt.

```python run
print(hash("alma"), hash(42))     # minden megváltoztathatatlan objektumnak van hash értéke
# hash([1, 2])  → TypeError: unhashable type: 'list'
```

Ezért nem lehet lista halmaz eleme: ha a lista megváltozna, a hash értéke is megváltozna, és az elem „rossz rekeszben” lenne.

## frozenset

A `frozenset` a halmaz megváltoztathatatlan változata – így akár egy másik halmaz eleme vagy szótár kulcsa is lehet.

```python run
f = frozenset([1, 2, 3])
print(f, {f: "kulcsként is jó"})
```

## Összefoglalás

- A halmaz ismétlődés nélküli, rendezetlen gyűjtemény; üres halmaz: `set()`.
- Tartalmazás-vizsgálat átlagosan **O(1)** a hasítótábla miatt.
- Műveletek: `|` unió, `&` metszet, `-` különbség, `^` szimmetrikus különbség.
- Elemei csak megváltoztathatatlan (hash-elhető) objektumok lehetnek.
