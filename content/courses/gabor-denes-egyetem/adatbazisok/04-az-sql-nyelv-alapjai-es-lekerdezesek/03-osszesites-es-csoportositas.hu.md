---
title: Összesítés és csoportosítás
summary: Az összesítő függvények (COUNT, SUM, AVG, MIN, MAX) és a NULL kezelése, csoportosítás GROUP BY-jal, csoportok szűrése HAVING-gel, valamint a lekérdezés logikai végrehajtási sorrendje.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan **számolsz** sok sorból egyetlen értéket (darabszám, összeg, átlag),
- hogyan készítesz **csoportonkénti** kimutatást (`GROUP BY`),
- mi a különbség a `WHERE` és a `HAVING` között,
- milyen **sorrendben** hajtja végre a DBMS a lekérdezés részeit.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Összesítő függvények

| Függvény        | Jelentés                                 |
| --------------- | ---------------------------------------- |
| `COUNT(*)`      | hány sor van                             |
| `COUNT(oszlop)` | hány **nem NULL** érték van az oszlopban |
| `SUM(oszlop)`   | összeg                                   |
| `AVG(oszlop)`   | átlag                                    |
| `MIN`, `MAX`    | legkisebb, legnagyobb érték              |

```sql run
SELECT COUNT(*) AS jelentkezesek, COUNT(jegy) AS jeggyel, ROUND(AVG(jegy), 2) AS atlag, MIN(jegy), MAX(jegy)
FROM jelentkezesek;
```

Látod a különbséget? 12 jelentkezés van, de csak 10-nél van jegy: a `COUNT(jegy)`, az `AVG` és a többi függvény **kihagyja a NULL-okat**. Az átlag tehát a 10 meglévő jegy átlaga, nem 12-vel osztunk.

## Csoportosítás: GROUP BY

Képzeld el, hogy a jelentkezési lapokat **kupacokba** rakod tárgyanként, aztán minden kupacot külön megszámolsz. Pontosan ezt csinálja a `GROUP BY`:

```text
 jelentkezesek                    GROUP BY kod
 ABC123 ADB 5      ┐
 CDE345 ADB 4      │  ADB  → COUNT = 4, AVG = 4.00
 DEF456 ADB 3      │
 FGH678 ADB NULL   ┘
 ABC123 DIG 4      ┐  DIG  → COUNT = 2, AVG = 4.50
 DEF456 DIG 5      ┘
 …
```

```sql run
SELECT kod, COUNT(*) AS letszam, ROUND(AVG(jegy), 2) AS atlag
FROM jelentkezesek
GROUP BY kod
ORDER BY kod;
```

**Az aranyszabály:** ha van `GROUP BY`, a `SELECT`-ben csak két dolog állhat:

1. olyan oszlop, amely szerint **csoportosítasz** (itt `kod`),
2. **összesítő függvény** (itt `COUNT`, `AVG`).

Miért? Mert egy csoportból egyetlen sor lesz. Ha a `neptun`-t is kérnéd, melyik hallgatóét írná ki a négy közül? A PostgreSQL ezért hibát ad – próbáld ki!

## Csoportok szűrése: HAVING

A `WHERE` a **sorokat** szűri csoportosítás **előtt**, a `HAVING` a **csoportokat** csoportosítás **után**. Összesítő függvényre ezért csak a `HAVING`-ben szűrhetsz.

```sql run
-- Azok a tárgyak, amelyekre legalább 3-an jelentkeztek
SELECT kod, COUNT(*) AS letszam
FROM jelentkezesek
GROUP BY kod
HAVING COUNT(*) >= 3;
```

```sql run
-- Csak a jeggyel rendelkező jelentkezéseket számolva, tárgyanként a legjobb jegy
SELECT kod, MAX(jegy) AS legjobb
FROM jelentkezesek
WHERE jegy IS NOT NULL
GROUP BY kod
ORDER BY legjobb DESC, kod;
```

## A végrehajtás logikai sorrendje

Az SQL-t ugyan `SELECT`-tel kezdjük írni, de a DBMS (logikailag) ebben a sorrendben dolgozza fel:

```text
 1. FROM       – honnan (melyik tábla, összekapcsolások)
 2. WHERE      – sorok szűrése
 3. GROUP BY   – kupacokba rendezés
 4. HAVING     – kupacok szűrése
 5. SELECT     – mit írunk ki (itt születnek az álnevek!)
 6. ORDER BY   – rendezés
 7. LIMIT      – az első néhány sor
```

Ebből sok minden következik: a `WHERE`-ben **nem** használhatod a `SELECT`-ben adott álnevet (még nem létezik), az `ORDER BY`-ban viszont igen.

## Összefoglalás

- `COUNT(*)` minden sort számol, a többi függvény kihagyja a NULL-t.
- `GROUP BY` kupacokat képez; a `SELECT`-ben csak csoportosító oszlop és összesítő függvény állhat.
- `WHERE` sorokat szűr csoportosítás előtt, `HAVING` csoportokat utána.
- Sorrend: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.

## A lecke feladata

Készíts kimutatást a jelentkezésekről **tárgykódonként**: a `kod`, a jelentkezések **száma** (`letszam`) és a jegyek **átlaga két tizedesre kerekítve** (`atlag`). Csak azok a tárgyak kellenek, amelyekre **legalább 2** jelentkezés van. Rendezd létszám szerint **csökkenően**, egyenlőségnél kód szerint!

```sql starter required
SELECT kod, COUNT(*) AS letszam
FROM jelentkezesek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod, COUNT(*) AS letszam, ROUND(AVG(jegy), 2) AS atlag
FROM jelentkezesek
GROUP BY kod
HAVING COUNT(*) >= 2
ORDER BY letszam DESC, kod;
```

</details>
