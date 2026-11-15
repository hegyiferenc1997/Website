---
title: Rendezés, ismétlődések és lapozás
summary: ORDER BY (növekvő, csökkenő, több szempont, NULL-ok helye), DISTINCT, LIMIT és OFFSET, számított oszlopok, szövegfüggvények, COALESCE és CASE.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan **rendezed** az eredményt egy vagy több szempont szerint,
- hogyan szűröd ki az **ismétlődéseket**,
- hogyan kérsz csak **néhány sort** (lapozás),
- hogyan **számolsz** és alakítasz szöveget a lekérdezésben (`COALESCE`, `CASE`).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Rendezés: ORDER BY

Emlékszel: a relációban a sorok sorrendje **nem meghatározott**. Ha rendezett eredményt szeretnél, kérd! Az `ORDER BY` mindig a lekérdezés **végére** kerül.

```sql run
SELECT nev, felev FROM hallgatok ORDER BY felev DESC, nev;
```

- `ASC` = növekvő (ez az alapértelmezett, nem kell kiírni), `DESC` = csökkenő.
- **Több szempont**: először `felev` szerint csökkenően, az egyformán félévesek között pedig név szerint. Mint a telefonkönyv: vezetéknév, azon belül keresztnév.
- A `NULL`-ok PostgreSQL-ben növekvő rendezésnél a **végére** kerülnek; ezt a `NULLS FIRST` / `NULLS LAST` módosítja.

```sql run
SELECT nev, varos FROM hallgatok ORDER BY varos NULLS FIRST;
```

## Ismétlődések kiszűrése: DISTINCT

```sql run
SELECT DISTINCT varos FROM hallgatok ORDER BY varos;
```

A `DISTINCT` a **teljes sorra** vonatkozik: `SELECT DISTINCT szak, felev` azokat a (szak, félév) párokat adja, amelyek legalább egyszer előfordulnak.

## Csak néhány sor: LIMIT és OFFSET

A webshop terméklistája sem tölti be egyszerre mind a 100 000 terméket, hanem **oldalanként** 20-at. Erre való:

- `LIMIT n` – legfeljebb n sor,
- `OFFSET k` – az első k sort átugorja.

```sql run
-- A két legrégebben született hallgató (akiknek ismert a születési dátuma)
SELECT nev, szuletett FROM hallgatok
WHERE szuletett IS NOT NULL
ORDER BY szuletett
LIMIT 2;
```

A 3. oldal 20-as lapozásnál: `LIMIT 20 OFFSET 40`. Fontos: `LIMIT` mindig `ORDER BY`-jal együtt értelmes, különben „véletlenszerű” sorokat kapsz.

## Számított oszlopok és függvények

A `SELECT` után nemcsak oszlop állhat, hanem bármilyen **kifejezés**:

| Kifejezés                          | Eredmény                        |
| ---------------------------------- | ------------------------------- |
| `kredit * 30`                      | szorzás (+, −, \*, /, % is van) |
| `nev \|\| ' (' \|\| szak \|\| ')'` | szövegek összefűzése            |
| `UPPER(nev)`, `LOWER(nev)`         | nagy-, kisbetűssé alakítás      |
| `LENGTH(nev)`                      | szöveg hossza                   |
| `EXTRACT(YEAR FROM szuletett)`     | az év a dátumból                |
| `ROUND(x, 2)`                      | kerekítés 2 tizedesre           |

Figyelj: két egész szám osztása PostgreSQL-ben **egész** eredményt ad (`7 / 2 = 3`)! Tizedes eredményhez legalább az egyik legyen tizedes: `7 / 2.0 = 3.5`.

```sql run
SELECT UPPER(nev) AS nagybetus, kredit * 30 AS munkaora, nev || ' – ' || felev || '. félév' AS leiras
FROM targyak;
```

### Hiányzó érték helyett alapérték: COALESCE

A `COALESCE(a, b, …)` az első **nem NULL** értéket adja vissza:

```sql run
SELECT nev, COALESCE(varos, 'ismeretlen') AS varos FROM hallgatok;
```

### Feltételes érték: CASE

A `CASE` olyan, mint a programozásban az `if – else if – else`:

```sql run
SELECT nev, felev,
  CASE
    WHEN felev <= 2 THEN 'kezdő'
    WHEN felev <= 4 THEN 'haladó'
    ELSE 'végzős közelben'
  END AS szint
FROM hallgatok
ORDER BY felev;
```

## Összefoglalás

- `ORDER BY oszlop [ASC|DESC], …` – mindig a végén; több szempont balról jobbra.
- `DISTINCT` – ismétlődő sorok nélkül; `LIMIT` / `OFFSET` – lapozás (mindig rendezéssel).
- Kifejezések: számtani műveletek, `||`, `UPPER`, `LENGTH`, `ROUND`, `COALESCE`, `CASE`.

## A lecke feladata

Listázd ki a **mérnökinformatikus** hallgatók **nevét** és **félévét**: elöl a legmagasabb félév, azonos félévnél név szerint ábécérendben!

```sql starter required
SELECT nev, felev
FROM hallgatok
WHERE szak = 'mérnökinformatikus';
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, felev
FROM hallgatok
WHERE szak = 'mérnökinformatikus'
ORDER BY felev DESC, nev;
```

</details>
