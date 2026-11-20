---
title: Gyakorlás – adattárolás
summary: Ellenőrző kérdések a lemezekről, a RAID-ről, a tárolási architektúrákról és a mentésről, majd egy esettanulmány: tárolási és mentési terv egy webshop adatbázisához, számolós kérdésekkel.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért fut ma szinte minden éles adatbázis SSD-n?</summary>

Mert az adatbázisok sok kis, véletlenszerű olvasást és írást végeznek (index-keresések, egy-egy lap módosítása, WAL-írás). Ebben az SSD nagyságrendekkel gyorsabb: sokkal magasabb az IOPS, és sokkal kisebb a késleltetés.

</details>

<details>
<summary>2. Mi a különbség a RAID 5 és a RAID 10 között adatbázis szempontból?</summary>

A RAID 5 jobban kihasználja a kapacitást (csak egy lemeznyi megy el paritásra), de minden íráskor paritást kell számolni és írni, ami lassítja a sok kis írást. A RAID 10 a kapacitás felét használja, de az írás egyszerű tükrözés, ezért adatbázisokhoz gyakran ezt ajánlják.

</details>

<details>
<summary>3. Miért nem mentés a RAID és a replikáció?</summary>

Mert mindkettő azonnal és hűségesen lemásolja a hibás műveleteket is: egy véletlen törlést, egy programhibát vagy egy zsarolóvírus titkosítását. A mentés egy korábbi állapot független másolata, amelyből vissza lehet állni.

</details>

<details>
<summary>4. Mit nyerünk a WAL folyamatos archiválásával?</summary>

Az alapmentéssel együtt bármelyik időpontra vissza lehet állni (PITR), így az RPO percekre vagy másodpercekre csökken, és egy véletlen törlés előtti pillanat is visszaállítható.

</details>

<details>
<summary>5. Mikor választanál szinkron replikációt az aszinkron helyett?</summary>

Ha egyetlen véglegesített tranzakció sem veszhet el (pl. pénzügyi rendszer), és elfogadható, hogy az írás valamivel lassabb, mert a `COMMIT`-nak meg kell várnia a másodlagos szervert.

</details>

## Esettanulmány: a webshop tárolási és mentési terve

Egy webshop adatbázisa 1,5 TB, folyamatosan érkeznek a rendelések. A vezetés elvárása: **legfeljebb 5 percnyi** adat veszhet el, és egy szerverhiba után **15 percen belül** újra működjön a rendszer.

```quiz required
? Hat darab 1 TB-os SSD-ből RAID 6 tömböt építünk. Hány TB a hasznos kapacitás?
= 4
! (n − 2) × C = 4 × 1 TB.

? Elfér-e az 1,5 TB-os adatbázis egy négy darab 1 TB-os lemezből épített RAID 10 tömbön?
+ igen, mert a hasznos kapacitás 2 TB
- nem, mert a hasznos kapacitás 1 TB
- nem, mert a hasznos kapacitás 0,5 TB
! RAID 10: a kapacitás fele, 4 / 2 = 2 TB.

? A vezetés elvárásai közül melyik az RPO?
+ legfeljebb 5 percnyi adat veszhet el
- 15 percen belül újra működjön a rendszer
! RPO = mennyi adat; RTO = mennyi idő.

? Melyik megoldás teljesíti az 5 perces RPO-t egy lemez vagy szerver teljes elvesztése esetén?
- napi egy teljes mentés éjjel
- óránkénti növekményes mentés
+ alapmentés + folyamatos WAL-archiválás egy másik helyszínre
- RAID 1 tükrözés ugyanabban a szerverben
! A WAL folyamatos archiválásával csak az utolsó pillanatok veszhetnek el.

? Mi segít leginkább a 15 perces RTO elérésében egy szerverhiba esetén?
- a mentések archív tárolási osztályba helyezése
+ egy replika, amely kiesés esetén gyorsan átveszi az elsődleges szerepét
- a növekményes mentések helyett különbségi mentések
- egy nagyobb RAID 0 tömb
! A failover percek alatt megvan; egy 1,5 TB-os mentés visszatöltése ennél tovább tarthat.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

Itt az SQL-t „számológépként” használjuk tárolási döntésekhez. Minden feladatban előbb becsüld meg fejben az eredményt, és csak utána futtasd!

<details>
<summary>A tárolótömbök táblájának létrehozása (SQL)</summary>

```sql setup
-- Lemeztömbök: RAID-szint, lemezek száma, egy lemez mérete TB-ban.
CREATE TABLE tombok (
  nev      VARCHAR(20) PRIMARY KEY,
  raid     VARCHAR(8) NOT NULL,
  lemez_db INT NOT NULL,
  lemez_tb NUMERIC(5, 1) NOT NULL
);
INSERT INTO tombok VALUES
  ('gyors',     'RAID0',  2, 2),
  ('tukor',     'RAID1',  2, 4),
  ('adatbazis', 'RAID10', 8, 2),
  ('archivum',  'RAID5',  5, 8),
  ('mentes',    'RAID6',  6, 8);
```

</details>

**1.** **Hasznos kapacitás.** Számold ki minden tömb **hasznos kapacitását** TB-ban `CASE`-szel! Emlékeztető: RAID0 = n·c; RAID1 és RAID10 = n/2·c (minden adat kétszer); RAID5 = (n−1)·c; RAID6 = (n−2)·c. (Név, RAID, hasznos TB; név szerint.)

```sql starter
SELECT nev, raid, lemez_db, lemez_tb
FROM tombok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, raid,
       CASE raid
         WHEN 'RAID0'  THEN lemez_db * lemez_tb
         WHEN 'RAID1'  THEN lemez_db / 2 * lemez_tb      -- tükrözés: a fele hasznos
         WHEN 'RAID10' THEN lemez_db / 2 * lemez_tb
         WHEN 'RAID5'  THEN (lemez_db - 1) * lemez_tb    -- egy lemeznyi paritás
         WHEN 'RAID6'  THEN (lemez_db - 2) * lemez_tb    -- két lemeznyi paritás
       END AS hasznos_tb
FROM tombok
ORDER BY nev;
```

</details>

**2.** **Hatékonyság.** Az előző képlettel számold ki a **tárhely-hatékonyságot** százalékban (hasznos / nyers · 100, egészre kerekítve), és rendezd a tömböket hatékonyság szerint csökkenően, azon belül név szerint!

```sql starter
SELECT nev, raid, lemez_db * lemez_tb AS nyers_tb
FROM tombok;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, raid,
       ROUND(100 * CASE raid
         WHEN 'RAID0'  THEN lemez_db
         WHEN 'RAID1'  THEN lemez_db / 2.0
         WHEN 'RAID10' THEN lemez_db / 2.0
         WHEN 'RAID5'  THEN lemez_db - 1
         WHEN 'RAID6'  THEN lemez_db - 2
       END / lemez_db) AS hatekonysag
FROM tombok
ORDER BY hatekonysag DESC, nev;
```

</details>

**3.** **Mikor telik meg?** Egy adatbázis most **500 GB**, és havonta **4%-kal** nő. Hányadik hónapban lépi át először a **750 GB**-ot? Generáld le a hónapokat (`generate_series(0, 24)`), számold ki a méretet (`500 * 1.04 ^ honap`), és vedd az első olyan hónapot, ahol nagyobb 750-nél!

```sql starter
SELECT honap, 500 * 1.04 ^ honap AS meret_gb
FROM generate_series(0, 24) AS honap;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT MIN(honap) AS elso_honap
FROM generate_series(0, 24) AS honap
WHERE 500 * 1.04 ^ honap > 750;          -- 1,04^11 ≈ 1,54 → a 11. hónapban
```

</details>

**4.** **Mentési ablak.** Egy **2 TB**-os mentést különböző hálózatokon kell átvinni. Hány óra kell hozzá (2 tizedesre)? 1 TB = 8000 Gbit, az idő = adat / sebesség. (Hálózat, óra; az óra szerint növekvően.)

```sql starter
CREATE TABLE halozatok (nev VARCHAR(20), gbit_s NUMERIC(6, 2));
INSERT INTO halozatok VALUES ('100 Mbit', 0.1), ('1 Gbit', 1), ('10 Gbit', 10);

SELECT nev, gbit_s FROM halozatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE halozatok (nev VARCHAR(20), gbit_s NUMERIC(6, 2));
INSERT INTO halozatok VALUES ('100 Mbit', 0.1), ('1 Gbit', 1), ('10 Gbit', 10);

SELECT nev, ROUND(2 * 8000 / gbit_s / 3600, 2) AS ora   -- Gbit / (Gbit/s) = s, majd órára váltva
FROM halozatok
ORDER BY ora;
```

</details>

**5.** **Melyik tárolóréteg?** Havi díjak TB-onként: SSD 40 €, HDD 12 €, szalag 2 €. **20 TB** adatot kell tárolni, de az alkalmazás legfeljebb **20 ms** késleltetést tűr. Számold ki rétegenként a havi költséget, és jelöld, hogy **megfelel-e** a késleltetési elvárásnak (költség szerint növekvően)!

```sql starter
CREATE TABLE retegek (nev VARCHAR(10), eur_per_tb INT, kesleltetes_ms NUMERIC(10, 2));
INSERT INTO retegek VALUES ('SSD', 40, 0.1), ('HDD', 12, 8), ('szalag', 2, 60000);

SELECT * FROM retegek;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE retegek (nev VARCHAR(10), eur_per_tb INT, kesleltetes_ms NUMERIC(10, 2));
INSERT INTO retegek VALUES ('SSD', 40, 0.1), ('HDD', 12, 8), ('szalag', 2, 60000);

SELECT nev, 20 * eur_per_tb AS havi_eur, kesleltetes_ms <= 20 AS megfelel
FROM retegek
ORDER BY havi_eur;
```

</details>
