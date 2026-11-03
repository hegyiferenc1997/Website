---
title: Efficiency Improvement Methods
summary: Lean and the seven wastes, value stream mapping, Six Sigma and DMAIC, 5S, the Pareto principle and the 5 Whys – with computing examples.
minutes: 25
---

## What you will learn

- what **Lean** thinking is and what the **seven wastes** are,
- what **value stream mapping** is good for,
- what **Six Sigma** is and how **DMAIC** works,
- how to use **5S**, the **Pareto principle** and the **5 Whys**.

## Lean

**Lean** thinking comes from the **Toyota Production System** (Taiichi Ohno). Its essence: everything that **creates no value** for the customer is waste (Japanese _muda_) and is to be eliminated.

### The seven wastes (TIMWOOD)

| Waste              | In manufacturing                      | In software development                       |
| ------------------ | ------------------------------------- | --------------------------------------------- |
| **T**ransport      | unnecessary material handling         | handing tasks over between teams              |
| **I**nventory      | parts sitting in stock                | half-finished, unreleased features            |
| **M**otion         | unnecessary movements                 | switching between many tools and tasks        |
| **W**aiting        | the machine stands, waiting for parts | waiting for approval or code review           |
| **O**verproduction | more than ordered                     | features nobody asked for                     |
| **O**verprocessing | unnecessary machining                 | over-engineered solutions, needless documents |
| **D**efects        | scrap, rework                         | bugs, rejected tasks                          |

**Unused human talent** is often mentioned as an eighth waste.

### Value stream mapping

A **value stream map** draws every step of the process from order to delivery and marks the **value-adding time** and the **waiting** at each step. It often turns out that most of the lead time is waiting.

> **Process efficiency = value-adding time / total lead time**. If a feature takes 2 days of work but 20 days pass from request to release, efficiency is 2 / 20 = **10%**.

## Six Sigma

**Six Sigma** (Motorola, 1986; later made famous by General Electric) is a statistical methodology for reducing process **variation** and **defects**. The goal: at most **3.4 defects per million opportunities** (DPMO).

Its improvement cycle is **DMAIC**:

1. **Define** – define the problem, the goal and the customer's requirements.
2. **Measure** – measure current performance.
3. **Analyze** – analyse the root causes of defects.
4. **Improve** – develop and test solutions.
5. **Control** – sustain the result (measurement, standardisation).

**Lean Six Sigma** combines the two: Lean for speed (waste), Six Sigma for precision (defects).

## 5S

Five steps for keeping a workplace (or a code repository, folder or cloud account) in order:

| Japanese     | English      | Example in a code repository     |
| ------------ | ------------ | -------------------------------- |
| **Seiri**    | sort         | delete unused files and branches |
| **Seiton**   | set in order | a logical folder structure       |
| **Seiso**    | shine        | code formatter, fix warnings     |
| **Seiketsu** | standardise  | shared coding rules              |
| **Shitsuke** | sustain      | automatic checks on every change |

## The Pareto principle and the 5 Whys

- **Pareto principle** (80/20 rule): about **80%** of effects come from about **20%** of causes. E.g. 80% of user complaints come from 20% of the features – start fixing those. A **Pareto chart** shows causes in descending order.
- **5 Whys** (Toyota): keep asking "why?" in succession until you reach the **root cause**.

Example: _The site went down. Why?_ The disk was full. _Why?_ Log files were not deleted. _Why?_ There is no log rotation. _Why?_ It was missing from the deployment checklist. _Why?_ There is no such checklist. → Root cause: the deployment checklist is missing.

## Summary

- Lean: eliminating activities that create no customer value (seven wastes, TIMWOOD).
- Value stream map: makes value-adding time and waiting visible.
- Six Sigma: reducing defects and variation, goal 3.4 DPMO, the DMAIC cycle.
- 5S: sort, set in order, shine, standardise, sustain.
- Pareto (80/20) and 5 Whys: finding the most important causes and the root cause.

## Lesson exercise

```quiz required
? Which Lean waste is "**developing features nobody asked for**"?
- waiting
+ overproduction
- transport
- defects
! Producing more than the customer needs.

? How many defects per million opportunities does Six Sigma allow?
= 3.4
! 3.4 DPMO.

? What is the **fourth** step of DMAIC?
- Define
- Measure
- Analyze
+ Improve
! Define → Measure → Analyze → Improve → Control.

? A feature takes 3 days of work, but 30 days pass from request to release. What is the process efficiency (in %)?
= 10
= 10%
! 3 / 30 · 100.

? According to the Pareto principle, about what percentage of effects come from 20% of causes?
= 80
= 80%
! The 80/20 rule.

? Which method asks "why?" repeatedly to find the root cause?
+ 5 Whys
- 5S
- Kaizen
- value stream mapping
! Toyota's method.
```
