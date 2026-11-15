---
title: EXPLAIN és a lekérdezésterv
summary: Hogyan dönt a lekérdezés-optimalizáló, mit jelent a Seq Scan, az Index Scan és a Bitmap Scan, hogyan olvasd a költséget és a becsült sorszámot, mi az EXPLAIN ANALYZE, a statisztikák szerepe és a JOIN-algoritmusok.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan **dönt** a DBMS arról, hogyan hajt végre egy lekérdezést,
- hogyan **olvasd** a lekérdezéstervet (`EXPLAIN`),
- mit mutat meg az `EXPLAIN ANALYZE`,
- miért fontosak a **statisztikák**.

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## Az optimalizáló – a GPS

Az SQL-ben azt mondod meg, **mit** kérsz, nem azt, hogyan. A „hogyan”-t a **lekérdezés-optimalizáló** találja ki, mint egy GPS: több lehetséges útvonalat (végrehajtási tervet) is kiszámol, megbecsli mindegyik **költségét**, és a legolcsóbbat választja. Ehhez **statisztikákat** használ: hány sor van a táblában, hány különböző érték egy oszlopban, mennyire gyakoriak.

## EXPLAIN – mit tervez a DBMS?

```sql run
EXPLAIN SELECT * FROM rendelesek WHERE rendeles_id = 1234;
```

Így olvasd a sort: `Index Scan using rendelesek_pkey on rendelesek (cost=0.29..8.30 rows=1 width=20)`

- **Index Scan using rendelesek_pkey** – az elsődleges kulcs indexét használja,
- **cost=0.29..8.30** – becsült költség (önkényes egységben): az első sorig ennyi, az összesig ennyi. Csak **összehasonlításra** jó (melyik terv olcsóbb), nem ezredmásodperc!
- **rows=1** – ennyi sort vár eredményül,
- **width=20** – egy sor átlagos mérete bájtban.

## A leggyakoribb műveletek

| Művelet              | Mit csinál                                                                | Mikor jó                                |
| -------------------- | ------------------------------------------------------------------------- | --------------------------------------- |
| **Seq Scan**         | végigolvassa a táblát                                                     | kis tábla, vagy a sorok nagy része kell |
| **Index Scan**       | az indexben keres, majd sorról sorra beolvassa a táblából                 | kevés találat                           |
| **Index Only Scan**  | minden kell adat az indexben van, a táblához nem is nyúl                  | a leggyorsabb                           |
| **Bitmap Heap Scan** | az indexből összegyűjti a találatok helyét, majd lapok sorrendjében olvas | közepes számú találat                   |
| **Sort**             | rendez (ha nincs hozzá index)                                             | `ORDER BY`, `GROUP BY`                  |
| **HashAggregate**    | csoportosít hash-táblával                                                 | `GROUP BY`                              |

```sql run
EXPLAIN SELECT statusz, COUNT(*) FROM rendelesek GROUP BY statusz;
```

## Összekapcsolások (JOIN) a tervben

Két tábla összekapcsolására három fő algoritmus van:

- **Nested Loop** (beágyazott ciklus): a külső tábla minden sorához megkeresi a belső tábla párját (indexszel gyors). Kevés sornál jó.
- **Hash Join**: a kisebb táblából memóriában hash-táblát épít, aztán a nagyobbat végigolvasva abban keres. Nagy, indexeletlen táblákra jó.
- **Merge Join**: mindkét táblát rendezi a kapcsolóoszlop szerint, majd „cipzárként” összefésüli.

```sql run
EXPLAIN SELECT v.nev, r.datum
FROM rendelesek r JOIN vasarlok v ON v.vasarlo_id = r.vasarlo_id
WHERE r.rendeles_id < 100;
```

A tervet **belülről kifelé** (a legjobban behúzott sortól felfelé) olvasd: először a legbelső műveletek futnak, az eredményük felfelé „folyik”.

## EXPLAIN ANALYZE – mi történt valójában?

Az `EXPLAIN` csak **tervez**, az `EXPLAIN ANALYZE` **le is futtatja** a lekérdezést, és a becslés mellé odaírja a valós időt és sorszámot:

```sql run
EXPLAIN ANALYZE SELECT * FROM rendelesek WHERE datum = '2026-03-15';
```

Figyeld az `actual time` és az `actual rows` értéket, és vesd össze a becsült `rows`-szal. Ha a becslés és a valóság **nagyon eltér** (pl. 10-et vár, 100 000 jön), az optimalizáló rossz tervet választhatott – ilyenkor gyakran elavultak a statisztikák.

Vigyázat: az `EXPLAIN ANALYZE` tényleg végrehajtja az utasítást – egy `DELETE`-nél ténylegesen töröl is! (Tranzakcióban, `ROLLBACK`-kel biztonságos.)

## Statisztikák: ANALYZE

A DBMS rendszeresen mintát vesz a táblákból (PostgreSQL-ben ezt az `ANALYZE` parancs és az automatikus _autovacuum_ végzi). Egy nagy adatbetöltés után érdemes kézzel futtatni: `ANALYZE rendelesek;`

## Próbáld ki: index előtt és után

```sql run
EXPLAIN ANALYZE SELECT COUNT(*) FROM rendelesek WHERE vasarlo_id = 42;
CREATE INDEX idx_rendelesek_vasarlo ON rendelesek (vasarlo_id);
EXPLAIN ANALYZE SELECT COUNT(*) FROM rendelesek WHERE vasarlo_id = 42;
```

Hasonlítsd össze a két `Execution Time`-ot és a műveleteket!

## Összefoglalás

- Az optimalizáló költségbecslés alapján választ tervet, statisztikák segítségével.
- `EXPLAIN` = terv; `EXPLAIN ANALYZE` = terv + valós futás (vigyázat, végrehajt!).
- Seq Scan, Index Scan, Index Only Scan, Bitmap Scan; JOIN: Nested Loop, Hash Join, Merge Join.
- Nagy eltérés a becsült és a valós sorszám között → `ANALYZE`.

## A lecke feladata

```quiz required
? Mit jelent a `Seq Scan` a lekérdezéstervben?
+ teljes táblaolvasás
- index használata
- rendezés
- összekapcsolás
! Sequential scan: sorban végigolvassa a táblát.

? Mi a különbség az `EXPLAIN` és az `EXPLAIN ANALYZE` között?
- nincs különbség
+ az ANALYZE le is futtatja a lekérdezést, és valós időt mutat
- az ANALYZE csak indexeket mutat
- az ANALYZE törli a statisztikákat
! Ezért egy DELETE-nél óvatosan!

? Melyik a leggyorsabb olvasás, amelyben a DBMS a táblához hozzá sem nyúl, mert minden adat az indexben van? (három szó)
= Index Only Scan
! Index Only Scan.

? A terv `rows=10`-et becsült, a valóságban 150 000 sor jött. Mi a legvalószínűbb oka?
- túl sok index
+ elavult statisztikák
- hibás SQL szintaxis
- túl kevés memória
! Futtasd az ANALYZE-t.

? Melyik JOIN-algoritmus épít a kisebb táblából memóriában keresőtáblát?
- Nested Loop
+ Hash Join
- Merge Join
! Hash tábla → Hash Join.
```
