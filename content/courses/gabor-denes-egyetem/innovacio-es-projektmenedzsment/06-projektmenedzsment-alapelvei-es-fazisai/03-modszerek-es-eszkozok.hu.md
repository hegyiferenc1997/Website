---
title: Projektmenedzsment módszerek és eszközök
summary: Áttekintő térkép – módszertanok (vízesés, agilis, PRINCE2, hibrid) és a legfontosabb eszközök (alapító okirat, WBS, Gantt, hálóterv, RACI, kockázatnyilvántartás, Kanban-tábla, earned value) fázisonként.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **módszertan**, a **módszer** és az **eszköz** között,
- melyek a fő **projektmenedzsment-módszertanok**,
- melyik **eszközt** melyik fázisban használjuk – ez a lecke a tárgy hátralévő részének „térképe”.

## Módszertan, módszer, eszköz

- **Módszertan** (_methodology_): a projekt teljes vezetésének keretrendszere – szerepek, fázisok, szabályok (pl. PRINCE2, Scrum).
- **Módszer / technika**: egy konkrét feladat megoldásának módja (pl. kritikus út számítása, PERT-becslés).
- **Eszköz**: egy dokumentum, diagram vagy szoftver, amellyel a módszert alkalmazzuk (pl. Gantt-diagram, Jira).

## A fő módszertanok

| Módszertan                 | Jellemző                                                      | Mikor jó?                                         |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| **vízesés** (hagyományos)  | egymást követő fázisok, részletes előzetes terv               | stabil, jól ismert követelmények (pl. építkezés)  |
| **agilis** (Scrum, Kanban) | rövid iterációk, folyamatos visszajelzés, változó terjedelem  | bizonytalan, változó követelmények (pl. szoftver) |
| **PRINCE2**                | folyamat- és termékközpontú, szakaszokra bontott irányítás    | nagy szervezetek, közszféra                       |
| **hibrid**                 | a kettő ötvözése (pl. vízesés-szerű keret, agilis fejlesztés) | sok valós projekt                                 |

A módszertanokat a 11. témakör hasonlítja össze részletesen.

## Eszközök fázisonként

| Fázis                | Eszköz                                                      | Részletesen     |
| -------------------- | ----------------------------------------------------------- | --------------- |
| kezdeményezés        | üzleti eset, **projekt alapító okirat**, érintettlista      | 7., 13. témakör |
| tervezés             | **WBS** (munkalebontási struktúra)                          | 7. témakör      |
| tervezés             | **hálóterv**, **kritikus út** (CPM), PERT-becslés           | 7., 9. témakör  |
| tervezés             | **Gantt-diagram** (idővonalas ütemterv), mérföldkövek       | 7. témakör      |
| tervezés             | **SMART-célok**, **KPI-k**, követelménylista                | 8. témakör      |
| tervezés             | **RACI-mátrix** (felelősségi mátrix)                        | 12. témakör     |
| tervezés, ellenőrzés | **kockázatnyilvántartás**, valószínűség–hatás mátrix        | 14. témakör     |
| végrehajtás          | **Kanban-tábla**, sprinttábla, napi megbeszélés             | 11. témakör     |
| nyomon követés       | **earned value** (megszerzett érték), státuszjelentés       | 9. témakör      |
| lezárás              | átadás-átvételi jegyzőkönyv, **tanulságok**                 | 10. témakör     |
| végig                | **projektmenedzsment-szoftver** (MS Project, Jira, Trello…) | 15. témakör     |

## Egy kis ízelítő: Gantt-diagram

A **Gantt-diagram** (Henry Gantt, 1910-es évek) a tevékenységeket sorokban, az időt vízszintesen ábrázolja:

```text
 Tevékenység        │ 1. hét │ 2. hét │ 3. hét │ 4. hét │
 ───────────────────┼────────┼────────┼────────┼────────┤
 Követelmények      │████████│        │        │        │
 Tervezés           │    ████│████    │        │        │
 Fejlesztés         │        │    ████│████████│        │
 Tesztelés          │        │        │    ████│████    │
 Átadás ◆           │        │        │        │    ◆   │
```

A ◆ jel **mérföldkő**: egy fontos, nulla időtartamú esemény (pl. „átadás”).

## Összefoglalás

- Módszertan = teljes keretrendszer; módszer = egy feladat megoldásmódja; eszköz = dokumentum, diagram, szoftver.
- Fő módszertanok: vízesés, agilis, PRINCE2, hibrid.
- Minden fázisnak megvannak a jellemző eszközei; a tárgy következő témakörei ezeket részletezik.
- A Gantt-diagram idővonalon ábrázolja a tevékenységeket; a mérföldkő nulla időtartamú esemény.

## A lecke feladata

```quiz required
? Melyik **módszertan** (és nem eszköz)?
- Gantt-diagram
- RACI-mátrix
+ PRINCE2
- Jira
! A PRINCE2 egy teljes projektvezetési keretrendszer.

? Melyik eszköz bontja le a projekt teljes munkáját kisebb, kezelhető részekre?
+ WBS (munkalebontási struktúra)
- SWOT
- Pareto-diagram
- earned value
! Work Breakdown Structure.

? Mi a **mérföldkő** egy ütemtervben?
- a leghosszabb tevékenység
+ egy fontos, nulla időtartamú esemény
- a projekt költségvetése
- egy csapattag szabadsága
! Pl. „a rendszer átadása”.

? Melyik megközelítés illik leginkább egy **bizonytalan, gyorsan változó követelményű** szoftverprojekthez?
- vízesés
+ agilis
- egyik sem
- csak PRINCE2
! Rövid iterációk és folyamatos visszajelzés kezelik a változást.

? Ki után nevezték el az idővonalas ütemtervet ábrázoló diagramot? (vezetéknév)
= Gantt
= Henry Gantt
! Henry Gantt, az 1910-es években.
```
