---
title: Gyakorlás – AD és DA átalakítók
summary: Ellenőrző kérdések és összefoglaló feladatlap: mintavételezés, Nyquist-tétel, kvantálás, LSB, ADC- és DAC-típusok, jellemzők.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért kell az ADC elé aluláteresztő szűrő?</summary>

Mert a Nyquist-frekvenciánál (f<sub>s</sub>/2) nagyobb frekvenciájú összetevők a mintavételezés után hamis, alacsonyabb frekvenciaként jelennének meg (aliasing), és utólag már nem lehetne őket megkülönböztetni a valódi jeltől. Az anti-aliasing szűrő ezeket még az átalakítás előtt levágja.

</details>

<details>
<summary>2. Mit nyerünk egy plusz bittel az ADC felbontásában?</summary>

A szintek száma megduplázódik, az LSB (és a kvantálási hiba) a felére csökken, a jel-zaj viszony kb. 6 dB-lel javul.

</details>

<details>
<summary>3. Miért SAR-típusú szinte minden mikrokontroller ADC-je?</summary>

Mert jó kompromisszum: N bithez csak egy komparátor, egy DAC és egy regiszter kell (kicsi, kis fogyasztású), mégis elég gyors (N órajel) és elég pontos (10–12 bit) a legtöbb szenzoros méréshez.

</details>

<details>
<summary>4. Miért esik ki az R és a C értéke a dual-slope ADC eredményéből?</summary>

Mert ugyanaz az integrátor (ugyanaz az RC) végzi a fel- és a visszaintegrálást; a végeredmény a két idő arányától függ: V<sub>in</sub> = U<sub>ref</sub> · T<sub>2</sub> / T<sub>1</sub>. Az RC mindkét meredekségben azonos szorzóként szerepel, ezért kiesik.

</details>

<details>
<summary>5. Ugyanaz-e a felbontás és a pontosság?</summary>

Nem. A felbontás azt mondja meg, hány szintet különböztet meg az átalakító; a pontosságot az ofszet-, erősítés- és nemlinearitási hibák (INL, DNL) határozzák meg. Egy nagy felbontású, de nemlineáris átalakító pontatlan lehet.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány kvantálási szintje van egy 10 bites ADC-nek?
= 1024

? Egy 10 bites, 3,3 V referenciájú ADC 1,65 V bemenetet mér. Mekkora a digitális érték (D = V_in / V_ref · (2^N − 1), csonkolással)?
= 511
! 1,65 / 3,3 · 1023 = 511,5.

? A telefonos beszédátvitel kb. 4 kHz-ig terjedő jelet visz át. Legalább hány kHz-es mintavétel kell?
= 8

? Egy 4 bites SAR ADC belső DAC-jának lépése 1 V. A bemenet 9,6 V. Mi az eredmény binárisan?
= 1001
! 8 → megtart, 12 → elvet, 10 → elvet, 9 → megtart.

? Hány komparátor kell egy 6 bites flash ADC-hez?
= 63

? Egy 10 bites R–2R DAC referenciafeszültsége 10,24 V. Hány volt a kimenet D = 512 esetén?
= 5,12
= 5.12

? Melyik típus jellemző a hangtechnikai (audio) AD és DA átalakítókra?
- flash
- súlyozott ellenállásos
+ delta–szigma
- dual-slope

? Kb. hány dB az ideális 12 bites átalakító jel-zaj viszonya (6,02 · N + 1,76)? Egészre kerekítve!
= 74
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **AD átalakító kódja.** Írd meg az `adc_kod(u, u_ref, bitek)` függvényt, amely megadja egy ideális AD átalakító kimeneti kódját: `⌊u / u_ref · 2^bitek⌋`, a 0 … 2^bitek − 1 tartományba vágva (a túl nagy bemenet a legnagyobb kódot adja)!

```python starter
def adc_kod(u, u_ref, bitek):
    return int(u / u_ref * 2 ** bitek)
```

<details>
<summary>Megoldás</summary>

```python solution
def adc_kod(u, u_ref, bitek):
    kod = int(u / u_ref * 2 ** bitek)          # lefelé kerekítés: melyik lépcsőfokon vagyunk
    return min(max(kod, 0), 2 ** bitek - 1)    # telítés a tartomány szélein
```

</details>

```python test
assert adc_kod(3.21, 5.0, 8) == 164
assert adc_kod(2.5, 5.0, 10) == 512
assert adc_kod(5.0, 5.0, 8) == 255           # a referencia már nem fér el: legnagyobb kód
assert adc_kod(-0.2, 5.0, 8) == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Látszólagos frekvencia.** Írd meg az `alias(f, fs)` függvényt, amely megadja, hány Hz-esnek látszik egy f frekvenciájú szinusz fs mintavételezés után (az eredmény 0 és fs/2 közé esik)!

```python starter
def alias(f, fs):
    return f
```

<details>
<summary>Megoldás</summary>

```python solution
def alias(f, fs):
    f = f % fs                     # a mintavétel szempontjából f és f ± k·fs egyforma
    return min(f, fs - f)          # a Nyquist-frekvencia fölötti rész visszahajlik
```

</details>

```python test
assert alias(1000, 8000) == 1000
assert alias(7000, 8000) == 1000
assert alias(9000, 8000) == 1000
assert alias(5000, 8000) == 3000
assert alias(44100, 44100) == 0
print("Minden ellenőrzés sikeres!")
```

**3.** **R–2R DA átalakító.** Írd meg a `dac(bitek, u_ref)` függvényt, ahol `bitek` egy bitlista **az MSB-vel kezdve**! A kimenet: minden 1-es bit a súlyával arányos feszültséget ad hozzá (MSB: u_ref/2, a következő u_ref/4, …). Az eredményt kerekítsd 4 tizedesre.

```python starter
def dac(bitek, u_ref):
    return 0.0
```

<details>
<summary>Megoldás</summary>

A harmadik teszt az előző leckéből ismerős SAR-eredmény: a 10100100 kód visszaalakítva 3,2031 V – a 3,21 V-os bemenet egy LSB-n belül.

```python solution
def dac(bitek, u_ref):
    u = 0.0
    for i, b in enumerate(bitek):
        u += b * u_ref / 2 ** (i + 1)      # az MSB súlya 1/2, a következőé 1/4, …
    return round(u, 4)
```

</details>

```python test
assert dac([1, 0, 0, 0], 5.0) == 2.5
assert dac([1, 1, 1, 1], 5.0) == 4.6875      # 15/16 · 5 V: a referenciát sosem éri el
assert dac([1, 0, 1, 0, 0, 1, 0, 0], 5.0) == 3.2031
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Legalább mekkora mintavételi frekvencia kell egy 20 kHz-ig terjedő hangjelhez (kHz)?
= 40
! A Nyquist-feltétel: több mint kétszeres – ezért 44,1 kHz a CD.

? Mekkora egy 10 bites, 3,3 V-os referenciájú AD átalakító LSB-je (mV, egy tizedesre)?
= 3.2
= 3,2
! 3300 mV / 1024 ≈ 3,2 mV.

? Melyik AD átalakító a leggyorsabb, de 8 bithez 255 komparátor kell hozzá?
+ flash (párhuzamos)
- szukcesszív közelítéses (SAR)
- kettős meredekségű (dual-slope)
- delta–szigma
! Egy lépésben dönt, de a komparátorok száma 2^n − 1.

? Mire való az aliasing-szűrő?
- a kvantálási zaj csökkentésére
+ a Nyquist-frekvencia feletti összetevők levágására a mintavétel előtt
- a kimeneti jel simítására a DA átalakító után
! Mintavétel után a visszahajlott összetevők már nem választhatók szét.

? Mit jelent, hogy egy DA átalakító monoton?
+ nagyobb kódra sosem ad kisebb kimeneti feszültséget
- minden kódra pontosan az ideális feszültséget adja
- csak egy feszültségszintet tud
! A nem monoton DAC szabályozókörben instabilitást okozhat.
```
