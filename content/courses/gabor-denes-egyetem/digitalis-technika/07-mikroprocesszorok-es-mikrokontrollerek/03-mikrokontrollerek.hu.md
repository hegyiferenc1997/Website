---
title: Mikrokontrollerek és illesztésük
summary: A mikrokontroller felépítése, perifériák (GPIO, időzítő, PWM, ADC, soros portok, watchdog), regiszterbitek kezelése maszkokkal, ismert családok, feszültségszint-illesztés 3,3 V és 5 V között.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **mikroprocesszor** és a **mikrokontroller** között,
- a mikrokontroller jellemző **perifériáit**,
- hogyan állítasz be egy-egy **regiszterbitet** maszkokkal (OR, AND, XOR),
- az ismert **mikrokontroller-családokat**,
- hogyan **illesztesz** össze eltérő tápfeszültségű áramköröket.

## Mikroprocesszor és mikrokontroller

- A **mikroprocesszor** (MPU) csak a CPU-t tartalmazza; memória, perifériák külön chipeken vannak (pl. PC-processzor). Nagy teljesítmény, összetett rendszer.
- A **mikrokontroller** (MCU) egy chipen tartalmazza a **CPU-t, a program- (Flash) és adatmemóriát (SRAM), sokszor EEPROM-ot, és a perifériákat**. Kicsi, olcsó, kevés energiát fogyaszt – egy egész vezérlő egyetlen tokban. **Beágyazott rendszerek** (mosógép, autó, okosóra, IoT-eszközök) agya.

## Jellemző perifériák

| periféria            | feladata                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| **GPIO** (általános célú be/kimenet) | lábanként állítható irány (be/ki), belső **felhúzó ellenállás** (pull-up), nyitott drain |
| **időzítő/számláló** (timer) | időmérés, periodikus megszakítás, külső impulzusok számlálása (5. témakör számlálói) |
| **PWM**              | impulzusszélesség-moduláció: LED fényerő, motorsebesség, „analóg” kimenet       |
| **ADC**              | analóg–digitális átalakító (8. témakör): szenzorok feszültségének mérése        |
| **UART, SPI, I²C, CAN, USB** | soros kommunikáció (10. témakör)                                        |
| **watchdog** (őrkutya-időzítő) | ha a program „lefagy”, és nem nullázza időben, **újraindítja** a rendszert |
| **megszakításvezérlő** | perifériák eseményeinek prioritásos kezelése                                 |
| **alvó üzemmódok**   | elemes eszközökben µA-es fogyasztás, ébresztés megszakítással                   |

**PWM:** a kimenet egy periódus D-ed részében magas. Az átlagfeszültség **U<sub>átlag</sub> = D · U<sub>táp</sub>** – pl. 5 V és 25 % kitöltés → **1,25 V**. Egy RC-szűrővel valódi analóg jel lesz belőle (8. témakör).

## Regiszterbitek kezelése

A perifériákat **regiszterek** bitjei vezérlik (pl. egy port 8 lábának iránya egy 8 bites regiszter). Egy bitet úgy kell módosítani, hogy a többi **ne változzon** – erre valók a bitenkénti műveletek és a **maszkok**:

| művelet           | kifejezés                   | példa (n = 3)                         |
| ----------------- | --------------------------- | ------------------------------------- |
| bit **beállítása** (1) | `reg = reg OR (1 << n)`    | 0000 0001 OR 0000 1000 = **0000 1001** |
| bit **törlése** (0)    | `reg = reg AND NOT (1 << n)` | 1011 1111 AND 1111 0111 = **1011 0111** |
| bit **átbillentése**   | `reg = reg XOR (1 << n)`   | 0000 1001 XOR 0000 1000 = 0000 0001   |
| bit **vizsgálata**     | `(reg AND (1 << n)) ≠ 0`   | „be van-e kapcsolva”                  |

Ezek a 3. témakör azonosságain alapulnak: X + 1 = 1, X · 0 = 0, X ⊕ 1 = X̅, és a 0 / 1 mellett a többi bit változatlan marad.

## Ismert családok

| család                     | jellemző                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| **AVR** (ATmega328P – Arduino Uno) | 8 bites RISC, Harvard; 16 MHz, 32 KB Flash, 2 KB SRAM, 1 KB EEPROM |
| **PIC** (Microchip)        | 8–32 bites, ipari alkalmazásokban elterjedt                             |
| **ARM Cortex-M** (pl. STM32) | 32 bites, széles választék M0-tól M7-ig, ipari és autóipari          |
| **ESP32** (Espressif)      | 32 bites, kétmagos, **Wi-Fi és Bluetooth** beépítve – IoT              |
| **RP2040** (Raspberry Pi Pico) | kétmagos Cortex-M0+, programozható I/O (PIO)                      |

## Feszültségszint-illesztés

Egy jel csak akkor értelmezhető helyesen, ha a meghajtó **kimeneti** szintjei a vevő **bemeneti** határain belül vannak (1. témakör):

- **V<sub>OH</sub> ≥ V<sub>IH</sub>** és **V<sub>OL</sub> ≤ V<sub>IL</sub>**

Tipikus értékek:

| család                | V<sub>IH</sub> (min) | V<sub>IL</sub> (max) | V<sub>OH</sub> (min) | V<sub>OL</sub> (max) |
| --------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| TTL (5 V)             | 2,0 V                | 0,8 V                | 2,4 V                | 0,4 V                |
| CMOS (5 V)            | 3,5 V (0,7 · V<sub>CC</sub>) | 1,5 V        | ≈ 4,9 V              | ≈ 0,1 V              |
| LVCMOS (3,3 V)        | 2,0 V                | 0,8 V                | ≈ 2,4–3,3 V          | 0,4 V                |

Következmények:

- **3,3 V → 5 V CMOS bemenet:** a 3,3 V **kevesebb**, mint a 3,5 V-os V<sub>IH</sub> – nem megbízható! Megoldás: **szintillesztő** (pl. **TXS0108E** kétirányú, **74LVC245** egyirányú), TTL-bemenetű HCT IC, vagy tranzisztoros illesztés.
- **5 V → 3,3 V bemenet:** a túl nagy feszültség **tönkreteheti** a bemenetet (ha nem „5 V-tűrő”). Megoldás: ellenállásosztó, szintillesztő IC.
- **Nyitott kollektoros / nyitott drain kimenet** felhúzó ellenállással: a felhúzás a **vevő** tápjára köthető – így az I²C busz is többféle tápfeszültségen működhet.
- **Totem-pole** (ellenütemű) kimenet: aktívan húz fel és le is, gyors, de két ilyen kimenet nem köthető össze.

```python run
# Regiszterbitek beállítása, törlése és átbillentése maszkokkal
def kiir(nev, ertek):
    print(f"{nev:12} {ertek:08b}")

reg = 0b00000001
kiir("kezdet", reg)
reg |= 1 << 3                 # 3. bit beállítása
kiir("3. bit = 1", reg)
reg &= ~(1 << 0) & 0xFF       # 0. bit törlése
kiir("0. bit = 0", reg)
reg ^= 1 << 7                 # 7. bit átbillentése
kiir("7. bit XOR", reg)
print("3. bit be van kapcsolva?", bool(reg & (1 << 3)))
```

## Összefoglalás

- MCU = CPU + Flash + SRAM (+ EEPROM) + perifériák egy chipen; beágyazott rendszerek.
- Perifériák: GPIO, timer, PWM (U<sub>átlag</sub> = D · U<sub>táp</sub>), ADC, soros portok, watchdog.
- Bitkezelés: beállítás OR-ral, törlés AND NOT-tal, átbillentés XOR-ral.
- Illesztés: V<sub>OH</sub> ≥ V<sub>IH</sub>, V<sub>OL</sub> ≤ V<sub>IL</sub>; 3,3 V ↔ 5 V között szintillesztő.

## A lecke feladata

```quiz required
? Mi különbözteti meg a mikrokontrollert a mikroprocesszortól?
- A mikrokontrollerben nincs ALU.
+ A mikrokontroller egy chipen tartalmazza a CPU-t, a memóriákat és a perifériákat.
- A mikrokontroller csak analóg jeleket dolgoz fel.
- A mikroprocesszor mindig lassabb.

? Egy regiszter értéke 00000001. Mi lesz az értéke, ha a 3. bitet OR művelettel beállítjuk? (8 biten)
= 00001001

? Egy regiszter értéke 10110111. Mi lesz az értéke, ha a 0. bitet töröljük (AND 11111110)? (8 biten)
= 10110110

? Mire való a watchdog időzítő?
- A pontos idő mérésére.
+ Ha a program lefagy, és nem nullázza időben, újraindítja a rendszert.
- A PWM jel előállítására.
- Az órajel frekvenciájának növelésére.

? Egy 5 V-os PWM kimenet kitöltési tényezője 25 %. Mekkora az átlagfeszültség voltban?
= 1,25
= 1.25
! U_átlag = D · U_táp.

? Mekkora egy 5 V-os CMOS bemenet V_IH küszöbe (0,7 · V_CC), voltban?
= 3,5
= 3.5
! Ezért nem elég megbízhatóan a 3,3 V-os kimenet.

? Egy 3,3 V-os mikrokontroller kimenetét egy 5 V-os CMOS IC bemenetére kell kötni. Mi a helyes megoldás?
- Közvetlenül összekötjük, a 3,3 V elég.
+ Szintillesztőt (pl. TXS0108E) vagy TTL-bemenetű (HCT) IC-t használunk.
- Soros ellenállást teszünk közéjük, ami megemeli a feszültséget.
- Megfordítjuk a jel polaritását.
```
