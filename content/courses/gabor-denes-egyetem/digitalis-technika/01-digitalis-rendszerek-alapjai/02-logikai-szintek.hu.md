---
title: Logikai szintek és zajtartalék
summary: Hogyan lesz a feszültségből 0 és 1? Bemeneti és kimeneti szintek, tiltott sáv, zajtartalék, pozitív és negatív logika.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mit jelent a **logikai magas** (HIGH) és **alacsony** (LOW) szint,
- mit jelölnek a **V<sub>IH</sub>, V<sub>IL</sub>, V<sub>OH</sub>, V<sub>OL</sub>** adatlap-értékek,
- hogyan számoljuk ki a **zajtartalékot**,
- mi a **pozitív** és a **negatív logika**.

## Feszültségtartományok, nem egyetlen érték

A valóságos áramkörben a „0” és az „1” nem egy-egy pontos feszültség, hanem egy-egy **tartomány**. A kettő között egy **tiltott (bizonytalan) sáv** van: ha a bemenet ide esik, nem tudni, mit „lát” a kapu.

A **küszöbfeszültség** (V<sub>T</sub>, _threshold voltage_) az a szint, amelynél a kapu kimenete átbillen egyik állapotból a másikba. Pontos értéke áramkörenként és technológiánként más, ezért mindig az **adatlap** (datasheet) a mérvadó.

| Jelölés        | Angolul             | Jelentés                                                       |
| -------------- | ------------------- | -------------------------------------------------------------- |
| V<sub>OH</sub> | Output High Voltage | a kimenet ennél **nem kisebb**, ha 1-et ad ki (garantált min.) |
| V<sub>OL</sub> | Output Low Voltage  | a kimenet ennél **nem nagyobb**, ha 0-t ad ki (garantált max.) |
| V<sub>IH</sub> | Input High Voltage  | a bemenet ettől a feszültségtől **felfelé** biztosan 1         |
| V<sub>IL</sub> | Input Low Voltage   | a bemenet eddig a feszültségig **lefelé** biztosan 0           |

## Tipikus értékek

| Család           | V<sub>CC</sub> | V<sub>IL</sub> (max) | V<sub>IH</sub> (min) | V<sub>OL</sub> (max) | V<sub>OH</sub> (min) |
| ---------------- | -------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| TTL (74LS)       | 5 V            | 0,8 V                | 2,0 V                | 0,4 V                | 2,4 V                |
| CMOS (74HC, 5 V) | 5 V            | 1,5 V                | 3,5 V                | 0,1 V                | 4,4 V                |
| LVCMOS (3,3 V)   | 3,3 V          | 0,8 V                | 2,0 V                | 0,4 V                | 2,4 V                |

## Zajtartalék (noise margin)

A zajtartalék megmutatja, **mekkora zaj** rakódhat a jelre két kapu között úgy, hogy a vevő még helyesen döntsön.

- **magas szintű zajtartalék:** NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>
- **alacsony szintű zajtartalék:** NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>

**Példa (TTL):** NM<sub>H</sub> = 2,4 V − 2,0 V = **0,4 V**, NM<sub>L</sub> = 0,8 V − 0,4 V = **0,4 V**.

```text
  kimenet (adó)              bemenet (vevő)
  5 V ┐                       5 V ┐
      │ biztos 1                  │ biztos 1
 2,4 V┤ VOH ──┐ NMH=0,4V    2,0 V ┤ VIH
      │       └────────────┘      │ tiltott sáv
 0,4 V┤ VOL ──┐ NML=0,4V    0,8 V ┤ VIL
      │ biztos 0└──────────┘      │ biztos 0
  0 V ┘                       0 V ┘
```

Minél nagyobb a zajtartalék, annál **zavarvédettebb** az összeköttetés. Ezért fontos, hogy különböző családokat (pl. 3,3 V-os és 5 V-os eszközt) csak **szintillesztéssel** kössünk össze – erről a TTL és CMOS leckében lesz szó.

## Pozitív és negatív logika

- **Pozitív logika:** a magasabb feszültség jelenti az **1**-et (ez a megszokott).
- **Negatív logika:** az alacsonyabb feszültség jelenti az 1-et.

Ugyanaz az áramkör a két értelmezésben **más függvényt** valósít meg: egy pozitív logikájú ÉS kapu negatív logikában VAGY kapuként viselkedik (ez a De Morgan-azonosság fizikai megfelelője, lásd 3. témakör). Az „aktív alacsony” jeleket (pl. RESET̅, CS̅) felülvonással vagy `_n` / `#` végződéssel jelöljük.

## Összefoglalás

- A 0 és az 1 egy-egy feszültségtartomány; köztük tiltott sáv van.
- V<sub>OH</sub>, V<sub>OL</sub> a kimenet, V<sub>IH</sub>, V<sub>IL</sub> a bemenet garantált határai.
- Zajtartalék: NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>, NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.
- Pozitív logikában a magas szint az 1.

## A lecke feladata

```quiz required
? Egy család adatai: V<sub>OH</sub> = 2,7 V, V<sub>IH</sub> = 2,0 V. Hány volt a **magas szintű zajtartalék** (NM<sub>H</sub>)?
= 0,7
= 0,7 V
= 0.7
! NM<sub>H</sub> = V<sub>OH</sub> − V<sub>IH</sub>.

? Ugyanennél a családnál V<sub>IL</sub> = 0,8 V és V<sub>OL</sub> = 0,5 V. Hány volt az **alacsony szintű zajtartalék** (NM<sub>L</sub>)?
= 0,3
= 0,3 V
= 0.3
! NM<sub>L</sub> = V<sub>IL</sub> − V<sub>OL</sub>.

? Egy 74LS (TTL) kapu bemenetén 1,4 V mérhető. Mit „lát” a kapu?
- biztosan logikai 0-t
- biztosan logikai 1-et
+ nem meghatározott: a tiltott sávba esik
! TTL-nél 0,8 V alatt biztos 0, 2,0 V fölött biztos 1.

? Mit jelent a V<sub>IH</sub> jelölés?
- a kimenet legnagyobb alacsony szintű feszültségét
+ azt a legkisebb bemeneti feszültséget, amelyet a kapu még biztosan 1-nek vesz
- a tápfeszültséget
- a küszöbfeszültség pontos értékét
! I = input (bemenet), H = high (magas).
```
