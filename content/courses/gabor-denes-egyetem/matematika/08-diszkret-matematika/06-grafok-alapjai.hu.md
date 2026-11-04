---
title: A gráfok alapjai
summary: Csúcsok és élek, fokszám és a kézfogási tétel, nevezetes gráfok, összefüggőség és fák, Euler-út, szomszédsági mátrix és szélességi keresés.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **gráf**, és mit jelent a **fokszám**,
- a **kézfogási tételt**,
- a nevezetes gráfokat, az **összefüggőséget** és a **fákat**,
- mikor van egy gráfban **Euler-út**,
- hogyan tárolja a gép a gráfot, és hogyan keres benne **legrövidebb utat**.

## Alapfogalmak

Egy **gráf** $G = (V, E)$ **csúcsok** (pontok) $V$ halmazából és **élek** $E$ halmazából áll; minden él két csúcsot köt össze. Gráf a közösségi háló (emberek, ismeretségek), az úthálózat (kereszteződések, utak), az internet (routerek, kapcsolatok) vagy egy program függőségei.

- **Egyszerű gráf:** nincs hurokél és többszörös él. **Irányított gráf:** az éleknek iránya van (pl. weboldalak linkjei).
- Egy csúcs **fokszáma**, $\deg(v)$, a belőle induló élek száma.

**Kézfogási tétel:** a fokszámok összege az élek számának kétszerese,

$$
\sum_{v \in V} \deg(v) = 2\lvert E \rvert,
$$

mert minden él két csúcs fokszámához ad $1$-et. Következmény: a **páratlan fokú csúcsok száma páros**. Ezért például nincs olyan gráf, amelyben $3$ csúcs mindegyike $3$-adfokú lenne.

## Nevezetes gráfok

- **Teljes gráf**, $K_n$: bármely két csúcs szomszédos, $\binom{n}{2} = \frac{n(n - 1)}{2}$ éle van.
- **Út** ($P_n$), **kör** ($C_n$), **páros gráf** (a csúcsok két osztályba sorolhatók, él csak osztályok között megy).
- Egy gráf **összefüggő**, ha bármely két csúcsa között van út.
- **Fa:** összefüggő, körmentes gráf. Egy $n$ csúcsú fának mindig **$n - 1$** éle van; ez a legkevesebb, amellyel $n$ csúcs összefüggővé tehető. (A fájlrendszer könyvtárszerkezete is fa.)

```plot
title: Élszám: teljes gráf és fa n csúcson
x: 0, 16
y: 0, 120
seq: n (n - 1)/2 @ 1, 15 # teljes gráf Kₙ
seq: n - 1 @ 1, 15 # fa
```

A különbség óriási: egy $15$ csúcsú teljes gráfnak $105$, egy fának csak $14$ éle van. Hálózattervezésnél ezért keresünk **minimális feszítőfát**: a legolcsóbb élhalmazt, amely még mindent összeköt.

## Euler-út

Az **Euler-út** minden élen pontosan egyszer halad át (a königsbergi hidak problémája). Egy összefüggő gráfban

- **zárt** Euler-út (Euler-kör) van, ha **minden** csúcs foka páros,
- **nyílt** Euler-út van, ha **pontosan két** csúcs foka páratlan (az út ezekben kezdődik és végződik).

Ezért „rajzolható meg egy vonallal” a házikó (a ház alakú ábra): pontosan két páratlan fokú csúcsa van. A **Hamilton-út** ezzel szemben minden **csúcson** megy át egyszer; erre nincs ilyen egyszerű feltétel, ez egy nehéz probléma.

## Gráfok a gépben

A **szomszédsági mátrix** $A$-jában $a_{ij} = 1$, ha $i$ és $j$ szomszédos, különben $0$. Irányítatlan gráfnál a mátrix szimmetrikus, és az $1$-esek száma $2\lvert E \rvert$. Ritka gráfoknál (kevés él) a **szomszédsági lista** takarékosabb.

|       | A   | B   | C   | D   |
| ----- | --- | --- | --- | --- |
| **A** | 0   | 1   | 1   | 0   |
| **B** | 1   | 0   | 1   | 1   |
| **C** | 1   | 1   | 0   | 0   |
| **D** | 0   | 1   | 0   | 0   |

A **szélességi keresés** (BFS) egy kezdőcsúcsból rétegenként halad, és súlyozatlan gráfban megadja a legrövidebb utakat.

```python run
from collections import deque
# Szomszédsági lista és szélességi keresés (BFS): távolságok az A csúcstól
graf = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B"],
    "D": ["B", "E"],
    "E": ["D"],
}
tav = {"A": 0}
sor = deque(["A"])
while sor:
    v = sor.popleft()
    for w in graf[v]:
        if w not in tav:
            tav[w] = tav[v] + 1
            sor.append(w)
print("távolságok:", tav)
print("fokszámok összege:", sum(len(s) for s in graf.values()), "= 2 · élszám")
```

## Összefoglalás

- Kézfogási tétel: $\sum \deg(v) = 2\lvert E \rvert$; a páratlan fokú csúcsok száma páros.
- $K_n$-nek $\frac{n(n-1)}{2}$, egy $n$ csúcsú fának $n - 1$ éle van.
- Euler-kör: minden fok páros; nyílt Euler-út: pontosan két páratlan fok.
- Tárolás: szomszédsági mátrix vagy lista; legrövidebb út (súlyozatlan): BFS.

## A lecke feladata

```quiz required
? Hány éle van a $K_6$ teljes gráfnak?
= 15

? Egy gráf csúcsainak fokszámai: $3, 3, 2, 2, 2$. Hány éle van?
= 6

? Létezik-e egyszerű gráf a $3, 3, 3, 2$ fokszámokkal?
- igen, és összefüggő
- igen, de nem összefüggő
+ nem, mert a páratlan fokú csúcsok száma páratlan
- nem, mert egy csúcs foka sem lehet $3$
! A fokszámok összege $11$, ami páratlan.

? Hány éle van egy $12$ csúcsú fának?
= 11

? Melyik összefüggő gráfban van **nyílt** Euler-út (de zárt nincs)?
- minden csúcs foka páros
+ pontosan két csúcs foka páratlan
- pontosan egy csúcs foka páratlan
- pontosan négy csúcs foka páratlan

? Egy irányítatlan, egyszerű gráfnak $7$ éle van. Hány $1$-es van a szomszédsági mátrixában?
= 14
```
