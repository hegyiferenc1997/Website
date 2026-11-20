---
title: Gyakorlás – növekedés és fejlődés
summary: Ellenőrző kérdések és összefoglaló feladatlap a növekedési ütemekről, a 70-es szabályról, a növekedés forrásairól és az egyenlőtlenség méréséről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem lehet egy országot pusztán a beruházások folyamatos növelésével tartósan gazdaggá tenni?</summary>

A csökkenő hozadék miatt: minden újabb egység tőke egyre kevesebb többletkibocsátást hoz, ráadásul a tőke el is avul (értékcsökkenés). Egy ponton a beruházás csak a meglévő tőke pótlására elég. Tartós növekedéshez technológiai fejlődés kell.

</details>

<details>
<summary>2. Miért lehet félrevezető az egy főre jutó GDP az életszínvonal mércéjeként?</summary>

Mert átlag: nem mutatja az elosztást (Gini), és nem tartalmazza az egészséget, az iskolázottságot, a szabadidőt, a környezet állapotát. Ezért használjuk kiegészítésként a HDI-t és az egyenlőtlenségi mutatókat.

</details>

<details>
<summary>3. Hogyan magyarázza Észak- és Dél-Korea különbségét az intézményi megközelítés?</summary>

A két ország földrajza, kultúrája és kiinduló helyzete hasonló volt, de Dél-Korea befogadó gazdasági intézményeket épített (piac, tulajdonjogok, nyitottság, később demokrácia), Észak-Korea kizsákmányoló, tervutasításos rendszert. Az ösztönzők különbsége óriási életszínvonal-különbséghez vezetett.

</details>

<details>
<summary>4. Miért hatékonyabb lehet egy szén-dioxid-ár, mint az, ha az állam minden cégnek előírja, mennyit csökkentsen?</summary>

Mert az árnál azok csökkentenek többet, akiknek ez olcsóbb, a drágábban csökkentők inkább kvótát vesznek. Így ugyanaz a teljes csökkentés a legkisebb összköltséggel jön létre, és az ár folyamatos ösztönzést ad az új, tisztább technológiákra.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy ország reál GDP-je 400-ról 418-ra nőtt. Hány százalékos a növekedés?
= 4,5
= 4.5
! 18 / 400.

? Ugyanebben az évben a népesség 1,5%-kal nőtt. Kb. hány százalékkal nőtt az egy főre jutó GDP?
= 3
= 3%
! 4,5 − 1,5.

? A 70-es szabály szerint hány év alatt duplázódik az életszínvonal évi 2%-os egy főre jutó növekedéssel?
= 35
! 70 / 2.

? Mennyi lesz 100-as kiinduló értékből 2 év alatt 10%-os éves növekedéssel?
= 121
! 100 · 1,1².

? Egy Lorenz-görbe szerint a népesség alsó 50%-a kapja a jövedelmek 50%-át, az alsó 80%-a a 80%-át. Mennyi a Gini-együttható?
= 0
! A görbe az átló – tökéletes egyenlőség.

? Melyik növeli a teljes tényezőtermelékenységet?
- több munkás felvétele ugyanazzal a technológiával
+ egy új, hatékonyabb gyártási eljárás bevezetése
- a népesség növekedése
- a pénzmennyiség növelése
! „Ugyanabból többet.”
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Duplázódási idő pontosan.** A 70-es szabály ($70 / g$) csak közelítés. Írd meg a `duplazodas(g)` függvényt, amely `g` % éves növekedés mellett megadja, hány év alatt duplázódik a GDP – pontosan, logaritmussal ($\frac{\ln 2}{\ln(1 + g/100)}$), 1 tizedesre!

```python starter
def duplazodas(g):
    return round(70 / g, 1)
```

<details>
<summary>Megoldás</summary>

Alacsony rátánál a 70-es szabály szinte pontos (2%-nál mindkettő 35 év), nagy rátánál viszont már láthatóan alábecsül.

```python solution
import math

def duplazodas(g):
    return round(math.log(2) / math.log(1 + g / 100), 1)   # (1 + g)^t = 2 megoldása
```

</details>

```python test
assert duplazodas(2) == 35.0
assert duplazodas(3.5) == 20.1
assert duplazodas(7) == 10.2
assert duplazodas(10) == 7.3
print("Minden ellenőrzés sikeres!")
```

**2.** **Felzárkózás.** Egy szegényebb ország egy főre jutó GDP-je `gdp_a`, éves növekedése `g_a` %; egy gazdagabbé `gdp_b` és `g_b` %. Írd meg a `felzarkozas_evek(gdp_a, g_a, gdp_b, g_b)` függvényt, amely megadja, hány teljes év után éri el (vagy előzi meg) az első a másodikat! Ha 1000 év alatt sem, adjon vissza `None`-t; ha már most nem kisebb, `0`-t.

```python starter
def felzarkozas_evek(gdp_a, g_a, gdp_b, g_b):
    return round((gdp_b - gdp_a) / (gdp_a * (g_a - g_b) / 100))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód lineáris növekedéssel számol, és egyenlő rátáknál nullával osztana. A kamatos kamat miatt a valódi felzárkózás gyorsabb, mint a lineáris becslés.

```python solution
def felzarkozas_evek(gdp_a, g_a, gdp_b, g_b):
    ev = 0
    while gdp_a < gdp_b:
        if ev >= 1000:
            return None                    # gyakorlatilag soha
        gdp_a *= 1 + g_a / 100             # mindkettő kamatos kamattal nő
        gdp_b *= 1 + g_b / 100
        ev += 1
    return ev
```

</details>

```python test
assert felzarkozas_evek(20_000, 5, 40_000, 2) == 24
assert felzarkozas_evek(10_000, 6, 50_000, 1.5) == 38
assert felzarkozas_evek(20_000, 2, 40_000, 2) is None
assert felzarkozas_evek(30_000, 1, 20_000, 3) == 0
print("Minden ellenőrzés sikeres!")
```

**3.** **Gini-együttható ötödökből.** A népesség jövedelem szerinti öt ötödének (a legszegényebbtől) jövedelemrészesedése `reszek` (%, összesen 100). Írd meg a `gini(reszek)` függvényt, amely a Lorenz-görbe alatti területből (trapézokkal) számolja a Gini-együtthatót: $G = 1 - 2 \cdot \text{terület}$, 3 tizedesre!

```python starter
def gini(reszek):
    return round(1 - reszek[0] / 20, 3)
```

<details>
<summary>Megoldás</summary>

Az utolsó teszt mutatja az ötödökből számolás korlátját: teljes egyenlőtlenségnél a valódi Gini 1 lenne, de öt csoporttal legfeljebb 0,8 jöhet ki – a csoporton belüli különbségek láthatatlanok.

```python solution
def gini(reszek):
    terulet, kumulalt = 0.0, 0.0
    for r in reszek:
        uj = kumulalt + r / 100
        terulet += 0.2 * (kumulalt + uj) / 2   # trapéz: szélesség × átlagmagasság
        kumulalt = uj
    return round(1 - 2 * terulet, 3) + 0.0
```

</details>

```python test
assert gini([20, 20, 20, 20, 20]) == 0.0
assert gini([8, 13, 17, 23, 39]) == 0.288
assert gini([4, 9, 15, 22, 50]) == 0.42
assert gini([0, 0, 0, 0, 100]) == 0.8
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit mér az egy főre jutó GDP vásárlóerő-paritáson (PPP)?
+ az átlagos jövedelmet úgy, hogy az országok eltérő árszínvonalát is figyelembe veszi
- az ország teljes vagyonát
- csak az exportot
- a jövedelemeloszlást
! PPP-n ugyanannyi pénz mindenhol ugyanannyi kosarat vesz.

? Mi a Solow-modell fő üzenete a hosszú távú növekedésről?
- a tőkefelhalmozás korlátlanul növeli az egy főre jutó GDP-t
+ a tőke csökkenő hozadéka miatt hosszú távon a technológiai fejlődés hajtja a növekedést
- a népesség növekedése a legfontosabb
- a növekedés kizárólag a természeti erőforrásokon múlik
! A tőke egyre kevesebb pluszt hoz, a tartós növekedés forrása a technológia.

? Egy ország 3,5%-kal nő évente. A 70-es szabály szerint hány év alatt duplázódik a GDP?
= 20
! $70 / 3{,}5 = 20$.

? Mit jelent a 0-hoz közeli Gini-együttható?
+ nagyon egyenlő jövedelemeloszlást
- nagyon egyenlőtlen jövedelemeloszlást
- alacsony GDP-t
- magas inflációt
! 0: mindenkinek ugyanannyi; 1: egy embernél van minden.

? Melyik NEM tartozik a HDI (emberi fejlettségi index) összetevői közé?
- várható élettartam
- iskolázottság
- egy főre jutó jövedelem
+ katonai kiadások
! A HDI az egészséget, az oktatást és a jövedelmet méri.
```
