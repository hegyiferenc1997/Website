---
title: Mélyebben – tervezési minták és buktatók valódi rendszerekben
summary: Bevált minták (logikai törlés részleges egyedi indexszel, létrehozás/módosítás időbélyege triggerrel, előzménytábla, állapot CHECK-kel vagy kódtáblával, időzónás időpont) és tipikus anti-minták (EAV, polimorf hivatkozás, vesszős lista, „mindenes” tábla) – mindegyik mellé a jobb megoldás, kipróbálható SQL-lel.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- a valódi rendszerekben újra és újra előkerülő **bevált mintákat** – és hogy mikor használd őket,
- a leggyakoribb **anti-mintákat** (rossz megoldásokat, amelyek elsőre csábítóak),
- és mindegyikhez egy **jobb alternatívát**, SQL-lel kipróbálva.

Ez a lecke az egész tárgy anyagát köti össze: modellezés, normalizálás, megszorítások, indexek, triggerek és nézetek együtt dolgoznak.

## 1. minta – logikai törlés (soft delete)

Sok rendszerben a törlés valójában **elrejtés**: a sor megmarad (vissza lehet állítani, a régi számlák hivatkoznak rá, nyomon követhető), csak egy oszlop jelzi, hogy törölték.

```sql run
CREATE TABLE termekek (
  id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nev          VARCHAR(40) NOT NULL,
  torolve_ekkor TIMESTAMP              -- NULL = aktív, kitöltve = törölt
);
INSERT INTO termekek (nev) VALUES ('Egér'), ('Billentyűzet'), ('Monitor');

-- „Törlés”: csak megjelöljük
UPDATE termekek SET torolve_ekkor = TIMESTAMP '2025-03-01 10:00' WHERE nev = 'Monitor';

-- Nézet az alkalmazásnak: csak az aktív termékek
CREATE VIEW aktiv_termekek AS
SELECT id, nev FROM termekek WHERE torolve_ekkor IS NULL;

SELECT * FROM aktiv_termekek ORDER BY id;
```

Két buktató és megoldásuk:

1. **Elfelejtett szűrés.** Ha a programozó a táblát kérdezi le a nézet helyett, a törölt sorok is megjelennek. → Az alkalmazás csak a **nézethez** kapjon jogot (10. témakör).
2. **Egyediség.** A termék neve legyen egyedi – de ha törölt egy „Monitor”-t, újra fel lehessen venni ugyanilyen nevűt. Egy sima `UNIQUE (nev)` ezt megakadályozná. → **Részleges egyedi index**: csak az aktív sorokra érvényes.

```sql
CREATE UNIQUE INDEX uq_termek_nev_aktiv ON termekek (nev) WHERE torolve_ekkor IS NULL;
```

Ezt a lecke feladatában te is megírod. Vigyázat: a GDPR szerinti **törlési kérelemnél** a logikai törlés nem elég – ott a személyes adatot ténylegesen törölni vagy anonimizálni kell (15. témakör).

## 2. minta – létrehozás és módosítás időbélyege

Szinte minden táblánál hasznos tudni, **mikor** jött létre és mikor módosult utoljára egy sor. A létrehozást egy `DEFAULT`, a módosítást egy **trigger** tartja karban – így nem múlik azon, hogy a program nem felejti-e el.

```sql run
CREATE TABLE cikkek (
  id          INT PRIMARY KEY,
  cim         TEXT NOT NULL,
  letrehozva  TIMESTAMP NOT NULL DEFAULT TIMESTAMP '2025-03-01 09:00',  -- valódi rendszerben: now()
  modositva   TIMESTAMP
);

CREATE FUNCTION modositas_ideje() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.modositva := TIMESTAMP '2025-03-02 15:30';   -- valódi rendszerben: now()
  RETURN NEW;
END $$;

CREATE TRIGGER cikk_modositas BEFORE UPDATE ON cikkek
FOR EACH ROW EXECUTE FUNCTION modositas_ideje();

INSERT INTO cikkek (id, cim) VALUES (1, 'Első cikk'), (2, 'Második cikk');
UPDATE cikkek SET cim = 'Első cikk (javítva)' WHERE id = 1;

SELECT * FROM cikkek ORDER BY id;
```

(A példában fix időpontot használunk, hogy az eredmény mindig ugyanaz legyen; élesben `now()` vagy `CURRENT_TIMESTAMP` áll ott.) A `BEFORE UPDATE` trigger a sor **mentése előtt** módosíthatja a `NEW` sort.

## 3. minta – előzménytábla (history)

Ha nemcsak azt kell tudni, hogy *mikor* változott valami, hanem azt is, hogy **mi volt előtte** (pl. „mennyi volt a termék ára tavaly márciusban?”), egy **előzménytábla** kell, érvényességi időszakkal:

```sql run
CREATE TABLE ar_elozmeny (
  termek_id   INT,
  ar          NUMERIC(10, 2),
  ervenyes_tol DATE NOT NULL,
  ervenyes_ig  DATE                     -- NULL = jelenleg is érvényes
);
INSERT INTO ar_elozmeny VALUES
  (1, 4490, '2024-01-01', '2024-09-30'),
  (1, 4990, '2024-10-01', '2025-05-31'),
  (1, 5490, '2025-06-01', NULL);

-- Mennyi volt az ár 2025. március 15-én?
SELECT ar FROM ar_elozmeny
WHERE termek_id = 1
  AND ervenyes_tol <= DATE '2025-03-15'
  AND (ervenyes_ig IS NULL OR ervenyes_ig >= DATE '2025-03-15');
```

Ez a **„lassan változó dimenzió” (2-es típus)** mintája az adattárházakból (18. témakör), de hétköznapi rendszerekben is gyakori: árak, címek, beosztások, szerződésfeltételek.

## 4. minta – állapot: CHECK vagy kódtábla?

Egy rendelés állapota csak néhány érték lehet. Két jó megoldás:

| Megoldás                                     | Előny                                          | Mikor?                                        |
| -------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `statusz TEXT CHECK (statusz IN ('új', 'fizetve', 'szállítva'))` | egyszerű, nincs JOIN               | kevés, ritkán változó érték                   |
| `statusz_id INT REFERENCES statuszok`        | új érték felvétele adatmódosítás, nem sémaváltozás; további adat tárolható (név két nyelven, sorrend, szín) | sok érték, felhasználó által bővíthető lista |

A **rossz** megoldás: szabad szöveg megszorítás nélkül – előbb-utóbb lesz `'Fizetve'`, `'fizetett'` és `'payed'` is.

## 5. minta – időpont időzónával

Egy nemzetközi rendszerben a `TIMESTAMP` (időzóna nélkül) veszélyes: „2025-03-30 02:30” – de melyik országban? (Ráadásul ezen a napon Magyarországon ez az időpont nem is létezik: 2:00-kor 3:00-ra ugrik az óra.) PostgreSQL-ben a `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`) UTC-ben tárolja az időpontot, és megjelenítéskor a kért időzónára váltja:

```sql run
SELECT TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'Europe/Budapest' AS budapesti_ido,
       TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'America/New_York' AS new_yorki_ido,
       TIMESTAMPTZ '2025-07-01 12:00:00+00' AT TIME ZONE 'Asia/Tokyo' AS tokioi_ido;
```

**Ökölszabály:** **eseményekhez** (bejelentkezés, rendelés) `TIMESTAMPTZ`; **naptári dátumhoz** (születésnap, ünnepnap) `DATE`.

## Anti-minták – amit kerülj

### Az EAV (egyed–tulajdonság–érték) tábla

„Rugalmas legyen, bármilyen tulajdonság jöhessen!” – és születik egy tábla három oszloppal: `(egyed_id, tulajdonsag, ertek)`.

```sql run
CREATE TABLE eav (termek_id INT, tulajdonsag TEXT, ertek TEXT);
INSERT INTO eav VALUES
  (1, 'nev', 'Monitor'), (1, 'ar', '69990'), (1, 'meret_col', '27'),
  (2, 'nev', 'Egér'),    (2, 'ar', 'olcsó');            -- hoppá: az ár szöveg!

-- Egy egyszerű „név + ár” lekérdezés is körülményes:
SELECT n.termek_id, n.ertek AS nev, a.ertek AS ar
FROM eav n JOIN eav a ON a.termek_id = n.termek_id AND a.tulajdonsag = 'ar'
WHERE n.tulajdonsag = 'nev';
```

Problémák: **nincs típusellenőrzés** (az „olcsó” bekerült árként), **nincs kötelező mező**, minden lekérdezés önmagával vett összekapcsolások sora, az indexelés nehéz. **Jobb:** a közös, ismert tulajdonságok rendes oszlopokban, a valóban változó, termékfüggő extrák egy **JSONB** oszlopban (11. témakör), szükség esetén `CHECK`-kel.

### Polimorf hivatkozás

Egy `megjegyzesek` tábla, amely hol termékre, hol rendelésre, hol vásárlóra hivatkozik: `(cel_tipus TEXT, cel_id INT, szoveg)`. A `cel_id`-re **nem lehet idegen kulcsot** tenni, mert hol egyik, hol másik táblára mutat – így a DBMS nem tudja garantálni, hogy a hivatkozott sor létezik. **Jobb:** külön kapcsolótáblák (`termek_megjegyzesek`, `rendeles_megjegyzesek`), vagy több, egyenként opcionális idegen kulcs oszlop és egy `CHECK`, hogy pontosan egy legyen kitöltve.

### Vesszős lista egy mezőben

`cimkek = 'akció,új,kiemelt'` – nem lehet rendesen keresni (`LIKE '%új%'` megtalálja az „újrahasznosított”-at is), indexelni, és nem ellenőrizhető, hogy létező címke-e. **Jobb:** kapcsolótábla (N:M), vagy PostgreSQL-ben tömb / JSONB oszlop GIN indexszel, ha a címkék egyszerű szövegek.

### A „mindenes” tábla

Egyetlen `adatok` tábla 120 oszloppal, amelyből soronként 10 van kitöltve, mert „minden egy helyen van”. Ez valójában több egyed egymásra rakva – a sok `NULL` és a megszorítások hiánya ennek a jele. **Jobb:** normalizálás (6. témakör), szükség esetén specializáció (5. témakör).

## Összefoglaló táblázat

| Helyzet                                          | Minta                                              |
| ------------------------------------------------ | -------------------------------------------------- |
| törölni, de megőrizni                            | logikai törlés + nézet + részleges egyedi index    |
| mikor jött létre / módosult?                     | `DEFAULT` + `BEFORE UPDATE` trigger                |
| milyen volt korábban?                            | előzménytábla érvényességi időszakkal              |
| kevés rögzített érték                            | `CHECK (… IN (…))`                                 |
| bővíthető értéklista                             | kódtábla idegen kulccsal                           |
| esemény időpontja                                | `TIMESTAMPTZ`                                      |
| változó extra tulajdonságok                      | rendes oszlopok + JSONB (nem EAV)                  |
| több fajta „szülőhöz” kapcsolódó adat            | külön kapcsolótáblák (nem polimorf hivatkozás)     |

## Összefoglalás

- A bevált minták a tárgy építőköveiből állnak össze: nézet, részleges index, trigger, megszorítás, előzménytábla.
- Az anti-minták közös vonása, hogy **elveszik a DBMS garanciáit** (típus, kötelezőség, idegen kulcs, egyediség) a „rugalmasság” nevében.
- Kérdezd meg mindig: **mit tud garantálni az adatbázis**, és mit kell a programra bíznom?

## A lecke feladata

Valósítsd meg a **logikai törlés** mintáját a kiinduló kódban lévő `termekek` táblán:

1. hozd létre az `aktiv_termekek` **nézetet**, amely csak a nem törölt (`torolve_ekkor IS NULL`) termékek `id` és `nev` oszlopát mutatja;
2. hozz létre egy **részleges egyedi indexet**, amely biztosítja, hogy az **aktív** termékek neve egyedi legyen – de egy törölt termék nevét újra fel lehessen venni.

Az ellenőrzés kipróbál néhány beszúrást, és lekérdezi a nézetet.

```sql starter required
CREATE TABLE termekek (
  id            INT PRIMARY KEY,
  nev           VARCHAR(40) NOT NULL,
  torolve_ekkor TIMESTAMP
);
INSERT INTO termekek VALUES
  (1, 'Egér', NULL), (2, 'Billentyűzet', NULL), (3, 'Monitor', '2025-03-01 10:00');

-- 1. a nézet
-- 2. a részleges egyedi index
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termekek (
  id            INT PRIMARY KEY,
  nev           VARCHAR(40) NOT NULL,
  torolve_ekkor TIMESTAMP
);
INSERT INTO termekek VALUES
  (1, 'Egér', NULL), (2, 'Billentyűzet', NULL), (3, 'Monitor', '2025-03-01 10:00');

CREATE VIEW aktiv_termekek AS
SELECT id, nev FROM termekek WHERE torolve_ekkor IS NULL;

CREATE UNIQUE INDEX uq_termek_nev_aktiv ON termekek (nev) WHERE torolve_ekkor IS NULL;
```

</details>

```sql test
CREATE FUNCTION probal(parancs TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE parancs;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorrend INT, teszt TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES
  (1, 'törölt név újra (Monitor)', probal($q$INSERT INTO termekek VALUES (4, 'Monitor', NULL)$q$)),
  (2, 'aktív név még egyszer (Egér)', probal($q$INSERT INTO termekek VALUES (5, 'Egér', NULL)$q$)),
  (3, 'törölt Egér felvétele', probal($q$INSERT INTO termekek VALUES (6, 'Egér', '2025-01-01')$q$));

SELECT sorrend::TEXT, teszt, eredmeny FROM eredmeny
UNION ALL
SELECT 'nézet', id::TEXT, nev FROM aktiv_termekek
ORDER BY 1, 2;
```
