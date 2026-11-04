---
title: Tervezés – WBS, Gantt, kritikus út, kockázat
summary: Munkalebontási struktúra, függőségek, Gantt-diagram, a kritikus út kiszámítása és a kockázatkezelés.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan bontasz le egy projektet feladatokra (**WBS**),
- hogyan ütemezel **Gantt-diagrammal**, és mi a **kritikus út**,
- hogyan kezeled a **kockázatokat**.

## Munkalebontási struktúra (WBS)

A **WBS** (Work Breakdown Structure) a projektet egyre kisebb, kezelhető részekre bontja, amíg minden feladat **becsülhető** és **egy felelőshöz** rendelhető.

```text
 Egyetemi órarend-alkalmazás
 ├── 1. Tervezés
 │   ├── 1.1 Követelmények felmérése
 │   └── 1.2 Képernyőtervek
 ├── 2. Fejlesztés
 │   ├── 2.1 Adatbázis
 │   ├── 2.2 Backend
 │   └── 2.3 Mobil felület
 └── 3. Tesztelés és átadás
```

## Függőségek és Gantt-diagram

A feladatok között **függőség** van: a backendet csak az adatbázis után lehet befejezni. A **Gantt-diagram** idővonalon mutatja a feladatokat, hosszukat és sorrendjüket:

```text
 hét:            1   2   3   4   5   6   7   8
 A Követelmény  ███
 B Tervek           ███ ███
 C Adatbázis        ███ ███
 D Backend                  ███ ███ ███
 E Felület                      ███ ███
 F Tesztelés                            ███ ███
```

## Kritikus út

A **kritikus út** a függő feladatok **leghosszabb** lánca a kezdettől a végig. Ez adja a projekt minimális hosszát: ha egy kritikus feladat késik, az egész projekt késik. A nem kritikus feladatoknak van **tartalékidejük** (csúszhatnak egy kicsit).

| Feladat | Hossz (hét) | Előzmény |
| ------- | ----------- | -------- |
| A       | 1           | –        |
| B       | 2           | A        |
| C       | 2           | A        |
| D       | 3           | C        |
| E       | 2           | B        |
| F       | 2           | D, E     |

```python run
# Legkorábbi befejezés minden feladatra, majd a kritikus út
feladatok = {
    "A": (1, []), "B": (2, ["A"]), "C": (2, ["A"]),
    "D": (3, ["C"]), "E": (2, ["B"]), "F": (2, ["D", "E"]),
}
vege = {}
for nev, (hossz, elozok) in feladatok.items():   # a sorrend már megfelelő
    kezd = max((vege[e] for e in elozok), default=0)
    vege[nev] = kezd + hossz
print("Legkorábbi befejezések:", vege)
print("A projekt hossza:", max(vege.values()), "hét")

# A kritikus út visszafelé: mindig a legkésőbb végző előzményt követjük
ut, akt = [], "F"
while akt:
    ut.append(akt)
    elozok = feladatok[akt][1]
    akt = max(elozok, key=lambda e: vege[e]) if elozok else None
print("Kritikus út:", " → ".join(reversed(ut)))
```

Az eredmény: A → C → D → F, 8 hét. Az A → B → E → F lánc csak 7 hét, így B-nek és E-nek együtt 1 hét tartalékidejük van.

## Kockázatkezelés

A **kockázat** egy lehetséges jövőbeli esemény, amely veszélyezteti a projektet. A **kockázati mátrix** a **valószínűség** és a **hatás** szorzatával rangsorol:

| Kockázat                            | Valószínűség (1–5) | Hatás (1–5) | Pontszám | Válasz                       |
| ----------------------------------- | ------------------ | ----------- | -------- | ---------------------------- |
| a kulcsfejlesztő kiesik             | 2                  | 5           | 10       | tudásmegosztás, dokumentáció |
| a külső API megváltozik             | 3                  | 3           | 9        | absztrakciós réteg, figyelés |
| a megrendelő késve ad visszajelzést | 4                  | 2           | 8        | fix egyeztetési időpontok    |

Válaszlehetőségek: **elkerülés**, **csökkentés**, **áthárítás** (pl. biztosítás, szerződés), **elfogadás**.

## Összefoglalás

- WBS: a projekt lebontása becsülhető, felelőshöz rendelhető feladatokra.
- Gantt-diagram: feladatok az idővonalon; kritikus út: a leghosszabb függő lánc, ez a projekt hossza.
- Kockázat = valószínűség × hatás; válasz: elkerülés, csökkentés, áthárítás, elfogadás.

## A lecke feladata

```quiz required
? Mit jelent a WBS rövidítés?
= Work Breakdown Structure
= munkalebontási struktúra
! A projekt lebontása kisebb feladatokra.

? Hány hét a lecke példaprojektjének hossza?
= 8
! A kritikus út A → C → D → F: 1 + 2 + 3 + 2.

? Mi történik, ha egy **kritikus úton** lévő feladat egy hetet késik (és minden más tartja a tervet)?
- Semmi, van tartalék.
+ Az egész projekt egy hetet késik.
- A projekt egy héttel rövidebb lesz.
- Csak a tesztelés marad el.
! A kritikus feladatoknak nincs tartalékidejük.

? Mennyi a kockázati pontszám, ha a valószínűség 4, a hatás 3?
= 12
! Pontszám = valószínűség × hatás.
```
