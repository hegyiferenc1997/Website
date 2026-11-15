---
title: Adattípusok és megszorítások
summary: Tartomány és adattípus, a leggyakoribb SQL típusok (egész, tizedes, szöveg, dátum, logikai), valamint a NOT NULL, UNIQUE, PRIMARY KEY, CHECK és DEFAULT megszorítások – első saját táblád a böngészőben.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **tartomány** és az **adattípus**, és hogyan válassz,
- melyek a leggyakoribb **SQL adattípusok**,
- hogyan véded a táblát a hibás adatoktól **megszorításokkal**,
- hogyan hozod létre az első saját táblád (`CREATE TABLE`).

## Tartomány és típus

Minden tulajdonságnak van **tartománya** (domain): azoknak az értékeknek a halmaza, amelyeket felvehet. A jegy tartománya {1, 2, 3, 4, 5}, a születési dátumé a múltbeli dátumok, az e-mail címé a `valami@valami.hu` alakú szövegek. Az adatbázisban a tartományt egy **adattípus** és néhány **megszorítás** együtt írja le.

## A leggyakoribb típusok (PostgreSQL)

| Típus                       | Mire                                  | Példa                       |
| --------------------------- | ------------------------------------- | --------------------------- |
| `INT` / `BIGINT`            | egész szám (kb. ±2 milliárd / óriási) | darabszám, azonosító        |
| `NUMERIC(p, s)`             | **pontos** tizedes tört               | ár, pénzösszeg              |
| `REAL` / `DOUBLE PRECISION` | közelítő lebegőpontos szám            | mérési adat                 |
| `VARCHAR(n)`                | szöveg legfeljebb n karakterrel       | név, e-mail                 |
| `TEXT`                      | tetszőleges hosszú szöveg             | leírás, komment             |
| `CHAR(n)`                   | pontosan n hosszú szöveg              | Neptun-kód                  |
| `DATE` / `TIMESTAMP`        | dátum / dátum + idő                   | születésnap, rendelés ideje |
| `BOOLEAN`                   | igaz / hamis                          | aktív-e                     |

Két fontos tanács:

- **Pénzt soha ne tárolj lebegőpontos típusban!** A `0.1 + 0.2` lebegőpontosan `0.30000000000000004` – egy bankban ebből baj lesz. Erre való a `NUMERIC(10, 2)` (10 számjegy, ebből 2 a tizedesvessző után).
- A telefonszám és az irányítószám **szöveg**, nem szám: nem számolunk velük, és a kezdő nulla (`06…`) elveszne.

## Megszorítások – a tábla „házirendje”

| Megszorítás   | Jelentés                                   | Példa                          |
| ------------- | ------------------------------------------ | ------------------------------ |
| `NOT NULL`    | kötelező kitölteni                         | `nev VARCHAR(80) NOT NULL`     |
| `UNIQUE`      | nem ismétlődhet                            | `email VARCHAR(120) UNIQUE`    |
| `PRIMARY KEY` | egyedi azonosító (= `UNIQUE` + `NOT NULL`) | `kod VARCHAR(10) PRIMARY KEY`  |
| `CHECK (…)`   | tetszőleges feltételnek kell teljesülnie   | `CHECK (jegy BETWEEN 1 AND 5)` |
| `DEFAULT …`   | ha nem adunk meg értéket, ezt kapja        | `keszlet INT DEFAULT 0`        |

A megszorítás olyan, mint egy szigorú portás: a hibás adatot **be sem engedi**. Sokkal jobb, ha a hibát az adatbázis azonnal visszadobja, mint ha hónapokkal később derülne ki, hogy valakinek negatív az ára.

```sql run
CREATE TABLE tagok (
  tag_id    INT PRIMARY KEY,
  nev       VARCHAR(80) NOT NULL,
  email     VARCHAR(120) UNIQUE,
  aktiv     BOOLEAN DEFAULT TRUE,
  belepett  DATE NOT NULL
);
INSERT INTO tagok (tag_id, nev, email, belepett) VALUES (1, 'Kiss Anna', 'anna@pelda.hu', '2026-09-01');
SELECT * FROM tagok;
```

Most próbáld ki, mi történik, ha megszeged a szabályt! Kattints a **Szerkesztés** gombra, és az `INSERT` sorban írd a nevet `NULL`-ra, vagy szúrj be egy második sort ugyanazzal az e-mail címmel. A PostgreSQL hibaüzenettel visszadobja.

## Összefoglalás

- Tartomány = a lehetséges értékek; adattípus + megszorítások írják le.
- Pénzhez `NUMERIC`, telefonszámhoz szöveg.
- `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `CHECK`, `DEFAULT` – a hibás adat be sem kerül.

## A lecke feladata

Hozd létre a webshop `termekek` tábláját az alábbi szabályokkal:

- `kod`: legfeljebb 10 karakteres szöveg, ez az **elsődleges kulcs**,
- `nev`: legfeljebb 80 karakteres szöveg, **kötelező**,
- `ar`: pontos tizedes szám (`NUMERIC(10, 2)`), **kötelező**, és **nagyobb, mint 0**,
- `keszlet`: egész szám, **kötelező**, alapértéke **0**.

A gép kipróbálja: beszúr egy jó sort, majd megpróbál ismétlődő kódot, név nélküli terméket és 0 forintos árat – ezeket a táblának vissza kell utasítania.

```sql starter required
CREATE TABLE termekek (
  kod     VARCHAR(10),
  nev     VARCHAR(80),
  ar      NUMERIC(10, 2),
  keszlet INT
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termekek (
  kod     VARCHAR(10) PRIMARY KEY,
  nev     VARCHAR(80) NOT NULL,
  ar      NUMERIC(10, 2) NOT NULL CHECK (ar > 0),
  keszlet INT NOT NULL DEFAULT 0
);
```

</details>

```sql test
-- Segédfüggvény: lefuttat egy utasítást, és megmondja, sikerült-e.
CREATE FUNCTION probal(parancs TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE parancs;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (teszt TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES
  ('jó sor',          probal($q$INSERT INTO termekek (kod, nev, ar) VALUES ('T1', 'Egér', 4990)$q$)),
  ('ismétlődő kód',   probal($q$INSERT INTO termekek (kod, nev, ar) VALUES ('T1', 'Másik', 100)$q$)),
  ('név nélkül',      probal($q$INSERT INTO termekek (kod, ar) VALUES ('T2', 100)$q$)),
  ('0 Ft-os ár',      probal($q$INSERT INTO termekek (kod, nev, ar) VALUES ('T3', 'Ingyen', 0)$q$)),
  ('készlet nélkül',  probal($q$INSERT INTO termekek (kod, nev, ar, keszlet) VALUES ('T4', 'Hiba', 5, NULL)$q$));

SELECT teszt, eredmeny FROM eredmeny
UNION ALL
SELECT 'alap készlet', keszlet::TEXT FROM termekek WHERE kod = 'T1';
```
