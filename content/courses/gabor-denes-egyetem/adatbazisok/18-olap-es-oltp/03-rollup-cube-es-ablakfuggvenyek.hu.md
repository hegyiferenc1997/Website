---
title: ROLLUP, CUBE és ablakfüggvények
summary: Elemző SQL: részösszegek és végösszeg egy lekérdezésben (ROLLUP), minden kombináció összesítése (CUBE, GROUPING SETS), a GROUPING függvény, valamint ablakfüggvények riportokhoz: rangsor, futó összeg, részesedés és változás az előző időszakhoz képest.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan kapj **részösszegeket és végösszeget** egyetlen lekérdezéssel (`ROLLUP`),
- mire jó a `CUBE` és a `GROUPING SETS`,
- hogyan készíts **rangsort**, **futó összeget** és **százalékos részesedést** ablakfüggvényekkel.

<details>
<summary>Az üzletlánc adattárházának létrehozása (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

## Részösszegek: ROLLUP

Egy klasszikus riport: bevétel **kategóriánként és évenként**, kategóriánként **részösszeggel**, a végén **végösszeggel** – mint egy Excel-kimutatásban. Sima `GROUP BY`-jal ehhez három lekérdezést kellene `UNION ALL`-lal összefűzni. A `ROLLUP` ezt egyben megcsinálja:

```sql run
SELECT p.kategoria, d.ev, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_datum d ON d.datum_id = f.datum_id
GROUP BY ROLLUP (p.kategoria, d.ev)
ORDER BY p.kategoria, d.ev;
```

A `ROLLUP (a, b)` ezeket a csoportosításokat készíti el:

```text
 (kategoria, ev)   → kategória és év szerinti sorok
 (kategoria)       → kategóriánkénti részösszeg   (az ev oszlop NULL)
 ()                → végösszeg                     (mindkettő NULL)
```

A részösszeg-sorokban a „hiányzó” oszlop `NULL`. Hogy ez olvashatóbb legyen, a `GROUPING()` függvény megmondja, hogy egy `NULL` valódi adat-e, vagy összesítő sor jele (1 = összesítő):

```sql run
SELECT CASE WHEN GROUPING(p.kategoria) = 1 THEN 'MINDÖSSZESEN' ELSE p.kategoria END AS kategoria,
       CASE WHEN GROUPING(d.ev) = 1 THEN 'összesen' ELSE d.ev::TEXT END AS ev,
       SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_datum d ON d.datum_id = f.datum_id
GROUP BY ROLLUP (p.kategoria, d.ev)
ORDER BY GROUPING(p.kategoria), p.kategoria, GROUPING(d.ev), d.ev;
```

## CUBE és GROUPING SETS

- `CUBE (a, b)`: **minden** kombináció: (a, b), (a), (b) és (). Így régiónkénti és kategóriánkénti összeget is kapsz, egyszerre.
- `GROUPING SETS ((a), (b), ())`: pontosan azokat a csoportosításokat, amelyeket felsorolsz.

```sql run
SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY GROUPING SETS ((b.regio), (p.kategoria), ())
ORDER BY b.regio, p.kategoria;
```

## Ablakfüggvények a riportokban

A 12. témakörben már láttad a mozgóátlagot és a `LAG`-ot. Az ablakfüggvények (`… OVER (…)`) azért olyan hasznosak az elemzésben, mert **minden sor megmarad**, és mellé egy csoportra vagy sorrendre számolt érték kerül.

### Rangsor

```sql run
SELECT p.nev, SUM(f.bevetel) AS bevetel,
       RANK() OVER (ORDER BY SUM(f.bevetel) DESC) AS helyezes
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
GROUP BY p.nev
ORDER BY helyezes;
```

A `RANK` holtversenynél kihagy helyezést (1, 2, 2, 4), a `DENSE_RANK` nem (1, 2, 2, 3), a `ROW_NUMBER` mindig egyedi sorszámot ad.

### Rangsor csoportonként és részesedés

A `PARTITION BY` csoportonként újrakezdi a számolást – így például **régiónként** kapod meg a legjobb kategóriát, és azt is, hogy a régió bevételének hány százalékát adja:

```sql run
SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel,
       RANK() OVER (PARTITION BY b.regio ORDER BY SUM(f.bevetel) DESC) AS helyezes_a_regioban,
       ROUND(100.0 * SUM(f.bevetel) / SUM(SUM(f.bevetel)) OVER (PARTITION BY b.regio), 1) AS reszesedes_szazalek
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY b.regio, p.kategoria
ORDER BY b.regio, helyezes_a_regioban;
```

(A `SUM(SUM(f.bevetel)) OVER (…)` elsőre furcsa: a belső `SUM` a `GROUP BY` összesítése, a külső az ablakfüggvény, amely ezeket adja össze régiónként.)

### Futó összeg és változás

```sql run
SELECT d.ev, d.honap, SUM(f.bevetel) AS bevetel,
       SUM(SUM(f.bevetel)) OVER (PARTITION BY d.ev ORDER BY d.honap) AS eves_futo_osszeg,
       SUM(f.bevetel) - LAG(SUM(f.bevetel)) OVER (ORDER BY d.ev, d.honap) AS valtozas_elozo_honaphoz
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
WHERE d.ev = 2026 AND d.honap <= 6
GROUP BY d.ev, d.honap
ORDER BY d.ev, d.honap;
```

## Összefoglalás

- `ROLLUP (a, b)`: (a, b) + (a) részösszeg + () végösszeg; `CUBE`: minden kombináció; `GROUPING SETS`: a felsoroltak.
- `GROUPING(oszlop) = 1`: az adott sor összesítő sor.
- Ablakfüggvények: `RANK`/`DENSE_RANK`/`ROW_NUMBER`, `PARTITION BY` csoportonként, futó összeg, részesedés, `LAG`.

## A lecke feladata

Készíts riportot `ROLLUP`-pal: **régiónként és kategóriánként** a bevétel, **régiónkénti részösszeggel** és **végösszeggel**. Oszlopok: régió, kategória, bevétel; **régió, majd kategória szerint** rendezve (az összesítő sorok `NULL` értékei a csoportjuk végére kerülnek – ez a PostgreSQL alapértelmezése növekvő rendezésnél).

```sql starter required
SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY b.regio, p.kategoria
ORDER BY b.regio, p.kategoria;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY ROLLUP (b.regio, p.kategoria)
ORDER BY b.regio, p.kategoria;
```

</details>
