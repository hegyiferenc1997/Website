---
title: Gyakorlás – SQL lekérdezések
summary: Ellenőrző kérdések és lekérdezés-feladatok a szűrésről, rendezésről, lapozásról, összesítésről és csoportosításról.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem talál semmit a <code>WHERE varos = NULL</code>?</summary>

Mert a `NULL` „ismeretlen” értéket jelent, és bármilyen összehasonlítás egy ismeretlen értékkel szintén ismeretlen (nem igaz) eredményt ad. A `WHERE` csak azokat a sorokat tartja meg, ahol a feltétel **igaz**. Helyesen: `WHERE varos IS NULL`.

</details>

<details>
<summary>2. Mi a különbség a <code>COUNT(*)</code> és a <code>COUNT(jegy)</code> között?</summary>

A `COUNT(*)` minden sort megszámol, a `COUNT(jegy)` csak azokat, ahol a `jegy` nem NULL. A mintaadatbázisban 12 és 10.

</details>

<details>
<summary>3. Miért hibás ez: <code>SELECT kod, neptun, COUNT(*) FROM jelentkezesek GROUP BY kod</code>?</summary>

Mert egy tárgykódhoz több Neptun-kód is tartozik, a csoportból viszont egyetlen sor lesz – a DBMS nem tudja, melyiket írja ki. A `SELECT`-ben csak csoportosító oszlop vagy összesítő függvény állhat.

</details>

<details>
<summary>4. Miért nem működik a <code>WHERE</code>-ben a <code>SELECT</code>-ben megadott álnév?</summary>

Mert a logikai végrehajtási sorrendben a `WHERE` (2.) a `SELECT` (5.) előtt fut, így az álnév ott még nem létezik. Az `ORDER BY` (6.) már a `SELECT` után jön, ott használható.

</details>

<details>
<summary>5. Miért kell a <code>LIMIT</code> mellé <code>ORDER BY</code>?</summary>

Mert rendezés nélkül a sorok sorrendje nem meghatározott, így a „első 10 sor” bármelyik 10 sor lehet, és akár futtatásonként is változhat.

</details>

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Bemelegítő feladatok (nem kötelezők)

**a)** Azok a hallgatók (név, születési dátum), akik **2005-ben vagy később** születtek, a legfiatalabbal kezdve.

```sql starter
SELECT nev, szuletett
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, szuletett
FROM hallgatok
WHERE szuletett >= '2005-01-01'
ORDER BY szuletett DESC;
```

</details>

**b)** Hány tárgy van félévenként, és összesen hány kreditet érnek? (`felev`, `targyak_szama`, `osszkredit`, félév szerint rendezve)

```sql starter
SELECT felev
FROM targyak;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT felev, COUNT(*) AS targyak_szama, SUM(kredit) AS osszkredit
FROM targyak
GROUP BY felev
ORDER BY felev;
```

</details>

## Összefoglaló feladat

Kérd le, hogy **melyik városból hány hallgató** van (`varos`, `letszam`)! Az ismeretlen várost (NULL) hagyd ki. Rendezd létszám szerint csökkenően, egyenlőségnél városnév szerint.

```sql starter required
SELECT varos
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT varos, COUNT(*) AS letszam
FROM hallgatok
WHERE varos IS NOT NULL
GROUP BY varos
ORDER BY letszam DESC, varos;
```

</details>
