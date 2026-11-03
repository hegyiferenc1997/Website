---
title: A virtualizáció alapjai
summary: Gazda és vendég, a hipervizor két típusa, teljes, para- és hardveresen támogatott virtualizáció, valamint az Intel VT-x és az AMD-V.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent a **virtualizáció**, és mi a **gazda** (_host_) és a **vendég** (_guest_),
- mi a különbség az **1. és 2. típusú hipervizor** között,
- hogyan működik a **teljes**, a **para-** és a **hardveresen támogatott** virtualizáció.

## Mi a virtualizáció?

A **virtualizáció** egy fizikai erőforrás (gép, processzor, memória, lemez, hálózat) **szoftveres utánzása**, hogy egy fizikai gépen több, egymástól elszigetelt **virtuális gép** (VM) fusson. Az 1. témakörben pontosan ezt csináltad: a Windows vagy Linux **gazdagépen** a VirtualBox két **vendég** operációs rendszert futtatott.

A vendég OS úgy hiszi, saját hardveren fut: van „processzora”, „memóriája” és „lemeze” (ez valójában egy `.vdi` fájl a gazdán). Ezt a látszatot a **hipervizor** (_virtual machine monitor_, VMM) teremti meg.

Miért jó?

- **Elszigetelés**: ha a vendég összeomlik vagy vírusos lesz, a gazda érintetlen.
- **Jobb kihasználtság**: egy szerveren tíz kis szolgáltatás tíz VM-ben, tíz gép helyett.
- **Kísérletezés**: pillanatkép, visszaállítás, több OS egy gépen – ideális tanuláshoz.
- **Hordozhatóság**: a VM egy fájlcsomag, átvihető másik gépre.

## A hipervizor két típusa

|          | **1. típus** (_bare-metal_)                                           | **2. típus** (_hosted_)                               |
| -------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| hol fut  | **közvetlenül a hardveren**                                           | egy **gazda OS-en**, alkalmazásként                   |
| példák   | VMware ESXi, Microsoft **Hyper-V**, Xen, **KVM** (Linux kernel modul) | **VirtualBox**, VMware Workstation, Parallels Desktop |
| jellemző | gyorsabb, szervereken és felhőben                                     | egyszerű telepíteni, asztali gépen                    |

A KVM érdekes eset: a Linux kernelt magát teszi hipervizorrá, ezért 1. típusúnak számít, bár egy teljes Linux fut alatta. Windowson a Hyper-V bekapcsolásakor maga a Windows is egy „kitüntetett” VM-be kerül a hipervizor fölé.

## A virtualizáció módjai

A nehézség: a vendég kernel **kernel módban** szeretne futni és privilegizált utasításokat (pl. lapozótábla-váltás, megszakítás tiltás) végrehajtani – de a valódi kernel módot a gazda birtokolja (lásd a 13. témakört).

1. **Teljes virtualizáció szoftveresen** (_binary translation_): a hipervizor futás közben átírja a vendég veszélyes utasításait biztonságos változatra. Bármely módosítatlan OS fut, de lassabb.
2. **Paravirtualizáció**: a vendég kernelt **módosítják**, hogy a veszélyes utasítások helyett közvetlenül a hipervizort hívja (**hiperhívás**, _hypercall_). Gyors, de módosított vendég kell (pl. a Xen korai változatai).
3. **Hardveresen támogatott virtualizáció**: a processzor kap egy külön „vendég módot” (**Intel VT-x**, **AMD-V**), amelyben a vendég kernel kernel módban futhat, a kényes műveleteknél pedig a CPU automatikusan a hipervizornak adja a vezérlést (_VM exit_). A memóriát a **második szintű címfordítás** (Intel EPT, AMD NPT) gyorsítja. Ma ez az alap.

A gyakorlatban a modern hipervizorok **keverik** a módokat: a CPU hardveresen támogatott, az I/O-eszközök viszont gyakran **paravirtualizáltak** (pl. **virtio** hálókártya és lemez KVM-en, illetve a VirtualBox vendégkiegészítői), mert egy valódi hálókártya teljes utánzása lassú.

Ezért kellett az 1. témakörben a BIOS/UEFI-ben bekapcsolni a **VT-x / AMD-V** (SVM) opciót: nélküle a VirtualBox nem tud 64 bites vendéget futtatni.

## Erőforrások kiosztása

A VM-nek adott RAM a gazdától **elvész**, amíg a VM fut, ezért mindig hagyj elég memóriát a gazdának is. A processzormagokat a hipervizor **időosztással** osztja szét (a vendég „virtuális CPU-i”, a vCPU-k a gazda szálai), így több vCPU is kiosztható, mint ahány fizikai mag van – ezt **túlfoglalásnak** (_overcommit_) hívják.

## Összefoglalás

- Virtualizáció: hardver utánzása szoftverrel; gazda + vendég; a hipervizor teremti meg a látszatot.
- 1. típus: közvetlenül a hardveren (ESXi, Hyper-V, KVM); 2. típus: gazda OS-en (VirtualBox).
- Teljes (bináris fordítás), para- (hiperhívások), hardveresen támogatott (VT-x, AMD-V, EPT/NPT).
- I/O-hoz gyakran paravirtualizált eszközök (virtio, vendégkiegészítők).

## A lecke feladata

```quiz required
? Egy gazdagépben 16 GB RAM van, ebből 4 GB-ot a gazdának hagysz. Hány 3 GB-os virtuális gépet futtathatsz egyszerre?
= 4
! (16 − 4) / 3 = 4.

? Melyik 2. típusú (hosted) hipervizor?
- VMware ESXi
- Xen
+ VirtualBox
- Hyper-V
! A VirtualBox egy gazda operációs rendszeren fut alkalmazásként.

? Mi a paravirtualizáció lényege?
+ a vendég kernelt módosítják, hogy közvetlenül a hipervizort hívja (hiperhívás)
- a vendég kernel módosítás nélkül fut, a CPU fordítja az utasításait
- a vendég és a gazda ugyanazt a kernelt használja
- minden I/O-művelet le van tiltva
! A konténereknél van közös kernel, nem a paravirtualizációnál.

? Mi az Intel processzorok hardveres virtualizációs bővítményének neve?
= VT-x
= vtx
! Az AMD-nél AMD-V (SVM).
```
