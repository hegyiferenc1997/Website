---
title: Gyakorlás – szoftverfejlesztés
summary: Ellenőrző kérdések és összefoglaló feladatlap az életciklusról, a fejlesztési modellekről és a tesztelésről.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Írj két funkcionális és két nem funkcionális követelményt egy egyetemi menza rendelőalkalmazásához!</summary>

Funkcionális: „A hallgató előre megrendelheti a heti ebédjét.” „A menza dolgozója láthatja a napi rendelések listáját.” Nem funkcionális: „Délben 2000 egyidejű felhasználót kiszolgál.” „Mobilon és asztali gépen is használható, akadálymentes.”

</details>

<details>
<summary>2. Miért nem jó a vízesésmodell egy új mobilalkalmazáshoz, amelynek a piaca még bizonytalan?</summary>

Mert a felhasználói igények menet közben derülnek ki és változnak; a vízesésnél csak a végén látnák a terméket. Agilis módszerrel kéthetente kipróbálható változat készül, és a visszajelzés alapján lehet irányt váltani.

</details>

<details>
<summary>3. Milyen határeseteket tesztelnél egy `atlag(lista)` függvénynél?</summary>

Üres lista, egyelemű lista, negatív számok, tört számok, nagyon hosszú lista, és hogy nem módosítja-e a bemeneti listát.

</details>

```python run
# Teszteljük a lista legnagyobb elemét kereső függvényt határesetekkel is
def legnagyobb(lista):
    if not lista:
        return None
    m = lista[0]
    for x in lista:
        if x > m:
            m = x
    return m

assert legnagyobb([3, 9, 2]) == 9
assert legnagyobb([-5, -2, -8]) == -2   # csak negatívak
assert legnagyobb([7]) == 7             # egy elem
assert legnagyobb([]) is None           # üres lista
print("Minden teszt átment.")
```

## Összefoglaló feladatlap

```quiz required
? Mi az SDLC második fázisa a követelmények után?
- tesztelés
+ tervezés
- karbantartás
- üzembe helyezés
! Követelmények → tervezés → megvalósítás → tesztelés → üzembe helyezés → karbantartás.

? Hogy hívják a Scrum egy 1–4 hetes fejlesztési ciklusát?
= sprint
! A végén egy kipróbálható termékváltozat van.

? Melyik tesztszintet végzi a megrendelő?
- egységteszt
- integrációs teszt
- rendszerteszt
+ elfogadási teszt
! Azt nézi, azt kapta-e, amit kért.

? Mit ad vissza a fenti `legnagyobb` függvény a `[-5, -2, -8]` listára?
= -2
! A negatív számok közül a −2 a legnagyobb.

? Melyik felhasználói történet formája helyes?
+ Hallgatóként szeretném letölteni a jegyzeteket, hogy offline is tanulhassak.
- Az adatbázis legyen PostgreSQL.
- A gomb legyen kék.
- Írjunk sok kódot.
! Szerep – igény – cél.

? Mi a CD a CI/CD-ben?
+ folyamatos szállítás/telepítés (Continuous Delivery/Deployment)
- kompaktlemez
- kódáttekintés
- központi dokumentáció
! A tesztelt változat automatikusan kiadható.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Jegyszámoló határértékekkel.** Írd meg a `jegy(pont)` függvényt (0–100 pont): 85-től 5, 70-től 4, 60-tól 3, 50-től 2, alatta 1! Ha a pontszám 0 és 100 között kívül esik, dobjon `ValueError`-t.

```python starter
def jegy(pont):
    if pont > 85: return 5
    if pont > 70: return 4
    if pont > 60: return 3
    if pont > 50: return 2
    return 1
```

<details>
<summary>Megoldás</summary>

```python solution
def jegy(pont):
    if not 0 <= pont <= 100:
        raise ValueError("érvénytelen pontszám")
    for hatar, j in [(85, 5), (70, 4), (60, 3), (50, 2)]:
        if pont >= hatar:                     # a határ már a jobb jegyet adja
            return j
    return 1
```

</details>

```python test
for p, v in [(0, 1), (49, 1), (50, 2), (60, 3), (69, 3), (70, 4), (85, 5), (100, 5)]:
    assert jegy(p) == v, f"{p} pontra {v} kellene"
try:
    jegy(101)
    assert False, "ValueError kellett volna"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

**2.** **Hibák költsége.** Írd meg a `javitasi_ora(hibak, szorzo)` függvényt, amely egy `{fázis sorszáma (1-től): hibák száma}` szótárból kiszámolja az összes javítási órát, ha az 1. fázisban egy hiba 1 óra, és fázisonként `szorzo`-szorosára drágul!

```python starter
def javitasi_ora(hibak, szorzo):
    return sum(db * szorzo for db in hibak.values())
```

<details>
<summary>Megoldás</summary>

```python solution
def javitasi_ora(hibak, szorzo):
    return sum(db * szorzo ** (fazis - 1) for fazis, db in hibak.items())   # 1, s, s², ...
```

</details>

```python test
assert javitasi_ora({4: 40}, 3) == 1080
assert javitasi_ora({2: 20, 4: 20}, 3) == 600
assert javitasi_ora({1: 5, 5: 1}, 2) == 21
print("Minden ellenőrzés sikeres!")
```

**3.** **Ág-lefedettség.** Írd meg a `lefedettseg(osszes_ag, lefutott)` függvényt, amely két listából (az összes ág neve és a tesztek alatt lefutott ágak neve – ismétlődhet) megadja a lefedettséget százalékban (1 tizedesre)!

```python starter
def lefedettseg(osszes_ag, lefutott):
    return round(100 * len(lefutott) / len(osszes_ag), 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def lefedettseg(osszes_ag, lefutott):
    egyedi = set(lefutott) & set(osszes_ag)        # minden ág csak egyszer számít
    return round(100 * len(egyedi) / len(osszes_ag), 1)
```

</details>

```python test
assert lefedettseg(["a", "b", "c", "d"], ["a", "b", "a", "c"]) == 75.0
assert lefedettseg(["a", "b", "c"], []) == 0.0
assert lefedettseg(["x", "y", "z"], ["x", "y", "z", "x"]) == 100.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a nem funkcionális követelmény?
- „A felhasználó jelszót tud változtatni.”
+ „Az oldal 2 másodpercen belül betöltődik 1000 egyidejű felhasználónál is.”
- „A rendszer PDF-számlát készít.”
- „Az admin törölhet felhasználót.”
! A nem funkcionális követelmény a minőségről szól (sebesség, biztonság).

? Hány perc egy Scrum sprint napi megbeszélése (daily) legfeljebb?
= 15
! Rövid, állva is tartható egyeztetés.

? Mi az egységteszt?
+ egyetlen kis kódrész (pl. függvény) automatikus ellenőrzése elszigetelten
- a teljes rendszer kipróbálása a megrendelővel
- a kód formázásának ellenőrzése
- a szerver terheléses tesztje
! Gyors, és pontosan megmutatja, hol a hiba.

? Mit jelent a CI/CD-ben a CD?
- kódáttekintés
+ folyamatos szállítás/telepítés: a tesztelt változtatás automatikusan kiadható vagy kikerül
- kódolási szabvány
- központi dokumentáció
! A CI ellenőriz, a CD szállít.
```
