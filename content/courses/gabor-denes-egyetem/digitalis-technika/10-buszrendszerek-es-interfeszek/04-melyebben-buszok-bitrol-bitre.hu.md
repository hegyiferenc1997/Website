---
title: Mélyebben – buszok bitről bitre
summary: Egy UART-keret összeállítása és visszafejtése paritásellenőrzéssel, a keretezés ára (hasznos adatsebesség), az I²C arbitráció szimulálva a nyitott drain-es vonalon, és a PCI Express sávszélessége generációnként, a kódolás hatásfokával együtt.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **összerakni és visszafejteni** egy UART-keretet bitről bitre, és látni, hogyan fogja meg a paritás az egybites hibát,
- **kiszámolni**, mennyi a hasznos adatsebesség a keretezés után,
- **szimulálni**, hogyan dönti el két egyszerre adó I²C master, ki folytathatja – ütközés és adatvesztés nélkül,
- a PCI Express sávszélességét **kiszámolni** generációnként, és megérteni a 8b/10b és a 128b/130b kódolás szerepét.

## 1. Egy UART-keret bitről bitre

Az UART nyugalomban 1-ben tartja a vonalat. Egy bájt átvitele: **START bit (0)**, 8 adatbit **a legkisebb helyiértékűvel kezdve** (LSB first), opcionálisan egy **paritásbit**, végül egy **STOP bit (1)**. A vevő a START bit lefutó éléből tudja, mikor kezdődik a keret, és onnan a megbeszélt baudráta szerint, **bitidő közepén** mintavételez.

```python run
# UART keret bitről bitre: START (0), 8 adatbit LSB-vel kezdve, páros paritás, STOP (1)
def uart_keret(bajt, paritas=True):
    adat = [(bajt >> i) & 1 for i in range(8)]       # LSB megy ki először!
    keret = [0] + adat
    if paritas:
        keret.append(sum(adat) % 2)                  # páros paritás: az 1-esek száma páros legyen
    return keret + [1]

def uart_vesz(keret, paritas=True):
    assert keret[0] == 0 and keret[-1] == 1, "keretezési hiba"
    adat = keret[1:9]
    if paritas and sum(adat) % 2 != keret[9]:
        return None                                  # paritáshiba
    return sum(b << i for i, b in enumerate(adat))

for ch in "Hi":
    k = uart_keret(ord(ch))
    print(f"{ch!r} = 0x{ord(ch):02X} = {ord(ch):08b} → a vezetéken: {''.join(map(str, k))}"
          f" → visszafejtve: {chr(uart_vesz(k))!r}")

rossz = uart_keret(ord("H"))
rossz[3] ^= 1                                        # egy adatbit átbillen a vezetéken
print("egy bit átbillent → vevő:", uart_vesz(rossz), "(paritáshiba, a bájtot eldobja)")

for nev, bit_per_bajt in [("8N1", 10), ("8E1", 11)]:
    print(f"{nev}: {bit_per_bajt} bit/bájt → 115 200 baudon {115200 // bit_per_bajt} bájt/s, "
          f"hatásfok {8 / bit_per_bajt:.0%}")
```

Három dolgot érdemes megfigyelni:

- A „H” (0x48 = 01001000) a vezetéken **fordított bitsorrendben** megy ki: 0 (start), 00010010 (LSB-vel kezdve), 0 (paritás), 1 (stop). Aki logikai analizátorral néz egy UART-jelet, ezt a fordítást fejben el kell végeznie (vagy a protokoll-dekóder megteszi helyette).
- Egy átbillent adatbitet a **paritás** észrevesz, és a vevő eldobja a bájtot. Két átbillent bitet viszont nem venne észre (2. témakör!).
- A keretezésnek ára van: 8N1-nél (8 adatbit, nincs paritás, 1 stop) **10 bit** visz át 8 hasznos bitet, tehát **80%** a hatásfok. 115 200 baudon ez 11 520 bájt/s – nem 14 400!

## 2. I²C arbitráció: ki beszélhet?

Az I²C buszon több master is lehet, és megtörténhet, hogy **egyszerre** kezdenek adni. A megoldás zseniálisan egyszerű, és a **nyitott drain-es** kimeneten múlik: a vonalat bárki 0-ra húzhatja, 1-ben csak a felhúzó ellenállás tartja. A vonal tehát a résztvevők bitjeinek **ÉS** kapcsolata (_huzalozott ÉS_). Minden master adás közben **visszaolvassa** a vonalat: ha 1-et adott, de 0-t lát, akkor tudja, hogy valaki más is ad – és csendben visszalép.

```python run
# I²C arbitráció: két master egyszerre kezd adni a nyitott drain-es (huzalozott ÉS) SDA vonalon
def arbitracio(cim1, cim2):
    for i in reversed(range(7)):                     # 7 bites cím, MSB először
        b1, b2 = (cim1 >> i) & 1, (cim2 >> i) & 1
        vonal = b1 & b2                              # bárki húzza 0-ra, a vonal 0 lesz
        print(f"  bit {i}: A ad {b1}, B ad {b2} → SDA = {vonal}")
        if b1 != vonal:
            return "B nyert (A 1-et adott, de 0-t olvasott vissza, ezért visszalép)"
        if b2 != vonal:
            return "A nyert (B 1-et adott, de 0-t olvasott vissza, ezért visszalép)"
    return "ugyanaz a cím – mindketten folytatják"

A, B = 0x48, 0x4C                                    # pl. egy hőmérő és egy másik szenzor címe
print(f"A címe {A:07b}, B címe {B:07b}")
print(arbitracio(A, B))
```

A két cím az első 4 bitben egyezik, ott mindketten ugyanazt látják, amit adtak. A 2. bitnél A 0-t, B 1-et ad – a vonal 0 lesz, B észreveszi az eltérést és visszalép. **A nyertes üzenete közben egyetlen bitet sem veszít**: nem volt ütközés, csak az egyik fél csendben elhallgatott. Következmény: az **alacsonyabb című** (több 0-t korábban adó) eszköz nyer – ez egyben prioritás is.

Ugyanez az elv működik a **CAN buszon** az autókban: ott az üzenetazonosító kisebb értéke nagyobb prioritást jelent, így a fékrendszer üzenete mindig megelőzi, mondjuk, az ablakemelőét.

## 3. PCI Express sávszélessége generációnként

A PCIe soros, pont-pont kapcsolat **sávokkal** (_lane_): x1, x4, x16. Egy sáv sebességét GT/s-ban (milliárd átvitel másodpercenként) adják meg – de nem minden átvitt bit hasznos! A vevőnek a jelből kell visszanyernie az órajelet, ehhez elég sok jelváltás kell, ezért az adatot **kódolják**:

- **8b/10b** (PCIe 1.0 és 2.0): 8 hasznos bitet 10 biten visz át – 20% veszteség,
- **128b/130b** (PCIe 3.0-tól): 128 bitet 130 biten – csak kb. 1,5% veszteség.

```python run
# PCI Express sávszélesség generációnként: átviteli sebesség, kódolás, sávok
generaciok = [
    # név, GT/s (milliárd bit/s sávonként), hasznos bit / átvitt bit
    ("PCIe 1.0", 2.5, 8 / 10),
    ("PCIe 2.0", 5.0, 8 / 10),
    ("PCIe 3.0", 8.0, 128 / 130),
    ("PCIe 4.0", 16.0, 128 / 130),
    ("PCIe 5.0", 32.0, 128 / 130),
]
print(f"{'':<9} {'kódolás':>8} | {'x1':>6} | {'x4':>6} | {'x16':>6}   (GB/s, irányonként)")
for nev, gts, hat in generaciok:
    sav = gts * hat / 8                              # GB/s egy sávon: bit → bájt
    print(f"{nev:<9} {hat:>8.1%} | {sav:>6.2f} | {4 * sav:>6.2f} | {16 * sav:>6.2f}")
```

Figyeld meg: a PCIe 3.0 átviteli sebessége (8 GT/s) **nem kétszerese** a 2.0-nak (5 GT/s), a hasznos sávszélesség mégis majdnem pontosan duplázódott – a hatékonyabb kódolás miatt. Ezért fontos a mértékegység: a **GT/s** az átvitt bitek száma, a **GB/s** a hasznos adat.

Gyakorlati példa: egy PCIe 4.0 x4 NVMe SSD elméleti maximuma kb. **7,9 GB/s** – a valóságban mért kb. 7 GB/s közel van ehhez. Ha ugyanezt az SSD-t egy PCIe 3.0-s alaplapba teszed, legfeljebb kb. 3,9 GB/s-ot tud – a busz lesz a szűk keresztmetszet, nem a meghajtó.

## Összefoglalás

- UART: START (0) + 8 adatbit LSB-vel kezdve + (paritás) + STOP (1); a vevő bitidő közepén mintavételez. 8N1 hatásfoka 80%.
- I²C arbitráció: nyitott drain → huzalozott ÉS; aki 1-et ad, de 0-t olvas vissza, visszalép. A nyertes adata sértetlen, az alacsonyabb cím nyer. Ugyanígy a CAN.
- A soros buszokon kódolás kell az órajel-visszanyeréshez: 8b/10b (80%), 128b/130b (~98,5%). GT/s ≠ GB/s.

## A lecke feladata

```quiz required
? Hány bájt/s a hasznos adatsebesség egy 9600 baudos, 8N1 beállítású UART-on?
= 960
! Bájtonként 10 bit (start + 8 adat + stop): 9600 / 10 = 960.

? Milyen sorrendben mennek ki egy UART-keret adatbitjei?
- a legnagyobb helyiértékűvel (MSB) kezdve
+ a legkisebb helyiértékűvel (LSB) kezdve
- először a páros, aztán a páratlan bitek
- tetszőleges sorrendben, a paritás jelzi
! LSB first – ezért fordított a bitsorrend a vezetéken.

? Két I²C master egyszerre ad. Az egyik 1-et ad, de 0-t olvas vissza a vonalról. Mit tesz?
- tovább ad, mert az ő címe fontosabb
+ visszalép, és a másik master zavartalanul folytatja
- mindketten abbahagyják, és később újrakezdik
- jelzi a hibát a STOP feltétellel
! Huzalozott ÉS: a 0 „erősebb”, a nyertes adata sértetlen marad.

? Hány százalékos a 8b/10b kódolás hatásfoka?
= 80
! 8 hasznos bit / 10 átvitt bit.

? Kb. hány GB/s egy PCIe 3.0 x4 kapcsolat hasznos sávszélessége irányonként (egy tizedesre)?
= 3.9
= 3,9
! 8 GT/s · 128/130 / 8 ≈ 0,985 GB/s sávonként, ennek négyszerese ≈ 3,9 GB/s.
```
