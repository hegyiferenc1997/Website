---
title: Gyakorlás – normalizálás és integritás
summary: Ellenőrző kérdések és egy normalizálási feladat (könyvtári kölcsönzések) a nyers táblától a 3NF-ig, az integritási szabályokkal együtt.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a közös oka a módosítási, beszúrási és törlési anomáliának?</summary>

Hogy egy táblában **több különböző dolog** (pl. hallgató, tárgy és jelentkezés) adatai keverednek, ezért ugyanaz az információ többször szerepel, és egyes adatok csak más adatokkal együtt tárolhatók.

</details>

<details>
<summary>2. Miért nem sértheti egy egyoszlopos kulcsú tábla a 2NF-et?</summary>

Mert a 2NF a **részleges** függőséget tiltja, vagyis azt, hogy egy attribútum a kulcsnak csak egy részétől függjön. Egy egyetlen oszlopból álló kulcsnak nincs valódi része.

</details>

<details>
<summary>3. Mi a különbség az ON DELETE CASCADE és az ON DELETE SET NULL között?</summary>

`CASCADE`-nél a szülő sor törlésekor a rá hivatkozó gyerek sorok is törlődnek. `SET NULL`-nál a gyerek sorok megmaradnak, csak az idegen kulcsuk NULL lesz. Az első akkor jó, ha a gyerek a szülő nélkül értelmetlen (rendelés tételei), a második, ha önállóan is megáll (blogposzt a törölt szerző után).

</details>

<details>
<summary>4. Miért veszélyes a számlákra mutató idegen kulcsot CASCADE-del létrehozni?</summary>

Mert egy vevő törlése magával vinné az összes számláját, pedig a számlákat jogszabály miatt évekig meg kell őrizni. Itt `RESTRICT` (vagy a vevő „inaktívvá” tétele törlés helyett) a biztonságos megoldás.

</details>

<details>
<summary>5. Ha a normalizálás ennyire jó, miért denormalizálnak mégis néha?</summary>

Mert a normalizált séma sok összekapcsolást igényel, ami nagyon nagy, olvasásra optimalizált (elemző) rendszerekben lassú lehet. Ilyenkor tudatosan tárolunk ismétlődő vagy előre kiszámolt adatot, vállalva, hogy frissítéskor figyelni kell rá.

</details>

## Összefoglaló feladat: könyvtári kölcsönzések

Egy könyvtár egyetlen táblában tartja a kölcsönzéseket:

| olvaso_id | olvaso_nev | olvaso_tel  | isbn | cim        | szerzo     | kiado     | kiado_varos | kolcsonzes_datum |
| --------- | ---------- | ----------- | ---- | ---------- | ---------- | --------- | ----------- | ---------------- |
| 1         | Kiss Anna  | 06301112222 | 111  | SQL alapok | Nagy Gábor | TechKönyv | Budapest    | 2026-10-01       |
| 1         | Kiss Anna  | 06301112222 | 222  | Python     | Tóth Éva   | KódKiadó  | Szeged      | 2026-10-05       |
| 2         | Szabó Dani | 06209998888 | 111  | SQL alapok | Nagy Gábor | TechKönyv | Budapest    | 2026-10-07       |

A kulcs `(olvaso_id, isbn, kolcsonzes_datum)`. Egy könyvnek egy szerzője és egy kiadója van.

```quiz required
? Teljesül-e az 1NF (minden cella atomi)?
+ igen
- nem
! Nincs lista egyetlen cellában sem.

? Melyik részleges függőség?
- (olvaso_id, isbn, kolcsonzes_datum) → semmi
+ isbn → cim, szerzo, kiado
- kiado → kiado_varos
- olvaso_nev → olvaso_id
! A könyv adatai csak az ISBN-től függenek, ami a kulcs része.

? Melyik tranzitív függőség marad a könyvek táblájában a 2NF után?
- isbn → cim
+ isbn → kiado → kiado_varos
- olvaso_id → olvaso_nev
- isbn → szerzo
! A kiadó városa a kiadótól függ, nem közvetlenül a könyvtől.

? Hány táblát kapsz 3NF-ben? (olvasók, könyvek, kiadók, kölcsönzések)
= 4
! olvasok, konyvek, kiadok, kolcsonzesek.

? Egy olvasót törölni akarunk, de a kölcsönzési előzményeit statisztikához meg kell tartani, olvasó nélkül. Melyik ON DELETE beállítás illik a kölcsönzések olvaso_id idegen kulcsához?
- CASCADE
+ SET NULL
- RESTRICT
! A kölcsönzés megmarad, csak az olvasó lesz ismeretlen.

? Melyik integritási fajtát biztosítja a `CHECK (kolcsonzes_datum <= CURRENT_DATE)`?
- egyedintegritás
- hivatkozási integritás
+ tartományintegritás
! Az érték megengedett tartományát szabja meg.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

A feladatok a fenti könyvtári példa egy kicsit bővebb változatán dolgoznak. Figyeld meg az utolsó sort: Szabó Dani telefonszáma ott más – ez egy tipikus **módosítási anomália** nyoma!

<details>
<summary>A lapos kölcsönzési tábla létrehozása (SQL)</summary>

```sql setup
-- Normalizálatlan („lapos”) tábla: minden kölcsönzés minden adattal együtt.
CREATE TABLE kolcsonzes_lapos (
  olvaso_id   INT,
  olvaso_nev  VARCHAR(40),
  olvaso_tel  VARCHAR(15),
  isbn        VARCHAR(5),
  cim         VARCHAR(40),
  szerzo      VARCHAR(40),
  kiado       VARCHAR(40),
  kiado_varos VARCHAR(40),
  datum       DATE
);
INSERT INTO kolcsonzes_lapos VALUES
  (1, 'Kiss Anna',  '06301112222', '111', 'SQL alapok', 'Nagy Gábor', 'TechKönyv', 'Budapest', '2026-10-01'),
  (1, 'Kiss Anna',  '06301112222', '222', 'Python',     'Tóth Éva',   'KódKiadó',  'Szeged',   '2026-10-05'),
  (2, 'Szabó Dani', '06209998888', '111', 'SQL alapok', 'Nagy Gábor', 'TechKönyv', 'Budapest', '2026-10-07'),
  (3, 'Varga Emma', '06705554444', '333', 'Hálózatok',  'Kiss Péter', 'TechKönyv', 'Budapest', '2026-10-08'),
  (2, 'Szabó Dani', '06201234567', '222', 'Python',     'Tóth Éva',   'KódKiadó',  'Szeged',   '2026-10-12');
```

</details>

**1.** **Sérül-e a függőség?** Az `olvaso_id → olvaso_tel` függőségnek teljesülnie kellene. Keresd meg azokat az olvasókat, akikhez **több különböző telefonszám** is tartozik (`olvaso_id`, a különböző számok darabszáma)!

```sql starter
SELECT olvaso_id, olvaso_tel
FROM kolcsonzes_lapos;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT olvaso_id, COUNT(DISTINCT olvaso_tel) AS telefonszamok
FROM kolcsonzes_lapos
GROUP BY olvaso_id
HAVING COUNT(DISTINCT olvaso_tel) > 1;    -- ahol egy olvasóhoz több szám tartozik
```

</details>

**2.** **Függőség ellenőrzése.** Teljesül-e az `isbn → cim, szerzo, kiado`? ISBN-enként számold meg, hány **különböző (cím, szerző, kiadó) változat** van – ha mindenhol 1, a függőség teljesül. ISBN szerint rendezve.

```sql starter
SELECT isbn, cim, szerzo, kiado
FROM kolcsonzes_lapos;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT isbn, COUNT(DISTINCT cim || '|' || szerzo || '|' || kiado) AS valtozatok
FROM kolcsonzes_lapos
GROUP BY isbn
ORDER BY isbn;
```

</details>

**3.** **Felbontás 3NF felé.** A kiadó városa a kiadótól függ (tranzitív függőség). Hozd létre a `kiadok_n` táblát a lapos táblából (`kiado`, `kiado_varos`, ismétlődés nélkül), majd kérdezd le kiadó szerint rendezve!

```sql starter
SELECT kiado, kiado_varos
FROM kolcsonzes_lapos;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE kiadok_n AS
SELECT DISTINCT kiado, kiado_varos
FROM kolcsonzes_lapos;

SELECT * FROM kiadok_n ORDER BY kiado;
```

</details>

**4.** **Veszteségmentes visszaállítás.** Hozd létre a `konyvek_n` (`isbn`, `cim`, `kiado`) és a `kiadok_n` (`kiado`, `kiado_varos`) táblát, majd **JOIN-nal állítsd vissza** könyvenként a címet és a kiadó városát (`isbn`, `cim`, `kiado_varos`, ISBN szerint). Ha a felbontás jó, semmi sem vész el és semmi sem duplázódik.

```sql starter
-- 1. CREATE TABLE konyvek_n AS SELECT DISTINCT ...
-- 2. CREATE TABLE kiadok_n AS SELECT DISTINCT ...
-- 3. SELECT ... JOIN ...
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE konyvek_n AS SELECT DISTINCT isbn, cim, kiado FROM kolcsonzes_lapos;
CREATE TABLE kiadok_n  AS SELECT DISTINCT kiado, kiado_varos FROM kolcsonzes_lapos;

SELECT k.isbn, k.cim, ki.kiado_varos
FROM konyvek_n k
JOIN kiadok_n ki ON ki.kiado = k.kiado     -- a közös oszlop (kiado) köti össze
ORDER BY k.isbn;
```

</details>

**5.** **Integritás utólag.** Adj a lapos táblához `ALTER TABLE`-lel **elsődleges kulcsot** az `(olvaso_id, isbn, datum)` oszlopokra, hogy ugyanaz a kölcsönzés ne kerülhessen be kétszer! Az ellenőrzés kipróbálja.

```sql starter
ALTER TABLE kolcsonzes_lapos ...;
```

<details>
<summary>Megoldás</summary>

```sql solution
ALTER TABLE kolcsonzes_lapos ADD PRIMARY KEY (olvaso_id, isbn, datum);
```

</details>

```sql test
CREATE FUNCTION probal(cmd TEXT) RETURNS TEXT AS $$
BEGIN
  EXECUTE cmd;
  RETURN 'sikerült';
EXCEPTION WHEN others THEN
  RETURN 'elutasítva';
END $$ LANGUAGE plpgsql;

CREATE TABLE eredmeny (sorszam INT, eset TEXT, eredmeny TEXT);
INSERT INTO eredmeny VALUES (1, 'új kölcsönzés',
  probal($q$INSERT INTO kolcsonzes_lapos VALUES (3, 'Varga Emma', '06705554444', '111', 'SQL alapok', 'Nagy Gábor', 'TechKönyv', 'Budapest', '2026-10-20')$q$));
INSERT INTO eredmeny VALUES (2, 'ugyanaz még egyszer',
  probal($q$INSERT INTO kolcsonzes_lapos VALUES (3, 'Varga Emma', '06705554444', '111', 'SQL alapok', 'Nagy Gábor', 'TechKönyv', 'Budapest', '2026-10-20')$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```
