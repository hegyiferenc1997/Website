---
title: Mélyebben – differenciálegyenletek szimulációval
summary: Az Euler-, a Heun- és a Runge–Kutta-módszer pontosságának összehasonlítása, az ejtőernyős határsebessége szimulációval és képlettel, és a SIR-járványmodell mint differenciálegyenlet-rendszer – a csúcs, a nyájimmunitás és a modell szemlélete.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért nem az Euler-módszert használják a valódi szimulációs programok, és mit használnak helyette,
- hogyan kapunk egy differenciálegyenletből **egyensúlyi értéket** (határsebességet) megoldás nélkül is,
- hogyan modellez egy **egyenletrendszer** egy járványt, és mit lehet belőle megtudni.

## 1. Euler, Heun, Runge–Kutta: ki a pontosabb?

Az Euler-módszer az érintő mentén lép – de az érintő meredeksége csak a lépés **elején** igaz. A jobb módszerek több helyen is „belekóstolnak” a meredekségbe:

- **Heun** (javított Euler): kiszámolja a meredekséget az elején és a becsült végponton, és a kettő **átlagával** lép.
- **Runge–Kutta (RK4)**: négy meredekséget számol (elején, kétszer a közepén, a végén), és ezek súlyozott átlagával lép – olyan, mint egy kis Simpson-szabály.

```python run
# Euler, Heun és Runge–Kutta (RK4) összehasonlítása: y' = y, y(0) = 1, y(1) = e a pontos érték
import math

def f(t, y):
    return y

def euler(h):
    y = 1.0
    for i in range(round(1 / h)):
        y += h * f(i * h, y)                              # egy lépés az érintő mentén
    return y

def heun(h):
    y = 1.0
    for i in range(round(1 / h)):
        t = i * h
        k1 = f(t, y)
        k2 = f(t + h, y + h * k1)                         # meredekség a becsült végpontban
        y += h * (k1 + k2) / 2                            # a két meredekség átlagával lépünk
    return y

def rk4(h):
    y = 1.0
    for i in range(round(1 / h)):
        t = i * h
        k1 = f(t, y)
        k2 = f(t + h / 2, y + h / 2 * k1)
        k3 = f(t + h / 2, y + h / 2 * k2)
        k4 = f(t + h, y + h * k3)
        y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6          # négy meredekség súlyozott átlaga
    return y

print(f"{'h':>6} | {'Euler hibája':>12} | {'Heun hibája':>11} | {'RK4 hibája':>10}")
for h in [0.1, 0.01, 0.001]:
    print(f"{h:>6} | {abs(euler(h) - math.e):>12.1e} | {abs(heun(h) - math.e):>11.1e} | {abs(rk4(h) - math.e):>10.1e}")
```

Ha a lépésközt **tizedére** csökkentjük, az Euler hibája $10$-ed, a Heuné $100$-ad, az RK4-é $10\,000$-ed részére csökken: a hibájuk rendre $h$, $h^2$ és $h^4$ nagyságrendű. Az RK4 lépésenként négyszer annyi munka, de $h = 0{,}1$-gyel is pontosabb, mint az Euler $h = 0{,}001$-gyel (azaz százszor annyi lépéssel). A mérnöki programok (MATLAB `ode45`, Python `scipy.integrate.solve_ivp`) ezért ilyen magasabb rendű, ráadásul a lépésközt is automatikusan állító módszereket használnak.

## 2. Az ejtőernyős határsebessége

Zuhanáskor a gravitáció gyorsít, a légellenállás – amely nagy sebességnél a sebesség **négyzetével** arányos – fékez: $v' = g - c v^2$. Szimuláljuk Euler-módszerrel:

```python run
# Ejtőernyős zuhanás légellenállással: v' = g − c·v², a sebesség a határsebességhez tart
import math

g, c = 9.81, 0.0039                     # c = légellenállási tényező / tömeg (1/m), testtartással zuhanva
v, t, h = 0.0, 0.0, 0.01
for cel in [1, 5, 10, 20, 30]:
    while t < cel - 1e-9:
        v += h * (g - c * v * v)        # Euler-lépés
        t += h
    print(f"t = {cel:>2} s: v = {v:5.1f} m/s = {v * 3.6:5.0f} km/h")
print(f"határsebesség (v' = 0): √(g/c) = {math.sqrt(g / c):.1f} m/s")
```

A sebesség nem nő a végtelenségig, hanem **határsebességhez** tart. Ezt megoldás nélkül is megkaphatjuk: amikor a sebesség már nem változik, $v' = 0$, tehát $g = c v^2$, azaz $v_\infty = \sqrt{g/c}$. Ez az **egyensúlyi** (stacionárius) megoldás – gyakran ez a legfontosabb információ egy modellből (pl. egy hűlő tárgy végső hőmérséklete, egy feltöltődő kondenzátor végső feszültsége).

Ennek az egyenletnek egyébként van képlete is: $v(t) = v_\infty \tanh\left(\frac{g t}{v_\infty}\right)$. A csúszkával a légellenállást (testtartást) változtathatod:

```plot
title: Zuhanási sebesség (m/s) az idő (s) függvényében
x: 0, 30
y: 0, 80
param: c = 0.0039, 0.001, 0.01, 0.0001
f: sqrt(9.81/c)*tanh(sqrt(9.81*c)*x) # v(t)
dash: sqrt(9.81/c) # határsebesség
```

## 3. A SIR-járványmodell

A népességet három csoportra osztjuk: **fogékonyak** ($S$), **fertőzöttek** ($I$) és **gyógyultak** ($R$), arányokban ($S + I + R = 1$). A változásukat három összekapcsolt egyenlet írja le:

$$
S' = -\beta S I, \qquad I' = \beta S I - \gamma I, \qquad R' = \gamma I.
$$

A $\beta S I$ tag a találkozásokból eredő új fertőzések száma (annál több, minél több a fogékony **és** a fertőzött), a $\gamma I$ a gyógyulóké. Ilyen rendszerre általában nincs képlet, de az Euler-módszer ugyanúgy működik, csak három változóval egyszerre:

```python run
# SIR-járványmodell: S' = −β·S·I, I' = β·S·I − γ·I, R' = γ·I (arányok, napokban)
beta, gamma = 0.3, 0.1                  # fertőzési és gyógyulási ráta; R₀ = β/γ = 3
S, I, R, h = 0.999, 0.001, 0.0, 0.1
csucs_I, csucs_nap = 0.0, 0
for lepes in range(1, 1201):            # 120 nap 0,1 napos lépésekkel
    uj_fertozott = beta * S * I
    gyogyult = gamma * I
    S, I, R = S - h * uj_fertozott, I + h * (uj_fertozott - gyogyult), R + h * gyogyult
    if I > csucs_I:
        csucs_I, csucs_nap = I, lepes * h
    if lepes % 200 == 0:
        print(f"{lepes * h:>5.0f}. nap: fogékony {S:.3f}, fertőzött {I:.3f}, gyógyult {R:.3f}")
print(f"csúcs: a {csucs_nap:.0f}. napon a népesség {csucs_I:.1%}-a fertőzött egyszerre")
```

Mit tanulhatunk belőle?

- A járvány akkor terjed, ha $I' > 0$, azaz $\beta S > \gamma$. Az elején $S \approx 1$, tehát a feltétel $R_0 = \frac{\beta}{\gamma} > 1$ – ez a híres **alapszaporodási szám**.
- A **csúcs** ott van, ahol $I' = 0$, vagyis $S = \frac{1}{R_0} = \frac13$. Ez a **nyájimmunitási küszöb**: ha a népesség $1 - \frac{1}{R_0} \approx 67\%$-a már védett, a járvány magától lecseng.
- A járvány a csúcs után is folytatódik („túllövés”), és a végén a népesség kb. $6\%$-a sosem fertőződik meg.

Ugyanez a szerkezet ír le sok más folyamatot is: egy pletyka vagy egy számítógépes vírus terjedését egy hálózaton, vagy egy új termék elterjedését. A modell egyszerűsít (mindenki egyformán találkozik mindenkivel, nincs oltás, nincs újrafertőződés) – a valódi járványmodellek ezt finomítják, de a lényeget már ez is megmutatja.

## Összefoglalás

- Euler: hiba $\sim h$; Heun: $\sim h^2$; RK4: $\sim h^4$ – a magasabb rendű módszer kevesebb lépéssel pontosabb.
- Egyensúlyi megoldás: $y' = 0$-ból, a differenciálegyenlet megoldása nélkül (határsebesség: $\sqrt{g/c}$).
- SIR-modell: $R_0 = \beta/\gamma$; a csúcs $S = 1/R_0$-nál van; nyájimmunitás: $1 - 1/R_0$.

## A lecke feladata

```quiz required
? Euler-módszer: $y' = y$, $y(0) = 1$, $h = 0{,}5$. Mennyi $y_1$?
= 1,5
= 1.5
! $y_1 = y_0 + h \cdot y_0 = 1 + 0{,}5 \cdot 1 = 1{,}5$.

? Az RK4 hibája $h^4$-nel arányos. Hányszor kisebb lesz a hiba, ha a lépésközt felezzük?
= 16
! $2^4 = 16$.

? Mekkora a határsebesség (m/s), ha $v' = 10 - 0{,}004\,v^2$?
= 50
! $v' = 0$: $v = \sqrt{10 / 0{,}004} = \sqrt{2500} = 50$.

? A SIR-modellben $\beta = 0{,}4$ és $\gamma = 0{,}2$. Mennyi az $R_0$ alapszaporodási szám?
= 2
! $R_0 = \frac{\beta}{\gamma} = \frac{0{,}4}{0{,}2} = 2$.

? Add meg az $y' = 2y$, $y(0) = 3$ kezdetiérték-probléma megoldását!
fn: x -> 3*e^(2*x)
domain: 0, 1
! Szétválasztható: $y = C e^{2x}$, és $y(0) = C = 3$.
```
