---
title: Kódolási gyakorlatok a kódminőség javítására
summary: PEP 8 stílus, elnevezések, tiszta kód elvei (DRY, KISS, egy felelősség), refaktorálás, linterek és formázók.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **PEP 8** stílusirányelv legfontosabb szabályait,
- a **tiszta kód** elveit: beszédes nevek, rövid függvények, **DRY**, **KISS**, egy felelősség,
- mi a **refaktorálás**, és hogyan csinálod biztonságosan,
- milyen **eszközök** ellenőrzik automatikusan a kódminőséget.

## Mi a jó minőségű kód?

A jó kód **helyes**, **olvasható**, **egyszerű**, **tesztelhető** és **könnyen módosítható**. A minőség nem ízlés kérdése: a rossz kód lassítja a fejlesztést, és hibákat rejt.

## PEP 8 – a Python stílusirányelve

| Szabály                                      | Példa                                  |
| -------------------------------------------- | -------------------------------------- |
| behúzás: 4 szóköz (nem tabulátor)            | `····return x`                         |
| sorhossz: legfeljebb 79–99 karakter          | hosszú kifejezést zárójelen belül törj |
| változók, függvények: `snake_case`           | `hallgatok_szama`, `atlag_szamitas()`  |
| osztályok: `PascalCase`                      | `class BankSzamla:`                    |
| konstansok: `NAGY_BETU`                      | `MAX_PONT = 100`                       |
| szóköz az operátorok körül                   | `x = a + b`, nem `x=a+b`               |
| nincs szóköz a zárójelen belül               | `f(x)`, nem `f( x )`                   |
| két üres sor a függvények / osztályok között |                                        |
| importok a fájl elején, csoportosítva        | standard → külső → saját               |
| `None`-hoz `is`                              | `if x is None:`                        |

## Beszédes nevek

```python run
# Rossz nevek:
def szamol(a, b):
    c = a * b * 0.27
    return a * b + c

# Jó nevek – a kód magyarázza önmagát:
AFA_KULCS = 0.27

def brutto_vegosszeg(egysegar, darabszam):
    netto = egysegar * darabszam
    return netto * (1 + AFA_KULCS)

print(szamol(1000, 3), brutto_vegosszeg(1000, 3))
```

- Függvénynév: **ige** (`kiszamol_atlag`, `ment_fajlba`, `ervenyes_e`).
- Változónév: **főnév** (`hallgatok`, `osszeg`).
- Logikai érték: kérdés vagy állítás (`van_jogosultsag`, `ures_e`).
- Kerüld az egybetűs neveket – kivéve a rövid ciklusváltozókat (`i`, `j`) és a matematikai képleteket (`x`, `y`).

## DRY – ne ismételd önmagad

Ha ugyanaz a kód többször szerepel, egy javításnál könnyű kifelejteni az egyik példányt. Emeld ki függvénybe.

```python run
# Ismétlődő kód:
anna = [5, 4, 5]
bela = [3, 4, 2]
print("Anna átlaga:", round(sum(anna) / len(anna), 2))
print("Béla átlaga:", round(sum(bela) / len(bela), 2))

# DRY:
def atlag(jegyek):
    return round(sum(jegyek) / len(jegyek), 2)

for nev, jegyek in [("Anna", anna), ("Béla", bela)]:
    print(f"{nev} átlaga:", atlag(jegyek))
```

## KISS – maradj egyszerű

_Keep It Simple, Stupid_: a legegyszerűbb működő megoldás a legjobb. A „okos” trükkök nehezen olvashatók és javíthatók.

```python run
szam = 7

# Túlbonyolított:
paros = True if szam % 2 == 0 else False
if paros == True:
    print("páros")
else:
    print("páratlan")

# Egyszerű:
print("páros" if szam % 2 == 0 else "páratlan")
```

Rokon elv a **YAGNI** (_You Aren't Gonna Need It_): ne írj meg olyan funkciót, amire „talán egyszer szükség lesz”.

## Egy függvény – egy feladat

Egy függvény **egy dolgot** csináljon, és azt jól. Ha a neve „és”-t tartalmazna (`beolvas_es_kiszamol_es_kiir`), bontsd szét. A rövid függvény könnyebben érthető, tesztelhető és újrahasznosítható.

```python run
def beolvas(szoveg):
    """Szóközzel elválasztott számokat alakít listává."""
    return [int(x) for x in szoveg.split()]

def statisztika(szamok):
    """Visszaadja a minimumot, a maximumot és az átlagot."""
    return min(szamok), max(szamok), sum(szamok) / len(szamok)

def kiir(stat):
    legkisebb, legnagyobb, atlag = stat
    print(f"min: {legkisebb}, max: {legnagyobb}, átlag: {atlag:.2f}")

kiir(statisztika(beolvas("4 8 15 16 23 42")))
```

## Korai visszatérés a mély beágyazás helyett

```python run
# Mélyen beágyazott:
def szallitasi_dij_rossz(osszeg, orszag):
    if osszeg > 0:
        if orszag == "HU":
            if osszeg >= 20_000:
                return 0
            else:
                return 1_490
        else:
            return 4_990
    else:
        raise ValueError("Érvénytelen összeg")

# Lapos, korai visszatérésekkel (guard clause):
def szallitasi_dij(osszeg, orszag):
    if osszeg <= 0:
        raise ValueError("Érvénytelen összeg")
    if orszag != "HU":
        return 4_990
    if osszeg >= 20_000:
        return 0
    return 1_490

print(szallitasi_dij_rossz(25_000, "HU"), szallitasi_dij(25_000, "HU"), szallitasi_dij(5_000, "AT"))
```

## Refaktorálás

A **refaktorálás** a kód szerkezetének javítása **a működés megváltoztatása nélkül**: átnevezés, függvény kiemelése, ismétlődés megszüntetése, beágyazás csökkentése. Biztonságosan csak akkor csinálható, ha vannak **tesztek**, amelyek garantálják, hogy a működés nem változott.

**„Cserkészszabály”:** hagyd a kódot egy kicsit tisztábban, mint ahogy találtad.

## Automatikus eszközök

| Eszköz                   | Mit csinál                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Ruff**, Flake8, Pylint | _linter_: stílushibák és gyanús kód keresése (nem használt változó, elérhetetlen kód) |
| **Black**, Ruff format   | _formázó_: automatikusan egységes formára hozza a kódot                               |
| **mypy**                 | típusellenőrzés a típusjelölések alapján                                              |
| **pytest + coverage**    | tesztek és lefedettség                                                                |

```bash
pip install ruff
ruff check .        # hibák és stílusproblémák listája
ruff format .       # automatikus formázás
```

A VS Code-ban ezek bővítményként a gépelés közben jeleznek.

## Összefoglalás

- Kövesd a **PEP 8**-at: 4 szóköz, `snake_case`, `PascalCase`, `NAGY_BETU`, szóközök az operátorok körül.
- Elvek: **beszédes nevek**, **DRY**, **KISS**, **YAGNI**, **egy függvény – egy feladat**, korai visszatérés.
- **Refaktorálás** csak tesztek védelmében.
- Használj lintert és formázót (Ruff, Black) – a gép unalmas munkáját bízd a gépre.

## A lecke feladata: Ismétlődő kód átírása (DRY)

Valaki megírta a kiadások kategóriánkénti összesítését – háromszor ugyanazt a ciklust, három rögzített kategóriára. Ha új kategória jön, a kód hallgat róla.

Írd át a `kategoria_osszegek(tetelek)` függvényt a **DRY** („ne ismételd magad”) elv szerint! A `tetelek` `(kategória, összeg)` párok listája. A függvény adjon vissza szótárat:

- **bármilyen** kategóriára működjön (ne legyenek beégetett kategórianevek),
- a kulcsok sorrendje az első előfordulás sorrendje legyen,
- az összegeket kerekítsd 2 tizedesre (`round(..., 2)`),
- üres listára `{}` legyen az eredmény.

```python starter required
def kategoria_osszegek(tetelek):
    elelmiszer = 0
    for kategoria, osszeg in tetelek:
        if kategoria == "élelmiszer":
            elelmiszer += osszeg
    kozlekedes = 0
    for kategoria, osszeg in tetelek:
        if kategoria == "közlekedés":
            kozlekedes += osszeg
    szorakozas = 0
    for kategoria, osszeg in tetelek:
        if kategoria == "szórakozás":
            szorakozas += osszeg
    return {"élelmiszer": elelmiszer, "közlekedés": kozlekedes, "szórakozás": szorakozas}


print(kategoria_osszegek([("élelmiszer", 1200), ("közlekedés", 450), ("élelmiszer", 800)]))
```

<details>
<summary>Megoldás</summary>

```python solution
def kategoria_osszegek(tetelek):
    # Egyetlen ciklus, tetszőleges kategóriákra
    osszegek = {}
    for kategoria, osszeg in tetelek:
        osszegek[kategoria] = osszegek.get(kategoria, 0) + osszeg
    return {k: round(v, 2) for k, v in osszegek.items()}


print(kategoria_osszegek([("élelmiszer", 1200), ("közlekedés", 450), ("élelmiszer", 800)]))
```

</details>

```python test
e = kategoria_osszegek([("élelmiszer", 1200), ("közlekedés", 450), ("élelmiszer", 800)])
assert e == {"élelmiszer": 2000, "közlekedés": 450}, "Csak az előforduló kategóriák kerüljenek a szótárba."
e = kategoria_osszegek([("lakhatás", 90000), ("könyv", 4990.5), ("lakhatás", 5000)])
assert e == {"lakhatás": 95000, "könyv": 4990.5}, "Új, előre nem ismert kategóriákra is működjön."
assert list(kategoria_osszegek([("b", 1), ("a", 2), ("b", 3)])) == ["b", "a"], "A kulcsok az első előfordulás sorrendjében jöjjenek."
assert kategoria_osszegek([("x", 0.1), ("x", 0.2)]) == {"x": 0.3}, "Kerekíts 2 tizedesre."
assert kategoria_osszegek([]) == {}, "Üres listára üres szótár."
```
