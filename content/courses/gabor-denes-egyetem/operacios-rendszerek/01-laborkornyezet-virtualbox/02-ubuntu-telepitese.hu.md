---
title: Ubuntu 26.04 LTS telepítése VirtualBoxba
summary: Letöltés, ellenőrzés, a virtuális gép létrehozása és az Ubuntu telepítője képernyőről képernyőre.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- miért az **Ubuntu Desktop 26.04 LTS** a legjobb első Linux,
- hogyan töltöd le és **ellenőrzöd** a telepítő ISO-t,
- hogyan hozod létre a **virtuális gépet**, és hogyan mész végig a **telepítőn**.

## Miért Ubuntu LTS?

- **Kezdőbarát**: grafikus telepítő, magyar nyelv, sok program egy kattintással (App Center).
- **LTS** = _Long Term Support_: 5 évig kap ingyenes biztonsági frissítéseket (az ingyenes Ubuntu Próval még tovább). A 26.04 („Resolute Raccoon”) 2026 áprilisában jelent meg, a **26.04.1** javítócsomaggal már kiforrott.
- **Óriási közösség**: szinte minden hibára van leírás, és a legtöbb oktatási anyag Ubuntura készül.

Ha valahol a régebbi **24.04 LTS** a kötelező, a lépések ugyanazok.

## 1. Az ISO letöltése és ellenőrzése

1. Nyisd meg az **ubuntu.com/download/desktop** oldalt, és töltsd le az **Ubuntu 26.04.1 LTS** változatot (kb. 6 GB, a fájl neve: `ubuntu-26.04.1-desktop-amd64.iso`).
2. Ugyanott a _Verify your download_ / **SHA256SUMS** linken van a fájl **ellenőrzőösszege**.
3. Számold ki a letöltött fájlét PowerShellben, és hasonlítsd össze:

```powershell
# A Letöltések mappában vagyunk; a kapott Hash értéknek egyeznie kell a SHA256SUMS-ban lévővel.
cd $HOME\Downloads
Get-FileHash .\ubuntu-26.04.1-desktop-amd64.iso -Algorithm SHA256
```

Ha az érték eltér, a letöltés sérült (vagy nem hiteles forrásból jött) – töltsd le újra. Ez a **hash-ellenőrzés**, a biztonsági témakörben még visszatérünk rá.

## 2. A virtuális gép létrehozása

A VirtualBox Managerben: **Új** (_New_).

**Virtuális gép neve és operációs rendszere**

| Mező           | Érték                                                       |
| -------------- | ----------------------------------------------------------- |
| Név            | `Ubuntu-OS`                                                 |
| Mappa          | hagyd az alapértelmezett gépmappát                          |
| ISO-kép        | tallózd be a letöltött `ubuntu-26.04.1-desktop-amd64.iso`-t |
| Típus / Verzió | a VirtualBox felismeri: **Linux / Ubuntu (64-bit)**         |

Jelöld be: **Felügyelet nélküli telepítés kihagyása** (_Skip Unattended Installation_). Így te mész végig a telepítőn – ebből tanulsz a legtöbbet, és nem kapsz előre beállított (`vboxuser`) felhasználót.

**Hardver**

| Beállítás    | Érték                                         |
| ------------ | --------------------------------------------- |
| Alapmemória  | **4096 MB** (ha 16 GB a gazda: 6144–8192 MB)  |
| Processzorok | **2** (ha 8+ mag van: 4)                      |
| EFI          | maradhat kikapcsolva (Ubuntuhoz nem kötelező) |

**Virtuális merevlemez**

- **Virtuális merevlemez létrehozása most**, méret: **40 GB** (a 25 GB a minimum, de a frissítéseknek kell a hely).
- Fájltípus: **VDI**, és **ne** jelöld be a _Pre-allocate Full Size_-t: így a fájl csak akkora, amennyit a vendég ténylegesen használ (**dinamikusan bővülő** lemez).

**Befejezés** (_Finish_). Indítás előtt nyisd meg a gép **Beállításait**:

- **Kijelző → Képernyő**: videomemória **128 MB**, grafikus vezérlő **VMSVGA**, 3D gyorsítás kikapcsolva.
- **Általános → Haladó**: megosztott vágólap és fogd-és-vidd: **Kétirányú** (a vendégkiegészítők után működik).
- **Hálózat**: maradjon **NAT** – a vendég ezzel kap internetet.

## 3. A telepítő

Válaszd ki a gépet → **Indítás**. A GRUB menüben hagyd a **Try or Install Ubuntu** pontot (Enter, vagy kivárod).

1. **Nyelv**: Magyar → Tovább.
2. **Kisegítő lehetőségek**: ha nem kell, Tovább.
3. **Billentyűzetkiosztás**: **Hungarian** (Magyar). A szövegdobozban kipróbálhatod az `ő` és `ű` betűt.
4. **Internetkapcsolat**: _Vezetékes kapcsolat_ – a NAT miatt már működik.
5. **Ubuntu telepítése** (és nem a kipróbálás).
6. **Telepítés típusa**: **Interaktív telepítés**.
7. **Alkalmazások**: **Alapértelmezett kiválasztás** (böngésző és alapprogramok). A _harmadik féltől származó szoftverek_ (illesztőprogramok, kodekek) bejelölése nem kötelező.
8. **Lemezbeállítás**: **Lemez törlése és az Ubuntu telepítése**. Nyugi: ez csak a **40 GB-os virtuális lemezt** törli, a gazdagéped fájljait nem!
9. **Fiók létrehozása**:
   - teljes név (pl. `Kiss Anna`), számítógépnév (pl. `ubuntu-os`),
   - **felhasználónév**: kisbetűs, ékezet és szóköz nélkül (pl. `anna`),
   - jelszó – jegyezd meg, a `sudo` parancsokhoz is ez kell.
10. **Időzóna**: **Budapest**.
11. **Áttekintés** → **Telepítés**. 10–20 perc.
12. **Újraindítás most**. Ha a _Please remove the installation medium_ üzenet jön, nyomj **Entert** – a VirtualBox magától kiveszi a virtuális lemezt.

## 4. Első bejelentkezés és frissítés

Bejelentkezés után végigvezet egy üdvözlő varázsló (Ubuntu Pro, adatgyűjtés – utóbbit nyugodtan kikapcsolhatod). Ezután nyiss egy **terminált** (**Ctrl + Alt + T**), és frissítsd a rendszert:

```bash
# A csomaglista frissítése, majd minden csomag frissítése (a jelszavadat kéri).
sudo apt update
sudo apt upgrade -y
# Melyik verzió fut? (információ a kiadásról)
lsb_release -a
```

Ha az ablak kicsi, és nem követi az átméretezést: ez normális, a **vendégkiegészítők** telepítése oldja meg (4. lecke).

## Összefoglalás

- Az Ubuntu 26.04.1 LTS 5 évig támogatott, kezdőbarát disztribúció.
- A letöltött ISO-t **SHA256** ellenőrzőösszeggel ellenőrizzük (`Get-FileHash`).
- Javasolt VM: 4 GB RAM, 2 processzor, 40 GB dinamikus VDI, felügyelet nélküli telepítés kihagyva.
- A „lemez törlése” csak a virtuális lemezre vonatkozik; telepítés után `sudo apt update && sudo apt upgrade`.

## A lecke feladata

```quiz required
? Mit jelent az LTS rövidítés az Ubuntu verzióknál?
- Linux Terminal Server
+ Long Term Support (hosszú távú támogatás)
- Latest Test System
- Light Text Shell
! Az LTS kiadások 5 évig kapnak ingyenes frissítéseket.

? Melyik PowerShell paranccsal számolod ki egy fájl SHA256 ellenőrzőösszegét?
= Get-FileHash
! Get-FileHash <fájl> -Algorithm SHA256

? Hány GB-os virtuális lemezt javasol a lecke az Ubuntunak?
= 40
! A 25 GB a minimum, de a frissítéseknek is kell hely.

? Mi történik, ha a telepítőben a „Lemez törlése és az Ubuntu telepítése” lehetőséget választod?
- Törlődnek a gazdagép (laptop) fájljai.
+ Csak a virtuális gép saját, virtuális lemeze törlődik.
- A VirtualBox eltávolítja magát.
- Semmi, ez csak egy teszt.
! A vendég csak a saját virtuális lemezét látja.

? Melyik parancs frissíti a csomaglistát Ubuntun?
+ sudo apt update
- sudo apt remove
- apt list --upgradable --delete
- sudo reboot
! Az apt update a listát frissíti, az apt upgrade telepíti a frissítéseket.
```
