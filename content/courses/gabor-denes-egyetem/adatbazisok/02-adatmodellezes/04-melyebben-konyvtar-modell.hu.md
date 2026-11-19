---
title: Mélyebben – modellezzünk együtt egy könyvtárat
summary: Egy teljes adatmodell a szöveges leírástól a táblákig, lépésről lépésre; a „könyv” és a „példány” különbsége; több lehetséges modell összevetése; a típusválasztás klasszikus csapdái (pénz lebegőpontosan, dátum szövegként, telefonszám számként) – kipróbálható példákkal.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan jutsz el egy **hétköznapi leírásból** egy kész adatmodellig, lépésről lépésre,
- miért kell különbséget tenni a **„dolog fajtája”** és a **„konkrét darab”** között (könyv kontra példány),
- hogy egy feladatra **több jó modell** is létezik, és hogyan döntesz közöttük,
- melyek a **típusválasztás** leggyakoribb hibái – és ezeket ki is próbálod.

## A megrendelő leírása

Egy kisvárosi könyvtár ezt írja nekünk:

> _„Szeretnénk nyilvántartani a könyveinket. Egy könyvnek van címe, szerzője (néha több is), kiadási éve és ISBN-száma. A népszerű könyvekből több példányunk is van. Az olvasóink beiratkoznak (név, lakcím, telefonszám), és kölcsönözhetnek. Tudni akarjuk, ki, mikor, melyik példányt vitte el, és mikor hozta vissza. Késésért napi 50 Ft-ot számolunk fel.”_

### 1. lépés – főnévvadászat

Húzzuk alá a főneveket: _könyv, cím, szerző, kiadási év, ISBN, példány, olvasó, név, lakcím, telefonszám, kölcsönzés, dátum, késés, díj_.

Most válogassunk: melyik **önálló dolog** (egyed), és melyik csak egy dolog **tulajdonsága**?

| Főnév          | Egyed vagy tulajdonság?        | Miért?                                                |
| -------------- | ------------------------------ | ----------------------------------------------------- |
| könyv          | **egyed**                      | sok tulajdonsága van, sok más dolog kapcsolódik hozzá |
| cím, ISBN, év  | a könyv tulajdonságai          | önmagukban nem érdekesek                              |
| szerző         | **egyed** (!)                  | egy könyvnek több szerzője lehet, egy szerzőnek több könyve |
| példány        | **egyed**                      | külön kölcsönözhető, saját állapota van               |
| olvasó         | **egyed**                      | sok tulajdonság, sok kölcsönzés                       |
| kölcsönzés     | **egyed** (esemény)            | saját adatai vannak: mikor vitte el, mikor hozta vissza |
| késési díj     | **számolt érték**              | a dátumokból kiszámolható, nem kell tárolni           |

Figyeld meg az utolsó sort: a **kiszámolható** adatot általában nem tároljuk, mert ha a dátum változik, a tárolt díj elavulna (ellentmondás!).

### 2. lépés – a „könyv” és a „példány” csapdája

A leggyakoribb kezdő hiba, hogy a könyvet és a példányt egy táblába teszik:

```text
konyvek_ROSSZ
| id | cim             | szerzo        | isbn          | kolcsonozve |
|----|-----------------|---------------|---------------|-------------|
| 1  | A Pál utcai fiúk| Molnár Ferenc | 9789631193… | igen        |
| 2  | A Pál utcai fiúk| Molnár Ferenc | 9789631193… | nem         |
| 3  | A Pál utcai fiúk| Molnár Ferenc | 9789631193… | igen        |
```

A cím, a szerző és az ISBN háromszor szerepel. Ha elírást javítunk, háromszor kell. Ehelyett:

- **könyv** = a mű egy kiadása (cím, ISBN, év) – a „fajta”;
- **példány** = egy fizikai darab a polcon (leltári szám, állapot) – a „konkrét darab”.

**Analógia:** a „Toyota Corolla 2024” egy **típus**, a rendszámos autó a parkolóban egy **példány**. Az autókölcsönző a példányt adja ki, nem a típust. Ugyanígy a mozijegy egy **előadásra** szól, nem a filmre.

Ez a minta mindenhol előjön: termék ↔ raktári tétel, tárgy ↔ kurzus (egy adott félévben), járat ↔ konkrét repülés egy napon.

### 3. lépés – kapcsolatok

- egy **könyvnek** több **példánya** van, egy példány pontosan egy könyvhöz tartozik → **1:N**;
- egy **könyvnek** több **szerzője**, egy **szerzőnek** több könyve → **N:M** (kapcsolótábla kell: `konyv_szerzo`);
- egy **olvasó** több **kölcsönzést** indít, egy kölcsönzés egy olvasóé → **1:N**;
- egy **példányt** sokszor kölcsönöznek ki (különböző időpontokban) → **1:N** a példány és a kölcsönzés között.

```text
  SZERZO ──N:M── KONYV ──1:N── PELDANY ──1:N── KOLCSONZES ──N:1── OLVASO
          (konyv_szerzo)
```

### 4. lépés – logikai séma

```text
szerzok      (szerzo_id PK, nev)
konyvek      (isbn PK, cim, kiadas_eve)
konyv_szerzo (isbn FK, szerzo_id FK, PK(isbn, szerzo_id))
peldanyok    (leltari_szam PK, isbn FK, beszerzes_datuma, allapot)
olvasok      (olvaso_id PK, nev, lakcim, telefon)
kolcsonzesek (kolcsonzes_id PK, leltari_szam FK, olvaso_id FK,
              kivitte, hatarido, visszahozta NULL-lehet)
```

A `visszahozta` lehet `NULL`: ez jelenti, hogy a könyv **még kint van**. Itt a NULL tényleg „még nem ismert” jelentésű – jól használjuk.

### 5. lépés – ellenőrzés kérdésekkel

Egy jó modellt úgy tesztelsz, hogy a megrendelő kérdéseit „lefuttatod” rajta fejben:

- _„Hány példány van kint most a Pál utcai fiúkból?”_ → konyvek → peldanyok → kolcsonzesek, ahol `visszahozta IS NULL`. ✔
- _„Kinek van késése?”_ → kolcsonzesek, ahol `visszahozta IS NULL AND hatarido < ma`. ✔
- _„Molnár Ferenc mely könyvei vannak meg?”_ → szerzok → konyv_szerzo → konyvek. ✔

Ha egy kérdésre nem tudsz válaszolni, hiányzik valami a modellből.

## Több jó modell is létezik

Ugyanarra a leírásra több helyes modell is adható. Néhány döntés, amelyben jogos a vita:

| Kérdés                                      | A változat                            | B változat                              | Mikor melyik?                                      |
| ------------------------------------------- | ------------------------------------- | --------------------------------------- | -------------------------------------------------- |
| Szerző: külön tábla vagy szöveg?            | `szerzok` tábla + kapcsolótábla       | `szerzo` szöveges mező a könyvben       | ha keresni, szűrni kell szerzőre → A; ha csak kiírni → B elég |
| Kulcs: természetes vagy mesterséges?        | `isbn` a kulcs                        | `konyv_id SERIAL`, az ISBN csak egyedi  | régi könyveknek nincs ISBN-je → B biztonságosabb   |
| Lakcím: egy mező vagy több?                 | `lakcim TEXT`                         | `irsz`, `varos`, `utca`, `hazszam`      | ha városra statisztika kell → B                     |
| Késési díj: tárolt vagy számolt?            | `dij` oszlop                          | lekérdezésben számolva                  | ha a díjszabás változhat, és a régi díj számít → tárolt |

Az utolsó sor érdekes: ha a könyvtár holnaptól napi 100 Ft-ot kér, a **múltbeli** késéseknél továbbra is az akkori 50 Ft érvényes. Ilyenkor a kiszámolt díjat a visszahozáskor **elmentjük**, mert az már egy lezárt, történeti tény. A „ne tárolj számolt értéket” szabály tehát nem dogma – a lényeg, hogy **tudatosan** döntsünk.

## A típusválasztás csapdái – próbáld ki!

A modellezés utolsó lépése, hogy minden tulajdonsághoz **típust** választunk. Itt sok rejtett hiba lapul. Az alábbi példák egy üres adatbázison futnak.

### Pénz lebegőpontos számként

A `REAL` / `DOUBLE PRECISION` (lebegőpontos) típus **kettes számrendszerben** közelíti a tizedes törteket, ezért apró hibák keletkeznek:

```sql run
-- Lebegőpontos: 0,1 + 0,2 nem pontosan 0,3!
SELECT 0.1::DOUBLE PRECISION + 0.2::DOUBLE PRECISION = 0.3 AS lebegopontos_egyenlo,
       0.1::NUMERIC + 0.2::NUMERIC = 0.3 AS numeric_egyenlo;
```

Pénzre, mennyiségre, ahol a fillér is számít, mindig `NUMERIC(p, s)` (pontos tizedes) kell. A lebegőpontos szám mérési adatokra (hőmérséklet, koordináta) jó, ahol egy apró kerekítési hiba nem baj.

### Dátum szövegként

Ha a dátumot szövegként tároljuk, a rendezés **betűrendben** történik, nem időrendben:

```sql run
-- Szövegként: '2025-3-1' "nagyobb", mint '2025-12-01', mert a '3' > '1'
SELECT '2025-3-1' > '2025-12-01' AS szovegkent_kesobbi,
       DATE '2025-03-01' > DATE '2025-12-01' AS datumkent_kesobbi;
```

A `DATE` típussal ráadásul számolni is lehet: két dátum különbsége napokban, dátumhoz napot adni:

```sql run
-- Hány napot késett, ha a határidő március 10., és 14-én hozta vissza?
SELECT DATE '2025-03-14' - DATE '2025-03-10' AS keses_napokban,
       (DATE '2025-03-14' - DATE '2025-03-10') * 50 AS dij_forintban,
       DATE '2025-03-10' + 21 AS uj_hatarido_hosszabbitassal;
```

### Telefonszám és irányítószám számként

A telefonszám nem **szám**, hanem **azonosító szöveg**: nem adunk össze telefonszámokat, viszont fontos a vezető nulla és a `+` jel.

```sql run
-- Számként a vezető 0 és a + elvész
SELECT CAST('06301234567' AS BIGINT) AS szamkent,
       CAST('06301234567' AS VARCHAR(20)) AS szovegkent;
```

**Ökölszabály:** ha egy értékkel **nem számolsz** (telefonszám, irányítószám, Neptun-kód, ISBN, bankszámlaszám), akkor az **szöveg**, még ha csupa számjegyből áll is.

### Túl rövid vagy túl hosszú szöveg

```sql run
-- VARCHAR(5): a hosszabb név nem fér bele – a DBMS hibát ad, nem vág le csendben
CREATE TABLE proba (nev VARCHAR(5));
INSERT INTO proba VALUES ('Anna');
SELECT * FROM proba;
```

Kattints a **Szerkesztés** gombra, írd át `'Anna'`-t `'Annamária'`-ra, és futtasd: a PostgreSQL visszautasítja. (Néhány régebbi rendszer csendben levágná – ez még rosszabb!) Válassz **bőkezű, de értelmes** hosszt: egy névnek 100 karakter, egy e-mail-címnek 254 bőven elég.

### Logikai érték szövegként

`'igen'`, `'Igen'`, `'I'`, `'y'`, `'1'`… – ha szövegben tárolsz igaz/hamis értéket, előbb-utóbb mindegyik előfordul. Erre van a `BOOLEAN` típus (`TRUE` / `FALSE`).

## Típusválasztási puska

| Adat                      | Jó típus               | Rossz választás          |
| ------------------------- | ---------------------- | ------------------------ |
| ár, egyenleg              | `NUMERIC(12, 2)`       | `REAL`, `FLOAT`          |
| darabszám, életkor        | `INT` (+ `CHECK >= 0`) | `VARCHAR`                |
| dátum                     | `DATE`                 | `VARCHAR`                |
| időpont                   | `TIMESTAMP`            | két külön szöveg         |
| telefonszám, irányítószám | `VARCHAR`              | `INT`                    |
| igen/nem                  | `BOOLEAN`              | `CHAR(1)` 'I'/'N'        |
| ISBN                      | `CHAR(13)`             | `BIGINT`                 |
| hosszú leírás             | `TEXT`                 | `VARCHAR(50)`            |

## Összefoglalás

- A modellezés lépései: **főnévvadászat → egyedek és tulajdonságok → kapcsolatok → logikai séma → ellenőrzés kérdésekkel**.
- Válaszd szét a **fajtát** (könyv) és a **konkrét darabot** (példány).
- Egy feladatra **több jó modell** is van; a döntést a várható kérdések és változások irányítják.
- Pénzre `NUMERIC`, dátumra `DATE`, azonosítóra (telefon, ISBN) **szöveg**, igen/nemre `BOOLEAN`.

## A lecke feladata

Hozd létre a könyvtár `peldanyok` tábláját a következő szabályokkal:

- `leltari_szam` – legfeljebb 12 karakteres szöveg, ez az **elsődleges kulcs**;
- `isbn` – pontosan 13 karakteres szöveg, **kötelező**;
- `beszerzes_datuma` – dátum, **kötelező**;
- `ar` – pénzösszeg két tizedesjeggyel (legfeljebb 8 számjegy), **nem lehet negatív** (a 0 megengedett, ha ajándékba kaptuk);
- `allapot` – legfeljebb 10 karakteres szöveg, **kötelező**, alapértéke `'jó'`.

Az ellenőrzés kipróbál néhány jó és rossz beszúrást.

```sql starter required
CREATE TABLE peldanyok (
  leltari_szam VARCHAR(12) PRIMARY KEY
  -- folytasd a többi oszloppal!
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE peldanyok (
  leltari_szam     VARCHAR(12) PRIMARY KEY,
  isbn             CHAR(13) NOT NULL,
  beszerzes_datuma DATE NOT NULL,
  ar               NUMERIC(8, 2) CHECK (ar >= 0),
  allapot          VARCHAR(10) NOT NULL DEFAULT 'jó'
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

CREATE TABLE eredmeny (teszt TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES
  ('jó sor',          probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L1', '9789631193001', '2025-01-10', 3990)$q$)),
  ('ajándék (0 Ft)',  probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L2', '9789631193001', '2025-01-10', 0)$q$)),
  ('ismétlődő kulcs', probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L1', '9789631193001', '2025-01-10', 100)$q$)),
  ('ISBN nélkül',     probal($q$INSERT INTO peldanyok (leltari_szam, beszerzes_datuma, ar) VALUES ('L3', '2025-01-10', 100)$q$)),
  ('dátum nélkül',    probal($q$INSERT INTO peldanyok (leltari_szam, isbn, ar) VALUES ('L4', '9789631193001', 100)$q$)),
  ('negatív ár',      probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L5', '9789631193001', '2025-01-10', -1)$q$)),
  ('rossz dátum',     probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L6', '9789631193001', 'tegnap', 100)$q$)),
  ('fillér',          probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar) VALUES ('L7', '9789631193001', '2025-01-10', 12.5)$q$)),
  ('állapot NULL',    probal($q$INSERT INTO peldanyok (leltari_szam, isbn, beszerzes_datuma, ar, allapot) VALUES ('L8', '9789631193001', '2025-01-10', 1, NULL)$q$));

SELECT teszt, eredmeny FROM eredmeny
UNION ALL
SELECT 'alap állapot', allapot FROM peldanyok WHERE leltari_szam = 'L1'
UNION ALL
SELECT 'tárolt ár', ar::TEXT FROM peldanyok WHERE leltari_szam = 'L7';
```
