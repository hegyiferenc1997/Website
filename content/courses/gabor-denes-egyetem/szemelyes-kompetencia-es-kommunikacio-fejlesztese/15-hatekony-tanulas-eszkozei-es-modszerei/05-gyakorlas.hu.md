---
title: Gyakorlás – hatékony tanulás
summary: Ellenőrző kérdések és összefoglaló feladatlap az emlékezetről, a hatékony tanulási módszerekről és a tanulás gyakorlatáról; saját tanulási terv egy vizsgára.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért jobb két hét alatt napi 1 órát tanulni, mint a vizsga előtti két napon 7-7 órát?</summary>

Az időközös ismétlés miatt: a szétszórt ismétlések minden alkalommal erősítik az emléket, és a felejtési görbe egyre laposabb lesz. A magolás rövid távon működhet, de gyorsan felejtünk, ráadásul a fáradtság és az alváshiány rontja a teljesítményt.

</details>

<details>
<summary>2. Magyarázd el a Feynman-technikával, mi a rekurzió!</summary>

Például: „A rekurzió az, amikor egy függvény önmagát hívja meg, de mindig egy kisebb feladattal, amíg el nem ér egy olyan egyszerű esetet, amit már közvetlenül meg tud oldani. Mint az orosz matrjoska baba: kinyitod, benne egy kisebb, és így tovább, amíg a legkisebbhez nem érsz.” Ahol elakadsz, ott nézz utána.

</details>

<details>
<summary>3. Készíts tanulási tervet egy három hét múlva esedékes vizsgára!</summary>

Bontsd témákra az anyagot; minden témánál: kidolgozott példák → önálló feladatok → kártyák a fogalmakhoz. Ütemezz ismétléseket (pl. 1, 3, 7, 14 nap után), keverd a feladattípusokat, hetente oldj meg egy vegyes gyakorlósort, és hagyj időt alvásra és szünetekre. Az utolsó napon ne új anyagot tanulj, hanem ismételj.

</details>

<details>
<summary>4. Hogyan használnád az MI-t egy nehéz programozási feladatnál úgy, hogy közben tanulj is?</summary>

Előbb magad próbálkozol; ha elakadsz, tippet kérsz, nem kódot; megkéred, hogy magyarázza el a fogalmat, amit nem értesz; a saját megoldásodat átnézeted, és megkérdezed, miért lenne jobb egy másik megoldás. Mindent ellenőrzöl, és betartod a tárgy szabályait.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik a leghatékonyabb módja egy fejezet ismétlésének?
- harmadszor is elolvasni
- minden fontos mondatot kiemelni
+ becsukni a könyvet, és emlékezetből leírni a lényeget, aztán ellenőrizni
- meghallgatni egy hangoskönyvet alvás közben
! Aktív felidézés.

? Egy ismétlési ütemterv szerint az első ismétlés 1, a második 2, a harmadik 4, a negyedik 8 nappal az előző után van. Hány nappal a tanulás után lesz a negyedik ismétlés?
= 15
! 1 + 2 + 4 + 8 = 15 nap.

? A felejtési görbe egyszerűsített modelljében mi történik, ha nő az emlék erőssége (S)?
- gyorsabban felejtünk
+ lassabban felejtünk, a görbe laposabb
- nem változik semmi
- a görbe emelkedni kezd
! Az ismétlés növeli S-t.

? Gyakorláskor 20 ciklusos feladat jön, aztán 20 rekurziós. Hogyan lehetne hatékonyabb?
+ keverni a feladattípusokat (váltogatás)
- még 20 ciklusos feladatot hozzáadni
- csak a könnyűeket megoldani
- a megoldásokat elolvasni feladatmegoldás helyett
! Interleaving.

? Melyik állítás **tévhit**?
- az alvás segíti az emlékek megszilárdulását
- a felidézés hatékonyabb az újraolvasásnál
+ a tanulási stílushoz (vizuális, auditív, kinesztetikus) igazított tanulás bizonyítottan hatékonyabb
- a szétszórt ismétlés tartósabb tudást ad
! A tanulási stílusok elméletét a kutatások nem igazolták.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Felejtési görbe.** Írd meg a `megtartas(t, s)` függvényt, amely a felejtési görbe egyszerű modellje szerint megadja, a tudás mekkora része marad meg `t` nap után, ha az emlékezet „stabilitása” `s` nap: $e^{-t/s}$ (3 tizedesre)!

```python starter
def megtartas(t, s):
    return round(1 - t / s, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import exp

def megtartas(t, s):
    return round(exp(-t / s), 3)   # exponenciális felejtés
```

</details>

```python test
assert megtartas(0, 5) == 1.0
assert megtartas(5, 5) == 0.368
assert megtartas(10, 5) == 0.135
assert megtartas(1, 2) == 0.607
print("Minden ellenőrzés sikeres!")
```

**2.** **Leitner-doboz.** Írd meg a `kovetkezo_doboz(doboz, tudta, max_doboz=4)` függvényt: ha a kártyát tudtad, egy dobozzal feljebb kerül (legfeljebb `max_doboz`-ig), ha nem, visszakerül az 1. dobozba!

```python starter
def kovetkezo_doboz(doboz, tudta, max_doboz=4):
    return doboz + 1 if tudta else doboz - 1
```

<details>
<summary>Megoldás</summary>

```python solution
def kovetkezo_doboz(doboz, tudta, max_doboz=4):
    if not tudta:
        return 1                             # hiba esetén elölről
    return min(doboz + 1, max_doboz)         # a legfelső dobozban marad
```

</details>

```python test
assert kovetkezo_doboz(1, True) == 2
assert kovetkezo_doboz(3, False) == 1
assert kovetkezo_doboz(4, True) == 4
assert kovetkezo_doboz(2, True, max_doboz=2) == 2
print("Minden ellenőrzés sikeres!")
```

**3.** **Ismétlési ütemterv.** Írd meg az `utemterv(elso, szorzo, db)` függvényt, amely visszaadja `db` ismétlés napjait a tanulás napjától számolva, ha az első ismétlés `elso` nap után jön, és minden következő szünet `szorzo`-szor hosszabb az előzőnél (egészre kerekítve)!

```python starter
def utemterv(elso, szorzo, db):
    return [elso * szorzo * i for i in range(1, db + 1)]
```

<details>
<summary>Megoldás</summary>

```python solution
def utemterv(elso, szorzo, db):
    napok, nap, szunet = [], 0, elso
    for _ in range(db):
        nap += szunet                        # a szünetek összeadódnak
        napok.append(round(nap))
        szunet *= szorzo                     # egyre hosszabb szünet
    return napok
```

</details>

```python test
assert utemterv(1, 2, 5) == [1, 3, 7, 15, 31]
assert utemterv(2, 1, 3) == [2, 4, 6]
assert utemterv(1, 2.5, 3) == [1, 4, 10]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent az előhívásos gyakorlás (retrieval practice)?
- a jegyzet többszöri átolvasását
+ az anyag felidézését emlékezetből, pl. kérdésekkel, kártyákkal
- a fontos részek kiemelését szövegkiemelővel
- a tananyag lemásolását
! A felidézés erősíti az emléknyomot, az átolvasás csak ismerősség-érzést ad.

? A modell szerint $s = 5$ napos stabilitásnál 5 nap után a tudás kb. hány százaléka marad meg? (egészre)
= 37
! $e^{-1} \approx 0{,}368$, azaz kb. 37%.

? Miért hatékonyabb az elosztott gyakorlás, mint egy hosszú „bemagolás” a vizsga előtti éjjel?
- mert kevesebb ideig tart
+ mert minden ismétlés a felejtés egy későbbi pontján erősíti meg az emléket, így tartósabb lesz
- mert közben nem kell figyelni
- nem hatékonyabb
! Az ismétlések közti szünet maga is része a tanulásnak.

? Mi a növekedési szemlélet (growth mindset) lényege?
- a tehetség veleszületett és nem változik
+ a képességek erőfeszítéssel, jó stratégiával és visszajelzéssel fejleszthetők
- csak a dicséret számít
- a hibákat el kell rejteni
! A hiba így információ, nem ítélet.
```
