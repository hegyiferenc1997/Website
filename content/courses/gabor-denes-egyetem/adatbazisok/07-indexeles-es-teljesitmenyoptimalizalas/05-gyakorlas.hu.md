---
title: Gyakorlás – indexelés
summary: Ellenőrző kérdések és egy indexelési esettanulmány: melyik lekérdezéshez milyen index kell, és melyik feltétel nem tudja használni az indexet.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem teszünk indexet minden oszlopra?</summary>

Mert minden index tárhelyet foglal, és **lassítja az írást**: minden `INSERT`, `UPDATE` és `DELETE` az összes érintett indexet is frissíti. A nem használt index csak teher.

</details>

<details>
<summary>2. Miért nem használható a dátum indexe ennél a feltételnél: <code>WHERE EXTRACT(YEAR FROM datum) = 2026</code>?</summary>

Mert az index a `datum` értékei szerint rendezett, a feltétel viszont egy belőle **kiszámolt** értékre (az évre) keres. Írd át tartományra: `WHERE datum >= '2026-01-01' AND datum < '2027-01-01'` – ezt már az index ki tudja szolgálni.

</details>

<details>
<summary>3. Van egy <code>(varos, regisztralt)</code> összetett index. Melyik lekérdezés tudja használni: a csak városra, vagy a csak regisztrációs dátumra szűrő?</summary>

A csak **városra** szűrő. Az összetett index a bal oldali előtag szerint használható (mint a telefonkönyv vezetéknévre), a második oszlopra önmagában nem.

</details>

<details>
<summary>4. Miért választhat a DBMS teljes táblaolvasást akkor is, ha van index?</summary>

Mert ha a feltétel a sorok nagy részét visszaadja (rossz szelektivitás), vagy a tábla kicsi, olcsóbb egyszerre végigolvasni mindent, mint az indexen keresztül ide-oda ugrálni. Az optimalizáló a költségbecslés alapján dönt.

</details>

<details>
<summary>5. Miért érdemes az idegen kulcsokra indexet tenni?</summary>

Mert a JOIN-ok jellemzően az idegen kulcs mentén kapcsolják össze a táblákat, és a szülő sor törlésekor a DBMS-nek meg kell keresnie a rá hivatkozó gyerek sorokat. Index nélkül mindkettő teljes táblaolvasás.

</details>

## Esettanulmány: a webshop lassú oldalai

A webshop fejlesztői a következő lekérdezéseket gyűjtötték össze. A `rendelesek` táblán jelenleg csak az elsődleges kulcs indexe van.

```text
 A) SELECT * FROM rendelesek WHERE vasarlo_id = ? ORDER BY datum DESC;
 B) SELECT * FROM rendelesek WHERE statusz = 'szállítás' AND datum < ?;
 C) SELECT * FROM vasarlok WHERE email LIKE '%@pelda.hu';
 D) SELECT * FROM rendelesek WHERE datum >= '2026-01-01' AND datum < '2026-02-01';
```

```quiz required
? Melyik index szolgálja ki a legjobban az A) lekérdezést (szűrés és rendezés)?
- (datum)
- (datum, vasarlo_id)
+ (vasarlo_id, datum)
- (statusz)
! Elöl az egyenlőséggel szűrt oszlop, utána a rendezés oszlopa.

? A B) lekérdezés mindig csak a „szállítás” státuszú rendelésekre vonatkozik. Milyen index illik hozzá a legjobban?
- egyedi index a statuszra
+ részleges index: (datum) WHERE statusz = 'szállítás'
- kifejezés alapú index: LOWER(statusz)
- nem kell index
! Kicsi, és pont a szükséges sorokat tartalmazza.

? Tud-e egy sima B-fa index az `email` oszlopon segíteni a C) lekérdezésen?
- igen, mindig
+ nem, mert a minta % jellel kezdődik
! A B-fa a szöveg elejére rendezett.

? A D) lekérdezés tartományra szűr. Melyik index segíti?
+ (datum)
- (vasarlo_id)
- (statusz, vasarlo_id)
! A B-fa tartományokra is jó.

? Egy 2 000 000 soros táblában bináris kereséssel kb. hány lépésben találunk meg egy értéket (log₂, egészre kerekítve felfelé)?
= 21
! 2^21 = 2 097 152.

? A tábla 30 sorból áll. Mit fog valószínűleg választani az optimalizáló index létezése esetén is?
+ Seq Scan
- Index Scan
! Kis táblánál a teljes olvasás olcsóbb.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

A feladatok a webshop mintaadatbázisán futnak (5000 vásárló, 20 000 rendelés, 40 000 tétel), így az indexeknek már tényleg van jelentőségük. Bármelyik lekérdezés elé odaírhatod az `EXPLAIN`-t, hogy lásd, mit választ a tervező.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

**1.** **Egyszerű index.** A termékoldalon gyakran szűrünk kategóriára. Hozz létre indexet a `termekek.kategoria` oszlopra, majd kérdezd le a `periféria` kategória termékeit (név, ár) ár szerint!

```sql starter
SELECT nev, ar
FROM termekek
WHERE kategoria = 'periféria'
ORDER BY ar;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX idx_termekek_kategoria ON termekek (kategoria);

SELECT nev, ar
FROM termekek
WHERE kategoria = 'periféria'
ORDER BY ar;
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'termekek' AND indexdef LIKE '%(kategoria)%') AS index_van,
       (SELECT string_agg(nev, ', ' ORDER BY ar) FROM termekek WHERE kategoria = 'periféria') AS termekek;
```

**2.** **Részleges index.** A raktár csak a **szállítás alatt** álló rendeléseket keresi dátum szerint; a kész és törölt rendelésekre nincs szükség az indexben. Hozz létre **részleges indexet** a `rendelesek (datum)` oszlopra `WHERE statusz = 'szállítás'` feltétellel!

```sql starter
CREATE INDEX idx_szallitas ON rendelesek (datum);
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX idx_szallitas ON rendelesek (datum)
WHERE statusz = 'szállítás';            -- csak ezek a sorok kerülnek az indexbe → kisebb, gyorsabb
```

</details>

```sql test
SELECT COUNT(*) AS reszleges_index
FROM pg_indexes
WHERE tablename = 'rendelesek' AND indexdef LIKE '%(datum) WHERE%szállítás%';
```

**3.** **Kifejezésindex.** Bejelentkezéskor a felhasználó bárhogyan gépelheti az e-mail-címét (kis- vagy nagybetűvel), ezért a keresés `LOWER(email) = ...` formájú. Egy sima `email`-index ezt nem tudja kiszolgálni. Hozz létre indexet a `LOWER(email)` **kifejezésre**, majd keresd meg a `Vasarlo42@Pelda.hu` címhez tartozó vásárló azonosítóját és nevét!

```sql starter
SELECT vasarlo_id, nev
FROM vasarlok
WHERE LOWER(email) = LOWER('Vasarlo42@Pelda.hu');
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE INDEX idx_vasarlok_email_lower ON vasarlok (LOWER(email));   -- pontosan a keresett kifejezés

SELECT vasarlo_id, nev
FROM vasarlok
WHERE LOWER(email) = LOWER('Vasarlo42@Pelda.hu');
```

</details>

```sql test
SELECT (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'vasarlok' AND indexdef LIKE '%lower%') AS kifejezesindex,
       (SELECT nev FROM vasarlok WHERE LOWER(email) = 'vasarlo42@pelda.hu') AS nev;
```

**4.** **„A legutóbbi 5” lekérdezés.** A „Rendeléseim” oldal a 42-es vásárló **5 legújabb** rendelését mutatja (azonosító, dátum, állapot), a legújabbal kezdve; azonos dátumnál a nagyobb azonosító előbb. (Egy `(vasarlo_id, datum)` összetett index pont ezt szolgálná ki rendezés nélkül.)

```sql starter
SELECT rendeles_id, datum, statusz
FROM rendelesek
WHERE vasarlo_id = 42;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT rendeles_id, datum, statusz
FROM rendelesek
WHERE vasarlo_id = 42
ORDER BY datum DESC, rendeles_id DESC
LIMIT 5;
```

</details>

**5.** **Index-kiválasztás számokkal.** Mekkora a **szelektivitás**? Számold ki, a rendelések hány százaléka (1 tizedesre kerekítve) `törölt`, `szállítás` és `kész` állapotú! (Minél kisebb a százalék, annál jobban megéri indexszel keresni.) Állapot szerint rendezve.

```sql starter
SELECT statusz, COUNT(*)
FROM rendelesek
GROUP BY statusz;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT statusz,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM rendelesek), 1) AS szazalek
FROM rendelesek
GROUP BY statusz
ORDER BY statusz;
```

</details>
