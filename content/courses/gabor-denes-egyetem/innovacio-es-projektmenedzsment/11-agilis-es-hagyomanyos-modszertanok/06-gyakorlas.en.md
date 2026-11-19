---
title: Practice – Agile and Traditional
summary: Review questions and a summary worksheet for the eleventh topic.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. "Agile means there is no plan and no documentation." True?</summary>

No. Agile teams plan too (Product Backlog, Sprint Planning, release plan), just for shorter horizons and continuously. Documentation is written too, only "just enough", and working software is valued more.

</details>

<details>
<summary>2. What is the difference between the Sprint Review and the Sprint Retrospective?</summary>

At the Review the **product** is inspected with stakeholders (what was built, what is the feedback). At the Retrospective the team examines **how it works** (how we worked, what we improve).

</details>

<details>
<summary>3. On a Kanban board there are always many cards in the "Test" column. What does it indicate, and what would you do?</summary>

A bottleneck: testing cannot keep up. Solution: a WIP limit on development (do not produce more half-finished work), developers help with testing, automated tests.

</details>

<details>
<summary>4. A bank is developing a new mobile banking feature, but the regulator requires strict documentation. Which approach would you suggest?</summary>

A hybrid: regulatory requirements and milestones are handled traditionally (documentation, approvals), while the UI and features are developed in agile sprints with frequent user feedback.

</details>

## Summary worksheet

```quiz required
? Which is **not** a Scrum event?
- Sprint Planning
- Daily Scrum
- Sprint Retrospective
+ phase gate review
! Phase gates belong to traditional methods.

? Which Scrum role is the "servant leader" who removes impediments?
- Product Owner
+ Scrum Master
- Developers
- sponsor
! The Scrum Master supports the team.

? What is the commitment of the Scrum Increment?
- the Product Goal
- the Sprint Goal
+ the Definition of Done
- velocity
! The Increment must meet the Definition of Done.

? A team's average velocity is 25 points. There are 8 sprints left until the release and 230 points in the backlog. How many points will **not** fit?
= 30
= 30 points
! 8 · 25 = 200; 230 − 200.

? In a Kanban system the average lead time is 4 days and throughput is 3 tasks a day. According to Little's law, how many tasks are in progress on average?
= 12
! WIP = lead time · throughput = 4 · 3.

? In the V-model, which test checks that **individual modules work together**?
- unit test
+ integration test
- acceptance test
- Sprint Review
! The level belonging to architecture design.

? Which value is in the Agile Manifesto?
+ customer collaboration over contract negotiation
- documentation over working software
- processes over individuals
- following a plan over responding to change
! The item on the left is valued more.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Little's law.** Write the function `lead_time(wip, throughput)` (average lead time to 1 decimal) and the function `max_wip(target_lead_time, throughput)`, which tells the largest WIP at which the desired lead time is met!

```python starter
def lead_time(wip, throughput):
    return round(wip * throughput, 1)

def max_wip(target_lead_time, throughput):
    return target_lead_time / throughput
```

<details>
<summary>Solution</summary>

```python solution
def lead_time(wip, throughput):
    return round(wip / throughput, 1)      # lead time = WIP / throughput

def max_wip(target_lead_time, throughput):
    return target_lead_time * throughput   # the same formula rearranged
```

</details>

```python test
assert lead_time(12, 4) == 3.0
assert lead_time(30, 5) == 6.0
assert max_wip(2, 5) == 10
print("All checks passed!")
```

**2.** **Burndown.** Write the function `ideal(commitment, days)`, which gives the ideal remaining work from day 0 to day `days` (to 1 decimal, in a list), and the function `behind(commitment, remaining, threshold)`, which returns the days when the actual remaining work is at least `threshold` points above the ideal! (`remaining[0]` is day 0.)

```python starter
def ideal(commitment, days):
    return [round(commitment * (1 - day / days), 1) for day in range(days)]

def behind(commitment, remaining, threshold):
    return [day for day, r in enumerate(remaining) if r > commitment / 2]
```

<details>
<summary>Solution</summary>

```python solution
def ideal(commitment, days):
    return [round(commitment * (1 - day / days), 1) for day in range(days + 1)]   # from day 0 to the last

def behind(commitment, remaining, threshold):
    line = ideal(commitment, len(remaining) - 1)
    return [day for day, r in enumerate(remaining) if r - line[day] >= threshold]
```

</details>

```python test
assert ideal(40, 4) == [40.0, 30.0, 20.0, 10.0, 0.0]
assert behind(40, [40, 38, 38, 33, 30, 30, 24, 18, 13, 6, 0], 6) == [2, 4, 5, 6, 7]
assert behind(20, [20, 15, 10, 5, 0], 1) == []
print("All checks passed!")
```

**3.** **How many sprints?** Write the function `sprints(backlog, velocities)`, which returns the number of sprints needed `(based on the average, based on the worst sprint, based on the best sprint)`! Only whole sprints exist, so round up.

```python starter
def sprints(backlog, velocities):
    mean = sum(velocities) / len(velocities)
    return (round(backlog / mean), round(backlog / min(velocities)), round(backlog / max(velocities)))
```

<details>
<summary>Solution</summary>

```python solution
import math

def sprints(backlog, velocities):
    mean = sum(velocities) / len(velocities)
    return (math.ceil(backlog / mean),             # a half-finished sprint is a whole sprint too
            math.ceil(backlog / min(velocities)),
            math.ceil(backlog / max(velocities)))
```

</details>

```python test
assert sprints(120, [18, 22, 15, 25, 20, 19]) == (7, 8, 5)
assert sprints(90, [18]) == (5, 5, 5)
assert sprints(100, [30, 40]) == (3, 4, 3)
print("All checks passed!")
```

### Quick check questions

```quiz
? How many values does the Agile Manifesto contain?
= 4
! For example: individuals and interactions over processes and tools.

? Who is responsible in Scrum for the content and order of the Product Backlog?
- the Scrum Master
+ the Product Owner
- the developers
- the sponsor
! The Product Owner maximises the product's value.

? A team finishes 6 tickets a week and wants a lead time of at most 2 weeks. How big can the WIP limit be?
= 12
! $2 \cdot 6 = 12$.

? What does the V-model show?
+ that every level of development (requirements, design, code) has a corresponding test level
- the order of the sprints
- the columns of the Kanban board
- the team's development stages
! E.g. requirements are matched by acceptance testing.
```
