---
title: A buszok alapjai
summary: A busz fogalma, párhuzamos és soros átvitel, szinkron és aszinkron átvitel, háromállapotú és nyitott drain kimenetek, master–slave és arbitráció, kézfogás, sávszélesség, duplex módok, differenciális jelátvitel.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **busz**, és miben különbözik a **párhuzamos** és a **soros** átvitel,
- a **szinkron** és az **aszinkron** átvitelt,
- hogyan osztozhat több eszköz egy vezetéken (**háromállapotú**, **nyitott drain** kimenet),
- mi a **master**, a **slave**, az **arbitráció** és a **kézfogás**,
- hogyan számolod a **sávszélességet**,
- a **duplex** módokat és a **differenciális** jelátvitelt.

## Mi a busz?

A **busz** vezetékek olyan csoportja, amelyen **több eszköz közösen** cserél adatot, egy közös **szabály** (protokoll) szerint. A 7. témakörben láttuk a processzor cím-, adat- és vezérlőbuszát; ugyanez az elv érvényes a chipek, a panelek és a számítógépek között is.

## Párhuzamos és soros átvitel

- **Párhuzamos:** egy szó minden bitje **külön vezetéken, egyszerre** megy (pl. 8 vagy 32 adatvonal). Kis távolságon egyszerű és gyors.
- **Soros:** a bitek **egymás után, egy (vagy kevés) vezetéken** mennek. Kevesebb vezeték, olcsóbb csatlakozó, nagy távolság.

Nagy sebességen a párhuzamos busz bajba kerül: a vezetékek késleltetése kissé eltér (**skew**), és egymást zavarják (**áthallás**) – ezért ma szinte minden gyors kapcsolat **soros** (PCIe, USB, SATA, Ethernet); ahol még nagyobb sebesség kell, több független soros „sávot” (lane) használnak egymás mellett.

## Szinkron és aszinkron átvitel

- **Szinkron:** külön **órajelvezeték** jelzi, mikor érvényes az adat (SPI, I²C, párhuzamos memóriabusz).
- **Aszinkron:** nincs közös órajel; az adó és a vevő **előre megegyezett sebességgel** dolgozik, és a vevő a keret elejéből szinkronizál (UART). A nagy sebességű soros vonalak az órajelet az adatfolyamba **ágyazzák** (órajel-visszanyerés, pl. 8b/10b kódolás).

## Osztozás egy vezetéken

Ha két normál (totem-pole) kimenet egyszerre hajtja ugyanazt a vezetéket, és ellentétes szintet adnak, rövidzár jön létre. Megoldások:

- **Háromállapotú (tri-state) kimenet:** a 0 és 1 mellett van egy **harmadik, nagyimpedanciás** (Z) állapot, amikor a kimenet „lekapcsolódik” a vezetékről. Egy **engedélyező** jel (OE̅) dönti el, melyik eszköz hajt; a többi Z-ben van. (Ilyen a 74245 busz-meghajtó és minden memória adatkimenete.)
- **Nyitott kollektoros / nyitott drain kimenet:** a kimenet csak **lehúzni** tud 0-ra, a magas szintet egy közös **felhúzó ellenállás** adja. Ha **bármelyik** eszköz lehúzza, a vonal 0 – ez a **huzalozott ÉS** (wired-AND). Nem lehet rövidzár, és bárki jelezhet (I²C, megszakításvonalak).

## Master, slave, arbitráció, kézfogás

- A **master** (kezdeményező) indítja az átvitelt és adja a címet; a **slave** (szolga) válaszol.
- Ha több master is van, az **arbitráció** dönti el, ki kapja meg a buszt (pl. prioritás alapján, vagy az I²C/CAN-nél bitenként: aki 0-t küld, „nyer”).
- **Kézfogás** (handshake): az adó és a vevő jelekkel visszaigazolja egymásnak, hogy az adat kész / átvéve (pl. READY–ACK, vagy az I²C ACK bitje). Így a lassabb eszköz is lépést tud tartani.

## Sávszélesség

A busz **elméleti sávszélessége** (adatátviteli sebessége):

**sávszélesség = szélesség (bit) × átviteli frekvencia**

Példa: 32 bites busz, 100 MHz, órajelenként egy átvitel → 3,2 Gbit/s = **400 MB/s**. A valóságban kevesebb: címzés, kézfogás, protokoll-többlet (overhead) is időt visz el.

## Duplex módok

| mód              | jelentés                                         | példa                     |
| ---------------- | ------------------------------------------------ | ------------------------- |
| **szimplex**     | csak egy irányba                                 | rádióadás                 |
| **fél-duplex**   | mindkét irányba, de **felváltva**                | I²C, RS-485, adóvevő      |
| **duplex** (full) | mindkét irányba **egyszerre**                   | UART (TX és RX), SPI, Ethernet |

## Differenciális jelátvitel

A jelet **két vezeték különbsége** hordozza (az egyik +, a másik −). A külső zaj mindkét vezetékre egyformán hat, így a **különbségben kiesik** (közös módusú zavarelnyomás). Ezért lehet vele nagy sebességet és nagy távolságot elérni kis feszültséglökettel: **LVDS**, **RS-485**, **CAN**, **USB**, **PCIe**, **Ethernet** – mind differenciális.

```python run
# Busz-sávszélesség és nyitott drain vonal (huzalozott ÉS) szimulációja
def savszelesseg(bit, f_hz, atvitel_per_orajel=1):
    return bit * f_hz * atvitel_per_orajel / 8 / 1e6      # MB/s

print("32 bit, 100 MHz:", savszelesseg(32, 100e6), "MB/s")
print("64 bit, 1600 MHz, DDR:", savszelesseg(64, 1600e6, 2), "MB/s")

# Nyitott drain: a vonal csak akkor 1, ha senki sem húzza le
lehuzzak = [0, 0, 1, 0]          # az eszközök: 1 = lehúzza a vonalat
vonal = int(not any(lehuzzak))
print("a vonal szintje:", vonal)
```

## Összefoglalás

- Busz: közös vezetékek, közös protokoll; párhuzamos (sok vezeték) vagy soros (kevés).
- Szinkron (órajellel) vagy aszinkron (megegyezett sebesség) átvitel.
- Osztozás: háromállapotú kimenet (OE̅, Z) vagy nyitott drain + felhúzó ellenállás (huzalozott ÉS).
- Sávszélesség = szélesség × frekvencia; differenciális jel: zajtűrő, gyors, messzire ér.

## A lecke feladata

```quiz required
? Mekkora egy 32 bites, 100 MHz-es busz elméleti sávszélessége MB/s-ban (órajelenként egy átvitellel)?
= 400
! 32 bit × 100 MHz = 3200 Mbit/s, osztva 8-cal.

? Mire való a háromállapotú (tri-state) kimenet?
- Három különböző feszültségszint előállítására.
+ Arra, hogy egy nem aktív eszköz nagyimpedanciás állapotban „lekapcsolódjon” a közös buszról.
- A jel erősítésére.
- A busz órajelének előállítására.

? Egy nyitott drain vonalra négy eszköz csatlakozik felhúzó ellenállással; az egyik lehúzza a vonalat, a többi nem. Mi a vonal logikai szintje?
= 0
! Huzalozott ÉS: elég egy lehúzó eszköz.

? Mit jelent a fél-duplex átvitel?
- Az adat csak egy irányba mehet.
+ Mindkét irány lehetséges, de csak felváltva.
- Mindkét irányba egyszerre megy az adat.
- Az adat fele elvész.

? Miért zajtűrő a differenciális jelátvitel?
- Mert nagyobb feszültséget használ.
+ Mert a külső zaj mindkét vezetékre egyformán hat, és a különbségben kiesik.
- Mert csak egy vezetéket használ.
- Mert lassabb.

? Miért váltották fel nagy sebességen a soros kapcsolatok a párhuzamos buszokat?
- Mert a soros átvitel mindig kevesebb energiát igényel.
+ Mert a sok párhuzamos vezeték eltérő késleltetése (skew) és áthallása korlátozza a sebességet.
- Mert a párhuzamos buszon nem lehet címezni.
- Mert a soros kapcsolat nem igényel protokollt.
```
