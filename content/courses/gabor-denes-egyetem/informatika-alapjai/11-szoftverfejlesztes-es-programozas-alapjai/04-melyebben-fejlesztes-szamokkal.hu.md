---
title: Mélyebben – szoftverfejlesztés számokkal
summary: Mennyibe kerül egy hiba a különböző fázisokban, vízesés kontra iteratív fejlesztés a leszállított érték szemszögéből, határérték-tesztelés és ekvivalencia-osztályok, tesztlefedettség mérése, valamint egy CI-folyamat lépései szimulációval – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- miért **olcsóbb** egy hibát korán megtalálni, mint későn,
- hogyan hasonlítható össze a vízesés és az iteratív fejlesztés a **leszállított érték** alapján,
- hogyan válassz **jó teszteseteket** (határértékek, ekvivalencia-osztályok),
- mit mér a **tesztlefedettség**, és mit csinál egy **CI**-folyamat.

## 1. Mennyibe kerül egy hiba?

Egy félreértett követelményt a tervezésnél egy beszélgetéssel ki lehet javítani. Ha csak az éles rendszerben derül ki, akkor újra kell tervezni, kódolni, tesztelni, kiadni – és közben a felhasználók is szenvednek. Egy gyakran idézett ökölszabály szerint a javítás költsége fázisról fázisra **többszörösére** nő (a pontos szorzó projektenként nagyon eltér, de a tendencia egyértelmű):

```python run
# Egy hiba javításának relatív költsége a felfedezés fázisa szerint (szemléltető szorzókkal)
fazisok = ["követelmények", "tervezés", "kódolás", "tesztelés", "éles üzem"]
szorzo = 3                                   # feltevés: fázisonként háromszoros költség
alap_ora = 1                                 # 1 óra, ha a követelményeknél derül ki

for i, f in enumerate(fazisok):
    print(f"{f:<14} {alap_ora * szorzo ** i:>4} óra")

# egy projektben 40 hiba: mennyit spórol, ha a felét már a tervezésnél megtalálják?
kesoi = 40 * alap_ora * szorzo ** 3                              # mind a tesztelésnél derül ki
korai = 20 * alap_ora * szorzo ** 1 + 20 * alap_ora * szorzo ** 3
print(f"\nmind a tesztelésnél: {kesoi} óra, felük már a tervezésnél: {korai} óra")
```

```plot
title: Egy hiba javításának relatív költsége a fázis sorszámának függvényében
x: 1, 5
y: 0, 100
param: s = 3, 1.5, 5, 0.5
f: s^(x - 1) # fázisonként s-szeres költség
```

Ezért éri meg a **kódáttekintés**, a **tervek közös átbeszélése** és a minél korábbi **automatikus teszt** – ezek a hibákat a görbe elején fogják meg. A csúszkával a szorzót állíthatod: még egy szerény, másfélszeres növekedésnél is ötszörös a különbség az első és az utolsó fázis között.

## 2. Vízesés vagy iteratív? A leszállított érték

Az alapleckében láttuk a két megközelítést. Nézzük meg őket a **megrendelő nézőpontjából**: mikor kap használható szoftvert? Egy 10 hónapos projektben a vízesésnél minden a végén érkezik; iteratív fejlesztésnél havonta egy-egy működő részt kap meg, a legfontosabbakat előbb:

```python run
# Leszállított érték havonta: vízesés vs. iteratív fejlesztés (10 hónap, 10 funkció)
ertekek = [30, 20, 12, 10, 8, 6, 5, 4, 3, 2]       # a funkciók értéke, fontossági sorrendben (összesen 100)

vizeses, iterativ = [], []
for honap in range(1, 11):
    vizeses.append(100 if honap == 10 else 0)       # minden a végén
    iterativ.append(sum(ertekek[:honap]))           # havonta egy funkció, a legfontosabb előbb

print("hónap  vízesés  iteratív")
for h, v, i in zip(range(1, 11), vizeses, iterativ):
    print(f"{h:>5} {v:>8} {i:>9}")

# mi van, ha a projekt pénze a 6. hónapban elfogy?
print(f"\nleállás a 6. hónap után: vízesés {vizeses[5]}%, iteratív {iterativ[5]}% értéket ad")
```

Ha a projektet idő előtt leállítják (elfogy a pénz, megváltozik a piac), a vízesésnél a megrendelő **semmit** sem kap, az iteratív fejlesztésnél a 6. hónapig már az érték 86%-át. Ráadásul a korai visszajelzés alapján menet közben lehet **irányt váltani**. A vízesésnek is van helye: ha a követelmények stabilak és jól ismertek (pl. egy szabvány szerinti vezérlés, egy szerződésben rögzített rendszer), az előre megtervezett lépések kiszámíthatóbbak.

## 3. Jó tesztesetek: határértékek és ekvivalencia-osztályok

Nem lehet minden bemenetet kipróbálni. Két bevált ötlet:

- **ekvivalencia-osztályok**: a bemeneteket csoportokra bontjuk, amelyeken belül a program „ugyanúgy” viselkedik, és mindegyikből választunk egy-egy esetet,
- **határérték-elemzés**: a hibák nagy része a csoportok **határán** van (`<` helyett `<=`), ezért a határokat és szomszédaikat mindig teszteljük.

Példa: egy jegyszámoló függvény a pontszámból (0–100) ad jegyet; 50 alatt elégtelen, 50-től elégséges, …, 85-től jeles:

```python run
# Határérték-tesztelés: egy szándékosan hibás és egy helyes jegyszámoló
def jegy_hibas(pont):
    if pont > 85: return 5                   # HIBA: >= kellene
    if pont >= 70: return 4
    if pont >= 60: return 3
    if pont >= 50: return 2
    return 1

def jegy(pont):
    if not 0 <= pont <= 100:
        raise ValueError("a pontszám 0 és 100 között lehet")
    for hatar, j in [(85, 5), (70, 4), (60, 3), (50, 2)]:
        if pont >= hatar:
            return j
    return 1

# tesztesetek: minden határ, alatta és felette egy-egy érték
esetek = [(0, 1), (49, 1), (50, 2), (59, 2), (60, 3), (69, 3), (70, 4), (84, 4), (85, 5), (100, 5)]
for f in (jegy_hibas, jegy):
    hibak = [(p, f(p), vart) for p, vart in esetek if f(p) != vart]
    print(f"{f.__name__:<11} hibás esetek: {hibak}")

# az érvénytelen bemenet is egy ekvivalencia-osztály
for rossz in (-1, 101):
    try:
        jegy(rossz)
    except ValueError as e:
        print(f"{rossz}: {e}")
```

Egy „átlagos” tesztérték (pl. 90 vagy 75) sosem találta volna meg a hibát – a 85-ös **határérték** viszont azonnal. Ugyanez a gondolkodás a biztonságban is fontos: a támadók pont a határeseteket (üres szöveg, negatív szám, nagyon hosszú bemenet) próbálják.

## 4. Tesztlefedettség és CI

A **tesztlefedettség** azt méri, a kód hány százaléka futott le a tesztek alatt. Egy egyszerű változat: hány **ág** (az `if` egyes kimenetei) futott le legalább egyszer?

```python run
# Ág-lefedettség mérése kézzel: melyik ág futott le a tesztek alatt?
lefutott = set()

def szallitasi_dij(osszeg, express):
    if osszeg >= 20000:
        lefutott.add("ingyenes"); dij = 0
    else:
        lefutott.add("fizetős"); dij = 1500
    if express:
        lefutott.add("express"); dij += 2000
    else:
        lefutott.add("normál")
    return dij

assert szallitasi_dij(25000, False) == 0
assert szallitasi_dij(5000, False) == 1500
osszes = {"ingyenes", "fizetős", "express", "normál"}
print(f"lefedettség: {len(lefutott)}/{len(osszes)} ág, kimaradt: {osszes - lefutott}")
```

A lefedettség hasznos jelzés (ami **nem** fut le teszt alatt, abban biztosan nem talál hibát a teszt), de a 100% sem garancia: egy lefutott sorban is lehet rossz a logika, ha a teszt nem ellenőrzi az eredményt.

A **CI** (folyamatos integráció) azt jelenti, hogy minden feltöltött változtatásra automatikusan lefut egy lépéssor; ha bármelyik lépés elbukik, a változtatás nem kerülhet be a fő ágba:

```python run
# Egy CI-folyamat szimulációja: a lépések sorban futnak, az első hibánál megáll
def ci(valtozas):
    lepesek = [
        ("formázás ellenőrzése", valtozas["formazott"]),
        ("statikus elemzés (lint)", valtozas["lint_hibak"] == 0),
        ("egységtesztek", valtozas["bukott_tesztek"] == 0),
        ("build", True),
    ]
    for nev, sikeres in lepesek:
        print(f"  {'✓' if sikeres else '✗'} {nev}")
        if not sikeres:
            return "ELUTASÍTVA – javítsd, és töltsd fel újra"
    return "zöld – mehet a kódáttekintésre"

print("1. változtatás:", ci({"formazott": True, "lint_hibak": 0, "bukott_tesztek": 2}))
print("2. változtatás:", ci({"formazott": True, "lint_hibak": 0, "bukott_tesztek": 0}))
```

| Nézőpont         | Mit jelent neki a tesztelés és a CI?                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| **fejlesztő**    | gyors visszajelzés, bátrabb átírás (a tesztek szólnak, ha valami elromlik)    |
| **tesztelő**     | a rutinellenőrzést a gép végzi, ő a határesetekre és a felfedezésre figyelhet |
| **megrendelő**   | kevesebb hiba élesben, kiszámíthatóbb kiadások                                |
| **csapatvezető** | idő- és költségbefektetés, amely a későbbi javításokon térül meg              |

## Összefoglalás

- Egy hiba javítása annál drágább, minél később derül ki; a kódáttekintés és a korai tesztek a görbe elején fogják meg a hibákat.
- Az iteratív fejlesztés hamarabb ad értéket és idő előtti leállásnál is használható eredményt; a vízesés stabil követelményeknél kiszámíthatóbb.
- A jó tesztesetek az ekvivalencia-osztályokból és a határértékekből jönnek.
- A tesztlefedettség jelzés, nem garancia; a CI minden változtatásra automatikusan ellenőriz.

## A lecke feladata

```quiz required
? Ha egy hiba javítása fázisonként háromszorosára drágul, hányszor drágább az 5. fázisban (éles üzem), mint az 1.-ben?
= 81
! $3^4 = 81$.

? Egy függvény 18 éves kortól enged regisztrálni. Melyik a legjobb határérték-tesztpár?
- 5 és 50
+ 17 és 18
- 0 és 100
- 25 és 30
! A hiba gyakran a határon van (`>` vagy `>=`).

? Egy függvényben 8 ág van, a tesztek alatt 6 futott le. Hány százalék az ág-lefedettség?
= 75
! $6 / 8 = 75\%$.

? Egy projekt pénze a félidőben elfogy. Melyik megközelítésnél kap a megrendelő nagyobb eséllyel használható szoftvert?
- vízesés
+ iteratív (agilis), mert addigra már működő részeket kapott, a legfontosabbakat előbb
- egyiknél sem
- mindkettőnél ugyanannyit
! Az iteratív fejlesztés folyamatosan ad értéket.

? Mi történik egy CI-folyamatban, ha az egységtesztek elbuknak?
- a változtatás automatikusan bekerül a fő ágba
+ a folyamat megáll, és a változtatás nem kerülhet be, amíg nem javítják
- a tesztek törlődnek
- semmi
! A CI a hibás változtatást kiszűri, mielőtt bekerülne.
```
