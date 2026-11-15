---
title: Egy rendszer megtervezése a nulláról
summary: A teljes tervezési folyamat egy példán: követelmények összegyűjtése, egyedek és kapcsolatok (E-R modell), táblák és kulcsok, normalizálás, megszorítások, indexek és jogosultságok – egy könyvtári kölcsönző rendszer tábláit SQL-ben elkészítve.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan haladj végig a **teljes tervezési folyamaton** egy valódi feladaton,
- hogyan lesznek a **követelményekből** táblák, kulcsok és megszorítások,
- hogyan **ellenőrizd**, hogy a séma tényleg betartatja a szabályokat.

Ez a lecke összefoglaló: minden lépésnél megmutatjuk, melyik témakörben tanultad részletesen.

## A feladat: egy könyvtári kölcsönző rendszer

A kar könyvtára papíron vezeti a kölcsönzéseket, és egy egyszerű rendszert szeretne. A könyvtárossal beszélgetve ezeket a **követelményeket** gyűjtöttük össze:

1. A könyveket az **ISBN** szám azonosítja; van **címük** (kötelező) és **kiadási évük**.
2. A **tagoknak** van nevük (kötelező) és **e-mail-címük** (kötelező, és két tagnak nem lehet ugyanaz).
3. Egy tag **kikölcsönözhet** egy könyvet; feljegyezzük, **mikor adtuk ki** (alapból a mai nap) és **mikor hozta vissza** (amíg nála van, ez üres).
4. A visszahozás dátuma **nem lehet korábbi** a kiadásnál.
5. Nem lehet kölcsönzést rögzíteni **nem létező** könyvre vagy tagra.

## 1. Egyedek és kapcsolatok (5. témakör)

A követelményekből kiemeljük a **főneveket** (egyedjelöltek) és az **igéket** (kapcsolatok):

- egyedek: **Könyv**, **Tag**,
- kapcsolat: a Tag **kikölcsönzi** a Könyvet – ennek saját tulajdonságai vannak (kiadva, visszahozva), és egy tag sok könyvet, egy könyvet idővel sok tag kölcsönözhet → **N:M kapcsolat**, amelyből **kapcsolótábla** lesz: **Kölcsönzés**.

```text
  [Könyv] 1 ──────── N [Kölcsönzés] N ──────── 1 [Tag]
  isbn, cím, év          kiadva, visszahozva         tag_id, név, e-mail
```

## 2. Táblák és kulcsok (3. és 5. témakör)

| Tábla          | Elsődleges kulcs                        | Idegen kulcsok                         |
| -------------- | --------------------------------------- | -------------------------------------- |
| `konyvek`      | `isbn` (természetes kulcs)              | –                                      |
| `tagok`        | `tag_id` (mesterséges kulcs)            | –                                      |
| `kolcsonzesek` | `kolcsonzes_id` (automatikus azonosító) | `isbn` → `konyvek`, `tag_id` → `tagok` |

Miért kell külön `kolcsonzes_id`? Mert ugyanaz a tag ugyanazt a könyvet **többször** is kikölcsönözheti, így az (isbn, tag_id) pár nem egyedi.

## 3. Normalizálás (6. témakör)

Ellenőrizzük: minden nem kulcs oszlop **a kulcstól, az egész kulcstól és csakis a kulcstól** függ? A könyv címe a könyvtől (az ISBN-től), a tag e-mail-címe a tagtól, a kiadás dátuma a kölcsönzéstől. Nem tároljuk a könyv címét a kölcsönzésben (az ismétlődés lenne, és módosítási anomáliát okozna). A séma **3NF**-ben van.

## 4. Típusok és megszorítások (2. és 6. témakör)

Minden követelményből egy **megszorítás** lesz – így a szabályokat az adatbázis betartatja, akármelyik program ír bele:

| Követelmény                               | Megszorítás                                            |
| ----------------------------------------- | ------------------------------------------------------ |
| a cím és a név kötelező                   | `NOT NULL`                                             |
| az e-mail kötelező és egyedi              | `NOT NULL UNIQUE`                                      |
| a kiadás alapból a mai nap                | `DEFAULT CURRENT_DATE`                                 |
| visszahozás nem lehet a kiadás előtt      | `CHECK (visszahozva IS NULL OR visszahozva >= kiadva)` |
| nem létező könyvre/tagra nincs kölcsönzés | `REFERENCES` (idegen kulcs)                            |

## 5. Indexek és jogosultságok (7. és 10. témakör)

- Az elsődleges kulcsokra és az egyedi oszlopokra automatikusan van index.
- A gyakori kérdésekhez: „mi van most kint ennél a tagnál?” → index a `kolcsonzesek (tag_id)`-re; „ki tartja még a könyvet?” → index a `kolcsonzesek (isbn)`-re, akár részleges index `WHERE visszahozva IS NULL`.
- A könyvtári program egy saját szerepkörrel csatlakozik, csak a három táblára kap `SELECT`, `INSERT`, `UPDATE` jogot – törlésre nem.

Ezzel a terv kész. Most te írod meg!

## A lecke feladata

<details>
<summary>Üres adatbázis</summary>

Ehhez a feladathoz nem kell mintaadatbázis – a táblákat te hozod létre.

</details>

A kiinduló kód már tartalmazza a `konyvek` táblát. Készítsd el a másik kettőt a fenti terv szerint:

**`tagok`**:

- `tag_id`: egész szám, elsődleges kulcs,
- `nev`: legfeljebb 60 karakteres szöveg, kötelező,
- `email`: legfeljebb 120 karakteres szöveg, kötelező és egyedi.

**`kolcsonzesek`**:

- `kolcsonzes_id`: automatikus azonosító (`INT GENERATED ALWAYS AS IDENTITY`), elsődleges kulcs,
- `isbn`: hivatkozás a `konyvek` táblára, kötelező,
- `tag_id`: hivatkozás a `tagok` táblára, kötelező,
- `kiadva`: dátum, kötelező, alapértéke a mai nap,
- `visszahozva`: dátum, nem kötelező, de ha ki van töltve, nem lehet korábbi a kiadásnál.

A gép kipróbál néhány jó és rossz beszúrást, és megnézi, melyiket fogadja el a séma.

```sql starter required
CREATE TABLE konyvek (
  isbn  VARCHAR(17) PRIMARY KEY,
  cim   VARCHAR(200) NOT NULL,
  ev    INT
);

CREATE TABLE tagok (

);

CREATE TABLE kolcsonzesek (

);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE konyvek (
  isbn  VARCHAR(17) PRIMARY KEY,
  cim   VARCHAR(200) NOT NULL,
  ev    INT
);

CREATE TABLE tagok (
  tag_id INT PRIMARY KEY,
  nev    VARCHAR(60) NOT NULL,
  email  VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE kolcsonzesek (
  kolcsonzes_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isbn          VARCHAR(17) NOT NULL REFERENCES konyvek (isbn),
  tag_id        INT NOT NULL REFERENCES tagok (tag_id),
  kiadva        DATE NOT NULL DEFAULT CURRENT_DATE,
  visszahozva   DATE,
  CHECK (visszahozva IS NULL OR visszahozva >= kiadva)
);
```

</details>

```sql test
-- Segédfüggvény: lefuttat egy utasítást, és megmondja, sikerült-e.
CREATE FUNCTION probal(parancs TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE parancs;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, teszt TEXT, eredmeny TEXT);
INSERT INTO konyvek VALUES ('978-963-00-0000-1', 'Adatbázisok kezdőknek', 2026);
INSERT INTO eredmeny VALUES
  (1, 'jó tag',              probal($q$INSERT INTO tagok VALUES (1, 'Kiss Anna', 'anna@pelda.hu')$q$)),
  (2, 'ismétlődő e-mail',    probal($q$INSERT INTO tagok VALUES (2, 'Másik Anna', 'anna@pelda.hu')$q$)),
  (3, 'név nélküli tag',     probal($q$INSERT INTO tagok (tag_id, email) VALUES (3, 'x@pelda.hu')$q$)),
  (4, 'jó kölcsönzés',       probal($q$INSERT INTO kolcsonzesek (isbn, tag_id) VALUES ('978-963-00-0000-1', 1)$q$)),
  (5, 'nem létező könyv',    probal($q$INSERT INTO kolcsonzesek (isbn, tag_id) VALUES ('000', 1)$q$)),
  (6, 'nem létező tag',      probal($q$INSERT INTO kolcsonzesek (isbn, tag_id) VALUES ('978-963-00-0000-1', 99)$q$)),
  (7, 'korábbi visszahozás', probal($q$INSERT INTO kolcsonzesek (isbn, tag_id, kiadva, visszahozva)
                                       VALUES ('978-963-00-0000-1', 1, '2026-05-10', '2026-05-01')$q$)),
  (8, 'jó visszahozás',      probal($q$INSERT INTO kolcsonzesek (isbn, tag_id, kiadva, visszahozva)
                                       VALUES ('978-963-00-0000-1', 1, '2026-05-01', '2026-05-10')$q$));

SELECT teszt, eredmeny FROM eredmeny
UNION ALL
SELECT 'kiadás alapértéke a mai nap', (MIN(kiadva) = CURRENT_DATE)::TEXT
FROM kolcsonzesek WHERE visszahozva IS NULL;
```
