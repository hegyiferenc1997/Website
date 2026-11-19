---
title: Mélyebben – határidő és költség szimulációval
summary: Mekkora eséllyel tartható egy határidő (PERT és normális eloszlás), miért optimista a csak a kritikus útra épülő becslés (összefutási hatás, Monte-Carlo), az earned value mutatók hétről hétre egy projekt életében, és a legolcsóbb ütemterv-tömörítés (crashing) programmal.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki egy határidő **teljesülésének valószínűségét** a PERT-becslésekből,
- miért **becsüli alul** a csúszást, ha csak a kritikus utat nézzük,
- hogyan követi az **earned value** a projekt egészségét hétről hétre, és mit jósol a végére,
- hogyan tömöríts ütemtervet a **legkisebb többletköltséggel**.

## 1. Mekkora eséllyel tartjuk a határidőt?

A PERT-becslésből minden tevékenységre van várható érték $t_e = \frac{O + 4M + P}{6}$ és szórás $\sigma = \frac{P - O}{6}$. Egy úton a várható értékek **összeadódnak**, a szórások viszont nem: a **varianciák** ($\sigma^2$) adódnak össze. Ha az út elég hosszú, a teljes időtartam közel **normális eloszlású**:

```python run
# PERT: a kritikus út várható hossza és szórása, a határidő tartásának valószínűsége
from statistics import NormalDist
import math

ut = [(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]       # (optimista, legvalószínűbb, pesszimista) nap
te = sum((o + 4 * m + p) / 6 for o, m, p in ut)
szoras = math.sqrt(sum(((p - o) / 6) ** 2 for o, m, p in ut))
print(f"várható hossz: {te:.1f} nap, szórás: {szoras:.2f} nap")

eloszlas = NormalDist(te, szoras)
for hatarido in [17, 19, 21, 23]:
    print(f"határidő {hatarido} nap → teljesülés esélye {eloszlas.cdf(hatarido):5.1%}")
print(f"90%-os biztonsághoz szükséges határidő: {eloszlas.inv_cdf(0.9):.1f} nap")
```

Ha a határidőt a várható értékre (kb. 18,3 nap) tűznénk ki, csak **kb. 50%** eséllyel tartanánk – egy pénzfeldobás! A 90%-os biztonsághoz kb. 21 nap kell; a különbség a **puffer** (tartalékidő), amelyet a projekt végére érdemes tenni (nem elosztva a tevékenységek között, ahol a Parkinson-törvény „elhasználná”).

## 2. Az összefutási hatás: miért optimista a PERT?

A PERT csak a kritikus utat nézi. De ha két párhuzamos ág fut össze (pl. backend és frontend a tesztelés előtt), a tesztelés csak akkor kezdődhet, ha **mindkettő** kész – és két bizonytalan ág közül valamelyik gyakran késik. Szimuláljuk:

```python run
# Összefutási hatás: két párhuzamos ág, mindkettő átlagosan 20 nap; a projekt a később végzőn múlik
import random

random.seed(3)                                   # rögzített véletlen, hogy mindig ugyanaz jöjjön ki
futas, hatarido = 20_000, 21
egy_ag_idoben, mindketto_idoben, osszes = 0, 0, 0.0
for _ in range(futas):
    backend = random.triangular(15, 30, 18)      # háromszög-eloszlás: min, max, legvalószínűbb
    frontend = random.triangular(15, 30, 18)
    projekt = max(backend, frontend)             # a tesztelés mindkettőre vár
    egy_ag_idoben += backend <= hatarido
    mindketto_idoben += projekt <= hatarido
    osszes += projekt
print(f"egy ág kész {hatarido} napra: {egy_ag_idoben / futas:.1%}")
print(f"mindkét ág kész {hatarido} napra: {mindketto_idoben / futas:.1%}")
print(f"átlagos összefutási idő: {osszes / futas:.1f} nap (egy ág átlaga: {(15 + 30 + 18) / 3:.1f})")
```

Egy ág kb. 55% eséllyel készül el 21 napra, a két ág **együtt** csak kb. 31%-kal (≈ 0,55²). A tesztelés várható kezdése sem 21, hanem kb. 23 nap. Minél több párhuzamos ág fut össze, annál erősebb a hatás – ezért csúsznak a nagy projektek még akkor is, ha minden csapat „átlagosan” tartja a becslését. A Monte-Carlo-szimuláció (amelyet a komolyabb PM-szoftverek is tudnak) ezt a hatást is megmutatja, a sima PERT nem.

## 3. Earned value hétről hétre

Egy 10 hetes, 100 millió forintos projekt heti adatai (halmozottan, millió Ft-ban). A tervezett érték (PV) egyenletes, a megszerzett érték (EV) és a tényleges költség (AC) a valóság:

```python run
# Earned value hétről hétre: CPI, SPI és a várható teljes költség (EAC = BAC / CPI)
BAC = 100
PV = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
EV = [8, 17, 25, 33, 40, 48]                     # eddig ennyi hét adata van
AC = [10, 21, 31, 41, 50, 59]

print("hét |  PV |  EV |  AC |  CPI |  SPI |   EAC")
for het, (pv, ev, ac) in enumerate(zip(PV, EV, AC), 1):
    cpi, spi = ev / ac, ev / pv
    print(f"{het:>3} | {pv:>3} | {ev:>3} | {ac:>3} | {cpi:.2f} | {spi:.2f} | {BAC / cpi:5.1f}")

cpi, spi = EV[-1] / AC[-1], EV[-1] / PV[len(EV) - 1]
print(f"\nbecsült befejezés: {10 / spi:.1f} hét, várható túllépés (VAC): {BAC - BAC / cpi:.1f} M Ft")
```

A CPI kb. 0,8 körül stabilizálódott: minden elköltött forintért csak 80 fillérnyi munka készül. A kutatások szerint a CPI a projekt **15–20%-os** készültsége után már alig javul – ezért az EAC ≈ 123 millió Ft-os előrejelzés komoly figyelmeztetés: vagy több pénz kell, vagy csökkenteni kell a terjedelmet. Az SPI 0,8 körül azt mutatja, hogy a projekt kb. 12,5 hét alatt végezne a tervezett 10 helyett.

```plot
title: A várható teljes költség (EAC) a CPI függvényében
x: 0.5, 1.5
y: 0, 250
param: B = 100, 50, 150, 5
f: B/x # EAC = BAC / CPI
dash: B # BAC
```

Mozgasd a költségvetést ($B$): a $\text{CPI} = 1$ pontban az EAC éppen a BAC; balra (CPI < 1) túllépés, jobbra megtakarítás.

## 4. Crashing: a legolcsóbb gyorsítás

A határidőt 3 nappal kell rövidíteni. Minden kritikus tevékenységnél tudjuk, hány nappal rövidíthető (több ember, túlóra) és mennyi egy nap gyorsítás ára. A szabály: mindig a **legolcsóbb** napot vegyük meg a **kritikus úton**.

```python run
# Crashing: a kritikus út rövidítése napról napra, mindig a legolcsóbb lehetőséggel
# (feltesszük, hogy a rövidítés közben más út nem válik kritikussá)
kritikus = {  # tevékenység: [rövidíthető napok, egy nap ára ezer Ft-ban]
    "követelmények": [1, 300], "backend": [2, 150], "tesztelés": [2, 200], "élesítés": [0, 0],
}
rovidites, koltseg = 3, 0
for nap in range(1, rovidites + 1):
    lehetoseg = [(ar, nev) for nev, (napok, ar) in kritikus.items() if napok > 0]
    ar, nev = min(lehetoseg)                     # a legolcsóbb még rövidíthető tevékenység
    kritikus[nev][0] -= 1
    koltseg += ar
    print(f"{nap}. nap: {nev} rövidítése {ar} ezer Ft-ért")
print(f"összes többletköltség: {koltseg} ezer Ft")
```

A backend a legolcsóbb (150 ezer Ft/nap), de csak 2 nappal rövidíthető; a harmadik napot a tesztelésből vesszük meg (200 ezer Ft), így a 3 napos gyorsítás 500 ezer forintba kerül. A valóságban figyelni kell: rövidítés közben egy párhuzamos út is **kritikussá** válhat (mint a hálóterv-leckében a C tevékenység), és onnantól mindkét utat rövidíteni kell. A **fast-tracking** (párhuzamosítás) ingyenesnek tűnik, de a kockázatot növeli: ha az előző fázis eredménye változik, az átfedő munka egy részét újra kell csinálni.

## Összefoglalás

- PERT: az út várható hossza a $t_e$-k összege, a szórása $\sqrt{\sum \sigma^2}$; a határidő teljesülése a normális eloszlásból számolható. A várható értékre tűzött határidő csak kb. 50%-os.
- Párhuzamos ágak összefutásakor a projekt a később végzőn múlik, ezért a csúszás esélye nagyobb, mint amit a kritikus út mutat (Monte-Carlo).
- Az EV-mutatók hétről hétre: CPI = EV / AC, SPI = EV / PV, EAC = BAC / CPI; a CPI korán stabilizálódik.
- Crashingnél mindig a kritikus úton lévő legolcsóbb napot vesszük meg, és figyeljük az új kritikus utakat.

## A lecke feladata

```quiz required
? Egy úton két tevékenység van, szórásuk 3 és 4 nap. Mennyi az út szórása (nap)?
= 5
! $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$.

? Ha a határidő pontosan az út várható hossza, kb. mekkora eséllyel tartjuk (normális eloszlás, %)?
= 50
! A normális eloszlás szimmetrikus: a várható érték alatt és felett 50–50%.

? Két független párhuzamos ág mindegyike 80% eséllyel készül el időben. Mekkora eséllyel készül el mindkettő (%)?
= 64
! $0{,}8 \cdot 0{,}8 = 0{,}64$.

? BAC = 200 millió Ft, CPI = 0,8. Mennyi az EAC (millió Ft)?
= 250
! $200 / 0{,}8 = 250$.

? Crashingnél melyik tevékenységet érdemes először rövidíteni?
- a legdrágábbat, mert ott a legnagyobb a hatás
+ a kritikus úton lévő, egy napra vetítve legolcsóbban rövidíthetőt
- bármelyiket, ami nincs a kritikus úton
- a leghosszabbat
! Csak a kritikus út rövidítése gyorsítja a projektet, és ott a legolcsóbb napot vesszük meg.
```
