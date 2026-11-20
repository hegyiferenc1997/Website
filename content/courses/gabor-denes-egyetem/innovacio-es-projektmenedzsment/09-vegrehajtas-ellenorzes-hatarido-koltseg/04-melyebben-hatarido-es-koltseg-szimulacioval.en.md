---
title: Deeper – Deadlines and Costs by Simulation
summary: What's the chance of meeting a deadline (PERT and the normal distribution), why an estimate built only on the critical path is optimistic (the merge effect, Monte Carlo), earned value indicators week by week in a project's life, and the cheapest schedule compression (crashing) with a program.
minutes: 45
---

## What you will learn in this lesson

- how to compute the **probability of meeting** a deadline from PERT estimates,
- why looking only at the critical path **underestimates** delays,
- how **earned value** tracks the project's health week by week, and what it predicts for the end,
- how to compress a schedule at the **lowest extra cost**.

## 1. What's the chance of meeting the deadline?

From the PERT estimate every activity has an expected value $t_e = \frac{O + 4M + P}{6}$ and a standard deviation $\sigma = \frac{P - O}{6}$. Along a path the expected values **add up**, but the standard deviations don't: the **variances** ($\sigma^2$) add up. If the path is long enough, the total duration is approximately **normally distributed**:

```python run
# PERT: expected length and standard deviation of the critical path, probability of meeting the deadline
from statistics import NormalDist
import math

path = [(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]     # (optimistic, most likely, pessimistic) days
te = sum((o + 4 * m + p) / 6 for o, m, p in path)
sd = math.sqrt(sum(((p - o) / 6) ** 2 for o, m, p in path))
print(f"expected length: {te:.1f} days, standard deviation: {sd:.2f} days")

dist = NormalDist(te, sd)
for deadline in [17, 19, 21, 23]:
    print(f"deadline {deadline} days → chance of meeting it {dist.cdf(deadline):5.1%}")
print(f"deadline needed for 90% certainty: {dist.inv_cdf(0.9):.1f} days")
```

If we set the deadline at the expected value (about 18.3 days), we'd meet it with only **about a 50%** chance – a coin toss! For 90% certainty about 21 days are needed; the difference is the **buffer**, which is worth putting at the end of the project (not spread among the activities, where Parkinson's law would "use it up").

## 2. The merge effect: why is PERT optimistic?

PERT looks only at the critical path. But when two parallel branches merge (e.g. backend and frontend before testing), testing can start only when **both** are done – and one of two uncertain branches is often late. Let's simulate:

```python run
# Merge effect: two parallel branches, both 20 days on average; the project depends on the later one
import random

random.seed(3)                                   # fixed randomness, so the same comes out every time
runs, deadline = 20_000, 21
one_on_time, both_on_time, total = 0, 0, 0.0
for _ in range(runs):
    backend = random.triangular(15, 30, 18)      # triangular distribution: min, max, most likely
    frontend = random.triangular(15, 30, 18)
    project = max(backend, frontend)             # testing waits for both
    one_on_time += backend <= deadline
    both_on_time += project <= deadline
    total += project
print(f"one branch done by day {deadline}: {one_on_time / runs:.1%}")
print(f"both branches done by day {deadline}: {both_on_time / runs:.1%}")
print(f"average merge time: {total / runs:.1f} days (average of one branch: {(15 + 30 + 18) / 3:.1f})")
```

One branch is done by day 21 with about a 55% chance, the two branches **together** with only about 31% (≈ 0.55²). The expected start of testing isn't day 21 either, but about day 23. The more parallel branches merge, the stronger the effect – that's why big projects slip even when every team meets its estimate "on average". Monte Carlo simulation (which the more serious PM tools can do) shows this effect too; plain PERT doesn't.

## 3. Earned value week by week

The weekly data of a 10-week, 100 million forint project (cumulative, in million Ft). The planned value (PV) is even; the earned value (EV) and the actual cost (AC) are reality:

```python run
# Earned value week by week: CPI, SPI and the estimate at completion (EAC = BAC / CPI)
BAC = 100
PV = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
EV = [8, 17, 25, 33, 40, 48]                     # we have data for this many weeks so far
AC = [10, 21, 31, 41, 50, 59]

print("week |  PV |  EV |  AC |  CPI |  SPI |   EAC")
for week, (pv, ev, ac) in enumerate(zip(PV, EV, AC), 1):
    cpi, spi = ev / ac, ev / pv
    print(f"{week:>4} | {pv:>3} | {ev:>3} | {ac:>3} | {cpi:.2f} | {spi:.2f} | {BAC / cpi:5.1f}")

cpi, spi = EV[-1] / AC[-1], EV[-1] / PV[len(EV) - 1]
print(f"\nestimated finish: {10 / spi:.1f} weeks, expected overrun (VAC): {BAC - BAC / cpi:.1f} M Ft")
```

The CPI has stabilised around 0.8: for every forint spent only 80 fillér worth of work gets done. Research shows that the CPI hardly improves once a project is **15–20%** complete – so the EAC forecast of about 123 million Ft is a serious warning: either more money is needed, or the scope has to be cut. The SPI of around 0.8 shows that the project would finish in about 12.5 weeks instead of the planned 10.

```plot
title: The estimate at completion (EAC) as a function of CPI
x: 0.5, 1.5
y: 0, 250
param: B = 100, 50, 150, 5
f: B/x # EAC = BAC / CPI
dash: B # BAC
```

Move the budget ($B$): at $\text{CPI} = 1$ the EAC equals the BAC exactly; to the left (CPI < 1) there's an overrun, to the right a saving.

## 4. Crashing: the cheapest speed-up

The deadline has to be shortened by 3 days. For every critical activity we know by how many days it can be shortened (more people, overtime) and what one day of speed-up costs. The rule: always buy the **cheapest** day **on the critical path**.

```python run
# Crashing: shortening the critical path day by day, always with the cheapest option
# (we assume no other path becomes critical during the shortening)
critical = {  # activity: [days that can be cut, price of one day in thousand Ft]
    "requirements": [1, 300], "backend": [2, 150], "testing": [2, 200], "release": [0, 0],
}
cut, cost = 3, 0
for day in range(1, cut + 1):
    options = [(price, name) for name, (days, price) in critical.items() if days > 0]
    price, name = min(options)                   # the cheapest activity that can still be shortened
    critical[name][0] -= 1
    cost += price
    print(f"day {day}: shorten {name} for {price} thousand Ft")
print(f"total extra cost: {cost} thousand Ft")
```

The backend is the cheapest (150 thousand Ft/day), but can be shortened by only 2 days; we buy the third day from testing (200 thousand Ft), so the 3-day speed-up costs 500 thousand forints. In reality you have to watch out: during shortening a parallel path can also become **critical** (like activity C in the network planning lesson), and from then on both paths have to be shortened. **Fast-tracking** (parallelising) looks free, but it increases risk: if the previous phase's result changes, part of the overlapping work has to be redone.

## Summary

- PERT: a path's expected length is the sum of the $t_e$ values, its standard deviation is $\sqrt{\sum \sigma^2}$; the chance of meeting a deadline comes from the normal distribution. A deadline set at the expected value is only about 50% likely.
- When parallel branches merge, the project depends on the later one, so the chance of delay is greater than the critical path shows (Monte Carlo).
- EV indicators week by week: CPI = EV / AC, SPI = EV / PV, EAC = BAC / CPI; the CPI stabilises early.
- In crashing we always buy the cheapest day on the critical path, and watch for new critical paths.

## Lesson exercise

```quiz required
? A path has two activities with standard deviations of 3 and 4 days. What is the path's standard deviation (days)?
= 5
! $\sqrt{3^2 + 4^2} = \sqrt{25} = 5$.

? If the deadline is exactly the path's expected length, with roughly what chance do we meet it (normal distribution, %)?
= 50
! The normal distribution is symmetric: 50–50% below and above the expected value.

? Two independent parallel branches are each done on time with an 80% chance. What is the chance that both are done (%)?
= 64
! $0.8 \cdot 0.8 = 0.64$.

? BAC = 200 million Ft, CPI = 0.8. What is the EAC (million Ft)?
= 250
! $200 / 0.8 = 250$.

? In crashing, which activity is worth shortening first?
- the most expensive, because the effect is biggest there
+ the one on the critical path that's cheapest to shorten per day
- any that isn't on the critical path
- the longest
! Only shortening the critical path speeds up the project, and there we buy the cheapest day.
```
