---
title: Mélyebben – a virtuális gép belülről és az első óra a terminálban
summary: Hogyan működik a hipervizor, mi történik a virtuális lemezzel és a pillanatképekkel, hogyan osszuk el okosan a gazdagép erőforrásait, hogyan lépjünk be SSH-val a vendégbe – és egy vezetett első óra az Ubuntu terminálban és a PowerShellben.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan fut egy **vendég operációs rendszer** egy másik OS belsejében (1-es és 2-es típusú hipervizor),
- mi az a **dinamikusan növekvő** és a **fix méretű** virtuális lemez, és hogyan épül fel egy **pillanatkép**,
- hogyan **osszd el** a processzort és a memóriát a gazdagép és a vendégek között,
- hogyan érd el a vendéget a gazdagépről **SSH-val** (porttovábbítás NAT módban),
- és egy vezetett **első óra a terminálban**, amire a tárgy összes későbbi témaköre épít.

## 1. Három szemszög: mi az a virtuális gép?

**A felhasználó szemszögéből** a virtuális gép egy ablak, amelyben egy teljes számítógép fut: saját asztal, saját fájlok, saját újraindítás.

**A gazdagép szemszögéből** a virtuális gép néhány **fájl** a merevlemezen (a beállítások egy `.vbox` fájlban, a lemez egy `.vdi` fájlban) és egy **folyamat**, amely memóriát és processzoridőt kér – ugyanúgy, mint egy böngésző.

**A vendég OS szemszögéből** pedig nincs is semmi különös: „lát” egy processzort, memóriát, lemezt, hálózati kártyát, és azt hiszi, hogy valódi hardveren fut. A hipervizor feladata, hogy ezt az illúziót fenntartsa.

**Hasonlat:** a virtuális gép olyan, mint egy színházi díszlet. A színész (a vendég OS) egy igazi szobában érzi magát, pedig a falak mögött a színpadtechnikus (a hipervizor) mozgatja a dolgokat.

## 2. Hogyan fut a vendég? – a hipervizor

A **hipervizor** (virtuálisgép-kezelő) az a szoftver, amely a virtuális gépeket futtatja. Két fő fajtája van:

| Típus                         | Hol fut?                                     | Példák                              | Jellemző felhasználás           |
| ----------------------------- | -------------------------------------------- | ----------------------------------- | ------------------------------- |
| **1-es típus** („bare metal”) | közvetlenül a hardveren, alatta nincs más OS | VMware ESXi, Microsoft Hyper-V, KVM | szerverek, felhő                |
| **2-es típus** („hosted”)     | egy hagyományos OS-en futó alkalmazásként    | **VirtualBox**, VMware Workstation  | asztali gép, tanulás, tesztelés |

A legtöbb vendégkód **közvetlenül a processzoron** fut, teljes sebességgel – ezért nem lassú egy virtuális gép. Csak az **érzékeny utasításoknál** (pl. hardver elérése, a memóriatérkép átállítása) kell a hipervizornak közbelépnie. Ezt a processzor **hardveres virtualizációs** kiegészítése (Intel **VT-x**, AMD **AMD-V**) teszi hatékonnyá: amikor a vendég ilyen utasítást próbál végrehajtani, a processzor „csapdát” állít, és átadja a vezérlést a hipervizornak. Ezért kellett az 1. leckében bekapcsolni a virtualizációt a BIOS/UEFI-ben.

A lemez, a hálózat és a kijelző viszont **emulált** vagy **paravirtualizált** eszköz: a vendég egy „kitalált” hálózati kártyának küld adatot, a hipervizor pedig a gazdagép valódi kártyáján továbbítja. A **vendégkiegészítők** (Guest Additions) olyan illesztőprogramok, amelyek tudják, hogy virtuális gépen futnak, és ezért gyorsabban, kevesebb trükközéssel kommunikálnak a hipervizorral.

## 3. A virtuális lemez és a pillanatképek

### Dinamikus vagy fix méretű?

Amikor a gép létrehozásakor 25 GB-os lemezt adtál meg, a VirtualBox két lehetőséget kínált:

| Lemezfajta              | Mekkora a fájl az elején? | Előny                  | Hátrány                                 |
| ----------------------- | ------------------------- | ---------------------- | --------------------------------------- |
| **dinamikusan növekvő** | néhány MB, és nő          | kevés helyet foglal    | kicsit lassabb írás, „váratlanul” megnő |
| **fix méretű**          | azonnal a teljes 25 GB    | gyorsabb, kiszámítható | azonnal elfoglalja a helyet             |

Fontos: a dinamikus lemez **nem zsugorodik magától**. Ha a vendégben letöltesz 5 GB-ot, majd törlöd, a `.vdi` fájl a gazdán 5 GB-tal nagyobb marad – a vendég ugyanis csak „szabadnak jelöli” a blokkokat, a hipervizor erről nem tud.

### Hogyan működik a pillanatkép?

A pillanatkép **nem másolja le** az egész lemezt (az percekig tartana). Ehelyett a VirtualBox **befagyasztja** az eredeti lemezfájlt, és ettől kezdve minden változást egy új, **különbséglemezre** (_differencing image_) ír.

```text
[ alap.vdi ]  ←  [ {pillanatkép-1}.vdi ]  ←  [ {pillanatkép-2}.vdi ]  ←  jelenlegi állapot
 befagyasztva      csak a változások         csak a változások          ide írunk
```

**Hasonlat:** pauszpapír-rétegek egy rajzon. Az alaprajzhoz nem nyúlsz, minden módosítást egy ráhelyezett átlátszó lapra rajzolsz. Visszaállításkor egyszerűen leveszed a felső lapokat.

Ebből több gyakorlati következmény adódik:

- **Visszaállítás** = a felső különbséglemez eldobása – ezért gyors.
- Sok pillanatkép → hosszú lánc → minden olvasásnál több fájlt kell végignézni, és **sok helyet** foglal.
- Egy pillanatkép **törlésekor** a változásokat **össze kell fésülni** (merge) a szomszédos réteggel – ez eltarthat egy ideig, közben ne kapcsold ki a gépet.
- Ha az **alap.vdi** sérül vagy elveszik, az összes pillanatkép használhatatlan. Ezért nem biztonsági mentés!

### Klón: teljes vagy kapcsolt

A **klónozás** egy gépből egy újat készít. A **teljes klón** minden lemezt lemásol (lassú, sok hely, de független), a **kapcsolt klón** (_linked clone_) a pillanatképhez hasonlóan az eredeti lemezre épít különbséglemezzel (gyors, kevés hely, de az eredeti gép nélkül nem működik). Kapcsolt klón akkor jó, ha ugyanabból a tiszta telepítésből több kísérleti gépet akarsz.

## 4. Erőforrások elosztása – számoljunk!

A vendégek a gazdagép erőforrásaiból élnek. Ha túl sokat adsz nekik, **a gazdagép** lassul be (és vele a vendégek is); ha túl keveset, a vendég lesz használhatatlan.

Ökölszabályok:

- **Memória:** a gazdagépnek maradjon legalább 4–6 GB a saját rendszerére és a böngészőre. A vendégek összes memóriája **egyszerre futtatva** ne lépje túl a fizikai memória kb. felét–kétharmadát.
- **Processzor:** egy vendégnek legfeljebb a **fizikai magok** felét add. Két vCPU egy tanulós Ubuntunak bőven elég.
- **Lemez:** a dinamikus lemezek **összes** maximális mérete + a pillanatképek férjenek el a gazdán.

Egy kis Python-tervező, amely megmondja, elfér-e egyszerre a két géped. Írd át a saját géped adataira!

```python run
# Virtuálisgép-tervező: elférnek-e egyszerre a vendégek a gazdagépen?
gazda_ram_gb = 16          # a gazdagép fizikai memóriája
gazda_magok = 8            # fizikai processzormagok
gazdanak_marad_gb = 6      # ennyi kell a gazdának (OS + böngésző)

vendegek = {               # név: (RAM GB, vCPU)
    "Ubuntu-OS": (4, 2),
    "Windows11": (6, 2),
}

ram_osszesen = sum(ram for ram, _ in vendegek.values())
cpu_osszesen = sum(cpu for _, cpu in vendegek.values())

print(f"Vendégek memóriája összesen: {ram_osszesen} GB")
print(f"A gazdának marad: {gazda_ram_gb - ram_osszesen} GB (legalább {gazdanak_marad_gb} kell)")
print(f"vCPU összesen: {cpu_osszesen} / {gazda_magok} mag")

if gazda_ram_gb - ram_osszesen < gazdanak_marad_gb:
    print("⚠ Egyszerre nem futtasd őket, vagy adj kevesebb memóriát!")
elif cpu_osszesen > gazda_magok:
    print("⚠ Több vCPU-t osztottál ki, mint ahány magod van – lassú lesz.")
else:
    print("✓ A két gép egyszerre is kényelmesen futhat.")
```

## 5. Belépés a vendégbe SSH-val (NAT + porttovábbítás)

NAT módban a vendég kifelé eléri az internetet, de **kívülről** (a gazdáról sem) nem látható. Ha mégis szeretnél a gazdagép termináljából parancsokat futtatni az Ubuntun – kényelmes másolás-beillesztés, több ablak –, **porttovábbítást** állíthatsz be: a gazda egy portjára érkező kapcsolatot a VirtualBox a vendég egy portjára továbbítja.

1. Az Ubuntu vendégben telepítsd és indítsd az SSH-kiszolgálót:

   ```bash
   sudo apt install openssh-server
   systemctl status ssh        # „active (running)” kell legyen
   ```

2. A VirtualBoxban: a gép **Beállítások → Hálózat → 1. kártya (NAT) → Speciális → Porttovábbítás**, új szabály: gazda port **2222**, vendég port **22**, protokoll TCP.
3. A gazdagép termináljából (Windowson PowerShellben is van `ssh`):

   ```powershell
   ssh -p 2222 felhasznalonev@127.0.0.1
   ```

A `127.0.0.1` a gazdagép saját címe; a VirtualBox a 2222-es portot „átirányítja” a vendég 22-es (SSH) portjára. Ugyanezzel a módszerrel egy vendégben futó webkiszolgálót is elérhetsz a gazda böngészőjéből (pl. gazda 8080 → vendég 80).

**Biztonsági megjegyzés:** a porttovábbítás alapértelmezésben a gazdagép minden hálózati címén figyelhet. Ha a „Gazda IP” mezőbe `127.0.0.1`-et írsz, csak a saját gépedről lehet csatlakozni – így a kávézó Wi-Fi-jén ülő idegenek nem próbálkozhatnak a vendéged jelszavával.

## 6. Az első óra a terminálban – vezetett túra

A tárgy szinte minden témaköre kér egy-két parancsot a laborgépeken. Ez a túra 20 perc alatt végigvezet a legfontosabbakon. Nyiss egy terminált az Ubuntun (**Ctrl + Alt + T**), és gépeld be sorban!

### Hol vagyok, mi van itt?

```bash
whoami              # ki vagyok? (a felhasználóneved)
pwd                 # hol vagyok? (print working directory) – pl. /home/anna
ls                  # mi van itt?
ls -la              # részletesen, a rejtett (ponttal kezdődő) fájlokkal együtt
cd /etc             # átlépés az /etc könyvtárba (rendszerbeállítások)
cd ~                # vissza a saját mappádba (a ~ a „home” rövidítése)
```

### Fájlok létrehozása és olvasása

```bash
mkdir labor                     # új mappa
cd labor
echo "Helló, OS!" > elso.txt    # szöveg írása fájlba (> felülír, >> hozzáfűz)
cat elso.txt                    # a fájl tartalma
nano elso.txt                   # egyszerű szövegszerkesztő (mentés: Ctrl+O, kilépés: Ctrl+X)
cp elso.txt masolat.txt         # másolás
mv masolat.txt atnevezett.txt   # áthelyezés / átnevezés
rm atnevezett.txt               # törlés – NINCS lomtár!
```

### Mit tud ez a gép?

```bash
uname -r                 # a kernel verziója
cat /etc/os-release      # a disztribúció neve és verziója
nproc                    # processzormagok száma
free -h                  # memória (-h: emberi léptékben, pl. 3.8Gi)
df -h /                  # szabad hely a gyökér-fájlrendszeren
ip -brief address        # hálózati interfészek és IP-címek
```

### Segítség kérése

```bash
man ls          # a parancs kézikönyve (kilépés: q, keresés: /szó)
ls --help       # rövid súgó
```

### Ugyanez Windows 11-en (PowerShell)

| Feladat       | Ubuntu (bash)         | Windows (PowerShell)                                          |
| ------------- | --------------------- | ------------------------------------------------------------- |
| hol vagyok?   | `pwd`                 | `Get-Location` (röviden: `pwd`)                               |
| mi van itt?   | `ls -la`              | `Get-ChildItem -Force` (röviden: `ls`)                        |
| mappaváltás   | `cd /etc`             | `Set-Location C:\Windows` (`cd`)                              |
| fájl tartalma | `cat elso.txt`        | `Get-Content elso.txt` (`cat`)                                |
| OS verziója   | `cat /etc/os-release` | `Get-ComputerInfo -Property OsName, OsVersion`                |
| processzorok  | `nproc`               | `(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors` |
| súgó          | `man ls`              | `Get-Help Get-ChildItem`                                      |

A PowerShell sok bash-parancsnevet **álnévként** (alias) is ismer, de a háttérben más működik: a PowerShell **objektumokat** ad tovább a parancsok között, a bash **szöveget**. Erről a felhasználói felületek témakörben bővebben lesz szó.

**Tipp:** a **Tab** billentyű kiegészíti a parancs- és fájlneveket, a **↑** nyíl visszahozza az előző parancsokat. Ezzel a két billentyűvel a gépelés fele megspórolható.

## Összefoglalás

- A virtuális gép a gazda szemében fájlok + egy folyamat, a vendég szemében egy igazi számítógép.
- A VirtualBox **2-es típusú** hipervizor; a vendégkód a VT-x/AMD-V segítségével közvetlenül a processzoron fut, csak az érzékeny utasításoknál lép közbe a hipervizor.
- A **pillanatkép** különbséglemezek lánca: a visszaállítás gyors, a törlés összefésüléssel jár, és az alap lemez nélkül semmit sem ér.
- Erőforrás-elosztásnál a gazdagépnek is maradjon elég memória és mag.
- NAT módban **porttovábbítással** (pl. 2222 → 22) érheted el a vendéget SSH-val.
- A terminál alapparancsai (`pwd`, `ls`, `cd`, `cat`, `nano`, `free`, `df`, `man`) végigkísérik a tárgyat.

## A lecke feladata

```quiz required
? Milyen típusú hipervizor a VirtualBox?
- 1-es típusú (közvetlenül a hardveren fut)
+ 2-es típusú (egy hagyományos OS-en fut alkalmazásként)
! A VirtualBoxot Windowsra, macOS-re vagy Linuxra telepíted, mint egy programot.

? Mit csinál a VirtualBox, amikor pillanatképet készítesz?
- lemásolja az egész virtuális lemezt
+ befagyasztja a lemezt, és a további változásokat egy különbséglemezre írja
- elmenti a lemezt a felhőbe
- tömöríti a lemezfájlt
! Ezért gyors a pillanatkép készítése és a visszaállítás.

? A dinamikus lemezű vendégben letöltesz, majd törölsz egy 5 GB-os fájlt. Mi történik a gazdán lévő .vdi fájl méretével?
- 5 GB-tal csökken
+ nagyjából ugyanakkora marad
- a duplájára nő
! A dinamikus lemez nem zsugorodik magától: a vendég csak szabadnak jelöli a blokkokat.

? A gazdagépen 16 GB memória van, és a gazdának legalább 6 GB-ot meg kell tartani. Legfeljebb hány GB memóriát kaphatnak összesen az egyszerre futó vendégek?
= 10
! 16 − 6 = 10 GB.

? NAT módban porttovábbítást állítasz be: gazda 2222 → vendég 22. Melyik paranccsal lépsz be a gazdáról a vendégbe?
- ssh felhasznalonev@10.0.2.15
+ ssh -p 2222 felhasznalonev@127.0.0.1
- ssh -p 22 felhasznalonev@2222
! A gazdagép saját címének 2222-es portjára csatlakozol, amit a VirtualBox a vendég 22-es portjára továbbít.

? Melyik paranccsal tudod meg az Ubuntun, hogy melyik könyvtárban vagy éppen?
= pwd
! print working directory
```
