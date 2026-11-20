---
title: Deeper – Computing Macroeconomic Data
summary: Nominal and real GDP and the deflator in a mini economy, computing inflation from a basket and "personal inflation", labour market rates and the distorting effect of discouraged workers, and inflation as a hidden tax with a slider chart.
minutes: 35
---

## What you will learn in this lesson

- how statistics separates the **price effect** and the **volume effect** within GDP growth,
- how an inflation figure is made from a **basket**, and why everyone feels it differently,
- why there can be **bad news** behind an improving unemployment rate,
- how much inflation **eats** of savings.

## 1. What is the real growth?

A mini economy produces laptops and coffee. Nominal GDP uses current prices, real GDP the prices of the **base year** (2024):

```python run
# Nominal and real GDP: a mini economy producing two goods (laptops, coffee)
data = {   # year: {product: (price Ft, quantity units)}
    2024: {"laptop": (300_000, 1000), "coffee": (800, 500_000)},
    2025: {"laptop": (330_000, 1050), "coffee": (900, 520_000)},
}
base = 2024
for year, products in data.items():
    nominal = sum(p * q for p, q in products.values())                         # at current prices
    real = sum(data[base][t][0] * q for t, (p, q) in products.items())         # at base-year prices
    deflator = 100 * nominal / real
    print(f"{year}: nominal GDP {nominal / 1e6:6.0f} M Ft | real GDP {real / 1e6:6.0f} M Ft | deflator {deflator:6.1f}")

n24 = sum(p * q for p, q in data[2024].values())
n25 = sum(p * q for p, q in data[2025].values())
r25 = sum(data[2024][t][0] * q for t, (p, q) in data[2025].items())
print(f"nominal growth {100 * (n25 / n24 - 1):.1f}%, of which real growth {100 * (r25 / n24 - 1):.1f}%")
```

Nominal GDP grew by 16.4%, but most of this is just **price increases**: the quantity actually produced (real GDP) grew by only 4.4%. The **GDP deflator** (111.4) shows the average change in the price level of total production. In the news "GDP growth" always means real growth – if someone shows a nominal figure, it's often (deliberately or accidentally) misleading.

## 2. The basket and "personal inflation"

The consumer price index follows the basket of an **average** household; each item's price change is taken into account with its weight within spending:

```python run
# Consumer price index from a basket: the weights are the shares of spending
basket = {   # item: (weight, price change %)
    "food":             (0.25, 6.0),
    "housing, utilities": (0.20, 3.0),
    "transport":        (0.15, -2.0),
    "entertainment":    (0.10, 8.0),
    "electronics":      (0.05, -5.0),
    "other":            (0.25, 4.0),
}
cpi = sum(w * c for w, c in basket.values())
print(f"average inflation (with an average household's basket): {cpi:.2f}%")

# a university student's basket looks different: other weights, the same price changes
student_weights = {"food": 0.30, "housing, utilities": 0.35, "transport": 0.05,
                   "entertainment": 0.15, "electronics": 0.10, "other": 0.05}
student = sum(student_weights[t] * basket[t][1] for t in basket)
print(f"a university student's personal inflation: {student:.2f}%")
```

With the same price changes, a university student's inflation is different, because they spend a larger share of their income on housing and entertainment, and less on transport. That's why everyone feels inflation differently: for a pensioner food and medicine weigh more, for a driver fuel does. That's why the Hungarian statistical office (KSH) also publishes separate price indices for different groups (e.g. pensioners).

**Measurement traps:** if a product (e.g. a laptop) costs the same but is twice as fast, that's actually a price fall – statistics tries to handle this with **quality adjustment**. And if beef gets more expensive, many switch to chicken – the fixed basket follows this only with a delay, so it can slightly overestimate inflation.

## 3. Labour market rates and their traps

```python run
# Labour market rates from a country's population aged 15–74 (thousands)
employed, unemployed, inactive = 4700, 210, 2590
active = employed + unemployed                          # labour force: working or actively seeking work
population = active + inactive
print(f"unemployment rate = {unemployed} / {active} = {100 * unemployed / active:.1f}%")
print(f"activity rate     = {active} / {population} = {100 * active / population:.1f}%")
print(f"employment rate   = {employed} / {population} = {100 * employed / population:.1f}%")

# 60 thousand unemployed give up searching (become inactive): the rate "improves", yet nobody found a job
u2, i2 = unemployed - 60, inactive + 60
print(f"\nif 60 thousand give up searching: unemployment rate {100 * u2 / (employed + u2):.1f}%, "
      f"employment rate unchanged at {100 * employed / population:.1f}%")
```

If 60 thousand unemployed people give up searching (**discouraged workers**), the unemployment rate "improves" from 4.3% to 3.1% – yet nobody found a job! The employment rate, however, doesn't change, so the state of the labour market is always described well only by **several indicators together**. A similar distortion: someone who works 1 hour a week counts as employed, even if they'd like to work more (underemployment).

## 4. Inflation as a hidden tax

```python run
# Inflation as a "hidden tax": 1 million Ft under the mattress – what is it worth in 10 years?
import math

for inflation in [2, 5, 10, 25]:
    value = 1_000_000 / (1 + inflation / 100) ** 10          # purchasing power in today's money
    halving = math.log(2) / math.log(1 + inflation / 100)    # purchasing power halves in this many years
    print(f"{inflation:>2}% inflation: in 10 years worth {value:>9,.0f} Ft | purchasing power halves in {halving:4.1f} years")
```

Even with 5% inflation the purchasing power of cash halves in about 14 years; at 25% (which is not unprecedented historically) in three years. That's why inflation is called a **hidden tax**: without any law it takes from savers' wealth – and at the same time it reduces the real value of debtors' (including the government's) debt.

```plot
title: The purchasing power of 100 Ft over the years
x: 0, 30
y: 0, 100
param: p = 5, 0, 30, 1
f: 100/(1 + p/100)^x # purchasing power
dash: 50 # half
```

## Summary

- Real GDP: at base-year prices; nominal growth = real growth × price-level growth (deflator).
- CPI is a weighted average; personal inflation depends on your own basket; quality changes and substitution can distort it.
- Unemployment rate = unemployed / active; discouragement "improves" the rate, so the employment rate must be watched too.
- Inflation is a hidden tax on savers: the purchasing power halves in roughly 70 / (inflation in %) years.

## Lesson exercise

```quiz required
? Nominal GDP grew by 8%, the deflator by 5%. What percentage is real growth? (to one decimal)
= 2,9
= 2.9
! $\frac{1.08}{1.05} - 1 \approx 2.9\%$.

? There are 900 thousand employed and 100 thousand unemployed. What percentage is the unemployment rate?
= 10
! $\frac{100}{900 + 100} = 10\%$.

? In a basket food has a weight of 0.6 (prices up 5%), the other items 0.4 (prices up 10%). What is inflation (%)?
= 7
! $0.6 \cdot 5 + 0.4 \cdot 10 = 7$.

? Many unemployed people give up looking for work. What happens to the unemployment rate?
+ it falls, although employment didn't grow
- it rises
- it doesn't change
- it rises together with the employment rate
! They leave the active population, so both the numerator and the denominator fall.

? The price index rises from 120 to 150. What percentage is inflation?
= 25
! $\frac{150}{120} - 1 = 25\%$.
```
