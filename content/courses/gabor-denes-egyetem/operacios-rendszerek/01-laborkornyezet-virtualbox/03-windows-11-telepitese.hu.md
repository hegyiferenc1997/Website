---
title: Windows 11 telepítése VirtualBoxba
summary: TPM 2.0, UEFI és Secure Boot a virtuális gépben, az ISO letöltése, a telepítő és az első beállítás lépésről lépésre.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mik a Windows 11 **hardverkövetelményei** (TPM 2.0, UEFI, Secure Boot), és hogyan teljesíti őket a VirtualBox,
- honnan töltöd le **legálisan** a telepítőt, és milyen **licenccel** használhatod,
- hogyan mész végig a **telepítőn** és az **első beállításon** (OOBE).

## A Windows 11 követelményei

| Követelmény     | Minimum                    | A VirtualBoxban                          |
| --------------- | -------------------------- | ---------------------------------------- |
| processzor      | 64 bites, 2 mag, 1 GHz     | **2** (inkább 4) virtuális processzor     |
| memória         | 4 GB                       | **4096 MB** (ajánlott 8192 MB)            |
| tárhely         | 64 GB                      | **80 GB** dinamikus VDI                   |
| firmware        | **UEFI**, **Secure Boot**  | _EFI engedélyezése_ + _Secure Boot_       |
| biztonsági chip | **TPM 2.0**                | virtuális (emulált) **TPM v2.0**          |

- **UEFI** a régi BIOS utódja, a gép indítását végző firmware.
- **Secure Boot** (biztonságos rendszerindítás): csak digitálisan aláírt rendszerbetöltő indulhat el – így egy kártevő nem épülhet be az indítás elé.
- **TPM** (_Trusted Platform Module_): kriptográfiai kulcsokat őrző biztonsági chip (pl. a BitLocker titkosítás vagy a Windows Hello használja).

A VirtualBox 7 óta mindhármat **szoftveresen biztosítja** – ezért nincs szükség semmilyen trükkre vagy rendszerleíró-módosításra.

## 1. Az ISO letöltése

1. Nyisd meg a **microsoft.com/software-download/windows11** oldalt.
2. Görgess a **Windows 11 lemezkép (ISO) letöltése x64-eszközökhöz** részhez → válaszd: **Windows 11 (multi-edition ISO for x64 devices)** → **Letöltés most**.
3. Válaszd ki a **nyelvet** (Magyar) → **Megerősítés** → **64-bit Download**. A link 24 óráig érvényes, a fájl kb. 7 GB.

### Licenc – milyen kulccsal?

- **Egyetemi licenc**: sok egyetem ingyen ad hallgatóinak Windows 11 Education kulcsot (pl. a Microsoft oktatási programján, az _Azure Dev Tools for Teaching_-en keresztül). Kérdezd meg a tanszéket vagy az informatikai ügyfélszolgálatot.
- **Kulcs nélkül**: a telepítőben választható a _Nincs termékkulcsom_. A rendszer így is működik, csak aktiválatlan: vízjel jelenik meg, és a személyre szabás (háttérkép, színek) le van tiltva. Tanuláshoz bőven elég.
- **Próbaverzió**: a Microsoft Evaluation Centeren regisztráció után 90 napos **Windows 11 Enterprise** próbaverzió is letölthető.

## 2. A virtuális gép létrehozása

VirtualBox Manager → **Új**:

| Mező           | Érték                                                |
| -------------- | ---------------------------------------------------- |
| Név            | `Windows11`                                          |
| ISO-kép        | a letöltött `Win11_…_Hungarian_x64.iso`              |
| Típus / Verzió | **Microsoft Windows / Windows 11 (64-bit)**          |

Jelöld be a **Felügyelet nélküli telepítés kihagyása** opciót (lásd lent a tippet).

**Hardver**: memória **4096 MB** (ha 16 GB a gazda, **8192 MB**), processzor **2–4**, és legyen bepipálva az **EFI engedélyezése (csak speciális OS-ek)**. **Merevlemez**: **80 GB**, VDI, dinamikus. **Befejezés**.

Indítás előtt **ellenőrizd** a beállításokat (**Beállítások → Rendszer → Alaplap**):

- **TPM**: **v2.0**,
- **EFI engedélyezése**: bepipálva,
- **Secure Boot engedélyezése**: bepipálva.

A **Windows 11 (64-bit)** profil ezeket magától beállítja, de ha régebbi VirtualBoxban vagy kézzel hoztad létre a gépet, itt pótolhatod. A **Kijelző** fülön a videomemória legyen **128 MB** vagy több.

> **Tipp – felügyelet nélküli telepítés:** ha nem hagyod ki, a VirtualBox előre megkérdezi a felhasználónevet, jelszót és kiadást, és helyi fiókkal magától feltelepíti a Windowst. Kényelmes, de nem látod a lépéseket, és néha elakad – ezért először érdemes kézzel végigcsinálni.

## 3. A telepítő

1. **Indítás**. Megjelenik: _Press any key to boot from CD or DVD…_ – **azonnal nyomj meg egy billentyűt** (pár másodperced van).
   - Ha lemaradtál, és fekete **UEFI Shell** vagy _Boot Manager_ képernyő jön: **Gép → Újraindítás** (_Reset_), és most nyomj billentyűt időben.
2. **Nyelv, idő- és pénznemformátum**: Magyar → Tovább. **Billentyűzet**: Magyar → Tovább.
3. **Windows 11 telepítése**, és pipáld be, hogy tudomásul veszed: minden törlődik – ez is csak a **virtuális lemezre** vonatkozik.
4. **Termékkulcs**: írd be az egyetemit, vagy kattints a **Nincs termékkulcsom** linkre.
5. **Kiadás**: **Windows 11 Pro** (vagy amire kulcsod van, pl. Education). → Licencfeltételek: **Elfogadom**.
6. **Telepítés helye**: _Meghajtó 0 – Le nem foglalt terület_ (80 GB) → **Tovább** → **Telepítés**.
7. Másolás, majd több újraindítás. **Most már ne nyomj billentyűt** a _Press any key_ üzenetnél, különben elölről kezdődik a telepítés.

**„Ezen a gépen nem futtatható a Windows 11”** üzenet? Ez szinte mindig azt jelenti, hogy a TPM 2.0, a Secure Boot vagy a 4 GB RAM hiányzik. Állítsd le a gépet (**Gép → ACPI leállítás** vagy bezárás → _Kikapcsolás_), pótold a beállításokat, és indítsd újra.

## 4. Az első beállítás (OOBE)

Az _Out-Of-Box Experience_ a Windows első indításakor futó varázsló:

1. **Ország/régió**: Magyarország. **Billentyűzetkiosztás**: Magyar; második kiosztás: _Kihagyás_.
2. **Hálózat**: a NAT miatt automatikusan csatlakozik. A Windows ezután frissítéseket kereshet (pár perc).
3. **Eszköz neve**: pl. `WIN11-OS` → újraindul.
4. **Fiók**: a Windows 11 Home és Pro első beállításához **Microsoft-fiók és internet** kell. A korábbi kiskapukat (hálózat nélküli helyi fiók) a Microsoft 2025-ben megszüntette, ezért egyszerűbb egy ingyenes Microsoft-fiókot használni (Pro esetén: _Beállítás személyes használatra_).
5. **PIN-kód** létrehozása – ezzel lépsz be a vendégbe.
6. **Adatvédelmi beállítások**: a nem kötelező diagnosztikát, helyadatot, hirdetési azonosítót nyugodtan kikapcsolhatod → **Elfogadás**.
7. Megjelenik az asztal. Futtasd a **Gépház → Windows Update** frissítéseit.

Ha később mégis helyi fiókot szeretnél: **Gépház → Fiókok → Saját adatok → Bejelentkezés helyi fiókkal** (ha a verziód még felkínálja).

## Összefoglalás

- A Windows 11-hez **TPM 2.0**, **UEFI + Secure Boot**, 4 GB RAM és 64 GB tárhely kell; a VirtualBox 7 mindezt emulálja.
- Az ISO-t a Microsoft oldaláról töltsd le; kulcs nélkül is telepíthető (aktiválatlanul), az egyetemek gyakran adnak Education kulcsot.
- Induláskor gyorsan nyomj billentyűt a _Press any key_ üzenetnél, a későbbi újraindításoknál már ne.
- Az OOBE-ben Microsoft-fiók kell; a követelmény-hibát a VM beállításainak javítása oldja meg.

## A lecke feladata

```quiz required
? Milyen verziójú TPM kell a Windows 11-hez? (szám)
= 2.0
= 2
! A VirtualBoxban: Beállítások → Rendszer → Alaplap → TPM: v2.0.

? Mit biztosít a Secure Boot?
- Gyorsabb indulást SSD-ről.
+ Csak digitálisan aláírt rendszerbetöltő indulhat el.
- Titkosítja a merevlemezt.
- Kikapcsolja az internetet telepítés közben.
! Így egy kártevő nem épülhet be az operációs rendszer indulása elé.

? Hány GB tárhely a Windows 11 minimuma?
= 64
! A leckében 80 GB-os dinamikus lemezt hozunk létre.

? Indítás után fekete UEFI Shell képernyő jelent meg. Mi a teendő?
- Törölni kell a virtuális gépet.
- Ki kell kapcsolni a TPM-et.
+ Újraindítani a gépet, és időben megnyomni egy billentyűt a „Press any key” üzenetnél.
- Át kell állítani a hálózatot hídra.
! A telepítőlemezről csak akkor indul, ha pár másodpercen belül billentyűt nyomsz.

? Mit jelent a telepítés közben megjelenő „Ezen a gépen nem futtatható a Windows 11” üzenet a VirtualBoxban?
+ Valamelyik követelmény (TPM 2.0, Secure Boot, 4 GB RAM) nincs beállítva a VM-ben.
- A gazdagép processzora túl régi, nincs megoldás.
- A letöltött ISO hamis.
- Elfogyott a gazdagép memóriája.
! Állítsd le a VM-et, pótold a beállítást, és indítsd újra.
```
