---
title: Deeper – Risk, Quality and Resources with a Program
summary: Ranking a risk register and setting a reserve with expected values, a decision tree with EMV (build or buy?), a control chart for quality control of response times, and a resource histogram and levelling on a small team's daily workload – with small programs.
minutes: 45
---

## What you will learn in this lesson

- how to **rank** risks, and how big a **reserve** to set aside for them,
- how to decide between two uncertain options with a **decision tree**,
- how to recognise on a **control chart** that a process has "gone out of control",
- how to spot and resolve **resource overload**.

## 1. Risk register and reserve

For every risk we estimate the **probability** and the **impact** (here in million Ft). The product is the **expected monetary value** (EMV); its sum is a good starting point for the risk (contingency) reserve:

```python run
# Risk register: probability × impact = expected value (EMV), ranking and reserve
risks = [  # (id, description, probability, impact in million Ft)
    ("R1", "key developer leaves", 0.2, 8.0),
    ("R2", "the external API's price goes up", 0.4, 3.0),
    ("R3", "data migration finds faulty data", 0.6, 4.0),
    ("R4", "security audit finds a severe flaw", 0.3, 6.0),
    ("R5", "cloud price drops (opportunity!)", 0.5, -2.0),
]
for rid, desc, p, impact in sorted(risks, key=lambda r: -abs(r[2] * r[3])):
    print(f"{rid} {desc:<38} {p:>4.0%} × {impact:>5.1f} = {p * impact:>5.2f} M Ft")

reserve = sum(p * impact for _, _, p, impact in risks)
print(f"\nrisk reserve (sum of the EMVs): {reserve:.2f} M Ft")
```

The risk with the largest expected value here is the faulty data migration (2.4 M Ft) – not the one with the largest impact (the departing developer), but the **most likely** one. The negative impact is an **opportunity** (positive risk): it reduces the reserve needed. The sum of the expected values (6 M Ft) is a good reserve because some risks occur and others don't; the many small pieces of "luck" and "bad luck" balance out on average. (If there's a single huge risk, this doesn't work – that one is better **transferred**, e.g. through insurance or a contract.)

## 2. Decision tree: build or buy?

A student records module can be obtained by in-house development or by buying a ready-made product. Both involve uncertainty:

```python run
# Decision tree: the expected cost of each branch = Σ probability × outcome; we choose the smaller (million Ft)
decisions = {
    "build in-house": [(0.6, 20), (0.3, 28), (0.1, 45)],     # goes well / slips / slips badly
    "buy a product":  [(0.8, 25), (0.2, 33)],                # customisation is enough / extra integration needed
}
for name, branches in decisions.items():
    emv = sum(p * cost for p, cost in branches)
    worst = max(cost for _, cost in branches)
    print(f"{name:<15}: expected cost {emv:5.1f} M Ft, worst case {worst} M Ft")
```

The expected cost of building (24.9 M Ft) is slightly lower than buying (26.6 M Ft) – so by expected value it's worth building. But the worst case is 45 million versus 33! A risk-averse organisation (or a small company that a 45 million project could ruin) may reasonably choose the more expensive but more **predictable** product. The decision tree doesn't decide for us, but it makes clear what we're "buying" with the extra money: certainty.

## 3. Control chart: quality control

We measure a web service's average response time every day. The **control chart** (Shewhart chart) draws the limits of mean ± 3 standard deviations from the data of a stable period; anything outside them is a sign of a **special cause** and must be investigated:

```python run
# Control chart: limits from a stable period (mean ± 3 standard deviations), checking new measurements
from statistics import mean, stdev

stable = [212, 205, 198, 220, 210, 207, 215, 202, 209, 213, 204, 211]   # ms, the reference period
centre = mean(stable)
s = stdev(stable)
lower, upper = centre - 3 * s, centre + 3 * s
print(f"centre line {centre:.1f} ms, control limits: {lower:.1f} – {upper:.1f} ms\n")

new = [208, 214, 203, 236, 211, 219, 221, 223, 225]
for day, value in enumerate(new, 1):
    flag = "  ← outside the limits: investigate!" if not lower <= value <= upper else ""
    print(f"day {day}: {value} ms {'█' * ((value - 190) // 2)}{flag}")
```

The spike on day 4 (236 ms) is outside the limits – a bad deployment or an overloaded database might have caused it. Look at days 6–9 too: none crosses the limit, but **four consecutive** values keep rising, all above the mean. In practice there are rules for such **trends** too (e.g. seven consecutive points on one side of the centre line), because a slowly deteriorating process needs intervention just the same. The control chart is a tool of **QC** (quality control); **QA** (quality assurance) works on keeping the process this way in the first place.

## 4. Resource histogram and levelling

The daily workload (in hours) of three developers based on the task schedule. Above 8 hours a day there's overload:

```python run
# Resource histogram: daily workload per person; resolving overload by shifting a task
tasks = [  # (name, who, start day, number of days, hours/day, float days)
    ("backend API", "Bence", 1, 4, 6, 0), ("database migration", "Bence", 2, 2, 4, 3),
    ("UI components", "Csilla", 1, 5, 7, 0), ("documentation", "Dávid", 1, 3, 4, 2),
    ("writing tests", "Dávid", 3, 3, 5, 0),
]

def histogram(tasks, days=7):
    load = {}
    for _, who, start, length, hours, _ in tasks:
        for day in range(start, start + length):
            load.setdefault(who, [0] * (days + 1))[day] += hours
    for who, hours in load.items():
        row = " ".join(f"{h:>2}{'!' if h > 8 else ' '}" for h in hours[1:])
        print(f"{who:<7}| {row}")

print("original schedule (hours/day, ! = overload):")
histogram(tasks)

# Levelling: the migration (3 days of float) is shifted after the backend, to day 5
tasks[1] = ("database migration", "Bence", 5, 2, 4, 0)
print("\nafter levelling:")
histogram(tasks)
```

On days 2–3 Bence would work 10 hours. Since the migration has 3 days of float, we shift its start after the backend: the overload disappears, and the project deadline doesn't slip either (**resource smoothing**). Dávid's 9 hours on day 3 remain – the tests have no float, and shifting the documentation by 1 or 2 days only moves the clash to the following days; here we have to decide: overtime, splitting the task, or a one-day slip (**resource levelling**, which may change the deadline too). PM tools' "automatic levelling" also offers this trade-off only as a suggestion.

## Summary

- A risk's expected value = probability × impact; the sum is a good starting point for the risk reserve, and opportunities reduce it.
- The decision tree shows both the expected cost and the worst case; risk tolerance decides which matters more.
- The control chart (mean ± 3 standard deviations) signals special causes; trends must be watched too.
- The resource histogram shows overload; we first try to resolve it by shifting within the float (smoothing).

## Lesson exercise

```quiz required
? A risk's probability is 25%, its impact 12 million Ft. What is its expected value (million Ft)?
= 3
! $0.25 \cdot 12 = 3$.

? A branch of a decision tree: a cost of 10 million Ft with 70% chance, 20 million with 30%. What is the expected cost?
= 13
! $0.7 \cdot 10 + 0.3 \cdot 20 = 7 + 6 = 13$.

? A process's mean is 50, its standard deviation 4. Where is the upper control limit (mean + 3 standard deviations)?
= 62
! $50 + 3 \cdot 4 = 62$.

? What does it mean if a point on the control chart falls outside the limits?
- the measurement is certainly wrong
+ a special cause probably affected the process, it must be investigated
- the limits must be widened
- the process's quality has improved
! Variation within the limits is normal, random variation; a spike is a sign of a special cause.

? What's the difference between resource smoothing and levelling?
+ smoothing shifts tasks only within their float (the deadline stays), levelling may change the deadline too
- smoothing hires new people
- levelling happens only at weekends
- there's no difference
! Smoothing doesn't affect the critical path.
```
