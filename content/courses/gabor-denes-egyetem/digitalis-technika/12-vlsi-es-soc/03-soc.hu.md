---
title: Rendszer egy chipen (SoC)
summary: A SoC fogalma és részei (processzormagok, GPU, NPU, memóriavezérlő, perifériák), IP-blokkok, chipen belüli buszok (AMBA AXI, AHB, APB), FPGA-s SoC (Zynq), energiagazdálkodás (órajelkapuzás, DVFS), chipletek, RISC-V.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- mi a **SoC** (system on a chip), és milyen egységekből áll,
- mik az **IP-blokkok**,
- hogyan kommunikálnak az egységek a chipen belül (**AMBA**: AXI, AHB, APB),
- mi az **FPGA-s SoC**,
- hogyan takarékoskodik a SoC az energiával (**órajelkapuzás**, **DVFS**),
- mik a **chipletek**, és mi a **RISC-V**.

## Mi a SoC?

A **SoC** egy teljes számítógépes rendszert egyetlen chipre integrál. A mikrokontroller (7. témakör) a kis SoC; a nagy SoC-k a telefonok, tabletek, a Raspberry Pi és sok laptop „agyai”. Egy mai telefon-SoC tipikus részei:

```text
┌──────────────────────────── SoC ─────────────────────────────┐
│  CPU-magok        GPU            NPU (MI-gyorsító)   DSP     │
│  (nagy + kicsi)   (grafika)      (neurális hálók)  (hang)    │
│        │            │                │               │       │
│  ══════╪════════════╪═ NoC / busz ═══╪═══════════════╪════   │
│        │            │                │               │       │
│  memória-      gyorsítótár   kép- és videó-     perifériák   │
│  vezérlő       (cache)       feldolgozó         (USB, I²C,   │
│  (LPDDR)                     (kamera, kodek)     SPI, UART)  │
│  modem (4G/5G), Wi-Fi, biztonsági egység, energiavezérlő     │
└──────────────────────────────────────────────────────────────┘
```

Előnyei: kisebb méret, kisebb fogyasztás (rövidek a belső vezetékek), olcsóbb tömeggyártás, gyorsabb kommunikáció az egységek között. Hátránya: a tervezése óriási munka és drága (ASIC, előző lecke).

**Heterogén** felépítés: a különböző feladatokra külön, arra optimalizált egység van – a grafikát a GPU, a neurális hálókat az NPU, a hangot a DSP végzi sokkal hatékonyabban, mint egy általános CPU-mag. A CPU-magok is gyakran kétfélék: **nagy, gyors** magok a nehéz feladatokra, **kicsi, takarékos** magok a háttérmunkára (ARM big.LITTLE).

## IP-blokkok

Senki nem tervez minden egységet a nulláról. A SoC kész, megvásárolt vagy saját fejlesztésű **IP-blokkokból** (intellectual property core – szellemi tulajdon) épül, mint egy legó:

- **soft IP:** szintetizálható HDL-kód (RTL) – rugalmas, bármilyen technológiára lefordítható;
- **hard IP:** egy adott gyártási technológiára már elhelyezett, huzalozott rajzolat – optimális, de nem módosítható (pl. nagy sebességű adó-vevők, memóriák).

Példák: ARM Cortex processzormagok, USB- és PCIe-vezérlők, DDR-vezérlők. Az FPGA-s eszközökben is vannak IP-katalógusok (Vivado IP Catalog, Quartus IP).

## Chipen belüli buszok – AMBA

Az IP-blokkoknak közös „nyelv” kell, hogy összeköthetők legyenek. A legelterjedtebb az ARM **AMBA** (Advanced Microcontroller Bus Architecture) szabványcsaládja:

| busz    | jellemző                                                                                  | tipikus felhasználás                   |
| ------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| **AXI** | nagy teljesítményű, külön csatornák olvasásra és írásra, egyszerre több tranzakció, burst | CPU, memória, DMA, GPU                 |
| **AHB** | egyszerűbb, nagy sebességű, osztott busz                                                  | mikrokontrollerek fő busza             |
| **APB** | egyszerű, lassú, kis fogyasztású                                                          | lassú perifériák (UART, időzítő, GPIO) |

A nagy SoC-kben a sok egység már nem egy buszon, hanem egy **chipen belüli hálózaton** (NoC – network on chip) kommunikál, csomagokkal, mint egy kis számítógép-hálózat.

## FPGA-s SoC

Az **FPGA-s SoC** egy chipen egyesíti a **hard processzort** és a **programozható logikát**. Példa: az AMD/Xilinx **Zynq** – kétmagos ARM Cortex-A9 (processing system, PS) + FPGA-szövet (programmable logic, PL), köztük **AXI** buszokkal. A processzoron Linux fut, a gyors, párhuzamos feladatokat (képfeldolgozás, motorvezérlés, jelfeldolgozás) a saját hardveres gyorsító végzi az FPGA-részben. (Hasonló: Intel/Altera Cyclone V SoC.)

## Energiagazdálkodás

Egy telefon-SoC-nak egész nap bírnia kell akkumulátorról, ezért az energia a legfontosabb tervezési szempontok egyike. Emlékezz a CMOS dinamikus fogyasztására (3. témakör):

**P<sub>din</sub> = α · C · V<sup>2</sup> · f**

- **Órajelkapuzás** (clock gating): a nem használt blokk órajelét lekapcsolják → nincs kapcsolgatás, nincs dinamikus fogyasztás. (A 11. témakörben azt tanultuk, hogy órajelet nem szabad egyszerű ÉS-kapuval kapuzni – az ASIC-ekben erre külön, hazárdmentes **órajelkapuzó cellát** (ICG) használnak, amelyet a tervezőeszköz automatikusan illeszt be.)
- **Tápkapuzás** (power gating): a nem használt blokkot teljesen leválasztják a tápról → a szivárgási áram is megszűnik.
- **DVFS** (dynamic voltage and frequency scaling): kis terhelésnél csökkentik a frekvenciát **és** a feszültséget. Mivel a fogyasztás a feszültség **négyzetével** arányos, ez nagyon hatékony.

**Példa:** a feszültség 1,0 V-ról 0,8 V-ra, a frekvencia a felére csökken → P arány = 0,8<sup>2</sup> · 0,5 = 0,32, tehát a dinamikus fogyasztás az eredeti **32 %**-ára esik.

## Chipletek és RISC-V

- **Chipletek:** egy óriási chip helyett több kisebb lapkát (chipletet) tokoznak egymás mellé vagy egymásra, nagy sebességű összeköttetéssel. A kisebb lapkáknak jobb a kihozatala (1. lecke), és az egyes részek különböző technológiával is készülhetnek (pl. a CPU-magok a legújabb, az I/O egy olcsóbb technológián). Példák: AMD Ryzen/EPYC, Apple M Ultra.
- **RISC-V:** nyílt, licencdíj nélküli utasításkészlet-architektúra (7. témakör: ISA). Bárki tervezhet rá processzort – egyetemi projektektől a kereskedelmi SoC-kig egyre több helyen használják, és az FPGA-n is kipróbálhatod (soft processzorként).

```python run
# DVFS: a dinamikus fogyasztás arányos V^2 · f-fel
def relativ_fogyasztas(v_uj, v_regi, f_uj, f_regi):
    return (v_uj / v_regi) ** 2 * (f_uj / f_regi)

esetek = [
    ("csak frekvencia felére", 1.0, 1.0, 1.0, 0.5),
    ("csak feszültség 0,8-szorosára", 1.0, 0.8, 1.0, 1.0),
    ("feszültség 0,8×, frekvencia ½", 1.0, 0.8, 1.0, 0.5),
]
for nev, v0, v1, f0, f1 in esetek:
    print(f"{nev:32} -> {relativ_fogyasztas(v1, v0, f1, f0) * 100:.0f} %")
```

## Összefoglalás

- SoC: teljes rendszer egy chipen – CPU (nagy + kicsi magok), GPU, NPU, DSP, memóriavezérlő, perifériák, modem; heterogén felépítés.
- IP-blokkok: soft (RTL) és hard (kész rajzolat); összekötésük AMBA buszokkal (AXI gyors, AHB közepes, APB lassú perifériák) vagy NoC-cal.
- FPGA-s SoC (Zynq): ARM processzor + programozható logika AXI-val.
- Energia: P = α·C·V<sup>2</sup>·f; órajelkapuzás (ICG cellával), tápkapuzás, DVFS; chipletek, RISC-V.

## A lecke feladata

```quiz required
? DVFS-sel a feszültség 1,0 V-ról 0,8 V-ra, a frekvencia a felére csökken. Az eredeti dinamikus fogyasztás hány százaléka marad?
= 32
! 0,8² · 0,5.

? Mi a különbség a soft és a hard IP-blokk között?
+ A soft IP szintetizálható HDL-kód, a hard IP egy adott technológiára már kész rajzolat.
- A soft IP szoftver, a hard IP hardver.
- A soft IP ingyenes, a hard IP fizetős.
- Nincs különbség.

? Melyik AMBA buszra kötnéd egy SoC lassú UART- és GPIO-perifériáit?
- AXI
- PCIe
+ APB
- DDR

? Mi az AMD/Xilinx Zynq?
- Egy csak processzort tartalmazó mikrokontroller.
+ FPGA-s SoC: ARM processzormagok és programozható logika egy chipen, AXI buszokkal összekötve.
- Egy memóriamodul-típus.
- Egy szimulátorprogram.

? Miért előnyös a SoC-ben a heterogén felépítés (GPU, NPU, DSP a CPU mellett)?
- Mert így kevesebb tranzisztor kell.
+ Mert minden feladatot az arra optimalizált egység végez, sokkal gyorsabban és takarékosabban, mint egy általános CPU-mag.
- Mert így a SoC újraprogramozható.
- Mert a CPU-magok nem tudnak számolni.

? Miért jobb a kihozatala a chipletes felépítésnek, mint egyetlen óriási chipnek?
- Mert a chipletek nagyobb órajelen működnek.
+ Mert egy kristályhiba csak egy kis lapkát tesz tönkre, és a kis lapkák között nagyobb a jók aránya.
- Mert a chipletekhez nem kell fotolitográfia.
- Mert a chipletek nem fogyasztanak.
```
