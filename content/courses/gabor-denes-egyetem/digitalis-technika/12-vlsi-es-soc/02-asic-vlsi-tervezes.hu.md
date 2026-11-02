---
title: ASIC és a VLSI-tervezés folyamata
summary: ASIC, FPGA és szabványos IC összehasonlítása, egyszeri fejlesztési költség és megtérülési darabszám; teljesen egyedi, standard cellás és kapumátrixos tervezés; a VLSI-tervezési folyamat a szintézistől a tape-outig; tesztelhetőség: scan lánc, BIST.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mi az **ASIC**, és mikor éri meg az FPGA helyett,
- hogyan számolod ki a **megtérülési darabszámot**,
- mi a **teljesen egyedi**, a **standard cellás** és a **kapumátrixos** tervezés,
- milyen lépésekből áll a **VLSI-tervezés** a **tape-out**-ig,
- hogyan tesztelnek egy legyártott chipet (**scan lánc**, **BIST**).

## ASIC vagy FPGA?

Az **ASIC** (application-specific integrated circuit – alkalmazásspecifikus IC) egyetlen feladatra tervezett, egyedileg gyártott chip: pl. egy telefon processzora, egy bányászgép hash-áramköre, egy hálózati kapcsoló chipje.

| szempont               | FPGA                       | ASIC                                            |
| ---------------------- | -------------------------- | ----------------------------------------------- |
| egyszeri költség (NRE) | szinte nulla               | nagyon nagy (maszkok, tervezőeszközök: milliók) |
| darabár                | magas                      | alacsony                                        |
| sebesség, fogyasztás   | jó                         | a legjobb (3–10× gyorsabb, kevesebbet fogyaszt) |
| módosítható?           | bármikor újraprogramozható | nem – hiba esetén újragyártás                   |
| piacra jutás           | gyors (napok)              | lassú (hónapok–év)                              |

Az **NRE** (non-recurring engineering) az egyszeri fejlesztési és gyártás-előkészítési költség. A **megtérülési darabszám** (break-even) az a darabszám, ahol a két megoldás összköltsége egyenlő:

**N = NRE / (darabár<sub>FPGA</sub> − darabár<sub>ASIC</sub>)**

**Példa:** az ASIC NRE-je 2 000 000 €, darabára 2 €; az FPGA darabára 52 €. N = 2 000 000 / 50 = **40 000 darab**. Ennél kevesebb termékhez az FPGA, többhöz az ASIC olcsóbb. Ezért gyakori, hogy a prototípus FPGA-n készül, a tömeggyártás ASIC-en.

## A tervezés stílusai

- **Teljesen egyedi** (full-custom): minden tranzisztort kézzel méreteznek és helyeznek el. A legjobb eredmény, de nagyon drága – ma csak a legkritikusabb részeknél (memóriacellák, analóg blokkok, nagy sebességű adó-vevők).
- **Standard cellás** (standard cell): a gyártó egy előre megtervezett, ellenőrzött **cellakönyvtárat** ad (inverter, NAND, NOR, AOI, flip-flop… több méretben és sebességben). A szintézis ezekből építi fel a tervet, és a cellák egyforma magasságú sorokba kerülnek. **Ez a mai ASIC-ek fő módszere.**
- **Kapumátrix** (gate array): az előre legyártott tranzisztorsorokat csak a felső fémrétegek kötik össze – olcsóbb, gyorsabb, mint a standard cella, de kevésbé hatékony.

## A VLSI-tervezési folyamat

Az első lépések megegyeznek az FPGA-s tervezéssel (11. témakör), a különbség a fizikai tervezésben van:

1. **Specifikáció, architektúra.**
2. **RTL-leírás** (VHDL, Verilog, SystemVerilog) és **verifikáció** – szimuláció, formális ellenőrzés. Egy nagy chipnél a mérnöki munka több mint fele verifikáció, mert a gyártás után a hiba javítása nagyon drága.
3. **Logikai szintézis** a standard cellakönyvtárra → **kapuszintű hálózat** (netlist).
4. **Alaprajz** (floorplan): a nagy blokkok, a memóriák és a tápellátó hálózat helye a chipen.
5. **Elhelyezés** (placement) a cellasorokba.
6. **Órajelfa-szintézis** (CTS – clock tree synthesis): az órajelet pufferekből álló, kiegyensúlyozott fa osztja szét, hogy minden flip-flophoz közel egyszerre érkezzen (kis **clock skew**).
7. **Huzalozás** (routing) a fémrétegeken.
8. **Statikus időzítési elemzés** (STA), fogyasztás- és jelintegritás-elemzés.
9. **Fizikai ellenőrzés:** **DRC** (design rule check – betartja-e a gyártási szabályokat, pl. a minimális vonalszélességet és távolságot) és **LVS** (layout versus schematic – a rajzolat valóban a kapcsolási rajzot valósítja-e meg).
10. **Tape-out:** a kész rajzolat (GDSII/OASIS fájl) elküldése a gyárnak (foundry, pl. TSMC, Samsung, Intel). A név a régi mágnesszalagos átadásból maradt.
11. **Gyártás, tesztelés, tokozás** – az első minták hetek–hónapok múlva érkeznek.

## Tesztelhetőség (DFT)

A gyártásnál minden chipet ellenőrizni kell, hogy nincs-e benne gyártási hiba (pl. beragadt jel, 11. témakör) – de egy milliárd tranzisztoros chip belsejébe nem lehet mérőcsúccsal benyúlni. Ezért már a tervezéskor beépítik a tesztelhetőséget (**DFT** – design for testability):

- **Scan lánc:** tesztüzemmódban a flip-flopok egy hosszú **léptetőregiszterré** (5. témakör) kapcsolódnak össze. Így bármilyen állapot **beléptethető**, egy órajelnyi normál működés után az eredmény **kiléptethető** és összevethető a várt értékkel.
- **ATPG** (automatic test pattern generation): program állítja elő a tesztvektorokat, amelyek a lehetséges beragadási hibák minél nagyobb részét kimutatják (hibalefedettség, pl. 99 %).
- **BIST** (built-in self-test): a chip saját magát teszteli, pl. a memóriák beépített tesztáramkörrel (MBIST) írják és olvassák vissza a mintákat.
- **JTAG** (IEEE 1149.1, boundary scan): szabványos négyvezetékes tesztport – ugyanaz, amellyel az FPGA-t programozod és a beépített logikai analizátort olvasod.

```python run
# Megtérülési darabszám: FPGA vagy ASIC?
nre_asic = 2_000_000          # €
ar_asic, ar_fpga = 2, 52      # €/darab

n = nre_asic / (ar_fpga - ar_asic)
print("megtérülési darabszám:", int(n))

for db in (10_000, 40_000, 100_000):
    fpga = db * ar_fpga
    asic = nre_asic + db * ar_asic
    olcsobb = "FPGA" if fpga < asic else ("egyenlő" if fpga == asic else "ASIC")
    print(f"{db:>7} db: FPGA {fpga:>10,} €, ASIC {asic:>10,} € -> {olcsobb}")
```

## Összefoglalás

- ASIC: nagy NRE, kis darabár, a legjobb teljesítmény, nem módosítható; FPGA: nincs NRE, drágább darab, rugalmas.
- Megtérülés: N = NRE / (darabár<sub>FPGA</sub> − darabár<sub>ASIC</sub>).
- Stílusok: teljesen egyedi, standard cellás (a fő módszer), kapumátrix.
- Folyamat: RTL + verifikáció → szintézis → alaprajz → elhelyezés → órajelfa → huzalozás → STA → DRC/LVS → tape-out → gyártás.
- DFT: scan lánc, ATPG, BIST, JTAG.

## A lecke feladata

```quiz required
? Egy ASIC NRE-je 2 000 000 €, darabára 2 €; az FPGA darabára 52 €. Hány darabnál egyezik meg a két megoldás összköltsége?
= 40000
= 40 000
! NRE / (52 − 2).

? Mi a mai ASIC-tervezés fő módszere?
- minden tranzisztor kézi elhelyezése
+ standard cellás tervezés előre megtervezett cellakönyvtárból
- FPGA-k összekötése
- kizárólag analóg tervezés

? Mi a tape-out?
- A chip tokozása.
+ A kész rajzolat átadása a gyárnak gyártásra.
- Az első szimuláció lefuttatása.
- A hibás chipek kiválogatása.

? Mit ellenőriz a DRC?
+ Hogy a rajzolat betartja-e a gyártási szabályokat (pl. minimális vonalszélesség és távolság).
- Hogy a chip elég gyors-e.
- Hogy a HDL-kód szintaktikailag helyes-e.
- Hogy a chip mennyit fogyaszt.

? Mire szolgál a scan lánc?
- Az órajel szétosztására a chipen.
+ Tesztüzemmódban a flip-flopokat léptetőregiszterré köti, így a belső állapot beírható és kiolvasható.
- A chip hűtésére.
- A memóriák gyorsítására.

? Miért kell órajelfa-szintézis (CTS)?
- Hogy az órajel frekvenciája nőjön.
+ Hogy az órajel minden flip-flophoz közel egyszerre érkezzen (kis clock skew).
- Hogy kevesebb fémréteg kelljen.
- Hogy a chip újraprogramozható legyen.
```
