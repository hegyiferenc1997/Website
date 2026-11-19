---
title: Gyakorlás – a laborkörnyezet
summary: Ellenőrző lista a kész laborhoz, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 45
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Mennyi RAM-ot adhatsz a VM-nek?** Írd meg a `vm_ram(gazda_gb)` függvényt: a gazdagépnek a RAM **felét**, de **legalább 4 GB**-ot meg kell tartania; a többit adhatod a VM-nek (negatív érték helyett 0).

```python starter
def vm_ram(gazda_gb):
    # a gazdának legalább a fele, de minimum 4 GB marad
    return gazda_gb
```

<details>
<summary>Megoldás</summary>

```python solution
def vm_ram(gazda_gb):
    # a gazdának legalább a fele, de minimum 4 GB marad
    megtart = max(gazda_gb / 2, 4)
    return max(gazda_gb - megtart, 0)
```

</details>

```python test
assert vm_ram(16) == 8
assert vm_ram(6) == 2
assert vm_ram(4) == 0
assert vm_ram(32) == 16
print("Minden ellenőrzés sikeres!")
```

**2.** **GB vagy GiB?** A lemezgyártók 10-es (1 GB = 10⁹ bájt), a Windows és a VirtualBox gyakran 2-es alapú egységet (1 GiB = 2³⁰ bájt) használ. Írd meg a `gb_bol_gib(gb)` függvényt, amely két tizedesre kerekítve megadja, hány GiB egy adott GB-os lemez!

```python starter
def gb_bol_gib(gb):
    return gb
```

<details>
<summary>Megoldás</summary>

Ezért látsz egy „1 TB-os” lemezből a Windowsban csak kb. 931 GB-ot: nincs elveszett hely, csak más a mértékegység.

```python solution
def gb_bol_gib(gb):
    bajt = gb * 10**9            # a gyártó 10-es alapú gigabájtja
    return round(bajt / 2**30, 2)
```

</details>

```python test
assert gb_bol_gib(1000) == 931.32      # egy "1 TB-os" lemez
assert gb_bol_gib(500) == 465.66
assert gb_bol_gib(1) == 0.93
print("Minden ellenőrzés sikeres!")
```

**3.** **Elfér-e egyszerre?** Írd meg az `elfer(vm_ramok, gazda_gb)` függvényt: igaz, ha az egyszerre futó VM-ek RAM-jának összege, plusz a gazdának fenntartott **4 GB**, legfeljebb akkora, mint a gazda RAM-ja.

```python starter
def elfer(vm_ramok, gazda_gb):
    return True
```

<details>
<summary>Megoldás</summary>

```python solution
def elfer(vm_ramok, gazda_gb):
    return sum(vm_ramok) + 4 <= gazda_gb
```

</details>

```python test
assert elfer([4, 4], 16) is True
assert elfer([8, 4], 16) is True
assert elfer([8, 6], 16) is False
assert elfer([], 4) is True
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik hálózati módban kap a VM az otthoni routertől saját IP-címet, így a hálózat többi gépe is eléri?
- NAT
+ híd (bridged)
- csak gazda (host-only)
! A NAT mögött a VM a 10.0.2.15 magáncímet kapja, kívülről nem érhető el közvetlenül.

? Mire való a pillanatkép (snapshot) a VirtualBoxban?
+ a VM egy adott állapotának elmentésére, ahová később vissza lehet állni
- a VM képernyőjének lefényképezésére
- a VM áthelyezésére egy másik gépre
! Kísérletezés előtt mindig érdemes pillanatképet készíteni.

? A gépeden 8 logikai processzor van. Legfeljebb hány vCPU-t ésszerű adni egy VM-nek, hogy a gazda is használható maradjon?
- 8
+ 4
- 16
! Ökölszabály: legfeljebb a logikai processzorok fele.

? Mi a dinamikusan foglalt virtuális lemez előnye a fix méretűvel szemben?
+ csak annyi helyet foglal a gazdán, amennyi adat ténylegesen van rajta
- mindig gyorsabb
- nem lehet megtelni
! A fix méretű lemez kicsit gyorsabb lehet, de rögtön a teljes méretet lefoglalja.

? Mit telepít a vendég rendszerbe a VirtualBox vendégkiegészítő (Guest Additions)?
- egy második operációs rendszert
+ illesztőprogramokat: jobb grafika, közös vágólap, megosztott mappák
- vírusirtót
! Linuxon a vboxguest kernelmodul is ennek része.
```
