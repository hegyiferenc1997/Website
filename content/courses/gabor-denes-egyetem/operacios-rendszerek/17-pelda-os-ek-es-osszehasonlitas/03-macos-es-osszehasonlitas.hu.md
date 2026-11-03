---
title: A macOS és a három rendszer összehasonlítása
summary: A macOS belülről (XNU, launchd, QoS-osztályok, memóriatömörítés, APFS, SIP, Gatekeeper, Rosetta 2), majd egy nagy táblázat a Linux, a Windows és a macOS összehasonlításáról.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan valósítja meg a **macOS** a tárgy fő fogalmait,
- egy **összehasonlító táblázatban** a Linux, a Windows és a macOS legfontosabb különbségeit,
- melyik rendszer mire a legjobb választás.

## A macOS belülről

A macOS-t nem telepítjük VirtualBoxba: a licence csak Apple hardveren engedi futtatni. A fogalmak viszont ugyanazok.

- **Kernel**: **XNU** – a **Mach** mikrokernel (szálak, ütemezés, virtuális memória, üzenetküldés) és a **BSD** réteg (folyamatok, POSIX-rendszerhívások, fájlrendszerek, hálózat) egy címtérben, hibrid kernelként; az illesztőprogramok C++-os keretrendszere az **IOKit**.
- **Indítás**: Apple Silicon gépen a **iBoot** rendszerbetöltő ellenőrzi és betölti a kernelt, amely elindítja az **1-es PID-ű launchd**-t – ez a systemd megfelelője: elindítja és felügyeli a szolgáltatásokat.
- **Ütemezés**: prioritásos, preemptív; a programok **QoS-osztályokkal** jelzik, mennyire sürgős a munkájuk (_user-interactive_, _user-initiated_, _utility_, _background_). Apple Silicon processzoron ez alapján dönt a rendszer, hogy a szál a gyors **teljesítménymagokra** (P) vagy a takarékos **hatékonysági magokra** (E) kerüljön (10. témakör: heterogén többprocesszoros ütemezés).
- **Memória**: igény szerinti lapozás (Apple Siliconon 16 KiB-os lapokkal), **memóriatömörítés** (2013 óta), és szükség szerint létrehozott swapfájlok.
- **Fájlrendszer**: **APFS** (2017 óta): írásnál másoló (_copy-on-write_), beépített **pillanatképekkel** (ezekre épít a Time Machine mentés) és titkosítással; alapból nem különbözteti meg a kis- és nagybetűt.
- **Biztonság**: Unix-jogosultságok és ACL-ek, `sudo`; a **SIP** (_System Integrity Protection_) még a root elől is védi a rendszerfájlokat, a rendszerkötet **lezárt és aláírt**; a **Gatekeeper** csak aláírt, az Apple által ellenőrzött (_notarized_) programot enged futni; az App Store-os programok **homokozóban** (_sandbox_) futnak.
- **Szoftver**: App Store, `.dmg` lemezkép, parancssorból a közösségi **Homebrew** csomagkezelő (`brew install git`).
- **Rosetta 2**: az Intel (x86-64) programokat futás előtt ARM utasításokra **fordítja** – a 16. témakör bináris fordításának rokona.

## A nagy összehasonlítás

|                      | **Linux (Ubuntu)**                     | **Windows 11**                          | **macOS**                            |
| -------------------- | -------------------------------------- | --------------------------------------- | ------------------------------------ |
| kernel               | monolitikus, modulokkal                | hibrid (NT)                             | hibrid (XNU: Mach + BSD)             |
| licenc               | nyílt (GPLv2)                          | zárt                                    | zárt (a Darwin alap nyílt)           |
| 1. folyamat          | `systemd` (PID 1)                      | System (PID 4), `smss.exe`              | `launchd` (PID 1)                    |
| folyamat létrehozása | `fork()` + `exec()`                    | `CreateProcess`                         | `fork()` + `exec()`, `posix_spawn`   |
| ütemező              | EEVDF, nice −20…19                     | 32 prioritási szint, boost              | prioritás + QoS-osztályok, P/E magok |
| memória              | túlfoglalás + OOM killer, swap         | commit limit, `pagefile.sys`, tömörítés | tömörítés, dinamikus swap            |
| fájlrendszer         | ext4 (Btrfs)                           | NTFS                                    | APFS                                 |
| útvonal              | `/home/anna/doc.txt`                   | `C:\Users\Anna\doc.txt`                 | `/Users/anna/doc.txt`                |
| kis- és nagybetű     | megkülönbözteti                        | nem                                     | alapból nem                          |
| jogosultságok        | `rwx` + AppArmor/SELinux               | ACL + UAC                               | `rwx` + ACL + SIP, sandbox           |
| beállítások          | szöveges fájlok (`/etc`)               | beállításjegyzék (registry)             | `.plist` fájlok                      |
| csomagkezelő         | `apt`, Snap, Flatpak                   | `winget`, Microsoft Store               | App Store, Homebrew                  |
| tipikus terep        | szerver, felhő, fejlesztés, beágyazott | irodai és otthoni asztal, játék         | kreatív munka, Apple-fejlesztés      |

## Melyiket mikor?

- **Linux**: szerverek, felhő, konténerek, programozás, régi gépek felélesztése – és ingyenes. Mérnökinformatikusként biztosan dolgozni fogsz vele.
- **Windows**: a legtöbb asztali program és játék, vállalati környezet (Active Directory, Office), egyes mérnöki szoftverek csak Windowsra.
- **macOS**: iOS/macOS-fejlesztés (Xcode), videó- és zenei munka, Unix-alapú terminál kész hardveren.

A jó hír: a tárgyban tanult fogalmak (folyamat, szál, ütemezés, lapozás, fájlrendszer, jogosultság) **mindhárom rendszerben ugyanazok** – csak a nevek és a parancsok mások. Ha egyet érted, a többit gyorsan megtanulod.

## Összefoglalás

- macOS: XNU (Mach + BSD, IOKit), launchd, QoS-osztályok és P/E magok, memóriatömörítés, APFS, SIP, Gatekeeper, Homebrew, Rosetta 2.
- A három rendszer ugyanazokat a feladatokat oldja meg más eszközökkel; a táblázat a vizsgára is jó összefoglaló.

## A lecke feladata

```quiz required
? Melyik folyamat felügyeli a szolgáltatásokat és kapja az 1-es PID-et macOS-en?
= launchd
! A Linux systemd-jének megfelelője.

? Melyik rendszer NEM foglal túl memóriát, hanem véglegesítési korlátot használ?
- Linux
+ Windows
- macOS
- mindhárom túlfoglal
! Windowson commit limit = RAM + lapozófájl.

? Mire szolgál macOS-en a Rosetta 2?
+ az Intel (x86-64) programokat ARM utasításokra fordítja
- vírusokat keres
- a lemezt titkosítja
- a Windows-programokat futtatja
! Apple Silicon processzorokon kell.

? Melyik rendszer különbözteti meg alapból a kis- és nagybetűt a fájlnevekben?
+ Linux
- Windows
- macOS
- egyik sem
! Linuxon a Doc.txt és a doc.txt két külön fájl.
```
