---
title: Mélyebben – haladó ablakfüggvények és elemzési minták
summary: ROW_NUMBER, RANK és DENSE_RANK holtversenynél, az ablakkeret (ROWS kontra RANGE) és az alapértelmezett keret csapdája, év/év összehasonlítás, medián és percentilisek, kvartilisek NTILE-lal, valamint a Pareto (ABC) elemzés kumulált részesedéssel – egy üzletlánc csillagsémáján.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **ROW_NUMBER**, a **RANK** és a **DENSE_RANK** között, ha holtverseny van,
- mi az **ablakkeret**, és miért ad meglepő eredményt a `LAST_VALUE` alapbeállítással,
- hogyan hasonlíts össze egy időszakot az **előző év** azonos időszakával,
- hogyan számolj **mediánt** és **percentiliseket**,
- hogyan sorold a termékeket **negyedekbe** (kvartilis),
- hogyan készül a **Pareto-elemzés** („a termékek 20%-a hozza a bevétel 80%-át?”).

## A mintaadatbázis: egy üzletlánc csillagsémája

<details>
<summary>A csillagséma létrehozása (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

Egy ténytábla (`teny_eladas`) és három dimenzió (`dim_datum`, `dim_termek`, `dim_bolt`), két év (2025–2026) napi eladásaival.

## 1. Három rangsorfüggvény holtversenynél

Képzelj el egy futóversenyt, ahol ketten holtversenyben másodikak lettek. Hányadik a következő?

| Függvény       | Sorszámok  | Mikor használd?                                                                         |
| -------------- | ---------- | --------------------------------------------------------------------------------------- |
| `ROW_NUMBER()` | 1, 2, 3, 4 | egyedi sorszám kell (pl. lapozás, ismétlődés-szűrés) – a holtversenyt önkényesen bontja |
| `RANK()`       | 1, 2, 2, 4 | „olimpiai” rangsor: holtverseny után kimarad hely                                       |
| `DENSE_RANK()` | 1, 2, 2, 3 | „sűrű” rangsor: nincs kihagyás (pl. „a 3 legjobb árszint”)                              |

```sql run
-- Termékek ára szerinti rangsor: minden ár különböző, ezért csináljunk holtversenyt:
-- kerekítsük az árat lefelé tízezresekre (ársávok)
SELECT nev, ar,
       FLOOR(ar / 10000) * 10000 AS arsav,
       ROW_NUMBER() OVER (ORDER BY FLOOR(ar / 10000) DESC) AS row_number,
       RANK()       OVER (ORDER BY FLOOR(ar / 10000) DESC) AS rank,
       DENSE_RANK() OVER (ORDER BY FLOOR(ar / 10000) DESC) AS dense_rank
FROM dim_termek
ORDER BY arsav DESC, nev;
```

Figyeld meg a 20 000-es és a 0-s ársávot: több termék is ugyanoda esik. A `RANK` ezután egy helyet kihagy, a `DENSE_RANK` nem.

## 2. Az ablakkeret – melyik sorokat látja a függvény?

Egy ablakfüggvény minden sornál egy **keretet** (frame) néz: a partíció sorainak egy részét. Ha az `OVER (…)`-ban van `ORDER BY`, az **alapértelmezett keret**: „a partíció elejétől **az aktuális sorig** (és a vele azonos rendezési értékűekig)”. Ezért lesz a `SUM(...) OVER (ORDER BY ...)` automatikusan **futó összeg**.

| Keret                                                      | Jelentés                                                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`         | elejétől az aktuális sorig (futó összeg)                                                        |
| `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`                 | az előző 2 és az aktuális sor (3 elemű mozgóátlag)                                              |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | a teljes partíció                                                                               |
| `RANGE …`                                                  | nem sorokat, hanem **értéktartományt** számol: az azonos rendezési értékű sorok együtt mozognak |

### A LAST_VALUE csapdája

```sql run
-- „Mi volt az utolsó havi bevétel az évben?” – az első változat hibás!
WITH havi AS (
  SELECT d.ev, d.honap, SUM(e.bevetel) AS bevetel
  FROM teny_eladas e JOIN dim_datum d ON d.datum_id = e.datum_id
  WHERE d.ev = 2025
  GROUP BY d.ev, d.honap
)
SELECT honap, bevetel,
       LAST_VALUE(bevetel) OVER (ORDER BY honap) AS hibas_utolso,
       LAST_VALUE(bevetel) OVER (ORDER BY honap
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS helyes_utolso
FROM havi
ORDER BY honap;
```

A `hibas_utolso` oszlop minden sorban a **saját** havi bevételt mutatja – mert az alapértelmezett keret az aktuális sornál véget ér, így annak „utolsó” eleme maga az aktuális sor. A helyes változathoz a keretet a **partíció végéig** ki kell nyújtani. (A `FIRST_VALUE`-nál ez a probléma nem jelentkezik, mert a keret eleje alapból is a partíció eleje.)

## 3. Év/év összehasonlítás

Az üzleti riportok kedvenc kérdése: _„Mennyivel nőtt a bevétel a tavalyi azonos hónaphoz képest?”_ Ehhez a `LAG(oszlop, 12)` a 12 sorral (hónappal) korábbi értéket adja – vagy elegánsabban, az előző év azonos hónapját a `PARTITION BY honap` + `LAG` párossal kérjük le:

```sql run
WITH havi AS (
  SELECT d.ev, d.honap, SUM(e.bevetel) AS bevetel
  FROM teny_eladas e JOIN dim_datum d ON d.datum_id = e.datum_id
  GROUP BY d.ev, d.honap
)
SELECT ev, honap, bevetel,
       LAG(bevetel) OVER (PARTITION BY honap ORDER BY ev) AS tavaly,
       ROUND(100.0 * (bevetel - LAG(bevetel) OVER (PARTITION BY honap ORDER BY ev))
             / LAG(bevetel) OVER (PARTITION BY honap ORDER BY ev), 1) AS valtozas_szazalek
FROM havi
WHERE honap <= 3
ORDER BY honap, ev;
```

A `PARTITION BY honap` miatt minden hónap külön „csoport”, benne a két év egymás után; a `LAG` így mindig az előző év azonos hónapját adja. 2025-ben nincs előző év – ott `NULL` áll, és ez így helyes.

## 4. Medián és percentilisek

Az **átlag** érzékeny a kiugró értékekre: ha egy boltban egyetlen napon óriási eladás volt, az átlag felugrik. A **medián** (a sorba rendezett értékek középső eleme) robusztusabb.

```sql run
-- Boltonként a napi bevétel átlaga, mediánja és 90. percentilise 2025-ben
WITH napi AS (
  SELECT e.bolt_id, e.datum_id, SUM(e.bevetel) AS bevetel
  FROM teny_eladas e JOIN dim_datum d ON d.datum_id = e.datum_id
  WHERE d.ev = 2025
  GROUP BY e.bolt_id, e.datum_id
)
SELECT b.varos,
       ROUND(AVG(n.bevetel)) AS atlag,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY n.bevetel) AS median,
       PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY n.bevetel) AS p90
FROM napi n JOIN dim_bolt b ON b.bolt_id = n.bolt_id
GROUP BY b.varos
ORDER BY b.varos;
```

- `PERCENTILE_CONT(0.5)` – medián (két középső érték között interpolál);
- `PERCENTILE_CONT(0.9)` – az az érték, amelynél a napok 90%-a kisebb (pl. „a 10% legjobb nap határa”);
- a `WITHIN GROUP (ORDER BY …)` mondja meg, mi szerint rendezve keressük a középsőt.

**Analógia:** egy osztály átlagfizetését egyetlen milliárdos osztálytárs is az egekbe emeli – a medián viszont alig mozdul.

## 5. Kvartilisek NTILE-lal

Az `NTILE(4)` a rendezett sorokat **4 egyenlő csoportra** osztja, és megmondja, ki melyikbe esik. Így könnyű „felső negyed”, „alsó negyed” típusú kimutatást készíteni:

```sql run
WITH termek_bevetel AS (
  SELECT p.nev, SUM(e.bevetel) AS bevetel
  FROM teny_eladas e JOIN dim_termek p ON p.termek_id = e.termek_id
  GROUP BY p.nev
)
SELECT nev, bevetel, NTILE(4) OVER (ORDER BY bevetel DESC) AS negyed
FROM termek_bevetel
ORDER BY bevetel DESC;
```

## 6. Pareto- (ABC-) elemzés

A **Pareto-elv** szerint gyakran a tételek kis része (pl. 20%) adja a hatás nagy részét (pl. 80%). Az **ABC-elemzés** ez alapján sorolja a termékeket:

- **A:** a bevétel első ~80%-át adó termékek – ezekre figyelj a legjobban (készlet, ár);
- **B:** a következő ~15%;
- **C:** a maradék ~5% – sok termék, kevés bevétel.

A számítás lépései: termékenként bevétel → csökkenő sorrend → **kumulált összeg** → osztva a teljes bevétellel.

```sql run
WITH termek_bevetel AS (
  SELECT p.nev, SUM(e.bevetel) AS bevetel
  FROM teny_eladas e JOIN dim_termek p ON p.termek_id = e.termek_id
  GROUP BY p.nev
),
kumulalt AS (
  SELECT nev, bevetel,
         100.0 * SUM(bevetel) OVER (ORDER BY bevetel DESC ROWS UNBOUNDED PRECEDING)
               / SUM(bevetel) OVER () AS kum_szazalek
  FROM termek_bevetel
)
SELECT nev, bevetel, ROUND(kum_szazalek, 1) AS kum_szazalek,
       CASE WHEN kum_szazalek <= 80 THEN 'A'
            WHEN kum_szazalek <= 95 THEN 'B'
            ELSE 'C' END AS osztaly
FROM kumulalt
ORDER BY bevetel DESC;
```

Két ablak szerepel: `SUM(bevetel) OVER (ORDER BY … ROWS UNBOUNDED PRECEDING)` a futó összeg, `SUM(bevetel) OVER ()` (üres ablak) a **teljes** összeg minden sorban. A `ROWS` azért kell, hogy két egyforma bevételű termék ne kapja meg együtt a közös futó összeget (a `RANGE` alapkeret ezt tenné).

## Összefoglalás

- `ROW_NUMBER` = egyedi sorszám, `RANK` = holtverseny után kihagy, `DENSE_RANK` = nem hagy ki.
- Az `ORDER BY`-os ablak alapkerete az aktuális sorig tart → futó összeg; a `LAST_VALUE`-hoz a keretet ki kell nyújtani.
- Év/év: `LAG(…) OVER (PARTITION BY honap ORDER BY ev)`.
- Medián és percentilis: `PERCENTILE_CONT(p) WITHIN GROUP (ORDER BY …)`; robusztusabb az átlagnál.
- Kvartilis: `NTILE(4)`.
- Pareto/ABC: futó összeg / teljes összeg (`SUM() OVER ()`), határ 80% és 95%.

## A lecke feladata

Készítsd el a **2025-ös** havi bevételi kimutatást **futó összeggel**: az oszlopok `honap`, `bevetel` (a hónap teljes bevétele) és `futo_osszeg` (az év elejétől az adott hónap végéig halmozott bevétel), hónap szerint rendezve.

```sql starter required
SELECT d.honap, SUM(e.bevetel) AS bevetel
FROM teny_eladas e
JOIN dim_datum d ON d.datum_id = e.datum_id
WHERE d.ev = 2025
GROUP BY d.honap
ORDER BY d.honap;
```

<details>
<summary>Megoldás</summary>

Az ablakfüggvény az összesített értéken (`SUM(e.bevetel)`) dolgozik, ezért szerepel benne kétszer a `SUM`:

```sql solution
SELECT d.honap,
       SUM(e.bevetel) AS bevetel,
       SUM(SUM(e.bevetel)) OVER (ORDER BY d.honap) AS futo_osszeg
FROM teny_eladas e
JOIN dim_datum d ON d.datum_id = e.datum_id
WHERE d.ev = 2025
GROUP BY d.honap
ORDER BY d.honap;
```

</details>
