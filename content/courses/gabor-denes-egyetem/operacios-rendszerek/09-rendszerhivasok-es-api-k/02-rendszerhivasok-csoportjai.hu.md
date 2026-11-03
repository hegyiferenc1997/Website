---
title: A rendszerhívások csoportjai
summary: Folyamat-, fájl-, eszköz-, információs, kommunikációs és védelmi hívások, POSIX és Win32 megfelelőikkel, valamint a fájlleíró fogalma.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **csoportokba** sorolhatók a rendszerhívások,
- melyik UNIX/POSIX hívásnak mi a **Windows (Win32)** megfelelője,
- mi a **fájlleíró** (_file descriptor_), és mi a három szabványos csatorna.

## A hat csoport

| Csoport             | Mire való?                                | POSIX (Linux, macOS)                       | Win32 (Windows)                                                    |
| ------------------- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| **folyamatkezelés** | indítás, befejezés, várakozás             | `fork`, `exec`, `exit`, `wait`             | `CreateProcess`, `ExitProcess`, `WaitForSingleObject`              |
| **fájlkezelés**     | megnyitás, olvasás, írás, bezárás, törlés | `open`, `read`, `write`, `close`, `unlink` | `CreateFile`, `ReadFile`, `WriteFile`, `CloseHandle`, `DeleteFile` |
| **eszközkezelés**   | eszköz vezérlése, lefoglalása             | `ioctl`, `read`, `write`                   | `DeviceIoControl`                                                  |
| **információ**      | idő, azonosítók, rendszeradatok           | `getpid`, `time`, `uname`                  | `GetCurrentProcessId`, `GetSystemTime`                             |
| **kommunikáció**    | csövek, közös memória, hálózat            | `pipe`, `mmap`, `socket`                   | `CreatePipe`, `MapViewOfFile`, `socket`                            |
| **védelem**         | jogosultságok lekérdezése, beállítása     | `chmod`, `chown`, `umask`                  | `SetFileSecurity`, `SetSecurityInfo`                               |

Egy mai Linux kernel **több mint 300** rendszerhívást ismer, de a programok túlnyomó része pár tucatot használ.

## A fájlleíró

UNIX-on egy megnyitott fájlt egy kis **egész szám**, a **fájlleíró** azonosít. Az `open` adja vissza, a `read`, `write`, `close` ezt kapja meg. Windowson ugyanezt a szerepet a **handle** (leíró) tölti be.

Minden folyamat **három** megnyitott fájlleíróval indul:

| Szám | Neve       | Alapból hova mutat?               |
| ---- | ---------- | --------------------------------- |
| 0    | **stdin**  | billentyűzet (szabványos bemenet) |
| 1    | **stdout** | terminál (szabványos kimenet)     |
| 2    | **stderr** | terminál (hibakimenet)            |

Ezért kapja egy újonnan megnyitott fájl jellemzően a **3**-as leírót. A shell átirányításai is ezeket cserélik ki:

```bash
ls /nincs-ilyen 2> hibak.txt   # a 2-es (stderr) kimenet fájlba
ls /etc > lista.txt 2>&1       # a stdout fájlba, és a stderr is oda, ahová az 1-es
ls /proc/$$/fd                 # a shelled megnyitott fájlleírói
```

## Fájlkezelés alacsony szinten

A Python `os` modulja szinte egy az egyben a rendszerhívásokat adja – futtasd, és nézd meg a kapott fájlleírót!

```python run
# Alacsony szintű fájlkezelés: az os modul függvényei szinte egy az egyben rendszerhívások.
import os

fd = os.open("proba.txt", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)  # open()
print("kapott fájlleíró:", fd)
os.write(fd, b"Hello, kernel!\n")                                       # write()
os.close(fd)                                                            # close()

fd = os.open("proba.txt", os.O_RDONLY)
adat = os.read(fd, 100)                                                 # read()
os.close(fd)
print("beolvasva:", adat.decode().strip())
print("folyamatazonosító (getpid):", os.getpid())
os.remove("proba.txt")                                                  # unlink()
```

(A böngészőben futó Python egy szimulált fájlrendszert használ, de a hívások ugyanazok.)

## Összefoglalás

- Csoportok: folyamat, fájl, eszköz, információ, kommunikáció, védelem.
- POSIX `fork/exec` ↔ Win32 `CreateProcess`; `open/read/write/close` ↔ `CreateFile/ReadFile/WriteFile/CloseHandle`.
- A fájlleíró egy kis egész szám; 0 = stdin, 1 = stdout, 2 = stderr.

## A lecke feladata

```quiz required
? Melyik csoportba tartozik a `getpid` rendszerhívás?
- folyamatkezelés
- fájlkezelés
+ információ
- védelem
! A futó folyamat azonosítóját kérdezi le.

? Mi a POSIX `open` hívás Win32 megfelelője?
= CreateFile
! A neve ellenére meglévő fájlt is ezzel nyitunk meg.

? Melyik fájlleíró-szám a szabványos hibakimenet (stderr)?
= 2
! 0 = stdin, 1 = stdout, 2 = stderr.

? Egy program először nyit meg egy fájlt (semmit sem zárt be). Jellemzően melyik fájlleírót kapja?
= 3
! A 0, 1 és 2 már foglalt.

? Melyik rendszerhívás tartozik a kommunikáció csoportjába?
- chmod
+ pipe
- getpid
- unlink
! A cső két folyamat közötti adatcsatorna.
```
