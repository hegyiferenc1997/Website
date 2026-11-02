---
title: Helyiértékes számrendszerek
summary: Tízes, kettes, nyolcas és tizenhatos számrendszer; helyiérték, alap, átváltás tízesre.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **számrendszer alapja** és a **helyiérték**,
- a **decimális**, **bináris**, **oktális** és **hexadecimális** rendszert,
- hogyan váltasz **bármely alapról tízesre**.

## Egy kis történelem

Már az Indus-völgyi civilizáció (Kr. e. 2500–1700) súlyai is **kettes rendszer** szerint épültek fel: 1, 2, 4, 8, 16, 32 … egységesek voltak, a hosszmértékeik viszont tízes rendszert követtek. A modern kettes számrendszert **Gottfried Wilhelm Leibniz** írta le 1703-ban; őt Nagy Frigyes „önmagában egy akadémiának” nevezte. A bináris rendszer azért lett a számítógépek nyelve, mert az áramkörök két állapotot (nincs feszültség / van feszültség) könnyen és megbízhatóan meg tudnak különböztetni.

## Helyiértékes ábrázolás

A számrendszer olyan szabályrendszer, amellyel számokat írunk le egy adott **alap** (_b_, radix) szerint. Helyiértékes rendszerben minden számjegy értéke a **pozíciójától** függ: a helyiértékek az alap hatványai.

Egy _b_ alapú szám értéke:

N = a<sub>n</sub>·b<sup>n</sup> + … + a<sub>1</sub>·b<sup>1</sup> + a<sub>0</sub>·b<sup>0</sup> + a<sub>−1</sub>·b<sup>−1</sup> + …

**Példa (tízes):** 472 = 4·100 + 7·10 + 2·1.

## A négy fontos számrendszer

| Rendszer      | Alap | Számjegyek | Jelölés                    | Használat                      |
| ------------- | ---- | ---------- | -------------------------- | ------------------------------ |
| decimális     | 10   | 0–9        | 472, 472<sub>10</sub>      | mindennapok                    |
| bináris       | 2    | 0, 1       | 1011<sub>2</sub>, `0b1011` | a számítógép belső nyelve      |
| oktális       | 8    | 0–7        | 157<sub>8</sub>, `0o157`   | régi gépek, Unix jogosultságok |
| hexadecimális | 16   | 0–9, A–F   | 2F<sub>16</sub>, `0x2F`    | memóriacímek, színek, bájtok   |

A hexadecimális rendszerben A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.

> **Mindig figyelj, hányas számrendszerben vagy!** A „10” tízesben tíz, kettesben kettő, tizenhatosban tizenhat.

## A kettő hatványai – érdemes fejből tudni

| 2<sup>n</sup> | 2<sup>0</sup> | 2<sup>1</sup> | 2<sup>2</sup> | 2<sup>3</sup> | 2<sup>4</sup> | 2<sup>5</sup> | 2<sup>6</sup> | 2<sup>7</sup> | 2<sup>8</sup> | 2<sup>10</sup> | 2<sup>16</sup> |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | -------------- | -------------- |
| érték         | 1             | 2             | 4             | 8             | 16            | 32            | 64            | 128           | 256           | 1024           | 65 536         |

Egy **bit** (_binary digit_) egy bináris számjegy; 8 bit = 1 **bájt**; 4 bit = 1 **nibble** (= egy hexadecimális jegy). _n_ biten **2<sup>n</sup>** különböző érték ábrázolható (0 … 2<sup>n</sup> − 1).

## Átváltás tízesre: helyiértékek összege

**Kettesből:** 1011<sub>2</sub> = 1·8 + 0·4 + 1·2 + 1·1 = **11**

**Nyolcasból:** 157<sub>8</sub> = 1·64 + 5·8 + 7·1 = **111**

**Tizenhatosból:** 1A3<sub>16</sub> = 1·256 + 10·16 + 3·1 = **419**

**Törtrész:** 10,11<sub>2</sub> = 2 + 1·½ + 1·¼ = **2,75**

```python run
# Átváltás tízesre: a beépített int(szöveg, alap) és a saját, helyiértékes módszer
print(int("1011", 2), int("157", 8), int("1A3", 16))

def tizesre(szamjegyek, alap):
    ertek = 0
    for jegy in szamjegyek:
        # Horner-elrendezés: az eddigi értéket megszorozzuk az alappal, és hozzáadjuk a jegyet
        ertek = ertek * alap + int(jegy, 16)
    return ertek

print(tizesre("1011", 2), tizesre("157", 8), tizesre("1A3", 16))
```

## Összefoglalás

- Helyiértékes rendszerben a jegy értéke = jegy × alap<sup>pozíció</sup>.
- Bináris (2), oktális (8), hexadecimális (16) – a hexa jegyei 0–9 és A–F.
- _n_ bit 2<sup>n</sup> különböző értéket ábrázol.
- Tízesre váltás: a helyiértékek súlyozott összege.

## A lecke feladata

```quiz required
? Mennyi 10110<sub>2</sub> tízes számrendszerben?
= 22
! 16 + 4 + 2.

? Mennyi 2F<sub>16</sub> tízes számrendszerben?
= 47
! 2·16 + 15.

? Mennyi 157<sub>8</sub> tízes számrendszerben?
= 111
! 1·64 + 5·8 + 7.

? Mennyi 101,01<sub>2</sub> tízes számrendszerben?
= 5,25
= 5.25
! A kettedes vessző utáni helyiértékek: ½, ¼, …

? Hány különböző érték ábrázolható 10 biten?
= 1024
! 2<sup>10</sup>.

? Mi a legnagyobb előjel nélküli szám, amely 8 biten ábrázolható?
= 255
! 2<sup>8</sup> − 1.
```
