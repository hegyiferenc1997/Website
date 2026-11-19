---
title: Mélyebben – algebra a gép szemével
summary: Pontos törtek és lebegőpontos számok összevetése, a Horner-elrendezés (polinom értéke sokkal kevesebb szorzással), egy „képlet nélküli” exponenciális egyenlet megoldása intervallumfelezéssel, és a duplázódási idő logaritmussal kontra a 72-es szabály.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért számol a gép **pontatlanul** tizedes törtekkel, és hogyan számolhatsz **pontosan** törtekkel,
- hogyan értékelsz ki egy polinomot a **Horner-elrendezéssel** sokkal kevesebb szorzással,
- hogyan oldasz meg egy olyan egyenletet, amelyre **nincs megoldóképlet** (intervallumfelezés),
- hogyan számolod ki logaritmussal a **duplázódási időt**, és mennyire jó a fejszámolós „72-es szabály”.

## 1. Pontos tört vagy lebegőpontos szám?

A $\frac{1}{10}$ kettes számrendszerben végtelen, periodikus tört (mint tízesben az $\frac{1}{3} = 0{,}333\ldots$), ezért a gép csak **kerekítve** tárolja. Ha sokszor összeadjuk, a kerekítési hibák összegyűlnek. A racionális számokat viszont pontosan is tárolhatjuk: **számláló és nevező** egész számként.

```python run
# Pontos törtek kontra lebegőpontos számok
from fractions import Fraction

osszeg = 0.0
for _ in range(10):
    osszeg += 0.1                      # lépésenként, ahogy egy egyszerű ciklus tenné
print("0,1 tízszer összeadva (lebegőpontos):", osszeg, "→ egyenlő 1-gyel?", osszeg == 1)

pontos = sum([Fraction(1, 10)] * 10)  # a törtek összege pontos
print("1/10 tízszer összeadva (pontos tört): ", pontos, "→ egyenlő 1-gyel?", pontos == 1)

# Egy racionális kifejezés pontosan: (1/2 + 1/3) / (1 − 1/7)
k = (Fraction(1, 2) + Fraction(1, 3)) / (1 - Fraction(1, 7))
print("(1/2 + 1/3) / (1 − 1/7) =", k, "≈", float(k))
```

A lebegőpontos összeg $0{,}9999999999999999$ – nem pontosan $1$! A `Fraction` típus a törtekkel úgy számol, ahogy te papíron: közös nevezőre hoz és egyszerűsít, így

$$
\frac{\frac12 + \frac13}{1 - \frac17} = \frac{\frac56}{\frac67} = \frac{35}{36}
$$

pontosan jön ki. Tanulság: ha **pontosság** kell (pénz, geometriai döntések, egyenlőségvizsgálat), egész számokkal vagy törtekkel számolj; ha **sebesség** kell (grafika, fizikai szimuláció), lebegőpontossal – és tudd, hogy pici hibák lesznek benne.

## 2. Horner-elrendezés: ugyanaz az érték, kevesebb munka

A $p(x) = 2x^4 - 3x^3 + 5x - 1$ polinom értékét „naivan” úgy számolnád, hogy minden hatványt külön kiszámolsz. Ügyesebb, ha kiemeled az $x$-et, ahol csak lehet:

$$
p(x) = \Big(\big((2x - 3)\,x + 0\big)\,x + 5\Big)\,x - 1.
$$

Ez a **Horner-elrendezés**: belülről kifelé haladva minden lépés egy szorzás és egy összeadás.

```python run
# Horner-elrendezés: polinom értéke kevesebb szorzással
def naiv(egyutthatok, x):
    # a_n x^n + … + a_0, minden hatványt külön kiszámolva
    n = len(egyutthatok) - 1
    szorzas, ertek = 0, 0
    for i, a in enumerate(egyutthatok):
        hatvany = 1
        for _ in range(n - i):
            hatvany *= x
            szorzas += 1
        ertek += a * hatvany
        szorzas += 1
    return ertek, szorzas

def horner(egyutthatok, x):
    # (((a_n·x + a_{n-1})·x + …)·x + a_0
    ertek, szorzas = egyutthatok[0], 0
    for a in egyutthatok[1:]:
        ertek = ertek * x + a
        szorzas += 1
    return ertek, szorzas

p = [2, -3, 0, 5, -1]                  # 2x⁴ − 3x³ + 5x − 1
for x in [2, -1, 3]:
    print(f"x = {x:>2}: naiv {naiv(p, x)}, Horner {horner(p, x)}   (érték, szorzások száma)")
```

Negyedfokú polinomnál **15** helyett **4** szorzás – $n$-edfokúnál a naiv módszer kb. $\frac{n^2}{2}$, a Horner csak $n$ szorzást igényel. Ezért így számolnak a számológépek és a programkönyvtárak, és ugyanez az eljárás a **polinomosztás** ($x - c$-vel) papíron is (Horner-táblázat): ha az utolsó érték $0$, akkor $c$ gyök, és a polinom szorzattá bontható.

## 3. Egyenlet megoldóképlet nélkül: intervallumfelezés

A $2^x = x + 3$ egyenletre nincs olyan algebrai átalakítás, amellyel $x$ kifejezhető. Mégis megoldható tetszőleges pontossággal! Legyen $f(x) = 2^x - (x + 3)$. Mivel $f(2) = -1 < 0$ és $f(3) = 2 > 0$, és $f$ folytonos, a $[2;\,3]$ intervallumban van gyök. Felezzük az intervallumot, és mindig azt a felét tartsuk meg, ahol az előjel vált:

```python run
# Egyenlet, amelynek nincs "képlete": 2^x = x + 3 – megoldás intervallumfelezéssel
def f(x):
    return 2 ** x - (x + 3)            # a gyök ott van, ahol f(x) = 0

a, b = 2.0, 3.0                        # f(2) = −1 < 0, f(3) = 2 > 0 → köztük van gyök
lepes = 0
while b - a > 1e-6:
    k = (a + b) / 2
    if f(a) * f(k) <= 0:               # az előjelváltás a bal felében van
        b = k
    else:
        a = k
    lepes += 1
print(f"x ≈ {(a + b) / 2:.6f}, {lepes} felezés után; ellenőrzés: 2^x = {2 ** a:.5f}, x + 3 = {a + 3:.5f}")
```

```plot
title: A 2^x = x + 3 egyenlet két oldala
x: -4, 4
y: -1, 9
f: 2^x # 2ˣ
f: x + 3 # x + 3
point: 2.4449, 5.4449 # metszéspont
```

Minden lépés **felezi** a bizonytalanságot: $k$ lépés után az intervallum hossza $\frac{1}{2^k}$. Egymilliomod pontossághoz $2^{20} \approx 10^6$ miatt **20 lépés** elég. A grafikonon látszik, hogy van egy **másik** megoldás is a negatív oldalon ($x \approx -2{,}86$) – az intervallumfelezés mindig csak azt a gyököt találja meg, amelyet bezártál. (Ez ugyanaz a módszer, mint a bináris keresés az informatikában.)

## 4. Duplázódási idő: logaritmus kontra fejszámolás

Ha egy mennyiség évente $r$ arányban nő (befektetés, felhasználók száma, adatmennyiség), akkor $t$ év múlva $(1 + r)^t$-szeresére nő. Mikor duplázódik meg?

$$
(1 + r)^t = 2 \quad\Longrightarrow\quad t = \frac{\ln 2}{\ln (1 + r)}.
$$

A pénzügyekben ismert fejszámolós közelítés a **72-es szabály**: $t \approx \frac{72}{r\,\%}$.

```python run
# Duplázódási idő: pontos képlet (ln 2 / ln(1 + r)) kontra a "72-es szabály"
import math

for r_szazalek in [1, 3, 7, 10, 20]:
    r = r_szazalek / 100
    pontos = math.log(2) / math.log(1 + r)
    print(f"{r_szazalek:>2}% növekedés: pontosan {pontos:5.1f} év, 72-es szabály: {72 / r_szazalek:5.1f} év")
```

1–10% között a szabály meglepően jó (néhány tized év eltérés), nagy növekedésnél romlik. Miért működik? Kis $r$-re $\ln(1 + r) \approx r$, és $\ln 2 \approx 0{,}693$, így $t \approx \frac{69{,}3}{r\,\%}$ – a 72-t csak azért választották, mert sok osztója van (2, 3, 4, 6, 8, 9, 12), így fejben könnyű vele osztani.

## Összefoglalás

- A lebegőpontos számok kerekítve tárolódnak, a hibák összegyűlhetnek; pontos számításhoz egész számok vagy törtek kellenek.
- **Horner-elrendezés:** $n$-edfokú polinom értéke $n$ szorzással; polinomosztásra is jó.
- **Intervallumfelezés:** ha $f(a)$ és $f(b)$ előjele különböző, $k$ lépés után $\frac{b - a}{2^k}$ pontosságú a gyök.
- Duplázódási idő: $t = \frac{\ln 2}{\ln(1 + r)}$, közelítőleg $\frac{72}{r\,\%}$.

## A lecke feladata

```quiz required
? Számold ki Horner-elrendezéssel: $p(x) = x^3 - 2x^2 + 3x - 4$, $p(2) = ?$
= 2
! $((1 \cdot 2 - 2) \cdot 2 + 3) \cdot 2 - 4 = 2$

? Egy $1$ hosszú intervallumból indulva legalább hány felezés kell, hogy a gyököt $0{,}001$-nél pontosabban ismerjük?
= 10
! $2^{10} = 1024 > 1000$, de $2^9 = 512 < 1000$.

? Egyszerűsítsd: $\dfrac{x^2 - 1}{x - 1}$ (ahol $x \neq 1$)
fn: x -> x + 1
domain: 2, 6
! Nevezetes azonosság: $x^2 - 1 = (x - 1)(x + 1)$.

? A 72-es szabály szerint hány év alatt duplázódik meg egy évi $6\%$-kal növő összeg?
= 12
! $72 / 6 = 12$

? Melyik állítás igaz?
- a számítógép minden tizedes törtet pontosan tárol
+ a $0{,}1$ kettes számrendszerben végtelen tört, ezért csak kerekítve tárolható
- a törtekkel (számláló/nevező) való számolás mindig pontatlan
- a Horner-elrendezés más eredményt ad, mint a naiv számolás
! A Horner csak a számolás sorrendjét változtatja meg, az eredményt nem.
```
