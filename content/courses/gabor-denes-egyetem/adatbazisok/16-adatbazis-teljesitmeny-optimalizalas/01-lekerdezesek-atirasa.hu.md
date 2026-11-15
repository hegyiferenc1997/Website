---
title: Lekérdezések átírása
summary: Először mérj, aztán optimalizálj: indexbarát (sargable) feltételek, csak a szükséges oszlopok lekérése, az N+1 lekérdezés problémája, az EXISTS és a JOIN helyes használata, valamint a kulcsalapú lapozás az OFFSET helyett – EXPLAIN-nel ellenőrizve a webshop adatbázisán.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- miért kell **először mérni**, és csak utána optimalizálni,
- mi az **indexbarát** (_sargable_) feltétel,
- mi az **N+1 probléma**, és hogyan kerüld el,
- miért jobb a **kulcsalapú lapozás**, mint az `OFFSET`.

## Először mérj!

> „A korai optimalizálás minden rossz gyökere.” – Donald Knuth

Ne találgass, hogy mi lassú. A 7. témakörben megismert `EXPLAIN` (és az `EXPLAIN ANALYZE`, amely ténylegesen le is futtatja a lekérdezést, és méri az időt) megmutatja, mit csinál valójában a DBMS. Élesben a **pg_stat_statements** bővítmény gyűjti össze, melyik lekérdezés viszi a legtöbb időt összesen – gyakran nem a leglassabb, hanem egy közepesen lassú, amely percenként ezerszer fut.

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. Indexbarát (sargable) feltételek

Egy feltétel akkor **indexbarát**, ha az index „bele tud keresni”: az oszlop **önmagában**, változatlanul áll az összehasonlítás egyik oldalán. Ha az oszlopra függvényt vagy műveletet alkalmazol, az indexet nem lehet használni, mert az a nyers értékek szerint rendezett.

| Nem indexbarát                          | Indexbarát átírás                                                  |
| --------------------------------------- | ------------------------------------------------------------------ |
| `WHERE EXTRACT(YEAR FROM datum) = 2025` | `WHERE datum >= '2025-01-01' AND datum < '2026-01-01'`             |
| `WHERE ar * 1.27 > 10000`               | `WHERE ar > 10000 / 1.27`                                          |
| `WHERE LOWER(email) = 'a@b.hu'`         | kifejezés alapú index: `CREATE INDEX … ON vasarlok (LOWER(email))` |
| `WHERE nev LIKE '%egér'`                | (eleje ismeretlen: B-fa nem segít; teljes szöveges keresés kell)   |
| `WHERE vasarlo_id + 0 = 42`             | `WHERE vasarlo_id = 42`                                            |

Nézd meg a különbséget! Tegyünk indexet a dátumra, és hasonlítsuk össze a két tervet:

```sql run
CREATE INDEX rendelesek_datum_idx ON rendelesek (datum);
EXPLAIN SELECT * FROM rendelesek WHERE EXTRACT(YEAR FROM datum) = 2025 AND EXTRACT(MONTH FROM datum) = 6;
```

```sql run
CREATE INDEX rendelesek_datum_idx ON rendelesek (datum);
EXPLAIN SELECT * FROM rendelesek WHERE datum >= '2025-06-01' AND datum < '2025-07-01';
```

Az első `Seq Scan` (mind a 20 000 sort végignézi), a második az indexet használja (`Bitmap Index Scan`).

## 2. Csak azt kérd le, ami kell

A `SELECT *` kényelmes, de:

- feleslegesen sok adatot mozgat a hálózaton (gondolj egy hosszú leírás vagy egy JSON oszlopra),
- megakadályozza, hogy a DBMS csak az indexből válaszoljon (_index-only scan_),
- ha később új oszlop kerül a táblába, a program váratlanul többet kap.

Ugyanez sorokra: ha csak az első 20 kell, használj `LIMIT`-et; ha csak a darabszám, `COUNT(*)`-ot – ne töltsd le az egészet, hogy a programban számold meg.

## 3. Az N+1 probléma

Egy programozó kilistázza a legutóbbi 100 rendelést, és mindegyik mellé a vásárló nevét:

```text
rendelesek = query("SELECT * FROM rendelesek ORDER BY datum DESC LIMIT 100")    -- 1 lekérdezés
for r in rendelesek:
    vasarlo = query("SELECT nev FROM vasarlok WHERE vasarlo_id = $1", r.vasarlo_id)  -- +100 lekérdezés
```

Ez **101** lekérdezés! Mindegyik egy oda-vissza út a hálózaton (akár 1 ms), plusz feldolgozás. Ez az **N+1 probléma** – gyakran az ORM-ek (17. témakör) „lusta betöltése” okozza, észrevétlenül. A megoldás: **egyetlen** lekérdezés JOIN-nal.

```sql run
SELECT r.rendeles_id, r.datum, v.nev
FROM rendelesek r
JOIN vasarlok v ON v.vasarlo_id = r.vasarlo_id
ORDER BY r.datum DESC, r.rendeles_id DESC
LIMIT 10;
```

## 4. EXISTS a „van-e?” kérdésekre

„Mely vásárlóknak van törölt rendelésük?” Ha JOIN-nal írod, egy vásárló annyiszor jelenik meg, ahány törölt rendelése van, és `DISTINCT`-tel kell utólag szűrni. Az `EXISTS` az első találatnál megáll – ez a „van-e?” kérdés természetes formája:

```sql run
SELECT COUNT(*) AS vasarlok_torolt_rendelessel
FROM vasarlok v
WHERE EXISTS (SELECT 1 FROM rendelesek r
              WHERE r.vasarlo_id = v.vasarlo_id AND r.statusz = 'törölt');
```

## 5. Kulcsalapú lapozás az OFFSET helyett

A klasszikus lapozás: `ORDER BY rendeles_id LIMIT 20 OFFSET 10000`. A gond: az `OFFSET 10000` miatt a DBMS-nek **le kell gyártania és el kell dobnia** 10 000 sort – minél hátrébb lapozol, annál lassabb.

A **kulcsalapú lapozás** (_keyset pagination_) azt jegyzi meg, hol tartottál, és onnan folytatja – az index egyenesen oda ugrik:

```sql run
-- Az előző oldal utolsó sora a 10000-es rendelés volt; a következő oldal:
SELECT rendeles_id, datum, statusz
FROM rendelesek
WHERE rendeles_id > 10000
ORDER BY rendeles_id
LIMIT 5;
```

```sql run
EXPLAIN SELECT rendeles_id, datum FROM rendelesek ORDER BY rendeles_id LIMIT 5 OFFSET 15000;
```

```sql run
EXPLAIN SELECT rendeles_id, datum FROM rendelesek WHERE rendeles_id > 15000 ORDER BY rendeles_id LIMIT 5;
```

Hasonlítsd össze a két terv becsült költségét (`cost=…` második száma): az `OFFSET`-es sokkal drágább.

## Összefoglalás

- Először mérj (`EXPLAIN`, `EXPLAIN ANALYZE`, pg_stat_statements).
- Indexbarát feltétel: az oszlop változatlanul álljon az összehasonlításban.
- Csak a szükséges oszlopokat és sorokat kérd le.
- N+1 helyett egy JOIN; „van-e?” kérdésre `EXISTS`.
- Kulcsalapú lapozás: `WHERE kulcs > utolsó ORDER BY kulcs LIMIT n`.

## A lecke feladata

A kiinduló kód létrehoz egy indexet a `datum` oszlopra, és egy `marciusi_rendelesek` nevű **nézetet** a 2025. márciusi rendelésekhez – de a nézet feltétele **nem indexbarát**, ezért a DBMS nem tudja használni az indexet. Írd át a nézet feltételét úgy, hogy **ugyanazokat a sorokat** adja vissza, de az index használható legyen.

A gép megszámolja a nézet sorait, és az `EXPLAIN` segítségével megnézi, használja-e a terv az indexet.

```sql starter required
CREATE INDEX rendelesek_datum_idx ON rendelesek (datum);

CREATE VIEW marciusi_rendelesek AS
  SELECT * FROM rendelesek
  WHERE EXTRACT(YEAR FROM datum) = 2025 AND EXTRACT(MONTH FROM datum) = 3;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX rendelesek_datum_idx ON rendelesek (datum);

CREATE VIEW marciusi_rendelesek AS
  SELECT * FROM rendelesek
  WHERE datum >= '2025-03-01' AND datum < '2025-04-01';
```

</details>

```sql test
-- Segédfüggvény: egy lekérdezés végrehajtási tervét adja vissza szövegként.
CREATE FUNCTION terv(lekerdezes TEXT) RETURNS TEXT AS $$
DECLARE
  sor TEXT;
  eredmeny TEXT := '';
BEGIN
  FOR sor IN EXECUTE 'EXPLAIN ' || lekerdezes LOOP
    eredmeny := eredmeny || sor || E'\n';
  END LOOP;
  RETURN eredmeny;
END $$ LANGUAGE plpgsql;

SELECT (SELECT COUNT(*) FROM marciusi_rendelesek) AS sorok,
       terv('SELECT * FROM marciusi_rendelesek') LIKE '%Index%' AS indexet_hasznal;
```
