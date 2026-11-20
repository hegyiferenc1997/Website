---
title: Mélyebben – projekt számokkal
summary: A kritikus út kiszámítása programmal, hárompontos (PERT) becslés és Monte Carlo-szimuláció a határidő esélyére, előrejelzés a sprintsebességből, és miért nem gyorsít mindig egy új csapattag (Brooks törvénye) – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számolja ki egy program a **kritikus utat** és a tartalékokat,
- hogyan becsülj **bizonytalan** időket, és mekkora eséllyel tartható egy határidő,
- hogyan jelezd előre a befejezést a csapat **sebességéből**,
- miért **lassíthatja** egy késésben lévő projektet az új emberek bevonása.

## 1. A kritikus út programmal

Az alapleckében kézzel számoltuk ki a kritikus utat. Egy valódi projektben több tucat feladat van – ezt már a gép csinálja. Az ötlet: minden feladat **legkorábbi befejezése** = az előfeltételei közül a legkésőbb végző befejezése + a saját időtartama. Visszafelé haladva megkapjuk a **legkésőbbi** időpontokat is; ahol a kettő egyezik, ott nincs tartalék – az a kritikus út.

```python run
# Kritikus út: előre- és visszafelé számolás, tartalékok
feladatok = {  # név: (időtartam napban, előfeltételek)
    "követelmények": (3, []),
    "adatbázis-terv": (4, ["követelmények"]),
    "felület-terv": (2, ["követelmények"]),
    "backend": (6, ["adatbázis-terv"]),
    "frontend": (5, ["felület-terv"]),
    "integráció": (2, ["backend", "frontend"]),
    "tesztelés": (3, ["integráció"]),
}

# előre: legkorábbi befejezés (a dict sorrendje már megfelel a függőségeknek)
korai = {}
for nev, (ido, elozok) in feladatok.items():
    korai[nev] = max((korai[e] for e in elozok), default=0) + ido
projekt = max(korai.values())

# vissza: legkésőbbi befejezés
kesoi = {nev: projekt for nev in feladatok}
for nev in reversed(list(feladatok)):
    for kovetkezo, (ido, elozok) in feladatok.items():
        if nev in elozok:
            kesoi[nev] = min(kesoi[nev], kesoi[kovetkezo] - ido)

print(f"a projekt hossza: {projekt} nap")
for nev in feladatok:
    tartalek = kesoi[nev] - korai[nev]
    print(f"{nev:<15} kész legkorábban: {korai[nev]:>2}. nap, tartalék: {tartalek} nap {'← KRITIKUS' if tartalek == 0 else ''}")
```

A kritikus úton lévő feladatok **minden** napnyi csúszása a projektet is késlelteti; a felület-terv és a frontend viszont 3 napot csúszhat következmények nélkül. A projektvezető **nézőpontjából** ez megmondja, hová kell a legjobb embereket és a legtöbb figyelmet tenni.

## 2. Bizonytalan becslések: PERT és Monte Carlo

„Mennyi ideig tart a backend?” – erre egy szám helyett jobb **három**: optimista ($o$), legvalószínűbb ($m$), pesszimista ($p$). A **PERT**-becslés ezekből súlyozott átlagot számol:

$$t = \frac{o + 4m + p}{6}$$

De mekkora eséllyel készül el az egész projekt egy adott határidőre? Erre a **Monte Carlo-szimuláció** a legszemléletesebb: sokszor (pl. 10 000-szer) „lejátsszuk” a projektet véletlen időtartamokkal, és megszámoljuk, hányszor fért bele:

```python run
# PERT-becslés és Monte Carlo-szimuláció egy egyszerű, egymás utáni feladatsorra
import random

random.seed(7)
feladatok = {"tervezés": (3, 4, 8), "fejlesztés": (8, 10, 20), "tesztelés": (3, 4, 9)}   # (o, m, p) napban

pert = sum((o + 4 * m + p) / 6 for o, m, p in feladatok.values())
print(f"PERT-becslés összesen: {pert:.1f} nap (a legvalószínűbbek összege csak {sum(m for _, m, _ in feladatok.values())} nap)")

futasok = 10_000
osszes = sorted(sum(random.triangular(o, p, m) for o, m, p in feladatok.values()) for _ in range(futasok))
for hatarido in [18, 21, 24, 27]:
    esely = sum(1 for t in osszes if t <= hatarido) / futasok
    print(f"határidő {hatarido} nap: {esely:.0%} eséllyel kész")
print(f"85%-os biztonsággal vállalható: {osszes[int(0.85 * futasok)]:.0f} nap")
```

A tanulság: a „legvalószínűbb” idők összege (18 nap) szinte biztosan **túl optimista**, mert a csúszások gyakran nagyobbak, mint a nyereségek (a pesszimista érték messzebb van, mint az optimista). Egy felelős vállalásnál egy **valószínűséget** is mondunk: „85%-os eséllyel 26 napon belül kész.”

## 3. Előrejelzés a sebességből

Agilis csapatoknál az alapleckében látott **sebesség** (sprintenként befejezett sztoripontok) alapján jelezhető előre a befejezés. Egyetlen átlag helyett érdemes egy **tartományt** mondani:

```python run
# Előrejelzés a sprintsebességből: hány sprint kell a maradék munkához?
from math import ceil
from statistics import mean

sebessegek = [18, 24, 21, 15, 22]          # az eddigi sprintek befejezett sztoripontjai
maradek = 130

atlag = mean(sebessegek)
print(f"átlagos sebesség: {atlag:.1f} pont → {ceil(maradek / atlag)} sprint")
print(f"a legrosszabb sprint tempójával: {ceil(maradek / min(sebessegek))} sprint")
print(f"a legjobb sprint tempójával:     {ceil(maradek / max(sebessegek))} sprint")
```

„6–9 sprint, legvalószínűbben 7” – ez őszintébb és hasznosabb a megrendelőnek, mint egy pontosnak látszó, de valószínűleg téves dátum.

## 4. Brooks törvénye: miért nem segít több ember?

Fred Brooks 1975-ben megfogalmazott „törvénye”: **egy késésben lévő szoftverprojekthez embereket adni csak tovább késlelteti.** Két ok:

- az új embereket **be kell tanítani** – ezt a tapasztaltak idejéből veszik el,
- a **kommunikációs csatornák** száma $n$ embernél $n(n-1)/2$, vagyis négyzetesen nő.

```plot
title: A kommunikációs csatornák száma a csapat létszámának függvényében
x: 1, 15
y: 0, 110
f: x*(x - 1)/2 # csatornák száma
```

```python run
# Brooks törvénye egyszerű modellel: hasznos munka a csapatlétszám függvényében
for n in [3, 5, 8, 12, 20]:
    csatornak = n * (n - 1) // 2
    egyeztetes = 0.1 * csatornak                    # feltevés: csatornánként 2 × 5% munkaidő (mindkét félnél)
    hasznos = max(0.0, n - egyeztetes)              # ami a munkából az egyeztetés után marad
    print(f"{n:>2} fő: {csatornak:>3} csatorna, hasznos munka ≈ {hasznos:4.1f} ember-egység")
```

A modell egyszerűsített (a pontos számok a feltevésen múlnak), de a jelenség valódi: a hasznos munka egy darabig nő, aztán **csökkenni** kezd – egy bizonyos létszám fölött az új ember kevesebbet hoz, mint amennyit az egyeztetés elvisz. Ezért dolgoznak a nagy cégek is kis (5–9 fős) csapatokban, jól elhatárolt feladatokkal – és ezért érdemes késésnél inkább a **terjedelmet** csökkenteni (mi maradhat ki az első kiadásból?), mint embereket hozzáadni.

| Nézőpont          | Mire figyel a projektben?                                         |
| ----------------- | ----------------------------------------------------------------- |
| **projektvezető** | kritikus út, kockázatok, tartalékok, kommunikáció a megrendelővel |
| **fejlesztő**     | reális becslés, kevés párhuzamos feladat, nyugodt munkatempó      |
| **megrendelő**    | mikor és mennyiért kapja meg, mi lesz benne az első változatban   |
| **cégvezetés**    | erőforrások elosztása több projekt között, üzleti érték           |

## Összefoglalás

- A kritikus utat előre- és visszafelé számolással kapjuk meg; az itt lévő feladatok csúszása a teljes projektet késlelteti.
- A PERT-becslés $(o + 4m + p)/6$; a Monte Carlo-szimuláció megmutatja, mekkora eséllyel tartható egy határidő.
- A sebességből tartományt érdemes előre jelezni, nem egyetlen dátumot.
- Brooks törvénye: a csatornák száma $n(n-1)/2$, ezért egy késésben lévő projekthez embereket adni gyakran nem segít.

## A lecke feladata

```quiz required
? Egy feladatra az optimista becslés 2, a legvalószínűbb 4, a pesszimista 12 nap. Mennyi a PERT-becslés (nap)?
= 5
! $(2 + 4 \cdot 4 + 12) / 6 = 30 / 6 = 5$.

? Az A feladat 3, a B 5 napig tart; a C mindkettő után jöhet, és 2 napos. A és B párhuzamosan futhat. Hány nap a projekt?
= 7
! $\max(3, 5) + 2 = 7$ nap; a kritikus út B → C.

? Hány kommunikációs csatorna van egy 10 fős csapatban?
= 45
! $10 \cdot 9 / 2 = 45$.

? Mit jelent, ha egy feladat tartaléka 0?
- a feladat nem fontos
+ a feladat a kritikus úton van, minden csúszása a projektet is késlelteti
- a feladat már elkészült
- a feladatot el lehet hagyni
! A kritikus úton nincs mozgástér.

? Egy projekt késésben van. Melyik lépés segít Brooks törvénye szerint a legkevésbé?
+ sok új fejlesztő bevonása az utolsó hetekben
- a terjedelem csökkentése (mi maradhat ki az első kiadásból)
- a kritikus út feladatainak priorizálása
- a megrendelő őszinte tájékoztatása
! A betanítás és az egyeztetés több időt visz el, mint amennyit az új ember hoz.
```
