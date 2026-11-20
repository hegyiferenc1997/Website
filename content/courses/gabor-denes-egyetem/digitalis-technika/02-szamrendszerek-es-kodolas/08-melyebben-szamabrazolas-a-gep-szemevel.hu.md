---
title: Mélyebben – számábrázolás és kódok a gép szemével
summary: 8 bites összeadás jelzőbitekkel (átvitel, túlcsordulás, előjel, nulla) szimulátorral, miért nem 0,3 a 0,1 + 0,2 (IEEE 754 lebegőpontos szám bitenként), a Hamming(7,4) kód kipróbálása minden egy- és kétbites hibára, a paritás és a CRC hibafelismerő képessége összevetve, valamint az UTF-8 bájtjai.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan jelzi a processzor egy összeadás után az **átvitelt**, a **túlcsordulást**, az **előjelet** és a **nullát**,
- miért ad a számítógép **0,30000000000000004**-et a 0,1 + 0,2-re, és hogyan épül fel egy **lebegőpontos** szám,
- **kísérlettel** ellenőrizni, hogy a Hamming(7,4) kód minden egybites hibát kijavít – és mi történik két hibánál,
- **összemérni** a paritás és a CRC hibafelismerő erejét,
- hogyan lesz egy ékezetes betűből vagy emojiból **több bájt** UTF-8-ban.

## 1. A processzor jelzőbitjei

A processzor ugyanazzal az összeadóval adja össze az előjel nélküli és a kettes komplemens számokat – a bitminta ugyanaz! Hogy a programozó tudja, mi történt, az összeadás után **jelzőbiteket** (_flags_) állít be:

| Jelző | Neve                      | Mikor 1?                                         |
| ----- | ------------------------- | ------------------------------------------------ |
| **C** | átvitel (_carry_)         | az előjel nélküli eredmény nem fér el 8 biten    |
| **V** | túlcsordulás (_overflow_) | az **előjeles** eredmény nem fér el (−128 … 127) |
| **N** | negatív (_negative_)      | az eredmény legfelső bitje 1                     |
| **Z** | nulla (_zero_)            | az eredmény 0                                    |

```python run
# 8 bites összeadás jelzőbitekkel – így látja a processzor
def osszead8(a, b):
    teljes = a + b
    eredmeny = teljes & 0xFF                          # csak 8 bit marad
    C = int(teljes > 0xFF)                            # előjel nélküli túllépés
    # előjeles túlcsordulás: két azonos előjelű számból ellentétes előjelű eredmény
    V = int(((a ^ eredmeny) & (b ^ eredmeny) & 0x80) != 0)
    N = eredmeny >> 7
    Z = int(eredmeny == 0)
    return eredmeny, C, V, N, Z

def elojeles(x):
    return x - 256 if x >= 128 else x                 # a bitminta kettes komplemens értelmezése

print(f"{'a':>9} + {'b':>9} = {'eredmény':>9} | C V N Z | előjel nélkül   | előjelesen")
for a, b in [(100, 50), (200, 100), (0b11111111, 1), (0b10000000, 0b10000000), (60, 60)]:
    e, C, V, N, Z = osszead8(a, b)
    print(f"{a:09_b} + {b:09_b} = {e:09_b} | {C} {V} {N} {Z} | "
          f"{a:>3} + {b:>3} = {e:>3}  | {elojeles(a):>4} + {elojeles(b):>4} = {elojeles(e):>4}")
```

(Az `_` csak a négybites csoportok jobb olvashatóságáért van a kiírásban.) Nézd meg soronként:

- **100 + 50**: előjel nélkül 150 – helyes (C = 0). Előjelesen viszont 100 + 50 = **−106**?! Két pozitív számból negatív lett → **V = 1**: az előjeles eredmény nem fér el.
- **200 + 100**: előjel nélkül 300 nem fér el 8 biten → **C = 1**, az eredmény 44. Előjelesen ez −56 + 100 = 44 – **helyes** (V = 0)!
- **255 + 1**: előjel nélkül túlcsordulás (C = 1, Z = 1), előjelesen −1 + 1 = 0 – helyes.

A processzor tehát nem „tudja”, előjeles számokkal dolgozunk-e: kiszámolja **mindkét** jelzőt, és a program dönti el, melyiket nézi. C nyelven az `unsigned` és a `signed` típus pontosan ezt a döntést jelenti.

## 2. Miért nem 0,3 a 0,1 + 0,2?

```python run
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

Ez nem a Python hibája, hanem a **bináris törtek** természete. Az átváltások leckében láttad: a törtrészt ismételt 2-vel szorzással váltjuk át. A 0,1 kettes számrendszerben **végtelen, periodikus** tört (0,000110011001100…₂) – mint az 1/3 tízes számrendszerben (0,333…). Véges biten csak **kerekítve** tárolható.

A számítógépek a valós számokat **IEEE 754 lebegőpontos** formában tárolják, a tudományos jelöléshez hasonlóan: **(−1)<sup>előjel</sup> · 1,mantissza · 2<sup>kitevő − eltolás</sup>**. Egy 32 bites (_single_) szám felépítése: 1 előjelbit, 8 kitevőbit (eltolás: 127), 23 mantisszabit.

```python run
# Egy 32 bites lebegőpontos szám bitjei – IEEE 754
import struct

def bitek(x):
    n = struct.unpack(">I", struct.pack(">f", x))[0]   # a 4 bájt egy egész számként
    s = f"{n:032b}"
    elojel, kitevo, mantissza = s[0], s[1:9], s[9:]
    e = int(kitevo, 2)
    print(f"{x:>8}: {elojel} {kitevo} {mantissza}  → kitevő {e} − 127 = {e - 127:>3}")

for x in [1.0, 2.0, -2.0, 0.5, 0.75, 0.1]:
    bitek(x)

tarolt = struct.unpack(">f", struct.pack(">f", 0.1))[0]
print(f"\nA 0,1 valójában ezt tárolja 32 biten: {tarolt:.12f}")
```

A 0,75 = 1,1₂ · 2⁻¹ pontosan ábrázolható (a mantissza `1000…`), a 0,1 mantisszája viszont `1001100110011…` – a vége le van vágva. Gyakorlati tanulságok:

- lebegőpontos számokat **ne** hasonlíts `==`-vel, hanem egy kis tűréssel: `abs(a − b) < 1e-9` (Pythonban `math.isclose`),
- **pénzt** soha ne tárolj lebegőpontosan: egész fillérben/centben vagy tízes alapú típusban (`decimal`, SQL `NUMERIC`).

## 3. A Hamming(7,4) kód kísérletben

Az alapleckében egy példán láttad, hogy a szindróma megmutatja a hibás bit helyét. Most ellenőrizzük **az összes** lehetséges egybites hibát – és nézzük meg, mi történik, ha **két** bit romlik el!

```python run
# Hamming(7,4): kódolás, szindróma, javítás – minden egy- és kétbites hibára
from itertools import combinations

def kodol(d):                                   # d = [d1, d2, d3, d4]
    d1, d2, d3, d4 = d
    p1, p2, p4 = d1 ^ d2 ^ d4, d1 ^ d3 ^ d4, d2 ^ d3 ^ d4
    return [p1, p2, d1, p4, d2, d3, d4]         # pozíciók 1..7

def javit(b):
    b = b[:]
    s1 = b[0] ^ b[2] ^ b[4] ^ b[6]
    s2 = b[1] ^ b[2] ^ b[5] ^ b[6]
    s4 = b[3] ^ b[4] ^ b[5] ^ b[6]
    hely = s4 * 4 + s2 * 2 + s1                 # a szindróma = a hibás bit sorszáma
    if hely:
        b[hely - 1] ^= 1
    return [b[2], b[4], b[5], b[6]]             # az adatbitek

adat = [1, 0, 1, 1]
kod = kodol(adat)
print("adat:", adat, "→ kódszó:", "".join(map(str, kod)))

jo1 = sum(javit([bit ^ (i == j) for j, bit in enumerate(kod)]) == adat for i in range(7))
print(f"egybites hibák: {jo1} / 7 javítva helyesen")

jo2 = 0
for i, k in combinations(range(7), 2):
    rossz = [bit ^ (j in (i, k)) for j, bit in enumerate(kod)]
    jo2 += javit(rossz) == adat
print(f"kétbites hibák: {jo2} / 21 javítva helyesen")
```

Mind a **7** egybites hibát kijavítja, de a **21** kétbites hibából **egyet sem**: a szindróma ilyenkor egy harmadik, ártatlan bitre mutat, és a „javítás” még egy hibát visz be! Ezért használnak az ECC memóriák **SECDED** kódot (_single error correction, double error detection_): egy plusz paritásbittel a teljes kódszóra a két hibát legalább **észreveszik**, és nem javítják el rosszul.

**Hasonlat:** a Hamming-kód olyan, mint egy háromtanús kihallgatás: ha csak egy tanú hazudik, a válaszaik mintázatából kiderül, ki volt az. Ha ketten összejátszanak, a mintázat egy harmadik, ártatlan emberre terel.

## 4. Paritás kontra CRC – ki vesz észre többet?

```python run
# Hibafelismerés: egy paritásbit kontra CRC-4 (x^4 + x + 1), minden 2 bites hibára
from itertools import combinations

def crc(bitek, gen=[1, 0, 0, 1, 1]):
    t = bitek + [0] * (len(gen) - 1)
    for i in range(len(bitek)):
        if t[i]:
            for j, g in enumerate(gen):
                t[i + j] ^= g                    # modulo-2 kivonás = XOR
    return t[-(len(gen) - 1):]

adat = [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0]
uzenet_p = adat + [sum(adat) % 2]               # páros paritás
uzenet_c = adat + crc(adat)

def eszrevett(uzenet, ellenor):
    db = osszes = 0
    for i, k in combinations(range(len(uzenet)), 2):
        rossz = [b ^ (j in (i, k)) for j, b in enumerate(uzenet)]
        db += not ellenor(rossz)
        osszes += 1
    return db, osszes

paritas_jo = lambda u: sum(u) % 2 == 0
crc_jo = lambda u: crc(u[:-4]) == u[-4:]

for nev, u, f in [("paritás", uzenet_p, paritas_jo), ("CRC-4", uzenet_c, crc_jo)]:
    db, osszes = eszrevett(u, f)
    print(f"{nev:<8} kétbites hibák: {db:>3} / {osszes} észrevéve ({db / osszes:.0%})")

# Egymás melletti hibák (burst) legfeljebb 4 bit hosszan
burst = sum(not crc_jo([b ^ (k <= j < k + h) for j, b in enumerate(uzenet_c)])
            for h in range(1, 5) for k in range(len(uzenet_c) - h + 1))
print(f"CRC-4: legfeljebb 4 hosszú egybefüggő hibák: mind észrevéve? "
      f"{burst == sum(len(uzenet_c) - h + 1 for h in range(1, 5))}")
```

A paritás **egyetlen** kétbites hibát sem vesz észre (két átbillent bit nem változtatja meg a párosságot). A CRC-4 a kétbites hibák többségét és **minden** legfeljebb 4 bit hosszú egybefüggő hibasorozatot (_burst_) elkap – márpedig a valóságban (karcos lemez, villámló vezeték) a hibák jellemzően csomókban jönnek. Ezért van CRC minden Ethernet-keretben (32 bites), USB-csomagban és ZIP-fájlban.

## 5. UTF-8: hány bájt egy betű?

Az UTF-8 **változó hosszúságú** kódolás: az angol ábécé egy bájt (ASCII-kompatibilis), az ékezetes betűk kettő, sok más írásjel három, az emojik négy bájt.

```python run
# Karakterek UTF-8 bájtjai bitenként
for k in ["A", "é", "ő", "€", "😀"]:
    b = k.encode("utf-8")
    print(f"{k!r:>5} U+{ord(k):05X}: {len(b)} bájt  " + " ".join(f"{x:08b}" for x in b))

szoveg = "Árvíztűrő tükörfúrógép"
print(f"\n{szoveg!r}: {len(szoveg)} karakter, {len(szoveg.encode())} bájt UTF-8-ban")
```

Figyeld meg a bitmintákat: az első bájt eleje elárulja a hosszt (`0…` = 1 bájt, `110…` = 2, `1110…` = 3, `11110…` = 4), a folytató bájtok mind `10…`-val kezdődnek. Így egy szöveg közepéről is mindig megtalálható a következő karakter eleje. Gyakorlati csapda: egy adatbázis-mező „20 karakter” vagy „20 bájt” hosszú? Magyar szövegnél ez nem ugyanaz!

## Összefoglalás

- Összeadás után a processzor beállítja a **C** (előjel nélküli túllépés), **V** (előjeles túlcsordulás), **N** és **Z** jelzőt; ugyanaz a bitminta két értelmezést kap.
- A 0,1 kettes számrendszerben **végtelen** tört, ezért lebegőpontosan csak kerekítve tárolható; lebegőpontos számot ne hasonlíts `==`-vel, pénzt ne tárolj lebegőpontosan.
- IEEE 754 single: 1 előjel + 8 kitevő (eltolás 127) + 23 mantissza bit.
- A Hamming(7,4) minden egybites hibát javít, a kétbitest viszont **rosszul** – ezért kell a SECDED.
- A paritás páros számú hibát nem lát; a CRC az egybefüggő hibasorozatokat is megbízhatóan felismeri.
- UTF-8: 1–4 bájt karakterenként; az ékezetes magyar betűk 2 bájtosak.

## A lecke feladata

```quiz required
? 8 bites összeadás: 100 + 50 (01100100 + 00110010). Melyik jelző lesz 1?
- csak a C (átvitel)
+ csak a V (előjeles túlcsordulás)
- a C és a V is
- egyik sem
! Előjel nélkül 150 elfér (C = 0), előjelesen két pozitívból negatív lett (V = 1).

? Mi lesz a Hamming(7,4) kódszó az 1001 adatra (p1 p2 d1 p4 d2 d3 d4 sorrendben)?
= 0011001
! p1 = d1⊕d2⊕d4 = 0, p2 = d1⊕d3⊕d4 = 0, p4 = d2⊕d3⊕d4 = 1.

? Mi történik, ha egy Hamming(7,4) kódszóban két bit romlik el?
- mindkettőt kijavítja
- jelzi a hibát, de nem javít
+ a szindróma egy harmadik bitre mutat, a „javítás” újabb hibát okoz
! Ezért van a SECDED-ben egy plusz paritásbit.

? Hány bájton tárolódik UTF-8-ban az „ő” betű?
= 2
! Az ékezetes latin betűk 2 bájtosak, az euró jel 3, az emojik 4.

? Hány bitből áll egy IEEE 754 single (32 bites) szám kitevő mezője?
= 8
! 1 előjelbit + 8 kitevőbit + 23 mantisszabit.
```
