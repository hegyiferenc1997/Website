---
title: Gráfok SQL-ben – rekurzív lekérdezések
summary: Hogyan tárolj gráfot relációs táblákban (csúcstábla és éltábla), és hogyan járd be tetszőleges mélységig a WITH RECURSIVE lekérdezéssel – egy tanterv előfeltétel-láncán kipróbálva, a böngészőben.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan tárolj **gráfot** két táblában,
- hogyan működik a **rekurzív lekérdezés** (`WITH RECURSIVE`),
- hogyan számold a **mélységet**, és hogyan kerüld el a végtelen ciklust.

## Gráf két táblában

Nem kell mindig külön gráf-adatbázis: egy relációs adatbázisban a gráf két táblával leírható:

- **csúcstábla**: maguk a dolgok (itt: a tárgyak),
- **éltábla**: a kapcsolatok, „honnan → hová” párokkal (itt: melyik tárgynak mi az előfeltétele).

A példánkban egy kitalált tanterv tárgyai és előfeltételei szerepelnek:

```text
  MAT ──► DIMAT ──┬──► ADSZ ◄── PROG2 ◄── PROG
                  │                │        │
                  └──► ADB ◄───────┼────────┘
                        │          │
                        └──► WEB ◄─┘
                              │
                              └──► SZT

  (a nyíl jelentése: „előfeltétele ennek”)
```

<details>
<summary>A tanterv létrehozása (SQL)</summary>

```sql setup
-- Csúcsok: a tárgyak.
CREATE TABLE targyak (
  kod VARCHAR(6) PRIMARY KEY,
  nev VARCHAR(40) NOT NULL
);
-- Élek: a targy felvételéhez az elofeltetel elvégzése szükséges.
CREATE TABLE elofeltetelek (
  targy       VARCHAR(6) REFERENCES targyak (kod),
  elofeltetel VARCHAR(6) REFERENCES targyak (kod),
  PRIMARY KEY (targy, elofeltetel)
);
INSERT INTO targyak VALUES
  ('MAT', 'Matematika'), ('DIMAT', 'Diszkrét matematika'),
  ('PROG', 'Programozási alapok'), ('PROG2', 'Programozás II'),
  ('ADSZ', 'Algoritmusok és adatszerkezetek'), ('ADB', 'Adatbázisok'),
  ('WEB', 'Webfejlesztés'), ('SZT', 'Szoftvertechnológia');
INSERT INTO elofeltetelek VALUES
  ('DIMAT', 'MAT'), ('PROG2', 'PROG'), ('ADSZ', 'PROG2'), ('ADSZ', 'DIMAT'),
  ('ADB', 'PROG'), ('ADB', 'DIMAT'), ('WEB', 'ADB'), ('WEB', 'PROG2'), ('SZT', 'WEB');
```

</details>

A **közvetlen** előfeltételeket egy egyszerű lekérdezés megadja:

```sql run
SELECT elofeltetel FROM elofeltetelek WHERE targy = 'WEB' ORDER BY elofeltetel;
```

De a WEB-hez az ADB kell, ahhoz a PROG és a DIMAT, ahhoz a MAT… Hány JOIN kellene? Előre nem tudjuk, milyen mély a lánc! Erre való a rekurzív lekérdezés.

## WITH RECURSIVE

A rekurzív CTE két részből áll, amelyeket `UNION` köt össze:

```sql
WITH RECURSIVE nev AS (
  -- 1. kiinduló rész (horgony): ahonnan indulunk
  SELECT …
  UNION
  -- 2. rekurzív rész: egy lépéssel továbbmegy, és hivatkozik önmagára (nev)
  SELECT … FROM … JOIN nev ON …
)
SELECT * FROM nev;
```

A DBMS így hajtja végre:

1. lefuttatja a horgonyt → ez az első „hullám”,
2. a rekurzív részt az **előző hullám** soraira futtatja → új hullám,
3. ismétli, amíg már **nem jön új sor**.

> Hasonlat: mint amikor egy tóba követ dobsz. Az első gyűrű a közvetlen szomszédok, a következő gyűrű az ő szomszédaik, és így tovább, amíg a hullámok el nem halnak.

A WEB **összes** (közvetlen és közvetett) előfeltétele, a lépések számával:

```sql run
WITH RECURSIVE elozmenyek AS (
  SELECT elofeltetel AS kod, 1 AS melyseg
  FROM elofeltetelek
  WHERE targy = 'WEB'
  UNION
  SELECT e.elofeltetel, z.melyseg + 1
  FROM elofeltetelek e
  JOIN elozmenyek z ON e.targy = z.kod
)
SELECT kod, MIN(melyseg) AS legrovidebb_ut
FROM elozmenyek
GROUP BY kod
ORDER BY legrovidebb_ut, kod;
```

Kövesd végig: az első hullám az ADB és a PROG2 (mélység 1). A második hullám az ő előfeltételeik: PROG, DIMAT (mélység 2). A harmadik a MAT (mélység 3). Utána nem jön új sor, a rekurzió leáll.

A PROG kétféle úton is elérhető (WEB → ADB → PROG és WEB → PROG2 → PROG), ezért a `MIN(melyseg)` a legrövidebb utat választja.

## Útvonal kiírása és a ciklusok

Az utat egy szövegben is összegyűjthetjük – így egyben azt is észrevesszük, ha egy csúcshoz már jártunk (ciklus):

```sql run
WITH RECURSIVE utak AS (
  SELECT elofeltetel AS kod, 'SZT → ' || elofeltetel AS ut
  FROM elofeltetelek
  WHERE targy = 'SZT'
  UNION ALL
  SELECT e.elofeltetel, u.ut || ' → ' || e.elofeltetel
  FROM elofeltetelek e
  JOIN utak u ON e.targy = u.kod
  WHERE u.ut NOT LIKE '%' || e.elofeltetel || '%'   -- ne menjünk körbe
)
SELECT ut FROM utak
WHERE kod NOT IN (SELECT targy FROM elofeltetelek)  -- csak a teljes láncok
ORDER BY ut;
```

Ha a gráfban kör lehet (pl. ismeretségeknél: Anna ismeri Bélát, Béla Annát), egy feltétel nélküli rekurzió **soha nem állna le**. Védekezés:

- `UNION` (ismétlődések nélkül) a `UNION ALL` helyett – ha ugyanaz a sor újra előjön, nem kerül be újra,
- az út nyilvántartása és szűrése, mint fent,
- egy mélységkorlát (`WHERE melyseg < 10`).

## Összefoglalás

- Gráf relációsan: csúcstábla + éltábla.
- `WITH RECURSIVE`: horgony `UNION` rekurzív rész; hullámokban halad, amíg van új sor.
- Mélység számolása: a horgonyban 1, a rekurzív részben +1.
- Ciklusok ellen: `UNION`, útvonal-ellenőrzés vagy mélységkorlát.

## A lecke feladata

Fordítsd meg az irányt! Melyik tárgyakhoz kell **közvetlenül vagy közvetve** a **Programozási alapok** (`PROG`)? Add vissza a tárgyak **kódját**, ismétlődés nélkül, **kód szerint** rendezve.

A kiinduló kód csak a közvetlen „utódokat” adja vissza – egészítsd ki rekurzióvá.

```sql starter required
SELECT targy AS kod
FROM elofeltetelek
WHERE elofeltetel = 'PROG'
ORDER BY kod;
```

<details>
<summary>Megoldás</summary>

```sql solution
WITH RECURSIVE utodok AS (
  SELECT targy AS kod
  FROM elofeltetelek
  WHERE elofeltetel = 'PROG'
  UNION
  SELECT e.targy
  FROM elofeltetelek e
  JOIN utodok u ON e.elofeltetel = u.kod
)
SELECT kod FROM utodok
ORDER BY kod;
```

</details>
