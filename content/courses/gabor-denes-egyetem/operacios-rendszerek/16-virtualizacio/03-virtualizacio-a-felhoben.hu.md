---
title: Virtualizáció a felhőben
summary: IaaS, PaaS és SaaS, a felhőben futó virtuális gépek, pillanatképek és mentések, élő migráció, valamint a virtualizáció biztonsági kérdései.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **felhő**, és mit jelent az **IaaS**, a **PaaS** és a **SaaS**,
- hogyan segít a virtualizáció a **pillanatképekkel**, a **mentéssel** és az **élő migrációval**,
- milyen **biztonsági** kérdéseket vet fel, hogy sok ügyfél osztozik egy gépen.

## A felhő = virtualizáció nagy léptékben

A **felhő** (_cloud_) óriási adatközpontokban futó, interneten keresztül, **igény szerint bérelhető** számítási kapacitás. A szolgáltató (pl. Amazon Web Services, Microsoft Azure, Google Cloud) több millió szerverén 1. típusú hipervizorok (pl. KVM-alapú rendszerek, Hyper-V) és konténerek futnak; az ügyfél percek alatt kap egy virtuális gépet, és óra vagy másodperc alapon fizet érte.

## A három szolgáltatási modell

| Modell | Mit kapsz? | Mit kezelsz te? | Példa |
| --- | --- | --- | --- |
| **IaaS** (_Infrastructure as a Service_) | virtuális gép, lemez, hálózat | az OS-t, a frissítéseket, az alkalmazást | AWS EC2, Azure Virtual Machines |
| **PaaS** (_Platform as a Service_) | kész futtatókörnyezet | csak az alkalmazás kódját | Heroku, Google App Engine, Azure App Service |
| **SaaS** (_Software as a Service_) | kész alkalmazás böngészőben | csak a saját adataidat | Gmail, Microsoft 365, Neptun |

Minél lejjebb haladsz a táblázatban, annál kevesebbet kell üzemeltetned, de annál kevésbé szabhatod testre a rendszert. Ennek a weboldalnak is van felhős változata: az adatbázis egy felhőben futó PostgreSQL (PaaS) lesz.

## Pillanatkép, mentés, sablon

A VM lemeze egy fájl (vagy egy tároló objektum), ezért:

- **pillanatkép** (_snapshot_): egy pillanat állapota rögzíthető, és visszaállítható – ugyanaz, amit a VirtualBoxban az 1. témakörben csináltál. A pillanatkép **nem mentés**: ha a fizikai lemez tönkremegy, vele vész.
- **mentés** (_backup_): a VM lemezének másolata **másik** tárolóra vagy adatközpontba.
- **sablon / kép** (_image_): egy beállított VM-ből száz egyforma indítható – a felhőben így indul az új szerver percek alatt.

## Élő migráció

**Élő migrációnál** (_live migration_) egy futó VM átkerül egy másik fizikai gépre **leállítás nélkül**:

1. a hipervizor a VM memóriáját a háttérben átmásolja a célgépre, miközben a VM tovább fut;
2. a közben módosult („piszkos”) lapokat újra küldi, egyre kevesebbet;
3. egy rövid pillanatra (jellemzően ezredmásodpercekre) megállítja a VM-et, átküldi a maradékot és a CPU állapotát, majd a célgépen folytatja.

Így a szolgáltató hardvert cserélhet vagy frissíthet anélkül, hogy az ügyfelek észrevennék. Ez a lapozás (6. témakör) egy újabb alkalmazása.

## Biztonság és elszigetelés

Egy felhőszerveren **több ügyfél** VM-je fut egymás mellett (_multi-tenancy_), ezért kritikus, hogy egyik se lásson bele a másikba.

- A hipervizor hibája (**VM escape**: kitörés a vendégből a gazdára) a legsúlyosabb hiba, amit egy felhőszolgáltató elkövethet.
- A processzorok oldalcsatornás hibái (pl. **Spectre**, **Meltdown**, 2018) miatt a kernelek és hipervizorok sok védekezést kaptak, ami némi teljesítményt is elvisz.
- Konténereknél az elszigetelés gyengébb (közös kernel), ezért a felhők gyakran **könnyű VM-be** csomagolják a konténereket (pl. az AWS Firecracker vagy a gVisor).

## Összefoglalás

- Felhő: igény szerint bérelhető, virtualizált kapacitás nagy adatközpontokban.
- IaaS: VM-et kapsz; PaaS: futtatókörnyezetet; SaaS: kész alkalmazást.
- Pillanatkép ≠ mentés; a sablonokból gyorsan indíthatók új gépek.
- Élő migráció: memória másolása futás közben, rövid megállással.
- Közös gépen több ügyfél: a hipervizor és a CPU hibái a legveszélyesebbek.

## A lecke feladata

```quiz required
? Egy felhős VM óradíja 0,05 €. Mennyibe kerül, ha 30 napon át éjjel-nappal fut (euróban)?
= 36
! 30 × 24 = 720 óra; 720 × 0,05 = 36 €.

? Melyik szolgáltatási modell, ha a szolgáltató virtuális gépet ad, és az operációs rendszert te frissíted?
+ IaaS
- PaaS
- SaaS
- egyik sem
! Infrastructure as a Service.

? Miért nem helyettesíti a pillanatkép a mentést?
+ mert ugyanazon a tárolón van, mint a VM, így egy lemezhibával együtt elveszhet
- mert a pillanatkép csak a memóriát menti
- mert pillanatképet csak leállított VM-ről lehet készíteni
- mert a pillanatképet nem lehet visszaállítani
! A mentésnek másik tárolón kell lennie.

? Mi történik élő migráció közben?
- a VM leáll, és újraindul a másik gépen
+ a futó VM memóriája a háttérben átmásolódik, majd egy rövid megállás után a célgépen fut tovább
- a VM lemeze törlődik
- a vendég OS újratelepül
! A felhasználók jellemzően észre sem veszik.
```
