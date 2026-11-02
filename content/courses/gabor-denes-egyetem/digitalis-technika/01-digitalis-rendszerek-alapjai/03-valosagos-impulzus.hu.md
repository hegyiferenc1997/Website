---
title: A valóságos impulzus és az órajel
summary: Felfutási és lefutási idő, periódusidő, frekvencia, kitöltési tényező és jelterjedési késleltetés – számolással.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért **nem tökéletes négyszög** a valódi digitális jel,
- a **felfutási** és **lefutási idő**, a **periódusidő**, a **frekvencia** és a **kitöltési tényező** fogalmát,
- mi a **jelterjedési késleltetés**, és hogyan adódik össze,
- mire való az **órajel**.

## Az ideális és a valóságos négyszögjel

A digitális jelet gyakran tökéletes négyszögként rajzoljuk, amely **azonnal** ugrik 0-ról 1-re. A valóságban minden áramkörben vannak **szórt kapacitások és induktivitások**, a töltéshordozóknak pedig idő kell a mozgáshoz, ezért az átmenetek **véges idő alatt** zajlanak le.

```text
 ideális:     ┌─────┐     ┌─────
              │     │     │
         ─────┘     └─────┘

 valóságos:     ╱‾‾‾‾╲      ╱‾‾‾
               ╱      ╲    ╱
         ─────╱        ╲──╱
             tr        tf
```

## Az impulzus jellemzői

| Jellemző                              | Jele       | Jelentés                                                     |
| ------------------------------------- | ---------- | ------------------------------------------------------------ |
| felfutási idő (*rise time*)           | t<sub>r</sub> | amíg a jel az amplitúdó **10%-áról 90%-ára** emelkedik       |
| lefutási idő (*fall time*)            | t<sub>f</sub> | amíg a jel **90%-ról 10%-ra** csökken                         |
| impulzusszélesség                     | t<sub>H</sub> | a magas szinten töltött idő (az 50%-os pontok között mérve)   |
| periódusidő (*tempus*)                | T          | egy teljes ciklus (alacsony–magas–alacsony) ideje             |
| frekvencia                            | f          | ismétlődések száma másodpercenként: **f = 1 / T**             |
| kitöltési tényező (*duty cycle*)      | D          | **D = t<sub>H</sub> / T**, százalékban                        |

### Mértékegységek gyorsan

| előtag | szorzó       | idő példa | frekvencia példa |
| ------ | ------------ | --------- | ---------------- |
| milli  | 10<sup>−3</sup> | 1 ms   | 1 kHz = 10<sup>3</sup> Hz |
| mikro  | 10<sup>−6</sup> | 1 µs   | 1 MHz = 10<sup>6</sup> Hz |
| nano   | 10<sup>−9</sup> | 1 ns   | 1 GHz = 10<sup>9</sup> Hz |

**Kidolgozott példák**

1. T = 20 ns → f = 1 / (20 · 10<sup>−9</sup> s) = 50 · 10<sup>6</sup> Hz = **50 MHz**.
2. f = 100 MHz → T = 1 / 10<sup>8</sup> s = **10 ns**.
3. t<sub>H</sub> = 3 µs, T = 12 µs → D = 3 / 12 = **25%**.

Ugyanezt Pythonban is kiszámolhatod:

```python run
# Periódusidő, frekvencia és kitöltési tényező
T = 20e-9          # periódusidő: 20 ns
f = 1 / T          # frekvencia Hz-ben
print(f"f = {f / 1e6:.0f} MHz")

t_magas = 3e-6     # magas szinten töltött idő: 3 µs
T2 = 12e-6         # periódusidő: 12 µs
print(f"kitöltési tényező = {t_magas / T2 * 100:.0f} %")
```

## Jelterjedési késleltetés

Minden kapunak van **jelterjedési késleltetése** (t<sub>pd</sub>, *propagation delay*): a bemenet változása után ennyi idő múlva jelenik meg a kimeneten a változás. Két értéke van: t<sub>PLH</sub> (kimenet 0→1) és t<sub>PHL</sub> (kimenet 1→0); a kettő átlaga a t<sub>pd</sub>.

Egymás után kötött kapuknál a késleltetések **összeadódnak**: ha egy jel 4 darab, egyenként 8 ns-os kapun halad át, a teljes késleltetés **32 ns**. A leghosszabb utat **kritikus útnak** nevezzük: ez korlátozza, milyen gyorsan működhet az áramkör. Az eltérő hosszúságú utak okozzák a **hazárdokat** is (4. témakör).

## Az órajel

Az **órajel** (*clock*, CLK) egy szabályos, általában 50%-os kitöltésű négyszögjel, amely a **szinkron** áramkörök ütemét adja: a tárolók csak az órajel egy meghatározott pillanatában (általában a **felfutó élén**) veszik át az új értéket. Egy 3 GHz-es processzor órajelének periódusideje kb. **0,33 ns** – ennyi idő alatt a fény is csak ~10 cm-t tesz meg!

Az órajel periódusa nem lehet rövidebb a kritikus út késleltetésénél, különben a tárolók még a régi, „félkész” értéket vennék át.

## Összefoglalás

- A valódi jel átmenetei véges idejűek: t<sub>r</sub> (10%→90%), t<sub>f</sub> (90%→10%).
- f = 1 / T, D = t<sub>H</sub> / T.
- Sorba kötött kapuk késleltetései összeadódnak; a leghosszabb út a kritikus út.
- Az órajel adja a szinkron áramkörök ütemét.

## A lecke feladata

```quiz required
? Egy órajel periódusideje 40 ns. Hány MHz a frekvenciája?
= 25
= 25 MHz
! f = 1 / T = 1 / (40 · 10<sup>−9</sup> s).

? Egy jel 5 µs-ig magas, a periódusideje 20 µs. Hány százalék a kitöltési tényező?
= 25
= 25%
= 25 %
! D = t<sub>H</sub> / T · 100%.

? Egy jel 3 db, egyenként 12 ns késleltetésű kapun halad át egymás után. Hány ns a teljes késleltetés?
= 36
= 36 ns
! Sorba kötött kapuknál a késleltetések összeadódnak.

? Hogyan definiáljuk általában a felfutási időt?
- a 0%-os és a 100%-os szint közötti idő
+ a 10%-os és a 90%-os szint közötti idő
- az 50%-os pontok közötti idő
- a magas szinten töltött idő
! A szélső 10%-okat a zaj és a lekerekedés miatt nem számítjuk bele.

? Hány ns egy 200 MHz-es órajel periódusideje?
= 5
= 5 ns
! T = 1 / f.
```
