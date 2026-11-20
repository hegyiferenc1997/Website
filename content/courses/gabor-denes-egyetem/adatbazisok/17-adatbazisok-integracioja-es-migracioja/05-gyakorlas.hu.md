---
title: Gyakorlás – integráció és migráció
summary: Ellenőrző kérdések az ORM-ekről, az API-rétegről, az ETL-ről, a sémamigrációról és az adatmigrációról, majd egy költözési esettanulmány döntési kérdésekkel.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért fontos, hogy az alkalmazás ne szuperfelhasználóként kapcsolódjon, és a jelszó ne a kódban legyen?</summary>

A legkisebb jogosultság elve miatt: ha az alkalmazásban hiba van, vagy a jelszó kiszivárog, a támadó csak annyit tehet, amennyit a korlátozott fiók enged. A kódba írt jelszó pedig a verziókezelővel mindenkihez eljut, aki a kódot látja, és a git-előzményekből sem tűnik el.

</details>

<details>
<summary>2. Mit nyerünk azzal, ha a többi rendszer egy API-n keresztül éri el az adatbázist?</summary>

A szabályok és a jogosultság-ellenőrzés egy helyen vannak, a belső séma szabadon változhat, amíg az API ugyanaz marad, és a hozzáférés naplózható, korlátozható. A rendszerek nem törik el egymást egy oszlop átnevezésével.

</details>

<details>
<summary>3. Miért nem szabad egy már lefutott migrációs fájlt módosítani?</summary>

Mert a migrációs eszköz már lefutottnak jelöli, és a módosítást a többi környezetben (ahol már lefutott) soha nem futtatná újra – így a környezetek sémája eltérne egymástól. A hibát egy új migrációval kell javítani.

</details>

<details>
<summary>4. Hogyan neveznél át biztonságosan egy oszlopot egy élő rendszerben?</summary>

A „bővít, majd szűkít” mintával: új oszlop létrehozása, az alkalmazás mindkettőbe ír, a régi adatok átmásolása, az olvasás átállítása az új oszlopra, végül – amikor már semmi sem használja – a régi oszlop törlése. Egy azonnali `RENAME` a még futó régi kódot eltörné.

</details>

<details>
<summary>5. Milyen ellenőrzéseket végeznél egy adatmigráció után?</summary>

Darabszám-egyezés a forrás és a cél között, fontos összegek (pl. számlák végösszege) összevetése, ellenőrzőösszeg a kulcsmezőkre, szúrópróbák, az elutasított sorok hibatáblájának átnézése, és végül az alkalmazás tesztelése az új adatokon.

</details>

## Esettanulmány: egy tanulmányi rendszer költözése

Egy egyetem a húszéves, saját fejlesztésű tanulmányi programját (régi adatbázissal) egy új, PostgreSQL-alapú rendszerre cseréli. 30 000 hallgató, 2 millió jegybejegyzés. A félév közben nem állhat le a rendszer hosszabb időre.

```quiz required
? Mi legyen a migráció első lépése?
+ leltár: milyen adatok vannak, hol, milyen minőségben, és ki használja őket
- azonnal átmásolni minden táblát az új rendszerbe
- törölni a régi rendszer adatait, hogy ne legyen kavarodás
- megvenni a legerősebb szervert
! Az alapos felmérés nélkül a leképezés és a tisztítás is vakrepülés.

? A régi rendszerben a dátumok „2005.03.14” formátumú szövegek. Mi a helyes megoldás az új rendszerben?
- szövegként átvenni, ahogy van
+ `DATE` típusú oszlop, és betöltéskor `to_date(…, 'YYYY.MM.DD')` átalakítás
- három külön szám oszlop (év, hónap, nap)
! A dátum típus ellenőrzi az érvényességet, és jól rendezhető.

? A betöltés után a forrásban 2 000 000, a célban 1 999 412 jegybejegyzés van. Mi a teendő?
- semmi, ez elhanyagolható különbség
+ megkeresni és elemezni a hiányzó 588 sort (pl. a hibatáblából), és javítani a szkriptet
- a forrásból is törölni 588 sort
- újraindítani a szervert
! Csendben elveszett adat egy tanulmányi rendszerben elfogadhatatlan.

? Melyik átállási stratégia illik a legjobban, ha a rendszer félév közben nem állhat le hosszabb időre?
- egyszerre (big bang), egy hétköznap délelőtt
+ párhuzamos írás vagy változáskövetés (CDC), majd átkapcsolás egy rövid ablakban
- először lekapcsolni a régit, aztán elkezdeni a migrációt
! Így a két rendszer egy ideig szinkronban fut, és az átkapcsolás rövid.

? Az új rendszer élesítése után egy héttel súlyos hiba derül ki. Mi kell ahhoz, hogy ezt túléljük?
+ előre kidolgozott visszaállási terv, és a régi rendszer adatainak megőrzése, amíg az új nem bizonyított
- a régi rendszer azonnali törlése az átállás napján
- semmi, hiba nem fordulhat elő
! Mindig legyen B terv.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

Egy régi rendszerből exportált, „koszos” termékadatokat kell betöltenünk. Az adatok egy csupa szöveges **staging táblában** vannak.

<details>
<summary>A staging tábla létrehozása (SQL)</summary>

```sql setup
-- Staging: minden oszlop szöveg, nincs megszorítás – úgy, ahogy a fájlban volt.
CREATE TABLE stg_termekek (kod TEXT, nev TEXT, ar TEXT, felvetel TEXT, cikkszam TEXT);
INSERT INTO stg_termekek VALUES
  ('1', '  vezeték nélküli EGÉR ', '4990',     '2024.03.01.', 'ABC-1234'),
  ('2', 'Billentyűzet',            '24 990',   '2024-05-12',  'ABC-2345'),
  ('3', 'monitor   27 colos',      '69990 Ft', '12/06/2024',  'XYZ-99'),
  ('4', 'Webkamera',               'n/a',      '2024-07-30',  'ABC-4567'),
  ('5', 'fejhallgató',             '15990',    '',            'abc-5678');
```

</details>

**1.** **Nevek rendbetétele.** Tisztítsd meg a termékneveket: szóközök levágása a végekről, a belső ismétlődő szóközök egyetlenre cserélése, és **nagy kezdőbetű** minden szónál (`initcap`). (Kód egészként, tiszta név; kód szerint.)

```sql starter
SELECT kod, nev
FROM stg_termekek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod::INT AS kod,
       initcap(regexp_replace(TRIM(nev), '\s+', ' ', 'g')) AS nev
FROM stg_termekek
ORDER BY kod;
```

</details>

**2.** **Árak számmá alakítása.** Az árakban szóköz, `Ft` és értelmetlen érték (`n/a`) is van. Távolíts el minden **nem számjegy** karaktert, és alakítsd egésszé; ahol így üres szöveg marad, ott legyen `NULL` (a `NULLIF` segít). (Kód, eredeti ár, tiszta ár; kód szerint.)

```sql starter
SELECT kod, ar
FROM stg_termekek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod::INT AS kod, ar,
       NULLIF(regexp_replace(ar, '[^0-9]', '', 'g'), '')::INT AS tiszta_ar   -- '[^0-9]': minden, ami nem számjegy
FROM stg_termekek
ORDER BY kod;
```

</details>

**3.** **Dátumok több formátumból.** A felvétel dátuma háromféle formában szerepel (`ÉÉÉÉ-HH-NN`, `ÉÉÉÉ.HH.NN.`, `NN/HH/ÉÉÉÉ`) vagy üres. Alakítsd mindet `DATE`-té `CASE`-szel és reguláris kifejezésekkel; ami egyik mintára sem illik, legyen `NULL`. (Kód, dátum; kód szerint.)

```sql starter
SELECT kod, felvetel
FROM stg_termekek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod::INT AS kod,
       CASE
         WHEN felvetel ~ '^\d{4}-\d{2}-\d{2}$'     THEN to_date(felvetel, 'YYYY-MM-DD')
         WHEN felvetel ~ '^\d{4}\.\d{2}\.\d{2}\.$' THEN to_date(felvetel, 'YYYY.MM.DD.')
         WHEN felvetel ~ '^\d{2}/\d{2}/\d{4}$'     THEN to_date(felvetel, 'DD/MM/YYYY')
       END AS felvetel                              -- ELSE nélkül a CASE NULL-t ad
FROM stg_termekek
ORDER BY kod;
```

</details>

**4.** **Elutasított sorok naplója.** A cikkszám helyes formája: **3 nagybetű, kötőjel, 4 számjegy** (pl. `ABC-1234`). Gyűjtsd ki a hibás cikkszámú sorokat a hiba okával együtt (kód, cikkszám, `'hibás cikkszám'`), kód szerint!

```sql starter
SELECT kod, cikkszam
FROM stg_termekek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT kod::INT AS kod, cikkszam, 'hibás cikkszám' AS ok
FROM stg_termekek
WHERE cikkszam !~ '^[A-Z]{3}-\d{4}$'       -- !~ : NEM illeszkedik a mintára
ORDER BY kod;
```

</details>

**5.** **Egyeztetés betöltés után.** A célrendszerbe betöltött `termekek_cel` táblát össze kell vetni a forrással. Add meg egy sorban: a forrás és a cél **sorainak számát**, valamint hogy az **árak összege** egyezik-e (igaz/hamis)! A forrásnál csak a számmá alakítható árakat összegezd.

```sql starter
CREATE TABLE termekek_cel (kod INT PRIMARY KEY, ar INT);
INSERT INTO termekek_cel VALUES (1, 4990), (2, 24990), (3, 69990), (4, NULL), (5, 1599);

SELECT COUNT(*) FROM termekek_cel;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE termekek_cel (kod INT PRIMARY KEY, ar INT);
INSERT INTO termekek_cel VALUES (1, 4990), (2, 24990), (3, 69990), (4, NULL), (5, 1599);

SELECT (SELECT COUNT(*) FROM stg_termekek) AS forras_sorok,
       (SELECT COUNT(*) FROM termekek_cel) AS cel_sorok,
       (SELECT SUM(NULLIF(regexp_replace(ar, '[^0-9]', '', 'g'), '')::INT) FROM stg_termekek) =
       (SELECT SUM(ar) FROM termekek_cel) AS osszeg_egyezik;   -- hamis: az 5-ös termék ára elveszett egy jegyet!
```

</details>
