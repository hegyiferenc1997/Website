---
title: Agilis módszertanok – Scrum és Kanban
summary: A Scrum felelősségi körei, eseményei és termékei, a sprint menete, sztoripontok, sebesség és burndown-diagram; a Kanban elvei, a WIP-korlát és Little törvénye.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **Scrum** (szerepek, események, termékek),
- mi a **sztoripont**, a **sebesség** és a **burndown-diagram**,
- hogyan működik a **Kanban**, és mi a **WIP-korlát**,
- mit mond **Little törvénye**.

## Scrum

A **Scrum** (Ken Schwaber és Jeff Sutherland, a szabálykönyv a **Scrum Guide**, legutóbb 2020) a legelterjedtebb agilis keretrendszer. A munka rögzített hosszúságú **sprintekben** folyik, amelyek legfeljebb **egy hónaposak** (gyakran 2 hetesek).

### Felelősségi körök (a Scrum csapat, legfeljebb kb. 10 fő)

| Szerep                          | Felelőssége                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| **Product Owner** (termékgazda) | a termék értékének maximalizálása; a **termék-backlog** kezelése, priorizálása          |
| **Scrum Master**                | a Scrum helyes alkalmazása; akadályok elhárítása, a csapat támogatása (szolgáló vezető) |
| **Fejlesztők** (_Developers_)   | minden sprintben egy használható **inkrementum** elkészítése                            |

> A Scrumban **nincs projektmenedzser** szerep: a hagyományos PM feladatai megoszlanak a három szerep között.

### Események

```text
 ┌──────────────────────────── Sprint (≤ 1 hónap) ────────────────────────────┐
 │ Sprint-     ┌ Daily ┐ ┌ Daily ┐ ┌ Daily ┐ …     Sprint-      Sprint-       │
 │ tervezés  → │ Scrum │ │ Scrum │ │ Scrum │   →   áttekintés → retrospektív  │
 │             └15 perc┘ └───────┘ └───────┘       (Review)     (Retro)       │
 └────────────────────────────────────────────────────────────────────────────┘
```

1. **Sprint** – a többi eseményt magában foglaló „tároló”.
2. **Sprinttervezés** (_Sprint Planning_) – mit és hogyan készítünk el? Megszületik a **sprintcél** és a **sprint-backlog**.
3. **Napi Scrum** (_Daily Scrum_) – legfeljebb **15 perces** napi egyeztetés a fejlesztőknek a sprintcél felé haladásról.
4. **Sprint-áttekintés** (_Sprint Review_) – az elkészült inkrementum bemutatása az érintetteknek, visszajelzés.
5. **Sprint-retrospektív** – a csapat a saját működését javítja (Kaizen, 5. témakör).

### Termékek (artefaktumok) és vállalásaik

| Termék             | Tartalom                                       | Vállalás                                      |
| ------------------ | ---------------------------------------------- | --------------------------------------------- |
| **termék-backlog** | a termékhez szükséges összes elem, priorizálva | **termékcél** (_Product Goal_)                |
| **sprint-backlog** | a sprintre kiválasztott elemek + a terv        | **sprintcél** (_Sprint Goal_)                 |
| **inkrementum**    | a sprint végén kész, használható eredmény      | **„kész” definíciója** (_Definition of Done_) |

### Becslés és mérés

- **Sztoripont**: a felhasználói történetek **relatív** méretének becslése (gyakran Fibonacci-számokkal: 1, 2, 3, 5, 8, 13). A **tervezési póker** során mindenki egyszerre mutatja fel a becslését, és a nagy eltéréseket megbeszélik.
- **Sebesség** (_velocity_): egy sprint alatt elkészült sztoripontok száma. Ha az utolsó három sprint 18, 22 és 20 pont volt, az átlagos sebesség **20**, így egy 120 pontos backlog kb. **6 sprint**.
- **Burndown-diagram**: a hátralévő munka a sprint (vagy a kiadás) napjainak függvényében – ideálisan egyenletesen csökken nullára.

## Kanban

A **Kanban** (japánul „kártya”, a Toyota termelési rendszeréből; szoftverre David J. Anderson alkalmazta) nem használ sprinteket: a munka **folyamatosan áramlik**. Fő gyakorlatai:

1. **A munka láthatóvá tétele** – Kanban-tábla oszlopokkal (pl. Teendő → Folyamatban → Teszt → Kész).
2. **A folyamatban lévő munka korlátozása** (**WIP-limit**, _Work In Progress_) – pl. a „Folyamatban” oszlopban legfeljebb 3 kártya lehet.
3. **Az áramlás menedzselése** – az átfutási idő mérése, a szűk keresztmetszetek feloldása.
4. A szabályok explicitté tétele, visszacsatolás, folyamatos fejlesztés.

```text
 │ Teendő      │ Folyamatban (WIP 3) │ Teszt (WIP 2) │ Kész        │
 │ [F] [G] [H] │ [C] [D] [E]         │ [B]           │ [A]         │
```

> A WIP-korlát lényege: **„Fejezd be, mielőtt újat kezdesz!”** Kevesebb párhuzamos munka = rövidebb átfutás, kevesebb kontextusváltás (Lean: mozgás és készlet veszteség).

### Little törvénye

> **átlagos átfutási idő = átlagos WIP / átlagos áteresztőképesség**

Példa: ha átlagosan 12 feladat van folyamatban, és a csapat hetente 4 feladatot fejez be, egy feladat átlagos átfutási ideje 12 / 4 = **3 hét**. A WIP felére csökkentése (6) felére csökkenti az átfutási időt (1,5 hét).

## Összefoglalás

- Scrum: Product Owner, Scrum Master, fejlesztők; sprint (≤ 1 hónap), tervezés, napi Scrum (15 perc), áttekintés, retrospektív; termék-backlog, sprint-backlog, inkrementum.
- Sztoripont, tervezési póker, sebesség, burndown-diagram.
- Kanban: láthatóvá tétel, WIP-limit, áramlás menedzselése.
- Little törvénye: átfutási idő = WIP / áteresztőképesség.

## A lecke feladata

```quiz required
? Melyik Scrum-szerep felel a **termék-backlog priorizálásáért**?
+ Product Owner
- Scrum Master
- fejlesztők
- projektmenedzser
! A termékgazda maximalizálja a termék értékét.

? Legfeljebb hány perces a napi Scrum?
= 15
= 15 perc
! Rövid napi egyeztetés a sprintcélról.

? Az utolsó három sprintben a csapat 24, 30 és 27 sztoripontot teljesített. Mennyi az átlagos sebesség?
= 27
! (24 + 30 + 27) / 3.

? Ezzel a sebességgel hány sprint kell egy 135 pontos backloghoz?
= 5
= 5 sprint
! 135 / 27.

? Mit jelent a Kanbanban a **WIP-limit**?
- a csapat létszámának korlátja
+ a folyamatban lévő munkák számának korlátja egy oszlopban
- a sprint hossza
- a költségvetés felső határa
! Work In Progress limit.

? Átlagosan 10 feladat van folyamatban, a csapat hetente 5 feladatot fejez be. Little törvénye szerint hány hét az átlagos átfutási idő?
= 2
= 2 hét
! 10 / 5.
```
