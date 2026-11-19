---
title: Gyakorlás – GDP, munkanélküliség, infláció
summary: Ellenőrző kérdések és összefoglaló feladatlap egy kitalált ország makroadatairól: GDP a kiadási oldalról, reál növekedés, munkaerőpiaci ráták és infláció.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy ország GDP-je 3%-kal nőtt, a népessége 4%-kal. Javult-e az átlagos életszínvonal?</summary>

Valószínűleg nem: az egy főre jutó GDP kb. 1%-kal **csökkent** (3 − 4). A teljes GDP növekedése önmagában nem mutatja az egy emberre jutó termelést.

</details>

<details>
<summary>2. Miért nem számítjuk bele a GDP-be a köztes termékeket külön?</summary>

Mert az értékük már benne van a végső termék árában. Ha a chipet, a laptopot és a kiskereskedelmi eladást is teljes áron összeadnánk, többszörösen számolnánk ugyanazt az értéket. Ezért a végső termékeket vagy a hozzáadott értékeket adjuk össze.

</details>

<details>
<summary>3. Miért csökkenhet a munkanélküliségi ráta válság idején is?</summary>

Ha sok álláskereső elbátortalanodik és feladja a keresést, átkerül az inaktívak közé. Ilyenkor a munkanélküliek száma és a ráta is csökken, miközben a foglalkoztatás nem nő. Ezért érdemes a foglalkoztatási rátát is nézni.

</details>

<details>
<summary>4. Miért cél a 2–3%-os infláció a 0% helyett?</summary>

Mert a mérési hibák miatt a mért infláció kicsit felülbecsli a valódit, a 0% közelében nő a defláció veszélye, és egy kis infláció mellett a jegybanknak több tere van a kamat csökkentésére válság idején. Emellett a reálbérek kiigazítása is könnyebb.

</details>

## Összefoglaló feladatlap

Egy kitalált ország adatai (ezer milliárd Ft, illetve ezer fő):

| Adat                        | Érték |
| --------------------------- | ----- |
| háztartások fogyasztása (C) | 60    |
| beruházás (I)               | 25    |
| állami vásárlások (G)       | 20    |
| nyugdíjak és segélyek       | 12    |
| export (X)                  | 70    |
| import (M)                  | 65    |
| 15–74 éves népesség         | 8000  |
| foglalkoztatott             | 5520  |
| munkanélküli                | 480   |

```quiz required
? Mennyi a GDP (ezer milliárd Ft)?
= 110
! 60 + 25 + 20 + (70 − 65); a nyugdíj transzfer, nem számít bele.

? Mennyi a munkanélküliségi ráta (%)?
= 8
= 8%
! 480 / (5520 + 480) = 480 / 6000.

? Mennyi a foglalkoztatási ráta (%)?
= 69
= 69%
! 5520 / 8000.

? Jövőre a nominális GDP 121, a GDP-deflátor 105 (idei = 100). Mennyi a reál GDP jövőre (idei árakon), egy tizedesre?
= 115,2
= 115.2
! 121 / 105 · 100 ≈ 115,24.

? Kb. hány százalékos így a reál növekedés? (Egész számra.)
= 5
= 5%
! 115,2 / 110 ≈ 1,048.

? Az árindex 108-ról (tavaly) 104-re (idén) változott. Mi történt?
- defláció
+ dezinfláció
- hiperinfláció
! Az infláció 8%-ról 4%-ra lassult, de az árak még nőnek.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Reál növekedés.** Írd meg a `real_novekedes(nominalis, deflator)` függvényt, amely a nominális GDP növekedéséből és a deflátor változásából (mindkettő %) kiszámolja a reál növekedést 1 tizedesre!

```python starter
def real_novekedes(nominalis, deflator):
    return round(nominalis - deflator, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def real_novekedes(nominalis, deflator):
    return round(100 * ((1 + nominalis / 100) / (1 + deflator / 100) - 1), 1)
```

</details>

```python test
assert real_novekedes(8, 5) == 2.9
assert real_novekedes(16.4, 11.4) == 4.5
assert real_novekedes(3, 3) == 0.0
assert real_novekedes(2, 6) == -3.8
print("Minden ellenőrzés sikeres!")
```

**2.** **Munkaerőpiaci ráták.** Írd meg a `ratak(foglalkoztatott, munkanelkuli, inaktiv)` függvényt, amely a `(munkanélküliségi ráta, aktivitási ráta, foglalkoztatási ráta)` hármast adja vissza százalékban, 1 tizedesre!

```python starter
def ratak(foglalkoztatott, munkanelkuli, inaktiv):
    nep = foglalkoztatott + munkanelkuli + inaktiv
    return (round(100 * munkanelkuli / nep, 1), 0, 0)
```

<details>
<summary>Megoldás</summary>

A harmadik teszt a fürdőkádas példa: 60 ezer elbátortalanodott munkanélküli „javítja” a rátát, a foglalkoztatás nem változik.

```python solution
def ratak(foglalkoztatott, munkanelkuli, inaktiv):
    aktiv = foglalkoztatott + munkanelkuli          # munkaerő
    nep = aktiv + inaktiv                           # 15–74 éves népesség
    return (round(100 * munkanelkuli / aktiv, 1),   # a munkaerőhöz viszonyítva!
            round(100 * aktiv / nep, 1),
            round(100 * foglalkoztatott / nep, 1))
```

</details>

```python test
assert ratak(4700, 210, 2590) == (4.3, 65.5, 62.7)
assert ratak(900, 100, 500) == (10.0, 66.7, 60.0)
assert ratak(4700, 150, 2650) == (3.1, 64.7, 62.7)
print("Minden ellenőrzés sikeres!")
```

**3.** **Fogyasztói árindex.** Írd meg az `inflacio(kosar)` függvényt, amely a `{tétel: (súly, árváltozás %)}` szótárból kiszámolja a súlyozott átlagos inflációt 2 tizedesre! A súlyok összege nem feltétlenül 1 – ilyenkor normáld őket.

```python starter
def inflacio(kosar):
    return round(sum(v for s, v in kosar.values()) / len(kosar), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def inflacio(kosar):
    ossz_suly = sum(s for s, v in kosar.values())
    return round(sum(s * v for s, v in kosar.values()) / ossz_suly, 2)   # súlyozott átlag
```

</details>

```python test
assert inflacio({"élelmiszer": (0.6, 5), "egyéb": (0.4, 10)}) == 7.0
assert inflacio({"a": (25, 6), "b": (20, 3), "c": (15, -2), "d": (10, 8), "e": (5, -5), "f": (25, 4)}) == 3.35
assert inflacio({"x": (1, 2), "y": (3, 6)}) == 5.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik NEM számít bele a GDP-be?
- egy újonnan épült lakás
- egy hazai gyártású autó
+ egy használt autó eladása magánszemélyek között
- egy fodrász szolgáltatása
! A használt termék már egyszer beszámított a GDP-be, amikor előállították.

? Egy ország népessége 10 millió fő, a GDP-je 80 000 milliárd Ft. Mennyi az egy főre jutó GDP (millió Ft)?
= 8
! $80\,000 \text{ mrd} / 10 \text{ millió} = 8$ millió Ft.

? Mit mutat a maginfláció?
+ az árszint változását a legingadozóbb tételek (pl. energia, friss élelmiszer) nélkül
- csak az élelmiszerek drágulását
- a bérek növekedését
- a GDP-deflátort
! A tartós inflációs folyamatot jobban mutatja.

? Kinek kedvez a váratlanul magas infláció?
- a megtakarítóknak
+ a fix kamatozású hitellel rendelkező adósoknak
- a fix jövedelműeknek
- a nyugdíjasoknak, ha a nyugdíj nem követi az árakat
! Az adósság reálértéke csökken.

? A nominális GDP 1000-ről 1100-ra, a deflátor 100-ról 105-re nő. Mennyi lesz a reál GDP (egészre kerekítve)?
= 1048
! $\frac{1100}{1{,}05} \approx 1048$.
```
