---
title: Az operációs rendszer feladatai
summary: Mit csinál az OS, és miben különbözik a Windows, a macOS, a Linux, az Android és az iOS?
minutes: 14
---

## Amit ebben a leckében megtanulsz

- mi az **operációs rendszer**, és melyek a fő **feladatai**,
- mi a **kernel** és a **felhasználói felület**,
- melyek a ma elterjedt operációs rendszerek, és miben különböznek.

## Mi az operációs rendszer?

Az **operációs rendszer (OS)** a hardver és az alkalmazások között álló alapszoftver. Nélküle minden programnak magának kellene a lemezt, a billentyűzetet és a hálózatot kezelnie. Legfontosabb, mindig futó része a **kernel** (mag).

## Fő feladatai

| Feladat                  | Mit jelent a gyakorlatban?                                             |
| ------------------------ | ---------------------------------------------------------------------- |
| **folyamatkezelés**      | több program fut „egyszerre”, a processzort felváltva kapják           |
| **memóriakezelés**       | minden program saját memóriaterületet kap, nem írhat a másikéba        |
| **fájlkezelés**          | a lemezen fájlokat és mappákat látunk, nem nyers blokkokat             |
| **eszközkezelés**        | illesztőprogramokkal kezeli a nyomtatót, a kamerát, a hálózati kártyát |
| **felhasználókezelés**   | fiókok, jelszavak, jogosultságok                                       |
| **felhasználói felület** | grafikus (GUI) vagy parancssoros (CLI) kezelés                         |

## Felhasználói felület: GUI és CLI

- **GUI** (Graphical User Interface): ablakok, ikonok, egér, érintés. Könnyen tanulható.
- **CLI** (Command Line Interface): szöveges parancsok (PowerShell, Terminal, bash). Gyors, automatizálható, a szerverek nagy részét így kezelik.

## A mai rendszerek

| Rendszer   | Gyártó / eredet                          | Jellemző terület                         | Licenc                      |
| ---------- | ---------------------------------------- | ---------------------------------------- | --------------------------- |
| Windows 11 | Microsoft                                | asztali gépek, irodák, játék             | kereskedelmi                |
| macOS      | Apple (UNIX-alapú)                       | Mac gépek, kreatív munka                 | kereskedelmi (Apple géppel) |
| Linux      | nyílt közösség (Ubuntu, Fedora, Debian…) | szerverek, felhő, fejlesztés, beágyazott | nyílt (GPL)                 |
| Android    | Google (Linux kernel)                    | okostelefonok, tabletek                  | nagyrészt nyílt             |
| iOS        | Apple                                    | iPhone                                   | kereskedelmi                |

A webszerverek és a felhő nagy része Linuxon fut, az asztali gépeken a Windows a legelterjedtebb, a telefonokon az Android.

Az operációs rendszereket a tantervben külön tárgy is részletesen tárgyalja; itt a felhasználói és üzemeltetői alapokat nézzük.

## Összefoglalás

- Az OS a hardver és a programok közti alapszoftver; magja a kernel.
- Feladatai: folyamat-, memória-, fájl-, eszköz- és felhasználókezelés, felhasználói felület.
- GUI = grafikus, CLI = parancssoros felület.

## A lecke feladata

```quiz required
? Hogy hívják az operációs rendszer mindig futó magját?
= kernel
= mag
! A kernel kezeli közvetlenül a hardvert.

? Melyik OS-feladat gondoskodik arról, hogy egy program ne írjon bele egy másik program memóriájába?
- fájlkezelés
+ memóriakezelés
- eszközkezelés
- felhasználói felület
! Minden folyamat saját, védett memóriaterületet kap.

? Melyik operációs rendszer épül Linux kernelre?
- iOS
- Windows 11
+ Android
- macOS
! Az Android kernele Linux.

? Mit jelent a CLI rövidítés?
= Command Line Interface
= parancssoros felület
! Szöveges parancsokkal kezelt felület.
```
