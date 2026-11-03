---
title: A Windows belülről
summary: A tanult fogalmak a Windowsban – NT-architektúra és HAL, rendszerindítás, 32 prioritási szint, lapozófájl és véglegesítési korlát, NTFS és ACL, beállításjegyzék, UAC, winget és WSL.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel a **Windows NT** architektúrája,
- hogyan ütemez, kezel memóriát, tárol fájlokat és véd a Windows,
- mi a **beállításjegyzék** (_registry_), az **UAC**, a **winget** és a **WSL**.

## Az NT-architektúra

A Windows **hibrid kernelű** rendszer (13. témakör). Rétegei alulról felfelé:

- **HAL** (_Hardware Abstraction Layer_, `hal.dll`): elrejti a hardverek közötti különbségeket (megszakításvezérlő, időzítők);
- **kernel** és **végrehajtó réteg** (_Executive_, mindkettő az `ntoskrnl.exe`-ben): ütemezés, objektumkezelő, memóriakezelő, I/O-kezelő, folyamatkezelő, biztonsági ellenőrző (_Security Reference Monitor_);
- **illesztőprogramok** (`.sys`) és a grafikus rész (`win32k.sys`) – szintén kernel módban;
- felhasználói módban az `ntdll.dll` (a rendszerhívások kapuja, 9. témakör), a **Win32 API** (`kernel32.dll`, `user32.dll`), a rendszerfolyamatok és a szolgáltatások.

## Rendszerindítás

UEFI → **Windows Boot Manager** (`bootmgfw.efi`) → `winload.efi` → **kernel** (`ntoskrnl.exe`) → `smss.exe` (munkamenet-kezelő) → `csrss.exe`, `wininit.exe` → `services.exe` (szolgáltatások), `lsass.exe` (bejelentkezés, jelszavak) → `winlogon.exe` → a bejelentkezés után az `explorer.exe` (asztal, tálca). A kernel saját szálai a **System** folyamatban futnak, amelynek PID-je mindig **4**.

## Folyamatok, szálak és ütemezés

A Windows a folyamatot egyetlen hívással hozza létre (`CreateProcess`, nincs `fork`), az **ütemezés egysége a szál**. Az ütemező **prioritásos, preemptív**, és **32 prioritási szintet** használ:

- **16–31**: valós idejű szintek,
- **1–15**: változó szintek – a rendszer ideiglenesen megemeli (_boost_) például az előtérben lévő ablak szálait vagy az I/O-ra várt szálakat,
- **0**: a memórialapokat nullázó rendszerszál.

Egy szinten belül körbeforgó (_round robin_) az ütemezés. A Feladatkezelő **Részletek** fülén jobb klikk → **Prioritás beállítása**.

## Memória

Igény szerinti lapozás 4 KiB-os lapokkal. A lapozófájl a `C:\pagefile.sys`. A Linuxszal ellentétben a Windows **nem foglal túl**: a **véglegesítési korlát** (_commit limit_) = RAM + lapozófájl, és ennél több memóriát nem ígér a programoknak – ha elfogy, a foglalás hibával tér vissza. A Windows 10 óta a ritkán használt lapokat **tömöríti** is a memóriában, mielőtt kiírná a lemezre.

## Fájlrendszer

**NTFS**: naplózó fájlrendszer, **meghajtóbetűjelekkel** (`C:\`, `D:\`), fordított perjellel és kis- és nagybetűt nem megkülönböztető fájlnevekkel. A jogosultságokat **hozzáférés-vezérlési listák** (**ACL**) írják le: minden fájlhoz bejegyzések tartoznak arról, melyik felhasználó vagy csoport mit tehet (olvasás, írás, módosítás, teljes hozzáférés) – finomabban, mint a Unix `rwx` jogai.

## Beállításjegyzék

A Windows és a programok beállításai egy hierarchikus adatbázisban, a **beállításjegyzékben** (_registry_) vannak, a Linux `/etc` szöveges fájljai helyett. Fő ágai: **HKEY_LOCAL_MACHINE** (az egész gépre vonatkozó) és **HKEY_CURRENT_USER** (a bejelentkezett felhasználóé). Szerkesztője a `regedit` – óvatosan, egy rossz módosítás indíthatatlanná teheti a rendszert.

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' | Select-Object ProductName, DisplayVersion
```

## Biztonság

- **UAC** (Felhasználói fiókok felügyelete): a rendszergazda is korlátozott jogokkal dolgozik, és rendszerszintű műveletnél a rendszer megerősítést kér – ez felel meg a Linux `sudo`-jának.
- **Microsoft Defender** víruskereső és tűzfal, **BitLocker** lemeztitkosítás.
- **TPM 2.0** és **biztonságos rendszerindítás** – ezért kellett őket bekapcsolni a Windows 11 VM-hez (1. témakör). A **VBS** (virtualizációalapú biztonság) a 16. témakör hipervizorát használja a kernel védelmére.

## Szoftvertelepítés és WSL

Telepítés a **Microsoft Store**-ból, telepítőfájlból (`.exe`, `.msi`), vagy parancssorból a **winget** csomagkezelővel:

```powershell
winget search vscode
winget install Microsoft.VisualStudioCode
winget upgrade --all
```

A **WSL 2** (_Windows Subsystem for Linux_) egy valódi Linux kernelt futtat egy könnyű Hyper-V virtuális gépben: `wsl --install` után Ubuntu terminál fut a Windows mellett.

## Összefoglalás

- NT: HAL → kernel + Executive (`ntoskrnl.exe`) → illesztők; felhasználói módban `ntdll.dll`, Win32 API.
- Indítás: Boot Manager → winload → kernel → smss → services, lsass, winlogon → explorer; a System folyamat PID-je 4.
- `CreateProcess`, a szál az ütemezés egysége, 32 prioritási szint (16–31 valós idejű, boost).
- `pagefile.sys`, nincs túlfoglalás (commit limit), memóriatömörítés; NTFS + ACL; registry; UAC, Defender, BitLocker, TPM; winget, WSL 2.

## A lecke feladata

```quiz required
? Hány prioritási szintet használ a Windows ütemezője?
= 32
! 0–31: a 16–31 valós idejű, az 1–15 változó.

? Mi a Windows System folyamatának PID-je?
= 4
! Ebben futnak a kernel saját szálai.

? Hogyan számolja a Windows a véglegesítési korlátot (commit limit)?
+ a fizikai RAM és a lapozófájl méretének összegeként
- a RAM kétszereseként
- csak a lapozófájl méreteként
- korlátlan, mint Linuxon a túlfoglalás
! Ennél több memóriát nem ígér a programoknak.

? Mi felel meg Windowson a Linux sudo parancsának?
+ UAC (Felhasználói fiókok felügyelete)
- BitLocker
- winget
- regedit
! Rendszerszintű műveletnél megerősítést kér.
```
