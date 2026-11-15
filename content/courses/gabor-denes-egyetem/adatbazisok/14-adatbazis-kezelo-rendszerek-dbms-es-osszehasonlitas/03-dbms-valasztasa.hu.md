---
title: Hogyan válassz DBMS-t?
summary: A DBMS kiválasztásának szempontjai (adatmodell, terhelés, konzisztencia, skálázás, költség, csapat, ökoszisztéma), a súlyozott döntési mátrix módszere és az érzékenységvizsgálat – a mátrixot SQL-ben számoljuk ki a böngészőben.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- milyen **szempontok** alapján érdemes adatbázist választani,
- hogyan működik a **súlyozott döntési mátrix**,
- hogyan ellenőrizd a döntést **érzékenységvizsgálattal** – mindezt SQL-ben.

## Ne a divat döntsön!

„Mindenki MongoDB-t használ, mi is azt választjuk” – az ilyen döntések később sokba kerülnek. A jó választás a **feladatból** indul ki. Néhány kérdés, amelyet érdemes feltenni:

| Szempont                  | Kérdés                                                                            |
| ------------------------- | --------------------------------------------------------------------------------- |
| **Adatmodell**            | Táblázatos, összefüggő adatok? Rugalmas dokumentumok? Kapcsolatok hálója? Idősor? |
| **Terhelés**              | Sok kis tranzakció (OLTP) vagy nagy elemző lekérdezések (OLAP)? Írás vagy olvasás a több? |
| **Konzisztencia**         | Kell-e szigorú ACID (pénz, készlet), vagy elég a végső konzisztencia?             |
| **Méret és skálázás**     | Gigabájt vagy petabájt? Elég egy szerver, vagy több adatközpont kell?             |
| **Költség**               | Licenc, üzemeltetés, szakemberek – a teljes költség (TCO).                        |
| **Csapat**                | Mit ismer már a csapat? Mennyi idő a betanulás?                                   |
| **Ökoszisztéma**          | Van-e jó illesztőprogram a programnyelvünkhöz, ORM-támogatás, felhős szolgáltatás, közösség? |
| **Jogi szempontok**       | Hol tárolható az adat (pl. EU-n belül)? Milyen tanúsítványok kellenek?            |

> Jó ökölszabály: ha nincs különleges okod mást választani, egy **jól ismert relációs adatbázis** (pl. PostgreSQL) a legtöbb új projekthez biztonságos kiindulópont. Különleges igényekhez (óriási írásterhelés, gráfbejárás, gyorsítótár) pedig mellé lehet tenni egy specializált rendszert.

## A súlyozott döntési mátrix

Ha több jelölt van, a döntést érdemes **számokkal** alátámasztani:

1. Összegyűjtöd a **szempontokat**, és mindegyikhez **súlyt** rendelsz (pl. összesen 100%).
2. Minden jelöltet minden szempont szerint **pontozol** (pl. 1–5).
3. Jelöltenként kiszámolod a **súlyozott összeget**: Σ (pont × súly).
4. A legtöbb pontot kapó a nyerő – de a végén mindig **józan ésszel** is nézd meg!

Egy kitalált csapat egy egyetemi tanulmányi rendszer adatbázisát választja:

<details>
<summary>A döntési mátrix létrehozása (SQL)</summary>

```sql setup
-- A szempontok és a súlyuk (százalékban, összesen 100).
CREATE TABLE szempontok (
  szempont VARCHAR(20) PRIMARY KEY,
  suly     INT NOT NULL CHECK (suly > 0)
);
-- Az egyes DBMS-ek pontszámai szempontonként (1–5).
CREATE TABLE ertekelesek (
  dbms     VARCHAR(20),
  szempont VARCHAR(20) REFERENCES szempontok (szempont),
  pont     INT NOT NULL CHECK (pont BETWEEN 1 AND 5),
  PRIMARY KEY (dbms, szempont)
);
INSERT INTO szempontok VALUES
  ('teljesítmény', 30), ('költség', 25), ('skálázhatóság', 20),
  ('közösség', 15), ('tanulhatóság', 10);
INSERT INTO ertekelesek VALUES
  ('PostgreSQL', 'teljesítmény', 4), ('PostgreSQL', 'költség', 5), ('PostgreSQL', 'skálázhatóság', 4),
  ('PostgreSQL', 'közösség', 5),     ('PostgreSQL', 'tanulhatóság', 4),
  ('MySQL', 'teljesítmény', 4),      ('MySQL', 'költség', 5),      ('MySQL', 'skálázhatóság', 3),
  ('MySQL', 'közösség', 5),          ('MySQL', 'tanulhatóság', 5),
  ('Oracle', 'teljesítmény', 5),     ('Oracle', 'költség', 1),     ('Oracle', 'skálázhatóság', 5),
  ('Oracle', 'közösség', 3),         ('Oracle', 'tanulhatóság', 2),
  ('MongoDB', 'teljesítmény', 4),    ('MongoDB', 'költség', 4),    ('MongoDB', 'skálázhatóság', 5),
  ('MongoDB', 'közösség', 4),        ('MongoDB', 'tanulhatóság', 4);
```

</details>

Először nézzük meg a mátrixot „emberi” formában. A `FILTER` záradékkal minden szempontból külön oszlop lesz (ezt hívják **kimutatásnak**, _pivot_):

```sql run
SELECT dbms,
       SUM(pont) FILTER (WHERE szempont = 'teljesítmény')  AS teljesitmeny,
       SUM(pont) FILTER (WHERE szempont = 'költség')       AS koltseg,
       SUM(pont) FILTER (WHERE szempont = 'skálázhatóság') AS skalazhatosag,
       SUM(pont) FILTER (WHERE szempont = 'közösség')      AS kozosseg,
       SUM(pont) FILTER (WHERE szempont = 'tanulhatóság')  AS tanulhatosag
FROM ertekelesek
GROUP BY dbms
ORDER BY dbms;
```

Az **egyszerű** (súlyozatlan) átlag megtévesztő lehet, mert minden szempontot egyformán fontosnak vesz:

```sql run
SELECT dbms, ROUND(AVG(pont), 2) AS sima_atlag
FROM ertekelesek
GROUP BY dbms
ORDER BY sima_atlag DESC, dbms;
```

## Érzékenységvizsgálat

Mi van, ha rosszul becsültük a súlyokat? Az **érzékenységvizsgálat** megmutatja, mennyire stabil a döntés. Tegyük fel, hogy a csapatnak mégis a **skálázhatóság** a legfontosabb: emeljük meg a súlyát, és csökkentsük a költségét. (Ezt a lecke feladatának megoldása után érdemes kipróbálni a saját lekérdezéseddel is!)

```sql run
UPDATE szempontok SET suly = 40 WHERE szempont = 'skálázhatóság';
UPDATE szempontok SET suly = 5  WHERE szempont = 'költség';

SELECT szempont, suly FROM szempontok ORDER BY suly DESC;
```

Ha a súlyok kis változtatására megfordul a sorrend, a döntés **nem stabil** – ilyenkor érdemes jobban megvizsgálni a szoros versenyzőket (pl. egy kis próbaprojekttel, _proof of concept_).

## Összefoglalás

- A választás a feladatból indul: adatmodell, terhelés, konzisztencia, méret, költség, csapat, ökoszisztéma, jogi szempontok.
- Súlyozott döntési mátrix: szempontok + súlyok, pontozás, Σ (pont × súly).
- Érzékenységvizsgálat: stabil-e a döntés, ha a súlyok kicsit változnak?
- Kimutatás SQL-ben: `SUM(…) FILTER (WHERE …)`.

## A lecke feladata

Számold ki minden DBMS **súlyozott pontszámát**: szempontonként szorozd össze a pontot a súllyal, add össze, és oszd el **100**-zal, így egy 1–5 közötti értéket kapsz (**2 tizedesre** kerekítve). Oszlopok: dbms, pontszám; a **legjobbtól a legrosszabbig** rendezve.

Tipp: kapcsold össze az `ertekelesek` és a `szempontok` táblát a `szempont` oszlopon.

```sql starter required
SELECT e.dbms, e.szempont, e.pont
FROM ertekelesek e
ORDER BY e.dbms, e.szempont;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT e.dbms,
       ROUND(SUM(e.pont * s.suly) / 100.0, 2) AS pontszam
FROM ertekelesek e
JOIN szempontok s ON s.szempont = e.szempont
GROUP BY e.dbms
ORDER BY pontszam DESC;
```

</details>
