---
title: NoSQL és felhős adatbázisok
summary: A legismertebb NoSQL rendszerek összevetése (MongoDB, Redis, Cassandra, Neo4j, DynamoDB), a saját üzemeltetés és a menedzselt felhős adatbázis-szolgáltatások (DBaaS) különbsége, a megosztott felelősség és a szerver nélküli adatbázisok.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- hogyan viszonyulnak egymáshoz a legismertebb **NoSQL** rendszerek,
- mi a különbség a **saját üzemeltetés** és a **menedzselt felhős** adatbázis között,
- mit jelent a **megosztott felelősség** és a **szerver nélküli** adatbázis.

## A NoSQL rendszerek egy pillantásra

A 11–12. témakörben megismerted a családokat. Íme a legismertebb képviselőik egymás mellett:

| Rendszer      | Család                   | Erőssége                                                       | Mire ne?                                     |
| ------------- | ------------------------ | -------------------------------------------------------------- | -------------------------------------------- |
| **MongoDB**   | dokumentum               | rugalmas séma, kényelmes fejlesztés, jó skálázás               | sok táblát összekapcsoló riportok            |
| **Redis**     | kulcs-érték              | memóriában, villámgyors; gyorsítótár, számlálók, sorok         | elsődleges, nagy, tartós adattár             |
| **Cassandra** | oszlopcsalád             | óriási írásterhelés, több adatközpont, nincs egyetlen hibapont | ad hoc lekérdezések, JOIN-ok                 |
| **Neo4j**     | gráf                     | kapcsolatok bejárása, legrövidebb út, ajánlás                  | egyszerű összesítő riportok, tömeges írás    |
| **DynamoDB**  | kulcs-érték / dokumentum | teljesen menedzselt (AWS), automatikus skálázás                | rugalmas lekérdezések, a felhőből kiköltözés |

Egy nagyobb rendszerben gyakran **többet is** használnak egyszerre – ezt hívják **többnyelvű adatmegőrzésnek** (_polyglot persistence_): PostgreSQL a rendelésekhez, Redis a gyorsítótárhoz, Elasticsearch a szöveges kereséshez.

## Saját üzemeltetés vagy menedzselt szolgáltatás?

Egy adatbázist futtathatsz **saját magad** (saját szerveren vagy egy bérelt virtuális gépen), vagy igénybe veheted egy felhőszolgáltató **menedzselt adatbázisát** (_DBaaS, Database as a Service_).

Néhány menedzselt szolgáltatás:

| Szolgáltató | Relációs                                          | NoSQL                         |
| ----------- | ------------------------------------------------- | ----------------------------- |
| AWS         | Amazon RDS (PostgreSQL, MySQL, …), Aurora         | DynamoDB, ElastiCache (Redis) |
| Microsoft   | Azure SQL Database, Azure Database for PostgreSQL | Cosmos DB                     |
| Google      | Cloud SQL, AlloyDB, Spanner                       | Firestore, Bigtable           |
| Független   | Neon, Supabase (PostgreSQL), PlanetScale (MySQL)  | MongoDB Atlas, Redis Cloud    |

### Ki miért felel?

A felhőben a felelősség **megoszlik** a szolgáltató és az ügyfél között:

| Feladat                                              | Saját szerver | Menedzselt (DBaaS)      |
| ---------------------------------------------------- | ------------- | ----------------------- |
| hardver, áram, hűtés, adatközpont                    | te            | szolgáltató             |
| operációs rendszer és DBMS telepítése, frissítése    | te            | szolgáltató             |
| automatikus mentés, replikáció, feladatátvétel       | te            | szolgáltató (beállítod) |
| **sématerv, indexek, lekérdezések**                  | te            | **te**                  |
| **felhasználók, jogosultságok, hálózati hozzáférés** | te            | **te**                  |
| **az adat tartalma és a jogszabályok betartása**     | te            | **te**                  |

A menedzselt szolgáltatás tehát **nem veszi le** a válladról az adatbázis tervezését és a biztonságos beállítást – csak az üzemeltetés „unalmas” részét.

| Szempont    | Saját üzemeltetés                         | Menedzselt (DBaaS)                            |
| ----------- | ----------------------------------------- | --------------------------------------------- |
| Kontroll    | teljes (bármilyen bővítmény, beállítás)   | korlátozott (amit a szolgáltató enged)        |
| Munka       | sok: frissítés, mentés, felügyelet        | kevés: pár kattintás                          |
| Költség     | kiszámítható, nagy méretben olcsóbb lehet | kis méretben olcsó, nagy méretben drága lehet |
| Szakértelem | adatbázis-üzemeltető kell                 | kevesebb szakértelem is elég az induláshoz    |

## Szerver nélküli (serverless) adatbázisok

A **szerver nélküli** adatbázisnál nem egy adott méretű szervert bérelsz, hanem a tényleges használatért fizetsz. Ha senki nem használja, a számítási kapacitás **nullára** áll le, ha megugrik a forgalom, automatikusan nő. Ilyen például a Neon, az Aurora Serverless vagy a DynamoDB.

- **Előny**: nincs teendő a méretezéssel, változó forgalomnál (pl. egy egyetemi projekt vagy egy induló termék) nagyon olcsó.
- **Hátrány**: a „felébredés” után az első kérés lassabb lehet (_cold start_), és folyamatos, nagy terhelésnél drágább lehet egy fix szervernél.

## Összefoglalás

- MongoDB (dokumentum), Redis (kulcs-érték, memória), Cassandra (oszlopcsalád), Neo4j (gráf), DynamoDB (menedzselt kulcs-érték).
- Többnyelvű adatmegőrzés: minden feladatra a hozzá illő adatbázis.
- DBaaS: a szolgáltató üzemeltet, de a tervezés, a jogosultságok és az adatvédelem a te felelősséged marad.
- Szerver nélküli: használat szerinti díj, automatikus méretezés, hidegindítás.

## A lecke feladata

```quiz required
? Egy cég PostgreSQL-t használ a rendelésekhez, Redist a gyorsítótárhoz és Elasticsearch-öt a szöveges kereséshez. Mi ennek a neve?
- vendor lock-in
+ többnyelvű adatmegőrzés (polyglot persistence)
- szerver nélküli architektúra
- sharding
! Minden feladatra a hozzá illő adatbázis.

? Egy menedzselt felhős adatbázisnál ki felel az indexek és a jogosultságok helyes beállításáért?
- a felhőszolgáltató
+ az ügyfél (te)
- senki, ezek automatikusak
! A megosztott felelősség modellje szerint a sématerv és a hozzáférés az ügyfélé.

? Mi a menedzselt adatbázis-szolgáltatás (DBaaS) legfőbb előnye a saját üzemeltetéssel szemben?
+ a szolgáltató végzi a telepítést, frissítést, mentést és a replikációt
- teljes kontroll minden beállítás felett
- nagy méretben mindig olcsóbb
- nem kell jogosultságokat beállítani
! Az üzemeltetés „unalmas” része lekerül a válladról.

? Mit jelent a hidegindítás (cold start) egy szerver nélküli adatbázisnál?
- a mentést hidegtárolóba teszik
+ egy leállt (nullára skálázott) adatbázis első kérése lassabb, mert előbb fel kell ébrednie
- az adatbázis csak télen érhető el
- a szerver túlmelegedés miatt leáll
! Cserébe használaton kívül nem fizetsz a számítási kapacitásért.

? Melyik rendszert választanád elsődleges, tartós adattárnak egy könyvelőprogramhoz?
- Redis
- Cassandra
+ PostgreSQL
- Neo4j
! Pénzügyi adatokhoz ACID tranzakciók és összetett lekérdezések kellenek.
```
