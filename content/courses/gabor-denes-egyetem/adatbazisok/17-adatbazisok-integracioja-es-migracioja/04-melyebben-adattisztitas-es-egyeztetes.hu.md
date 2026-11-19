---
title: Mélyebben – adattisztítás és egyeztetés migrációkor
summary: Átmeneti (staging) táblák, a piszkos adatok tipikus hibái és javításuk SQL-lel (szóközök, kis- és nagybetűk, dátumformátumok, érvénytelen értékek reguláris kifejezéssel), ismétlődések kiszűrése ROW_NUMBER-rel, elutasított sorok naplózása, majd egyeztetés darabszámmal, összegekkel és ellenőrzőösszeggel.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- miért érdemes az adatot előbb egy **átmeneti (staging) táblába** tölteni,
- melyek a „piszkos” adatok **leggyakoribb hibái**, és hogyan javítod őket SQL-lel,
- hogyan ellenőrizz formátumot **reguláris kifejezéssel**,
- hogyan szűrd ki az **ismétlődéseket** úgy, hogy közülük a megfelelőt tartsd meg,
- hogyan **naplózd** a javíthatatlan sorokat ahelyett, hogy csendben eldobnád őket,
- hogyan **egyeztesd** a forrást és a célt, hogy biztosan ne veszett el semmi.

## A háromlépcsős betöltés

Egy régi rendszerből exportált fájlt sosem töltünk **közvetlenül** a végleges táblába. A bevált út:

```text
  forrásfájl ──► 1. STAGING tábla ──► 2. tisztítás, ellenőrzés ──► 3. végleges tábla
                 (minden oszlop TEXT,       (SQL-lel, lépésenként)      (szigorú típusok,
                  semmi megszorítás)                                     megszorítások)
                                        └──► elutasított sorok táblája (miért?)
```

Miért minden oszlop `TEXT` a staging táblában? Mert ha a fájlban egy dátum `2025.03.01.` alakú, egy `DATE` oszlop már a betöltéskor elutasítaná – és nem látnánk, **hány** és **milyen** hibás sor van. A szöveges staging táblába minden bekerül, és SQL-lel nyugodtan megvizsgálhatjuk.

**Analógia:** a piacról hazahozott zöldséget sem teszed rögtön a fazékba: előbb a mosogatóba kerül (staging), ott megmosod, megpucolod, a romlottat kidobod (tisztítás), és csak utána főzöd meg (végleges tábla).

## A staging tábla – egy tipikus piszkos export

```sql run
CREATE TABLE stg_vasarlok (id TEXT, nev TEXT, email TEXT, szuletett TEXT, irsz TEXT);
INSERT INTO stg_vasarlok VALUES
  ('1', '  Kiss Anna ',  'Anna.Kiss@Pelda.hu',  '2001.03.14.', '1111'),
  ('2', 'Nagy Béla',     'bela@pelda.hu ',      '2002-07-02',  '4025'),
  ('3', 'kiss anna',     'anna.kiss@pelda.hu',  '14/03/2001',  '1111'),
  ('4', 'Tóth Cili',     'cili[kukac]pelda.hu', '2000-11-23',  '67200'),
  ('5', 'Szabó Dani',    'dani@pelda.hu',       '',            '6720'),
  ('6', 'Varga  Emma',   'emma@pelda.hu',       '2003-01-30',  '9021');

SELECT * FROM stg_vasarlok;
```

Hány hibát látsz? Fölösleges szóközök, vegyes kis- és nagybetűk, háromféle dátumformátum, üres dátum, érvénytelen e-mail, ötjegyű irányítószám, és Kiss Anna kétszer (egyszer kisbetűvel, más dátumformátummal).

## 1. Szóközök és kis-/nagybetűk

```sql run
CREATE TABLE stg_vasarlok (id TEXT, nev TEXT, email TEXT, szuletett TEXT, irsz TEXT);
INSERT INTO stg_vasarlok VALUES
  ('1', '  Kiss Anna ',  'Anna.Kiss@Pelda.hu',  '2001.03.14.', '1111'),
  ('2', 'Nagy Béla',     'bela@pelda.hu ',      '2002-07-02',  '4025'),
  ('6', 'Varga  Emma',   'emma@pelda.hu',       '2003-01-30',  '9021');

SELECT id,
       '[' || nev || ']' AS eredeti,
       '[' || regexp_replace(TRIM(nev), '\s+', ' ', 'g') || ']' AS tisztitott_nev,
       LOWER(TRIM(email)) AS tisztitott_email
FROM stg_vasarlok;
```

- `TRIM` – levágja a szóközöket a két végéről;
- `regexp_replace(…, '\s+', ' ', 'g')` – a belső, többszörös szóközt egyre cseréli („Varga  Emma” → „Varga Emma”);
- `LOWER` – az e-mail-cím nem kis-/nagybetű-érzékeny, ezért egységesen kisbetűsre alakítjuk (így vehetjük észre az ismétlődést).

A szögletes zárójel csak azért van, hogy lássuk a láthatatlan szóközöket.

## 2. Dátumok több formátumban

A `to_date(szöveg, minta)` egy adott formátumú szöveget alakít dátummá. Ha több formátum is előfordul, a `CASE` és egy reguláris kifejezés dönti el, melyik mintát használjuk:

```sql run
SELECT nyers,
       CASE
         WHEN nyers ~ '^\d{4}-\d{2}-\d{2}$'   THEN to_date(nyers, 'YYYY-MM-DD')
         WHEN nyers ~ '^\d{4}\.\d{2}\.\d{2}\.$' THEN to_date(nyers, 'YYYY.MM.DD.')
         WHEN nyers ~ '^\d{2}/\d{2}/\d{4}$'   THEN to_date(nyers, 'DD/MM/YYYY')
         ELSE NULL                              -- ismeretlen formátum vagy üres
       END AS datum
FROM (VALUES ('2001.03.14.'), ('2002-07-02'), ('14/03/2001'), (''), ('tegnap')) AS t(nyers);
```

A `~` operátor azt nézi, illeszkedik-e a szöveg a **reguláris kifejezésre**: `^` = eleje, `$` = vége, `\d{4}` = pontosan 4 számjegy, `\.` = egy pont karakter. (Vigyázat: a `03/04/2001` lehet március 4. vagy április 3. is! Ilyenkor a forrásrendszer dokumentációja vagy egy ismert minta dönt – ha ez sincs, a sort inkább elutasítjuk, mint hogy rossz dátumot tároljunk.)

## 3. Érvényesség ellenőrzése

```sql run
SELECT email,
       email ~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' AS ervenyes_email,
       irsz,
       irsz ~ '^\d{4}$' AS ervenyes_irsz
FROM (VALUES ('anna.kiss@pelda.hu', '1111'), ('cili[kukac]pelda.hu', '67200'),
             ('dani@pelda.hu', '6720')) AS t(email, irsz);
```

Az e-mail mintája egyszerűsített („valami @ valami . legalább két betű”) – a tökéletes e-mail-ellenőrzés reguláris kifejezéssel szinte lehetetlen, de a nyilvánvaló hibákat kiszűri. A magyar irányítószám pontosan 4 számjegy.

## 4. Ismétlődések kiszűrése ROW_NUMBER-rel

Kiss Anna kétszer szerepel (1-es és 3-as azonosítóval). Melyiket tartsuk meg? Egy **szabályt** kell hozni, pl. „a legkisebb azonosítójút” vagy „a legutóbb módosítottat”. A `ROW_NUMBER()` ablakfüggvény a csoporton belül sorszámot ad, és megtartjuk az 1-es sorszámúakat:

```sql run
SELECT id, nev, email_norm, sorszam,
       CASE WHEN sorszam = 1 THEN 'megtartjuk' ELSE 'ismétlődés' END AS dontes
FROM (
  SELECT id::INT AS id, TRIM(nev) AS nev, LOWER(TRIM(email)) AS email_norm,
         ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY id::INT) AS sorszam
  FROM (VALUES ('1', '  Kiss Anna ', 'Anna.Kiss@Pelda.hu'),
               ('2', 'Nagy Béla', 'bela@pelda.hu '),
               ('3', 'kiss anna', 'anna.kiss@pelda.hu')) AS t(id, nev, email)
) x
ORDER BY id;
```

- `PARTITION BY` – mi alapján tekintünk két sort ugyanannak (itt: a normalizált e-mail);
- `ORDER BY` a `PARTITION`-ön belül – melyik kapja az 1-es sorszámot (itt: a legkisebb azonosító).

Fontos: az ismétlődéseket **ne** csak dobd el. Gyakran a másik rekordban van értékes adat (pl. a telefonszám csak ott van kitöltve) – ilyenkor **összefésülés** kell, nem törlés.

## 5. Az elutasított sorok naplózása

Ami nem javítható, az ne tűnjön el nyomtalanul! Tegyük egy külön táblába, az **okkal** együtt, hogy az adatgazda kijavíthassa a forrásban:

```sql run
CREATE TABLE stg_vasarlok (id TEXT, nev TEXT, email TEXT, szuletett TEXT, irsz TEXT);
INSERT INTO stg_vasarlok VALUES
  ('1', '  Kiss Anna ',  'Anna.Kiss@Pelda.hu',  '2001.03.14.', '1111'),
  ('4', 'Tóth Cili',     'cili[kukac]pelda.hu', '2000-11-23',  '67200'),
  ('5', 'Szabó Dani',    'dani@pelda.hu',       '',            '6720');

CREATE TABLE elutasitott (id TEXT, ok TEXT);
INSERT INTO elutasitott
SELECT id, 'érvénytelen e-mail' FROM stg_vasarlok
WHERE NOT LOWER(TRIM(email)) ~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'
UNION ALL
SELECT id, 'érvénytelen irányítószám' FROM stg_vasarlok WHERE NOT irsz ~ '^\d{4}$'
UNION ALL
SELECT id, 'hiányzó születési dátum' FROM stg_vasarlok WHERE TRIM(szuletett) = '';

SELECT * FROM elutasitott ORDER BY id, ok;
```

Az üres születési dátumnál döntés kell: elutasítjuk a sort, vagy `NULL`-lal betöltjük? Ha a cél táblában a születési dátum nem kötelező, a második a jó – de akkor is érdemes **figyelmeztetésként** naplózni.

## 6. Egyeztetés: elveszett-e valami?

A betöltés után mindig ellenőrizzük, hogy a forrás és a cél **egyezik-e**. Három szinten:

1. **Darabszám:** forrás sorai = betöltött + elutasított + kiszűrt ismétlődés?
2. **Összegek:** pénzügyi adatnál az összegek egyeznek-e (pl. a számlák végösszege)?
3. **Ellenőrzőösszeg (checksum):** a tartalom egésze egyezik-e? Egy hash-t számolunk az összes (rendezett) sorból, és összevetjük.

```sql run
-- Két tábla tartalmának összevetése egyetlen hash-sel
CREATE TABLE forras (id INT, nev TEXT);
CREATE TABLE cel    (id INT, nev TEXT);
INSERT INTO forras VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla'), (3, 'Tóth Cili');
INSERT INTO cel    VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla'), (3, 'Tóth Cilii');  -- elírás!

SELECT (SELECT COUNT(*) FROM forras) AS forras_db,
       (SELECT COUNT(*) FROM cel) AS cel_db,
       (SELECT md5(string_agg(id || '|' || nev, ',' ORDER BY id)) FROM forras) =
       (SELECT md5(string_agg(id || '|' || nev, ',' ORDER BY id)) FROM cel) AS tartalom_egyezik;
```

A darabszám egyezik, de az ellenőrzőösszeg nem – valahol eltérés van. Hogy pontosan hol, azt egy `EXCEPT` mutatja meg:

```sql run
CREATE TABLE forras (id INT, nev TEXT);
CREATE TABLE cel    (id INT, nev TEXT);
INSERT INTO forras VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla'), (3, 'Tóth Cili');
INSERT INTO cel    VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla'), (3, 'Tóth Cilii');

SELECT 'csak a forrásban' AS hol, * FROM (SELECT * FROM forras EXCEPT SELECT * FROM cel) a
UNION ALL
SELECT 'csak a célban', * FROM (SELECT * FROM cel EXCEPT SELECT * FROM forras) b;
```

## Összefoglalás

- **Staging tábla** (minden oszlop szöveg) → tisztítás SQL-lel → végleges, szigorú tábla.
- Tisztítás: `TRIM`, `regexp_replace`, `LOWER`; dátumok `CASE` + `~` + `to_date` segítségével.
- Érvényesség: **reguláris kifejezés** (`~`); a kétértelmű adatot inkább utasítsd el, mint hogy rosszul tárold.
- Ismétlődések: `ROW_NUMBER() OVER (PARTITION BY normalizált_kulcs ORDER BY szabály)`; megfontolandó az összefésülés.
- **Elutasított sorok** külön táblába, okkal együtt.
- **Egyeztetés:** darabszám, összegek, ellenőrzőösszeg, és `EXCEPT` az eltérések megtalálására.

## A lecke feladata

A kiinduló kód egy piszkos vásárló-exportot tölt be. Készíts belőle **tiszta listát**: minden vásárló **egyszer** szerepeljen, az ismétlődést a **normalizált e-mail** (szóközök levágva, kisbetűsítve) alapján döntsd el, és ismétlődésnél a **legkisebb azonosítójú** sort tartsd meg!

Az eredmény oszlopai: `id` (egész szám), `nev` (a két végéről levágott szóközökkel), `email` (normalizálva), azonosító szerint rendezve.

```sql starter required
CREATE TABLE stg (id TEXT, nev TEXT, email TEXT);
INSERT INTO stg VALUES
  ('1', '  Kiss Anna ', 'Anna.Kiss@Pelda.hu'),
  ('2', 'Nagy Béla',    'bela@pelda.hu '),
  ('3', 'kiss anna',    'anna.kiss@pelda.hu'),
  ('4', 'Tóth Cili',    'cili@pelda.hu'),
  ('5', 'Nagy B.',      ' BELA@pelda.hu');

-- Írd meg a tisztító lekérdezést!
SELECT id, nev, email FROM stg;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE stg (id TEXT, nev TEXT, email TEXT);
INSERT INTO stg VALUES
  ('1', '  Kiss Anna ', 'Anna.Kiss@Pelda.hu'),
  ('2', 'Nagy Béla',    'bela@pelda.hu '),
  ('3', 'kiss anna',    'anna.kiss@pelda.hu'),
  ('4', 'Tóth Cili',    'cili@pelda.hu'),
  ('5', 'Nagy B.',      ' BELA@pelda.hu');

SELECT id, nev, email
FROM (
  SELECT id::INT AS id, TRIM(nev) AS nev, LOWER(TRIM(email)) AS email,
         ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(email)) ORDER BY id::INT) AS sorszam
  FROM stg
) x
WHERE sorszam = 1
ORDER BY id;
```

</details>
