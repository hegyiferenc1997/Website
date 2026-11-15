---
title: Gyakorlás – DBMS-ek összehasonlítása
summary: Ellenőrző kérdések a relációs és NoSQL rendszerekről, a felhős szolgáltatásokról és a választás módszeréről, majd öt projektleírás, amelyekhez ki kell választanod a legmegfelelőbb adatbázist.
minutes: 25
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
