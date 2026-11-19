---
title: Mélyebben – az integrál a gyakorlatban
summary: Az integrál mint összegzés (napi energiafogyasztás mért adatokból), Monte-Carlo-integrálás véletlen pontokkal, az improprius integrál konvergenciája számokkal, és a normális eloszlás 68–95–99,7-es szabálya mint görbe alatti terület.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogy az integrál a gyakorlatban **összegzés**: mért adatokból is kiszámolható, képlet nélkül,
- hogyan lehet **véletlen pontokkal** területet (és $\pi$-t) becsülni,
- **számokkal** látni, mikor véges és mikor végtelen egy improprius integrál,
- miért a görbe alatti terület a **valószínűség** a statisztikában.

## 1. Az integrál mint összegzés: a napi villanyfogyasztás

A villanyóra nem teljesítményt (W), hanem **energiát** (kWh) mér, és az energia a teljesítmény idő szerinti integrálja: $E = \int P(t)\,dt$. Egy okosmérő óránként rögzíti egy háztartás teljesítményfelvételét – képletünk nincs, csak 24 mért értékünk. A trapézszabály ilyenkor is működik:

```python run
# Integrál mint összegzés: egy háztartás teljesítményfelvétele óránként (W) → napi energia (kWh)
teljesitmeny_w = [150, 120, 110, 110, 120, 300, 900, 1200, 400, 300, 350, 600,
                  1500, 700, 400, 350, 450, 800, 2000, 1800, 1200, 900, 500, 250]

# trapézszabály 1 órás lépésközzel (a 24. óra után újra a 0. óra értéke jön)
ertekek = teljesitmeny_w + [teljesitmeny_w[0]]
energia_wh = sum((ertekek[i] + ertekek[i + 1]) / 2 * 1 for i in range(24))
print(f"napi energia ≈ {energia_wh / 1000:.2f} kWh")
print(f"átlagteljesítmény = {energia_wh / 24:.0f} W  (az integrál osztva az idővel)")
print(f"havi költség 30 nappal, 70 Ft/kWh-val ≈ {energia_wh / 1000 * 30 * 70:,.0f} Ft")
```

Ez a gondolat mindenhol visszaköszön, ahol egy „sebességből” a „mennyiséget” akarjuk: sebességből megtett út, vízhozamból tárolt víz, adatátviteli sebességből letöltött adatmennyiség. Az **átlagérték** pedig az integrál osztva az intervallum hosszával: $\bar P = \frac{1}{T}\int_0^T P(t)\,dt$.

**Hasonlat:** a kilométeróra (megtett út) a sebességmérő (pillanatnyi sebesség) integrálja – folyamatosan összeadja a „sebesség × kis időtartam” darabokat.

## 2. Monte-Carlo-integrálás: területmérés dobálással

Dobálj véletlenszerűen pontokat az egységnégyzetbe! Azok aránya, amelyek a negyedkörbe esnek ($x^2 + y^2 \le 1$), megközelíti a negyedkör területét, azaz $\frac{\pi}{4}$-et:

```python run
# Monte-Carlo-integrálás: a negyedkör területe (π/4) véletlen pontokkal
import math, random

r = random.Random(1)
for n in [100, 10_000, 1_000_000]:
    bent = sum(1 for _ in range(n) if r.random() ** 2 + r.random() ** 2 <= 1)
    becsles = 4 * bent / n                       # terület arány · a négyzet területe · 4
    print(f"N = {n:>9,}: π ≈ {becsles:.5f}, hiba {abs(becsles - math.pi):.5f}")
```

A pontosság lassan javul: **százszor** több pont csak kb. **tízszer** kisebb hibát ad (a hiba $\frac{1}{\sqrt N}$-nel arányos). Egy dimenzióban ezért a Simpson-szabály sokkal jobb. Akkor miért használják mégis? Mert a Monte-Carlo-módszer pontossága **nem függ a dimenziótól**: 10 vagy 100 változós integráloknál (pénzügyi kockázatszámítás, fizikai szimulációk, számítógépes grafika fényszámítása) a rácsos módszerek használhatatlanok, a véletlen mintavétel viszont működik.

## 3. Improprius integrál: véges terület végtelen tartományon

Lehet-e egy végtelen hosszú tartomány területe véges? Számoljuk ki $\int_1^b \frac{1}{x^2}\,dx$-et és $\int_1^b \frac{1}{x}\,dx$-et egyre nagyobb $b$-re:

```python run
# Improprius integrálok: ∫ 1/x² és ∫ 1/x 1-től b-ig, ahogy b → ∞
import math

for b in [10, 1000, 1_000_000]:
    i2 = 1 - 1 / b                               # ∫₁ᵇ 1/x² dx = 1 − 1/b
    i1 = math.log(b)                             # ∫₁ᵇ 1/x dx = ln b
    print(f"b = {b:>9,}: ∫ 1/x² = {i2:.6f}   ∫ 1/x = {i1:7.3f}")
```

- $\int_1^\infty \frac{1}{x^2}\,dx = \lim\limits_{b \to \infty}\left(1 - \frac1b\right) = 1$ – **konvergens**, a terület véges.
- $\int_1^\infty \frac{1}{x}\,dx = \lim\limits_{b \to \infty} \ln b = \infty$ – **divergens**, bár nagyon lassan nő (egymillióig is csak $\approx 13{,}8$).

```plot
title: Az 1/x² alatti terület véges, az 1/x alatti végtelen
x: 0.5, 10
y: 0, 2
f: 1/x^2 # 1/x²
f: 1/x # 1/x
```

A két görbe „szinte ugyanúgy” tart a $0$-hoz, mégis óriási a különbség. Ez pontosan a harmonikus sor ($\sum \frac1k$, divergens) és a $\sum \frac{1}{k^2}$ (konvergens) párja – az integrálkritérium kapcsolja össze őket.

## 4. Valószínűség mint terület: a normális eloszlás

Sok mért mennyiség (testmagasság, mérési hiba, vizsgapontszám) a **normális** (Gauss-) eloszlást követi. A standard változat sűrűségfüggvénye

$$
\varphi(x) = \frac{1}{\sqrt{2\pi}}\, e^{-x^2/2},
$$

és annak a valószínűsége, hogy az érték $a$ és $b$ közé esik, a görbe alatti **terület**: $P(a < X < b) = \int_a^b \varphi(x)\,dx$. Ennek a függvénynek **nincs elemi primitív függvénye** – ezért csak numerikusan lehet kiszámolni:

```python run
# A normális eloszlás: a görbe alatti terület ±1, ±2, ±3 szórásnyira (Simpson-szabály)
import math

def phi(x):
    return math.exp(-x * x / 2) / math.sqrt(2 * math.pi)   # standard normális sűrűségfüggvény

def simpson(f, a, b, n=1000):
    h = (b - a) / n
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * h) for i in range(1, n))
    return s * h / 3

for k in [1, 2, 3]:
    print(f"P(−{k}σ < X < {k}σ) = {simpson(phi, -k, k):.4f}")
```

Ez a híres **68–95–99,7-es szabály**: az értékek kb. $68\%$-a esik az átlagtól egy szórásnyira, $95\%$-a kettőn, $99{,}7\%$-a háromon belül. A minőségbiztosításban a „hat szigma” is innen kapta a nevét. A teljes görbe alatti terület pontosan $1$ (ez egy improprius integrál!).

```plot
title: A standard normális eloszlás sűrűségfüggvénye
x: -4, 4
y: 0, 0.5
f: e^(-x^2/2)/sqrt(2*pi) # φ(x)
```

## Összefoglalás

- Az integrál összegzés: mért adatokból trapézszabállyal is számolható (energia = teljesítmény integrálja); átlag = integrál / intervallumhossz.
- Monte-Carlo: véletlen pontokkal becsül; lassú ($1/\sqrt N$), de a dimenziótól független.
- $\int_1^\infty \frac{1}{x^2}\,dx = 1$ konvergens, $\int_1^\infty \frac1x\,dx$ divergens.
- A valószínűség a sűrűségfüggvény alatti terület; normális eloszlásnál 68–95–99,7%.

## A lecke feladata

```quiz required
? Egy készülék 2 órán át 1500 W-ot vesz fel. Hány kWh energiát fogyaszt?
= 3
! $E = P \cdot t = 1{,}5\ \text{kW} \cdot 2\ \text{h} = 3\ \text{kWh}$ – állandó teljesítménynél az integrál egy téglalap területe.

? Monte-Carlo-becslésnél 10 000 pontból 7850 esett a negyedkörbe. Mennyi a $\pi$ becslése?
= 3,14
= 3.14
! $4 \cdot \frac{7850}{10000} = 3{,}14$

? Mennyi $\displaystyle\int_1^\infty \frac{1}{x^2}\,dx$?
= 1
! $\lim\limits_{b \to \infty}\left(1 - \frac1b\right) = 1$

? Melyik improprius integrál divergens?
- $\int_1^\infty \frac{1}{x^2}\,dx$
+ $\int_1^\infty \frac{1}{x}\,dx$
- $\int_1^\infty \frac{1}{x^3}\,dx$
- $\int_1^\infty e^{-x}\,dx$
! $\int_1^b \frac1x\,dx = \ln b \to \infty$.

? Normális eloszlásnál az értékek kb. hány százaléka esik az átlagtól két szórásnyin belül?
= 95
! A 68–95–99,7-es szabály középső értéke.
```
