---
title: A relációs DBMS-ek
summary: A PostgreSQL, a MySQL/MariaDB, a Microsoft SQL Server, az Oracle Database és az SQLite bemutatása: erősségek, tipikus felhasználás, licencek, valamint az SQL-nyelvjárások különbségei (lapozás, automatikus azonosító, szövegösszefűzés).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- melyek a legelterjedtebb **relációs DBMS-ek**, és miben erősek,
- mit jelent a **nyílt forráskódú** és a **kereskedelmi** licenc,
- hogy az SQL szabványos, de minden DBMS-nek van saját **nyelvjárása**.

## Az öt nagy

| DBMS                     | Licenc                                              | Erősségei                                                                                                | Tipikus helye                               |
| ------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **PostgreSQL**           | nyílt (PostgreSQL License)                          | szabványkövető, nagyon sok funkció (JSONB, ablakfüggvények, bővítmények: PostGIS, TimescaleDB, pgvector) | webalkalmazások, startupok, adatelemzés     |
| **MySQL** / **MariaDB**  | nyílt (GPL) + kereskedelmi változat                 | egyszerű, gyors olvasás, hatalmas közösség, sok tárhely kínálja                                          | weboldalak (WordPress), webshopok           |
| **Microsoft SQL Server** | kereskedelmi (ingyenes Express/Developer kiadással) | szoros integráció a Microsoft-világgal (.NET, Azure, Power BI), jó eszközök                              | vállalati rendszerek, Windows-környezet     |
| **Oracle Database**      | kereskedelmi                                        | nagyvállalati funkciók, óriási terhelés, fürtözés (RAC), régi, bevált                                    | bankok, telekom, kormányzat                 |
| **SQLite**               | közkincs (_public domain_)                          | **nincs szerver**: egyetlen fájl, beágyazható, nulla beállítás                                           | mobilalkalmazások, böngészők, kis programok |

Néhány érdekesség:

- Az **SQLite** a világ legtöbbször telepített adatbázisa: ott van minden okostelefonban, minden böngészőben, sok autóban és repülőgépen. Nem helyettesíti a szervert (egyszerre egy író lehet), de egy alkalmazás saját adatainak tökéletes.
- A **MariaDB** a MySQL „testvére”: az eredeti MySQL-fejlesztők indították, miután az Oracle megvette a MySQL-t.
- A **PostgreSQL**-t évek óta a fejlesztők egyik legkedveltebb adatbázisaként tartják számon – és ez fut ebben a tananyagban is, a böngésződben.

## Nyílt forráskód vagy kereskedelmi licenc?

| Szempont           | Nyílt forráskódú (PostgreSQL, MySQL, MariaDB) | Kereskedelmi (Oracle, SQL Server)            |
| ------------------ | --------------------------------------------- | -------------------------------------------- |
| Licencdíj          | nincs                                         | gyakran processzormagonként, jelentős összeg |
| Támogatás          | közösség, illetve fizetős támogató cégek      | a gyártótól, szerződéssel                    |
| Függés a gyártótól | kicsi: a kód bárki számára elérhető           | nagyobb (_vendor lock-in_)                   |
| Speciális funkciók | bővítményekkel nagyon sok                     | sok beépített nagyvállalati funkció          |

A „licencdíj nélkül” nem jelenti, hogy „ingyen van”: az üzemeltetés, a szakember és a támogatás itt is pénzbe kerül. Ezt hívják a **teljes birtoklási költségnek** (_TCO, Total Cost of Ownership_).

## SQL-nyelvjárások

Az SQL szabványos (ISO/IEC 9075), de minden DBMS bővíti, és néhol eltér tőle. Ha egyik rendszerről a másikra költözöl (17. témakör), ezekre figyelned kell:

| Feladat               | PostgreSQL                          | MySQL / MariaDB                    | SQL Server       | Oracle                            |
| --------------------- | ----------------------------------- | ---------------------------------- | ---------------- | --------------------------------- |
| első 5 sor            | `LIMIT 5`                           | `LIMIT 5`                          | `SELECT TOP 5 …` | `FETCH FIRST 5 ROWS ONLY`         |
| automatikus azonosító | `GENERATED … AS IDENTITY`, `SERIAL` | `AUTO_INCREMENT`                   | `IDENTITY(1,1)`  | `GENERATED … AS IDENTITY`         |
| szövegek összefűzése  | `'a' \|\| 'b'`                      | `CONCAT('a', 'b')`                 | `'a' + 'b'`      | `'a' \|\| 'b'`                    |
| aktuális időpont      | `now()`                             | `NOW()`                            | `GETDATE()`      | `SYSDATE`                         |
| logikai típus         | `BOOLEAN`                           | `BOOLEAN` (valójában `TINYINT(1)`) | `BIT`            | `BOOLEAN` (csak újabb verziókban) |

A jó hír: a **szabványos** alakok egyre több helyen működnek. A PostgreSQL például a szabványos `FETCH FIRST`-öt és az `IDENTITY`-t is ismeri:

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT neptun, nev, felev
FROM hallgatok
ORDER BY nev
FETCH FIRST 3 ROWS ONLY;      -- szabványos, ugyanaz, mint a LIMIT 3
```

```sql run
CREATE TABLE oktatok (
  id  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- szabványos automatikus azonosító
  nev VARCHAR(40) NOT NULL
);
INSERT INTO oktatok (nev) VALUES ('Dr. Példa Péter'), ('Dr. Minta Mária');
SELECT * FROM oktatok;
```

```sql run
SELECT version();
```

> Tanács: ha lehet, írj **szabványos SQL-t**, és a DBMS-specifikus funkciókat (pl. JSONB) tudatosan, egy helyen használd. Így egy későbbi költözés sokkal kevésbé fáj.

## Összefoglalás

- PostgreSQL: nyílt, szabványkövető, rengeteg funkció; MySQL/MariaDB: egyszerű, web; SQL Server: Microsoft-világ; Oracle: nagyvállalat; SQLite: szerver nélküli, beágyazott.
- Nyílt forráskód = nincs licencdíj, kisebb gyártófüggés; a teljes költség (TCO) azonban itt is számít.
- Az SQL szabványos, de nyelvjárásai vannak (lapozás, azonosító, összefűzés, dátum).

## A lecke feladata

```quiz required
? Melyik DBMS működik szerver nélkül, egyetlen fájlban, és ezért kedvelt mobilalkalmazásokban?
- PostgreSQL
- Oracle Database
+ SQLite
- Microsoft SQL Server
! Beágyazott adatbázis, nulla beállítással.

? Melyik SQL Server-utasítás felel meg a PostgreSQL `LIMIT 5`-ének?
+ SELECT TOP 5 …
- SELECT FIRST 5 …
- SELECT … ROWNUM 5
- SELECT … MAX 5
! A szabványos alak: FETCH FIRST 5 ROWS ONLY.

? Mit jelent a teljes birtoklási költség (TCO)?
- csak a licencdíjat
+ a licencdíj mellett az üzemeltetés, a szakemberek és a támogatás költségét is
- a szerver áramfogyasztását
- az adatbázis méretét
! Egy ingyenes licencű rendszer üzemeltetése is pénzbe kerül.

? Melyik szövegösszefűzés szabványos SQL (és működik PostgreSQL-ben és Oracle-ben is)?
- 'a' + 'b'
+ 'a' || 'b'
- 'a' & 'b'
- 'a' . 'b'
! A + az SQL Server sajátja.

? Miért érdemes, ha lehet, szabványos SQL-t írni?
- mert gyorsabban fut
+ mert így egy másik DBMS-re való költözés sokkal egyszerűbb
- mert a DBMS-specifikus funkciók nem biztonságosak
- mert a nyelvjárások hamarosan megszűnnek
! Kisebb a gyártófüggés.
```
