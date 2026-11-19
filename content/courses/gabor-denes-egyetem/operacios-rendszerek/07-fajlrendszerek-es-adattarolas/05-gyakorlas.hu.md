---
title: Gyakorlás – fájlrendszerek
summary: Ellenőrző kérdések, parancssori feladatok linkekkel és lemezekkel, összefoglaló feladatlap.
minutes: 50
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Blokkok és elpazarolt hely.** Egy fájl mindig egész számú blokkot foglal. Írd meg a `foglalas(meret, blokk=4096)` függvényt, amely egy párt ad vissza: hány blokkot foglal a fájl, és hány bájt marad kihasználatlanul az utolsó blokkban!

```python starter
def foglalas(meret, blokk=4096):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def foglalas(meret, blokk=4096):
    db = -(-meret // blokk)           # felfelé kerekített osztás
    return (db, db * blokk - meret)
```

</details>

```python test
assert foglalas(10000) == (3, 2288)
assert foglalas(4096) == (1, 0)
assert foglalas(1) == (1, 4095)
assert foglalas(0) == (0, 0)
print("Minden ellenőrzés sikeres!")
```

**2.** **Az inode legnagyobb fájlja.** Egy inode-ban 12 közvetlen mutató, egy egyszeres, egy kétszeres és egy háromszoros közvetett mutató van. Egy mutató 4 bájt. Írd meg a `max_fajl(blokk)` függvényt, amely bájtban megadja a legnagyobb ábrázolható fájlméretet!

```python starter
def max_fajl(blokk):
    return 12 * blokk
```

<details>
<summary>Megoldás</summary>

```python solution
def max_fajl(blokk):
    n = blokk // 4                    # ennyi mutató fér egy blokkba
    blokkok = 12 + n + n**2 + n**3    # közvetlen + egyszeres + kétszeres + háromszoros
    return blokkok * blokk
```

</details>

```python test
assert max_fajl(1024) == (12 + 256 + 256**2 + 256**3) * 1024
assert max_fajl(4096) == (12 + 1024 + 1024**2 + 1024**3) * 4096
print(f"4 KB-os blokkokkal: {max_fajl(4096) / 2**40:.2f} TiB")
print("Minden ellenőrzés sikeres!")
```

**3.** **FAT-lánc követése.** A FAT táblában minden blokkhoz a fájl **következő** blokkjának száma tartozik, az utolsónál `-1`. Írd meg a `lanc(fat, kezdo)` függvényt, amely visszaadja a fájl blokkjainak listáját sorrendben!

```python starter
def lanc(fat, kezdo):
    return [kezdo]
```

<details>
<summary>Megoldás</summary>

```python solution
def lanc(fat, kezdo):
    blokkok = []
    b = kezdo
    while b != -1:
        blokkok.append(b)
        b = fat[b]                    # a következő blokk száma
    return blokkok
```

</details>

```python test
fat = {2: 9, 9: 4, 4: -1, 5: 6, 6: -1}
assert lanc(fat, 2) == [2, 9, 4]
assert lanc(fat, 5) == [5, 6]
assert lanc({7: -1}, 7) == [7]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit tárol az inode?
+ a fájl adatait (méret, jogok, tulajdonos, időbélyegek) és az adatblokkok helyét – a nevét nem
- a fájl nevét és tartalmát
- csak a fájl nevét
! A nevet a könyvtárbejegyzés tárolja, ezért lehet egy fájlnak több neve (hard link).

? Mi történik egy szimbolikus linkkel, ha töröljük az eredeti fájlt?
+ „lóg”: egy nem létező útvonalra mutat
- automatikusan törlődik
- tovább működik, mert az adatokra mutat
! A hard link viszont tovább működik.

? Mire való a naplózás (journaling) egy fájlrendszerben?
+ összeomlás után gyorsan helyreállítható, konzisztens állapotba hozható a fájlrendszer
- a felhasználók tevékenységének naplózására
- a fájlok tömörítésére
! Előbb a naplóba írja a szándékot, csak utána a helyére.

? Melyik fájlrendszert ajánlod egy pendrive-ra, amelyet Windowson, macOS-en és Linuxon is használni akarsz, és 4 GB-nál nagyobb fájlokat is tárolnál rajta?
- FAT32
+ exFAT
- ext4
! A FAT32 legfeljebb 4 GB-os fájlt tud, az ext4-et a Windows alapból nem olvassa.

? Mit mutat a df -h parancs?
+ a csatolt fájlrendszerek méretét, a foglalt és a szabad helyet
- a könyvtárak méretét
- a futó folyamatokat
! A könyvtárak méretét a du -sh mutatja.
```
