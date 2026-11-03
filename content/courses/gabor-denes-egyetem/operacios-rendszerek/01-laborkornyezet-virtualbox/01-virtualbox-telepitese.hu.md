---
title: Virtuális gépek és a VirtualBox telepítése
summary: Mi az a virtuális gép, mit tudjon a számítógéped, és hogyan telepítsd a VirtualBox 7.2-t lépésről lépésre.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **virtuális gép**, a **gazda** (host) és a **vendég** (guest) rendszer,
- milyen **hardver** kell a laborhoz, és hogyan ellenőrzöd a **hardveres virtualizációt**,
- hogyan **telepíted a VirtualBoxot** Windowson (és röviden macOS-en, Linuxon).

> Ez a témakör a tárgy **laborkörnyezete**. A következő témakörök sok parancsát az itt telepített Ubuntu és Windows 11 gépen próbálhatod ki – a saját géped rendszeréhez közben hozzá sem kell nyúlnod.

## Miért virtuális gép?

A **virtuális gép** (VM, _virtual machine_) egy szoftverrel „összerakott” számítógép: van processzora, memóriája, lemeze és hálózati kártyája, csak mindezt egy program, a **hipervizor** biztosítja a valódi gép erőforrásaiból.

| Fogalom             | Jelentés                                                   | Nálunk                             |
| ------------------- | ---------------------------------------------------------- | ---------------------------------- |
| **gazda** (host)    | a valódi számítógép és a rajta futó operációs rendszer     | a laptopod Windows 11-gyel         |
| **vendég** (guest)  | a virtuális gépben futó operációs rendszer                 | Ubuntu, illetve Windows 11         |
| **hipervizor**      | a program, amely a virtuális gépeket futtatja              | Oracle VirtualBox 7.2              |
| **ISO-fájl**        | egy telepítőlemez képe egyetlen fájlban                    | `ubuntu-26.04.1-desktop-amd64.iso` |
| **virtuális lemez** | egy nagy fájl a gazdán, amelyet a vendég merevlemeznek lát | `Ubuntu-OS.vdi`                    |

Előnyök egy egyetemistának:

- **nem ronthatsz el semmit**: ha a vendég tönkremegy, törlöd vagy visszaállítod egy pillanatképből,
- **több rendszer egyszerre**: Windows mellett Linuxot is használhatsz, újraindítás nélkül,
- ugyanaz a környezet, mint a laborban – a házi feladatokat otthon is ugyanígy futtathatod.

A **VirtualBox** ingyenes, nyílt forráskódú (GPLv3), Windowson, macOS-en és Linuxon is fut, és nagyon sok leírás készült hozzá – ezért ezt választjuk.

## Mit tudjon a gazdagéped?

| Erőforrás     | Minimum (egy VM egyszerre)        | Ajánlott            |
| ------------- | --------------------------------- | ------------------- |
| processzor    | 64 bites, 4 mag, **VT-x / AMD-V** | 6–8 mag             |
| memória (RAM) | 8 GB                              | **16 GB** vagy több |
| szabad lemez  | 60 GB                             | **150 GB SSD-n**    |
| rendszer      | Windows 10/11, macOS, Linux       | Windows 11 64 bites |

Ökölszabály: a vendég **legfeljebb a RAM és a processzormagok felét** kapja meg, különben a gazda belassul.

### A hardveres virtualizáció ellenőrzése

A modern processzorokban van egy kiegészítés, amely gyorssá teszi a virtuális gépeket: Intelnél **VT-x** (_Intel Virtualization Technology_), AMD-nél **AMD-V** (_SVM Mode_). Windowson így nézd meg, be van-e kapcsolva:

1. Nyomd meg a **Ctrl + Shift + Esc** billentyűket (Feladatkezelő).
2. **Teljesítmény** fül → **CPU**.
3. Jobb lent: **Virtualizáció: Engedélyezve**.

Ha **Letiltva**, a gép **BIOS/UEFI beállításaiban** kell bekapcsolni: újraindításkor nyomd a gyártó billentyűjét (gyakran **F2**, **Del**, **F10** vagy **Esc**), keresd az _Intel Virtualization Technology_ vagy _SVM Mode_ opciót, állítsd **Enabled**-re, majd mentsd (**F10**).

### Hyper-V és a „teknős” ikon

Windowson a Microsoft saját hipervizora, a **Hyper-V** is lefoglalhatja a VT-x-et (például a **WSL 2**, a **Docker Desktop** vagy a **Memóriaintegritás** funkció használja). A VirtualBox ilyenkor is elindul, de lassabb lesz: a VM ablak alján egy **zöld teknős** ikon jelzi ezt. Ha zavaróan lassú, rendszergazdai PowerShellben kikapcsolhatod a Hyper-V indítását:

```powershell
# Rendszergazdaként futtasd, utána indítsd újra a gépet.
bcdedit /set hypervisorlaunchtype off
# Visszakapcsolás (pl. ha WSL 2-t vagy Dockert használsz):
bcdedit /set hypervisorlaunchtype auto
```

Kezdőként elég megjegyezni: **teknős = működik, csak lassabban**.

## A VirtualBox telepítése Windowsra

1. Nyisd meg a **virtualbox.org** oldalt → **Downloads** → **Windows hosts**. A letöltött fájl neve például `VirtualBox-7.2.x-…-Win.exe`.
2. Ha a telepítő a **Microsoft Visual C++ Redistributable** hiányára figyelmeztet, töltsd le a Microsoft oldaláról (x64 változat), telepítsd, majd indítsd újra a VirtualBox telepítőjét.
3. Indítsd el a telepítőt → **Next**. A komponenseknél hagyd az alapértelmezést.
4. Figyelmeztetés: **Network Interfaces** – telepítéskor pár másodpercre megszakad a hálózat. **Yes**.
5. Ha a **Python Core / win32api** hiányáról szóló üzenet jön, nyugodtan **Yes** – az csak programozói kiegészítőkhöz kell.
6. **Install**, majd a Windows kérdésére (eszközszoftver telepítése az Oracle-től) **Telepítés**.
7. **Finish** – elindul a **VirtualBox Manager**, a gépek kezelőfelülete.

Az **Extension Pack** külön letölthető kiegészítő (pl. távoli asztal, lemeztitkosítás); a tananyaghoz **nincs rá szükség**. Licence magán- és oktatási célra ingyenes, céges használatra fizetős.

### macOS és Linux gazdán

- **macOS**: a letöltési oldalon a _macOS / Intel hosts_ vagy _macOS / Apple Silicon hosts_ csomagot válaszd. Apple Silicon (M1–M4) gépen csak **ARM64** vendégek futnak: az Ubuntu **arm64** ISO-ját kell letölteni; a Windows 11 ARM ezen a platformon még korlátozottan működik.
- **Linux** (pl. Ubuntu gazda): az Oracle `.deb` csomagját telepítsd, majd add hozzá magad a `vboxusers` csoporthoz, és jelentkezz ki-be:

```bash
sudo apt install ./virtualbox-7.2_*.deb
sudo usermod -aG vboxusers $USER
```

## Az első indítás

A **VirtualBox Manager** bal oldalán lesznek a virtuális gépeid, fent a fontos gombok: **Új** (_New_), **Beállítások** (_Settings_), **Indítás** (_Start_). Érdemes a **Fájl → Beállítások → Általános** menüben megnézni az **Alapértelmezett gépmappát**: ide kerülnek a virtuális lemezek, ezért legyen egy nagy, gyors (SSD) meghajtón.

A **gazdabillentyű** (_Host key_) alapból a **jobb Ctrl**: ha a vendég „elkapta” az egeret és a billentyűzetet, a jobb Ctrl lenyomásával kapod vissza.

## Összefoglalás

- A virtuális gép a hipervizor által biztosított „szoftveres számítógép”; a gazda a valódi, a vendég a virtuális rendszer.
- Kell hozzá 64 bites processzor bekapcsolt **VT-x / AMD-V**-vel; ajánlott 16 GB RAM és SSD.
- A Hyper-V miatt megjelenő zöld teknős lassabb, de működő módot jelez.
- A VirtualBox 7.2 a virtualbox.org oldalról tölthető le; az Extension Pack a laborhoz nem kell.

## A lecke feladata

```quiz required
? Hogy hívjuk a virtuális gépben futó operációs rendszert?
- gazda (host)
+ vendég (guest)
- hipervizor
- kernel
! A valódi gép a gazda, a virtuális gépben futó rendszer a vendég.

? Mi az Intel processzorok hardveres virtualizációs kiegészítésének neve? (rövidítés)
= VT-x
= vtx
! Intel Virtualization Technology – AMD-nél AMD-V.

? Egy 16 GB RAM-os laptopon legfeljebb hány GB memóriát adj egy virtuális gépnek az ökölszabály szerint?
= 8
! A RAM legfeljebb felét kapja a vendég.

? Mit jelent a VM ablak alján megjelenő zöld teknős ikon?
- A virtuális gép megfertőződött.
- Elfogyott a lemezhely.
+ A VirtualBox a Hyper-V-n keresztül, lassabb módban fut.
- Nincs internetkapcsolat.
! A Hyper-V lefoglalta a VT-x-et; működik, csak lassabban.

? Melyik billentyűvel kapod vissza alapból az egeret a vendégtől?
+ jobb Ctrl
- bal Alt
- Windows-billentyű
- Esc
! Ez az alapértelmezett gazdabillentyű (Host key).
```
