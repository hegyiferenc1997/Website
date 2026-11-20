---
title: Practice – Technology Trends
summary: Review questions and a summary worksheet for the second topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between a technology trend and a fashion?</summary>

A trend is persistent (several years) and broad, backed by measurable investment and market growth. A fashion is short-lived and does not transform industries.

</details>

<details>
<summary>2. A start-up rents virtual machines from AWS instead of buying its own servers. Which cloud model is this, and what is its advantage?</summary>

IaaS. There is no big up-front hardware cost, capacity can be scaled up or down on demand, and it only pays for usage.

</details>

<details>
<summary>3. A technology is in the trough of the hype cycle. What would you advise a company?</summary>

Do not write it off for good: watch which applications prove themselves, and prepare for the slope of enlightenment, when the technology matures, with small controlled pilot projects.

</details>

<details>
<summary>4. Why is it hard to cross "the chasm"?</summary>

Because the early majority is pragmatic: they want a complete, reliable solution proven by references, and the early adopters' enthusiasm does not convince them.

</details>

<details>
<summary>5. A research group has shown in the lab that their new algorithm works. Roughly which TRL are they at?</summary>

TRL 3–4: experimental proof of concept, or lab validation. Demonstration in a real environment (TRL 5–6) is still ahead.

</details>

## Summary worksheet

```quiz required
? A company uses its CRM system from the browser for a monthly fee, without installing anything. Which model?
- IaaS
- PaaS
+ SaaS
! A finished application as a service.

? Which trend does RPA belong to?
- quantum computing
+ automation (software robots for repetitive office tasks)
- augmented reality
- blockchain
! Robotic Process Automation.

? Which phase of the hype cycle comes **directly after** the trough of disillusionment?
- the peak of inflated expectations
+ the slope of enlightenment
- the plateau of productivity
- the innovation trigger
! Peak → trough → slope → plateau.

? A 2026 chip has 20 billion transistors. With doubling every two years, how many billion would it have in 2032?
= 160
= 160 billion
! 6 years = 3 doublings: 20 · 2³.

? According to Rogers, what percentage are the early and late majority **together**?
= 68
= 68%
! 34% + 34%.

? Which Rogers factor means that a new idea is **easy to try** before buying?
- compatibility
- observability
+ trialability
- relative advantage
! E.g. a free trial period for software.

? A system prototype has been demonstrated in a real operational environment, but the complete system is not yet qualified. Which TRL is this?
= 7
= TRL 7
! TRL 7 = system prototype in an operational environment; TRL 8 is the qualified complete system.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Moore's law.** Write the function `moore(year, base_year=1971, base_count=2300, doubling=2)`, which gives the expected transistor count (rounded to a whole number) if the number doubles every `doubling` years!

```python starter
def moore(year, base_year=1971, base_count=2300, doubling=2):
    return round(base_count * 2 * (year - base_year) / doubling)
```

<details>
<summary>Solution</summary>

```python solution
def moore(year, base_year=1971, base_count=2300, doubling=2):
    return round(base_count * 2 ** ((year - base_year) / doubling))   # exponential growth
```

</details>

```python test
assert moore(1971) == 2300
assert moore(1981) == 73600
assert moore(1977, doubling=3) == 9200
print("All checks passed!")
```

**2.** **Bass model.** Write the function `bass(M, p, q, years)`, which gives the number of new buyers year by year (rounded to whole numbers, in a list): new = $(p + q \cdot N/M)(M - N)$, where $N$ is the number of buyers so far!

```python starter
def bass(M, p, q, years):
    N, new_buyers = 0, []
    for _ in range(years):
        new = p * (M - N)
        N += new
        new_buyers.append(round(new))
    return new_buyers
```

<details>
<summary>Solution</summary>

The starter code leaves out the imitators, although in reality they make up most of the buyers.

```python solution
def bass(M, p, q, years):
    N, new_buyers = 0, []
    for _ in range(years):
        new = (p + q * N / M) * (M - N)    # innovators + imitators
        N += new
        new_buyers.append(round(new))
    return new_buyers
```

</details>

```python test
assert bass(1000, 0.03, 0.38, 2) == [30, 40]
assert bass(1000, 0.1, 0, 3) == [100, 90, 81]
assert bass(1_000_000, 0.03, 0.38, 8)[-1] == 110481
print("All checks passed!")
```

**3.** **S-curve.** Performance is $f(t) = \frac{H}{1 + e^{-k(t - t_0)}}$. Write the function `biggest_improvement(H, k, t0, years)`, which tells in which year (from 1 to `years`) the one-year improvement $f(t) - f(t - 1)$ is the largest!

```python starter
def biggest_improvement(H, k, t0, years):
    return years
```

<details>
<summary>Solution</summary>

The largest improvement is around the inflection point ($t_0$), not at the end of the curve – from there on it's worth watching the next technology.

```python solution
import math

def biggest_improvement(H, k, t0, years):
    f = lambda t: H / (1 + math.exp(-k * (t - t0)))
    return max(range(1, years + 1), key=lambda t: f(t) - f(t - 1))   # the steepest year
```

</details>

```python test
assert biggest_improvement(100, 0.6, 10.5, 20) == 11
assert biggest_improvement(100, 1, 5.5, 15) == 6
assert biggest_improvement(50, 0.3, 20.5, 30) == 21
print("All checks passed!")
```

### Quick check questions

```quiz
? If a quantity doubles every 3 years, by what factor does it grow in 12 years?
= 16
! $2^{12/3} = 2^4 = 16$.

? What does the Gartner hype cycle show?
+ that expectations around a new technology first soar excessively, then after disappointment settle at a realistic level
- that technology prices fall continuously
- that every technology spreads within 10 years
- the growth in the number of transistors
! After the peak comes the "trough of disillusionment", then the "plateau of productivity".

? In the Bass model $M = 500$, $N = 100$, $p = 0.05$, $q = 0.5$. How many new buyers come in the next period?
= 60
! $(0.05 + 0.5 \cdot 0.2) \cdot 400 = 0.15 \cdot 400 = 60$.

? What does level 9 of the TRL scale mean?
- observing basic principles
- laboratory prototype
+ the technology is proven to work in a real, live environment
- the technology is obsolete
! TRL measures maturity from 1 (basic principles) to 9 (proven live operation).
```
