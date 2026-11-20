---
title: Gyakorlás – prezentáció és előadás
summary: Ellenőrző kérdések és összefoglaló feladatlap a felkészülésről, a diák tervezéséről és az előadástechnikáról, egy saját mini-előadás vázlatával.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért ne a diákkal kezdd a felkészülést?</summary>

Mert a diák csak eszközök. Előbb tudnod kell, kinek beszélsz, mi a célod és mi az egyetlen mondat, amit a közönségnek haza kell vinnie. Ezek nélkül a diák szétesnek, és a felsorolás helyettesíti a gondolatmenetet.

</details>

<details>
<summary>2. Mi a baj a „Kérdések?” záródiával?</summary>

Gyakran csend követi, és ez lesz az utolsó benyomás. Jobb, ha a kulcsüzenettel és egy felhívással zársz, és az összefoglaló dia marad kint a kérdések alatt.

</details>

<details>
<summary>3. Miért ismételd meg a közönség kérdését, mielőtt válaszolsz?</summary>

Hogy mindenki hallja (főleg nagy teremben vagy felvételnél), hogy ellenőrizd, jól értetted-e, és hogy nyerj pár másodpercet a válasz átgondolására.

</details>

<details>
<summary>4. Feladat: tervezz meg egy 5 perces előadást a kedvenc programozási eszközödről!</summary>

Írd le: közönség (pl. elsőéves hallgatók), cél (kipróbálják), kulcsüzenet (egy mondat), nyitás (kérdés vagy adat), 3 fő gondolat, egy rövid történet vagy demó, zárás felhívással. 5 perc kb. 600–700 szó és legfeljebb 5–6 dia. Mondd el hangosan, stopperrel.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik a kulcsüzenet jó próbája?
- belefér-e egyetlen diára
+ el tudod-e mondani kb. 30 másodperc alatt (liftbeszéd)
- tartalmaz-e szakszavakat
- van-e róla ábra
! Ha nem megy röviden, még nem tiszta.

? Kategóriák (pl. öt böngésző piaci részesedése) összehasonlítására melyik ábra a legjobb?
- vonaldiagram
+ oszlop- vagy sávdiagram
- 3D kördiagram
- pontdiagram
! Kategóriák összehasonlítása → oszlop/sáv.

? Melyik segít legjobban a lámpaláz ellen az előadás elején?
- kávé közvetlenül előtte
+ alapos felkészülés és egy szinte szó szerint megtanult nyitás
- gyorsabb beszéd, hogy hamar vége legyen
- a közönség kerülése
! Az első percek után beindulsz.

? 20 perces előadás 10/20/30 szerint legfeljebb hány diából álljon?
= 10
! 10 dia, 20 perc, 30 pont.

? Melyik **nem** jó tanács élő demóhoz?
- forgatókönyv
- előkészített adatok
+ mindent élőben begépelni, hogy hitelesebb legyen
- felnagyított betűméret
! Az élő gépelés lassú és hibalehetőség.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Szókeret.** Írd meg a `szokeret(perc, tempo, tartalek)` függvényt, amely megadja, hány szót mondhatsz el egy `perc` hosszú előadásban, ha `tartalek` percet kérdésekre hagysz, és `tempo` szó/perc sebességgel beszélsz!

```python starter
def szokeret(perc, tempo, tartalek):
    return perc * tempo
```

<details>
<summary>Megoldás</summary>

```python solution
def szokeret(perc, tempo, tartalek):
    return (perc - tartalek) * tempo        # csak a nettó idő számít
```

</details>

```python test
assert szokeret(15, 130, 2) == 1690
assert szokeret(10, 140, 0) == 1400
assert szokeret(20, 120, 5) == 1800
print("Minden ellenőrzés sikeres!")
```

**2.** **Zsúfolt dia?** Írd meg a `zsufolt(pontok)` függvényt, amely `True`-t ad, ha a dián 6-nál több pont van, **vagy** a pontok összesen 30-nál több szóból állnak!

```python starter
def zsufolt(pontok):
    return len(pontok) > 6
```

<details>
<summary>Megoldás</summary>

```python solution
def zsufolt(pontok):
    szavak = sum(len(p.split()) for p in pontok)   # az összes szó a dián
    return len(pontok) > 6 or szavak > 30
```

</details>

```python test
assert zsufolt(["a"] * 7) is True
assert zsufolt(["Dupla foglalások", "Papíron vezetett változások"]) is False
assert zsufolt(["egy két három négy öt hat hét nyolc kilenc tíz"] * 4) is True
print("Minden ellenőrzés sikeres!")
```

**3.** **Időterv.** Írd meg az `idoterv(netto, aranyok)` függvényt, amely egy `{szakasz: arány}` szótárból `{szakasz: perc}` szótárat készít (1 tizedesre kerekítve)! Ha az arányok összege nem 1 (0,001-es tűréssel), dobjon `ValueError`-t.

```python starter
def idoterv(netto, aranyok):
    return {nev: round(netto * a, 1) for nev, a in aranyok.items()}
```

<details>
<summary>Megoldás</summary>

```python solution
def idoterv(netto, aranyok):
    if abs(sum(aranyok.values()) - 1) > 0.001:      # az arányoknak a teljes időt kell lefedniük
        raise ValueError("az arányok összege nem 1")
    return {nev: round(netto * a, 1) for nev, a in aranyok.items()}
```

</details>

```python test
assert idoterv(13, {"nyitás": 0.15, "demó": 0.3, "többi": 0.55}) == {"nyitás": 1.9, "demó": 3.9, "többi": 7.2}
try:
    idoterv(10, {"a": 0.5, "b": 0.6})
    assert False, "ValueError kellett volna"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a 10/20/30 szabály (Guy Kawasaki)?
+ legfeljebb 10 dia, 20 perc, legalább 30-as betűméret
- 10 perc, 20 dia, 30 kérdés
- 10 pont diánként, 20 szó pontonként
- 30 dia 10 perc alatt
! Rövid, jól olvasható előadás.

? Egy 20 perces előadáshoz diánként 2 percet tervezel. Hány dia legyen?
= 10
! $20 / 2 = 10$.

? Mi a teendő élő demó előtt?
- semmi, a demó úgyis működik
+ tartalék (felvett videó vagy képernyőképek), előre betöltött adatok és kipróbált környezet
- a demó közben írni meg az utolsó funkciót
- a demót a végére hagyni, hogy ne legyen rá idő
! Ami elromolhat, az el is romlik – kell B terv.

? Melyik a jó nyitás egy projektbemutatón?
- „Hát, akkor kezdjük...”
+ egy konkrét probléma vagy meglepő adat, ami miatt a projekt fontos
- a csapattagok életrajza
- bocsánatkérés a felkészületlenségért
! Az első percben dől el, figyel-e a közönség.
```
