---
title: Agilis projektvezetés – Scrum és Kanban
summary: Scrum szerepkörök, események és termékek, sztoripont és sebesség, Kanban, valamint hogy mikor melyik módszer.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a **Scrum** szerepköreit, eseményeit és termékeit,
- mi a **sztoripont** és a **sebesség** (velocity),
- miben más a **Kanban**, és mikor melyiket érdemes választani.

## Scrum

A **Scrum** a legelterjedtebb agilis keretrendszer. A munka rögzített hosszúságú **sprintekben** (1–4 hét, gyakran 2) halad, és minden sprint végén egy **működő, átadható termékváltozat** (inkrementum) készül.

**Szerepkörök:**

| Szerep            | Feladata                                                               |
| ----------------- | ---------------------------------------------------------------------- |
| **Product Owner** | a termék értékéért felel; ő kezeli és rangsorolja a termékteendőlistát |
| **Scrum Master**  | segíti a csapatot, elhárítja az akadályokat, betartatja a Scrumot      |
| **fejlesztők**    | 3–10 fős, önszerveződő csapat, amely elkészíti az inkrementumot        |

**Események:**

| Esemény                    | Mikor, mennyi ideig? | Célja                                                  |
| -------------------------- | -------------------- | ------------------------------------------------------ |
| **sprinttervezés**         | a sprint elején      | mit és hogyan készítünk el a sprintben?                |
| **napi scrum** (daily)     | naponta, 15 perc     | összehangolás: mit csináltam, mit fogok, mi akadályoz? |
| **sprint-áttekintés**      | a sprint végén       | bemutató az érintetteknek, visszajelzés                |
| **visszatekintés** (retro) | az áttekintés után   | mit csináljunk jobban a következő sprintben?           |

**Termékek (artefaktumok):** **termékteendőlista** (product backlog – az összes kívánt funkció rangsorolva), **sprintteendőlista** (sprint backlog – amit erre a sprintre vállaltak), **inkrementum** (a működő eredmény).

## Becslés: sztoripont és sebesség

Az agilis csapatok gyakran nem órában, hanem relatív **sztoripontban** becsülnek (pl. 1, 2, 3, 5, 8, 13 – Fibonacci-szerű sor): mennyire nagy és bonyolult egy feladat a többihez képest. A **sebesség** (velocity) az egy sprintben átlagosan elkészült pontok száma; ebből becsülhető, mikorra készül el a teendőlista.

```python run
# Az elmúlt sprintek alapján hány sprint kell még?
import math
elkeszult = [21, 18, 24, 21]        # sztoripont sprintenként
sebesseg = sum(elkeszult) / len(elkeszult)
hatralevo = 130                     # a teendőlista maradéka
print("átlagos sebesség:", sebesseg)
print("még szükséges sprintek:", math.ceil(hatralevo / sebesseg))
```

## Kanban

A **Kanban** nem sprintekben, hanem **folyamatos áramlásban** dolgozik: a táblán (Teendő → Folyamatban → Ellenőrzés → Kész) a kártyák haladnak, és a **WIP-limit** korlátozza, hány feladat lehet egyszerre egy oszlopban. Mérőszáma az **átfutási idő**: mennyi idő telik el, amíg egy kártya a Teendőből a Készbe ér.

## Mikor melyik?

| Helyzet                                                                            | Jó választás              |
| ---------------------------------------------------------------------------------- | ------------------------- |
| új termék fejlesztése, változó igények, rendszeres bemutatók                       | **Scrum**                 |
| folyamatosan érkező, kiszámíthatatlan feladatok (üzemeltetés, hibajegyek, support) | **Kanban**                |
| rögzített, jól ismert követelmények, szigorú szabályozás                           | **vízesés** (vagy hibrid) |

## Összefoglalás

- Scrum: Product Owner, Scrum Master, fejlesztők; sprinttervezés, napi scrum, áttekintés, visszatekintés.
- Sztoripont = relatív becslés; sebesség = pont/sprint; ebből tervezhető a hátralévő idő.
- Kanban: folyamatos áramlás, WIP-limit, átfutási idő.

## A lecke feladata

```quiz required
? Ki rangsorolja a termékteendőlistát (product backlog) a Scrumban?
+ Product Owner
- Scrum Master
- a legidősebb fejlesztő
- a megrendelő jogásza
! Ő felel a termék értékéért.

? Hány perces a napi scrum?
= 15
! Rövid, álló megbeszélés.

? Hány sprint kell még a lecke példája szerint (átlagos sebesség 21, hátralévő 130 pont)?
= 7
! 130 / 21 ≈ 6,2 → felfelé kerekítve 7.

? Melyik módszer illik legjobban egy üzemeltetési csapat folyamatosan érkező hibajegyeihez?
- vízesés
+ Kanban
- Scrum hathetes sprintekkel
- egyik sem
! Folyamatos áramlás, WIP-limittel.
```
