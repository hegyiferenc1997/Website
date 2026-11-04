---
title: Számrendszerek és átváltás
summary: Kettes, tízes és tizenhatos számrendszer, átváltás közöttük kézzel és Pythonnal.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan működik egy **helyiértékes** számrendszer,
- hogyan váltasz **kettesből tízesbe** és vissza,
- miért kényelmes a **tizenhatos** (hexadecimális) számrendszer.

## Helyiérték

A tízes számrendszerben minden helyiérték a 10 egy hatványa: `347 = 3·100 + 4·10 + 7·1`. Ugyanez működik bármilyen **alappal**. A kettes számrendszer alapja 2, a számjegyek csak `0` és `1`:

```text
 helyiérték:  128  64  32  16   8   4   2   1
 bitek:         0   1   1   0   1   0   0   1
 érték:         0 +64 +32 + 0 + 8 + 0 + 0 + 1  = 105
```

Tehát `01101001₂ = 105₁₀`.

## Tízesből kettesbe: maradékos osztás

Oszd el a számot 2-vel újra és újra, és írd fel a **maradékokat**. A bináris alak a maradékok **alulról felfelé** olvasva.

```text
 105 : 2 = 52  maradék 1   ↑
  52 : 2 = 26  maradék 0   │
  26 : 2 = 13  maradék 0   │
  13 : 2 =  6  maradék 1   │  olvasd felfelé:
   6 : 2 =  3  maradék 0   │  1101001
   3 : 2 =  1  maradék 1   │
   1 : 2 =  0  maradék 1   │
```

## Tizenhatos számrendszer

A hexadecimális alap 16, a számjegyek `0–9` és `A–F` (A = 10, …, F = 15). Egy hex számjegy pontosan **4 bitnek** felel meg, ezért a hosszú bitsorokat négyesével csoportosítva könnyű átírni:

```text
 1101 0110₂  →  D 6  →  D6₁₆ = 13·16 + 6 = 214
```

Hexát látsz a színkódokban (`#FF8800`), a memóriacímekben (`0x7ffe…`) és a MAC-címekben.

## Pythonnal

```python run
# Átváltások a beépített függvényekkel
print(bin(105))          # 0b1101001
print(int("1101001", 2)) # 105
print(hex(214))          # 0xd6
print(int("D6", 16))     # 214
print(f"{105:08b}")      # 01101001 (8 jegyre kiegészítve)
```

## Összefoglalás

- Helyiértékes rendszerben a jegyek az alap hatványaival szorzódnak.
- Tízesből kettesbe: maradékos osztás 2-vel, a maradékok alulról felfelé.
- Egy hex jegy = 4 bit; a hexát a rövidebb írásmód miatt szeretjük.

## A lecke feladata

```quiz required
? Mennyi `1011₂` tízes számrendszerben?
= 11
! 8 + 2 + 1 = 11.

? Írd fel a 26-ot kettes számrendszerben (vezető nullák nélkül)!
= 11010
! 16 + 8 + 2 = 26.

? Mennyi `2F₁₆` tízes számrendszerben?
= 47
! 2·16 + 15 = 47.

? Hány bitnek felel meg egy hexadecimális számjegy?
- 2
+ 4
- 8
- 16
! 16 = 2⁴, ezért egy hex jegy 4 bit.
```
