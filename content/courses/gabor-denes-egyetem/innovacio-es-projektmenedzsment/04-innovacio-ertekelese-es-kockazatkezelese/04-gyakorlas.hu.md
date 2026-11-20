---
title: Gyakorlás – értékelés és kockázat
summary: Ellenőrző kérdések és összefoglaló számolós feladatlap a negyedik témakörhöz.
minutes: 50
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Nettó jelenérték.** Írd meg az `npv(aramok, r)` függvényt, amely a `[C0, CF1, CF2, …]` pénzáramlista nettó jelenértékét adja vissza `r` kamatláb mellett (1 tizedesre)! A 0. elem a mai pénzáram (általában negatív).

```python starter
def npv(aramok, r):
    return round(sum(aramok), 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def npv(aramok, r):
    return round(sum(cf / (1 + r) ** t for t, cf in enumerate(aramok)), 1) + 0.0   # diszkontált összeg
```

</details>

```python test
assert npv([-1000, 500, 500, 500], 0.1) == 243.4
assert npv([-1000, 1210], 0.1) == 100.0
assert npv([-100, 0, 121], 0.1) == 0.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Belső megtérülési ráta.** Írd meg az `irr(aramok)` függvényt, amely felezéses kereséssel megadja azt a kamatlábat 0 és 1 között, amelynél az NPV nulla (4 tizedesre)!

```python starter
def irr(aramok):
    return 0.1
```

<details>
<summary>Megoldás</summary>

```python solution
def irr(aramok):
    npv = lambda r: sum(cf / (1 + r) ** t for t, cf in enumerate(aramok))
    also, felso = 0.0, 1.0
    for _ in range(60):
        kozep = (also + felso) / 2
        if npv(kozep) > 0:
            also = kozep                   # még pozitív: az IRR nagyobb
        else:
            felso = kozep
    return round(kozep, 4)
```

</details>

```python test
assert irr([-1000, 500, 500, 500]) == 0.2338
assert irr([-100, 150]) == 0.5
assert irr([-1000, 1200]) == 0.2
print("Minden ellenőrzés sikeres!")
```

**3.** **Stage-Gate.** Írd meg a `stage_gate(koltsegek, siker, ertek)` függvényt, amely a `(várható költség, várható érték)` párt adja vissza (1 tizedesre), ha az i-edik szakaszt csak akkor fizetjük ki, ha a projekt az előző kapukon átjutott, és a végén `ertek` értékű termék születik!

```python starter
def stage_gate(koltsegek, siker, ertek):
    p = 1.0
    for s in siker:
        p *= s
    return (round(sum(koltsegek), 1), round(p * ertek - sum(koltsegek), 1))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód úgy számol, mintha minden szakaszt mindenképp kifizetnénk – épp a korai leállítás értéke vész el.

```python solution
def stage_gate(koltsegek, siker, ertek):
    varhato, eljut = 0.0, 1.0
    for k, s in zip(koltsegek, siker):
        varhato += eljut * k               # ezt a szakaszt csak ekkora eséllyel fizetjük
        eljut *= s
    return (round(varhato, 1), round(eljut * ertek - varhato, 1))
```

</details>

```python test
assert stage_gate([10, 40, 150, 400], [0.5, 0.6, 0.7, 0.9], 2000) == (159.0, 219.0)
assert stage_gate([10, 100], [0.5, 1.0], 300) == (60.0, 90.0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy projekt 600 ezer Ft-ba kerül, és évi 150 ezer Ft-ot hoz. Mennyi a megtérülési idő (év)?
= 4
! $600 / 150 = 4$ év.

? Egy befektetés 200 egység, a nyereség 50 egység. Mennyi a ROI (%)?
= 25
! $50 / 200 = 0{,}25$.

? Mit jelent a „gyors kudarc” (fail fast) elve?
- minél több projektet kell elbuktatni
+ olcsón és korán kell tesztelni, hogy a rossz ötletek hamar, kis veszteséggel kiderüljenek
- a kudarcot el kell titkolni
- csak biztos ötletekbe szabad fektetni
! A korai, olcsó kudarc tanulás; a késői, drága kudarc veszteség.

? Melyik a négy kockázati válaszstratégia egyike (veszélyre)?
- figyelmen kívül hagyás
+ áthárítás (pl. biztosítással)
- elhallgatás
- megduplázás
! Elkerülés, áthárítás, csökkentés, elfogadás.
```
