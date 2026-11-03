---
title: Teljesítményfigyelés
summary: A négy fő erőforrás mérőszámai, a terhelési átlag, a top, htop, vmstat, iostat, valamint a Feladatkezelő és az Erőforrás-figyelő.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- melyik **mérőszám** mit mond el a CPU, a memória, a lemez és a hálózat állapotáról,
- mit jelent a Linux **terhelési átlaga** (_load average_),
- hogyan találod meg a **szűk keresztmetszetet** Linuxon és Windowson.

## A négy fő erőforrás

| Erőforrás   | Fontos mérőszámok                                                    | Mikor gond?                                 |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------- |
| **CPU**     | kihasználtság (%), felhasználói / rendszer idő, I/O-várakozás (`wa`) | tartósan ~100%, sok folyamat a kész sorban  |
| **memória** | használt, szabad, **gyorsítótár**, **swap** használat, laphibák      | a swap folyamatosan nő, a gép vergődik      |
| **lemez**   | olvasási/írási sebesség, **IOPS**, várakozási idő, kihasználtság (%) | tartósan 100% kihasználtság, nagy várakozás |
| **hálózat** | sávszélesség (Mbit/s), csomagvesztés, késleltetés                    | a vonal tele, sok újraküldés                |

A **szűk keresztmetszet** az az erőforrás, amelyik először telik be – a rendszer csak olyan gyors, mint a leglassabb láncszeme. Felesleges új processzort venni, ha a lemez a gond.

## A terhelési átlag

```bash
uptime
# 10:42:01 up 2:13, 1 user, load average: 0.52, 1.10, 0.87
```

A három szám az elmúlt **1, 5 és 15 perc** átlaga arról, hány folyamat **futott vagy várt** futásra (Linuxon a lemezre várók is beleszámítanak). Értelmezése a **magok számához** viszonyítva:

- 4 magos gépen **4,0** = minden mag teljesen dolgozik, de senki sem vár,
- **2,0** = félig terhelt,
- **8,0** = kétszeres túlterhelés: átlagosan minden futó mellett egy folyamat vár.

## Eszközök Linuxon

```bash
top                 # élő lista; P: CPU szerint, M: memória szerint rendez; 1: magonként
htop                # színes, egérrel is kezelhető (sudo apt install htop)
vmstat 1 5          # r: kész sor, si/so: lapozás, wa: I/O-várakozás, cs: környezetváltás
free -h             # memória és swap
iostat -x 1 3       # lemezek kihasználtsága (sudo apt install sysstat)
df -h; du -sh ~/*   # hol fogy a hely
ss -s               # hálózati kapcsolatok összesítve
```

Egy gyakori minta: magas `wa` (I/O-várakozás) + alacsony CPU-használat = a processzor **a lemezre vár** → a lemez a szűk keresztmetszet.

## Eszközök Windowson

- **Feladatkezelő** (Ctrl + Shift + Esc): **Folyamatok** (ki mennyit használ), **Teljesítmény** (CPU, memória, lemez, hálózat, GPU grafikonok), **Indítás** (az indításkor induló programok hatása).
- **Erőforrás-figyelő** (`resmon`): melyik folyamat melyik fájlt írja, melyik porton kommunikál.
- **Teljesítményfigyelő** (`perfmon`): hosszú távú mérés számlálókkal, jelentések.
- **PowerShell**:

```powershell
Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 5
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, CPU, WorkingSet
```

## Mérés, nem tippelés

Optimalizálás előtt **mérj**: mi a lassú, mennyire, és mikor? Változtass **egyszerre egy dolgot**, és mérj újra. Ami nem mérhető, arról nem tudod, javult-e.

## Összefoglalás

- Négy fő erőforrás: CPU, memória, lemez, hálózat; a leglassabb a szűk keresztmetszet.
- Terhelési átlag: 1, 5, 15 perces átlag, a magszámhoz viszonyítva értelmezzük.
- Linux: `top`/`htop`, `vmstat`, `free`, `iostat`; Windows: Feladatkezelő, `resmon`, `perfmon`, `Get-Counter`.
- Előbb mérj, aztán változtass – egyszerre egy dolgot.

## A lecke feladata

```quiz required
? Egy 4 magos gépen a terhelési átlag 8,0. Átlagosan hány folyamat vár futó folyamatonként?
= 1
! 8 folyamat, 4 fut, 4 vár → futónként 1.

? Mit jelent, ha a `vmstat` kimenetében magas a `wa`, de alacsony a CPU-használat?
+ A processzor a lemezre (I/O-ra) vár, a lemez a szűk keresztmetszet.
- A processzor túlmelegedett.
- Elfogyott a hálózati sávszélesség.
- Minden rendben van.
! wa = I/O wait.

? Hány perces átlagokat mutat az `uptime` terhelési átlaga?
+ 1, 5 és 15
- 1, 10 és 60
- 5, 15 és 30
- csak az utolsó percet
! Ebből látszik a trend is.

? Melyik Windows-eszköz mutatja, melyik folyamat melyik fájlt írja és melyik porton kommunikál?
+ Erőforrás-figyelő (resmon)
- Jegyzettömb
- Lemezkezelés
- Vezérlőpult
! A Feladatkezelő Teljesítmény fülén is van rá link.
```
