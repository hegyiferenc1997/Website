---
title: Mélyebben – indexstratégia egy valódi terhelésre
summary: Szelektivitás kiszámolása, az összetett index oszlopsorrendjének szabályai (egyenlőség előbb, tartomány utána), lefedő index és index-only scan, index a rendezéshez és a LIMIT-hez, az idegen kulcsok indexelése, a „keresőbarát” feltételek, valamint az írási többletköltség számszerűen – EXPLAIN-nel kipróbálva.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan becsüld meg számokkal, hogy **megéri-e** egy index (szelektivitás),
- milyen **sorrendben** érdemes az oszlopokat egy összetett indexbe tenni,
- mi a **lefedő index**, és miért lehet tőle még gyorsabb egy lekérdezés,
- hogyan segít az index a **rendezésben** és a „legutóbbi 10” típusú lekérdezésekben,
- miért kell (általában) az **idegen kulcsokat** kézzel indexelni,
- hogyan írj **keresőbarát** feltételt, amely ki tudja használni az indexet,
- mennyibe kerül az index az **írásnál**.

## A webshop mintaadatbázis

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 1. Szelektivitás: megéri-e az index?

A **szelektivitás** azt mondja meg, hogy egy feltétel a sorok **hányad részét** adja vissza.

- `vasarlo_id = 42` → 20 000 rendelésből kb. 4 sor → szelektivitás ≈ 4 / 20 000 = **0,02%** – nagyon szelektív, az index sokat segít.
- `statusz = 'kész'` → a rendelések 60%-a → **60%** – alig szelektív, az index itt **nem** segít: a DBMS a sorok nagy részét úgyis beolvasná, ráadásul ugrálva.

**Analógia:** ha egy könyvben a „fotoszintézis” szót keresed, a tárgymutató szuper. Ha az „és” szót, a tárgymutató értelmetlen: szinte minden oldalon ott van, gyorsabb végiglapozni a könyvet.

**Ökölszabály:** ha egy feltétel a tábla nagyjából **5–10%-ánál többet** ad vissza, az optimalizáló jó eséllyel a teljes táblaolvasást választja, még ha van is index. Nézzük meg magunk:

```sql run
-- Hány sort ad vissza az egyes feltétel? (a szelektivitás nyers adatai)
SELECT statusz, COUNT(*) AS db,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS szazalek
FROM rendelesek
GROUP BY statusz
ORDER BY db DESC;
```

```sql run
-- Index a státuszra: az optimalizáló a gyakori értékre mégsem használja
CREATE INDEX idx_rend_statusz ON rendelesek (statusz);
ANALYZE rendelesek;
EXPLAIN SELECT * FROM rendelesek WHERE statusz = 'kész';
```

A terv valószínűleg `Seq Scan` – az optimalizáló a **statisztikák** alapján tudja, hogy a `'kész'` érték gyakori. A ritka `'törölt'` értéknél viszont már érdemes lehet az indexet használni.

## 2. Összetett index: számít az oszlopok sorrendje

Egy összetett index olyan, mint a **telefonkönyv**: előbb vezetéknév, azon belül keresztnév szerint rendezett. Keresztnévre önmagában nem tudsz benne keresni, vezetéknévre igen (**bal oldali előtag szabálya**).

Ha több feltétel van, a szabály:

1. **egyenlőséggel** szűrt oszlopok előre (`vasarlo_id = 42`),
2. **tartománnyal** szűrt (`datum >= …`, `BETWEEN`) vagy rendezett oszlop a végére.

Miért? Az index `(vasarlo_id, datum)` sorrendjében a 42-es vásárló rendelései **egy összefüggő szakaszon**, dátum szerint rendezve állnak – a DBMS odaugrik az elejére, és addig olvas, amíg a dátum a tartományban van. A fordított `(datum, vasarlo_id)` indexben a dátumtartományon belül a 42-es vásárló sorai szét vannak szórva.

```sql run
CREATE INDEX idx_rend_vasarlo_datum ON rendelesek (vasarlo_id, datum);
EXPLAIN SELECT * FROM rendelesek
WHERE vasarlo_id = 42 AND datum >= DATE '2024-06-01';
```

## 3. Lefedő index és index-only scan

Egy szokásos indexes keresés **két lépés**: (1) megkeresi a sort az indexben, (2) „átugrik” a táblába a többi oszlopért. Ha viszont **minden szükséges oszlop benne van az indexben**, a második lépés elmarad: ez az **index-only scan**.

**Analógia:** a tárgymutatóban nemcsak az oldalszám szerepel, hanem a definíció is – nem kell odalapoznod.

```sql run
-- Csak a vasarlo_id és a datum kell: mindkettő benne van az indexben
CREATE INDEX idx_rend_vasarlo_datum ON rendelesek (vasarlo_id, datum);
ANALYZE rendelesek;
EXPLAIN SELECT vasarlo_id, datum FROM rendelesek WHERE vasarlo_id = 42;
```

PostgreSQL-ben az `INCLUDE` kulcsszóval olyan oszlopot is betehetsz az indexbe, amely alapján **nem** keresel, csak ki akarod olvasni:

```sql
CREATE INDEX idx_rend_vasarlo_incl ON rendelesek (vasarlo_id) INCLUDE (statusz);
```

Ára: nagyobb index, lassabb írás. Csak a **nagyon gyakori** lekérdezésekhez éri meg.

## 4. Index a rendezéshez: „a legutóbbi 10”

Az index **rendezett**, ezért a DBMS az `ORDER BY … LIMIT` lekérdezést úgy is végrehajthatja, hogy egyszerűen az index elejéről (vagy végéről) olvas 10 sort – rendezés nélkül.

```sql run
-- Index nélkül: mind a 20 000 sort rendezni kell a 10 legfrissebbhez
EXPLAIN SELECT * FROM rendelesek ORDER BY datum DESC LIMIT 10;
```

```sql run
-- Index a dátumra: a DBMS visszafelé olvassa az indexet, és 10 sor után megáll
CREATE INDEX idx_rend_datum ON rendelesek (datum);
EXPLAIN SELECT * FROM rendelesek ORDER BY datum DESC LIMIT 10;
```

Figyeld meg a második tervben a `Sort` művelet eltűnését és a `Limit` + `Index Scan Backward` párost.

## 5. Az idegen kulcsok indexelése

A PostgreSQL az **elsődleges kulcsra** és a **UNIQUE** megszorításra magától indexet készít, az **idegen kulcsra viszont nem**! Pedig az idegen kulcs oszlopán két okból is gyakran keresünk:

1. **JOIN-oknál:** `rendelesek.vasarlo_id = vasarlok.vasarlo_id` – minden „egy vásárló rendelései” lekérdezés ezt használja.
2. **Törlésnél:** ha törölsz egy vásárlót, a DBMS-nek ellenőriznie kell, nincs-e rá hivatkozó rendelés – index nélkül ez minden törlésnél teljes táblaolvasás!

**Ökölszabály:** minden idegen kulcs oszlopra (vagy annak az első oszlopára egy összetett indexben) tegyél indexet, hacsak nem biztos, hogy sosem keresel rá.

## 6. Keresőbarát (index-kompatibilis) feltételek

Az index az **oszlop eredeti értékei** szerint rendezett. Ha a `WHERE`-ben **függvényt** alkalmazol az oszlopra, az index használhatatlanná válik – a DBMS-nek minden sorra ki kell számolnia a függvényt.

| Nem keresőbarát ✘                           | Keresőbarát ✔                                                      |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `WHERE EXTRACT(YEAR FROM datum) = 2024`     | `WHERE datum >= '2024-01-01' AND datum < '2025-01-01'`             |
| `WHERE ar * 1.27 > 10000`                   | `WHERE ar > 10000 / 1.27`                                          |
| `WHERE LOWER(email) = 'a@b.hu'`             | kifejezés alapú index: `CREATE INDEX … ON vasarlok (LOWER(email))` |
| `WHERE nev LIKE '%anna'` (eleje ismeretlen) | `WHERE nev LIKE 'Anna%'` (az eleje ismert)                         |

```sql run
CREATE INDEX idx_rend_datum ON rendelesek (datum);
-- ✘ függvény az oszlopon: az index nem használható
EXPLAIN SELECT COUNT(*) FROM rendelesek WHERE EXTRACT(YEAR FROM datum) = 2024;
```

```sql run
CREATE INDEX idx_rend_datum ON rendelesek (datum);
-- ✔ ugyanaz a kérdés tartományként: az index használható
EXPLAIN SELECT COUNT(*) FROM rendelesek
WHERE datum >= DATE '2024-01-01' AND datum < DATE '2025-01-01';
```

(Ha a 2024-es rendelések a tábla nagy részét adják, az optimalizáló a második esetben is választhat teljes olvasást – a szelektivitás itt is számít. A lényeg, hogy **lehetősége** legyen az indexre.)

## 7. Az index ára számokban

Minden index egy **külön, rendezett adatszerkezet**, amelyet minden `INSERT`, `UPDATE` (ha az indexelt oszlop változik) és `DELETE` alkalmával **frissíteni** kell.

**Számpélda:** egy táblán 5 index van. Egy `INSERT` így **6** szerkezetet módosít (a táblát és az 5 indexet). Ha egy naplótáblába másodpercenként 2000 sor érkezik, ez 12 000 írási művelet másodpercenként – a 3 fölösleges index elhagyásával 6000. Ezért:

- **olvasásra** optimalizált tábla (termékkatalógus): több index is belefér;
- **írásra** optimalizált tábla (napló, szenzoradat): csak a legszükségesebb indexek.

```sql run
-- Mekkorák az indexek a táblához képest?
CREATE INDEX idx_rend_vasarlo_datum ON rendelesek (vasarlo_id, datum);
SELECT relname AS nev,
       pg_size_pretty(pg_relation_size(oid)) AS meret
FROM pg_class
WHERE relname IN ('rendelesek', 'rendelesek_pkey', 'idx_rend_vasarlo_datum');
```

## Egy indexstratégia lépései

1. **Gyűjtsd össze** a leggyakoribb és a leglassabb lekérdezéseket (a valódi terhelést, nem a képzeletbelit).
2. Mindegyiknél nézd meg: milyen oszlopra szűr **egyenlőséggel**, milyenre **tartománnyal**, mire **rendez**?
3. Tervezz indexet: egyenlőség → tartomány/rendezés sorrendben; idegen kulcsokra mindig.
4. **Mérj** `EXPLAIN ANALYZE`-zel előtte és utána.
5. Rendszeresen nézd meg, melyik indexet **nem használja** senki (PostgreSQL-ben: `pg_stat_user_indexes`), és töröld.

## Összefoglalás

- **Szelektivitás:** az index a ritka értékekre keresésnél ér a legtöbbet; a tábla nagy részét visszaadó feltételnél nem segít.
- **Összetett index:** egyenlőség előre, tartomány / rendezés a végére; a bal oldali előtag szabálya érvényes.
- **Lefedő index** (`INCLUDE`): index-only scan, nincs ugrás a táblába.
- Az index **rendezett**, ezért az `ORDER BY … LIMIT` is gyorsul.
- Az **idegen kulcsot** a PostgreSQL nem indexeli magától.
- **Keresőbarát** feltétel: ne alkalmazz függvényt az indexelt oszlopra.
- Minden index **lassítja az írást** – csak mért haszonért tartsd meg.

## A lecke feladata

A „Rendeléseim” oldal ezt a lekérdezést futtatja nagyon gyakran:

```sql
SELECT * FROM rendelesek
WHERE vasarlo_id = ? AND datum >= ?
ORDER BY datum DESC;
```

Hozz létre egy **összetett indexet** a `rendelesek` táblán, amely ezt a lekérdezést a lehető legjobban kiszolgálja – gondold végig az oszlopok sorrendjét! Az index neve szabadon választható. Az ellenőrzés megnézi, van-e a táblán megfelelő oszlopsorrendű index.

```sql starter required
-- Hozd létre az indexet!
-- CREATE INDEX ... ON rendelesek (...);
```

<details>
<summary>Megoldás</summary>

Az egyenlőséggel szűrt `vasarlo_id` kerül előre, a tartománnyal szűrt és rendezett `datum` a végére:

```sql solution
CREATE INDEX idx_rend_vasarlo_datum ON rendelesek (vasarlo_id, datum);
```

</details>

```sql test
SELECT COUNT(*) FILTER (WHERE pg_get_indexdef(indexrelid) LIKE '%(vasarlo_id, datum%') AS megfelelo_index
FROM pg_index
WHERE indrelid = 'rendelesek'::regclass;
```
