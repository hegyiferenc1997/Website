---
title: Gyakorlás – a tárgy záró összefoglalója
summary: Linux–Windows parancsszótár, egy összehasonlító feladat a két virtuális gépeden, ellenőrző kérdések és a tárgy egészét átfogó záró feladatlap.
minutes: 30
kind: practice
---

## Parancsszótár: ugyanaz a feladat két rendszeren

| Feladat             | Linux (bash)           | Windows (PowerShell)               |
| ------------------- | ---------------------- | ---------------------------------- |
| fájlok listázása    | `ls -l`                | `Get-ChildItem` (`dir`)            |
| könyvtárváltás      | `cd /tmp`              | `cd C:\Temp`                       |
| fájl tartalma       | `cat a.txt`            | `Get-Content a.txt` (`type`)       |
| másolás / törlés    | `cp`, `rm`             | `Copy-Item`, `Remove-Item`         |
| folyamatok          | `ps aux`, `top`        | `Get-Process`, Feladatkezelő       |
| folyamat leállítása | `kill 1234`            | `Stop-Process -Id 1234`            |
| hálózati címek      | `ip a`                 | `ipconfig`                         |
| szolgáltatások      | `systemctl status ssh` | `Get-Service`                      |
| szoftvertelepítés   | `sudo apt install git` | `winget install Git.Git`           |
| rendszergazdai jog  | `sudo …`               | „Futtatás rendszergazdaként” (UAC) |

Egy kis Python-program, amely ugyanezt a szótárt kérdezi ki tőled – futtasd, és bővítsd ki a saját soraiddal:

```python run
# Linux → Windows parancsszótár: kikeresi egy Linux-parancs PowerShell-megfelelőjét.
szotar = {
    "ls": "Get-ChildItem",
    "cat": "Get-Content",
    "ps": "Get-Process",
    "kill": "Stop-Process",
    "ip a": "ipconfig",
}

for linux, windows in szotar.items():
    print(f"{linux:6} → {windows}")

keresett = "ps"
print(f"\nA(z) '{keresett}' Windows-megfelelője: {szotar.get(keresett, 'nincs a szótárban')}")
```

## Összehasonlító feladat a két virtuális gépeden

Indítsd el egymás után az Ubuntu és a Windows 11 VM-et, és töltsd ki a táblázatot:

1. Mi az 1. folyamat neve és PID-je? (Ubuntu: `ps -p 1`; Windows: Feladatkezelő → Részletek, rendezés PID szerint.)
2. Mennyi a teljes és a szabad memória, és mekkora a swap / a lapozófájl? (`free -h`; Feladatkezelő → Teljesítmény → Memória.)
3. Melyik fájlrendszer van a rendszerlemezen? (`df -T /`; Fájlkezelő → C: → Tulajdonságok.)
4. Hány folyamat fut? (`ps -e | wc -l`; `(Get-Process).Count`.)

<details>
<summary>Mire számíts?</summary>

1. Ubuntu: `systemd`, PID 1. Windows: a **System** folyamat 4-es PID-del (előtte csak a 0-s „System Idle Process” áll).
2. A Windows jellemzően több memóriát használ üresjáratban; a lapozófájl mérete automatikusan változik.
3. Ubuntu: `ext4`; Windows: `NTFS`.
4. Egy friss Ubuntu asztalon jellemzően 200–300, Windows 11-en 100–200 folyamat fut – a Linux sok kernelszálat is folyamatként listáz.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért mondhatjuk, hogy a tárgyban tanult fogalmak mindhárom rendszerben ugyanazok?</summary>

Mert ugyanazokat a feladatokat oldják meg: folyamatokat és szálakat ütemeznek, virtuális memóriát kezelnek lapozással, fájlrendszert és jogosultságokat biztosítanak, rendszerhívásokon át szolgálják ki a programokat. Csak a megvalósítás és az elnevezések különböznek.

</details>

<details>
<summary>2. Mi a különbség a Linux túlfoglalása és a Windows véglegesítési korlátja között a programozó szemszögéből?</summary>

Linuxon a memóriafoglalás szinte mindig sikerül, és a baj később, használatkor jön (az OOM killer leállíthatja a programot). Windowson a foglalás azonnal hibát ad, ha túllépné a korlátot, így a program maga kezelheti a helyzetet.

</details>

<details>
<summary>3. Miért nem tanulunk VirtualBoxban macOS-t?</summary>

Mert a macOS licence csak Apple hardveren engedi a futtatást, és a VirtualBox nem is támogatja hivatalosan macOS vendégként.

</details>

## Záró feladatlap

```quiz required
? Egy rendszerben 4096 bájtos (4 KiB) lapok vannak. Hányas sorszámú lapra esik a 20000-es virtuális cím (a lapokat 0-tól számozzuk)?
= 4
! 20000 / 4096 = 4,88 → a 4. lap, eltolás: 20000 − 16384 = 3616.

? Melyik PowerShell-parancs felel meg a Linux ps parancsának?
+ Get-Process
- Get-Content
- Get-ChildItem
- Stop-Process
! A Stop-Process a kill megfelelője.

? Melyik fájlrendszer alapértelmezett a macOS-en?
- NTFS
- ext4
+ APFS
- FAT32
! Apple File System, 2017 óta.

? Melyik rendszeren tárolódnak a beállítások egy hierarchikus adatbázisban (registry)?
- Linux
+ Windows
- macOS
- mindhárom
! Linuxon szöveges fájlok (/etc), macOS-en .plist fájlok.

? Melyik operációs rendszer fut a legtöbb felhőszerveren és szuperszámítógépen?
+ Linux
- Windows
- macOS
- FreeRTOS
! Ingyenes, nyílt, jól automatizálható.
```
