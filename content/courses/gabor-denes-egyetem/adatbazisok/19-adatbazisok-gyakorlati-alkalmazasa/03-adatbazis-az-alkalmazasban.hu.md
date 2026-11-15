---
title: Az adatbázis egy valódi alkalmazásban
summary: Mi történik, amikor egy webes alkalmazás az adatbázist használja: kapcsolatkészlet, paraméteres lekérdezések, tranzakció a rendelés leadásakor, az elveszett frissítés problémája, és két védekezés ellene: a pesszimista zárolás (FOR UPDATE) és az optimista zárolás verziószámmal.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan **beszélget** egy alkalmazás az adatbázissal,
- miért kell a rendelés leadását **egy tranzakcióba** tenni,
- mi az **elveszett frissítés**, és hogyan véd ellene a **pesszimista** és az **optimista zárolás**.

## 1. Az út a kattintástól az adatbázisig

Amikor a vásárló a webshopban a „Megrendelem” gombra kattint:

```text
  böngésző ──HTTP──▶ alkalmazásszerver ──SQL──▶ adatbázis
                     (pl. Node.js, Python)       (PostgreSQL)
                     │
                     ├ ellenőrzi, ki a felhasználó és mit kér
                     ├ kér egy kapcsolatot a kapcsolatkészletből
                     ├ lefuttatja a tranzakciót
                     └ visszaadja a kapcsolatot, választ küld
```

- **Kapcsolatkészlet (connection pool):** egy adatbázis-kapcsolat felépítése drága (hálózat, hitelesítés, memória a szerveren). Ezért az alkalmazás néhány kapcsolatot nyitva tart, és a kérések ezeket kölcsönzik ki – mint a könyvtári könyveket.
- **Paraméteres lekérdezés:** a felhasználótól jövő adat soha nem kerül bele szövegként az SQL-be, hanem külön paraméterként megy (15. témakör, SQL-befecskendezés).
- **ORM:** sok alkalmazás nem kézzel írja az SQL-t, hanem egy könyvtár generálja (17. témakör). A háttérben ugyanaz történik – érdemes tudni, milyen SQL keletkezik.

## 2. A rendelés leadása: egy tranzakció

Egy rendelés több lépés: a készlet csökkentése és a rendelés rögzítése. Ha a kettő közül csak az egyik sikerül (a szerver épp ott áll le), hibás lesz az adat: vagy eltűnt egy termék a raktárból rendelés nélkül, vagy van rendelés, amit nem fedez készlet. Ezért a lépések **egy tranzakcióba** kerülnek (8. témakör): **vagy mind megtörténik, vagy egyik sem**.

<details>
<summary>A mini raktár létrehozása (SQL)</summary>

```sql setup
-- Egy kis raktár: termékek készlettel és verziószámmal, valamint a rendelések.
CREATE TABLE termekek (
  termek_id INT PRIMARY KEY,
  nev       VARCHAR(40) NOT NULL,
  keszlet   INT NOT NULL CHECK (keszlet >= 0),
  verzio    INT NOT NULL
);
CREATE TABLE rendelesek (
  rendeles_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  termek_id   INT NOT NULL REFERENCES termekek (termek_id),
  db          INT NOT NULL CHECK (db > 0)
);
INSERT INTO termekek VALUES
  (1, 'Egér', 10, 1),
  (2, 'Billentyűzet', 5, 3),
  (3, 'Monitor', 2, 7),
  (4, 'Webkamera', 0, 2);
```

</details>

```sql run
BEGIN;
UPDATE termekek SET keszlet = keszlet - 3 WHERE termek_id = 1;
INSERT INTO rendelesek (termek_id, db) VALUES (1, 3);
COMMIT;

SELECT * FROM termekek WHERE termek_id = 1;
```

Figyeld meg a `CHECK (keszlet >= 0)` megszorítást: ha valaki több webkamerát próbálna rendelni, mint amennyi van, az adatbázis visszautasítja – ez az **utolsó védővonal**, akkor is, ha az alkalmazásban hiba van.

## 3. Az elveszett frissítés

Az alkalmazások gyakran így dolgoznak: **beolvassák** az adatot, a programban **kiszámolják** az új értéket, majd **visszaírják**. Két egyszerre futó kérésnél ez veszélyes:

| Idő | Anna kérése            | Béla kérése            | Készlet az adatbázisban |
| --- | ---------------------- | ---------------------- | ----------------------- |
| 1   | beolvassa: készlet = 2 |                        | 2                       |
| 2   |                        | beolvassa: készlet = 2 | 2                       |
| 3   | kiír: 2 − 1 = **1**    |                        | 1                       |
| 4   |                        | kiír: 2 − 1 = **1**    | 1 (!)                   |

Két monitort adtunk el, a készlet mégis csak eggyel csökkent: **Anna frissítése elveszett**. Három megoldás van:

**a) Atomi frissítés.** Ne a programban számolj, hanem az adatbázisban, egyetlen utasítással, feltétellel:

```text
UPDATE termekek SET keszlet = keszlet - 1
WHERE termek_id = 3 AND keszlet >= 1;
```

Az adatbázis a sort a módosítás idejére zárolja, így a két kérés egymás után fut. Ha az érintett sorok száma 0, elfogyott a termék. A legtöbb esetben ez a legjobb.

**b) Pesszimista zárolás: `SELECT … FOR UPDATE`.** Ha a programban kell valamit számolni a beolvasott adatból, a beolvasáskor zárold a sort: a másik kérés **megvárja**, amíg te végzel.

```sql run
BEGIN;
SELECT keszlet FROM termekek WHERE termek_id = 3 FOR UPDATE;  -- a sor zárolva a tranzakció végéig
UPDATE termekek SET keszlet = keszlet - 1 WHERE termek_id = 3;
COMMIT;                                                         -- a zár itt oldódik

SELECT * FROM termekek WHERE termek_id = 3;
```

„Pesszimista”, mert eleve számít az ütközésre. Hátránya: amíg a zár él, mások várnak – soha ne tarts zárat, amíg a felhasználó gondolkodik!

**c) Optimista zárolás verziószámmal.** Minden sorhoz tartozik egy `verzio` szám. Beolvasáskor megjegyzed, és visszaíráskor csak akkor írsz, **ha még mindig ugyanaz** – közben a verziót eggyel növeled:

```text
UPDATE termekek SET keszlet = keszlet - 1, verzio = verzio + 1
WHERE termek_id = 3 AND verzio = 7;      -- 7 volt, amikor beolvastam
```

Ha közben más módosított, a verzió már 8, a feltétel nem teljesül, **0 sor** változik – az alkalmazás ebből tudja, hogy újra kell olvasnia, és szól a felhasználónak („Közben változott az adat”). „Optimista”, mert nem zárol előre, csak a végén ellenőriz. Jó választás, ha ritka az ütközés, és a beolvasás és a mentés között hosszú idő telhet el (például egy szerkesztőűrlapnál).

## 4. Csak akkor rögzíts, ha sikerült: módosító CTE

A rendelést csak akkor szabad rögzíteni, ha a készlet levonása **tényleg megtörtént**. A PostgreSQL-ben ezt egyetlen utasításban is megírhatod: az `UPDATE … RETURNING` visszaadja a módosított sorokat, és a `WITH` blokk után az `INSERT` csak ezekből szúr be:

```sql run
WITH levonas AS (
  UPDATE termekek SET keszlet = keszlet - 1
  WHERE termek_id = 4 AND keszlet >= 1     -- a webkamerából nincs készlet
  RETURNING termek_id
)
INSERT INTO rendelesek (termek_id, db)
SELECT termek_id, 1 FROM levonas;          -- így 0 sor kerül be

SELECT COUNT(*) AS webkamera_rendelesek FROM rendelesek WHERE termek_id = 4;
```

## A lecke feladata

Három vásárló szinte egyszerre ad le rendelést. Az alkalmazás mindegyiknél korábban beolvasta a termék verzióját:

| Termék           | Kért darab | Beolvasott verzió |
| ---------------- | ---------- | ----------------- |
| 2 – Billentyűzet | 2          | 3                 |
| 3 – Monitor      | 1          | 6                 |
| 4 – Webkamera    | 1          | 2                 |

Írd meg a három rendelést **egy tranzakcióban**, **optimista zárolással**: mindegyiknél csak akkor vond le a készletet (és növeld a verziót), ha a verzió még a beolvasott, és van elég készlet – és **csak akkor** rögzítsd a rendelést, ha a levonás sikerült (módosító CTE).

A kiinduló kód a „naiv” változat: nem nézi sem a verziót, sem a készletet. Ha lefuttatod, a webkameránál hibát kapsz – a `CHECK` megfogja. A jó megoldás után a gép megnézi a készletet, a verziókat és a rendelések számát termékenként.

```sql starter required
BEGIN;
UPDATE termekek SET keszlet = keszlet - 2 WHERE termek_id = 2;
INSERT INTO rendelesek (termek_id, db) VALUES (2, 2);

UPDATE termekek SET keszlet = keszlet - 1 WHERE termek_id = 3;
INSERT INTO rendelesek (termek_id, db) VALUES (3, 1);

UPDATE termekek SET keszlet = keszlet - 1 WHERE termek_id = 4;
INSERT INTO rendelesek (termek_id, db) VALUES (4, 1);
COMMIT;
```

<details>
<summary>Megoldás</summary>

```sql solution
BEGIN;
WITH levonas AS (
  UPDATE termekek SET keszlet = keszlet - 2, verzio = verzio + 1
  WHERE termek_id = 2 AND verzio = 3 AND keszlet >= 2
  RETURNING termek_id
)
INSERT INTO rendelesek (termek_id, db) SELECT termek_id, 2 FROM levonas;

WITH levonas AS (
  UPDATE termekek SET keszlet = keszlet - 1, verzio = verzio + 1
  WHERE termek_id = 3 AND verzio = 6 AND keszlet >= 1
  RETURNING termek_id
)
INSERT INTO rendelesek (termek_id, db) SELECT termek_id, 1 FROM levonas;

WITH levonas AS (
  UPDATE termekek SET keszlet = keszlet - 1, verzio = verzio + 1
  WHERE termek_id = 4 AND verzio = 2 AND keszlet >= 1
  RETURNING termek_id
)
INSERT INTO rendelesek (termek_id, db) SELECT termek_id, 1 FROM levonas;
COMMIT;
```

Az eredmény: a billentyűzet rendelése sikerült (készlet 5 → 3, verzió 3 → 4). A monitornál a verzió közben 7-re nőtt – valaki más módosította, ezért nem írtunk felül semmit; az alkalmazás újraolvasna. A webkamerából nincs készlet, így nincs rendelés sem – hiba nélkül.

</details>

```sql test
SELECT t.termek_id, t.keszlet, t.verzio, COUNT(r.rendeles_id) AS rendelesek
FROM termekek t
LEFT JOIN rendelesek r ON r.termek_id = t.termek_id
GROUP BY t.termek_id
ORDER BY t.termek_id;
```
