---
title: Gyakorlás – alkalmazások és rendszerszoftverek
summary: Ellenőrző kérdések és összefoglaló feladatlap a szoftverekről, licencekről és a telepítésről.
minutes: 43
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Sorold be a következőket: Android, nyomtató-illesztőprogram, Spotify, víruskereső, UEFI!</summary>

Rendszerszoftver: Android (OS), nyomtató-illesztőprogram, UEFI (firmware). Segédprogram: víruskereső. Alkalmazás: Spotify.

</details>

<details>
<summary>2. Egy cég zárt forráskódú termékébe szeretnél egy nyílt forráskódú könyvtárat beépíteni. Mit nézel meg először?</summary>

A licencét. MIT vagy Apache 2.0 esetén elég a szerzői megjegyzést megtartani; GPL esetén a terjesztett terméket is GPL alatt, forráskóddal kellene kiadni.

</details>

<details>
<summary>3. Miért jobb csomagkezelővel telepíteni, mint egy letöltött telepítővel?</summary>

Megbízható tárolóból jön, a függőségeket is kezeli, és egy paranccsal minden program frissíthető (`winget upgrade --all`, `sudo apt upgrade`).

</details>

Próbáld ki (Windows PowerShellben):

```powershell
winget list            # a telepített programok
winget upgrade         # mi frissíthető?
```

## Összefoglaló feladatlap

```quiz required
? Melyik a felsoroltak közül **firmware**?
- Windows 11
+ az alaplap UEFI-je
- Excel
- Chrome
! A firmware az eszközbe épített alacsony szintű program.

? Mi a Windows saját csomagkezelőjének parancsa?
= winget
! Windows Package Manager.

? Melyik verzióváltás jelent **csak hibajavítást**?
+ 2.4.1 → 2.4.2
- 2.4.2 → 2.5.0
- 2.5.0 → 3.0.0
- 1.9.9 → 2.0.0
! A harmadik szám a javítási szám.

? Melyik **megengedő** nyílt licenc?
+ MIT
- GPL
- EULA
- shareware
! Az MIT szinte bármit megenged, csak a szerzői megjegyzést kell megtartani.

? Melyik szoftver nyílt forráskódú?
- Photoshop
- Windows
+ Firefox
- Adobe Reader
! A Firefox kódja nyilvános (Mozilla Public License).

? Mi a Python csomagkezelőjének neve?
= pip
! pip install requests
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Verziók összehasonlítása.** Írd meg a `ujabb(a, b)` függvényt, amely `True`-t ad, ha az `a` verziószám (pl. `"1.10.0"`) újabb, mint `b`! A verziókat számként, tagonként hasonlítsd össze.

```python starter
def ujabb(a, b):
    return a > b
```

<details>
<summary>Megoldás</summary>

```python solution
def ujabb(a, b):
    def szamok(v):
        return tuple(int(x) for x in v.split("."))   # "1.10.0" → (1, 10, 0)
    return szamok(a) > szamok(b)
```

</details>

```python test
assert ujabb("1.10.0", "1.9.3") is True
assert ujabb("2.0.0", "10.0.0") is False
assert ujabb("3.14.1", "3.14.0") is True
assert ujabb("1.0.0", "1.0.0") is False
print("Minden ellenőrzés sikeres!")
```

**2.** **Frissítés típusa.** Írd meg a `frissites(regi, uj)` függvényt, amely `"fő"`, `"al"` vagy `"javítás"` szöveget ad vissza aszerint, hogy a szemantikus verzió melyik tagja nőtt (balról az első eltérő tag dönt)! Ha a két verzió egyezik, adjon `"nincs"`-et.

```python starter
def frissites(regi, uj):
    return "javítás"
```

<details>
<summary>Megoldás</summary>

```python solution
def frissites(regi, uj):
    r = [int(x) for x in regi.split(".")]
    u = [int(x) for x in uj.split(".")]
    for nev, a, b in zip(["fő", "al", "javítás"], r, u):
        if b != a:                       # az első eltérő tag dönt
            return nev
    return "nincs"
```

</details>

```python test
assert frissites("2.4.1", "2.4.2") == "javítás"
assert frissites("2.4.2", "2.5.0") == "al"
assert frissites("2.5.0", "3.0.0") == "fő"
assert frissites("1.0.0", "1.0.0") == "nincs"
print("Minden ellenőrzés sikeres!")
```

**3.** **Függőségi kockázat.** Írd meg a `kockazat(csomagok, p)` függvényt, amely megadja, mekkora eséllyel találnak legalább egy csomagban hibát, ha mindegyikben egymástól függetlenül `p` eséllyel (3 tizedesre)!

```python starter
def kockazat(csomagok, p):
    return round(csomagok * p, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def kockazat(csomagok, p):
    return round(1 - (1 - p) ** csomagok, 3)   # 1 − annak esélye, hogy egyikben sincs
```

</details>

```python test
assert kockazat(1, 0.01) == 0.01
assert kockazat(100, 0.01) == 0.634
assert kockazat(200, 0.01) == 0.866
assert kockazat(10, 0) == 0.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik licenc copyleft?
- MIT
- BSD
- Apache-2.0
+ GPL
! A GPL-es kód módosításait ugyanazon licenc alatt kell továbbadni.

? Hány év alatt hozza be egy 1 500 000 Ft-os egyszeri licenc a havi 25 000 Ft-os előfizetést (évek, egészre)?
= 5
! $1\,500\,000 / (25\,000 \cdot 12) = 5$ év.

? Mire való a `winget` vagy az `apt`?
- víruskeresésre
+ programok telepítésére, frissítésére és eltávolítására csomagkezelőként
- fájlok tömörítésére
- a hálózat beállítására
! A csomagkezelő hivatalos forrásból telepít, és egy paranccsal frissít mindent.

? Mi a firmware?
+ egy eszköz hardverébe ágyazott, alacsony szintű szoftver
- egy irodai alkalmazás
- egy víruskereső
- egy webböngésző
! Pl. a BIOS/UEFI vagy egy router szoftvere.
```
