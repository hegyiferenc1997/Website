---
title: Félvezető memóriák – ROM, SRAM, DRAM, Flash
summary: A memória szervezése (cím, adat, vezérlőjelek), kapacitás számítása, ROM-típusok, statikus és dinamikus RAM, Flash, memória-hierarchia és bővítés.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel egy memória: **címvezetékek, adatvezetékek, vezérlőjelek**,
- hogyan számolod a **kapacitást** és a szükséges címvezetékek számát,
- a **ROM** típusait (maszk-ROM, PROM, EPROM, EEPROM, Flash),
- a **statikus (SRAM)** és **dinamikus (DRAM)** RAM különbségét,
- a **memória-hierarchiát** és a memória **bővítését**.

## A memória szervezése

Egy memória **2<sup>n</sup> darab m bites szót** tárol. A szavak egymás után számozott helyeken vannak; egy helyet a **címe** választ ki.

- **n címvezeték** (A0…A<sub>n−1</sub>) → 2<sup>n</sup> hely; a cím egy belső **dekóderre** megy, amely kiválasztja a sort.
- **m adatvezeték** (D0…D<sub>m−1</sub>) – a szóhossz.
- **Vezérlőjelek** (jellemzően aktív alacsonyak): **CS̅** (chip select – a chip kiválasztása), **OE̅** (output enable – olvasás), **WE̅** (write enable – írás).

**Kapacitás = 2<sup>n</sup> · m bit.** Példa: 16 címvezeték, 8 adatvezeték → 2<sup>16</sup> = 65 536 hely × 8 bit = **64 KiB**.

Fordítva: 1 Mi (2<sup>20</sup>) szóhoz **20** címvezeték kell.

> Jelölés: 1 KiB = 1024 bájt, 1 MiB = 1024 KiB (bináris előtagok). A gyártók gyakran a 10-es alapú kB, MB jelölést használják.

## Csak olvasható memóriák (ROM) – nem felejtők

Tartalmukat tápfeszültség nélkül is megőrzik (**nem felejtő**, non-volatile).

| típus         | írás                                             | megjegyzés                                                   |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **maszk-ROM** | gyártáskor, maszkkal                             | nagy sorozatban olcsó, nem módosítható                       |
| **PROM**      | egyszer, a felhasználó égeti be                  | olvadóbiztosítékos cellák (OTP)                              |
| **EPROM**     | elektromosan; **UV fénnyel** törölhető           | kvarcablakos tok                                             |
| **EEPROM**    | elektromosan írható és törölhető, **bájtonként** | kis kapacitás, beállítások tárolására                        |
| **Flash**     | elektromosan, **blokkonként** törölhető          | nagy kapacitás, olcsó: SSD, pendrive, mikrovezérlő programja |

A Flash két fajtája: **NOR Flash** (közvetlenül címezhető, a program onnan futtatható) és **NAND Flash** (sűrűbb, olcsóbb, blokkos elérés – SSD, memóriakártya). A Flash cellák írási/törlési ciklusainak száma korlátos (10<sup>3</sup>–10<sup>5</sup>), ezért a vezérlő **kopáskiegyenlítést** végez.

**ROM mint kombinációs hálózat:** egy ROM tetszőleges logikai függvényt megvalósít – a bemenetek a cím, a kimenetek az adat, a tartalom pedig maga az igazságtábla (pl. 7 szegmenses dekóder 16 × 7 bites ROM-ban). Az FPGA LUT-ja ugyanez kicsiben.

## Írható-olvasható memóriák (RAM) – felejtők

A **RAM** (random access memory, tetszőleges elérésű) tápfeszültség nélkül **elveszíti** tartalmát (**felejtő**).

### Statikus RAM (SRAM)

Egy bitet egy **flip-flop** tárol, cellánként tipikusan **6 tranzisztor** (két keresztbe kötött CMOS inverter + két kapcsoló). Amíg van táp, megtartja az értéket.

- **gyors** (ns-os elérés), nem kell frissíteni,
- de **nagy felületű** és drága → kis kapacitás: **processzor gyorsítótár (cache)**, regiszterfájl, FPGA blokk-RAM.

### Dinamikus RAM (DRAM)

Egy bitet egy **kondenzátor töltése** tárol, cellánként **1 tranzisztor + 1 kondenzátor**. A kondenzátor töltése szivárog, ezért a tartalmat **rendszeresen frissíteni** kell (jellemzően 64 ms-onként minden sort), és az olvasás is „lerontja”, utána vissza kell írni.

- **nagyon sűrű, olcsó** → nagy kapacitás: a számítógép **operatív memóriája** (DDR4, DDR5 modulok),
- de lassabb, és frissítő vezérlő kell.

## Memória-hierarchia

| szint            | technológia | méret (nagyságrend) | elérési idő |
| ---------------- | ----------- | ------------------- | ----------- |
| regiszterek      | flip-flop   | ~1 KiB              | < 1 ns      |
| cache (L1–L3)    | SRAM        | KiB–MiB             | 1–20 ns     |
| operatív memória | DRAM        | GiB                 | ~60–100 ns  |
| háttértár (SSD)  | NAND Flash  | TB                  | ~100 µs     |

Minél közelebb van a processzorhoz, annál gyorsabb, kisebb és drágább bitenként.

## Memória bővítése

- **Szóhossz növelése** (szélesség): több chip **párhuzamosan**, közös címmel és CS̅-sel, az adatvezetékek egymás mellett. Két 8K × 8 chip → 8K × 16.
- **Kapacitás növelése** (mélység): a felső címbitek egy **dekóderen** át választják ki, melyik chip aktív (CS̅). Négy 8K × 8 chip + 2→4 dekóder → 32K × 8.
- A kettő kombinálható: 32K × 16-hoz 4 · 2 = **8** darab 8K × 8 chip kell.

```python run
# Memória-kapacitás és címvezetékek számítása
import math

def kapacitas(cimvezetek, adatbit):
    helyek = 2 ** cimvezetek
    return helyek, helyek * adatbit // 8          # helyek száma és bájtban

print("16 cím, 8 adat:", kapacitas(16, 8))
print("1 Mi szóhoz szükséges címvezeték:", int(math.log2(2 ** 20)))
print("32K×16-hoz 8K×8 chipből:", (32 // 8) * (16 // 8), "db")
```

## Összefoglalás

- Memória: n címvezeték → 2<sup>n</sup> hely, m adatbit; kapacitás 2<sup>n</sup> · m bit; CS̅, OE̅, WE̅.
- Nem felejtő: maszk-ROM, PROM, EPROM, EEPROM, Flash (NOR / NAND).
- SRAM: flip-flop (6T), gyors, cache; DRAM: kondenzátor (1T1C), frissíteni kell, operatív memória.
- Bővítés: párhuzamosan a szóhosszt, dekóderrel a mélységet.

## A lecke feladata

```quiz required
? Egy memóriának 16 címvezetéke és 8 adatvezetéke van. Hány bájtot tárol?
= 65536
= 65 536
! 2^16 hely × 1 bájt.

? Hány címvezeték kell 1 Mi (2^20) darab szó megcímzéséhez?
= 20

? Miért kell a DRAM-ot rendszeresen frissíteni?
- Mert a flip-flopok idővel átbillennek.
+ Mert a bitet tároló kondenzátor töltése elszivárog.
- Mert a Flash cellák elkopnak.
- Mert az órajel leáll.

? Hány tranzisztorból áll tipikusan egy SRAM cella?
- 1
- 2
- 4
+ 6
! Két keresztbe kötött CMOS inverter és két kapcsolótranzisztor.

? Melyik memória nem felejtő (tápfeszültség nélkül is megőrzi a tartalmát)?
- SRAM
- DRAM
+ Flash
- a processzor regiszterei

? Hány darab 8K × 8 bites memóriachip kell egy 32K × 16 bites memóriához?
= 8
! Mélységben 4-szer, szélességben 2-szer.
```
