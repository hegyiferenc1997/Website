---
title: Deeper – Process Improvement with Data
summary: Pareto analysis of support tickets with a program, the process efficiency of a value stream (how much of the lead time is waiting), the Six Sigma sigma level and defects per million opportunities (DPMO), and the cumulative effect of PDCA cycles – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to do a **Pareto analysis** from data, and how to decide where to start improving,
- how to measure a process's **efficiency** in the value stream, and why waiting is the biggest waste,
- what **Six Sigma** means in numbers (3.4 defects per million opportunities),
- why PDCA, improving in small but **continuous** steps, pays off.

## 1. Pareto analysis of support tickets

We counted the bug tickets that reached a web application's support desk in a month, by category. According to the **Pareto principle**, most of the problems (about 80%) are caused by few causes (about 20%). Let's see whether that's true here:

```python run
# Pareto analysis: bug tickets by category, descending order and cumulative percentage
tickets = {"login": 46, "payment": 31, "slow page": 12, "e-mail notification": 9,
           "mobile display": 7, "translation error": 5, "export": 3, "other": 7}

total = sum(tickets.values())
cumulative = 0
print(f"{'category':<22}{'count':>6}{'cumulative':>12}")
for name, count in sorted(tickets.items(), key=lambda t: -t[1]):
    cumulative += count
    marker = "  ← start here" if cumulative - count < 0.8 * total else ""
    print(f"{name:<22}{count:>6}{cumulative / total:>11.0%}{marker}")
```

Of the 8 categories the first two (login, payment) are **64%** of the tickets, the first four already 82%. If the team concentrates on login and payment bugs, it can eliminate a good two-thirds of the complaints – much more efficiently than by spreading its effort evenly. (Note: the count isn't everything; a rare but severe bug – e.g. data loss – can move forward if we multiply by a **weight**.) The next step is the **5 whys** method on the largest category: why can't users log in?

## 2. Value stream: where does the time go?

The path of a new feature from request to release. At each step we measured the **actual work time** and the **waiting** (queueing, waiting for approval):

```python run
# Value stream map in numbers: work time and waiting per step (in hours)
steps = [("refining the request", 2, 30), ("development", 16, 8), ("code review", 1, 20),
         ("testing", 4, 40), ("approval", 0.5, 60), ("release", 0.5, 24)]

work = sum(w for _, w, _ in steps)
waiting = sum(q for _, _, q in steps)
lead_time = work + waiting
print(f"work time: {work} hours, waiting: {waiting} hours, lead time: {lead_time} hours")
print(f"process efficiency (work / lead time): {work / lead_time:.0%}")

# Improvement: the queue before approval and testing is halved
improved = sum(q / 2 if name in ("approval", "testing") else q for name, _, q in steps)
print(f"after improvement: lead time {work + improved} hours, efficiency {work / (work + improved):.0%}")
```

Of the 206-hour lead time only 24 hours are **real work** – process efficiency is 12%. That's typical: in most processes most of the time goes on **waiting**, not work. That's why Lean looks for waiting first among the seven wastes: if we halve the two longest queues, the lead time drops to 156 hours without anyone working faster. (That's why automated testing and deployment – CI/CD – spread: it cuts out exactly the waiting.)

## 3. Six Sigma: what is that 3.4?

The goal of Six Sigma is for a process to make **at most 3.4 defects per million opportunities** (DPMO). The sigma level shows how many standard deviations the process mean is from the tolerance limit; in practice a long-term "drift" of 1.5 sigma is assumed:

```python run
# Six Sigma: sigma level ↔ defects per million opportunities (with a 1.5 sigma shift)
from statistics import NormalDist

norm = NormalDist()                       # standard normal distribution
for level in [2, 3, 4, 5, 6]:
    dpmo = (1 - norm.cdf(level - 1.5)) * 1_000_000
    print(f"{level} sigma: {dpmo:>10.1f} defects / million opportunities, yield {1 - dpmo / 1e6:.4%}")

# A real process: 50,000 orders, each with 4 defect opportunities, 120 defects
dpmo = 120 / (50_000 * 4) * 1_000_000
print(f"\norder process: DPMO = {dpmo:.0f}, sigma level ≈ {norm.inv_cdf(1 - dpmo / 1e6) + 1.5:.2f}")
```

A 3-sigma process makes about 66,800 defects per million (93.3% good), a 6-sigma one only 3.4. A software ordering process with a DPMO of 600 is at about 4.7 sigma. The sigma level is a **common language**: the quality of different processes (manufacturing, customer service, IT) becomes comparable.

```plot
title: A process's distribution and the ±3 tolerance limit
x: -6, 6
y: 0, 0.8
param: s = 1, 0.5, 2, 0.05
f: e^(-(x^2)/(2*s^2))/(s*sqrt(2*pi)) # the process's distribution
point: -3, 0 # lower tolerance limit
point: 3, 0 # upper tolerance limit
```

Reduce the standard deviation ($s$): the curve narrows, and less and less falls outside the tolerance limits. That's exactly the essence of Six Sigma: **reducing variation**.

## 4. PDCA: small improvements add up

The PDCA cycle (plan – do – check – act) brings small, controlled improvements. If each cycle reduces the defect rate by only 15%, what happens in a year?

```python run
# PDCA: each monthly cycle reduces the defect rate by 15% (multiplicative effect)
defect_rate = 0.08                    # initially 8% of orders are defective
for month in range(1, 13):
    defect_rate *= 1 - 0.15           # the effect of one cycle
    if month % 3 == 0:
        print(f"after month {month:>2}: {defect_rate:.2%}")
print(f"in a year defects fell by {1 - defect_rate / 0.08:.0%}")
```

Twelve small steps together bring an **86%** reduction – the improvements multiply. That's the Kaizen mindset: not one big, risky transformation, but continuous, measurable small improvements.

## Summary

- Pareto analysis: sort in descending order, compute the cumulative percentage, and start with the few causes that give 80%.
- Process efficiency = work time / lead time; the biggest reserve is usually reducing waiting.
- Six Sigma: 6 sigma = 3.4 DPMO; improving quality means reducing variation.
- PDCA's small improvements multiply: 12 × 15% reduction ≈ 86% fewer defects.

## Lesson exercise

```quiz required
? In a process the work time is 6 hours and the waiting is 54 hours. What is the process efficiency (%)?
= 10
! $6 / (6 + 54) = 0.1 = 10\%$.

? In 10,000 units, with 5 defect opportunities per unit, 25 defects were found. What is the DPMO?
= 500
! $\frac{25}{10{,}000 \cdot 5} \cdot 1{,}000{,}000 = 500$.

? What is the practical use of Pareto analysis?
- we fix all bugs at once
+ it shows the few causes responsible for most of the problems, so we start improving there
- it reduces the number of bugs to zero
- it finds the rarest bugs
! About 20% of causes are responsible for about 80% of problems.

? If two PDCA cycles each reduce the number of defects by 50%, by what percentage do they fall in total?
= 75
! $0.5 \cdot 0.5 = 0.25$ remains, so the reduction is 75%.

? What does Six Sigma mean for the process's distribution?
- the process mean increases
+ reducing variation so that almost nothing falls outside the tolerance limits
- narrowing the tolerance limits
- reducing the number of measurements
! Smaller variation → fewer defects.
```
