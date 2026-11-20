---
title: Mélyebben – típusok ellenőrzése
summary: Mikor derül ki egy típushiba – fordításkor vagy csak futás közben, egy ritkán futó ágban? Kacsatípusosság, erős és gyenge típusosság, egy saját futásidejű típusellenőrző a típusjelölések alapján, a None-hiba, és miért nem egész szám a True – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- miért veszélyes, hogy dinamikus nyelvben a típushiba csak **akkor** derül ki, amikor az a sor lefut,
- mi a **kacsatípusosság**, és mi a különbség az **erős** és a **gyenge** típusosság között,
- hogyan használhatod a **típusjelöléseket** ellenőrzésre is,
- hogyan kerüld el a leggyakoribb típushibát: a **None**-t.

## 1. Mikor derül ki a hiba?

Az alapleckében láttuk, hogy statikus nyelvben (C, Java) a fordító már futtatás előtt ellenőrzi a típusokat, dinamikus nyelvben (Python, JavaScript) viszont csak futás közben derül ki a hiba. Ez a gyakorlatban azt jelenti, hogy egy **ritkán futó ágban** hónapokig lapulhat egy hiba:

```python run
# Egy típushiba, amely csak egy ritka ágban jön elő
def szallitasi_dij(osszeg, orszag):
    if orszag == "HU":
        return 0 if osszeg >= 15000 else 1490
    else:
        return "Külföldre: " + 4990        # HIBA: szöveg + szám, de csak külföldi rendelésnél fut le

for rendeles in [(20000, "HU"), (8000, "HU"), (12000, "AT")]:
    try:
        print(rendeles, "→", szallitasi_dij(*rendeles))
    except TypeError as e:
        print(rendeles, "→ TypeError:", e)
```

Az első két rendelés rendben lefut – ha a fejlesztő csak magyar címmel próbálta ki, a hibát a **külföldi vásárló** találja meg élesben. Statikus nyelvben ez a kód le sem fordulna. Pythonban ezt **tesztekkel** és **típusellenőrző eszközzel** (pl. mypy, Pyright) lehet kivédeni, amely a típusjelölések alapján futtatás nélkül is átnézi a kódot.

## 2. Kacsatípusosság, erős és gyenge típusosság

„Ha úgy hápog, mint egy kacsa, akkor kacsa.” A Python nem azt nézi, **milyen típusú** egy érték, hanem hogy **tudja-e**, amit kérünk tőle. A `len()` bármivel működik, aminek van hossza:

```python run
# Kacsatípusosság: a függvény bármivel működik, ami "tudja", amit kérünk
def leghosszabb(*dolgok):
    return max(dolgok, key=len)

print(leghosszabb("alma", "körte", "szilva"))          # szövegek
print(leghosszabb([1, 2], [1, 2, 3, 4], [5]))           # listák
print(leghosszabb({"a": 1}, {"a": 1, "b": 2}))          # szótárak

# Erős típusosság: a Python nem alakít át "magától" szöveget számmá
try:
    print("3" + 4)
except TypeError as e:
    print("Python: TypeError –", e)
print("JavaScriptben ugyanez '34' lenne, PHP-ban 7 – ez a gyenge típusosság")
```

A Python **dinamikus**, de **erős** típusosságú: a típus futás közben dől el, de nem keveri össze csendben a szöveget és a számot. A JavaScript dinamikus és **gyenge**: a `"3" + 4` eredménye `"34"`, a `"3" * 4` pedig `12` – ez kényelmes, de rengeteg rejtett hiba forrása. A két tengely független: a C statikus, de elég gyenge (a karakter szám is egyben).

## 3. Típusjelölések: dokumentáció és ellenőrzés

A típusjelölés (`def f(x: int) -> str`) futáskor alapból **semmit sem csinál**, csak dokumentál, és az eszközök (szerkesztő, mypy) használják. De ki is olvashatjuk, és írhatunk belőle saját ellenőrzőt:

```python run
# Saját futásidejű ellenőrző a típusjelölések alapján (dekorátorral)
import inspect
from typing import get_type_hints

def tipusellenorzes(fuggveny):
    jelolesek = get_type_hints(fuggveny)
    alairas = inspect.signature(fuggveny)

    def burkolo(*args, **kwargs):
        for nev, ertek in alairas.bind(*args, **kwargs).arguments.items():
            vart = jelolesek.get(nev)
            if vart and not isinstance(ertek, vart):          # a jelölt típust ellenőrizzük
                raise TypeError(f"{nev}: {vart.__name__} kellene, de {type(ertek).__name__} jött")
        return fuggveny(*args, **kwargs)
    return burkolo

@tipusellenorzes
def atlag(osszeg: float, darab: int) -> float:
    return osszeg / darab

print(atlag(17.5, 5))
try:
    atlag(17.5, "5")
except TypeError as e:
    print("TypeError:", e)
```

A `@tipusellenorzes` sor egy **dekorátor**: becsomagolja a függvényt, és minden hívás előtt ellenőriz. Valódi projektekben erre kész könyvtárak vannak (pl. a pydantic az űrlapokból és API-kból érkező adatokat így validálja). A tanulság: a típusjelölés ingyen dokumentáció, és ha kell, ellenőrzés is lehet belőle.

## 4. None: a leggyakoribb típushiba

A `None` azt jelenti: „nincs érték”. A gond az, hogy egy függvény **néha** ad vissza `None`-t (pl. ha nem talált semmit), és a hívó elfelejti ezt kezelni. A null hivatkozás feltalálója, Tony Hoare később „milliárd dolláros hibának” nevezte:

```python run
# A None-hiba és két megoldása: ellenőrzés vagy alapérték
from typing import Optional

arlista = {"kenyér": 650, "tej": 420}

def ar(termek: str) -> Optional[int]:        # Optional: int VAGY None
    return arlista.get(termek)               # nem létező terméknél None

kosar = ["kenyér", "tej", "kakaó"]
try:
    print("végösszeg:", sum(ar(t) for t in kosar))
except TypeError as e:
    print("TypeError:", e)

# 1. megoldás: kezeljük a hiányt kifejezetten
hianyzo = [t for t in kosar if ar(t) is None]
print("nincs ára:", hianyzo, "| végösszeg a többire:", sum(ar(t) for t in kosar if ar(t) is not None))

# 2. megoldás: értelmes alapérték (csak ha a 0 tényleg helyes jelentés!)
print("végösszeg alapértékkel:", sum(arlista.get(t, 0) for t in kosar))
```

Az `Optional[int]` jelölés azt üzeni a hívónak (és a típusellenőrzőnek): „ez lehet `None` is, kezeld!”. A mypy szól is, ha valaki ellenőrzés nélkül összeadja. Fontos: az alapérték (`get(t, 0)`) csak akkor jó, ha a 0 tényleg értelmes – egy hiányzó árnál inkább hibát kell jelezni, mint ingyen odaadni a kakaót.

| Nézőpont              | Statikus típusosság                              | Dinamikus típusosság                        |
| --------------------- | ------------------------------------------------ | ------------------------------------------- |
| **kezdő programozó**  | több gépelés, szigorú szabályok                  | gyorsan lehet kísérletezni                  |
| **nagy kódbázis**     | a fordító sok hibát elkap, biztonságos átnevezés | tesztek és típusjelölések nélkül kockázatos |
| **szerkesztőprogram** | pontos kódkiegészítés                            | jelölésekkel majdnem ugyanolyan jó          |
| **végfelhasználó**    | kevesebb élesben előjövő típushiba               | a ritka ágak hibái élesben derülhetnek ki   |

## Összefoglalás

- Dinamikus nyelvben a típushiba csak akkor derül ki, amikor a sor lefut; ezt tesztek és típusellenőrzők védik ki.
- A Python kacsatípusos, dinamikus, de erős típusosságú: nem keveri csendben a szöveget és a számot.
- A típusjelölés dokumentál, és kiolvasható – akár futásidejű ellenőrzés is építhető rá.
- A `None` a leggyakoribb típushiba forrása; az `Optional` jelzi, hogy kezelni kell.

## A lecke feladata: típusbiztos összegzés

Írd meg a `szamok_osszege(elemek)` függvényt, amely összeadja a lista elemeit, de csak akkor, ha mindegyik `int` vagy `float`! Ha bármelyik más típusú, dobjon `TypeError`-t. Figyelem: Pythonban a `True` és `False` is `int`-nek számít (`isinstance(True, int)` igaz), de ezeket most **ne** fogadd el – az `isinstance(x, bool)` ellenőrzéssel szűrheted ki őket.

```python starter required
def szamok_osszege(elemek):
    return sum(elemek)


print(szamok_osszege([1, 2.5, 3]))
```

<details>
<summary>Megoldás</summary>

```python solution
def szamok_osszege(elemek):
    for x in elemek:
        if isinstance(x, bool) or not isinstance(x, (int, float)):
            raise TypeError(f"nem szám: {x!r}")
    return sum(elemek)


print(szamok_osszege([1, 2.5, 3]))
```

</details>

```python test
assert szamok_osszege([1, 2.5, 3]) == 6.5, "1 + 2.5 + 3 = 6.5"
assert szamok_osszege([]) == 0, "üres listára 0"
for rossz in ([1, "2"], [True, 2], [None]):
    try:
        szamok_osszege(rossz)
        assert False, f"{rossz} esetén TypeError kell"
    except TypeError:
        pass
```
