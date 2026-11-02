---
title: Az FPGA felépítése és a tervezési folyamat
summary: CLB, LUT és flip-flop, kapcsolóhálózat, blokk-RAM, DSP, PLL és I/O blokkok; a tervezés lépései a HDL-kódtól a bitstreamig; lábkiosztás XDC és QSF fájllal; FPGA és mikrokontroller összevetése.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- az FPGA **építőelemeit** (CLB, kapcsolóhálózat, blokk-RAM, DSP, PLL, I/O),
- a tervezés lépéseit a **HDL-kódtól a bitstreamig**,
- hogyan kötöd a terv jeleit az FPGA **lábaihoz** (XDC, QSF),
- miben más az FPGA, mint egy **mikrokontroller**.

## Az FPGA építőelemei

1. **Konfigurálható logikai blokkok (CLB):** LUT-ok, D flip-flopok, gyors átvitelláncok (carry chain – összeadókhoz) és multiplexerek. Ezekből lesz a kombinációs és sorrendi logika: állapotgépek, számlálók, aritmetika.
2. **Programozható kapcsolóhálózat** (interconnect): a cellák közötti vezetékek és kapcsolók – a chip területének nagy része ez.
3. **Blokk-RAM (BRAM):** beépített, néhány kilobites SRAM-blokkok pufferekhez, FIFO-khoz, táblázatokhoz.
4. **DSP blokkok:** gyors szorzó–összeadó egységek jelfeldolgozáshoz (szűrők, FFT, AI).
5. **Órajel-kezelés:** PLL/MMCM (fáziszárt hurok) – órajel szorzása, osztása, fáziseltolása; külön órajelhálózat, hogy az órajel minden flip-flophoz egyszerre érjen.
6. **I/O blokkok (IOB):** a lábak meghajtói, sokféle feszültségszabvánnyal (LVCMOS33, LVDS …), nagy sebességű soros adó-vevőkkel (PCIe, Ethernet).
7. Egyes családokban **beépített processzor** is van (pl. Xilinx Zynq: ARM magok + FPGA) – ez a **SoC FPGA** (12. témakör).

**Gyártók:** AMD (Xilinx) – Spartan, Artix, Kintex, Virtex, Zynq, fejlesztőeszköz: **Vivado**; Intel (Altera) – Cyclone, Arria, Stratix, fejlesztőeszköz: **Quartus**; Lattice (kis fogyasztású, nyílt forrású eszközlánc is), Microchip (Microsemi).

## A tervezési folyamat

1. **Specifikáció és leírás HDL-ben** (VHDL vagy Verilog) – vagy kapcsolási rajzzal, IP-blokkokkal.
2. **Funkcionális szimuláció** testbench-csel (11. témakör): jól működik-e a logika?
3. **Szintézis:** a HDL-leírásból **kapuszintű hálózat** (netlista) lesz – LUT-ok, flip-flopok, BRAM, DSP. A program itt egyszerűsít (mint a K-tábla, csak gépiesen).
4. **Implementáció:** **elhelyezés** (place – melyik cellába kerüljön) és **huzalozás** (route – melyik vezetéken menjenek a jelek).
5. **Időzítési elemzés** (static timing analysis): teljesül-e minden úton a T ≥ t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub> (4. témakör) a megadott órajelre?
6. **Bitstream** generálása – a konfigurációs fájl.
7. **Konfigurálás:** a bitstream letöltése JTAG-en az FPGA-ba (vagy a konfigurációs Flash-be), majd **tesztelés** a valós hardveren (logikai analizátor, beépített ILA).

## Lábkiosztás (pin mapping)

A HDL-kód csak **logikai portokat** ír le (clk, rst, led …). Hogy ezek melyik **fizikai lábra** kerüljenek és milyen feszültségszinten, azt egy külön **kényszerfájl** (constraint file) adja meg – ez a panel kapcsolási rajzából következik.

**Xilinx – XDC** (Tcl-parancsok):

```tcl
# Órajel a K17-es lábon, 3,3 V-os CMOS szinttel
set_property PACKAGE_PIN K17 [get_ports clk]
set_property IOSTANDARD LVCMOS33 [get_ports clk]
create_clock -period 8.000 -name sys_clk [get_ports clk] ;# 125 MHz

# Reset és egy busz 0. bitje
set_property PACKAGE_PIN L18 [get_ports rst]
set_property IOSTANDARD LVCMOS33 [get_ports rst]
set_property PACKAGE_PIN P15 [get_ports {data_in[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {data_in[0]}]
```

- **PACKAGE_PIN**: a fizikai láb; **IOSTANDARD**: a feszültségszabvány (LVCMOS33 = 3,3 V-os CMOS).
- **create_clock**: megadja az órajel periódusát – ebből tudja az időzítési elemző, mekkora késleltetés megengedett.
- Két Tcl-csapda: a sor végi megjegyzés elé **`;`** kell (`;# …`), különben a `#` nem megjegyzés; a busz bitjét **kapcsos zárójelbe** kell tenni (`{data_in[0]}`), mert a szögletes zárójel Tcl-ben parancsot jelent.
- A régebbi Xilinx eszközök (ISE) **UCF** formátumot használtak: `NET "clk" LOC = K17 | IOSTANDARD = LVCMOS33;`

**Intel – QSF** (Quartus):

```tcl
# Lábkiosztás az Intel Quartusban
set_location_assignment PIN_A1 -to clk
set_location_assignment PIN_B2 -to rst
set_location_assignment PIN_C3 -to data_in[0]
set_instance_assignment -name IO_STANDARD "3.3-V LVCMOS" -to clk
```

Mindkét eszköz grafikus lábkiosztó felületet is ad, és hibát jelez, ha egy port nincs lábhoz rendelve.

## FPGA vagy mikrokontroller?

|                     | **FPGA**                                         | **mikrokontroller**                           |
| ------------------- | ------------------------------------------------ | --------------------------------------------- |
| működés             | **hardveres párhuzamosság** – minden egyszerre fut | szoftver, utasításonként, sorban            |
| „programozás”       | hardver leírása (HDL)                            | program írása (C, Python, assembly)           |
| rugalmasság         | teljesen egyedi logika, egyedi interfészek       | fix perifériák                                |
| időzítés            | ns pontosságú, determinisztikus                  | µs, megszakítások miatt kevésbé kiszámítható  |
| fogyasztás, ár, bonyolultság | nagyobb                                 | kisebb, olcsóbb, egyszerűbb                   |

Gyakran **együtt** használják: az FPGA végzi a gyors, párhuzamos jelfeldolgozást, a processzor a vezérlést és a kommunikációt.

## Összefoglalás

- FPGA = CLB-k (LUT + FF) + kapcsolóhálózat + BRAM + DSP + PLL + I/O.
- Folyamat: HDL → szimuláció → szintézis → elhelyezés és huzalozás → időzítési elemzés → bitstream → konfigurálás.
- Lábkiosztás: XDC (Xilinx, Tcl), QSF (Intel); PACKAGE_PIN, IOSTANDARD, create_clock.
- FPGA: hardveres párhuzamosság; mikrokontroller: szoftveres, soros végrehajtás.

## A lecke feladata

```quiz required
? Mi történik a szintézis során?
- A bitstream letöltése az FPGA-ba.
+ A HDL-leírásból kapuszintű hálózat (LUT-ok, flip-flopok) lesz.
- A cellák elhelyezése és a vezetékek kiválasztása.
- A kész áramkör mérése logikai analizátorral.

? Melyik a tervezési lépések helyes sorrendje?
- szintézis → HDL-leírás → bitstream → elhelyezés és huzalozás
+ HDL-leírás → szintézis → elhelyezés és huzalozás → bitstream
- bitstream → szintézis → HDL-leírás → konfigurálás
- elhelyezés és huzalozás → HDL-leírás → szintézis → bitstream

? Az XDC fájlban melyik tulajdonság adja meg a port fizikai lábát?
+ PACKAGE_PIN
- IOSTANDARD
- create_clock
- LOC_VOLTAGE

? Egy XDC-fájlban az órajel: create_clock -period 8.000. Hány MHz az órajel frekvenciája?
= 125
! f = 1 / 8 ns.

? Mire valók az FPGA DSP blokkjai?
- A konfiguráció tárolására.
+ Gyors szorzásra és összeadásra (szűrők, FFT, AI).
- Az órajel előállítására.
- A lábak feszültségszintjének illesztésére.

? Miben különbözik alapvetően az FPGA a mikrokontrollertől?
- Az FPGA-t C nyelven programozzuk.
+ Az FPGA-ban a leírt hardver párhuzamosan működik, a mikrokontroller utasításonként, sorban hajtja végre a programot.
- A mikrokontroller mindig gyorsabb.
- Az FPGA-nak nincs órajele.
```
