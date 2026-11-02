---
title: Számítógépes buszok – PCIe, DDR, SATA
summary: A PC belső kapcsolatai, a párhuzamos PCI-tól a soros PCI Express-ig (sávok, kódolás), a DDR memóriabusz és sávszélessége, SATA és NVMe, a sávszélesség-számítás gyakorlata.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan kapcsolódnak egymáshoz egy mai számítógép egységei,
- miért váltotta fel a soros **PCI Express** a párhuzamos **PCI**-t,
- mit jelent a **sáv** (lane) és a **8b/10b**, **128b/130b** kódolás,
- hogyan működik a **DDR** memóriabusz, és hogyan számolod a sávszélességét,
- mi a **SATA** és az **NVMe**.

## A PC belső felépítése

A mai processzorban a **memóriavezérlő** és a **PCIe-vezérlő** is a chipen van. A processzorhoz közvetlenül kapcsolódik a **memória** (DDR-modulok) és a leggyorsabb **PCIe**-eszközök (videokártya, NVMe SSD); a lassabb perifériák (USB, SATA, hálózat, hang) egy **lapkakészleten** (chipset) keresztül érik el, amely szintén egy PCIe-szerű kapcsolattal csatlakozik a CPU-hoz.

## PCI → PCI Express

A régi **PCI** busz **párhuzamos**, **közös** (minden kártya ugyanazon a 32 bites buszon osztozott), 33 MHz-es volt: 32 bit × 33 MHz ≈ **133 MB/s** összesen.

A **PCI Express** (PCIe) ezzel szemben:

- **soros**, **pont–pont** kapcsolat – minden eszköznek saját vonala van, nincs osztozás;
- egy **sáv** (lane) két **differenciális** érpár: egy adás- és egy vételirány (duplex);
- több sáv köthető össze: **×1, ×4, ×8, ×16** (a videokártyák ×16-osak);
- az órajel az adatfolyamba van ágyazva, ezért **kódolás** kell, hogy elég jelváltás legyen benne:
  - PCIe 1.0–2.0: **8b/10b** – 8 adatbitet 10 biten visznek át → 80 % hatásfok;
  - PCIe 3.0-tól: **128b/130b** → ≈ 98,5 % hatásfok.

| verzió   | sebesség sávonként (GT/s) | kódolás   | hasznos adat ×1 sávon | ×16 sávon     |
| -------- | ------------------------- | --------- | --------------------- | ------------- |
| PCIe 1.0 | 2,5                       | 8b/10b    | 250 MB/s              | 4 GB/s        |
| PCIe 2.0 | 5                         | 8b/10b    | 500 MB/s              | 8 GB/s        |
| PCIe 3.0 | 8                         | 128b/130b | ≈ 985 MB/s            | ≈ 15,8 GB/s   |
| PCIe 4.0 | 16                        | 128b/130b | ≈ 1,97 GB/s           | ≈ 31,5 GB/s   |
| PCIe 5.0 | 32                        | 128b/130b | ≈ 3,94 GB/s           | ≈ 63 GB/s     |

(irányonként; GT/s = gigatransfer/másodperc, a vonalon átvitt bitek száma a kódolással együtt)

**Példa:** PCIe 1.0, egy sáv: 2,5 GT/s × 8/10 = **2 Gbit/s** = 250 MB/s.

## A DDR memóriabusz

A memória és a processzor között **párhuzamos**, **64 bites** adatbusz van (modulonként, csatornánként) – rövid, gondosan hossz-kiegyenlített vezetékekkel, mert itt a legkisebb késleltetés a fontos.

**DDR** (double data rate): az adatot az órajel **felfutó és lefutó élén is** átviszik, így órajelenként **két átvitel** történik. A modulok neve az **átviteli sebességet** adja meg (MT/s – megatransfer/másodperc):

- **DDR4-3200:** 1600 MHz órajel, 3200 MT/s.
- Sávszélesség = 3200 MT/s × 8 bájt (64 bit) = **25 600 MB/s** (ezért hívják a modult PC4-25600-nak).
- **Kétcsatornás** (dual channel) üzemmódban két modul párhuzamosan dolgozik → kétszeres sávszélesség.

| generáció | jellemző sebesség (MT/s) | tápfeszültség |
| --------- | ------------------------ | ------------- |
| DDR3      | 800–2133                 | 1,5 V         |
| DDR4      | 1600–3200                | 1,2 V         |
| DDR5      | 4800–8400                | 1,1 V         |

## Háttértárak: SATA és NVMe

- **SATA** (serial ATA): soros, differenciális kapcsolat merevlemezekhez és SSD-khez; a SATA III 6 Gbit/s, 8b/10b kódolással → kb. **600 MB/s** hasznos adat.
- **NVMe**: az SSD közvetlenül **PCIe** sávokon (jellemzően ×4) csatlakozik, a flash memóriára optimalizált protokollal – akár több GB/s, nagyon kis késleltetés (M.2 csatlakozó).

## Egyéb külső kapcsolatok

- **USB** (előző lecke): 480 Mbit/s (USB 2.0) = **60 MB/s** elméleti maximum, a valóságban kb. 35–40 MB/s.
- **Ethernet:** 1 Gbit/s, 10 Gbit/s … (differenciális érpárok vagy optikai szál).
- **HDMI, DisplayPort:** nagy sebességű soros képátvitel (szintén differenciális sávok).

A tendencia mindenhol ugyanaz: **soros, differenciális, pont–pont, több sávval** – a párhuzamos busz csak a memória felé maradt meg.

```python run
# Sávszélesség-számítások: PCIe, DDR, SATA, USB
def pcie(gt_s, hatasfok, savok=1):
    return gt_s * hatasfok * savok / 8          # GB/s irányonként

print(f"PCIe 1.0 ×1:  {pcie(2.5, 8 / 10):.3f} GB/s")
print(f"PCIe 3.0 ×16: {pcie(8, 128 / 130, 16):.1f} GB/s")

mt_s = 3200                                     # DDR4-3200
print("DDR4-3200, 64 bit:", mt_s * 8, "MB/s")
print("SATA III:", 6000 * 8 / 10 / 8, "MB/s")
print("USB 2.0:", 480 / 8, "MB/s")
```

## Összefoglalás

- PCI: párhuzamos, közös busz (133 MB/s); PCIe: soros, pont–pont, sávokból (×1…×16), 8b/10b → 128b/130b kódolás.
- DDR: 64 bites párhuzamos busz, órajelenként két átvitel; sávszélesség = MT/s × 8 bájt.
- SATA: soros, 6 Gbit/s (≈ 600 MB/s); NVMe: SSD közvetlenül PCIe-n.
- A gyors kapcsolatok soros, differenciális, pont–pont kialakításúak.

## A lecke feladata

```quiz required
? Mekkora egy DDR4-3200 modul (64 bites adatbusz) elméleti sávszélessége MB/s-ban?
= 25600
= 25 600
! 3200 MT/s × 8 bájt.

? Egy PCIe 1.0 sáv 2,5 GT/s-mal visz, 8b/10b kódolással. Hány Gbit/s a hasznos adatsebesség?
= 2
! 2,5 · 8 / 10.

? Mit jelent a DDR (double data rate)?
- Két memóriamodult használ.
+ Az adatot az órajel felfutó és lefutó élén is átviszi.
- Kétszeres tápfeszültséggel működik.
- Kétszer olvassa ki ugyanazt az adatot a biztonság kedvéért.

? Hány MB/s az USB 2.0 480 Mbit/s-os sebessége (elméleti maximum)?
= 60

? Miben különbözik alapvetően a PCI Express a régi PCI busztól?
- A PCIe párhuzamos, a PCI soros.
+ A PCIe soros, pont–pont kapcsolat sávokkal, a PCI közös párhuzamos busz volt.
- A PCIe csak videokártyákhoz használható.
- Nincs különbség, csak a csatlakozó más.

? Mi az NVMe?
- Egy memóriamodul-szabvány.
+ Protokoll, amellyel az SSD közvetlenül PCIe sávokon kapcsolódik.
- A SATA régebbi változata.
- Egy USB-csatlakozótípus.
```
