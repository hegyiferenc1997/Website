---
title: Előjeles számok és a kettes komplemens
summary: Előjeles abszolút érték, egyes és kettes komplemens; kivonás összeadással; ábrázolási tartomány és előjeles túlcsordulás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a negatív számok háromféle ábrázolását: **előjeles abszolút érték**, **egyes komplemens**, **kettes komplemens**,
- hogyan végez a gép **kivonást összeadással**,
- az *n* bites **ábrázolási tartományt**,
- hogyan ismered fel az **előjeles túlcsordulást**.

## 1. Előjeles abszolút érték

A legfelső bit az **előjel** (0 = pozitív, 1 = negatív), a többi az abszolút érték.
8 biten: +5 = 0000 0101, −5 = **1000 0101**.

Hátránya: **két nulla** van (+0 = 0000 0000, −0 = 1000 0000), és az összeadáshoz külön logika kell az előjelek összevetésére.

## 2. Egyes komplemens

A negatív számot a pozitív **minden bitjének negálásával** kapjuk (0 → 1, 1 → 0).
8 biten: +5 = 0000 0101, −5 = **1111 1010**.

Itt is két nulla van (0000 0000 és 1111 1111), ezért ma ritkán használják (pl. az internetes ellenőrzőösszegben még előfordul).

## 3. Kettes komplemens – amit minden mai gép használ

**Képzése:** egyes komplemens + 1 (vagyis: negáld a biteket, majd adj hozzá 1-et).

```text
 +5        = 0000 0101
 negálás   = 1111 1010   (egyes komplemens)
 + 1       = 1111 1011   = −5 kettes komplemensben
```

**Gyors trükk:** jobbról balra haladva másold le a biteket az **első 1-esig** (azt is beleértve), utána az összes többit negáld. 0001 0010 (18) → 1110 1110 (−18).

**Visszaalakítás:** ha a legfelső bit 1, a szám negatív; az abszolút értékét újra kettes komplemens képzéssel kapod meg. 1111 0110 → negálás 0000 1001 → +1 → 0000 1010 = 10, tehát az érték **−10**.

**Súlyozott értelmezés:** a legfelső bit súlya **negatív**: 8 biten −128.
1111 0110 = −128 + 64 + 32 + 16 + 4 + 2 = **−10**.

### Előnyei

- **egyetlen nulla** van (0000 0000),
- az összeadás és a kivonás **ugyanazzal az összeadóval** végezhető, az előjeltől függetlenül.

## Ábrázolási tartomány

| Ábrázolás                  | *n* biten                                  | 8 biten         |
| -------------------------- | ------------------------------------------ | --------------- |
| előjel nélküli             | 0 … 2<sup>n</sup> − 1                     | 0 … 255         |
| előjeles abszolút érték    | −(2<sup>n−1</sup> − 1) … 2<sup>n−1</sup> − 1 | −127 … 127   |
| egyes komplemens           | −(2<sup>n−1</sup> − 1) … 2<sup>n−1</sup> − 1 | −127 … 127   |
| **kettes komplemens**      | **−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1** | **−128 … 127** |

## Kivonás összeadással

A − B = A + (−B), ahol −B a B kettes komplemense. A legfelső bitből kilépő átvitelt **eldobjuk**.

**Példa:** 7 − 12, 8 biten

```text
  12      = 0000 1100
  −12     = 1111 0100      (kettes komplemens)
  7       = 0000 0111
  7 + (−12) = 1111 1011   → negatív; vissza: 0000 0101 = 5, tehát −5 ✓
```

**Példa:** 12 − 7

```text
  0000 1100 + 1111 1001 = 1 0000 0101 → a kilépő 1-et eldobjuk: 0000 0101 = 5 ✓
```

## Előjeles túlcsordulás

Kettes komplemensben **túlcsordulás** akkor van, ha **két azonos előjelű** számot adunk össze, és az eredmény előjele **ellentétes**. (Különböző előjelű számok összegénél sosem lehet túlcsordulás.)

```text
  100 + 50:   0110 0100 + 0011 0010 = 1001 0110 → negatívnak látszik (−106) → TÚLCSORDULÁS
```

Ezért van a processzorokban külön **C** (carry, előjel nélküli túlcsordulás) és **V** (overflow, előjeles túlcsordulás) jelzőbit.

```python run
# Kettes komplemens 8 biten
def kettes_komplemens(ertek, bitek=8):
    # A maszkolás pont a kettes komplemens bitmintát adja negatív számokra
    return format(ertek & (2**bitek - 1), f"0{bitek}b")

def ertelmez(bitminta):
    ertek = int(bitminta, 2)
    # Ha a legfelső bit 1, a szám negatív: le kell vonni 2^n-t
    return ertek - 2 ** len(bitminta) if bitminta[0] == "1" else ertek

print(kettes_komplemens(-5), kettes_komplemens(-18), kettes_komplemens(-128))
print(ertelmez("11110110"), ertelmez("01111111"), ertelmez("10000000"))
print(kettes_komplemens(7 - 12))
```

## Összefoglalás

- Kettes komplemens = biteket negálni + 1; a legfelső bit súlya −2<sup>n−1</sup>.
- *n* biten: −2<sup>n−1</sup> … 2<sup>n−1</sup> − 1 (8 biten −128 … 127).
- Kivonás: A − B = A + (−B), a kilépő átvitelt eldobjuk.
- Túlcsordulás: két azonos előjelű szám összege ellentétes előjelű.

## A lecke feladata

```quiz required
? Mi −18 kettes komplemense 8 biten?
= 11101110
! 18 = 00010010; negáld a biteket, majd adj hozzá 1-et.

? Mennyi a 10011100 bitminta értéke 8 bites kettes komplemensként (tízesben)?
= -100
! A legfelső bit súlya −128: −128 + 16 + 8 + 4.

? Mennyi 25 − 40 eredménye 8 bites kettes komplemensben?
= 11110001
! 25 + (−40); az eredmény −15.

? Mi a legkisebb (legnegatívabb) szám, amely 6 bites kettes komplemensben ábrázolható?
= -32
! −2<sup>n−1</sup>.

? Hogyan néz ki −1 kettes komplemensben 8 biten?
= 11111111
! 0000 0001 → negálva 1111 1110 → +1.

? Melyik 8 bites kettes komplemens összeadásnál van **előjeles túlcsordulás**?
- 00000011 + 11111110
+ 01010000 + 01000000
- 11110000 + 00010000
- 10000001 + 01111111
! Csak két azonos előjelű szám összegénél lehet túlcsordulás; az eredmény előjele ekkor megfordul.
```
