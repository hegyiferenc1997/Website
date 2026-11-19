---
title: Mélyebben – gráf- és idősor-elemzés a gyakorlatban
summary: Legrövidebb út szélességi bejárással rekurzív lekérdezéssel, fokszám és „közös ismerősök”, ajánlás gráfból; idősoroknál hiányzó időszakok kitöltése generate_series-szel, kiesések felderítése LAG-gal, kiugró értékek keresése mozgóátlaghoz képest, és ritkítás – mindez SQL-ben, kipróbálható példákon.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki gráfban a **legrövidebb utat** (hány lépésre van valaki valakitől),
- hogyan számolj **fokszámot** és **közös ismerősöket**, és hogyan készül egy egyszerű **ajánlás**,
- idősoroknál hogyan töltsd ki a **hiányzó időszakokat**,
- hogyan találd meg a **kieséseket** (amikor nem jött adat),
- hogyan szűrd ki a **kiugró értékeket**,
- és mindezt **egy relációs adatbázisban**, SQL-lel.

## 1. rész – Gráfok

### Az adat: egy kis közösségi háló

```text
   Anna ── Béla ── Cili ── Dani
     │       │              │
   Emma ─────┘            Feri ── Gabi
```

Az ismeretségek kétirányúak, ezért az éltáblában **mindkét irányt** eltároljuk (így a lekérdezésekben nem kell vele külön foglalkozni).

```sql run
CREATE TABLE ismeri (a TEXT, b TEXT);
INSERT INTO ismeri VALUES
  ('Anna','Béla'), ('Anna','Emma'), ('Béla','Cili'), ('Béla','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
-- Kétirányúvá tesszük: minden él fordítva is
INSERT INTO ismeri SELECT b, a FROM ismeri;

-- Fokszám: kinek hány ismerőse van?
SELECT a AS szemely, COUNT(*) AS fokszam
FROM ismeri
GROUP BY a
ORDER BY fokszam DESC, szemely;
```

A **fokszám** a legegyszerűbb „fontossági” mérőszám: aki sok emberrel áll kapcsolatban, az a háló központjában van (itt Béla).

### Közös ismerősök és ajánlás

„Ismerősök, akiket talán ismersz” – a közösségi oldalak klasszikus funkciója: azokat ajánljuk, akikkel **sok közös ismerősöd** van, de még nem vagytok ismerősök.

```sql run
CREATE TABLE ismeri (a TEXT, b TEXT);
INSERT INTO ismeri VALUES
  ('Anna','Béla'), ('Anna','Emma'), ('Béla','Cili'), ('Béla','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
INSERT INTO ismeri SELECT b, a FROM ismeri;

-- Ajánlás Annának: barátok barátai, akik még nem barátai, és nem ő maga
SELECT i2.b AS ajanlott, COUNT(*) AS kozos_ismerosok
FROM ismeri i1
JOIN ismeri i2 ON i2.a = i1.b          -- Anna ismerősének ismerősei
WHERE i1.a = 'Anna'
  AND i2.b <> 'Anna'
  AND NOT EXISTS (SELECT 1 FROM ismeri x WHERE x.a = 'Anna' AND x.b = i2.b)
GROUP BY i2.b
ORDER BY kozos_ismerosok DESC, ajanlott;
```

Ez két lépésnyi bejárás egy önmagával vett összekapcsolással. Egy gráf-adatbázisban (Cypher) ugyanez: `MATCH (a:Szemely {nev:'Anna'})-[:ISMERI]-()-[:ISMERI]-(ajanlott) WHERE NOT (a)-[:ISMERI]-(ajanlott) …`.

### Legrövidebb út: szélességi bejárás

_„Hány kézfogásnyira van Anna Gabitól?”_ A **szélességi bejárás** (BFS) rétegenként halad: előbb Anna közvetlen ismerősei (1 lépés), aztán azok ismerősei (2 lépés), és így tovább. Akit először érünk el, ahhoz a legrövidebb úton értünk el.

**Analógia:** egy tóba dobott kő hullámai. Az első gyűrű az 1 lépésre lévőket éri el, a második a 2 lépésre lévőket… Akit a hullám először elér, annak a távolsága a gyűrű sorszáma.

SQL-ben a `WITH RECURSIVE` lekérdezéssel járjuk be a gráfot, és **útvonal-tömbben** jegyezzük, hol jártunk már, hogy ne essünk végtelen ciklusba:

```sql run
CREATE TABLE ismeri (a TEXT, b TEXT);
INSERT INTO ismeri VALUES
  ('Anna','Béla'), ('Anna','Emma'), ('Béla','Cili'), ('Béla','Emma'),
  ('Cili','Dani'), ('Dani','Feri'), ('Feri','Gabi');
INSERT INTO ismeri SELECT b, a FROM ismeri;

WITH RECURSIVE bejaras (szemely, lepes, ut) AS (
  SELECT 'Anna', 0, ARRAY['Anna']                       -- kiindulás
  UNION ALL
  SELECT i.b, bj.lepes + 1, bj.ut || i.b                -- egy lépés tovább
  FROM bejaras bj
  JOIN ismeri i ON i.a = bj.szemely
  WHERE NOT i.b = ANY(bj.ut)                            -- ahol már jártunk, oda nem
)
SELECT DISTINCT ON (szemely) szemely, lepes, array_to_string(ut, ' → ') AS legrovidebb_ut
FROM bejaras
ORDER BY szemely, lepes;
```

A `DISTINCT ON (szemely)` minden személyből csak az **első** sort tartja meg a rendezés szerint – vagyis a legkevesebb lépésből állót. Gabi 5 lépésre van Annától: Anna → Béla → Cili → Dani → Feri → Gabi.

**Figyelem:** ez a módszer kis gráfokon jó, de nagy hálóban az összes lehetséges út száma robbanásszerűen nő. A gráf-adatbázisok erre optimalizált algoritmusokat (pl. kétirányú BFS) használnak – ezért gyorsabbak ilyen kérdésekben.

## 2. rész – Idősorok

### Az adat: egy hőmérő percenkénti mérései

```sql run
-- Egy hőmérő mérései (néhány perc kimaradt, és egy kiugró érték is van)
CREATE TABLE meres (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meres VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT * FROM meres ORDER BY ido;
```

### Kiesések felderítése a LAG-gal

A `LAG(oszlop)` ablakfüggvény az **előző sor** értékét adja vissza. Ha két egymás utáni mérés között 1 percnél több telt el, ott kiesés volt (elment az áram, megszakadt a hálózat…):

```sql run
CREATE TABLE meres (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meres VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT elozo AS kieses_kezdete, ido AS kieses_vege, ido - elozo AS hossz
FROM (SELECT ido, LAG(ido) OVER (ORDER BY ido) AS elozo FROM meres) x
WHERE ido - elozo > INTERVAL '1 minute';
```

### Hiányzó időszakok kitöltése

Egy grafikonon a kiesés könnyen észrevétlen marad, ha a pontokat egyszerűen összekötjük. Jobb, ha **minden percnek** van sora, és a hiányzóknál `NULL` áll. A `generate_series` előállítja a teljes időskálát, amelyhez LEFT JOIN-nal kapcsoljuk a méréseket:

```sql run
CREATE TABLE meres (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meres VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT perc, m.homerseklet,
       CASE WHEN m.ido IS NULL THEN 'hiányzik' ELSE 'ok' END AS allapot
FROM generate_series(TIMESTAMP '2025-03-01 10:00', TIMESTAMP '2025-03-01 10:11', INTERVAL '1 minute') AS perc
LEFT JOIN meres m ON m.ido = perc
ORDER BY perc;
```

Ugyanez a minta jó **napi riportoknál** is: ha egy napon nem volt eladás, akkor is jelenjen meg 0-val, ne maradjon ki a napsor.

### Kiugró értékek: eltérés a környezettől

A 10:08-as 35,9 °C nyilvánvalóan mérési hiba. Hogyan veszi ezt észre egy program? Összehasonlítjuk minden mérést a **környező mérések átlagával** (mozgóátlag), és ha túl nagy az eltérés, megjelöljük:

```sql run
CREATE TABLE meres (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meres VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

SELECT ido, homerseklet,
       ROUND(kornyezet, 2) AS kornyezo_atlag,
       CASE WHEN ABS(homerseklet - kornyezet) > 3 THEN 'GYANÚS' ELSE '' END AS jelzes
FROM (
  SELECT ido, homerseklet,
         -- az előző 2 és a következő 2 mérés átlaga (saját magát kihagyva)
         (SUM(homerseklet) OVER w - homerseklet) / (COUNT(*) OVER w - 1) AS kornyezet
  FROM meres
  WINDOW w AS (ORDER BY ido ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)
) x
ORDER BY ido;
```

Miért hagyjuk ki saját magát az átlagból? Mert különben a kiugró érték a saját átlagát is felhúzná, és kevésbé tűnne ki. Valódi rendszerekben gyakran a **szórás** többszöröséhez mérik az eltérést (pl. „3 szigma” szabály), de az elv ugyanez.

### Ritkítás (downsampling)

Egy év percenkénti mérése 525 600 sor szenzoronként. A régi adatból elég az órás vagy napi átlag. A `date_trunc` lekerekíti az időt, és csoportosíthatunk szerinte:

```sql run
CREATE TABLE meres (ido TIMESTAMP, homerseklet NUMERIC(4, 1));
INSERT INTO meres VALUES
  ('2025-03-01 10:00', 21.0), ('2025-03-01 10:01', 21.2), ('2025-03-01 10:02', 21.1),
  ('2025-03-01 10:03', 21.3), ('2025-03-01 10:07', 21.4), ('2025-03-01 10:08', 35.9),
  ('2025-03-01 10:09', 21.6), ('2025-03-01 10:10', 21.5), ('2025-03-01 10:11', 21.7);

-- Ötperces összesítés: átlag, minimum, maximum, mérésszám
SELECT date_bin(INTERVAL '5 minutes', ido, TIMESTAMP '2025-03-01') AS idoablak,
       ROUND(AVG(homerseklet), 2) AS atlag, MIN(homerseklet) AS min, MAX(homerseklet) AS max,
       COUNT(*) AS meresek
FROM meres
GROUP BY idoablak
ORDER BY idoablak;
```

(A `date_bin` tetszőleges hosszú időablakra kerekít; a `date_trunc` csak egész egységre: óra, nap, hónap.) Figyeld meg: a 10:05-ös ablakban a kiugró érték felhúzza az átlagot és a maximumot – ezért érdemes **előbb kiszűrni** a hibás méréseket, és csak utána ritkítani.

## Összefoglalás

- **Gráfok SQL-ben:** éltábla (kétirányú kapcsolatnál mindkét irány), fokszám `GROUP BY`-jal, közös ismerősök önmagával vett összekapcsolással.
- **Legrövidebb út:** `WITH RECURSIVE` szélességi bejárás útvonal-tömbbel a ciklusok ellen, `DISTINCT ON` a legkisebb lépésszámra.
- **Idősorok:** `LAG` a kiesések felderítésére, `generate_series` + `LEFT JOIN` a hiányzó időszakok kitöltésére, mozgó ablak a kiugró értékekre, `date_trunc` / `date_bin` a ritkításra.

## A lecke feladata

Egy szerver percenként küld „életjelet”. A kiinduló kód létrehozza az `eletjel` táblát. Kérd le azokat a **kieséseket**, amikor két egymás utáni életjel között **több mint 2 perc** telt el! Az eredmény oszlopai: a kiesés előtti utolsó életjel ideje (`utolso_jel`), az újraindulás ideje (`ujra_jel`) és a kiesés hossza (`hossz`), időrendben.

```sql starter required
CREATE TABLE eletjel (ido TIMESTAMP);
INSERT INTO eletjel VALUES
  ('2025-03-01 08:00'), ('2025-03-01 08:01'), ('2025-03-01 08:02'), ('2025-03-01 08:06'),
  ('2025-03-01 08:07'), ('2025-03-01 08:09'), ('2025-03-01 08:15'), ('2025-03-01 08:16');

-- Írd meg a lekérdezést a LAG ablakfüggvénnyel!
SELECT ido FROM eletjel ORDER BY ido;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE eletjel (ido TIMESTAMP);
INSERT INTO eletjel VALUES
  ('2025-03-01 08:00'), ('2025-03-01 08:01'), ('2025-03-01 08:02'), ('2025-03-01 08:06'),
  ('2025-03-01 08:07'), ('2025-03-01 08:09'), ('2025-03-01 08:15'), ('2025-03-01 08:16');

SELECT elozo AS utolso_jel, ido AS ujra_jel, ido - elozo AS hossz
FROM (SELECT ido, LAG(ido) OVER (ORDER BY ido) AS elozo FROM eletjel) x
WHERE ido - elozo > INTERVAL '2 minutes'
ORDER BY ido;
```

</details>
