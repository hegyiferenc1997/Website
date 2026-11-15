---
title: OLTP és OLAP – két világ
summary: Mi a különbség a napi működést kiszolgáló (OLTP) és az elemzést kiszolgáló (OLAP) adatbázisok között: terhelés, lekérdezések, séma, tárolás; miért külön rendszerben elemzünk, mi az adattárház, az adattó és a lakehouse.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi az **OLTP** és az **OLAP**, és miben különböznek,
- miért nem futtatjuk az elemzéseket az éles adatbázison,
- mi az **adattárház**, az **adattó** és a **lakehouse**.

## Két nagyon különböző feladat

Képzeld el egy webshop két „felhasználóját”:

- **Vásárló Vera** belép, kosárba tesz egy egeret, fizet. Ehhez néhány sort kell olvasni és írni, **ezredmásodpercek** alatt – és ugyanezt egyszerre ezrek csinálják.
- **Elemző Ernő** azt kérdezi: „Hogyan alakult a bevétel kategóriánként és régiónként az elmúlt két évben, negyedévenként?” Ehhez **milliónyi** sort kell végigolvasni és összegezni – viszont ritkán, és lehet hozzá pár másodperc.

A két feladatra kétféle rendszer született:

| Szempont             | **OLTP** (_Online Transaction Processing_)                   | **OLAP** (_Online Analytical Processing_)         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| Cél                  | a napi működés: rendelés, foglalás, jegybeírás               | elemzés, riport, döntéstámogatás                  |
| Tipikus művelet      | sok rövid tranzakció: `INSERT`, `UPDATE`, pár soros `SELECT` | kevés, de hatalmas `SELECT` összesítéssel         |
| Egy lekérdezés érint | néhány sort                                                  | milliónyi sort, de kevés oszlopot                 |
| Felhasználók         | sok ezer (ügyfelek, alkalmazások)                            | kevés (elemzők, vezetők, riportok)                |
| Adat                 | a **jelen** állapot, mindig friss                            | **történeti** adat, évekre visszamenőleg          |
| Séma                 | normalizált (3NF, 6. témakör)                                | denormalizált, csillagséma (2. lecke)             |
| Tárolás              | sor alapú (9. témakör)                                       | gyakran oszlop alapú, erős tömörítéssel           |
| Fontos mérőszám      | tranzakció/másodperc, válaszidő                              | lekérdezés ideje nagy adaton                      |
| Példák               | PostgreSQL, MySQL, SQL Server, Oracle                        | Snowflake, BigQuery, Redshift, ClickHouse, DuckDB |

## Miért nem elemzünk az éles adatbázison?

Kis rendszernél lehet – de ahogy nő az adat, három gond jön elő:

1. **Teljesítmény**: Ernő egy óriási összesítő lekérdezése elviszi a lemez és a processzor erejét, Vera kosara pedig belassul. A vásárlók nem várnak.
2. **Szerkezet**: a normalizált sémán egy riporthoz tíz táblát kell összekapcsolni; az elemzéshez kényelmesebb, „lapos” szerkezet kell.
3. **Történet és több forrás**: az OLTP a jelent tárolja (a termék mai árát), az elemzéshez a múlt is kell. Ráadásul az adatok több rendszerből jönnek (webshop, raktár, könyvelés, marketing).

Ezért az elemzéshez az adatokat **külön rendszerbe** másoljuk (ETL/ELT vagy CDC, 17. témakör).

## Adattárház, adattó, lakehouse

- **Adattárház** (_data warehouse_): több forrásból összegyűjtött, **megtisztított, egységes szerkezetű**, történeti adat, kifejezetten elemzésre tervezve (csillagséma). Itt mindennek pontos jelentése van: „bevétel” mindenhol ugyanazt jelenti.
- **Adattó** (_data lake_): a **nyers** adat tárolója, szinte bármilyen formában (CSV, JSON, naplók, képek), olcsó objektumtárban (13. témakör). Rugalmas, de ha nincs rendben tartva, „adatmocsárrá” (_data swamp_) válik.
- **Lakehouse**: a kettő ötvözete: az adat az olcsó objektumtárban van (pl. Parquet fájlokban), de olyan táblaformátummal (pl. Delta Lake, Apache Iceberg), amely tranzakciókat és SQL-lekérdezést is lehetővé tesz.

```text
  [webshop DB] ─┐
  [raktár DB]  ─┼─► ETL / ELT ─► [ adattárház ] ─► riportok, irányítópultok, elemzések
  [könyvelés]  ─┘                     ▲
  [naplók, kattintások] ─► [ adattó ] ┘
```

Az adattárház egy kisebb, egy-egy területre (pl. csak értékesítés) szabott szeletét **adatpiacnak** (_data mart_) nevezik.

## A HTAP – a kettő egyben?

Léteznek **HTAP** (_Hybrid Transactional/Analytical Processing_) rendszerek is, amelyek ugyanazon az adaton mindkét terhelést igyekeznek kiszolgálni (pl. egy sor alapú és egy oszlop alapú másolatot tartanak szinkronban). Ezek még speciális esetekre valók – a legtöbb helyen a két világ külön rendszerben él.

## Összefoglalás

- OLTP: sok kis tranzakció, friss adat, normalizált séma, sor alapú tárolás.
- OLAP: kevés nagy, összesítő lekérdezés, történeti adat, denormalizált séma, gyakran oszlop alapú tárolás.
- Az elemzés külön rendszerben fut, hogy ne lassítsa a napi működést.
- Adattárház: tiszta, egységes, elemzésre kész; adattó: nyers és olcsó; lakehouse: a kettő ötvözete.

## A lecke feladata

```quiz required
? Melyik tipikusan OLTP-művelet?
+ egy vásárló leadja a rendelését, és a készlet csökken
- az elmúlt öt év bevételének elemzése régiónként
- egy negyedéves vezetői riport elkészítése
- milliónyi kattintás összesítése termékenként
! Rövid tranzakció, néhány sor írása.

? Miért nem érdemes nagy elemző lekérdezéseket az éles webshop-adatbázison futtatni?
- mert az SQL nem tud összesíteni
+ mert elvennék az erőforrást a vásárlók tranzakcióitól, és lassítanák a napi működést
- mert az éles adatbázisban nincs adat
- mert az OLTP adatbázis csak írni tud
! Ezért másoljuk az adatot egy külön elemző rendszerbe.

? Milyen tárolás jellemző az OLAP rendszerekre?
- sor alapú, tömörítés nélkül
+ oszlop alapú, erős tömörítéssel
- csak memóriabeli kulcs-érték tárolás
! Kevés oszlop, rengeteg sor: csak a szükséges oszlopokat kell beolvasni.

? Mi a különbség az adattárház és az adattó között?
+ az adattárház tisztított, egységes szerkezetű adatot tárol elemzésre, az adattó nyers adatot szinte bármilyen formában
- az adattó mindig drágább
- az adattárház csak képeket tárolhat
- nincs különbség
! Az adattó olcsó és rugalmas, de rendben kell tartani.

? Melyik séma jellemző inkább az OLTP adatbázisokra?
+ normalizált (pl. 3NF)
- csillagséma
- egyetlen, minden adatot tartalmazó tábla
! Az ismétlődés kerülése a gyakori írások miatt fontos.
```
