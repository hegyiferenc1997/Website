---
title: Adattárház és csillagséma
summary: A ténytábla és a dimenziótáblák, a csillagséma és a hópehelyséma, a szemcsézettség, a lassan változó dimenziók, valamint az OLAP-kocka műveletei (felgörgetés, lefúrás, szeletelés, kockázás) – egy üzletlánc adattárházán SQL-ben kipróbálva.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **ténytábla** és a **dimenziótábla**,
- hogyan néz ki a **csillagséma** és a **hópehelyséma**,
- mi a **szemcsézettség** és a **lassan változó dimenzió**,
- mik az **OLAP-kocka** műveletei, és hogyan írod meg őket SQL-ben.

## Tények és dimenziók

Az adattárházban kétféle tábla van:

- **Ténytábla** (_fact table_): a **mérhető események**, számokkal – mennyit adtunk el, mekkora bevétellel. Nagyon sok sora van (minden eladás egy sor), és főleg **számokat** és **idegen kulcsokat** tartalmaz.
- **Dimenziótáblák** (_dimension tables_): a **„ki, mit, hol, mikor”** – a tények leíró környezete: termék, bolt, dátum, vásárló. Kevés soruk van, de sok leíró oszlopuk.

Az elemző kérdések szinte mindig így hangzanak: „mutasd a **ténymutatót** (bevétel, darabszám) **dimenziók szerint** bontva (kategóriánként, régiónként, negyedévenként)”.

## A csillagséma

A ténytábla középen áll, és minden dimenzióhoz **közvetlenül** kapcsolódik – ettől néz ki csillagnak:

```text
                     ┌──────────────┐
                     │  dim_datum   │
                     │ datum_id  PK │
                     │ ev, negyedev │
                     │ honap        │
                     └──────┬───────┘
                            │
  ┌──────────────┐   ┌──────┴───────┐   ┌──────────────┐
  │  dim_termek  │   │ teny_eladas  │   │   dim_bolt   │
  │ termek_id PK ├───┤ datum_id  FK ├───┤ bolt_id   PK │
  │ nev          │   │ termek_id FK │   │ varos        │
  │ kategoria    │   │ bolt_id   FK │   │ regio        │
  │ ar           │   │ db, bevetel  │   └──────────────┘
  └──────────────┘   └──────────────┘
```

Figyeld meg: a `dim_datum` tábla **minden napra** egy sort tartalmaz, előre kiszámolt évvel, negyedévvel, hónappal. Így a riportokban nem kell dátumfüggvényekkel bajlódni, és könnyű ünnepnapokat, hétvégéket, üzleti negyedéveket is jelölni.

A csillagséma **szándékosan nem normalizált**: a `dim_termek`-ben a kategória neve minden terméknél ismétlődik. Ez itt nem baj, mert az adattárházba ritkán írunk, viszont sokat olvasunk – és így minden riport legfeljebb **egy lépésnyi** JOIN.

### A hópehelyséma

Ha a dimenziókat mégis normalizáljuk (pl. a kategória külön táblába kerül, a régió is külön a várostól), a csillag ágai tovább ágaznak – ez a **hópehelyséma** (_snowflake schema_). Kevesebb az ismétlődés, de több a JOIN, és bonyolultabbak a lekérdezések. A gyakorlatban a csillagséma az elterjedtebb.

## Szemcsézettség

A ténytábla tervezésének első kérdése a **szemcsézettség** (_grain_): **mit jelent egy sor?** Egy eladott tétel? Egy teljes kosár? Egy bolt egy napi összesített forgalma? Minél **finomabb** a szemcse, annál több kérdésre tudsz válaszolni (napi adatból havit lehet számolni, fordítva nem), de annál több a sor.

## Lassan változó dimenziók

Mi van, ha egy bolt átkerül egy másik régióba, vagy egy termék kategóriát vált? Ha egyszerűen átírjuk, a **múltbeli** eladások is az új régióhoz számítanak – a tavalyi riport hirtelen mást mutat. Ezt a **lassan változó dimenziók** (_SCD, Slowly Changing Dimensions_) kezelik:

- **1. típus**: felülírjuk (a történet elvész – elírások javítására jó),
- **2. típus**: **új sort** veszünk fel az új értékkel és érvényességi időszakkal (`ervenyes_tol`, `ervenyes_ig`), így a múlt eladásai a régi sorhoz, az újak az újhoz tartoznak.

## Kipróbáljuk

<details>
<summary>Az üzletlánc adattárházának létrehozása (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

```sql run
SELECT f.*, d.datum, p.nev, b.varos
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
ORDER BY f.datum_id, f.bolt_id, f.termek_id
LIMIT 8;
```

## Az OLAP-kocka műveletei

Képzeld el az adatot egy **kockának**, amelynek tengelyei a dimenziók (idő, termék, bolt), a cellákban pedig a ténymutatók (bevétel) vannak. Az elemző ezt a kockát forgatja és vágja:

| Művelet                     | Jelentése                                                    | SQL-ben                                 |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| **Felgörgetés** (_roll up_) | durvább szintre összesít (hónap → negyedév → év)             | kevesebb oszlop a `GROUP BY`-ban        |
| **Lefúrás** (_drill down_)  | finomabb szintre bont (év → negyedév → hónap)                | több oszlop a `GROUP BY`-ban            |
| **Szeletelés** (_slice_)    | egy dimenzió egy értékét rögzíti („csak 2026”)               | egy `WHERE` feltétel                    |
| **Kockázás** (_dice_)       | több dimenzióban szűkít („2026, Kelet és Nyugat, monitorok”) | több `WHERE` feltétel                   |
| **Forgatás** (_pivot_)      | a sorokat és az oszlopokat felcseréli                        | `SUM(…) FILTER (WHERE …)` (14. témakör) |

Felgörgetés évekre:

```sql run
SELECT d.ev, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
GROUP BY d.ev
ORDER BY d.ev;
```

Lefúrás negyedévekre, és szeletelés: csak a monitorok:

```sql run
SELECT d.ev, d.negyedev, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_termek p ON p.termek_id = f.termek_id
WHERE p.kategoria = 'monitor'
GROUP BY d.ev, d.negyedev
ORDER BY d.ev, d.negyedev;
```

## Összefoglalás

- Ténytábla: mérhető események (számok + idegen kulcsok); dimenziótábla: a leíró „ki, mit, hol, mikor”.
- Csillagséma: a ténytábla közvetlenül kapcsolódik minden dimenzióhoz; hópehely: normalizált dimenziók.
- Szemcsézettség: mit jelent egy sor; lassan változó dimenziók: a történet megőrzése.
- OLAP-műveletek: felgörgetés, lefúrás, szeletelés, kockázás, forgatás.

## A lecke feladata

Készíts riportot a **2026-os** évről: **régiónként** a teljes bevétel, a **legnagyobbtól** a legkisebbig. Oszlopok: régió, bevétel.

Tipp: kapcsold össze a ténytáblát a `dim_datum` (évre szűréshez) és a `dim_bolt` (régióhoz) táblával.

```sql starter required
SELECT f.bolt_id, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
GROUP BY f.bolt_id
ORDER BY f.bolt_id;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT b.regio, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
WHERE d.ev = 2026
GROUP BY b.regio
ORDER BY bevetel DESC;
```

</details>
