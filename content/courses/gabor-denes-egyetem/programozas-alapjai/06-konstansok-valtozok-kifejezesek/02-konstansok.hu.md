---
title: Konstansok
summary: Értékek, amelyek nem változnak – konstansok más nyelvekben és a Python elnevezési szokása.
minutes: 10
---

## Amit ebben a leckében megtanulsz

- mi a **konstans**, és miért érdemes használni,
- hogyan jelölünk konstanst Pythonban és más nyelvekben,
- mi a „**mágikus szám**”, és miért kerüljük.

## Mi a konstans?

A **konstans** olyan elnevezett érték, amely a program futása során **nem változik**: pl. a π értéke, a maximális pontszám, az ÁFA kulcs.

Miért jó?

- **Olvashatóság:** a `MAX_PONT` többet mond, mint a `100`.
- **Könnyű módosítás:** ha változik az érték, egyetlen helyen kell átírni.
- **Hibák elkerülése:** nem írod el az értéket a kód különböző pontjain.

## Konstansok más nyelvekben

A legtöbb statikus nyelvben a fordító **kikényszeríti**, hogy a konstans ne változzon:

```java
// Java
final double AFA = 0.27;
AFA = 0.5;   // fordítási hiba
```

```c
/* C */
const int MAX_PONT = 100;
#define PI 3.14159   /* előfeldolgozó makró */
```

## Konstansok Pythonban

Pythonban **nincs valódi konstans**: bármelyik változó felülírható. A konvenció szerint a **csupa nagybetűs** név jelzi, hogy az értéket nem szabad módosítani. A konstansokat általában a fájl elejére írjuk.

```python run
# Konstansok a fájl elején.
MAX_PONT = 100
PONTHATAR_KETTES = 50
AFA_KULCS = 0.27

pont = 72
szazalek = pont / MAX_PONT * 100
print(f"{szazalek:.0f}%")
print("Átment" if pont >= PONTHATAR_KETTES else "Nem ment át")

netto = 10_000
print("Bruttó:", netto * (1 + AFA_KULCS))
```

Ha mégis jelezni szeretnéd az eszközöknek, használhatod a `Final` jelölést – a mypy figyelmeztet, ha felülírnád:

```python run
from typing import Final

GRAVITACIO: Final = 9.81   # m/s²
print(GRAVITACIO * 2)
```

## Mágikus számok

A **mágikus szám** egy magyarázat nélkül a kódba írt érték. Ha valaki ránéz, nem tudja, mit jelent.

```python run
# Rossz: mit jelent a 86400 és a 0.27?
print(3 * 86400)
print(5000 * 1.27)

# Jó: beszédes nevű konstansok.
MASODPERC_PER_NAP = 24 * 60 * 60
AFA_KULCS = 0.27
print(3 * MASODPERC_PER_NAP)
print(5000 * (1 + AFA_KULCS))
```

## Literál és konstans

Ne keverd össze: a **literál** az érték közvetlen leírása (`100`, `"alma"`), a **konstans** egy **név**, amelyhez egy (általában literállal megadott) nem változó érték tartozik (`MAX_PONT = 100`).

## Beépített konstansok

```python run
import math
print(math.pi, math.e)        # matematikai konstansok
print(True, False, None)      # a nyelv beépített konstansai
```

## Összefoglalás

- A konstans nem változó, elnevezett érték; olvashatóbbá és könnyebben módosíthatóvá teszi a kódot.
- Javában `final`, C-ben `const`; Pythonban a **CSUPA_NAGYBETŰS** név a szokás (opcionálisan `Final`).
- Kerüld a **mágikus számokat**, használj beszédes konstansokat.

## A lecke feladata: Mágikus számok helyett konstansok

Az alábbi függvény működik, de tele van **mágikus számokkal**. Írd át:

1. Vezess be konstansokat a fájl elején: `AFA_KULCS = 0.27`, `SZALLITASI_DIJ = 1490`, `INGYENES_SZALLITAS_HATAR = 20000`.
2. A `vegosszeg(netto)` függvény ezeket használja: bruttó = nettó · (1 + ÁFA), egész forintra kerekítve; ha a bruttó a határ **alatt** van, hozzá jön a szállítási díj.

A működés ne változzon!

```python starter required
def vegosszeg(netto):
    brutto = round(netto * 1.27)
    if brutto < 20000:
        brutto += 1490
    return brutto


print(vegosszeg(10000), vegosszeg(20000))   # 14190 25400
```

<details>
<summary>Megoldás</summary>

```python solution
AFA_KULCS = 0.27
SZALLITASI_DIJ = 1490
INGYENES_SZALLITAS_HATAR = 20000


def vegosszeg(netto):
    brutto = round(netto * (1 + AFA_KULCS))
    if brutto < INGYENES_SZALLITAS_HATAR:
        brutto += SZALLITASI_DIJ
    return brutto


print(vegosszeg(10000), vegosszeg(20000))   # 14190 25400
```

</details>

```python test
assert AFA_KULCS == 0.27, "Legyen AFA_KULCS = 0.27 konstans."
assert SZALLITASI_DIJ == 1490, "Legyen SZALLITASI_DIJ = 1490 konstans."
assert INGYENES_SZALLITAS_HATAR == 20000, "Legyen INGYENES_SZALLITAS_HATAR = 20000 konstans."
assert vegosszeg(10000) == 14190, "10000 nettó → 12700 bruttó + 1490 szállítás = 14190"
assert vegosszeg(20000) == 25400, "20000 nettó → 25400 bruttó, ingyenes szállítás"
SZALLITASI_DIJ = 990
assert vegosszeg(1000) == 1270 + 990, "A függvény a konstanst használja, ne a beírt számot."
```
