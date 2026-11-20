---
title: Gyakorlás – OLAP és OLTP
summary: Ellenőrző kérdések az OLTP és OLAP különbségéről, a csillagsémáról és az elemző SQL-ről, egy tervezési esettanulmány, valamint egy szorgalmi feladat ablakfüggvénnyel: a legjobb termék régiónként.
minutes: 53
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért tárolják az OLAP rendszerek gyakran oszloponként az adatot?</summary>

Mert az elemző lekérdezések sok sort, de kevés oszlopot olvasnak (pl. csak a bevételt és a dátumot). Oszlopos tárolásnál csak ezeket az oszlopokat kell beolvasni, és az egyforma típusú, hasonló értékek nagyon jól tömöríthetők – így sokkal kevesebb adatot kell a lemezről mozgatni.

</details>

<details>
<summary>2. Miért nem normalizált a csillagséma, és miért nem baj ez?</summary>

Mert az elemzésnél a gyors, egyszerű lekérdezés a fontos: minden dimenzió egy lépésnyi JOIN-ra van a ténytáblától. Az ismétlődés miatti anomáliák (6. témakör) itt kevésbé fenyegetnek, mert az adattárházba ritkán, ellenőrzött betöltéssel (ETL) írunk, nem sok kis tranzakcióval.

</details>

<details>
<summary>3. Mit jelent a ténytábla szemcsézettsége, és miért a legfinomabbat érdemes választani?</summary>

Azt, hogy a ténytábla egy sora mit képvisel (pl. egy eladott tétel, vagy egy bolt egy napi forgalma). A finomabb szemcséből bármikor lehet durvább szintre összesíteni (felgörgetés), fordítva viszont nem – a részletek utólag nem állíthatók vissza.

</details>

<details>
<summary>4. Mi a különbség a ROLLUP és a CUBE között két oszlopnál?</summary>

A `ROLLUP (a, b)` a hierarchia mentén összesít: (a, b), (a) és (). A `CUBE (a, b)` minden kombinációt elkészít: (a, b), (a), (b) és () – tehát a b szerinti összesítést is.

</details>

<details>
<summary>5. Miért marad meg minden sor az ablakfüggvényeknél, és miért hasznos ez?</summary>

Mert az ablakfüggvény nem vonja össze a sorokat, mint a `GROUP BY`, hanem minden sor mellé odaírja a csoportra vagy sorrendre számolt értéket. Így egy sorban látszik a részlet (pl. egy kategória bevétele) és a viszonyítás is (helyezés, részesedés, futó összeg, előző időszak).

</details>

## Esettanulmány: egy edzőterem-lánc adattárháza

Egy edzőterem-lánc elemezni szeretné a belépéseket: melyik teremben, melyik napszakban, milyen bérlettípussal hányan edzenek.

```quiz required
? Mi legyen a ténytábla egy sora?
+ egy belépés (ki, mikor, melyik teremben, milyen bérlettel)
- egy edzőterem adatai
- egy bérlettípus leírása
- egy hónap összesített adata az összes teremre
! A legfinomabb szemcse: egy esemény.

? Melyik dimenziótábla tartalmazza a terem városát és régióját?
- a ténytábla
+ a terem dimenzió
- a dátum dimenzió
! A „hol” kérdés dimenziója.

? Az elemző a havi belépésszámokból a negyedéves számokat szeretné látni. Melyik OLAP-művelet ez?
+ felgörgetés (roll up)
- lefúrás (drill down)
- szeletelés (slice)
! Durvább szintre összesít.

? Egy terem átkerül egy másik régióba. A tavalyi riportoknak a régi régiót kell mutatniuk. Hogyan kezeled?
- egyszerűen átírod a régiót a terem dimenzióban
+ lassan változó dimenzió, 2. típus: új sor az új régióval és érvényességi időszakkal
- törlöd a terem tavalyi belépéseit
! Így a múlt a régi, a jövő az új sorhoz tartozik.

? Melyik SQL-szerkezet adja meg egyetlen lekérdezésben a termenkénti, a bérlettípusonkénti és a teljes összeget is (a terem és bérlettípus szerinti bontás nélkül)?
- GROUP BY terem, berlettipus
+ GROUP BY GROUPING SETS ((terem), (berlettipus), ())
- GROUP BY ROLLUP (terem, berlettipus)
! Pontosan a felsorolt csoportosítások.
```

## Szorgalmi feladat: a legjobb kategória régiónként

<details>
<summary>Az üzletlánc adattárházának létrehozása (SQL)</summary>

<!-- sql-setup: eladasok -->

</details>

Add meg **régiónként** azt az **egy** kategóriát, amelyik a **legtöbb bevételt** hozta, a bevétellel együtt. Oszlopok: régió, kategória, bevétel; régió szerint rendezve. Ez a feladat nem kötelező.

Tipp: rangsorold régiónként a kategóriákat egy CTE-ben (`RANK() OVER (PARTITION BY …)`), és kívül csak az első helyezetteket tartsd meg.

```sql starter
SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY b.regio, p.kategoria
ORDER BY b.regio, bevetel DESC;
```

<details>
<summary>Megoldás</summary>

```sql solution
WITH rangsor AS (
  SELECT b.regio, p.kategoria, SUM(f.bevetel) AS bevetel,
         RANK() OVER (PARTITION BY b.regio ORDER BY SUM(f.bevetel) DESC) AS helyezes
  FROM teny_eladas f
  JOIN dim_termek p ON p.termek_id = f.termek_id
  JOIN dim_bolt b ON b.bolt_id = f.bolt_id
  GROUP BY b.regio, p.kategoria
)
SELECT regio, kategoria, bevetel
FROM rangsor
WHERE helyezes = 1
ORDER BY regio;
```

</details>

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

A feladatok a fenti üzletlánc csillagsémáján futnak (`teny_eladas` + `dim_datum`, `dim_termek`, `dim_bolt`).

**1.** **Szeletelés két dimenzió mentén.** **2025**-ben mennyi volt a bevétel **régiónként és negyedévenként**? (Régió, negyedév, bevétel; régió, majd negyedév szerint.)

```sql starter
SELECT f.bevetel
FROM teny_eladas f;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT b.regio, d.negyedev, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_bolt b  ON b.bolt_id = f.bolt_id
WHERE d.ev = 2025                         -- szeletelés: egy dimenzió egy értékére szűrünk
GROUP BY b.regio, d.negyedev
ORDER BY b.regio, d.negyedev;
```

</details>

**2.** **Részösszeg és végösszeg (ROLLUP).** Kategóriánként a teljes bevétel, **plusz egy összesítő sor** a végén. A `GROUP BY ROLLUP (kategoria)` ezt egy lépésben megadja; az összesítő sorban a kategória `NULL`, ezt cseréld `'összesen'`-re! (Kategória, bevétel; a kategóriák ábécérendben, az összesen a végén.)

```sql starter
SELECT p.kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
GROUP BY p.kategoria;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT COALESCE(p.kategoria, 'összesen') AS kategoria, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_termek p ON p.termek_id = f.termek_id
GROUP BY ROLLUP (p.kategoria)
ORDER BY p.kategoria NULLS LAST;          -- az összesítő (NULL) sor kerüljön a végére
```

</details>

**3.** **Kimutatás (pivot) FILTER-rel.** Városonként a **2025-ös és a 2026-os** bevétel **egymás mellett, két oszlopban**, plusz a változás százalékban (1 tizedes). Város szerint rendezve.

```sql starter
SELECT b.varos, d.ev, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_bolt b  ON b.bolt_id = f.bolt_id
GROUP BY b.varos, d.ev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT b.varos,
       SUM(f.bevetel) FILTER (WHERE d.ev = 2025) AS bevetel_2025,
       SUM(f.bevetel) FILTER (WHERE d.ev = 2026) AS bevetel_2026,
       ROUND(100.0 * (SUM(f.bevetel) FILTER (WHERE d.ev = 2026) - SUM(f.bevetel) FILTER (WHERE d.ev = 2025))
             / SUM(f.bevetel) FILTER (WHERE d.ev = 2025), 1) AS valtozas_szazalek
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
JOIN dim_bolt b  ON b.bolt_id = f.bolt_id
GROUP BY b.varos
ORDER BY b.varos;
```

</details>

**4.** **Havi változás LAG-gal.** **2025** minden hónapjára add meg a bevételt, az **előző havi** bevételt és a különbséget! (Hónap, bevétel, előző hónap, különbség; hónap szerint.) Januárnál nincs előző hónap: ott `NULL` a helyes.

```sql starter
SELECT d.honap, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_datum d ON d.datum_id = f.datum_id
WHERE d.ev = 2025
GROUP BY d.honap
ORDER BY d.honap;
```

<details>
<summary>Megoldás</summary>

```sql solution
WITH havi AS (
  SELECT d.honap, SUM(f.bevetel) AS bevetel
  FROM teny_eladas f
  JOIN dim_datum d ON d.datum_id = f.datum_id
  WHERE d.ev = 2025
  GROUP BY d.honap
)
SELECT honap, bevetel,
       LAG(bevetel) OVER (ORDER BY honap) AS elozo_honap,
       bevetel - LAG(bevetel) OVER (ORDER BY honap) AS kulonbseg
FROM havi
ORDER BY honap;
```

</details>

**5.** **Részesedés az egészből.** Boltonként (város) mekkora a **teljes** bevétel, és ez hány **százaléka** a lánc összes bevételének (1 tizedes)? A `SUM(...) OVER ()` minden sorba odaadja a végösszeget. Részesedés szerint csökkenően.

```sql starter
SELECT b.varos, SUM(f.bevetel) AS bevetel
FROM teny_eladas f
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY b.varos;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT b.varos, SUM(f.bevetel) AS bevetel,
       ROUND(100.0 * SUM(f.bevetel) / SUM(SUM(f.bevetel)) OVER (), 1) AS reszesedes
FROM teny_eladas f
JOIN dim_bolt b ON b.bolt_id = f.bolt_id
GROUP BY b.varos
ORDER BY reszesedes DESC, b.varos;
```

</details>
