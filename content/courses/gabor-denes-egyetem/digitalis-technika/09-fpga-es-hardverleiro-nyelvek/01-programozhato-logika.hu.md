---
title: Programozható logikai eszközök
summary: A fix kapus IC-ktől a programozható logikáig: PROM, PLA, PAL, GAL, CPLD és FPGA; a keresőtábla (LUT) működése; ASIC vagy FPGA.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- miért jött létre a **programozható logika**,
- a **PLA**, **PAL**, **GAL**, **CPLD** és **FPGA** közti különbséget,
- hogyan valósít meg tetszőleges függvényt egy **LUT** (keresőtábla),
- mikor érdemes **ASIC**-ot és mikor **FPGA**-t választani.

## Fix kapuktól a programozható logikáig

Az előző témakörökben kapukból (74-es, 4000-es sorozatú IC-kből) építettük a hálózatokat. Egy komolyabb terv így **több tucat IC-ből** és rengeteg vezetékből állna, és minden módosítás új nyomtatott áramkört jelentene.

A **programozható logikai eszköz** (PLD) egy olyan IC, amelynek belső kapcsolatait **a felhasználó határozza meg** – a kapcsolás „szoftveresen” módosítható.

## Az egyszerű PLD-k: ÉS–VAGY mátrix

A 4. témakörből tudjuk, hogy bármely függvény felírható **SOP alakban** (ÉS-tagok VAGY-kapcsolata). Az egyszerű PLD-k pontosan ezt valósítják meg egy **ÉS-mátrixszal** és egy **VAGY-mátrixszal**:

| eszköz     | ÉS-mátrix        | VAGY-mátrix      | megjegyzés                                     |
| ---------- | ---------------- | ---------------- | ---------------------------------------------- |
| **PROM**   | fix (teljes dekóder: minden minterm) | **programozható** | igazságtábla tárolása                |
| **PLA**    | **programozható** | **programozható** | legrugalmasabb, de lassabb, drágább         |
| **PAL**    | **programozható** | fix              | gyors, olcsó; egyszer programozható           |
| **GAL**    | programozható    | fix              | a PAL **törölhető, újraírható** (EEPROM) változata, kimeneti makrocellával (benne flip-flop) |

## CPLD

A **CPLD** (complex PLD) több **PAL-szerű blokkot** (makrocellát) köt össze egy központi kapcsolómátrixszal.

- Konfigurációja **nem felejtő** (Flash/EEPROM) → bekapcsolás után **azonnal** működik.
- Kiszámítható, rövid késleltetés; néhány tucat–néhány száz makrocella.
- Tipikus felhasználás: „ragasztó logika” (glue logic) – címdekódolás, jelillesztés, egyszerű vezérlés.

## FPGA

Az **FPGA** (field-programmable gate array – a helyszínen programozható kapumátrix) nem ÉS–VAGY mátrixra épül, hanem **sok ezer – millió kis logikai cellára**, amelyeket egy programozható **kapcsolóhálózat** köt össze.

- Egy cella alapja egy **LUT** (keresőtábla) és egy **D flip-flop**.
- A konfiguráció (a **bitstream**) jellemzően **SRAM**-ban van → **kikapcsoláskor elveszik**, ezért bekapcsoláskor egy külső **Flash**-ből töltődik be (ez néhány ms–s).
- Sok beépített egység: blokk-RAM, DSP-szorzók, PLL-ek, nagy sebességű soros adó-vevők, akár processzormag (lásd következő lecke).

## A LUT – keresőtábla

Egy **k bemenetű LUT** egy **2<sup>k</sup> bites kis memória** és egy **multiplexer**: a bemenetek a címet adják, a memória tartalma maga az **igazságtábla** (vö. „függvény multiplexerrel”, 4. témakör).

**Példa** – 2 bemenetű LUT, tartalom (00, 01, 10, 11 címen): **0, 1, 1, 0** → ez az **A ⊕ B** függvény. Ha a tartalom 0, 0, 0, 1 lenne, ugyanaz a hardver **ÉS kapu** lenne.

- 4 bemenetű LUT → 16 bit, 6 bemenetű LUT → **64 bit** (a mai FPGA-k jellemzően 6 bemenetűek).
- **Bármilyen** k változós függvény megvalósítható egyetlen LUT-tal – a bonyolultsága mindegy. Nagyobb függvényekhez több LUT-ot kaszkádosít a szintézisprogram.

## ASIC vagy FPGA?

|                         | **ASIC** (alkalmazásspecifikus IC)          | **FPGA**                                     |
| ----------------------- | ------------------------------------------- | -------------------------------------------- |
| egyszeri költség (NRE)  | nagyon magas (maszkok: akár millió dollár)  | nincs                                        |
| darabár                 | nagy sorozatban **olcsó**                   | drágább                                      |
| sebesség, fogyasztás    | **legjobb**                                 | rosszabb (a programozható kapcsolók miatt)   |
| módosítás               | lehetetlen (új gyártás)                     | **bármikor**, akár a terepen is              |
| fejlesztési idő         | hónapok–évek                                | napok–hetek                                  |

Ezért az FPGA ideális **prototípushoz**, kis és közepes sorozathoz, és ahol később frissíteni kell a hardvert (távközlés, mérőműszerek, AI-gyorsítók). Az ASIC-ot gyakran először FPGA-n próbálják ki.

```python run
# Egy 3 bemenetű LUT: a memória tartalma maga az igazságtábla
def lut(tartalom, *bemenetek):
    cim = 0
    for b in bemenetek:            # a bemenetek binárisan adják a címet
        cim = cim * 2 + b
    return tartalom[cim]

tobbseg = [0, 0, 0, 1, 0, 1, 1, 1]  # a többségi függvény igazságtáblája
paritas = [0, 1, 1, 0, 1, 0, 0, 1]  # háromváltozós XOR
for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            print(a, b, c, "→ többség:", lut(tobbseg, a, b, c), " paritás:", lut(paritas, a, b, c))
```

## Összefoglalás

- PLD: programozható belső kapcsolatok; PROM, PLA, PAL, GAL – ÉS–VAGY mátrixok.
- CPLD: több PAL-blokk, nem felejtő, azonnal indul.
- FPGA: LUT + flip-flop cellák, programozható összeköttetés, SRAM-alapú konfiguráció.
- k bemenetű LUT = 2<sup>k</sup> bites memória + multiplexer → bármely k változós függvény.

## A lecke feladata

```quiz required
? Hány bitet tárol egy 4 bemenetű LUT?
= 16

? És egy 6 bemenetű LUT?
= 64

? Melyik eszközben programozható az ÉS-mátrix, de fix a VAGY-mátrix?
- PROM
- PLA
+ PAL
- FPGA

? Egy 2 bemenetű LUT tartalma a 00, 01, 10, 11 címen: 0, 1, 1, 0. Milyen függvényt valósít meg? Írd fel kifejezésként!
expr: A, B -> A ⊕ B

? Miért kell az FPGA konfigurációját bekapcsoláskor egy külső Flash-ből betölteni?
- Mert a Flash gyorsabb, mint a LUT.
+ Mert a konfiguráció SRAM-ban van, amely kikapcsoláskor elveszíti a tartalmát.
- Mert az FPGA-nak nincsenek lábai.
- Mert minden bekapcsoláskor új programot kell írni.

? Mikor jobb választás az ASIC az FPGA-nál?
- Prototípus készítésekor.
- Ha a hardvert később frissíteni kell.
+ Nagyon nagy sorozatnál, ahol a darabár, a sebesség és a fogyasztás a döntő.
- Ha néhány hét alatt kész kell lennie.
```
