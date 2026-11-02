---
title: Gyakorlás – AD és DA átalakítók
summary: Ellenőrző kérdések és összefoglaló feladatlap: mintavételezés, Nyquist-tétel, kvantálás, LSB, ADC- és DAC-típusok, jellemzők.
minutes: 30
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
