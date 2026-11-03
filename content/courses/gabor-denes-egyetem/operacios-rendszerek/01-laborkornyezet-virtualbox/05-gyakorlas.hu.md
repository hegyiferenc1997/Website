---
title: Gyakorlás – a laborkörnyezet
summary: Ellenőrző lista a kész laborhoz, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 20
kind: practice
---

## Ellenőrző lista: kész a labor?

- [ ] A Feladatkezelőben a **Virtualizáció: Engedélyezve**.
- [ ] Telepítve a **VirtualBox 7.2**.
- [ ] Fut az **Ubuntu-OS** gép, frissítve (`sudo apt update && sudo apt upgrade`), vendégkiegészítőkkel.
- [ ] Fut a **Windows11** gép (TPM 2.0, Secure Boot), frissítve, vendégkiegészítőkkel.
- [ ] Mindkét gépről van **„Tiszta telepítés”** pillanatkép.
- [ ] Működik egy **megosztott mappa** a gazda és a vendégek között.

Próbáld ki az Ubuntu terminálban – ezek a parancsok a következő témakörökben is előkerülnek:

```bash
uname -a        # a kernel neve és verziója
free -h         # mennyi memóriát kapott a vendég
nproc           # hány processzormagot lát
df -h /         # mennyi hely van a gyökér-fájlrendszeren
```

Windows 11-en a PowerShellben:

```powershell
Get-ComputerInfo -Property OsName, OsVersion
Get-Tpm          # rendszergazdaként: TpmPresent = True
Confirm-SecureBootUEFI   # rendszergazdaként: True
```

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Miért jobb egy virtuális gépen kísérletezni, mint a saját gépeden?</summary>

Mert a vendég el van szigetelve a gazdától: ha elrontod, törlöd vagy visszaállítod egy pillanatképből, a saját rendszered és fájljaid érintetlenek maradnak.

</details>

<details>
<summary>2. Mi a különbség a NAT és a híd (Bridged) hálózati mód között?</summary>

NAT-nál a vendég a gazda mögött, annak címét használva éri el az internetet, kívülről nem látható. Híd módban saját IP-címet kap a helyi hálózaton, így más gépek is elérhetik.

</details>

<details>
<summary>3. Miért kell a Windows 11-hez TPM 2.0 és Secure Boot, és honnan veszi ezeket a VirtualBox?</summary>

A Microsoft biztonsági okból követeli meg: a Secure Boot csak aláírt rendszerbetöltőt indít, a TPM kulcsokat őriz (BitLocker, Windows Hello). A VirtualBox 7 mindkettőt szoftveresen emulálja (Alaplap fül: TPM v2.0, EFI, Secure Boot).

</details>

<details>
<summary>4. Miért hagytuk ki a felügyelet nélküli telepítést?</summary>

Hogy lássuk és megértsük a telepítő lépéseit (nyelv, lemez, fiók), és ne kapjunk automatikusan létrehozott felhasználót. Később, ha már ismerős, a felügyelet nélküli mód gyorsabb.

</details>

<details>
<summary>5. Mit jelent, ha a dinamikusan bővülő, 40 GB-os VDI fájl a gazdán csak 12 GB?</summary>

Hogy a vendég eddig csak kb. 12 GB-ot írt a lemezére. A fájl a használattal nő, legfeljebb 40 GB-ig.

</details>

## Összefoglaló feladatlap

```quiz required
? Hogy hívjuk a virtuális gépeket futtató programot (pl. VirtualBox)?
= hipervizor
= hypervisor
= virtualizációs szoftver
! Hipervizor (Virtual Machine Monitor).

? Ubuntun melyik parancs telepíti a már letöltött frissítéseket a csomaglista frissítése után?
- sudo apt update
+ sudo apt upgrade
- sudo apt search
- sudo apt purge
! Először apt update, utána apt upgrade.

? Hány MB memóriát adunk alapból a Windows 11 virtuális gépnek a leckében?
= 4096
! 4 GB a minimum; 16 GB-os gazdán 8192 MB ajánlott.

? Melyik VirtualBox-menüpont tölti be a vendégkiegészítők telepítőlemezét?
+ Eszközök → Vendégkiegészítők CD-képének behelyezése
- Fájl → Virtuális gép importálása
- Gép → Klónozás
- Súgó → Frissítések keresése
! Devices → Insert Guest Additions CD image.

? Mi a teendő, ha a VM a „VT-x is not available” hibával nem indul?
- Telepítsd újra a VirtualBoxot.
- Adj több memóriát a VM-nek.
+ Kapcsold be a virtualizációt a gép BIOS/UEFI beállításaiban.
- Állítsd a hálózatot NAT-ra.
! Intel: Virtualization Technology, AMD: SVM Mode → Enabled.

? A VM lefagyott, semmire sem reagál. Melyik leállítási mód a végső megoldás?
- Szabályos leállítás a vendégben
- Állapot mentése
+ Kikapcsolás (tápkábel kihúzása)
- Pillanatkép készítése
! A kikapcsolás adatvesztéssel járhat, ezért csak végső esetben.
```
