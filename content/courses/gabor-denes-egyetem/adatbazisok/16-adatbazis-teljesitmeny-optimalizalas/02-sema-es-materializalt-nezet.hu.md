---
title: Séma, materializált nézet és particionálás
summary: Sémaszintű teljesítményeszközök: a megfelelő adattípusok, a tudatos denormalizálás (előre kiszámolt összegek), a materializált nézet és frissítése, valamint a nagy táblák particionálása – a webshop adatbázisán kipróbálva.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- hogyan befolyásolják az **adattípusok** a teljesítményt,
- mikor éri meg a **tudatos denormalizálás**,
- mi a **materializált nézet**, és hogyan frissül,
- mire jó a **particionálás**.

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## Megfelelő adattípusok

A kisebb adat kevesebb lapot foglal (9. témakör), így kevesebb lemezművelet és több fér a pufferbe.

- Számot **számként** tárolj, ne szövegként (`INT` 4 bájt, a `'123456789'` szöveg 10 bájt – és szövegként rosszul is rendeződik).
- Dátumot `DATE` vagy `TIMESTAMP` típusban, ne szövegben.
- Pénzt `NUMERIC`-ban (pontos), ne `REAL`/`FLOAT`-ban (kerekítési hibák!).
- Az összekapcsolt oszlopok típusa egyezzen meg (egy `INT` és egy `BIGINT` vagy egy szöveg összekapcsolása átalakítást, és így lassabb tervet okozhat).

## Tudatos denormalizálás

A normalizálás (6. témakör) megszünteti az ismétlődést – de néha egy lekérdezéshez emiatt sok táblát kell összekapcsolni és sok sort összegezni. Ha egy ilyen érték **nagyon gyakran kell**, és **ritkán változik**, megéri előre kiszámolva eltárolni:

- a rendelés **végösszege** a `rendelesek` táblában (különben minden listázásnál össze kellene adni a tételeket),
- egy bejegyzés **lájkjainak száma** (különben mindig meg kellene számolni a lájkokat).

Az ár: a tárolt értéket **szinkronban kell tartani** (pl. triggerrel vagy az alkalmazásban), különben ellentmondás keletkezik. Ezért mindig tudatos, dokumentált döntés legyen!

## Materializált nézet

A sima **nézet** (10. témakör) csak egy elmentett lekérdezés: minden használatkor **újra lefut**. A **materializált nézet** ezzel szemben az eredményt **ténylegesen eltárolja**, mint egy táblát – így a lekérdezése villámgyors, akármilyen bonyolult is volt a kiszámítása.

```sql run
CREATE MATERIALIZED VIEW havi_bevetel AS
SELECT date_trunc('month', r.datum)::DATE AS honap,
       SUM(t.db * t.egysegar) AS bevetel
FROM rendelesek r
JOIN tetelek t ON t.rendeles_id = r.rendeles_id
WHERE r.statusz = 'kész'
GROUP BY honap;

SELECT * FROM havi_bevetel ORDER BY honap LIMIT 6;
```

A különbség a tervben látszik: a materializált nézet lekérdezése egy egyszerű táblaolvasás, nincs benne JOIN és összesítés.

```sql run
CREATE MATERIALIZED VIEW havi_bevetel AS
SELECT date_trunc('month', r.datum)::DATE AS honap, SUM(t.db * t.egysegar) AS bevetel
FROM rendelesek r JOIN tetelek t ON t.rendeles_id = r.rendeles_id
WHERE r.statusz = 'kész'
GROUP BY honap;

EXPLAIN SELECT * FROM havi_bevetel;
```

### A frissítés

Az ár: a materializált nézet **nem frissül magától**. Ha új rendelés érkezik, a nézet régi adatot mutat, amíg ki nem adod a frissítést:

```sql
REFRESH MATERIALIZED VIEW havi_bevetel;
-- vagy úgy, hogy közben az olvasók ne várjanak (egyedi index kell hozzá):
REFRESH MATERIALIZED VIEW CONCURRENTLY havi_bevetel;
```

Ezért olyan adatokra jó, amelyeknél elfogadható némi késés: napi riportok, irányítópultok, statisztikák – amelyeket pl. óránként vagy éjjel frissítünk.

| Szempont          | Nézet                       | Materializált nézet                  | Denormalizált oszlop               |
| ----------------- | --------------------------- | ------------------------------------ | ---------------------------------- |
| Tárolja az adatot? | nem                         | igen                                 | igen                               |
| Mindig friss?     | igen                        | nem, frissíteni kell                 | ha jól szinkronizálod              |
| Olvasás           | olyan lassú, mint a lekérdezés | gyors                             | gyors                              |
| Tipikus használat | egyszerűsítés, jogosultság  | riportok, irányítópultok             | gyakran kellő összegek, számlálók  |

## Particionálás

Egy több százmillió soros tábla (pl. évek rendelései, naplók, mérések) kezelése nehézkes. A **particionálás** a táblát **logikailag egynek** mutatja, de fizikailag **kisebb darabokra** (partíciókra) bontja, például évek vagy hónapok szerint.

```sql run
CREATE TABLE naplo (
  ido     DATE NOT NULL,
  uzenet  TEXT
) PARTITION BY RANGE (ido);

CREATE TABLE naplo_2025 PARTITION OF naplo FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE naplo_2026 PARTITION OF naplo FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

INSERT INTO naplo VALUES ('2025-05-10', 'régi esemény'), ('2026-03-02', 'új esemény');

EXPLAIN SELECT * FROM naplo WHERE ido >= '2026-01-01';
```

A tervben csak a `naplo_2026` partíció szerepel: a DBMS a feltétel alapján **kihagyta** a nem érintett partíciókat (_partition pruning_).

Előnyök:

- a lekérdezések csak a szükséges partíciót olvassák,
- a régi adat törlése villámgyors: egy egész partíció eldobása (`DROP TABLE naplo_2025`) a soronkénti `DELETE` helyett – ez a megőrzési szabályok (12. témakör) alapja,
- a karbantartás (VACUUM, indexépítés) partíciónként, kisebb darabokban történhet.

Kis táblánál nincs értelme – a particionálás a **nagyon nagy**, időben növekvő táblák eszköze.

## Összefoglalás

- Megfelelő, kicsi adattípusok; egyező típusok az összekapcsolt oszlopokon.
- Tudatos denormalizálás: előre kiszámolt érték, de szinkronban kell tartani.
- Materializált nézet: eltárolt eredmény, gyors olvasás, `REFRESH`-sel frissül.
- Particionálás: egy logikai tábla, több fizikai darab; partíciókihagyás, gyors törlés.

## A lecke feladata

A vezetői irányítópult **kategóriánkénti bevételt** mutat. A kiinduló kód sima nézettel számolja – ez minden betöltéskor összekapcsolja és összegzi a 40 000 tételt. Alakítsd át **materializált nézetté**: a `kategoria_bevetel` legyen materializált nézet, amely kategóriánként adja meg a **kész** rendelések tételeinek összértékét (`db * egysegar`). Oszlopok: kategória, bevétel.

A gép a nézet tartalmát és a típusát (materializált-e) is ellenőrzi.

```sql starter required
CREATE VIEW kategoria_bevetel AS
SELECT p.kategoria, SUM(t.db * t.egysegar) AS bevetel
FROM tetelek t
JOIN termekek p ON p.termek_id = t.termek_id
JOIN rendelesek r ON r.rendeles_id = t.rendeles_id
WHERE r.statusz = 'kész'
GROUP BY p.kategoria;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE MATERIALIZED VIEW kategoria_bevetel AS
SELECT p.kategoria, SUM(t.db * t.egysegar) AS bevetel
FROM tetelek t
JOIN termekek p ON p.termek_id = t.termek_id
JOIN rendelesek r ON r.rendeles_id = t.rendeles_id
WHERE r.statusz = 'kész'
GROUP BY p.kategoria;
```

</details>

```sql test
-- relkind: 'm' = materializált nézet, 'v' = sima nézet, 'r' = tábla
SELECT k.kategoria, k.bevetel,
       (SELECT relkind::TEXT FROM pg_class WHERE relname = 'kategoria_bevetel') AS tipus
FROM kategoria_bevetel k
ORDER BY k.kategoria;
```
