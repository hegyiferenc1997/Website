---
title: Measuring Economic Growth
summary: What does it mean that an economy grows by 3%? The growth rate, per capita growth, "compound growth" like compound interest, the rule of 70 and catch-up.
minutes: 20
---

## What you will learn

- how to calculate the **growth rate**,
- why **per capita** growth matters,
- why small differences in growth rates matter enormously in the long run,
- the **rule of 70**,
- what **catch-up** (convergence) means.

## The growth rate

**Economic growth** is a sustained increase in **real GDP** (topic 6). The growth rate:

$$ g = \frac{Y_t - Y_{t-1}}{Y_{t-1}} \cdot 100 $$

If real GDP rises from 100 units to 103, growth is **3%**.

### Per capita growth

For living standards, growth in real GDP **per capita** is what counts:

$$ g_{\text{per capita}} \approx g_{\text{GDP}} - g_{\text{population}} $$

If GDP grows by 2% and the population by 1%, GDP per capita grows by only about **1%**. In Hungary the population is slowly shrinking, so per capita growth there is slightly **higher** than GDP growth.

## Compound growth

Growth **compounds**, like compound interest (topic 5): $Y_n = Y_0 \cdot (1 + g)^n$.

```plot
title: GDP per capita over 50 years (starting value = 100)
x: 0, 50
y: 0, 1200
param: g = 2, 0, 5, 0.5
f: 100 (1 + g/100)^x # g% growth
dash: 100 (1.01)^x # 1% growth
value: value after 50 years = 100 (1 + g/100)^50
```

Over 50 years, 1% growth makes living standards about 1.6 times higher, 2% about 2.7 times, 4% more than 7 times. One of the great lessons of economic history is that small differences in **sustained** growth make some countries rich and others poor.

## The rule of 70

The doubling time is approximately:

$$ \text{doubling time (years)} \approx \frac{70}{g\ (\%)} $$

(The same idea as the rule of 72 for interest; 70 is more accurate for small rates.)

- 2% growth → doubles in about **35 years**,
- 7% growth → in about **10 years** (China grew even faster than this for decades).

## Catch-up

**Convergence** (catch-up) means that poorer countries grow **faster** than rich ones and so get closer to them.

- **Why is it possible?** They can adopt technologies that have already been developed, and with little capital an extra machine or road yields more (diminishing returns – lesson 2).
- **Examples:** South Korea, Taiwan, Ireland, the Central and Eastern European countries that joined the EU in 2004 (Poland, Czechia, the Baltic states, Hungary) – they moved closer to the EU average.
- **But it is not automatic:** many countries fail to catch up for decades – it depends on the sources of growth (lesson 2) and on institutions.

**Example:** if a country's GDP per capita is 75% of the developed average and it grows 2 percentage points faster each year, the gap disappears in roughly 15 years.

## Summary

- Growth rate: the percentage change in real GDP.
- Per capita growth ≈ GDP growth − population growth.
- Growth compounds: $(1+g)^n$.
- Rule of 70: doubling time ≈ 70 / g.
- Catch-up: poorer countries can grow faster, but it is not automatic.

## Your task

```quiz required
? Real GDP rises from 250 to 260. What is the growth rate in percent?
= 4
= 4%
! 10 / 250.

? GDP grows by 3% and the population by 0.5%. Approximately by what percentage does GDP per capita grow?
= 2,5
= 2.5
! 3 − 0.5.

? By the rule of 70, in how many years does an economy growing at 3.5% a year double?
= 20
! 70 / 3.5.

? Why can poorer countries grow faster?
+ because they can adopt existing technologies, and with little capital the return on investment is higher
- because they print more money
- because their inflation is higher
- because they have fewer people
! Catch-up (convergence).

? Two countries start from the same level; one grows at 1% a year, the other at 3%. What is true after 35 years?
- they are equally rich
+ the faster one is roughly twice as rich as the slower one
- the slower one is richer
! 1.03³⁵ ≈ 2.8 and 1.01³⁵ ≈ 1.4.
```
