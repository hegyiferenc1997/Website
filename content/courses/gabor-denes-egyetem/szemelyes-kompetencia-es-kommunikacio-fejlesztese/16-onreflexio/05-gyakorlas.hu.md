---
title: Gyakorlás – önreflexió
summary: Ellenőrző kérdések és összefoglaló feladatlap a tapasztalati tanulásról, az önismereti eszközökről, a fejlődési szemléletről és az érzelmi intelligenciáról; saját reflexió egy eseményről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Gibbs ciklusával dolgozd fel egy közelmúltbeli helyzetedet, ami nem úgy sikerült, ahogy szeretted volna!</summary>

Írd le sorban: (1) mi történt, (2) mit éreztél, (3) mi volt jó és mi rossz, (4) miért alakult így, (5) mit csinálhattál volna másképp, (6) konkrétan mit teszel legközelebb. A 6. lépés legyen ellenőrizhető (pl. „két nappal előbb befejezem”), ne általános („jobban fogok figyelni”).

</details>

<details>
<summary>2. Kérj visszajelzést két csoporttársadtól: miben vagy jó a csapatmunkában, és min változtatnál? Mit tudtál meg a vakfoltodról?</summary>

Nincs egyetlen jó válasz. Hallgasd végig védekezés nélkül, köszönd meg, és válassz ki egy dolgot, amin a következő hetekben dolgozol. A visszajelzés kérése a Johari-ablak vakfoltját csökkenti.

</details>

<details>
<summary>3. Készítsd el a személyes SWOT-elemzésedet, és vonj le belőle két következtetést!</summary>

Mezőnként 3–5 pont. Következtetés példák: „Erősség + lehetőség: jól írok, és van egy szakkollégiumi blog → jelentkezem cikket írni.” „Gyengeség + veszély: halogatok, és sok párhuzamos határidőm lesz → időblokkolással tervezem a hetet.”

</details>

<details>
<summary>4. Miért gyakori az imposztor-szindróma az informatikában?</summary>

Mert a szakma hatalmas és gyorsan változik, mindig van, amit nem tudsz; a kezdők a tapasztalt fejlesztőkhöz és az online látható „legjobb pillanatokhoz” mérik magukat; és a kódban a hibák jól láthatók. Ez normális – a tapasztalt fejlesztők is folyamatosan tanulnak.

</details>

## Összefoglaló feladatlap

> Anna elsőéves hallgató. Az első programozási beadandója visszajött azzal, hogy a kódja működik, de nehezen olvasható. Anna először azt gondolja: „Nem vagyok programozónak való.”

```quiz required
? Anna első gondolata milyen szemléletet tükröz?
+ rögzült szemléletet
- fejlődési szemléletet
- érzelmi intelligenciát
- önszabályozást
! A kudarcot a képessége bizonyítékának tekinti.

? Hogyan fogalmazhatná át fejlődési szemlélettel?
- „Soha nem fog menni.”
+ „Még nem írok olvasható kódot, de megtanulhatom – megnézem, mit javasoltak.”
- „Az oktató nem ért hozzá.”
- „A többiek tehetségesebbek.”
! „Még nem” + konkrét lépés.

? Kolb ciklusában melyik lépés az, amikor Anna a következő beadandónál beszédes változóneveket és rövidebb függvényeket használ?
- konkrét tapasztalat
- reflektív megfigyelés
- elvont fogalomalkotás
+ aktív kísérletezés
! Kipróbálja az újat.

? A visszajelzés olyasmit mutatott meg, amit Anna nem vett észre a saját kódjában. A Johari-ablak melyik mezőjéről van szó?
- nyitott terület
+ vakfolt
- rejtett terület
- ismeretlen terület
! Mások látják, ő nem.

? Anna dühös a visszajelzés miatt, de nem ír azonnal éles választ, hanem másnap nyugodtan megköszöni, és kérdez. Melyik EQ-összetevőt mutatja?
- empátia
+ önszabályozás
- motiváció
- társas készségek
! Kezeli az érzelmeit.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Eltérés a 360 fokos visszajelzésben.** Írd meg az `elteres(sajat, masok)` függvényt, amely visszaadja a saját értékelés és a mások értékeléseinek átlaga közti különbséget (saját − átlag, 2 tizedesre)!

```python starter
def elteres(sajat, masok):
    return round(sajat - max(masok), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import mean

def elteres(sajat, masok):
    return round(sajat - mean(masok), 2)   # pozitív: többre tartod magad
```

</details>

```python test
assert elteres(4, [2, 3, 2.5]) == 1.5
assert elteres(3, [5, 4, 5]) == -1.67
assert elteres(4, [4, 4]) == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Johari-címke.** Írd meg a `johari(elteres)` függvényt: ha az eltérés legalább 1, adja vissza: `"vak folt"`, ha legfeljebb −1: `"rejtett erősség"`, különben `"nyílt terület"`!

```python starter
def johari(elteres):
    return "vak folt" if elteres > 0 else "rejtett erősség"
```

<details>
<summary>Megoldás</summary>

```python solution
def johari(elteres):
    if elteres >= 1:
        return "vak folt"              # mások kevesebbre tartanak
    if elteres <= -1:
        return "rejtett erősség"       # mások többre tartanak
    return "nyílt terület"
```

</details>

```python test
assert johari(1.5) == "vak folt"
assert johari(1) == "vak folt"
assert johari(-1.67) == "rejtett erősség"
assert johari(0.5) == "nyílt terület"
assert johari(-0.9) == "nyílt terület"
print("Minden ellenőrzés sikeres!")
```

**3.** **Kalibráció.** Írd meg a `kalibracio(eredmenyek)` függvényt, amely `(becsült %, valós %)` párokból visszaadja a `(torzítás, átlagos hiba)` párt: a torzítás a (becslés − valós) különbségek átlaga, az átlagos hiba ezek abszolút értékének átlaga (mindkettő 1 tizedesre)!

```python starter
def kalibracio(eredmenyek):
    k = [b - v for b, v in eredmenyek]
    return round(sum(k) / len(k), 1), round(sum(k) / len(k), 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def kalibracio(eredmenyek):
    k = [b - v for b, v in eredmenyek]                 # pozitív: túlbecslés
    torzitas = sum(k) / len(k)
    hiba = sum(abs(x) for x in k) / len(k)             # a tipikus tévedés mérete
    return round(torzitas, 1), round(hiba, 1)
```

</details>

```python test
assert kalibracio([(80, 70), (70, 60), (60, 50)]) == (10.0, 10.0)
assert kalibracio([(80, 62), (60, 55), (85, 70), (50, 58), (75, 64)]) == (8.2, 11.4)
assert kalibracio([(50, 60), (70, 60)]) == (0.0, 10.0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Miért kevés két tévedés, amelyek kioltják egymást (egyszer +10, egyszer −10), ahhoz, hogy jól kalibráltnak mondd magad?
+ mert a torzítás 0, de az átlagos hiba 10 pont – a becslések egyenként pontatlanok
- mert a torzítás 10
- mert két mérés mindig elég
- mert a kalibrációt csak tanár mérheti
! Ezért kell a torzítás mellé az átlagos hibát is nézni.

? Önértékelésed 2, a csapattársaid 4, 3 és 5 pontot adnak. Mekkora az eltérés (saját − mások átlaga)?
= -2
! A mások átlaga 4, az eltérés $2 - 4 = -2$: rejtett erősség.

? Mit érdemes tenni, ha a 360 fokos visszajelzés vak foltot mutat?
- vitatkozni az értékelőkkel
+ konkrét példát kérni („mikor láttad ezt?”), és egy fejlődési célt kitűzni
- figyelmen kívül hagyni
- legközelebb nem kérni visszajelzést
! A vak folt a legértékesebb információ, mert magadtól nem vennéd észre.

? Mi a Gibbs-ciklus utolsó lépése?
- leírás
- érzések
- elemzés
+ cselekvési terv
! A változás a konkrét, felelőshöz és időponthoz kötött teendőkkel kezdődik.
```
