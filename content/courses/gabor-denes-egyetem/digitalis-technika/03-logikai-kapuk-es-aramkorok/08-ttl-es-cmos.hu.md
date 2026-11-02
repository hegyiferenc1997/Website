---
title: Integrált áramköri kapuk – TTL és CMOS
summary: TTL és CMOS logikai családok, totem-pole, nyitott kollektoros és háromállapotú kimenet, terhelhetőség, késleltetés, fogyasztás és szintillesztés 3,3 V és 5 V között.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a két legfontosabb logikai család, a **TTL** és a **CMOS** jellemzőit,
- a **totem-pole**, a **nyitott kollektoros** (open-collector / open-drain) és a **háromállapotú** kimenetet,
- mit jelent a **terhelési viszony** (fan-out), és hogyan számolod,
- miért **fogyaszt** a CMOS csak kapcsoláskor, és hogyan **illesztesz** össze különböző családokat.

## A logikai érték villamos hordozói

A kapuk belsejében **tranzisztorok** kapcsolnak. Az, hogy milyen tranzisztorból és hogyan épül fel a kapu, határozza meg a **logikai családot**: feszültségszinteket, sebességet, fogyasztást.

| Jellemző              | TTL (74LS)         | CMOS (74HC / 4000)                       |
| --------------------- | ------------------ | ---------------------------------------- |
| tranzisztor           | bipoláris (BJT)    | komplementer MOSFET (n és p csatornás)   |
| tápfeszültség         | 5 V ± 5%           | 74HC: 2–6 V, 4000: 3–18 V                |
| nyugalmi fogyasztás   | jelentős (mA/kapu) | szinte nulla (nA–µA)                     |
| bemenet               | áramot vesz fel    | szigetelt kapu, nagy bemeneti ellenállás |
| késleltetés (tipikus) | ~10 ns             | 74HC: ~8–10 ns, 4000: 50–100 ns          |
| érzékenység           | robusztus          | sztatikus feltöltődésre érzékeny         |

Ma szinte minden integrált áramkör (processzor, memória, FPGA) **CMOS** technológiájú. A TTL elsősorban oktatásban és régi berendezésekben él; a **74HCT** sorozat CMOS, de TTL-kompatibilis bemeneti szintekkel.

## Kimenettípusok

### Totem-pole (ellenütemű) kimenet

Két tranzisztor egymás fölött: az egyik a kimenetet a tápra, a másik a földre húzza. Gyors, mindkét irányban erős. **Két ilyen kimenetet tilos összekötni** – ha az egyik 1-et, a másik 0-t ad, rövidzár lesz a táp és a föld között.

### Nyitott kollektoros / nyitott drain kimenet (OC / OD)

Csak a lehúzó tranzisztor van meg: a kimenet vagy **0-ra húz**, vagy „lebeg”. Egy külső **felhúzó ellenállás** (pull-up) adja az 1-es szintet. Előnyei:

- több kimenet **összeköthető** (**huzalozott ÉS**, _wired-AND_): ha bármelyik 0-t húz, a vonal 0,
- a felhúzó ellenállás **más tápfeszültségre** köthető → egyszerű **szintillesztés**,
- így működik az **I²C busz** (10. témakör) is.

### Háromállapotú (tri-state) kimenet

A 0 és 1 mellett van egy harmadik, **nagy impedanciás** (Z, „lekapcsolt”) állapot, amelyet egy engedélyező (_Enable_, OE) bemenet vezérel. Így több eszköz osztozhat egy **buszon**: mindig csak az egyik hajtja, a többi Z állapotban van.

## Terhelési viszony (fan-out)

Egy kimenet csak korlátozott számú bemenetet tud meghajtani. A **fan-out** megmondja, hány azonos családbeli bemenet köthető egy kimenetre:

**fan-out = min( I<sub>OL</sub> / I<sub>IL</sub> , I<sub>OH</sub> / I<sub>IH</sub> )**

**Példa (74LS):** I<sub>OL</sub> = 8 mA, I<sub>IL</sub> = 0,4 mA → 20; I<sub>OH</sub> = 0,4 mA, I<sub>IH</sub> = 20 µA → 20. A fan-out **20**.

CMOS-nál a bemenet szinte nem vesz fel áramot, ezért a korlát a **kapacitív terhelés**: minden újabb bemenet lassítja a jelváltást.

## A CMOS fogyasztása

Egy CMOS kapu nyugalomban szinte nem fogyaszt – csak **kapcsoláskor**, amikor a terhelő kapacitásokat feltölti és kisüti. A **dinamikus teljesítmény**:

**P = α · C · V<sup>2</sup> · f**

ahol C a kapcsolt kapacitás, V a tápfeszültség, f az órajel-frekvencia, α az aktivitás (a kapcsolások aránya, egyszerűsítve 1).

**Példa:** C = 10 pF, V = 5 V, f = 10 MHz → P = 10·10<sup>−12</sup> · 25 · 10<sup>7</sup> = **2,5 mW**.

Ebből látszik, miért csökkentették a processzorok tápfeszültségét 5 V-ról ~1 V-ra: a fogyasztás a feszültség **négyzetével** arányos.

## Gyakorlati szabályok

- **CMOS bemenetet soha ne hagyj szabadon!** A lebegő bemenet zajt szed össze, félúton állhat, és mindkét tranzisztor kinyithat (megnőtt áram, melegedés). A nem használt bemeneteket kösd tápra vagy földre (vagy egy használt bemenetre).
- Minden IC tápja mellé tegyél **hidegítő kondenzátort** (tipikusan 100 nF), közvetlenül a lábakhoz.
- Antisztatikus csomagolás, földelt csuklópánt a CMOS IC-k kezeléséhez.

## Családok illesztése

| Irány            | Probléma                                                                  | Megoldás                                                                                      |
| ---------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| TTL → CMOS (5 V) | a TTL V<sub>OH</sub> (min. 2,4 V) kevés a CMOS V<sub>IH</sub>-hoz (3,5 V) | felhúzó ellenállás, nyitott kollektoros puffer, tranzisztoros illesztő vagy **74HCT** bemenet |
| CMOS → TTL       | a régi 4000-es CMOS nem tud elég áramot adni                              | CMOS puffer IC                                                                                |
| 3,3 V → 5 V      | a 3,3 V-os jel kevés lehet az 5 V-os CMOS-nak                             | szintillesztő (pl. **TXS0108E**, kétirányú)                                                   |
| 5 V → 3,3 V      | az 5 V **tönkreteheti** a 3,3 V-os bemenetet                              | 5 V-tűrő puffer (pl. **SN74LVC245A**), feszültségosztó                                        |

> Arduino (5 V) és Raspberry Pi (3,3 V) összekötésekor ez mindennapos feladat!

## Összefoglalás

- TTL: bipoláris, 5 V, állandó fogyasztás; CMOS: MOSFET, széles tápfeszültség, fogyasztás csak kapcsoláskor.
- Totem-pole kimenetet nem szabad összekötni; nyitott kollektoros = huzalozott ÉS + felhúzó ellenállás; tri-state = buszra köthető.
- Fan-out = min(I<sub>OL</sub>/I<sub>IL</sub>, I<sub>OH</sub>/I<sub>IH</sub>).
- P = C·V²·f; CMOS bemenet nem lebeghet; különböző szintek közé illesztés kell.

## A lecke feladata

```quiz required
? Egy kimenetre I<sub>OL</sub> = 16 mA, I<sub>OH</sub> = 0,4 mA, egy bemenetre I<sub>IL</sub> = 1,6 mA, I<sub>IH</sub> = 40 µA. Mennyi a fan-out?
= 10
! min(16 / 1,6 ; 0,4 / 0,04).

? Mennyi egy CMOS kapu dinamikus fogyasztása mW-ban, ha C = 20 pF, V = 3,3 V, f = 50 MHz (α = 1)?
= 10,89
= 10.89
! P = C · V² · f = 20·10<sup>−12</sup> · 3,3² · 50·10<sup>6</sup>.

? Melyik kimenettípusnál köthető össze **biztonságosan** több kimenet, felhúzó ellenállással?
- totem-pole
+ nyitott kollektoros (open-collector)
- minden kimenettípusnál
! Itt a kimenet csak lehúzni tud, így nem lehet rövidzár.

? Mi a háromállapotú kimenet harmadik állapota?
- tiltott sáv
+ nagy impedanciás (lekapcsolt) állapot
- negatív feszültség
- fél tápfeszültség
! Ilyenkor a kimenet gyakorlatilag le van választva a vonalról.

? Mit kell tenni egy CMOS IC nem használt bemenetével?
- szabadon hagyni
+ tápra vagy földre kötni
- ellenálláson át a kimenetre kötni
! A lebegő CMOS bemenet zajt szed össze és túlfogyasztást okozhat.

? Hányszorosára nő a CMOS dinamikus fogyasztása, ha a tápfeszültséget megduplázzuk (minden más változatlan)?
= 4
! P arányos V²-tel.
```
