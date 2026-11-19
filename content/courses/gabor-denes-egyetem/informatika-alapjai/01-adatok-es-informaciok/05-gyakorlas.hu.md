---
title: Gyakorlás – adatok és információk
summary: Ellenőrző kérdések és összefoglaló feladatlap az adatokhoz, számrendszerekhez és az adatábrázoláshoz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Mondj egy példát arra, hogyan lesz egy webáruházban az adatból információ, majd tudás!</summary>

Adat: egyes vásárlások (termék, ár, idő). Információ: „decemberben háromszor annyi társasjáték fogy, mint júliusban”. Tudás: „november végére fel kell tölteni a társasjáték-készletet”.

</details>

<details>
<summary>2. Hogyan váltod át a 200-at kettes, majd tizenhatos számrendszerbe?</summary>

200 = 128 + 64 + 8 → `11001000₂`. Négyesével: `1100 1000` → `C8₁₆`.

</details>

<details>
<summary>3. Miért nem elég az ASCII egy magyar szöveghez?</summary>

Mert 128 karakteréből hiányoznak az ékezetes betűk (á, é, ő, ű…). Ezekhez Unicode kell, amit ma UTF-8-ban tárolunk.

</details>

<details>
<summary>4. Mennyi idő alatt tölt le egy 500 MB-os fájlt egy 100 Mbit/s-os kapcsolat (ideális esetben)?</summary>

100 Mbit/s = 12,5 MB/s, tehát 500 / 12,5 = 40 másodperc.

</details>

Próbáld ki magad:

```python run
# Egy szám mindhárom alakban
n = 200
print(n, bin(n), hex(n))
# A szöveg UTF-8 bájtjai
print(list("Győr".encode("utf-8")))
```

## Összefoglaló feladatlap

```quiz required
? Mennyi `11111111₂` tízes számrendszerben?
= 255
! 2⁸ − 1 = 255.

? Írd fel a 100-at tizenhatos számrendszerben!
= 64
= 0x64
! 6·16 + 4 = 100.

? Hány bitből áll egy bájt?
= 8
! 1 bájt = 8 bit.

? Hány másodperc alatt jön le egy 50 MB-os fájl 100 Mbit/s-mal, ideális esetben?
= 4
! 100 Mbit/s = 12,5 MB/s; 50 / 12,5 = 4.

? Melyik állítás igaz az UTF-8-ra?
- Minden karaktert pontosan 2 bájton tárol.
+ Az ASCII karaktereket 1 bájton tárolja, így kompatibilis az ASCII-vel.
- Csak az angol ábécét ismeri.
- Képek tömörítésére való.
! Az UTF-8 változó hosszú: 1–4 bájt.

? Melyik a DIKW-piramis helyes sorrendje alulról felfelé?
+ adat → információ → tudás → bölcsesség
- információ → adat → tudás → bölcsesség
- tudás → adat → információ → bölcsesség
- adat → tudás → információ → bölcsesség
! A nyers adatból értelmezéssel lesz információ.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Bináris átváltás kézzel.** Írd meg a `binarisba(n)` függvényt, amely egy nemnegatív egész számot maradékos osztással kettes számrendszerbeli szöveggé alakít (a `bin()` használata nélkül)! A 0 eredménye `"0"`.

```python starter
def binarisba(n):
    return str(n % 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def binarisba(n):
    if n == 0:
        return "0"
    jegyek = ""
    while n > 0:
        jegyek = str(n % 2) + jegyek      # a maradék a következő (balra kerülő) jegy
        n //= 2
    return jegyek
```

</details>

```python test
assert binarisba(0) == "0"
assert binarisba(5) == "101"
assert binarisba(100) == "1100100"
assert binarisba(255) == "11111111"
print("Minden ellenőrzés sikeres!")
```

**2.** **Kettes komplemens.** Írd meg a `komplemens8(x)` függvényt, amely egy −128 és 127 közötti egész szám 8 bites kettes komplemens alakját adja vissza 8 karakteres szövegként!

```python starter
def komplemens8(x):
    return format(abs(x), "08b")
```

<details>
<summary>Megoldás</summary>

```python solution
def komplemens8(x):
    return format(x & 0xFF, "08b")      # az alsó 8 bit: negatívnál ez épp a kettes komplemens
```

</details>

```python test
assert komplemens8(5) == "00000101"
assert komplemens8(-5) == "11111011"
assert komplemens8(-1) == "11111111"
assert komplemens8(-128) == "10000000"
print("Minden ellenőrzés sikeres!")
```

**3.** **Képméret.** Írd meg a `kep_mb(szel, mag, bitmelyseg)` függvényt, amely egy tömörítetlen kép méretét adja megabájtban (1 MB = 1024 · 1024 bájt), 2 tizedesre kerekítve!

```python starter
def kep_mb(szel, mag, bitmelyseg):
    return round(szel * mag * bitmelyseg / 1024 / 1024, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def kep_mb(szel, mag, bitmelyseg):
    bajt = szel * mag * bitmelyseg / 8       # bitből bájt
    return round(bajt / 1024 / 1024, 2)
```

</details>

```python test
assert kep_mb(1920, 1080, 24) == 5.93
assert kep_mb(1024, 1024, 8) == 1.0
assert kep_mb(800, 600, 1) == 0.06
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hány különböző értéket lehet tárolni 10 biten?
= 1024
! $2^{10} = 1024$.

? Mi a `0x1F` tizenhatos szám értéke tízes számrendszerben?
= 31
! $1 \cdot 16 + 15 = 31$.

? Miért nem egyenlő Pythonban a `0.1 + 0.2 == 0.3` kifejezés `True`-val?
- mert a Python hibás
+ mert a 0,1 kettesben végtelen tört, a gép csak közelítést tárol
- mert az összeadás nem kommutatív
- mert a 0,3 nem szám
! Lebegőpontos számokat tűréssel hasonlíts össze.

? Melyik tömörítés veszteségmentes?
- JPEG
- MP3
+ PNG
- a videók szokásos tömörítése
! A PNG-ből minden bit visszaállítható.
```
