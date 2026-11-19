---
title: Mélyebben – haladó lekérdezések és biztonságos módosítások
summary: A külső összekapcsolás ON kontra WHERE csapdája, az „anti-join” három alakja, „csoportonként a legjobb N” LATERAL-lal, UPDATE … FROM és DELETE … USING, UPSERT az EXCLUDED sorral, adatmódosító CTE, valamint az elveszett frissítés és megoldásai (SELECT … FOR UPDATE, optimista zárolás verziószámmal).
minutes: 45
---

## Amit ebben a leckében megtanulsz

- miért ad **más eredményt** ugyanaz a feltétel a `LEFT JOIN … ON`-ban és a `WHERE`-ben,
- hogyan keresd meg a **„párja nincs”** sorokat háromféleképpen,
- hogyan kérd le **csoportonként a legjobb N** sort,
- hogyan **módosíts vagy törölj** egy másik tábla alapján,
- hogyan működik az **UPSERT** („szúrd be, vagy ha már van, frissítsd”),
- mi az **elveszett frissítés**, és hogyan véded ki pesszimista és optimista zárolással.

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. LEFT JOIN: ON vagy WHERE? – a leggyakoribb csapda

**Feladat:** _Listázd az összes hallgatót, és mellé az ADB-jegyét, ha van._

```sql run
-- ✔ A feltétel az ON-ban: minden hallgató megmarad, a jegy NULL, ha nem vette fel
SELECT h.nev, j.jegy AS adb_jegy
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun AND j.kod = 'ADB'
ORDER BY h.nev;
```

```sql run
-- ✘ Ugyanaz a feltétel a WHERE-ben: a pár nélküli hallgatók eltűnnek!
SELECT h.nev, j.jegy AS adb_jegy
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
WHERE j.kod = 'ADB'
ORDER BY h.nev;
```

Miért? Emlékezz a végrehajtási sorrendre: előbb a `FROM … LEFT JOIN` fut (a pár nélküli sorok `NULL`-okkal megmaradnak), **utána** a `WHERE`. A `WHERE j.kod = 'ADB'` a `NULL` kódú sorokra **ismeretlen**, ezért kidobja őket – a LEFT JOIN gyakorlatilag INNER JOIN-ná válik.

**Szabály:** a LEFT JOIN **jobb oldali** táblájára vonatkozó szűrés az `ON`-ba kerüljön; a `WHERE`-be csak a **bal oldali** táblára vonatkozó szűrés.

**Analógia:** az ON azt mondja meg, **kivel párosíts** (a vendégek mind maradnak, legfeljebb pár nélkül); a WHERE azt, **ki maradhat a teremben** a párosítás után.

## 2. Az anti-join: „akinek nincs párja”

**Feladat:** _Melyik tárgyat nem vette fel senki?_ Három egyenértékű megoldás:

```sql run
-- a) NOT EXISTS – a legbiztonságosabb, NULL-ra is helyes
SELECT t.kod, t.nev FROM targyak t
WHERE NOT EXISTS (SELECT 1 FROM jelentkezesek j WHERE j.kod = t.kod);
```

```sql run
-- b) LEFT JOIN + IS NULL – „párosíts, és tartsd meg a pár nélkülieket”
SELECT t.kod, t.nev FROM targyak t
LEFT JOIN jelentkezesek j ON j.kod = t.kod
WHERE j.kod IS NULL;
```

```sql run
-- c) EXCEPT – halmazkülönbség (csak a kulcsokra)
SELECT kod FROM targyak
EXCEPT
SELECT kod FROM jelentkezesek;
```

Itt az eredmény üres lehet, ha minden tárgyra van jelentkezés – a mintában minden tárgyat felvett valaki. Próbáld ki: a Szerkesztés gombbal szúrj be előtte egy új tárgyat (`INSERT INTO targyak VALUES ('HAL', 'Hálózatok', 5, 3);`), és futtasd újra!

A `NOT IN (SELECT …)` alakot kerüld: ha az allekérdezés egyetlen `NULL`-t is ad, az eredmény **mindig üres** (lásd a háromértékű logikát a 4. témakörben).

## 3. Csoportonként a legjobb N – LATERAL

**Feladat:** _Minden hallgatónál a legjobb jegyű tárgya._ A `GROUP BY` a legjobb jegyet megadja (`MAX(jegy)`), de azt nem, hogy **melyik tárgy** volt az. A `LATERAL` allekérdezés minden külső sorra **külön lefut**, és hivatkozhat a külső sor oszlopaira – mint egy ciklus a programozásban:

```sql run
SELECT h.nev, legjobb.kod, legjobb.jegy
FROM hallgatok h
CROSS JOIN LATERAL (
  SELECT j.kod, j.jegy
  FROM jelentkezesek j
  WHERE j.neptun = h.neptun AND j.jegy IS NOT NULL   -- a külső sorra hivatkozik!
  ORDER BY j.jegy DESC, j.kod
  LIMIT 1                                             -- N = 1; írd át 2-re!
) AS legjobb
ORDER BY h.nev;
```

A `CROSS JOIN LATERAL` kihagyja azokat, akiknél az allekérdezés üres; ha őket is látni akarod, használd a `LEFT JOIN LATERAL (…) ON TRUE` alakot. (Ugyanez ablakfüggvénnyel is megoldható, lásd 18. témakör.)

## 4. Módosítás és törlés egy másik tábla alapján

Gyakran egy tábla sorait **egy másik tábla adatai alapján** kell frissíteni vagy törölni.

```sql run
-- UPDATE … FROM: minden 3. féléves tárgy jegyét (ha van) emeljük egyet, legfeljebb 5-ig
UPDATE jelentkezesek j
SET jegy = LEAST(j.jegy + 1, 5)
FROM targyak t
WHERE t.kod = j.kod AND t.felev = 3 AND j.jegy IS NOT NULL
RETURNING j.neptun, j.kod, j.jegy;
```

```sql run
-- DELETE … USING: töröljük a jegy nélküli jelentkezéseket az 1. féléves tárgyakról
DELETE FROM jelentkezesek j
USING targyak t
WHERE t.kod = j.kod AND t.felev = 1 AND j.jegy IS NULL
RETURNING j.neptun, j.kod;
```

A `RETURNING` megmutatja, pontosan **mely sorok** változtak – mindig érdemes használni, mielőtt egy módosítást élesben lefuttatsz (és előtte egy `SELECT`-tel ugyanazzal a feltétellel megnézni, mit fogsz érinteni).

### Adatmódosító CTE: archiválás egy lépésben

```sql run
-- A törölt sorokat egyetlen utasításban átmásoljuk egy archív táblába
CREATE TABLE archiv_jelentkezesek (LIKE jelentkezesek);

WITH torolt AS (
  DELETE FROM jelentkezesek WHERE jegy IS NULL
  RETURNING *
)
INSERT INTO archiv_jelentkezesek SELECT * FROM torolt;

SELECT * FROM archiv_jelentkezesek;
```

Mivel ez **egyetlen utasítás**, vagy mindkét rész megtörténik, vagy egyik sem – nem fordulhat elő, hogy a sor törlődik, de az archívumba nem kerül be.

## 5. UPSERT – beszúrás vagy frissítés

Egy raktárba szállítmány érkezik. Ha egy termék még nincs a készletben, **be kell szúrni**; ha már van, a darabszámot **növelni** kell. Az `INSERT … ON CONFLICT` ezt egy lépésben, versenyhelyzet nélkül oldja meg.

```sql run
CREATE TABLE keszlet (termek VARCHAR(20) PRIMARY KEY, db INT NOT NULL);
INSERT INTO keszlet VALUES ('egér', 10), ('monitor', 3);

INSERT INTO keszlet (termek, db) VALUES ('egér', 5), ('webkamera', 7)
ON CONFLICT (termek) DO UPDATE
SET db = keszlet.db + EXCLUDED.db;   -- EXCLUDED = a beszúrni próbált (ütköző) sor

SELECT * FROM keszlet ORDER BY termek;
```

- `ON CONFLICT (termek)` – melyik egyedi kulcs ütközésére figyelünk;
- `EXCLUDED.db` – az új, beszúrni próbált érték; `keszlet.db` – a már tárolt érték;
- `DO NOTHING` – ütközéskor egyszerűen kihagyja a sort.

Miért nem jó a „előbb SELECT, aztán INSERT vagy UPDATE” megoldás? Mert két egyidejű kérés között **versenyhelyzet** van: mindkettő azt látja, hogy nincs ilyen termék, mindkettő beszúrna, és az egyik kulcsütközéssel elhasal.

## 6. Az elveszett frissítés és két megoldása

Anna és Béla egyszerre adnak el egy-egy darabot ugyanabból a termékből (készlet: 10).

```text
idő  Anna                                Béla
 1   SELECT db → 10
 2                                       SELECT db → 10
 3   UPDATE db = 10 - 1 = 9
 4                                       UPDATE db = 10 - 1 = 9   ← Anna eladása elveszett!
```

Két darab ment el, a készlet mégis 9 – ez az **elveszett frissítés** (lost update). Megoldások:

### a) Ne olvass, számolj az adatbázisban

```sql
UPDATE keszlet SET db = db - 1 WHERE termek = 'egér';
```

Az `db = db - 1` a DBMS-en **belül** atomi: a második módosítás megvárja az elsőt, és már a 9-ből von le. Ez a legegyszerűbb és legjobb, ha megoldható.

### b) Pesszimista zárolás: SELECT … FOR UPDATE

Ha a programnak előbb látnia kell az értéket (pl. ellenőrzi, van-e elég készlet), zárold a sort olvasáskor:

```sql
BEGIN;
SELECT db FROM keszlet WHERE termek = 'egér' FOR UPDATE;  -- Béla itt várni fog
-- … a program ellenőrzi, hogy db >= 1 …
UPDATE keszlet SET db = db - 1 WHERE termek = 'egér';
COMMIT;                                                   -- Béla most folytathatja
```

**Analógia:** a mosdó ajtaján a „foglalt” tábla – aki bement, bezár, a többiek várnak.

### c) Optimista zárolás: verziószám

Webes alkalmazásokban az űrlap megnyitása és a mentés között percek telhetnek el – ennyi ideig nem zárolhatunk. Ilyenkor egy `verzio` oszlopot használunk:

```sql run
CREATE TABLE cikkek (id INT PRIMARY KEY, szoveg TEXT, verzio INT NOT NULL DEFAULT 1);
INSERT INTO cikkek VALUES (1, 'Első változat', 1);

-- Anna és Béla is az 1-es verziót nyitotta meg. Anna ment előbb:
UPDATE cikkek SET szoveg = 'Anna változata', verzio = verzio + 1
WHERE id = 1 AND verzio = 1;

-- Béla is menteni próbál, de ő még az 1-es verzióból indult: 0 sor módosul!
UPDATE cikkek SET szoveg = 'Béla változata', verzio = verzio + 1
WHERE id = 1 AND verzio = 1;

SELECT * FROM cikkek;
```

Béla mentése **0 sort** módosít – a program ebből tudja, hogy közben valaki más mentett, és szól Bélának: „A cikket időközben módosították, töltsd újra!”. Ez a módszer nem zárol, ezért jól skálázódik; akkor jó, ha az ütközés **ritka**.

| Módszer       | Mikor jó?                                        | Hátránya                                       |
| ------------- | ------------------------------------------------ | ---------------------------------------------- |
| `db = db - 1` | egyszerű számolás                                | összetett üzleti logikára nem elég             |
| `FOR UPDATE`  | rövid tranzakció, gyakori ütközés                | várakozás, holtpont veszélye                   |
| Verziószám    | hosszú „gondolkodási idő” (űrlap), ritka ütközés | ütközéskor a felhasználónak újra kell kezdenie |

## Összefoglalás

- LEFT JOIN-nál a **jobb oldali** tábla szűrése az `ON`-ba kerüljön, különben INNER JOIN lesz belőle.
- Anti-join: `NOT EXISTS` (legbiztonságosabb), `LEFT JOIN … IS NULL`, `EXCEPT`; a `NOT IN` NULL-lal veszélyes.
- **Csoportonként a legjobb N:** `CROSS JOIN LATERAL (… ORDER BY … LIMIT N)`.
- `UPDATE … FROM`, `DELETE … USING`, `RETURNING`; adatmódosító CTE egyetlen atomi lépésben.
- **UPSERT:** `INSERT … ON CONFLICT (kulcs) DO UPDATE SET … EXCLUDED.oszlop`.
- **Elveszett frissítés** ellen: számolás az adatbázisban, `SELECT … FOR UPDATE` vagy verziószám.

## A lecke feladata

A raktárba új szállítmány érkezik. A kiinduló kód létrehozza a `keszlet` táblát (a `termek` az elsődleges kulcs), benne 3 termékkel. Írd át a beszúrást **UPSERT**-re: ha a termék már szerepel, a darabszámhoz **adja hozzá** a beérkezett mennyiséget; ha még nincs, szúrja be új sorként!

```sql starter required
CREATE TABLE keszlet (termek VARCHAR(20) PRIMARY KEY, db INT NOT NULL);
INSERT INTO keszlet VALUES ('egér', 10), ('monitor', 3), ('kábel', 25);

-- A szállítmány: egér 5, kábel 10, webkamera 4 (ez még új)
INSERT INTO keszlet (termek, db) VALUES ('egér', 5), ('kábel', 10), ('webkamera', 4);

SELECT * FROM keszlet ORDER BY termek;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE keszlet (termek VARCHAR(20) PRIMARY KEY, db INT NOT NULL);
INSERT INTO keszlet VALUES ('egér', 10), ('monitor', 3), ('kábel', 25);

INSERT INTO keszlet (termek, db) VALUES ('egér', 5), ('kábel', 10), ('webkamera', 4)
ON CONFLICT (termek) DO UPDATE
SET db = keszlet.db + EXCLUDED.db;

SELECT * FROM keszlet ORDER BY termek;
```

</details>
