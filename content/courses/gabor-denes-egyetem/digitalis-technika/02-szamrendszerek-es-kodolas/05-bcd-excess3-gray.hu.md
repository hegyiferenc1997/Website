---
title: BCD, Excess-3 és Gray-kód
summary: Súlyozott és nem súlyozott numerikus kódok; BCD összeadás korrekcióval, önkomplementer Excess-3, és a Gray-kód átalakítása.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **bináris szám** és a **bináris kód** között,
- a **súlyozott** (BCD 8421) és **nem súlyozott** (Excess-3, Gray) kódokat,
- a **BCD összeadás** +6-os korrekcióját,
- a **bináris ↔ Gray** átalakítást kézzel és programmal.

## Szám és kód

- **Bináris szám:** egy szám értékét írjuk le kettes számrendszerben (pl. 59 = 111011).
- **Bináris kód:** bitekkel _valamilyen információt_ jelölünk egy megállapodás szerint (pl. a 59 BCD-ben 0101 1001, egy betű ASCII-ban, egy szín RGB-ben).

A **kódolás** az a folyamat, amikor egy jelhalmaz elemeit egy szabály szerint egy másik jelhalmaz elemeivé alakítjuk; a visszaalakítás a **dekódolás**.

## Súlyozott kódok: BCD (8421)

A **BCD** (_Binary Coded Decimal_) a decimális számot **számjegyenként**, 4 biten kódolja. A bitek súlya 8-4-2-1.

| decimális | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    |
| --------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| BCD       | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 |

**Példa:** 59<sub>10</sub> = **0101 1001**<sub>BCD</sub> (míg binárisan 111011).
Az 1010 … 1111 kombinációk **érvénytelenek** BCD-ben.

**Mire jó?** Kijelzőkhöz (minden számjegy közvetlenül meghajt egy 7 szegmenses kijelzőt), pénzügyi számításokhoz (nincs kerekítési hiba a tizedes törteknél), órákhoz, számlálókhoz.

### BCD összeadás és a +6 korrekció

Ha két BCD jegy összege **9-nél nagyobb** (érvénytelen kód vagy átvitel keletkezik), hozzá kell adni **6-ot** (0110), mert 16 − 10 = 6 kombinációt „ugrunk át”.

```text
    8 = 1000
  + 5 = 0101
  ──────────
       1101   → nagyobb 9-nél: +0110
  +    0110
  ──────────
     1 0011   → 0001 0011 = 13 BCD-ben ✓
```

## Nem súlyozott kódok

### Excess-3 (3-többletes kód)

Minden decimális jegyhez a bináris érték **+3**-at rendeljük: 0 → 0011, 5 → 1000, 9 → 1100.
Különlegessége, hogy **önkomplementer**: a bitek negálásával a jegy **9-es komplemensét** kapjuk (pl. 2 = 0101 → negálva 1010 = 7, és 2 + 7 = 9). Ez régi számológépekben megkönnyítette a kivonást.

### Gray-kód (tükrözött kód)

**Frank Gray** után kapta a nevét, aki 1947-ben alkalmazta, és szabadalmaztatta. Lényege: **két szomszédos érték csak egy bitben különbözik** – az utolsóról az elsőre visszalépve is (**ciklikus**).

| dec | bin  | Gray | dec | bin  | Gray |
| --- | ---- | ---- | --- | ---- | ---- |
| 0   | 0000 | 0000 | 8   | 1000 | 1100 |
| 1   | 0001 | 0001 | 9   | 1001 | 1101 |
| 2   | 0010 | 0011 | 10  | 1010 | 1111 |
| 3   | 0011 | 0010 | 11  | 1011 | 1110 |
| 4   | 0100 | 0110 | 12  | 1100 | 1010 |
| 5   | 0101 | 0111 | 13  | 1101 | 1011 |
| 6   | 0110 | 0101 | 14  | 1110 | 1001 |
| 7   | 0111 | 0100 | 15  | 1111 | 1000 |

A neve onnan ered, hogy a táblázat **tükrözéssel** építhető fel: az _n_ bites kód az (*n*−1) bites kód, alatta ugyanaz fordított sorrendben, az első felük elé 0-t, a második elé 1-et írva.

**Miért fontos?** Ha egyszerre több bit változik (pl. 0111 → 1000: mind a négy!), a bitek a valóságban nem pontosan egyszerre váltanak, és rövid ideig **hamis érték** (hazárd) jelenhet meg. Gray-kódban egyszerre csak egy bit vált, így ez nem fordulhat elő. Ezért használják **forgó jeladókban** (enkóder), **A/D átalakítókban**, aszinkron FIFO-k mutatóiban – és a **Karnaugh-tábla** sorai, oszlopai is Gray-sorrendben vannak (4. témakör).

## Bináris → Gray és Gray → bináris

**Bináris → Gray:** a legfelső bit marad, minden további Gray-bit a bináris bit és a **tőle balra álló bináris bit XOR**-ja: g<sub>i</sub> = b<sub>i+1</sub> ⊕ b<sub>i</sub>. Röviden: **G = B ⊕ (B >> 1)**.

```text
 bináris:  1   0   1   1
           │ ⊕ │ ⊕ │ ⊕ │
 Gray:     1   1   1   0        1011 → 1110
```

**Gray → bináris:** a legfelső bit marad, minden további bináris bit a **már kiszámolt bináris bit** (balra) és az aktuális Gray-bit XOR-ja: b<sub>i</sub> = b<sub>i+1</sub> ⊕ g<sub>i</sub>.

```text
 Gray:     1   1   0   1
           ↓  ⊕↓  ⊕↓  ⊕↓
 bináris:  1 → 0 → 0 → 1        1101 → 1001
```

Áramkörben mindkét átalakító **XOR kapukból** áll (4 biten 3 darab). Az első párhuzamos (minden kapu egyszerre számol), a második láncszerű (a kapuk egymás eredményére várnak).

## Összefoglalás

- BCD: decimális jegyenként 4 bit (8421); összeadásnál 9 fölött +6 korrekció.
- Excess-3: jegy + 3, önkomplementer.
- Gray: szomszédos értékek egy bitben különböznek; G = B ⊕ (B >> 1).
- Gray → bináris: balról jobbra halmozott XOR.

## A lecke feladata: Gray-kód átalakítók

Írd meg a két átalakító függvényt egész számokra! A `binarisbol_gray(n)` az _n_ bináris szám Gray-kódját adja vissza (egész számként), a `graybol_binaris(g)` pedig fordítva. Használhatod a `^` (XOR) és a `>>` (jobbra tolás) műveletet.

```python starter required
def binarisbol_gray(n):
    return n


def graybol_binaris(g):
    return g


print(format(binarisbol_gray(0b1011), "04b"))   # 1110
print(format(graybol_binaris(0b1101), "04b"))   # 1001
```

<details>
<summary>Megoldás</summary>

```python solution
def binarisbol_gray(n):
    # Minden bit XOR a tőle balra álló bittel
    return n ^ (n >> 1)


def graybol_binaris(g):
    # Balról jobbra halmozott XOR: minden eltolt példányt hozzá-XOR-olunk
    n = 0
    while g:
        n ^= g
        g >>= 1
    return n


print(format(binarisbol_gray(0b1011), "04b"))   # 1110
print(format(graybol_binaris(0b1101), "04b"))   # 1001
```

</details>

```python test
assert binarisbol_gray(0b1011) == 0b1110, "binarisbol_gray(1011) eredménye 1110 kell legyen"
assert binarisbol_gray(0) == 0, "a 0 Gray-kódja 0"
assert graybol_binaris(0b1101) == 0b1001, "graybol_binaris(1101) eredménye 1001 kell legyen"
for i in range(256):
    g = binarisbol_gray(i)
    assert graybol_binaris(g) == i, f"az oda-vissza alakítás nem adja vissza a(z) {i} értéket"
    if i:
        kulonbseg = g ^ binarisbol_gray(i - 1)
        assert bin(kulonbseg).count("1") == 1, f"a(z) {i - 1} és {i} Gray-kódja nem egy bitben tér el"
```
