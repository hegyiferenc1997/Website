---
title: Gyakorlás – Buszrendszerek és interfészek
summary: Ellenőrző kérdések és összefoglaló feladatlap: busz-alapfogalmak, sávszélesség, UART-keret és paritás, SPI, I²C, CAN, PCIe, DDR, differenciális jelátvitel.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **UART-keret.** Írd meg az `uart_keret(bajt, paritas=None)` függvényt, amely egy bájt UART-keretét adja vissza bitlistaként: START (0), 8 adatbit **LSB-vel kezdve**, opcionális paritásbit (`"paros"` vagy `"paratlan"`), STOP (1)!

```python starter
def uart_keret(bajt, paritas=None):
    return [0] + [(bajt >> i) & 1 for i in range(8)] + [1]
```

<details>
<summary>Megoldás</summary>

```python solution
def uart_keret(bajt, paritas=None):
    adat = [(bajt >> i) & 1 for i in range(8)]      # LSB először
    keret = [0] + adat
    if paritas == "paros":
        keret.append(sum(adat) % 2)                 # az 1-esek száma (paritással) páros
    elif paritas == "paratlan":
        keret.append(1 - sum(adat) % 2)
    return keret + [1]
```

</details>

```python test
assert uart_keret(0x48) == [0, 0, 0, 0, 1, 0, 0, 1, 0, 1]
assert uart_keret(0x48, "paros") == [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1]
assert uart_keret(0x48, "paratlan") == [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1]
assert len(uart_keret(0xFF, "paros")) == 11
print("Minden ellenőrzés sikeres!")
```

**2.** **Hasznos adatsebesség.** Írd meg a `hasznos_bajt_per_s(baud, adatbit=8, paritas=False, stopbit=1)` függvényt, amely megadja, hány bájt (egész szám, lefelé kerekítve) vihető át másodpercenként!

```python starter
def hasznos_bajt_per_s(baud, adatbit=8, paritas=False, stopbit=1):
    return baud // 8
```

<details>
<summary>Megoldás</summary>

```python solution
def hasznos_bajt_per_s(baud, adatbit=8, paritas=False, stopbit=1):
    bit_per_keret = 1 + adatbit + (1 if paritas else 0) + stopbit   # start + adat + paritás + stop
    return baud // bit_per_keret
```

</details>

```python test
assert hasznos_bajt_per_s(9600) == 960
assert hasznos_bajt_per_s(115200) == 11520
assert hasznos_bajt_per_s(115200, paritas=True) == 10472
assert hasznos_bajt_per_s(9600, stopbit=2) == 872
print("Minden ellenőrzés sikeres!")
```

**3.** **I²C címbájt.** Az I²C-n a master először egy bájtot küld: a 7 bites eszközcímet, és utána egy R/W̅ bitet (1 = olvasás, 0 = írás). Írd meg az `i2c_cimbajt(cim, olvas)` függvényt, amely visszaadja ezt a bájtot, és `ValueError`-t dob, ha a cím nem fér el 7 biten!

```python starter
def i2c_cimbajt(cim, olvas):
    return cim
```

<details>
<summary>Megoldás</summary>

Ezért keveredik gyakran a „0x48-as” és a „0x90-es” cím az adatlapokon: az egyik a 7 bites cím, a másik az R/W bittel együtt elküldött bájt.

```python solution
def i2c_cimbajt(cim, olvas):
    if not 0 <= cim <= 0x7F:
        raise ValueError("a cím 7 bites")
    return (cim << 1) | (1 if olvas else 0)    # cím a felső 7 biten, R/W a legalsón
```

</details>

```python test
assert i2c_cimbajt(0x48, False) == 0x90
assert i2c_cimbajt(0x48, True) == 0x91
assert i2c_cimbajt(0x3C, False) == 0x78       # egy tipikus kis OLED kijelző
try:
    i2c_cimbajt(0x80, False)
    assert False, "hibát kellett volna dobni"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hány vezetéket használ az I²C busz (a földön kívül)?
= 2
! SDA (adat) és SCL (órajel).

? Melyik SPI-jel választja ki, melyik slave-vel beszél a master?
- MOSI
- SCLK
+ CS (SS)
- MISO
! Minden slave-nek saját CS vonala van.

? Miért differenciális a CAN és az USB jelátvitele?
+ mert a két vezetékre ugyanúgy ható zaj a különbségből kiesik
- mert így kevesebb vezeték kell
- mert így nem kell órajel
! A vevő a két vezeték feszültségkülönbségét nézi.

? Mekkora a hasznos sávszélessége egy 8 GT/s-os, 128b/130b kódolású sávnak (GB/s, két tizedesre)?
= 0.98
= 0,98
! 8 · 128 / 130 / 8 ≈ 0,985 GB/s.

? Mit jelent a full duplex átvitel?
+ egyszerre mindkét irányba lehet adatot küldeni
- csak egy irányba lehet adatot küldeni
- felváltva lehet a két irányba küldeni
! A felváltva küldés a half duplex.
```
