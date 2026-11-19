---
title: Mélyebben – modellek ellenőrzése és a bizonytalanság
summary: Túlillesztés (miért rossz a mindenen átmenő polinom), exponenciális és logisztikus előrejelzés összevetése csúszkával, az algoritmusok növekedése megszámolt lépésekkel, és egy projekt átfutási idejének Monte-Carlo-szimulációja bizonytalan becslésekből.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért nem az a legjobb modell, amelyik a **legjobban illeszkedik** a mért adatokra,
- miért veszélyes egy exponenciális modellel **messzire** előre jelezni,
- hogy a nagy O jelölés a gyakorlatban **megszámolható** lépésekben is látszik,
- hogyan számolhatunk **bizonytalan** becslésekkel (és miért csúsznak a projektek).

## 1. Túlillesztés: a túl jó modell

Mérünk 8 pontot egy valójában $y = 2x + 1$ összefüggésből, de a mérés zajos. Két modellt illesztünk: egy **egyenest** (legkisebb négyzetek), és egy hetedfokú **polinomot**, amely mind a 8 ponton pontosan átmegy.

```python run
# Túlillesztés: egy egyenes és egy mindenen átmenő polinom ugyanarra a zajos mérésre
import random

r = random.Random(3)
x_tan = list(range(8))                                     # 8 "tanító" mérés
y_tan = [2 * x + 1 + r.gauss(0, 1) for x in x_tan]         # valójában y = 2x + 1, zajjal

# 1) legkisebb négyzetes egyenes
n = len(x_tan)
xa, ya = sum(x_tan) / n, sum(y_tan) / n
m = sum((x - xa) * (y - ya) for x, y in zip(x_tan, y_tan)) / sum((x - xa) ** 2 for x in x_tan)
egyenes = lambda x: ya + m * (x - xa)

# 2) Lagrange-interpoláció: 7-edfokú polinom, amely PONTOSAN átmegy mind a 8 ponton
def polinom(x):
    s = 0.0
    for i, (xi, yi) in enumerate(zip(x_tan, y_tan)):
        l = 1.0
        for j, xj in enumerate(x_tan):
            if j != i:
                l *= (x - xj) / (xi - xj)
        s += yi * l
    return s

def atlagos_hiba(modell, xs):                              # a valódi 2x + 1-től való átlagos eltérés
    return sum(abs(modell(x) - (2 * x + 1)) for x in xs) / len(xs)

print(f"egyenes: y = {m:.2f}x + {ya - m * xa:.2f}")
print(f"hiba a tanító pontokon:  egyenes {sum(abs(egyenes(x) - y) for x, y in zip(x_tan, y_tan)) / n:.2f}, polinom 0.00")
print(f"hiba két mérés között:   egyenes {atlagos_hiba(egyenes, [0.5, 3.5, 6.5]):.2f}, polinom {atlagos_hiba(polinom, [0.5, 3.5, 6.5]):.2f}")
print(f"előrejelzés x = 10-re:   egyenes {egyenes(10):.1f}, polinom {polinom(10):.1f}  (valódi: 21)")
```

A polinom a mért pontokon **hibátlan** – mégis rosszabb: a pontok között nagyobbat téved, x = 10-nél pedig 2005-öt jósol 21 helyett! A polinom nem az összefüggést tanulta meg, hanem a **zajt** is. Ez a **túlillesztés** (overfitting), a gépi tanulás egyik legfontosabb csapdája.

A tanulság a modellezés minden területére igaz:

- Egy modellt mindig olyan adatokon is ellenőrizni kell, amelyeket az illesztéshez **nem** használtunk (a gépi tanulásban: tanító és teszt adathalmaz).
- Az **egyszerűbb** modell gyakran jobb (Occam borotvája): annyi paraméter kell, amennyit az adatok tényleg alátámasztanak.
- A mért tartományon **kívüli** előrejelzés (extrapoláció) mindig kockázatos.

## 2. Exponenciális vagy logisztikus?

Egy új alkalmazás felhasználóinak száma az elején exponenciálisan nő. Ha erre exponenciális modellt illesztünk, a jövőre nézve képtelen számokat kapunk – a valóságban a piac telítődik, és a növekedés logisztikus: $N(t) = \dfrac{K}{1 + A e^{-rt}}$, ahol $K$ az eltartóképesség (itt $1000$).

```plot
title: Exponenciális és logisztikus növekedés (ezer felhasználó)
x: 0, 25
y: 0, 1200
param: r = 0.4, 0.1, 1, 0.05
f: 10*e^(r*x) # exponenciális
f: 1000/(1 + 99*e^(-r*x)) # logisztikus
dash: 1000 # K
```

Az elején a két görbe **szinte egybeesik** – az első adatokból tehát nem lehet eldönteni, melyik a jó modell! Az elválás az inflexiós pontnál ($K/2$) kezdődik. Ezért kell a modellválasztásnál a **mechanizmusra** is gondolni (van-e korlát, telítődés), nem csak az illeszkedésre.

## 3. A nagy O számokban

A buborékrendezés kb. $\frac{n^2}{2}$, az összefésülő rendezés kb. $n \log_2 n$ összehasonlítást végez. Számoljuk meg ténylegesen:

```python run
# Algoritmusok növekedése mérve: összehasonlítások száma buborék- és összefésülő rendezésnél
import random

def buborek(lista):
    a, db = lista[:], 0
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            db += 1                                        # egy összehasonlítás
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return db

def osszefesulo(a):
    if len(a) <= 1:
        return a, 0
    bal, db1 = osszefesulo(a[: len(a) // 2])
    jobb, db2 = osszefesulo(a[len(a) // 2 :])
    ered, i, j, db = [], 0, 0, db1 + db2
    while i < len(bal) and j < len(jobb):
        db += 1
        if bal[i] <= jobb[j]:
            ered.append(bal[i]); i += 1
        else:
            ered.append(jobb[j]); j += 1
    return ered + bal[i:] + jobb[j:], db

r = random.Random(0)
for n in [100, 400, 1600]:
    adat = [r.random() for _ in range(n)]
    print(f"n = {n:>4}: buborék {buborek(adat):>9,} | összefésülő {osszefesulo(adat)[1]:>6,} összehasonlítás")
```

Ha $n$ négyszeresére nő, a buborékrendezés munkája kb. **16-szorosára** ($4^2$) nő, az összefésülőé csak kb. 5-szörösére. $n = 1600$-nál már 85-szörös a különbség; egymillió elemnél ez a különbség másodpercek és napok között dönt. Egy algoritmus megválasztása gyakran többet számít, mint egy gyorsabb gép.

## 4. Bizonytalanság: miért csúsznak a projektek?

Egy projekt három egymás utáni feladatból áll; mindegyikre három becslésünk van: optimista, legvalószínűbb és pesszimista. Ha egyszerűen a „legvalószínűbb” értékeket összeadjuk, 23 nap jön ki. De a feladatok **ferde** eloszlásúak: sokkal többet csúszhatnak, mint amennyit nyerhetnek. Szimuláljuk le százezerszer:

```python run
# Bizonytalanság modellezése Monte-Carlo-szimulációval: elkészül-e a projekt 30 nap alatt?
import random

# három egymás utáni feladat: (optimista, legvalószínűbb, pesszimista) napokban
feladatok = [(5, 8, 15), (6, 10, 20), (3, 5, 12)]
r = random.Random(42)

N = 100_000
idok = sorted(sum(r.triangular(a, c, b) for a, b, c in feladatok) for _ in range(N))
print(f"ha mindenhol a legvalószínűbbel számolunk: {sum(b for a, b, c in feladatok)} nap")
print(f"átlagos átfutás a szimulációban:          {sum(idok) / N:.1f} nap")
print(f"esély, hogy 30 napon belül kész:           {sum(t <= 30 for t in idok) / N:.0%}")
print(f"90%-os biztonsággal kész ennyi nap alatt:  {idok[int(0.9 * N)]:.1f} nap")
```

Az átlagos átfutás **28 nap**, és ha 90%-os biztonsággal akarunk határidőt vállalni, kb. **34 napot** kell mondanunk – a „legvalószínűbb” 23 nap valójában ritkán teljesül. Ez a Monte-Carlo-szimuláció ereje: ha a bemenetek bizonytalanok, nem egy számot, hanem egy **eloszlást** kapunk az eredményre, és abból valószínűségeket olvashatunk le. Ugyanezt használják a mérnöki tűrésszámításban, a pénzügyi kockázatelemzésben és az időjárás-előrejelzésben (ensemble előrejelzés).

## Összefoglalás

- Túlillesztés: a mért pontokon tökéletes modell új adatokon rossz lehet; ellenőrizz nem használt adatokon, és ne extrapolálj vakon.
- Az exponenciális és a logisztikus modell az elején egybeesik; a modellt a mechanizmus alapján is válaszd.
- $n^2$ kontra $n \log n$: a különbség $n$-nel együtt nő, nagy adatnál ez dönt.
- Bizonytalan bemenetekre a Monte-Carlo-szimuláció eloszlást ad; a „legvalószínűbb” értékek összege általában túl optimista.

## A lecke feladata

```quiz required
? Hány összehasonlítást végez a buborékrendezés $n = 10$ elemen? ($\frac{n(n-1)}{2}$)
= 45
! $\frac{10 \cdot 9}{2} = 45$

? Egy $O(n^2)$ algoritmusnál hányszorosára nő a futási idő, ha az adat mennyisége tízszeresére nő?
= 100
! $10^2 = 100$

? Mit jelent a túlillesztés?
- a modell túl egyszerű, ezért a mért pontokra sem illeszkedik
+ a modell a zajt is megtanulja, ezért a mért pontokon jó, új adatokon rossz
- a modellnek túl kevés paramétere van
- a modell csak a mért tartományon kívül működik
! Ezért kell a modellt az illesztéshez nem használt adatokon is ellenőrizni.

? Egy feladat becslései: optimista 2, legvalószínűbb 4, pesszimista 9 nap. Mennyi a háromszög-eloszlás várható értéke, $\frac{a + m + b}{3}$ (nap)?
= 5
! $\frac{2 + 4 + 9}{3} = 5$ – több, mint a legvalószínűbb 4 nap, mert a csúszás felé hosszabb a „farok”.

? Mihez tart az $N(t) = \dfrac{500}{1 + 9e^{-t}}$ logisztikus függvény, ha $t \to \infty$?
= 500
! $e^{-t} \to 0$, így $N(t) \to 500$ – ez az eltartóképesség.
```
