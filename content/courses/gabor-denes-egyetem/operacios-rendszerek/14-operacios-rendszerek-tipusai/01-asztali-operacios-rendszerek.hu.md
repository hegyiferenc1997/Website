---
title: Asztali operációs rendszerek
summary: A Windows, a Linux-disztribúciók és a macOS története, felépítése, licence és tipikus felhasználása.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- honnan jön és mit tud a **Windows**, a **Linux** és a **macOS**,
- mi a **Linux-disztribúció**, és melyek a legismertebbek,
- milyen **licenc** alatt érhetők el, és ki mire használja őket.

## Windows

- **Gyártó**: Microsoft. Az első Windows (1985) még az MS-DOS-ra épülő grafikus felület volt; a mai Windows a **Windows NT** (1993) vonalból származik, amelyet Dave Cutler csapata tervezett.
- **Kernel**: hibrid (`ntoskrnl.exe`), fájlrendszere **NTFS**.
- **Licenc**: zárt forráskódú, kereskedelmi (Home, Pro, Education, Enterprise kiadások).
- **Erősségei**: a legnagyobb asztali piaci részesedés, óriási program- és játékkínálat, irodai és vállalati környezet (Active Directory, Office).
- **Aktuális**: **Windows 11** (a Windows 10 ingyenes támogatása 2025 októberében véget ért).

## Linux

- **Születése**: 1991, **Linus Torvalds** finn egyetemista kezdte hobbiprojektként. Szigorúan véve a „Linux” csak a **kernel**; a teljes rendszer a **GNU** projekt eszközeivel (shell, C fordító, alapparancsok) együtt áll össze – ezért hívják néha GNU/Linuxnak.
- **Kernel**: monolitikus, modulokkal; fájlrendszere jellemzően **ext4**.
- **Licenc**: nyílt forráskódú, **GPLv2** – bárki ingyen használhatja, módosíthatja, terjesztheti.
- **Erősségei**: szerverek, felhő, szuperszámítógépek (a TOP500 lista mind az 500 gépén Linux fut), fejlesztés, beágyazott eszközök, Android.

### Disztribúciók

A **disztribúció** a kernel + alapprogramok + csomagkezelő + grafikus felület + beállítások összeválogatott csomagja.

| Család      | Disztribúciók                    | Csomagkezelő | Kinek ajánlott?                     |
| ----------- | -------------------------------- | ------------ | ----------------------------------- |
| Debian      | **Ubuntu**, Debian, Linux Mint   | `apt` (.deb) | kezdőknek, asztalra, szerverre      |
| Red Hat     | Fedora, RHEL, Rocky, AlmaLinux   | `dnf` (.rpm) | vállalati szerverek, fejlesztők     |
| Arch        | Arch Linux, Manjaro              | `pacman`     | haladóknak, akik mindent maguk állítanak |
| SUSE        | openSUSE, SLES                   | `zypper`     | vállalati környezet                 |

## macOS

- **Gyártó**: Apple. A **NeXTSTEP**-ből (Steve Jobs NeXT cége) fejlődött ki, 2001-ben jelent meg Mac OS X néven.
- **Kernel**: **XNU** (hibrid: Mach + BSD), a **Darwin** nyílt forráskódú alaprendszer része; fájlrendszere **APFS**.
- **UNIX**: hivatalosan **UNIX 03** minősítésű rendszer – ezért olyan otthonos benne a terminál (`zsh`, `ls`, `ssh`).
- **Licenc**: zárt (a Darwin alap nyílt), és csak **Apple hardveren** futtatható legálisan.
- **Erősségei**: szoros hardver–szoftver integráció, grafika, videó, zene, iOS-fejlesztés (Xcode csak macOS-en fut).

## Összefoglalás

- Windows: Microsoft, NT-vonal, hibrid kernel, NTFS, zárt; az asztalon a legelterjedtebb.
- Linux: Torvalds 1991, monolitikus kernel, GPLv2; disztribúciók (Ubuntu, Fedora, Arch); szerverek és felhő ura.
- macOS: Apple, NeXTSTEP-ből, XNU kernel, APFS, UNIX-minősítésű, csak Apple hardveren.

## A lecke feladata

```quiz required
? Melyik licenc alatt érhető el a Linux kernel?
- MIT
+ GPLv2
- zárt, kereskedelmi
- Apache 2.0
! GNU General Public License, 2. verzió.

? Melyik csomagkezelőt használja az Ubuntu?
= apt
! Debian családba tartozik (.deb csomagok).

? Melyik rendszerből fejlődött ki a macOS?
+ NeXTSTEP
- MS-DOS
- MINIX
- Windows NT
! Steve Jobs NeXT cégének rendszere.

? Mi a macOS fájlrendszerének neve?
= APFS
! Apple File System.

? Melyik rendszerre épül a mai Windows (10/11)?
- MS-DOS
+ Windows NT
- UNIX
- OS/2
! Az NT vonal 1993-ban indult.
```
