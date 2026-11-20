---
title: Gyakorlás – a tárgy záró összefoglalója
summary: Linux–Windows parancsszótár, egy összehasonlító feladat a két virtuális gépeden, ellenőrző kérdések és a tárgy egészét átfogó záró feladatlap.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Boot ideje párhuzamos indításnál.** A `szolgaltatasok` szótár minden névhez egy `(indítási_idő, függőségek_listája)` párt ad. Írd meg a `boot_ido(szolgaltatasok)` függvényt: egy szolgáltatás akkor indulhat, amikor minden függősége elkészült; add vissza, mikor készül el az utolsó (a kritikus út hossza)!

```python starter
def boot_ido(szolgaltatasok):
    return sum(ido for ido, _ in szolgaltatasok.values())
```

<details>
<summary>Megoldás</summary>

```python solution
def boot_ido(szolgaltatasok):
    kesz = {}
    def vege(nev):
        if nev not in kesz:
            ido, fuggosegek = szolgaltatasok[nev]
            kezdes = max((vege(f) for f in fuggosegek), default=0)
            kesz[nev] = kezdes + ido
        return kesz[nev]
    return max(vege(n) for n in szolgaltatasok)
```

</details>

```python test
s = {"A": (2, []), "B": (3, ["A"]), "C": (4, ["A"])}
assert boot_ido(s) == 6
s2 = {"lemez": (1, []), "halo": (2, ["lemez"]), "db": (3, ["lemez"]), "web": (1, ["halo", "db"])}
assert boot_ido(s2) == 5
assert boot_ido({"egy": (7, [])}) == 7
print("Minden ellenőrzés sikeres!")
```

**2.** **Érvényes Windows-fájlnév?** Írd meg a `windowson_jo(nev)` függvényt: hamis, ha a név tartalmazza a `<>:"/\|?*` jelek valamelyikét, ha a pont előtti része (kis- és nagybetűtől függetlenül) foglalt eszköznév (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`), vagy ha szóközre vagy pontra végződik; különben igaz.

```python starter
def windowson_jo(nev):
    return True
```

<details>
<summary>Megoldás</summary>

```python solution
TILTOTT = set('<>:"/\\|?*')
FOGLALT = {"CON", "PRN", "AUX", "NUL"} | {f"COM{i}" for i in range(1, 10)} \
        | {f"LPT{i}" for i in range(1, 10)}

def windowson_jo(nev):
    if TILTOTT & set(nev):
        return False
    if nev.split(".")[0].upper() in FOGLALT:
        return False
    return not nev.endswith((" ", "."))
```

</details>

```python test
assert windowson_jo("jegyzet.md") is True
assert windowson_jo("vazlat:1.md") is False
assert windowson_jo("con.txt") is False
assert windowson_jo("Com3") is False
assert windowson_jo("console.txt") is True
assert windowson_jo("adat.csv ") is False
print("Minden ellenőrzés sikeres!")
```

**3.** **CRLF-ből LF.** Írd meg az `lf_re(adat)` függvényt: a bájtsorozatban minden `\r\n`-t cserélj `\n`-re, és add vissza az `(új bájtok, cserék száma)` párt – ezt csinálja a `dos2unix`.

```python starter
def lf_re(adat):
    return (adat, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def lf_re(adat):
    db = adat.count(b"\r\n")
    return (adat.replace(b"\r\n", b"\n"), db)
```

</details>

```python test
assert lf_re(b"echo szia\r\necho vege\r\n") == (b"echo szia\necho vege\n", 2)
assert lf_re(b"mar jo\n") == (b"mar jo\n", 0)
assert lf_re(b"") == (b"", 0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik az első felhasználói folyamat (PID 1) egy mai Ubuntun?
+ systemd
- init.exe
- launchd
- bash
! macOS-en launchd, Windowson a System folyamat a 4-es PID.

? Hol tárolja a Windows a rendszer- és programbeállítások nagy részét?
+ a beállításjegyzékben (registry)
- a /etc könyvtárban
- .plist fájlokban
! Linuxon szöveges fájlok a /etc-ben, macOS-en .plist fájlok.

? Melyik fájlrendszer az alapértelmezett a mai macOS-en?
- NTFS
- ext4
+ APFS
! Windows: NTFS, Linux: ext4.

? Mi a WSL?
+ a Windows alrendszere Linuxhoz: Linux-programok futtatása Windowson (a WSL 2 valódi Linux-kernellel)
- egy Windows-vírusirtó
- egy Linux-disztribúció
! Mérnökinformatikusként Windowson is kényelmes Linux-környezetet ad.

? Melyik csomagkezelővel telepíthetsz programot parancssorból Windowson?
+ winget
- apt
- Homebrew
! Ubuntu: apt, macOS: Homebrew (külön telepítendő).
```
