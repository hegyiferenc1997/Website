---
title: Mélyebben – zajtartalék, illesztés és a sebesség határai számokkal
summary: Analóg és digitális jel másolása zajos csatornán (szimulátor), zajtartalék és illeszthetőség logikai családok között (mikor nem érti meg a 74HC a 3,3 V-os jelet?), a legnagyobb órajel a kritikus útból, a felfutási idő és a sávszélesség kapcsolata, valamint a PWM-mel „analóg” feszültség digitális jelből.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **szimulátorral** látni, miért romlik az analóg jel minden másolásnál, és miért nem a digitális,
- **kiszámolni**, hogy két logikai család összeköthető-e közvetlenül,
- megbecsülni egy áramkör **legnagyobb órajel-frekvenciáját** a késleltetésekből,
- megérteni, mit árul el a **felfutási idő** a jel frekvenciatartalmáról,
- hogyan állít elő egy mikrokontroller **„analóg” feszültséget** csupa 0-ból és 1-ből (PWM).

## 1. Másolás zajos csatornán – analóg kontra digitális

Az alapleckében láttad: a digitális jel **zajtűrő**, mert a vevő csak azt dönti el, hogy a feszültség a küszöb fölött vagy alatt van. Nézzük meg ezt számokkal! Egy jelet 10-szer egymás után továbbítunk (mint egy hosszú láncban, ahol mindenki továbbadja a kapott értéket), és minden lépésben ±0,15 V zaj rakódik rá.

```python run
# Analóg és digitális jel továbbítása 10 zajos lépésen át
import random

r = random.Random(7)               # rögzített véletlen, hogy mindig ugyanazt kapd
analog = 1.0                       # az analóg érték: pontosan 1,0 V-ot akarunk átvinni
digitalis = 1                      # a digitális érték: logikai 1 (1,0 V-tal ábrázolva)

for lepes in range(1, 11):
    zaj_a = r.uniform(-0.15, 0.15)
    zaj_d = r.uniform(-0.15, 0.15)
    analog += zaj_a                            # az analóg jel a zajt is továbbadja
    feszultseg = digitalis * 1.0 + zaj_d       # a digitális jel is zajos a vezetéken…
    digitalis = 1 if feszultseg > 0.5 else 0   # …de a vevő újra eldönti: 0 vagy 1
    print(f"{lepes:>2}. lépés: analóg {analog:.3f} V | digitális vezetéken "
          f"{feszultseg:.3f} V → visszaállítva: {digitalis}")
```

Az analóg érték **vándorol**: a zajok összeadódnak, és 10 lépés után már csak kb. 0,5 V – a küszöb közelében! A hibát semmi sem javítja ki. A digitális jel a vezetéken ugyanúgy zajos, de minden fogadó **visszaállítja** (regenerálja) a tiszta 0-t vagy 1-et, így a zaj nem halmozódik. Ezért lehet egy digitális fájlt ezerszer is veszteség nélkül másolni, egy magnókazettát nem.

**Hasonlat:** a „suttogó posta” játékban (analóg) az üzenet minden embernél torzul. Ha viszont mindenki csak egy kártyát ad tovább, amelyen „IGEN” vagy „NEM” áll (digitális), egy kicsit gyűrött kártyáról is mindenki pontosan leolvassa.

## 2. Összeköthető-e két logikai család?

Az A család kimenete akkor hajthatja **közvetlenül** a B család bemenetét, ha mindkét szint biztosan érthető:

- a magas kimenet elég magas: **V<sub>OH</sub>(A) ≥ V<sub>IH</sub>(B)**,
- az alacsony kimenet elég alacsony: **V<sub>OL</sub>(A) ≤ V<sub>IL</sub>(B)**.

A különbségek éppen a **zajtartalékok**. Ha valamelyik negatív, az összeköttetés **nem megbízható** – néha működik, néha nem, a legrosszabb fajta hiba.

```python run
# Illeszthetőség logikai családok között: NMH = VOH(adó) − VIH(vevő), NML = VIL(vevő) − VOL(adó)
csaladok = {
    #               VIL   VIH   VOL   VOH
    "TTL (74LS)":  (0.8,  2.0,  0.4,  2.4),
    "74HC (5 V)":  (1.5,  3.5,  0.1,  4.4),
    "74HCT (5 V)": (0.8,  2.0,  0.1,  4.4),
    "LVCMOS 3,3":  (0.8,  2.0,  0.4,  2.4),
}

print(f"{'adó → vevő':<28} {'NMH':>6} {'NML':>6}  eredmény")
for ado, (_, _, vol, voh) in csaladok.items():
    for vevo, (vil, vih, _, _) in csaladok.items():
        if ado == vevo:
            continue
        nmh, nml = voh - vih, vil - vol
        jo = "rendben" if nmh >= 0 and nml >= 0 else "NEM MEGBÍZHATÓ"
        print(f"{ado + ' → ' + vevo:<28} {nmh:>5.1f}V {nml:>5.1f}V  {jo}")
```

A legfontosabb tanulságok:

- **TTL vagy 3,3 V-os kimenet → 74HC bemenet: nem megbízható!** A 2,4 V-os „1” a 74HC-nek még a tiltott sávba esik (V<sub>IH</sub> = 3,5 V).
- Erre találták ki a **74HCT** családot: CMOS technológia, de TTL-kompatibilis bemeneti küszöbökkel (V<sub>IH</sub> = 2,0 V).
- Fordítva (5 V-os kimenet → 3,3 V-os bemenet) a szintek érthetők, de a 4,4 V **túl magas** lehet a 3,3 V-os bemenetnek, és tönkreteheti – ott **szintillesztő** (feszültségosztó vagy illesztő IC) kell. Ezt a táblázat nem mutatja, mert az abszolút maximális feszültség külön adat az adatlapon.

Ez nagyon is gyakorlati kérdés: egy 3,3 V-os Raspberry Pi vagy ESP32 és egy 5 V-os Arduino-modul összekötésénél pontosan ezt kell végiggondolni.

## 3. Milyen gyors lehet az áramkör? – a kritikus út

Egy szinkron áramkörben két tároló (flip-flop) között kombinációs logika van. Egy órajelperiódus alatt három dolognak kell lezajlania:

1. az első flip-flop kimenete megváltozik az órajel éle után: **t<sub>CQ</sub>** (_clock-to-Q_),
2. a jel végigfut a leghosszabb kombinációs úton: **t<sub>logika</sub>**,
3. az új értéknek a második flip-flop bemenetén **t<sub>setup</sub>** ideig stabilnak kell lennie a következő él előtt.

**T<sub>min</sub> = t<sub>CQ</sub> + t<sub>logika</sub> + t<sub>setup</sub>**, és **f<sub>max</sub> = 1 / T<sub>min</sub>**.

```python run
# A legnagyobb órajel-frekvencia a kritikus útból
def f_max_mhz(t_cq, kapuk, t_kapu, t_setup):
    t_logika = kapuk * t_kapu                      # egymás utáni kapuk késleltetése összeadódik
    T_min = t_cq + t_logika + t_setup              # ns
    return T_min, 1000 / T_min                     # 1 / ns = GHz → ×1000 = MHz

for nev, t_cq, kapuk, t_kapu, t_setup in [
    ("74HC kapuk, 5 szint",    15, 5, 8.0, 5),
    ("74HC kapuk, 2 szint",    15, 2, 8.0, 5),
    ("FPGA, 4 LUT-szint",     0.5, 4, 0.6, 0.1),
    ("modern CPU, 1 fokozat", 0.03, 12, 0.02, 0.02),
]:
    T, f = f_max_mhz(t_cq, kapuk, t_kapu, t_setup)
    print(f"{nev:<24} T_min = {T:6.2f} ns → f_max ≈ {f:8.1f} MHz")
```

Ugyanaz a funkció 5 kapuszint helyett 2 kapuszinttel kb. **1,7-szer gyorsabb** órajelet enged meg – ezért egyszerűsítünk (3. és 4. témakör), és ezért bontják a processzorok a munkát sok rövid **pipeline-fokozatra** (7. témakör): rövidebb út egy fokozatban → nagyobb órajel.

## 4. A felfutási idő és a sávszélesség

Egy „szép” négyszögjel valójában sok szinuszhullám összege: minél **meredekebb** az éle, annál több nagyfrekvenciás összetevőt tartalmaz. Egy hasznos ökölszabály:

**sávszélesség ≈ 0,35 / t<sub>r</sub>**

Vagyis egy 1 ns-os felfutású jel kb. **350 MHz**-es összetevőket tartalmaz – akkor is, ha az órajel csak 10 MHz! Ezért kell gyors jeleknél odafigyelni a nyomtatott áramkör vezetékeire: a jel kb. **15 cm/ns** sebességgel halad a panelen, és ha a vezeték hosszabb, mint a felfutó él „hossza” kb. hatoda, a vezeték már **távvezetékként** viselkedik (visszaverődések, gyűrődő élek).

```python run
# Felfutási idő → sávszélesség és a "kritikus" vezetékhossz a panelen
SEBESSEG_CM_NS = 15                     # jelterjedés nyomtatott áramkörön (cm/ns)

for t_r_ns in [10, 3, 1, 0.3]:
    savszel_mhz = 0.35 / t_r_ns * 1000
    el_hossza_cm = t_r_ns * SEBESSEG_CM_NS          # milyen hosszú szakaszon "terül el" az él
    kritikus_cm = el_hossza_cm / 6
    print(f"t_r = {t_r_ns:>4} ns → sávszélesség ≈ {savszel_mhz:6.0f} MHz, "
          f"vezeték {kritikus_cm:5.1f} cm fölött már távvezeték")
```

Meglepő következmény: egy **lassabb** (régebbi) logikai család néha **jobb** választás, ha nincs szükség a sebességre – kevesebb zavart kelt, és kevésbé érzékeny a vezetékezésre.

## 5. „Analóg” feszültség csupa 0-ból és 1-ből: a PWM

Egy mikrokontroller lába csak 0 V-ot vagy 3,3 V-ot (5 V-ot) tud kiadni. Mégis tudunk vele LED-et halványítani vagy motort lassítani: gyorsan kapcsolgatjuk, és a **kitöltési tényezővel** (D) szabályozzuk az **átlagos** feszültséget:

**U<sub>átlag</sub> = D · U<sub>tápfeszültség</sub>**

```python run
# PWM: az átlagos feszültség a kitöltési tényező függvényében
U_TAP = 5.0                      # V
f_pwm = 1000                     # Hz → T = 1 ms
T_us = 1e6 / f_pwm

for D in [0.0, 0.1, 0.25, 0.5, 0.75, 1.0]:
    t_magas = D * T_us
    sav = "█" * int(D * 20) + "·" * (20 - int(D * 20))       # egy periódus "rajza"
    print(f"D = {D:>4.0%}: {sav}  magas {t_magas:6.1f} µs / {T_us:.0f} µs → "
          f"átlag {D * U_TAP:.2f} V")
```

A LED és a motor (és a szemünk) **átlagol**: ha a kapcsolgatás elég gyors (pl. 1 kHz), nem látunk villogást, csak halványabb fényt. Ez a digitális → analóg átalakítás legegyszerűbb módja; a 8. témakörben (AD és DA átalakítók) visszatérünk rá.

## Összefoglalás

- Analóg jelnél a zaj **halmozódik**, digitálisnál minden fogadó **regenerálja** a jelet – ezért másolható a digitális adat veszteség nélkül.
- Két család közvetlenül összeköthető, ha V<sub>OH</sub>(adó) ≥ V<sub>IH</sub>(vevő) és V<sub>OL</sub>(adó) ≤ V<sub>IL</sub>(vevő). TTL/3,3 V → 74HC nem megbízható; erre való a **74HCT**.
- **f<sub>max</sub> = 1 / (t<sub>CQ</sub> + t<sub>logika</sub> + t<sub>setup</sub>)** – kevesebb kapuszint, nagyobb órajel.
- **Sávszélesség ≈ 0,35 / t<sub>r</sub>**: a meredek él nagy frekvenciákat tartalmaz, akkor is, ha az órajel lassú.
- **PWM**: U<sub>átlag</sub> = D · U<sub>táp</sub> – „analóg” érték digitális lábról.

## A lecke feladata

```quiz required
? Mekkora a magas szintű zajtartalék (NMH) két 74HC kapu között, ha VOH = 4,4 V és VIH = 3,5 V? (V-ban)
= 0.9
= 0,9
! NMH = VOH − VIH.

? Egy 3,3 V-os eszköz kimenete (VOH = 2,4 V) egy 5 V-os 74HC bemenetet (VIH = 3,5 V) hajt. Megbízható az összeköttetés?
- igen, mert 2,4 V több mint a fele a tápfeszültségnek
+ nem, mert a 2,4 V-os „1” a 74HC-nek a tiltott sávba esik
- igen, mert a CMOS bemenetek minden feszültséget elfogadnak
! Megoldás: 74HCT bemenet vagy szintillesztő.

? Egy szinkron áramkörben tCQ = 2 ns, a kritikus út 10 ns, tsetup = 1 ns. Legfeljebb hány MHz lehet az órajel? (egy tizedesre)
= 76.9
= 76,9
! f = 1 / 13 ns ≈ 76,9 MHz.

? Egy jel felfutási ideje 1 ns. Kb. mekkora frekvenciájú összetevőket tartalmaz (MHz)?
= 350
! Sávszélesség ≈ 0,35 / tr.

? Egy 5 V-os PWM-jel kitöltési tényezője 25%. Mekkora az átlagos feszültség (V)?
= 1.25
= 1,25
! U = D · U_táp = 0,25 · 5 V.
```
