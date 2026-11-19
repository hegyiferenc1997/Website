---
title: Gyakorlás – interkulturális kommunikáció és etika
summary: Ellenőrző kérdések és összefoglaló feladatlap a kulturális dimenziókról, a kontextusról, az időfelfogásról és a kommunikáció etikájáról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég a nyelvet ismerni egy nemzetközi csapatban?</summary>

Mert a kultúra nagyobb része rejtett: a hatalomhoz, az időhöz, a visszajelzéshez való viszony. Ugyanaz a mondat (pl. „ezt megfontoljuk”) az egyik kultúrában igent, a másikban udvarias nemet jelenthet.

</details>

<details>
<summary>2. Hogyan kerülheted el a sztereotipizálást, ha ismered Hofstede dimenzióit?</summary>

Hipotézisként kezeled őket, nem ítéletként: ha egy reakció meglep, gondolsz rá, hogy lehet kulturális oka, de rákérdezel, és az adott embert ismered meg. Egy országon belül nagy a szórás.

</details>

<details>
<summary>3. Egy japán partner a javaslatodra azt mondja: „Ez érdekes, meg kell vizsgálnunk.” Mit tegyél?</summary>

Ne vedd automatikusan igennek. Kérdezz rá tapintatosan a következő lépésekre és az esetleges aggályokra, akár négyszemközt vagy egy közvetítőn keresztül, és adj időt, hogy a csoportjuk egyeztessen.

</details>

<details>
<summary>4. Miért etikai kérdés az, hogy mit másolsz be egy nyilvános MI-chatbotba?</summary>

Mert a bemásolt szöveg (céges kód, ügyféladat, személyes adat) a szolgáltatóhoz kerül, és a beállításoktól függően felhasználhatják vagy tárolhatják. Ez sértheti a titoktartást (NDA) és az adatvédelmi szabályokat (GDPR).

</details>

## Összefoglaló feladatlap

> Egy magyar–indiai–holland csapatban dolgozol, a megrendelő az USA-ban van.

```quiz required
? Az amerikai megrendelő azt írja: „Deadline: 03/04/2027”. Mit tegyél?
- március 4-ének veszed, és nem kérdezel
- április 3-ának veszed, és nem kérdezel
+ visszakérdezel, és a válaszban egyértelmű formátumot használsz (pl. 2027-03-04)
- figyelmen kívül hagyod
! Az USA-ban hónap/nap, Európában nap/hónap a szokás.

? A holland kolléga a csapat előtt nyíltan bírálja az indiai kolléga tervét, aki ezután elhallgat. Mi a legjobb lépés csapatvezetőként?
- semmi, a nyíltság mindig jó
+ megbeszélni a csapattal, hogyan adunk visszajelzést, és a negatív kritikát négyszemközt kérni
- megtiltani a kritikát
- az indiai kollégát kizárni a megbeszélésekről
! Közös munkamód, arcvesztés elkerülése.

? A csapat Budapesten (CET), Bangalore-ban (CET + 4,5 óra) és San Franciscóban (CET − 9 óra) dolgozik. Hány óra az időkülönbség Bangalore és San Francisco között?
= 13,5
= 13.5
! 4,5 − (−9) = 13,5 óra.

? A megrendelő ügyféladatbázisát szeretnéd gyorsan elemezni egy nyilvános MI-chatbottal. Mit tegyél?
- bemásolod, hiszen gyorsabb
+ előbb megnézed, engedélyezett-e, és csak anonimizált adatot használsz
- elküldöd a csapat chatjébe
- kinyomtatod
! Adatvédelem és titoktartás.

? Melyik kifejezés követi a befogadó nyelvhasználatot?
- „Ezt még a nagymamám is megérti.”
- „Ez nem lányoknak való feladat.”
+ „Ezt a részt lépésről lépésre elmagyarázom, hogy mindenki könnyen követhesse.”
- „Ezt egy igazi programozó magától tudja.”
! Tiszteletteljes, nem lekezelő.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Közös munkaidő.** Írd meg a `kozos_ora(e1, e2)` függvényt, amely két, UTC-hez képest `e1` és `e2` órával eltolt városban dolgozók közös munkaidejét adja órában, ha mindkét helyen helyi idő szerint 9 és 17 óra között dolgoznak! (Feltételezheted, hogy egyik munkaidő sem lóg át éjfélen UTC szerint.)

```python starter
def kozos_ora(e1, e2):
    return 8 - abs(e1 - e2) / 2
```

<details>
<summary>Megoldás</summary>

```python solution
def kozos_ora(e1, e2):
    k1, v1 = 9 - e1, 17 - e1                  # munkaidő UTC-ben
    k2, v2 = 9 - e2, 17 - e2
    return max(0, min(v1, v2) - max(k1, k2))  # a két intervallum metszete
```

</details>

```python test
assert kozos_ora(1, -5) == 2
assert kozos_ora(1, 5.5) == 3.5
assert kozos_ora(1, 1) == 8
assert kozos_ora(9, 0) == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Várható érték.** Írd meg a `varhato(hatasok)` függvényt, amely `(valószínűség, hatás)` párok listájából kiszámolja a várható értéket (2 tizedesre)!

```python starter
def varhato(hatasok):
    return round(sum(h for _, h in hatasok) / len(hatasok), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def varhato(hatasok):
    return round(sum(p * h for p, h in hatasok), 2)   # valószínűséggel súlyozott összeg
```

</details>

```python test
assert varhato([(0.9, 10), (0.1, -200)]) == -11.0
assert varhato([(1.0, -5), (1.0, 15)]) == 10.0
assert varhato([(0.5, 4), (0.5, 0)]) == 2.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Eloszlások átfedése.** Két kultúra tagjainak egy tulajdonsága normális eloszlású, átlaguk `d` szórásnyira van egymástól. Írd meg az `atfedes(d)` függvényt, amely a két görbe alatti közös terület arányát adja (2 tizedesre): $2 \cdot \Phi(-|d|/2)$, ahol $\Phi(z) = \frac12\left(1 + \mathrm{erf}(z/\sqrt2)\right)$!

```python starter
def atfedes(d):
    return round(1 - d / 4, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import erf, sqrt

def fi(z):
    return 0.5 * (1 + erf(z / sqrt(2)))       # standard normális eloszlásfüggvény

def atfedes(d):
    return round(2 * fi(-abs(d) / 2), 2)
```

</details>

```python test
assert atfedes(0) == 1.0
assert atfedes(1) == 0.62
assert atfedes(2) == 0.32
assert atfedes(-1) == 0.62
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent a magas kontextusú kommunikáció?
+ sok minden a helyzetből, a kapcsolatból és a ki nem mondott jelekből derül ki
- mindent pontosan, szó szerint kimondanak
- csak írásban kommunikálnak
- sok szakszót használnak
! Pl. Japánban; az alacsony kontextusú kultúrák (pl. Németország) a kimondott szóra építenek.

? Budapest UTC+1, Bengaluru UTC+5,5. Mindkét helyen 9–17 között dolgoznak. Hány óra a közös munkaidő? (tizedes törtként)
= 3,5
= 3.5
! UTC-ben Budapest 8–16, Bengaluru 3,5–11,5: az átfedés 8–11,5, azaz 3,5 óra.

? Melyik a befogadó nyelvhasználat példája?
- „a srácok majd megcsinálják”
+ „a csapat majd megcsinálja”
- „ezt a nagymamám is megértené”
- „ez egy beteg ötlet”
! Senkit sem zár ki vagy minősít.

? Mit tanácsol az ACM etikai kódexe egy ismert, felhasználókat veszélyeztető hibáról?
- hallgasd el, amíg kijavítod
+ légy őszinte és kerüld a kárt: jelezd az érintetteknek
- csak a főnöködnek szólj, másnak soha
- a felhasználók dolga észrevenni
! A kár elkerülése és az őszinteség alapelv.
```
