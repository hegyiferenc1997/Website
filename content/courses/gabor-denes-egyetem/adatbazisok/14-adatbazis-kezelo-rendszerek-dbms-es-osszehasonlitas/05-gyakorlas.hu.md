---
title: Gyakorlás – DBMS-ek összehasonlítása
summary: Ellenőrző kérdések a relációs és NoSQL rendszerekről, a felhős szolgáltatásokról és a választás módszeréről, majd öt projektleírás, amelyekhez ki kell választanod a legmegfelelőbb adatbázist.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miben különbözik az SQLite a PostgreSQL-től és a MySQL-től?</summary>

Az SQLite-nak nincs külön szerverfolyamata: a teljes adatbázis egyetlen fájl, amelyet az alkalmazás egy könyvtáron keresztül közvetlenül olvas és ír. Ezért nulla beállítással működik, és ideális mobil- és asztali alkalmazásokba, de sok egyidejű író kiszolgálására nem való.

</details>

<details>
<summary>2. Mit jelent a gyártófüggés (vendor lock-in), és hogyan csökkenthető?</summary>

Azt, hogy egy rendszerről nagyon nehéz és drága lenne átköltözni, mert a kód és az adatok egy gyártó saját funkcióira épülnek. Csökkenthető szabványos SQL-lel, nyílt forráskódú rendszerekkel, és azzal, hogy a gyártóspecifikus részeket az alkalmazásban egy helyre gyűjtjük.

</details>

<details>
<summary>3. Mit nem vesz le a válladról egy menedzselt felhős adatbázis?</summary>

A sématervezést, az indexeket és a lekérdezések optimalizálását, a felhasználók és jogosultságok beállítását, a hálózati hozzáférés korlátozását, valamint az adatok tartalmáért és a jogszabályok (pl. GDPR) betartásáért viselt felelősséget.

</details>

<details>
<summary>4. Miért lehet félrevezető a súlyozatlan átlag a DBMS-ek pontozásánál?</summary>

Mert minden szempontot egyformán fontosnak vesz. Ha egy projektnek a költség sokkal fontosabb, mint a tanulhatóság, a súlyozatlan átlag egy drága, de sok szempontban erős rendszert is előre sorolhat.

</details>

<details>
<summary>5. Mikor indokolt egy relációs adatbázis mellé egy NoSQL rendszert is bevezetni?</summary>

Ha van olyan konkrét igény, amelyet a relációs adatbázis rosszul szolgál ki: pl. villámgyors gyorsítótár vagy munkamenet-tárolás (Redis), óriási írásterhelés (Cassandra), összetett kapcsolatbejárás (Neo4j) vagy teljes szöveges keresés (Elasticsearch). Divatból viszont nem érdemes: minden új rendszer üzemeltetési teher.

</details>

## A gyakorlás feladata

Öt csapat kér tőled tanácsot. Válaszd ki mindegyiknek a legjobban illő megoldást!

```quiz required
? Egy egyetemi hallgató mobilalkalmazást ír, amely a telefonon tárolja a jegyzeteit, internet nélkül is. Mit javasolsz?
+ SQLite
- Oracle Database
- Cassandra-fürt
- egy menedzselt SQL Server
! Beágyazott, szerver nélküli, egyetlen fájl a telefonon.

? Egy közepes webshop rendelései, készlete és számlái: pontosság kell, sok összetett lekérdezés, kis csapat, szűk költségvetés.
- Redis
+ PostgreSQL (akár menedzselt szolgáltatásként)
- Neo4j
- Oracle Database
! Nyílt, ACID, erős SQL, licencdíj nélkül.

? Egy bank, amely már évtizedek óta Oracle-t használ, sok beépített nagyvállalati funkcióra épít, és saját Oracle-szakértői vannak. Mi a legésszerűbb rövid távon?
+ maradni az Oracle-nél, és tervezetten vizsgálni a költözés lehetőségét
- azonnal átköltözni MongoDB-re
- mindent Redisbe tenni
- SQLite-ra váltani
! A költözés kockázatos és drága; a döntést alapos elemzés előzze meg.

? Egy online játék valós idejű ranglistája: másodpercenként sok ezer pontszám-frissítés, mindig a legjobb 100 kell, villámgyorsan.
- SQLite
+ Redis (rendezett halmaz)
- Neo4j
- egy archív objektumtár
! Memóriában, rendezett halmazzal a ranglista azonnali.

? Egy startup forgalma kiszámíthatatlan: néha napokig alig van látogató, néha egy kampány után hirtelen megtízszereződik. Kevés az üzemeltetési tapasztalatuk. Milyen üzemeltetési formát javasolsz?
- saját szerver az irodában
+ szerver nélküli (serverless) menedzselt adatbázis
- egy nagy, fix méretű bérelt szerver
! Használat szerint fizetnek, a méretezés automatikus.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

Minden feladatban egy **másik DBMS nyelvjárásában** írt lekérdezést kapsz megjegyzésként. Írd át **szabványos SQL-re / PostgreSQL-re**, hogy ugyanazt az eredményt adja!

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

**1.** **MySQL → szabványos lapozás.** A MySQL-es `LIMIT 2, 3` azt jelenti: „ugorj át 2 sort, és adj vissza 3-at”. Írd át a szabványos `OFFSET … FETCH` formára! (Tárgyak kódja és neve, kód szerint rendezve.)

```sql starter
-- MySQL: SELECT kod, nev FROM targyak ORDER BY kod LIMIT 2, 3;
SELECT kod, nev
FROM targyak
ORDER BY kod;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, nev
FROM targyak
ORDER BY kod
OFFSET 2 ROWS FETCH NEXT 3 ROWS ONLY;      -- SQL:2008 szabvány, Oracle és SQL Server is érti
```

</details>

**2.** **Oracle `NVL` → `COALESCE`.** Írd át: a hallgatók neve és városa, ismeretlen város helyett `'ismeretlen'` szöveggel, név szerint.

```sql starter
-- Oracle: SELECT nev, NVL(varos, 'ismeretlen') FROM hallgatok ORDER BY nev;
SELECT nev, varos
FROM hallgatok
ORDER BY nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, COALESCE(varos, 'ismeretlen') AS varos   -- COALESCE: szabványos, minden DBMS-ben megy
FROM hallgatok
ORDER BY nev;
```

</details>

**3.** **MySQL `GROUP_CONCAT` → `string_agg`.** Hallgatónként (Neptun-kód) a felvett tárgyak kódjai **vesszővel elválasztva, ábécérendben**, Neptun-kód szerint rendezve.

```sql starter
-- MySQL: SELECT neptun, GROUP_CONCAT(kod ORDER BY kod SEPARATOR ', ')
--        FROM jelentkezesek GROUP BY neptun ORDER BY neptun;
SELECT neptun, kod
FROM jelentkezesek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT neptun, string_agg(kod, ', ' ORDER BY kod) AS targyak
FROM jelentkezesek
GROUP BY neptun
ORDER BY neptun;
```

</details>

**4.** **Oracle `DECODE` → `CASE`.** A `DECODE(felev, 1, 'első', 3, 'harmadik', 'egyéb')` Oracle-specifikus. Írd át szabványos `CASE`-re! (Név, félév szövegesen, név szerint.)

```sql starter
-- Oracle: SELECT nev, DECODE(felev, 1, 'első', 3, 'harmadik', 'egyéb') FROM hallgatok ORDER BY nev;
SELECT nev, felev
FROM hallgatok
ORDER BY nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev,
       CASE felev
         WHEN 1 THEN 'első'
         WHEN 3 THEN 'harmadik'
         ELSE 'egyéb'
       END AS felev_szoveg
FROM hallgatok
ORDER BY nev;
```

</details>

**5.** **SQL Server `DATEDIFF` → PostgreSQL.** Hány évesek voltak a hallgatók **2025. szeptember 1-jén**? (Név, kor; csak ismert születési dátummal, név szerint.) PostgreSQL-ben az `AGE(dátum1, dátum2)` adja a pontos különbséget, ebből az `EXTRACT(YEAR FROM …)` veszi ki az éveket.

```sql starter
-- SQL Server (pontatlan: csak az évszámokat vonja ki!):
-- SELECT nev, DATEDIFF(year, szuletett, '2025-09-01') FROM hallgatok ...;
SELECT nev, szuletett
FROM hallgatok
ORDER BY nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, EXTRACT(YEAR FROM AGE(DATE '2025-09-01', szuletett)) AS kor
FROM hallgatok
WHERE szuletett IS NOT NULL
ORDER BY nev;
```

</details>
