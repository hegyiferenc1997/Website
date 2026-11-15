---
title: Sémamigráció
summary: Hogyan változtass biztonságosan egy élő adatbázis sémáján: migrációs fájlok és verziókövetés (Flyway, Alembic, Prisma), előre és visszafelé lépés, a veszélyes és a biztonságos változtatások, valamint a „bővít, majd szűkít” minta egy kötelező oszlop leállás nélküli bevezetésére.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- mi a **sémamigráció**, és miért kell **verziókövetni** a sémát,
- hogyan működnek a **migrációs eszközök**,
- melyik sémaváltozás **veszélyes** egy élő rendszeren,
- hogyan vezess be egy kötelező oszlopot **lépésekben**, leállás nélkül.

## Miért kell a sémát is verziókövetni?

A program kódját git-tel verziókövetjük – de mi van az adatbázissal? Ha minden fejlesztő kézzel futtat `ALTER TABLE`-öket a saját gépén, a tesztszerveren és élesben, hamar senki sem tudja, melyik környezetben milyen a séma. Az eredmény: „nálam működik”, élesben meg összeomlik.

A megoldás a **sémamigráció**: minden sémaváltozás egy **sorszámozott fájl**, amely a kóddal együtt a git-tárolóba kerül:

```text
migraciok/
  V001__hallgatok_tabla.sql
  V002__targyak_es_jelentkezesek.sql
  V003__email_oszlop.sql          ← az új változás
```

Egy **migrációs eszköz** (pl. **Flyway**, **Liquibase**, Pythonban az **Alembic**, JavaScriptben a **Prisma Migrate** vagy a **Drizzle Kit**) az adatbázisban egy **nyilvántartó táblában** jegyzi, melyik migráció futott már le, és csak az újakat futtatja – minden környezetben ugyanabban a sorrendben.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Így néz ki egy ilyen nyilvántartó tábla (egyszerűsítve):

```sql run
CREATE TABLE sema_verziok (
  verzio      INT PRIMARY KEY,
  leiras      TEXT NOT NULL,
  lefutott    TIMESTAMP NOT NULL DEFAULT now()
);
INSERT INTO sema_verziok (verzio, leiras) VALUES
  (1, 'hallgatok tábla'), (2, 'targyak és jelentkezesek');

-- Az eszköz megnézi, hol tart az adatbázis, és csak az ennél újabb fájlokat futtatja:
SELECT MAX(verzio) AS jelenlegi_verzio FROM sema_verziok;
```

## Előre és vissza

Sok eszköznél egy migrációnak két része van:

- **előre** (_up_): a változtatás (pl. `ALTER TABLE … ADD COLUMN`),
- **vissza** (_down_): a visszavonása (pl. `ALTER TABLE … DROP COLUMN`), ha hiba történt.

Vigyázat: nem minden vonható vissza adatvesztés nélkül. Egy oszlop törlését visszacsinálva az oszlop visszajön – de az adatai nem. Ezért az élesben futó migráció előtt **mindig legyen friss mentés** (13. témakör).

Egy aranyszabály: egy már **lefutott** migrációs fájlt **soha ne módosíts** – ha hibás volt, írj egy újat, amely kijavítja.

## Veszélyes és biztonságos változtatások

Egy élő rendszeren, ahol éppen ezrek használják az adatbázist, a sémaváltozás **zárolást** igényel. Egy hosszú zárolás alatt a tábla elérhetetlen – ez gyakorlatilag leállás.

| Változtatás                                         | Kockázat      | Miért?                                                                  |
| --------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| új, **nem kötelező** oszlop (`NULL` megengedett)    | alacsony      | csak a katalógus változik, azonnali                                     |
| új oszlop **alapértékkel**                          | alacsony (újabb PostgreSQL-ben) | az alapértéket nem írja be minden sorba                 |
| új oszlop **`NOT NULL`, alapérték nélkül**          | **hiba**      | a meglévő sorok megsértenék a megszorítást                              |
| oszlop **átnevezése** vagy **törlése**              | **magas**     | a még futó régi programverzió azonnal elromlik                          |
| oszlop **típusának** megváltoztatása                | **magas**     | gyakran az egész táblát újraírja, hosszú zárolással                     |
| index létrehozása                                   | közepes       | írást blokkolhat; `CREATE INDEX CONCURRENTLY` nem blokkol               |

## A „bővít, majd szűkít” minta

Hogyan vezess be egy **kötelező** (`NOT NULL`), **egyedi** oszlopot egy élő táblába? Nem egy lépésben, hanem **kis, biztonságos** lépésekben (_expand and contract_):

```text
 1. BŐVÍTÉS:   új oszlop, egyelőre nem kötelező          → semmi sem romlik el
 2. FELTÖLTÉS: a meglévő sorok kitöltése (akár részletekben) + az új kód már írja
 3. SZŰKÍTÉS:  NOT NULL és UNIQUE megszorítás             → most már minden sornak van értéke
```

Ugyanígy egy oszlop **átnevezése** sem egy `RENAME`: új oszlop → mindkettőbe írás → adatmásolás → a kód átáll az újra → a régi oszlop törlése. Lassabb, de egyetlen pillanatig sem áll le a rendszer.

```sql run
-- 1. bővítés: új, nem kötelező oszlop
ALTER TABLE hallgatok ADD COLUMN aktiv BOOLEAN;
-- 2. feltöltés
UPDATE hallgatok SET aktiv = TRUE;
-- 3. szűkítés: alapérték és kötelező
ALTER TABLE hallgatok ALTER COLUMN aktiv SET DEFAULT TRUE;
ALTER TABLE hallgatok ALTER COLUMN aktiv SET NOT NULL;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'hallgatok' AND column_name = 'aktiv';
```

Tipp: PostgreSQL-ben a sémaváltozások is **tranzakcióban** futhatnak (`BEGIN; … COMMIT;`) – ha a migráció közepén hiba van, minden visszagördül, és nem marad félkész séma. (Ez nem minden DBMS-ben van így: a MySQL például a legtöbb sémaváltozást azonnal véglegesíti.)

## Összefoglalás

- Sémamigráció: sorszámozott fájlok a git-tárolóban, egy eszköz futtatja és nyilvántartja őket.
- Előre és vissza; a lefutott migrációt ne módosítsd; előtte mentés.
- Veszélyes: kötelező oszlop alapérték nélkül, átnevezés, törlés, típusváltás élő rendszeren.
- „Bővít, majd szűkít”: kis, visszafordítható lépések, leállás nélkül.

## A lecke feladata

Írd meg a **V003** migrációt! A `hallgatok` táblába kerüljön egy `email` oszlop (`VARCHAR(120)`), amely a végén **kötelező** és **egyedi**. Haladj a „bővít, majd szűkít” lépései szerint:

1. **bővítés**: az oszlop hozzáadása (ez a kiinduló kódban már megvan),
2. **feltöltés**: minden meglévő hallgató e-mail-címe legyen a Neptun-kód **kisbetűvel**, majd `@hallgato.pelda.hu` (pl. `abc123@hallgato.pelda.hu`),
3. **szűkítés**: `NOT NULL` és `UNIQUE`.

A gép az oszlop típusát, kötelezőségét, egyediségét és egy mintaértéket ellenőriz.

```sql starter required
-- V003: email oszlop a hallgatóknak

-- 1. bővítés
ALTER TABLE hallgatok ADD COLUMN email VARCHAR(120);

-- 2. feltöltés

-- 3. szűkítés
```

<details>
<summary>Megoldás</summary>

```sql solution
-- V003: email oszlop a hallgatóknak

-- 1. bővítés
ALTER TABLE hallgatok ADD COLUMN email VARCHAR(120);

-- 2. feltöltés
UPDATE hallgatok SET email = LOWER(neptun) || '@hallgato.pelda.hu';

-- 3. szűkítés
ALTER TABLE hallgatok ALTER COLUMN email SET NOT NULL;
ALTER TABLE hallgatok ADD CONSTRAINT hallgatok_email_egyedi UNIQUE (email);
```

</details>

```sql test
SELECT c.data_type, c.character_maximum_length, c.is_nullable,
       EXISTS (SELECT 1 FROM pg_indexes
               WHERE tablename = 'hallgatok' AND indexdef LIKE 'CREATE UNIQUE%(email)') AS egyedi,
       (SELECT email FROM hallgatok WHERE neptun = 'ABC123') AS minta
FROM information_schema.columns c
WHERE c.table_name = 'hallgatok' AND c.column_name = 'email';
```
