---
title: Comparison, Selection and Hybrid Approaches
summary: Comparing the agile and traditional approaches, the Stacey matrix as a selection aid, hybrid models (Water-Scrum-Fall), and agile at enterprise scale (SAFe).
minutes: 20
---

## What you will learn

- how exactly the two approaches **differ**,
- how to **choose** a methodology for a project,
- what **hybrid** approaches are and how agile can be scaled.

## The two approaches side by side

| Aspect             | Traditional (waterfall)                          | Agile (Scrum, Kanban)                   |
| ------------------ | ------------------------------------------------ | --------------------------------------- |
| planning           | up front, in detail                              | continuously, "just in time"            |
| fixed              | **scope**                                        | **time and cost** (sprint, team)        |
| variable           | time and cost                                    | **scope**                               |
| delivery           | once, at the end                                 | frequently, in increments               |
| client's role      | at the start (requirements) and end (acceptance) | continuous, daily collaboration         |
| documentation      | detailed                                         | "just enough"                           |
| leadership         | the project manager directs                      | self-organising team, servant leader    |
| measure of success | delivering the plan                              | value delivered                         |
| risk management    | through up-front analysis                        | through short cycles and early feedback |

> Reminder (topic 6): the traditional approach fixes **scope**; agile inverts the iron triangle and fixes **time and cost**.

## Choosing: the Stacey matrix

**Ralph Stacey**'s matrix helps choose based on two questions:

- **How well known and agreed is WHAT** must be built? (requirements)
- **How well known is HOW** to build it? (technology)

```text
 requirements
 uncertain ▲ ┌───────────────┬───────────────┐
           │ │ complicated   │   chaotic     │
           │ │ (agile)       │ (rapid        │
           │ │               │  experiments) │
           │ ├───────────────┼───────────────┤
           │ │   simple      │  complicated  │
           │ │ (traditional) │  (agile)      │
 known     │ └───────────────┴───────────────┘
           └──────────────────────────────────▶ technology
             known                       uncertain
```

- **Simple** (both known) → traditional planning works.
- **Complicated / complex** (one or both uncertain) → an agile, iterative approach.
- **Chaotic** (nothing known) → rapid experiments, prototypes (Lean Startup, topic 3).

Other criteria: the client's **availability**, the contract type (fixed price or time and materials), **regulation**, the team's experience and size.

## Hybrid approaches

In practice many organisations **combine** the two:

- **Water-Scrum-Fall**: the start of the project (business case, budget, high-level plan) and the end (handover, deployment) are traditional; development runs in Scrum sprints.
- **Agile development, traditional milestones**: we report fixed milestones and budget to management, but the team works in sprints.
- **Scrumban**: Scrum roles and events with a Kanban board and WIP limits.
- **PRINCE2 Agile**: PRINCE2's governance frame with agile delivery.

## Agile at enterprise scale

A Scrum team has about 10 people at most. If a product needs many teams, a **scaled** framework is used:

- **SAFe** (Scaled Agile Framework): several teams (an "Agile Release Train") with joint **Program Increment** (PI) planning every 8–12 weeks or so,
- **LeSS** (Large-Scale Scrum): one Product Backlog, one Product Owner, several teams,
- **Scrum of Scrums**: representatives of the teams coordinate regularly.

## Summary

- Traditional: fixed scope, up-front plan, handover at the end; agile: fixed time and cost, variable scope, frequent delivery.
- Stacey matrix: known requirements + known technology → traditional; uncertainty → agile; chaos → experimentation.
- Hybrid: Water-Scrum-Fall, Scrumban, PRINCE2 Agile.
- Scaling: SAFe, LeSS, Scrum of Scrums.

## Lesson exercise

```quiz required
? According to the Stacey matrix, which approach fits a project where both the requirements **and** the technology are well known?
+ traditional (plan-driven)
- agile
- rapid experimentation
- none
! A simple area: the plan can be made reliably.

? Which element of the iron triangle typically **varies** in an agile project?
- time
- cost
+ scope
- none
! Time (sprint) and cost (team) are fixed.

? What does the **Water-Scrum-Fall** hybrid model mean?
+ the start and end of the project are traditional, development runs in Scrum sprints
- every waterfall phase is done twice
- Scrum is used only for testing
- the team alternates weekly between waterfall and Kanban
! A common enterprise practice.

? Which framework is used to **scale agile across an enterprise**?
- MoSCoW
+ SAFe
- SMART
- TELOS
! Scaled Agile Framework.

? Which statement is true of the agile approach?
- the client sees the result only at the end of the project
+ the client collaborates with the team continuously and frequently receives working increments
- there is no planning at all
- there is only one big handover
! Continuous collaboration and frequent delivery.
```
