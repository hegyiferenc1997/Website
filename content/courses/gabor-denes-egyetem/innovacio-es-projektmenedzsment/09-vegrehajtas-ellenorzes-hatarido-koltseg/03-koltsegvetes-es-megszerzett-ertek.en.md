---
title: Budget and Earned Value Management
summary: Cost estimation and budgeting, reserves, the cost baseline, and the indicators of earned value management – PV, EV, AC, CV, SV, CPI, SPI, EAC, VAC – with a worked example.
minutes: 30
---

## What you will learn

- how a project **budget** is built,
- the difference between the **contingency** and the **management reserve**,
- how **earned value management** measures time and cost at the same time.

## Cost estimation and budgeting

- **Bottom-up** estimate: estimate the cost of every work package, then add them up – accurate but laborious.
- **Top-down** (analogous or parametric) estimate: quick, used at the start of the project.

Typical costs of an IT project: **salaries** (often the largest item), licences, cloud and hardware, subcontractors, training, travel.

```text
 cost of work packages
 + contingency reserve (for known risks)      → cost baseline
 + management reserve (for unforeseen things) → total budget
```

- **Contingency reserve**: for **identified** risks (e.g. based on EMV, topic 4); the PM may use it.
- **Management reserve**: for **unforeseeable** events; usable only with management approval, and **not part** of the cost baseline.

## Earned value management (EVM)

The simple question "how much have we spent?" is misleading: if half the budget is spent, is that good or bad? It depends on **how much work has been done**. The three basic values of **EVM**:

| Abbreviation | Name                 | Meaning                                             |
| ------------ | -------------------- | --------------------------------------------------- |
| **PV**       | Planned Value        | budget of the work **planned** up to now            |
| **EV**       | Earned Value         | budget of the work **actually completed** up to now |
| **AC**       | Actual Cost          | money **actually spent** up to now                  |
| **BAC**      | Budget at Completion | planned cost of the whole project                   |

> **EV = percent complete · BAC**

### Variances and indices

| Indicator                            | Formula | Interpretation                                             |
| ------------------------------------ | ------- | ---------------------------------------------------------- |
| **cost variance** (CV)               | EV − AC | < 0: over budget                                           |
| **schedule variance** (SV)           | EV − PV | < 0: behind schedule                                       |
| **cost performance index** (CPI)     | EV / AC | < 1: over budget (less than 1 unit of work per unit spent) |
| **schedule performance index** (SPI) | EV / PV | < 1: behind schedule                                       |

### Forecasting

| Indicator                        | Formula   | Meaning                                 |
| -------------------------------- | --------- | --------------------------------------- |
| **estimate at completion** (EAC) | BAC / CPI | if cost efficiency stays the same       |
| **estimate to complete** (ETC)   | EAC − AC  | this much money is still needed         |
| **variance at completion** (VAC) | BAC − EAC | < 0: the project will exceed the budget |

## Worked example

A software project has a total budget of **BAC = 100 million**, 10 months, evenly scheduled. At the end of month 5:

- according to plan 50% of the work should be done → **PV = 50**,
- in fact only 40% is done → **EV = 0.4 · 100 = 40**,
- so far **AC = 50** million has been spent.

| Indicator | Calculation | Result  | Interpretation                     |
| --------- | ----------- | ------- | ---------------------------------- |
| CV        | 40 − 50     | **−10** | 10 million over budget             |
| SV        | 40 − 50     | **−10** | 10 million worth of work behind    |
| CPI       | 40 / 50     | **0.8** | only 0.8 of work per unit spent    |
| SPI       | 40 / 50     | **0.8** | progressing at 80% of planned pace |
| EAC       | 100 / 0.8   | **125** | expected to cost 125 million       |
| VAC       | 100 − 125   | **−25** | a 25 million overrun is expected   |

```text
 cost ▲
      │                         ╱ PV (plan)
 50 ──┤ · · · · · · · · · · ● AC, PV
      │                ╱   │
 40 ──┤ · · · · · · ● EV   │  CV = EV − AC < 0
      │          ╱         │  SV = EV − PV < 0
      │      ╱             │
      └──────────────────── month 5 ──▶ time
```

> The project is **red**: late and more expensive. Action is needed (e.g. reducing scope, improving efficiency) or a change request for the budget.

## Summary

- Budget = work packages + contingency reserve (= cost baseline) + management reserve.
- PV: planned, EV: value of work done, AC: actual cost.
- CV = EV − AC, SV = EV − PV, CPI = EV / AC, SPI = EV / PV.
- EAC = BAC / CPI, ETC = EAC − AC, VAC = BAC − EAC.
- A negative variance or an index below 1 = bad news.

## Lesson exercise

```quiz required
? BAC = 200, 30% of the work is done. What is EV?
= 60
! EV = 0.3 · 200.

? EV = 60, AC = 75. What is the CPI?
= 0.8
! CPI = EV / AC.

? EV = 60, PV = 50. What is the SPI?
= 1.2
! SPI = EV / PV.

? Based on the previous two questions (CPI = 0.8, SPI = 1.2), what is true of the project?
+ it is ahead of schedule but over budget
- it is late and over budget
- it is late but cheaper than planned
- it is ahead and cheaper too
! SPI > 1: faster; CPI < 1: more expensive.

? BAC = 200, CPI = 0.8. What is the estimate at completion (EAC)?
= 250
! EAC = BAC / CPI = 200 / 0.8.

? Which reserve is **not** part of the cost baseline and can only be used with management approval?
- contingency reserve
+ management reserve
- buffer
- work package cost
! The management reserve is for unforeseeable events.
```
