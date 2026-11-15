---
title: Idősoros adatbázisok
summary: Mitől különleges az idősoros adat (érzékelők, monitorozás, tőzsde), milyen rendszerek kezelik (InfluxDB, TimescaleDB, Prometheus), és hogyan összesíts időablakokra, számolj mozgóátlagot, ritkíts és tarts be megőrzési szabályokat – SQL-ben, a böngészőben kipróbálva.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi az **idősoros adat**, és miben különbözik a „hagyományos” adatoktól,
- milyen **idősoros adatbázisok** léteznek,
- hogyan **összesíts időablakokra** (`date_trunc`), hogyan számolj **mozgóátlagot**,
- mi a **ritkítás** (_downsampling_) és a **megőrzési szabály** (_retention_).

## Mi az idősoros adat?

Idősoros adat minden olyan mérés, amelyhez egy **időbélyeg** tartozik, és amely **folyamatosan, időrendben** érkezik:

- érzékelők: hőmérséklet, páratartalom, áramfogyasztás,
- szerverek monitorozása: processzorterhelés, memória, válaszidő,
- pénzügy: árfolyamok másodpercenként,
- okoseszközök: lépésszám, pulzus.

Jellemzői:

| Tulajdonság                     | Mit jelent a gyakorlatban?                                     |
| ------------------------------- | -------------------------------------------------------------- |
| **szinte csak beszúrás**        | a régi mérést ritkán módosítjuk vagy töröljük egyenként        |
| **időrendben érkezik**          | az új adat mindig a „végére” kerül                             |
| **óriási mennyiség**            | 1000 érzékelő × másodpercenként 1 mérés = napi 86,4 millió sor |
| **időtartományra kérdezünk**    | „az elmúlt 24 óra”, „óránkénti átlag a múlt héten”             |
| **a régi adat kevésbé értékes** | tegnapról percenkénti adat kell, tavalyról elég a napi átlag   |

## Idősoros adatbázisok

| Rendszer        | Jellemző                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| **TimescaleDB** | PostgreSQL-bővítmény: teljes SQL, a táblát automatikusan időszeletekre bontja |
| **InfluxDB**    | önálló idősoros adatbázis, saját lekérdezőnyelvvel                            |
| **Prometheus**  | szerverek és szolgáltatások monitorozására, a mérőszámokat maga gyűjti be     |
| **ClickHouse**  | oszlopalapú elemző adatbázis, idősoros adatra is nagyon gyors                 |

Az alapötlet mindegyikben hasonló: az adatot **időszeletekre** (_chunk_, _partíció_) bontják. Így a „tegnapi adatok” lekérdezése csak a tegnapi szeletet olvassa, és a régi szeletek egyben törölhetők vagy tömöríthetők. Az idősoros adat ráadásul nagyon jól **tömöríthető**, mert az egymás utáni értékek hasonlók.

## Kipróbáljuk SQL-ben

Egy kitalált épület három helyiségében tízpercenként mérjük a hőmérsékletet, két napon keresztül:

<details>
<summary>A mérések létrehozása (SQL)</summary>

```sql setup
-- Tízpercenkénti hőmérséklet-mérések három helyiségben, két napon át (2026-11-01 és 02).
CREATE TABLE meresek (
  ido         TIMESTAMP NOT NULL,
  hely        VARCHAR(20) NOT NULL,
  homerseklet NUMERIC(4, 1) NOT NULL,
  PRIMARY KEY (hely, ido)
);
INSERT INTO meresek
SELECT TIMESTAMP '2026-11-01 00:00' + i * INTERVAL '10 minutes',
       h.hely,
       -- napi ingadozás (délután melegebb) + helyiségenkénti eltérés; a második nap melegebb
       ROUND((h.alap + 3 * SIN((i % 144 - 54) * PI() / 72) + (i % 7) * 0.1 + (i / 144) * 1.5)::NUMERIC, 1)
FROM generate_series(0, 287) AS i,
     (VALUES ('labor', 21.0), ('iroda', 22.5), ('szerverterem', 18.0)) AS h (hely, alap);
```

</details>

```sql run
SELECT * FROM meresek WHERE hely = 'labor' ORDER BY ido LIMIT 8;
```

### Összesítés időablakokra

A `date_trunc('hour', ido)` az időbélyeget levágja az óra elejére (14:37 → 14:00). Ha erre csoportosítunk, megkapjuk az **óránkénti** átlagot:

```sql run
SELECT date_trunc('hour', ido) AS ora,
       ROUND(AVG(homerseklet), 2) AS atlag,
       MIN(homerseklet) AS min,
       MAX(homerseklet) AS max,
       COUNT(*) AS meresek
FROM meresek
WHERE hely = 'labor' AND ido >= '2026-11-01 12:00' AND ido < '2026-11-01 18:00'
GROUP BY ora
ORDER BY ora;
```

A `'hour'` helyett lehet `'day'`, `'week'`, `'month'` is. (A TimescaleDB-ben a `time_bucket('15 minutes', ido)` tetszőleges ablakméretet tud.)

### Mozgóátlag

A mérések „zajosak”. A **mozgóátlag** minden pontban az utolsó néhány mérés átlagát veszi, így kisimítja a görbét. Ehhez ablakfüggvényt (`OVER`) használunk:

```sql run
SELECT ido, homerseklet,
       ROUND(AVG(homerseklet) OVER (ORDER BY ido ROWS BETWEEN 5 PRECEDING AND CURRENT ROW), 2)
         AS mozgoatlag_1_ora
FROM meresek
WHERE hely = 'iroda' AND ido < '2026-11-01 03:00'
ORDER BY ido;
```

A `ROWS BETWEEN 5 PRECEDING AND CURRENT ROW` = az aktuális és az előző 5 sor (6 × 10 perc = 1 óra).

### Változás az előző méréshez képest

A `LAG` az előző sor értékét adja – így könnyű észrevenni a hirtelen ugrásokat (pl. elromlott a klíma):

```sql run
SELECT ido, homerseklet,
       homerseklet - LAG(homerseklet) OVER (ORDER BY ido) AS valtozas
FROM meresek
WHERE hely = 'szerverterem' AND ido < '2026-11-01 01:00'
ORDER BY ido;
```

## Ritkítás és megőrzés

Egy év tízpercenkénti adata helyiségenként 52 560 sor. Évek múltán már senkit nem érdekel, mennyi volt a hőmérséklet 2026. november 1-jén 14:10-kor – de a napi átlag igen. Ezért:

- **Ritkítás** (_downsampling_): a régi, részletes adatból összesített táblát készítünk (pl. óránkénti vagy napi átlag), és csak azt tartjuk meg.
- **Megőrzési szabály** (_retention policy_): a részletes adatot csak egy ideig (pl. 30 napig) őrizzük, utána automatikusan törlődik.

```sql
-- Ritkítás: napi összesítő tábla
CREATE TABLE napi_meresek AS
SELECT date_trunc('day', ido) AS nap, hely,
       AVG(homerseklet) AS atlag, MIN(homerseklet) AS min, MAX(homerseklet) AS max
FROM meresek
GROUP BY nap, hely;

-- Megőrzés: a 30 napnál régebbi részletes adat törlése
DELETE FROM meresek WHERE ido < now() - INTERVAL '30 days';
```

Az idősoros adatbázisok ezt beépítve, automatikusan végzik – és a teljes időszeletet egyben dobják el, ami sokkal gyorsabb a soronkénti törlésnél.

## Összefoglalás

- Idősoros adat: időbélyeges mérések, szinte csak beszúrás, óriási mennyiség, időtartományra kérdezünk.
- Rendszerek: TimescaleDB, InfluxDB, Prometheus, ClickHouse; az adat időszeletekre bontva.
- `date_trunc` + `GROUP BY` = időablakos összesítés; `AVG … OVER (ROWS …)` = mozgóátlag; `LAG` = változás.
- Ritkítás és megőrzés: a régi adatból összesítés, a részletes adat törlése.

## A lecke feladata

Készíts **napi kimutatást**: helyiségenként és naponként add meg a **legkisebb**, a **legnagyobb** és az **átlagos** hőmérsékletet (az átlagot **1 tizedesre** kerekítve). Az eredmény oszlopai: hely, nap, minimum, maximum, átlag; **hely, majd nap szerint** rendezve.

```sql starter required
SELECT hely, date_trunc('day', ido) AS nap
FROM meresek
ORDER BY hely, nap;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT hely,
       date_trunc('day', ido) AS nap,
       MIN(homerseklet) AS minimum,
       MAX(homerseklet) AS maximum,
       ROUND(AVG(homerseklet), 1) AS atlag
FROM meresek
GROUP BY hely, nap
ORDER BY hely, nap;
```

</details>
