---
title: Gyakorlás – E-R modellezés
summary: Ellenőrző kérdések és egy teljes modellezési feladat (mozi jegyfoglalás) a követelményektől a táblákig.
minutes: 30
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
