---
title: Kódátalakítók – Gray-kód és 7 szegmenses dekóder
summary: Bináris ↔ Gray átalakító XOR kapukkal, BCD → 7 szegmenses dekóder tervezése Karnaugh-táblával, közös anódos és katódos kijelzők, meghajtó IC-k.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- mi a **kódátalakító** (kódkonverter),
- hogyan épül fel a **bináris → Gray** és a **Gray → bináris** átalakító,
- hogyan tervezel **BCD → 7 szegmenses** dekódert igazságtáblával és K-táblával,
- mi a különbség a **közös katódos** és a **közös anódos** kijelző között,
- milyen kész **meghajtó IC-k** léteznek.

## Mi a kódátalakító?

Olyan kombinációs hálózat, amely egy adott kódban érkező számot **másik kódra** fordít le (pl. bináris → Gray, BCD → 7 szegmens, bináris → BCD). Tervezése a megszokott menet: igazságtábla → függvények kimenetenként → egyszerűsítés.

## Bináris → Gray átalakító

A Gray-kódban (2. témakör) a szomszédos értékek csak egy bitben térnek el. Az átalakítás szabálya: a **legfelső bit változatlan**, a többi a bináris szám **két szomszédos bitjének XOR-ja**.

**G<sub>n−1</sub> = B<sub>n−1</sub>**, **G<sub>i</sub> = B<sub>i+1</sub> ⊕ B<sub>i</sub>**

Négy bitre: G3 = B3, G2 = B3 ⊕ B2, G1 = B2 ⊕ B1, G0 = B1 ⊕ B0 – **három XOR kapu**, párhuzamosan.

| B3 B2 B1 B0 | G3 G2 G1 G0 |
| ----------- | ----------- |
| 0 1 0 1     | 0 1 1 1     |
| 1 0 1 1     | 1 1 1 0     |

## Gray → bináris átalakító

Itt a legfelső bit szintén változatlan, de a többi a **már kiszámolt bináris bit** és a Gray-bit XOR-ja:

**B<sub>n−1</sub> = G<sub>n−1</sub>**, **B<sub>i</sub> = B<sub>i+1</sub> ⊕ G<sub>i</sub>**

Kifejtve: B2 = G3 ⊕ G2, B1 = G3 ⊕ G2 ⊕ G1, B0 = G3 ⊕ G2 ⊕ G1 ⊕ G0. A XOR kapuk itt **láncot** alkotnak – minden bit az előzőre vár.

## A 7 szegmenses kijelző

Hét LED-szegmens (a–g) alkot egy számjegyet:

```text
 ─a─
f   b
 ─g─
e   c
 ─d─
```

- **Közös katódos (CC):** a LED-ek katódjai közösek (GND); egy szegmens akkor világít, ha a vezérlése **1** (aktív magas).
- **Közös anódos (CA):** az anódok közösek (+V<sub>CC</sub>); a szegmens akkor világít, ha a vezérlése **0** (aktív alacsony).

Minden szegmens elé **áramkorlátozó ellenállás** kell.

## BCD → 7 szegmens dekóder tervezése

Bemenet: egy BCD számjegy (A B C D, A a legnagyobb helyiérték). Kimenet: hét szegmens (közös katódos, tehát 1 = világít).

| szám  | A B C D   | a   | b   | c   | d   | e   | f   | g   |
| ----- | --------- | --- | --- | --- | --- | --- | --- | --- |
| 0     | 0 0 0 0   | 1   | 1   | 1   | 1   | 1   | 1   | 0   |
| 1     | 0 0 0 1   | 0   | 1   | 1   | 0   | 0   | 0   | 0   |
| 2     | 0 0 1 0   | 1   | 1   | 0   | 1   | 1   | 0   | 1   |
| 3     | 0 0 1 1   | 1   | 1   | 1   | 1   | 0   | 0   | 1   |
| 4     | 0 1 0 0   | 0   | 1   | 1   | 0   | 0   | 1   | 1   |
| 5     | 0 1 0 1   | 1   | 0   | 1   | 1   | 0   | 1   | 1   |
| 6     | 0 1 1 0   | 1   | 0   | 1   | 1   | 1   | 1   | 1   |
| 7     | 0 1 1 1   | 1   | 1   | 1   | 0   | 0   | 0   | 0   |
| 8     | 1 0 0 0   | 1   | 1   | 1   | 1   | 1   | 1   | 1   |
| 9     | 1 0 0 1   | 1   | 1   | 1   | 1   | 0   | 1   | 1   |
| 10–15 | 1010…1111 | X   | X   | X   | X   | X   | X   | X   |

A **10–15** kódok BCD-ben nem fordulnak elő → **közömbös** bejegyzések, amelyek nagyban egyszerűsítik a K-táblákat.

**Példa – az „e” szegmens:** e = Σm(0, 2, 6, 8) + d(10…15)

| AB \ CD | 00  | 01  | 11  | 10  |
| ------- | --- | --- | --- | --- |
| 00      | 1   | 0   | 0   | 1   |
| 01      | 0   | 0   | 0   | 1   |
| 11      | X   | X   | X   | X   |
| 10      | 1   | 0   | X   | X   |

- A négy sarok (0, 2, 8, 10 – a 10 közömbös) → **B̅D̅**
- A CD = 10 oszlop (2, 6, 14, 10) → **CD̅**

**e = B̅D̅ + CD̅**

Mind a hét szegmens egyszerűsített alakja:

| szegmens | egyszerűsített függvény |
| -------- | ----------------------- |
| a        | A + C + BD + B̅D̅         |
| b        | B̅ + C̅D̅ + CD             |
| c        | B + C̅ + D               |
| d        | A + B̅D̅ + B̅C + BC̅D + CD̅  |
| e        | B̅D̅ + CD̅                 |
| f        | A + C̅D̅ + BC̅ + BD̅        |
| g        | A + BC̅ + B̅C + CD̅        |

Közös anódos kijelzőnél ugyanezeket **negálva** kell kiadni.

## Kész meghajtó IC-k

| IC                      | jellemző                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **CD4511** (CMOS)       | BCD → 7 szegmens, aktív magas kimenet → **közös katódos** kijelzőhöz, beépített tárolóval |
| **74LS47 / 7447** (TTL) | aktív alacsony, nyitott kollektoros kimenet → **közös anódos** kijelzőhöz                 |
| **74LS48 / 7448** (TTL) | a 7447 aktív magas változata → közös katódos kijelzőhöz                                   |
| **MAX7219 / MAX7221**   | soros (SPI-szerű) vezérlés, 8 számjegy multiplexelve, áramszabályozással                  |
| **CD4543**              | LCD-hez is használható (fázisbemenettel)                                                  |

Az **LCD** kijelzőt nem szabad egyenfeszültséggel meghajtani (tönkremegy), ezért váltakozó (négyszögjeles) meghajtás kell – pl. CD4056B, ICM7211, I²C-s PCF85176. A **Nixie-csövek** 10 külön katódosak és kb. 170 V kell nekik (pl. SN74141).

```python run
# Bináris → Gray és Gray → bináris négy biten
def bin_gray(b):
    return b ^ (b >> 1)            # minden bit XOR a felette lévővel

def gray_bin(g):
    b = 0
    while g:                       # a felső bitek XOR-ja lefelé halmozódik
        b ^= g
        g >>= 1
    return b

for n in (5, 11):
    g = bin_gray(n)
    print(f"{n:04b} → Gray {g:04b} → vissza {gray_bin(g):04b}")
```

## Összefoglalás

- Bináris → Gray: G<sub>i</sub> = B<sub>i+1</sub> ⊕ B<sub>i</sub> (párhuzamos XOR-ok); Gray → bináris: B<sub>i</sub> = B<sub>i+1</sub> ⊕ G<sub>i</sub> (XOR-lánc).
- A 7 szegmenses dekóder 4 bemenetű, 7 kimenetű kombinációs hálózat; a 10–15 kódok közömbösek.
- Közös katód: aktív magas (pl. CD4511, 7448); közös anód: aktív alacsony (pl. 7447).

## A lecke feladata

```quiz required
? Add meg a bináris → Gray átalakító G1 kimenetét a B2, B1, B0 bitekből!
expr: B2, B1, B0 -> B2 ⊕ B1
! A Gray-bit a bináris szám két szomszédos bitjének XOR-ja.

? Add meg a Gray → bináris átalakító B1 kimenetét a G2, G1, G0 bitekből (háromjegyű kód)!
expr: G2, G1, G0 -> G2 ⊕ G1
! B2 = G2, majd B1 = B2 ⊕ G1.

? Melyik szegmensek világítanak a 4-es számjegynél? (Írd a betűket ábécérendben, egybe!)
= bcfg
= b, c, f, g
! Két függőleges a jobb oldalon, a bal felső és a középső.

? Melyik számjegyet mutatja a kijelző, ha csak az a, b és c szegmens világít?
= 7
! A felső vízszintes és a két jobb oldali függőleges.

? Egyszerűsítsd az „e” szegmens függvényét: e = Σm(0, 2, 6, 8) + d(10, 11, 12, 13, 14, 15)!
expr: A, B, C, D -> B'D' + CD'
limit: 4
dc: 10, 11, 12, 13, 14, 15
same: A'B'C'D' + A'B'CD' + A'BCD' + AB'C'D'
! A négy sarok és a CD = 10 oszlop.

? Melyik IC való közös anódos kijelzőhöz?
- CD4511
- 7448
+ 7447
- MAX7219
! Közös anódnál a szegmens 0-ra világít: aktív alacsony kimenet kell.
```
