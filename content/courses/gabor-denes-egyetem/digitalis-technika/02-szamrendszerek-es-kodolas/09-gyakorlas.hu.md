---
title: Gyakorlás – számrendszerek és kódok
summary: Ellenőrző kérdések és vegyes összefoglaló feladatlap átváltásokkal, kettes komplemenssel, BCD-, Gray- és Hamming-kóddal.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért használ a programozó hexadecimális számokat bináris helyett?</summary>

Mert egy hexa jegy pontosan 4 bitnek felel meg, így a hosszú bitsorozatok négyszer rövidebben, mégis egy az egyben visszaalakíthatóan írhatók le (pl. egy bájt = két hexa jegy).

</details>

<details>
<summary>2. Miért nem lehet a 0,1-et pontosan ábrázolni kettes számrendszerben?</summary>

Mert a 0,1 = 1/10, és a 10 nevezőben az 5-ös prímtényező nem kettőhatvány; ilyen törtek kettesben végtelen, szakaszos törtként írhatók csak fel.

</details>

<details>
<summary>3. Miért kettes komplemenst használnak a gépek az előjeles számokhoz?</summary>

Mert egyetlen nulla van, és az összeadás és a kivonás ugyanazzal az összeadó áramkörrel végezhető el az előjelektől függetlenül.

</details>

<details>
<summary>4. Mi a különbség a túlcsordulás (V) és az átvitel (C) jelzőbit között?</summary>

A C (carry) az előjel nélküli eredmény túlcsordulását jelzi (kilépő átvitel a legfelső bitből), a V (overflow) a kettes komplemensű, előjeles eredményét (két azonos előjelű szám összege ellentétes előjelű).

</details>

<details>
<summary>5. Miért van szükség a BCD összeadásnál +6 korrekcióra?</summary>

Mert 4 biten 16 kombináció van, de BCD-ben csak 10 érvényes; 9 fölött a 6 nem használt kombinációt át kell ugrani, hogy a helyes decimális átvitel keletkezzen.

</details>

<details>
<summary>6. Miért használnak forgó jeladókban Gray-kódot?</summary>

Mert a szomszédos állások csak egy bitben különböznek, így az átmenet közben nem jelenhet meg hamis, távoli érték (nincs többbites, nem egyszerre történő váltás).

</details>

<details>
<summary>7. Mit tud egy paritásbit, és mit nem?</summary>

Egy (páratlan számú) bithibát jelez, de két bithibát nem vesz észre, és nem tudja megmondani, melyik bit hibás, így javítani sem tud.

</details>

## Összefoglaló feladatlap

```quiz required
? Mennyi A5<sub>16</sub> tízesben?
= 165
! 10·16 + 5.

? Mennyi 1011,101<sub>2</sub> tízesben?
= 11,625
= 11.625
! 8 + 2 + 1 + ½ + ⅛.

? Mennyi 755<sub>8</sub> kettesben?
= 111101101
! Minden oktális jegy 3 bit: 7 = 111, 5 = 101.

? Mi a 75<sub>10</sub> BCD-kódja (8 biten, szóköz nélkül)?
= 01110101
! Jegyenként: 7 = 0111, 5 = 0101.

? Mi −45 kettes komplemense 8 biten?
= 11010011
! 45 = 00101101.

? Mennyi a 11010011 bitminta értéke 8 bites **előjel nélküli** számként?
= 211
! Itt nincs negatív súly: 128 + 64 + 16 + 2 + 1.

? Mi az 1001 bináris szám Gray-kódja?
= 1101
! G = B ⊕ (B >> 1).

? Melyik bináris számnak felel meg a 0111 Gray-kód?
= 0101
= 101
! b<sub>3</sub> = g<sub>3</sub>, majd b<sub>i</sub> = b<sub>i+1</sub> ⊕ g<sub>i</sub>.

? Egy Hamming(7,4) kódszó helyett 1011011 érkezett (p<sub>1</sub> p<sub>2</sub> d<sub>1</sub> p<sub>4</sub> d<sub>2</sub> d<sub>3</sub> d<sub>4</sub>). Mi a **javított adat** (d<sub>1</sub>d<sub>2</sub>d<sub>3</sub>d<sub>4</sub>)?
= 1010
! Számold ki a szindrómát (s<sub>4</sub>s<sub>2</sub>s<sub>1</sub>), billentsd vissza a jelzett bitet, majd olvasd ki a 3., 5., 6., 7. bitet.

? Melyik nem érvényes BCD-kód?
- 1001
- 0000
+ 1100
- 0111
! BCD-ben csak 0000 … 1001 érvényes.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Átváltás tetszőleges számrendszerbe.** Írd meg az `atvalt(n, alap)` függvényt, amely egy nemnegatív egész számot átvált a megadott (2…16) alapú számrendszerbe, és szövegként adja vissza (a 9 feletti számjegyek: A–F)! A beépített `bin`, `hex`, `format` most nem használható.

```python starter
def atvalt(n, alap):
    return str(n)
```

<details>
<summary>Megoldás</summary>

Ez az ismételt osztás módszere: a maradékok alulról felfelé olvasva adják az eredményt, ezért fűzzük mindig az elejére.

```python solution
def atvalt(n, alap):
    jegyek = "0123456789ABCDEF"
    if n == 0:
        return "0"
    s = ""
    while n > 0:
        s = jegyek[n % alap] + s     # a maradék a következő (balra kerülő) számjegy
        n //= alap
    return s
```

</details>

```python test
assert atvalt(13, 2) == "1101"
assert atvalt(255, 16) == "FF"
assert atvalt(100, 8) == "144"
assert atvalt(0, 2) == "0"
assert atvalt(2026, 16) == "7EA"
print("Minden ellenőrzés sikeres!")
```

**2.** **Kettes komplemens.** Írd meg a `kettes_komplemens(x, bitek)` függvényt, amely egy (akár negatív) egész számot a megadott bitszámú kettes komplemens alakban ad vissza szövegként! Ha a szám nem fér el, adj vissza `None`-t.

```python starter
def kettes_komplemens(x, bitek):
    return format(x, "b")
```

<details>
<summary>Megoldás</summary>

```python solution
def kettes_komplemens(x, bitek):
    if not -(2 ** (bitek - 1)) <= x < 2 ** (bitek - 1):
        return None                                  # nem fér el az előjeles tartományban
    return format(x % 2 ** bitek, f"0{bitek}b")      # negatívnál 2^n + x
```

</details>

```python test
assert kettes_komplemens(5, 8) == "00000101"
assert kettes_komplemens(-5, 8) == "11111011"
assert kettes_komplemens(-128, 8) == "10000000"
assert kettes_komplemens(128, 8) is None
assert kettes_komplemens(-1, 4) == "1111"
print("Minden ellenőrzés sikeres!")
```

**3.** **Gray-kód oda-vissza.** Írd meg a `gray(n)` és a `gray_vissza(g)` függvényt! A bináris → Gray átalakítás: g = n XOR (n >> 1). Visszafelé a legfelső bittől kezdve minden bit = az előző (már visszaalakított) bit XOR a Gray-bit.

```python starter
def gray(n):
    return n

def gray_vissza(g):
    return g
```

<details>
<summary>Megoldás</summary>

```python solution
def gray(n):
    return n ^ (n >> 1)

def gray_vissza(g):
    n = 0
    while g:
        n ^= g          # az összes felső bit XOR-ja halmozódik
        g >>= 1
    return n
```

</details>

```python test
assert [gray(i) for i in range(8)] == [0, 1, 3, 2, 6, 7, 5, 4]
assert all(gray_vissza(gray(i)) == i for i in range(256))
assert all(bin(gray(i) ^ gray(i + 1)).count("1") == 1 for i in range(255))   # szomszédok: 1 bit eltérés
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mennyi a 0x2F tízes számrendszerben?
= 47
! 2 · 16 + 15 = 47.

? Melyik a −1 kettes komplemens alakja 8 biten?
- 10000001
+ 11111111
- 01111111
! Minden bit 1: 256 − 1 = 255 = 11111111.

? Mi a 7 BCD kódja?
= 0111
! A BCD minden tízes jegyet 4 biten, binárisan ábrázol.

? Mekkora a legnagyobb 8 bites előjel nélküli szám?
= 255
! 2^8 − 1 = 255.

? Mi a Gray-kód legfontosabb tulajdonsága?
+ két szomszédos szám kódja pontosan egy bitben tér el
- rövidebb, mint a bináris kód
- hibajavításra képes
! Ezért használják pl. forgó jeladóknál: átmenetnél nem keletkezik hamis érték.
```
