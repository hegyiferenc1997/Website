---
title: Gyakorlás – E-R modellezés
summary: Ellenőrző kérdések és egy teljes modellezési feladat (mozi jegyfoglalás) a követelményektől a táblákig.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért mondjuk, hogy az E-R modell fogalmi modell?</summary>

Mert a valóság **fogalmait** és összefüggéseit írja le (egyedek, tulajdonságok, kapcsolatok), technikai részletek – adattípusok, indexek, konkrét DBMS – nélkül. Ezért a megrendelővel is meg lehet beszélni, és bármilyen relációs rendszerre átalakítható.

</details>

<details>
<summary>2. Mi a különbség a számosság és a részvétel között?</summary>

A számosság a **felső határ** (legfeljebb hány kapcsolódó egyed lehet: egy vagy sok), a részvétel az **alsó** (kötelező-e legalább egy). Például: „egy oktató **pontosan egy** tanszékhez tartozik” = 1-es felső határ, kötelező részvétel.

</details>

<details>
<summary>3. Miért nem jó, ha az életkort oszlopként tároljuk?</summary>

Mert **származtatott** adat: a születési dátumból bármikor kiszámítható, viszont minden születésnapon változik. Ha tároljuk, valakinek minden nap frissítenie kellene, különben ellentmondásba kerül a születési dátummal.

</details>

<details>
<summary>4. Miért gyenge egyed egy rendelés „tétele”?</summary>

Mert a tétel sorszáma (1., 2., 3. tétel) csak az adott rendelésen belül egyedi; önmagában nem azonosítja a tételt. Kulcsa: rendelésszám + tételszám, és ha a rendelést töröljük, a tételei is értelmüket vesztik.

</details>

<details>
<summary>5. Hogyan alakítasz táblává egy ternáris kapcsolatot (oktató – tanít – tárgy – terem)?</summary>

Ugyanúgy, mint az N : M kapcsolatot: egy új táblába kerül mindhárom egyed kulcsa idegen kulcsként (és a kapcsolat tulajdonságai, pl. időpont). Az elsődleges kulcs a kulcsok (és szükség esetén az időpont) kombinációja.

</details>

## Összefoglaló feladat: mozi jegyfoglalás

> Egy mozi **filmeket** vetít (cím, hossz percben, korhatár). A mozinak több **terme** van (teremszám, férőhely). Egy **vetítés** egy adott filmet egy adott teremben egy adott időpontban mutat be. A **nézők** (név, e-mail) **foglalásokat** adnak le vetítésekre; egy foglalásban több **ülőhely** is lehet (sor, szék). Egy néző több e-mail címet nem adhat meg.

Tervezd meg fejben (vagy papíron) az E-R modellt és a táblákat, majd válaszolj!

```quiz required
? Milyen számosságú a film és a vetítés kapcsolata?
- 1 : 1
+ 1 : N
- N : M
! Egy filmnek sok vetítése van, egy vetítés egy filmet mutat be.

? Melyik táblába kerül a `film_id` idegen kulcs?
- filmek
+ vetitesek
- termek
- nezok
! A „sok” oldalra (vetítés).

? A néző és a vetítés közötti foglalás N : M jellegű (egy néző sok vetítésre, egy vetítésre sok néző). Mi lesz belőle a táblákban?
- egy idegen kulcs a nézők táblájában
+ egy foglalasok tábla a néző és a vetítés kulcsával
- egy többértékű oszlop a vetítések táblájában
- semmi
! Kapcsolótábla, saját azonosítóval vagy összetett kulccsal.

? Egy foglalásban több ülőhely is lehet. Hogyan tárolod az ülőhelyeket?
- egy szöveges oszlopban: „5/7, 5/8, 5/9”
- ules1, ules2, ules3 oszlopokban
+ külön táblában (foglalás azonosító, sor, szék)
! Többértékű adat → külön tábla.

? Milyen tulajdonság a „vetítés vége” időpont, ha a kezdés és a film hossza ismert?
- kulcs
- többértékű
+ származtatott
- összetett
! Kezdés + hossz: kiszámítható.

? Hány táblát kapsz összesen? (filmek, termek, vetitesek, nezok + amit a foglalás és az ülőhelyek igényelnek)
= 6
! filmek, termek, vetitesek, nezok, foglalasok, foglalt_helyek.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

**1.** **1:N kapcsolat lekérdezése.** Egy könyvtár szerzőit és könyveit tároljuk. Írd ki **minden szerzőhöz**, hány könyve van – azokat is, akiknek **egy sincs** (0-val)! Név szerint rendezve.

```sql starter
CREATE TABLE szerzok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
CREATE TABLE konyvek (
  id        INT PRIMARY KEY,
  cim       VARCHAR(60) NOT NULL,
  szerzo_id INT REFERENCES szerzok (id)
);
INSERT INTO szerzok VALUES (1, 'Jókai Mór'), (2, 'Szabó Magda'), (3, 'Örkény István');
INSERT INTO konyvek VALUES (1, 'Az arany ember', 1), (2, 'A kőszívű ember fiai', 1), (3, 'Az ajtó', 2);

SELECT s.nev, k.cim
FROM szerzok s JOIN konyvek k ON k.szerzo_id = s.id;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE szerzok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
CREATE TABLE konyvek (
  id        INT PRIMARY KEY,
  cim       VARCHAR(60) NOT NULL,
  szerzo_id INT REFERENCES szerzok (id)
);
INSERT INTO szerzok VALUES (1, 'Jókai Mór'), (2, 'Szabó Magda'), (3, 'Örkény István');
INSERT INTO konyvek VALUES (1, 'Az arany ember', 1), (2, 'A kőszívű ember fiai', 1), (3, 'Az ajtó', 2);

SELECT s.nev, COUNT(k.id) AS konyvek_szama     -- COUNT(k.id): a hiányzó (NULL) könyv 0-nak számít
FROM szerzok s
LEFT JOIN konyvek k ON k.szerzo_id = s.id      -- LEFT JOIN: a könyv nélküli szerző is marad
GROUP BY s.nev
ORDER BY s.nev;
```

</details>

**2.** **N:M kapcsolat kapcsolótáblával.** Diákok szakkörökre járnak; egy diák több szakkörre, egy szakkörre több diák. Hozd létre a `tagsag` kapcsolótáblát (`diak_id`, `szakkor_id`) **összetett elsődleges kulccsal** és **két idegen kulccsal**!

```sql starter
CREATE TABLE diakok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
CREATE TABLE szakkorok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO diakok VALUES (1, 'Anna'), (2, 'Béla');
INSERT INTO szakkorok VALUES (1, 'Robotika'), (2, 'Sakk');

CREATE TABLE tagsag (
  diak_id INT
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE diakok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
CREATE TABLE szakkorok (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO diakok VALUES (1, 'Anna'), (2, 'Béla');
INSERT INTO szakkorok VALUES (1, 'Robotika'), (2, 'Sakk');

CREATE TABLE tagsag (
  diak_id    INT REFERENCES diakok (id),
  szakkor_id INT REFERENCES szakkorok (id),
  PRIMARY KEY (diak_id, szakkor_id)          -- egy diák egy szakkörben csak egyszer
);
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
INSERT INTO eredmeny VALUES (1, 'Anna a robotikán', probal($q$INSERT INTO tagsag VALUES (1, 1)$q$));
INSERT INTO eredmeny VALUES (2, 'Anna a sakkon is', probal($q$INSERT INTO tagsag VALUES (1, 2)$q$));
INSERT INTO eredmeny VALUES (3, 'Anna kétszer a robotikán', probal($q$INSERT INTO tagsag VALUES (1, 1)$q$));
INSERT INTO eredmeny VALUES (4, 'nem létező szakkör', probal($q$INSERT INTO tagsag VALUES (2, 9)$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```

**3.** **Gyenge egyed.** Egy terem csak az épületével együtt azonosítható: az A épület 101-es terme más, mint a B épület 101-es terme. Hozd létre a `termek` táblát (`epulet_kod`, `teremszam`, `ferohely`) úgy, hogy a kulcs **az épület és a teremszám együtt** legyen, az épület pedig **idegen kulcs**!

```sql starter
CREATE TABLE epuletek (kod CHAR(1) PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO epuletek VALUES ('A', 'Főépület'), ('B', 'Labor');

CREATE TABLE termek (
  teremszam INT PRIMARY KEY
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE epuletek (kod CHAR(1) PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO epuletek VALUES ('A', 'Főépület'), ('B', 'Labor');

CREATE TABLE termek (
  epulet_kod CHAR(1) REFERENCES epuletek (kod),
  teremszam  INT,
  ferohely   INT,
  PRIMARY KEY (epulet_kod, teremszam)        -- a „tulajdonos” kulcsa + részleges kulcs
);
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
INSERT INTO eredmeny VALUES (1, 'A101', probal($q$INSERT INTO termek VALUES ('A', 101, 30)$q$));
INSERT INTO eredmeny VALUES (2, 'B101', probal($q$INSERT INTO termek VALUES ('B', 101, 20)$q$));
INSERT INTO eredmeny VALUES (3, 'A101 még egyszer', probal($q$INSERT INTO termek VALUES ('A', 101, 50)$q$));
INSERT INTO eredmeny VALUES (4, 'nem létező épület', probal($q$INSERT INTO termek VALUES ('C', 1, 10)$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```

**4.** **1:1 kapcsolat.** Minden személynek legfeljebb egy személyi igazolványa lehet. Hozd létre az `igazolvanyok` táblát (`szam` kulcs, `szemely_id`, `ervenyes` dátum) úgy, hogy egy személyhez **ne lehessen két igazolvány**!

```sql starter
CREATE TABLE szemelyek (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO szemelyek VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla');

CREATE TABLE igazolvanyok (
  szam VARCHAR(10) PRIMARY KEY
);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE szemelyek (id INT PRIMARY KEY, nev VARCHAR(40) NOT NULL);
INSERT INTO szemelyek VALUES (1, 'Kiss Anna'), (2, 'Nagy Béla');

CREATE TABLE igazolvanyok (
  szam       VARCHAR(10) PRIMARY KEY,
  szemely_id INT NOT NULL UNIQUE REFERENCES szemelyek (id),   -- a UNIQUE teszi 1:1-gyé
  ervenyes   DATE
);
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
INSERT INTO eredmeny VALUES (1, 'Anna igazolványa', probal($q$INSERT INTO igazolvanyok VALUES ('123456AB', 1, '2030-01-01')$q$));
INSERT INTO eredmeny VALUES (2, 'Anna második igazolványa', probal($q$INSERT INTO igazolvanyok VALUES ('654321CD', 1, '2031-01-01')$q$));
INSERT INTO eredmeny VALUES (3, 'Béla igazolványa', probal($q$INSERT INTO igazolvanyok VALUES ('111111EF', 2, '2029-06-30')$q$));
SELECT * FROM eredmeny ORDER BY sorszam;
```
