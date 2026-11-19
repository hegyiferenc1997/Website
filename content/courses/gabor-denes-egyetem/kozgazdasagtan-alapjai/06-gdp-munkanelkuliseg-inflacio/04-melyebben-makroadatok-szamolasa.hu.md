---
title: Mélyebben – makroadatok kiszámolása
summary: Nominális és reál GDP és a deflátor egy mini gazdaságon, inflációszámítás egy kosárból és a „személyes infláció”, a munkaerőpiaci ráták és az elbátortalanodott munkavállalók torzító hatása, valamint az infláció mint rejtett adó csúszkás ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan választja szét a statisztika a GDP növekedésén belül az **árhatást** és a **volumenhatást**,
- hogyan lesz egy **kosárból** inflációs szám, és miért érzi mindenki másnak,
- miért lehet egy javuló munkanélküliségi ráta mögött **rossz hír**,
- mennyit **eszik meg** az infláció a megtakarításokból.

## 1. Mennyi a valódi növekedés?

Egy mini gazdaság laptopot és kávét állít elő. A nominális GDP folyó árakon, a reál GDP a **bázisév** (2024) árain számol:

```python run
# Nominális és reál GDP: egy kétféle terméket (laptop, kávé) előállító mini gazdaság
adatok = {   # év: {termék: (ár Ft, mennyiség db)}
    2024: {"laptop": (300_000, 1000), "kávé": (800, 500_000)},
    2025: {"laptop": (330_000, 1050), "kávé": (900, 520_000)},
}
bazis = 2024
for ev, termekek in adatok.items():
    nominalis = sum(p * q for p, q in termekek.values())                       # folyó árakon
    real = sum(adatok[bazis][t][0] * q for t, (p, q) in termekek.items())      # bázisévi árakon
    deflator = 100 * nominalis / real
    print(f"{ev}: nominális GDP {nominalis / 1e6:6.0f} M Ft | reál GDP {real / 1e6:6.0f} M Ft | deflátor {deflator:6.1f}")

n24 = sum(p * q for p, q in adatok[2024].values())
n25 = sum(p * q for p, q in adatok[2025].values())
r25 = sum(adatok[2024][t][0] * q for t, (p, q) in adatok[2025].items())
print(f"nominális növekedés {100 * (n25 / n24 - 1):.1f}%, ebből reál növekedés {100 * (r25 / n24 - 1):.1f}%")
```

A nominális GDP 16,4%-kal nőtt, de ennek nagy része csak **drágulás**: a ténylegesen megtermelt mennyiség (reál GDP) csak 4,4%-kal lett több. A **GDP-deflátor** (111,4) a teljes termelés átlagos árszintváltozását mutatja. A hírekben a „GDP-növekedés” mindig a reál növekedést jelenti – ha valaki nominális adatot mutat, az gyakran (szándékosan vagy véletlenül) félrevezető.

## 2. A kosár és a „személyes infláció”

A fogyasztói árindex egy **átlagos** háztartás kosarát követi; minden tétel árváltozását a kiadásokon belüli súlyával vesszük figyelembe:

```python run
# Fogyasztói árindex egy kosárból: a súlyok a kiadások arányai
kosar = {   # tétel: (súly, árváltozás %)
    "élelmiszer":     (0.25, 6.0),
    "lakhatás, rezsi": (0.20, 3.0),
    "közlekedés":     (0.15, -2.0),
    "szórakozás":     (0.10, 8.0),
    "elektronika":    (0.05, -5.0),
    "egyéb":          (0.25, 4.0),
}
cpi = sum(s * v for s, v in kosar.values())
print(f"átlagos infláció (egy átlagos háztartás kosarával): {cpi:.2f}%")

# egy egyetemista kosara másképp néz ki: más súlyok, ugyanazok az árváltozások
diak_sulyok = {"élelmiszer": 0.30, "lakhatás, rezsi": 0.35, "közlekedés": 0.05,
               "szórakozás": 0.15, "elektronika": 0.10, "egyéb": 0.05}
diak = sum(diak_sulyok[t] * kosar[t][1] for t in kosar)
print(f"egy egyetemista személyes inflációja: {diak:.2f}%")
```

Ugyanazok az árváltozások mellett egy egyetemista inflációja más, mert ő a jövedelme nagyobb részét költi lakhatásra és szórakozásra, kevesebbet közlekedésre. Ezért érzi mindenki másnak az inflációt: egy nyugdíjasnál az élelmiszer és a gyógyszer, egy autósnál az üzemanyag súlya nagyobb. A KSH ezért különböző csoportokra (pl. nyugdíjasok) külön árindexet is közöl.

**Mérési csapdák:** ha egy termék (pl. laptop) ugyanannyiba kerül, de kétszer gyorsabb, az valójában árcsökkenés – ezt a statisztika **minőségkorrekcióval** próbálja kezelni. És ha drágul a marhahús, sokan csirkére váltanak – a rögzített kosár ezt csak késve követi, ezért kissé túlbecsülheti az inflációt.

## 3. A munkaerőpiac rátái és csapdái

```python run
# Munkaerőpiaci ráták egy ország 15–74 éves népességéből (ezer fő)
foglalkoztatott, munkanelkuli, inaktiv = 4700, 210, 2590
aktiv = foglalkoztatott + munkanelkuli                  # munkaerő: dolgozik vagy aktívan munkát keres
nepesseg = aktiv + inaktiv
print(f"munkanélküliségi ráta = {munkanelkuli} / {aktiv} = {100 * munkanelkuli / aktiv:.1f}%")
print(f"aktivitási ráta       = {aktiv} / {nepesseg} = {100 * aktiv / nepesseg:.1f}%")
print(f"foglalkoztatási ráta  = {foglalkoztatott} / {nepesseg} = {100 * foglalkoztatott / nepesseg:.1f}%")

# 60 ezer munkanélküli feladja a keresést (inaktív lesz): a ráta "javul", pedig senki nem talált munkát
m2, i2 = munkanelkuli - 60, inaktiv + 60
print(f"\nha 60 ezren feladják a keresést: munkanélküliségi ráta {100 * m2 / (foglalkoztatott + m2):.1f}%, "
      f"foglalkoztatási ráta változatlanul {100 * foglalkoztatott / nepesseg:.1f}%")
```

Ha 60 ezer munkanélküli feladja a keresést (**elbátortalanodott munkavállaló**), a munkanélküliségi ráta 4,3%-ról 3,1%-ra „javul” – pedig senki sem talált munkát! A foglalkoztatási ráta viszont nem változik, ezért a munkaerőpiac állapotát mindig **több mutató együtt** írja le jól. Hasonló torzítás: aki heti 1 órát dolgozik, foglalkoztatottnak számít, akkor is, ha többet szeretne (alulfoglalkoztatottság).

## 4. Az infláció mint rejtett adó

```python run
# Az infláció mint "rejtett adó": 1 millió Ft a párnacihában – mennyit ér 10 év múlva?
import math

for inflacio in [2, 5, 10, 25]:
    ertek = 1_000_000 / (1 + inflacio / 100) ** 10       # mai pénzben kifejezett vásárlóerő
    felezes = math.log(2) / math.log(1 + inflacio / 100)  # ennyi év alatt feleződik a vásárlóerő
    print(f"{inflacio:>2}% infláció: 10 év múlva {ertek:>9,.0f} Ft-nyit ér | vásárlóerő felezési ideje {felezes:4.1f} év")
```

Már 5%-os infláció mellett is kb. 14 év alatt feleződik a készpénz vásárlóereje; 25%-nál (ami történelmileg nem példátlan) három év alatt. Ezért nevezik az inflációt **rejtett adónak**: törvény nélkül vesz el a megtakarítók vagyonából – és egyben csökkenti az adósok (köztük az állam) tartozásának reálértékét.

```plot
title: 100 Ft vásárlóereje az évek során
x: 0, 30
y: 0, 100
param: p = 5, 0, 30, 1
f: 100/(1 + p/100)^x # vásárlóerő
dash: 50 # a fele
```

## Összefoglalás

- Reál GDP: bázisévi árakon; a nominális növekedés = reál növekedés × árszint-növekedés (deflátor).
- A CPI súlyozott átlag; a személyes infláció a saját kosártól függ; a minőségváltozás és a helyettesítés torzíthat.
- Munkanélküliségi ráta = munkanélküli / aktív; az elbátortalanodás „javítja” a rátát, ezért a foglalkoztatási rátát is nézni kell.
- Az infláció a megtakarítók rejtett adója: a vásárlóerő felezési ideje kb. 70 / (infláció %-ban) év.

## A lecke feladata

```quiz required
? A nominális GDP 8%-kal nőtt, a deflátor 5%-kal. Hány százalék a reál növekedés? (egy tizedesre)
= 2,9
= 2.9
! $\frac{1{,}08}{1{,}05} - 1 \approx 2{,}9\%$.

? 900 ezer foglalkoztatott és 100 ezer munkanélküli van. Hány százalék a munkanélküliségi ráta?
= 10
! $\frac{100}{900 + 100} = 10\%$.

? Egy kosárban az élelmiszer súlya 0,6 (drágulás 5%), a többi tételé 0,4 (drágulás 10%). Mennyi az infláció (%)?
= 7
! $0{,}6 \cdot 5 + 0{,}4 \cdot 10 = 7$.

? Sok munkanélküli feladja a munkakeresést. Mi történik a munkanélküliségi rátával?
+ csökken, pedig nem nőtt a foglalkoztatás
- nő
- nem változik
- a foglalkoztatási rátával együtt nő
! Kikerülnek az aktívak közül, így a számláló és a nevező is csökken.

? Az árindex 120-ról 150-re nő. Hány százalék az infláció?
= 25
! $\frac{150}{120} - 1 = 25\%$.
```
