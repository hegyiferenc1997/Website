---
title: Gyakorlás – fájlrendszerek
summary: Ellenőrző kérdések, parancssori feladatok linkekkel és lemezekkel, összefoglaló feladatlap.
minutes: 25
kind: practice
---

## Feladatok az Ubuntu VM-ben

1. `cd ~ && echo "eredeti" > a.txt`, majd készíts kemény és szimbolikus linket: `ln a.txt kemeny.txt`, `ln -s a.txt szimb.txt`.
2. `ls -li` – melyik kettőnek **ugyanaz** az inode-száma?
3. Töröld az `a.txt`-t. Mit ír ki `cat kemeny.txt` és `cat szimb.txt`? Miért?
4. Futtasd: `lsblk` és `df -h`. Melyik partíción van a gyökér (`/`), és milyen fájlrendszerrel (`df -T /`)?
5. A VirtualBoxban adj a géphez egy második, 1 GB-os virtuális lemezt (**Beállítások → Tároló**), és nézd meg, megjelenik-e `lsblk`-ben (`sdb`).

## Ellenőrző kérdések

<details>
<summary>1. Mi a válasz a 3. feladatra?</summary>

A `kemeny.txt` továbbra is kiírja: „eredeti”, mert ugyanannak az inode-nak egy másik neve – a fájl csak akkor törlődik, ha az utolsó neve is eltűnik. A `szimb.txt` hibát ad (No such file or directory), mert az `a.txt` útvonalra mutat, ami már nem létezik.

</details>

<details>
<summary>2. Miért gyorsabb egy naplózó fájlrendszer helyreállítása áramszünet után?</summary>

Mert csak a napló utolsó, be nem fejezett bejegyzéseit kell visszajátszani vagy eldobni, nem kell az egész lemez szerkezetét átvizsgálni (mint FAT-nál a chkdsk-nek).

</details>

<details>
<summary>3. Miért formázzák a pendrive-okat gyakran exFAT-ra?</summary>

Mert Windows, macOS és Linux is tudja írni-olvasni, és nincs benne a FAT32 4 GB-os fájlméret-korlátja.

</details>

<details>
<summary>4. Van RAID 1 tükrözésed. Kell-e még biztonsági mentés?</summary>

Igen. A RAID csak lemezhiba ellen véd; a véletlen törlés, a zsarolóvírus vagy a laptop ellopása ellen nem. Ezért kell a 3-2-1 szabály szerinti mentés.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik parancs mutatja a fájlok inode-számát?
+ ls -i
- ls -h
- df -h
- cat -n
! Az azonos inode-számú nevek ugyanarra a fájlra mutatnak.

? Melyik Linux mappában vannak az eszközfájlok (pl. sda)?
= /dev
! /dev/sda = az első lemez, /dev/sda1 az első partíciója.

? Hány TB hasznos tárhelyet ad 2 db 4 TB-os lemez RAID 1-ben?
= 4
! A tükrözés felezi a kapacitást.

? Melyik fájlrendszer az Ubuntu alapértelmezése?
+ ext4
- NTFS
- FAT32
- APFS
! Extentek és naplózás.

? Melyik partíciós táblát használja a Windows 11 UEFI-s telepítése?
= GPT
! GUID Partition Table.

? Melyik fájl sorolja fel Linuxon az induláskor automatikusan csatolandó fájlrendszereket?
= /etc/fstab
! File System TABle.
```
