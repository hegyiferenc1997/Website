---
title: Riportok és kimutatások SQL-lel
summary: Hogyan lesz egy üzleti kérdésből megbízható riport: a kérdés pontosítása, a szűrés és az összekapcsolás, a duplán számolás csapdája, kereszttábla FILTER-rel, havi trend LAG-gal és halmozott összeggel, részesedés ablakfüggvénnyel.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan **pontosíts** egy homályos üzleti kérdést, mielőtt SQL-t írsz,
- hogyan kerüld el a riportok leggyakoribb hibáját, a **duplán számolást**,
- hogyan készíts **kereszttáblát**, **havi trendet** és **százalékos részesedést**.

A lecke példái a **webshop** mintaadatbázison futnak (4. és 16. témakörből ismerős).

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. Először a kérdés, aztán az SQL

A vezető ezt kéri: „Mennyit adtunk el az első negyedévben kategóriánként?” Mielőtt egy sort is írnál, tisztázd:

| Kérdés                       | Döntés                                                           |
| ---------------------------- | ---------------------------------------------------------------- |
| Mi számít eladásnak?         | csak a **kész** rendelés (a törölt nem, a szállítás alatti még nem) |
| Melyik időszak?              | 2026. január 1. – március 31., **a végén nyitott** intervallummal |
| Mit mérünk?                  | bevétel = darab × egységár, plusz a rendelések száma               |
| Mi egy sor a riportban?      | egy **kategória** (ez a riport „szemcséje”)                        |

Ez a négy döntés adja meg a `WHERE`, a `SELECT` és a `GROUP BY` részt. Ha nem tisztázod, két kolléga két különböző számot fog mondani ugyanarra a kérdésre – és mindkettő „jó” lesz.

**Tipp a dátumokhoz:** `datum >= '2026-01-01' AND datum < '2026-04-01'`. Így nem kell tudnod, hány napos a hónap, és időbélyegnél sem marad ki március 31. délutánja.

## 2. A duplán számolás csapdája

Ha a rendeléseket összekapcsolod a tételekkel, **minden rendelés annyi sorban jelenik meg, ahány tétele van**. A `COUNT(*)` ilyenkor tételeket számol, nem rendeléseket:

```sql run
SELECT COUNT(*) AS sorok, COUNT(DISTINCT r.rendeles_id) AS rendelesek
FROM rendelesek r
JOIN tetelek t ON t.rendeles_id = r.rendeles_id
WHERE r.datum = DATE '2026-03-02';
```

Ezen a napon 30 rendelés volt, de a JOIN után 60 sor. A megoldás: `COUNT(DISTINCT rendeles_id)`, vagy előbb összesíteni a tételeket rendelésenként (egy CTE-ben), és csak utána kapcsolni. **Szabály:** ha egy „1” oldali táblát egy „N” oldalival kapcsolsz, az „1” oldal adatait ne összegezd simán.

## 3. Kereszttábla: oszlopok a kategóriákból

Gyakori kérés: a státuszok legyenek **oszlopok**, a hónapok **sorok**. Erre a `FILTER` (vagy a régebbi `SUM(CASE WHEN … THEN 1 ELSE 0 END)`) való:

```sql run
SELECT to_char(datum, 'YYYY-MM') AS honap,
       COUNT(*) FILTER (WHERE statusz = 'kész')      AS kesz,
       COUNT(*) FILTER (WHERE statusz = 'szállítás') AS szallitas,
       COUNT(*) FILTER (WHERE statusz = 'törölt')    AS torolt
FROM rendelesek
WHERE datum >= DATE '2026-01-01' AND datum < DATE '2026-04-01'
GROUP BY honap
ORDER BY honap;
```

## 4. Trend: változás és halmozott összeg

A riportok fele idősor. Egy CTE-ben kiszámoljuk a havi bevételt, utána ablakfüggvényekkel (18. témakör) a változást és a halmozott összeget:

```sql run
WITH havi AS (
  SELECT to_char(r.datum, 'YYYY-MM') AS honap, SUM(t.db * t.egysegar) AS bevetel
  FROM rendelesek r
  JOIN tetelek t ON t.rendeles_id = r.rendeles_id
  WHERE r.statusz = 'kész'
    AND r.datum >= DATE '2026-01-01' AND r.datum < DATE '2026-07-01'
  GROUP BY honap
)
SELECT honap, bevetel,
       bevetel - LAG(bevetel) OVER (ORDER BY honap) AS valtozas,
       SUM(bevetel) OVER (ORDER BY honap)           AS halmozott
FROM havi
ORDER BY honap;
```

- `LAG(bevetel)` az **előző sor** értéke – az első hónapnál nincs ilyen, ezért NULL.
- `SUM(...) OVER (ORDER BY honap)` a **futó összeg**: az elejétől az aktuális sorig.

## 5. Részesedés: az egész egy darabja

„Hány százalékát adja a bevételnek ez a kategória?” Ehhez kell a **végösszeg** is minden sorban. Az ablakfüggvény ezt adja, a sorok összevonása nélkül:

```text
SUM(SUM(t.db * t.egysegar)) OVER ()
 └ belső SUM: a csoport (kategória) bevétele
     └ külső SUM … OVER (): ezek összege az egész eredményen
```

Furcsán néz ki, de logikus: a `GROUP BY` után a belső összeg már egy szám soronként, a külső pedig ezeket adja össze az üres ablakon (`OVER ()` = minden sor).

## 6. Egy jó riport ismérvei

- **Egyértelmű definíciók:** a riport alján vagy a lekérdezés kommentjében leírod, mi számít eladásnak.
- **Kerekítés a végén:** a számolás teljes pontossággal megy, csak a kiírásnál kerekítesz (`ROUND(..., 1)`).
- **Rendezés:** a legfontosabb elöl (általában csökkenő érték szerint).
- **Ellenőrzés:** a részösszegek adják ki a végösszeget? A részesedések összege 100%?

## A lecke feladata

Készítsd el a vezetőnek kért riportot: **2026 első negyedévének** (január 1. – március 31.) **kész** rendelései **kategóriánként**. Oszlopok:

1. `kategoria`,
2. `rendelesek`: hány **különböző** rendelésben szerepelt a kategória,
3. `bevetel`: darab × egységár összege,
4. `reszesedes`: a kategória bevétele a negyedéves összes bevétel százalékában, **1 tizedesre** kerekítve.

Rendezés: bevétel szerint csökkenő.

A kiinduló kód már összekapcsolja a táblákat, de minden rendelést és minden időszakot számol, és hiányzik két oszlop.

```sql starter required
SELECT p.kategoria,
       COUNT(*) AS rendelesek,
       SUM(t.db * t.egysegar) AS bevetel
FROM rendelesek r
JOIN tetelek t  ON t.rendeles_id = r.rendeles_id
JOIN termekek p ON p.termek_id = t.termek_id
GROUP BY p.kategoria
ORDER BY bevetel DESC;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT p.kategoria,
       COUNT(DISTINCT r.rendeles_id) AS rendelesek,
       SUM(t.db * t.egysegar) AS bevetel,
       ROUND(100 * SUM(t.db * t.egysegar) / SUM(SUM(t.db * t.egysegar)) OVER (), 1) AS reszesedes
FROM rendelesek r
JOIN tetelek t  ON t.rendeles_id = r.rendeles_id
JOIN termekek p ON p.termek_id = t.termek_id
WHERE r.statusz = 'kész'
  AND r.datum >= DATE '2026-01-01' AND r.datum < DATE '2026-04-01'
GROUP BY p.kategoria
ORDER BY bevetel DESC;
```

Az eredmény szerint a monitorok adják a bevétel több mint harmadát, pedig a hálózati eszközökkel holtversenyben a legkevesebb rendelésben szerepelnek – drága termékek. Jó riport: egy pillantással kiderül belőle valami, amit a nyers adatból nem látsz.

</details>
