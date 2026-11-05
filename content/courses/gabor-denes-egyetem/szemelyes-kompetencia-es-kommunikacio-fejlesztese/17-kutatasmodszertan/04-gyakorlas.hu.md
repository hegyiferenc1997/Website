---
title: Gyakorlás – kutatásmódszertan
summary: Ellenőrző kérdések és összefoglaló feladatlap a kutatási folyamatról, az adatgyűjtésről és -elemzésről, valamint a forrásokról és a hivatkozásról; egy mini kutatás megtervezése.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Tervezz egy mini kutatást: mennyit alszanak az elsőéves mérnökinformatikus hallgatók vizsgaidőszakban?</summary>

Kutatási kérdés: „Hány órát alszanak átlagosan éjszakánként az elsőéves mérnökinformatikus hallgatók a vizsgaidőszakban a szorgalmi időszakhoz képest?” Módszer: kvantitatív kérdőív (két kérdés: alvásidő szorgalmi és vizsgaidőszakban), lehetőleg véletlen mintán az évfolyamból; névtelen kitöltés (társas kívánatosság csökkentése). Elemzés: átlag, medián, szórás a két időszakra. Korlátok: önbevallás, kényelmi minta esetén torzítás.

</details>

<details>
<summary>2. Írd át semlegesre: „Ugye ön is úgy gondolja, hogy az új felület sokkal jobb?”</summary>

„Hogyan értékeli az új felületet a régihez képest?” – vagy Likert-skálával: „Az új felület könnyebben használható, mint a régi. (1 – egyáltalán nem értek egyet … 5 – teljesen egyetértek)”.

</details>

<details>
<summary>3. Miért jobb a medián, mint az átlag a fizetések jellemzésére?</summary>

Mert a fizetések eloszlása általában ferde: néhány nagyon magas érték felhúzza az átlagot, így az nem a tipikus fizetést mutatja. A medián a középső érték, ezért kevésbé érzékeny a kiugró értékekre.

</details>

<details>
<summary>4. Egy MI-chatbot három cikket ajánl a szakdolgozatodhoz, szerzővel és évszámmal. Mit teszel?</summary>

Mindhármat megkeresem egy megbízható adatbázisban (Google Scholar, IEEE Xplore, egyetemi könyvtár). Ha nem létezik, nem használom. Ha létezik, elolvasom az eredetit, és abból hivatkozom, nem a chatbot összefoglalójából.

</details>

## Összefoglaló feladatlap

> Egy fejlesztőcsapat azt vizsgálja, hogy egy új, rövidebb bejelentkezési folyamat csökkenti-e a bejelentkezéshez szükséges időt. 10 tesztfelhasználó bejelentkezési ideje (másodperc): 8, 9, 10, 10, 11, 12, 12, 12, 14, 42.

```quiz required
? Mi ebben a vizsgálatban a **függő változó**?
- a bejelentkezési folyamat változata
+ a bejelentkezéshez szükséges idő
- a tesztfelhasználók neve
- a fejlesztőcsapat létszáma
! Amit mérnek.

? Mennyi az idők **átlaga** másodpercben?
= 14
! 140 / 10 = 14.

? Mennyi az idők **mediánja** másodpercben?
= 11,5
= 11.5
! A két középső érték (11 és 12) átlaga.

? Miért tér el ennyire az átlag és a medián?
- számolási hiba miatt
+ a 42 másodperces kiugró érték felhúzza az átlagot
- mert kevés a felhasználó
- mert a medián mindig kisebb
! A medián kevésbé érzékeny a kiugró értékekre.

? A csapat a tesztfelhasználókat a saját kollégái közül választotta. Melyik a fő kockázat?
+ mintavételi torzítás: a kollégák jobban ismerik a rendszert, mint a valódi felhasználók
- túlélési torzítás
- plágium
- túl nagy minta
! Kényelmi minta, nem reprezentatív.
```
