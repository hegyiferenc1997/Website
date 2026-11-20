---
title: Deeper – Research with Numbers
summary: How big a sample a questionnaire needs (margin of error and sample size), whether an A/B test difference is real (significance with a z-test and simulation), how a hidden third variable misleads (correlation versus causation), and evaluating a source from several angles – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to calculate the **margin of error** of a survey, and how big a **sample** you need,
- how to decide whether an **A/B test** difference is real or just chance,
- how a **hidden variable** creates an apparent relationship,
- how to evaluate a **source** by several criteria.

## 1. How big a sample? The margin of error

In a survey, 60 of 100 students say they would use a new timetable planner app. That's 60% – but if we'd asked another 100 students, we might have got 55% or 66%. The **margin of error** shows how big this uncertainty is. The 95% margin of error of a proportion is approximately:

$$\text{margin of error} \approx 1.96 \cdot \sqrt{\frac{p(1 - p)}{n}}$$

where $p$ is the measured proportion and $n$ the sample size. The worst case is $p = 0.5$:

```plot
title: Margin of error (percentage points) as a function of sample size, p = 0.5
x: 10, 1000
y: 0, 35
f: 100*1.96*sqrt(0.25/x) # margin of error (95%)
dash: 5 # ±5 percentage points
```

```python run
# Margin of error and required sample size for a proportion (95% confidence)
from math import sqrt, ceil

def margin(p, n):
    return 1.96 * sqrt(p * (1 - p) / n)

for n in [30, 100, 400, 1000]:
    print(f"n = {n:>4}: 60% ± {margin(0.6, n):.1%}")

def required_n(error, p=0.5):
    return ceil((1.96 / error) ** 2 * p * (1 - p))

for error in [0.10, 0.05, 0.03]:
    print(f"for a ±{error:.0%} margin you need at least {required_n(error)} respondents")
```

Two lessons:

- The margin of error shrinks with the **square root** of the sample: to double the precision you need a sample **four times** as large. That's why a 1000-person opinion poll gives ±3%, and why a 20-person "survey" among classmates isn't worth much.
- The formula only holds for a **random sample**! If you share the questionnaire on your own Discord server, the respondents don't represent all students (the **sampling bias** from the basic lesson) – and a larger number doesn't help with that.

## 2. Is the difference real? An A/B test

You test two versions of the app's registration page: version **A** (old) was seen by 400 visitors, 30 of whom registered (7.5%); version **B** (new) by another 400, 48 of whom registered (12%). Is B better, or is this just random fluctuation?

The **null hypothesis**: the two versions are equally good, and the difference is chance. We examine it in two ways: with a classic **z-test** and with a **simulation** (permutation test) that replicates what would happen if the null hypothesis were true:

```python run
# A/B test: z-test for two proportions and a permutation simulation
from math import sqrt, erf
import random

a_vis, a_reg = 400, 30
b_vis, b_reg = 400, 48
pa, pb = a_reg / a_vis, b_reg / b_vis
p = (a_reg + b_reg) / (a_vis + b_vis)                  # pooled proportion under the null hypothesis
z = (pb - pa) / sqrt(p * (1 - p) * (1 / a_vis + 1 / b_vis))
p_value = 2 * (1 - 0.5 * (1 + erf(abs(z) / sqrt(2))))
print(f"A: {pa:.1%}, B: {pb:.1%}, z = {z:.2f}, p-value ≈ {p_value:.3f}")

# permutation test: if the version didn't matter, registrations would be shared out randomly
random.seed(1)
outcomes = [1] * (a_reg + b_reg) + [0] * (a_vis + b_vis - a_reg - b_reg)
observed = pb - pa
at_least = 0
trials = 5000
for _ in range(trials):
    random.shuffle(outcomes)
    diff = sum(outcomes[:b_vis]) / b_vis - sum(outcomes[b_vis:]) / a_vis
    if abs(diff) >= abs(observed):
        at_least += 1
print(f"simulation: chance gives at least this big a difference in {at_least / trials:.1%} of cases")
```

According to both methods, chance would produce such a difference in only about **3–4%** of cases. The usual threshold is 5%: below it, we say the difference is **statistically significant** – i.e. probably real.

Three important warnings:

- Significance is **not the size of the difference**: on a huge sample even a tiny, practically meaningless difference can be significant. Always look at the **effect size** too (here 4.5 percentage points – significant for registrations).
- If you test 20 different versions, on average **one** will be "significant" by chance at a 5% threshold. Don't keep searching until something shows up (this is called p-hacking).
- Plan the test **in advance**: how long it runs, what you measure – don't stop it when it happens to look good.

## 3. Correlation and causation: the hidden variable

A small survey finds that people who drink more coffee have **more bugs** found in their code at code review. Does coffee cause bugs? Let's simulate a world where coffee has **no** effect on bugs – both are just influenced by a third variable: how many hours someone works **at night**.

```python run
# Hidden third variable: night work increases coffee consumption AND the number of bugs
import random
from statistics import correlation

random.seed(3)
night, coffee, bugs = [], [], []
for _ in range(200):
    n = random.uniform(0, 10)                       # night working hours per week
    night.append(n)
    coffee.append(1 + 0.4 * n + random.gauss(0, 1))  # coffee depends on night work
    bugs.append(2 + 0.6 * n + random.gauss(0, 1.5))  # so do bugs – NOT on coffee

print(f"coffee–bugs correlation: {correlation(coffee, bugs):.2f}")

# hold night work fixed: look only at those who work 4–6 night hours
group = [(c, b) for n, c, b in zip(night, coffee, bugs) if 4 <= n <= 6]
print(f"coffee–bugs correlation among those with 4–6 night hours: {correlation(*zip(*group)):.2f} ({len(group)} people)")
```

In the full sample there's a strong **positive correlation** between coffee and bugs – even though in the model coffee has nothing to do with bugs! But if we only look at those who work about the same number of night hours (i.e. we "hold the hidden variable fixed"), the relationship becomes **much weaker** (about 0.2 instead of 0.5 – in a group of 39 that's already at the edge of random fluctuation). This is the effect of a **confounder**.

So how can causation be established? The strongest method is an **experiment with random assignment** – just like the A/B test: visitors are randomly split into two groups, so every hidden variable (age, device, time of day) is on average equally distributed, and the difference can only be caused by the version.

## 4. Evaluating a source from several angles

For your thesis you're looking for a source on how widespread a programming language is. You find three sources – and none is perfect:

| Source                                                           | Credibility                             | Currency        | Bias                                              | What is it good for?                                       |
| ---------------------------------------------------------------- | --------------------------------------- | --------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| a peer-reviewed conference paper (IEEE), 2019                    | high: peer review, method described     | may be outdated | low                                               | methods, definitions, longer-term trends                   |
| a large developer survey (e.g. the annual Stack Overflow survey) | medium: large sample, but self-selected | current         | sampling bias: active forum users overrepresented | current popularity data, noting its limits                 |
| a blog post by a company developing the language                 | low–medium                              | current         | high: an interested party                         | the company's position, product information – not evidence |

Good practice isn't using only the "perfect" source, but **knowing what it's good for** and naming its limits: "According to Stack Overflow's 2025 survey… (note that respondents self-selected, so the sample isn't representative)." If several independent sources show the same thing, the claim is much stronger.

## Summary

- The 95% margin of error of a proportion is $\approx 1.96\sqrt{p(1-p)/n}$; doubling the precision needs a fourfold sample, and the formula only holds for random samples.
- An A/B test difference can be checked with a z-test or a simulation; significance isn't effect size, and the test should be planned in advance.
- A hidden third variable can cause a strong but false correlation; causation is best established by a randomised experiment.
- Evaluate sources by credibility, currency and bias, and name their limits.

## Lesson exercise

```quiz required
? In a survey $n = 100$ and $p = 0.5$. What is the 95% margin of error in percentage points? ($1.96 \cdot \sqrt{0.25 / 100}$, to one decimal)
= 9,8
= 9.8
! $1.96 \cdot 0.05 = 0.098 = 9.8$ percentage points.

? How many times larger a sample do you need to halve the margin of error?
= 4
! The margin of error shrinks as $1/\sqrt{n}$: halving it needs a fourfold sample.

? In an A/B test the p-value is 0.03. What does this mean (at a 5% threshold)?
- version B is 3% better
+ if the two versions were the same, a difference this big or bigger would arise by chance in only about 3% of cases, so the difference is significant
- there's a 3% chance that B is better
- the test is faulty
! The p-value is a probability computed under the null hypothesis, not the effect size.

? You find a strong correlation between coffee consumption and code bugs. What's the right conclusion?
- coffee causes bugs
- bugs cause coffee consumption
+ correlation alone doesn't prove causation; there may be a hidden third variable (e.g. night work)
- the correlation is certainly chance
! Causation is best established by a randomised experiment.

? How should a blog post by a company developing a programming language be used in a thesis?
- as independent evidence of the language's superiority
+ to present the company's position and product information, mentioning its interest
- as the most important source
- not at all, it's forbidden to cite
! An interested party: the source can be useful, but isn't independent evidence.
```
