---
title: Fájlok, mappák, elérési utak
summary: Fájlnév és kiterjesztés, abszolút és relatív elérési út, Windows- és Linux-fájlrendszer, jogosultságok.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- mi a **fájl**, a **mappa** és a **kiterjesztés**,
- hogyan néz ki egy **elérési út** Windowson és Linuxon, és mi a **relatív** út,
- mik a **fájlrendszerek** (NTFS, ext4, APFS) és a **jogosultságok**.

## Fájl és mappa

A **fájl** névvel ellátott adatsor a háttértáron. A **mappa** (könyvtár) fájlokat és további mappákat tartalmaz, így **fa** szerkezet alakul ki.

A fájlnév végén lévő **kiterjesztés** jelzi a típust: `.txt` (szöveg), `.docx` (Word), `.pdf`, `.png`, `.py` (Python), `.exe` (Windows-program). Windowson érdemes bekapcsolni a kiterjesztések megjelenítését: így nem tudnak becsapni egy `szamla.pdf.exe` nevű kártevővel.

## Elérési út

Az **elérési út** megmondja, hol van egy fájl a fában.

| Rendszer      | Gyökér           | Elválasztó | Példa                                 |
| ------------- | ---------------- | ---------- | ------------------------------------- |
| Windows       | meghajtó (`C:\`) | `\`        | `C:\Users\anna\Documents\jegyzet.txt` |
| Linux / macOS | `/`              | `/`        | `/home/anna/Documents/jegyzet.txt`    |

- **Abszolút** út: a gyökértől indul (mint fent).
- **Relatív** út: az **aktuális** mappától indul. A `.` az aktuális, a `..` a szülő mappa. Ha a `Documents` mappában állsz, a `../Pictures/kep.png` a szomszédos `Pictures` mappában lévő képet jelenti.

```text
/home/anna
├── Documents
│   └── jegyzet.txt
└── Pictures
    └── kep.png
```

Linuxon a kis- és nagybetű számít (`Jegyzet.txt` ≠ `jegyzet.txt`), Windowson nem.

## Fájlrendszerek

A **fájlrendszer** szervezi meg, hogyan kerülnek a fájlok a lemez blokkjaira.

| Fájlrendszer  | Hol?                | Megjegyzés                                                |
| ------------- | ------------------- | --------------------------------------------------------- |
| NTFS          | Windows             | jogosultságok, naplózás                                   |
| ext4          | Linux               | a legtöbb Linux alapértelmezése                           |
| APFS          | macOS, iOS          | SSD-re optimalizált                                       |
| FAT32 / exFAT | pendrive, SD-kártya | minden rendszer olvassa; FAT32-n egy fájl legfeljebb 4 GB |

## Jogosultságok

Minden fájlhoz tartozik egy **tulajdonos** és **jogok**: olvasás (**r**), írás (**w**), futtatás (**x**). Linuxon ezt így látod:

```bash
ls -l jegyzet.txt
# -rw-r--r-- 1 anna anna 120 nov  4 10:00 jegyzet.txt
#  tulajdonos: rw-, csoport: r--, mindenki más: r--
```

## Összefoglalás

- Fájl = névvel ellátott adat; a kiterjesztés jelzi a típust.
- Windows: `C:\…\…`, Linux: `/…/…`; relatív útban `.` = aktuális, `..` = szülő mappa.
- Fájlrendszerek: NTFS, ext4, APFS, exFAT; jogok: r, w, x.

## A lecke feladata

```quiz required
? Melyik karakter választja el a mappákat egy **Linuxos** elérési útban?
- `\`
+ `/`
- `:`
- `|`
! Pl. /home/anna/Documents.

? A `/home/anna/Documents` mappában állsz. Mi a `kep.png` relatív útja, ha a `/home/anna/Pictures` mappában van?
= ../Pictures/kep.png
! A `..` a szülő mappa (/home/anna).

? Mekkora lehet legfeljebb egy fájl FAT32 fájlrendszeren (GB-ban)?
= 4
! Ezért nem fér rá egy nagy videó egy FAT32-es pendrive-ra.

? Mit jelent az `x` jog Linuxon?
- olvasás
- írás
+ futtatás
- törlés
! r = read, w = write, x = execute.
```
