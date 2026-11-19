---
title: Gyakorlás – digitális gazdaság és a tárgy összefoglalása
summary: Ellenőrző kérdések a digitális gazdaságról, majd egy vegyes összefoglaló feladatlap a teljes tárgy anyagából – egy kitalált magyar SaaS-startup történetén keresztül.
minutes: 65
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért adhat egy közösségi oldal ingyen szolgáltatást, és miért éri meg ez neki?</summary>

Mert kétoldalú platform: a felhasználók ingyenesek, a bevétel a hirdetőktől jön. Minél több a felhasználó, annál értékesebb a platform a hirdetőknek (és a hálózati hatás miatt a felhasználóknak is). A felhasználók a figyelmükkel és az adataikkal „fizetnek”.

</details>

<details>
<summary>2. Miért nehéz egy új szereplőnek betörnie egy erős hálózati hatással rendelkező piacra?</summary>

Mert a felhasználóknak a meglévő szolgáltatás azért értékes, mert ott vannak a többiek; egy új, üres szolgáltatás akkor sem vonzó, ha technikailag jobb. Ehhez jön a váltási költség (adatok, megszokás). Ezért kell a kritikus tömeg, és ezért fontos a versenyjog és az adathordozhatóság.

</details>

<details>
<summary>3. Hogyan kapcsolódik egymáshoz a tárgy 4. és 12. témaköre?</summary>

A 4. témakör költségfogalmai (fix és határköltség, méretgazdaságosság) és piacszerkezetei (monopólium, oligopólium) magyarázzák a szoftveripar sajátosságait: a közel nulla határköltség és a hálózati hatás miatt alakulnak ki a „győztes mindent visz” piacok, és ezért fontos a versenyszabályozás.

</details>

<details>
<summary>4. Egy informatikus szemével: melyik makrogazdasági változók hatnak leginkább egy hazai szoftvercég üzletére?</summary>

Az **árfolyam** (az exportbevételek forintértéke), a **kamat** (a finanszírozás és a kockázati tőke elérhetősége, a vevők beruházási kedve), az **infláció** és a **bérek** (a legnagyobb költség a munkaerő), a **konjunktúra** (válságban a cégek visszafogják az IT-kiadásokat), valamint a **szabályozás** (GDPR, MI-rendelet).

</details>

## Összefoglaló feladatlap – a tárgy teljes anyagából

Egy budapesti startup óraszervező SaaS-alkalmazást fejleszt egyetemistáknak.

```quiz required
? Az alapítók egyike otthagy egy évi 12 millió Ft-os állást a startupért. Mi ez közgazdasági szempontból?
- elsüllyedt költség
+ alternatív költség
- fix költség
- transzfer
! A legjobb kihagyott lehetőség értéke (1. témakör).

? Az app ára havi 1000 Ft-ról 1200 Ft-ra nő, az előfizetők száma 5000-ről 4500-ra csökken. Mennyi az árrugalmasság abszolút értéke?
= 0,5
= 0.5
! −10% / +20% (3. témakör).

? Nőtt vagy csökkent a havi árbevétel az áremelés után?
+ nőtt
- csökkent
! 5 000 000 → 5 400 000 Ft – rugalmatlan kereslet.

? A fejlesztés fix költsége havi 3 millió Ft, a felhasználónkénti költség 200 Ft. Mennyi az átlagköltség 5000 felhasználónál (Ft)?
= 800
! (3 000 000 + 1 000 000) / 5000 (4. témakör).

? Az ARPU 1200 Ft, az árrés 80%, a havi lemorzsolódás 4%. Mennyi az LTV (Ft)?
= 24000
! 1200 · 0,8 / 0,04 (12. témakör).

? Az infláció 5%, a startup fejlesztőinek nominálbére 8%-kal nő. Kb. hány százalékkal nő a reálbérük?
= 3
= 3%
! 8 − 5 (2. és 6. témakör).

? A cég egy német ügyféltől 20 000 eurót kap. Hány forinttal ér ez többet 410-es, mint 400-as árfolyamon?
= 200000
! 20 000 · 10 – a gyengülő forint az exportőrnek kedvez (9. témakör).

? Az MNB kamatot emel. Mi a legvalószínűbb hatása a startupra?
+ drágább és nehezebben elérhető lesz a finanszírozás
- olcsóbb lesz a hitel
- nőnek a befektetők kockázatvállalási kedve
- nem hat rá
! Kamattranszmisszió (7. témakör).

? Egy recesszióban a startup ügyfelei visszafogják a kiadásaikat. Milyen munkanélküliséget okozhat ez a szektorban?
- súrlódásos
- strukturális
+ ciklikus
- szezonális
! A konjunktúra visszaesése (8. és 11. témakör).

? Az app a felhasználók számának növekedésével egyre hasznosabb lesz (közös órarendek, csoportok). Mi ez?
+ hálózati hatás
- csökkenő hozadék
- morális kockázat
- defláció
! Több felhasználó → értékesebb termék (12. témakör).
```

Gratulálunk, a Közgazdaságtan alapjai tananyag végére értél! A tárgy fogalmai – alternatív költség, határelemzés, ösztönzők, kereslet és kínálat, infláció, kamat, árfolyam – mérnökként, vállalkozóként és állampolgárként is végigkísérnek.

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Metcalfe-törvény.** Egy hálózat értéke a lehetséges kapcsolatok számával arányos: $\frac{n(n - 1)}{2}$. Írd meg a `metcalfe_arany(n1, n2)` függvényt, amely megadja, hányszorosára nő a hálózat értéke, ha a felhasználók száma `n1`-ről `n2`-re nő (2 tizedesre)!

```python starter
def metcalfe_arany(n1, n2):
    return round(n2 / n1, 2)
```

<details>
<summary>Megoldás</summary>

Nagy hálózatnál a felhasználók megduplázása nagyjából megnégyszerezi az értéket – ezért „a győztes visz mindent” sok platformpiacon.

```python solution
def metcalfe_arany(n1, n2):
    kapcsolat = lambda n: n * (n - 1) / 2   # ennyi pár tud egymással kapcsolatba lépni
    return round(kapcsolat(n2) / kapcsolat(n1), 2)
```

</details>

```python test
assert metcalfe_arany(10, 20) == 4.22
assert metcalfe_arany(100, 200) == 4.02
assert metcalfe_arany(1000, 3000) == 9.01
assert metcalfe_arany(2, 4) == 6.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Fedezeti pont.** Egy szoftvercég havi fix költsége `fix` Ft, egy előfizetés ára `ar` Ft, egy előfizető kiszolgálásának változó költsége `valtozo` Ft. Írd meg a `fedezet(fix, ar, valtozo)` függvényt, amely megadja, legalább hány előfizető kell, hogy ne legyen veszteség (egész szám)! Ha az ár nem nagyobb a változó költségnél, adjon vissza `None`-t.

```python starter
def fedezet(fix, ar, valtozo):
    return round(fix / ar)
```

<details>
<summary>Megoldás</summary>

Felfelé kell kerekíteni: 666 előfizetővel még épp veszteséges lenne a cég. Digitális terméknél a változó költség kicsi, ezért a fix költség megtérülése után szinte minden új vevő tiszta fedezet.

```python solution
import math

def fedezet(fix, ar, valtozo):
    if ar <= valtozo:
        return None                       # minden eladás veszteséget termel
    return math.ceil(fix / (ar - valtozo))  # fedezeti hozzájárulás darabonként, felfelé kerekítve
```

</details>

```python test
assert fedezet(1_000_000, 5000, 3000) == 500
assert fedezet(900_000, 4000, 1000) == 300
assert fedezet(1_000_000, 3000, 1500) == 667
assert fedezet(100, 10, 10) is None
print("Minden ellenőrzés sikeres!")
```

**3.** **Megtérülés növekvő bevétellel.** Egy fejlesztés `beruhazas` Ft-ba kerül, az első hónapban `havi` Ft bevételt hoz, és ez havonta `novekedes` %-kal nő. Írd meg a `megterules_honap(beruhazas, havi, novekedes)` függvényt, amely megadja, hányadik hónap végére éri el az összesített bevétel a beruházást! Ha 120 hónap alatt sem, adjon vissza `None`-t.

```python starter
def megterules_honap(beruhazas, havi, novekedes):
    return round(beruhazas / havi)
```

<details>
<summary>Megoldás</summary>

```python solution
def megterules_honap(beruhazas, havi, novekedes):
    osszes = 0
    for honap in range(1, 121):
        osszes += havi                    # e havi bevétel hozzáadása
        havi *= 1 + novekedes / 100       # a következő hónap bevétele
        if osszes >= beruhazas:
            return honap
    return None
```

</details>

```python test
assert megterules_honap(1_000_000, 100_000, 0) == 10
assert megterules_honap(1_000_000, 50_000, 5) == 15
assert megterules_honap(600_000, 100_000, 10) == 5
assert megterules_honap(1_000_000, 5000, 0) is None
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a hálózati hatás?
+ egy termék annál értékesebb egy felhasználónak, minél többen használják
- a hálózati kábelek ára csökken
- az internet sebessége nő
- a felhasználók számával nő a szerverköltség
! Például egy üzenetküldő app csak akkor hasznos, ha az ismerőseid is használják.

? Miért közel nulla egy szoftver egy újabb példányának határköltsége?
- mert a programozók ingyen dolgoznak
+ mert a fejlesztés egyszeri fix költség, a másolás és a terjesztés szinte ingyenes
- mert az állam támogatja
- mert nincs verseny
! A költség döntő része a fejlesztés; egy újabb letöltés alig kerül valamibe.

? Egy előfizetés 3000 Ft, a változó költség 1000 Ft, a havi fix költség 400 000 Ft. Hány előfizető kell a fedezeti ponthoz?
= 200
! $400\,000 / (3000 - 1000) = 200$.

? Mit jelent a „lock-in” (bezártság) egy platformnál?
- a platform nem enged új felhasználókat
+ a felhasználónak drága vagy kényelmetlen átváltani egy versenytársra (adatok, megszokás, kapcsolatok)
- a platform zárva van éjszaka
- a platform tilt minden reklámot
! A magas váltási költség megtartja a vevőket akkor is, ha jobb alternatíva lenne.

? Miért ingyenes sok közösségi oldal a felhasználóknak?
- mert nonprofit szervezetek
+ mert kétoldalú piacon működnek: a hirdetők fizetnek a felhasználók figyelméért és adataiért
- mert az állam fizeti őket
- mert nincs költségük
! „Ha nem fizetsz a termékért, akkor te vagy a termék.”
```
