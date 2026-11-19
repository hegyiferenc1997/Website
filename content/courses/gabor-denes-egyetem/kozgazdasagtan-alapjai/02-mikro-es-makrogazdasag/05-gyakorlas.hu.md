---
title: Gyakorlás – mikro, makro és adatok
summary: Ellenőrző kérdések és összefoglaló feladatlap a mikro- és makroszintről, a jövedelem körforgásáról és a gazdasági adatok számolásáról.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy hírben ez áll: „A kamat 3 százalékkal emelkedett.” Miért lehet félrevezető?</summary>

Nem derül ki, hogy 3 **százalékpont** (pl. 4%-ról 7%-ra) vagy 3 **százalék** (pl. 4%-ról 4,12%-ra) a változás. A kettő között óriási a különbség; rátáknál a százalékpont a pontos kifejezés.

</details>

<details>
<summary>2. Miért fontos a ceteris paribus feltétel a kereslet vizsgálatánál?</summary>

Mert a valóságban egyszerre sok minden változik (ár, jövedelem, divat, más termékek ára). Ha nem rögzítjük a többi tényezőt, nem tudjuk szétválasztani, hogy mennyi változást okozott maga az ár.

</details>

<details>
<summary>3. Mutasd meg a körforgás-modellel, miért csökkenhet a termelés, ha a háztartások hirtelen sokkal többet importálnak!</summary>

Az import kiáramlás: a háztartások jövedelmének egy része nem a hazai vállalatokhoz jut vissza. Ha ezt nem ellensúlyozza beáramlás (pl. több export vagy beruházás), a hazai vállalatok árbevétele csökken, kevesebbet termelnek, kevesebb bért fizetnek.

</details>

<details>
<summary>4. Egy kutatás szerint akik több kávét isznak, többet keresnek. Mondj két okot, amiért ebből nem következik, hogy a kávé növeli a fizetést!</summary>

Rejtett harmadik tényező: a hosszabb munkaidő vagy a stresszesebb, jobban fizető állás okozhatja mindkettőt. Fordított ok-okozat: aki többet keres, többet költhet kávéra (pl. drága kávézókban).

</details>

## Összefoglaló feladatlap

Egy egyetemista adatai (Ft/hó):

| Év   | Nettó jövedelem | Fogyasztói árindex (előző év = 100) |
| ---- | --------------- | ----------------------------------- |
| 2025 | 200 000         | –                                   |
| 2026 | 220 000         | 104                                 |

```quiz required
? Hány százalékkal nőtt a nominális jövedelem 2026-ban?
= 10
= 10%
! 220 000 / 200 000 = 1,10.

? Mennyi a reáljövedelem indexe (előző év = 100)? Egy tizedesre kerekítve.
= 105,8
= 105.8
! 110 / 104 · 100 ≈ 105,8.

? A közelítő szabály szerint hány százalékkal nőtt a reáljövedelem?
= 6
= 6%
! 10 − 4 = 6 (pontosan 5,8%).

? A diák havi 30 000 Ft-ot takarít meg. Melyik ez a körforgásban?
+ kiáramlás
- beáramlás
! A megtakarítás (S) kiáramlás.

? Az infláció 5%-ról 3%-ra csökken. Hány százalékpont a változás? (Előjellel.)
= -2
= −2
! 3 − 5.

? Csökkentek-e ekkor az árak?
- igen, 2%-kal
+ nem, csak lassabban nőnek
! Pozitív infláció = az árszint még mindig nő.

? Melyik pozitív állítás?
+ A 2026-os fogyasztói árindex 104 volt.
- Az árindexnek 102 alatt kellene lennie.
- A diákoknak több ösztöndíjat kellene kapniuk.
! Adattal ellenőrizhető.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **GDP a kiadási oldalról.** Írd meg a `gdp(C, I, G, X, M)` függvényt, amely a fogyasztásból, a beruházásból, az állami vásárlásokból, az exportból és az importból kiszámolja a GDP-t!

```python starter
def gdp(C, I, G, X, M):
    return C + I + G + X + M
```

<details>
<summary>Megoldás</summary>

Az import benne van a C-ben, I-ben vagy G-ben (pl. egy külföldi laptop), de nem hazai termelés – ezért vonjuk le.

```python solution
def gdp(C, I, G, X, M):
    return C + I + G + (X - M)            # az importot le kell vonni: azt külföldön termelték
```

</details>

```python test
assert gdp(600, 200, 250, 450, 400) == 1100
assert gdp(500, 150, 200, 300, 250) == 900
assert gdp(100, 20, 30, 10, 40) == 120
print("Minden ellenőrzés sikeres!")
```

**2.** **Százalékpont és százalék.** Írd meg a `valtozas(regi, uj)` függvényt, amely két százalékos értékből (pl. kamatláb) visszaadja a `(százalékpontos változás, százalékos változás)` párt, mindkettőt 1 tizedesre kerekítve!

```python starter
def valtozas(regi, uj):
    return (round(uj - regi, 1), round(uj - regi, 1))
```

<details>
<summary>Megoldás</summary>

```python solution
def valtozas(regi, uj):
    pp = uj - regi                         # egyszerű különbség
    szazalek = 100 * (uj - regi) / regi    # relatív változás
    return (round(pp, 1), round(szazalek, 1))
```

</details>

```python test
assert valtozas(4.0, 6.5) == (2.5, 62.5)
assert valtozas(5, 6) == (1.0, 20.0)
assert valtozas(10, 8) == (-2.0, -20.0)
assert valtozas(3, 3) == (0.0, 0.0)
print("Minden ellenőrzés sikeres!")
```

**3.** **Reálbér.** Írd meg a `realber(nominalis, arindex)` függvényt, amely a nominális bért a bázisév árain fejezi ki (az árindex a bázisévben 100), egész forintra kerekítve, és a `realber_valtozas(ber_novekedes, inflacio)` függvényt, amely a reálbér százalékos változását adja meg 1 tizedesre!

```python starter
def realber(nominalis, arindex):
    return nominalis

def realber_valtozas(ber_novekedes, inflacio):
    return round(ber_novekedes - inflacio, 1)
```

<details>
<summary>Megoldás</summary>

A közelítő „bérnövekedés − infláció” szabály kis számoknál jó, nagy inflációnál viszont már érezhetően téved.

```python solution
def realber(nominalis, arindex):
    return round(nominalis / (arindex / 100))         # osztunk az árszinttel

def realber_valtozas(ber_novekedes, inflacio):
    return round(100 * ((1 + ber_novekedes / 100) / (1 + inflacio / 100) - 1), 1)
```

</details>

```python test
assert realber(520_000, 134.7) == 386043
assert realber(400_000, 100) == 400000
assert realber_valtozas(10, 4) == 5.8
assert realber_valtozas(30, 34.7) == -3.5
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik makroökonómiai kérdés?
- mennyibe kerüljön egy új okostelefon
- hány dolgozót vegyen fel egy pékség
+ miért nőtt az infláció az egész országban
- megéri-e egy hallgatónak diákmunkát vállalni
! A makroökonómia a gazdaság egészével foglalkozik.

? Egy termék ára 2025-ben 450, 2026-ban 486 egység. Mennyi a 2026-os láncindex?
= 108
! $\frac{486}{450} \cdot 100 = 108$.

? Mit jelent a „ceteris paribus” feltétel?
+ minden más tényező változatlan
- minden tényező egyszerre változik
- az árak állandóak
- a modell mindig pontos
! Egy tényező hatását a többi rögzítésével vizsgáljuk.

? A körforgásban mi tartozik a beáramlások közé?
- megtakarítás
- adó
+ export
- import
! A beáramlások: beruházás, állami vásárlás, export.

? Az infláció 3%-ról 5%-ra nőtt. Hány százalékponttal?
= 2
! $5 - 3 = 2$ százalékpont (miközben ez 66,7%-os növekedés).
```
