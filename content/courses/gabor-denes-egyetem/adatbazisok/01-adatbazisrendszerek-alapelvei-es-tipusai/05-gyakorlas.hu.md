---
title: Gyakorlás – adatbázisrendszerek alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap az adatbázis, a DBMS, a háromszintű architektúra és az adatbázis-típusok témájában.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem jó megoldás, ha egy cég minden osztálya a saját Excel-fájljában tartja a vevőket?</summary>

Mert ugyanaz az adat több helyen is szerepel (**redundancia**), így előbb-utóbb ellentmondásba kerülnek (**inkonzisztencia**). Ráadásul nehéz a fájlokat összefésülni egy lekérdezéshez, egyszerre többen nem tudnak biztonságosan dolgozni, és nem lehet finoman szabályozni, ki mit láthat.

</details>

<details>
<summary>2. Mi a különbség az adatbázis és a DBMS között?</summary>

Az **adatbázis** maguk az összefüggő, tartósan tárolt adatok. A **DBMS** az a program, amely ezeket kezeli: tárolja, lekérdezi, védi, menti, és a többfelhasználós hozzáférést szervezi. Hasonlat: könyvállomány és könyvtáros.

</details>

<details>
<summary>3. Mit nyerünk a háromszintű architektúrával?</summary>

**Adatfüggetlenséget.** A fizikai tárolás (indexek, lemezek) megváltoztatható a programok átírása nélkül, és a logikai séma is bővíthető úgy, hogy a régi nézetek és alkalmazások tovább működjenek. Emellett minden felhasználói csoport csak a neki szóló nézetet látja.

</details>

<details>
<summary>4. Miért szorította ki a relációs modell a hálós modellt?</summary>

A hálós modellben a programnak mutatókon kellett végiglépkednie, így a lekérdezés bonyolult volt, és a szerkezet bármilyen változása a programokat is érintette. A relációs modellben a kapcsolatokat közös értékek adják, a lekérdezés deklaratív (SQL), és a DBMS dönti el, hogyan hajtja végre.

</details>

<details>
<summary>5. Mondj egy-egy feladatot, amelyre OLTP, illetve OLAP rendszer kell!</summary>

**OLTP**: egy webshop rendelései, banki átutalások, a Neptun tárgyfelvétele – sok, rövid, egyidejű tranzakció. **OLAP**: „Hogyan alakult az elmúlt öt évben a kurzusonkénti átlag?” – kevés, de hatalmas adatmennyiséget átfésülő elemző lekérdezés.

</details>

## Összefoglaló feladatlap

Egy kezdő csapat egy **ételrendelő alkalmazást** épít. Segíts nekik a döntésekben!

```quiz required
? A rendeléseket és a fizetéseket szigorú szabályokkal, tranzakciósan kell tárolni. Milyen adatbázist javasolsz?
+ relációs (pl. PostgreSQL)
- gráf (pl. Neo4j)
- idősoros (pl. InfluxDB)
- nincs szükség adatbázisra
! Tranzakciók, integritás: relációs.

? A futárok GPS-pozíciója másodpercenként frissül, csak a legutolsó érték kell, nagyon gyorsan. Mi illik ide a legjobban?
- hierarchikus adatbázis
+ memóriabeli kulcs-érték tár (pl. Redis)
- Excel-fájl
- OLAP adattárház
! Gyors, egyszerű kulcs → érték, memóriában.

? Az alkalmazás telefonon offline is mutatja a kedvenc éttermeket. Milyen adatbázis kerül a telefonra?
- kliens-szerver Oracle
+ beágyazott SQLite
- elosztott Cassandra
- NewSQL
! Beágyazott, egyfájlos adatbázis.

? A fejlesztők új indexet adnak a rendelések táblához, és a programkódhoz nem kell nyúlniuk. Melyik elv teszi ezt lehetővé? (két szó)
= fizikai adatfüggetlenség
= physical data independence
! A belső szint változott, a fogalmi és külső nem.

? Melyik SQL alnyelvhez tartozik a `ROLLBACK` (egy félbemaradt művelet visszavonása)?
- DDL
- DML
- DCL
+ TCL
! Transaction Control Language.

? Az elemzők havonta szeretnének kimutatást a rendelésekről évekre visszamenőleg. Ez melyik feldolgozási mód?
- OLTP
+ OLAP
! Online Analytical Processing.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

**1.** Első lépések a mintaadatbázisban: listázd ki azoknak a hallgatóknak a **nevét és városát**, akiknek **ismert a városa**, név szerint ábécérendben.

```sql starter
SELECT nev, varos
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, varos
FROM hallgatok
WHERE varos IS NOT NULL      -- az ismeretlen (NULL) város kimarad
ORDER BY nev;
```

</details>

**2.** **Külső szint a gyakorlatban.** A kollégium portása csak a budapesti hallgatókat látja. Hozd létre a `budapesti_hallgatok` **nézetet** (`neptun`, `nev` oszlopokkal), majd kérdezd le Neptun-kód szerint rendezve!

```sql starter
-- 1. CREATE VIEW budapesti_hallgatok AS ...
-- 2. SELECT ... FROM budapesti_hallgatok ...
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE VIEW budapesti_hallgatok AS
SELECT neptun, nev
FROM hallgatok
WHERE varos = 'Budapest';

SELECT * FROM budapesti_hallgatok ORDER BY neptun;
```

</details>

**3.** **A DBMS önmagáról is tud adatot adni** (adatszótár). Kérdezd le az `information_schema.columns` nézetből a `hallgatok` tábla **oszlopainak nevét és adattípusát**, a táblabeli sorrendjükben (`ordinal_position`)!

```sql starter
SELECT column_name, data_type
FROM information_schema.columns;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'hallgatok'
ORDER BY ordinal_position;
```

</details>

**4.** Hány **tábla** van a `public` sémában? (Az `information_schema.tables` nézet segít.)

```sql starter
SELECT table_name
FROM information_schema.tables;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT COUNT(*) AS tablak_szama
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';    -- csak a valódi táblák, a nézetek nem
```

</details>

**5.** **Fizikai adatfüggetlenség kipróbálva.** Hozz létre egy indexet a `hallgatok.varos` oszlopra, majd futtasd le _ugyanazt_ a lekérdezést, mint index nélkül: a szegedi és debreceni hallgatók neve, név szerint. Figyeld meg: a lekérdezésen semmit sem kellett változtatni!

```sql starter
SELECT nev
FROM hallgatok
WHERE varos IN ('Szeged', 'Debrecen')
ORDER BY nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX idx_hallgatok_varos ON hallgatok (varos);   -- csak a belső szint változik

SELECT nev
FROM hallgatok
WHERE varos IN ('Szeged', 'Debrecen')
ORDER BY nev;
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'hallgatok' AND indexdef LIKE '%(varos)%') AS index_van,
       (SELECT string_agg(nev, ', ' ORDER BY nev) FROM hallgatok WHERE varos IN ('Szeged', 'Debrecen')) AS nevek;
```
