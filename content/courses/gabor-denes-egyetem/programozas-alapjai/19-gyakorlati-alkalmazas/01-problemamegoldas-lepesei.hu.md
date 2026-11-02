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

## A lecke feladata: Kreditindex és korrigált kreditindex

Oldd meg a hat lépés szerint! A magyar egyetemeken az ösztöndíjat gyakran a **kreditindex** alapján osztják:

- **kreditindex** = Σ(kredit · jegy) a **teljesített** tárgyakra (jegy ≥ 2), osztva **30**-cal,
- **korrigált kreditindex** = kreditindex · teljesített kredit / felvett kredit.

Írj `kreditindexek(targyak)` függvényt, ahol `targyak` `(név, kredit, jegy)` hármasok listája. Az eredmény a `(kreditindex, korrigált)` pár, mindkettő 2 tizedesre kerekítve.

- Üres listára `(0.0, 0.0)` legyen az eredmény – nullával osztás nélkül!
- Érvénytelen adatnál (a jegy nem 1–5 közötti egész, vagy a kredit nem pozitív egész) dobjon `ValueError`-t.

```python starter required
def kreditindexek(targyak):
    osszeg = sum(kredit * jegy for nev, kredit, jegy in targyak)
    return (osszeg / 30, osszeg / 30)


TARGYAK = [("Programozás alapjai", 6, 5), ("Matematika", 5, 3), ("Fizika", 4, 1)]
print(kreditindexek(TARGYAK))
```

<details>
<summary>Megoldás</summary>

```python solution
def ellenoriz(targy):
    """Hibás adat esetén ValueError-t dob."""
    nev, kredit, jegy = targy
    if not isinstance(jegy, int) or not 1 <= jegy <= 5:
        raise ValueError(f"{nev}: a jegy 1 és 5 közötti egész legyen.")
    if not isinstance(kredit, int) or kredit <= 0:
        raise ValueError(f"{nev}: a kredit pozitív egész legyen.")


def kreditindexek(targyak):
    for targy in targyak:
        ellenoriz(targy)
    felvett = sum(kredit for _, kredit, _ in targyak)
    if felvett == 0:
        return (0.0, 0.0)
    # Csak a teljesített (legalább elégséges) tárgyak számítanak
    teljesitett = [(kredit, jegy) for _, kredit, jegy in targyak if jegy >= 2]
    ki = sum(kredit * jegy for kredit, jegy in teljesitett) / 30
    teljesitett_kredit = sum(kredit for kredit, _ in teljesitett)
    kki = ki * teljesitett_kredit / felvett
    return (round(ki, 2), round(kki, 2))


TARGYAK = [("Programozás alapjai", 6, 5), ("Matematika", 5, 3), ("Fizika", 4, 1)]
print(kreditindexek(TARGYAK))
```

</details>

```python test
TARGYAK = [("Programozás alapjai", 6, 5), ("Matematika", 5, 3), ("Fizika", 4, 1)]
assert kreditindexek(TARGYAK) == (1.5, 1.1), "A bukott tárgy nem számít a kreditindexbe (45 / 30 = 1.5), de a felvett kreditbe igen (1.5 · 11 / 15 = 1.1)."
assert kreditindexek([("A", 30, 5)]) == (5.0, 5.0), "30 kredit csupa ötössel: 5.0 és 5.0."
assert kreditindexek([("A", 4, 1), ("B", 2, 1)]) == (0.0, 0.0), "Csupa bukással 0.0 és 0.0."
assert kreditindexek([]) == (0.0, 0.0), "Üres listára (0.0, 0.0), nullával osztás nélkül."
assert kreditindexek([("A", 5, 4), ("B", 3, 3)]) == (0.97, 0.97), "Kerekíts 2 tizedesre."
for rossz in ([("A", 5, 6)], [("A", 5, 0)], [("A", 0, 3)], [("A", -2, 3)], [("A", 5, 4.5)]):
    try:
        kreditindexek(rossz)
        assert False, f"Érvénytelen adatnál ({rossz}) ValueError kell."
    except ValueError:
        pass
```
