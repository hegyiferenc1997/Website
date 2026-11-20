---
title: Gyakorlás – rizikó, változás, minőség, erőforrás
summary: Ellenőrző kérdések és összefoglaló számolós feladatlap a tizennegyedik témakörhöz.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Fogalmazz meg egy kockázatot „ok – kockázat – hatás” formában egy mobilalkalmazás-projektre!</summary>

Mivel az alkalmazásbolt jóváhagyási ideje kiszámíthatatlan (ok), előfordulhat, hogy az első verzió nem jelenik meg az indulási napra (kockázat), ami miatt a marketingkampány hatástalan lesz (hatás).

</details>

<details>
<summary>2. Miért kell minden kockázatnak egyetlen kockázatgazdája legyen?</summary>

Mert ha „mindenki” felel érte, senki sem figyeli a kiváltó jeleket, és senki sem indítja el időben a választ. A kockázatgazda egy konkrét ember, akit számon lehet kérni.

</details>

<details>
<summary>3. A felhasználók az új rendszer bevezetése után is az Excel-táblázataikat használják. Hol akadhattak el az ADKAR szerint, és mit tennél?</summary>

Valószínűleg a Desire (nem látják, mit nyernek vele) vagy a Reinforcement (senki sem kéri az új rendszer használatát) lépésnél. Megmutatnám a személyes előnyöket, bevonnék kulcsfelhasználókat nagykövetnek, és a vezetés a riportokat csak az új rendszerből kérné.

</details>

<details>
<summary>4. Mondj egy-egy példát a minőség négy költségtípusára egy webáruház fejlesztésénél!</summary>

Megelőzési: a fejlesztők biztonsági képzése. Értékelési: automatizált tesztek és terheléses teszt. Belső hiba: az elfogadási teszten talált fizetési hiba javítása. Külső hiba: éles rendszerben hibás árak, visszatérítés és rossz értékelések.

</details>

## Összefoglaló feladatlap

```quiz required
? Két változat: A: 60% eséllyel 30, 40% eséllyel 50 millió Ft; B: biztosan 38 millió Ft. Mennyi az A várható költsége?
= 38
! 0,6 · 30 + 0,4 · 50 = 18 + 20.

? Egy kockázatot partnerrel közösen aknázunk ki, és megosztjuk a hasznot. Melyik lehetőségre adott válasz ez?
- kiaknázás
+ megosztás
- fokozás
- elfogadás
! Share.

? Kotter modelljének **első** lépése:
+ a sürgősség érzésének megteremtése
- gyors sikerek elérése
- a jövőkép kommunikálása
- az új megközelítés beágyazása a kultúrába
! Create a sense of urgency.

? A tesztelő a kész modulon méri, hogy a válaszidő 2 mp alatt van-e. QA vagy QC?
- QA (minőségbiztosítás)
+ QC (minőségellenőrzés)
! A terméket vizsgálja → minőségellenőrzés.

? Egy hibalistán 200 hiba van, ebből 120 a fizetési modulban. Hány százalék ez?
= 60
= 60%
! 120 / 200 · 100.

? Egy projektben 3 fejlesztő dolgozik teljes munkaidőben, és 2 fő heti 20 órában (heti 40 órás munkahét). Hány FTE ez összesen?
= 4
= 4 FTE
! 3 · 1 + 2 · 0,5.

? Egy fejlesztő egy héten 46 órát kapott, a kapacitása heti 40 óra. Melyik technika szüntetheti meg a túlterhelést a határidő módosítása nélkül, ha a feladatainak van tartalékideje?
- erőforrás-kiegyenlítés
+ erőforrás-simítás
- crashing
- aranyozás
! Simítás: eltolás a tartalékidőn belül.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kockázatnyilvántartás.** Írd meg az `emv_rangsor(kockazatok)` függvényt, amely `(azonosító, valószínűség, hatás)` hármasok listájából az azonosítókat a várható érték abszolút értéke szerint csökkenő sorrendben adja, és a `tartalek(kockazatok)` függvényt (az EMV-k összege, 2 tizedesre; a lehetőségek negatív hatása csökkenti)!

```python starter
def emv_rangsor(kockazatok):
    return [k[0] for k in sorted(kockazatok, key=lambda k: -k[2])]

def tartalek(kockazatok):
    return round(sum(p * h for _, p, h in kockazatok if h > 0), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def emv_rangsor(kockazatok):
    return [k[0] for k in sorted(kockazatok, key=lambda k: -abs(k[1] * k[2]))]   # |valószínűség × hatás|

def tartalek(kockazatok):
    return round(sum(p * h for _, p, h in kockazatok), 2)
```

</details>

```python test
k = [("K1", 0.2, 8.0), ("K2", 0.4, 3.0), ("K3", 0.6, 4.0), ("K4", 0.3, 6.0), ("K5", 0.5, -2.0)]
assert emv_rangsor(k) == ["K3", "K4", "K1", "K2", "K5"]
assert tartalek(k) == 6.0
assert tartalek([("X", 0.5, 10.0)]) == 5.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Döntési fa.** Írd meg a `dontesi_fa(dontesek)` függvényt, amely a `{változat: [(valószínűség, költség), …]}` szótárból a legkisebb várható költségű változatot adja, és a `kockazatkerulo(dontesek)` függvényt, amely a legkisebb legrosszabb esetű változatot!

```python starter
def dontesi_fa(dontesek):
    return min(dontesek, key=lambda v: dontesek[v][0][1])

def kockazatkerulo(dontesek):
    return dontesi_fa(dontesek)
```

<details>
<summary>Megoldás</summary>

```python solution
def dontesi_fa(dontesek):
    return min(dontesek, key=lambda v: sum(p * k for p, k in dontesek[v]))   # várható költség

def kockazatkerulo(dontesek):
    return min(dontesek, key=lambda v: max(k for _, k in dontesek[v]))       # legrosszabb eset
```

</details>

```python test
d = {"saját fejlesztés": [(0.6, 20), (0.3, 28), (0.1, 45)], "kész termék": [(0.8, 25), (0.2, 33)]}
assert dontesi_fa(d) == "saját fejlesztés"
assert kockazatkerulo(d) == "kész termék"
assert dontesi_fa({"A": [(0.5, 10), (0.5, 50)], "B": [(1.0, 25)]}) == "B"
print("Minden ellenőrzés sikeres!")
```

**3.** **Szabályozó kártya.** Írd meg a `hatarok(stabil)` függvényt, amely az átlag ± 3 (minta)szórás határokat adja (1 tizedesre, `(alsó, felső)`), és a `kilogok(stabil, uj)` függvényt, amely az `uj` mérések közül a határon kívül esők sorszámát adja (1-től)!

```python starter
from statistics import mean, stdev

def hatarok(stabil):
    return (round(mean(stabil) - 2 * stdev(stabil), 1), round(mean(stabil) + 2 * stdev(stabil), 1))

def kilogok(stabil, uj):
    also, felso = hatarok(stabil)
    return [i for i, x in enumerate(uj, 1) if not also <= x <= felso]
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import mean, stdev

def hatarok(stabil):
    k, s = mean(stabil), stdev(stabil)
    return (round(k - 3 * s, 1), round(k + 3 * s, 1))   # ± 3 szórás

def kilogok(stabil, uj):
    also, felso = hatarok(stabil)
    return [i for i, x in enumerate(uj, 1) if not also <= x <= felso]
```

</details>

```python test
stabil = [212, 205, 198, 220, 210, 207, 215, 202, 209, 213, 204, 211]
assert hatarok(stabil) == (190.7, 227.0)
assert kilogok(stabil, [208, 214, 203, 236, 211, 219, 221, 223, 225]) == [4]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a terjedelem-kúszás (scope creep)?
+ a terjedelem ellenőrizetlen, jóváhagyás nélküli bővülése
- a projekt határidejének előrehozása
- a költségvetés csökkentése
- a csapat létszámának növekedése
! Ezt a változáskezelési folyamat előzi meg.

? Mi az 1:10:100 szabály a minőségben?
- 1 tesztelő 10 fejlesztőre és 100 felhasználóra
+ egy hiba megelőzése 1, a házon belüli kijavítása 10, az ügyfélnél való kijavítása 100 egységbe kerül
- 1 hiba 10 sorra és 100 tesztre jut
- a minőségbiztosítás 1%-a, 10%-a és 100%-a
! Minél később derül ki a hiba, annál drágább.

? Egy kockázat 40% eséllyel következik be, hatása 5 millió Ft. Mennyi az EMV (millió Ft)?
= 2
! $0{,}4 \cdot 5 = 2$.

? Mi a Kotter-modell első lépése?
+ a sürgetés érzésének megteremtése
- a változás intézményesítése
- gyors győzelmek elérése
- a vízió kommunikálása
! Kotter 8 lépése a sürgősség érzésével kezdődik.
```
