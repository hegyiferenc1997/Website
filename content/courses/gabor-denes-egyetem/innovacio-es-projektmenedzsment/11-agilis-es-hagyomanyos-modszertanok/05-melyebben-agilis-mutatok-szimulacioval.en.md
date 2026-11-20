---
title: Deeper – Agile Metrics by Simulation
summary: A burndown chart from daily data with a program, a release forecast from the team's velocity by Monte Carlo simulation ("when will we be done with 85% certainty?"), Little's law and the effect of a WIP limit on an interactive chart, and a comparison of the value curves of incremental and waterfall-style delivery.
minutes: 40
---

## What you will learn in this lesson

- how a **burndown chart** is made and what it shows,
- how to give a **probabilistic** forecast of the release date from the team's velocity,
- why a **WIP limit** reduces lead time (Little's law),
- why the same work is worth more when delivered **incrementally**.

## 1. Burndown chart

In a 10-working-day sprint the team committed to 40 story points. At the end of each day we record how much work remains; the **ideal line** shows even progress:

```python run
# Burndown chart: remaining story points per day, compared with the ideal line
commitment, days = 40, 10
remaining = [40, 38, 38, 33, 30, 30, 24, 18, 13, 6, 0]     # day 0 (start) and the end of the 10 working days

for day, r in enumerate(remaining):
    ideal = commitment * (1 - day / days)
    bar = "█" * (r // 2)
    flag = "  ← behind" if r - ideal >= 6 else ""
    print(f"day {day:>2} | {r:>2} points (ideal {ideal:4.0f}) {bar}{flag}")
```

In the first half of the sprint the team fell behind (on day 5, 30 points remained instead of 20) – a typical sign that there was a lot of uncertainty at the start of the tasks, or that a big story was built "in one piece" and only reached "done" at the end. That's why it's worth slicing stories **small**: the burndown shows a true picture when work arrives evenly, in many small pieces. At the Daily Scrum this chart is the simplest early warning.

## 2. When will we be done? Forecasting from velocity

The backlog holds 120 story points of work. The velocity of the last six sprints: 18, 22, 15, 25, 20, 19 points. Using the average ($\approx 19.8$) it's about 6.1 sprints – but velocity fluctuates! With **Monte Carlo simulation** we play out many possible futures by drawing randomly from the past velocities:

```python run
# Release forecast: how many sprints for 120 points, if the velocity is a random one of the past values?
import random

random.seed(5)                                 # fixed randomness, so the same comes out every time
past = [18, 22, 15, 25, 20, 19]
backlog, runs = 120, 10_000
result = []
for _ in range(runs):
    left, sprints = backlog, 0
    while left > 0:
        left -= random.choice(past)            # one sprint: a randomly chosen past velocity
        sprints += 1
    result.append(sprints)

for n in sorted(set(result)):
    print(f"{n} sprints: {result.count(n) / runs:5.1%}   (at most this many: {sum(r <= n for r in result) / runs:5.1%})")
```

The result isn't a single number but a distribution: we finish within the 6 sprints given by the average with only **about a 46%** chance, but within 7 sprints already with about 99% certainty. If the customer asks for a deadline, it's worth committing to the 85% level (here 7 sprints), not the average. That's much more honest than a "precise" date, and it gets more accurate as the sprints go by.

## 3. Little's law and the WIP limit

**Little's law**: in a stable process

$$
\text{average lead time} = \frac{\text{work in progress (WIP)}}{\text{throughput}}.
$$

```python run
# Little's law: lead time = WIP / throughput (the team finishes 5 tickets a week)
throughput = 5                                 # finished tickets / week
for wip in [5, 10, 15, 20, 30]:
    print(f"WIP {wip:>2} tickets → average lead time {wip / throughput:4.1f} weeks")
```

If the team "works" on 30 things at once, a ticket is in progress for 6 weeks on average; if it limits WIP to 10, it finishes each ticket in **2 weeks** with the same capacity. The work doesn't get smaller, but the queue of half-done things disappears – and switching between many parallel tasks actually reduces throughput too. Hence the Kanban motto: "**Stop starting, start finishing!**"

```plot
title: Average lead time (weeks) as a function of WIP
x: 1, 30
y: 0, 15
param: t = 5, 2, 10, 0.5
f: x/t # lead time = WIP / throughput
```

Increase the throughput ($t$): the line gets flatter. But you can get the same effect for free: by reducing WIP you move left along the line.

## 4. Incremental vs. waterfall: when does the value arrive?

A 6-month development contains 6 features of roughly equal value. With waterfall all of them go live at the end of month 6; incrementally one goes out each month. If a live feature brings 1 unit of benefit a month, how much benefit accumulates in the first year?

```python run
# Timing of value: waterfall (everything at the end of month 6) vs. incremental delivery (one feature a month)
features, months = 6, 12

def first_year_benefit(release_months):
    # every feature brings 1 unit of benefit a month from the month after its release
    return sum(months - r for r in release_months)

waterfall = first_year_benefit([6] * features)
incremental = first_year_benefit(range(1, features + 1))
print(f"waterfall: {waterfall} units, incremental: {incremental} units ({incremental / waterfall - 1:+.0%})")
```

Same work, same time – yet incremental delivery brings **about 42%** more benefit in the first year, because the first features start working months earlier. On top of that, early releases bring **feedback**: if it turns out nobody needs feature 4, it doesn't even have to be built. (Waterfall has its place too: if the product is only usable as a whole – e.g. an aircraft's control software – partial delivery brings no benefit.)

## Summary

- The burndown shows the remaining work relative to the ideal line; with small stories it gives a true picture.
- For the release date we give a probabilistic forecast by Monte Carlo simulation (e.g. the 85% level), not a single date.
- Little's law: lead time = WIP / throughput; a WIP limit shortens lead time for free.
- Incremental delivery starts producing value earlier, and gives feedback.

## Lesson exercise

```quiz required
? A team finishes 4 tickets a week, and on average 12 tickets are in progress at once. What is the average lead time (weeks)?
= 3
! Little's law: $12 / 4 = 3$.

? The backlog is 90 points, the team's average velocity is 18 points/sprint. How many sprints are needed using the average?
= 5
! $90 / 18 = 5$.

? What is worth committing to as a deadline from the Monte Carlo forecast?
- the best case
- the average, because it's the most likely
+ a high certainty level (e.g. 85%), because we'd meet the average only in about half the cases
- the worst case, because that's certain
! A deadline set at the average is roughly a coin toss.

? In a 10-day, 50-point sprint, what is the ideal remaining work at the end of day 4?
= 30
! $50 \cdot (1 - 4/10) = 30$.

? Why does a WIP limit reduce lead time if the team's capacity doesn't change?
- because the team types faster
+ because less half-done work queues up, so each ticket gets through the process sooner
- because fewer tickets go into the backlog
- because the tickets get smaller
! Lead time = WIP / throughput: smaller WIP → shorter lead time.
```
