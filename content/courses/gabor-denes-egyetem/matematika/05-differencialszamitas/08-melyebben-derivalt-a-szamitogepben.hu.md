---
title: Mélyebben – a derivált a számítógépben
summary: Numerikus deriválás előre és központi differenciával, és miért romlik el, ha a lépésköz túl kicsi; a gradiens-ereszkedés (így tanulnak a neurális hálók) a lépésköz hatásával; és az optimális konzervdoboz kipróbálással és deriválással.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **közelíti** a gép a deriváltat, ha nincs képlet, és miért nem jó a „minél kisebb $h$, annál jobb” elv,
- mi a **gradiens-ereszkedés**, és miért a derivált a gépi tanulás motorja,
- egy valódi **optimalizálási** feladatot megoldani kétféleképpen: kipróbálással és deriválással.

## 1. Numerikus derivált – és a túl kicsi h csapdája

A derivált definíciója egy határérték: $f'(x) = \lim\limits_{h \to 0} \dfrac{f(x + h) - f(x)}{h}$. A gép nem tud határértéket venni, de egy **kis** $h$-val kiszámolhatja a differenciahányadost. Két változat:

$$
\text{előre: } \frac{f(x + h) - f(x)}{h}, \qquad \text{központi: } \frac{f(x + h) - f(x - h)}{2h}.
$$

Próbáljuk ki $f(x) = \sin x$-re az $x = 1$ pontban, ahol a pontos derivált $\cos 1$:

```python run
# Numerikus derivált: előre és központi differencia, f(x) = sin x, x = 1 (pontos érték: cos 1)
import math

pontos = math.cos(1)
print(f"{'h':>8} | {'előre: (f(x+h) − f(x)) / h':>28} | {'központi: (f(x+h) − f(x−h)) / 2h':>32}")
for k in [1, 2, 4, 6, 8, 10, 12]:
    h = 10 ** -k
    elore = (math.sin(1 + h) - math.sin(1)) / h
    kozponti = (math.sin(1 + h) - math.sin(1 - h)) / (2 * h)
    print(f"{h:>8.0e} | hiba {abs(elore - pontos):>23.1e} | hiba {abs(kozponti - pontos):>27.1e}")
```

Két meglepő dolog látszik:

- A **központi** differencia sokkal pontosabb: hibája $h^2$-tel arányos, az előre differenciáé csak $h$-val. ($h = 0{,}01$-nél $10^{-5}$ kontra $10^{-3}$.) A központi különbség „szimmetrikus”, ezért az első hibatag kiesik – ez a Taylor-polinomnál (7. témakör) válik majd világossá.
- Ha $h$-t **túl kicsire** vesszük, a hiba újra **nő**! $10^{-12}$-nél már rosszabb, mint $10^{-4}$-nél. Az ok a lebegőpontos kerekítés: két majdnem egyenlő szám különbségénél ($\sin(1 + h) - \sin 1$) az értékes jegyek nagy része elvész, és ezt még egy nagyon kicsi számmal is osztjuk. A legjobb $h$ egy „arany középút” (központi differenciánál kb. $10^{-5}$–$10^{-6}$).

**Hasonlat:** egy autó sebességét két fotóból becsülöd. Ha a két kép között egy óra telt el, a becslés pontatlan (közben gyorsított, lassított). Ha egy milliomod másodperc, a két képen az autó helyét már nem tudod elég pontosan lemérni. A jó időköz valahol a kettő között van.

## 2. Gradiens-ereszkedés: lefelé a lejtőn

A derivált megmondja, **merre nő** a függvény. Ha a minimumot keressük, lépjünk az **ellenkező** irányba: $x_{\text{új}} = x - \eta \cdot f'(x)$, ahol $\eta$ a lépésköz (a gépi tanulásban „tanulási ráta”). Keressük meg az $f(x) = (x - 3)^2 + 1$ minimumát!

```python run
# Gradiens-ereszkedés: lépj a derivált ellentett irányába – így tanulnak a neurális hálók is
def f(x):
    return (x - 3) ** 2 + 1

def df(x):
    return 2 * (x - 3)                   # a derivált: merre és milyen meredeken nő f

for tanulasi_rata in [0.1, 0.5, 1.1]:
    x = 0.0
    for _ in range(20):
        x = x - tanulasi_rata * df(x)    # egy lépés lefelé a lejtőn
    print(f"lépésköz {tanulasi_rata}: 20 lépés után x = {x:12.4f}, f(x) = {f(x):.4g}")
```

- $\eta = 0{,}1$: szépen, de lassan közelít a minimumhoz ($x = 3$).
- $\eta = 0{,}5$: ennél a parabolánál éppen egy lépésben odaugrik.
- $\eta = 1{,}1$: **túllő**, és egyre messzebb pattog – a módszer szétszáll.

Pontosan így tanulnak a **neurális hálók**: van egy „hibafüggvény” (mennyire tévednek a háló válaszai), amely több millió paramétertől függ, és a gép minden paramétert a hiba deriváltjának (gradiensének) ellentett irányába lép kicsit. A tanulási ráta megválasztása ott is a legfontosabb beállítások egyike: túl kicsi → lassú tanulás, túl nagy → a tanulás szétesik.

## 3. Az optimális konzervdoboz

Egy $1$ literes ($V = 1000\ \text{cm}^3$) henger alakú doboz anyagköltsége a felszínnel arányos. Milyen sugár mellett **legkisebb** a felszín?

$$
V = \pi r^2 h \;\Rightarrow\; h = \frac{V}{\pi r^2}, \qquad A(r) = 2\pi r^2 + 2\pi r h = 2\pi r^2 + \frac{2V}{r}.
$$

Deriválva: $A'(r) = 4\pi r - \dfrac{2V}{r^2} = 0$, ahonnan $r = \sqrt[3]{\dfrac{V}{2\pi}}$. Vessük össze a „nyers erővel”:

```python run
# Optimális konzervdoboz: 1 liter (1000 cm³) térfogat, minimális felszín (anyagköltség)
import math

V = 1000.0
def felszin(r):
    h = V / (math.pi * r ** 2)           # a magasságot a térfogat meghatározza
    return 2 * math.pi * r ** 2 + 2 * math.pi * r * h

# 1) "nyers erő": sok sugarat kipróbálunk
legjobb = min((felszin(r / 100), r / 100) for r in range(100, 1500))
print(f"kipróbálással:  r ≈ {legjobb[1]:.2f} cm, A ≈ {legjobb[0]:.1f} cm²")

# 2) deriválással: A'(r) = 4πr − 2V/r² = 0  →  r = (V / 2π)^(1/3)
r = (V / (2 * math.pi)) ** (1 / 3)
print(f"deriválással:   r = {r:.2f} cm, h = {V / (math.pi * r ** 2):.2f} cm, A = {felszin(r):.1f} cm²")
```

A két módszer ugyanazt adja: $r \approx 5{,}42$ cm, és – ez a szép meglepetés – $h = 2r$, vagyis az ideális doboz **ugyanolyan magas, mint amilyen széles**. A kipróbálás itt is működik, de csak egy változónál olcsó; ha egy terméknek 10 méretét kell optimalizálni, már csak a derivált (gradiens) alapú módszerek járhatók. (A valódi konzervdobozok magasabbak, mert a tető és az alj vastagabb anyagból készül, és a polcon való elhelyezés is szempont – a modell feltevései mindig számítanak.)

```plot
title: A doboz felszíne a sugár függvényében (V = 1000 cm³)
x: 1, 15
y: 0, 2000
f: 2*pi*x^2 + 2000/x # A(r)
point: 5.42, 553.6 # minimum
```

## Összefoglalás

- Numerikus derivált: a központi differencia ($h^2$-es hiba) jobb, mint az előre differencia ($h$-s hiba); túl kicsi $h$-nál a kerekítési hiba elrontja.
- Gradiens-ereszkedés: $x \leftarrow x - \eta f'(x)$; túl nagy lépésköz esetén szétszáll. Ez a gépi tanulás alapja.
- Szélsőérték-feladat: írd fel a célfüggvényt egy változóval, deriváld, és oldd meg az $f'(x) = 0$ egyenletet; az ideális henger magassága az átmérője.

## A lecke feladata

```quiz required
? Számold ki a központi differenciát $f(x) = x^2$-re az $x = 3$ pontban $h = 0{,}1$-gyel: $\dfrac{f(3{,}1) - f(2{,}9)}{0{,}2}$
= 6
! $\frac{9{,}61 - 8{,}41}{0{,}2} = 6$ – parabolánál a központi differencia pontos!

? Gradiens-ereszkedés: $f(x) = x^2$, $x_0 = 4$, lépésköz $\eta = 0{,}25$. Mennyi $x_1$?
= 2
! $f'(4) = 8$, $x_1 = 4 - 0{,}25 \cdot 8 = 2$.

? Deriváld: $A(r) = 2\pi r^2 + \dfrac{2000}{r}$
fn: x -> 4*pi*x - 2000/x^2
domain: 1, 10

? Miért nő a numerikus derivált hibája, ha $h$-t nagyon kicsire (pl. $10^{-12}$-re) választjuk?
- mert a differenciahányados ilyenkor nem értelmezett
+ mert két majdnem egyenlő szám kivonásánál a lebegőpontos kerekítés miatt elvesznek az értékes jegyek
- mert a függvény nem deriválható
- mert a központi differencia csak nagy $h$-ra működik
! A kerekítési hibát ráadásul egy nagyon kicsi számmal osztjuk.

? Egy henger alakú, zárt doboz felszíne adott térfogat mellett akkor minimális, ha a magassága a sugár hányszorosa?
= 2
! $r = \sqrt[3]{V / (2\pi)}$ esetén $h = 2r$.
```
