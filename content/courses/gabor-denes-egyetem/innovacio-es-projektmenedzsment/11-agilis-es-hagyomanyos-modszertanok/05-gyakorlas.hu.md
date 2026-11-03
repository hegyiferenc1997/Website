---
title: Gyakorlás – agilis és hagyományos
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizenegyedik témakörhöz.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. „Az agilis azt jelenti, hogy nincs terv és nincs dokumentáció.” Igaz?</summary>

Nem. Az agilis csapatok is terveznek (termék-backlog, sprinttervezés, kiadási terv), csak rövidebb távra és folyamatosan. Dokumentáció is készül, csak „épp elég”, és a működő szoftvert tartják fontosabbnak.

</details>

<details>
<summary>2. Mi a különbség a sprint-áttekintés és a sprint-retrospektív között?</summary>

Az áttekintésen (review) a **terméket** nézik meg az érintettekkel (mi készült el, mi a visszajelzés). A retrospektíven a csapat a **saját működését** vizsgálja (hogyan dolgoztunk, mit javítunk).

</details>

<details>
<summary>3. Egy Kanban-táblán a „Teszt” oszlopban mindig sok kártya áll. Mit jelez ez, és mit tennél?</summary>

Szűk keresztmetszetet: a tesztelés nem bírja az ütemet. Megoldás: WIP-limit a fejlesztésre (ne termeljünk több félkész munkát), a fejlesztők segítsenek a tesztelésben, automatizált tesztek.

</details>

<details>
<summary>4. Egy bank új mobilbank-funkciót fejleszt, de a felügyeleti hatóság szigorú dokumentációt kér. Milyen megközelítést javasolnál?</summary>

Hibridet: a szabályozási követelményeket és a mérföldköveket hagyományosan kezelik (dokumentáció, jóváhagyások), a felhasználói felület és a funkciók fejlesztése agilis sprintekben folyik, gyakori felhasználói visszajelzéssel.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik **nem** Scrum-esemény?
- sprinttervezés
- napi Scrum
- sprint-retrospektív
+ fáziskapu-felülvizsgálat
! A fáziskapu a hagyományos módszerek eleme.

? Melyik Scrum-szerep a „szolgáló vezető”, aki az akadályokat elhárítja?
- Product Owner
+ Scrum Master
- fejlesztők
- szponzor
! A Scrum Master támogatja a csapatot.

? Mi a Scrum inkrementum vállalása?
- a termékcél
- a sprintcél
+ a „kész” definíciója (Definition of Done)
- a sebesség
! Az inkrementumnak meg kell felelnie a „kész” definíciójának.

? Egy csapat sebessége átlagosan 25 pont. A kiadásig 8 sprint van hátra, a backlogban 230 pont. Hány pont **nem** fér bele?
= 30
= 30 pont
! 8 · 25 = 200; 230 − 200.

? Egy Kanban-rendszerben az átlagos átfutási idő 4 nap, az áteresztőképesség napi 3 feladat. Little törvénye szerint átlagosan hány feladat van folyamatban?
= 12
! WIP = átfutási idő · áteresztőképesség = 4 · 3.

? A V-modellben melyik teszt ellenőrzi, hogy az **egyes modulok együttműködnek**?
- egységteszt
+ integrációs teszt
- elfogadási teszt
- sprint-áttekintés
! Az architektúratervhez tartozó szint.

? Melyik érték szerepel az Agilis kiáltványban?
+ megrendelővel való együttműködés a szerződéses tárgyalással szemben
- dokumentáció a működő szoftverrel szemben
- folyamatok az egyénekkel szemben
- terv követése a változásra való reagálással szemben
! A bal oldali tételt becsülik többre.
```
