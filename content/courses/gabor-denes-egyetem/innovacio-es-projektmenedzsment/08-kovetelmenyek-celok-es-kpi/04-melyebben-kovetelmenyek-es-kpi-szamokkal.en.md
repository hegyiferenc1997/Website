---
title: Deeper – Requirements and KPIs in Numbers
summary: MoSCoW prioritisation with a capacity limit (why the "value/effort" order isn't always the best – the knapsack problem), checking the achievability of a SMART goal with the required growth rate, a KPI card and RAG status with a program, and OKR scoring – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- how to choose user stories for a release under **limited capacity**,
- how to check in numbers whether a SMART goal is **achievable** (the letter A),
- how the machine computes a **green–amber–red** status from a KPI,
- how an **OKR** is scored, and why 0.7 is good.

## 1. MoSCoW and capacity: the knapsack problem

The next release can hold 20 story points of work. The **Must** stories go in no matter what; for the remaining space we pick **Should** and **Could** stories so as to get the greatest possible **business value**. First idea: sort them by value/effort ratio, and take whatever still fits (the greedy method).

```python run
# MoSCoW + capacity: which Should/Could story should still fit into the release?
import itertools

stories = [  # (name, MoSCoW, story points, business value)
    ("login", "M", 5, 10), ("course list", "M", 5, 8),
    ("notifications", "S", 6, 9), ("search", "S", 5, 7), ("calendar sync", "C", 5, 7),
    ("profile picture", "C", 2, 1), ("chat", "W", 13, 9),
]
capacity = 20
must = [s for s in stories if s[1] == "M"]
candidates = [s for s in stories if s[1] in "SC"]           # Won't can't come in this release
free = capacity - sum(s[2] for s in must)
print(f"free capacity after the Must stories: {free} points")

# 1) greedy: descending value/effort order, whatever fits
greedy, space = [], free
for s in sorted(candidates, key=lambda s: -s[3] / s[2]):
    if s[2] <= space:
        greedy.append(s)
        space -= s[2]
print(f"greedy choice: {[s[0] for s in greedy]}, value {sum(s[3] for s in greedy)}")

# 2) trying every combination (fast with few stories)
best = max((c for r in range(len(candidates) + 1) for c in itertools.combinations(candidates, r)
            if sum(s[2] for s in c) <= free), key=lambda c: sum(s[3] for s in c))
print(f"optimal choice: {[s[0] for s in best]}, value {sum(s[3] for s in best)}")
```

The greedy method picks "notifications" with the best ratio (6 points), after which only the profile picture fits: 10 value in total. Search and calendar sync together, however, fill the 10 points exactly and give 14 value! This is the famous **knapsack problem**: the ratio order is a good rule of thumb, but not always optimal, because the "leftover space" can be wasted. With few items the machine can try all combinations ($2^n$ cases); with many items a smarter algorithm (dynamic programming) is needed. In practice, of course, the number only helps: the final decision belongs to the product owner, who also knows the dependencies and the users.

## 2. Is the SMART goal achievable?

"Grow monthly active users from 2000 to 10,000 in 12 months." Specific, measurable, time-bound – but **achievable**? Let's compute the required monthly growth rate:

```python run
# Achievability of a SMART goal: what monthly growth is needed for 2000 → 10,000 users in 12 months?
start, goal, months = 2000, 10_000, 12
g = (goal / start) ** (1 / months) - 1                  # inverting the compound interest formula
print(f"required monthly growth: {g:.1%}")

# Comparison with past data: the monthly growth rates of the last six months
past = [0.06, 0.08, 0.05, 0.07, 0.09, 0.06]
mean = sum(past) / len(past)
print(f"past average: {mean:.1%}, with this in 12 months: {start * (1 + mean) ** months:.0f} users")
```

The goal requires **14.4%** monthly growth, while the past average is 6.8% – with that there will be about 4400 users in a year, not 10,000. So with the current way of working the goal is **not achievable**: either something new has to be done (e.g. university partnerships), or the goal has to be made more realistic. The "A" of SMART can thus be checked in numbers.

```plot
title: Number of users with monthly growth g (start: 2000, goal: 10,000)
x: 0, 12
y: 0, 14000
param: g = 0.068, 0.02, 0.2, 0.002
f: 2000*(1 + g)^x # users
dash: 10000 # goal
```

Set the slider to 0.144: the curve reaches the goal line exactly in month 12.

## 3. KPI card and RAG status

A number isn't enough for a KPI: it needs a **target**, a **direction** (is more better, or less?) and a **tolerance**. From these the machine assigns a colour automatically:

```python run
# KPI card: actual value relative to the target, by direction and tolerance → green / amber / red
kpis = [  # (name, actual, target, "up" = more is better / "down" = less is better)
    ("monthly active users", 4200, 4000, "up"),
    ("page load (ms)", 1150, 1000, "down"),
    ("open critical bugs", 9, 3, "down"),
    ("sign-up conversion (%)", 3.6, 4.0, "up"),
]

def status(actual, target, direction, tolerance=0.10):
    achievement = actual / target if direction == "up" else target / actual   # above 1 = better than target
    if achievement >= 1:
        return achievement, "GREEN"
    return achievement, "AMBER" if achievement >= 1 - tolerance else "RED"

for name, actual, target, direction in kpis:
    a, colour = status(actual, target, direction)
    print(f"{name:<29} {actual:>6} (target {target:>5}) → {a:5.0%}  {colour}")
```

For "less is better" indicators (load time, bugs) you have to divide the other way round – a common mistake in hand-kept spreadsheets. The RAG status is good for making it **immediately** visible in the management report where attention is needed: here the number of critical bugs is red, so start with that.

## 4. OKR scoring

With **OKRs** (Objectives and Key Results) each key result is scored between 0 and 1, and the objective's score is the average. According to the approach popular at Google, **0.6–0.7** is a "good" result: if it always comes out as 1.0, the goals were too comfortable.

```python run
# OKR: key result achievement between 0 and 1, the objective's score is the average
objective = "Make the study app the students' favourite"
key_results = [  # (description, baseline, achieved, target)
    ("monthly active users", 2000, 4200, 5000),
    ("app store rating", 3.9, 4.4, 4.6),
    ("weekly return rate (%)", 20, 31, 40),
]
scores = []
for desc, baseline, achieved, target in key_results:
    s = min(1.0, max(0.0, (achieved - baseline) / (target - baseline)))   # share of the distance covered
    scores.append(s)
    print(f"{desc:<27}: {s:.2f}")
print(f"\nscore of \"{objective}\": {sum(scores) / len(scores):.2f}")
```

The score measures the **distance covered** from the baseline to the target, not the ratio to the target value: a rating of 4.4 would be 96% of the 4.6 target, but starting from 3.9 we've covered only 71% of the way. That's a fairer picture of progress.

## Summary

- With a capacity limit, choosing stories is a knapsack problem: the value/effort order is a good approximation, but not always optimal.
- The achievability of a growth goal can be checked with the required rate: $g = (\text{goal} / \text{start})^{1/n} - 1$, compared with past data.
- A KPI's status needs a target, a direction and a tolerance; for "less is better" indicators we divide the other way round.
- OKR score = the share of the distance covered per key result, averaged; 0.6–0.7 is a good result.

## Lesson exercise

```quiz required
? Free capacity: 8 points. Stories (points, value): X (5, 8), Y (4, 5), Z (4, 5). What is the largest achievable total value?
= 10
! Y + Z = 8 points, 10 value; after X, with its better ratio, nothing else would fit (8 value).

? For a goal the number of users has to quadruple in 2 years. What yearly growth (%) is needed?
= 100
! $\sqrt{4} - 1 = 1 = 100\%$ a year (2 · 2 = 4).

? The page load target is 800 ms, the actual is 1000 ms. What is the achievement in % (less is better)?
= 80
! $800 / 1000 = 0.8 = 80\%$.

? An OKR key result: baseline 20, target 60, achieved 50. What is its score?
= 0,75
= 0.75
! $(50 - 20) / (60 - 20) = 30 / 40 = 0.75$.

? Why is it suspicious if a team's OKR score is 1.0 every quarter?
- because the score can't be 1.0
+ because they probably set too comfortable, not ambitious enough goals
- because OKRs are only for individual goals
- because key results can't be measured
! With OKRs 0.6–0.7 counts as a good result.
```
