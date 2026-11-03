---
title: API-k és könyvtárak
summary: Az API és a rendszerhívás különbsége, a C könyvtár, a POSIX szabvány, a Win32 API és az ntdll, és hogyan hordozható egy program.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a különbség az **API** és a **rendszerhívás** között,
- mi a **C könyvtár** (libc), a **POSIX** szabvány és a **Win32 API**,
- mi az **ABI**, és miért nem fut egy Linuxos program Windowson (és fordítva).

## API kontra rendszerhívás

Az **API** (_Application Programming Interface_) a függvények, típusok és szabályok **dokumentált készlete**, amelyet a programozó használ. A rendszerhívás ennél **alacsonyabb szint**: a kernel tényleges belépési pontja.

```text
a te programod:   fopen("a.txt", "r")      ← API (C szabványkönyvtár)
        ↓
libc:             open("a.txt", O_RDONLY)  ← POSIX API, vékony burok
        ↓
kernel:           syscall #257 (openat)    ← a rendszerhívás
```

Miért jó a köztes réteg?

- **hordozhatóság**: ugyanaz az API több OS-en is működhet, a rendszerhívás száma és módja eltérhet,
- **kényelem**: az API pufferel, hibát kezel, egyszerűbb paramétereket ad,
- **stabilitás**: a rendszerhívások mögötte változhatnak, az API marad.

Nem minden API-hívás jár rendszerhívással: a `strlen` vagy a `sqrt` teljesen felhasználói módban fut; a `printf` csak akkor hív `write`-ot, amikor a puffer megtelt.

## A legfontosabb API-k

| API                     | Hol?              | Jellemző                                                                              |
| ----------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| **C szabványkönyvtár**  | mindenhol         | `printf`, `fopen`, `malloc` – a C nyelv része                                         |
| **POSIX**               | Linux, macOS, BSD | IEEE-szabvány: `fork`, `open`, `pthread_create`, a shell parancsai                    |
| **Win32 (Windows API)** | Windows           | `CreateProcess`, `CreateFile`, ablakkezelés; a `kernel32.dll`, `user32.dll` stb. adja |
| **Native API**          | Windows, belső    | `ntdll.dll` – a Win32 alatti, kevéssé dokumentált réteg, közvetlenül a kernelt hívja  |
| magas szintű könyvtárak | bárhol            | Python `os`, Java `java.io`, .NET – végül ezek is a fentieket hívják                  |

Linuxon a C könyvtár általában a **glibc** (Alpine Linuxon a kisebb musl). Megnézheted, mely könyvtárakat használ egy program:

```bash
ldd /bin/ls          # a dinamikusan betöltött könyvtárak (libc.so.6 …)
```

## ABI és hordozhatóság

Az **ABI** (_Application Binary Interface_) a **lefordított** program és a rendszer közötti megállapodás: hogyan adódnak át a paraméterek, milyen a futtatható fájl formátuma, mik a rendszerhívás-számok.

| Rendszer | Futtatható formátum     | Rendszerhívások   |
| -------- | ----------------------- | ----------------- |
| Linux    | **ELF**                 | Linux-számozás    |
| Windows  | **PE** (`.exe`, `.dll`) | NT kernel (ntdll) |
| macOS    | **Mach-O**              | XNU kernel        |

Ezért nem fut egy Linuxra fordított program Windowson: más a fájlformátum és más a kernel felülete. A **forráskód** viszont hordozható, ha szabványos API-t (pl. POSIX vagy a C szabványkönyvtár) használ – csak újra kell fordítani. Kivételek: a **WSL** Linuxot futtat Windowson (WSL 2 virtuális gépben valódi Linux kernellel), a **Wine** pedig a Win32 API-t valósítja meg Linuxon.

```bash
file /bin/ls         # ELF 64-bit LSB … x86-64
```

## Összefoglalás

- Az API a programozó felülete, a rendszerhívás a kernel belépési pontja; a libc köti össze őket.
- Fő API-k: C szabványkönyvtár, POSIX, Win32 (alatta ntdll).
- ABI: a bináris megállapodás (ELF, PE, Mach-O) – ezért nem futnak a binárisok más OS-en; a forráskód szabványos API-val hordozható.

## A lecke feladata

```quiz required
? Melyik IEEE-szabvány határozza meg a UNIX-szerű rendszerek közös API-ját?
= POSIX
! Portable Operating System Interface.

? Melyik hívás fut teljesen felhasználói módban, rendszerhívás nélkül?
+ strlen
- open
- fork
- write
! Csak a memóriában lévő karaktereket számolja.

? Mi a Linux futtatható fájlformátumának neve?
= ELF
! Executable and Linkable Format; Windowson PE, macOS-en Mach-O.

? Melyik Windows DLL a Win32 alatti „natív” réteg, amely közvetlenül a kernelt hívja?
+ ntdll.dll
- user32.dll
- explorer.exe
- notepad.exe
! A kernel32.dll is ezt hívja.

? Melyik parancs mutatja, mely dinamikus könyvtárakat használ egy Linux program?
= ldd
! ldd /bin/ls
```
