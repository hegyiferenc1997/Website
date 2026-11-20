---
title: Gyakorlás – digitális alapok
summary: Ellenőrző kérdések és összefoglaló feladatlap az első témakörhöz.
minutes: 45
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Zajtartalék két családra.** Írd meg a `zajtartalek(voh, vol, vih, vil)` függvényt, amely visszaadja az `(NMH, NML)` párt két tizedesre kerekítve! (NMH = VOH − VIH, NML = VIL − VOL.)

```python starter
def zajtartalek(voh, vol, vih, vil):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

Ha bármelyik érték negatív, a kapcsolat megbízhatatlan – a második eset pontosan a 3,3 V-os kimenet és az 5 V-os 74HC bemenet problémája.

```python solution
def zajtartalek(voh, vol, vih, vil):
    nmh = voh - vih              # magas szinten ennyi zaj fér rá
    nml = vil - vol              # alacsony szinten ennyi
    return (round(nmh, 2), round(nml, 2))
```

</details>

```python test
assert zajtartalek(4.4, 0.1, 3.5, 1.5) == (0.9, 1.4)     # 74HC → 74HC
assert zajtartalek(2.4, 0.4, 3.5, 1.5) == (-1.1, 1.1)    # 3,3 V → 74HC: negatív!
assert zajtartalek(4.4, 0.1, 2.0, 0.8) == (2.4, 0.7)     # 74HC → 74HCT
print("Minden ellenőrzés sikeres!")
```

**2.** **Maximális órajel.** Írd meg az `f_max_mhz(t_cq, t_logika, t_setup)` függvényt (minden idő ns-ban), amely egy tizedesre kerekítve megadja a legnagyobb órajel-frekvenciát MHz-ben!

```python starter
def f_max_mhz(t_cq, t_logika, t_setup):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def f_max_mhz(t_cq, t_logika, t_setup):
    t_min = t_cq + t_logika + t_setup     # ns
    return round(1000 / t_min, 1)          # 1 / ns = GHz → ×1000 = MHz
```

</details>

```python test
assert f_max_mhz(2, 10, 1) == 76.9
assert f_max_mhz(1, 8, 1) == 100.0
assert f_max_mhz(0.5, 2.4, 0.1) == 333.3
print("Minden ellenőrzés sikeres!")
```

**3.** **PWM kitöltési tényező.** Egy mikrokontroller lába 0 V-ot vagy `u_tap` voltot ad ki. Írd meg a `kitoltes(u_cel, u_tap)` függvényt, amely megadja, mekkora kitöltési tényező (0…1) kell a kívánt átlagfeszültséghez! A tartományon kívüli kérést vágd 0-ra vagy 1-re, az eredményt kerekítsd 3 tizedesre.

```python starter
def kitoltes(u_cel, u_tap):
    return u_cel / u_tap
```

<details>
<summary>Megoldás</summary>

```python solution
def kitoltes(u_cel, u_tap):
    d = u_cel / u_tap                  # U_átlag = D · U_tápfeszültség
    return round(min(max(d, 0), 1), 3) # 0 és 1 közé vágjuk
```

</details>

```python test
assert kitoltes(1.25, 5) == 0.25
assert kitoltes(3.3, 3.3) == 1
assert kitoltes(7, 5) == 1          # többet nem tud adni a láb
assert kitoltes(-1, 5) == 0
assert kitoltes(1, 3.3) == 0.303
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy jelet 10-szer továbbítunk zajos csatornán. Melyiknél halmozódik a zaj?
+ az analóg jelnél
- a digitális jelnél
- mindkettőnél ugyanúgy
! A digitális vevő minden lépésben újra eldönti, 0 vagy 1 – így a zaj nem adódik össze.

? Mire jó a 74HCT család a 74HC-vel szemben?
- gyorsabb
+ TTL-kompatibilis a bemeneti szintje, így 3,3 V-os vagy TTL kimenet is biztosan meghajtja
- kevesebbet fogyaszt
! VIH = 2,0 V a 74HC 3,5 V-ja helyett.

? Egy jel felfutási ideje 3,5 ns. Kb. hány MHz-es összetevőket tartalmaz?
= 100
! Sávszélesség ≈ 0,35 / tr = 0,35 / 3,5 ns = 0,1 GHz.

? Hány ns a periódusideje egy 250 MHz-es órajelnek?
= 4
! T = 1 / f = 1 / 250 MHz = 4 ns.

? Egy LED-et 5 V-os PWM-mel hajtunk, 40% kitöltéssel. Mekkora az átlagfeszültség (V)?
= 2
! 0,4 · 5 V = 2 V.
```
