---
title: Szöveg, kép és hang ábrázolása
summary: Bájt és mértékegységek, karakterkódolás (ASCII, Unicode, UTF-8), képpontok és mintavételezés.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **bájt**, és mi a különbség a **kB** és a **KiB** között,
- hogyan lesz a betűből szám (**ASCII**, **Unicode**, **UTF-8**),
- hogyan tárolja a gép a **képet** és a **hangot**.

## Bájt és mértékegységek

**1 bájt = 8 bit.** A nagyobb egységeknél két rendszer él egymás mellett:

| Decimális (SI) | Érték      | Bináris (IEC) | Érték      |
| -------------- | ---------- | ------------- | ---------- |
| 1 kB           | 1000 bájt  | 1 KiB         | 1024 bájt  |
| 1 MB           | 1000² bájt | 1 MiB         | 1024² bájt |
| 1 GB           | 1000³ bájt | 1 GiB         | 1024³ bájt |
| 1 TB           | 1000⁴ bájt | 1 TiB         | 1024⁴ bájt |

Ezért „tűnik kisebbnek” egy 1 TB-os lemez a Windowsban: 10¹² bájt ≈ 931 GiB, és a Windows GiB-ot ír ki, csak „GB”-nak hívja.

Hálózati sebességnél **bitben** mérünk: 100 Mbit/s = 12,5 MB/s.

## Szöveg: karakterkódolás

Minden karakternek van egy **kódszáma**. Az **ASCII** 7 biten 128 karaktert ír le (angol betűk, számjegyek, írásjelek): `A` = 65, `a` = 97, `0` = 48. Az ékezetes betűk, a kínai írásjelek vagy az emojik nem férnek bele.

A **Unicode** minden írásrendszer minden karakterének ad egy számot (kódpontot), pl. `ő` = U+0151, `😀` = U+1F600. Az **UTF-8** ezt a számot **1–4 bájton** tárolja: az ASCII karakterek 1 bájtosak (így visszafelé kompatibilis), az `ő` 2, egy emoji 4 bájt. Ma a web szinte teljesen UTF-8.

```python run
# Karakter ↔ kódszám és az UTF-8 bájtok száma
for c in ["A", "a", "ő", "€"]:
    print(c, ord(c), len(c.encode("utf-8")), "bájt")
print(chr(66))
```

## Kép

Egy **raszteres** (bittérképes) kép képpontokból (pixelekből) áll. Egy pixel színe általában három szám: **R**, **G**, **B** (vörös, zöld, kék), mindegyik 8 bit, ez 24 bit = 3 bájt pixelenként, és 2²⁴ ≈ 16,7 millió szín. Egy 1920×1080-as kép tömörítés nélkül: `1920 · 1080 · 3 = 6 220 800` bájt ≈ 6,2 MB. A **JPEG** és a **PNG** tömörítéssel ennek töredékére csökkenti.

A **vektoros** kép (SVG) alakzatokat ír le (vonal, kör, görbe), ezért torzítás nélkül nagyítható.

## Hang

A hang folytonos hullám. A gép **mintavételezi**: másodpercenként sokszor (CD-n 44 100-szor) megméri az értékét, és minden mintát adott számú biten (CD-n 16) tárol. Egy perc CD-minőségű sztereó hang: `44 100 · 16 · 2 · 60` bit ≈ 10,6 MB. Az MP3 és az AAC ezt tömöríti.

## Összefoglalás

- 1 bájt = 8 bit; kB = 1000 bájt, KiB = 1024 bájt.
- ASCII: 128 karakter; Unicode: minden karakter; UTF-8: a Unicode 1–4 bájtos tárolása.
- Kép: pixelek RGB-értékkel (24 bit/pixel); hang: mintavételezés és kvantálás.

## A lecke feladata

```quiz required
? Hány bájt 1 KiB?
= 1024
! KiB = kibibájt = 2¹⁰ bájt.

? Mennyi az `A` betű ASCII-kódja tízes számrendszerben?
= 65
! A = 65, B = 66, …, a = 97.

? Hány bájton tárolja az UTF-8 az angol ábécé betűit?
+ 1
- 2
- 3
- 4
! Az ASCII karakterek az UTF-8-ban 1 bájtosak.

? Hány bájt egy 100×100 pixeles, 24 bites színmélységű kép tömörítés nélkül?
= 30000
= 30 000
! 100 · 100 · 3 bájt = 30 000 bájt.

? Melyik képformátum **vektoros**?
- JPEG
- PNG
+ SVG
- BMP
! Az SVG alakzatokat ír le, ezért szabadon nagyítható.
```
