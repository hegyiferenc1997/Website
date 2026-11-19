---
title: Gyakorlás – írásbeli kommunikáció
summary: Ellenőrző kérdések és összefoglaló feladatlap az üzleti e-mailről, az üzleti dokumentumokról és a műszaki dokumentációról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Javítsd ki ezt az e-mailt: tárgy: „kérdés”, szöveg: „hello, a beadandóval kapcsolatban kérdeznék, mert nem értem, köszi”</summary>

Tárgy: „Kérdés: az adatbázis-modul beadandójának formátuma”

„Kedves Tóth Anna!

Az adatbázis-modul beadandójával kapcsolatban szeretnék kérdezni: a lekérdezéseket külön .sql fájlban vagy a dokumentáció részeként kell leadni?

Köszönöm a segítséget!

Üdvözlettel:
Kiss Bence (mérnökinformatikus BSc, 1. évf.)”

</details>

<details>
<summary>2. Mi a különbség a Másolat és a Titkos másolat között?</summary>

A Másolat mezőben lévő címeket minden címzett látja, és tájékoztatásra szolgál. A Titkos másolat címzettjeit a többiek nem látják – sok külső címzettnél ezzel védheted a címeket.

</details>

<details>
<summary>3. Miért érdemes a megbeszélés után 24 órán belül kiküldeni az emlékeztetőt?</summary>

Mert még mindenki emlékszik, és ha valaki másképp értett egy döntést, azonnal jelezheti. Később a különböző emlékek rögzülnek, és nehezebb tisztázni.

</details>

<details>
<summary>4. Írd át piramis-elv szerint: „Megvizsgáltunk három tárhelyszolgáltatót: A drága, B lassú, C megfelelő árú és gyors. Ezért C-t javasoljuk.”</summary>

„C szolgáltatót javasoljuk, mert a három vizsgált közül ez a legjobb ár-teljesítmény arányú. A drágább (havi díj), B lassabb (mért válaszidő) volt.”

</details>

## Összefoglaló feladatlap

```quiz required
? Egy e-mailben három különböző témáról akarsz kérdezni három különböző embert. Mi a legjobb?
- egy hosszú e-mail mindhármuknak, egy bekezdésben
+ témánként külön e-mail a megfelelő címzettnek
- egy chatüzenet a csapatcsatornába
- egy e-mail mindenkinek Titkos másolatban
! Egy e-mail – egy téma.

? Melyik e-mail-zárás a megfelelő egy hivatalos levélben, amelyet egy ismeretlen cégnek írsz?
- „Csá!”
- „Na, várom!”
+ „Üdvözlettel:” + teljes név és elérhetőség
- nincs zárás
! Udvarias, teljes aláírással.

? Egy heti állapotjelentésben a projekt csúszik, és vezetői döntés kell. Milyen színt kap a „közlekedési lámpa” szerint?
- zöld
- sárga
+ piros
- kék
! Piros: csúszás, beavatkozás kell.

? Melyik elem **nem** kell egy jó hibajelentésbe?
- környezet (böngésző, verzió)
- reprodukálható lépések
- várt és tényleges eredmény
+ a hibát okozó fejlesztő hibáztatása
! A hibajelentés tényeket rögzít, nem bűnöst keres.

? Pályakezdőként hány oldalas önéletrajz az ajánlott?
= 1
! Egy jól szerkesztett oldal.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **LIX-mutató.** Írd meg a `lix(szoveg)` függvényt (1 tizedesre): szavak/mondatok + 100 · hosszú szavak/szavak, ahol hosszú a legalább 7 betűs szó! A szavakat `re.findall(r"\w+", ...)`-szal, a mondatokat a `.`, `!`, `?` jelek mentén bontsd (az üres darabokat hagyd ki).

```python starter
import re

def lix(szoveg):
    szavak = re.findall(r"\w+", szoveg)
    hosszu = [s for s in szavak if len(s) > 7]
    return round(len(szavak) + 100 * len(hosszu) / len(szavak), 1)
```

<details>
<summary>Megoldás</summary>

```python solution
import re

def lix(szoveg):
    szavak = re.findall(r"\w+", szoveg)
    mondatok = [m for m in re.split(r"[.!?]+", szoveg) if m.strip()]   # üres darabok nélkül
    hosszu = [s for s in szavak if len(s) >= 7]
    return round(len(szavak) / len(mondatok) + 100 * len(hosszu) / len(szavak), 1)
```

</details>

```python test
assert lix("Szombaton karbantartás lesz. Délben minden működik.") == 53.0
assert lix("Ez egy kis teszt. Itt van még egy.") == 4.0
assert lix("Rövid mondat!") == 2.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Jó tárgysor?** Írd meg a `jo_targysor(targy)` függvényt: akkor `True`, ha a tárgysor legalább 3 szóból áll, nincs benne felkiáltójel, és nem csupa nagybetűs!

```python starter
def jo_targysor(targy):
    return len(targy.split()) >= 3
```

<details>
<summary>Megoldás</summary>

```python solution
def jo_targysor(targy):
    eleg_hosszu = len(targy.split()) >= 3
    nem_kiabal = "!" not in targy and not targy.isupper()     # se felkiáltójel, se csupa nagybetű
    return eleg_hosszu and nem_kiabal
```

</details>

```python test
assert jo_targysor("Jóváhagyás kell: API-dokumentáció v2, csütörtökig") is True
assert jo_targysor("Kérdés") is False
assert jo_targysor("Fontos, nagyon sürgős kérés!!!") is False
assert jo_targysor("NAGYON FONTOS DOLOG MOST") is False
print("Minden ellenőrzés sikeres!")
```

**3.** **Commit-üzenet.** Írd meg a `conventional(uzenet)` függvényt, amely `True`-t ad, ha az üzenet `típus(hatókör): leírás` vagy `típus: leírás` formájú, ahol a típus `feat`, `fix`, `docs`, `refactor`, `test` vagy `chore`, a hatókör kisbetűkből, számokból és kötőjelből áll, a leírás pedig 3–72 karakter!

```python starter
def conventional(uzenet):
    return ":" in uzenet
```

<details>
<summary>Megoldás</summary>

```python solution
import re

MINTA = re.compile(r"^(feat|fix|docs|refactor|test|chore)(\([a-z0-9-]+\))?: .{3,72}$")

def conventional(uzenet):
    return bool(MINTA.match(uzenet))
```

</details>

```python test
assert conventional("fix(login): üres e-mail esetén ne legyen 500-as hiba") is True
assert conventional("docs: README frissítése") is True
assert conventional("Fix: valami") is False
assert conventional("javítások") is False
assert conventional("feat(Foglalas): új funkció") is False
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a piramis-elv lényege az üzleti írásban?
+ a lényeg (következtetés, kérés) elöl, utána az alátámasztás
- időrendben, a végén a következtetés
- minél hosszabb bevezetés
- a kérés a P.S.-ben
! A címzett az első mondatokból tudja, mit kell tennie.

? Egy szöveg 60 szóból és 5 mondatból áll, ebből 18 hosszú szó. Mennyi a LIX-értéke?
= 42
! $60/5 + 100 \cdot 18/60 = 12 + 30 = 42$.

? Mikor használj „Titkos másolatot” (Bcc)?
- ha a főnököd tudta nélkül akarsz valakit bevonni
+ ha sok, egymást nem ismerő címzettnek írsz, és védeni kell az e-mail címeiket
- minden levélnél
- soha
! Így a címzettek nem látják egymás címét.

? Mi tartozik egy jó hibajelentésbe?
- csak annyi, hogy „nem működik”
+ a lépések a hiba előidézéséhez, a várt és a tényleges viselkedés, a környezet
- a hibás kolléga neve
- a teljes forráskód
! Így a hiba reprodukálható és javítható.
```
