---
title: Gyakorlás – SQL lekérdezések
summary: Ellenőrző kérdések és lekérdezés-feladatok a szűrésről, rendezésről, lapozásról, összesítésről és csoportosításról.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

**1.** **Átlag csoportonként, szűrt csoportokkal.** Tárgyanként (`kod`) a jegyek **átlaga két tizedesre kerekítve** – de csak azoknál a tárgyaknál, ahol **legalább 2 jegy** van. Az átlag szerint csökkenően, egyenlőségnél kód szerint rendezve.

```sql starter
SELECT kod, AVG(jegy)
FROM jelentkezesek
GROUP BY kod;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, ROUND(AVG(jegy), 2) AS atlag
FROM jelentkezesek
GROUP BY kod
HAVING COUNT(jegy) >= 2          -- a csoportokat a HAVING szűri (a NULL jegy nem számít)
ORDER BY atlag DESC, kod;
```

</details>

**2.** **Lapozás.** A tárgyakat kredit szerint csökkenően, azon belül név szerint rendezzük, oldalanként **2** tárggyal. Kérd le a **2. oldalt** (kód, név, kredit)!

```sql starter
SELECT kod, nev, kredit
FROM targyak
ORDER BY kredit DESC, nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, nev, kredit
FROM targyak
ORDER BY kredit DESC, nev
LIMIT 2 OFFSET 2;                -- az első 2 sort átugorjuk
```

</details>

**3.** **Hiányzó adatok.** Kiknek **ismeretlen a városa vagy a születési dátuma**? (Név, város, születési dátum, név szerint.)

```sql starter
SELECT nev, varos, szuletett
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, varos, szuletett
FROM hallgatok
WHERE varos IS NULL OR szuletett IS NULL    -- NULL-t csak IS NULL-lal lehet keresni
ORDER BY nev;
```

</details>

**4.** **Csoportosítás több összesítővel.** Szakonként a hallgatók **száma**, valamint a **legkisebb és legnagyobb félév**. Szak szerint rendezve.

```sql starter
SELECT szak
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT szak, COUNT(*) AS letszam, MIN(felev) AS min_felev, MAX(felev) AS max_felev
FROM hallgatok
GROUP BY szak
ORDER BY szak;
```

</details>

**5.** **Tartományok.** A **2005-ben** született hallgatók neve és születési dátuma, születés szerint sorban. (Kétféleképpen is megoldható: `BETWEEN`-nel vagy két összehasonlítással.)

```sql starter
SELECT nev, szuletett
FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, szuletett
FROM hallgatok
WHERE szuletett BETWEEN DATE '2005-01-01' AND DATE '2005-12-31'
ORDER BY szuletett;
```

</details>

**6.** **Számított oszlop.** Minden tárgyhoz írd ki, hány **tanórát** jelent (1 kredit ≈ 30 óra hallgatói munka): kód, kredit, `oraszam`. Az óraszám szerint csökkenően, azon belül kód szerint.

```sql starter
SELECT kod, kredit
FROM targyak;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, kredit, kredit * 30 AS oraszam
FROM targyak
ORDER BY oraszam DESC, kod;
```

</details>
