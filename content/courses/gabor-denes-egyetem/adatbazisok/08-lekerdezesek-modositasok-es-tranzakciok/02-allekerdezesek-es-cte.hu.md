---
title: Allekérdezések, EXISTS és CTE
summary: Allekérdezés a WHERE-ben (skalár, IN, EXISTS), a FROM-ban és a SELECT-ben, korrelált allekérdezés, a WITH (CTE) a jól olvasható lekérdezésekhez, és a halmazműveletek (UNION, INTERSECT, EXCEPT).
minutes: 28
---

## Amit ebben a leckében megtanulsz

- hogyan ágyazol egy lekérdezést egy **másikba** (allekérdezés),
- mikor használj `IN`-t és mikor `EXISTS`-et,
- hogyan teszed **olvashatóvá** a bonyolult lekérdezést a `WITH` (CTE) segítségével,
- a **halmazműveleteket**: `UNION`, `INTERSECT`, `EXCEPT`.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Kérdés a kérdésben

Néha egy kérdés megválaszolásához előbb egy **másik** kérdésre kell válaszolni. _„Kik kaptak az átlagnál jobb jegyet?”_ – ehhez előbb tudni kell, mennyi az átlag. Az **allekérdezés** zárójelben álló `SELECT`, amelynek eredményét a külső lekérdezés felhasználja.

### Skalár allekérdezés – egyetlen érték

```sql run
SELECT neptun, kod, jegy
FROM jelentkezesek
WHERE jegy > (SELECT AVG(jegy) FROM jelentkezesek)
ORDER BY jegy DESC;
```

A belső lekérdezés egyetlen számot ad (3.9), a külső ezzel hasonlít.

### IN – egy lista

```sql run
-- Kik vették fel az Adatbázisokat?
SELECT nev FROM hallgatok
WHERE neptun IN (SELECT neptun FROM jelentkezesek WHERE kod = 'ADB');
```

A `NOT IN` a fordítottja – de vigyázz: ha a belső lista tartalmaz **NULL**-t, a `NOT IN` egyetlen sort sem ad vissza (a NULL „ismeretlen”, így semmiről nem lehet biztosan mondani, hogy nincs a listában). Ilyenkor biztonságosabb a `NOT EXISTS`.

### EXISTS – van-e legalább egy?

Az `EXISTS` csak azt nézi, hogy a belső lekérdezés **ad-e vissza legalább egy sort**.

```sql run
-- Kiknek van legalább egy ötöse?
SELECT h.nev FROM hallgatok h
WHERE EXISTS (
  SELECT 1 FROM jelentkezesek j
  WHERE j.neptun = h.neptun AND j.jegy = 5
);
```

Ez egy **korrelált** allekérdezés: a belső lekérdezés a külső aktuális sorára hivatkozik (`h.neptun`), így logikailag minden hallgatónál újra lefut.

### Allekérdezés a FROM-ban

Egy allekérdezés eredménye **táblaként** is használható (álnevet kell kapnia):

```sql run
-- A hallgatók átlaga, majd ebből a 4 feletti átlagúak
SELECT nev, atlag FROM (
  SELECT h.nev, ROUND(AVG(j.jegy), 2) AS atlag
  FROM hallgatok h JOIN jelentkezesek j ON j.neptun = h.neptun
  GROUP BY h.neptun, h.nev
) AS atlagok
WHERE atlag > 4;
```

## WITH – a CTE

A sok egymásba ágyazott zárójel nehezen olvasható. A **CTE** (_Common Table Expression_) a `WITH` kulcsszóval **előre elnevez** egy részeredményt, mint egy változót a programban:

```sql run
WITH atlagok AS (
  SELECT h.nev, ROUND(AVG(j.jegy), 2) AS atlag
  FROM hallgatok h JOIN jelentkezesek j ON j.neptun = h.neptun
  GROUP BY h.neptun, h.nev
)
SELECT nev, atlag FROM atlagok WHERE atlag > 4 ORDER BY atlag DESC;
```

Ugyanaz, mint az előző – de felülről lefelé, **lépésenként** olvasható. Egy `WITH`-ben több CTE is lehet vesszővel elválasztva, és a későbbiek hivatkozhatnak a korábbiakra. (A rekurzív CTE-vel a 12. témakörben gráfokat járunk be.)

## Halmazműveletek

Két, **azonos oszlopszámú és -típusú** lekérdezés eredményét kapcsolják össze:

| Művelet      | Eredmény                                      |
| ------------ | --------------------------------------------- |
| `UNION`      | mindkettő sorai, ismétlődés nélkül            |
| `UNION ALL`  | mindkettő sorai, ismétlődéssel (gyorsabb)     |
| `INTERSECT`  | csak a mindkettőben szereplő sorok            |
| `EXCEPT`     | az elsőben szereplő, a másodikban nem         |

```sql run
-- Akik az ADB-t ÉS a DIG-et is felvették
SELECT neptun FROM jelentkezesek WHERE kod = 'ADB'
INTERSECT
SELECT neptun FROM jelentkezesek WHERE kod = 'DIG';
```

## Összefoglalás

- Allekérdezés: skalár (egy érték), `IN` (lista), `EXISTS` (van-e), a `FROM`-ban táblaként.
- `NOT IN` + NULL = üres eredmény → használd a `NOT EXISTS`-et.
- `WITH név AS (…)` – elnevezett részeredmény, olvashatóbb lekérdezés.
- `UNION [ALL]`, `INTERSECT`, `EXCEPT`.

## A lecke feladata

Kérd le azoknak a hallgatóknak a **nevét**, akiknek van **legalább egy olyan jegyük, amely jobb az összes jegy átlagánál**! Mindenki csak egyszer szerepeljen, név szerint rendezve.

```sql starter required
SELECT h.nev
FROM hallgatok h
WHERE ...
ORDER BY h.nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev
FROM hallgatok h
WHERE EXISTS (
  SELECT 1 FROM jelentkezesek j
  WHERE j.neptun = h.neptun
    AND j.jegy > (SELECT AVG(jegy) FROM jelentkezesek)
)
ORDER BY h.nev;
```

Más jó megoldás is van, például `WHERE h.neptun IN (SELECT neptun FROM jelentkezesek WHERE jegy > (SELECT AVG(jegy) FROM jelentkezesek))`.

</details>
