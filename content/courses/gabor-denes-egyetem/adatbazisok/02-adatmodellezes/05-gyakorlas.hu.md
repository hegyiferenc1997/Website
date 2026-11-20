---
title: Gyakorlás – adatmodellezés
summary: Ellenőrző kérdések és összefoglaló feladatlap a modellezési szintekről, a modellezés lépéseiről, az adattípusokról és a megszorításokról.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a logikai és a fizikai modell között?</summary>

A **logikai** modell a táblákat, mezőket és kulcsokat írja le, de még bármelyik relációs DBMS-re jó. A **fizikai** modell egy konkrét rendszerhez készül: pontos adattípusok (`VARCHAR(80)`, `NUMERIC(10,2)`), indexek, tárolási beállítások, `CREATE TABLE` utasítások.

</details>

<details>
<summary>2. Miért érdemes a követelmények gyűjtésekor a kivételekre is rákérdezni?</summary>

Mert a modell szerkezete gyakran épp a kivételeken múlik. Ha kiderül, hogy egy hallgatónak lehet két szakja, a hallgató–szak kapcsolat 1 : N helyett N : M lesz, ami egy új táblát jelent. Ezt a terven percek alatt, egy éles rendszerben napok alatt lehet átvezetni.

</details>

<details>
<summary>3. Miért ne tároljunk pénzt REAL vagy DOUBLE PRECISION típusban?</summary>

Mert a lebegőpontos számok kettes számrendszerben közelítő értékek, így például a `0.1 + 0.2` nem pontosan `0.3`. Sok tranzakció után a kerekítési hibák összeadódnak. A `NUMERIC` pontos tizedes számot tárol.

</details>

<details>
<summary>4. Mi a különbség a PRIMARY KEY és a UNIQUE között?</summary>

Mindkettő tiltja az ismétlődést, de a `PRIMARY KEY` ezen felül **nem lehet NULL**, és táblánként csak **egy** van belőle – ez a sor „hivatalos” azonosítója. `UNIQUE` megszorításból több is lehet (pl. e-mail, adóazonosító), és ezek általában megengedik a NULL-t.

</details>

<details>
<summary>5. Miért jobb, ha a hibás adatot az adatbázis utasítja vissza, és nem csak az alkalmazás ellenőrzi?</summary>

Mert egy adatbázist több program is használhat (webes felület, mobilapp, importáló szkript, egy admin kézzel). Ha a szabály csak az egyik programban van, a többin keresztül hibás adat kerülhet be. Az adatbázis-megszorítás mindenkire vonatkozik.

</details>

## Összefoglaló feladatlap

Egy **kutyamenhely** szeretné nyilvántartani a kutyákat (név, fajta, születési év, chipszám), az örökbefogadókat (név, telefonszám, lakcím) és az örökbefogadásokat (melyik kutyát ki, mikor fogadta örökbe). Egy kutyát legfeljebb egyszer fogadnak örökbe, de egy család több kutyát is hazavihet.

```quiz required
? Hány egyed van a leírásban (az örökbefogadás kapcsolatot nem számítva)?
= 2
! Kutya és örökbefogadó.

? Milyen számosságú az örökbefogadó és a kutya kapcsolata?
- 1 : 1
+ 1 : N
- N : M
! Egy család több kutyát, egy kutyát egy család.

? Milyen típusban tárold a **telefonszámot**?
- INT
- NUMERIC(11, 0)
+ VARCHAR(20)
- REAL
! Nem számolunk vele, és a kezdő 0 vagy a + jel is számít.

? Melyik megszorítás biztosítja, hogy két kutyának ne lehessen ugyanaz a chipszáma (ha nem ez az elsődleges kulcs)?
- NOT NULL
+ UNIQUE
- DEFAULT
- CHECK
! Az egyediséget a UNIQUE biztosítja.

? Hogyan szól az a CHECK feltétel, amely szerint a születési év legalább 2000? (csak a zárójel tartalma, pl. ar > 0)
= szuletesi_ev >= 2000
= szuletesi_ev>=2000
= ev >= 2000
= ev>=2000
! CHECK (szuletesi_ev >= 2000)

? Melyik modellezési szinten döntjük el, hogy a chipszám `VARCHAR(15)` lesz?
- fogalmi
- logikai
+ fizikai
! Konkrét adattípus = fizikai modell.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

**1.** **Típusok és megszorítások.** Hozd létre a `termek` táblát: `id` egész, elsődleges kulcs; `nev` legfeljebb 40 karakter, kötelező; `ar` pénzösszeg két tizedesjeggyel (`NUMERIC(10, 2)`), **nagyobb mint 0**; `keszlet` egész, kötelező, **alapértéke 0**. Az ellenőrzés néhány beszúrást próbál ki.

```sql starter
CREATE TABLE termek (
  id INT
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termek (
  id      INT PRIMARY KEY,
  nev     VARCHAR(40) NOT NULL,
  ar      NUMERIC(10, 2) CHECK (ar > 0),
  keszlet INT NOT NULL DEFAULT 0          -- ha nem adjuk meg, 0 lesz
);
```

</details>

```sql test
CREATE FUNCTION probal(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, eset TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES (1, 'helyes sor', probal($q$INSERT INTO termek (id, nev, ar) VALUES (1, 'Egér', 4990)$q$));
INSERT INTO eredmeny VALUES (2, '0 Ft-os ár', probal($q$INSERT INTO termek (id, nev, ar) VALUES (2, 'Ingyen', 0)$q$));
INSERT INTO eredmeny VALUES (3, 'név nélkül', probal($q$INSERT INTO termek (id, nev, ar) VALUES (3, NULL, 100)$q$));
INSERT INTO eredmeny VALUES (4, 'ismétlődő id', probal($q$INSERT INTO termek (id, nev, ar) VALUES (1, 'Másik', 100)$q$));
INSERT INTO eredmeny SELECT 5, 'alapértelmezett készlet', keszlet::TEXT FROM termek WHERE id = 1;
SELECT * FROM eredmeny ORDER BY sorszam;
```

**2.** **1:N kapcsolat idegen kulccsal.** Egy cégnél minden dolgozó pontosan egy osztályhoz tartozik. Hozd létre az `osztalyok` (`id` kulcs, `nev` kötelező) és a `dolgozok` (`id` kulcs, `nev` kötelező, `osztaly_id` **kötelező, idegen kulcs**) táblát! Az ellenőrzés kipróbálja, hogy nem létező osztályhoz nem lehet dolgozót felvenni.

```sql starter
CREATE TABLE osztalyok (
  id INT PRIMARY KEY
);
CREATE TABLE dolgozok (
  id INT PRIMARY KEY
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE osztalyok (
  id  INT PRIMARY KEY,
  nev VARCHAR(40) NOT NULL
);
CREATE TABLE dolgozok (
  id         INT PRIMARY KEY,
  nev        VARCHAR(40) NOT NULL,
  osztaly_id INT NOT NULL REFERENCES osztalyok (id)   -- az „N” oldalon áll az idegen kulcs
);
```

</details>

```sql test
CREATE FUNCTION probal(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, eset TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES (1, 'új osztály', probal($q$INSERT INTO osztalyok VALUES (1, 'Fejlesztés')$q$));
INSERT INTO eredmeny VALUES (2, 'dolgozó létező osztályba', probal($q$INSERT INTO dolgozok VALUES (1, 'Kiss Anna', 1)$q$));
INSERT INTO eredmeny VALUES (3, 'dolgozó nem létező osztályba', probal($q$INSERT INTO dolgozok VALUES (2, 'Nagy Béla', 99)$q$));
INSERT INTO eredmeny VALUES (4, 'dolgozó osztály nélkül', probal($q$INSERT INTO dolgozok VALUES (3, 'Tóth Cili', NULL)$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```

**3.** **Miért jó a dátumtípus?** Számold ki SQL-lel, hány nap telik el **2025. március 1.** és **2025. december 24.** között! (Két `DATE` különbsége egész szám: a napok száma. Szövegként tárolt dátumokkal ez nem menne.)

```sql starter
SELECT '2025-12-24', '2025-03-01';
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT DATE '2025-12-24' - DATE '2025-03-01' AS napok;
```

</details>

**4.** **Egyediség.** Hozd létre a `felhasznalok` táblát: `id` kulcs; `email` legfeljebb 80 karakter, **kötelező és egyedi**; `szuletett` dátum, amely **2010. január 1. előtti** (csak nagykorúak regisztrálhatnak – egyszerűsítve).

```sql starter
CREATE TABLE felhasznalok (
  id INT PRIMARY KEY
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE felhasznalok (
  id        INT PRIMARY KEY,
  email     VARCHAR(80) NOT NULL UNIQUE,
  szuletett DATE CHECK (szuletett < DATE '2010-01-01')
);
```

</details>

```sql test
CREATE FUNCTION probal(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, eset TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES (1, 'helyes sor', probal($q$INSERT INTO felhasznalok VALUES (1, 'anna@pelda.hu', '2004-05-06')$q$));
INSERT INTO eredmeny VALUES (2, 'foglalt e-mail', probal($q$INSERT INTO felhasznalok VALUES (2, 'anna@pelda.hu', '2003-01-01')$q$));
INSERT INTO eredmeny VALUES (3, 'túl fiatal', probal($q$INSERT INTO felhasznalok VALUES (3, 'kicsi@pelda.hu', '2015-01-01')$q$));
INSERT INTO eredmeny VALUES (4, 'e-mail nélkül', probal($q$INSERT INTO felhasznalok VALUES (4, NULL, '2000-01-01')$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```
