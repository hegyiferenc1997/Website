---
title: Deeper – Modelling Growth
summary: A simulation of the Solow model (why growth from capital accumulation stops), the time needed to catch up with different growth gaps, checking the rule of 70, and measuring inequality with the Lorenz curve and the Gini coefficient on a slider chart.
minutes: 40
---

## What you will learn in this lesson

- why it's impossible to grow permanently **through investment alone** (the Solow model),
- how long it takes a country to catch up, and why every **tenth of a percent** matters,
- how to compute a **Gini coefficient** from income data.

## 1. The Solow model by simulation

In an economy output per person depends on capital, with diminishing returns: $y = k^{0.3}$. Every year a share $s$ of output is invested, and $\delta = 5\%$ of capital wears out:

```python run
# The Solow model: change in capital per person (k): k' = s·k^0.3 − δ·k (saving − depreciation)
def simulate(s, delta=0.05, k=1.0, years=200):
    path = {}
    for year in range(years + 1):
        if year in (0, 10, 25, 50, 100, 200):
            path[year] = (k, k ** 0.3)            # (capital per person, output per person)
        k = k + s * k ** 0.3 - delta * k          # new investment minus wear
    return path

for s in [0.20, 0.30]:
    print(f"saving rate {s:.0%}: (steady state: k* = {(s / 0.05) ** (1 / 0.7):.1f})")
    for year, (k, y) in simulate(s).items():
        print(f"   year {year:>3}: capital per person {k:6.2f}, output per person {y:5.2f}")
```

Capital and output grow quickly at first, then more and more slowly, and finally stop in a **steady state**, where investment just replaces wear ($s \cdot k^{0.3} = \delta k$). A higher saving rate (30%) gives a **higher level**, but growth stops there too.

The great lesson of the Solow model: the source of lasting growth per person is **not capital accumulation**, but **technological progress** (total factor productivity), which shifts the whole production function up. This also gives the idea of **catching up**: in countries with little capital (at the start of the road) the return on capital is high, so they can grow faster – if institutions and human capital allow it.

## 2. Catching up and the rule of 70

A country is at 78% of the EU average per person (at purchasing power). How long does it take to catch up?

```python run
# Catching up: if a country is at 78% of the EU average (per person, at purchasing power), when does it catch up?
import math

start = 0.78
for own, eu in [(3.5, 1.5), (2.5, 1.5), (2.0, 1.5)]:
    years = math.log(1 / start) / math.log((1 + own / 100) / (1 + eu / 100))
    print(f"own growth {own}%, EU {eu}% → catching up in about {years:.0f} years")

# Rule of 70: doubling time ≈ 70 / growth rate
for g in [1, 2, 3.5, 7]:
    print(f"{g}% growth: GDP doubles in about {70 / g:.0f} years (exactly {math.log(2) / math.log(1 + g / 100):.1f})")
```

With a 2 percentage point growth advantage it takes about 13 years, with 1 point 25 years, with half a point half a century! Because of compound growth, small differences become huge in the long run. The rule of 70 ($\frac{70}{g}$) is very accurate for small growth rates; at 7% (as China was for decades) GDP doubles in a decade.

## 3. Measuring inequality

The **Lorenz curve** shows what share of income the poorest share $x$ of the population receives. With perfect equality it's the diagonal; the more the curve "sags", the more unequal the distribution. The **Gini coefficient** is twice the area between the diagonal and the curve (0 = complete equality, 1 = one person gets everything):

```python run
# Lorenz curve and Gini coefficient from income quintiles (what % of total income each fifth receives)
countries = {
    "more equal country":  [9, 14, 18, 23, 36],
    "average country":     [7, 12, 17, 23, 41],
    "unequal country":     [3, 7, 12, 20, 58],
}
for name, fifths in countries.items():
    cumulative, area = 0.0, 0.0
    for share in fifths:
        new = cumulative + share / 100
        area += (cumulative + new) / 2 * 0.2      # area under the Lorenz curve with trapezoids
        cumulative = new
    gini = 1 - 2 * area                           # Gini = (area under equality line − under Lorenz) / 0.5
    print(f"{name:<19}: top fifth / bottom fifth = {fifths[4] / fifths[0]:4.1f}×, Gini ≈ {gini:.2f}")
```

European countries' Gini coefficients are typically 0.25–0.35, the United States' around 0.4, and some Latin American and African countries' 0.5–0.6. (Computing from fifths slightly underestimates the true value, because we don't see the differences within the fifths.)

```plot
title: Lorenz curve – move the slider to increase inequality
x: 0, 1
y: 0, 1
param: p = 2, 1, 6, 0.1
f: x^p # Lorenz curve
dash: x # complete equality
value: Gini = (p - 1)/(p + 1)
```

**Several viewpoints:** economists debate how much inequality is "good". Some difference motivates (it's worth studying, starting a business), but too much reduces social mobility and trust, and causes political tension. So development means not only GDP growth, but also how it's distributed.

## Summary

- Solow model: because of diminishing returns to capital accumulation, growth stops; lasting growth comes from technological progress.
- Time to catch up: $\frac{\ln(1 / \text{ratio})}{\ln\left(\frac{1 + g_{\text{own}}}{1 + g_{\text{EU}}}\right)}$; small differences matter.
- Rule of 70: doubling time ≈ $70 / g$.
- Gini: an indicator between 0 and 1, twice the area between the Lorenz curve and the diagonal.

## Lesson exercise

```quiz required
? According to the rule of 70, in roughly how many years does GDP double with 2% annual growth?
= 35
! $70 / 2 = 35$.

? What does the Solow model predict for a permanent increase in the saving rate?
- a permanently higher growth rate
+ a higher steady-state output level, but not faster growth in the long run
- lower output
- no effect
! Because of diminishing returns, growth stops at the new level.

? What is the Gini coefficient if everyone receives exactly the same income?
= 0
! The Lorenz curve coincides with the diagonal.

? In a country the top fifth receives 40% of income, the bottom fifth 8%. How many times the bottom fifth's income is the top fifth's?
= 5
! $40 / 8 = 5$.

? In a Solow model $y = k^{0.5}$, $s = 0.2$, $\delta = 0.05$. What is the steady-state capital per person? ($k^* = (s / \delta)^{1/(1 - 0.5)}$)
= 16
! $(0.2 / 0.05)^2 = 4^2 = 16$.
```
