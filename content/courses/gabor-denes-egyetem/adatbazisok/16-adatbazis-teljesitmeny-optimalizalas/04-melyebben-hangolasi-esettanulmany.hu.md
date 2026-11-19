---
title: Mélyebben – hangolási esettanulmány a lassú riporttól a gyors oldalig
summary: Melyik lekérdezéssel foglalkozz először (gyakoriság × időtartam), majd négy tipikus lassú lekérdezés diagnózisa és javítása EXPLAIN ANALYZE-zel – korrelált allekérdezés a SELECT-ben, VAGY több oszlopon, a teljes COUNT(*) lapozáskor és a fölösleges DISTINCT –, végül egy ellenőrzőlista a hangolás lépéseiről.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan döntsd el, **melyik** lekérdezést érdemes először gyorsítani,
- négy gyakori lassú minta **felismerését** a lekérdezéstervből,
- mindegyik **javítását** – és annak **mérését**, hogy tényleg gyorsabb lett,
- egy **ismételhető munkamenetet**, amelyet bármilyen rendszeren alkalmazhatsz.

## A webshop mintaadatbázis

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

## 0. Melyikkel kezdjem? – gyakoriság × időtartam

Egy webshop üzemeltetője panaszkodik, hogy „lassú az oldal”. A naplóból (PostgreSQL-ben a `pg_stat_statements` bővítmény gyűjti) ezt látjuk:

| Lekérdezés                   | Egy futás | Futások naponta | Összesen naponta |
| ---------------------------- | --------- | --------------- | ---------------- |
| A) havi riport               | 40 s      | 1               | 40 s             |
| B) termékoldal               | 30 ms     | 200 000         | **6000 s**       |
| C) „Rendeléseim” oldal       | 120 ms    | 20 000          | 2400 s           |
| D) keresés                   | 800 ms    | 2 000           | 1600 s           |

A leglassabb (A) ránézésre a fő gonosz, de naponta csak 40 másodpercet visz el. A **B** lekérdezés egyenként gyors, de a sokszori futtatás miatt a teljes terhelés legnagyobb részét adja: ha 30 ms-ról 10 ms-ra gyorsítjuk, naponta **4000 másodpercet** spórolunk – százszor többet, mint ha az A-t nullára vinnénk.

**Tanulság:** ne a leglassabb, hanem a **legtöbb összidőt** elvivő lekérdezéssel kezdj. (A felhasználói élmény szempontjából persze a D keresés 800 ms-a is zavaró – ez a második szempont.)

**Analógia:** a háztartásban nem a ritkán használt, de nagy fogyasztású sütő hozza a villanyszámla nagy részét, hanem az éjjel-nappal működő hűtő.

## 1. eset – korrelált allekérdezés a SELECT-ben

**Feladat:** városonként a vásárlók száma és az általuk leadott rendelések száma.

```sql run
-- ✘ Minden városra külön allekérdezés fut (és azon belül minden vásárlóra még egy!)
EXPLAIN (COSTS OFF)
SELECT v.varos,
       COUNT(*) AS vasarlok,
       SUM((SELECT COUNT(*) FROM rendelesek r WHERE r.vasarlo_id = v.vasarlo_id)) AS rendelesek
FROM vasarlok v
GROUP BY v.varos;
```

A tervben a `SubPlan` minden vásárlóra (5000-szer!) lefut, és mivel a `rendelesek.vasarlo_id`-n nincs index, mindegyik egy teljes táblaolvasás. **Javítás:** egyetlen összekapcsolás és csoportosítás.

```sql run
-- ✔ Előbb vásárlónként megszámoljuk a rendeléseket (egyszer), aztán összekapcsolunk
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT v.varos, COUNT(*) AS vasarlok, SUM(COALESCE(r.db, 0)) AS rendelesek
FROM vasarlok v
LEFT JOIN (SELECT vasarlo_id, COUNT(*) AS db FROM rendelesek GROUP BY vasarlo_id) r
       ON r.vasarlo_id = v.vasarlo_id
GROUP BY v.varos;
```

Az első változatot csak `EXPLAIN`-nel nézzük meg (lefuttatni 5000 teljes táblaolvasás lenne – próbáld ki türelemmel, ha kíváncsi vagy, az `ANALYZE` szó beírásával). A második egyszer olvassa a rendeléseket, és hash join-nal párosít. (Egy index a `rendelesek.vasarlo_id`-n az első változatot is sokat gyorsítaná – de a helyes szerkezet index nélkül is gyors.)

## 2. eset – VAGY két különböző oszlopon

**Feladat:** a keresőmező egy számot kap; lehet rendelésszám **vagy** vásárlóazonosító.

```sql run
CREATE INDEX idx_rend_vasarlo ON rendelesek (vasarlo_id);
-- ✘ OR két különböző oszlopon: régebbi rendszerek ilyenkor gyakran teljes olvasásra váltanak
EXPLAIN (COSTS OFF)
SELECT * FROM rendelesek WHERE rendeles_id = 4242 OR vasarlo_id = 4242;
```

A PostgreSQL ügyes: két index eredményét egy `BitmapOr` művelettel összefésüli. Sok más rendszer (és bonyolultabb feltételeknél a PostgreSQL is) viszont feladja, és mindent végigolvas. A biztos, rendszerfüggetlen átírás a **UNION**:

```sql run
CREATE INDEX idx_rend_vasarlo ON rendelesek (vasarlo_id);
-- ✔ Két egyszerű, indexelhető lekérdezés, az eredmények uniója
EXPLAIN (COSTS OFF)
SELECT * FROM rendelesek WHERE rendeles_id = 4242
UNION
SELECT * FROM rendelesek WHERE vasarlo_id = 4242;
```

A `UNION` (nem `UNION ALL`) azért kell, hogy ha egy sor mindkét feltételnek megfelel, ne szerepeljen kétszer.

## 3. eset – a teljes COUNT(*) minden lapozásnál

A terméklista alján ez áll: „1–20. találat a **20 000**-ből”. A teljes darabszámhoz a PostgreSQL-nek **minden sort meg kell számolnia** (az MVCC miatt nem tudja „fejből”, hány látható sor van) – minden egyes oldalbetöltéskor.

```sql run
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT COUNT(*) FROM rendelesek;
```

Lehetőségek, a legegyszerűbbtől:

1. **Ne írd ki a pontos számot.** „Több mint 1000 találat” – ehhez elég `LIMIT 1001`-gyel lekérdezni, és megnézni, megvan-e az 1001. sor.
2. **Becslés** a statisztikákból (gyakorlatilag ingyen):

```sql run
-- Az optimalizáló becslése: nagyon gyors, nagyjából pontos (az ANALYZE frissíti)
SELECT reltuples::BIGINT AS becsult_sorszam FROM pg_class WHERE relname = 'rendelesek';
```

3. **Számláló tábla**, amelyet trigger vagy időzített feladat frissít – pontos, de karbantartást igényel.

## 4. eset – a fölösleges DISTINCT

**Feladat:** azok a vásárlók, akik valaha rendeltek monitort.

```sql run
-- ✘ JOIN-nal minden monitoros tételhez egy sor jön, aztán a DISTINCT kiszűri a sok ismétlődést
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT DISTINCT v.vasarlo_id, v.nev
FROM vasarlok v
JOIN rendelesek r ON r.vasarlo_id = v.vasarlo_id
JOIN tetelek t ON t.rendeles_id = r.rendeles_id
JOIN termekek p ON p.termek_id = t.termek_id
WHERE p.kategoria = 'monitor';
```

A JOIN-ok előbb **felfújják** az eredményt (egy vásárló annyiszor szerepel, ahány monitoros tétele van), a `DISTINCT` pedig drága rendezéssel vagy hash-eléssel visszazsugorítja. Valójában csak azt kérdezzük: **van-e** ilyen rendelése?

```sql run
-- ✔ EXISTS: az első találatnál megáll, nincs felfújás és nincs DISTINCT
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT v.vasarlo_id, v.nev
FROM vasarlok v
WHERE EXISTS (
  SELECT 1
  FROM rendelesek r
  JOIN tetelek t ON t.rendeles_id = r.rendeles_id
  JOIN termekek p ON p.termek_id = t.termek_id
  WHERE r.vasarlo_id = v.vasarlo_id AND p.kategoria = 'monitor');
```

Az optimalizáló ezt **semi-join**-ként hajtja végre. **Árulkodó jel:** ha egy `DISTINCT`-et csak azért írsz, mert „valahonnan ismétlődések jöttek”, gyanakodj, hogy egy JOIN valójában `EXISTS` akart lenni.

## A hangolás munkamenete – ellenőrzőlista

1. **Mérj és rangsorolj:** gyakoriság × időtartam (`pg_stat_statements`, lassú-lekérdezés napló).
2. **Nézd meg a tervet:** `EXPLAIN (ANALYZE, BUFFERS)`. Keresd a legdrágább csomópontot, a `Seq Scan`-t nagy táblán, a `SubPlan`-t, a nagy `Sort`-ot, a becsült és valódi sorszám nagy eltérését.
3. **Egyszerre egy változtatás:** index *vagy* átírás *vagy* statisztika-frissítés (`ANALYZE`) – különben nem tudod, mi segített.
4. **Mérj újra** ugyanazokkal az adatokkal, többször (az első futás a hideg puffer miatt lassabb).
5. **Ellenőrizd az eredményt:** az átírt lekérdezés **ugyanazt** adja-e? (Egy gyors, de hibás lekérdezés rosszabb a lassúnál.)
6. **Dokumentáld:** miért van ott az index, mit javított.

## Összefoglalás

- Rangsorolj **összidő** (gyakoriság × időtartam) szerint, ne az egyes futások hossza szerint.
- A `SELECT`-be írt **korrelált allekérdezés** soronként fut → előre összesített JOIN.
- **VAGY több oszlopon** → két indexelhető lekérdezés `UNION`-ja (vagy BitmapOr).
- A **teljes `COUNT(*)`** drága → ne számold pontosan, becsüld, vagy tarts számlálót.
- A **JOIN + DISTINCT** gyakran álcázott „van-e?” kérdés → `EXISTS`.
- Mindig: egy változtatás, újramérés, az eredmény ellenőrzése.

## A lecke feladata

Készíts kimutatást: **városonként** a **nem törölt** rendelések száma (`rendelesek`) és az ezekből származó **bevétel** (`bevetel` = a tételek `db * egysegar` összege), város szerint rendezve. Írd **egyetlen lekérdezésként** összekapcsolással és csoportosítással – korrelált allekérdezés nélkül!

Vigyázz: egy rendelésnek több tétele is van, ezért a rendeléseket `COUNT(DISTINCT …)`-tal számold, különben minden rendelés annyiszor számítana, ahány tétele van!

```sql starter required
SELECT v.varos
FROM vasarlok v
GROUP BY v.varos
ORDER BY v.varos;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT v.varos,
       COUNT(DISTINCT r.rendeles_id) AS rendelesek,
       SUM(t.db * t.egysegar) AS bevetel
FROM vasarlok v
JOIN rendelesek r ON r.vasarlo_id = v.vasarlo_id
JOIN tetelek t ON t.rendeles_id = r.rendeles_id
WHERE r.statusz <> 'törölt'
GROUP BY v.varos
ORDER BY v.varos;
```

</details>
