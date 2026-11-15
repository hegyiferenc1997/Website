---
title: Indexek létrehozása
summary: CREATE INDEX, egyedi, összetett (és a bal oldali előtag szabálya), részleges és kifejezés alapú index, mikor nem használ az index, és hogyan döntsd el, hova kell index – egy 20 000 rendeléses webshopon kipróbálva.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- hogyan hozol létre **indexet** (`CREATE INDEX`),
- milyen fajtái vannak: **egyedi**, **összetett**, **részleges**, **kifejezés alapú**,
- mikor **nem** tudja használni a DBMS az indexet,
- hogyan döntsd el, **hova** kell index.

## A webshop mintaadatbázis

Ebben a témakörben egy nagyobb, kitalált webshop adatain dolgozunk: **5000 vásárló**, **20 termék**, **20 000 rendelés** és **40 000 rendelési tétel**. Az adatokat a `generate_series` függvény állítja elő, így mindig ugyanazok.

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
SELECT * FROM rendelesek ORDER BY rendeles_id LIMIT 5;
```

## Az első index

Egy vásárló a „Rendeléseim” oldalon a saját rendeléseit nézi: `WHERE vasarlo_id = 42`. Nézzük meg, hogyan hajtja ezt végre a DBMS – az `EXPLAIN` a **lekérdezéstervet** mutatja meg (a következő lecke részletesen foglalkozik vele):

```sql run
EXPLAIN SELECT * FROM rendelesek WHERE vasarlo_id = 42;
```

`Seq Scan` – teljes táblaolvasás, mind a 20 000 sort végignézi a négy találatért. Most hozzunk létre indexet, és nézzük meg újra:

```sql run
CREATE INDEX idx_rendelesek_vasarlo ON rendelesek (vasarlo_id);
EXPLAIN SELECT * FROM rendelesek WHERE vasarlo_id = 42;
```

`Bitmap Index Scan on idx_rendelesek_vasarlo` – a DBMS most már az indexben keres, és csak a négy releváns sort olvassa be. Az index neve szabadon választható; a szokás `idx_tabla_oszlop`.

## Index fajták

### Egyedi index

`CREATE UNIQUE INDEX idx_vasarlok_email ON vasarlok (email);` – gyorsít **és** tiltja az ismétlődést. Ugyanezt éri el egy `UNIQUE` megszorítás is (a háttérben az is egyedi indexet hoz létre).

### Összetett (többoszlopos) index

`CREATE INDEX idx_rend_statusz_datum ON rendelesek (statusz, datum);`

Az összetett index olyan, mint a telefonkönyv: **vezetéknév, azon belül keresztnév** szerint rendezett. Ebből következik a **bal oldali előtag szabálya**:

- `WHERE statusz = 'kész' AND datum >= '2026-01-01'` → **használható** (mindkét oszlop),
- `WHERE statusz = 'kész'` → **használható** (az első oszlop – mintha csak vezetéknévre keresnél),
- `WHERE datum >= '2026-01-01'` → **nem** (vagy csak rosszul) használható – keresztnév alapján a telefonkönyv nem segít!

Ezért az oszlopok **sorrendje számít**: elöl legyen az, amelyre egyenlőséggel szűrsz, és amelyik minden lekérdezésben szerepel.

### Részleges index

Csak a sorok egy részét indexeli: `CREATE INDEX idx_szallitas ON rendelesek (datum) WHERE statusz = 'szállítás';` Kisebb, gyorsabb, ha a lekérdezések mindig ugyanarra a részhalmazra vonatkoznak (pl. a még nem teljesített rendelésekre).

### Kifejezés alapú index

Ha a keresés egy **kifejezésre** szól, az indexnek is arra kell szólnia:

```sql
-- A kis-nagybetű független e-mail kereséshez:
CREATE INDEX idx_vasarlok_email_lower ON vasarlok (LOWER(email));
SELECT * FROM vasarlok WHERE LOWER(email) = 'vasarlo42@pelda.hu';
```

## Amikor az index nem segít

1. **Függvény az oszlopon**: `WHERE EXTRACT(YEAR FROM datum) = 2026` – a `datum` indexe nem használható, mert nem a `datum`-ot, hanem egy kiszámolt értéket keresünk. Írd át **tartományra**: `WHERE datum >= '2026-01-01' AND datum < '2027-01-01'`. (Az ilyen indexbarát feltételt _sargable_-nek hívják.)
2. **Szöveg eleje helyett közepe**: `LIKE '%egér'` – a B-fa a szöveg **elejére** van rendezve, ezért csak a `LIKE 'egér%'` gyorsítható.
3. **Rossz szelektivitás**: ha a feltétel a sorok nagy részét visszaadja (`WHERE statusz = 'kész'` – a rendelések 60%-a!), gyorsabb mindent végigolvasni, mint ide-oda ugrálni az indexben. Ezt a DBMS magától eldönti.
4. **Kis tábla**: 20 sornál a teljes olvasás gyorsabb, mint az index használata.

## Hova tegyél indexet? – egy egyszerű módszer

1. Gyűjtsd össze a **leggyakoribb** és a **leglassabb** lekérdezéseket.
2. Nézd meg, milyen oszlopokon szűrnek (`WHERE`), kapcsolnak össze (`JOIN … ON`) és rendeznek (`ORDER BY`).
3. Az **idegen kulcsokra** szinte mindig kell index.
4. Mérj `EXPLAIN ANALYZE`-zel előtte és utána.
5. A nem használt indexeket töröld (`DROP INDEX`) – csak lassítják az írást.

## Összefoglalás

- `CREATE [UNIQUE] INDEX név ON tábla (oszlopok);`
- Összetett index: bal oldali előtag szabály, az oszlopsorrend számít.
- Részleges (`WHERE …`) és kifejezés alapú (`LOWER(email)`) index.
- Nem segít: függvény az oszlopon, `LIKE '%…'`, rossz szelektivitás, kis tábla.

## A lecke feladata

A webshopban két gyakori művelet lassú:

1. a „Rendeléseim” oldal: `SELECT * FROM rendelesek WHERE vasarlo_id = …`,
2. a regisztráció, ahol ellenőrizni kell, hogy az e-mail cím **még nem foglalt** – ennek az adatbázis szintjén is garantáltnak kell lennie.

Hozz létre egy **indexet** a `rendelesek.vasarlo_id` oszlopra, és egy **egyedi indexet** (vagy `UNIQUE` megszorítást) a `vasarlok.email` oszlopra! A gép a rendszerkatalógusból (`pg_indexes`) ellenőrzi.

```sql starter required
-- 1. index a rendelesek.vasarlo_id oszlopra

-- 2. egyedi index a vasarlok.email oszlopra
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX idx_rendelesek_vasarlo ON rendelesek (vasarlo_id);
CREATE UNIQUE INDEX idx_vasarlok_email ON vasarlok (email);
```

</details>

```sql test
SELECT
  (SELECT COUNT(*) FROM pg_indexes
    WHERE tablename = 'rendelesek' AND indexdef LIKE '%(vasarlo_id)') AS vasarlo_index,
  (SELECT COUNT(*) FROM pg_indexes
    WHERE tablename = 'vasarlok' AND indexdef LIKE 'CREATE UNIQUE%(email)') AS egyedi_email;
```
