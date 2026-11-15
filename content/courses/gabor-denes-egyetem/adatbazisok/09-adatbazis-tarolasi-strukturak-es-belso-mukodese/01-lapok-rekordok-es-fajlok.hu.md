---
title: Lapok, rekordok és fájlok
summary: A memória és a lemez sebességkülönbsége, a lap (blokk) mint az olvasás egysége, a halomfájl és a rekordok elhelyezése, a sorazonosító (ctid), a nagy értékek tárolása (TOAST), valamint a sor- és oszlopalapú tárolás.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért a **lemez** a lassú pont, és hogyan alkalmazkodik ehhez a DBMS,
- mi a **lap** (blokk), és hogyan helyezkednek el benne a rekordok,
- mi a különbség a **sor-** és az **oszlopalapú** tárolás között.

## Miért fontos ez?

Eddig a táblákat „logikai” szemmel néztük. Most bekukkantunk a motorháztető alá – ez a háromszintű architektúra **belső szintje**. Nem kell fejből tudnod minden részletet, de ha érted, miért gyors vagy lassú valami, sokkal jobb adatbázist fogsz tervezni.

## A memória és a lemez

| Tároló               | Hozzáférési idő (nagyságrend) | Ha 1 ns = 1 másodperc lenne |
| -------------------- | ----------------------------- | --------------------------- |
| CPU gyorsítótár      | ~1 ns                         | 1 másodperc                 |
| RAM                  | ~100 ns                       | kb. 2 perc                  |
| NVMe SSD             | ~20 000 ns (20 µs)            | kb. 6 óra                   |
| Merevlemez (HDD)     | ~5 000 000 ns (5 ms)          | kb. 2 hónap                 |

Az adatbázis tartós (lemezen van), de a lemez **nagyságrendekkel** lassabb a memóriánál. Ezért a DBMS minden trükkje arról szól, hogy **minél kevesebbszer** kelljen a lemezhez nyúlni.

## A lap (blokk) – az olvasás egysége

A DBMS nem bájtonként, hanem **lapokban** (_page_, _block_) olvas és ír. PostgreSQL-ben egy lap **8 KB**. Ha egyetlen sort kérsz, akkor is a teljes lap kerül a memóriába – mint amikor egy könyvből nem egy szót, hanem egy egész oldalt fénymásolsz.

Egy lap felépítése (egyszerűsítve):

```text
 ┌──────────────────────────────────────────────┐
 │ fejléc (lap adatai)                          │
 │ mutatók: [1]→  [2]→  [3]→  …                  │  ← elejétől lefelé nő
 │                                              │
 │               (szabad hely)                  │
 │                                              │
 │  … [rekord 3] [rekord 2] [rekord 1]          │  ← végétől felfelé nő
 └──────────────────────────────────────────────┘
```

A mutatók és a rekordok két irányból nőnek egymás felé, a szabad hely középen van. Ha a lap megtelt, a következő sor új lapra kerül.

## Halomfájl és sorazonosító

Egy tábla lapok sorozata egy fájlban. Index nélkül a sorok **nincsenek rendezve**: az új sor oda kerül, ahol hely van – ezért hívják **halomfájlnak** (_heap file_). Ezért kell a lekérdezésben `ORDER BY`, ha sorrendet szeretnél!

Minden sornak van fizikai címe: **melyik lap, azon belül hányadik hely**. PostgreSQL-ben ez a rejtett `ctid` oszlop, és pontosan ezt tárolja az index is (kulcs → ctid).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT ctid, neptun, nev FROM hallgatok;
```

A `(0,1)` azt jelenti: 0. lap, 1. hely. Most módosíts egy sort, és nézd meg újra:

```sql run
UPDATE hallgatok SET felev = 4 WHERE neptun = 'ABC123';
SELECT ctid, neptun, nev, felev FROM hallgatok;
```

Anna sora **új helyre** került! A PostgreSQL módosításkor nem írja felül a régi sort, hanem új verziót készít (ez az MVCC, 3. lecke).

```sql run
SELECT pg_size_pretty(pg_relation_size('hallgatok')) AS tabla_merete,
       pg_size_pretty(pg_total_relation_size('hallgatok')) AS indexekkel;
```

## Nagy értékek: TOAST

Mi van, ha egy sor nagyobb egy lapnál (pl. egy hosszú szöveg vagy JSON)? A PostgreSQL a nagy mezőket **tömöríti**, és ha még mindig nagyok, egy külön „mellék” táblába darabolja (ezt hívják **TOAST**-nak – _The Oversized-Attribute Storage Technique_). A fő sorban csak egy hivatkozás marad. Ezért nem lassul le a tábla végigolvasása attól, hogy valamelyik oszlopban hosszú szövegek vannak.

## Sor- vagy oszlopalapú tárolás?

```text
 Sor alapú (PostgreSQL, MySQL):       Oszlop alapú (ClickHouse, Redshift):
 lap 1: [ABC123, Kiss Anna, 3, …]     neptun:  [ABC123, BCD234, CDE345, …]
        [BCD234, Nagy Béla, 1, …]     nev:     [Kiss Anna, Nagy Béla, …]
        [CDE345, Tóth Cili, 3, …]     felev:   [3, 1, 3, 5, 1, 3, …]
```

- **Sor alapú**: egy sor minden adata egymás mellett. Ideális, ha **egész sorokat** olvasol és írsz (egy rendelés adatai) – ez az **OLTP**.
- **Oszlop alapú**: egy oszlop minden értéke egymás mellett. Ideális, ha **kevés oszlopot, de rengeteg sort** olvasol („mennyi az összes eladás átlaga?”) – ez az **OLAP** (18. témakör). Ráadásul az egyforma típusú, hasonló értékek nagyon jól **tömöríthetők**.

## Összefoglalás

- A lemez nagyságrendekkel lassabb a memóriánál → a cél a lemezműveletek számának csökkentése.
- Lap (PostgreSQL: 8 KB) = az olvasás és írás egysége.
- Halomfájl: rendezetlen sorok; minden sornak fizikai címe van (ctid), ezt tárolja az index.
- TOAST: nagy értékek tömörítve, külön tárolva.
- Sor alapú → OLTP, oszlop alapú → OLAP.

## A lecke feladata

```quiz required
? Mekkora egy lap (blokk) a PostgreSQL-ben?
- 512 bájt
- 1 KB
+ 8 KB
- 1 MB
! Ez az olvasás és írás alapegysége.

? Körülbelül hány 100 bájtos sor fér el egy 8192 bájtos lapon (a fejlécet most hagyd figyelmen kívül, lefelé kerekítve)?
= 81
! 8192 / 100 = 81,92 → 81.

? Egy 1 000 000 soros tábla egy lapjára átlagosan 50 sor fér. Hány lapból áll a tábla?
= 20000
= 20 000
! 1 000 000 / 50.

? Miért nem garantált a sorok sorrendje `ORDER BY` nélkül?
+ mert a halomfájlban a sorok oda kerülnek, ahol hely van
- mert a DBMS véletlenszerűen keveri őket
- mert a lapok mérete változik
- mert az SQL nem ismeri a sorrendet
! Ráadásul módosításkor a sor új helyre is kerülhet.

? Melyik tárolási mód előnyös, ha milliárd sorból egyetlen oszlop átlagát számolod?
- sor alapú
+ oszlop alapú
! Csak azt az egy oszlopot kell beolvasni.
```
