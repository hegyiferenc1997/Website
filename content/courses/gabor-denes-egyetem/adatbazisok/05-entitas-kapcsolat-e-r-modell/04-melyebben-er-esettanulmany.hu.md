---
title: Mélyebben – E-R esettanulmány és különleges kapcsolatok
summary: Egy webshop teljes E-R modellje a leírástól a táblákig; rekurzív kapcsolat (előfeltétel, főnök–beosztott), háromágú kapcsolat, specializáció (öröklődés) három leképezési stratégiával, többértékű és származtatott tulajdonság – kipróbálható SQL-példákkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan építs fel egy **teljes E-R modellt** egy valósághű leírásból (webshop),
- mi a **rekurzív** kapcsolat (egy egyedhalmaz önmagával), és hogyan lesz belőle tábla,
- mikor kell **háromágú** kapcsolat, és miért nem bontható mindig kettőre,
- hogyan modellezd az **öröklődést** (specializáció), és melyik a három leképezés közül a jó,
- mi a teendő a **többértékű** és a **származtatott** tulajdonsággal.

## Esettanulmány: egy kis webshop

> _„Vásárlóink regisztrálnak (név, e-mail, több szállítási cím is lehet). Termékeket árulunk kategóriákba sorolva; egy kategóriának lehet alkategóriája (Számítástechnika → Perifériák → Egerek). Egy rendelésben több termék lehet, különböző mennyiségben. A termék ára változhat, de a rendelésen a vásárláskori ár számít. A vásárlók értékelhetik a megvásárolt termékeket (1–5 csillag, szöveg).”_

### Egyedek és tulajdonságok

| Egyed       | Tulajdonságok                                      | Megjegyzés                                     |
| ----------- | -------------------------------------------------- | ---------------------------------------------- |
| Vásárló     | **vasarlo_id**, nev, email                         | a „több szállítási cím” többértékű!            |
| Cím         | **cim_id**, irsz, varos, utca                      | a többértékű tulajdonságból lett egyed         |
| Kategória   | **kategoria_id**, nev                              | önmagával kapcsolatban áll (alkategória)       |
| Termék      | **termek_id**, nev, aktualis_ar                    |                                                |
| Rendelés    | **rendeles_id**, datum, statusz                    | a végösszeg **származtatott** (tételekből)     |
| Értékelés   | **vasarlo + termek**, csillag, szoveg              | kapcsolat saját tulajdonságokkal               |

### Kapcsolatok

```text
  VASARLO ──1:N── CIM
  VASARLO ──1:N── RENDELES ──N:M── TERMEK ──N:1── KATEGORIA ─┐
                   (tetel: db, egysegar)                ▲     │ szülő (1:N, rekurzív)
  VASARLO ──N:M── TERMEK  (ertekeles: csillag, szoveg)  └─────┘
```

Három tanulság rögtön látszik:

1. A **rendelés–termék** kapcsolatnak saját tulajdonsága van (`db`, `egysegar`) – a kapcsolótáblába kerülnek.
2. Az **egységár** a tételben is ott van, pedig a terméknek is van ára. Ez **nem** redundancia: a tétel a vásárláskori árat őrzi (történeti adat), a termék az aktuálisat.
3. A **végösszeg** kiszámolható a tételekből (`SUM(db * egysegar)`), ezért nem tároljuk.

## Rekurzív kapcsolat: egy egyedhalmaz önmagával

Rekurzív (önmagára mutató) kapcsolat akkor van, amikor ugyanannak az egyedhalmaznak két eleme kapcsolódik egymáshoz. Példák:

- **kategória → szülőkategória** (1:N): minden kategóriának legfeljebb egy szülője van;
- **dolgozó → főnök** (1:N): minden dolgozónak legfeljebb egy közvetlen főnöke van;
- **tárgy → előfeltétel** (N:M): egy tárgynak több előfeltétele lehet, és egy tárgy több tárgynak is előfeltétele.

A kapcsolatban a két „szerepet” (szülő–gyerek, főnök–beosztott) mindig nevezd meg, különben összekevered az irányt.

### 1:N rekurzió: idegen kulcs ugyanarra a táblára

```sql run
CREATE TABLE kategoriak (
  kategoria_id INT PRIMARY KEY,
  nev          VARCHAR(40) NOT NULL,
  szulo_id     INT REFERENCES kategoriak (kategoria_id)  -- önmagára mutat; NULL = főkategória
);
INSERT INTO kategoriak VALUES
  (1, 'Számítástechnika', NULL),
  (2, 'Perifériák', 1),
  (3, 'Egerek', 2),
  (4, 'Billentyűzetek', 2),
  (5, 'Háztartás', NULL);

-- Önmagával összekapcsolás: minden kategória a szülője nevével
SELECT gy.nev AS kategoria, sz.nev AS szulo
FROM kategoriak gy
LEFT JOIN kategoriak sz ON sz.kategoria_id = gy.szulo_id
ORDER BY gy.kategoria_id;
```

A trükk: ugyanazt a táblát **kétszer** vesszük fel, két különböző álnévvel (`gy` = gyerek, `sz` = szülő), mintha két külön tábla lenne. A `LEFT JOIN` azért kell, hogy a szülő nélküli főkategóriák is megjelenjenek. (A tetszőleges mélységű bejárást – pl. „az Egerek összes őse” – a 12. témakör rekurzív lekérdezései oldják meg.)

### N:M rekurzió: kapcsolótábla két idegen kulccsal ugyanarra a táblára

Az előfeltételeknél egy tárgynak több előfeltétele is lehet, ezért kapcsolótábla kell, amelynek **mindkét** idegen kulcsa a `targyak` táblára mutat. Ezt a lecke feladatában te írod meg.

## Háromágú kapcsolat

Néha egy tény **három** egyedet köt össze egyszerre. Példa: _„Melyik oktató melyik tárgyat melyik teremben tartja?”_

```text
         OKTATO
            │
        (tanitas) ── TEREM
            │
          TARGY
```

Miért nem elég három kétágú kapcsolat (oktató–tárgy, tárgy–terem, oktató–terem)? Mert a háromból **nem rakható vissza** az eredeti tény. Ha Kovács tanítja az ADB-t és a DIG-et, az ADB-t a 101-ben és a 102-ben is tartják, és Kovács tanít a 101-ben és a 102-ben is, akkor nem tudjuk, hogy Kovács az ADB-t a 101-ben vagy a 102-ben tartja – vagy mindkettőben. A háromágú kapcsolatból egy kapcsolótábla lesz, három idegen kulccsal:

```sql
CREATE TABLE tanitas (
  oktato_id INT REFERENCES oktatok,
  kod       VARCHAR(6) REFERENCES targyak,
  terem     VARCHAR(10) REFERENCES termek,
  PRIMARY KEY (oktato_id, kod, terem)
);
```

## Specializáció (öröklődés)

Egy egyedhalmaznak lehetnek **altípusai**, amelyeknek a közös tulajdonságokon felül saját tulajdonságaik is vannak. Az egyetemen például minden **személynek** van neve és e-mail-címe, de a **hallgatónak** van szakja és féléve, az **oktatónak** pedig tanszéke és beosztása.

```text
              SZEMELY (id, nev, email)
                  │
            ┌─────┴─────┐  ("is-a" = „egyben egy…”)
        HALLGATO      OKTATO
        (szak, felev) (tanszek, beosztas)
```

Két kérdést kell megválaszolni:

- **Teljes vagy részleges?** Minden személy hallgató vagy oktató (teljes), vagy lehet más is, pl. adminisztrátor (részleges)?
- **Diszjunkt vagy átfedő?** Lehet valaki egyszerre hallgató és oktató (pl. doktorandusz)? Ha igen, átfedő.

### Három leképezési stratégia

| Stratégia                      | Táblák                                          | Előny                                         | Hátrány                                         |
| ------------------------------ | ----------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| **1. Egy közös tábla**         | `szemelyek(id, nev, email, tipus, szak, felev, tanszek, beosztas)` | egyszerű, nincs JOIN               | sok NULL; nehéz kikényszeríteni, hogy a hallgatónak legyen szakja |
| **2. Táblánként az altípus**   | `hallgatok(id, nev, email, szak, felev)`, `oktatok(id, nev, email, tanszek, beosztas)` | nincs NULL | a közös oszlopok ismétlődnek; „minden személy” lekérdezéséhez UNION kell; átfedésnél duplikáció |
| **3. Szülő + gyerek táblák**   | `szemelyek(id, nev, email)`, `hallgatok(id → szemelyek, szak, felev)`, `oktatok(id → szemelyek, tanszek, beosztas)` | tiszta, nincs ismétlődés, átfedés is megy | az altípus adataihoz JOIN kell |

Melyik a jó? **Attól függ** – és ez nem kibúvó:

- kevés altípus-specifikus oszlop, sok közös lekérdezés → **1.**;
- az altípusokat szinte mindig külön kérdezik le, nincs átfedés → **2.**;
- sok saját oszlop, átfedés lehetséges, fontos a tisztaság → **3.** (ez a leggyakoribb „tankönyvi” választás).

```sql run
-- 3. stratégia: szülő és gyerek tábla, a gyerek kulcsa egyben idegen kulcs
CREATE TABLE szemelyek (id INT PRIMARY KEY, nev VARCHAR(60) NOT NULL);
CREATE TABLE hallg  (id INT PRIMARY KEY REFERENCES szemelyek, szak VARCHAR(30));
CREATE TABLE oktat  (id INT PRIMARY KEY REFERENCES szemelyek, tanszek VARCHAR(30));
INSERT INTO szemelyek VALUES (1, 'Kiss Anna'), (2, 'Dr. Kovács Péter'), (3, 'Tóth Gergő');
INSERT INTO hallg VALUES (1, 'mérnökinformatikus'), (3, 'mérnökinformatikus');
INSERT INTO oktat VALUES (2, 'Informatika'), (3, 'Informatika');   -- Gergő doktorandusz: mindkettő!

SELECT s.nev,
       h.szak, o.tanszek,
       CASE WHEN h.id IS NOT NULL AND o.id IS NOT NULL THEN 'mindkettő'
            WHEN h.id IS NOT NULL THEN 'hallgató' ELSE 'oktató' END AS szerep
FROM szemelyek s
LEFT JOIN hallg h ON h.id = s.id
LEFT JOIN oktat o ON o.id = s.id
ORDER BY s.id;
```

## Többértékű és származtatott tulajdonság

- **Többértékű** (pl. egy vásárló több szállítási címe, egy hallgató több telefonszáma): **soha ne** tedd egy mezőbe vesszővel elválasztva (`'0630…, 0620…'`)! Külön tábla kell, idegen kulccsal. Ok: vesszős listában nem lehet keresni, indexelni, ellenőrizni – és sérti az 1. normálformát (6. témakör).
- **Származtatott** (pl. életkor a születési dátumból, végösszeg a tételekből): általában **nem tároljuk**, hanem lekérdezéskor számoljuk ki. Kivétel: történeti „befagyasztott” érték, vagy ha a számolás nagyon drága (16. témakör: materializált nézet).

## Gyakori modellezési hibák

- **Kapcsolat helyett tulajdonság:** a `rendelesek` táblában `termek1`, `termek2`, `termek3` oszlop. Mi van, ha valaki 4 terméket rendel? → kapcsolótábla.
- **Rossz irányú idegen kulcs 1:N-nél:** a kulcs mindig az **„N” oldalra** kerül (a rendelés hivatkozik a vásárlóra, nem fordítva).
- **Kapcsolat tulajdonsága rossz helyen:** a `db` nem a termék tulajdonsága (egy termékből különböző rendelésekben különböző mennyiség lehet), hanem a rendelés–termék kapcsolaté.
- **Az idő elfelejtése:** az „aktuális ár” és a „vásárláskori ár” két különböző adat.

## Összefoglalás

- A teljes modellezés: egyedek → tulajdonságok (többértékű? származtatott?) → kapcsolatok (számosság, saját tulajdonság) → táblák.
- **Rekurzív kapcsolat:** 1:N-nél idegen kulcs ugyanarra a táblára; N:M-nél kapcsolótábla két, ugyanarra a táblára mutató kulccsal; lekérdezés **önmagával összekapcsolással** (két álnév).
- **Háromágú kapcsolat:** nem bontható mindig három kétágúra; kapcsolótábla három kulccsal.
- **Specializáció:** egy tábla / altípusonként tábla / szülő + gyerek táblák – a lekérdezések és az átfedés dönt.

## A lecke feladata

Az egyetemi adatbázist bővítsd az **előfeltételekkel** (rekurzív N:M kapcsolat): a kiinduló kód létrehozza az `elofeltetelek` kapcsolótáblát (mindkét oszlopa a `targyak` táblára mutat), és feltölti két sorral (az ADB-hez kell a PROG, a DIG-hez a MAT).

Írd meg a lekérdezést, amely minden előfeltétel-párnál kiírja a **tárgy nevét** (`targy`) és az **előfeltétel nevét** (`elofeltetel`), a tárgy neve szerint rendezve! Ehhez a `targyak` táblát **kétszer** kell összekapcsolnod, két különböző álnévvel.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql starter required
CREATE TABLE elofeltetelek (
  kod             VARCHAR(6) REFERENCES targyak (kod),
  elofeltetel_kod VARCHAR(6) REFERENCES targyak (kod),
  PRIMARY KEY (kod, elofeltetel_kod),
  CHECK (kod <> elofeltetel_kod)          -- egy tárgy nem lehet önmaga előfeltétele
);
INSERT INTO elofeltetelek VALUES ('ADB', 'PROG'), ('DIG', 'MAT');

-- Írd meg a lekérdezést!
SELECT ...
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE elofeltetelek (
  kod             VARCHAR(6) REFERENCES targyak (kod),
  elofeltetel_kod VARCHAR(6) REFERENCES targyak (kod),
  PRIMARY KEY (kod, elofeltetel_kod),
  CHECK (kod <> elofeltetel_kod)
);
INSERT INTO elofeltetelek VALUES ('ADB', 'PROG'), ('DIG', 'MAT');

SELECT t.nev AS targy, e.nev AS elofeltetel
FROM elofeltetelek ef
JOIN targyak t ON t.kod = ef.kod
JOIN targyak e ON e.kod = ef.elofeltetel_kod
ORDER BY t.nev;
```

</details>
