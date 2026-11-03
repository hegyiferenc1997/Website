---
title: Folyamatok létrehozása és kezelése
summary: fork, exec és wait, a folyamatfa, a jelzések, valamint a ps, top és kill parancsok.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan hoz létre egy folyamat új folyamatot UNIX-on (**fork**, **exec**, **wait**) és Windowson,
- mi a **folyamatfa**, az **árva** és a **zombi** folyamat,
- hogyan figyeled és állítod le a folyamatokat (**ps**, **top**, **kill**, Feladatkezelő).

## fork, exec, wait

UNIX-on egy új folyamat mindig egy meglévőből születik:

1. **`fork()`** – a folyamat **lemásolja magát**. Két majdnem egyforma folyamat lesz: a **szülő** és a **gyerek**. A `fork` a szülőnek a gyerek PID-jét, a gyereknek **0**-t ad vissza – ebből tudják, melyikük melyik.
2. **`exec()`** – a gyerek a saját memóriáját **lecseréli** egy másik programra (pl. `ls`).
3. **`wait()`** – a szülő megvárja, amíg a gyerek befejeződik, és megkapja a **kilépési kódját**.

```c
// A shell egyszerűsített működése: elindítja az ls programot, és megvárja.
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();                 // itt kettéválik a folyamat
    if (pid == 0) {                     // gyerek ág
        execlp("ls", "ls", "-l", NULL); // lecseréli magát az ls-re
        perror("exec");                 // ide csak hiba esetén jut
        return 1;
    }
    int status;
    waitpid(pid, &status, 0);           // szülő: megvárja a gyereket
    printf("A gyerek kilépési kódja: %d\n", WEXITSTATUS(status));
    return 0;
}
```

Pontosan így működik a shell is: minden begépelt parancsnál `fork` + `exec`, majd `wait`.

**Windowson** egyetlen hívás, a **`CreateProcess`** hozza létre és indítja el az új folyamatot (nincs külön fork és exec).

## A folyamatfa

Mivel minden folyamatnak van szülője, a folyamatok **fát** alkotnak, amelynek gyökere Linuxon a **systemd** (PID 1):

```bash
pstree -p | head -20   # a folyamatfa PID-ekkel
ps -o pid,ppid,cmd     # a shelled folyamatai: PID és a szülő PID-je
```

- **Árva folyamat**: a szülő előbb ért véget, mint a gyerek. Linuxon az árvát a PID 1 (vagy egy kijelölt „befogadó”) **örökbe fogadja**.
- **Zombi folyamat**: a gyerek már befejeződött, de a szülő még nem hívta meg a `wait()`-et, ezért a PCB-je (a kilépési kóddal) még megmarad. A `ps` kimenetében `Z` állapot jelzi.

## Jelzések (signals)

A **jelzés** egy rövid értesítés, amelyet a kernel vagy egy másik folyamat küld egy folyamatnak.

| Jelzés    | Szám | Jelentés                                         | Mikor?                    |
| --------- | ---- | ------------------------------------------------ | ------------------------- |
| `SIGINT`  | 2    | megszakítás kérése                               | **Ctrl + C** a terminálban |
| `SIGTERM` | 15   | udvarias kérés a kilépésre (elkapható)           | `kill PID` alapértelmezése |
| `SIGKILL` | 9    | azonnali leállítás (**nem** kapható el)          | `kill -9 PID`             |
| `SIGSTOP` | 19   | felfüggesztés                                    | **Ctrl + Z**              |

## Folyamatok figyelése

```bash
ps aux | head            # minden folyamat: felhasználó, PID, %CPU, %MEM, parancs
top                      # élő lista (kilépés: q); kényelmesebb: htop
sleep 300 &              # háttérben indított folyamat
jobs                     # a shell háttérfeladatai
kill %1                  # SIGTERM az 1. háttérfeladatnak
pgrep sleep              # egy program PID-je név alapján
```

Windowson a **Feladatkezelő** (Ctrl + Shift + Esc) _Részletek_ fülén látod a PID-eket; PowerShellben:

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Stop-Process -Name notepad     # a Jegyzettömb leállítása
```

## Összefoglalás

- UNIX: `fork` lemásolja a folyamatot, `exec` lecseréli a programot, `wait` megvárja a gyereket; Windows: `CreateProcess`.
- A folyamatok fát alkotnak (gyökér: PID 1); árva = elhunyt szülő, zombi = a szülő még nem hívott `wait`-et.
- Jelzések: Ctrl + C = `SIGINT`, `kill` = `SIGTERM` (15), `kill -9` = `SIGKILL`.

## A lecke feladata

```quiz required
? Mit ad vissza a `fork()` a gyerek folyamatnak?
= 0
! A szülő a gyerek PID-jét kapja.

? Melyik hívás cseréli le a folyamat memóriáját egy másik programra?
- fork
+ exec
- wait
- kill
! fork + exec = új program indítása új folyamatban.

? Hogy hívjuk azt a befejeződött folyamatot, amelynek a szülője még nem hívta meg a `wait()`-et?
= zombi
= zombie
! A ps kimenetében Z állapot.

? Melyik jelzést küldi a `kill -9`, amelyet a folyamat nem tud elkapni?
+ SIGKILL
- SIGTERM
- SIGINT
- SIGSTOP
! A SIGTERM udvarias kérés, a SIGKILL azonnali leállítás.

? Melyik Windows API-hívás hoz létre és indít el egy új folyamatot?
= CreateProcess
! Windowson nincs külön fork és exec.
```
