---
title: Szerver-, mobil-, beágyazott és valós idejű rendszerek
summary: Windows Server és Linux a szervereken, Android és iOS felépítése, beágyazott rendszerek és RTOS, kemény és lágy valós idő.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi jellemző a **szerver** operációs rendszerekre,
- hogyan épül fel az **Android** és az **iOS**,
- mi a **beágyazott** és a **valós idejű** OS (RTOS), és mi a különbség a **kemény** és a **lágy** valós idő között.

## Szerver operációs rendszerek

Egy szerver hónapokig, évekig fut leállás nélkül, sok felhasználót szolgál ki egyszerre, és jellemzően **nincs** rajta grafikus felület – távolról, SSH-n vagy webes felületen kezelik.

| Rendszer                                | Hol erős?                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| **Linux** (Ubuntu Server, RHEL, Debian) | webszerverek, felhő, konténerek – a felhőben futó gépek döntő többsége            |
| **Windows Server**                      | vállalati hálózatok: Active Directory, fájlmegosztás, Exchange, .NET-alkalmazások |
| **FreeBSD**                             | hálózati eszközök, tűzfalak, streaming (pl. a Netflix tartalomszerverei)          |

Szerverekre jellemző: **hosszú támogatás** (LTS), stabilitás a legújabb funkciók helyett, távoli felügyelet, automatizálás (szkriptek, Ansible).

## Mobil operációs rendszerek

- **Android** (Google): **Linux kernelre** épül, fölötte a hardverabsztrakciós réteg (HAL), a natív könyvtárak, az **ART** futtatókörnyezet (az alkalmazások Kotlin/Java kódjához) és az alkalmazás-keretrendszer. Minden alkalmazás **külön Linux-felhasználóként**, saját homokozóban fut. Nyílt forráskódú alap (AOSP), a világ legelterjedtebb OS-e.
- **iOS / iPadOS** (Apple): ugyanarra az **XNU** kernelre és Darwin alapra épül, mint a macOS. Zárt, az alkalmazások csak az App Store-ból (az EU-ban alternatív áruházakból is) telepíthetők, szigorú homokozóval.

Mobil sajátosságok: **energiatakarékosság** (a háttérfolyamatokat az OS agresszívan felfüggeszti), érintőképernyő, szenzorok, engedélyrendszer (kamera, hely, névjegyek), kevés RAM-hoz igazított memóriakezelés (a háttérben lévő alkalmazást az OS leállíthatja).

## Beágyazott rendszerek

**Beágyazott** (_embedded_) rendszer egy nagyobb eszköz része, és **egy feladatot** lát el: mosógép, router, okosóra, autó motorvezérlője, okos termosztát. Jellemzők: kevés memória és teljesítmény, alacsony fogyasztás, sokszor évekig fut újraindítás nélkül.

- nagyobb eszközökön **beágyazott Linux** (routerek: OpenWrt; okostévék; Raspberry Pi),
- mikrovezérlőkön kis **RTOS**: **FreeRTOS**, **Zephyr**, vagy egyáltalán nincs OS („bare metal”, egy végtelen ciklus).

## Valós idejű rendszerek

A **valós idejű** OS-nél (RTOS) nem az átlagos sebesség a lényeg, hanem a **kiszámíthatóság**: egy feladatnak **határidőre** le kell futnia.

| Fajta                | Ha lekési a határidőt…                                  | Példa                                                |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| **kemény** valós idő | **katasztrófa** – az eredmény értéktelen vagy veszélyes | légzsák, ABS, szívritmus-szabályozó, repülésvezérlés |
| **lágy** valós idő   | romlik a minőség, de nem végzetes                       | videólejátszás, online játék, VoIP                   |

Eszközeik: **prioritásos, preemptív** ütemezés, garantált legrosszabb válaszidő, **prioritásöröklés** (hogy egy alacsony prioritású, zárat tartó feladat ne tartsa fel a magasat – a Mars Pathfinder 1997-es hibája pont ez volt). Az általános célú Linux a **PREEMPT_RT** kiegészítéssel (2024 óta a fő kernel része) lágy, sőt sok esetben kemény valós idejű feladatokra is alkalmas.

## Összefoglalás

- Szerver: stabil, hosszan támogatott, grafikus felület nélküli; Linux uralja, vállalatoknál Windows Server is.
- Android: Linux kernel + ART + alkalmazásonkénti homokozó; iOS: XNU kernel, zárt rendszer.
- Beágyazott: egy feladat, kevés erőforrás (beágyazott Linux, FreeRTOS, Zephyr).
- Valós idő: határidők; kemény (katasztrófa) és lágy (minőségromlás).

## A lecke feladata

```quiz required
? Melyik kernelre épül az Android?
+ Linux
- XNU
- Windows NT
- MINIX
! Fölötte az ART futtatókörnyezet és az alkalmazás-keretrendszer.

? Melyik valós idejű fajtába tartozik egy autó légzsákjának vezérlése?
+ kemény valós idő
- lágy valós idő
- kötegelt
- interaktív
! A határidő lekésése katasztrófa.

? Melyik valós idejű fajtába tartozik a videólejátszás?
- kemény valós idő
+ lágy valós idő
- egyik sem, ez kötegelt feldolgozás
- elosztott
! Egy elkésett képkocka csak a minőséget rontja.

? Nevezz meg egy elterjedt, nyílt forráskódú RTOS-t mikrovezérlőkre!
= FreeRTOS
= Zephyr
! Pl. FreeRTOS vagy Zephyr.

? Mi volt a Mars Pathfinder 1997-es szoftverhibájának oka?
- elfogyott a memória
+ prioritásinverzió (egy alacsony prioritású feladat tartotta a zárat)
- vírus
- túl kicsi lemez
! A megoldás a prioritásöröklés bekapcsolása volt.
```
