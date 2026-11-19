---
title: Gyakorlás – digitális alapok
summary: Ellenőrző kérdések és összefoglaló feladatlap az első témakörhöz.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Mi a különbség a diszkrét idejű és a digitális jel között?</summary>

A diszkrét idejű jelnek csak bizonyos időpontokban van értéke, de az érték bármekkora lehet (folytonos amplitúdó). A digitális jel ezen felül amplitúdóban is diszkrét: csak véges sok szintet vehet fel.

</details>

<details>
<summary>2. Miért lehet egy digitális jelet zaj után hibátlanul visszaállítani?</summary>

Mert a vevő csak két szint között dönt egy küszöb alapján. Amíg a zaj kisebb a zajtartaléknál, a döntés helyes, és a jel tisztán újraelőállítható.

</details>

<details>
<summary>3. Mit jelent, hogy egy család zajtartaléka 0,4 V?</summary>

Legfeljebb 0,4 V-os zavar rakódhat a jelre két kapu között úgy, hogy a vevő még biztosan helyes logikai értéket érzékeljen.

</details>

<details>
<summary>4. Miért nem lehet tetszőlegesen nagy egy áramkör órajel-frekvenciája?</summary>

Mert a jelnek az órajel két éle között végig kell haladnia a leghosszabb (kritikus) úton. Az órajel periódusa nem lehet kisebb a kritikus út késleltetésénél (plusz a tárolók saját idejénél).

</details>

<details>
<summary>5. Mi a szekvenciális hálózat két fő része?</summary>

Kombinációs logika és memória (tároló elemek), visszacsatolással összekötve.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy 74HC (5 V-os CMOS) kapunál V<sub>OH</sub> = 4,4 V és V<sub>IH</sub> = 3,5 V. Hány volt az NM<sub>H</sub>?
= 0,9
= 0,9 V
= 0.9
! NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>.

? Egy 74HC kapunál V<sub>IL</sub> = 1,5 V és V<sub>OL</sub> = 0,1 V. Hány volt az NM<sub>L</sub>?
= 1,4
= 1,4 V
= 1.4
! NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.

? Egy processzor órajele 2,5 GHz. Hány ns a periódusideje?
= 0,4
= 0,4 ns
= 0.4
! T = 1 / f = 1 / (2,5 · 10<sup>9</sup> Hz).

? Egy 1 kHz-es PWM-jel kitöltési tényezője 30%. Hány µs ideig magas egy perióduson belül?
= 300
= 300 µs
! T = 1 ms = 1000 µs, ennek 30%-a.

? A kritikus út 5 kapun megy át, egyenként 4 ns késleltetéssel. Legfeljebb hány MHz lehet az órajel (a tárolók idejét elhanyagolva)?
= 50
= 50 MHz
! A periódus legalább 5 · 4 ns = 20 ns kell legyen; f = 1 / T.

? Mi jellemző a **negatív logikára**?
- a feszültség negatív
+ az alacsonyabb feszültségszint jelenti a logikai 1-et
- a kapuk kimenete mindig negált
- csak TTL áramkörökben használják
! Az aktív alacsony jelek (pl. RESET̅) ezt a szemléletet követik.

? Melyik nem szekvenciális?
- számláló
- léptetőregiszter
+ teljes összeadó
- processzor
! A teljes összeadó kimenete csak a három bemenet pillanatnyi értékétől függ.
```
