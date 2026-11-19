---
title: Gyakorlás – gráf- és idősoros adatbázisok
summary: Ellenőrző kérdések a gráfmodellről, a rekurzív lekérdezésekről és az idősoros adatokról, majd egy ismerősajánló megírása SQL-ben, közös ismerősök számával.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség aközött, ahogyan a relációs és a gráf-adatbázis egy kapcsolatot tárol?</summary>

Relációsan a kapcsolatot idegen kulcsok (vagy egy kapcsolótábla) írják le, és lekérdezéskor JOIN-nal, indexes kereséssel állítjuk elő. A gráf-adatbázisban az él tárolt elem: minden csúcs közvetlenül hivatkozik a szomszédaira, így a bejárás mutatókövetés.

</details>

<details>
<summary>2. Miből áll egy rekurzív CTE, és mikor áll le?</summary>

Egy horgonyból (a kiinduló sorok) és egy rekurzív részből, amely az előző lépés soraiból újakat állít elő; a kettőt `UNION` köti össze. Akkor áll le, amikor egy lépés már nem ad új sort.

</details>

<details>
<summary>3. Miért veszélyes a ciklus egy rekurzív lekérdezésben, és hogyan védekezel?</summary>

Ha a gráfban kör van, és a lekérdezés `UNION ALL`-lal mindig újra hozzáadja a sorokat, sosem fogy el az új sor, így a lekérdezés végtelen ciklusba kerül. Védekezés: `UNION` (ismétlődés nélkül), a bejárt út nyilvántartása, vagy mélységkorlát.

</details>

<details>
<summary>4. Mi jellemzi az idősoros adatot?</summary>

Időbélyeges mérések, amelyek folyamatosan, időrendben érkeznek, szinte csak beszúrással, óriási mennyiségben. Időtartományokra kérdezünk le, és a régi adat részletessége idővel kevésbé fontos.

</details>

<details>
<summary>5. Mi a ritkítás és a megőrzési szabály, és miért van rájuk szükség?</summary>

Ritkítás: a részletes régi adatból összesítést (pl. napi átlagot) készítünk. Megőrzési szabály: a részletes adatot csak egy ideig tartjuk meg, utána automatikusan törlődik. Nélkülük az adatbázis korlátlanul nőne, miközben a régi részletekre már senkinek nincs szüksége.

</details>

## A gyakorlás feladata: ismerősajánló

Egy kis közösségi oldal ismeretségeit tároljuk. Minden ismeretség **mindkét irányban** szerepel a táblában (ha Anna ismeri Bélát, Béla is ismeri Annát).

<details>
<summary>A közösségi háló létrehozása (SQL)</summary>

```sql setup
-- Csúcsok: az emberek.
CREATE TABLE emberek (
  id  INT PRIMARY KEY,
  nev VARCHAR(20) NOT NULL
);
-- Élek: ki kit ismer (mindkét irányban tárolva).
CREATE TABLE ismeretsegek (
  ki   INT REFERENCES emberek (id),
  kit  INT REFERENCES emberek (id),
  PRIMARY KEY (ki, kit)
);
INSERT INTO emberek VALUES
  (1, 'Anna'), (2, 'Béla'), (3, 'Cili'), (4, 'Dani'),
  (5, 'Emma'), (6, 'Feri'), (7, 'Gabi'), (8, 'Hanna');
INSERT INTO ismeretsegek
SELECT a, b FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b)
UNION
SELECT b, a FROM (VALUES (1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (3, 5), (4, 6), (5, 7), (8, 6)) AS p (a, b);
```

</details>

```sql run
SELECT e1.nev AS ki, e2.nev AS kit
FROM ismeretsegek i
JOIN emberek e1 ON e1.id = i.ki
JOIN emberek e2 ON e2.id = i.kit
WHERE i.ki < i.kit
ORDER BY ki, kit;
```

Írj **ismerősajánlót Annának**! Keresd meg azokat, akik Anna ismerőseinek ismerősei, de **nem Anna**, és Anna **még nem ismeri** őket. Minden jelöltnél add meg, **hány közös ismerősük** van Annával. Oszlopok: név, közös ismerősök száma; a **közös ismerősök száma szerint csökkenő**, azon belül **név szerint** rendezve.

Tipp: két lépés az éltáblán (`ismeretsegek i1 JOIN ismeretsegek i2 ON i2.ki = i1.kit`), majd szűrés és csoportosítás.

```sql starter required
-- Anna közvetlen ismerősei
SELECT e.nev
FROM ismeretsegek i
JOIN emberek e ON e.id = i.kit
WHERE i.ki = 1
ORDER BY e.nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT e.nev, COUNT(*) AS kozos_ismerosok
FROM ismeretsegek i1                                -- Anna → ismerős
JOIN ismeretsegek i2 ON i2.ki = i1.kit              -- ismerős → az ő ismerőse
JOIN emberek e ON e.id = i2.kit
WHERE i1.ki = 1
  AND i2.kit <> 1                                   -- ne Anna legyen
  AND i2.kit NOT IN (SELECT kit FROM ismeretsegek WHERE ki = 1)   -- még nem ismeri
GROUP BY e.nev
ORDER BY kozos_ismerosok DESC, e.nev;
```

</details>
