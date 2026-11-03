---
title: Resource Management
summary: Types of resources, resource plan and estimation, FTE and utilisation, the resource histogram, overallocation, resource levelling and smoothing, resource calendars.
minutes: 25
---

## What you will learn

- which **resources** a project has,
- how to calculate with **FTE** and **utilisation**,
- how to spot **overallocation** on a resource histogram,
- the difference between resource **levelling** and **smoothing**.

## Resource types

- **human** resources: developers, testers, designers, experts,
- **physical**: hardware, equipment, rooms, licences, cloud capacity,
- **financial**: the budget (topic 9).

In IT projects the **scarcest** resource is typically the time of **key people** – especially if they work on several projects at once (matrix organisation, topic 12).

## Resource plan and estimation

The **resource plan** records for every activity which resource is needed, how much and when. We start from the WBS (topic 7) and estimate the **effort** (e.g. person-hours, person-days).

> **Effort ≠ duration.** A 10-person-day task takes 10 days with 1 person and ideally 5 days with 2 – in practice more, because coordination grows (Brooks's law).

### FTE and utilisation

- **FTE** (Full-Time Equivalent): 1 FTE = one person's full working time (e.g. 40 hours a week). A person working 20 hours a week is **0.5 FTE**.
- **Utilisation** = assigned hours / available hours · 100%.

Example: a developer is assigned two tasks on one day, 6 + 4 = 10 hours, but works only 8 hours → utilisation **125%** → **overallocated**.

> Sustained utilisation around 100% is also risky: there is no slack for unexpected work, and the chance of burnout grows (sustainable pace, topic 11). A common target is **80–85%**.

## The resource histogram

A **resource histogram** shows, per period, how much of a resource we have scheduled compared with available capacity:

```text
 hours/day
  12 │        ██
  10 │     ██ ██
   8 │─ ─ ─██─██─ ─ ─ ─ ─ ─ ─   ← capacity (8 hours)
   6 │  ██ ██ ██ ██
   4 │  ██ ██ ██ ██ ██
   2 │  ██ ██ ██ ██ ██
     └──────────────────────▶ day
       M  T  W  T  F
```

The bars above the line on Tuesday and Wednesday indicate **overallocation**.

## Levelling and smoothing

| Technique              | What does it do?                                           | Effect on the deadline                                                       |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **resource levelling** | **shifts** activities so that no resource is overallocated | the project may get **longer** (even the critical path may change)           |
| **resource smoothing** | shifts activities only **within their float**              | the deadline **does not change**, but not every overallocation may disappear |

Example: in the topic 7 network, activity C had 1 day of float. If C and B use the same developer on a day, C can start 1 day later through **smoothing** – the project end does not slip. If a larger shift were needed, that is **levelling**, and the project may slip.

## Resource calendar and procurement

- **Resource calendar**: when a resource is available (holidays, public holidays, other projects, part time).
- **Procurement**: if there are not enough internal resources, get them externally (subcontractor, freelancer, cloud capacity). The **make or buy** decision can be supported by a decision tree (lesson 1).

## Summary

- Resources: human, physical, financial; key people's time is the scarcest.
- Effort (person-days) ≠ duration; FTE; utilisation = assigned / available.
- Resource histogram: a bar above the capacity line = overallocation.
- Levelling: removes overallocation but may lengthen the project; smoothing: only within float, the deadline does not change.

## Lesson exercise

```quiz required
? A developer works 30 of 40 weekly hours on the project. How many FTE is that?
= 0.75
! 30 / 40.

? A tester is assigned 6 + 3 hours of tasks on one day, on an 8-hour working day. What is their utilisation in percent?
= 112.5
= 112.5%
! 9 / 8 · 100.

? Which technique does **not** change the project deadline?
- resource levelling
+ resource smoothing
- crashing
- fast-tracking
! It only shifts activities within their float.

? A task needs 12 person-days of effort. Ideally, how many days do 3 people need for it?
= 4
= 4 days
! 12 / 3 (in practice more, because of coordination).

? What does a bar **above** the capacity line on a resource histogram indicate?
+ overallocation
- unused capacity
- the critical path
- a milestone
! More work was assigned than there is time for.
```
