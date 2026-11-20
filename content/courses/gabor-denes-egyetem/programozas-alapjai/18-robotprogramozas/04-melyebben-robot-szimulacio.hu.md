---
title: Mélyebben – robotvezérlés szimulációval
summary: Egy kétkerekű robot pályája a kerékségességekből, a PD-szabályozó és a túllendülés (interaktív ábrával), két szenzor egyesítése komplementer szűrővel, és az A* útkereső, amely okosabban keres, mint a szélességi bejárás – futtatható szimulációkkal és programozós kötelező feladattal.
minutes: 55
---

## Amit ebben a leckében megtanulsz

- hogyan számolható ki egy kétkerekű robot **pályája** a kerekek sebességéből,
- miért lendül túl a P-szabályozó, és hogyan **csillapít** a D tag,
- hogyan lesz két rossz szenzorból egy jó (**szenzorfúzió**),
- miért gyorsabb az **A\*** útkereső a sima szélességi bejárásnál.

## 1. Kétkerekű robot pályája

Az alapleckében egy rácson mozgó robotot szimuláltunk. A valódi kétkerekű robot (robotporszívó, oktatórobot) a két kerék **sebességkülönbségével** kanyarodik: ha egyformán forognak, egyenesen megy; ha a jobb gyorsabb, balra fordul. Kis időlépésenként frissítjük a helyzetét $(x, y)$ és az irányát $\theta$:

```python run
# Kétkerekű robot pályájának szimulációja kis időlépésekkel
import math

TENGELYTAV = 0.2                     # a két kerék távolsága (m)

def lepes(x, y, theta, v_bal, v_jobb, dt):
    v = (v_bal + v_jobb) / 2                     # a középpont sebessége
    omega = (v_jobb - v_bal) / TENGELYTAV        # forgási sebesség (rad/s)
    return x + v * math.cos(theta) * dt, y + v * math.sin(theta) * dt, theta + omega * dt

def szimulal(parancsok, dt=0.01):
    x = y = theta = 0.0
    for v_bal, v_jobb, ido in parancsok:
        for _ in range(round(ido / dt)):
            x, y, theta = lepes(x, y, theta, v_bal, v_jobb, dt)
    return x, y, math.degrees(theta) % 360

utvonalak = {
    "egyenesen 2 s":            [(0.5, 0.5, 2)],
    "helyben fordulás":         [(-0.157, 0.157, 1)],
    "ív balra":                 [(0.4, 0.6, 2)],
    "egyenes + fordul + egyenes": [(0.5, 0.5, 2), (-0.157, 0.157, 1), (0.5, 0.5, 2)],
}
for nev, parancsok in utvonalak.items():
    x, y, irany = szimulal(parancsok)
    print(f"{nev:<28} → x = {x:5.2f} m, y = {y:5.2f} m, irány = {irany:5.1f}°")
```

A helyben forduló robot egy másodperc alatt kb. 90°-ot fordul ($0{,}314 / 0{,}2 \approx 1{,}57$ rad/s), az utolsó útvonal pedig egy „L” alakot ír le. A valóságban a kerekek csúsznak, és a kis hibák **összeadódnak** – ezért a robotok a saját számításuk mellett külső jelekre (falak, jelzőpontok, kamera) is támaszkodnak.

## 2. PD-szabályozó: a túllendülés megfékezése

A **P** (arányos) szabályozó a hibával arányosan avatkozik be. Ha a robotnak „tehetetlensége” van (lendülete), a P-szabályozó **túllendül**: mire eléri a célt, már túl gyors, és átfut rajta. A **D** (deriváló) tag a hiba **változására** reagál: ha a hiba gyorsan csökken, fékez:

```plot
title: A céltól mért távolság egy egyszerű P-szabályozásnál (lépésenként)
x: 0, 30
y: -1, 1
param: k = 0.3, 0.05, 1.9, 0.05
f: (1 - k)^x # a hiba minden lépésben (1 − k)-szorosára változik
```

A csúszkával látszik: kis $k$-nál lassan közelít, $k > 1$ fölött már előjelet vált (túllendül és visszalendül), $k$ = 2 közelében pedig alig csillapodik. Egy lendülettel rendelkező robotnál ez még élesebb:

```python run
# P és PD szabályozó egy lendülettel rendelkező roboton: túllendülés és beállás
def szimulal(kp, kd, lepesek=60, dt=0.1):
    pozicio, sebesseg, cel = 0.0, 0.0, 1.0
    elozo_hiba = cel - pozicio
    maximum = 0.0
    for _ in range(lepesek):
        hiba = cel - pozicio
        gyorsitas = kp * hiba + kd * (hiba - elozo_hiba) / dt   # P tag + D tag
        elozo_hiba = hiba
        sebesseg += gyorsitas * dt
        pozicio += sebesseg * dt
        maximum = max(maximum, pozicio)
    return maximum, pozicio

for nev, kp, kd in [("csak P (kp=4)", 4, 0), ("PD (kp=4, kd=2)", 4, 2), ("PD (kp=4, kd=4)", 4, 4)]:
    maximum, vegso = szimulal(kp, kd)
    print(f"{nev:<17} túllendülés: {max(0, maximum - 1) * 100:5.1f}%, helyzet 6 s után: {vegso:.3f} m")
```

A csak P-s szabályozó jóval túlfut az 1 méteres célon, és 6 másodperc múlva is ide-oda leng. A D tag hozzáadásával a túllendülés eltűnik, és a robot szépen beáll. A valódi ipari szabályozók **PID**-ek: a harmadik, I (integráló) tag a tartósan megmaradó kis hibát tünteti el (pl. ha egy lejtő folyamatosan visszahúzza a robotot).

## 3. Szenzorfúzió: komplementer szűrő

Egy robot dőlésszögét két szenzorral mérhetjük: a **giroszkóp** pontos rövid távon, de lassan elcsúszik (drift); a **gyorsulásmérő** hosszú távon pontos, de zajos. A **komplementer szűrő** a kettő erősségét egyesíti: a giroszkópra bízza a gyors változásokat, a gyorsulásmérőre a hosszú távú értéket:

```python run
# Komplementer szűrő: elcsúszó giroszkóp + zajos gyorsulásmérő = jó becslés
import random

random.seed(3)
valodi = 10.0                                   # a valódi dőlésszög: állandó 10°
dt, alfa = 0.01, 0.98                           # 98% giroszkóp, 2% gyorsulásmérő
giro_szog = becsles = valodi

hibak = {"csak giroszkóp": 0, "csak gyorsulásmérő": 0, "komplementer szűrő": 0}
for _ in range(1000):                           # 10 másodperc
    giro_sebesseg = 0.0 + 0.5                   # a giroszkóp 0,5 °/s-os eltolással mér (drift)
    gyorsulas_szog = valodi + random.gauss(0, 3)  # a gyorsulásmérő ±3° zajjal mér
    giro_szog += giro_sebesseg * dt
    becsles = alfa * (becsles + giro_sebesseg * dt) + (1 - alfa) * gyorsulas_szog
    hibak["csak giroszkóp"] = abs(giro_szog - valodi)
    hibak["csak gyorsulásmérő"] = abs(gyorsulas_szog - valodi)
    hibak["komplementer szűrő"] = abs(becsles - valodi)

for nev, hiba in hibak.items():
    print(f"{nev:<20} hiba 10 s után: {hiba:5.2f}°")
```

A giroszkóp 10 másodperc alatt 5 fokot csúszott el, a gyorsulásmérő egy-egy mérése akár több fokot is téved, a szűrő viszont végig közel marad a valódi értékhez. Ugyanezt az elvet (fejlettebb formában: Kálmán-szűrő) használják a telefonok, a drónok és az önvezető autók.

## 4. Okosabb útkeresés: A\*

Az alapleckében láttuk a szélességi bejárást, amely **minden irányba egyformán** terjeszkedik. Az **A\*** algoritmus egy **becslést** (heurisztikát) is használ arra, milyen messze van még a cél – rácson a Manhattan-távolságot –, és először a cél felé eső mezőket vizsgálja meg:

```python run
# Szélességi bejárás és A* összehasonlítása: hány mezőt vizsgálnak meg?
import heapq
from collections import deque

terkep = [
    "............",
    "............",
    "....#####...",
    "S...#.......",
    "....#.......",
    "....#......C",
    "............",
]
R, O = len(terkep), len(terkep[0])
start = next((r, c) for r in range(R) for c in range(O) if terkep[r][c] == "S")
cel = next((r, c) for r in range(R) for c in range(O) if terkep[r][c] == "C")

def szomszedok(r, c):
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        if 0 <= r + dr < R and 0 <= c + dc < O and terkep[r + dr][c + dc] != "#":
            yield r + dr, c + dc

def szelessegi():
    sor, tav, vizsgalt = deque([start]), {start: 0}, 0
    while sor:
        mezo = sor.popleft(); vizsgalt += 1
        if mezo == cel:
            return tav[mezo], vizsgalt
        for sz in szomszedok(*mezo):
            if sz not in tav:
                tav[sz] = tav[mezo] + 1; sor.append(sz)

def a_csillag():
    becsles = lambda m: abs(m[0] - cel[0]) + abs(m[1] - cel[1])   # Manhattan-távolság
    nyitott, tav, kesz = [(becsles(start), becsles(start), start)], {start: 0}, set()
    while nyitott:
        _, _, mezo = heapq.heappop(nyitott)                       # a legígéretesebb mező
        if mezo in kesz:
            continue
        kesz.add(mezo)
        if mezo == cel:
            return tav[mezo], len(kesz)
        for sz in szomszedok(*mezo):
            if sz not in tav or tav[mezo] + 1 < tav[sz]:
                tav[sz] = tav[mezo] + 1
                # rendezés: (megtett + becsült út, becsült út) – egyenlőségnél a célhoz közelebbi nyer
                heapq.heappush(nyitott, (tav[sz] + becsles(sz), becsles(sz), sz))

print("szélességi bejárás: út hossza %d, vizsgált mezők %d" % szelessegi())
print("A*:                 út hossza %d, vizsgált mezők %d" % a_csillag())
```

Mindkettő ugyanolyan hosszú (legrövidebb) utat talál, de az A\* a mezőknek csak kb. a harmadát vizsgálja meg. Egy nagy térképen (egy város úthálózata, egy játék pályája) ez a különbség óriási. Az A\* akkor garantáltan a legrövidebb utat adja, ha a becslés soha nem **túlbecsül** – a Manhattan-távolság egy falakkal teli rácson ilyen.

| Nézőpont         | Mire figyel a robotprogramozásnál?                                               |
| ---------------- | -------------------------------------------------------------------------------- |
| **programozó**   | kis időlépéses szimuláció, hangolható paraméterek (kp, kd, alfa)                 |
| **gépészmérnök** | a fizika: tömeg, lendület, súrlódás, a motor és a szenzor korlátai               |
| **biztonság**    | vészleállítás, korlátozott sebesség emberek közelében, hibás szenzor felismerése |
| **felhasználó**  | a robot kiszámíthatóan, simán mozogjon, és ne akadjon el                         |

## Összefoglalás

- A kétkerekű robot a kerékségességek különbségével kanyarodik; a pályát kis időlépésekkel számoljuk.
- A P-szabályozó lendülettel rendelkező rendszernél túllendül; a D tag csillapít, az I tag a maradó hibát tünteti el.
- A komplementer szűrő a giroszkóp rövid távú és a gyorsulásmérő hosszú távú pontosságát egyesíti.
- Az A\* becsléssel a cél felé keres, így kevesebb mezőt vizsgál meg a szélességi bejárásnál.

## A lecke feladata: PD-beavatkozás

Írd meg a `pd_jelek(hibak, kp, kd)` függvényt, amely a mért hibák listájából kiszámolja a PD-szabályozó beavatkozó jeleit (listaként)! Minden lépésben a jel: `kp * hiba + kd * (hiba − előző hiba)`. Az első lépésben még nincs előző hiba, ezért ott a D tag 0 legyen. A jeleket 2 tizedesre kerekítsd.

```python starter required
def pd_jelek(hibak, kp, kd):
    return [round(kp * h, 2) for h in hibak]


print(pd_jelek([1.0, 0.6, 0.3, 0.1], 2, 1))
```

<details>
<summary>Megoldás</summary>

```python solution
def pd_jelek(hibak, kp, kd):
    jelek = []
    elozo = None
    for h in hibak:
        d = 0 if elozo is None else h - elozo
        jelek.append(round(kp * h + kd * d, 2))
        elozo = h
    return jelek


print(pd_jelek([1.0, 0.6, 0.3, 0.1], 2, 1))
```

</details>

```python test
assert pd_jelek([1.0, 0.6, 0.3, 0.1], 2, 1) == [2.0, 0.8, 0.3, 0.0], "a D tag fékez, ahogy a hiba csökken"
assert pd_jelek([1.0, 0.6, 0.3, 0.1], 2, 0) == [2.0, 1.2, 0.6, 0.2], "kd = 0 esetén sima P-szabályozó"
assert pd_jelek([0.5], 3, 10) == [1.5], "az első lépésben nincs D tag"
assert pd_jelek([], 1, 1) == [], "üres listára üres lista"
```
