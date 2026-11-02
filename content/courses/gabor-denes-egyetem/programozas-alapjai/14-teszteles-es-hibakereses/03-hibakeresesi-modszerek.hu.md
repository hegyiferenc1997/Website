---
title: Hibakeresési módszerek és eszközök
summary: Rendszeres hibakeresés lépésről lépésre: reprodukálás, kiírás, naplózás, debugger töréspontokkal, gumikacsa-módszer.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a **rendszeres hibakeresés** lépéseit,
- a **kiírásos** hibakeresést és a **naplózást**,
- hogyan használod a **debuggert** (töréspont, léptetés, változók figyelése),
- egyéb bevált módszereket: **gumikacsa**, **felezés**.

## A hibakeresés lépései

A **hibakeresés** (debugging) a hiba okának megtalálása és kijavítása. Ne találgass – haladj rendszeresen:

1. **Reprodukáld** a hibát: milyen bemenetre, milyen lépések után jelentkezik? Ha nem tudod megismételni, nem tudod ellenőrizni a javítást sem.
2. **Olvasd el** a hibaüzenetet (alulról felfelé): típus, fájl, sor.
3. **Szűkítsd** a helyet: melyik függvényben, melyik sorban romlik el az adat?
4. **Állíts fel hipotézist** („szerintem az index eggyel elcsúszik”), és **ellenőrizd**.
5. **Javítsd** a hibát – az okát, ne csak a tünetét.
6. **Írj tesztet** rá, hogy soha többé ne jöjjön vissza.

## 1. Kiírásos hibakeresés

A legegyszerűbb eszköz: írasd ki a köztes értékeket. Az f-string `=` jelölése kiírja a kifejezést és az értékét is.

```python run
def atlag_felett(szamok):
    atlag = sum(szamok) / len(szamok)
    print(f"DEBUG {atlag=}")                 # köztes érték
    eredmeny = [x for x in szamok if x > atlag]
    print(f"DEBUG {eredmeny=}")
    return eredmeny

atlag_felett([3, 8, 5, 10])
```

> A hibakereső `print` sorokat javítás után **töröld**! Tartósan maradó üzenetekhez naplózást használj.

## 2. Naplózás

A `logging` modul szintekkel dolgozik (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`), így a részletes üzenetek egy kapcsolóval ki-be kapcsolhatók, és fájlba is írhatók.

```python run
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                    format="%(levelname)-7s %(funcName)s: %(message)s")

def oszt(a, b):
    logging.debug("oszt hívás: a=%s, b=%s", a, b)
    if b == 0:
        logging.error("Nullával osztás kísérlete!")
        return None
    return a / b

oszt(10, 2)
oszt(1, 0)
```

## 3. Debugger

A **debugger** (hibakereső) lehetővé teszi, hogy a programot **megállítsd** egy adott soron, és lépésenként haladj, közben figyelve a változók értékét.

Alapfogalmak:

| Fogalom                    | Jelentés                                                   |
| -------------------------- | ---------------------------------------------------------- |
| **töréspont** (breakpoint) | ennél a sornál megáll a program                            |
| **Step Over** (F10)        | végrehajtja az aktuális sort, a függvényhívásba nem lép be |
| **Step Into** (F11)        | belép a meghívott függvénybe                               |
| **Step Out** (Shift+F11)   | befejezi az aktuális függvényt, és visszatér a hívóhoz     |
| **Continue** (F5)          | fut a következő töréspontig                                |
| **Watch / Variables**      | a változók aktuális értékei                                |
| **Call Stack**             | a hívási verem: melyik függvény hívta melyiket             |

**VS Code-ban:**

1. Kattints a sor száma mellé balra – megjelenik egy piros pötty (töréspont).
2. Nyomd meg az **F5**-öt, és válaszd a _Python Debugger_ lehetőséget.
3. A program megáll a törésponton; bal oldalt látod a változókat, fent a léptető gombokat.

**Kódból** is megállíthatod a programot a beépített `breakpoint()` hívással – ez elindítja a Python parancssori hibakeresőjét (`pdb`):

```python
def fizetendo(ar, darab, kedvezmeny):
    osszeg = ar * darab
    breakpoint()           # itt megáll: p osszeg (kiírás), n (következő sor), c (folytatás), q (kilépés)
    return osszeg * (1 - kedvezmeny)
```

## 4. Gumikacsa-módszer

Magyarázd el a kódot **sorról sorra** valakinek – akár egy gumikacsának az asztalodon. Miközben hangosan elmondod, mit _kellene_ csinálnia egy sornak, gyakran rájössz, hogy valójában mást csinál. Meglepően hatékony!

## 5. Felezéses keresés

Ha nem tudod, hol romlik el az adat, **felezd meg** a kódot: írasd ki az értéket a közepén. Ha ott még jó, a hiba a második felében van, ha már rossz, az elsőben. Néhány lépésben megtalálod a hibás sort. Ugyanez működik verziókezelésben is: a `git bisect` megkeresi, melyik módosítás hozta be a hibát.

## Gyakori hibák, amiket érdemes először ellenőrizni

| Tünet                         | Gyakori ok                                     |
| ----------------------------- | ---------------------------------------------- |
| eggyel több/kevesebb elem     | `range(n)` vs. `range(n + 1)`, `<` vs. `<=`    |
| a függvény `None`-t ad        | lemaradt a `return`                            |
| a lista „magától” megváltozik | két név ugyanarra a listára mutat (`b = a`)    |
| a feltétel sosem teljesül     | szöveg és szám összehasonlítása (`"5" == 5`)   |
| végtelen ciklus               | a ciklusváltozó nem változik                   |
| `UnboundLocalError`           | a függvényben értéket adsz egy globális névnek |

## Összefoglalás

- Hibakeresés: **reprodukálás → hibaüzenet → szűkítés → hipotézis → javítás → teszt**.
- Eszközök: `print(f"{x=}")`, `logging`, **debugger** (töréspont, Step Over/Into/Out, változók), `breakpoint()`.
- Módszerek: gumikacsa, felezés (`git bisect`).

## A lecke feladata: Keresd meg a hibákat a mediánban

A `median(szamok)` függvény a számok mediánját (a rendezett sor középső elemét; páros darabszámnál a két középső átlagát) adná vissza – de **három hiba** van benne. Használd a lecke módszereit: futtasd különböző bemenetekkel, írj ki köztes értékeket (`print`), és gondold végig lépésenként!

Tippek, mit érdemes kipróbálni: rendezetlen listát, páros hosszú listát, és nézd meg a hívás után az eredeti listát is.

A javított függvény üres listára dobjon `ValueError`-t.

```python starter required
def median(szamok):
    szamok.sort()
    n = len(szamok)
    kozep = n // 2
    if n % 2 == 1:
        return szamok[kozep]
    return (szamok[kozep] + szamok[kozep + 1]) / 2


adat = [7, 1, 5, 3]
print(median(adat), adat)   # 4.0 [7, 1, 5, 3] kellene
```

<details>
<summary>Megoldás</summary>

```python solution
def median(szamok):
    if not szamok:
        raise ValueError("Üres listának nincs mediánja.")
    rendezett = sorted(szamok)     # az eredeti lista ne változzon
    n = len(rendezett)
    kozep = n // 2
    if n % 2 == 1:
        return rendezett[kozep]
    return (rendezett[kozep - 1] + rendezett[kozep]) / 2


adat = [7, 1, 5, 3]
print(median(adat), adat)   # 4.0 [7, 1, 5, 3]
```

</details>

```python test
adat = [7, 1, 5, 3]
assert median(adat) == 4.0, "[7, 1, 5, 3] mediánja (3 + 5) / 2 = 4.0 – melyik két elem a középső?"
assert adat == [7, 1, 5, 3], "A függvény nem rendezheti át az eredeti listát (sort helyett sorted)."
assert median([3, 9, 1]) == 3, "[3, 9, 1] mediánja 3."
assert median([10, 20]) == 15, "[10, 20] mediánja 15."
assert median([4]) == 4, "Egyelemű lista mediánja maga az elem."
try:
    median([])
    assert False, "Üres listánál ValueError kell (nem IndexError)."
except ValueError:
    pass
```
