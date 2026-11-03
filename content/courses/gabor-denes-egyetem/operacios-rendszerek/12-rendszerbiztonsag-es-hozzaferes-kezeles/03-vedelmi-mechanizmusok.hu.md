---
title: Védelmi mechanizmusok
summary: Frissítések, tűzfal, víruskereső, lemeztitkosítás (BitLocker, LUKS), ASLR és DEP, Secure Boot és TPM – és hogyan kapcsolod be őket.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- miért a **frissítés** a legfontosabb védelem, és mit csinál a **tűzfal** és a **víruskereső**,
- hogyan véd a **lemeztitkosítás** (BitLocker, LUKS, FileVault),
- milyen beépített védelmeket ad a kernel és a hardver (**ASLR**, **DEP/NX**, **Secure Boot**, **TPM**, sandbox).

## Frissítések

A támadások nagy része **ismert, már javított** hibát használ ki. Ha a javítás megjelent, de nem telepítetted, nyitva hagyod az ajtót. Ezért:

```bash
sudo apt update && sudo apt upgrade     # Ubuntu
sudo systemctl status unattended-upgrades   # automatikus biztonsági frissítések
```

Windowson: **Gépház → Windows Update**. Az LTS kiadások (Ubuntu 26.04 LTS) és a támogatott Windows-verziók **évekig** kapnak javításokat – egy elavult rendszer (pl. a Windows 10 2025 októbere óta) már nem.

## Tűzfal

A **tűzfal** szabályok alapján **engedi vagy tiltja** a hálózati forgalmat (pl. „bejövő kapcsolat csak a 22-es portra”). Az alapelv: ami nincs kifejezetten engedélyezve, az tiltva.

```bash
sudo ufw status                 # Ubuntu „Uncomplicated Firewall”
sudo ufw enable
sudo ufw allow 22/tcp           # SSH engedélyezése
```

Windowson: **Windows Defender tűzfal** (bekapcsolva alapból), PowerShellben `Get-NetFirewallProfile`.

## Víruskereső

A **víruskereső** ismert kártevő-**minták** (szignatúrák) és gyanús **viselkedés** alapján keres. Windowson a beépített **Microsoft Defender** a legtöbb felhasználónak elég. Linux asztalon ritkábban használnak víruskeresőt (kisebb célpont, jogosultsági modell, csomagkezelőből érkező szoftver), szervereken a ClamAV elterjedt.

## Lemeztitkosítás

Ha ellopják a laptopodat, a jelszavas bejelentkezés nem véd: a lemezt kiszerelve **bárki elolvashatja**. A **teljes lemeztitkosítás** ezt megakadályozza.

| Rendszer | Eszköz        | Megjegyzés                                                     |
| -------- | ------------- | -------------------------------------------------------------- |
| Windows  | **BitLocker** (Pro, Education) / eszköztitkosítás (Home) | a kulcsot a **TPM** őrzi; a helyreállítási kulcsot mentsd el! |
| Linux    | **LUKS**      | az Ubuntu telepítője felkínálja („Speciális funkciók → titkosítás”) |
| macOS    | **FileVault** | bekapcsolás: Rendszerbeállítások → Adatvédelem és biztonság    |

## Beépített védelmek a kernelben és a hardverben

- **ASLR** (_Address Space Layout Randomization_): a program verme, kupaca és könyvtárai minden indításkor **más címre** kerülnek – a támadó nem tudja előre, hová ugorjon.
- **DEP / NX-bit** (_Data Execution Prevention_): az adatterületek (verem, kupac) **nem futtathatók**. Egy puffertúlcsordulással beírt kártékony kód így nem indul el.
- **Secure Boot**: csak **aláírt** rendszerbetöltő és kernel indulhat (a Windows 11 VM-nél bekapcsoltuk).
- **TPM**: kriptográfiai kulcsokat őriz, és méri az indítási folyamatot – ha valaki megváltoztatja a rendszerbetöltőt, a BitLocker kulcs nem szabadul fel.
- **Homokozó** (_sandbox_): a program elszigetelt környezetben fut, korlátozott jogokkal (böngészőfülek, mobilalkalmazások, Windows Sandbox, Linuxon AppArmor/SELinux profilok, Flatpak, Snap).

```bash
cat /proc/sys/kernel/randomize_va_space   # 2 = teljes ASLR bekapcsolva
sudo aa-status | head                     # AppArmor profilok Ubuntun
```

## Összefoglalás

- A frissítés a legfontosabb védelem; a tűzfal a hálózati forgalmat, a víruskereső a kártevőket szűri.
- Teljes lemeztitkosítás: BitLocker (TPM-mel), LUKS, FileVault – lopás ellen véd.
- Kernel- és hardvervédelmek: ASLR (véletlen címek), DEP/NX (adat nem futtatható), Secure Boot, TPM, homokozó.

## A lecke feladata

```quiz required
? Melyik védelem teszi a verem és a kupac területét nem futtathatóvá?
- ASLR
+ DEP / NX-bit
- Secure Boot
- tűzfal
! Így a puffertúlcsordulással beírt kód nem indul el.

? Mit csinál az ASLR?
+ Minden indításkor más memóriacímre teszi a program részeit.
- Titkosítja a lemezt.
- Blokkolja a bejövő hálózati forgalmat.
- Aláírja a rendszerbetöltőt.
! A támadó nem tudja előre a címeket.

? Mi a Linux teljes lemeztitkosításának neve (rövidítés)?
= LUKS
! Linux Unified Key Setup.

? Melyik paranccsal kapcsolod be az Ubuntu egyszerű tűzfalát?
= sudo ufw enable
! ufw = Uncomplicated Firewall.

? Mit véd a teljes lemeztitkosítás?
- a futó rendszert a vírusoktól
+ az adatokat, ha ellopják a gépet vagy kiszerelik a lemezt
- a hálózati forgalmat
- a jelszavakat az adathalászattól
! Kulcs nélkül a lemez tartalma olvashatatlan.
```
