---
title: Kernelmodulok és a kernel belülről
summary: Betölthető modulok (lsmod, modprobe), a kernel üzenetei (dmesg), a /proc és a /sys, a kernelverziók és a frissítés.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **betölthető kernelmodul**, és hogyan kezeled (`lsmod`, `modinfo`, `modprobe`),
- hogyan olvasod a **kernel üzeneteit** (`dmesg`, `journalctl -k`),
- mit mutat a **/proc** és a **/sys**, és hogyan épül fel a **kernelverzió**.

## Betölthető kernelmodulok

A Linux kernel monolitikus, de nem kell minden illesztőprogramot egyszerre tartalmaznia. A **kernelmodul** (`.ko` fájl) egy kódrész, amelyet **futás közben** betölthetünk a kernelbe, és onnan el is távolíthatunk – újraindítás nélkül. Az illesztőprogramok, fájlrendszerek, hálózati protokollok nagy része modul.

```bash
lsmod | head                      # a betöltött modulok (név, méret, ki használja)
modinfo vboxguest                 # egy modul adatai (VirtualBox vendégkiegészítő)
sudo modprobe -r pcspkr           # modul eltávolítása (a PC-hangszóró)
sudo modprobe pcspkr              # és visszatöltése, a függőségeivel együtt
ls /lib/modules/$(uname -r)/kernel/drivers | head   # a telepített modulok helye
```

Figyelem: a betöltött modul **kernel módban** fut, teljes jogokkal – ezért kell a `sudo`, és ezért ellenőrzi Secure Boot mellett a kernel a modulok **aláírását**. (Emiatt kéri néha az Ubuntu, hogy a VirtualBox vagy NVIDIA driver kulcsát regisztráld – _MOK enrollment_.)

## A kernel üzenetei

A kernel a saját naplójába ír: milyen hardvert talált, melyik driver töltődött be, milyen hiba történt.

```bash
sudo dmesg | head -20             # az indítás eleje: CPU, memória, eszközök
sudo dmesg -w                     # élő figyelés – dugj be egy (virtuális) USB-eszközt!
journalctl -k -b                  # a kernel üzenetei a mostani indítás óta
```

Ha a kernel **végzetes hibát** talál, **kernel panic**-kal leáll (Windowson ennek felel meg a **kék halál**, BSOD, egy hibakóddal).

## A /proc és a /sys

Ezek **nem valódi** fájlok a lemezen: a kernel menet közben állítja elő a tartalmukat, ha olvasod őket – ablak a kernel belsejébe.

| Útvonal                       | Mit mutat?                                       |
| ----------------------------- | ------------------------------------------------ |
| `/proc/cpuinfo`               | a processzor(ok) adatai                          |
| `/proc/meminfo`               | a memória részletes állapota                     |
| `/proc/<PID>/`                | egy folyamat adatai (status, maps, fd …)         |
| `/proc/version`               | a kernel verziója és fordítási adatai            |
| `/proc/sys/`                  | **állítható** kernelparaméterek (`sysctl`)       |
| `/sys/class/net/`             | a hálózati interfészek                           |
| `/sys/block/`                 | a blokkos eszközök (lemezek)                     |

```bash
cat /proc/version
cat /proc/sys/vm/swappiness          # mennyire szívesen lapoz ki a kernel (0–200, alap: 60)
sysctl net.ipv4.ip_forward           # ugyanez a sysctl paranccsal
```

## Kernelverziók

```bash
uname -r       # pl. 7.0.0-15-generic
```

A szám jelentése: **főverzió.alverzió.javítás**, utána a disztribúció saját jelölése (Ubuntu: csomagváltozat és változat, pl. `generic`). A Linux kernel nagyjából **9–10 hetente** ad ki új alverziót; évente kijelölnek egy **LTS** kernelt, amelyet évekig javítanak. Az Ubuntu 26.04 LTS a 7.0-s kernelre épül, és biztonsági javításokat kap hozzá, a `sudo apt upgrade` ezt is frissíti (utána újraindítás kell, hogy az új kernel fusson).

Windowson a kernelverziót a `winver` vagy a PowerShell `[System.Environment]::OSVersion` mutatja; a kernelfájl a `C:\Windows\System32\ntoskrnl.exe`.

## Összefoglalás

- A kernelmodul futás közben be- és kitölthető kernelkód (`lsmod`, `modinfo`, `modprobe`); kernel módban fut, Secure Boot mellett aláírt kell legyen.
- A kernel naplója: `dmesg`, `journalctl -k`; végzetes hiba: kernel panic (Windows: BSOD).
- A `/proc` és a `/sys` a kernel által menet közben generált virtuális fájlrendszerek; a `/proc/sys` paraméterei állíthatók.
- `uname -r`: főverzió.alverzió.javítás + disztribúciós jelölés.

## A lecke feladata

```quiz required
? Melyik parancs listázza a betöltött kernelmodulokat?
= lsmod
! A modinfo egy modul adatait, a modprobe a betöltést végzi.

? Melyik paranccsal töltesz be egy modult a függőségeivel együtt?
+ modprobe
- insmod --all
- dmesg
- uname
! sudo modprobe modulnév

? Melyik parancs mutatja a kernel üzeneteit (pl. a felismert hardvert)?
= dmesg
= sudo dmesg
= journalctl -k
! dmesg -w: élő figyelés.

? Mi igaz a /proc mappára?
- Valódi fájlok a lemezen, amelyeket az indításkor másolnak oda.
+ A kernel menet közben állítja elő a tartalmát, amikor olvasod.
- A felhasználók személyes fájljai vannak benne.
- Csak Windowson létezik.
! Virtuális fájlrendszer, ablak a kernel belsejébe.

? Melyik parancs írja ki a futó Linux kernel verzióját?
= uname -r
! pl. 7.0.0-15-generic
```
