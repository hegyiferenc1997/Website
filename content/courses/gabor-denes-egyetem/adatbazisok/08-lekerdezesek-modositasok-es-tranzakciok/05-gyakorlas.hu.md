---
title: Gyakorlás – lekérdezések, módosítások, tranzakciók
summary: Ellenőrző kérdések, gyakorló feladatok összekapcsolásra, allekérdezésre és módosításra, és egy összefoglaló kimutatás-feladat.
minutes: 35
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
