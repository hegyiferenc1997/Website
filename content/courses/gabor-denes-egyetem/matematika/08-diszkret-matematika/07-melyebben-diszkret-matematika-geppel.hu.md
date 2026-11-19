---
title: Mélyebben – diszkrét matematika géppel
summary: Logikai ekvivalencia ellenőrzése igazságtáblával programból, jelszavak összeszámlálása és a nyers erős feltörés ideje, a születésnap-paradoxon képlettel és szimulációval, a gyors moduláris hatványozás (az RSA motorja), és a Dijkstra-algoritmus a legrövidebb útra.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan ellenőrizhető **géppel**, hogy két logikai formula ekvivalens-e,
- miért számít egy jelszó **hossza** jobban, mint bármi más,
- miért meglepően **nagy** az esélye két azonos születésnapnak,
- hogyan lehet $7^{10^{18}}$-t (modulo $m$) **60 lépésben** kiszámolni,
- hogyan talál a navigáció **legrövidebb utat** egy gráfban.

## 1. Igazságtábla programmal

Két formula akkor **ekvivalens**, ha minden lehetséges igazságérték-kiosztásra ugyanazt adják. $n$ változónál ez $2^n$ eset – a gépnek gyerekjáték végigpróbálni:

```python run
# Igazságtábla géppel: két logikai formula ekvivalens-e? (minden lehetséges értékadást kipróbálunk)
from itertools import product

def impl(a, b):
    return (not a) or b                       # A → B csak akkor hamis, ha A igaz és B hamis

formulak = {
    "A → B  vs  ¬B → ¬A (kontrapozíció)": (lambda a, b: impl(a, b), lambda a, b: impl(not b, not a)),
    "A → B  vs  B → A   (megfordítás)":   (lambda a, b: impl(a, b), lambda a, b: impl(b, a)),
    "¬(A ∧ B)  vs  ¬A ∨ ¬B (De Morgan)":  (lambda a, b: not (a and b), lambda a, b: (not a) or (not b)),
}
for nev, (f, g) in formulak.items():
    elteres = [(a, b) for a, b in product([False, True], repeat=2) if f(a, b) != g(a, b)]
    print(f"{nev}: {'EKVIVALENS' if not elteres else 'NEM ekvivalens, ellenpélda: ' + str(elteres[0])}")
```

- A **kontrapozíció** ($A \to B \equiv \lnot B \to \lnot A$) mindig igaz – ezen alapul az indirekt bizonyítás.
- A **megfordítás** ($B \to A$) viszont nem ekvivalens: „ha esik, vizes az út” igaz, de „ha vizes az út, esik” nem (lehet, hogy locsoltak). Az ellenpélda: $A$ hamis, $B$ igaz.

Ugyanígy dolgoznak a hardvertervezők ellenőrző programjai is: bebizonyítják, hogy az egyszerűsített áramkör minden bemenetre ugyanazt adja, mint az eredeti.

## 2. Kombinatorika a biztonságban: jelszavak

Egy $n$ hosszú jelszó, amelynek minden karaktere $k$-féle lehet, $k^n$-féle lehet (ismétléses variáció). Egy támadó, aki másodpercenként 10 milliárd jelszót próbál ki:

```python run
# Kombinatorika a biztonságban: hány jelszó van, és mennyi idő mindet végigpróbálni?
sebesseg = 10 ** 10                               # 10 milliárd próbálkozás másodpercenként (egy erős GPU)
esetek = {
    "4 számjegyű PIN":            10 ** 4,
    "8 kisbetű":                  26 ** 8,
    "8 karakter (kis+nagy+szám)": 62 ** 8,
    "12 karakter (kis+nagy+szám)": 62 ** 12,
}
for nev, db in esetek.items():
    mp = db / sebesseg
    ido = f"{mp:.2g} s" if mp < 60 else f"{mp / 3600:.1f} óra" if mp < 86400 * 365 else f"{mp / (86400 * 365):,.0f} év"
    print(f"{nev:<29}: {db:>24,} lehetőség → {ido}")
```

A **hossz** a kitevőben van, ezért többet ér, mint a karakterkészlet bővítése: 8 helyett 12 karakter órák helyett **ezer évekre** növeli a feltörés idejét. Ezért javasolnak a biztonsági szakemberek hosszú jelmondatokat („négy véletlen szó”).

## 3. A születésnap-paradoxon

Hány embernek kell egy szobában lennie, hogy **50%-nál nagyobb** eséllyel legyen kettő azonos születésnappal? A legtöbben 183-at tippelnek. Számoljuk ki a komplementer eseménnyel: annak az esélye, hogy **mindenki különböző** napon született, $\frac{365}{365} \cdot \frac{364}{365} \cdot \ldots \cdot \frac{365 - n + 1}{365}$.

```python run
# A születésnap-paradoxon: mekkora eséllyel van két azonos születésnapú ember egy csoportban?
import random

def pontos(n):
    kulonbozo = 1.0
    for i in range(n):
        kulonbozo *= (365 - i) / 365          # az i-edik ember a többitől eltérő napon született
    return 1 - kulonbozo

r = random.Random(7)
for n in [10, 23, 50]:
    kiserlet = sum(len(set(r.randrange(365) for _ in range(n))) < n for _ in range(20_000)) / 20_000
    print(f"{n} ember: képlettel {pontos(n):.3f}, szimulációval {kiserlet:.3f}")
```

Már **23** embernél $50\%$ fölött van, 50-nél $97\%$! A meglepetés oka: nem egy adott emberhez hasonlítunk, hanem **minden párt** nézünk, és 23 embernek $\binom{23}{2} = 253$ párja van. Ez az informatikában is számít: egy $n$ bites hash-függvénynél már kb. $2^{n/2}$ próbálkozás után nagy eséllyel találunk ütközést (két azonos hash-ű bemenetet) – ezért kell a hash-eknek elég hosszúnak lenniük.

## 4. Gyors moduláris hatványozás

Az RSA-ban hatalmas kitevőjű hatványokat kell maradékosan számolni. Ha $7^{1000}$-t 999 szorzással számolnánk, az lassú lenne; $7^{10^{18}}$-nél lehetetlen. A trükk: a kitevőt **kettes számrendszerben** nézzük, és minden körben négyzetre emelünk ($a, a^2, a^4, a^8, \ldots$), ahol pedig a bit $1$, ott beszorzunk. Minden lépés után maradékot veszünk, így a számok sosem nőnek nagyra.

```python run
# Gyors moduláris hatványozás (négyzetre emelés és szorzás): a^k mod m kevés lépésben
def gyors_hatvany(a, k, m):
    eredmeny, lepes = 1, 0
    a %= m
    while k > 0:
        if k % 2 == 1:                        # ha a kitevő aktuális bitje 1, beszorzunk
            eredmeny = eredmeny * a % m
        a = a * a % m                         # a következő bithez négyzetre emelünk
        k //= 2
        lepes += 1
    return eredmeny, lepes

for k in [13, 1000, 10 ** 18]:
    ertek, lepes = gyors_hatvany(7, k, 1_000_003)
    print(f"7^{k} mod 1000003 = {ertek:>7} | {lepes} kör (naivan {k:,} szorzás kellene)")
print("ellenőrzés a beépített pow-val:", pow(7, 10 ** 18, 1_000_003))
```

A körök száma a kitevő **bitjeinek száma**, kb. $\log_2 k$: $10^{18}$-hoz is csak 60 kör kell. Ez a Python beépített `pow(a, k, m)` függvényének a lelke is, és ezért gyors a titkosítás – miközben a visszafejtéshez szükséges prímtényezős felbontásra nem ismerünk ilyen gyors módszert.

## 5. Legrövidebb út: a Dijkstra-algoritmus

A szélességi keresés a **lépésszámra** nézve legrövidebb utat adja. Ha az éleknek **hossza** (súlya) van – például kilométer –, a **Dijkstra-algoritmus** kell: mindig a még fel nem dolgozott, legközelebbi csúcsot vesszük ki, és megnézzük, rajta keresztül rövidebb-e az út a szomszédaihoz.

```python run
# Dijkstra-algoritmus: a legrövidebb út egy súlyozott gráfban (városok, km)
import heapq

utak = {
    "Budapest":     {"Győr": 121, "Kecskemét": 86, "Miskolc": 182, "Székesfehérvár": 65},
    "Győr":         {"Budapest": 121, "Székesfehérvár": 87, "Szombathely": 115},
    "Székesfehérvár": {"Budapest": 65, "Győr": 87, "Pécs": 160, "Szombathely": 160},
    "Kecskemét":    {"Budapest": 86, "Szeged": 87, "Pécs": 190},
    "Szeged":       {"Kecskemét": 87, "Pécs": 190},
    "Pécs":         {"Székesfehérvár": 160, "Kecskemét": 190, "Szeged": 190},
    "Miskolc":      {"Budapest": 182},
    "Szombathely":  {"Győr": 115, "Székesfehérvár": 160},
}

def dijkstra(start):
    tav, honnan = {start: 0}, {}
    sor = [(0, start)]                        # prioritási sor: mindig a legközelebbit vesszük ki
    while sor:
        d, v = heapq.heappop(sor)
        if d > tav[v]:
            continue                          # elavult bejegyzés
        for w, hossz in utak[v].items():
            if d + hossz < tav.get(w, float("inf")):
                tav[w], honnan[w] = d + hossz, v
                heapq.heappush(sor, (d + hossz, w))
    return tav, honnan

tav, honnan = dijkstra("Szombathely")
ut, v = ["Szeged"], "Szeged"
while v != "Szombathely":                     # visszafelé követjük az utat
    v = honnan[v]
    ut.append(v)
print(" → ".join(reversed(ut)), f"= {tav['Szeged']} km")
```

Az algoritmus a gráfban ténylegesen legrövidebb utat adja: Székesfehérváron, Budapesten és Kecskeméten át 398 km, míg Pécsen át $160 + 160 + 190 = 510$ km lenne. Ez az algoritmus (és továbbfejlesztett változatai) fut a navigációs alkalmazásokban és az internet útválasztóiban (pl. az OSPF protokollban).

## Összefoglalás

- Ekvivalencia: minden ($2^n$) értékadásra azonos érték; a kontrapozíció ekvivalens, a megfordítás nem.
- $k$ karakterből $n$ hosszú jelszó: $k^n$ – a hossz a kitevőben van.
- Születésnap-paradoxon: 23 embernél már $> 50\%$, mert a párok száma $\binom{n}{2}$ nő.
- Gyors hatványozás: kb. $\log_2 k$ kör, négyzetre emelés + szorzás, minden lépésben maradékkal.
- Dijkstra: súlyozott gráfban legrövidebb út, mindig a legközelebbi csúcsot dolgozza fel.

## A lecke feladata

```quiz required
? Melyik formula ekvivalens az $A \to B$ implikációval?
- $B \to A$
+ $\lnot B \to \lnot A$
- $\lnot A \to \lnot B$
- $A \land B$
! A kontrapozíció: $A \to B \equiv \lnot B \to \lnot A$.

? Hányféle 4 jegyű PIN-kód van, ha minden jegy 0–9 lehet?
= 10000
! Ismétléses variáció: $10^4 = 10000$.

? Legalább hány embernek kell egy csoportban lennie, hogy $50\%$-nál nagyobb eséllyel legyen kettő azonos születésnappal?
= 23
! $n = 23$-nál a valószínűség $\approx 0{,}507$.

? Hány kör kell a gyors moduláris hatványozásnak a $k = 1000$ kitevőhöz? (Ennyi bitből áll az 1000 kettes számrendszerben.)
= 10
! $1000 = 1111101000_2$, 10 bit.

? Egy gráf élei és hosszuk: A–B: 4, A–C: 1, C–B: 2, B–D: 5, C–D: 8. Milyen hosszú a legrövidebb út A-ból D-be?
= 8
! A → C → B → D: $1 + 2 + 5 = 8$ (a közvetlen A → C → D 9 lenne).
```
