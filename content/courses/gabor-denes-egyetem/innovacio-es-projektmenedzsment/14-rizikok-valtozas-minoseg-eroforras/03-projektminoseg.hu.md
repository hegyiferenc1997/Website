---
title: Projektminőség
summary: Mi a minőség, minőségtervezés, minőségbiztosítás (QA) és minőségellenőrzés (QC), a minőség költsége és az 1:10:100 szabály, ISO 9001, a hét alapvető minőségügyi eszköz és a minőség a szoftverprojektekben.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent a **minőség** egy projektben,
- mi a különbség a **minőségbiztosítás** (QA) és a **minőségellenőrzés** (QC) között,
- mi a **minőség költsége**, és miért éri meg a megelőzés,
- melyek az alapvető **minőségügyi eszközök**.

## Mi a minőség?

- **Philip Crosby**: a minőség a **követelményeknek való megfelelés**.
- **Joseph Juran**: a minőség a **használatra való alkalmasság** (_fitness for use_).
- **ISO 9000**: az a mérték, amennyire egy termék jellemzői **teljesítik a követelményeket**.

> A minőség nem azonos a **fokozattal** (_grade_): egy olcsó, kevés funkciójú alkalmazás (alacsony fokozat) is lehet kiváló minőségű (hibátlan), és egy drága, sokfunkciós rendszer is lehet rossz minőségű (hibás).

## A minőségmenedzsment három folyamata

| Folyamat                                        | Kérdés                                                  | Példa                                                          |
| ----------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| **minőségtervezés**                             | Milyen szabványoknak kell megfelelni, és hogyan mérjük? | kódolási szabályok, tesztlefedettség ≥ 80%, „kész” definíciója |
| **minőségbiztosítás** (QA, _Quality Assurance_) | Jól **csináljuk**? (a **folyamat**)                     | kódátnézés, folyamataudit, automatikus tesztelés a CI-ben      |
| **minőségellenőrzés** (QC, _Quality Control_)   | Jó lett az **eredmény**? (a **termék**)                 | tesztelés, ellenőrzés, mérés az átadás előtt                   |

> Röviden: a **QA megelőz** (a folyamatra figyel), a **QC észlel** (a terméket vizsgálja).

## A minőség költsége

| Csoport                     | Költségtípus                        | Példa                                              |
| --------------------------- | ----------------------------------- | -------------------------------------------------- |
| **megfelelés költsége**     | **megelőzési** (_prevention_)       | képzés, szabványok, tervezési átnézés              |
|                             | **értékelési** (_appraisal_)        | tesztelés, ellenőrzés, mérőeszközök                |
| **nem megfelelés költsége** | **belső hiba** (_internal failure_) | átadás előtt talált hiba javítása, selejt          |
|                             | **külső hiba** (_external failure_) | ügyfélnél jelentkező hiba, garancia, hírnévvesztés |

Az **1:10:100 szabály**: ami a megelőzéskor 1 egységbe kerül, az a belső javításkor kb. 10, a vevőnél jelentkező hibánál kb. 100 egységbe. Egy követelményhiba kijavítása a tervezéskor néhány perc, éles üzemben akár napok és ügyfélvesztés.

## ISO 9001 és TQM

- Az **ISO 9001** a minőségirányítási rendszerek nemzetközi szabványa; egy szervezet tanúsíttathatja. Alapelvei között szerepel a vevőközpontúság, a folyamatszemlélet, a **PDCA** és a tényeken alapuló döntéshozatal.
- A **TQM** (_Total Quality Management_, teljes körű minőségirányítás) szerint a minőség **mindenki** felelőssége, és folyamatos javítással (Kaizen, 5. témakör) érhető el. **Deming** 14 pontja ennek az alapja.

## A hét alapvető minőségügyi eszköz (Ishikawa)

1. **Ok-okozati (halszálka-) diagram** – egy probléma lehetséges okainak rendszerezése (pl. ember, módszer, gép, anyag, mérés, környezet).
2. **Pareto-diagram** – az okok gyakoriság szerint, csökkenő sorrendben (80/20).
3. **Ellenőrzőlap** – adatgyűjtés strokeolással.
4. **Hisztogram** – egy mennyiség eloszlása.
5. **Szóródási diagram** – két változó kapcsolata.
6. **Szabályozó kártya** (_control chart_) – stabil-e a folyamat? Az értékek a felső és alsó beavatkozási határ között maradnak-e?
7. **Folyamatábra** (vagy rétegzés).

```text
 Halszálka-diagram:  ember ──┐  módszer ──┐
                             ├────────────┼────────► PROBLÉMA: lassú oldal
                   eszköz ───┘  mérés ────┘
```

## Minőség a szoftverprojektekben

- **„kész” definíciója** (_Definition of Done_): pl. a kód át van nézve, a tesztek zöldek, a dokumentáció frissült,
- **kódátnézés** (_code review_), **páros programozás**,
- **automatizált tesztek** (egység-, integrációs, végponttól végpontig) és **folyamatos integráció** (CI),
- **statikus kódelemzés**, kódformázó,
- a **nem funkcionális** követelmények mérése (teljesítmény, biztonság – ISO 25010, 8. témakör).

## Összefoglalás

- Minőség = a követelményeknek való megfelelés / használatra való alkalmasság; nem azonos a fokozattal.
- Minőségtervezés, QA (folyamat, megelőzés), QC (termék, észlelés).
- A minőség költsége: megelőzési, értékelési, belső hiba, külső hiba; 1:10:100 szabály.
- ISO 9001, TQM, Deming.
- Hét eszköz: halszálka, Pareto, ellenőrzőlap, hisztogram, szóródási diagram, szabályozó kártya, folyamatábra.

## A lecke feladata

```quiz required
? Melyik a **minőségbiztosítás** (QA) jellemzője?
+ a folyamatra figyel, a hibák megelőzése a cél
- a kész terméket teszteli az átadás előtt
- csak a vevőnél jelentkező hibákat javítja
- a költségvetést ellenőrzi
! QA = megelőzés, QC = észlelés.

? Melyik a **külső hiba** költsége?
- a fejlesztők képzése
- az automatizált tesztek futtatása
- az átadás előtt talált hiba javítása
+ az ügyfélnél jelentkező hiba miatti garanciális javítás és hírnévvesztés
! External failure: a hibát a vevő találja meg.

? Az 1:10:100 szabály szerint ha egy hiba megelőzése 2 egységbe kerül, kb. hány egységbe kerül, ha a vevőnél jelentkezik?
= 200
! 2 · 100.

? Melyik eszköz rendszerezi egy probléma **lehetséges okait** kategóriák szerint?
+ ok-okozati (halszálka-) diagram
- hisztogram
- szabályozó kártya
- Gantt-diagram
! Ishikawa-diagram.

? Egy olcsó, kevés funkciós, de hibátlan alkalmazás:
- alacsony minőségű
+ alacsony fokozatú, de magas minőségű
- magas fokozatú és alacsony minőségű
- nem értékelhető
! A minőség és a fokozat két külön dolog.
```
