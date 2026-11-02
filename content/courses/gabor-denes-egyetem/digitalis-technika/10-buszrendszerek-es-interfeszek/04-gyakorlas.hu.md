---
title: Gyakorlás – Buszrendszerek és interfészek
summary: Ellenőrző kérdések és összefoglaló feladatlap: busz-alapfogalmak, sávszélesség, UART-keret és paritás, SPI, I²C, CAN, PCIe, DDR, differenciális jelátvitel.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a háromállapotú és a nyitott drain kimenet között?</summary>

A háromállapotú kimenet 0-t és 1-et is aktívan hajt, de egy engedélyező jellel nagyimpedanciás (Z) állapotba kapcsolható; egyszerre csak egy eszköz hajthatja a buszt. A nyitott drain kimenet csak lehúzni tud, a magas szintet a közös felhúzó ellenállás adja; így többen is „beszélhetnek” egyszerre rövidzár nélkül (huzalozott ÉS).

</details>

<details>
<summary>2. Miért nincs órajel-vezeték az UART-nál, és mégis hogyan tud a vevő mintavételezni?</summary>

Mert mindkét fél előre megegyezett sebességgel (baud) dolgozik. A vevő a startbit lefutó élével szinkronizál, majd minden bitidő közepén mintavételez. Ehhez a két órajelnek néhány %-on belül egyeznie kell; a stopbit után a következő startbit újra szinkronizál.

</details>

<details>
<summary>3. Mikor választanál SPI-t és mikor I²C-t?</summary>

SPI-t, ha nagy sebesség kell egy-két eszközzel (SD-kártya, kijelző, Flash): gyors és duplex, de slave-enként külön CS̅ vezeték kell. I²C-t, ha sok, lassabb eszközt (szenzorok, EEPROM, óra) kell kevés lábbal kezelni: két vezeték, címzés, ACK, de csak néhány száz kHz.

</details>

<details>
<summary>4. Miért kell kódolás (8b/10b, 128b/130b) a PCIe-nél?</summary>

Mert nincs külön órajel-vezeték: a vevő az adatfolyam jelváltásaiból állítja vissza az órajelet. A kódolás garantálja, hogy elég sűrűn legyen jelváltás, és a 0-k és 1-ek aránya kiegyenlített legyen. Ára a hatásfok: 8b/10b-nél 80 %, 128b/130b-nél kb. 98,5 %.

</details>

<details>
<summary>5. Miért maradt párhuzamos a memóriabusz, amikor szinte minden más soros lett?</summary>

Mert a memóriánál a legkisebb késleltetés a legfontosabb, és a modulok nagyon közel vannak a processzorhoz. Rövid, hossz-kiegyenlített vezetékekkel a 64 bites párhuzamos busz kezelhető, és a DDR órajelenként két átvitellel nagy sávszélességet ad sorosítás nélkül.

</details>

## Összefoglaló feladatlap

```quiz required
? Mekkora egy 64 bites, 200 MHz-es busz elméleti sávszélessége MB/s-ban (órajelenként egy átvitel)?
= 1600
! 64 bit = 8 bájt, 8 · 200.

? Hány bit egy UART-keret 8 adatbittel, páros paritással és 1 stopbittel (8E1)?
= 11
! start + 8 adat + paritás + stop.

? Páros paritást használunk. Mi a paritásbit a 1011 0010 adatbájthoz?
= 0
! Négy 1-es van, ez már páros.

? Egy kijelzőhöz 20 MHz-es, duplex adatkapcsolat kell egy panelen belül. Melyik interfész a legalkalmasabb?
- I²C
+ SPI
- CAN
- RS-232

? Egy PCIe 2.0 sáv 5 GT/s-mal visz, 8b/10b kódolással. Hány MB/s a hasznos adatsebesség egy irányban?
= 500
! 5 · 8/10 = 4 Gbit/s, osztva 8-cal.

? Mekkora egy DDR4-2400 modul (64 bit) elméleti sávszélessége MB/s-ban?
= 19200
= 19 200

? Egy autóban sok vezérlőegység kommunikál zajos környezetben, akár több méteren át. Melyik busz a megfelelő?
- SPI
- I²C
+ CAN
- párhuzamos busz

? Mi jellemzi a differenciális jelátvitelt?
- Egyetlen vezetéken viszi a jelet a földhöz képest.
+ A jelet két vezeték feszültségének különbsége hordozza, ezért a közös zaj kiesik.
- Kétszer akkora feszültséget használ, mint a TTL.
- Csak optikai szálon működik.
```
