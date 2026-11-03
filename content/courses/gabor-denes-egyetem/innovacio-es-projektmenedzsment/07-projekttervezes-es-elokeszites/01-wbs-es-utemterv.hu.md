---
title: Projekttervezési módszerek – WBS és ütemterv
summary: A munkalebontási struktúra (WBS) és a 100%-os szabály, munkacsomagok, tevékenységlista, a tevékenységek közötti függőségek (FS, SS, FF, SF) és a Gantt-diagram elkészítése.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan bontsd le a projektet egy **munkalebontási struktúrával** (WBS),
- mi a **100%-os szabály** és a **munkacsomag**,
- milyen **függőségek** lehetnek a tevékenységek között,
- hogyan lesz a WBS-ből **Gantt-diagram**.

## A tervezés lépései

```text
 terjedelem → WBS → tevékenységlista → függőségek → időtartam-becslés
           → hálóterv, kritikus út → Gantt-diagram → erőforrás- és költségterv
```

## Munkalebontási struktúra (WBS)

A **WBS** (_Work Breakdown Structure_) a projekt **teljes munkáját** hierarchikusan, egyre kisebb részekre bontja. A legalsó szint a **munkacsomag** (_work package_): akkora rész, amelyre már megbízhatóan becsülhető az idő és a költség, és egy felelőshöz rendelhető.

Példa: egy egyetemi kurzusregisztrációs webalkalmazás

```text
 1. Kurzusregisztrációs rendszer
 ├── 1.1 Projektmenedzsment
 │    ├── 1.1.1 Tervezés
 │    └── 1.1.2 Státuszjelentések
 ├── 1.2 Követelmények
 │    ├── 1.2.1 Interjúk a hallgatókkal és az oktatókkal
 │    └── 1.2.2 Követelményspecifikáció
 ├── 1.3 Fejlesztés
 │    ├── 1.3.1 Adatbázis
 │    ├── 1.3.2 Szerveroldal (API)
 │    └── 1.3.3 Felhasználói felület
 ├── 1.4 Tesztelés
 │    ├── 1.4.1 Automatizált tesztek
 │    └── 1.4.2 Felhasználói elfogadási teszt
 └── 1.5 Bevezetés
      ├── 1.5.1 Telepítés
      └── 1.5.2 Oktatás, dokumentáció
```

Szabályok:

- **100%-os szabály**: a WBS a projekt munkájának **pontosan 100%-át** tartalmazza – semmi sem maradhat ki, és semmi felesleges nem kerülhet bele. Minden szülőelem a gyermekei összege.
- **Eredmény-, nem tevékenységközpontú**: az elemek főnevek (mit kell elkészíteni), nem igék.
- **8/80-as ökölszabály**: egy munkacsomag legalább 8, legfeljebb 80 munkaóra legyen.
- A WBS minden eleméhez tartozik egy **WBS-szótár** bejegyzés: leírás, felelős, elfogadási feltétel.

## Tevékenységlista és függőségek

A munkacsomagokat **tevékenységekre** bontjuk (igékkel: „adatbázis-séma megtervezése”), majd meghatározzuk, milyen sorrendben következnek. A négy függőségtípus:

| Típus                        | Jelentés                                  | Példa                                       |
| ---------------------------- | ----------------------------------------- | ------------------------------------------- |
| **FS** (befejezés–kezdés)    | B csak akkor kezdődhet, ha A befejeződött | előbb fejlesztés, utána tesztelés           |
| **SS** (kezdés–kezdés)       | B akkor kezdődhet, ha A elkezdődött       | a dokumentáció írása a fejlesztéssel indul  |
| **FF** (befejezés–befejezés) | B akkor fejeződhet be, ha A befejeződött  | a tesztelés csak a fejlesztés után zárul    |
| **SF** (kezdés–befejezés)    | B akkor fejeződhet be, ha A elkezdődött   | a régi rendszer leállhat, ha az új elindult |

A leggyakoribb az **FS**. Egy függőséghez **késleltetés** (_lag_) is tartozhat: pl. „a festék száradása miatt +2 nap”.

## Időtartam-becslés

- **Analóg becslés**: egy korábbi, hasonló projekt alapján.
- **Paraméteres becslés**: egységnyi adatból (pl. 1 képernyő = 3 nap → 10 képernyő = 30 nap).
- **Szakértői becslés** és **Delphi-módszer** (névtelen, több körös szakértői egyeztetés).
- **Hárompontos (PERT) becslés**: optimista, legvalószínűbb és pesszimista érték – a 9. témakörben számolunk vele.

## Gantt-diagram

A tevékenységek, függőségek és időtartamok ismeretében elkészül a **Gantt-diagram** (6. témakör): a sávok a tevékenységek, a nyilak a függőségek, a ◆ a mérföldkövek. Ez a projekt legismertebb kommunikációs eszköze, mert egy pillantással látható, mi mikor történik.

## Összefoglalás

- A WBS a projekt teljes munkáját hierarchikusan lebontja; a legalsó szint a munkacsomag.
- 100%-os szabály: semmi sem maradhat ki, semmi felesleges nem kerülhet be.
- Függőségek: FS (leggyakoribb), SS, FF, SF; lehet késleltetésük.
- Becslés: analóg, paraméteres, szakértői, hárompontos.
- A Gantt-diagram a tevékenységeket idővonalon ábrázolja.

## A lecke feladata

```quiz required
? Mit mond ki a WBS **100%-os szabálya**?
+ a WBS a projekt teljes munkáját tartalmazza, semmi sem maradhat ki és semmi felesleges nem kerülhet bele
- a projektnek 100%-ban határidőre kell elkészülnie
- minden munkacsomag 100 óra
- a költségvetést 100%-ig fel kell használni
! Minden szülőelem pontosan a gyermekei összege.

? Hogy hívják a WBS legalsó szintjén lévő elemet?
- mérföldkő
+ munkacsomag
- szponzor
- sprint
! Work package: becsülhető, egy felelőshöz rendelhető.

? „A tesztelés csak akkor kezdődhet, ha a fejlesztés befejeződött.” Milyen függőség ez?
+ FS (befejezés–kezdés)
- SS (kezdés–kezdés)
- FF (befejezés–befejezés)
- SF (kezdés–befejezés)
! Finish-to-Start, a leggyakoribb típus.

? Paraméteres becslés: 1 képernyő elkészítése 3 nap. Hány nap 12 képernyő?
= 36
= 36 nap
! 12 · 3.

? A 8/80-as ökölszabály szerint legfeljebb hány munkaóra legyen egy munkacsomag?
= 80
= 80 óra
! Legalább 8, legfeljebb 80 óra.
```
