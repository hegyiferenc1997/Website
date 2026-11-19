---
title: Gyakorlás – indexelés
summary: Ellenőrző kérdések és egy indexelési esettanulmány: melyik lekérdezéshez milyen index kell, és melyik feltétel nem tudja használni az indexet.
minutes: 25
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
