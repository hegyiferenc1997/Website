---
title: Roles and Responsibilities in the Project Team
summary: Sponsor, steering committee, project manager, team members, experts, client and users; the project manager's competences; recording responsibilities in a RACI matrix.
minutes: 20
---

## What you will learn

- who the **key players** of a project are and what they are responsible for,
- which **competences** a project manager needs,
- how to record responsibilities in a **RACI matrix**.

## Project roles

```text
               Steering committee
                       │  ← members: sponsor (chair), client, key supplier
                       ▼
               Project manager
          ┌────────────┼────────────┐
      Team lead     Team lead     Experts
       ●  ●  ●       ●  ●          (SME)
```

| Role                            | Responsibility                                                                                  |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| **sponsor**                     | the project's "owner": provides money and support, approves the charter, owns the business case |
| **steering committee**          | the most important decisions (phase gates, big changes, escalation)                             |
| **project manager** (PM)        | achieving the project goal: planning, control, communication, risk management                   |
| **team members**                | doing the work packages, estimating, reporting                                                  |
| **subject matter expert** (SME) | expertise in one area (e.g. legal, security), often part time                                   |
| **client / users**              | requirements, feedback, acceptance                                                              |
| **line managers**               | providing the resources (people) to the project                                                 |

> In agile projects (topic 11) the **Product Owner** takes over representing client needs and prioritising, and the **Scrum Master** supports the process.

## The project manager's competences

Both **IPMA** and **PMI** divide the necessary knowledge into three areas (PMI: the **"Talent Triangle"**):

1. **Ways of Working**: planning, scheduling, budgeting, risk management, agile and traditional methods.
2. **Power Skills**: leadership, communication, negotiation, conflict management, motivation.
3. **Business Acumen**: understanding strategy and the business environment, value-focused thinking.

## The RACI matrix

A **RACI matrix** (responsibility assignment matrix) links activities and roles in a table. The letters mean:

| Letter | Meaning     | Rule                                             |
| ------ | ----------- | ------------------------------------------------ |
| **R**  | Responsible | does the work; there may be several              |
| **A**  | Accountable | approves, ultimately answerable; **exactly one** |
| **C**  | Consulted   | their opinion is sought (two-way)                |
| **I**  | Informed    | told about the result (one-way)                  |

Example:

| Activity                   | Sponsor | PM  | Developer | Tester | Client |
| -------------------------- | ------- | --- | --------- | ------ | ------ |
| requirements specification | I       | A   | C         | C      | R      |
| database design            |         | I   | **A, R**  | C      |        |
| test plan                  |         | A   | C         | R      | I      |
| handover and acceptance    | A       | R   | I         | I      | C      |

Checking rules:

- every row must have **exactly one A** (with several, nobody is really answerable),
- every row must have **at least one R**,
- if a column has too many **A**s or **R**s, that person may be overloaded,
- if a column is empty, ask whether that role is needed in the project.

## Summary

- Sponsor: money, support, business case; steering committee: big decisions; PM: achieving the goal.
- PM competences (PMI Talent Triangle): ways of working, power skills, business acumen.
- RACI: Responsible, Accountable (exactly one per row), Consulted, Informed.

## Lesson exercise

```quiz required
? Who provides the project's **funding** and owns the business case?
+ the sponsor
- the tester
- the Scrum Master
- the subject matter expert
! The sponsor is the project's "owner".

? Which letter must appear **exactly once** per row in a RACI matrix?
- R
+ A
- C
- I
! Accountable: the one ultimately answerable.

? What does the "C" in RACI stand for?
- Controlling
+ Consulted – their opinion is sought
- Certified
- Customer
! Two-way communication.

? A RACI matrix contains 6 activities and 5 roles. At least how many "A" letters must it contain?
= 6
! Exactly one per row (activity).

? Which body makes the project's **most important decisions** (e.g. phase gates, big changes)?
- the development team
+ the steering committee
- customer service
- a supportive PMO
! Steering committee.
```
