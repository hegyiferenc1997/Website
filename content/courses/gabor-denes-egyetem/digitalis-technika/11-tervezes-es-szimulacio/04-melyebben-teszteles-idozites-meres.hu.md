---
title: Mélyebben – tesztelés, időzítés és mérés számokkal
summary: Egy önellenőrző testbench, amely egy rejtett hibát a teljes körű teszttel biztosan, a kevés véletlen vektorral csak néha talál meg; statikus időzítéselemzés tartalékkal (slack) és a kritikus út megkeresése; a logikai analizátor mintavételi sebessége és memóriamélysége a gyakorlatban.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- egy **önellenőrző testbenchet** futtatni egy hibás áramkörön, és **számszerűen** látni, mennyit ér a teljes és a véletlen tesztelés,
- **statikus időzítéselemzést** végezni: tartalékot (_slack_) számolni minden útra, és megtalálni a kritikus utat,
- **kiszámolni**, hogy egy logikai analizátor mennyi ideig rögzít, és elég sűrűn mintavételez-e a jelhez.

## 1. Mennyit ér a tesztelés? – egy rejtett hiba nyomában

A testbench lényege: ugyanazt a bemenetet adjuk a tervezett áramkörnek (_DUT – device under test_) és egy egyszerű, **biztosan jó referenciamodellnek**, és a kimeneteket automatikusan összehasonlítjuk. Most egy 4 bites összeadóba szándékosan egy **ritka** hibát rejtettünk el: csak bizonyos bemenetpároknál veszik el az átvitel.

```python run
# Önellenőrző testbench: egy 4 bites összeadó (DUT) rejtett hibával – teljes és véletlen teszt
import random

def dut_osszeado(a, b):
    # a "tervezett" hardver: ritka hiba, ha mindkét szám páratlan és a legfelső bitje 1
    s = (a + b) & 0x1F
    if a & 0b1000 and b & 0b1000 and a & 1 and b & 1:
        s &= 0x0F                                    # a hiba: elvész az 5. bit
    return s

def referencia(a, b):
    return a + b                                     # a "biztosan jó" modell

# 1) teljes körű teszt: mind a 16 · 16 = 256 bemeneti kombináció
hibak = [(a, b) for a in range(16) for b in range(16) if dut_osszeado(a, b) != referencia(a, b)]
print(f"teljes teszt: 256 esetből {len(hibak)} hibás, az első: a={hibak[0][0]}, b={hibak[0][1]}")

# 2) véletlen teszt: csak 10 véletlen bemenet – észrevesszük-e?
for db in [10, 100]:
    talalat = 0
    for mag in range(100):                           # 100 különböző véletlen tesztfutás
        r = random.Random(mag)
        talalat += any(dut_osszeado(a, b) != referencia(a, b)
                       for a, b in ((r.randrange(16), r.randrange(16)) for _ in range(db)))
    print(f"véletlen teszt {db:>3} vektorral: 100 futásból {talalat} találta meg a hibát")
```

Tanulságok:

- A **teljes körű** teszt (mind a 256 kombináció) **biztosan** megtalálja a hibát – a hibás esetek 256-ból csak 16-ban jelentkeznek.
- **10 véletlen** vektorral a hibát a futások **felében** sem találjuk meg – a teszt „zöld”, a hiba pedig a kész termékben bukkan elő. 100 vektorral már szinte biztosan megtaláljuk.
- A teljes teszt kicsi áramkörnél olcsó, de gyorsan kezelhetetlenné válik: két 32 bites bemenet 2<sup>64</sup> ≈ 1,8 · 10<sup>19</sup> kombináció – másodpercenként egymilliárd teszttel is **több mint 500 év**. Ezért a valódi ellenőrzés **irányított** tesztekkel (a szélső esetek: 0, maximum, átvitel, túlcsordulás) és **lefedettségméréssel** egészíti ki a véletlen tesztet: a szimulátor méri, hogy a kód melyik sora, melyik állapotátmenete futott már le.

A hiba itt egy szélső eset környékén van (mindkét bemenet nagy, a felső bitjük 1) – egy jó irányított teszt („mi van, ha mindkét szám nagy?”) nagy eséllyel elkapta volna.

## 2. Statikus időzítéselemzés: minden út belefér?

A tervezőprogram a szintézis után **minden** flip-floptól flip-flopig tartó utat végigszámol: mikor érkezik meg a jel (t<sub>CQ</sub> + a kapuk késleltetése), és mennyi idő marad a következő órajel-élig a setup-időt levonva. Ez a **tartalék** (_slack_):

**slack = T<sub>órajel</sub> − t<sub>setup</sub> − (t<sub>CQ</sub> + t<sub>logika</sub>)**

```python run
# Statikus időzítéselemzés: tartalék (slack) minden útra, 100 MHz-es órajellel
T_CLK = 10.0                                         # ns
T_CQ, T_SETUP = 0.5, 0.3                             # ns, flip-flop adatok

utak = {                                             # út neve → kapukésleltetések (ns)
    "számláló → összehasonlító": [1.2, 1.2, 0.8],
    "regiszter → ALU → regiszter": [1.5, 2.0, 2.0, 1.8, 1.2],
    "regiszter → szorzó → regiszter": [2.5, 2.5, 2.5, 2.0],
    "bemenet → szinkronizáló": [0.4],
}
print(f"{'út':<32} {'érkezés':>8} {'tartalék':>9}")
for nev, kesl in sorted(utak.items(), key=lambda u: -sum(u[1])):
    erkezes = T_CQ + sum(kesl)                       # mikor stabil az adat a cél flip-flopnál
    tartalek = T_CLK - T_SETUP - erkezes             # pozitív: belefér; negatív: időzítési hiba
    print(f"{nev:<32} {erkezes:>6.1f} ns {tartalek:>+7.1f} ns" + ("  ← HIBA" if tartalek < 0 else ""))

kritikus = max(T_CQ + sum(k) for k in utak.values())
print(f"\nkritikus út: {kritikus:.1f} ns → f_max = {1000 / (kritikus + T_SETUP):.0f} MHz")
```

- A pozitív tartalék azt jelenti, hogy az út **belefér** az órajel-periódusba.
- A szorzó útja **negatív** tartalékkal (−0,3 ns) **időzítési hiba**: 100 MHz-en a szorzó eredménye nem ér be időben, a cél flip-flop rossz értéket tárolhat. A szimuláció ezt nem feltétlenül mutatja (a funkcionális szimuláció késleltetés nélkül számol!), ezért kötelező az időzítéselemzés.
- Megoldási lehetőségek: lassabb órajel (97 MHz még megy), a szorzó **kettévágása** egy közbülső regiszterrel (pipeline, 7. témakör), vagy az FPGA dedikált **DSP-blokkjának** használata, amely gyorsabban szoroz.

A tervezőprogram időzítési jelentésének első sora mindig a **legrosszabb tartalék** (_WNS – worst negative slack_). Ha ez negatív, a terv nem kész, akármilyen jól működik a szimulációban.

## 3. Logikai analizátor: mennyit látunk és mennyire élesen?

Egy logikai analizátornál két szám dönt: a **mintavételi sebesség** (hány mintát vesz másodpercenként) és a **memóriamélység** (hány mintát tud eltárolni). Az ökölszabály: a mérendő jel egy periódusára **legalább 4** (inkább 10) minta jusson, különben a jel élei pontatlanok vagy el is tűnhetnek.

```python run
# Logikai analizátor: mintavételi sebesség és memóriamélység → mennyi időt látunk?
def rogzites(minta_ps, memoria, jel_hz):
    ido_s = memoria / minta_ps                       # ennyi ideig tart a memória megtelése
    minta_per_periodus = minta_ps / jel_hz           # hány minta jut a jel egy periódusára
    return ido_s, minta_per_periodus

for minta_ps, memoria, jel_hz, nev in [(24e6, 1e6, 1e6, "olcsó USB-s, SPI 1 MHz"),
                                       (24e6, 1e6, 10e6, "olcsó USB-s, SPI 10 MHz"),
                                       (500e6, 64e6, 10e6, "asztali, SPI 10 MHz")]:
    ido, mpp = rogzites(minta_ps, memoria, jel_hz)
    itelet = "jó" if mpp >= 4 else "KEVÉS minta – torz lesz a jel"
    print(f"{nev:<24} {minta_ps / 1e6:>4.0f} MS/s, {memoria / 1e6:>3.0f} M minta → "
          f"{ido * 1000:>7.1f} ms rögzítés, {mpp:>5.1f} minta/periódus: {itelet}")
```

- Egy olcsó, 24 MS/s-os USB-s analizátor egy 1 MHz-es SPI-buszhoz bőven elég (24 minta periódusonként), de egy **10 MHz-es** SPI-nál már csak 2,4 minta jut egy periódusra – a protokoll-dekóder hibás bájtokat fog mutatni, pedig a busz jó! Ilyenkor a műszer a hibás, nem az áramkör.
- A rögzítési idő = memóriamélység / mintavételi sebesség. Ha egy ritka hibát keresel, nem a memória a megoldás, hanem a **trigger**: az analizátor csak akkor kezdjen rögzíteni, amikor a keresett esemény (pl. egy adott bájt vagy egy hibajel) bekövetkezik.

## Összefoglalás

- Testbench: DUT + referenciamodell + automatikus összehasonlítás. A teljes teszt biztos, de csak kis bemenetszámnál lehetséges; a kevés véletlen teszt könnyen átsiklik a ritka hibán. Irányított tesztek (szélső esetek) + lefedettség kell.
- Statikus időzítéselemzés: slack = T − t<sub>setup</sub> − (t<sub>CQ</sub> + t<sub>logika</sub>); negatív slack = időzítési hiba, amelyet a funkcionális szimuláció nem mutat.
- Logikai analizátor: legalább 4–10 minta a jel egy periódusára; rögzítési idő = memória / mintavételi sebesség; ritka eseményhez trigger.

## A lecke feladata

```quiz required
? Hány bemeneti kombinációt kell kipróbálnia egy teljes körű tesztnek egy két 8 bites bemenetű összeadónál?
= 65536
! 2^8 · 2^8 = 2^16 = 65 536.

? Egy út: tCQ = 1 ns, logika = 6 ns, tsetup = 0,5 ns, órajel 125 MHz (T = 8 ns). Mennyi a tartalék (ns, egy tizedesre)?
= 0.5
= 0,5
! 8 − 0,5 − (1 + 6) = 0,5 ns.

? Mit jelent a negatív tartalék (slack) egy úton?
- az út feleslegesen gyors
+ a jel nem ér be időben a cél flip-flophoz: időzítési hiba
- a hold-idő túl nagy
- a szimuláció hibás
! A tervet meg kell javítani: lassabb órajel, pipeline vagy gyorsabb logika.

? Egy logikai analizátor 100 MS/s-mal mintavételez, a memóriája 10 millió minta. Hány ms-ot tud rögzíteni?
= 100
! 10 000 000 / 100 000 000 s = 0,1 s = 100 ms.

? Miért találja meg a teljes körű teszt biztosan a rejtett hibát, a 10 vektoros véletlen teszt pedig csak a futások kb. felében?
- mert a véletlen teszt nem ellenőrzi a kimenetet
+ mert a hiba csak a 256 esetből 16-ban jelentkezik, és 10 véletlen vektor gyakran egyiket sem találja el
- mert a véletlenszám-generátor hibás
- mert a teljes teszt gyorsabb
! Annak esélye, hogy 10 próbából egy sem talál, (240/256)^10 ≈ 52%.
```
