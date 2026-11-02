---
title: Mintavételezés és kvantálás
summary: Az analóg jel digitalizálásának két lépése, a Nyquist–Shannon-tétel és az aliasing, felbontás, LSB és MSB, a digitális érték kiszámítása, kvantálási hiba és jel-zaj viszony.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a digitalizálás két lépését: **mintavételezés** (időben) és **kvantálás** (amplitúdóban),
- a **Nyquist–Shannon-tételt** és az **aliasing** jelenségét,
- mi a **felbontás**, az **LSB** és az **MSB** egy átalakítónál,
- hogyan számolod ki egy feszültség **digitális kódját**,
- mi a **kvantálási hiba** és hogyan függ a bitszámtól.

## Az ADC és a DAC

A világ jelei (hang, hőmérséklet, fény, nyomás) **analógok**, a feldolgozás viszont digitális. A kettő között két átalakító áll:

- **ADC** (analog-to-digital converter, A/D átalakító): analóg jel → digitális szám,
- **DAC** (digital-to-analog converter, D/A átalakító): digitális szám → analóg jel.

Az analóg → digitális út két lépésből áll.

## 1. Mintavételezés – időben

A folytonos jelből **egyenlő időközönként** (T<sub>s</sub>) mintát veszünk; a mintavételi frekvencia **f<sub>s</sub> = 1 / T<sub>s</sub>**. Az így kapott jel **időben diszkrét**, de értéke még bármi lehet.

### Nyquist–Shannon-tétel

Egy jel a mintáiból **hibátlanul visszaállítható**, ha a mintavételi frekvencia **nagyobb, mint a jelben előforduló legnagyobb frekvencia kétszerese**:

**f<sub>s</sub> > 2 · f<sub>max</sub>**

Az f<sub>s</sub>/2 a **Nyquist-frekvencia**. Példa: az emberi hallás kb. 20 kHz-ig terjed → legalább **40 kHz** mintavétel kell; a CD ezért **44,1 kHz**-cel mintavételez.

### Aliasing (átlapolódás)

Ha a jelben f<sub>s</sub>/2-nél nagyobb frekvencia van, az a mintákban egy **hamis, alacsonyabb frekvenciaként** jelenik meg – ez az **aliasing**. (Ugyanez okozza, hogy filmen a kerék visszafelé forogni látszik.) Védekezés: az ADC előtt egy **aluláteresztő szűrő** (anti-aliasing szűrő) levágja az f<sub>s</sub>/2 fölötti összetevőket.

## 2. Kvantálás – amplitúdóban

A mintát **véges számú szint** egyikére kerekítjük. Egy **N bites** átalakító **2<sup>N</sup>** szintet különböztet meg (8 bit → 256 szint, 0…255).

**Példa:** bemeneti tartomány 0–5 V, felbontás 8 bit.

**LSB** (least significant bit, a legkisebb lépés feszültsége):

**LSB = (V<sub>max</sub> − V<sub>min</sub>) / (2<sup>N</sup> − 1) = 5 V / 255 ≈ 19,6 mV**

**MSB** (a legfelső bit súlya, 8 bitnél 128): MSB = 128 · LSB ≈ **2,51 V**

> Az irodalomban gyakori az LSB = V<sub>ref</sub> / 2<sup>N</sup> definíció is (5 V / 256 = 19,5 mV). A különbség a teljes skála végpontjának értelmezéséből adódik; mindig nézd meg, melyiket használja az adatlap vagy a feladat. Ebben a témakörben az ADC-nél a (2<sup>N</sup> − 1)-es, az R–2R DAC-nál a 2<sup>N</sup>-es alakot használjuk.

### A digitális érték kiszámítása

**D = (V<sub>in</sub> / V<sub>ref</sub>) · (2<sup>N</sup> − 1)**, egészre csonkolva.

V<sub>in</sub> = 2,3 V, V<sub>ref</sub> = 5 V, N = 8: D = 2,3 / 5 · 255 = 117,3 → **117** → binárisan **0111 0101**.

A tizedesjegyek elvesznek – ez a **kvantálási hiba**.

### Vissza analógra

Ha a 117-es kódot DAC-cal visszaalakítjuk: V = 117 · 19,6 mV ≈ **2,294 V** – kb. 6 mV-tal kevesebb az eredeti 2,3 V-nál.

## Kvantálási hiba és jel-zaj viszony

- Kerekítésnél a hiba legfeljebb **±½ LSB**, csonkolásnál 0…1 LSB.
- A hiba úgy viselkedik, mint egy hozzáadott zaj (**kvantálási zaj**).
- Egy ideális N bites átalakító **jel-zaj viszonya** (SNR) szinuszos jelre: **SNR ≈ 6,02 · N + 1,76 dB**. Minden plusz bit kb. **6 dB**-lel javít. (16 bit → ≈ 98 dB, 24 bit → ≈ 146 dB.)

**Dithering:** érdekes módon egy kis, szándékosan hozzáadott zaj **javíthatja** az eredményt: a durva lépcsők helyett a hiba egyenletes, kevésbé zavaró zajjá „simul” (hangtechnika 24 → 16 bites átalakításnál, képeknél a színsávosodás ellen).

```python run
# 8 bites ADC: digitális kód, bináris alak és visszaalakítás
v_ref, n = 5.0, 8
lsb = v_ref / (2 ** n - 1)
print(f"LSB = {lsb * 1000:.1f} mV, MSB = {128 * lsb:.2f} V")

for v_in in (0.0, 1.0, 2.3, 4.99):
    d = int(v_in / v_ref * (2 ** n - 1))       # csonkolás egészre
    vissza = d * lsb
    print(f"{v_in:5.2f} V → D = {d:3d} = {d:08b} → vissza {vissza:.3f} V")
```

## Összefoglalás

- Digitalizálás: mintavételezés (időben) + kvantálás (amplitúdóban) + kódolás.
- Nyquist: f<sub>s</sub> > 2 f<sub>max</sub>; különben aliasing → anti-aliasing szűrő.
- N bit → 2<sup>N</sup> szint; LSB = tartomány / (2<sup>N</sup> − 1); D = V<sub>in</sub> / V<sub>ref</sub> · (2<sup>N</sup> − 1).
- Kvantálási hiba ≈ ½ LSB; SNR ≈ 6,02 N + 1,76 dB.

## A lecke feladata

```quiz required
? Hány kvantálási szintet különböztet meg egy 8 bites ADC?
= 256

? Mekkora az LSB egy 0–5 V tartományú, 8 bites ADC-nél (5 V / 255), millivoltban, egy tizedesjegyre?
= 19,6
= 19.6

? Mekkora digitális értéket (tízes számrendszerben) ad egy 8 bites, 5 V referenciájú ADC 2,3 V bemenetre (csonkolással)?
= 117
! D = 2,3 / 5 · 255 = 117,3.

? Írd fel a 117-et 8 bites bináris számként!
= 01110101

? Legalább hány kHz-es mintavételi frekvencia kell egy 20 kHz-ig terjedő hangjelhez?
= 40
! Nyquist: f_s > 2 · f_max.

? Mi az aliasing?
- A kvantálási szintek közötti kerekítési hiba.
+ A Nyquist-frekvenciánál nagyobb frekvenciájú összetevő hamis, alacsonyabb frekvenciaként jelenik meg a mintákban.
- Az ADC túlterhelése.
- A digitális jel késleltetése.

? Kb. hány dB az ideális 16 bites átalakító jel-zaj viszonya (6,02 · N + 1,76)? Add meg egész számra kerekítve!
= 98
```
