---
title: Adatintegritás és megszorítások
summary: Az integritás fajtái (egyed-, hivatkozási, tartomány- és üzleti integritás), az idegen kulcs viselkedése törléskor és módosításkor (RESTRICT, CASCADE, SET NULL), és egy kipróbálható feladat.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent az **adatintegritás**, és milyen fajtái vannak,
- mi történjen a hivatkozó sorokkal, ha a hivatkozott sort **törlik** (`ON DELETE`),
- hogyan írsz olyan táblát, amely **magától** védi az adatai épségét.

## Mi az integritás?

**Integritás** = az adatok **helyessége és ellentmondás-mentessége**. A normalizálás a szerkezetből adódó ellentmondásokat szünteti meg, a megszorítások pedig azt biztosítják, hogy hibás adat **be se kerüljön**. Négy fajtáját különböztetjük meg:

| Fajta                      | Szabály                                             | Eszköz                         |
| -------------------------- | --------------------------------------------------- | ------------------------------ |
| **Egyedintegritás**        | minden sor egyértelműen azonosítható                | `PRIMARY KEY`                  |
| **Hivatkozási integritás** | idegen kulcs csak létező sorra mutathat             | `REFERENCES` (`FOREIGN KEY`)   |
| **Tartományintegritás**    | az érték a megengedett tartományba esik             | típus, `NOT NULL`, `CHECK`     |
| **Üzleti szabályok**       | a cég saját szabályai (pl. „a kedvezmény max. 30%”) | `CHECK`, triggerek, alkalmazás |

## Mi legyen az árva sorokkal?

A hivatkozási integritás azt mondja: nem lehet olyan rendelés, amelynek a vevője nem létezik. De mi történjen, ha egy **vevőt törölnek**, akinek vannak rendelései? Erre az idegen kulcsnál adhatsz szabályt:

| Beállítás                                           | Mi történik a vevő törlésekor?                | Mikor jó?                                                             |
| --------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| `ON DELETE RESTRICT` / `NO ACTION` (alapértelmezés) | a törlés **hibát ad**, amíg vannak rendelései | ha a gyerek sorok fontos adatok (számlák!)                            |
| `ON DELETE CASCADE`                                 | a rendelései is **törlődnek** vele együtt     | ha a gyerek a szülő nélkül értelmetlen (rendelés tételei)             |
| `ON DELETE SET NULL`                                | a rendelésekben a `vevo_id` **NULL** lesz     | ha a gyerek megmaradhat gazda nélkül (a tanár távozik, a tárgy marad) |
| `ON DELETE SET DEFAULT`                             | a `vevo_id` az alapértékre áll                | ritkán                                                                |

Ugyanezek léteznek `ON UPDATE`-re is (ha a hivatkozott kulcs megváltozik).

```sql run
CREATE TABLE szerzok (szerzo_id INT PRIMARY KEY, nev VARCHAR(60) NOT NULL);
CREATE TABLE posztok (
  poszt_id  INT PRIMARY KEY,
  cim       VARCHAR(100) NOT NULL,
  szerzo_id INT REFERENCES szerzok (szerzo_id) ON DELETE SET NULL
);
INSERT INTO szerzok VALUES (1, 'Anna'), (2, 'Béla');
INSERT INTO posztok VALUES (10, 'SQL tippek', 1), (11, 'Normalizálás', 2);
DELETE FROM szerzok WHERE szerzo_id = 1;
SELECT * FROM posztok;
```

Anna törlése után a posztja megmaradt, csak „szerző nélküli” lett. Próbáld ki (Szerkesztés): írd át `ON DELETE CASCADE`-re, majd töröld a beállítást – mi történik a három esetben?

## Összetett CHECK feltételek

A `CHECK` nemcsak egy oszlopra vonatkozhat, hanem a sor több oszlopára is (táblaszintű megszorítás):

```sql
CREATE TABLE foglalasok (
  foglalas_id INT PRIMARY KEY,
  erkezes     DATE NOT NULL,
  tavozas     DATE NOT NULL,
  CHECK (tavozas > erkezes)          -- nem lehet negatív hosszú a foglalás
);
```

## A lecke feladata

A webshopban már létezik a `vevok` tábla:

```sql setup
CREATE TABLE vevok (
  vevo_id INT PRIMARY KEY,
  nev     VARCHAR(60) NOT NULL
);
INSERT INTO vevok VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla');
```

Hozd létre a `rendelesek` táblát, amely **magától védi** az adatai épségét:

- `rendeles_id`: egész szám, elsődleges kulcs,
- `vevo_id`: egész szám, **kötelező**, a `vevok` táblára hivatkozik úgy, hogy egy vevő **törlésekor a rendelései is törlődjenek**,
- `osszeg`: `NUMERIC(10, 2)`, kötelező, **nagyobb mint 0**.

A gép kipróbálja: rendelést szúr be létező és nem létező vevőhöz, negatív összeggel, majd töröl egy vevőt, és megszámolja a megmaradt rendeléseket.

```sql starter required
CREATE TABLE rendelesek (
  rendeles_id INT PRIMARY KEY,
  vevo_id     INT,
  osszeg      NUMERIC(10, 2)
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE rendelesek (
  rendeles_id INT PRIMARY KEY,
  vevo_id     INT NOT NULL REFERENCES vevok (vevo_id) ON DELETE CASCADE,
  osszeg      NUMERIC(10, 2) NOT NULL CHECK (osszeg > 0)
);
```

</details>

```sql test
CREATE FUNCTION probal(parancs TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE parancs;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (teszt TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES
  ('rendelés Annának',     probal($q$INSERT INTO rendelesek VALUES (1, 1, 5000)$q$)),
  ('rendelés Bélának',     probal($q$INSERT INTO rendelesek VALUES (2, 2, 1200)$q$)),
  ('nem létező vevő',      probal($q$INSERT INTO rendelesek VALUES (3, 99, 1000)$q$)),
  ('vevő nélkül',          probal($q$INSERT INTO rendelesek VALUES (4, NULL, 1000)$q$)),
  ('negatív összeg',       probal($q$INSERT INTO rendelesek VALUES (5, 1, -5)$q$)),
  ('Anna törlése',         probal($q$DELETE FROM vevok WHERE vevo_id = 1$q$));

SELECT teszt, eredmeny FROM eredmeny
UNION ALL
SELECT 'megmaradt rendelések', COUNT(*)::TEXT FROM rendelesek;
```

## Összefoglalás

- Egyed- (PK), hivatkozási (FK), tartomány- (típus, NOT NULL, CHECK) és üzleti integritás.
- `ON DELETE`: `RESTRICT` (tilt), `CASCADE` (együtt töröl), `SET NULL` (elárvít).
- A szabály az adatbázisban mindenkire vonatkozik – a webes felületre, a szkriptekre és a kézi módosításra is.
