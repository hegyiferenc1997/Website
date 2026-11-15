---
title: Az SQL nyelv és a táblák kezelése
summary: Az SQL története és szabványai, a nyelv szabályai (kulcsszavak, idézőjelek, megjegyzések), és a DDL utasítások – CREATE TABLE idegen kulccsal, ALTER TABLE, DROP TABLE – a böngészőben kipróbálva.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- honnan jön az **SQL**, és miért beszéli szinte minden adatbázis,
- a nyelv **írásszabályait**,
- a szerkezetet kezelő **DDL** utasításokat: `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`.

## Egy kis történelem

Az SQL (_Structured Query Language_, kiejtve „esz-kú-el” vagy „szíkvel”) az IBM-nél született az 1970-es években, Codd relációs modellje alapján. 1986 óta **szabvány** (ANSI, majd ISO), azóta rendszeresen bővül (SQL-92, SQL:1999, …, SQL:2023). Emiatt az alapok **minden relációs DBMS-ben ugyanúgy** működnek – amit itt PostgreSQL-ben megtanulsz, azt MySQL-ben, SQL Serverben vagy SQLite-ban is használhatod. A rendszerek apróbb kiegészítésekben különböznek (ezek a „dialektusok”).

## Írásszabályok

- A **kulcsszavak** kis- és nagybetűvel is írhatók (`SELECT` = `select`); a szokás a nagybetű, így jobban elválnak a nevektől.
- A **szöveget** egyszeres idézőjelbe tesszük: `'Budapest'`. A kettős idézőjel (`"…"`) a **neveké** (ritkán kell).
- Az utasítás végére **pontosvessző** kerül.
- **Megjegyzés**: `-- egy soros` vagy `/* több soros */`.
- A sortörés és a szóköz szabadon használható – írd úgy, hogy olvasható legyen!

## Táblák létrehozása idegen kulccsal

A 2. témakörben már létrehoztál egy táblát. Most összekapcsolunk kettőt: a `REFERENCES` kulcsszó teszi az oszlopot **idegen kulccsá**.

```sql run
CREATE TABLE tanszekek (
  tanszek_id INT PRIMARY KEY,
  nev        VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE oktatok (
  oktato_id  INT PRIMARY KEY,
  nev        VARCHAR(60) NOT NULL,
  tanszek_id INT REFERENCES tanszekek (tanszek_id)
);

INSERT INTO tanszekek VALUES (1, 'Informatika'), (2, 'Matematika');
INSERT INTO oktatok VALUES (10, 'Dr. Példa Péter', 1), (11, 'Dr. Minta Mária', 2);
SELECT * FROM oktatok;
```

Próbáld ki (Szerkesztés): szúrj be egy oktatót a `99`-es, nem létező tanszékkel! A PostgreSQL visszadobja, mert sértené a **hivatkozási integritást**.

A sorrend számít: előbb a **hivatkozott** táblának (`tanszekek`) kell léteznie, és törléskor fordítva – nem dobhatod el a tanszékeket, amíg oktatók hivatkoznak rájuk.

## Tábla módosítása: ALTER TABLE

Egy élő adatbázis szerkezete idővel változik. Nem kell újra létrehozni a táblát (az adatokkal együtt), elég módosítani:

```sql
ALTER TABLE hallgatok ADD COLUMN email VARCHAR(120);       -- új oszlop
ALTER TABLE hallgatok DROP COLUMN email;                    -- oszlop törlése
ALTER TABLE hallgatok RENAME COLUMN varos TO lakhely;       -- átnevezés
ALTER TABLE hallgatok ALTER COLUMN nev TYPE VARCHAR(100);   -- típus módosítása
ALTER TABLE hallgatok ADD CONSTRAINT felev_ok CHECK (felev BETWEEN 1 AND 14);
```

## Tábla törlése: DROP TABLE

`DROP TABLE oktatok;` – a tábla **és minden adata** eltűnik, visszavonás nélkül (hacsak nem egy tranzakción belül vagy, lásd 8. témakör). Éles rendszeren ezt kétszer is gondold meg! A `DROP TABLE IF EXISTS oktatok;` nem ad hibát, ha a tábla nem létezik.

Van egy gyorsabb rokona is: a `TRUNCATE oktatok;` minden **sort** töröl, de a tábla szerkezete megmarad.

## Az adatbázis önmagáról is tud

Codd szabálya szerint a szerkezet is táblákban kérdezhető le. A szabványos `information_schema` megmutatja például egy tábla oszlopait:

```sql run
CREATE TABLE minta (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL, megjegyzes TEXT);
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'minta'
ORDER BY ordinal_position;
```

## Összefoglalás

- Az SQL szabványos: az alapok minden relációs DBMS-ben működnek.
- Szöveg `'…'`-ben, utasítás végén `;`, megjegyzés `--`.
- DDL: `CREATE TABLE` (idegen kulcs: `REFERENCES`), `ALTER TABLE`, `DROP TABLE`, `TRUNCATE`.

## A lecke feladata

Az egyetemi mintaadatbázist kell bővítened (a táblák már léteznek).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

1. Adj a `hallgatok` táblához egy `email` oszlopot (legfeljebb 120 karakteres szöveg, `VARCHAR(120)`).
2. Hozz létre egy `oktatok` táblát: `oktato_id` egész szám, elsődleges kulcs; `nev` legfeljebb 60 karakteres szöveg, kötelező; `tanszek` legfeljebb 40 karakteres szöveg (nem kötelező).

A gép az `information_schema` segítségével ellenőrzi a két tábla oszlopait.

```sql starter required
-- 1. új oszlop a hallgatok táblába

-- 2. az oktatok tábla
CREATE TABLE oktatok (

);
```

<details>
<summary>Megoldás</summary>

```sql solution
ALTER TABLE hallgatok ADD COLUMN email VARCHAR(120);

CREATE TABLE oktatok (
  oktato_id INT PRIMARY KEY,
  nev       VARCHAR(60) NOT NULL,
  tanszek   VARCHAR(40)
);
```

</details>

```sql test
SELECT table_name, column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('hallgatok', 'oktatok')
ORDER BY table_name, ordinal_position;
```
