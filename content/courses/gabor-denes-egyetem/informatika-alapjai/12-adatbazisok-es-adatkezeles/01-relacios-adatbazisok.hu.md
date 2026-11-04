---
title: Relációs adatbázisok
summary: Adatbázis és DBMS, tábla, rekord, mező, elsődleges és idegen kulcs, kapcsolattípusok.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi az **adatbázis** és az **adatbázis-kezelő rendszer** (DBMS),
- a relációs modell fogalmait: **tábla**, **rekord**, **mező**, **kulcs**,
- milyen **kapcsolatok** lehetnek a táblák között.

## Miért nem elég egy Excel-táblázat?

Egy táblázatkezelő kis adatmennyiségre jó, de ha sok felhasználó egyszerre ír, milliónyi sor van, vagy az adatok összefüggnek (hallgatók, tárgyak, jelentkezések), kell egy **adatbázis**: rendezetten, ismétlés nélkül tárolt, összefüggő adatok gyűjteménye. Az **adatbázis-kezelő rendszer** (DBMS) a program, amely tárolja, lekérdezi, védi és menti az adatokat, és gondoskodik róla, hogy egyszerre többen is biztonságosan dolgozhassanak.

Ismert relációs DBMS-ek: **PostgreSQL**, **MySQL / MariaDB**, **Microsoft SQL Server**, **Oracle**, **SQLite** (a telefonodban is ott van).

## A relációs modell

Az adatok **táblákban** (relációkban) vannak.

```text
 hallgatok
 ┌────────────┬──────────────┬──────────┬───────┐
 │ neptun (PK)│ nev          │ szak     │ felev │   ← mezők (oszlopok)
 ├────────────┼──────────────┼──────────┼───────┤
 │ ABC123     │ Kiss Anna    │ mérnökinf│   1   │   ← rekord (sor)
 │ XYZ789     │ Nagy Béla    │ mérnökinf│   3   │
 │ QWE456     │ Tóth Cili    │ gazdinfo │   1   │
 └────────────┴──────────────┴──────────┴───────┘
```

- **Mező** (oszlop, attribútum): egy tulajdonság, adott **típussal** (szöveg, egész szám, dátum…).
- **Rekord** (sor): egy egyed összes adata.
- **Elsődleges kulcs** (primary key, PK): a rekordot **egyértelműen** azonosító mező; nem lehet üres, és nem ismétlődhet (pl. Neptun-kód, termékazonosító).
- **Idegen kulcs** (foreign key, FK): egy másik tábla elsődleges kulcsára mutató mező – ez köti össze a táblákat.

## Kapcsolatok

| Kapcsolat | Példa                                               |
| --------- | --------------------------------------------------- |
| **1 : 1** | egy személy – egy személyi igazolvány               |
| **1 : N** | egy tanszék – sok oktató                            |
| **N : M** | sok hallgató – sok tárgy (egy **kapcsolótáblával**) |

Az N : M kapcsolatot egy harmadik tábla oldja fel:

```text
 hallgatok           jelentkezesek                 targyak
 ┌──────────┐       ┌──────────────┬───────────┐   ┌───────────┐
 │neptun(PK)│◄──────│neptun (FK)   │kod (FK)   │──►│kod (PK)   │
 │nev       │       │              │           │   │nev        │
 └──────────┘       └──────────────┴───────────┘   └───────────┘
```

## Normalizálás röviden

A **normalizálás** célja, hogy minden adat **egyszer** szerepeljen. Ha a tárgy nevét minden jelentkezésnél újra leírnánk, egy átnevezéskor száz helyen kellene javítani, és könnyen ellentmondás keletkezne. Helyette a tárgy neve egyszer van a `targyak` táblában, a jelentkezés csak a kódjára hivatkozik.

## Összefoglalás

- Adatbázis = összefüggő, rendezett adatok; DBMS = az ezeket kezelő program.
- Tábla, mező, rekord; elsődleges kulcs = egyedi azonosító, idegen kulcs = hivatkozás másik táblára.
- Kapcsolatok: 1:1, 1:N, N:M (kapcsolótáblával); normalizálás: minden adat egyszer.

## A lecke feladata

```quiz required
? Hogy hívják a tábla egy **sorát**?
+ rekord
- mező
- kulcs
- séma
! A mező az oszlop.

? Melyik mező lehet jó **elsődleges kulcs** egy hallgatói táblában?
- név
- születési év
+ Neptun-kód
- szak
! Egyedi, és nem üres.

? Milyen kapcsolat van a hallgatók és a tárgyak között (egy hallgató sok tárgyat vesz fel, egy tárgyat sok hallgató)?
- 1 : 1
- 1 : N
+ N : M
! Kapcsolótáblával valósítjuk meg.

? Hogy hívják azt a mezőt, amely egy másik tábla elsődleges kulcsára mutat?
= idegen kulcs
= foreign key
! FK.
```
