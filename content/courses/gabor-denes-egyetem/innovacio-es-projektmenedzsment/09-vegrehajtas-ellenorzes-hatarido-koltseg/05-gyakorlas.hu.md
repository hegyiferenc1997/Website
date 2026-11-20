---
title: Gyakorlás – határidő és költség
summary: Ellenőrző kérdések és egy teljes earned value számítás összefoglaló feladatlapként.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **PERT.** Írd meg a `pert(o, m, p)` függvényt, amely a `(várható idő, szórás)` párt adja (2 tizedesre), és az `ut(tevekenysegek)` függvényt, amely `(o, m, p)` hármasok listájából az út várható hosszát és szórását adja (2 tizedesre)! Az út varianciája a varianciák összege.

```python starter
def pert(o, m, p):
    return (round((o + 4 * m + p) / 6, 2), round((p - o) / 6, 2))

def ut(tevekenysegek):
    te = sum((o + 4 * m + p) / 6 for o, m, p in tevekenysegek)
    sd = sum((p - o) / 6 for o, m, p in tevekenysegek)
    return (round(te, 2), round(sd, 2))
```

<details>
<summary>Megoldás</summary>

A szórások nem adódnak össze: a kiinduló kód túlbecsüli a bizonytalanságot, mert a csúszások és a gyorsulások részben kiegyenlítik egymást.

```python solution
import math

def pert(o, m, p):
    return (round((o + 4 * m + p) / 6, 2), round((p - o) / 6, 2))

def ut(tevekenysegek):
    te = sum((o + 4 * m + p) / 6 for o, m, p in tevekenysegek)
    var = sum(((p - o) / 6) ** 2 for o, m, p in tevekenysegek)   # a varianciák adódnak össze
    return (round(te, 2), round(math.sqrt(var), 2))
```

</details>

```python test
assert pert(2, 5, 14) == (6.0, 2.0)
assert ut([(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]) == (18.33, 2.08)
assert ut([(0, 3, 6), (0, 4, 8)]) == (7.0, 1.67)
print("Minden ellenőrzés sikeres!")
```

**2.** **A határidő esélye.** Írd meg az `eselye(tevekenysegek, hatarido)` függvényt, amely normális eloszlást feltételezve megadja, hány százalék eséllyel készül el az út a határidőre (1 tizedesre)!

```python starter
def eselye(tevekenysegek, hatarido):
    te = sum((o + 4 * m + p) / 6 for o, m, p in tevekenysegek)
    return 100.0 if hatarido >= te else 0.0
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import NormalDist
import math

def eselye(tevekenysegek, hatarido):
    te = sum((o + 4 * m + p) / 6 for o, m, p in tevekenysegek)
    sd = math.sqrt(sum(((p - o) / 6) ** 2 for o, m, p in tevekenysegek))
    return round(100 * NormalDist(te, sd).cdf(hatarido), 1)
```

</details>

```python test
ut = [(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]
assert eselye(ut, 21) == 90.0
assert eselye(ut, 17) == 26.1
assert eselye([(0, 3, 6)], 3) == 50.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Earned value.** Írd meg az `evm(bac, pv, ev, ac)` függvényt, amely egy szótárat ad vissza: `CPI` és `SPI` (2 tizedesre), `EAC` = BAC / CPI és `VAC` = BAC − EAC (1 tizedesre)!

```python starter
def evm(bac, pv, ev, ac):
    cpi, spi = ac / ev, pv / ev
    eac = bac * cpi
    return {"CPI": round(cpi, 2), "SPI": round(spi, 2), "EAC": round(eac, 1), "VAC": round(bac - eac, 1)}
```

<details>
<summary>Megoldás</summary>

```python solution
def evm(bac, pv, ev, ac):
    cpi, spi = ev / ac, ev / pv                    # 1 alatt: drágább / lassabb a tervnél
    eac = bac / cpi
    return {"CPI": round(cpi, 2), "SPI": round(spi, 2), "EAC": round(eac, 1), "VAC": round(bac - eac, 1)}
```

</details>

```python test
assert evm(100, 50, 40, 50) == {"CPI": 0.8, "SPI": 0.8, "EAC": 125.0, "VAC": -25.0}
assert evm(200, 100, 110, 100) == {"CPI": 1.1, "SPI": 1.1, "EAC": 181.8, "VAC": 18.2}
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit mond Parkinson törvénye?
+ a munka kitölti a rendelkezésre álló időt
- a projektek mindig olcsóbbak a tervezettnél
- minden második feladat csúszik
- a csapat mérete hetente duplázódik
! Ezért nem érdemes a tartalékot a tevékenységek közt szétosztani.

? Mi a fast-tracking?
- új emberek bevonása
+ tevékenységek párhuzamosítása, amelyeket eredetileg egymás után terveztek
- a terjedelem csökkentése
- a projekt leállítása
! Időt nyer, de növeli a kockázatot és az újramunkát.

? PV = 80, EV = 60, AC = 75. Mennyi a CPI?
= 0,8
= 0.8
! $60 / 75 = 0{,}8$.

? PERT: O = 4, M = 6, P = 14. Mennyi a várható idő (nap)?
= 7
! $(4 + 24 + 14) / 6 = 7$.
```
