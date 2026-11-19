---
title: Gyakorlás – hatékony kommunikáció technikák
summary: Ellenőrző kérdések és összefoglaló feladatlap az aktív hallgatásról, a kérdezéstechnikáról és az asszertív kommunikációról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért hasznos a parafrázis, ha egyszer a másik már elmondta a dolgot?</summary>

Mert ellenőrzi a megértést: ha rosszul értetted, a másik azonnal kijavít. Emellett jelzi, hogy figyeltél, és a másik megértve érzi magát.

</details>

<details>
<summary>2. Fogalmazd át a „Miért nem írtál tesztet?” kérdést úgy, hogy ne váltson ki védekezést!</summary>

Például: „Mi akadályozott abban, hogy tesztet írj ehhez a részhez?” vagy „Mit gondolsz, hogyan tudnánk ezt a részt tesztekkel lefedni?” A hangsúly a helyzeten és a megoldáson van, nem a hibáztatáson.

</details>

<details>
<summary>3. Mi a különbség a passzív és a passzív-agresszív viselkedés között?</summary>

A passzív ember feladja a saját igényét, és nem jelzi az elégedetlenségét. A passzív-agresszív is nyíltan igent mond, de burkoltan (gúnnyal, „elfelejtéssel”, késéssel) mégis kifejezi a haragját.

</details>

<details>
<summary>4. Írj egy én-üzenetet: egy csapattárs rendszeresen nem frissíti a ticketjeit!</summary>

„Amikor a ticketek állapota napokig nem frissül, nehezen látom, hol tartunk, és a heti beszámolóm pontatlan lesz. Megkérhetlek, hogy a nap végén frissítsd őket?”

</details>

## Összefoglaló feladatlap

> Egy felhasználó azt írja: „Az alkalmazásotok használhatatlan!” Te a támogatási csapatban dolgozol.

```quiz required
? Melyik a legjobb első reakció az aktív hallgatás szerint?
- „Nálam működik.”
+ „Sajnálom, hogy ez bosszantó volt. Elmesélnéd, mi történt pontosan?”
- „Olvassa el a dokumentációt.”
- „Miért nem frissített?”
! Érzelem tükrözése + nyitott kérdés.

? Ezután a „Melyik böngészőt használtad?” kérdést teszed fel. Milyen kérdés ez?
- nyitott
+ zárt
- rávezető
- többszörös
! Egy konkrét adatra kérdez.

? A tölcsértechnika szerint melyik kérdés jön a **legvégén**?
- „Mesélj, mit szeretnél elérni az alkalmazással?”
- „Milyen lépéseket tettél előtte?”
+ „Tehát az exportálás gomb után jön a hibaüzenet?”
- „Mi a véleményed az alkalmazásról?”
! Szűk, megerősítő zárt kérdés.

? A felhasználó azt kéri, hogy azonnal hívd fel éjjel 11-kor. Melyik az asszertív válasz?
- „Persze, felhívom.” (pedig nincs ügyeleted)
- „Ez nevetséges kérés.”
+ „Ma este már nem tudom felhívni, de holnap 9-kor elsőként keresem.”
- nem válaszolsz
! Nem + alternatíva.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Beszédarány.** Egy leirat `(beszélő, mondat)` párok listája. Írd meg a `beszedarany(leirat, ki)` függvényt, amely megadja, a szavak hányad részét mondta `ki` (2 tizedesre)! A szavakat szóközök mentén számold.

```python starter
def beszedarany(leirat, ki):
    return round(sum(1 for b, _ in leirat if b == ki) / len(leirat), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def beszedarany(leirat, ki):
    osszes = sum(len(m.split()) for _, m in leirat)          # minden szó
    sajat = sum(len(m.split()) for b, m in leirat if b == ki)  # csak az övéi
    return round(sajat / osszes, 2)
```

</details>

```python test
l = [("F", "Mi a gond?"), ("M", "Kétszer adunk ki egy időpontot minden héten."), ("F", "Mesélj!"), ("M", "Papíron vezetjük a változásokat este.")]
assert beszedarany(l, "F") == 0.25
assert beszedarany(l, "M") == 0.75
assert beszedarany([("A", "egy két három")], "A") == 1.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Nyitott vagy zárt?** Írd meg a `kerdes_tipus(kerdes)` függvényt: ha a kérdés első szava (kisbetűsítve, írásjelek nélkül) a „mi, milyen, hogyan, miért, mit, mikor, mesélj, mennyi” egyike, adjon `"nyitott"`-at, egyébként `"zárt"`-at!

```python starter
def kerdes_tipus(kerdes):
    return "nyitott"
```

<details>
<summary>Megoldás</summary>

```python solution
NYITOTT = {"mi", "milyen", "hogyan", "miért", "mit", "mikor", "mesélj", "mennyi"}

def kerdes_tipus(kerdes):
    elso = kerdes.split()[0].strip(".,!?").lower()      # az első szó dönt
    return "nyitott" if elso in NYITOTT else "zárt"
```

</details>

```python test
assert kerdes_tipus("Milyen gondjaitok vannak?") == "nyitott"
assert kerdes_tipus("Kell-e mobilalkalmazás?") == "zárt"
assert kerdes_tipus("Mesélj, hogyan telik egy nap!") == "nyitott"
assert kerdes_tipus("Tetszik az ötlet?") == "zárt"
print("Minden ellenőrzés sikeres!")
```

**3.** **Te-üzenet-figyelő.** Írd meg a `te_uzenet(mondat)` függvényt, amely `True`-t ad, ha a mondatban (kisbetűsítve, írásjelek nélkül) szerepel a „mindig, soha, megint, hanyag, lusta” szavak bármelyike, egyébként `False`-t!

```python starter
def te_uzenet(mondat):
    return "mindig" in mondat
```

<details>
<summary>Megoldás</summary>

```python solution
JELEK = {"mindig", "soha", "megint", "hanyag", "lusta"}

def te_uzenet(mondat):
    szavak = {s.strip(".,!?").lower() for s in mondat.split()}   # egész szavak
    return bool(szavak & JELEK)
```

</details>

```python test
assert te_uzenet("Mindig te rontod el a buildet.") is True
assert te_uzenet("Megint késtél.") is True
assert te_uzenet("Tegnap két teszt elbukott; megkérnélek, hogy futtasd le őket.") is False
assert te_uzenet("Ez elég hanyag munka.") is True
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az aktív hallgatás egyik technikája?
+ a hallottak saját szavakkal való összefoglalása (parafrázis)
- a másik mondatának befejezése
- azonnali tanácsadás
- a telefon nézegetése
! A parafrázis megmutatja, hogy értetted, és lehetőséget ad a javításra.

? Egy 900 szavas interjúban a kérdező 180 szót mondott. Hány százalékát beszélte ki? (csak a számot írd)
= 20
! $180 / 900 = 20\%$.

? Mi a tölcsértechnika lényege?
- csak zárt kérdések
+ tág, nyitott kérdésekkel kezdeni, és fokozatosan szűkíteni a konkrétumok felé
- a legnehezebb kérdéssel kezdeni
- egyszerre több kérdést feltenni
! Előbb a teljes kép, utána a részletek.

? Melyik asszertív nemet mondás?
- „Jó, megcsinálom...” (közben dühös)
- „Ez a te bajod.”
+ „Ezen a héten nem fér bele, mert a demóra készülök; jövő kedden tudok segíteni.”
- nem válaszolni
! Világos, indokolt, és alternatívát ad.
```
