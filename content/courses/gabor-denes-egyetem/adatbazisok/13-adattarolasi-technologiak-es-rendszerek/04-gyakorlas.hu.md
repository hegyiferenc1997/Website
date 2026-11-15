---
title: Gyakorlás – adattárolás
summary: Ellenőrző kérdések a lemezekről, a RAID-ről, a tárolási architektúrákról és a mentésről, majd egy esettanulmány: tárolási és mentési terv egy webshop adatbázisához, számolós kérdésekkel.
minutes: 25
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
