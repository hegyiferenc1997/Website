---
title: Practice – Risk, Change, Quality, Resources
summary: Review questions and a summary calculation worksheet for the fourteenth topic.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Phrase a risk in "cause – risk – effect" form for a mobile app project!</summary>

Because the app store's approval time is unpredictable (cause), the first version may not appear by launch day (risk), which would make the marketing campaign ineffective (effect).

</details>

<details>
<summary>2. Why must every risk have a single risk owner?</summary>

Because if "everyone" is responsible, nobody watches the triggers and nobody starts the response in time. The risk owner is a specific person who can be held accountable.

</details>

<details>
<summary>3. After the new system is introduced, users keep using their Excel spreadsheets. Where might they be stuck according to ADKAR, and what would you do?</summary>

Probably at Desire (they do not see what they gain) or Reinforcement (nobody asks them to use the new system). I would show the personal benefits, recruit key users as champions, and management would request reports only from the new system.

</details>

<details>
<summary>4. Give an example of each of the four cost-of-quality types for developing a web shop!</summary>

Prevention: security training for developers. Appraisal: automated tests and load testing. Internal failure: fixing a payment bug found in acceptance testing. External failure: wrong prices in production, refunds and bad reviews.

</details>

## Summary worksheet

```quiz required
? Two options: A: 60% chance of 30, 40% chance of 50 million; B: 38 million for certain. What is A's expected cost?
= 38
! 0.6 · 30 + 0.4 · 50 = 18 + 20.

? We exploit an opportunity together with a partner and share the benefit. Which response is this?
- exploit
+ share
- enhance
- accept
! Share.

? The **first** step of Kotter's model:
+ create a sense of urgency
- generate quick wins
- communicate the vision
- anchor the new approach in the culture
! Create a sense of urgency.

? A tester measures on the finished module whether response time is under 2 s. QA or QC?
- QA (quality assurance)
+ QC (quality control)
! It examines the product → quality control.

? A defect list has 200 defects, 120 of them in the payment module. What percentage is that?
= 60
= 60%
! 120 / 200 · 100.

? A project has 3 full-time developers and 2 people working 20 hours a week (40-hour week). How many FTE in total?
= 4
= 4 FTE
! 3 · 1 + 2 · 0.5.

? A developer was given 46 hours in a week, with a capacity of 40 hours. Which technique can remove the overallocation without changing the deadline, if their tasks have float?
- resource levelling
+ resource smoothing
- crashing
- gold plating
! Smoothing: shifting within float.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Risk register.** Write the function `emv_ranking(risks)`, which from a list of `(id, probability, impact)` triples gives the ids in descending order of the absolute value of the expected value, and the function `reserve(risks)` (the sum of the EMVs, to 2 decimals; the negative impact of opportunities reduces it)!

```python starter
def emv_ranking(risks):
    return [r[0] for r in sorted(risks, key=lambda r: -r[2])]

def reserve(risks):
    return round(sum(p * i for _, p, i in risks if i > 0), 2)
```

<details>
<summary>Solution</summary>

```python solution
def emv_ranking(risks):
    return [r[0] for r in sorted(risks, key=lambda r: -abs(r[1] * r[2]))]   # |probability × impact|

def reserve(risks):
    return round(sum(p * i for _, p, i in risks), 2)
```

</details>

```python test
r = [("R1", 0.2, 8.0), ("R2", 0.4, 3.0), ("R3", 0.6, 4.0), ("R4", 0.3, 6.0), ("R5", 0.5, -2.0)]
assert emv_ranking(r) == ["R3", "R4", "R1", "R2", "R5"]
assert reserve(r) == 6.0
assert reserve([("X", 0.5, 10.0)]) == 5.0
print("All checks passed!")
```

**2.** **Decision tree.** Write the function `decision_tree(options)`, which from an `{option: [(probability, cost), …]}` dictionary gives the option with the lowest expected cost, and the function `risk_averse(options)`, which gives the option with the lowest worst case!

```python starter
def decision_tree(options):
    return min(options, key=lambda o: options[o][0][1])

def risk_averse(options):
    return decision_tree(options)
```

<details>
<summary>Solution</summary>

```python solution
def decision_tree(options):
    return min(options, key=lambda o: sum(p * c for p, c in options[o]))   # expected cost

def risk_averse(options):
    return min(options, key=lambda o: max(c for _, c in options[o]))      # worst case
```

</details>

```python test
d = {"build in-house": [(0.6, 20), (0.3, 28), (0.1, 45)], "buy a product": [(0.8, 25), (0.2, 33)]}
assert decision_tree(d) == "build in-house"
assert risk_averse(d) == "buy a product"
assert decision_tree({"A": [(0.5, 10), (0.5, 50)], "B": [(1.0, 25)]}) == "B"
print("All checks passed!")
```

**3.** **Control chart.** Write the function `limits(stable)`, which gives the limits of mean ± 3 (sample) standard deviations (to 1 decimal, `(lower, upper)`), and the function `outliers(stable, new)`, which gives the positions (from 1) of the `new` measurements outside the limits!

```python starter
from statistics import mean, stdev

def limits(stable):
    return (round(mean(stable) - 2 * stdev(stable), 1), round(mean(stable) + 2 * stdev(stable), 1))

def outliers(stable, new):
    lower, upper = limits(stable)
    return [i for i, x in enumerate(new, 1) if not lower <= x <= upper]
```

<details>
<summary>Solution</summary>

```python solution
from statistics import mean, stdev

def limits(stable):
    m, s = mean(stable), stdev(stable)
    return (round(m - 3 * s, 1), round(m + 3 * s, 1))   # ± 3 standard deviations

def outliers(stable, new):
    lower, upper = limits(stable)
    return [i for i, x in enumerate(new, 1) if not lower <= x <= upper]
```

</details>

```python test
stable = [212, 205, 198, 220, 210, 207, 215, 202, 209, 213, 204, 211]
assert limits(stable) == (190.7, 227.0)
assert outliers(stable, [208, 214, 203, 236, 211, 219, 221, 223, 225]) == [4]
print("All checks passed!")
```

### Quick check questions

```quiz
? What is scope creep?
+ uncontrolled growth of the scope without approval
- bringing the project deadline forward
- cutting the budget
- growth in the team size
! The change control process prevents it.

? What is the 1:10:100 rule in quality?
- 1 tester per 10 developers and 100 users
+ preventing a defect costs 1, fixing it in-house 10, fixing it at the customer 100 units
- 1 defect per 10 lines and 100 tests
- 1%, 10% and 100% of quality assurance
! The later a defect is found, the more expensive it is.

? A risk occurs with a 40% chance, its impact is 5 million Ft. What is the EMV (million Ft)?
= 2
! $0.4 \cdot 5 = 2$.

? What is the first step of Kotter's model?
+ creating a sense of urgency
- anchoring the change in the culture
- generating short-term wins
- communicating the vision
! Kotter's 8 steps start with a sense of urgency.
```
