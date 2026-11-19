---
title: Gyakorlás – gráf- és idősoros adatbázisok
summary: Ellenőrző kérdések a gráfmodellről, a rekurzív lekérdezésekről és az idősoros adatokról, majd egy ismerősajánló megírása SQL-ben, közös ismerősök számával.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség aközött, ahogyan a relációs és a gráf-adatbázis egy kapcsolatot tárol?</summary>

Relációsan a kapcsolatot idegen kulcsok (vagy egy kapcsolótábla) írják le, és lekérdezéskor JOIN-nal, indexes kereséssel állítjuk elő. A gráf-adatbázisban az él tárolt elem: minden csúcs közvetlenül hivatkozik a szomszédaira, így a bejárás mutatókövetés.

</details>

<details>
<summary>2. Miből áll egy rekurzív CTE, és mikor áll le?</summary>

Egy horgonyból (a kiinduló sorok) és egy rekurzív részből, amely az előző lépés soraiból újakat állít elő; a kettőt `UNION` köti össze. Akkor áll le, amikor egy lépés már nem ad új sort.

</details>

<details>
<summary>3. Miért veszélyes a ciklus egy rekurzív lekérdezésben, és hogyan védekezel?</summary>

Ha a gráfban kör van, és a lekérdezés `UNION ALL`-lal mindig újra hozzáadja a sorokat, sosem fogy el az új sor, így a lekérdezés végtelen ciklusba kerül. Védekezés: `UNION` (ismétlődés nélkül), a bejárt út nyilvántartása, vagy mélységkorlát.

</details>

<details>
<summary>4. Mi jellemzi az idősoros adatot?</summary>

Időbélyeges mérések, amelyek folyamatosan, időrendben érkeznek, szinte csak beszúrással, óriási mennyiségben. Időtartományokra kérdezünk le, és a régi adat részletessége idővel kevésbé fontos.

</details>

<details>
<summary>5. Mi a ritkítás és a megőrzési szabály, és miért van rájuk szükség?</summary>

Ritkítás: a részletes régi adatból összesítést (pl. napi átlagot) készítünk. Megőrzési szabály: a részletes adatot csak egy ideig tartjuk meg, utána automatikusan törlődik. Nélkülük az adatbázis korlátlanul nőne, miközben a régi részletekre már senkinek nincs szüksége.

</details>

## A gyakorlás feladata: ismerősajánló

Egy kis közösségi oldal ismeretségeit tároljuk. Minden ismeretség **mindkét irányban** szerepel a táblában (ha Anna ismeri Bélát, Béla is ismeri Annát).

<details>
<summary>A közösségi háló létrehozása (SQL)</summary>

```sql setup
-- Csúcsok: az emberek.
CREATE TABLE emberek (
  id  INT PRIMARY KEY,
  nev VARCHAR(20) NOT NULL
);
-- Élek: ki kit ismer (mindkét irányban tárolva).
CREATE TABLE ismeretsegek (
  ki   INT REFERENCES emberek (id),
  kit  INT REFERENCES emberek (id),
  PRIMARY KEY (ki, kit)
);
INSERT INTO emberek VALUES
  (1, 'Anna'), (2, 'Béla'), (3, 'Cili'), (4, 'Dani'),
  (5, 'Emma'), (6, 'Feri'), (7, 'Gabi'), (8, 'Hanna');
INSERT INTO ismeretsegek
SELECT a, b FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b)
UNION
SELECT b, a FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b);
```

</details>

```sql run
SELECT e1.nev AS ki, e2.nev AS kit
FROM ismeretsegek i
JOIN emberek e1 ON e1.id = i.ki
JOIN emberek e2 ON e2.id = i.kit
WHERE i.ki < i.kit
ORDER BY ki, kit;
```

Írj **ismerősajánlót Annának**! Keresd meg azokat, akik Anna ismerőseinek ismerősei, de **nem Anna**, és Anna **még nem ismeri** őket. Minden jelöltnél add meg, **hány közös ismerősük** van Annával. Oszlopok: név, közös ismerősök száma; a **közös ismerősök száma szerint csökkenő**, azon belül **név szerint** rendezve.

Tipp: két lépés az éltáblán (`ismeretsegek i1 JOIN ismeretsegek i2 ON i2.ki = i1.kit`), majd szűrés és csoportosítás.

```sql starter required
-- Anna közvetlen ismerősei
SELECT e.nev
FROM ismeretsegek i
JOIN emberek e ON e.id = i.kit
WHERE i.ki = 1
ORDER BY e.nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT e.nev, COUNT(*) AS kozos_ismerosok
FROM ismeretsegek i1                                -- Anna → ismerős
JOIN ismeretsegek i2 ON i2.ki = i1.kit              -- ismerős → az ő ismerőse
JOIN emberek e ON e.id = i2.kit
WHERE i1.ki = 1
  AND i2.kit <> 1                                   -- ne Anna legyen
  AND i2.kit NOT IN (SELECT kit FROM ismeretsegek WHERE ki = 1)   -- még nem ismeri
GROUP BY e.nev
ORDER BY kozos_ismerosok DESC, e.nev;
```

</details>

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

Az első három feladat a fenti közösségi hálón, az utolsó kettő egy kis szenzoros idősoron dolgozik.

**1.** **Fokszám.** Kinek hány ismerőse van? (Név, ismerősök száma; az ismerősök száma szerint csökkenően, azon belül név szerint.) Gráfnyelven ez a csúcsok **fokszáma**.

```sql starter
SELECT ki, kit
FROM ismeretsegek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT e.nev, COUNT(*) AS ismerosok
FROM ismeretsegek i
JOIN emberek e ON e.id = i.ki
GROUP BY e.nev
ORDER BY ismerosok DESC, e.nev;
```

</details>

**2.** **Közös ismerősök.** Hány **közös ismerőse** van Annának (1) és Daninak (4)? Kik ezek? (Nevek, ábécérendben.)

```sql starter
SELECT kit FROM ismeretsegek WHERE ki = 1;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT e.nev
FROM ismeretsegek a
JOIN ismeretsegek d ON d.kit = a.kit        -- ugyanaz az ismerős mindkettőjüknél
JOIN emberek e ON e.id = a.kit
WHERE a.ki = 1 AND d.ki = 4
ORDER BY e.nev;
```

</details>

**3.** **Távolság rekurzív lekérdezéssel.** Hány lépésre van Annától (1) mindenki más a hálóban? (Név, távolság; távolság, majd név szerint.) Tipp: rekurzív CTE, amely lépésről lépésre bővül, a végén pedig személyenként a **legkisebb** távolságot vesszük. A mélységet korlátozd (pl. 6 lépés), hogy a körök miatt ne fusson végtelenül!

```sql starter
WITH RECURSIVE ut (id, tav) AS (
  SELECT 1, 0                    -- kiindulás: Anna, 0 lépés
  -- UNION ALL ...
)
SELECT * FROM ut;
```

<details>
<summary>Megoldás</summary>

```sql solution
WITH RECURSIVE ut (id, tav) AS (
  SELECT 1, 0
  UNION ALL
  SELECT i.kit, u.tav + 1
  FROM ut u
  JOIN ismeretsegek i ON i.ki = u.id
  WHERE u.tav < 6                -- mélységkorlát a körök miatt
)
SELECT e.nev, MIN(u.tav) AS tavolsag
FROM ut u
JOIN emberek e ON e.id = u.id
WHERE u.id <> 1
GROUP BY e.nev
ORDER BY tavolsag, e.nev;
```

</details>

**4.** **Idősor: órás átlag.** Egy hőmérő 20 percenként mér. Számold ki **óránként** az átlaghőmérsékletet egy tizedesre (óra, átlag; időrendben)! A `date_trunc('hour', ido)` az időpontot az óra elejére „vágja”.

```sql starter
CREATE TABLE meresek (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meresek
SELECT TIMESTAMP '2026-01-10 08:00' + n * INTERVAL '20 minutes', 18 + n * 0.5
FROM generate_series(0, 8) AS n;

SELECT * FROM meresek ORDER BY ido;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE meresek (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meresek
SELECT TIMESTAMP '2026-01-10 08:00' + n * INTERVAL '20 minutes', 18 + n * 0.5
FROM generate_series(0, 8) AS n;

SELECT date_trunc('hour', ido) AS ora, ROUND(AVG(homerseklet), 1) AS atlag
FROM meresek
GROUP BY ora
ORDER BY ora;
```

</details>

**5.** **Idősor: mozgóátlag.** Ugyanezen a mérésen számold ki minden időpontra az **utolsó 3 mérés átlagát** (az aktuálissal együtt), két tizedesre – ez kisimítja a zajt. (Idő, hőmérséklet, mozgóátlag; időrendben.)

```sql starter
CREATE TABLE meresek (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meresek VALUES
  ('2026-01-10 08:00', 18.0), ('2026-01-10 08:20', 21.0), ('2026-01-10 08:40', 18.5),
  ('2026-01-10 09:00', 19.0), ('2026-01-10 09:20', 25.0), ('2026-01-10 09:40', 19.5);

SELECT ido, homerseklet FROM meresek ORDER BY ido;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE meresek (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meresek VALUES
  ('2026-01-10 08:00', 18.0), ('2026-01-10 08:20', 21.0), ('2026-01-10 08:40', 18.5),
  ('2026-01-10 09:00', 19.0), ('2026-01-10 09:20', 25.0), ('2026-01-10 09:40', 19.5);

SELECT ido, homerseklet,
       ROUND(AVG(homerseklet) OVER (ORDER BY ido ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS mozgoatlag
FROM meresek
ORDER BY ido;
```

</details>
