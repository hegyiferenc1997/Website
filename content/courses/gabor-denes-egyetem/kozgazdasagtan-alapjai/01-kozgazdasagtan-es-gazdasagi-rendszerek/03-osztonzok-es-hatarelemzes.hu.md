---
title: Ösztönzők és határelemzés
summary: Hogyan gondolkodik egy közgazdász? Racionális döntés, határhaszon és határköltség, elsüllyedt költség, ösztönzők és a csere előnyei.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mit jelent a **racionális döntés**,
- hogyan működik a **határelemzés** („még egy egység megéri-e?”),
- miért nem számít az **elsüllyedt költség**,
- hogyan alakítják a viselkedést az **ösztönzők**,
- miért jó mindenkinek a **csere** és a **munkamegosztás**.

## Racionális döntés

A közgazdaságtan alapfeltevése, hogy a szereplők **racionálisan** döntenek: a lehetőségeik közül azt választják, amelynél a **haszon és a költség különbsége** a legnagyobb.

Ez nem jelenti, hogy mindenki tökéletes számítógép. A **viselkedési közgazdaságtan** (Kahneman, Thaler) megmutatta, hogy gyakran tévedünk: halogatunk, túlbecsüljük a jelent, a keretezés befolyásol. A racionális modell mégis jó kiindulópont.

## Határelemzés: „még egy egység?”

A döntések többsége nem „mindent vagy semmit”, hanem „**egy kicsivel több vagy kevesebb**”.

- **Határhaszon** (_marginal benefit_): mennyivel nő a haszon, ha még egy egységet választunk.
- **Határköltség** (_marginal cost_): mennyivel nő a költség ugyanettől.

**Szabály:** addig érdemes növelni a tevékenységet, amíg a **határhaszon ≥ határköltség**.

**Példa:** egy felhős szolgáltatásban óránként 400 Ft egy GPU-példány. A modelltanítás egyes óráinak várható haszna (pl. pontosság-javulás forintban):

| Óra               | 1.   | 2.  | 3.  | 4.  | 5.  |
| ----------------- | ---- | --- | --- | --- | --- |
| Határhaszon (Ft)  | 1500 | 900 | 500 | 300 | 100 |
| Határköltség (Ft) | 400  | 400 | 400 | 400 | 400 |

Az első 3 órában a határhaszon nagyobb a 400 Ft-nál, a 4. óra már nem éri meg. **Optimum: 3 óra.**

A határhaszon általában **csökken** (az első pizzaszelet jobban esik, mint a negyedik) – ezt a 4. témakörben részletezzük.

## Elsüllyedt költség

**Elsüllyedt költség** (_sunk cost_): már kifizetett, vissza nem szerezhető költség. A racionális döntésnél **nem számít**, mert bármit döntesz, nem kapod vissza.

> Egy csapat már 2 évet és 50 millió Ft-ot költött egy szoftverre, amely egyértelműen nem fog működni. „De már annyit beletettünk!” – ez az **elsüllyedt költség csapdája**. A helyes kérdés: a **mostantól** felmerülő költségekért cserébe mennyi haszon várható?

## Ösztönzők

Az emberek reagálnak az **ösztönzőkre** – a haszon vagy a költség megváltozására.

- Ha drágul a benzin, többen járnak tömegközlekedéssel.
- Ha a bugvadászatért (_bug bounty_) jutalom jár, több hibát jelentenek be.
- Ha egy fejlesztőt a megírt sorok száma alapján fizetnek, hosszú, bőbeszédű kódot fog írni.

Az utolsó a **rosszul tervezett ösztönző** példája (Goodhart törvénye: ha egy mutatóból cél lesz, megszűnik jó mutató lenni).

## A csere és a munkamegosztás előnyei

A csere **nem zéróösszegű játék**: önkéntes cserénél mindkét fél jobban jár, különben nem cserélnének.

- **Munkamegosztás, specializáció**: ha mindenki arra szakosodik, amiben viszonylag a legjobb, összesen többet termelünk. Egy csapatban nem mindenki ír backendet, frontendet és tesztet egyszerre.
- Ennek mélyebb elve a **komparatív előny**, amelyet a 9. témakörben a nemzetközi kereskedelemnél részletezünk.

## Összefoglalás

- Racionális döntés: a haszon és a költség különbségének maximalizálása.
- Határelemzés: addig érdemes folytatni, amíg a határhaszon ≥ határköltség.
- Az elsüllyedt költség a döntésnél nem számít.
- Az emberek reagálnak az ösztönzőkre – a rosszul tervezett ösztönző visszafelé sülhet el.
- Az önkéntes csere mindkét félnek előnyös; a specializáció növeli a termelést.

## A lecke feladata

```quiz required
? Meddig érdemes egy tevékenységet növelni a határelemzés szerint?
- amíg a teljes haszon pozitív
+ amíg a határhaszon legalább akkora, mint a határköltség
- amíg el nem fogy a pénz
- mindig a lehető legtovább
! MB ≥ MC.

? A fenti táblázatban 600 Ft-ra drágul egy GPU-óra. Hány órát érdemes futtatni?
= 2
= 2 óra
! 1500 és 900 > 600, de 500 < 600.

? Már kifizettél egy 8000 Ft-os, vissza nem váltható koncertjegyet, de aznap beteg vagy. Mi az elsüllyedt költség?
- a koncert élménye
+ a 8000 Ft-os jegyár
- a gyógyszer ára
- semmi
! Bármit döntesz, a 8000 Ft nem jön vissza – a döntésnél nem számít.

? Egy cég a lezárt hibajegyek száma alapján jutalmazza a tesztelőket. Mi a valószínű mellékhatás?
- kevesebb hibajegy lesz
+ apró, jelentéktelen hibajegyek tömege
- a fejlesztők többet keresnek
- semmi
! Rosszul tervezett ösztönző – Goodhart törvénye.

? Mi igaz az önkéntes cserére?
- az egyik fél mindig veszít
+ mindkét fél jobban jár, különben nem cserélnének
- csak az eladó nyer
- csak pénzzel működik
! A csere nem zéróösszegű játék.
```
