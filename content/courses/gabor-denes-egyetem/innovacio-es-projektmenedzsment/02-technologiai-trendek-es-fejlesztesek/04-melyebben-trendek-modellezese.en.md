---
title: Deeper – Modelling Trends
summary: Moore's law as exponential growth (and where its limit is), the yearly improvement along the technology S-curve, and the Bass diffusion model, which shows how a new product spreads through innovators and imitators – with small simulations and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to calculate with an **exponential** trend (Moore's law), and why projecting it blindly is dangerous,
- how to read from the **S-curve** when it's worth switching to a new technology,
- how the **Bass model** describes the spread of a new product, and when the most new users arrive.

## 1. Moore's law: doubling every two years

Gordon Moore's 1965 observation (refined in 1975): the number of transistors on a chip **roughly doubles every two years**. The first microprocessor, the Intel 4004 (1971), contained about 2300 transistors. Let's project forward:

```python run
# Moore's law: the transistor count doubles every two years, starting point: Intel 4004 (1971), 2300 transistors
base_year, base_count = 1971, 2300

def moore(year, doubling_time=2):
    return base_count * 2 ** ((year - base_year) / doubling_time)   # exponential growth

for year in [1971, 1981, 1991, 2001, 2011, 2021]:
    print(f"{year}: about {moore(year):>14,.0f} transistors")

# If the doubling time were 3 years instead of 2, how many would there be in 2021?
print(f"\nwith 3-year doubling in 2021: {moore(2021, 3):,.0f}")
```

For 2021 the model predicts about 77 billion – in reality the top chips of that time contained a few tens of billions of transistors, so **even after fifty years it's right in order of magnitude**. That's the power of exponential trends. Two lessons:

- a tiny difference in the doubling time makes a huge difference (with 3 years more than three hundred times fewer would come out),
- because of physical limits (atomic sizes, heat), doubling is slowing down; today the industry increases performance more through **more cores, specialised accelerators (GPU, NPU) and 3D packaging**. A trend must never be extended indefinitely.

## 2. The technology S-curve

A technology's performance as a function of time (or of the development effort invested) is often **S-shaped**: it improves slowly at first, then quickly, and finally reaches a natural limit. The **logistic function** describes it well:

```python run
# Technology S-curve: performance = limit / (1 + e^(−k (t − t0))), and the yearly improvement
import math

limit, k, t0 = 100, 0.6, 10          # natural limit, steepness, year of the inflection point

def performance(t):
    return limit / (1 + math.exp(-k * (t - t0)))

previous = performance(0)
for t in range(2, 21, 2):
    now = performance(t)
    print(f"year {t:>2}: performance {now:5.1f}   improvement in the last 2 years: {now - previous:5.1f}")
    previous = now
```

The improvement is **largest** around the inflection point (here year 10), and decreases afterwards: the same development money brings less and less progress. That's the signal to watch for the **next S-curve** – a new technology that is weaker today but has a higher limit (e.g. HDD → SSD, 4G → 5G). Whoever clings to the old curve too long gets overtaken by the new technology.

## 3. The Bass model: how does a new product spread?

According to Frank Bass's model, the buyers of a new product decide for two kinds of reasons:

- **innovators**: under the influence of advertising and their own curiosity – their rate is $p$ (typically 0.01–0.03),
- **imitators**: because they see others already using it – this is proportional to the share of existing users, $q$ (typically 0.3–0.5).

The number of new buyers in a period: $\left(p + q \cdot \frac{N}{M}\right)(M - N)$, where $N$ is the buyers so far and $M$ is the total market size.

```python run
# Bass diffusion model: new buyers = (p + q · N/M) · (M − N)
M, p, q = 1_000_000, 0.03, 0.38       # market size, innovation and imitation coefficients
N = 0                                 # buyers so far
best = (0, 0)
for year in range(1, 16):
    innovators = p * (M - N)
    imitators = q * N / M * (M - N)
    new = innovators + imitators
    N += new
    best = max(best, (new, year))
    if year <= 10 or year == 15:
        print(f"year {year:>2}: new {new:>7,.0f} (innovators {innovators:>6,.0f}, imitators {imitators:>6,.0f}), total {N / M:6.1%}")
print(f"\nthe most new buyers came in year {best[1]}: {best[0]:,.0f}")
```

In the first years the innovators dominate, but there are few of them; then **word of mouth** (the imitators) kicks off fast growth, and finally the market saturates. The cumulative curve is **S-shaped** again – this is the mathematical version of Rogers' diffusion curve. The practical lesson: a new product's success is decided not so much by advertising ($p$) as by spreading between users ($q$) – that's why referral programmes, community and a good first experience matter.

```plot
title: The Bass model: the share of the market that has already bought (p = 0.03)
x: 0, 20
y: 0, 1
param: q = 0.38, 0.05, 0.8, 0.01
f: (1 - e^(-(0.03 + q)*x))/(1 + (q/0.03)*e^(-(0.03 + q)*x)) # cumulative adoption
dash: 0.5 # half the market
```

Move the $q$ slider: with strong word of mouth (large $q$) the product spreads quickly and steeply, with weak word of mouth it "trickles" slowly.

## Summary

- Moore's law is an exponential trend: $N(t) = N_0 \cdot 2^{(t - t_0)/2}$; a small change in the doubling time causes a huge difference, and every trend has a limit.
- On the technology S-curve the improvement is largest at the inflection point; after that it's worth looking for the next curve.
- In the Bass model new buyers $= (p + q \cdot N/M)(M - N)$; adoption is driven mainly by imitation ($q$).

## Lesson exercise

```quiz required
? If a chip's transistor count doubles every two years, by what factor does it grow in 10 years?
= 32
! $2^{10/2} = 2^5 = 32$.

? In which section of the S-curve does a unit of development bring the largest improvement?
- at the very beginning
+ around the inflection point, in the middle of the curve
- at the end, near the limit
- the same everywhere
! The logistic curve is steepest there.

? In the Bass model $M = 1000$, $N = 200$, $p = 0.02$, $q = 0.4$. How many new buyers come in the next period?
= 80
! $(0.02 + 0.4 \cdot 0.2) \cdot 800 = 0.1 \cdot 800 = 80$.

? What does the coefficient $q$ mean in the Bass model?
- the effect of advertising
+ the strength of imitation, word of mouth
- the size of the market
- the price of the product
! Imitators buy because others already use it.

? Why is it dangerous to project an exponential trend (e.g. Moore's law) forward without limit?
- because the exponential function is decreasing
+ because in reality physical and economic limits slow down growth
- because past data are always wrong
- because exponential trends are valid only for 1 year
! All growth sooner or later runs into a limit (S-curve).
```
