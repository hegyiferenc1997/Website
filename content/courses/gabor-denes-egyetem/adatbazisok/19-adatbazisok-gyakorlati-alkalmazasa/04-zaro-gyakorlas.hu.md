---
title: Záró gyakorlás – az egész tárgy egyben
summary: Ellenőrző kérdések a tárgy legfontosabb gondolatairól a tervezéstől a teljesítményig, majd egy záró SQL feladat, amely több témakör tudását köti össze: összekapcsolás, LEFT JOIN, csoportosítás, szűrt összesítés, NULL-kezelés és rendezés.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

Próbálj meg előbb magadban válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Miért kell a követelményekből megszorításokat (NOT NULL, UNIQUE, CHECK, idegen kulcs) csinálni, ha az alkalmazás úgyis ellenőriz?</summary>

Mert egy adatbázisba idővel sok program ír: a webes felület, egy importáló szkript, egy kolléga kézzel. Az alkalmazás ellenőrzése csak azt az egy utat védi, a megszorítás mindet. Ráadásul a programban lehet hiba – az adatbázis az utolsó védővonal.

</details>

<details>
<summary>2. Hogyan veszed észre egy riportban a duplán számolást?</summary>

Ha egy „1” oldali táblát (például rendelés) egy „N” oldalival (tételek) kapcsolsz össze, az „1” oldal sorai megismétlődnek. Gyanús jel, ha a `COUNT(*)` többet ad, mint a `COUNT(DISTINCT kulcs)`, vagy ha a részösszegek nem adják ki a végösszeget. Megoldás: `COUNT(DISTINCT …)`, vagy előbb összesíteni egy CTE-ben, és csak utána kapcsolni.

</details>

<details>
<summary>3. Mi a különbség a pesszimista és az optimista zárolás között?</summary>

A pesszimista zárolás (`SELECT … FOR UPDATE`) már beolvasáskor zárolja a sort, a többiek várnak. Az optimista nem zárol, hanem mentéskor ellenőrzi egy verziószámmal, hogy közben nem változott-e a sor; ha igen, 0 sor módosul, és az alkalmazás újrapróbálja. Ritka ütközésnél és hosszú szerkesztésnél az optimista a jobb.

</details>

<details>
<summary>4. Miért LEFT JOIN kell, ha minden hallgatót látni akarsz, azokat is, akiknek nincs jelentkezése?</summary>

Az INNER JOIN csak azokat a sorokat tartja meg, amelyeknek mindkét oldalon van párjuk – a jelentkezés nélküli hallgató kiesne. A LEFT JOIN a bal oldal minden sorát megtartja, a hiányzó jobb oldali értékek helyére NULL kerül.

</details>

<details>
<summary>5. Mit ad az AVG, a SUM és a COUNT, ha minden érték NULL vagy nincs sor?</summary>

A `COUNT(oszlop)` 0-t ad (a NULL-okat nem számolja), a `SUM` és az `AVG` viszont NULL-t. Ha a riportban 0-t szeretnél látni, `COALESCE(SUM(...), 0)`. Az átlagnál a NULL sokszor a helyes válasz: akinek nincs jegye, annak nincs átlaga – a 0 félrevezető lenne.

</details>

## A záró feladat: hallgatói összesítő

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

A tanulmányi rendszer egy összesítő listát kér **minden hallgatóról** – azokról is, akik még semmire nem jelentkeztek. Oszlopok:

1. `nev`: a hallgató neve,
2. `targyak`: hány tárgyra jelentkezett,
3. `kredit`: a **teljesített** tárgyak (jegy legalább 2) kreditjeinek összege; ha nincs ilyen, **0** (ne NULL),
4. `atlag`: a jegyek átlaga **2 tizedesre** kerekítve (a még jegy nélküli jelentkezés nem számít bele; akinek nincs jegye, annál maradjon NULL).

Rendezés: kredit szerint csökkenő, azonos kreditnél név szerint növekvő.

Emlékeztető a hasznos eszközökre: `LEFT JOIN` (4. témakör), `FILTER (WHERE …)` az összesítő függvény után (ebben a témakörben), `COALESCE` (NULL helyett alapérték), `ROUND`. Az `AVG` és a `COUNT(oszlop)` magától kihagyja a NULL értékeket.

A kiinduló kód már majdnem jó, de kimarad belőle egy hallgató, és a bukott tárgyak kreditjét is beszámolja.

```sql starter required
SELECT h.nev,
       COUNT(j.kod) AS targyak,
       SUM(t.kredit) AS kredit,
       ROUND(AVG(j.jegy), 2) AS atlag
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun
JOIN targyak t ON t.kod = j.kod
GROUP BY h.neptun, h.nev
ORDER BY kredit DESC, h.nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev,
       COUNT(j.kod) AS targyak,
       COALESCE(SUM(t.kredit) FILTER (WHERE j.jegy >= 2), 0) AS kredit,
       ROUND(AVG(j.jegy), 2) AS atlag
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
LEFT JOIN targyak t ON t.kod = j.kod
GROUP BY h.neptun, h.nev
ORDER BY kredit DESC, h.nev;
```

Mi miért van benne:

- **mindkét** JOIN `LEFT`, különben a második JOIN „visszavágná” Varga Emmát (nála a `j.kod` NULL, a tárgyhoz nincs pár);
- `COUNT(j.kod)` és nem `COUNT(*)`: Emmánál a LEFT JOIN egy NULL-okkal teli sort ad, a `COUNT(*)` ezt 1-nek számolná;
- a `FILTER (WHERE j.jegy >= 2)` csak a teljesített tárgyak kreditjét adja össze – a jegy nélküli (NULL) jelentkezés sem számít, mert a `NULL >= 2` nem igaz;
- a `COALESCE` Emmánál a NULL összeget 0-ra cseréli, az átlag viszont NULL marad;
- `GROUP BY h.neptun, h.nev`: a kulcs szerint csoportosítunk, így két azonos nevű hallgató sem olvadna össze.

Gratulálunk, végigértél az Adatbázisok tárgyon! Ez a lekérdezés egymagában a tervezés, az SQL, a NULL-logika és a riportkészítés tudását is igényli.

</details>
