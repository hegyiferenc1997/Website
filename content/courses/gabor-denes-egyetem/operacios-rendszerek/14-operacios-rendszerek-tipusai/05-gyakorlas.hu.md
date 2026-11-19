---
title: Gyakorlás – operációsrendszer-típusok
summary: Ellenőrző kérdések, egy besorolós feladat és összefoglaló feladatlap.
minutes: 20
kind: practice
---

## Besorolós feladat

Sorold be az alábbi rendszereket (asztali / szerver / mobil / beágyazott / valós idejű; nyílt / zárt):

1. a telefonod OS-e,
2. az egyetemi Neptun szerverei,
3. az otthoni Wi-Fi router,
4. egy autó blokkolásgátlója (ABS),
5. a laborgéped Ubuntu-ja,
6. egy okosóra.

<details>
<summary>Megoldási javaslat</summary>

1. mobil – Android (nyílt alap, Linux kernel) vagy iOS (zárt);
2. szerver – jellemzően Linux vagy Windows Server;
3. beágyazott – gyakran beágyazott Linux (pl. OpenWrt alapú);
4. beágyazott, kemény valós idejű RTOS;
5. asztali, nyílt forráskódú, többfelhasználós;
6. beágyazott/mobil – Wear OS (Linux alapú) vagy watchOS (XNU), az egyszerűbbek RTOS-t futtatnak.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért fut a felhő és a szuperszámítógépek túlnyomó többsége Linuxon?</summary>

Mert ingyenes (nincs gépenkénti licencdíj több ezer gépen), nyílt forráskódú (a hardverhez és a feladathoz igazítható), stabil, jól automatizálható, és nagyon sok architektúrán fut.

</details>

<details>
<summary>2. Miért nem elég egy gyors, de kiszámíthatatlan OS egy légzsákhoz?</summary>

Mert kemény valós idejű feladatnál nem az átlagos, hanem a legrosszabb esetbeli válaszidő számít. Ha egyszer is késik a jel (pl. egy háttérfeladat miatt), az katasztrófához vezet.

</details>

<details>
<summary>3. Mi a különbség a hálózati és az elosztott rendszer között a felhasználó szemszögéből?</summary>

Hálózati rendszernél a felhasználó tudja és megadja, melyik gép erőforrását használja (pl. egy megosztott mappa címét). Elosztottnál a rendszer elrejti a gépek határait, egyetlen egységként látszik.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik Linux-disztribúció tartozik a Red Hat családba?
- Ubuntu
- Linux Mint
+ Fedora
- Manjaro
! Csomagkezelője: dnf (.rpm).

? Melyik kernelt használja az iOS?
= XNU
! Ugyanaz, mint a macOS-é.

? Melyik évben jelent meg a Windows NT első változata?
= 1993
! Windows NT 3.1.

? Melyik licenc engedi meg, hogy a kódot zárt termékbe építsd, forráskód kiadása nélkül?
- GPL
+ MIT
- egyik sem
- AGPL
! Az MIT és a BSD megengedő licenc.

? Mit jelent a „free” a „free software” kifejezésben?
+ szabadságot (futtatás, tanulmányozás, módosítás, terjesztés)
- kötelezően ingyenességet
- hirdetésekkel támogatott terjesztést
- korlátozott próbaverziót
! „Free as in freedom, not as in free beer.”

? Melyik operációs rendszer fut a TOP500 szuperszámítógép-lista összes gépén?
= Linux
! 2017 óta mind az 500 gépen.
```
