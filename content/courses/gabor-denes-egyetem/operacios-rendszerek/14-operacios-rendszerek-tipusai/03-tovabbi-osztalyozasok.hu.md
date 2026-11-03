---
title: További osztályozások
summary: Egy- és többfelhasználós, egy- és többfeladatos, kötegelt, interaktív, hálózati, elosztott és felhőalapú rendszerek, nyílt és zárt forráskód.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **szempontok** szerint osztályozhatók az operációs rendszerek,
- mi a **hálózati**, az **elosztott** és a **felhőalapú** rendszer,
- mi a különbség a **nyílt** és a **zárt** forráskód, valamint a „szabad szoftver” között.

## Osztályozási szempontok

| Szempont                 | Típusok                                                       | Példa                                  |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------- |
| felhasználók száma       | **egyfelhasználós** / **többfelhasználós**                    | MS-DOS / Linux, Windows                |
| egyszerre futó feladatok | **egyfeladatos** / **többfeladatos**                          | MS-DOS / minden mai OS                 |
| feldolgozás módja        | **kötegelt** / **interaktív (időosztásos)** / **valós idejű** | bérszámfejtés éjjel / asztal / légzsák |
| processzorok             | egyprocesszoros / **többprocesszoros** (SMP)                  | régi PC / mai többmagos gépek          |
| felhasználás helye       | asztali, szerver, mobil, beágyazott                           | lásd az előző leckéket                 |
| kernel felépítése        | monolitikus, mikrokernel, hibrid                              | Linux, QNX, Windows                    |
| forráskód                | **nyílt** / **zárt**                                          | Linux, FreeBSD / Windows, iOS          |

Figyelem: a „többfelhasználós” nem csak azt jelenti, hogy egyszerre többen ülnek a gépnél – azt is, hogy az OS **elkülöníti** a felhasználókat (saját fájlok, jogok, folyamatok). A Windows 11 és az Ubuntu laptopon is többfelhasználós rendszer.

## Hálózati, elosztott és felhőalapú rendszerek

- **Hálózati OS**: a gépek önálló OS-t futtatnak, de a hálózaton **megosztják** az erőforrásaikat (fájlmegosztás, nyomtató, központi felhasználókezelés). A felhasználó **tudja**, hogy melyik gépet éri el (pl. `\\fajlszerver\kozos`). Példa: Windows Server + Active Directory.
- **Elosztott OS / elosztott rendszer**: sok gép **egyetlen rendszernek látszik** a felhasználó számára – nem kell tudnia, hol fut a számítás vagy hol van az adat. Tiszta formában ritka (kutatási rendszerek), de az elv a gyakorlatban is él: **Kubernetes**-fürtök, elosztott fájlrendszerek (HDFS, Ceph), adatbázis-klaszterek.
- **Felhőalapú rendszerek**: az erőforrásokat (gépet, tárolót, szolgáltatást) egy szolgáltató adja **igény szerint**, interneten át. A virtualizációs témakörben részletesen lesz szó róla (IaaS, PaaS, SaaS).

## Nyílt és zárt forráskód

- **Zárt forráskódú** (_proprietary_): a forráskód a gyártó titka, a felhasználó licencet vásárol a **használatra** (Windows, macOS, iOS).
- **Nyílt forráskódú** (_open source_): a forráskód elérhető, tanulmányozható, módosítható, a licenc feltételei szerint terjeszthető (Linux, FreeBSD, Android alapja).
- **Szabad szoftver** (_free software_, Richard Stallman, GNU, 1983): a hangsúly a felhasználó **négy szabadságán** van – futtatás, tanulmányozás, módosítás, terjesztés. A „free” itt **szabadságot** jelent, nem ingyenességet.

Licencek példái:

| Licenc           | Típus                          | Lényeg                                                        | Példa                               |
| ---------------- | ------------------------------ | ------------------------------------------------------------- | ----------------------------------- |
| **GPL**          | „copyleft”                     | a módosított változatot is GPL alatt kell kiadni forráskóddal | Linux kernel                        |
| **BSD**, **MIT** | megengedő                      | szinte bármire felhasználható, zárt termékbe is               | FreeBSD (a macOS részben erre épül) |
| **Apache 2.0**   | megengedő + szabadalmi záradék |                                                               | Android nagy része                  |

## Összefoglalás

- Szempontok: felhasználók és feladatok száma, feldolgozás módja, processzorok, felhasználás helye, kernel felépítése, licenc.
- Hálózati OS: megosztott erőforrások, de tudod, melyik gép; elosztott: sok gép egy rendszerként látszik; felhő: igény szerinti erőforrás.
- Nyílt vs. zárt forráskód; GPL (copyleft) vs. BSD/MIT (megengedő).

## A lecke feladata

```quiz required
? Melyik volt egyfelhasználós, egyfeladatos rendszer?
+ MS-DOS
- Windows 11
- Ubuntu
- macOS
! Egyszerre egy program futott, felhasználók nélkül.

? Melyik rendszertípusnál látszik sok gép egyetlen rendszernek a felhasználó számára?
- hálózati OS
+ elosztott rendszer
- beágyazott rendszer
- kötegelt rendszer
! A felhasználónak nem kell tudnia, hol fut a számítás.

? Mit jelent a „copyleft” licenc (pl. GPL)?
- A program nem módosítható.
+ A módosított változatot is ugyanilyen licenccel, forráskóddal együtt kell kiadni.
- A programot csak oktatási célra szabad használni.
- A program zárt termékbe szabadon beépíthető, forráskód nélkül.
! A megengedő licencek (BSD, MIT) ezt nem kötik ki.

? Ki indította el a GNU projektet és a szabad szoftver mozgalmat?
= Richard Stallman
= Stallman
! 1983-ban.

? Melyik feldolgozási mód jellemző egy éjszakánként futó bérszámfejtésre?
+ kötegelt
- interaktív
- kemény valós idejű
- lágy valós idejű
! Nincs felhasználói beavatkozás, a feladatok sorban futnak.
```
