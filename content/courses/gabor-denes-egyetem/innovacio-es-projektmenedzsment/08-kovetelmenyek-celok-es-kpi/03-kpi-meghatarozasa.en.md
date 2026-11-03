---
title: Defining Key Performance Indicators (KPI)
summary: What a KPI is, the difference between leading and lagging indicators, how to write a KPI card, and which KPIs measure the success of an IT project and of the product.
minutes: 20
---

## What you will learn

- what a **KPI** is and how it differs from a simple metric,
- what **leading** and **lagging** indicators are,
- how to describe a KPI on a **KPI card**,
- typical KPIs in IT projects.

## What is a KPI?

A **KPI** (Key Performance Indicator) is a **metric** that shows how far an **important goal** has been achieved. Not every metric is a KPI: there are **few** KPIs, and each relates directly to a goal (the "M" of a SMART objective is often a KPI).

> A good KPI has a **clear formula**, a **target value**, a **frequency**, an **owner** and a **data source**. If any of these is missing, the indicator cannot be tracked reliably.

## Leading and lagging indicators

| Type        | What does it show?                          | Example                                         |
| ----------- | ------------------------------------------- | ----------------------------------------------- |
| **lagging** | the result **already achieved**, afterwards | number of bugs in the first month after release |
| **leading** | predicts the **expected** result            | test coverage of the code before release        |

A lagging indicator is easy to measure but can no longer be influenced; a leading indicator lets us **intervene** in time. It is worth using both.

## KPI card

| Field           | Example                                                 |
| --------------- | ------------------------------------------------------- |
| **name**        | share of tasks completed on time                        |
| **goal**        | keeping to the schedule                                 |
| **formula**     | tasks finished on time / all tasks due · 100%           |
| **target**      | ≥ 90%                                                   |
| **frequency**   | weekly                                                  |
| **owner**       | project manager                                         |
| **data source** | report from the project management software (e.g. Jira) |

## Typical KPIs in IT projects

**Project success indicators** (performance of project management):

- schedule performance index (**SPI**) and cost performance index (**CPI**) – calculated in topic 9,
- share of milestones met on time,
- deviation from budget (%),
- number of approved change requests,
- team satisfaction, turnover.

**Product success indicators** (impact of the project's result):

- number of active users (daily / monthly: **DAU / MAU**),
- conversion rate, churn,
- customer satisfaction (e.g. **NPS** – Net Promoter Score),
- availability (e.g. 99.9%), average response time,
- number of bugs found after release.

> **NPS** = share of **promoters** (9–10 points) − share of **detractors** (0–6 points), based on the question "How likely are you to recommend us, 0–10?". With 50% promoters and 20% detractors, NPS = **+30**.

## KPI pitfalls

- **Too many KPIs** – nobody watches them. Aim for 3–7 per project.
- **Goodhart's law**: "When a measure becomes a target, it ceases to be a good measure." E.g. if the number of closed bug tickets is the KPI, the team splits bugs into tiny tickets.
- **Vanity metrics**: they look good but do not show real success (e.g. number of downloads instead of active use).

## Summary

- A KPI is a clearly defined metric tied to an important goal.
- Lagging indicator: result afterwards; leading indicator: prediction, allows intervention.
- KPI card: name, goal, formula, target, frequency, owner, data source.
- Project success (SPI, CPI, deadlines) and product success (DAU/MAU, NPS, availability) indicators.
- Pitfalls: too many KPIs, Goodhart's law, vanity metrics.

## Lesson exercise

```quiz required
? Which is a **leading** indicator?
- number of bugs in the first month after release
+ test coverage of the code before release
- last year's revenue
- the actual finish date of the project
! It predicts the expected quality; there is still time to intervene.

? Out of 40 tasks due, 34 were finished on time. What is the on-time rate (in %)?
= 85
= 85%
! 34 / 40 · 100.

? A survey shows 60% promoters (9–10), 25% passives (7–8) and 15% detractors (0–6). What is the NPS?
= 45
= +45
! 60 − 15.

? What does **Goodhart's law** say?
+ when a measure becomes a target, it ceases to be a good measure
- every KPI must be measured daily
- there should be at least 20 KPIs
- leading indicators are always more accurate
! People optimise the indicator, not the real goal.

? Which is **not** a required element of a good KPI card?
- formula
- target value
- owner
+ the date of birth of whoever invented the KPI
! Name, goal, formula, target, frequency, owner, data source.
```
