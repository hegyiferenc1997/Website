---
title: Mélyebben – gondolkodj SQL-ben
summary: A lekérdezés logikai végrehajtási sorrendje, a háromértékű logika (igaz, hamis, ismeretlen), feltételes értékek CASE-szel, NULL-kezelés COALESCE-szel és NULLIF-fel, szöveg- és dátumfüggvények, valamint feltételes összesítés – sok kipróbálható példával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- milyen **sorrendben** értékeli ki a DBMS egy lekérdezés részeit (és miért nem úgy, ahogy írod),
- a **háromértékű logikát**: mikor lesz egy feltétel „ismeretlen”, és mi történik ilyenkor,
- hogyan adj **feltételtől függő** értéket a `CASE` kifejezéssel,
- hogyan kezeld a hiányzó értékeket a `COALESCE` és `NULLIF` függvénnyel,
- a leghasznosabb **szöveg-** és **dátumfüggvényeket**,
- hogyan számolj **feltételesen** egyetlen lekérdezésben (`COUNT(*) FILTER`, `SUM(CASE …)`).

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. Írási sorrend kontra végrehajtási sorrend

Az SQL-t így írjuk: `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT`. A DBMS viszont **logikailag** más sorrendben dolgozza fel:

```text
  1. FROM / JOIN   – melyik táblák, hogyan összekapcsolva?
  2. WHERE         – melyik SOROK maradnak?
  3. GROUP BY      – hogyan csoportosítunk?
  4. HAVING        – melyik CSOPORTOK maradnak?
  5. SELECT        – milyen oszlopokat számolunk ki? (itt születnek az álnevek)
  6. DISTINCT      – ismétlődések kiszűrése
  7. ORDER BY      – rendezés
  8. LIMIT/OFFSET  – lapozás
```

**Analógia – ruhatisztítás:** előbb összegyűjtöd a szennyest (FROM), kiválogatod, mi mehet a gépbe (WHERE), szétválogatod színek szerint (GROUP BY), eldobod az üres kupacokat (HAVING), kimosod és összehajtod (SELECT), majd sorba rakod a szekrényben (ORDER BY), és elveszed a legfelső hármat (LIMIT).

Ebből sok „rejtélyes” hiba megérthető:

- a `WHERE`-ben **nem** használhatsz `SELECT`-ben adott álnevet (még nem létezik);
- a `WHERE`-ben **nem** lehet összesítő függvény (`COUNT`, `AVG`) – a csoportok még nem jöttek létre; ehhez van a `HAVING`;
- az `ORDER BY`-ban **már** használhatod az álnevet.

```sql run
-- Az ORDER BY már látja az álnevet (5. lépés után jön)
SELECT nev, felev * 30 AS kredit_kb
FROM hallgatok
ORDER BY kredit_kb DESC;
```

## 2. Háromértékű logika: igaz, hamis, ismeretlen

Ha egy összehasonlításban `NULL` szerepel, az eredmény se nem igaz, se nem hamis, hanem **ismeretlen** (`UNKNOWN`, SQL-ben `NULL`). A logikai műveletek így viselkednek:

| A          | B          | A AND B    | A OR B     | NOT A      |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| igaz       | ismeretlen | ismeretlen | **igaz**   | hamis      |
| hamis      | ismeretlen | **hamis**  | ismeretlen | igaz       |
| ismeretlen | ismeretlen | ismeretlen | ismeretlen | ismeretlen |

Ésszerű, ha végiggondolod: „hamis ÉS akármi” mindig hamis, tehát az ismeretlen sem számít; „igaz VAGY akármi” mindig igaz.

**A lényeg:** a `WHERE` csak azokat a sorokat tartja meg, ahol a feltétel **igaz** – az ismeretlenek kiesnek.

```sql run
-- Kovács Feri városa NULL: ő se itt, se ott nem jelenik meg!
SELECT nev, varos, 'budapesti' AS csoport FROM hallgatok WHERE varos = 'Budapest'
UNION ALL
SELECT nev, varos, 'nem budapesti' FROM hallgatok WHERE varos <> 'Budapest';
```

Számold meg: 6 hallgató van, de csak 5 sor jön vissza. A hiányzó Kovács Feri városa ismeretlen, ezért sem az `=`, sem a `<>` nem igaz rá.

### A NOT IN csapdája

```sql run
-- Kik NEM a felsorolt városokból valók? Ha a listában NULL van, SENKI!
SELECT nev FROM hallgatok
WHERE varos NOT IN ('Budapest', NULL);
```

Miért üres? `varos NOT IN ('Budapest', NULL)` azt jelenti: `varos <> 'Budapest' AND varos <> NULL`. A második tag mindig ismeretlen, így az egész sosem lehet igaz. Ez a hiba allekérdezéseknél (`NOT IN (SELECT …)`) a legalattomosabb – ott a `NOT EXISTS` a biztonságos választás.

## 3. CASE – „ha… akkor…” egy lekérdezésben

A `CASE` kifejezés olyan, mint a programozás `if–elif–else` szerkezete: az első igaz ág értékét adja.

```sql run
SELECT nev, felev,
       CASE
         WHEN felev <= 2 THEN 'kezdő'
         WHEN felev <= 4 THEN 'haladó'
         ELSE 'végzős közelében'
       END AS evfolyam
FROM hallgatok;
```

Ha egyetlen értéket hasonlítasz több lehetőséghez, van rövidebb alak is:

```sql run
SELECT kod,
       CASE kod WHEN 'ADB' THEN 'adatbázis' WHEN 'PROG' THEN 'programozás' ELSE 'egyéb' END AS terulet
FROM targyak;
```

Fontos részletek:

- az ágakat **sorban** vizsgálja, az első igaz nyer – ezért a szűkebb feltétel jöjjön előbb;
- ha nincs `ELSE`, és egyik ág sem igaz, az eredmény `NULL`;
- a `CASE` bárhol állhat, ahol érték: a `SELECT`-ben, az `ORDER BY`-ban, sőt egy összesítő függvényen belül is.

```sql run
-- Egyedi rendezés: előbb a mérnökinformatikusok, utána a többiek, azon belül név szerint
SELECT nev, szak FROM hallgatok
ORDER BY CASE WHEN szak = 'mérnökinformatikus' THEN 0 ELSE 1 END, nev;
```

## 4. NULL-kezelés: COALESCE és NULLIF

- `COALESCE(a, b, c, …)` – az **első nem NULL** értéket adja. Tipikus használat: alapérték megjelenítéshez.
- `NULLIF(a, b)` – `NULL`-t ad, ha `a = b`, különben `a`-t. Tipikus használat: nullával osztás elkerülése.

```sql run
SELECT nev,
       COALESCE(varos, 'ismeretlen') AS varos,
       COALESCE(szuletett::TEXT, 'nincs megadva') AS szuletett
FROM hallgatok;
```

```sql run
-- Nullával osztás helyett NULL: 10 / NULLIF(0, 0) = NULL, nem hiba
SELECT 10 / NULLIF(0, 0) AS biztonsagos_osztas;
```

## 5. Szövegfüggvények

| Függvény                    | Mit csinál?                      | Példa → eredmény                       |
| --------------------------- | -------------------------------- | -------------------------------------- |
| `UPPER(s)`, `LOWER(s)`      | nagy-, kisbetűsít                | `UPPER('anna')` → `ANNA`               |
| `LENGTH(s)`                 | hossz karakterben                | `LENGTH('Béla')` → 4                   |
| `TRIM(s)`                   | szóközt vág le a két végéről     | `TRIM('  x ')` → `x`                   |
| `SUBSTRING(s FROM i FOR n)` | részszöveg                       | `SUBSTRING('ABC123' FROM 4 FOR 3)` → `123` |
| `s1 \|\| s2`                | összefűzés                       | `'Kiss' \|\| ' ' \|\| 'Anna'`           |
| `SPLIT_PART(s, sep, n)`     | n-edik darab elválasztó szerint  | `SPLIT_PART('Kiss Anna', ' ', 2)` → `Anna` |
| `REPLACE(s, mit, mire)`     | csere                            | `REPLACE('a-b', '-', '/')` → `a/b`     |

```sql run
SELECT nev,
       SPLIT_PART(nev, ' ', 1) AS vezeteknev,
       SPLIT_PART(nev, ' ', 2) AS keresztnev,
       UPPER(LEFT(szak, 3)) || '-' || neptun AS azonosito
FROM hallgatok;
```

Kis- és nagybetűtől független keresés: `WHERE LOWER(nev) LIKE '%anna%'` (PostgreSQL-ben rövidebben: `nev ILIKE '%anna%'`).

## 6. Dátumfüggvények

```sql run
SELECT nev, szuletett,
       EXTRACT(YEAR FROM szuletett) AS ev,
       EXTRACT(MONTH FROM szuletett) AS honap,
       AGE(DATE '2026-01-01', szuletett) AS kor_2026_elejen,
       szuletett + INTERVAL '18 years' AS nagykoru_lett
FROM hallgatok
WHERE szuletett IS NOT NULL;
```

- `EXTRACT(rész FROM dátum)` – év, hónap, nap, a hét napja (`DOW`) stb.
- `AGE(a, b)` – két dátum különbsége években, hónapokban, napokban.
- `dátum + INTERVAL '…'` – időtartam hozzáadása.
- `CURRENT_DATE` – a mai nap (a példákban fix dátumot használunk, hogy az eredmény ne változzon).

## 7. Feltételes összesítés

Gyakori kérdés: _„Tárgyanként hány jelentkező van, és közülük hány kapott 4-est vagy 5-öst?”_ – egyetlen lekérdezésben. Két módszer:

```sql run
SELECT kod,
       COUNT(*) AS jelentkezok,
       COUNT(*) FILTER (WHERE jegy >= 4) AS jo_jegyek,          -- PostgreSQL / szabványos
       SUM(CASE WHEN jegy >= 4 THEN 1 ELSE 0 END) AS jo_jegyek_2 -- minden DBMS-ben működik
FROM jelentkezesek
GROUP BY kod
ORDER BY kod;
```

A `FILTER` szabványos és olvasható; a `SUM(CASE …)` trükk régebbi rendszerekben is működik. Ugyanígy készíthető **kereszttábla** (pivot): soronként a tárgy, oszloponként a jegyek darabszáma.

## Összefoglalás

- Logikai sorrend: **FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT**.
- A `NULL`-lal való összehasonlítás **ismeretlen**; a `WHERE` csak az igaz sorokat tartja meg. A `NOT IN` NULL-lal veszélyes.
- `CASE WHEN … THEN … ELSE … END` – feltételes érték; az első igaz ág nyer.
- `COALESCE` = első nem NULL; `NULLIF` = NULL, ha egyenlő.
- Szöveg: `UPPER`, `TRIM`, `SUBSTRING`, `||`, `SPLIT_PART`; dátum: `EXTRACT`, `AGE`, `INTERVAL`.
- Feltételes összesítés: `COUNT(*) FILTER (WHERE …)` vagy `SUM(CASE …)`.

## A lecke feladata

Készíts kimutatást a jelentkezésekről: minden sorban szerepeljen a **Neptun-kód** (`neptun`), a **tárgykód** (`kod`) és a jegy **szöveges minősítése** (`minosites`):
5 → `jeles`, 4 → `jó`, 3 → `közepes`, 2 → `elégséges`, 1 → `elégtelen`, hiányzó jegy (NULL) → `nincs jegy`.
Rendezd Neptun-kód, azon belül tárgykód szerint.

```sql starter required
SELECT neptun, kod,
       CASE
         WHEN jegy = 5 THEN 'jeles'
         -- folytasd!
       END AS minosites
FROM jelentkezesek
ORDER BY neptun, kod;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT neptun, kod,
       CASE
         WHEN jegy = 5 THEN 'jeles'
         WHEN jegy = 4 THEN 'jó'
         WHEN jegy = 3 THEN 'közepes'
         WHEN jegy = 2 THEN 'elégséges'
         WHEN jegy = 1 THEN 'elégtelen'
         ELSE 'nincs jegy'
       END AS minosites
FROM jelentkezesek
ORDER BY neptun, kod;
```

</details>
