---
title: DA átalakítók és az átalakítók jellemzői
summary: Súlyozott ellenállásos, R–2R létrás, súlyozott áramforrásos, delta–szigma és PWM DA átalakító; felbontás, beállási idő, INL, DNL, monotonitás, rekonstrukciós szűrő.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a **súlyozott ellenállásos** és az **R–2R létrás** DAC működését és kimeneti képletét,
- a **súlyozott áramforrásos** és a **delta–szigma** DAC elvét,
- hogyan lesz **PWM**-ből analóg feszültség,
- az ADC-k és DAC-ok **minőségi jellemzőit**: felbontás, sebesség, **INL**, **DNL**, monotonitás.

## A DAC feladata

A DAC egy N bites D számból azzal **arányos feszültséget** (vagy áramot) állít elő. Minden bit a **helyiértékével súlyozva** járul hozzá a kimenethez: az MSB a legtöbbel, az LSB a legkevesebbel. Ideális esetben:

**V<sub>ki</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>**

A kimenet **lépcsős** jel; egy aluláteresztő **rekonstrukciós szűrő** simítja folytonossá.

## Súlyozott ellenállásos DAC

Minden bithez egy ellenállás tartozik, amelynek értéke a helyiértékkel **fordítottan arányos**: MSB → R, a következő → 2R, majd 4R, 8R … Egy kapcsoló a bit értékétől függően a referenciára vagy a földre köti, és egy **műveleti erősítős összegző** adja össze az áramokat.

- Egyszerű elv, de N bitnél az ellenállások aránya **2<sup>N−1</sup>** (4 bit → 1 : 8, 12 bit → 1 : 2048). Ilyen széles tartományban pontos ellenállásokat gyártani nehéz → csak kis bitszámra.

## R–2R létrás DAC

Csak **kétféle** értékű ellenállás (R és 2R) kell. A létra minden csomópontjában az áram **feleződik**, így az egyes bitek automatikusan a helyiértéküknek megfelelő súllyal szólnak bele a kimenetbe:

**V<sub>ki</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>**

**Példa:** 8 bit, V<sub>ref</sub> = 5,12 V, D = 100 → V<sub>ki</sub> = 5,12 · 100 / 256 = **2,00 V** (egy lépés 20 mV).

- Pontos, jól skálázható, **integrált áramkörben** könnyen gyártható (az ellenállások *aránya* számít, nem az abszolút értéke) → a legelterjedtebb DAC-szerkezet.

## Súlyozott áramforrásos DAC

Minden bithez egy **áramforrás** tartozik, amely a bit súlyának megfelelő áramot ad (MSB a legnagyobbat); a bitek kapcsolják, hozzájárul-e az áram a kimenethez. Az áramok összege egy ellenálláson feszültséggé alakítható. Nagyon **gyors** – nagy sebességű kommunikációs és videó-DAC-ok így működnek.

## Delta–szigma (ΔΣ) DAC

1. Egy **interpolációs szűrő** megnöveli a mintavételi frekvenciát (pl. 48 kHz → több MHz), új mintákat illesztve a meglévők közé.
2. A **ΔΣ modulátor** a sokbites jelet egy nagy sebességű **1 bites** sorozattá alakítja, amelynek átlaga a jelet követi.
3. Egy **1 bites DAC** (egyszerű kapcsoló) ezt feszültséggé alakítja.
4. Egy aluláteresztő **kimeneti szűrő** kisimítja.

Szinte minden **hang-DAC** (telefon, hangkártya) ilyen: olcsó, és nagyon lineáris, mert az 1 bites DAC-nak csak két szintje van.

## PWM mint DAC

A mikrokontroller **PWM** kimenete (7. témakör) egy **RC aluláteresztő szűrővel** egyszerű DAC: a kimenet a kitöltési tényezővel arányos egyenfeszültség, **V = D · V<sub>táp</sub>** (pl. 3,3 V, 40 % → **1,32 V**). Olcsó, de lassú, és marad rajta hullámosság.

## Az átalakítók jellemzői

| jellemző                  | jelentése                                                                      |
| ------------------------- | ------------------------------------------------------------------------------ |
| **felbontás**             | hány bit, azaz hány diszkrét szintet különböztet meg (2<sup>N</sup>)            |
| **mintavételi sebesség**  | hány átalakítás másodpercenként (S/s)                                           |
| **beállási idő** (DAC)    | a kód változása után mennyi idő alatt áll be a kimenet ±½ LSB-n belül           |
| **ofszethiba**            | a 0 kódhoz tartozó kimenet eltérése a nullától                                  |
| **erősítéshiba**          | a teljes skála meredekségének eltérése                                          |
| **DNL** (differenciális nemlinearitás) | az **egymás utáni lépések** eltérése az ideális 1 LSB-től               |
| **INL** (integrális nemlinearitás) | a valós átviteli görbe **legnagyobb eltérése** az ideális egyenestől        |
| **monotonitás**           | növekvő kódra a kimenet **soha nem csökken** (DAC); DNL > −1 LSB esetén biztosított |
| **hiányzó kód** (ADC)     | olyan kód, amely semmilyen bemenetre nem jelenik meg (DNL ≤ −1 LSB)             |

A felbontás tehát nem azonos a **pontossággal**: egy 16 bites, de rossz INL-ű átalakító lehet pontatlanabb, mint egy jó 12 bites.

```python run
# R–2R DAC kimenete és a lépcsős jel
v_ref, n = 5.12, 8
for d in (0, 1, 100, 128, 255):
    v_ki = v_ref * d / 2 ** n
    print(f"D = {d:3d} ({d:08b}) → {v_ki:.3f} V")

# PWM + RC szűrő átlagfeszültsége
for kitoltes in (0.25, 0.40, 0.75):
    print(f"PWM {kitoltes:.0%} → {3.3 * kitoltes:.2f} V")
```

## Összefoglalás

- Ideális DAC: V<sub>ki</sub> = V<sub>ref</sub> · D / 2<sup>N</sup>; a lépcsőt rekonstrukciós szűrő simítja.
- Súlyozott ellenállásos: R, 2R, 4R … (arány 2<sup>N−1</sup>); R–2R: csak két érték, a legelterjedtebb.
- Áramforrásos: gyors; ΔΣ: interpoláció + 1 bites DAC + szűrő, hangtechnika; PWM + RC: olcsó DAC.
- Jellemzők: felbontás, sebesség, beállási idő, ofszet, erősítéshiba, DNL, INL, monotonitás.

## A lecke feladata

```quiz required
? Egy 8 bites R–2R DAC referenciafeszültsége 5,12 V. Hány volt a kimenet D = 100 esetén?
= 2
= 2,0
= 2.0
! V = V_ref · D / 2^N.

? Egy 4 bites súlyozott ellenállásos DAC legkisebb ellenállása R. Hányszorosa ennek a legnagyobb ellenállás?
= 8
! R, 2R, 4R, 8R.

? Mi az R–2R létrás DAC legnagyobb előnye a súlyozott ellenállásossal szemben?
- Gyorsabb, mint bármely más DAC.
+ Csak kétféle értékű ellenállás kell, ezért pontosan és könnyen gyártható.
- Nem kell hozzá referenciafeszültség.
- 1 bites, ezért nagyon lineáris.

? Egy 3,3 V-os PWM kimenetet RC-szűrővel simítunk; a kitöltési tényező 40 %. Mekkora az átlagos kimeneti feszültség voltban?
= 1,32
= 1.32

? Mit jelent, hogy egy DAC monoton?
+ Növekvő bemeneti kódra a kimenet soha nem csökken.
- A kimenete mindig pontosan egyenes.
- Csak egyféle kimeneti feszültséget ad.
- Nincs ofszethibája.

? Mit ír le a DNL (differenciális nemlinearitás)?
- A valós görbe legnagyobb eltérését az ideális egyenestől.
+ Az egymás utáni kvantálási lépések eltérését az ideális 1 LSB-től.
- A 0 kódhoz tartozó kimenet eltérését.
- Az átalakítás idejét.
```
