---
title: Számok részletesen
summary: Egész és valós számok műveletei, egész osztás és maradék, kerekítés, és miért nem 0.3 a 0.1 + 0.2.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a számokkal végezhető **műveleteket** és azok sorrendjét,
- az **egész osztás** és a **maradékos osztás** használatát,
- a **lebegőpontos számok** pontatlanságát és kezelését.

## Aritmetikai műveletek

| Operátor | Jelentés | Példa | Eredmény |
| --- | --- | --- | --- |
| `+` | összeadás | `7 + 2` | `9` |
| `-` | kivonás | `7 - 2` | `5` |
| `*` | szorzás | `7 * 2` | `14` |
| `/` | osztás (mindig float) | `7 / 2` | `3.5` |
| `//` | egész osztás (lefelé kerekít) | `7 // 2` | `3` |
| `%` | maradék (modulo) | `7 % 2` | `1` |
| `**` | hatványozás | `7 ** 2` | `49` |

```python run
print(7 / 2)     # 3.5   – a / mindig valós számot ad
print(8 / 2)     # 4.0   – még akkor is, ha az eredmény egész
print(7 // 2)    # 3
print(-7 // 2)   # -4    – lefelé kerekít, nem nulla felé!
print(7 % 2)     # 1
print(2 ** 10)   # 1024
```

## Mire jó a // és a %?

```python run
# Páros-e egy szám? A 2-vel vett maradék 0.
szam = 14
print(szam % 2 == 0)   # True

# Másodpercek átváltása perc + másodperc alakra.
osszes = 135
perc = osszes // 60
mp = osszes % 60
print(f"{perc} perc {mp} másodperc")   # 2 perc 15 másodperc

# Egy szám utolsó számjegye és a többi.
n = 2026
print(n % 10, n // 10)   # 6 202
```

## Műveleti sorrend (precedencia)

A matematikából ismert sorrend érvényes: először a hatványozás, aztán szorzás/osztás, végül összeadás/kivonás. Zárójellel felülírható.

```python run
print(2 + 3 * 4)      # 14
print((2 + 3) * 4)    # 20
print(-2 ** 2)        # -4  – a hatványozás erősebb, mint az előjel!
print((-2) ** 2)      # 4
```

## Lebegőpontos pontatlanság

A számítógép a valós számokat kettes számrendszerben, véges biten tárolja. A `0.1` kettes számrendszerben végtelen tört (mint az 1/3 tízesben), ezért csak közelítőleg tárolható.

```python run
print(0.1 + 0.2)           # 0.30000000000000004
print(0.1 + 0.2 == 0.3)    # False!

# Helyes összehasonlítás: közelítő egyenlőség.
import math
print(math.isclose(0.1 + 0.2, 0.3))   # True

# Kiíráskor kerekíthetünk.
print(round(0.1 + 0.2, 2))            # 0.3
print(f"{0.1 + 0.2:.2f}")             # 0.30
```

> **Szabály:** valós számokat soha ne hasonlíts `==`-vel! Pénzügyi számításoknál használj egészeket (fillér) vagy a `decimal` modult.

```python run
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))   # 0.3 pontosan
```

## Hasznos beépített függvények

```python run
import math

print(abs(-5))           # 5      abszolút érték
print(round(3.14159, 2)) # 3.14   kerekítés 2 tizedesre
print(round(2.5), round(3.5))   # 2 4 – „banki kerekítés”: a páros felé!
print(min(3, 8, 1), max(3, 8, 1))   # 1 8
print(math.sqrt(16))     # 4.0    négyzetgyök
print(math.floor(3.7), math.ceil(3.2))   # 3 4
print(math.pi)           # 3.141592653589793
```

## Összefoglalás

- A `/` mindig `float`, a `//` egész osztás (lefelé kerekít), a `%` a maradék.
- A műveleti sorrend: `**`, majd `* / // %`, majd `+ -`; zárójellel módosítható.
- A lebegőpontos számok pontatlanok: használj `math.isclose()`-t vagy kerekítést.
