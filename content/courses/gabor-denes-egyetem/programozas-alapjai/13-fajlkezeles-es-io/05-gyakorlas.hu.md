---
title: Gyakorlás – fájlkezelés
summary: Ellenőrző kérdések és feladatok szöveges, CSV és JSON fájlokra, valamint a fájlhibák kezelésére.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a `"w"` és az `"a"` mód között?**

<details>
<summary>Válasz</summary>

A `"w"` kiüríti (felülírja) a létező fájlt, az `"a"` a végére fűz, a korábbi tartalom megmarad. Mindkettő létrehozza a fájlt, ha nem létezik.

</details>

**2. Miért használjuk a `with` utasítást fájlkezelésnél?**

<details>
<summary>Válasz</summary>

Mert a blokk végén automatikusan bezárja a fájlt, akkor is, ha közben kivétel történt – így nem marad nyitva fájl és nem vész el a pufferben lévő adat.

</details>

**3. Mire való a `stderr`, ha van `stdout`?**

<details>
<summary>Válasz</summary>

A hibaüzenetek külön csatornán mennek, így ha a kimenetet fájlba irányítjuk, a hibák nem keverednek az adatok közé, és a képernyőn is látszanak.

</details>

**4. Miért add meg mindig az `encoding="utf-8"` paramétert?**

<details>
<summary>Válasz</summary>

Mert különben az operációs rendszer alapértelmezett kódolása érvényes (Windowson gyakran nem UTF-8), és az ékezetes karakterek más gépen hibásan jelenhetnek meg vagy `UnicodeDecodeError`-t okozhatnak.

</details>

**5. Melyik kivétel keletkezik, ha olvasásra nyitunk egy nem létező fájlt?**

<details>
<summary>Válasz</summary>

`FileNotFoundError` (az `OSError` leszármazottja).

</details>

## Feladatok

### 1. feladat: Sorok, szavak, karakterek

Írj `statisztika(fajlnev)` függvényt, amely egy `(sorok, szavak, karakterek)` tuple-t ad vissza egy szöveges fájlról (mint a Unix `wc` parancs). A karakterek számába a sortörések is beleszámítanak.

```python starter
def statisztika(fajlnev):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def statisztika(fajlnev):
    sorok = szavak = karakterek = 0
    with open(fajlnev, encoding="utf-8") as f:
        for sor in f:
            sorok += 1
            szavak += len(sor.split())
            karakterek += len(sor)
    return sorok, szavak, karakterek
```

</details>

```python test
with open("proba.txt", "w", encoding="utf-8") as f:
    f.write("Szia világ\nEz egy próba\n")
assert statisztika("proba.txt") == (2, 5, 24)
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Hiányzó fájl

Írj `sorok_szama(fajlnev)` függvényt, amely visszaadja a fájl sorainak számát, nem létező fájlnál pedig `-1`-et!

```python starter
def sorok_szama(fajlnev):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def sorok_szama(fajlnev):
    try:
        with open(fajlnev, encoding="utf-8") as f:
            return sum(1 for _ in f)
    except FileNotFoundError:
        return -1
```

</details>

```python test
with open("harom.txt", "w", encoding="utf-8") as f:
    f.write("a\nb\nc\n")
assert sorok_szama("harom.txt") == 3
assert sorok_szama("nincs_ilyen_fajl.txt") == -1
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Pontszámok CSV-ből

Egy CSV fájlban `nev,pont` oszlopok vannak (fejléccel). Írj `legjobb(fajlnev)` függvényt, amely visszaadja a legtöbb pontot elért hallgató nevét!

```python starter
import csv

def legjobb(fajlnev):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
import csv

def legjobb(fajlnev):
    with open(fajlnev, newline="", encoding="utf-8") as f:
        sorok = list(csv.DictReader(f))
    return max(sorok, key=lambda s: int(s["pont"]))["nev"]
```

</details>

```python test
with open("pontok.csv", "w", newline="", encoding="utf-8") as f:
    f.write("nev,pont\nAnna,87\nBéla,92\nCsilla,64\n")
assert legjobb("pontok.csv") == "Béla"
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Beállítások JSON-ben

Írj `mentes(beallitasok, fajlnev)` és `betoltes(fajlnev, alap)` függvényt! A `betoltes` adja vissza a fájlból beolvasott szótárat; ha a fájl nem létezik **vagy** hibás JSON, adja vissza az `alap` szótárat.

```python starter
import json

def mentes(beallitasok, fajlnev):
    pass

def betoltes(fajlnev, alap):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
import json

def mentes(beallitasok, fajlnev):
    with open(fajlnev, "w", encoding="utf-8") as f:
        json.dump(beallitasok, f, ensure_ascii=False, indent=2)

def betoltes(fajlnev, alap):
    try:
        with open(fajlnev, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return alap
```

</details>

```python test
mentes({"tema": "sötét", "nyelv": "hu"}, "beall.json")
assert betoltes("beall.json", {}) == {"tema": "sötét", "nyelv": "hu"}
assert betoltes("nincs.json", {"tema": "világos"}) == {"tema": "világos"}
with open("rossz.json", "w", encoding="utf-8") as f:
    f.write("{ez nem json")
assert betoltes("rossz.json", {"x": 1}) == {"x": 1}
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Napló hozzáfűzése

Írj `naplo(fajlnev, uzenet)` függvényt, amely az üzenetet új sorként a fájl **végére** fűzi, és visszaadja, hány sor van most a fájlban!

```python starter
def naplo(fajlnev, uzenet):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def naplo(fajlnev, uzenet):
    with open(fajlnev, "a", encoding="utf-8") as f:
        f.write(uzenet + "\n")
    with open(fajlnev, encoding="utf-8") as f:
        return sum(1 for _ in f)
```

</details>

```python test
import os
if os.path.exists("app.log"):
    os.remove("app.log")
assert naplo("app.log", "indítás") == 1
assert naplo("app.log", "bejelentkezés") == 2
with open("app.log", encoding="utf-8") as f:
    assert f.read() == "indítás\nbejelentkezés\n"
print("Minden ellenőrzés sikeres!")
```
