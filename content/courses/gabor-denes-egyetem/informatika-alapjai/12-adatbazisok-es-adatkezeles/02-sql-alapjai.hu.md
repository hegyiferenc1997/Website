---
title: Az SQL alapjai
summary: SELECT, WHERE, ORDER BY, összesítő függvények, GROUP BY, JOIN, valamint INSERT, UPDATE, DELETE.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan kérdezel le adatokat **SQL**-ben (`SELECT`, `WHERE`, `ORDER BY`),
- hogyan **összesítesz** (`COUNT`, `AVG`, `GROUP BY`) és **kapcsolsz össze** táblákat (`JOIN`),
- hogyan **szúrsz be**, **módosítasz** és **törölsz** adatot.

## Az SQL

Az **SQL** (Structured Query Language) a relációs adatbázisok szabványos, **deklaratív** nyelve: azt írod le, _mit_ kérsz, a DBMS dönti el, _hogyan_ keresi meg. Az alábbi példák a `hallgatok` táblára épülnek:

| neptun | nev          | szak      | felev | atlag |
| ------ | ------------ | --------- | ----- | ----- |
| ABC123 | Kiss Anna    | mérnökinf | 1     | 4.5   |
| XYZ789 | Nagy Béla    | mérnökinf | 3     | 3.8   |
| QWE456 | Tóth Cili    | gazdinfo  | 1     | 4.1   |
| RTZ321 | Kovács Dénes | mérnökinf | 1     | 3.2   |

## Lekérdezés

```sql
-- Minden oszlop, minden sor
SELECT * FROM hallgatok;

-- Csak a név és az átlag, az 1. félévesek, átlag szerint csökkenően
SELECT nev, atlag
FROM hallgatok
WHERE felev = 1
ORDER BY atlag DESC;
```

Eredmény: Kiss Anna 4.5, Tóth Cili 4.1, Kovács Dénes 3.2.

A `WHERE` feltételeiben használható: `=`, `<>`, `<`, `>`, `AND`, `OR`, `NOT`, `BETWEEN 3 AND 4`, `IN ('a', 'b')`, `LIKE 'K%'` (K-val kezdődik).

## Összesítés

```sql
SELECT COUNT(*) FROM hallgatok;                 -- 4
SELECT AVG(atlag) FROM hallgatok WHERE felev = 1;
-- Szakonként a létszám
SELECT szak, COUNT(*) AS letszam
FROM hallgatok
GROUP BY szak;                                  -- mérnökinf 3, gazdinfo 1
```

Összesítő függvények: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

## Táblák összekapcsolása: JOIN

```sql
-- Ki melyik tárgyra jelentkezett? (jelentkezesek: neptun, kod; targyak: kod, nev)
SELECT h.nev, t.nev AS targy
FROM jelentkezesek j
JOIN hallgatok h ON h.neptun = j.neptun
JOIN targyak t   ON t.kod = j.kod;
```

## Adatmódosítás

```sql
INSERT INTO hallgatok (neptun, nev, szak, felev, atlag)
VALUES ('NEW001', 'Szabó Emma', 'mérnökinf', 1, 4.9);

UPDATE hallgatok SET felev = 2 WHERE neptun = 'ABC123';

DELETE FROM hallgatok WHERE neptun = 'NEW001';
```

**Vigyázz:** a `WHERE` nélküli `UPDATE` vagy `DELETE` a **tábla összes sorát** módosítja vagy törli!

## Pythonból ugyanez – szűrés és rendezés listán

Ugyanezt a gondolatot Pythonban is kipróbálhatod egy listán:

```python run
hallgatok = [
    {"nev": "Kiss Anna", "felev": 1, "atlag": 4.5},
    {"nev": "Nagy Béla", "felev": 3, "atlag": 3.8},
    {"nev": "Tóth Cili", "felev": 1, "atlag": 4.1},
    {"nev": "Kovács Dénes", "felev": 1, "atlag": 3.2},
]
# SELECT nev, atlag FROM hallgatok WHERE felev = 1 ORDER BY atlag DESC
elsosok = [h for h in hallgatok if h["felev"] == 1]
for h in sorted(elsosok, key=lambda h: h["atlag"], reverse=True):
    print(h["nev"], h["atlag"])
```

## Összefoglalás

- `SELECT … FROM … WHERE … ORDER BY …` – lekérdezés, szűrés, rendezés.
- `COUNT`, `AVG`, `GROUP BY` – összesítés; `JOIN … ON …` – táblák összekapcsolása.
- `INSERT`, `UPDATE`, `DELETE` – mindig `WHERE`-rel!

## A lecke feladata

```quiz required
? Melyik SQL-kulcsszó **szűri** a sorokat egy feltétel szerint?
- SELECT
+ WHERE
- ORDER BY
- FROM
! Pl. WHERE felev = 1.

? Hány sort ad vissza a lecke táblájára: `SELECT * FROM hallgatok WHERE szak = 'mérnökinf';`?
= 3
! Kiss Anna, Nagy Béla, Kovács Dénes.

? Mit csinál a `DELETE FROM hallgatok;` utasítás (WHERE nélkül)?
- Semmit, mert hiányzik a feltétel.
- Csak az első sort törli.
+ A tábla összes sorát törli.
- Törli a táblát a szerkezetével együtt.
! Ezért kell mindig WHERE.

? Melyik összesítő függvény számolja meg a sorokat?
= COUNT
! COUNT(*).
```
