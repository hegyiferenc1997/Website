---
title: Adatok módosítása – INSERT, UPDATE, DELETE
summary: Sorok beszúrása (egy, több, lekérdezésből), módosítása és törlése, a WHERE nélküli UPDATE / DELETE veszélye, a RETURNING és az UPSERT (INSERT … ON CONFLICT).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan **szúrsz be**, **módosítasz** és **törölsz** sorokat,
- miért veszélyes a `WHERE` nélküli `UPDATE` és `DELETE`,
- hogyan kapod vissza a módosított sorokat (`RETURNING`),
- mi az **UPSERT** (beszúrás, vagy ha már van, módosítás).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## INSERT – új sorok

```sql run
INSERT INTO targyak (kod, nev, kredit, felev)
VALUES ('HAL', 'Hálózatok', 5, 4);

-- Több sor egyszerre:
INSERT INTO targyak (kod, nev, kredit, felev) VALUES
  ('BIZ', 'Informatikai biztonság', 4, 4),
  ('WEB', 'Webfejlesztés', 4, 4);

SELECT * FROM targyak ORDER BY felev, kod;
```

- Mindig **sorold fel az oszlopokat** – ha később új oszlop kerül a táblába, a programod nem romlik el.
- A kihagyott oszlopok az alapértéküket (`DEFAULT`) vagy NULL-t kapnak.
- Beszúrhatsz **lekérdezés eredményéből** is: `INSERT INTO archiv SELECT * FROM jelentkezesek WHERE jegy IS NOT NULL;`

## UPDATE – meglévő sorok módosítása

```sql run
UPDATE hallgatok
SET felev = felev + 1, varos = 'Budapest'
WHERE neptun = 'BCD234';

SELECT * FROM hallgatok WHERE neptun = 'BCD234';
```

## DELETE – sorok törlése

```sql run
DELETE FROM jelentkezesek WHERE jegy IS NULL;
SELECT COUNT(*) AS maradt FROM jelentkezesek;
```

## ⚠️ A legdrágább hiba

```sql
UPDATE hallgatok SET felev = 1;     -- MINDEN hallgató 1. féléves lett!
DELETE FROM jelentkezesek;          -- MINDEN jelentkezés eltűnt!
```

A `WHERE` nélküli `UPDATE` és `DELETE` **a tábla minden sorára** vonatkozik. Éles adatbázison ez katasztrófa. Jó szokások:

1. Előbb írd meg `SELECT`-ként ugyanazzal a `WHERE`-rel, és nézd meg, mely sorokat érintené.
2. Tranzakcióban dolgozz (`BEGIN` … ellenőrzés … `COMMIT` vagy `ROLLBACK`, lásd következő lecke).
3. Figyeld a DBMS válaszát: „UPDATE 1” vagy „UPDATE 50000”?

## RETURNING – mit csináltam?

A PostgreSQL a módosított sorokat vissza is tudja adni – nem kell utána külön lekérdezni:

```sql run
UPDATE targyak SET kredit = kredit + 1
WHERE felev = 1
RETURNING kod, nev, kredit;
```

Ez különösen hasznos beszúrásnál, ha az azonosítót az adatbázis generálja (`INSERT … RETURNING id`).

## UPSERT – beszúrás vagy módosítás

Gyakori feladat: „Ha még nincs ilyen sor, szúrd be; ha már van, frissítsd.” Erre való az `ON CONFLICT`:

```sql run
INSERT INTO jelentkezesek (neptun, kod, jegy)
VALUES ('ABC123', 'ADB', 4)
ON CONFLICT (neptun, kod) DO UPDATE SET jegy = EXCLUDED.jegy;

SELECT * FROM jelentkezesek WHERE neptun = 'ABC123';
```

Mivel Anna már felvette az ADB-t, nem jött létre új sor, hanem a jegye 4-re változott. Az `EXCLUDED` a beszúrni próbált sort jelenti. A `DO NOTHING` változat egyszerűen kihagyja a már létezőt.

## Módosítás és integritás

A megszorítások módosításkor is védenek: nem szúrhatsz be jelentkezést nem létező hallgatóhoz, nem adhatsz 6-os jegyet (`CHECK`), és nem törölhetsz olyan hallgatót, akinek jelentkezése van (alapértelmezett `RESTRICT`). Próbáld ki: `DELETE FROM hallgatok WHERE neptun = 'ABC123';`

## Összefoglalás

- `INSERT INTO t (oszlopok) VALUES (…), (…);` – vagy `INSERT … SELECT`.
- `UPDATE t SET o = érték WHERE …;` és `DELETE FROM t WHERE …;` – **WHERE nélkül minden sort érint!**
- `RETURNING` – a módosított sorok visszaadása.
- `INSERT … ON CONFLICT … DO UPDATE / DO NOTHING` – UPSERT.

## A lecke feladata

Végezd el **ebben a sorrendben** az alábbi módosításokat:

1. Töröld azokat a jelentkezéseket, amelyeknél **még nincs jegy**.
2. Vedd fel az új hallgatót: `GHI789`, `Fekete Gábor`, `mérnökinformatikus`, 1. félév, `Pécs`, született `2007-05-05`.
3. Jelentkeztesd őt a `PROG` tárgyra (jegy még nincs).
4. Az Operációs rendszerek (`OPR`) kreditszámát módosítsd **5**-re.

A gép a végén megszámolja a hallgatókat és a jelentkezéseket, és megnézi az OPR kreditjét.

```sql starter required
-- 1. jegy nélküli jelentkezések törlése

-- 2. új hallgató

-- 3. jelentkezés a PROG tárgyra

-- 4. az OPR kreditszáma
```

<details>
<summary>Megoldás</summary>

```sql solution
DELETE FROM jelentkezesek WHERE jegy IS NULL;

INSERT INTO hallgatok (neptun, nev, szak, felev, varos, szuletett)
VALUES ('GHI789', 'Fekete Gábor', 'mérnökinformatikus', 1, 'Pécs', '2007-05-05');

INSERT INTO jelentkezesek (neptun, kod) VALUES ('GHI789', 'PROG');

UPDATE targyak SET kredit = 5 WHERE kod = 'OPR';
```

</details>

```sql test
SELECT
  (SELECT COUNT(*) FROM hallgatok) AS hallgatok,
  (SELECT COUNT(*) FROM jelentkezesek) AS jelentkezesek,
  (SELECT COUNT(*) FROM jelentkezesek WHERE jegy IS NULL) AS jegy_nelkul,
  (SELECT COUNT(*) FROM jelentkezesek WHERE neptun = 'GHI789' AND kod = 'PROG') AS uj_jelentkezes,
  (SELECT kredit FROM targyak WHERE kod = 'OPR') AS opr_kredit,
  (SELECT SUM(kredit) FROM targyak) AS osszes_kredit;
```
