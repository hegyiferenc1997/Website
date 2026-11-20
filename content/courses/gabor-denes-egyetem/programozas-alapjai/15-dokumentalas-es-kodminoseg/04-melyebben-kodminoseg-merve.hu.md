---
title: Mélyebben – kódminőség mérve
summary: Futtatható dokumentáció doctesttel, a ciklomatikus komplexitás kiszámítása egy saját kis elemzővel, egy hosszú függvény átalakítása (refaktorálás) lépésenként, és egy mini kódellenőrző, amely hiányzó docstringet és rossz elnevezést keres – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogyan lehet a dokumentáció egyben **teszt** is (doctest),
- hogyan **mérhető** egy függvény bonyolultsága (ciklomatikus komplexitás),
- hogyan alakíts át egy nehezen olvasható függvényt **lépésenként**, a működés megváltoztatása nélkül,
- hogyan dolgoznak a **kódellenőrző** eszközök (linterek) – egy saját mini változaton.

## 1. Futtatható dokumentáció: doctest

Az alapleckében láttuk, hogy a jó docstring példát is mutat. A Python `doctest` modulja ezeket a példákat **le is futtatja**, és összeveti az eredményt a leírttal – így a dokumentáció nem tud „elavulni” anélkül, hogy kiderülne:

```python run
# Doctest: a docstringben lévő példák egyben tesztek is
import doctest

def brutto(netto, afa=27):
    """Kiszámolja a bruttó árat egész forintra kerekítve.

    >>> brutto(1000)
    1270
    >>> brutto(1000, afa=5)
    1050
    >>> brutto(0)
    0
    """
    return round(netto * (1 + afa / 100))

doctest.run_docstring_examples(brutto, {"brutto": brutto}, verbose=True)
```

Mindhárom példa átment. Ha valaki később átírja a függvényt (pl. lefelé kerekít), a doctest azonnal jelzi, hogy a dokumentáció már nem igaz. Bonyolultabb esetekre a rendes egységteszt való, de az egyszerű, „így kell használni” példákra a doctest tökéletes.

## 2. Mennyire bonyolult egy függvény? Ciklomatikus komplexitás

A **ciklomatikus komplexitás** azt számolja meg, hány független úton lehet végigmenni egy függvényen: 1 + az elágazások és ciklusok száma (`if`, `elif`, `for`, `while`, `and`, `or`, `except` …). Minél nagyobb, annál több teszt kell, és annál nehezebb megérteni. Az `ast` modullal mi is kiszámolhatjuk:

```python run
# Ciklomatikus komplexitás számolása az ast modullal
import ast

def komplexitas(forras):
    fa = ast.parse(forras)
    dontesek = (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.IfExp, ast.comprehension)
    db = 1
    for csomopont in ast.walk(fa):
        if isinstance(csomopont, dontesek):
            db += 1
        elif isinstance(csomopont, ast.BoolOp):            # minden plusz and/or egy új út
            db += len(csomopont.values) - 1
    return db

bonyolult = '''
def szallitas(osszeg, orszag, hustag, expressz):
    if orszag == "HU":
        if osszeg > 15000 and not expressz:
            return 0
        elif expressz:
            return 2990
        else:
            return 1490
    elif orszag in ("AT", "SK") or hustag:
        return 3990 if not expressz else 6990
    else:
        for _ in range(1):
            return 7990
'''

egyszeru = '''
DIJAK = {"HU": 1490, "AT": 3990, "SK": 3990}

def szallitas(osszeg, orszag):
    if orszag == "HU" and osszeg > 15000:
        return 0
    return DIJAK.get(orszag, 7990)
'''

print("bonyolult változat:", komplexitas(bonyolult))
print("egyszerű változat: ", komplexitas(egyszeru))
```

Ökölszabályként 1–10 között egy függvény jól kezelhető, 10 fölött érdemes szétbontani. A második változat nemcsak kevesebb úttal dolgozik, hanem a díjak egy **táblázatban** (szótárban) vannak: egy új ország felvétele egy sor, nem egy újabb `elif`. Az olyan eszközök, mint a radon vagy a ruff, ezt a mérést automatikusan elvégzik az egész projekten.

## 3. Refaktorálás lépésenként

A **refaktorálás** a kód belső szerkezetének javítása a működés megváltoztatása nélkül. A biztonságos módszer: előbb rögzítjük a mostani viselkedést egy teszttel, aztán kis lépésekben javítunk, és minden lépés után újra futtatjuk a tesztet:

```python run
# Refaktorálás: ugyanaz a működés, olvashatóbb szerkezet – a teszt mindkettőn átmegy
def f(l):                                      # előtte: rejtélyes nevek, varázsszámok, minden egyben
    s = 0
    for x in l:
        if x[1] >= 50:
            s += x[2] * 0.9 if x[2] > 10000 else x[2]
    return round(s)

KUSZOB_PONT = 50                               # utána: beszédes nevek, konstansok, kis függvények
KEDVEZMENY_HATAR = 10_000
KEDVEZMENY = 0.9

def kedvezmenyes_ar(ar):
    return ar * KEDVEZMENY if ar > KEDVEZMENY_HATAR else ar

def jogosult(vasarlo):
    _, pontok, _ = vasarlo
    return pontok >= KUSZOB_PONT

def jogosultak_osszkoltese(vasarlok):
    """A legalább KUSZOB_PONT pontos vásárlók kedvezményes összköltsége."""
    return round(sum(kedvezmenyes_ar(v[2]) for v in vasarlok if jogosult(v)))

adatok = [("Anna", 72, 12000), ("Béla", 30, 8000), ("Csilla", 50, 9000), ("Dani", 91, 20000)]
print("régi:", f(adatok), "| új:", jogosultak_osszkoltese(adatok))
assert f(adatok) == jogosultak_osszkoltese(adatok), "a refaktorálás nem változtathat a működésen!"
print("a viselkedés változatlan ✓")
```

Az új változat hosszabb, de **minden sora magáért beszél**: nem kell kitalálni, mi az `x[1]` vagy a `0.9`. Ha a kedvezmény holnap 15%-ra változik, egyetlen konstanst kell átírni. A kód többségét sokkal többször olvassák, mint írják – ezért az olvashatóság a legfontosabb minőségi szempont.

## 4. Egy mini kódellenőrző

A **linterek** (pl. pylint, ruff, flake8) a kódot futtatás nélkül, a szintaxisfa alapján vizsgálják, és jelzik a gyanús vagy a szabványtól eltérő részeket. Egy kis saját változat, amely a PEP 8 elnevezési szabályait és a hiányzó docstringeket keresi:

```python run
# Mini linter: hiányzó docstring és nem snake_case függvénynév keresése
import ast
import re

forras = '''
def AtlagSzamitas(jegyek):
    return sum(jegyek) / len(jegyek)

def max_ertek(lista):
    """A lista legnagyobb eleme."""
    return max(lista)

def x(a, b):
    return a * b
'''

SNAKE = re.compile(r"^[a-z_][a-z0-9_]*$")

for csomopont in ast.walk(ast.parse(forras)):
    if isinstance(csomopont, ast.FunctionDef):
        hely = f"{csomopont.lineno}. sor, {csomopont.name}()"
        if not SNAKE.match(csomopont.name):
            print(f"{hely}: a függvénynév nem snake_case")
        if ast.get_docstring(csomopont) is None:
            print(f"{hely}: hiányzik a docstring")
        if len(csomopont.name) < 3:
            print(f"{hely}: túl rövid, nem beszédes név")
```

A valódi eszközök több száz ilyen szabályt ismernek, és a szerkesztőben azonnal, gépelés közben jeleznek. Csapatmunkában a CI is lefuttatja őket minden változtatásnál: így a stílusvita nem az emberek között, hanem egy közös beállítófájlban dől el.

| Nézőpont        | Mit jelent neki a kódminőség?                                                   |
| --------------- | ------------------------------------------------------------------------------- |
| **szerző**      | fél év múlva is érti a saját kódját                                             |
| **csapattárs**  | egységes stílus, beszédes nevek, docstring – nem kell mindent megkérdezni       |
| **karbantartó** | kis függvények, alacsony komplexitás, tesztek: biztonságosan módosítható        |
| **cégvezetés**  | a rossz minőségű kód „technikai adósság”: minden új funkció egyre drágább rajta |

## Összefoglalás

- A doctest a docstring példáit tesztként futtatja, így a dokumentáció nem avul el észrevétlenül.
- A ciklomatikus komplexitás az utak számát méri; 10 fölött érdemes szétbontani a függvényt.
- A refaktorálás a működés megtartásával javít a szerkezeten – előbb teszt, aztán kis lépések.
- A linterek futtatás nélkül, a szintaxisfa alapján ellenőrzik a stílust és a gyanús részeket.

## A lecke feladata: camelCase-ből snake_case

A PEP 8 szerint a Python-függvények neve `snake_case` (kisbetűk, aláhúzással elválasztva). Írd meg a `snake_case(nev)` függvényt, amely egy camelCase vagy PascalCase nevet átalakít: minden nagybetű elé (kivéve, ha a név elején áll) tegyél aláhúzást, és az egészet alakítsd kisbetűssé! Például `"atlagSzamitas"` → `"atlag_szamitas"`, `"KosarOsszeg"` → `"kosar_osszeg"`.

```python starter required
def snake_case(nev):
    return nev.lower()


print(snake_case("atlagSzamitas"))
```

<details>
<summary>Megoldás</summary>

```python solution
def snake_case(nev):
    eredmeny = ""
    for i, c in enumerate(nev):
        if c.isupper() and i > 0:
            eredmeny += "_"
        eredmeny += c.lower()
    return eredmeny


print(snake_case("atlagSzamitas"))
```

</details>

```python test
assert snake_case("atlagSzamitas") == "atlag_szamitas", "atlagSzamitas → atlag_szamitas"
assert snake_case("KosarOsszeg") == "kosar_osszeg", "az elején álló nagybetű elé nem kell aláhúzás"
assert snake_case("maxErtekKereses") == "max_ertek_kereses", "több szó is lehet"
assert snake_case("x") == "x", "egybetűs név változatlan"
```
