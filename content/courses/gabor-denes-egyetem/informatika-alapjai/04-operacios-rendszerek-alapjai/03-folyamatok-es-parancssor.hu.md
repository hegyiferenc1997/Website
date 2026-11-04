---
title: Folyamatok és parancssor
summary: Program és folyamat, a Feladatkezelő, valamint az első parancsok PowerShellben és bash-ben.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **program** és a **folyamat** között,
- hogyan nézed meg és állítod le a folyamatokat (**Feladatkezelő**, `top`),
- melyek az első, legfontosabb **parancssori** parancsok.

## Program és folyamat

A **program** a lemezen lévő fájl (pl. `chrome.exe`). Amikor elindítod, az OS betölti a memóriába, és létrejön egy **folyamat** (process): egy futó példány saját memóriával és azonosítóval (**PID**). Egy programból több folyamat is futhat: a Chrome minden fülnek külön folyamatot indít, így egy lefagyó oldal nem viszi magával a többit.

## Feladatkezelő

Windowson a **Feladatkezelő** (`Ctrl + Shift + Esc`) megmutatja, melyik folyamat mennyi processzort, memóriát, lemezt és hálózatot használ. Egy lefagyott programot itt a **Feladat befejezése** gombbal állíthatsz le. macOS-en ugyanez a **Tevékenységfigyelő**, Linuxon a `top` vagy a kényelmesebb `htop` parancs.

## Első lépések a parancssorban

A parancssorban mindig egy **aktuális mappában** állsz. A legfontosabb parancsok:

| Feladat              | Windows PowerShell      | Linux / macOS bash |
| -------------------- | ----------------------- | ------------------ |
| hol vagyok?          | `pwd` / `Get-Location`  | `pwd`              |
| mappa tartalma       | `ls` / `dir`            | `ls`               |
| belépés egy mappába  | `cd Documents`          | `cd Documents`     |
| egy szinttel feljebb | `cd ..`                 | `cd ..`            |
| új mappa             | `mkdir proba`           | `mkdir proba`      |
| fájl tartalma        | `cat jegyzet.txt`       | `cat jegyzet.txt`  |
| másolás              | `cp a.txt b.txt`        | `cp a.txt b.txt`   |
| törlés               | `rm a.txt`              | `rm a.txt`         |
| folyamatok           | `Get-Process`           | `ps aux`           |
| folyamat leállítása  | `Stop-Process -Id 1234` | `kill 1234`        |

```bash
pwd                 # /home/anna
mkdir proba         # új mappa
cd proba
echo "szia" > hello.txt
cat hello.txt       # szia
cd ..
```

**Vigyázz:** a parancssori törlés (`rm`) nem a Lomtárba tesz, a fájl azonnal eltűnik.

## Miért érdemes megtanulni?

A parancssor **automatizálható**: amit tízszer kell megcsinálni, azt egy szkriptbe írod. A szerverek, a felhő és a fejlesztőeszközök (git, pnpm, pip) is parancssorból mennek.

## Összefoglalás

- Program = fájl a lemezen; folyamat = futó példány saját memóriával és PID-del.
- Feladatkezelő (Windows), Tevékenységfigyelő (macOS), `top`/`htop` (Linux).
- Alapparancsok: `pwd`, `ls`, `cd`, `mkdir`, `cat`, `cp`, `rm`.

## A lecke feladata

```quiz required
? Hogy hívják egy program futó példányát?
= folyamat
= process
! Minden folyamatnak saját azonosítója (PID) van.

? Melyik billentyűkombináció nyitja meg közvetlenül a Feladatkezelőt Windowson?
- Ctrl + C
- Alt + F4
+ Ctrl + Shift + Esc
- Win + D
! A Ctrl + Alt + Del menüből is elérhető.

? Melyik paranccsal lépsz egy szinttel feljebb a mappaszerkezetben?
= cd ..
! A `..` a szülő mappa.

? Melyik parancs írja ki az aktuális mappát Linuxon?
+ pwd
- ls
- cat
- mkdir
! print working directory.
```
