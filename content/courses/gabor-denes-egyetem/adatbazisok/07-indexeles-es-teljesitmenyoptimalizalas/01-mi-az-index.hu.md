---
title: Mi az index, és miért gyorsít?
summary: A teljes táblaolvasás és az index különbsége, a bináris keresés és a B-fa ötlete, hány lépés kell egymillió sorhoz, és mibe kerül egy index.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- miért lassú egy keresés index **nélkül**,
- hogyan gyorsít az **index** (bináris keresés, B-fa),
- mennyit **nyerünk** vele, és mibe **kerül**.

## A könyv tárgymutatója

Egy 800 oldalas tankönyvben keresed a „normalizálás” szót. Két lehetőséged van:

1. Átlapozod **mind a 800 oldalt** (biztos megtalálod, de sokáig tart).
2. Hátul megnézed a **tárgymutatót**: ábécérendben ott a szó, mellette az oldalszám (152, 307). Két lépés, és ott vagy.

Az adatbázis **indexe** pontosan ilyen tárgymutató: egy külön, **rendezett** szerkezet, amely egy oszlop értékeit és a hozzájuk tartozó sorok **helyét** tárolja.

## Index nélkül: teljes táblaolvasás

Ha nincs index, a DBMS-nek minden sort meg kell néznie: ez a **teljes táblaolvasás** (_full table scan_, PostgreSQL-ben _Seq Scan_). 20 000 rendelésnél ez még gyors, de 200 millió sornál, másodpercenként ezer kérésnél már nem.

## Bináris keresés – a gyorsítás titka

Az index **rendezett**, ezért **bináris kereséssel** lehet benne keresni: megnézed a középső elemet, és eldöntöd, hogy a keresett érték előtte vagy utána van. Minden lépés **felezi** a hátralévő részt – mint a „gondoltam egy számra 1 és 100 között” játék.

| Sorok száma   | Teljes olvasás (legrosszabb eset) | Bináris keresés (kb. log₂ n lépés) |
| ------------- | --------------------------------- | ---------------------------------- |
| 1 000         | 1 000                             | 10                                 |
| 1 000 000     | 1 000 000                         | 20                                 |
| 1 000 000 000 | 1 000 000 000                     | 30                                 |

Ezerszer több adat → csak **10 lépéssel** több. Ezért van az, hogy egy jól indexelt táblában egymilliárd sor között is ezredmásodpercek alatt találunk meg valamit.

## B-fa: az index szerkezete

A legtöbb DBMS alapértelmezett indexe a **B-fa** (pontosabban B+-fa). Ez egy kiegyensúlyozott, nagyon „lapos” fa: egy csomópontban nem kettő, hanem **több száz** kulcs is elfér (egy lemezlap mérete, pl. 8 KB). Így a fa magassága 3–4 szint még milliárd sornál is.

```text
                        [ 500 | 1000 ]                    ← gyökér
              ┌────────────┼────────────┐
         [100|200|…]   [600|700|…]   [1100|…]            ← belső csomópontok
          │                │
   [ 1..99 → sorok ]  [ 600..699 → sorok ]  …             ← levelek: kulcs + sor helye,
                                                            összeláncolva (tartományokhoz)
```

A levelek **össze vannak láncolva**, ezért a B-fa nemcsak egyenlőségre (`= 42`), hanem **tartományra** (`BETWEEN`, `<`, `>`) és **rendezésre** (`ORDER BY`) is jó. A részletekkel a 9. témakör foglalkozik.

## Mibe kerül az index?

Az index nem ingyenes:

- **Tárhely**: egy index akár akkora is lehet, mint maga a tábla.
- **Lassabb írás**: minden `INSERT`, `UPDATE`, `DELETE` az indexet is frissíti. Tíz index egy táblán = minden beszúrás tizenegy szerkezetet módosít.
- **Karbantartás**: az indexek idővel „felpuffadhatnak”, néha újra kell építeni őket.

Ezért **nem** teszünk indexet minden oszlopra, csak oda, ahol a lekérdezések tényleg keresnek, rendeznek vagy összekapcsolnak.

## Amit a DBMS magától indexel

- az **elsődleges kulcsot** (mindig),
- a **`UNIQUE`** megszorítású oszlopokat (az egyediséget is index segítségével ellenőrzi).

Az **idegen kulcsokra** a PostgreSQL **nem** tesz automatikusan indexet – pedig a JOIN-ok gyakran ezeken mennek. Ezt neked kell megtenned (következő lecke).

## Összefoglalás

- Index nélkül: teljes táblaolvasás, minden sort megnéz.
- Az index rendezett szerkezet (B-fa), bináris kereséssel ~log₂ n lépés.
- Ára: tárhely és lassabb írás – csak oda tegyél, ahol a lekérdezések használják.
- A PK és a UNIQUE automatikusan indexelt, az idegen kulcs nem.

## A lecke feladata

```quiz required
? Hogy hívjuk, amikor a DBMS a tábla minden sorát végignézi?
- index scan
+ teljes táblaolvasás (full table scan)
- bináris keresés
- normalizálás
! PostgreSQL-ben a lekérdezéstervben Seq Scan néven jelenik meg.

? Körülbelül hány lépés kell bináris kereséssel egy 1 000 000 elemű rendezett listában?
= 20
! 2^20 ≈ 1 048 576.

? Körülbelül hány lépés kell 1 000 000 000 (egymilliárd) elemnél?
= 30
! 2^30 ≈ 1,07 milliárd.

? Mi az index **hátránya**?
- lassítja az összes SELECT-et
+ lassítja az írást (INSERT, UPDATE, DELETE) és tárhelyet foglal
- megszünteti az elsődleges kulcsot
- csak szöveges oszlopon működik
! Minden módosításkor az indexet is frissíteni kell.

? Melyikre tesz a PostgreSQL **automatikusan** indexet?
+ az elsődleges kulcsra
- minden idegen kulcsra
- minden szöveges oszlopra
- a legtöbbször lekérdezett oszlopra
! A PK-ra és a UNIQUE oszlopokra igen, az idegen kulcsra nem.
```
