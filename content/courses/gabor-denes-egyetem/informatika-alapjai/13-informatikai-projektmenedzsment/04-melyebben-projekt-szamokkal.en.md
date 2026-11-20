---
title: Deeper – A Project in Numbers
summary: Computing the critical path with a program, three-point (PERT) estimation and Monte Carlo simulation of the chance of meeting a deadline, forecasting from sprint velocity, and why a new team member doesn't always speed things up (Brooks's law) – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how a program computes the **critical path** and the slack,
- how to estimate **uncertain** durations, and how likely a deadline is to be met,
- how to forecast completion from the team's **velocity**,
- why bringing in new people can **slow down** a late project.

## 1. The critical path by program

In the basic lesson we computed the critical path by hand. A real project has dozens of tasks – that's a job for the computer. The idea: every task's **earliest finish** = the latest finish among its prerequisites + its own duration. Going backwards we also get the **latest** times; where the two are equal there's no slack – that's the critical path.

```python run
# Critical path: forward and backward pass, slack
tasks = {  # name: (duration in days, prerequisites)
    "requirements": (3, []),
    "database design": (4, ["requirements"]),
    "UI design": (2, ["requirements"]),
    "backend": (6, ["database design"]),
    "frontend": (5, ["UI design"]),
    "integration": (2, ["backend", "frontend"]),
    "testing": (3, ["integration"]),
}

# forward: earliest finish (the dict order already respects the dependencies)
early = {}
for name, (dur, prereqs) in tasks.items():
    early[name] = max((early[p] for p in prereqs), default=0) + dur
project = max(early.values())

# backward: latest finish
late = {name: project for name in tasks}
for name in reversed(list(tasks)):
    for nxt, (dur, prereqs) in tasks.items():
        if name in prereqs:
            late[name] = min(late[name], late[nxt] - dur)

print(f"project length: {project} days")
for name in tasks:
    slack = late[name] - early[name]
    print(f"{name:<16} earliest finish: day {early[name]:>2}, slack: {slack} days {'← CRITICAL' if slack == 0 else ''}")
```

**Every** day of delay on the critical path delays the project too; the UI design and the frontend, however, can slip 3 days without consequences. From the project manager's **viewpoint**, this tells where the best people and the most attention should go.

## 2. Uncertain estimates: PERT and Monte Carlo

"How long will the backend take?" – instead of one number, **three** are better: optimistic ($o$), most likely ($m$), pessimistic ($p$). The **PERT** estimate computes a weighted average from them:

$$t = \frac{o + 4m + p}{6}$$

But how likely is the whole project to finish by a given deadline? **Monte Carlo simulation** shows this most clearly: we "play out" the project many times (e.g. 10,000) with random durations, and count how often it fits:

```python run
# PERT estimate and Monte Carlo simulation for a simple sequence of tasks
import random

random.seed(7)
tasks = {"design": (3, 4, 8), "development": (8, 10, 20), "testing": (3, 4, 9)}   # (o, m, p) in days

pert = sum((o + 4 * m + p) / 6 for o, m, p in tasks.values())
print(f"total PERT estimate: {pert:.1f} days (the sum of the most likely values is only {sum(m for _, m, _ in tasks.values())} days)")

runs = 10_000
totals = sorted(sum(random.triangular(o, p, m) for o, m, p in tasks.values()) for _ in range(runs))
for deadline in [18, 21, 24, 27]:
    chance = sum(1 for t in totals if t <= deadline) / runs
    print(f"deadline {deadline} days: done with {chance:.0%} probability")
print(f"can be committed to with 85% confidence: {totals[int(0.85 * runs)]:.0f} days")
```

The lesson: the sum of the "most likely" durations (18 days) is almost certainly **too optimistic**, because delays are often bigger than gains (the pessimistic value is further away than the optimistic one). A responsible commitment states a **probability** too: "85% likely to be done within 26 days."

## 3. Forecasting from velocity

In agile teams, completion can be forecast from the **velocity** seen in the basic lesson (story points completed per sprint). Rather than a single average, it's worth giving a **range**:

```python run
# Forecasting from sprint velocity: how many sprints for the remaining work?
from math import ceil
from statistics import mean

velocities = [18, 24, 21, 15, 22]          # story points completed in past sprints
remaining = 130

avg = mean(velocities)
print(f"average velocity: {avg:.1f} points → {ceil(remaining / avg)} sprints")
print(f"at the worst sprint's pace: {ceil(remaining / min(velocities))} sprints")
print(f"at the best sprint's pace:  {ceil(remaining / max(velocities))} sprints")
```

"6–9 sprints, most likely 7" – that's more honest and more useful to the client than a precise-looking but probably wrong date.

## 4. Brooks's law: why don't more people help?

Fred Brooks's "law", formulated in 1975: **adding people to a late software project makes it later.** Two reasons:

- new people **must be trained** – which takes time from the experienced ones,
- the number of **communication channels** for $n$ people is $n(n-1)/2$, so it grows quadratically.

```plot
title: Number of communication channels as a function of team size
x: 1, 15
y: 0, 110
f: x*(x - 1)/2 # number of channels
```

```python run
# Brooks's law with a simple model: useful work as a function of team size
for n in [3, 5, 8, 12, 20]:
    channels = n * (n - 1) // 2
    coordination = 0.1 * channels                   # assumption: 2 × 5% of working time per channel (for both sides)
    useful = max(0.0, n - coordination)             # what's left of the work after coordination
    print(f"{n:>2} people: {channels:>3} channels, useful work ≈ {useful:4.1f} person-units")
```

The model is simplified (the exact numbers depend on the assumption), but the phenomenon is real: useful work grows for a while, then starts to **fall** – above a certain size a new person brings less than coordination takes away. That's why even big companies work in small (5–9 person) teams with well-separated tasks – and why, when late, it's better to cut **scope** (what can be left out of the first release?) than to add people.

| Viewpoint           | What do they watch out for in a project?                       |
| ------------------- | -------------------------------------------------------------- |
| **project manager** | critical path, risks, slack, communication with the client     |
| **developer**       | realistic estimates, few parallel tasks, a sustainable pace    |
| **client**          | when and for how much they get it, what's in the first version |
| **management**      | allocating resources across projects, business value           |

## Summary

- The critical path comes from a forward and backward pass; delays on it delay the whole project.
- The PERT estimate is $(o + 4m + p)/6$; Monte Carlo simulation shows how likely a deadline is to be met.
- Forecast a range from velocity, not a single date.
- Brooks's law: there are $n(n-1)/2$ channels, so adding people to a late project often doesn't help.

## Lesson exercise

```quiz required
? For a task, the optimistic estimate is 2, the most likely 4, the pessimistic 12 days. What is the PERT estimate (days)?
= 5
! $(2 + 4 \cdot 4 + 12) / 6 = 30 / 6 = 5$.

? Task A takes 3 days, B 5 days; C can start after both and takes 2 days. A and B can run in parallel. How many days does the project take?
= 7
! $\max(3, 5) + 2 = 7$ days; the critical path is B → C.

? How many communication channels are there in a 10-person team?
= 45
! $10 \cdot 9 / 2 = 45$.

? What does it mean if a task's slack is 0?
- the task isn't important
+ the task is on the critical path, so every delay in it delays the project too
- the task is already done
- the task can be dropped
! There's no room to manoeuvre on the critical path.

? A project is late. Which step helps least according to Brooks's law?
+ bringing in many new developers in the last weeks
- cutting scope (what can be left out of the first release)
- prioritising the critical-path tasks
- informing the client honestly
! Training and coordination take more time than the new people bring.
```
