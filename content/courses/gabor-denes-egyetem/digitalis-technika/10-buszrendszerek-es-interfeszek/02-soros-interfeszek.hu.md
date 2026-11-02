---
title: Soros interfészek – UART, SPI, I²C, CAN, USB
summary: Az UART keretformátuma és sebessége, paritás, RS-232 és RS-485; az SPI négy vezetéke és üzemmódjai; az I²C címzése, START/STOP és ACK; a CAN és az USB főbb jellemzői.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- az **UART** keretét, a **baud**-ot és a **paritásbitet**,
- az **SPI** vezetékeit és működését,
- az **I²C** címzését, START/STOP feltételét és az ACK bitet,
- a **CAN** és az **USB** legfontosabb jellemzőit,
- hogyan válassz interfészt egy feladathoz.

## UART – aszinkron soros port

Az **UART** (universal asynchronous receiver/transmitter) két adatvezetéket használ: **TX** (adás) és **RX** (vétel), keresztbe kötve (az egyik TX-e a másik RX-ére), plusz közös föld. **Nincs órajel**: mindkét fél előre beállított sebességgel (**baud** – bit/s) dolgozik, pl. 9600, 115 200.

**Keret (8N1 – 8 adatbit, nincs paritás, 1 stopbit):**

```text
nyugalmi  start  D0 D1 D2 D3 D4 D5 D6 D7  stop  nyugalmi
 1 1 1     0     ← adatbitek, LSB elöl →   1     1 1 1
```

- Nyugalomban a vonal **1** (magas).
- A **startbit (0)** lefutó éle szinkronizálja a vevőt; a vevő ezután a bitidő közepén mintavételez.
- Az adatbitek a **legkisebb helyiértékű bittel kezdve** (LSB first) mennek.
- Opcionális **paritásbit** (2. témakör): **páros** paritásnál úgy egészíti ki az adatot, hogy az 1-esek száma páros legyen.
- A **stopbit (1)** visszaállítja a nyugalmi szintet.

8N1-nél egy bájt **10 bit** → 9600 baud = **960 bájt/s**. Az adó és a vevő órajelének néhány %-on belül egyeznie kell.

**Feszültségszintek:** a mikrokontroller UART-ja **TTL/CMOS** szintű (0 / 3,3 V vagy 5 V). Az **RS-232** (régi PC soros port) ±3…±15 V-ot és **fordított** logikát használ – illesztő IC kell (MAX232). Az **RS-485** differenciális, fél-duplex, több eszközös busz akár 1200 m-ig (ipari automatizálás, Modbus). USB-s gépekhez USB–UART átalakító chip kell (pl. CH340, FT232).

## SPI – soros periféria interfész

Az **SPI** (serial peripheral interface) **szinkron**, **duplex**, **egy master – több slave** felépítésű, rövid távolságra (egy panelen belül).

| vezeték     | jelentés                                             |
| ----------- | ---------------------------------------------------- |
| **SCLK**    | órajel – a master adja                               |
| **MOSI**    | master out, slave in – adat a slave felé             |
| **MISO**    | master in, slave out – adat a master felé            |
| **CS̅** (SS̅) | chip select – aktív alacsony, **slave-enként külön** |

- Minden órajelnél **egyszerre** megy egy bit mindkét irányba: a két eszköz léptetőregisztere (5. témakör) körbe van kötve.
- Négy üzemmód (**CPOL**, **CPHA**: az órajel nyugalmi szintje és a mintavételezés éle) – az adatlap szerint kell beállítani.
- **Gyors** (több tíz MHz), egyszerű, de slave-enként egy újabb CS̅ vezeték kell, és nincs visszaigazolás.
- Használat: SD-kártya, kijelzők, Flash memóriák, ADC-k.

## I²C – kétvezetékes busz

Az **I²C** (inter-integrated circuit, „I-négyzet-C”) csak **két vezetéket** használ: **SDA** (adat) és **SCL** (órajel). Mindkettő **nyitott drain** felhúzó ellenállással (előző lecke) → sok eszköz, sőt több master is lehet ugyanazon a buszon.

- Minden slave-nek **7 bites címe** van (2<sup>7</sup> = 128 cím, ebből néhány fenntartott); a master a címmel szólítja meg.
- **START feltétel:** SDA lefut, miközben SCL magas. **STOP:** SDA felfut, miközben SCL magas. (Adat közben SDA csak akkor változhat, amikor SCL alacsony.)
- Egy átvitel: START → 7 bites cím + **R/W̅** bit → **ACK** (a slave lehúzza SDA-t: „itt vagyok”) → adatbájtok, mindegyik után ACK → STOP.
- **Fél-duplex**, sebessége 100 kHz (standard), 400 kHz (fast), 1 MHz (fast plus).
- Használat: szenzorok (hőmérő, gyorsulásmérő), EEPROM, valós idejű óra, kis kijelzők.

## CAN – autóipari busz

A **CAN** (controller area network) **differenciális** két vezetéken (CAN_H, CAN_L) működő, több masteres busz, a **járművek** és az ipar szabványa.

- Nem eszközt, hanem **üzenetet** azonosít (11 vagy 29 bites azonosító); minden csomópont minden üzenetet lát, és eldönti, kell-e neki.
- **Bitenkénti arbitráció:** a domináns 0 felülírja a recesszív 1-et (mint a huzalozott ÉS), így ütközéskor a **kisebb azonosítójú (fontosabb)** üzenet veszteség nélkül folytatódik.
- Erős hibakezelés (CRC, visszaigazolás, hibás csomópont lekapcsolása); 1 Mbit/s-ig (CAN FD: több).

## USB

Az **USB** (universal serial bus) a számítógépes perifériák szabványa: **differenciális** adatpár (D+, D−), **host–eszköz** felépítés (a host vezérel mindent), tápellátás a kábelen, **plug and play** (az eszköz bemutatkozik, a host betölti a meghajtót).

| változat | sebesség                |
| -------- | ----------------------- |
| USB 1.1  | 12 Mbit/s (Full Speed)  |
| USB 2.0  | 480 Mbit/s (High Speed) |
| USB 3.x  | 5–20 Gbit/s             |
| USB4     | 40–80 Gbit/s            |

## Melyiket válasszam?

| szempont           | UART                    | SPI                  | I²C           | CAN                    |
| ------------------ | ----------------------- | -------------------- | ------------- | ---------------------- |
| vezetékek (+ föld) | 2 (TX, RX)              | 3 + slave-enként 1   | 2             | 2 (differenciális)     |
| órajel             | nincs                   | van                  | van           | nincs (bitidőzítés)    |
| eszközök           | 2 (pont–pont)           | 1 master, több slave | sok (címzés)  | sok (üzenet-azonosító) |
| sebesség           | ~ 1 Mbit/s              | több 10 Mbit/s       | 0,1–1 Mbit/s  | 1 Mbit/s (FD: több)    |
| távolság           | rövid (RS-485-tel nagy) | panelen belül        | panelen belül | akár 1 km              |

```python run
# Egy UART-keret (8N1, LSB elöl) és a páros paritás kiszámítása
def uart_keret(bajt, paritas=False):
    adat = [(bajt >> i) & 1 for i in range(8)]          # LSB elöl
    keret = [0] + adat                                  # startbit
    if paritas:
        keret.append(sum(adat) % 2)                     # páros paritás: az 1-esek száma páros lesz
    return keret + [1]                                  # stopbit

k = uart_keret(0x41)                                    # 'A' = 0100 0001
print("'A' kerete (8N1):", "".join(map(str, k)), "-", len(k), "bit")
print("9600 baud, 8N1:", 9600 // 10, "bájt/s")
print("páros paritással:", "".join(map(str, uart_keret(0x41, True))))
```

## Összefoglalás

- UART: aszinkron, TX/RX, start (0) + 8 adatbit LSB elöl + (paritás) + stop (1); 8N1 = 10 bit/bájt.
- SPI: szinkron, duplex, SCLK, MOSI, MISO, CS̅ (slave-enként); gyors, panelen belül.
- I²C: SDA + SCL, nyitott drain, 7 bites cím, START/STOP, ACK; sok eszköz két vezetéken.
- CAN: differenciális, üzenet-azonosító, bitenkénti arbitráció – járművek; USB: host–eszköz, differenciális.

## A lecke feladata

```quiz required
? Hány bitből áll egy UART-keret 8N1 beállításnál (start, 8 adat, stop)?
= 10

? Hány bájtot visz át másodpercenként egy 9600 baudos, 8N1 beállítású UART?
= 960

? Az UART a 0100 0001 (0x41) bájtot küldi. Milyen sorrendben mennek a 8 adatbit? (Írd egybe, az elsőként küldött bittel kezdve!)
= 10000010
! Az UART a legkisebb helyiértékű bittel kezdi.

? Páros paritást használunk. Mi a paritásbit értéke a 1101101 adatnál?
= 1
! Öt 1-es van; párosra kell kiegészíteni.

? Hány vezeték kell az SPI-hez egyetlen slave esetén (a földet nem számolva)?
= 4
! SCLK, MOSI, MISO, CS̅.

? Hány különböző címet lehet kifejezni az I²C 7 bites címével?
= 128

? Miért kell felhúzó ellenállás az I²C busz vezetékeire?
- Mert az I²C differenciális.
+ Mert a csatlakozó eszközök kimenetei nyitott drainesek, csak lehúzni tudnak.
- Mert így gyorsabb az órajel.
- Mert a felhúzó ellenállás adja a címet.

? Mi történik a CAN buszon, ha két csomópont egyszerre kezd adni?
- Mindkét üzenet elvész, újra kell kezdeni.
+ A bitenkénti arbitráció miatt a kisebb azonosítójú üzenet veszteség nélkül folytatódik.
- A nagyobb feszültségű csomópont nyer.
- A busz leáll.
```
