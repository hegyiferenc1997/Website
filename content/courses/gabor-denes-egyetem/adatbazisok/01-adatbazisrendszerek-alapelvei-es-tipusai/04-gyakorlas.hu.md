---
title: Gyakorlás – adatbázisrendszerek alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap az adatbázis, a DBMS, a háromszintű architektúra és az adatbázis-típusok témájában.
minutes: 20
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
