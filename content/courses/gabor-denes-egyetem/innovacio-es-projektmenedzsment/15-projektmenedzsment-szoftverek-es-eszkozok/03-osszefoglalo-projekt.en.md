---
title: Capstone Project – Fully Planning a Small Software Project
summary: Applying the course's methods to one example – a study group organiser app project: idea and business model, project charter, SMART goal and KPIs, stakeholders, WBS, network diagram and critical path, RACI, risks and reserve, earned value, tooling and closure.
minutes: 40
---

## What you will learn

- how the topics of the course connect in a **real** project,
- how the **complete plan** of a small software project is built step by step,
- how to **check** the project's status halfway through.

## 1. The idea (topics 1–3)

A student team notices that their classmates find it hard to form **study groups** during the exam period. The idea: a **web application** where you can find or start a group by course and time slot.

- **type of innovation**: product innovation, **incremental** (a better combination of existing solutions – chat apps, calendars).
- **business model canvas** (briefly): _customer segment_: university students; _value proposition_: a study partner in 2 minutes; _channels_: the student union, social media; _revenue_: free basic version, premium features (**freemium**).

## 2. Project charter (topics 6–8)

| Element    | Content                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| purpose    | release the first version (MVP) of the web app                                                                         |
| SMART goal | an MVP released by week 10 of the semester, with at least 200 students registered in the first week of the exam period |
| scope      | registration, group search, starting a group, notifications – **not** included: mobile app, payments                   |
| budget     | 4 million HUF (BAC)                                                                                                    |
| sponsor    | the faculty's innovation fund                                                                                          |
| KPIs       | number of registered students, number of groups formed, average search time                                            |

## 3. Stakeholders (topic 13)

| Stakeholder            | Power | Interest | Strategy                                     |
| ---------------------- | ----- | -------- | -------------------------------------------- |
| sponsor (faculty fund) | high  | high     | manage closely                               |
| student union          | high  | low      | keep satisfied                               |
| students               | low   | high     | keep informed                                |
| university IT          | high  | low      | keep satisfied (operations, data protection) |

## 4. WBS and network diagram (topic 7)

```text
 1 Study group app MVP
 ├── 1.1 Requirements (A)
 ├── 1.2 User interface design (B)
 ├── 1.3 Backend and database (C)
 ├── 1.4 Frontend (D)
 ├── 1.5 Integration and testing (E)
 └── 1.6 Release (F)
```

| Activity | Duration (days) | Predecessor |
| -------- | --------------- | ----------- |
| A        | 3               | –           |
| B        | 4               | A           |
| C        | 6               | A           |
| D        | 5               | B           |
| E        | 3               | C, D        |
| F        | 1               | E           |

Paths:

- A–B–D–E–F: 3 + 4 + 5 + 3 + 1 = **16 days**
- A–C–E–F: 3 + 6 + 3 + 1 = 13 days

The **critical path** is A–B–D–E–F, and the project takes **16 days**. C's float: 16 − 13 = **3 days** – so the backend developer can slip at most 3 days without endangering the project (this can also be used for resource smoothing, topic 14).

## 5. Roles – RACI (topic 12)

| Activity         | Project manager | Developers | UI designer | Sponsor |
| ---------------- | --------------- | ---------- | ----------- | ------- |
| requirements     | **A**           | C          | C           | I       |
| UI design        | A               | C          | **R**       | I       |
| development      | A               | **R**      | C           | –       |
| release approval | R               | I          | I           | **A**   |

Every row has **exactly one A**; for requirements the project manager is both responsible (R) and accountable (A).

## 6. Risks and reserve (topics 4, 14)

| Risk                                                        | Probability | Impact    | Expected value |
| ----------------------------------------------------------- | ----------- | --------- | -------------- |
| the key backend developer is out for weeks                  | 20%         | 1.5 M HUF | 0.3 M HUF      |
| university IT does not allow login with university accounts | 30%         | 0.5 M HUF | 0.15 M HUF     |

The **contingency reserve** is the sum of the expected values: 0.3 + 0.15 = **0.45 M HUF**. Responses: knowledge sharing and pair programming (mitigation), early coordination with IT, and email registration as a fallback.

## 7. Halfway status – earned value (topic 9)

On day 8: **PV** = 2.0 M HUF, **EV** = 1.6 M HUF, **AC** = 2.0 M HUF.

- CV = EV − AC = −0.4 M HUF (over budget), SV = EV − PV = −0.4 M HUF (behind schedule)
- **CPI** = EV / AC = 1.6 / 2.0 = **0.8**, **SPI** = EV / PV = **0.8**
- **EAC** = BAC / CPI = 4 / 0.8 = **5 M HUF**

Action: following the change control process (topic 14), the project manager makes a proposal to the sponsor – for example, postponing the "group notifications" feature to the next version (reducing scope) or requesting additional budget.

## 8. Tooling and teamwork (topics 11, 15)

The team works in a **hybrid** way: the main milestones are tracked on a Gantt chart, and development runs in two-week **sprints**. Tool: **GitHub Projects** (next to the code, free) – on the weighted matrix it narrowly beat Jira thanks to cost and Git integration. Workflow: To do → In progress → Code review → Done.

## 9. Closure (topic 10)

- **handover**: acceptance testing with the sponsor, handing operations over to university IT,
- **evaluation**: measuring the SMART goal and the KPIs in the first week of the exam period,
- **lessons learned**: e.g. "login with university accounts must be agreed already in the requirements phase",
- **archiving** and recognising the team.

## Summary

- Every topic of the course comes up during one project: innovation → business model → charter and goals → stakeholders → WBS and schedule → roles → risks → control (EVM) → tools → closure.
- Behind every calculation (critical path, reserve, CPI, EAC) there is a **decision**: what should the project manager do?

## Lesson exercise

```quiz required
? Based on the network diagram, how many days does the project take?
= 16
= 16 days
! The critical path: A–B–D–E–F.

? How many days of float does activity C (backend) have?
= 3
= 3 days
! 16 − 13.

? What is the contingency reserve in millions of HUF?
= 0.45
! 0.2 · 1.5 + 0.3 · 0.5.

? On day 8, EV = 1.6 M HUF and AC = 2.0 M HUF. What is the CPI?
= 0.8
! EV / AC.

? BAC = 4 M HUF, CPI = 0.8. What is the EAC in millions of HUF?
= 5
! BAC / CPI.

? How many "A"s (accountable) can one row of a RACI matrix have?
- any number
+ exactly one
- at least two
- none
! One activity has one owner.
```
