---
title: A Linux belülről
summary: A tanult fogalmak a Linuxban – rendszerindítás és systemd, folyamatok, az EEVDF ütemező, memória és OOM killer, könyvtárszerkezet, jogosultságok és csomagkezelés.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan valósítja meg a **Linux** a tárgy fő fogalmait: folyamatok, ütemezés, memória, fájlrendszer, biztonság,
- mi hol van a Linux **könyvtárszerkezetében**,
- hogyan nézel bele mindebbe az Ubuntu VM-eden.

## Rendszerindítás és az 1-es folyamat

UEFI → **GRUB** rendszerbetöltő → a **kernel** (`/boot/vmlinuz-…`) és egy ideiglenes gyökér-fájlrendszer (**initramfs**) → a kernel elindítja az **1-es PID-ű** folyamatot, ami Ubuntun a **systemd**. Minden más folyamat ennek leszármazottja.

```bash
ps -p 1 -o pid,comm       # az 1-es folyamat: systemd
pstree -p | head          # a folyamatfa
journalctl -b | head      # az aktuális indítás naplója
```

## Folyamatok és szálak

A Linux a folyamatot `fork()` + `exec()` párossal hozza létre (4. témakör). A kernel szemében a szál is csak egy **taszk** (`task_struct`), amely a memóriáját megosztja a szülőjével – ezért a szálak is látszanak a `ps -eLf` listában. Minden folyamatról fájlként olvashatsz: `/proc/<PID>/status`, `/proc/<PID>/maps`.

## Ütemezés

A Linux 6.6 (2023) óta az **EEVDF** (_Earliest Eligible Virtual Deadline First_) ütemezőt használja, a korábbi **CFS** utódját. Mindkettő arra törekszik, hogy minden taszk **igazságos arányban** kapjon CPU-időt. A prioritást a **nice** érték adja **−20** (legfontosabb) és **19** (legkevésbé fontos) között, alapértéke **0**; valós idejű folyamatokhoz külön `SCHED_FIFO` és `SCHED_RR` osztály van.

```bash
nice -n 10 python3 hosszu.py   # alacsonyabb prioritással indítás
renice -n 5 -p 1234            # futó folyamat prioritásának módosítása
```

## Memória

Igény szerinti lapozás, laponként 4 KiB (6. témakör). A Linux **túlfoglal** (_overcommit_): többet ígér a programoknak, mint amennyi RAM van, mert a legtöbb program nem használja ki. Ha mégis elfogy a RAM és a swap, az **OOM killer** kiválaszt és leállít egy folyamatot. A swap lehet partíció vagy fájl (Ubuntun `/swap.img`).

## Fájlrendszer és könyvtárszerkezet

Egyetlen gyökérfa (`/`), meghajtóbetűjelek nélkül; a további lemezek **csatolással** (_mount_) kerülnek bele. Alapértelmezett fájlrendszer: **ext4** (Fedorán **Btrfs**). „Minden fájl”: az eszközök is (`/dev/sda`).

| Könyvtár               | Mi van benne?                                           |
| ---------------------- | ------------------------------------------------------- |
| `/etc`                 | rendszerszintű beállítások (szöveges fájlok)            |
| `/home/<név>`          | a felhasználók saját fájljai                            |
| `/usr/bin`, `/usr/lib` | programok és könyvtárak                                 |
| `/var/log`             | naplófájlok                                             |
| `/proc`, `/sys`        | a kernel élő adatai fájlként (virtuális fájlrendszerek) |
| `/dev`                 | eszközfájlok                                            |
| `/tmp`                 | ideiglenes fájlok                                       |

## Biztonság

Felhasználók és csoportok, `rwx` jogok tulajdonosra, csoportra és másokra (12. témakör), a **root** mindent megtehet, ezért `sudo`-val dolgozunk. Kiegészítő kötelező hozzáférés-vezérlés: Ubuntun **AppArmor**, Fedorán **SELinux**.

## Szoftvertelepítés

Csomagkezelő központi tárolókból, aláírt csomagokkal: `sudo apt update && sudo apt upgrade`. Mellette disztribúciófüggetlen formátumok: **Snap** (Ubuntu), **Flatpak**.

## Összefoglalás

- Indítás: UEFI → GRUB → kernel + initramfs → systemd (PID 1).
- Szál = megosztott memóriájú taszk; minden folyamat látszik a `/proc`-ban.
- Ütemező: EEVDF (6.6 óta), nice −20…19; valós idejű osztályok.
- Túlfoglalás és OOM killer; ext4, egyetlen könyvtárfa; `rwx`, sudo, AppArmor/SELinux; apt, Snap, Flatpak.

## A lecke feladata

```quiz required
? Hány különböző nice érték létezik Linuxon (−20-tól 19-ig, a határokat is beleértve)?
= 40
! 20 negatív, a 0 és 19 pozitív érték.

? Melyik folyamat kapja az 1-es PID-et egy mai Ubuntu rendszeren?
= systemd
! Minden más folyamat ennek a leszármazottja.

? Melyik könyvtárban vannak a rendszerszintű beállítófájlok Linuxon?
+ /etc
- /home
- /tmp
- /dev
! Például /etc/fstab, /etc/hosts.

? Mit csinál az OOM killer?
+ elfogyó memória esetén kiválaszt és leállít egy folyamatot
- törli a régi naplófájlokat
- kikapcsolja a swapot
- újraindítja a gépet
! OOM = Out Of Memory.
```
