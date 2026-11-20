---
title: Záró gyakorlás – az egész tárgy egyben
summary: Ellenőrző kérdések a tárgy legfontosabb gondolatairól a tervezéstől a teljesítményig, majd egy záró SQL feladat, amely több témakör tudását köti össze: összekapcsolás, LEFT JOIN, csoportosítás, szűrt összesítés, NULL-kezelés és rendezés.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

Vegyes, „valódi életből” vett feladatok: tervezési minták kipróbálása és néhány tipikus kérdés a tanulmányi adatbázison.

**1.** **Tárgyajánló.** Melyik tárgyakat **nem vette még fel** Kiss Anna (`ABC123`)? (Kód, név; kód szerint.)

```sql starter
SELECT kod FROM jelentkezesek WHERE neptun = 'ABC123';
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, nev
FROM targyak
WHERE kod NOT IN (SELECT kod FROM jelentkezesek WHERE neptun = 'ABC123')
ORDER BY kod;
```

</details>

**2.** **Állapot kódtáblával.** Hozd létre a `statuszok` kódtáblát (`kod` kulcs, `nev` kötelező) a `'uj'`, `'fizetve'`, `'szallitva'` kódokkal, és a `megrendelesek` táblát (`id` kulcs, `statusz` **idegen kulcs** a kódtáblára, kötelező)! Az ellenőrzés kipróbálja, hogy elírt állapot nem kerülhet be.

```sql starter
CREATE TABLE statuszok (kod VARCHAR(10) PRIMARY KEY);
CREATE TABLE megrendelesek (id INT PRIMARY KEY);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE statuszok (kod VARCHAR(10) PRIMARY KEY, nev VARCHAR(30) NOT NULL);
INSERT INTO statuszok VALUES ('uj', 'Új'), ('fizetve', 'Fizetve'), ('szallitva', 'Szállítva');

CREATE TABLE megrendelesek (
  id      INT PRIMARY KEY,
  statusz VARCHAR(10) NOT NULL REFERENCES statuszok (kod)   -- csak a kódtábla értékei
);
```

</details>

```sql test
CREATE FUNCTION probal(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, eset TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES (1, 'fizetve', probal($q$INSERT INTO megrendelesek VALUES (1, 'fizetve')$q$));
INSERT INTO eredmeny VALUES (2, 'Fizetve (nagybetűvel)', probal($q$INSERT INTO megrendelesek VALUES (2, 'Fizetve')$q$));
INSERT INTO eredmeny VALUES (3, 'állapot nélkül', probal($q$INSERT INTO megrendelesek VALUES (3, NULL)$q$));
INSERT INTO eredmeny SELECT 4, 'állapotok száma', COUNT(*)::TEXT FROM statuszok;
SELECT * FROM eredmeny ORDER BY sorszam;
```

**3.** **Logikai törlés visszavonása.** A „Monitor” terméket tévedésből törölték (logikailag). **Állítsd vissza**, majd kérdezd le az aktív termékeket a nézetből, azonosító szerint!

```sql starter
CREATE TABLE termekek (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL, torolve_ekkor TIMESTAMP);
INSERT INTO termekek VALUES (1, 'Egér', NULL), (2, 'Monitor', '2025-03-01 10:00'), (3, 'Billentyűzet', NULL);
CREATE VIEW aktiv_termekek AS SELECT id, nev FROM termekek WHERE torolve_ekkor IS NULL;

SELECT * FROM aktiv_termekek ORDER BY id;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termekek (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL, torolve_ekkor TIMESTAMP);
INSERT INTO termekek VALUES (1, 'Egér', NULL), (2, 'Monitor', '2025-03-01 10:00'), (3, 'Billentyűzet', NULL);
CREATE VIEW aktiv_termekek AS SELECT id, nev FROM termekek WHERE torolve_ekkor IS NULL;

UPDATE termekek SET torolve_ekkor = NULL WHERE nev = 'Monitor';   -- a visszaállítás egyetlen UPDATE

SELECT * FROM aktiv_termekek ORDER BY id;
```

</details>

**4.** **Előzménytábla.** Mennyi volt **minden termék ára 2025. március 15-én**? (Termékazonosító, ár; azonosító szerint.)

```sql starter
CREATE TABLE ar_tortenet (termek_id INT, ar NUMERIC(10, 2), ervenyes_tol DATE NOT NULL, ervenyes_ig DATE);
INSERT INTO ar_tortenet VALUES
  (1, 4490, '2024-01-01', '2024-09-30'), (1, 4990, '2024-10-01', '2025-05-31'), (1, 5490, '2025-06-01', NULL),
  (2, 21990, '2024-01-01', '2025-02-28'), (2, 24990, '2025-03-01', NULL);

SELECT * FROM ar_tortenet;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE ar_tortenet (termek_id INT, ar NUMERIC(10, 2), ervenyes_tol DATE NOT NULL, ervenyes_ig DATE);
INSERT INTO ar_tortenet VALUES
  (1, 4490, '2024-01-01', '2024-09-30'), (1, 4990, '2024-10-01', '2025-05-31'), (1, 5490, '2025-06-01', NULL),
  (2, 21990, '2024-01-01', '2025-02-28'), (2, 24990, '2025-03-01', NULL);

SELECT termek_id, ar
FROM ar_tortenet
WHERE ervenyes_tol <= DATE '2025-03-15'
  AND (ervenyes_ig IS NULL OR ervenyes_ig >= DATE '2025-03-15')   -- NULL = ma is érvényes
ORDER BY termek_id;
```

</details>

**5.** **Vesszős lista helyett sorok.** Egy régi tábla a címkéket egyetlen mezőben, vesszővel elválasztva tárolja (ez antiminta!). Bontsd szét a listát soronként egy címkére (`string_to_table`), és számold meg, **melyik címke hányszor** fordul elő! (Címke, darab; darab szerint csökkenően, azon belül címke szerint.)

```sql starter
CREATE TABLE cikkek (id INT PRIMARY KEY, cimkek TEXT);
INSERT INTO cikkek VALUES (1, 'akcio,uj'), (2, 'uj'), (3, 'akcio,kiemelt,uj'), (4, 'kiemelt');

SELECT id, cimkek FROM cikkek;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE cikkek (id INT PRIMARY KEY, cimkek TEXT);
INSERT INTO cikkek VALUES (1, 'akcio,uj'), (2, 'uj'), (3, 'akcio,kiemelt,uj'), (4, 'kiemelt');

SELECT cimke, COUNT(*) AS db
FROM cikkek, string_to_table(cimkek, ',') AS cimke     -- minden címke külön sor lesz
GROUP BY cimke
ORDER BY db DESC, cimke;
```

</details>

**6.** **Rugalmas extra adatok JSONB-ben.** A termékek közös adatai rendes oszlopokban vannak, a típusfüggő extrák egy `extra` JSONB oszlopban. Melyik termékek képernyője **legalább 27 colos**? (Név, méret; méret szerint csökkenően.)

```sql starter
CREATE TABLE termekek_x (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL, extra JSONB);
INSERT INTO termekek_x VALUES
  (1, '24 colos monitor', '{"meret_col": 24, "panel": "IPS"}'),
  (2, '27 colos monitor', '{"meret_col": 27, "panel": "VA"}'),
  (3, 'Gamer egér',       '{"dpi": 16000}'),
  (4, '32 colos monitor', '{"meret_col": 32, "panel": "IPS"}');

SELECT nev, extra FROM termekek_x;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termekek_x (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL, extra JSONB);
INSERT INTO termekek_x VALUES
  (1, '24 colos monitor', '{"meret_col": 24, "panel": "IPS"}'),
  (2, '27 colos monitor', '{"meret_col": 27, "panel": "VA"}'),
  (3, 'Gamer egér',       '{"dpi": 16000}'),
  (4, '32 colos monitor', '{"meret_col": 32, "panel": "IPS"}');

SELECT nev, (extra ->> 'meret_col')::INT AS meret
FROM termekek_x
WHERE (extra ->> 'meret_col')::INT >= 27     -- az egérnél NULL → kimarad
ORDER BY meret DESC;
```

</details>
