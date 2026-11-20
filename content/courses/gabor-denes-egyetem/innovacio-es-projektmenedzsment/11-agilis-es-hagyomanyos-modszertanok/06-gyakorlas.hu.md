---
title: Gyakorlás – agilis és hagyományos
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenegyedik témakörhöz.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. „Az agilis azt jelenti, hogy nincs terv és nincs dokumentáció.” Igaz?</summary>

Nem. Az agilis csapatok is terveznek (termék-backlog, sprinttervezés, kiadási terv), csak rövidebb távra és folyamatosan. Dokumentáció is készül, csak „épp elég”, és a működő szoftvert tartják fontosabbnak.

</details>

<details>
<summary>2. Mi a különbség a sprint-áttekintés és a sprint-retrospektív között?</summary>

Az áttekintésen (review) a **terméket** nézik meg az érintettekkel (mi készült el, mi a visszajelzés). A retrospektíven a csapat a **saját működését** vizsgálja (hogyan dolgoztunk, mit javítunk).

</details>

<details>
<summary>3. Egy Kanban-táblán a „Teszt” oszlopban mindig sok kártya áll. Mit jelez ez, és mit tennél?</summary>

Szűk keresztmetszetet: a tesztelés nem bírja az ütemet. Megoldás: WIP-limit a fejlesztésre (ne termeljünk több félkész munkát), a fejlesztők segítsenek a tesztelésben, automatizált tesztek.

</details>

<details>
<summary>4. Egy bank új mobilbank-funkciót fejleszt, de a felügyeleti hatóság szigorú dokumentációt kér. Milyen megközelítést javasolnál?</summary>

Hibridet: a szabályozási követelményeket és a mérföldköveket hagyományosan kezelik (dokumentáció, jóváhagyások), a felhasználói felület és a funkciók fejlesztése agilis sprintekben folyik, gyakori felhasználói visszajelzéssel.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik **nem** Scrum-esemény?
- sprinttervezés
- napi Scrum
- sprint-retrospektív
+ fáziskapu-felülvizsgálat
! A fáziskapu a hagyományos módszerek eleme.

? Melyik Scrum-szerep a „szolgáló vezető”, aki az akadályokat elhárítja?
- Product Owner
+ Scrum Master
- fejlesztők
- szponzor
! A Scrum Master támogatja a csapatot.

? Mi a Scrum inkrementum vállalása?
- a termékcél
- a sprintcél
+ a „kész” definíciója (Definition of Done)
- a sebesség
! Az inkrementumnak meg kell felelnie a „kész” definíciójának.

? Egy csapat sebessége átlagosan 25 pont. A kiadásig 8 sprint van hátra, a backlogban 230 pont. Hány pont **nem** fér bele?
= 30
= 30 pont
! 8 · 25 = 200; 230 − 200.

? Egy Kanban-rendszerben az átlagos átfutási idő 4 nap, az áteresztőképesség napi 3 feladat. Little törvénye szerint átlagosan hány feladat van folyamatban?
= 12
! WIP = átfutási idő · áteresztőképesség = 4 · 3.

? A V-modellben melyik teszt ellenőrzi, hogy az **egyes modulok együttműködnek**?
- egységteszt
+ integrációs teszt
- elfogadási teszt
- sprint-áttekintés
! Az architektúratervhez tartozó szint.

? Melyik érték szerepel az Agilis kiáltványban?
+ megrendelővel való együttműködés a szerződéses tárgyalással szemben
- dokumentáció a működő szoftverrel szemben
- folyamatok az egyénekkel szemben
- terv követése a változásra való reagálással szemben
! A bal oldali tételt becsülik többre.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Little törvénye.** Írd meg az `atfutas(wip, atereszto)` függvényt (átlagos átfutási idő 1 tizedesre) és a `szukseges_wip(cel_atfutas, atereszto)` függvényt, amely megadja, legfeljebb mekkora WIP mellett teljesül a kívánt átfutási idő!

```python starter
def atfutas(wip, atereszto):
    return round(wip * atereszto, 1)

def szukseges_wip(cel_atfutas, atereszto):
    return cel_atfutas / atereszto
```

<details>
<summary>Megoldás</summary>

```python solution
def atfutas(wip, atereszto):
    return round(wip / atereszto, 1)       # átfutás = WIP / áteresztőképesség

def szukseges_wip(cel_atfutas, atereszto):
    return cel_atfutas * atereszto         # ugyanaz a képlet átrendezve
```

</details>

```python test
assert atfutas(12, 4) == 3.0
assert atfutas(30, 5) == 6.0
assert szukseges_wip(2, 5) == 10
print("Minden ellenőrzés sikeres!")
```

**2.** **Burndown.** Írd meg az `idealis(vallalas, napok)` függvényt, amely a 0. naptól a `napok`-adik napig megadja az ideális hátralévő munkát (1 tizedesre, listában), és a `lemaradas(vallalas, hatralevo, kuszob)` függvényt, amely azokat a napokat adja vissza, amikor a tényleges hátralévő munka legalább `kuszob` ponttal az ideális fölött van! (`hatralevo[0]` a 0. nap.)

```python starter
def idealis(vallalas, napok):
    return [round(vallalas * (1 - nap / napok), 1) for nap in range(napok)]

def lemaradas(vallalas, hatralevo, kuszob):
    return [nap for nap, h in enumerate(hatralevo) if h > vallalas / 2]
```

<details>
<summary>Megoldás</summary>

```python solution
def idealis(vallalas, napok):
    return [round(vallalas * (1 - nap / napok), 1) for nap in range(napok + 1)]   # a 0. naptól az utolsóig

def lemaradas(vallalas, hatralevo, kuszob):
    ideal = idealis(vallalas, len(hatralevo) - 1)
    return [nap for nap, h in enumerate(hatralevo) if h - ideal[nap] >= kuszob]
```

</details>

```python test
assert idealis(40, 4) == [40.0, 30.0, 20.0, 10.0, 0.0]
assert lemaradas(40, [40, 38, 38, 33, 30, 30, 24, 18, 13, 6, 0], 6) == [2, 4, 5, 6, 7]
assert lemaradas(20, [20, 15, 10, 5, 0], 1) == []
print("Minden ellenőrzés sikeres!")
```

**3.** **Hány sprint kell?** Írd meg a `sprintek(backlog, sebessegek)` függvényt, amely a `(az átlag alapján, a legrosszabb sprint alapján, a legjobb sprint alapján)` szükséges sprintszámokat adja vissza! Csak egész sprint létezik, ezért felfelé kerekíts.

```python starter
def sprintek(backlog, sebessegek):
    atlag = sum(sebessegek) / len(sebessegek)
    return (round(backlog / atlag), round(backlog / min(sebessegek)), round(backlog / max(sebessegek)))
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def sprintek(backlog, sebessegek):
    atlag = sum(sebessegek) / len(sebessegek)
    return (math.ceil(backlog / atlag),            # egy félig kész sprint is egész sprint
            math.ceil(backlog / min(sebessegek)),
            math.ceil(backlog / max(sebessegek)))
```

</details>

```python test
assert sprintek(120, [18, 22, 15, 25, 20, 19]) == (7, 8, 5)
assert sprintek(90, [18]) == (5, 5, 5)
assert sprintek(100, [30, 40]) == (3, 4, 3)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hány értéket tartalmaz az Agilis kiáltvány?
= 4
! Például: egyének és interakciók a folyamatok és eszközök helyett.

? Ki felel a Scrumban a Product Backlog tartalmáért és sorrendjéért?
- a Scrum Master
+ a Product Owner (terméktulajdonos)
- a fejlesztők
- a szponzor
! A terméktulajdonos maximalizálja a termék értékét.

? Egy csapat hetente 6 jegyet fejez be, és legfeljebb 2 hetes átfutást szeretne. Mekkora lehet a WIP-korlát?
= 12
! $2 \cdot 6 = 12$.

? Mit mutat a V-modell?
+ hogy a fejlesztés minden szintjéhez (követelmény, terv, kód) egy megfelelő tesztszint tartozik
- a sprintek sorrendjét
- a Kanban-tábla oszlopait
- a csapat fejlődési szakaszait
! Pl. a követelményekhez az elfogadási teszt tartozik.
```
