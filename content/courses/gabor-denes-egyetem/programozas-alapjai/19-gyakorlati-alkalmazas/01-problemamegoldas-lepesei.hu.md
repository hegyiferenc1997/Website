---
title: A problémamegoldás lépései
summary: A feladat megértésétől a tesztelt, dokumentált programig – egy kidolgozott példán (súlyozott tanulmányi átlag).
minutes: 18
---

## Amit ebben a leckében megtanulsz

- milyen **lépésekben** érdemes egy programozási feladatot megoldani,
- hogyan bonts egy feladatot **kisebb részekre**,
- hogyan haladj **apró, tesztelt lépésekben**.

## A hat lépés

1. **Megértés:** mi a bemenet, mi a kimenet, mik a szabályok és a szélsőséges esetek?
2. **Tervezés:** részfeladatokra bontás, adatszerkezetek kiválasztása, algoritmus (pszeudokód).
3. **Megvalósítás:** a részfeladatok kódolása egyenként, függvényekbe szervezve.
4. **Tesztelés:** minden függvényt ellenőrizni, a szélsőséges esetekkel is.
5. **Javítás és finomítás:** hibakeresés, refaktorálás.
6. **Dokumentálás:** docstringek, README, használati útmutató.

Ezek a lépések nem szigorúan egymás után jönnek: a tesztelés közben gyakran kiderül, hogy valamit félreértettünk, és vissza kell lépni.

## Kidolgozott példa: súlyozott tanulmányi átlag

**Feladat:** írj programot, amely a hallgató tárgyaiból (név, kredit, jegy) kiszámolja

- a **súlyozott tanulmányi átlagot** (Σ kredit · jegy / Σ kredit),
- a **teljesített krediteket** (ahol a jegy legalább 2),
- és kiírja a tárgyakat jegy szerint csökkenő sorrendben.

### 1. Megértés – kérdések, amiket fel kell tenni

- Milyen formában jön az adat? → Egyelőre egy listában, később fájlból.
- Mi számít az átlagba? → Minden felvett tárgy, az elégtelen (1) is.
- Mi a szélsőséges eset? → Üres lista (nincs tárgy) – ilyenkor ne legyen nullával osztás!
- Mi az érvénytelen adat? → Jegy 1 és 5 között, kredit pozitív egész.

### 2. Tervezés – részfeladatok

| Részfeladat        | Függvény                      | Bemenet → kimenet                  |
| ------------------ | ----------------------------- | ---------------------------------- |
| adat ellenőrzése   | `ellenoriz(targy)`            | tárgy → hiba esetén `ValueError`   |
| súlyozott átlag    | `sulyozott_atlag(targyak)`    | lista → `float` (üres listára 0.0) |
| teljesített kredit | `teljesitett_kredit(targyak)` | lista → `int`                      |
| rendezett lista    | `rangsor(targyak)`            | lista → új, rendezett lista        |

**Adatszerkezet:** egy tárgy legyen egy `dataclass` (név, kredit, jegy) – olvashatóbb, mint egy tuple.

### 3–4. Megvalósítás és tesztelés lépésenként

Minden függvényt megírás után **azonnal** kipróbálunk egy-két `assert`-tel:

```python run
from dataclasses import dataclass

@dataclass
class Targy:
    """Egy felvett tantárgy."""
    nev: str
    kredit: int
    jegy: int

def ellenoriz(targy: Targy) -> None:
    """ValueError-t dob, ha a tárgy adatai érvénytelenek."""
    if not 1 <= targy.jegy <= 5:
        raise ValueError(f"Érvénytelen jegy: {targy.jegy} ({targy.nev})")
    if targy.kredit <= 0:
        raise ValueError(f"Érvénytelen kredit: {targy.kredit} ({targy.nev})")

def sulyozott_atlag(targyak: list[Targy]) -> float:
    """Kreditekkel súlyozott átlag két tizedesre; üres listára 0.0."""
    osszes_kredit = sum(t.kredit for t in targyak)
    if osszes_kredit == 0:
        return 0.0
    return round(sum(t.kredit * t.jegy for t in targyak) / osszes_kredit, 2)

def teljesitett_kredit(targyak: list[Targy]) -> int:
    """A legalább elégséges (2) jegyű tárgyak kreditjeinek összege."""
    return sum(t.kredit for t in targyak if t.jegy >= 2)

def rangsor(targyak: list[Targy]) -> list[Targy]:
    """Jegy szerint csökkenő, azonos jegynél név szerinti sorrend."""
    return sorted(targyak, key=lambda t: (-t.jegy, t.nev))

# --- gyors tesztek közvetlenül a megírás után ---
minta = [Targy("Programozási alapok", 8, 5), Targy("Matematika I.", 6, 3), Targy("Fizika", 4, 1)]
assert sulyozott_atlag(minta) == 3.44          # (40 + 18 + 4) / 18
assert sulyozott_atlag([]) == 0.0              # szélsőséges eset
assert teljesitett_kredit(minta) == 14
assert [t.nev for t in rangsor(minta)] == ["Programozási alapok", "Matematika I.", "Fizika"]
try:
    ellenoriz(Targy("Hibás", 5, 7))
    assert False
except ValueError as e:
    print("Elkapott hiba:", e)

# --- a főprogram ---
for t in minta:
    ellenoriz(t)
print(f"Súlyozott átlag: {sulyozott_atlag(minta)}")
print(f"Teljesített kredit: {teljesitett_kredit(minta)}")
for t in rangsor(minta):
    print(f"  {t.jegy}  {t.nev} ({t.kredit} kr)")
```

### 5. Finomítás

A program működik – most jöhetnek a bővítések, **egyenként, tesztekkel**: adatok beolvasása fájlból (13. témakör), egységtesztek `unittest`-tel (14. témakör), menü a felhasználónak.

### 6. Dokumentálás

Minden függvénynek van docstringje. Egy kész projekthez ezen felül README is kell: mit csinál a program, hogyan kell futtatni, milyen formátumú a bemenet (lásd a 15. témakört és a csoportos projektről szóló leckét).

## Gyakori hibák kezdőknél

- **Azonnal kódolni kezdeni** megértés és terv nélkül.
- **Egyszerre mindent megírni**, és csak a végén futtatni – ilyenkor nehéz megtalálni a hibát.
- **A szélsőséges esetek elfelejtése** (üres lista, nulla, negatív szám, hiányzó fájl).
- **Egy hatalmas függvény** sok kis, jól elnevezett függvény helyett.

## Összefoglalás

- Megértés → tervezés → megvalósítás → tesztelés → finomítás → dokumentálás.
- Bontsd a feladatot **kis függvényekre**, és mindegyiket teszteld azonnal.
- Gondolj a **szélsőséges esetekre** és az **érvénytelen adatokra**.
