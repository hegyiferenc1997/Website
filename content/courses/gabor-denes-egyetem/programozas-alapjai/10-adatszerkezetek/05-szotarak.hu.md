---
title: Map-ek és szótárak
summary: Kulcs–érték párok tárolása: létrehozás, elérés, módosítás, bejárás, számlálás és egymásba ágyazott szótárak.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **map** (asszociatív tömb), és hogyan valósítja meg a Python **szótár** (`dict`),
- hogyan érsz el, adsz hozzá, módosítasz és törölsz elemeket,
- hogyan **járod be** a szótárat,
- tipikus mintákat: **számlálás**, **csoportosítás**, egymásba ágyazott adatok.

## Mi a map?

A **map** (más néven asszociatív tömb, szótár) **kulcs–érték párokat** tárol. Az értéket nem index, hanem **kulcs** alapján érjük el – mint egy telefonkönyvben a nevet keressük, és a számot kapjuk meg.

| Nyelv | Map típus |
| --- | --- |
| Python | `dict` |
| Java | `HashMap`, `TreeMap` |
| C# | `Dictionary<K, V>` |
| C++ | `std::map`, `std::unordered_map` |
| JavaScript | `Map`, objektum |

A kulcsok **egyediek** és megváltoztathatatlanok (szöveg, szám, tuple), az értékek bármik lehetnek. A Python szótár hasítótáblát használ, így az elérés átlagosan **O(1)**, és megőrzi a beszúrás sorrendjét (Python 3.7 óta).

## Létrehozás és elérés

```python run
hallgato = {
    "nev": "Kiss Anna",
    "neptun": "ABC123",
    "felev": 1,
    "jegyek": [5, 4, 5],
}

print(hallgato["nev"])               # elérés kulccsal
print(hallgato.get("email"))         # None – nincs hiba, ha a kulcs hiányzik
print(hallgato.get("email", "nincs megadva"))   # alapértelmezett érték
print("neptun" in hallgato)          # kulcs vizsgálata
# hallgato["email"]  → KeyError
```

## Módosítás, hozzáadás, törlés

```python run
szotar = {"alma": 300, "körte": 450}
szotar["szilva"] = 520        # új kulcs hozzáadása
szotar["alma"] = 320          # meglévő érték módosítása
del szotar["körte"]           # törlés (KeyError, ha nincs)
ar = szotar.pop("szilva")     # kivétel és visszaadás
print(szotar, ar)

szotar.update({"barack": 690, "alma": 350})   # több kulcs egyszerre
print(szotar)
```

## Bejárás

```python run
arak = {"kenyér": 650, "tej": 420, "vaj": 890}

for termek in arak:                   # alapból a kulcsokon megy végig
    print(termek)

for ar in arak.values():              # értékek
    print(ar, end=" ")
print()

for termek, ar in arak.items():       # kulcs–érték párok
    print(f"{termek}: {ar} Ft")

# Rendezés érték szerint
for termek, ar in sorted(arak.items(), key=lambda p: p[1]):
    print(termek, ar)
```

## Szótárértelmezés

```python run
negyzetek = {x: x * x for x in range(1, 6)}
print(negyzetek)

arak = {"kenyér": 650, "tej": 420, "vaj": 890}
dragak = {k: v for k, v in arak.items() if v > 500}
print(dragak)
```

## Tipikus minta: számlálás

```python run
szoveg = "a programozás alapjai a programozás"
gyakorisag = {}
for szo in szoveg.split():
    gyakorisag[szo] = gyakorisag.get(szo, 0) + 1
print(gyakorisag)

# Ugyanez a Counter osztállyal:
from collections import Counter
print(Counter(szoveg.split()).most_common(2))
```

## Tipikus minta: csoportosítás

```python run
hallgatok = [("Anna", "A"), ("Béla", "B"), ("Csilla", "A"), ("Dóra", "B"), ("Ede", "A")]
csoportok = {}
for nev, csoport in hallgatok:
    csoportok.setdefault(csoport, []).append(nev)   # ha nincs még ilyen kulcs, üres listát tesz be
print(csoportok)
```

## Egymásba ágyazott adatok

Valódi adatok gyakran szótárak listái vagy szótárban lévő szótárak (pl. JSON):

```python run
kurzus = {
    "nev": "Programozási alapok",
    "kredit": 8,
    "hallgatok": [
        {"nev": "Anna", "pont": 92},
        {"nev": "Béla", "pont": 61},
    ],
}
for h in kurzus["hallgatok"]:
    print(h["nev"], h["pont"])
atlag = sum(h["pont"] for h in kurzus["hallgatok"]) / len(kurzus["hallgatok"])
print("Átlag:", atlag)
```

## Összefoglalás

- A map kulcs–érték párokat tárol; Pythonban `dict`, átlagosan **O(1)** elérés.
- Elérés: `d[k]` (KeyError, ha nincs) vagy `d.get(k, alap)`; bejárás: `keys()`, `values()`, `items()`.
- Minták: számlálás (`get(k, 0) + 1`, `Counter`), csoportosítás (`setdefault`).
