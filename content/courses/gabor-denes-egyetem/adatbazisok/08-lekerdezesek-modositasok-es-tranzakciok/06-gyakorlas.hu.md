---
title: Gyakorlás – lekérdezések, módosítások, tranzakciók
summary: Ellenőrző kérdések, gyakorló feladatok összekapcsolásra, allekérdezésre és módosításra, és egy összefoglaló kimutatás-feladat.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mikor használsz LEFT JOIN-t INNER JOIN helyett?</summary>

Ha a bal oldali tábla **minden** sorát látni szeretnéd, azokat is, amelyeknek nincs párja a jobb oldalon (pl. a tárgyat fel nem vett hallgatókat is). A pár nélküli sorok a jobb oldali oszlopokban NULL-t kapnak.

</details>

<details>
<summary>2. Miért adhat üres eredményt a <code>WHERE neptun NOT IN (SELECT neptun FROM …)</code>?</summary>

Mert ha az allekérdezés eredményében van **NULL**, akkor a `NOT IN` minden sorra „ismeretlen” eredményt ad (nem lehet biztosan tudni, hogy az érték nem egyenlő a NULL-lal). Ilyenkor a `NOT EXISTS` a biztonságos megoldás.

</details>

<details>
<summary>3. Mit csinál az <code>UPDATE termekek SET ar = ar * 1.1;</code>?</summary>

**Minden** termék árát 10%-kal emeli, mert nincs `WHERE`. Ha ez volt a cél, rendben – ha nem, akkor ez a klasszikus végzetes hiba. Ezért érdemes előbb `SELECT`-tel kipróbálni a feltételt, és tranzakcióban dolgozni.

</details>

<details>
<summary>4. Mi a különbség az atomicitás és a tartósság között?</summary>

Az **atomicitás** azt garantálja, hogy egy tranzakció vagy teljesen megtörténik, vagy semmi nem marad belőle. A **tartósság** azt, hogy a már **véglegesített** (COMMIT után lévő) változás egy összeomlás után is megmarad.

</details>

<details>
<summary>5. Hogyan előzhető meg a holtpont?</summary>

Ha minden tranzakció **ugyanabban a sorrendben** zárolja az erőforrásokat (pl. mindig a kisebb azonosítójú sort előbb), és a tranzakciók **rövidek** (nem várnak benne felhasználói bevitelre). Ha mégis előfordul, a DBMS az egyik tranzakciót leállítja, amelyet az alkalmazásnak újra kell próbálnia.

</details>

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Gyakorló feladatok (nem kötelezők)

**a)** Melyik tárgyakra (`nev`) jelentkezett **budapesti** hallgató? Minden tárgy egyszer, név szerint rendezve.

```sql starter
SELECT t.nev
FROM targyak t;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT DISTINCT t.nev
FROM targyak t
JOIN jelentkezesek j ON j.kod = t.kod
JOIN hallgatok h ON h.neptun = j.neptun
WHERE h.varos = 'Budapest'
ORDER BY t.nev;
```

</details>

**b)** Melyik hallgatóknak (`nev`) nincs **egyetlen ötöse sem**? Név szerint rendezve.

```sql starter
SELECT nev FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev FROM hallgatok h
WHERE NOT EXISTS (
  SELECT 1 FROM jelentkezesek j WHERE j.neptun = h.neptun AND j.jegy = 5
)
ORDER BY h.nev;
```

</details>

## Összefoglaló feladat

Készíts kimutatást **minden tárgyról** (azokról is, amelyekre esetleg senki nem jelentkezett): a tárgy **neve** (`targy`), a jelentkezők **száma** (`letszam`) és a jegyek **átlaga két tizedesre** (`atlag`). Rendezd a tárgy neve szerint.

```sql starter required
SELECT t.nev AS targy
FROM targyak t;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT t.nev AS targy, COUNT(j.neptun) AS letszam, ROUND(AVG(j.jegy), 2) AS atlag
FROM targyak t
LEFT JOIN jelentkezesek j ON j.kod = t.kod
GROUP BY t.kod, t.nev
ORDER BY t.nev;
```

</details>

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

**1.** **Akik kimaradtak.** Melyik hallgató **nem jelentkezett egyetlen tárgyra sem**? (Név.) Oldd meg `NOT EXISTS`-szel vagy `LEFT JOIN … IS NULL`-lal!

```sql starter
SELECT nev FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
WHERE j.neptun IS NULL;          -- nincs hozzá illeszkedő jelentkezés
```

</details>

**2.** **Allekérdezés összesítéssel.** Kiknek magasabb a **saját jegyátlaga**, mint az **összes jegy átlaga**? (Név, saját átlag két tizedesre, név szerint rendezve.)

```sql starter
SELECT AVG(jegy) FROM jelentkezesek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev, ROUND(AVG(j.jegy), 2) AS atlag
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun
GROUP BY h.neptun, h.nev
HAVING AVG(j.jegy) > (SELECT AVG(jegy) FROM jelentkezesek)   -- skaláris allekérdezés
ORDER BY h.nev;
```

</details>

**3.** **CTE: a tárgyak legjobbjai.** Tárgyanként ki(k) kapták a **legjobb jegyet**? (Tárgykód, hallgató neve, jegy; kód, majd név szerint.) Első lépésként egy `WITH` blokkban számold ki tárgyanként a maximumot!

```sql starter
WITH maximumok AS (
  SELECT kod, MAX(jegy) AS legjobb
  FROM jelentkezesek
  GROUP BY kod
)
SELECT * FROM maximumok;
```

<details>
<summary>Megoldás</summary>

```sql solution
WITH maximumok AS (
  SELECT kod, MAX(jegy) AS legjobb
  FROM jelentkezesek
  GROUP BY kod
)
SELECT j.kod, h.nev, j.jegy
FROM jelentkezesek j
JOIN maximumok m ON m.kod = j.kod AND m.legjobb = j.jegy   -- csak a maximumot elérők
JOIN hallgatok h ON h.neptun = j.neptun
ORDER BY j.kod, h.nev;
```

</details>

**4.** **Módosítás és ellenőrzés.** Kovács Feri (`FGH678`) letette az Adatbázisokat **4-esre**. Írd be a jegyét, majd kérdezd le az `ADB` tárgy **átlagát** két tizedesre!

```sql starter
SELECT * FROM jelentkezesek WHERE kod = 'ADB';
```

<details>
<summary>Megoldás</summary>

```sql solution
UPDATE jelentkezesek
SET jegy = 4
WHERE neptun = 'FGH678' AND kod = 'ADB';     -- WHERE nélkül minden sor 4-es lenne!

SELECT ROUND(AVG(jegy), 2) AS atlag FROM jelentkezesek WHERE kod = 'ADB';
```

</details>

**5.** **Tömeges beszúrás lekérdezésből.** Minden **első féléves** hallgatót vegyél fel az `OPR` tárgyra (jegy nélkül) – de akit már felvettek, azt ne próbáld újra (`ON CONFLICT DO NOTHING`)! Utána add meg az `OPR` jelentkezőinek **számát**.

```sql starter
SELECT neptun FROM hallgatok WHERE felev = 1;
```

<details>
<summary>Megoldás</summary>

```sql solution
INSERT INTO jelentkezesek (neptun, kod)
SELECT neptun, 'OPR' FROM hallgatok WHERE felev = 1
ON CONFLICT DO NOTHING;                      -- ütközés (már felvett) esetén kihagyja

SELECT COUNT(*) AS letszam FROM jelentkezesek WHERE kod = 'OPR';
```

</details>

**6.** **Törlés feltétellel.** Töröld azokat a jelentkezéseket, amelyekhez **még nincs jegy** (NULL), majd kérdezd le, hány jelentkezés maradt!

```sql starter
SELECT * FROM jelentkezesek WHERE jegy IS NULL;
```

<details>
<summary>Megoldás</summary>

```sql solution
DELETE FROM jelentkezesek WHERE jegy IS NULL;

SELECT COUNT(*) AS maradt FROM jelentkezesek;
```

</details>
