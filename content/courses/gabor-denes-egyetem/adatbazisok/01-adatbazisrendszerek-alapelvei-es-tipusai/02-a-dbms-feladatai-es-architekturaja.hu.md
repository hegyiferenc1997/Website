---
title: A DBMS feladatai és architektúrája
summary: A háromszintű (ANSI/SPARC) architektúra, a fizikai és logikai adatfüggetlenség, a DDL, DML, DCL és TCL nyelvek, valamint az adatbázis körüli szerepkörök.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **háromszintű architektúra** (külső, fogalmi, belső szint),
- mit jelent az **adatfüggetlenség**, és miért olyan értékes,
- milyen **nyelvei** vannak egy DBMS-nek (DDL, DML, DCL, TCL),
- kik dolgoznak egy adatbázissal.

## A háromszintű architektúra

Egy étteremben a vendég az **étlapot** látja, a séf a **recepteket**, a raktáros a **polcokat**. Mindenki ugyanarról a konyháról beszél, csak más szemmel. Az adatbázis is így működik (ANSI/SPARC modell):

```text
  Külső szint      [ Neptun-nézet ]  [ Könyvtár-nézet ]  [ Statisztika-nézet ]
  (felhasználók)         \                 |                  /
                          \                |                 /
  Fogalmi szint         [  A teljes adatbázis logikai szerkezete:  ]
  (a "mi")              [  táblák, kapcsolatok, megszorítások      ]
                                           |
  Belső szint           [  Hogyan van a lemezen: fájlok, lapok,   ]
  (a "hogyan")          [  indexek, tömörítés                     ]
```

- **Külső szint** (nézetek): amit egy-egy felhasználói csoport lát. A portás csak nevet és fotót, a tanulmányi osztály a jegyeket is.
- **Fogalmi (logikai) szint**: a teljes adatbázis szerkezete – milyen táblák, mezők, kapcsolatok, szabályok vannak. Itt mindegy, hogyan tárolja a gép.
- **Belső (fizikai) szint**: hogyan kerül mindez a lemezre – fájlok, lapok, indexek, tömörítés.

## Adatfüggetlenség

A szintek szétválasztásának jutalma az **adatfüggetlenség**: az egyik szint megváltoztatása nem borítja fel a felette lévőt.

- **Fizikai adatfüggetlenség**: ha a DBA új indexet hoz létre vagy SSD-re költözteti az adatokat, a programokat nem kell átírni – ugyanazok a lekérdezések működnek, csak gyorsabban.
- **Logikai adatfüggetlenség**: ha a fogalmi sémába új oszlop vagy tábla kerül, a régi nézetek és alkalmazások változatlanul futnak.

Ez az egyik legnagyobb különbség a fájlalapú tároláshoz képest, ahol a program pontosan tudja (és függ attól), hogy hányadik bájton kezdődik a cím.

## A DBMS nyelvei

Az SQL több „alnyelvből” áll – ezeket a következő témakörökben mind kipróbálod:

| Alnyelv | Mire való                             | Példa utasítások                       |
| ------- | ------------------------------------- | -------------------------------------- |
| **DDL** | szerkezet leírása (_Data Definition_) | `CREATE TABLE`, `ALTER TABLE`, `DROP`  |
| **DML** | adatok kezelése (_Data Manipulation_) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | jogosultságok (_Data Control_)        | `GRANT`, `REVOKE`                      |
| **TCL** | tranzakciók (_Transaction Control_)   | `BEGIN`, `COMMIT`, `ROLLBACK`          |

Egyszerű emlékeztető: a DDL a **polcot** építi, a DML a **könyveket** pakolja, a DCL a **kulcsokat** osztja, a TCL pedig gondoskodik róla, hogy egy pakolás vagy teljesen megtörténjen, vagy egyáltalán ne.

## A DBMS fő részei

- **Lekérdezés-feldolgozó**: értelmezi az SQL-t, és kitalálja a leggyorsabb végrehajtási módot (optimalizáló).
- **Tárkezelő**: lapokat olvas és ír a lemezről, puffereket kezel.
- **Tranzakciókezelő**: gondoskodik róla, hogy az egyidejű műveletek ne zavarják egymást, és hiba után helyre lehessen állni.
- **Adatszótár** (katalógus): az adatbázis „adatai az adatokról” (metaadat) – milyen táblák, oszlopok, jogok vannak.

## Kik dolgoznak egy adatbázissal?

- **Adatbázis-adminisztrátor (DBA)**: telepít, ment, hangol, jogosultságot oszt, figyeli a működést.
- **Adatbázis-tervező**: megtervezi a sémát (táblák, kapcsolatok).
- **Alkalmazásfejlesztő**: programot ír, amely SQL-lel kommunikál az adatbázissal.
- **Végfelhasználó**: egy alkalmazáson keresztül használja (gyakran nem is tudja, hogy SQL fut a háttérben).

## Összefoglalás

- Három szint: külső (nézetek), fogalmi (logikai szerkezet), belső (fizikai tárolás).
- Fizikai adatfüggetlenség: a tárolás változhat a programok átírása nélkül; logikai: a séma bővülhet a nézetek változtatása nélkül.
- Nyelvek: DDL (szerkezet), DML (adat), DCL (jog), TCL (tranzakció).

## A lecke feladata

```quiz required
? Melyik szint írja le, hogy az adatok **hogyan** vannak a lemezen (fájlok, indexek)?
- külső szint
- fogalmi szint
+ belső szint
! A belső (fizikai) szint a „hogyan”.

? A DBA új indexet hoz létre, és a programokat nem kell átírni. Melyik tulajdonság ez?
+ fizikai adatfüggetlenség
- logikai adatfüggetlenség
- redundancia
- inkonzisztencia
! A fizikai tárolás változott, a programok nem.

? Melyik alnyelvhez tartozik a `CREATE TABLE`?
- DML
+ DDL
- DCL
- TCL
! Szerkezetet hoz létre: Data Definition Language.

? Melyik alnyelvhez tartozik a `GRANT` (jogosultság adása)? (rövidítés)
= DCL
! Data Control Language.

? Hogy hívjuk az „adatokról szóló adatokat” (milyen táblák, oszlopok vannak)?
= metaadat
= metaadatok
= adatszótár
= katalógus
! A DBMS az adatszótárban (katalógusban) tárolja a metaadatokat.
```
