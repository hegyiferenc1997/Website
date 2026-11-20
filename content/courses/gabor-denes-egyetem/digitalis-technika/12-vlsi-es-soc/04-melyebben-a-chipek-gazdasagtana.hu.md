---
title: Mélyebben – a chipek gazdaságtana és energiája számokkal
summary: Hány jó chip jön ki egy szilíciumszeletből (chipméret, kihozatal, ár / jó chip), miért olcsóbbak a chipletek egy óriáschipnél, az ASIC és az FPGA megtérülési darabszáma, valamint a feszültség- és frekvenciaszabályozás (DVFS) hatása a fogyasztásra és egy feladat energiájára.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- **kiszámolni**, hány chip fér egy 300 mm-es szeletre, és ebből hány lesz hibátlan,
- megérteni, miért nő a nagy chipek ára **sokkal gyorsabban**, mint a méretük – és miért ez a chipletek fő oka,
- megbecsülni, **hány darabtól** éri meg ASIC-et gyártatni FPGA helyett,
- számokkal látni, miért spórol **energiát**, ha a processzor lassabban, de alacsonyabb feszültségen dolgozik.

## 1. Kihozatal: a nagy chip drága mulatság

A szilíciumszeleten (_wafer_) véletlenszerűen elszórt **hibák** vannak (porszem, kristályhiba). Ha egy hiba egy chip területére esik, az a chip selejt. Minél nagyobb a chip, annál nagyobb eséllyel kap legalább egy hibát. Az egyszerű Poisson-modell szerint a **kihozatal** (hibátlan chipek aránya): **Y = e<sup>−D · A</sup>**, ahol D a hibasűrűség, A a chip területe.

```python run
# Kihozatal és költség: hány jó chip jön ki egy szilíciumszeletből?
import math

SZELET_ATMERO = 300                                  # mm
SZELET_AR = 10_000                                   # dollár egy feldolgozott szeletért (példa)
HIBASURUSEG = 0.1                                    # hiba / cm² (példa)

def chip_per_szelet(terulet_mm2):
    # közelítő képlet: a kör területe / chip, mínusz a szélén elvesző darabok
    r = SZELET_ATMERO / 2
    return int(math.pi * r ** 2 / terulet_mm2 - math.pi * SZELET_ATMERO / math.sqrt(2 * terulet_mm2))

def kihozatal(terulet_mm2):
    return math.exp(-HIBASURUSEG * terulet_mm2 / 100)  # Poisson-modell: annak esélye, hogy nincs hiba

print(f"{'chipméret':>10} | {'chip/szelet':>11} | {'kihozatal':>9} | {'jó chip':>7} | {'ár/jó chip':>10}")
for terulet in [25, 100, 300, 600]:
    db = chip_per_szelet(terulet)
    y = kihozatal(terulet)
    jo = int(db * y)
    print(f"{terulet:>7} mm² | {db:>11} | {y:>8.0%} | {jo:>7} | {SZELET_AR / jo:>8.1f} $")

# Chipletek: egy 600 mm²-es óriás helyett 4 db 150 mm²-es darab (a tokozás többletköltségét most elhanyagoljuk)
egy_jo = SZELET_AR / int(chip_per_szelet(150) * kihozatal(150))
print(f"\n1 db 600 mm²-es chip: {SZELET_AR / int(chip_per_szelet(600) * kihozatal(600)):.0f} $, "
      f"4 db 150 mm²-es chiplet: {4 * egy_jo:.0f} $")
```

Nézd meg az „ár / jó chip” oszlopot: a chip területe **24-szeresére** nő (25 → 600 mm²), a jó chip ára viszont **több mint 50-szeresére**! Két hatás szorzódik: kevesebb chip fér a szeletre (és a kerek szelet szélén több terület vész el), **és** ezekből is kisebb arány hibátlan.

Ez a **chipletek** fő oka: egy óriáschip helyett több kisebb darabot gyártanak, és egy tokban kötik össze őket. A példában a 4 db 150 mm²-es chiplet majdnem **feleannyiba** kerül, mint egy 600 mm²-es chip – ráadásul a hibás chipletet egyenként ki lehet dobni, nem a teljes nagy chipet. Az AMD Ryzen/EPYC és sok mai szerverprocesszor pontosan így épül.

## 2. ASIC vagy FPGA? – a megtérülési darabszám

Az ASIC (egyedi chip) darabára nagyon alacsony, de előtte hatalmas **egyszeri fejlesztési költség** (_NRE – non-recurring engineering_) van: tervezés, ellenőrzés, maszkok. Az FPGA-nál nincs NRE, de minden darab drágább. Melyik olcsóbb?

```python run
# ASIC vagy FPGA? Egyszeri fejlesztési költség (NRE) + darabár → megtérülési darabszám
FPGA_DARAB = 40.0                                    # dollár / db, nincs NRE
ASIC_NRE = 2_000_000                                 # dollár: tervezés, maszkok, tesztelés
ASIC_DARAB = 4.0                                     # dollár / db

fordulo = ASIC_NRE / (FPGA_DARAB - ASIC_DARAB)       # itt egyenlő az összköltség
print(f"megtérülési darabszám ≈ {fordulo:,.0f} db")
for db in [1_000, 10_000, 100_000, 1_000_000]:
    fpga = db * FPGA_DARAB
    asic = ASIC_NRE + db * ASIC_DARAB
    print(f"{db:>9,} db: FPGA {fpga / 1e6:>6.2f} M$, ASIC {asic / 1e6:>6.2f} M$ → "
          f"{'FPGA' if fpga < asic else 'ASIC'} az olcsóbb")
```

A két költség ott egyenlő, ahol **NRE + n · c<sub>ASIC</sub> = n · c<sub>FPGA</sub>**, vagyis **n = NRE / (c<sub>FPGA</sub> − c<sub>ASIC</sub>)**. A példában kb. **55 000** darab alatt az FPGA, felette az ASIC az olcsóbb. Ezért:

- egy kis szériás mérőműszerben, prototípusban, kutatásban **FPGA** van,
- egy okostelefonban (több tízmillió darab) **ASIC/SoC**,
- és sok termék FPGA-val indul, majd ha jól fogy, ASIC-re vált.

Az NRE a csúcstechnológiás csomópontokon több tízmillió dollár is lehet – ott a megtérülési darabszám milliókban mérhető. A pénzen túl az **idő** is számít: az FPGA azonnal kész, az ASIC hónapokig készül, és egy hiba esetén az újragyártás ismét hónapok.

## 3. DVFS: lassabban, de takarékosabban

A dinamikus fogyasztás **P = C · U² · f**. Alacsonyabb frekvencián a tranzisztoroknak több idejük van kapcsolni, ezért a **feszültség is csökkenthető** – és a feszültség **négyzetesen** számít. Ez a **DVFS** (_dynamic voltage and frequency scaling_): a processzor terhelés szerint választ feszültség–frekvencia párt.

```python run
# DVFS: feszültség és frekvencia csökkentése – fogyasztás és egy feladat energiája
# P = C · U² · f; egyszerű modell: a feszültség a frekvenciával arányosan csökkenthető
C = 1e-9                                             # F, kapcsolt kapacitás (példa)
MUNKA = 3e9                                          # egy feladat ennyi órajelciklus

for f_ghz, u in [(3.0, 1.2), (2.0, 0.9), (1.0, 0.7)]:
    f = f_ghz * 1e9
    p = C * u ** 2 * f                               # W
    ido = MUNKA / f                                  # s
    print(f"{f_ghz:.1f} GHz, {u:.1f} V: P = {p:5.2f} W, a feladat {ido:.1f} s alatt kész, "
          f"energia = {p * ido:.2f} J")
```

Figyeld meg az utolsó oszlopot: ugyanaz a feladat 1 GHz-en háromszor tovább tart, mégis **harmadannyi energiát** fogyaszt, mint 3 GHz-en (1,47 J kontra 4,32 J). Az energia ugyanis **E = P · t = C · U² · (ciklusszám)** – a frekvencia kiesik belőle, csak a feszültség négyzete marad!

Ezért fut a telefonod processzora a háttérfeladatoknál alacsony órajelen, és ezért vannak a mai SoC-okban **„nagy” és „kis” magok** (pl. ARM big.LITTLE): a gyors magok a sürgős munkára, a takarékos kis magok minden másra. (A valóságban van egy alsó határ: túl alacsony feszültségen a szivárgási áram kezd dominálni, és a nagyon lassú futás már nem éri meg.)

## Összefoglalás

- Kihozatal: Y = e<sup>−D·A</sup>; a nagy chip ára a területnél **sokkal gyorsabban** nő (kevesebb chip / szelet × kisebb kihozatal). Ezért terjednek a **chipletek**.
- ASIC vs FPGA: megtérülési darabszám = NRE / (c<sub>FPGA</sub> − c<sub>ASIC</sub>); kis szériánál FPGA, nagy szériánál ASIC.
- DVFS: P = C · U² · f; egy feladat energiája ∝ U², ezért alacsonyabb feszültségen, lassabban futtatva **kevesebb energia** kell.

## A lecke feladata

```quiz required
? A hibasűrűség 0,1 hiba/cm². Mekkora egy 100 mm²-es (1 cm²-es) chip kihozatala a Poisson-modell szerint (%-ban, egészre kerekítve)?
= 90
! Y = e^(−0,1 · 1) ≈ 0,905 → kb. 90%.

? Miért nő a jó chip ára sokkal gyorsabban, mint a chip területe?
- mert a nagy chiphez drágább szilícium kell
+ mert kevesebb chip fér a szeletre, és ezekből is kisebb arány hibátlan
- mert a nagy chipet lassabban lehet tesztelni
- mert a nagy chipet csak kézzel lehet tokozni
! A két hatás összeszorzódik.

? Egy ASIC NRE-je 1 000 000 $, darabára 5 $; az FPGA 25 $/db. Hány darabnál egyenlő a két összköltség?
= 50000
! 1 000 000 / (25 − 5) = 50 000 db.

? Egy processzor feszültségét 1,2 V-ról 0,6 V-ra csökkentjük. Hányad részére csökken egy feladat elvégzésének dinamikus energiája?
- felére
+ negyedére
- nyolcadára
- nem változik, mert lassabban fut
! E ∝ U²: (0,6 / 1,2)² = 1/4.

? Miért vannak a telefonos SoC-okban „nagy” és „kis” processzormagok?
- mert a kis magok olcsóbbak, ezért többet lehet beépíteni
+ mert a kis, takarékos magok alacsony feszültségen sokkal kevesebb energiával végzik el a nem sürgős munkát
- mert a nagy magok nem tudnak háttérfeladatot futtatni
- mert az operációs rendszer csak így tud ütemezni
! A sürgős munkára gyors mag, minden másra takarékos – így tovább bírja az akku.
```
