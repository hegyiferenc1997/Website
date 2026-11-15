---
title: Nézetek és sorszintű biztonság
summary: Hogyan mutass meg csak bizonyos oszlopokat (nézetek mint biztonsági réteg), hogyan láttass minden felhasználóval csak a saját sorait (sorszintű biztonság, RLS), és hogyan naplózd a fontos módosításokat egy triggerrel.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- hogyan rejts el **oszlopokat** egy **nézettel** (_view_),
- hogyan korlátozd, hogy ki **melyik sorokat** láthatja (**sorszintű biztonság**, RLS),
- hogyan készíts egyszerű **naplót** a módosításokról.

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Nézet mint biztonsági réteg

A `hallgatok` táblában van születési dátum és város is – ezek személyes adatok. Egy publikus névsorhoz nincs rájuk szükség. A megoldás: egy **nézet**, amely csak a szükséges oszlopokat mutatja, és a jogot **a nézetre** adjuk, nem a táblára.

```sql run
CREATE VIEW hallgatok_nevsor AS
  SELECT neptun, nev, szak FROM hallgatok;

CREATE ROLE vendeg;
GRANT SELECT ON hallgatok_nevsor TO vendeg;    -- a nézetre igen
                                                -- a táblára nem!
SET ROLE vendeg;
SELECT * FROM hallgatok_nevsor ORDER BY neptun;
RESET ROLE;
```

A vendég látja a névsort, de ha a szerkesztőben átírod a lekérdezést `SELECT * FROM hallgatok;`-ra, **permission denied** a válasz: a születési dátumokhoz nem fér hozzá.

> Hasonlat: a nézet olyan, mint egy kirakat. A vásárló látja, ami ki van téve, de a raktárba nem mehet be.

A nézet **sorokat** is szűrhet, például csak a mérnökinformatikusokat:

```sql run
CREATE VIEW mernokinfo_hallgatok AS
  SELECT neptun, nev, felev FROM hallgatok WHERE szak = 'mérnökinformatikus';

SELECT * FROM mernokinfo_hallgatok ORDER BY neptun;
```

## Sorszintű biztonság (RLS)

Mi van, ha mindenki **ugyanazt** a táblát használja, de mindenki csak a **saját** sorait láthatja? Például egy webshopban minden vásárló csak a saját rendeléseit. Ezer nézetet nem akarunk írni – erre való a **sorszintű biztonság** (_Row-Level Security_, RLS).

Két lépés:

1. bekapcsolod a táblán: `ALTER TABLE … ENABLE ROW LEVEL SECURITY;`
2. megadsz egy vagy több **szabályt** (_policy_), amely eldönti, hogy egy sor látható-e.

Az alábbi példában a hallgatók csak a **saját jelentkezéseiket** láthatják. A szerepkör neve a Neptun-kód kisbetűvel, a szabály pedig a `current_user`-t (a bejelentkezett szerepkör nevét) hasonlítja a sor Neptun-kódjához:

```sql run
ALTER TABLE jelentkezesek ENABLE ROW LEVEL SECURITY;
CREATE POLICY sajat_jelentkezes ON jelentkezesek
  FOR SELECT
  USING (neptun = UPPER(current_user));

CREATE ROLE abc123;                            -- Kiss Anna szerepköre
GRANT SELECT ON jelentkezesek TO abc123;

SET ROLE abc123;
SELECT * FROM jelentkezesek;                   -- csak Anna sorai!
RESET ROLE;
```

Anna ugyanazt a `SELECT * FROM jelentkezesek` lekérdezést írta, mégis csak a saját soraival kapott választ. A szabályt a DBMS **minden** lekérdezéshez automatikusan hozzáteszi – nem lehet „elfelejteni” egy `WHERE` feltételt az alkalmazásban.

- `USING (…)`: melyik **meglévő** sorokat láthatja, módosíthatja, törölheti.
- `WITH CHECK (…)`: milyen **új** vagy módosított sort írhat (pl. ne szúrhasson be más nevében).
- A tábla tulajdonosa és a szuperfelhasználó alapból kikerüli a szabályokat – ezért nem szabad az alkalmazásnak szuperfelhasználóként futnia!

## Naplózás triggerrel

Ki módosította a jegyeket, és mikor? Egy **trigger** (eseményre lefutó függvény) minden módosításkor beírhat egy sort egy naplótáblába:

```sql run
CREATE TABLE jegy_naplo (
  mikor    TIMESTAMP DEFAULT now(),
  ki       TEXT DEFAULT current_user,
  neptun   CHAR(6),
  kod      VARCHAR(6),
  regi     INT,
  uj       INT
);

CREATE FUNCTION jegy_naplozas() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO jegy_naplo (neptun, kod, regi, uj)
  VALUES (OLD.neptun, OLD.kod, OLD.jegy, NEW.jegy);
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER jegy_valtozas AFTER UPDATE OF jegy ON jelentkezesek
  FOR EACH ROW EXECUTE FUNCTION jegy_naplozas();

UPDATE jelentkezesek SET jegy = 4 WHERE neptun = 'DEF456' AND kod = 'ADB';
SELECT ki, neptun, kod, regi, uj FROM jegy_naplo;
```

A naplótáblára a hétköznapi felhasználók ne kapjanak `UPDATE` és `DELETE` jogot – így a nyomok nem tüntethetők el.

## Összefoglalás

- Nézet: csak a szükséges oszlopok és sorok; a jog a nézetre szól, nem a táblára.
- RLS: `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY … USING (…)`; minden lekérdezéshez automatikusan hozzáadódik.
- Az alkalmazás ne fusson szuperfelhasználóként (az kikerülné a szabályokat).
- Trigger + naplótábla: ki, mikor, mit módosított.

## A lecke feladata

A kar honlapján egy **vendég** szerepkör (`vendeg`) jeleníti meg a hallgatók névsorát. A kiinduló kód már létrehozza a szerepkört.

1. Hozz létre egy `hallgatok_publikus` nevű **nézetet**, amely a `hallgatok` táblából **csak** a `neptun`, `nev` és `szak` oszlopot mutatja (ebben a sorrendben).
2. Adj a `vendeg` szerepkörnek **olvasási** jogot a nézetre – de a `hallgatok` táblára **ne**!

A gép ellenőrzi a nézet oszlopait és a vendég jogait.

```sql starter required
CREATE ROLE vendeg;

-- 1. a nézet

-- 2. a jog
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE ROLE vendeg;

CREATE VIEW hallgatok_publikus AS
  SELECT neptun, nev, szak FROM hallgatok;

GRANT SELECT ON hallgatok_publikus TO vendeg;
```

</details>

```sql test
SELECT (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
          FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'hallgatok_publikus') AS nezet_oszlopai,
       has_table_privilege('vendeg', to_regclass('hallgatok_publikus'), 'SELECT') AS nezetet_olvas,
       has_table_privilege('vendeg', 'hallgatok', 'SELECT') AS tablat_olvas;
```
