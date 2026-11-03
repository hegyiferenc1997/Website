---
title: Erőforrás-menedzsment
summary: Az erőforrások típusai, erőforrásterv és -becslés, FTE és kihasználtság, erőforrás-hisztogram, túlterhelés, erőforrás-kiegyenlítés és -simítás, erőforrásnaptár.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen **erőforrásai** vannak egy projektnek,
- hogyan számolj **FTE**-vel és **kihasználtsággal**,
- hogyan vedd észre a **túlterhelést** egy erőforrás-hisztogramon,
- mi a különbség az erőforrás-**kiegyenlítés** és -**simítás** között.

## Erőforrástípusok

- **emberi** erőforrás: fejlesztők, tesztelők, tervezők, szakértők,
- **fizikai**: hardver, eszközök, helyiségek, licencek, felhőkapacitás,
- **pénzügyi**: a költségvetés (9. témakör).

Az informatikai projektekben a **legszűkebb** erőforrás jellemzően a **kulcsemberek** ideje – különösen, ha több projekten dolgoznak egyszerre (mátrix szervezet, 12. témakör).

## Erőforrásterv és becslés

Az **erőforrásterv** tevékenységenként rögzíti, milyen erőforrásból mennyi kell és mikor. Ehhez a WBS-ből (7. témakör) indulunk, és megbecsüljük a **munkamennyiséget** (_effort_, pl. emberóra, embernap).

> **Munkamennyiség ≠ időtartam.** Egy 10 embernapos feladat 1 emberrel 10 nap, 2 emberrel ideális esetben 5 nap – a gyakorlatban több, mert nő az egyeztetés (Brooks törvénye).

### FTE és kihasználtság

- **FTE** (_Full-Time Equivalent_, teljes munkaidős egyenérték): 1 FTE = egy ember teljes munkaideje (pl. heti 40 óra). Egy heti 20 órában dolgozó ember **0,5 FTE**.
- **Kihasználtság** = beosztott munkaóra / rendelkezésre álló munkaóra · 100%.

Példa: egy fejlesztőt egy napra két feladatra osztottak be, 6 + 4 = 10 órára, de csak 8 órát dolgozik → kihasználtság **125%** → **túlterhelt**.

> A tartós 100% körüli kihasználtság is kockázatos: nincs tartalék a váratlan feladatokra, és nő a kiégés esélye (fenntartható ütem, 11. témakör). Gyakori cél a **80–85%**.

## Erőforrás-hisztogram

Az **erőforrás-hisztogram** időszakonként mutatja, egy erőforrásból mennyit terveztünk be, a rendelkezésre álló kapacitáshoz képest:

```text
 óra/nap
  12 │        ██
  10 │     ██ ██
   8 │─ ─ ─██─██─ ─ ─ ─ ─ ─ ─   ← kapacitás (8 óra)
   6 │  ██ ██ ██ ██
   4 │  ██ ██ ██ ██ ██
   2 │  ██ ██ ██ ██ ██
     └──────────────────────▶ nap
       H  K  Sz Cs P
```

A kedden és szerdán a vonal fölé nyúló oszlopok **túlterhelést** jeleznek.

## Kiegyenlítés és simítás

| Technika                                | Mit csinál?                                                             | Hatás a határidőre                                                            |
| --------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **erőforrás-kiegyenlítés** (_leveling_) | a tevékenységeket **eltolja**, hogy egy erőforrás se legyen túlterhelve | a projekt **hosszabb** lehet (akár a kritikus út is változhat)                |
| **erőforrás-simítás** (_smoothing_)     | csak a **tartalékidőn belül** tolja el a tevékenységeket                | a határidő **nem változik**, de lehet, hogy nem szűnik meg minden túlterhelés |

Példa: a 7. témakör hálótervében a C tevékenységnek 1 nap tartaléka volt. Ha C és B ugyanazt a fejlesztőt használja egy napon, C-t **simítással** 1 nappal később kezdhetjük – a projekt vége nem csúszik. Ha ennél nagyobb eltolás kellene, az már **kiegyenlítés**, és csúszhat a projekt.

## Erőforrásnaptár és beszerzés

- **Erőforrásnaptár**: mikor elérhető egy erőforrás (szabadság, ünnepnapok, más projektek, részmunkaidő).
- **Beszerzés**: ha belül nincs elég erőforrás, külső forrásból (alvállalkozó, szabadúszó, felhőkapacitás). A **„csináljuk vagy vegyük?”** (_make or buy_) döntést a döntési fa is segítheti (1. lecke).

## Összefoglalás

- Erőforrások: emberi, fizikai, pénzügyi; a kulcsemberek ideje a legszűkebb.
- Munkamennyiség (embernap) ≠ időtartam; FTE; kihasználtság = beosztott / rendelkezésre álló.
- Erőforrás-hisztogram: a kapacitásvonal fölötti oszlop = túlterhelés.
- Kiegyenlítés: megszünteti a túlterhelést, de a projekt hosszabbodhat; simítás: csak a tartalékon belül, a határidő nem változik.

## A lecke feladata

```quiz required
? Egy fejlesztő heti 40 órából 30 órát dolgozik a projekten. Hány FTE?
= 0,75
= 0.75
! 30 / 40.

? Egy tesztelőt egy napra 6 + 3 órás feladatokra osztottak be, 8 órás munkanapon. Hány százalékos a kihasználtsága?
= 112,5
= 112.5
= 112,5%
! 9 / 8 · 100.

? Melyik technika **nem** változtatja meg a projekt határidejét?
- erőforrás-kiegyenlítés
+ erőforrás-simítás
- crashing
- fast-tracking
! Csak a tartalékidőn belül tolja el a tevékenységeket.

? Egy feladat 12 embernap munkát igényel. Ideális esetben hány nap alatt végez vele 3 ember?
= 4
= 4 nap
! 12 / 3 (a gyakorlatban több az egyeztetés miatt).

? Mit jelez az erőforrás-hisztogramon a kapacitásvonal **fölé** nyúló oszlop?
+ túlterhelést
- kihasználatlan kapacitást
- a kritikus utat
- egy mérföldkövet
! Több munkát osztottunk be, mint amennyi idő van.
```
