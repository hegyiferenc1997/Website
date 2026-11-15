---
title: Gyakorlás – integráció és migráció
summary: Ellenőrző kérdések az ORM-ekről, az API-rétegről, az ETL-ről, a sémamigrációról és az adatmigrációról, majd egy költözési esettanulmány döntési kérdésekkel.
minutes: 25
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
