---
title: Háttértárak, partíciók és biztonsági mentés
summary: HDD és SSD, MBR és GPT partíciós tábla, csatolás, RAID-szintek kapacitásszámítással és a 3-2-1 mentési szabály.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- miben különbözik a **HDD** és az **SSD** (és mi a **TRIM**),
- mi a **partíció**, az **MBR** és a **GPT**, és hogyan **csatolunk** egy fájlrendszert,
- hogyan működik a **RAID 0, 1, 5**, és mi a **3-2-1** mentési szabály.

## HDD és SSD

| Szempont           | HDD (merevlemez)                         | SSD (félvezető)                       |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| működés            | forgó mágneses lemezek, mozgó fej        | flash memóriacellák, nincs mozgó rész |
| véletlen elérés    | ~10 ms (a fejnek oda kell mozognia)      | ~0,1 ms vagy kevesebb                 |
| sebesség (soros)   | 100–250 MB/s                             | 500 MB/s (SATA) – 7000+ MB/s (NVMe)   |
| ár / TB            | olcsó                                    | drágább                               |
| tipikus használat  | archívum, nagy adattár                   | rendszerlemez, laptop                 |

Az SSD celláit csak **blokkonként törölve** lehet újraírni, és korlátozott számú írást bírnak. Az SSD vezérlője ezért elosztja az írásokat (_wear leveling_), az OS pedig a **TRIM** paranccsal jelzi, mely blokkok szabadultak fel. HDD-n régen kellett **töredezettségmentesíteni**; SSD-n erre nincs szükség (és felesleges kopást okoz).

## Partíciók

A lemezt **partíciókra** oszthatjuk; mindegyik saját fájlrendszert kaphat (pl. Windows + Linux egy gépen). A partíciók listáját a **partíciós tábla** tárolja:

| Szempont               | MBR (régi)                         | GPT (új, UEFI-vel)               |
| ---------------------- | ---------------------------------- | -------------------------------- |
| max. lemezméret        | **2 TB**                           | gyakorlatilag korlátlan          |
| partíciók száma        | **4** elsődleges (vagy 3 + kiterjesztett) | Windowson **128**        |
| tartalék másolat       | nincs                              | van (a lemez végén)              |

A Windows 11 és a modern Ubuntu-telepítés **GPT**-t használ, külön kis **EFI rendszerpartícióval** (FAT32), amelyen a rendszerbetöltők vannak.

```bash
lsblk                    # lemezek és partíciók fa alakban
sudo fdisk -l            # partíciós táblák részletesen
df -h                    # a csatolt fájlrendszerek foglaltsága
```

Windowson: **Lemezkezelés** (Win + X → Lemezkezelés), vagy PowerShellben `Get-Disk`, `Get-Partition`.

## Csatolás (mount)

Linuxon egy partíció fájlrendszere akkor érhető el, ha **csatoljuk** a könyvtárfa egy pontjára (csatolási pont):

```bash
sudo mkdir /mnt/adat
sudo mount /dev/sdb1 /mnt/adat    # a második lemez első partíciója
sudo umount /mnt/adat             # leválasztás (előtte ne húzd ki a pendrive-ot!)
cat /etc/fstab                    # mi csatolódik indításkor automatikusan
```

A grafikus felület a pendrive-okat magától csatolja a `/media/<felhasználó>/` alá.

## RAID

A **RAID** (_Redundant Array of Independent Disks_) több lemezt kezel egy egységként, gyorsaságért és/vagy biztonságért. **n** darab, egyenként **C** kapacitású lemezzel:

| Szint      | Működés                                          | Hasznos kapacitás | Hány lemez hibáját bírja? |
| ---------- | ------------------------------------------------ | ----------------- | ------------------------- |
| **RAID 0** | csíkozás: az adat felváltva kerül a lemezekre    | n · C             | **0** (bármelyik hibájánál minden elvész) |
| **RAID 1** | tükrözés: minden lemezen ugyanaz                 | C                 | n − 1                     |
| **RAID 5** | csíkozás + elosztott paritás                     | (n − 1) · C       | 1                         |
| **RAID 10**| tükrözött párok csíkozva                         | n · C / 2         | páronként 1               |

Példa: 4 db 2 TB-os lemez RAID 5-ben → (4 − 1) · 2 = **6 TB** hasznos hely.

**A RAID nem biztonsági mentés!** Ha véletlenül törölsz egy fájlt, vagy zsarolóvírus titkosítja, a RAID ezt is hűségesen „tükrözi”.

## Biztonsági mentés: a 3-2-1 szabály

- **3** példány az adatból (az eredeti + 2 mentés),
- **2** különböző adathordozón (pl. laptop SSD + külső merevlemez),
- **1** másik helyen (pl. felhőben vagy otthon a szüleidnél).

Szakdolgozatnál és beadandóknál ez életmentő. Eszközök: Windows **Fájlelőzmények**, Ubuntu **Deja Dup** (Biztonsági mentések), `rsync`, felhőtárhely, **git** a kódhoz.

## Összefoglalás

- Az SSD sokkal gyorsabb véletlen elérésben; TRIM igen, töredezettségmentesítés nem.
- MBR: max. 2 TB és 4 elsődleges partíció; GPT: modern, nagy lemezekhez, UEFI-vel.
- Linuxon a fájlrendszereket csatoljuk (`mount`, `/etc/fstab`).
- RAID 0: gyors, nem véd; RAID 1: tükör; RAID 5: (n − 1) · C. A RAID nem mentés – 3-2-1!

## A lecke feladata

```quiz required
? Mekkora lemezt tud legfeljebb kezelni az MBR partíciós tábla (TB)?
= 2
! Nagyobb lemezhez GPT kell.

? Hány TB hasznos kapacitása van 3 db 4 TB-os lemeznek RAID 5-ben?
= 8
! (3 − 1) · 4 = 8 TB.

? Hány lemez meghibásodását bírja ki adatvesztés nélkül a RAID 0?
= 0
! A csíkozás nem ad redundanciát.

? Melyik parancs jelzi az SSD-nek, hogy mely blokkok szabadultak fel?
+ TRIM
- defrag
- mount
- fsck
! A töredezettségmentesítés SSD-n felesleges.

? Mit jelent az „1” a 3-2-1 mentési szabályban?
- 1 adathordozó
- 1 mentés naponta
+ legalább 1 példány egy másik helyen
- 1 jelszó
! Pl. felhő vagy egy másik épület – tűz, lopás ellen.
```
