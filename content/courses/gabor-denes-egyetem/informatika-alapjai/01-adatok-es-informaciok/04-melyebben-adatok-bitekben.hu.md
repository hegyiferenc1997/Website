---
title: Mélyebben – az adatok bitekben
summary: Negatív számok kettes komplemensben és a túlcsordulás, miért nem pontosan 0,3 a 0,1 + 0,2, hány bájt egy ékezetes betű UTF-8-ban, mekkora egy kép és egy hangfájl, és mennyi információ van egy üzenetben (entrópia, tömörítés) – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan tárolja a gép a **negatív számokat**, és mi a **túlcsordulás**,
- miért **pontatlan** a tizedes törtek tárolása, és mit kezdj vele,
- hány **bájt** egy szöveg, egy kép és egy hangfelvétel – és miért,
- mi az **információ mennyisége** (entrópia), és miért lehet egy fájlt tömöríteni.

## 1. Negatív számok: kettes komplemens és túlcsordulás

Az alapleckében pozitív számokat váltottunk kettesbe. De hogyan tárol a gép **−5**-öt, ha csak 0 és 1 van? A legelterjedtebb módszer a **kettes komplemens**: $n$ biten a legfelső bit „értéke” nem $+2^{n-1}$, hanem $-2^{n-1}$. 8 biten tehát a tartomány $-128$-tól $+127$-ig terjed.

Egy szám ellentettjét így kapod meg: **minden bitet megfordítasz, és hozzáadsz 1-et**. Nézzük meg:

```python run
# Kettes komplemens 8 biten: negatív számok és a túlcsordulás
def binaris8(x):
    return format(x & 0xFF, "08b")      # az alsó 8 bit, vezető nullákkal

def ertek8(bitek):
    x = int(bitek, 2)
    return x - 256 if x >= 128 else x   # a legfelső bit "értéke" -128

for x in [5, -5, 127, -128, -1]:
    print(f"{x:>5} → {binaris8(x)}")

# ellentett: bitek megfordítása + 1
b = binaris8(5)
fordit = "".join("1" if c == "0" else "0" for c in b)
print(f"\n5 = {b}, megfordítva {fordit}, +1 → {binaris8(int(fordit, 2) + 1)} = {ertek8(binaris8(int(fordit, 2) + 1))}")

# túlcsordulás: 127 + 1 nem fér el 8 biten
osszeg = binaris8(127 + 1)
print(f"127 + 1 = {osszeg} → a gép szerint {ertek8(osszeg)}")
```

A **127 + 1 = −128** nem elírás: az eredmény nem fér el 8 biten, ezért „körbefordul”. Ez a **túlcsordulás**, és valódi hibákat okozott már: 2038. január 19-én a 32 bites (előjeles) Unix-időszámlálók túlcsordulnak – ezért állnak át a rendszerek 64 bites időbélyegre. A Python egész számai automatikusan nőnek, ezért a fenti programban kézzel „vágtuk le” 8 bitre; C-ben, Javában vagy egy adatbázis `INTEGER` oszlopában viszont a korlát valódi.

## 2. Miért nem 0,3 a 0,1 + 0,2?

Próbáld ki bármelyik programozási nyelvben:

```python run
# Lebegőpontos számok: a tizedes törtek kettesben gyakran végtelenek
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)

# a helyes összehasonlítás: tűréssel
from math import isclose
print(isclose(0.1 + 0.2, 0.3))

# pénznél: egész fillérekkel vagy Decimal-lal számolj
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))

# a hiba összeadódik: tízszer 0,1
s = 0.0
for _ in range(10):
    s += 0.1
print(f"tízszer 0,1 = {s!r}")
```

Az ok egyszerű: ahogy tízes számrendszerben az $1/3 = 0{,}333\ldots$ végtelen, úgy **kettesben a 0,1 is végtelen** tört ($0{,}000110011\ldots_2$). A gép (az IEEE 754 szabvány szerint 64 biten) csak egy közelítést tárol. Ebből három gyakorlati szabály következik:

- Lebegőpontos számokat **ne hasonlíts `==`-vel**, hanem tűréssel (`isclose`).
- **Pénzt** soha ne tárolj `float`-ban: használj egész fillért (`int`) vagy `Decimal`-t, az adatbázisban `NUMERIC` típust.
- Sok kis szám összeadásánál a hiba **halmozódik** – tudományos számításoknál erre külön algoritmusok vannak.

## 3. Hány bájt? Szöveg, kép, hang

Az alapleckében láttuk, hogy az UTF-8 a karaktereket **változó hosszon** tárolja. Nézzük meg konkrétan:

```python run
# UTF-8: egy karakter 1-4 bájt
for szoveg in ["A", "é", "ő", "€", "😀", "Árvíztűrő tükörfúrógép"]:
    b = szoveg.encode("utf-8")
    print(f"{szoveg!r:<26} {len(szoveg):>2} karakter, {len(b):>2} bájt  {b.hex(' ') if len(b) <= 4 else ''}")
```

Az angol betűk 1 bájtosak (ezért kompatibilis az UTF-8 a régi ASCII-vel), a magyar ékezetesek 2, az euró jel 3, egy emoji 4 bájt. Ezért lehet egy „20 karakteres” mező hosszabb 20 bájtnál – és ezért fontos, hogy egy adatbázis vagy egy weboldal **ugyanazt a kódolást** használja mindenhol, különben jönnek a „ĂˇrvĂ­ztĹ±rĹ‘” típusú hibák.

A kép és a hang mérete egyszerű szorzás – **tömörítés nélkül**:

```python run
# Tömörítetlen kép- és hangméret
def kep_mb(szel, mag, bit_per_pixel=24):
    return szel * mag * bit_per_pixel / 8 / 1024**2

def hang_mb(mp, mintaveteli_frekv=44100, bitmelyseg=16, csatorna=2):
    return mp * mintaveteli_frekv * bitmelyseg * csatorna / 8 / 1024**2

print(f"Full HD kép (1920×1080, 24 bit): {kep_mb(1920, 1080):.1f} MB")
print(f"4K kép (3840×2160, 24 bit):      {kep_mb(3840, 2160):.1f} MB")
print(f"3 perces CD-minőségű dal:        {hang_mb(180):.1f} MB")
print(f"ugyanaz MP3-ban (128 kbit/s):    {180 * 128_000 / 8 / 1024**2:.1f} MB")
```

Egy tömörítetlen Full HD kép kb. 6 MB, egy 3 perces dal CD-minőségben kb. 30 MB – MP3-ban viszont csak kb. 3 MB. A különbség a **tömörítés**: a JPEG és az MP3 **veszteséges** (eldobja, amit a szem vagy a fül alig érzékel), a PNG és a ZIP **veszteségmentes** (minden bit visszaállítható).

## 4. Mennyi információ van egy üzenetben? Az entrópia

Claude Shannon 1948-ban megmutatta, hogyan lehet az információt **mérni**. Ha egy üzenet minden jele ugyanakkora eséllyel fordul elő, egy jel $\log_2(\text{jelek száma})$ bit információt hordoz. Ha nem egyenletes az eloszlás, az átlagos információ (az **entrópia**):

$$H = -\sum_i p_i \log_2 p_i$$

Egy érme feldobásánál két kimenet van; ha az érme cinkelt ($p$ eséllyel fej), kevesebb a „meglepetés”:

```plot
title: Egy pénzfeldobás információtartalma (bit) a fej valószínűségének függvényében
x: 0.001, 0.999
y: 0, 1.1
f: -(x*log2(x) + (1 - x)*log2(1 - x)) # entrópia
dash: 1 # szabályos érme: 1 bit
```

Szabályos érménél ($p = 0{,}5$) pontosan **1 bit**; ha az érme szinte mindig fejet ad, a dobás alig mond újat. Ugyanez igaz a szövegre: ha egy fájlban kevés féle jel van, vagy sok az ismétlődés, az entrópia kicsi – és a fájl **jól tömöríthető**:

```python run
# Entrópia és tömörítés: az ismétlődő szöveg kevés információt hordoz
from collections import Counter
from math import log2
import zlib

def entropia(szoveg):
    db = Counter(szoveg)
    n = len(szoveg)
    return -sum(c / n * log2(c / n) for c in db.values())

def rle(szoveg):                          # futáshossz-kódolás: "aaab" → "3a1b"
    ki, i = "", 0
    while i < len(szoveg):
        j = i
        while j < len(szoveg) and szoveg[j] == szoveg[i]:
            j += 1
        ki += f"{j - i}{szoveg[i]}"
        i = j
    return ki

szovegek = {"ismétlődő": "a" * 60 + "b" * 40, "váltakozó": "ab" * 50, "vegyes": "Az informatika az információ automatikus feldolgozása." * 2}
for nev, s in szovegek.items():
    tomoritett = len(zlib.compress(s.encode()))
    print(f"{nev:<10} entrópia {entropia(s):.2f} bit/jel, {len(s)} jel → zlib {tomoritett} bájt, RLE {len(rle(s))} jel")
```

Figyeld meg a **két nézőpontot**: a „váltakozó” szöveg entrópiája jelenként 1 bit (két jel, egyforma gyakorisággal), mégis a zlib nagyon jól tömöríti, mert felismeri az **ismétlődő mintát** – az egyszerű RLE viszont rosszabb lesz tőle, mint az eredeti! Az entrópia képlete csak a jelek gyakoriságát nézi, a valódi tömörítők a mintázatokat is. Az már nem tömöríthető tovább, ami valóban véletlen: egy jó titkosítás vagy egy már tömörített (JPEG, MP3, ZIP) fájl újratömörítése szinte semmit sem nyer.

| Nézőpont              | Mit jelent neki a „bit”?                                                       | Mire figyel?                                        |
| --------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| **hardver**           | feszültségszint egy tranzisztorban, töltés egy cellában                        | sebesség, energia, hibajavítás                      |
| **programozó**        | típusok: `int` (túlcsordulhat?), `float` (pontatlan!), `str` (milyen kódolás?) | a típus megválasztása, összehasonlítás, kódolás     |
| **felhasználó**       | fájlméret, tárhely, letöltési idő                                              | felbontás és minőség kontra méret                   |
| **információelmélet** | a meglepetés mértéke                                                           | mennyire tömöríthető, mennyi az átvihető információ |

## Összefoglalás

- A negatív egész számokat kettes komplemensben tároljuk; $n$ biten a tartomány $-2^{n-1}$ és $2^{n-1}-1$ közé esik, ami ezen kívül esik, az túlcsordul.
- A 0,1 kettesben végtelen tört, ezért a lebegőpontos számokat tűréssel hasonlítsd össze, a pénzt pedig egész fillérben vagy `Decimal`-ban tárold.
- UTF-8-ban egy karakter 1–4 bájt; a tömörítetlen kép mérete szélesség × magasság × bitmélység, a hangé idő × mintavételi frekvencia × bitmélység × csatornák.
- Az entrópia az átlagos információtartalom bitben; az ismétlődő, kiszámítható adat jól tömöríthető, a véletlenszerű nem.

## A lecke feladata

```quiz required
? Mekkora a legnagyobb szám, amely 8 biten kettes komplemensben ábrázolható?
= 127
! $2^7 - 1 = 127$; a legkisebb $-128$.

? Mi a −1 kettes komplemens alakja 8 biten?
= 11111111
! Az 1 = 00000001, megfordítva 11111110, +1 → 11111111.

? Hány bájt a „tűz” szó UTF-8-ban? (t: 1, ű: 2, z: 1 bájt)
= 4
! $1 + 2 + 1 = 4$ bájt, bár csak 3 karakter.

? Hogyan érdemes egy webshopban a termékek árát tárolni?
- `float` típusban, mert az gyors
+ egész fillérben (`int`) vagy `Decimal` / `NUMERIC` típusban, mert a lebegőpontos szám pontatlan
- szövegként, mindig
- a pontosság nem számít
! A 0,1 + 0,2 sem pontosan 0,3 lebegőpontosan.

? Miért nem lesz kisebb egy ZIP fájl, ha még egyszer becsomagolod?
- mert a ZIP nem tömörít
+ mert a tömörített adat már szinte véletlenszerű, kevés benne az ismétlődés
- mert a fájlrendszer nem engedi
- mert a ZIP fájlok mindig 1 MB-osak
! A tömörítés az ismétlődést (kis entrópiát) használja ki.
```
