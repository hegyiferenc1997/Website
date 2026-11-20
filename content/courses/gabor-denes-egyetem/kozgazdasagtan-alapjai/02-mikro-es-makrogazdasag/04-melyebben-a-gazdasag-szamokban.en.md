---
title: Deeper – The Economy in Numbers
summary: The balance of the circular flow on a small economy's numbers, percent and percentage point, fixed-base and chain indices, nominal and real wages during the 2022–2023 inflation, and why two independent time series can show a strong correlation.
minutes: 35
---

## What you will learn in this lesson

- how the circular flow **balances**: spending, incomes, leakages and injections,
- not to mix up **percent** and **percentage point**, and how to read an **index**,
- how to compute a **real wage**, and why purchasing power can fall while pay rises,
- why a strong correlation is **not proof**.

## 1. The circular flow balances

Data for one year of a small open economy (billion Ft). We compute GDP from the expenditure side and see where the income goes:

```python run
# The circular flow in numbers: one year of a small open economy (billion Ft)
C, I, G, X, M = 600, 200, 250, 450, 400        # consumption, investment, government purchases, exports, imports
T, S = 230, 270                                # net taxes, household saving

Y = C + I + G + (X - M)                        # the expenditure side: GDP
print(f"GDP = C + I + G + (X − M) = {C} + {I} + {G} + ({X} − {M}) = {Y}")
print(f"how income is used: C + S + T = {C + S + T}")

leakages = S + T + M                           # what flows out of the circular flow
injections = I + G + X                         # what flows in
print(f"leakages (S + T + M) = {leakages}, injections (I + G + X) = {injections}")
print(f"government balance T − G = {T - G}, trade balance X − M = {X - M}")
```

Two things always hold: the value produced (1100) equals the income earned, which households consume, save or pay as taxes. And what **flows out** of the circular flow (saving, taxes, imports) equals what **flows in** (investment, government purchases, exports). This gives an important relationship: $(S - I) = (G - T) + (X - M)$ – if the government runs a deficit ($T - G < 0$), it is financed by extra private saving or by foreigners.

**Analogy:** the circular flow is like a bathtub: the water level stays constant if as much flows in from the tap as drains out.

## 2. Percent, percentage point, index

Mixing these up is a common mistake in the news:

```python run
# Percent or percentage point? And the index
rate_old, rate_new = 4.0, 6.5
print(f"the interest rate {rate_old}% → {rate_new}%: a rise of {rate_new - rate_old:.1f} percentage points,")
print(f"   but an increase of {100 * (rate_new - rate_old) / rate_old:.1f} percent")

# fixed-base index and chain index: the price of a laptop over five years (thousand Ft)
prices = {2022: 400, 2023: 440, 2024: 462, 2025: 450, 2026: 486}
years = list(prices)
for i, year in enumerate(years):
    base = 100 * prices[year] / prices[years[0]]                        # always relative to 2022
    chain = 100 * prices[year] / prices[years[i - 1]] if i else 100.0   # relative to the previous year
    print(f"{year}: {prices[year]} k Ft | fixed-base index {base:6.1f} | chain index {chain:6.1f}")

product = 1.0
for i in range(1, len(years)):
    product *= prices[years[i]] / prices[years[i - 1]]
print(f"the product of the chain indices = {100 * product:.1f} = the last fixed-base index")
```

- Raising the interest rate from 4% to 6.5% is **2.5 percentage points**, but a **62.5 percent** increase – the two mean very different things.
- The **fixed-base index** compares with a fixed year (here 2022), the **chain index** always with the previous year. The product of the chain indices gives the fixed-base index.
- Look at 2025: the chain index is 97.4 (cheaper than the year before), yet the fixed-base index is 112.5 (more expensive than in 2022). Both are true – they just answer different questions.

## 3. Nominal and real wages

In 2022–2023 the price level in Hungary rose by about a third in two years. Let's look at how a (made-up but typical) salary developed, with approximate annual inflation figures:

```python run
# Nominal and real wage: we earn more – but is it worth more?
wages = {2021: 400_000, 2022: 450_000, 2023: 520_000, 2024: 570_000, 2025: 610_000}  # gross monthly, Ft
inflation = {2022: 14.5, 2023: 17.6, 2024: 3.7, 2025: 4.4}                          # annual CPI, %

price_level = 100.0                             # 2021 = 100
for year, wage in wages.items():
    if year in inflation:
        price_level *= 1 + inflation[year] / 100   # the price level rises year by year
    real = wage / (price_level / 100)              # expressed in 2021 forints
    print(f"{year}: nominal {wage:>8,} Ft | price level {price_level:6.1f} | real wage (2021 Ft) {real:>8,.0f}")
```

By 2023 the salary had risen by 30%, yet the **real wage** **fell** by about 3.5%: the same money bought less. Only in 2024, when inflation slowed, did purchasing power start growing again. An approximate rule for small numbers: change in real wage ≈ change in nominal wage − inflation; exactly: $\frac{1 + \text{wage growth}}{1 + \text{inflation}} - 1$.

## 4. Correlation ≠ causation

We generate a thousand times two completely independent, randomly developing time series that both have a rising trend, and see how often they correlate strongly:

```python run
# Correlation ≠ causation: two INDEPENDENT time series, each a random walk
import random

def correlation(a, b):
    n = len(a)
    ma, mb = sum(a) / n, sum(b) / n
    cov = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    return cov / (sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b)) ** 0.5

r = random.Random(5)
high = 0
for trial in range(1000):
    a, b = [0.0], [0.0]
    for _ in range(50):                          # 50 "years"; each goes its own way
        a.append(a[-1] + r.gauss(0.3, 1))        # e.g. ice-cream sales (slightly rising trend)
        b.append(b[-1] + r.gauss(0.3, 1))        # e.g. number of smartphones (also a trend)
    if abs(correlation(a, b)) > 0.7:
        high += 1
print(f"out of 1000 independent pairs of series, {high} have |r| > 0.7 – yet they don't depend on each other!")
```

In more than two thirds of the cases we measure a "strong relationship" – yet the two series know nothing about each other! The reason is the common **trend**: things that grow together over time correlate. So with economic data you always have to be suspicious:

- **Hidden third factor:** ice-cream and sunglasses sales move together – both are caused by summer.
- **Reverse causation:** more police don't cause more crime – more crime is why more police are sent.
- **Coincidence:** among many data series there are always a few that move "nicely" together.

Proving causation needs an experiment (e.g. an A/B test on a website) or careful statistical methods – that's what statistics and econometrics deal with.

## Summary

- Circular flow: $Y = C + I + G + (X - M)$; leakages = injections.
- Percentage point: the difference of two percentages; percent: relative change. A fixed-base index compares with a fixed year, a chain index with the previous year.
- Real wage = nominal wage / price level; with high inflation even rising pay can mean less purchasing power.
- Correlation doesn't prove causation – a common trend, a hidden factor or the reverse direction can be behind it.

## Lesson exercise

```quiz required
? The unemployment rate rises from 5% to 6%. By how many percent did the rate rise?
= 20
! $\frac{6 - 5}{5} = 20\%$ – while the rise is only 1 percentage point.

? $C = 500$, $I = 150$, $G = 200$, $X = 300$, $M = 250$ (billion Ft). What is GDP?
= 900
! $500 + 150 + 200 + (300 - 250) = 900$.

? Your salary rises by 10%, inflation is 4%. By how many percent does your real wage rise? (to one decimal)
= 5,8
= 5.8
! $\frac{1.10}{1.04} - 1 \approx 5.8\%$ (the approximate rule would give 6%).

? Which is a normative statement?
- Unemployment rose after the minimum wage increase.
- In 2023 inflation was 17.6%.
+ The government should spend more on education.
- Raising interest rates makes loans more expensive.
! A normative statement contains a value judgement ("should"), not a verifiable fact.

? Two time series show a correlation of 0.9. What can we say for sure?
- one causes the other
- a third factor causes both
+ they move together, but by itself this tells us nothing about causation
- it's a coincidence
! It could be causation, a common cause or chance – that needs further investigation.
```
