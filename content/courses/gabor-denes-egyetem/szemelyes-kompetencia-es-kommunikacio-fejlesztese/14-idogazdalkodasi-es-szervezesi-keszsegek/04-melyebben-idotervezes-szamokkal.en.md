---
title: Deeper – Time Planning with Numbers
summary: The planning fallacy and your own estimates' correction factor, calculating weekly capacity and buffer, how task order matters (shortest first or nearest deadline first?), and planning an exam period from three viewpoints – with small programs and an interactive chart.
minutes: 40
---

## What you will learn in this lesson

- what the **planning fallacy** is, and how to improve your own estimates with data,
- how to calculate how much **free capacity** you have in a week, and how much buffer you need,
- how the **order** of tasks affects how late you are,
- how to plan an **exam period** realistically.

## 1. The planning fallacy and the correction factor

Daniel Kahneman and Amos Tversky described the **planning fallacy**: we regularly underestimate how long a task will take – even when we know that previous similar tasks also took longer. The good news: this bias is **measurable and correctable**. For a few weeks, write down how long you estimated a task would take and how long it really took:

```python run
# Planning fallacy: the correction factor of your own estimates from past data
from statistics import median

log = [  # (task, estimate in hours, actual time in hours)
    ("programming homework 1", 2, 3.5),
    ("database practice set", 3, 4.5),
    ("preparing a presentation", 4, 6),
    ("maths worksheet", 2, 2.5),
    ("essay assignment", 5, 9),
    ("compiling exam notes", 3, 4.5),
]
ratios = [actual / estimate for _, estimate, actual in log]
factor = median(ratios)                        # the median is less sensitive to outliers
print("ratios:", [round(r, 2) for r in ratios])
print(f"correction factor (median): {factor:.2f}\n")

new_tasks = [("networks lab report", 3), ("thesis topic ideas", 2)]
for name, estimate in new_tasks:
    print(f"{name:<30} estimate {estimate} h → realistic plan: {estimate * factor:.1f} h")
```

According to your log, your tasks take about **1.5 times** the estimated time. That's not a character flaw – everyone works like this – but if you know it, you can **build it into** your plan. This is called the "outside view": don't ask how long you think it will take, but how long **similar tasks took**.

> Why the median and not the mean? A single outlier (e.g. when your computer broke during the assignment) would pull the mean a lot. The median shows the "typical" ratio.

## 2. How much time do I really have? Weekly capacity

A week has 168 hours, but a lot of it is **committed**: sleep, classes, travel, meals, work. Let's calculate how much remains for studying and projects – and how much of it is worth actually planning:

```python run
# Weekly capacity: subtracting committed time, buffer, and comparing with planned tasks
week = 7 * 24
committed = {"sleep": 7 * 7.5, "classes and labs": 22, "travel": 8, "meals, household": 14,
             "part-time job": 20, "sport, rest, friends": 16}
free = week - sum(committed.values())
buffer_share = 0.2                             # for the unexpected
plannable = free * (1 - buffer_share)
print(f"committed: {sum(committed.values())} h, free: {free} h, plannable (with 20% buffer): {plannable:.1f} h")

factor = 1.5                                   # your own correction factor
tasks = {"programming homework": 4, "database project": 6, "maths practice": 3, "essay": 4, "exam prep": 5}
need = sum(tasks.values()) * factor
print(f"estimated task time: {sum(tasks.values())} h, corrected: {need:.1f} h")
print("✓ it fits" if need <= plannable else f"⚠ overcommitted: {need - plannable:.1f} h more than the capacity")
```

By the estimate, the 22 hours of tasks fit comfortably into the 28.4 plannable hours – but taking the correction factor into account, the real need is **33 hours**, which is **4.6 hours more** than you have. You then have three options: **drop** something (which is least important? – the Eisenhower matrix), **reduce** the scope (good, not perfect), or **move** something to another week. The bad solution is taking the time from rest and sleep – that backfires in the following weeks.

## 3. Does the order matter?

You have three assignments, each with a different length and deadline. In what order should you do them? Two classic scheduling rules:

- **SPT** (shortest processing time): the **shortest** task first – so as many tasks as possible are done as early as possible (small average completion time).
- **EDD** (earliest due date): the **nearest deadline** first – so the largest lateness is as small as possible.

```python run
# Scheduling: shortest first (SPT) vs earliest due date first (EDD)
tasks = [  # (name, duration in days, deadline: on which day it is due)
    ("essay", 4, 5),
    ("lab report", 1, 7),
    ("project documentation", 3, 4),
    ("practice set", 2, 9),
]

def evaluate(order):
    time, lateness, completions = 0, [], []
    for name, length, deadline in order:
        time += length
        completions.append(time)
        lateness.append(max(0, time - deadline))
    return sum(completions) / len(completions), max(lateness), sum(1 for l in lateness if l > 0)

for name, key in [("SPT (shortest first)", lambda t: t[1]), ("EDD (deadline first)", lambda t: t[2])]:
    order = sorted(tasks, key=key)
    avg, max_late, late_count = evaluate(order)
    print(f"{name:<22} {' → '.join(t[0] for t in order)}")
    print(f"{'':<22} average completion time: {avg:.1f} days, largest lateness: {max_late} days, late tasks: {late_count}")
```

With SPT the small tasks come off the list quickly (that's **motivating**), and the average completion time is smaller too – but the essay is **5 days** late. With EDD three tasks are late, but none by more than **2 days** – if a big delay has serious consequences (e.g. the assignment isn't accepted at all), that matters more. The lesson: the order **depends on the goal**. For deadline-driven work EDD is a good default; if there are no hard deadlines and momentum matters, SPT helps. You can also see: if all the tasks don't fit within the deadlines, no order helps – scheduling only distributes lateness, it can't eliminate it. Then you need to renegotiate the deadline or narrow the scope.

## 4. One exam period, three viewpoints

You have four exams in three weeks. How should you plan?

| Viewpoint                              | What does it say?                                                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **"Nearest exam first"** (EDD)         | Always study for the nearest one. Simple, but the material for later, hard exams is left to the last days.                                          |
| **By capacity and difficulty**         | Estimate the hours each exam needs (with the correction factor!), and spread them backwards from the exam days; start the hard subject early.       |
| **The science of learning** (topic 15) | Don't study one subject in a "block" for days: spaced repetition and switching between subjects (interleaving) give better results in the long run. |

In practice a **combination** of the three works best: the capacity calculation tells you whether everything fits; you start the hard subjects early; you split days between two or three subjects; and you keep the last day before an exam for **revising** that subject. The **chart** shows how much time a given amount of material needs depending on the correction factor:

```plot
title: Study time needed (hours) as a function of the estimated time
x: 0, 30
y: 0, 60
param: k = 1.5, 1, 2.5, 0.1
f: k*x # corrected (realistic) time
f: x # the original estimate
dash: 40 # hours set aside for the exam period
```

If you estimated 25 hours, with a factor of 1.5 the realistic need is 37.5 hours – that still fits into 40 hours. With a factor of 2, however, you'd need 50 hours: then you have to **start earlier**.

## Summary

- The planning fallacy is measurable: the median of past actual-to-estimated ratios is your correction factor; multiply your estimates by it.
- Weekly capacity = 168 hours − committed time; leave about 20% of it as buffer, and compare it with the corrected task need.
- Order matters: shortest first (SPT) minimises the average completion time, earliest due date first (EDD) minimises the largest lateness.
- When planning an exam period, the capacity calculation, starting hard subjects early and spaced repetition work together.

## Lesson exercise

```quiz required
? For three earlier tasks your estimates were 2, 4 and 5 hours, and the actual times 3, 6 and 7.5 hours. What is your correction factor (the median of the three ratios)? (as a decimal)
= 1,5
= 1.5
! All three ratios are $1.5$, so the median is $1.5$ too.

? With the same factor, how much time should you plan for a task estimated at 6 hours (in hours)?
= 9
! $6 \cdot 1.5 = 9$ hours.

? You have 30 hours of free time in a week and leave a 20% buffer. How many hours can you plan for tasks?
= 24
! $30 \cdot 0.8 = 24$ hours.

? Three tasks: 1, 2 and 3 days long, with no deadline. Which order gives the smallest average completion time?
+ 1 → 2 → 3 days (shortest first)
- 3 → 2 → 1 days (longest first)
- 2 → 3 → 1 days
- it doesn't matter, they're all the same
! Completions: 1, 3, 6 → average 3.33 days; reversed 3, 5, 6 → average 4.67 days.

? The corrected task need is 12 hours more than your weekly capacity. Which is the worst solution?
- dropping a less important task
- narrowing the scope
- moving a task to next week
+ taking the missing time from sleep and rest
! That backfires in the following weeks: when tired you work slower and worse.
```
