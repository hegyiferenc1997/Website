---
title: Gyakorlás – értékelés és kockázat
summary: Ellenőrző kérdések és összefoglaló számolós feladatlap a negyedik témakörhöz.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég a megtérülési idő egy projekt értékeléséhez?</summary>

Mert nem veszi figyelembe a pénz időértékét, és azt sem, mennyi hasznot hoz a projekt a megtérülés után. Két, azonos megtérülési idejű projekt közül az egyik a megtérülés után még évekig hozhat, a másik semmit.

</details>

<details>
<summary>2. Miért diszkontáljuk a jövőbeli pénzáramokat?</summary>

Mert a mai pénz többet ér a jövőbelinél: befektethető (kamatozik), és a jövőbeli összeg bizonytalan. A diszkontálással a különböző időpontokban érkező összegek összehasonlíthatóvá válnak.

</details>

<details>
<summary>3. Mi a Stage-Gate előnye egy „mindent egyszerre fejlesztünk” megközelítéssel szemben?</summary>

A gyenge ötleteket a drága fejlesztési szakasz előtt kiszűri, így kevesebb pénz vész el; minden kapunál friss információ alapján lehet dönteni.

</details>

<details>
<summary>4. Mondj példát mind a négy válaszstratégiára egy mobilalkalmazás fejlesztésénél!</summary>

Elkerülés: nem építünk saját fizetési rendszert, hanem bevált szolgáltatót használunk. Áthárítás: a tárhelyet SLA-val bérelt felhőszolgáltató adja. Csökkentés: korai béta-teszt valódi felhasználókkal. Elfogadás: egy apró megjelenítési hibát a régi telefonokon tudatosan nem javítunk.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy MI-alapú ügyfélszolgálati rendszer 30 millió Ft-ba kerül, és évi 7,5 millió Ft bérköltséget takarít meg. Hány év a megtérülési idő?
= 4
= 4 év
! 30 / 7,5.

? Ugyanennek a rendszernek 5 év alatt összesen 37,5 millió Ft a megtakarítása. Hány százalék a ROI az 5 évre?
= 25
= 25%
! (37,5 − 30) / 30 · 100.

? 10%-os kamatláb mellett mennyi a jelenértéke a **két év múlva** kapott 121 egységnek?
= 100
! 121 / 1,1² = 121 / 1,21.

? Egy projekt: befektetés 100, egy év múlva 132 beáramlás, kamatláb 10%. Mennyi az NPV?
= 20
! 132 / 1,1 = 120; 120 − 100.

? Két kockázat: A (P = 2, I = 5) és B (P = 4, I = 4). Melyikkel foglalkozunk előbb?
- A, mert nagyobb a hatása
+ B, mert nagyobb a kockázati pontszáma (16 > 10)
- egyformán fontosak
- egyikkel sem kell foglalkozni
! A: 2 · 5 = 10, B: 4 · 4 = 16.

? Egy kockázat EMV-je 3 millió Ft, a valószínűsége 15%. Hány millió Ft a pénzbeli hatása?
= 20
= 20 millió
! EMV = P · hatás → hatás = 3 / 0,15.

? A Stage-Gate döntési lehetőségei közül melyik jelenti az ötlet végleges leállítását?
- go
+ kill
- hold
- recycle
! Go = tovább, kill = leállít, hold = felfüggeszt, recycle = átdolgoz.
```
