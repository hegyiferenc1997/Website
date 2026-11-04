---
title: Munkaszervezés a felhőben
summary: Közös dokumentumok, felhős tárhely, csapatkommunikáció, feladattáblák (Kanban) és naptárak.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan dolgozik egy csapat **egyszerre ugyanazon a dokumentumon**,
- melyek a **kommunikációs** és **feladatkezelő** eszközök,
- hogyan működik egy **Kanban-tábla**.

## Felhős tárhely és közös szerkesztés

A **felhős tárhely** (OneDrive, Google Drive, Dropbox, iCloud) a fájljaidat egy szerveren tartja, és minden eszközödre **szinkronizálja**. Előnyei: nem vész el, ha elromlik a laptop; bárhonnan eléred; **megosztható** egy linkkel; a régi **verziók** visszaállíthatók.

A **közös szerkesztésnél** (Google Docs, Microsoft 365 Word/Excel online) többen egyszerre írják ugyanazt a fájlt, és mindenki látja a többiek kurzorát. Nincs több `beadando_vegleges_v3_JAVITOTT.docx`: egyetlen dokumentum van, a **verzióelőzmények** megmutatják, ki mit írt.

Hasznos funkciók:

- **megjegyzés** és **említés** (`@név`): kérdés vagy feladat egy konkrét bekezdéshez,
- **javaslat mód** (változások követése): a módosítás csak elfogadás után kerül be,
- **jogosultság**: megtekintő, megjegyzést fűző vagy szerkesztő.

## Csapatkommunikáció

| Eszköz            | Mire jó?                                                    |
| ----------------- | ----------------------------------------------------------- |
| Microsoft Teams   | csatornák, videóhívás, Office-integráció (cégek, egyetemek) |
| Slack             | csatornás csevegés, sok integráció (fejlesztőcsapatok)      |
| Discord           | hang- és szöveges csatornák (közösségek, diákcsoportok)     |
| Zoom, Google Meet | videókonferencia                                            |
| e-mail            | hivatalos, hosszabb, külső partnerekkel                     |

Tipp: egy téma = egy csatorna vagy szál. A gyors kérdés csevegésbe, a döntés és a hivatalos dolog e-mailbe vagy dokumentumba kerül.

## Feladatkezelés: Kanban-tábla

A **Kanban-tábla** oszlopokban mutatja a feladatok állapotát. Minden feladat egy kártya, amely balról jobbra halad:

```text
┌──────────────┬──────────────┬──────────────┐
│  Teendő      │  Folyamatban │  Kész        │
├──────────────┼──────────────┼──────────────┤
│ [Irodalom-   │ [Bevezetés   │ [Téma        │
│  gyűjtés]    │  megírása]   │  kiválasztása]│
│ [Ábrák]      │              │              │
└──────────────┴──────────────┴──────────────┘
```

Eszközök: **Trello**, **Microsoft Planner**, **Jira**, **GitHub Projects**, **Notion**, **Asana**. Kártyánként megadható felelős, határidő, címke és ellenőrzőlista.

Szabály: korlátozd, hány kártya lehet egyszerre a „Folyamatban” oszlopban (**WIP-limit**); így a csapat befejezi, amit elkezdett.

## Közös naptár

Az Outlook és a Google Naptár megmutatja, ki mikor ér rá, így könnyű időpontot találni egy megbeszélésre, és a meghívóba rögtön bekerül a videóhívás linkje.

## Összefoglalás

- Felhős tárhely: szinkronizálás, megosztás, verziók; közös szerkesztés: egy dokumentum, sok szerző.
- Kommunikáció: Teams, Slack, Discord, videókonferencia, e-mail.
- Kanban-tábla: Teendő → Folyamatban → Kész, WIP-limittel.

## A lecke feladata

```quiz required
? Mi a felhős tárhely egyik fő előnye a pendrive-hoz képest?
- Gyorsabb internet nélkül.
+ Ha elromlik a gép, a fájlok megmaradnak, és a régebbi verziók is visszaállíthatók.
- Soha nem kell hozzá jelszó.
- Mindig ingyenes, korlátlan méretben.
! A fájlok a szolgáltató szerverén is megvannak.

? Hogy hívják azt a táblát, ahol a feladatkártyák a Teendő → Folyamatban → Kész oszlopokon haladnak?
= Kanban
= Kanban-tábla
= kanban tábla
! A japán „kanban” szó jelzőkártyát jelent.

? Mit jelent a WIP-limit egy Kanban-táblán?
+ Legfeljebb ennyi feladat lehet egyszerre folyamatban.
- Legfeljebb ennyi tagja lehet a csapatnak.
- Ennyi nap a határidő.
- Ennyi oszlop lehet a táblán.
! Work In Progress = folyamatban lévő munka.

? Melyik funkcióval írhatsz valakinek közvetlenül egy dokumentum adott bekezdéséhez?
- nyomtatás
+ megjegyzés említéssel (@név)
- exportálás PDF-be
- betűtípus-csere
! Az említett személy értesítést kap.
```
