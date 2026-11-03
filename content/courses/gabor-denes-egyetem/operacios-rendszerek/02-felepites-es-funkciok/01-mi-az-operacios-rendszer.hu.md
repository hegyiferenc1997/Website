---
title: Mi az operációs rendszer?
summary: Az OS két arca – erőforrás-kezelő és kiterjesztett gép –, valamint a fejlődés főbb állomásai.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **operációs rendszer** (OS), és hol helyezkedik el a hardver és a programok között,
- mit jelent, hogy az OS **erőforrás-kezelő** és **kiterjesztett (absztrakt) gép**,
- milyen **korszakokon** ment át az operációs rendszerek fejlődése.

## A definíció

Az **operációs rendszer** az a szoftver, amely **kezeli a számítógép hardverét**, és **szolgáltatásokat nyújt** a felhasználói programoknak. Nélküle minden programnak magának kellene tudnia, hogyan kell egy lemezt olvasni vagy egy hálózati kártyával beszélni.

```text
┌──────────────────────────────────────────┐
│   felhasználó                            │
├──────────────────────────────────────────┤
│   alkalmazások (böngésző, VS Code, játék)│
├──────────────────────────────────────────┤
│   rendszerprogramok (shell, fájlkezelő)  │
├──────────────────────────────────────────┤
│   OPERÁCIÓS RENDSZER (kernel)            │
├──────────────────────────────────────────┤
│   hardver (CPU, memória, lemez, hálózat) │
└──────────────────────────────────────────┘
```

Az OS legfontosabb, mindig a memóriában lévő része a **kernel** (mag). A többi (shell, segédprogramok, grafikus felület) a kernelre épül.

## Az OS két arca

**1. Kiterjesztett gép (absztrakció).** A hardver bonyolult és csúnya: egy SSD-t blokkokban, regiszterekkel kell kezelni. Az OS ehelyett szép, egyszerű fogalmakat ad: **fájl**, **folyamat**, **socket**, **ablak**. A programozó azt írja: „nyisd meg a `jegyzet.txt`-t”, és nem kell tudnia, hol van a lemezen.

**2. Erőforrás-kezelő.** Egy gépen egyszerre sok program fut, és mind kér processzoridőt, memóriát, lemezt, hálózatot. Az OS **elosztja és védi** ezeket:

- **időbeli megosztás**: a processzort felváltva kapják a programok (ütemezés),
- **térbeli megosztás**: a memóriát és a lemezt részekre osztja,
- **védelem**: egy program nem írhat bele egy másik memóriájába.

## Rövid történet

| Korszak    | Jellemző                                                                 | Példa                    |
| ---------- | ------------------------------------------------------------------------ | ------------------------ |
| 1940–50-es | nincs OS, a programot kapcsolókkal, lyukkártyával töltik be              | ENIAC                    |
| 1950–60-as | **kötegelt** (batch) feldolgozás: a feladatok sorban futnak              | IBM 7094, FMS            |
| 1960-as    | **multiprogramozás** és **időosztás**: több program, több terminál      | IBM OS/360, CTSS, MULTICS|
| 1970-es    | a **UNIX** (C nyelven írva, hordozható)                                  | UNIX, később BSD         |
| 1980-as    | személyi számítógépek, grafikus felület                                 | MS-DOS, Mac OS, Windows  |
| 1990-es    | nyílt forráskód, hálózat, 32 bit                                          | **Linux** (1991), Windows NT |
| 2000-től   | mobil, virtualizáció, felhő, többmagos processzorok                     | Android, iOS, Windows 11, macOS |

A mai Linux és macOS a UNIX szellemi örököse; a Windows a Windows NT vonalból származik.

## Összefoglalás

- Az OS kezeli a hardvert, és szolgáltatásokat ad a programoknak; legfontosabb része a **kernel**.
- Két arca: **kiterjesztett gép** (absztrakciók: fájl, folyamat) és **erőforrás-kezelő** (elosztás, védelem).
- A fejlődés fő lépései: kötegelt → multiprogramozás és időosztás → UNIX → PC és GUI → Linux, NT → mobil és felhő.

## A lecke feladata

```quiz required
? Hogy hívják az operációs rendszer mindig a memóriában lévő, legfontosabb részét?
= kernel
= mag
! A kernel (mag) kezeli közvetlenül a hardvert.

? Melyik az OS „kiterjesztett gép” szerepére példa?
- A processzoridőt felváltva adja a programoknak.
+ A lemez blokkjai helyett fájlokat és mappákat mutat.
- Megakadályozza, hogy egy program más memóriájába írjon.
- Kiírja a hibaüzenetet.
! Absztrakció: egyszerű fogalom a bonyolult hardver helyett.

? Melyik évben jelent meg a Linux kernel első változata?
= 1991
! Linus Torvalds, Helsinki, 1991.

? Mit nevezünk időbeli megosztásnak az erőforrás-kezelésben?
+ A processzort felváltva, egymás után kapják a programok.
- A memóriát részekre osztják a programok között.
- A fájlokat több mappába másolják.
- A felhasználók felváltva ülnek a géphez.
! A térbeli megosztás a memória és a lemez felosztása.
```
