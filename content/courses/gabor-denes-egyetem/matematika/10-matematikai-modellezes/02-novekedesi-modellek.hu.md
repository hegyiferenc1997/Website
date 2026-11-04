---
title: Növekedési modellek
summary: Exponenciális és logisztikus növekedés, duplázódási idő, eltartóképesség, az inflexiós pont, és ahol ezek a modellek megjelennek.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- az **exponenciális** növekedési modellt és a **duplázódási időt**,
- miért nem nőhet semmi a végtelenségig: a **logisztikus** modellt,
- hol a leggyorsabb a növekedés (**inflexiós pont**),
- hol használják ezeket a modelleket.

## Exponenciális növekedés

Ha a növekedés sebessége arányos a mennyiséggel, $y' = r y$, a megoldás $y(t) = y_0 e^{rt}$. A **duplázódási idő**:

$$
y_0 e^{rT_2} = 2y_0 \;\Rightarrow\; T_2 = \frac{\ln 2}{r} \approx \frac{0{,}69}{r}.
$$

(Ebből jön a pénzügyi „$70$-es szabály”: $7\%$-os éves növekedésnél kb. $70 / 7 = 10$ év alatt duplázódik a tőke.)

Példák: baktériumtenyészet korlátlan tápanyaggal, kamatos kamat, egy járvány legeleje, vagy **Moore törvénye** (a chipek tranzisztorszáma kb. két évente duplázódott).

## Logisztikus növekedés

A valóságban az erőforrások végesek. A **logisztikus modell** egy $K$ **eltartóképességet** (felső korlátot) vezet be: a növekedés lassul, ahogy $y$ közeledik $K$-hoz:

$$
y' = r\,y\left(1 - \frac{y}{K}\right), \qquad y(t) = \frac{K}{1 + \left(\frac{K}{y_0} - 1\right)e^{-rt}}.
$$

- Kis $y$-ra $1 - \frac{y}{K} \approx 1$, így eleinte majdnem exponenciális.
- $y \to K$, ha $t \to \infty$.
- A növekedés a $y = \frac{K}{2}$ pontban a leggyorsabb (itt van az **inflexiós pont**), a maximális sebesség $\frac{rK}{4}$.

```plot
title: Logisztikus és exponenciális növekedés
x: 0, 20
y: 0, 120
param: r = 0.6, 0.1, 1.5, 0.05
param: K = 100, 20, 110, 5
param: y0 = 2, 1, 20, 1
f: K/(1 + (K/y0 - 1) e^(-r x)) # logisztikus
dash: y0 e^(r x) # exponenciális
dash: K # eltartóképesség
point: ln(K/y0 - 1)/r, K/2 # inflexiós pont
value: duplázódási idő (az elején) = ln(2)/r
value: max. növekedési sebesség = r K/4
```

A két görbe az elején együtt halad, aztán a logisztikus „elfárad”. Jellegzetes **S alakú** (szigmoid) görbe. Ugyanez a függvény (a logisztikus függvény) a gépi tanulásban is alapvető: a **logisztikus regresszió** és a neurális hálók aktivációs függvénye.

Alkalmazások: populációk, egy új termék (pl. okostelefon) elterjedése, a járványok (SIR-modell), egy hír terjedése a közösségi hálón.

```python run
import math
# Logisztikus modell: Euler-módszer és a pontos megoldás összevetése
r, K, y0, h = 0.6, 100.0, 2.0, 0.1
y = y0
for lepes in range(1, 201):
    y += h * r * y * (1 - y / K)
    t = lepes * h
    if lepes % 40 == 0:
        pontos = K / (1 + (K / y0 - 1) * math.exp(-r * t))
        print(f"t = {t:>4.0f}: Euler ≈ {y:6.2f}, pontos = {pontos:6.2f}")
```

## Összefoglalás

- Exponenciális: $y = y_0e^{rt}$, duplázódási idő $\frac{\ln 2}{r}$.
- Logisztikus: $y' = ry(1 - \frac{y}{K})$, S alakú görbe, határérték $K$, inflexió $\frac{K}{2}$-nél, maximális sebesség $\frac{rK}{4}$.

## A lecke feladata

```quiz required
? Egy befektetés évente folytonosan $7\%$-kal nő ($r = 0{,}07$). Nagyjából mennyi idő alatt duplázódik?
- $7$ év
+ kb. $10$ év
- $14$ év
- $70$ év
! $T_2 = \frac{\ln 2}{0{,}07}$

? Egy baktériumtenyészet $3$ óránként duplázódik. Kezdetben $1000$ baktérium van. Hány lesz $12$ óra múlva?
= 16000

? Az $y' = 0{,}5\,y\left(1 - \frac{y}{200}\right)$ modellben mihez tart $y$, ha $y_0 > 0$?
= 200

? Ugyanebben a modellben mekkora $y$-nál a leggyorsabb a növekedés?
= 100

? Ugyanebben a modellben mekkora a legnagyobb növekedési sebesség ($y'$ maximuma)?
= 25
! $\frac{rK}{4}$

? Add meg az $y' = y\left(1 - \frac{y}{10}\right)$, $y(0) = 1$ feladat megoldását!
fn: x -> 10/(1 + 9 e^(-x))
domain: -2, 5
```
