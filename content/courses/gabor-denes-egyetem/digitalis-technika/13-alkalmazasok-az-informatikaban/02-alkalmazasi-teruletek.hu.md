---
title: A digitális technika alkalmazási területei
summary: Hol találkozol a tanultakkal az informatikában – számítógép és adatközpont, háttértárak és hibajavítás (ECC), hálózatok, beágyazott rendszerek és IoT, járművek, hardveres gyorsítók (GPU, TPU, FPGA a felhőben), mesterséges intelligencia, kriptográfia és hardverbiztonság.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hol jelennek meg a tárgy témakörei a mai **informatikában**,
- hogyan véd a **hibajavító kód** (ECC) a memóriákban és háttértárakban,
- miért gyorsabbak a **hardveres gyorsítók** (GPU, TPU, FPGA) a CPU-nál bizonyos feladatokra,
- milyen szerepe van a digitális hardvernek a **mesterséges intelligenciában** és a **biztonságban**.

## A számítógép belül

Egy mai PC vagy szerver szinte minden témakört egyszerre használ:

- **processzor** (7. témakör): összeadók, ALU, regiszterek, állapotgépes vezérlés, gyorsítótár – milliárdnyi CMOS tranzisztor (12. témakör);
- **memória** (5. témakör): SRAM a gyorsítótárban, DRAM a modulokon, DDR busszal (10. témakör);
- **buszok és interfészek** (10. témakör): PCIe, USB, SATA, NVMe;
- **órajel és időzítés** (11. témakör): a maximális órajel a kritikus úttól függ.

## Háttértárak és hibajavítás

- Az **SSD**-k **flash memóriában** tárolnak (5. témakör), a vezérlőjük egy saját SoC, amely a kopáskiegyenlítést és a hibajavítást végzi.
- A szerverek memóriája **ECC**-s: minden 64 adatbit mellé 8 ellenőrző bit kerül (**SECDED** – egy hibát javít, kettőt jelez), a 2. témakörben tanult Hamming-kód kiterjesztésével. Egy egyhibajavító Hamming-kódhoz annyi (k) ellenőrző bit kell, hogy **2<sup>k</sup> ≥ adatbitek + k + 1** teljesüljön: 64 adatbithez k = 7 (128 ≥ 72), a kettős hiba jelzéséhez még egy paritásbit → 8.
- A **CRC** (2. témakör) minden Ethernet-keretben, USB-csomagban, fájltömörítőben ott van a hibák **jelzésére**.

## Hálózatok és kommunikáció

A hálózati kártyák, kapcsolók és routerek nagy sebességű **soros, differenciális** kapcsolatokat (10. témakör) használnak, a csomagok feldolgozását pedig sokszor **dedikált hardver** (ASIC vagy FPGA) végzi vonalsebességgel – egy 100 Gbit/s-os porton másodpercenként több mint 100 millió csomag is érkezhet, ezt szoftver nem győzné. A mobil- és Wi-Fi-eszközök **digitális jelfeldolgozással** (előző lecke) modulálnak és szűrnek.

## Beágyazott rendszerek és IoT

A **mikrokontrollerek** (7. témakör) mindenhol ott vannak: háztartási gépek, okosórák, szenzorok, ipari vezérlők. Jellemző feladatuk: szenzorok olvasása **ADC**-vel vagy **I²C/SPI**-n (8., 10. témakör), döntés (gyakran **állapotgéppel**, 6. témakör), beavatkozás (PWM, DAC), kommunikáció (UART, Wi-Fi, Bluetooth). Az **IoT** (internet of things) eszközöknél a legfontosabb a kis fogyasztás: alvó üzemmódok, órajel- és tápkapuzás (12. témakör).

## Járművek

Egy mai autóban 50–100 **vezérlőegység** (ECU) van, amelyek **CAN** buszon (10. témakör) kommunikálnak: motorvezérlés, ABS, légzsák, ablakemelő. A vezetéstámogató rendszerek (kamera, radar) képfeldolgozását nagy teljesítményű SoC-k és gyorsítók végzik, a biztonságkritikus részeket pedig szigorú szabványok szerint tervezik és tesztelik.

## Hardveres gyorsítók

A CPU általános célú, sorban végrehajtja az utasításokat. Ha egy feladat **sok egyforma, független** műveletből áll, a párhuzamos hardver sokkal gyorsabb:

- **GPU:** több ezer egyszerű számolómag – grafika, tudományos számítás, MI-tanítás.
- **TPU, NPU:** a neurális hálók mátrixszorzására szabott ASIC-ek, szorzó-összeadó (MAC) egységek tömbjével (**szisztolikus tömb**).
- **FPGA a felhőben és az adatközpontban:** a nagy felhőszolgáltatók FPGA-kat kínálnak bérelhető gyorsítóként, és FPGA-k vannak az okos hálózati kártyákban (SmartNIC) is – a hálózati és tárolási feladatokat a CPU helyett hardver végzi.

**Példa:** egy FPGA-ban 100 DSP-blokk dolgozik párhuzamosan 200 MHz-en, mindegyik órajelenként egy MAC-műveletet végez → 100 · 200 · 10<sup>6</sup> = 2 · 10<sup>10</sup> MAC/s = **20 GMAC/s**.

## Mesterséges intelligencia

A neurális hálók számításának túlnyomó része **szorzás és összeadás** (mátrixszorzás). A gyorsítók ezért:

- rengeteg MAC-egységet tartalmaznak,
- **kis bitszélességű** számokkal dolgoznak (8 bites egész – INT8 –, vagy 16 bites lebegőpontos számok) – egy 8 bites szorzó sokkal kisebb és takarékosabb, mint egy 32 bites,
- a memória-sávszélességet tartják szűk keresztmetszetnek, ezért nagy chipen belüli memóriával és gyors memóriainterfésszel (HBM) rendelkeznek.

## Kriptográfia és hardverbiztonság

- **Titkosítás hardverben:** a processzorokban külön utasítások és áramkörök gyorsítják az AES-titkosítást; a hash-számítást (pl. SHA-256) ASIC-ek végzik nagy sebességgel.
- **Valódi véletlenszám-generátor** (TRNG): fizikai zajforrásból (1. témakör, előző lecke) állít elő véletlen biteket a kulcsokhoz – a szoftveres álvéletlen generátor erre nem elég biztonságos.
- **PUF** (physically unclonable function): a gyártási szórásból adódó egyedi „ujjlenyomat” minden chipben – lemásolhatatlan azonosító.
- **Hardverbiztonság:** a chip fogyasztásából vagy elektromágneses kisugárzásából kinyerhető a titkos kulcs (oldalcsatornás támadás), ezért a kriptográfiai áramköröket ez ellen is védeni kell.

```python run
# Hány ellenőrző bit kell egy egyhibajavító Hamming-kódhoz? (2^k >= m + k + 1)
def hamming_ellenorzo_bitek(m):
    k = 0
    while 2 ** k < m + k + 1:
        k += 1
    return k

for m in (4, 8, 16, 32, 64):
    k = hamming_ellenorzo_bitek(m)
    print(f"{m:2} adatbit -> {k} ellenőrző bit (SECDED: {k + 1})")

# Gyorsító teljesítménye: DSP-blokkok × órajel
dsp, f = 100, 200e6
print("FPGA:", dsp * f / 1e9, "GMAC/s")
```

## Összefoglalás

- A számítógép minden szintjén a tárgy témakörei dolgoznak: CMOS, ALU, tárolók, buszok, időzítés.
- ECC: Hamming-kód (2<sup>k</sup> ≥ m + k + 1), 64 adatbithez 7 + 1 ellenőrző bit; CRC a hibák jelzésére.
- Hálózatok, IoT, járművek (CAN), gyorsítók (GPU, TPU, FPGA), MI (sok MAC, kis bitszélesség).
- Biztonság: hardveres AES, TRNG, PUF, oldalcsatornás támadások elleni védelem.

## A lecke feladata

```quiz required
? Hány ellenőrző bit kell egy egyhibajavító Hamming-kódhoz 64 adatbit esetén?
= 7
! A legkisebb k, amelyre 2^k ≥ 64 + k + 1.

? Egy FPGA-ban 100 DSP-blokk dolgozik párhuzamosan 200 MHz-en, mindegyik órajelenként egy MAC-műveletet végez. Hány GMAC/s a teljesítmény?
= 20

? Miért gyorsabb egy GPU vagy egy TPU a CPU-nál a neurális hálók számításában?
- Mert nagyobb az órajel-frekvenciája.
+ Mert rengeteg egyszerű számolóegysége (MAC) párhuzamosan dolgozik a sok egyforma, független műveleten.
- Mert nincs szüksége memóriára.
- Mert lebegőpontos számok helyett szöveggel számol.

? Milyen buszon kommunikálnak egymással egy autó vezérlőegységei?
- SPI
- PCIe
+ CAN
- HDMI

? Miért használnak az MI-gyorsítók gyakran 8 bites egész (INT8) számokat?
- Mert a neurális hálók csak egész számokkal működnek.
+ Mert egy 8 bites szorzó sokkal kisebb és takarékosabb, így ugyanakkora chipen sokkal több fér el, és a pontosság a legtöbb feladathoz elég.
- Mert a 32 bites számokat nem lehet szorozni.
- Mert így nem kell memória.

? Mi a valódi véletlenszám-generátor (TRNG) forrása?
- egy előre eltárolt számsorozat
+ egy fizikai zajforrás
- a processzor órajele
- a felhasználó jelszava
```
