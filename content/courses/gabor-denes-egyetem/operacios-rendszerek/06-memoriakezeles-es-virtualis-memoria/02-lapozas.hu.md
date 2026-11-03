---
title: Lapozás és címfordítás
summary: Lapok és keretek, a laptábla, a logikai cím felbontása lapszámra és eltolásra, a TLB és a többszintű laptábla.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **lap** és a **keret**, és hogyan szünteti meg a lapozás a külső töredezettséget,
- hogyan bontod fel a logikai címet **lapszámra** és **eltolásra**, és hogyan számolod ki a fizikai címet,
- mi a **TLB**, és miért kell **többszintű** laptábla.

## Lapok és keretek

A **lapozás** (_paging_) lényege: a folyamat logikai címterét egyforma méretű **lapokra** (_page_), a fizikai memóriát ugyanekkora **keretekre** (_frame_) osztjuk. Bármelyik lap bármelyik szabad keretbe kerülhet – a folyamatnak **nem kell egy darabban** lennie, így **nincs külső töredezettség**.

Tipikus lapméret: **4 KB** (4096 bájt); léteznek nagy lapok is (2 MB, 1 GB).

A **laptábla** (_page table_) folyamatonként mondja meg, melyik lap melyik keretben van:

| Lap | Keret |
| --- | ----- |
| 0   | 3     |
| 1   | 1     |
| 2   | 5     |
| 3   | 2     |

## A címfordítás

A logikai cím két részből áll:

```text
logikai cím = [ lapszám (p) | eltolás (d) ]
p = cím div lapméret      (egész osztás)
d = cím mod lapméret      (maradék)
fizikai cím = keret(p) · lapméret + d
```

**Példa** – lapméret 4096 bájt, a fenti laptábla, logikai cím **8200**:

1. p = 8200 div 4096 = **2**, d = 8200 − 2 · 4096 = **8**.
2. A laptábla szerint a 2. lap az **5.** keretben van.
3. Fizikai cím = 5 · 4096 + 8 = 20 480 + 8 = **20 488**.

### Bitekben

Ha a lapméret 2 hatványa, a felbontás csak **bitek szétválasztása**. 32 bites címnél és 4 KB-os (2¹² bájtos) lapnál:

- az eltolás **12** bit,
- a lapszám 32 − 12 = **20** bit → 2²⁰ = **1 048 576** lap → ennyi bejegyzés kell a laptáblában.

Ha egy bejegyzés 4 bájt, egy folyamat laptáblája 4 MB lenne – ezért használnak **többszintű** laptáblát: csak a ténylegesen használt részekhez készül alsóbb szintű tábla. A mai 64 bites x86 processzorok 4 (vagy 5) szintet használnak.

## Belső töredezettség lapozásnál

Az utolsó lap általában nem telik meg. Egy 10 000 bájtos program 4096 bájtos lapokkal 3 lapot kap (12 288 bájt), a 2288 bájt **belső töredezettség**.

## TLB – a címfordítás gyorsítótára

A laptábla a memóriában van, tehát minden memória-hozzáféréshez **még egy** (többszintűnél több) memóriaolvasás kellene. A megoldás a **TLB** (_Translation Lookaside Buffer_): kicsi, nagyon gyors gyorsítótár az MMU-ban, amely a legutóbbi lap → keret párokat tárolja.

- **TLB-találat**: a fordítás azonnal megvan.
- **TLB-hiány**: ki kell olvasni a laptáblából, és beírni a TLB-be.

A programok **lokalitása** miatt (ugyanazokat a lapokat használják újra és újra) a találati arány tipikusan 99% fölötti.

## Védelem a laptáblában

Minden bejegyzésben **bitek** is vannak: **érvényes** (a lap a folyamathoz tartozik-e), **írható**, **végrehajtható**, **felhasználói** (elérheti-e felhasználói módú kód). A kódlap például csak olvasható és végrehajtható, a verem írható, de nem végrehajtható.

## Összefoglalás

- Lapozás: lapok (logikai) és keretek (fizikai) egyforma méretben; nincs külső töredezettség.
- p = cím div lapméret, d = cím mod lapméret, fizikai = keret · lapméret + d.
- 32 bites cím, 4 KB lap → 12 bit eltolás, 20 bit lapszám.
- A TLB gyorsítja a fordítást; a többszintű laptábla helyet takarít meg.

## A lecke feladata

A lapméret **1024 bájt**. A laptábla: 0. lap → 4. keret, 1. lap → 9. keret, 2. lap → 0. keret, 3. lap → 7. keret.

```quiz required
? Hányadik lapra esik a 3075-ös logikai cím?
= 3
! 3075 div 1024 = 3.

? Mennyi a 3075-ös cím eltolása a lapon belül?
= 3
! 3075 − 3 · 1024 = 3.

? Mi a 3075-ös logikai cím fizikai címe?
= 7171
! A 3. lap a 7. keretben van: 7 · 1024 + 3 = 7171.

? 32 bites címek és 4 KB-os lapok esetén hány bites az eltolás?
= 12
! 4096 = 2¹², a lapszám 20 bites.

? Mire való a TLB?
- A lemezről beolvasott fájlok gyorsítótárazására.
+ A legutóbbi lap → keret fordítások gyors tárolására.
- A folyamatok ütemezésére.
- A megszakítások sorba állítására.
! Translation Lookaside Buffer – az MMU része.
```
