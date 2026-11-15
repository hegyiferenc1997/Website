---
title: Az adatbázisok típusai
summary: Hierarchikus, hálós, relációs, objektumorientált, NoSQL és NewSQL adatbázisok; csoportosítás felhasználás (OLTP / OLAP), elhelyezkedés (központi / elosztott) és üzemmód (beágyazott / kliens-szerver) szerint.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan fejlődtek az adatmodellek a hierarchikustól a NoSQL-ig,
- milyen szempontok szerint csoportosíthatók még az adatbázisok,
- melyik típus milyen feladatra jó.

## Egy kis történelem: az adatmodellek

**1. Hierarchikus modell (1960-as évek, pl. IBM IMS).** Az adatok **fába** rendeződnek: minden elemnek pontosan egy szülője van, mint a mappáknak a fájlrendszerben.

```text
          Egyetem
          /      \
      Kar A      Kar B
      /   \         \
  Szak 1  Szak 2   Szak 3
```

Gyors, ha a fa mentén keresünk, de a „sok a sokhoz” kapcsolat (egy hallgató több tárgyat vesz fel, egy tárgyat sok hallgató) csak ismétléssel írható le.

**2. Hálós modell (CODASYL, 1970-es évek).** Egy elemnek **több szülője** is lehet, az adatok gráfot alkotnak. Rugalmasabb, de a programnak „mutatókon” kell végiglépkednie, így a lekérdezés bonyolult, és a szerkezet változása minden programot érint.

**3. Relációs modell (E. F. Codd, 1970).** Minden adat **táblákban** van, a kapcsolatokat közös értékek (kulcsok) adják, nem mutatók. A lekérdezés deklaratív (SQL): azt mondod meg, **mit** kérsz, nem azt, hogyan kell odajutni. Ma is ez a legelterjedtebb (PostgreSQL, MySQL, Oracle, SQL Server, SQLite).

**4. Objektumorientált és objektum-relációs modell (1990-es évek).** Az adatbázis objektumokat tárol, öröklődéssel és metódusokkal. Tisztán objektumos rendszerek ritkák lettek, de sok gondolatuk beépült a relációs rendszerekbe (pl. a PostgreSQL saját típusai, tömbjei, JSON támogatása – ezért **objektum-relációs**).

**5. NoSQL (2000-es évek vége).** „Not only SQL”: a nagy webes cégek óriási, gyorsan változó adataira. Négy fő fajta: **kulcs-érték** (Redis), **dokumentum** (MongoDB), **oszlopcsalád** (Cassandra), **gráf** (Neo4j). A 11. és 12. témakör részletesen foglalkozik velük.

**6. NewSQL (2010-es évek).** A relációs modell és az SQL megtartása mellett **vízszintesen skálázható**, elosztott rendszerek (pl. CockroachDB, Google Spanner, TiDB).

## További csoportosítási szempontok

| Szempont          | Típusok                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Felhasználás**  | **OLTP**: sok kis tranzakció (webshop rendelés, banki utalás); **OLAP**: nagy elemző lekérdezések (havi kimutatás) – lásd 18. témakör                      |
| **Elhelyezkedés** | **központi** (egy szerver) vagy **elosztott** (több gép, akár több kontinensen)                                                                            |
| **Üzemmód**       | **kliens-szerver** (külön szerverfolyamat, hálózaton érhető el, pl. PostgreSQL) vagy **beágyazott** (a program része, egy fájl, pl. SQLite a telefonodban) |
| **Tárolás helye** | **lemezalapú** vagy **memóriabeli** (in-memory, pl. Redis – nagyon gyors)                                                                                  |
| **Üzemeltetés**   | saját szerveren vagy **felhőben szolgáltatásként** (DBaaS, pl. Amazon RDS, Neon, Supabase)                                                                 |

## Melyiket mikor?

- **Webshop, banki rendszer, Neptun**: relációs (szigorú szabályok, tranzakciók).
- **Mobilalkalmazás helyi adatai**: beágyazott relációs (SQLite).
- **Munkamenetek, gyorsítótár, ranglista**: kulcs-érték, memóriában (Redis).
- **Változatos szerkezetű termékkatalógus, tartalomkezelés**: dokumentum (MongoDB vagy PostgreSQL JSONB).
- **Közösségi háló, ajánlórendszer**: gráf (Neo4j).
- **Szenzoradatok, monitorozás**: idősoros (InfluxDB, TimescaleDB).

Egy mai nagy rendszer gyakran **többet is** használ egyszerre (ez a _poliglott perzisztencia_): a rendelések PostgreSQL-ben, a kosár Redisben, a keresés Elasticsearchben.

## Összefoglalás

- Fejlődés: hierarchikus (fa) → hálós (gráf, mutatók) → relációs (táblák, kulcsok, SQL) → objektum(-relációs) → NoSQL → NewSQL.
- Csoportosítás még: OLTP / OLAP, központi / elosztott, kliens-szerver / beágyazott, lemez / memória.
- Nincs „legjobb” adatbázis, csak a feladathoz illő.

## A lecke feladata

```quiz required
? Melyik modellben rendeződnek az adatok fába, ahol minden elemnek egy szülője van?
+ hierarchikus
- hálós
- relációs
- gráf
! Mint a mappák a fájlrendszerben.

? Ki alkotta meg a relációs modellt 1970-ben?
- Bill Gates
+ E. F. Codd
- Linus Torvalds
- Tim Berners-Lee
! Edgar F. Codd az IBM kutatója volt.

? Egy mobilalkalmazás a telefonon, külön szerver nélkül, egy fájlban tárolja az adatait. Milyen üzemmódú adatbázis ez?
- kliens-szerver
+ beágyazott
- elosztott
- OLAP
! Pl. SQLite: a program része.

? Melyik a NoSQL **kulcs-érték** adatbázis tipikus példája?
- PostgreSQL
- Neo4j
+ Redis
- Oracle
! A Redis memóriában tárolt kulcs-érték párokkal dolgozik.

? Hogy hívják az olyan rendszert, amely egyszerre több különböző adatbázist használ (pl. PostgreSQL + Redis)? (két szó)
= poliglott perzisztencia
= polyglot persistence
! Mindegyik adat ott van, ahol a legjobban kezelhető.
```
