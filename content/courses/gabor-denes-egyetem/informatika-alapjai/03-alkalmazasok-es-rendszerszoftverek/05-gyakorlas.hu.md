---
title: Gyakorlás – alkalmazások és rendszerszoftverek
summary: Ellenőrző kérdések és összefoglaló feladatlap a szoftverekről, licencekről és a telepítésről.
minutes: 18
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
