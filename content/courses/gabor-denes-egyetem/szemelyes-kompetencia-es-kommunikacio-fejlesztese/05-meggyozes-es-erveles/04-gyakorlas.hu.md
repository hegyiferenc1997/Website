---
title: Gyakorlás – meggyőzés és érvelés
summary: Ellenőrző kérdések és összefoglaló feladatlap az érv felépítéséről, a meggyőzés eszközeiről és az érvelési hibákról.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Építs fel egy Toulmin-érvet amellett, hogy a csapat vezessen be kódátnézést!</summary>

- **Állítás**: vezessünk be kötelező kódátnézést.
- **Adat**: az elmúlt hónapban 6 éles hibából 4-et egy második szem kiszúrt volna.
- **Indoklás**: a másik fejlesztő más szemszögből nézi a kódot, ezért észreveszi a szerző vakfoltjait.
- **Alátámasztás**: iparági tapasztalatok szerint a kódátnézés a hibák jelentős részét az élesítés előtt kiszűri.
- **Minősítő**: valószínűleg jelentősen csökkenti a hibák számát.
- **Kivétel**: a sürgős, egysoros javításoknál utólagos átnézés is elég lehet.

</details>

<details>
<summary>2. Miért nem elég egy mérnöki közönségnél a pathos?</summary>

Mert a mérnöki döntéseket adatok és logikai összefüggések alapján hozzák meg; érzelmi érvek mögött bizonyíték nélkül manipulációt sejtenek. A pathos felkeltheti a figyelmet, de a döntést a logos és a beszélő hitelessége (ethos) viszi.

</details>

<details>
<summary>3. Mi a sötét minta (dark pattern)? Mondj két példát!</summary>

A felhasználói felület olyan kialakítása, amely a felhasználó érdeke ellenére befolyásolja a döntését. Példák: nehezen megtalálható lemondás gomb, előre bejelölt hírlevél-feliratkozás, hamis „már csak 2 darab” felirat, bűntudatkeltő elutasító gomb („Nem, nem akarok spórolni”).

</details>

<details>
<summary>4. Hogyan döntheted el, hogy egy új funkció tényleg növelte-e a regisztrációt?</summary>

Kontrollált kísérlettel (A/B teszt): a felhasználók véletlenszerűen kapnak régi vagy új változatot, és a két csoport eredményét hasonlítod össze. Így kiszűrheted a szezonalitást és más közös okokat.

</details>

## Összefoglaló feladatlap

> Egy csapatmegbeszélésen arról vitatkoztok, áttérjetek-e egy új keretrendszerre.

```quiz required
? Gábor: „Mindenki erre tér át, a Google is ezt használja.” Melyik hiba (vagy hibák) jellemzik?
- szalmabáb
+ többségre és tekintélyre hivatkozás
- körkörös érvelés
- csúszós lejtő
! A népszerűség és egy nagy cég még nem bizonyítja, hogy nektek jó.

? Dóra: „Ha most nem térünk át, két év múlva senki nem akar majd nálunk dolgozni, és bezárhatunk.” Melyik hiba?
- post hoc
- személyeskedés
+ csúszós lejtő
- vörös hering
! Egy lépésből katasztrófát jósol.

? Ádám: „A próbaprojektünkben a lapbetöltés 1,2 mp-ről 0,7 mp-re csökkent.” Melyik meggyőzési mód?
- ethos
- pathos
+ logos
- szűkösség
! Mérési adat.

? Hány százalékkal csökkent a betöltési idő Ádám adatai szerint (egészre kerekítve)?
= 42
! (1,2 − 0,7) / 1,2 ≈ 0,4167 → 42%.

? Eszter: „Szerinted tehát dobjuk ki az egész régi kódot?” – pedig Ádám csak egy modul átírását javasolta. Melyik hiba?
+ szalmabáb
- hamis dilemma
- tekintélyre hivatkozás
- elhamarkodott általánosítás
! Eltorzítja a másik álláspontját.
```
