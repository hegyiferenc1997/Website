---
title: A projektmenedzsment szoftverek áttekintése
summary: Mire jó egy PM-szoftver, a fő eszközcsoportok (klasszikus ütemezők, agilis eszközök, vizuális táblák, munkamenedzsment-platformok), ismert képviselőik és a nézettípusok: Gantt, tábla, lista, idővonal, naptár, irányítópult.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mire használjuk a **projektmenedzsment szoftvereket**,
- milyen **eszközcsoportok** vannak, és melyik mire való,
- melyek az ismert **képviselők** (MS Project, Jira, Trello, Asana, GitHub Projects, monday.com, ClickUp, Notion),
- milyen **nézetekben** jeleníthető meg ugyanaz a projekt.

## Mire jó egy PM-szoftver?

Az eddigi témakörök módszereit (WBS, hálóterv, Gantt-diagram, kockázatnyilvántartás, KPI-k, sprinttábla) papíron vagy táblázatkezelőben is el lehet készíteni. Egy **projektmenedzsment szoftver** ezeket **egy helyen**, **közösen** és **naprakészen** tartja:

- **tervezés**: feladatok, függőségek, ütemterv, mérföldkövek,
- **végrehajtás**: ki min dolgozik, milyen állapotban van egy feladat,
- **kommunikáció**: hozzászólások, értesítések, fájlok egy helyen (13. témakör),
- **ellenőrzés**: haladás, burndown, irányítópultok, riportok (9. témakör),
- **nyomonkövethetőség**: ki, mikor, mit változtatott (változáskezelés, 14. témakör).

> Az eszköz **nem helyettesíti** a módszert. Egy rosszul felbontott projekt a legdrágább szoftverben is rosszul felbontott marad – csak szebben néz ki.

## Eszközcsoportok

| Csoport                         | Jellemző                                                         | Példák                                      |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **klasszikus ütemezők**         | Gantt, függőségek, kritikus út, erőforrás-kiegyenlítés, alapterv | MS Project, Primavera P6, ProjectLibre      |
| **agilis fejlesztői eszközök**  | backlog, sprintek, story pontok, burndown, hibakövetés           | Jira, Azure DevOps Boards, YouTrack, Linear |
| **vizuális (Kanban) táblák**    | oszlopok és kártyák, egyszerű, gyorsan tanulható                 | Trello, GitHub Projects, Kanbanize          |
| **munkamenedzsment-platformok** | sokféle nézet, automatizálás, csapatokon átívelő munka           | Asana, monday.com, ClickUp, Wrike           |
| **tudásbázis + feladatok**      | dokumentáció és egyszerű adatbázisok egy helyen                  | Notion, Confluence                          |

### Néhány ismert eszköz röviden

- **Microsoft Project**: a klasszikus, vízesés jellegű tervezés eszköze. Erős a hálótervezésben, kritikus útban, erőforrás-kezelésben és az **alapterv** (baseline) összevetésében – az EVM-hez (9. témakör) is jó.
- **Jira** (Atlassian): az agilis szoftverfejlesztés egyik legelterjedtebb eszköze. Scrum- és Kanban-táblák, **backlog**, sprintek, testreszabható **munkafolyamatok** (workflow), hibakövetés, burndown- és velocity-diagramok.
- **Trello**: Kanban-táblák kártyákkal; nagyon egyszerű, kis csapatoknak és személyes használatra ideális.
- **Asana**, **monday.com**, **ClickUp**: rugalmas munkamenedzsment lista-, tábla-, idővonal- és naptárnézettel, automatizálásokkal.
- **GitHub Projects**: a kódtároló **issue**-ihoz és **pull requestjeihez** kapcsolt táblák – a fejlesztők ott tervezhetnek, ahol a kód is van.
- **Notion**, **Confluence**: dokumentáció, jegyzőkönyvek, projektalapító okirat, döntési napló – a „projekt memóriája”.

## Nézetek: ugyanaz az adat, többféle kép

| Nézet                | Mire jó?                                                     | Kapcsolódó témakör |
| -------------------- | ------------------------------------------------------------ | ------------------ |
| **Gantt / idővonal** | ütemterv, függőségek, mérföldkövek, kritikus út              | 7. témakör         |
| **tábla (Kanban)**   | a munka áramlása oszlopokon át (Teendő → Folyamatban → Kész) | 11. témakör        |
| **lista / backlog**  | prioritás szerint rendezett feladatok                        | 8., 11. témakör    |
| **naptár**           | határidők, szabadságok, események                            | 9., 14. témakör    |
| **irányítópult**     | KPI-k, burndown, költségek, kockázatok egy pillantásra       | 8., 9. témakör     |

```text
 Tábla nézet:
 ┌─ Teendő ──────┐ ┌─ Folyamatban ─┐ ┌─ Ellenőrzés ─┐ ┌─ Kész ───────┐
 │ Regisztráció  │ │ Bejelentkezés │ │ Adatbázis    │ │ Projektváz   │
 │ Jelszó-reset  │ │ (WIP ≤ 2)     │ │ séma         │ │ CI beállítás │
 └───────────────┘ └───────────────┘ └──────────────┘ └──────────────┘
```

## Felhő vagy saját szerver?

- **SaaS (felhő)**: gyorsan indul, nincs üzemeltetés, előfizetéses díj (gyakran **felhasználónként havonta**).
- **saját szerveres** (on-premise, self-hosted): teljes kontroll az adatok felett, de üzemeltetni kell – pl. érzékeny adatoknál, szigorú szabályozásnál (GDPR, adatvédelmi előírások).

## Összefoglalás

- A PM-szoftver a tervezést, végrehajtást, kommunikációt és ellenőrzést egy helyen, közösen tartja.
- Csoportok: klasszikus ütemezők (MS Project), agilis eszközök (Jira), Kanban-táblák (Trello, GitHub Projects), munkamenedzsment-platformok (Asana, monday.com, ClickUp), tudásbázisok (Notion, Confluence).
- Nézetek: Gantt, tábla, lista, naptár, irányítópult.
- Az eszköz nem helyettesíti a módszert.

## A lecke feladata

```quiz required
? Egy építőipari jellegű, szigorúan ütemezett projektben kritikus utat és alaptervet kell követni. Melyik eszköz illik ide leginkább?
+ Microsoft Project
- Trello
- Notion
- Slack
! Klasszikus ütemező: Gantt, kritikus út, alapterv.

? Melyik eszköz kapcsolja a feladatokat közvetlenül a kódtároló issue-ihoz és pull requestjeihez?
- MS Project
- Trello
+ GitHub Projects
- Confluence
! A kód mellett tervezhetünk.

? Melyik nézet mutatja a munka **áramlását** oszlopokon át?
- Gantt-diagram
+ tábla (Kanban)
- naptár
- irányítópult
! Teendő → Folyamatban → Kész.

? Egy SaaS-eszköz ára felhasználónként havi 8 euró. Mennyi egy 12 fős csapat éves költsége euróban?
= 1152
! 8 · 12 · 12.

? Mi igaz a PM-szoftverekre?
- egy jó eszköz pótolja a hiányzó tervezést
+ az eszköz támogatja, de nem helyettesíti a módszert
- csak vízesés módszertannal használhatók
- csak nagyvállalatoknak valók
! Rossz felbontás a legjobb eszközben is rossz marad.
```
