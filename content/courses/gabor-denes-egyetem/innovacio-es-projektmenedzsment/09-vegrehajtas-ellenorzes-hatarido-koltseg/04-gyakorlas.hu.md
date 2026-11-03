---
title: Gyakorlás – határidő és költség
summary: Ellenőrző kérdések és egy teljes earned value számítás összefoglaló feladatlapként.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég a „mennyi pénzt költöttünk el” kérdés a projekt állapotának megítéléséhez?</summary>

Mert nem mutatja, mennyi munka készült el érte. A költségvetés felének elköltése lehet jó (ha a munka fele kész) vagy rossz (ha csak a negyede). Az EV ezt a hiányzó információt adja.

</details>

<details>
<summary>2. Mikor választanál fast-trackinget crashing helyett?</summary>

Ha nincs plusz pénz vagy erőforrás, de a tevékenységek részben átfedhetők (pl. a tesztelés elkezdhető a kész modulokon), és vállalható a nagyobb kockázat, az esetleges átdolgozás.

</details>

<details>
<summary>3. Egy PM minden tevékenységhez 20% ráhagyást tesz, a projekt mégis késik. Mi lehet az oka, és mit javasolnál?</summary>

Parkinson törvénye és a diákszindróma: a ráhagyást a csapat „elhasználja”. Javaslat: a ráhagyásokat egy közös projektpufferbe gyűjteni (kritikus lánc), és a puffer fogyását követni.

</details>

<details>
<summary>4. Mi a különbség a kockázati és a vezetői tartalék között?</summary>

A kockázati tartalék az azonosított kockázatokra van, része a költség-alaptervnek, és a PM használhatja. A vezetői tartalék az előre nem látható eseményekre van, nem része az alaptervnek, és csak a vezetés engedélyével használható.

</details>

## Összefoglaló feladatlap

Egy webes projekt: **BAC = 80 millió Ft**. A 6. hónap végén a terv szerint **PV = 48** millió Ft értékű munkának kellene kész lennie. A munka **50%-a** készült el, eddig **AC = 50** millió Ft-ot költöttek.

```quiz required
? Mennyi az EV (millió Ft)?
= 40
! EV = 0,5 · 80.

? Mennyi a költségeltérés, CV (millió Ft)?
= -10
= −10
! CV = EV − AC = 40 − 50.

? Mennyi az ütemeltérés, SV (millió Ft)?
= -8
= −8
! SV = EV − PV = 40 − 48.

? Mennyi a CPI?
= 0,8
= 0.8
! CPI = 40 / 50.

? Mennyi a várható teljes költség, EAC (millió Ft)?
= 100
! EAC = BAC / CPI = 80 / 0,8.

? Mennyi a várható eltérés a projekt végén, VAC (millió Ft)?
= -20
= −20
! VAC = BAC − EAC = 80 − 100.

? PERT: O = 6, M = 9, P = 18 nap. Mennyi a várható időtartam (nap)?
= 10
= 10 nap
! (6 + 36 + 18) / 6 = 60 / 6.
```
