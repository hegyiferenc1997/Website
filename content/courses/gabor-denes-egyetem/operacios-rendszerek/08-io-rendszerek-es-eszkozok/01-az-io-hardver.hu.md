---
title: Az I/O-hardver
summary: Eszközfajták, vezérlők és regisztereik, portok és memóriába leképezett I/O, lekérdezés, megszakítás és DMA.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **eszközfajtákat** különböztet meg az OS,
- mi az **eszközvezérlő**, és hogyan „beszél” vele a processzor (**portok**, **memóriába leképezett I/O**),
- mi a különbség a **lekérdezés** (_polling_), a **megszakításos** I/O és a **DMA** között.

## Eszközfajták

| Fajta                 | Jellemző                                                      | Példa                          |
| --------------------- | ------------------------------------------------------------- | ------------------------------ |
| **blokkos** eszköz    | rögzített méretű blokkokban, tetszőleges sorrendben olvasható | SSD, HDD, pendrive             |
| **karakteres** eszköz | bájtfolyam, csak sorban                                       | billentyűzet, egér, soros port |
| **hálózati** eszköz   | csomagokat küld és fogad                                      | Ethernet, Wi-Fi                |

Sebességben óriási a különbség: egy billentyűzet ~10 bájt/s-ot ad, egy NVMe SSD 7 GB/s-ot – az OS-nek mindkettőt jól kell kezelnie.

## Az eszközvezérlő

Minden eszközhöz tartozik egy **vezérlő** (_controller_) – egy kis elektronika (gyakran saját processzorral), amely az eszköz „nyelvét” beszéli. A CPU a vezérlő **regisztereit** írja és olvassa:

- **állapotregiszter** – kész-e, foglalt-e, volt-e hiba,
- **parancsregiszter** – mit csináljon (pl. „olvasd be a 1000. blokkot”),
- **adatregiszter(ek)** – a mozgatott adat.

A regiszterek elérése kétféle lehet:

- **I/O portok**: külön címtér és külön utasítások (x86-on `in`, `out`),
- **memóriába leképezett I/O** (_memory-mapped I/O_): a regiszterek a memória-címtér egy részén látszanak, közönséges memóriaírással vezérelhetők. A mai eszközök (PCIe, videokártya) főleg így működnek.

## Hogyan tudja meg a CPU, hogy kész az eszköz?

### 1. Lekérdezés (polling)

A CPU egy ciklusban **újra és újra** kiolvassa az állapotregisztert, amíg az eszköz nem kész.

```text
amíg (állapot == foglalt) { semmi }   ← tevékeny várakozás (busy waiting)
adat ← adatregiszter
```

Egyszerű, de **pazarló**: a CPU közben semmi hasznosat nem csinál. Csak nagyon gyors eszközöknél vagy nagyon rövid várakozásnál éri meg.

### 2. Megszakításos I/O

A CPU kiadja a parancsot, és **mást csinál**. Ha az eszköz kész, **megszakítást** küld; a kernel megszakításkezelője átveszi az adatot, és a várakozó folyamatot **kész** állapotba teszi.

Hátránya: minden egyes bájtnál/szónál megszakítás – egy gyors lemeznél ez másodpercenként milliókat jelentene.

### 3. DMA (közvetlen memória-hozzáférés)

A **DMA-vezérlő** (_Direct Memory Access_) a CPU helyett **maga másolja** az adatot az eszköz és a memória között. A CPU csak annyit mond: „másolj 64 KB-ot a lemez 1000. blokkjától a memória X címére”, és a végén **egyetlen** megszakítást kap.

```text
polling:      CPU ─ kérdez, kérdez, kérdez … ─ adat
megszakítás:  CPU ─ parancs ─ (más munka) ─ IRQ ─ 1 szó ─ (más munka) ─ IRQ ─ 1 szó …
DMA:          CPU ─ parancs ─ (más munka ……………………………………………) ─ IRQ: kész a 64 KB
```

Minden nagy sebességű eszköz (lemez, hálózat, hang, videó) DMA-t használ.

```bash
cat /proc/interrupts | head    # melyik eszköz hány megszakítást kért eddig
lspci                          # a PCI(e) eszközök (vezérlők) listája
lsusb                          # USB-eszközök
```

## Összefoglalás

- Eszközfajták: blokkos, karakteres, hálózati.
- A CPU a vezérlő regisztereivel kommunikál, I/O portokon vagy memóriába leképezve.
- Polling: tevékeny várakozás; megszakítás: az eszköz szól, ha kész; DMA: a vezérlő maga másol, a végén egy megszakítás.

## A lecke feladata

```quiz required
? Milyen fajta eszköz a billentyűzet?
- blokkos
+ karakteres
- hálózati
- memóriába leképezett
! Bájtfolyamot ad, csak sorban olvasható.

? Mi a DMA rövidítés feloldása?
= Direct Memory Access
= közvetlen memória-hozzáférés
! A vezérlő a CPU nélkül másol a memóriába.

? Melyik módszernél végez a CPU tevékeny várakozást (busy waiting)?
+ lekérdezés (polling)
- megszakításos I/O
- DMA
- spoololás
! Folyamatosan olvassa az állapotregisztert.

? Egy 64 KB-os blokkot DMA-val olvasunk be. Hány megszakítást kap a CPU az átvitel végén?
= 1
! A teljes átvitel végén egyetlen megszakítás érkezik.

? Melyik Linux-parancs listázza a PCI(e) eszközöket?
= lspci
! USB-eszközökhöz: lsusb.
```
