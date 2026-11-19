---
title: Practice – Deadlines and Costs
summary: Review questions and a complete earned value calculation as a summary worksheet.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Why is "how much money have we spent" not enough to judge the state of a project?</summary>

Because it does not show how much work was done for it. Spending half the budget can be good (if half the work is done) or bad (if only a quarter is). EV provides this missing information.

</details>

<details>
<summary>2. When would you choose fast-tracking instead of crashing?</summary>

When there is no extra money or resources, but activities can partly overlap (e.g. testing can start on finished modules), and the higher risk and possible rework are acceptable.

</details>

<details>
<summary>3. A PM adds 20% padding to every activity, yet the project is late. What could be the reason, and what would you suggest?</summary>

Parkinson's law and student syndrome: the team "uses up" the padding. Suggestion: collect the padding into a shared project buffer (critical chain) and track how fast the buffer is consumed.

</details>

<details>
<summary>4. What is the difference between the contingency and the management reserve?</summary>

The contingency reserve is for identified risks, is part of the cost baseline and can be used by the PM. The management reserve is for unforeseeable events, is not part of the baseline and can only be used with management approval.

</details>

## Summary worksheet

A web project: **BAC = 80 million**. At the end of month 6 the plan says **PV = 48** million worth of work should be done. **50%** of the work is done, and **AC = 50** million has been spent so far.

```quiz required
? What is EV (millions)?
= 40
! EV = 0.5 · 80.

? What is the cost variance, CV (millions)?
= -10
= −10
! CV = EV − AC = 40 − 50.

? What is the schedule variance, SV (millions)?
= -8
= −8
! SV = EV − PV = 40 − 48.

? What is the CPI?
= 0.8
! CPI = 40 / 50.

? What is the estimate at completion, EAC (millions)?
= 100
! EAC = BAC / CPI = 80 / 0.8.

? What is the variance at completion, VAC (millions)?
= -20
= −20
! VAC = BAC − EAC = 80 − 100.

? PERT: O = 6, M = 9, P = 18 days. What is the expected duration (days)?
= 10
= 10 days
! (6 + 36 + 18) / 6 = 60 / 6.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **PERT.** Write the function `pert(o, m, p)`, which gives the pair `(expected time, standard deviation)` (to 2 decimals), and the function `path(activities)`, which from a list of `(o, m, p)` triples gives the path's expected length and standard deviation (to 2 decimals)! The path's variance is the sum of the variances.

```python starter
def pert(o, m, p):
    return (round((o + 4 * m + p) / 6, 2), round((p - o) / 6, 2))

def path(activities):
    te = sum((o + 4 * m + p) / 6 for o, m, p in activities)
    sd = sum((p - o) / 6 for o, m, p in activities)
    return (round(te, 2), round(sd, 2))
```

<details>
<summary>Solution</summary>

Standard deviations don't add up: the starter code overestimates the uncertainty, because delays and speed-ups partly cancel each other out.

```python solution
import math

def pert(o, m, p):
    return (round((o + 4 * m + p) / 6, 2), round((p - o) / 6, 2))

def path(activities):
    te = sum((o + 4 * m + p) / 6 for o, m, p in activities)
    var = sum(((p - o) / 6) ** 2 for o, m, p in activities)   # the variances add up
    return (round(te, 2), round(math.sqrt(var), 2))
```

</details>

```python test
assert pert(2, 5, 14) == (6.0, 2.0)
assert path([(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]) == (18.33, 2.08)
assert path([(0, 3, 6), (0, 4, 8)]) == (7.0, 1.67)
print("All checks passed!")
```

**2.** **Chance of meeting the deadline.** Write the function `chance(activities, deadline)`, which, assuming a normal distribution, tells with what percentage chance the path is done by the deadline (to 1 decimal)!

```python starter
def chance(activities, deadline):
    te = sum((o + 4 * m + p) / 6 for o, m, p in activities)
    return 100.0 if deadline >= te else 0.0
```

<details>
<summary>Solution</summary>

```python solution
from statistics import NormalDist
import math

def chance(activities, deadline):
    te = sum((o + 4 * m + p) / 6 for o, m, p in activities)
    sd = math.sqrt(sum(((p - o) / 6) ** 2 for o, m, p in activities))
    return round(100 * NormalDist(te, sd).cdf(deadline), 1)
```

</details>

```python test
route = [(2, 4, 8), (3, 5, 13), (4, 6, 8), (1, 2, 3)]
assert chance(route, 21) == 90.0
assert chance(route, 17) == 26.1
assert chance([(0, 3, 6)], 3) == 50.0
print("All checks passed!")
```

**3.** **Earned value.** Write the function `evm(bac, pv, ev, ac)`, which returns a dictionary: `CPI` and `SPI` (to 2 decimals), `EAC` = BAC / CPI and `VAC` = BAC − EAC (to 1 decimal)!

```python starter
def evm(bac, pv, ev, ac):
    cpi, spi = ac / ev, pv / ev
    eac = bac * cpi
    return {"CPI": round(cpi, 2), "SPI": round(spi, 2), "EAC": round(eac, 1), "VAC": round(bac - eac, 1)}
```

<details>
<summary>Solution</summary>

```python solution
def evm(bac, pv, ev, ac):
    cpi, spi = ev / ac, ev / pv                    # below 1: more expensive / slower than planned
    eac = bac / cpi
    return {"CPI": round(cpi, 2), "SPI": round(spi, 2), "EAC": round(eac, 1), "VAC": round(bac - eac, 1)}
```

</details>

```python test
assert evm(100, 50, 40, 50) == {"CPI": 0.8, "SPI": 0.8, "EAC": 125.0, "VAC": -25.0}
assert evm(200, 100, 110, 100) == {"CPI": 1.1, "SPI": 1.1, "EAC": 181.8, "VAC": 18.2}
print("All checks passed!")
```

### Quick check questions

```quiz
? What does Parkinson's law say?
+ work expands to fill the time available
- projects are always cheaper than planned
- every second task slips
- the team size doubles every week
! That's why it isn't worth spreading the buffer among the activities.

? What is fast-tracking?
- bringing in new people
+ parallelising activities that were originally planned one after the other
- cutting the scope
- stopping the project
! It saves time but increases risk and rework.

? PV = 80, EV = 60, AC = 75. What is the CPI?
= 0,8
= 0.8
! $60 / 75 = 0.8$.

? PERT: O = 4, M = 6, P = 14. What is the expected time (days)?
= 7
! $(4 + 24 + 14) / 6 = 7$.
```
