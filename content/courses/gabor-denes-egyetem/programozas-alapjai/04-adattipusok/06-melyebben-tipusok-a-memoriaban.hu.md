---
title: Mélyebben – típusok a memóriában
summary: Mi történik, ha egy szám „túlcsordul”, miért nem pontos a lebegőpontos összeadás, és mikor kell helyette Decimal vagy Fraction, hány bájt egy ékezetes szöveg vagy egy emoji, és a típusátalakítás meglepő csapdái – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mi a **túlcsordulás**, és miért nem találkozol vele Pythonban (de más nyelvekben igen),
- miért ad a `0.1 + 0.2` „furcsa” eredményt, és mit használj **pénzhez**,
- hogyan tárolja a gép a **szöveget** (Unicode, UTF-8), és miért nem mindig egyenlő a karakterek száma a bájtok számával,
- melyek a **típusátalakítás** leggyakoribb csapdái.

## 1. Egész számok és a túlcsordulás

Az alapleckében láttuk, hogy a Python `int` típusa tetszőlegesen nagy lehet. A legtöbb nyelvben (C, Java, C#) viszont az egész szám **fix méretű**, pl. 32 bites, és ha túllépi a határt, „körbefordul” – ez a **túlcsordulás**. Szimuláljuk:

```python run
# 32 bites előjeles egész túlcsordulásának szimulációja
def int32(x):
    x &= 0xFFFFFFFF                         # csak az alsó 32 bit marad meg
    return x - 2**32 if x >= 2**31 else x   # a legfelső bit az előjel

legnagyobb = 2**31 - 1
print("a legnagyobb 32 bites egész:", legnagyobb)
print("eggyel több C-ben/Javában:  ", int32(legnagyobb + 1))
print("eggyel több Pythonban:      ", legnagyobb + 1)
print("2 a 100-adikon Pythonban:   ", 2**100)
```

Egy C-ben vagy Javában írt számláló tehát egyszer csak **negatívba** fordulhat. Ez nem elméleti veszély: 2014-ben egy népszerű videó megtekintésszáma átlépte a 2 147 483 647-et, és a számlálót 64 bitesre kellett cserélni. A Python ezt automatikusan kezeli, cserébe a nagy számokkal lassabban számol.

## 2. Lebegőpontos számok: miért nem pontos?

A `float` kettes számrendszerben tárolja a törteket, és a 0,1 kettesben **végtelen** tört (mint tízesben az 1/3 = 0,333…). A gép csak egy közelítést tud tárolni, és a kis hibák összeadódnak:

```python run
# Lebegőpontos pontatlanság, és két pontos alternatíva: Decimal és Fraction
from decimal import Decimal
from fractions import Fraction
import math

print("0.1 + 0.2       =", 0.1 + 0.2)
print("egyenlő 0.3-mal? ", 0.1 + 0.2 == 0.3)
print("tűréssel:        ", math.isclose(0.1 + 0.2, 0.3))

osszeg = 0.0
for _ in range(10):
    osszeg += 0.1                          # tízszer hozzáadunk 0,1-et
print("10 × 0.1 floattal: ", osszeg)

d = Decimal("0")
for _ in range(10):
    d += Decimal("0.1")                    # tízes alapú, pontos
print("10 × 0.1 Decimallal:", d)
print("1/3 · 3 Fractionnel:", Fraction(1, 3) * 3)
```

A szabály: lebegőpontos számokat **ne hasonlíts** `==`-vel, hanem tűréssel (`math.isclose`). **Pénzhez** használj `Decimal`-t (vagy tárold egész fillérben/centben), mert ott egy fillér eltérés is hiba. A tudományos számításokhoz viszont a `float` a jó választás: gyors, és a kis relatív hiba ott nem számít.

## 3. Szövegek: karakterek és bájtok

Minden karakternek van egy **Unicode kódpontja** (egy szám), a fájlokba és a hálózatra viszont **bájtok** kerülnek. A legelterjedtebb kódolás az **UTF-8**: az angol betűk 1 bájtot, az ékezetes betűk 2-t, egy emoji 4-et foglal:

```python run
# Karakterek száma és bájtok száma UTF-8-ban
for szoveg in ["alma", "árvíztűrő", "🙂", "Árvíztűrő 🙂"]:
    bajtok = szoveg.encode("utf-8")
    print(f"{szoveg!r:16} {len(szoveg):>2} karakter, {len(bajtok):>2} bájt")

print("az 'ő' kódpontja:", ord("ő"), "→ vissza:", chr(337))
print("UTF-8 bájtjai:   ", "ő".encode("utf-8"))

# rossz kódolással olvasva "krix-krax" lesz belőle
print("rossz dekódolás: ", "árvíztűrő".encode("utf-8").decode("latin-1"))
```

Ha egy adatbázismező „legfeljebb 10 bájt”, akkor abba nem fér bele 10 ékezetes betű! A „krix-krax” (pl. `Ã¡` az `á` helyett) mindig azt jelenti, hogy valaki más kódolással olvasta vissza a szöveget, mint amivel írták. Ezért fájl megnyitásakor mindig add meg: `open(..., encoding="utf-8")`.

## 4. Típusátalakítás: a csapdák

Az átalakítás (`int()`, `float()`, `str()`, `bool()`) többnyire egyértelmű, de van néhány meglepetés, amelybe szinte mindenki belefut egyszer:

```python run
# A típusátalakítás meglepetései
print("int('42')        =", int("42"))
print("int(3.99)        =", int(3.99), " ← levágja, nem kerekít")
print("round(2.5)       =", round(2.5), " ← a páros felé kerekít (banki kerekítés)")
print("round(3.5)       =", round(3.5))
print("bool('False')    =", bool("False"), " ← minden nem üres szöveg igaz")
print("bool('')         =", bool(""))
print("'3' + '4'        =", "3" + "4", " ← szövegösszefűzés, nem összeadás")
print("int('3') + int('4') =", int("3") + int("4"))
try:
    int("3.5")
except ValueError as e:
    print("int('3.5') hibát dob:", e)
```

A `round` „páros felé” kerekítése azért van, hogy sok szám kerekítésénél a hibák kiegyenlítsék egymást (statisztikában és pénzügyekben is használják). Ha az iskolai „ötösnél felfelé” kell, a `Decimal` `ROUND_HALF_UP` módja segít. A `bool("False")` csapda pedig tipikusan akkor jön elő, amikor egy beállítás szövegként érkezik egy fájlból vagy egy űrlapról.

| Nézőpont        | Mire figyel a típusoknál?                                                     |
| --------------- | ----------------------------------------------------------------------------- |
| **programozó**  | a megfelelő típus kiválasztása: pénzhez Decimal, méréshez float, darabhoz int |
| **felhasználó** | helyes összegek és olvasható ékezetek – a „krix-krax” bizalmat rombol         |
| **adatbázis**   | mezőméretek bájtban, kódolás, pontosság (pl. `NUMERIC(10, 2)`)                |
| **biztonság**   | túlcsordulás és rossz átalakítás klasszikus támadási felület más nyelvekben   |

## Összefoglalás

- A fix méretű egészek túlcsordulhatnak; a Python `int` tetszőlegesen nagy.
- A `float` közelítés: tűréssel hasonlíts, pénzhez Decimalt vagy egész fillért használj.
- Az UTF-8-ban egy karakter 1–4 bájt; fájlnál mindig add meg a kódolást.
- Az `int()` levág, a `round()` a páros felé kerekít, a `bool()` minden nem üres szövegre igaz.

## A lecke feladata: összeg fillérre pontosan

Írd meg az `osszeg_fillerben(arak)` függvényt, amely `"12.34"` alakú árakat (szöveglista) ad össze **lebegőpontos számok nélkül**, és az összeget egész fillérben (századokban) adja vissza! Az árban lehet tizedespont nélkül is szám (`"5"`), és lehet csak egy tizedesjegy (`"5.5"` = 550 fillér). Tipp: bontsd a szöveget a pontnál két részre (`split(".")`), és a tört részt egészítsd ki két jegyre (`ljust(2, "0")`).

```python starter required
def osszeg_fillerben(arak):
    osszeg = 0
    for ar in arak:
        pass  # bontsd egész és tört részre, és add hozzá fillérben
    return osszeg


print(osszeg_fillerben(["19.99", "0.01"]))
```

<details>
<summary>Megoldás</summary>

```python solution
def osszeg_fillerben(arak):
    osszeg = 0
    for ar in arak:
        if "." in ar:
            egesz, tort = ar.split(".")
        else:
            egesz, tort = ar, "0"
        osszeg += int(egesz) * 100 + int(tort.ljust(2, "0"))
    return osszeg


print(osszeg_fillerben(["19.99", "0.01"]))
```

</details>

```python test
assert osszeg_fillerben(["19.99", "0.01"]) == 2000, "19.99 + 0.01 = 20.00 → 2000 fillér"
assert osszeg_fillerben(["5", "5.5"]) == 1050, "5 + 5.5 = 10.50 → 1050 fillér"
assert osszeg_fillerben(["0.10", "0.10", "0.10"]) == 30, "3 × 0.10 → 30 fillér"
assert osszeg_fillerben([]) == 0, "üres listára 0"
```
