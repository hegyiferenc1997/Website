---
title: Agile Project Management – Scrum and Kanban
summary: Scrum roles, events and artefacts, story points and velocity, Kanban, and when to use which method.
minutes: 18
---

## What you will learn

- the roles, events and artefacts of **Scrum**,
- what **story points** and **velocity** are,
- how **Kanban** differs, and when to choose which.

## Scrum

**Scrum** is the most widespread agile framework. Work proceeds in fixed-length **sprints** (1–4 weeks, often 2), and every sprint ends with a **working, deliverable product version** (increment).

**Roles:**

| Role              | Its job                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| **Product Owner** | responsible for the product's value; manages and orders the product backlog |
| **Scrum Master**  | helps the team, removes impediments, upholds Scrum                          |
| **developers**    | a self-organising team of 3–10 people that builds the increment             |

**Events:**

| Event               | When, how long?            | Purpose                                         |
| ------------------- | -------------------------- | ----------------------------------------------- |
| **sprint planning** | at the start of the sprint | what and how do we build in this sprint?        |
| **daily scrum**     | daily, 15 minutes          | sync: what I did, what I'll do, what blocks me? |
| **sprint review**   | at the end of the sprint   | demo to stakeholders, feedback                  |
| **retrospective**   | after the review           | what to do better in the next sprint?           |

**Artefacts:** the **product backlog** (all desired features, ordered), the **sprint backlog** (what was taken on for this sprint), the **increment** (the working result).

## Estimating: story points and velocity

Agile teams often estimate not in hours but in relative **story points** (e.g. 1, 2, 3, 5, 8, 13 – a Fibonacci-like series): how big and complex a task is compared with the others. **Velocity** is the average number of points completed in a sprint; from it you can estimate when the backlog will be done.

```python run
# Based on past sprints, how many more sprints are needed?
import math
done = [21, 18, 24, 21]             # story points per sprint
velocity = sum(done) / len(done)
remaining = 130                     # what is left of the backlog
print("average velocity:", velocity)
print("sprints still needed:", math.ceil(remaining / velocity))
```

## Kanban

**Kanban** works in a **continuous flow** rather than sprints: cards move across the board (To do → In progress → Review → Done), and the **WIP limit** caps how many tasks may be in a column at once. Its metric is **lead time**: how long it takes a card to get from To do to Done.

## When to use which?

| Situation                                                                 | Good choice               |
| ------------------------------------------------------------------------- | ------------------------- |
| developing a new product, changing needs, regular demos                   | **Scrum**                 |
| continuously arriving, unpredictable tasks (operations, tickets, support) | **Kanban**                |
| fixed, well-known requirements, strict regulation                         | **waterfall** (or hybrid) |

## Summary

- Scrum: Product Owner, Scrum Master, developers; sprint planning, daily scrum, review, retrospective.
- Story point = relative estimate; velocity = points/sprint; the remaining time can be planned from it.
- Kanban: continuous flow, WIP limit, lead time.

## Exercise

```quiz required
? Who orders the product backlog in Scrum?
+ Product Owner
- Scrum Master
- the most senior developer
- the client's lawyer
! They are responsible for the product's value.

? How many minutes is the daily scrum?
= 15
! A short stand-up meeting.

? How many more sprints are needed in the lesson's example (average velocity 21, 130 points remaining)?
= 7
! 130 / 21 ≈ 6.2 → rounded up to 7.

? Which method fits an operations team's continuously arriving tickets best?
- waterfall
+ Kanban
- Scrum with six-week sprints
- none of them
! Continuous flow, with a WIP limit.
```
