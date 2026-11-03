---
title: Vendégkiegészítők, megosztás és pillanatképek
summary: Teljes képernyő, közös vágólap és mappa, pillanatképek, hálózati módok és a gyakori hibák megoldása.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit adnak a **vendégkiegészítők** (_Guest Additions_), és hogyan telepíted őket Ubuntun és Windowson,
- hogyan használd a **közös vágólapot** és a **megosztott mappát**,
- mire jó a **pillanatkép** (_snapshot_), melyik **hálózati mód** mire való, és hogyan oldod meg a gyakori hibákat.

## Mik a vendégkiegészítők?

A vendégkiegészítők a vendég rendszerbe telepített **illesztőprogramok és szolgáltatások**, amelyek a vendéget „tudatossá” teszik arra, hogy virtuális gépben fut. Utánuk:

- a kép **automatikusan átméreteződik** az ablakkal, működik a teljes képernyő,
- az egér szabadon jár ki-be (nem kell a jobb Ctrl),
- működik a **közös vágólap**, a **fogd-és-vidd** és a **megosztott mappák**,
- a vendég órája szinkronban marad a gazdáéval.

## Telepítés Ubuntun

1. A vendégben nyiss terminált, és telepítsd a fordításhoz szükséges csomagokat (a kiegészítők egy kernelmodult fordítanak):

```bash
sudo apt update
sudo apt install -y build-essential gcc make perl bzip2
```

2. A VM ablak menüjében: **Eszközök → Vendégkiegészítők CD-képének behelyezése…** (_Devices → Insert Guest Additions CD image_).
3. A lemez megjelenik a fájlkezelőben. Futtasd a telepítőt terminálból:

```bash
# A csillag a pontos verziószámot helyettesíti (pl. VBox_GAs_7.2.10).
cd /media/$USER/VBox_GAs_*
sudo ./VBoxLinuxAdditions.run
# A megosztott mappákhoz a vboxsf csoport tagja kell legyél.
sudo usermod -aG vboxsf $USER
sudo reboot
```

## Telepítés Windows 11-en

1. **Eszközök → Vendégkiegészítők CD-képének behelyezése…**
2. Nyisd meg a **Fájlkezelőt** → **Ez a gép** → **CD-meghajtó (VirtualBox Guest Additions)**.
3. Indítsd el a **VBoxWindowsAdditions.exe** fájlt → **Next** → **Next** → **Install**.
4. Az Oracle illesztőprogramjának telepítését engedélyezd (**Telepítés**).
5. **Reboot now** → **Finish**.

## Vágólap, fogd-és-vidd, megosztott mappa

- **Közös vágólap**: **Eszközök → Közös vágólap → Kétirányú**. Ezután a gazdán másolt szöveget a vendégben is beillesztheted.
- **Fogd-és-vidd**: **Eszközök → Fogd és vidd → Kétirányú** – fájlokat húzhatsz az ablakba.
- **Megosztott mappa**: **Eszközök → Megosztott mappák → Beállítások** → **+** ikon:
  - **Mappa elérési útja**: egy mappa a gazdán, pl. `C:\Users\anna\OS-labor`,
  - **Mappa neve**: `OS-labor`,
  - pipáld be: **Automatikus csatolás** és **Állandóvá tétel**.

A vendégben a mappa itt jelenik meg:

| Vendég     | Hol látod?                                             |
| ---------- | ------------------------------------------------------ |
| Ubuntu     | `/media/sf_OS-labor`                                   |
| Windows 11 | hálózati meghajtóként, pl. `Z:` (`\\VBOXSVR\OS-labor`) |

## Pillanatképek

A **pillanatkép** a virtuális gép teljes állapotának (lemez, beállítások, akár a memória) elmentése egy adott pillanatban. Ha később elrontasz valamit, egy kattintással **visszaállsz**.

1. A VirtualBox Managerben a gép neve melletti menü → **Pillanatképek**.
2. **Készítés** (_Take_) → név: `Tiszta telepítés`, leírás: dátum, mi van telepítve.
3. Visszaállítás: jelöld ki a pillanatképet → **Visszaállítás** (_Restore_).

Jó szokás: **minden nagyobb kísérlet előtt** készíts pillanatképet (pl. mielőtt a kernelmodulos vagy jogosultságos feladatokat próbálod). A pillanatkép nem biztonsági mentés: ha a virtuális lemezfájl elveszik, vele vesznek a pillanatképek is.

## Hálózati módok

| Mód                          | Mit tud?                                                           | Mikor jó?                      |
| ---------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| **NAT** (alapértelmezett)    | a vendég eléri az internetet, kívülről nem látható                 | szinte mindig                  |
| **Híd** (_Bridged_)          | a vendég saját IP-címet kap a helyi hálózaton, mint egy valódi gép | szerver kipróbálása más gépről |
| **Csak gazda** (_Host-only_) | csak a gazda és a vendégek látják egymást, internet nincs          | elszigetelt tesztek            |
| **Belső hálózat**            | csak a vendégek egymás között                                      | hálózati laborgyakorlatok      |

## A gép leállítása

- **Szabályosan**: a vendégben _Leállítás_ (Ubuntu: jobb felső menü; Windows: Start → Főkapcsoló). Ez a legbiztonságosabb.
- **Állapot mentése**: ablak bezárása → _Gép állapotának mentése_ – mint a hibernálás, a következő indításnál ott folytatod.
- **Kikapcsolás**: olyan, mintha kihúznád a tápkábelt; csak ha a vendég lefagyott.

## Gyakori hibák és megoldásuk

| Hiba                                          | Megoldás                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| _VT-x is not available_ / _AMD-V is disabled_ | BIOS/UEFI-ben kapcsold be a virtualizációt (1. lecke)                       |
| nagyon lassú, zöld teknős                     | Hyper-V: `bcdedit /set hypervisorlaunchtype off`, újraindítás               |
| fekete képernyő Windows vendégnél             | Kijelző: vezérlő **VBoxSVGA**, 3D gyorsítás ki, 128 MB videomemória         |
| UEFI Shell indításkor                         | nincs ISO csatolva, vagy lemaradt a _Press any key_ → **Gép → Újraindítás** |
| „Nem futtatható a Windows 11”                 | TPM 2.0, EFI, Secure Boot, 4 GB RAM (3. lecke)                              |
| a megosztott mappa nem nyílik meg Ubuntun     | `sudo usermod -aG vboxsf $USER`, majd újraindítás                           |
| elfogyott a hely a gazdán                     | töröld a régi pillanatképeket, vagy tedd a gépmappát nagyobb meghajtóra     |

## Összefoglalás

- A vendégkiegészítők adják az automatikus átméretezést, a közös vágólapot és a megosztott mappákat.
- Ubuntun a `VBoxLinuxAdditions.run`, Windowson a `VBoxWindowsAdditions.exe` telepíti őket.
- A pillanatkép gyors visszaállítási pont, nem teljes értékű biztonsági mentés.
- A NAT a legtöbb feladathoz elég; a híd mód a vendéget a helyi hálózat teljes jogú tagjává teszi.

## A lecke feladata

```quiz required
? Melyik fájl telepíti a vendégkiegészítőket Ubuntu vendégen?
= VBoxLinuxAdditions.run
= ./VBoxLinuxAdditions.run
! A behelyezett CD-ről, sudo-val kell futtatni.

? Melyik csoport tagjának kell lenned Ubuntun, hogy elérd a megosztott mappákat?
= vboxsf
! sudo usermod -aG vboxsf $USER

? Hol jelenik meg Ubuntun az „OS-labor” nevű, automatikusan csatolt megosztott mappa?
- /home/OS-labor
+ /media/sf_OS-labor
- /mnt/c/OS-labor
- /etc/OS-labor
! Az automatikusan csatolt mappák az sf_ előtagot kapják.

? Melyik hálózati módban kap a vendég saját IP-címet a helyi hálózaton?
- NAT
+ Híd (Bridged)
- Csak gazda (Host-only)
- Belső hálózat
! Híd módban a vendég úgy látszik, mint egy újabb valódi gép.

? Melyik állítás igaz a pillanatképre?
- Teljes értékű biztonsági mentés, külön meghajtóra kerül.
+ Egy visszaállítási pont; ha a virtuális lemezfájl elvész, vele vész.
- Csak a memória tartalmát menti.
- Csak Windows vendégnél működik.
! Fontos fájlokat ezért a megosztott mappán keresztül a gazdán is tarts.
```
