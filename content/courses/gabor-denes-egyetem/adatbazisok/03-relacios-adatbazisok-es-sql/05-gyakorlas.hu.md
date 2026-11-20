---
title: Gyakorlás – relációs modell és SQL
summary: Ellenőrző kérdések, egy relációs algebrai kifejezés SQL-re fordítása és összefoglaló feladatlap a kulcsokról, a relációs algebráról és a DDL-ről.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem lehet egy relációban két teljesen egyforma sor?</summary>

Mert a reláció matematikailag **halmaz**, a halmazban pedig minden elem csak egyszer szerepel. A gyakorlatban ezt az **elsődleges kulcs** biztosítja: ha két sor kulcsa különbözik, a két sor sem lehet egyforma.

</details>

<details>
<summary>2. Mi a különbség a jelöltkulcs és az elsődleges kulcs között?</summary>

Jelöltkulcs **minden** minimális, egyértelműen azonosító attribútumhalmaz (lehet több is, pl. Neptun-kód és adóazonosító). Az elsődleges kulcs ezek közül a **kiválasztott egy**; a többiből alternatív kulcs lesz (`UNIQUE` megszorítással).

</details>

<details>
<summary>3. Miért érdemes gyakran mesterséges kulcsot (pl. sorszámot) választani a természetes helyett?</summary>

Mert a természetes kulcs a valóságból jön, és a valóság változhat (új rendszám, névváltozás, elírt ISBN). Ha egy elsődleges kulcs megváltozik, minden rá hivatkozó idegen kulcsot is frissíteni kell. A mesterséges kulcsnak nincs jelentése, ezért sosem kell megváltoztatni.

</details>

<details>
<summary>4. Miért kell projekciónál SQL-ben külön kiírni a DISTINCT-et?</summary>

Mert a relációs algebra halmazokkal dolgozik (az ismétlődés magától eltűnik), az SQL viszont **multihalmazokkal** (táblákkal, amelyekben lehet ismétlődés) – a duplikátumok kiszűrése költséges, ezért csak kérésre teszi meg.

</details>

<details>
<summary>5. Mi a különbség a DROP TABLE és a TRUNCATE között?</summary>

A `DROP TABLE` a táblát magát törli (szerkezettel, megszorításokkal, adatokkal együtt). A `TRUNCATE` csak a sorokat törli, a tábla üresen megmarad.

</details>

## Gyakorló SQL feladat (nem kötelező)

Fordítsd le SQL-re ezt a relációs algebrai kifejezést: `π nev, felev ( σ szak = 'gazdaságinformatikus' (hallgatok) )`

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql starter
SELECT ...
FROM hallgatok
WHERE ...;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, felev
FROM hallgatok
WHERE szak = 'gazdaságinformatikus';
```

</details>

## Összefoglaló feladatlap

```quiz required
? A `szamlak(szamlaszam, ugyfel, egyenleg, nyitas_datuma)` relációban 1200 sor van. Mennyi a fokszáma?
= 4
! A fokszám az attribútumok száma, a sorok száma (1200) a számosság.

? Egy autós táblában a rendszám és az alvázszám is egyértelműen azonosít. Ha az alvázszámot választjuk elsődleges kulcsnak, mi lesz a rendszám?
- idegen kulcs
+ alternatív kulcs
- szuperkulcs, de nem kulcs
- összetett kulcs
! A nem választott jelöltkulcs = alternatív kulcs.

? Melyik relációs algebrai művelet felel meg az SQL `WHERE` részének?
+ szelekció (σ)
- projekció (π)
- átnevezés (ρ)
- unió (∪)
! A WHERE sorokat szűr.

? Egy 4 soros és egy 7 soros tábla Descartes-szorzatának hány sora van?
= 28
! 4 · 7.

? Melyik SQL kulcsszó teszi az oszlopot idegen kulccsá a `CREATE TABLE`-ben?
- PRIMARY KEY
- UNIQUE
+ REFERENCES
- CHECK
! pl. tanszek_id INT REFERENCES tanszekek (tanszek_id)

? Melyik utasítással adsz új oszlopot egy meglévő táblához? (két szó)
= ALTER TABLE
! ALTER TABLE … ADD COLUMN …
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

**1.** **Kiválasztás és vetítés.** Relációs algebrában: π<sub>nev, kredit</sub>(σ<sub>kredit ≥ 5</sub>(targyak)). Írd fel SQL-ben, név szerint rendezve!

```sql starter
SELECT *
FROM targyak;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, kredit           -- vetítés (π)
FROM targyak
WHERE kredit >= 5            -- kiválasztás (σ)
ORDER BY nev;
```

</details>

**2.** **Unió.** Kik azok (Neptun-kód), akik **kaptak már ötöst** valamiből, **vagy** az **5. félévben** járnak? Minden kód egyszer szerepeljen, sorba rendezve.

```sql starter
SELECT neptun FROM jelentkezesek WHERE jegy = 5;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT neptun FROM jelentkezesek WHERE jegy = 5
UNION                                   -- a UNION kiszűri az ismétlődéseket
SELECT neptun FROM hallgatok WHERE felev = 5
ORDER BY 1;
```

</details>

**3.** **Metszet.** Kik vették fel az `ADB` **és** a `DIG` tárgyat is? (Neptun-kód, sorba rendezve.)

```sql starter
SELECT neptun FROM jelentkezesek WHERE kod = 'ADB';
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT neptun FROM jelentkezesek WHERE kod = 'ADB'
INTERSECT
SELECT neptun FROM jelentkezesek WHERE kod = 'DIG'
ORDER BY 1;
```

</details>

**4.** **Összekapcsolás.** A _Programozási alapok_ tárgyat felvett hallgatók **neve és jegye**, név szerint rendezve. Ehhez a hallgatók, a jelentkezések és a tárgyak tábláját is össze kell kapcsolnod.

```sql starter
SELECT *
FROM jelentkezesek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev, j.jegy
FROM jelentkezesek j
JOIN hallgatok h ON h.neptun = j.neptun
JOIN targyak t   ON t.kod = j.kod
WHERE t.nev = 'Programozási alapok'
ORDER BY h.nev;
```

</details>

**5.** **Descartes-szorzat.** Hány sora van a `hallgatok × targyak` szorzatnak? Előbb számold ki fejben (6 hallgató, 5 tárgy), aztán ellenőrizd SQL-lel!

```sql starter
SELECT *
FROM hallgatok CROSS JOIN targyak;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT COUNT(*) AS sorok
FROM hallgatok CROSS JOIN targyak;      -- 6 × 5 = 30
```

</details>
