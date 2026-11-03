---
title: Change Management
summary: Handling project changes (change requests, change control board, scope creep, gold plating), configuration and version management, and models of organisational change – Lewin, Kotter and ADKAR.
minutes: 25
---

## What you will learn

- how to handle project **changes** (change request, CCB),
- what **scope creep** and **gold plating** are,
- what **configuration management** is,
- how to lead an **organisational change** (Lewin, Kotter, ADKAR).

## The two meanings of "change management"

1. **Project change control**: controlled handling of modifications to the project baseline (scope, schedule, cost).
2. **Organisational change management**: leading **people** from the old way of working to the new one – so that the new system is really used.

## Project change control

The steps of **integrated change control** from topic 9: record → impact analysis → decision (CCB) → update baseline → inform → track implementation.

A **change request form** typically contains: requester, description, justification, priority, **impact** on scope, schedule, cost, quality and risk, decision and date.

### Two dangerous phenomena

- **Scope creep**: scope grows **bit by bit, without approval** ("You can surely add this too, right?"). Time and cost do not grow with it, so the project slips or quality suffers.
- **Gold plating**: the **team** itself adds extras nobody asked for ("Another animation would be nice"). It takes time and may introduce new bugs.

> The defence against both is the **approved scope**, the **change request process** and the courage to say **"no"**. In an agile project a new request goes into the **Product Backlog**, and the Product Owner orders it.

## Configuration management

**Configuration management** ensures we always know **which version** of the project's products (code, documentation, settings) is valid, and how we got there.

- a **version control system** (e.g. **Git**): every change is traceable – who changed what, when and why,
- **branches** and **pull requests** with code review,
- **release tags** (e.g. v1.2.0) and **semantic versioning** (MAJOR.MINOR.PATCH),
- infrastructure as code too (Infrastructure as Code).

## Organisational change: Lewin's model

**Kurt Lewin**'s three-step model (1947):

1. **Unfreeze** – make people understand why change is needed, loosen old habits.
2. **Change** – introduce the new way of working, training, support.
3. **Refreeze** – anchor the new way of working (policies, incentives) so there is no slipping back.

## Kotter's eight steps

From the lessons of failed changes, **John Kotter** (1996) described eight steps:

1. create a sense of **urgency**,
2. build a **guiding coalition**,
3. form a **vision** and strategy,
4. **communicate** the vision,
5. remove obstacles, **empower** people,
6. generate **quick wins**,
7. consolidate gains and produce **more change**,
8. **anchor** the new approach in the culture.

## ADKAR

**Prosci's ADKAR** model describes change at the level of the **individual**, in five building steps:

| Letter | Meaning       | Question                                     |
| ------ | ------------- | -------------------------------------------- |
| **A**  | Awareness     | Do I know **why** we need to change?         |
| **D**  | Desire        | Do I **want** to take part?                  |
| **K**  | Knowledge     | Do I know **how** to do it?                  |
| **A**  | Ability       | Am I **able** to do it in practice?          |
| **R**  | Reinforcement | What **keeps** me in the new way of working? |

> If a user does not use the new system, ADKAR helps find **where they got stuck**: they do not know why (A)? They do not want to (D)? Nobody taught them (K)? No time to practise (A)? Nobody checks, so they go back to the old way (R)?

## Summary

- Project change control: change request form, impact analysis, CCB, baseline update.
- Scope creep: growth without approval; gold plating: unrequested extras added by the team.
- Configuration management: version control (Git), branches, release tags.
- Lewin: unfreeze → change → refreeze; Kotter's 8 steps; ADKAR: Awareness, Desire, Knowledge, Ability, Reinforcement.

## Lesson exercise

```quiz required
? During the project the client verbally asks for new features bit by bit, and the team builds them in without approval. What is this called?
+ scope creep
- gold plating
- fast-tracking
- configuration management
! Scope grows without approval.

? A developer, on their own initiative and without a request, adds animations to the UI. What is this called?
- scope creep
+ gold plating
- crashing
- escalation
! An unrequested extra from the team.

? What is the **third** step of Lewin's model?
- unfreeze
- change
+ refreeze
! Anchoring the new way of working.

? What does the **K** in ADKAR stand for?
- Control
+ Knowledge (I know how to do it)
- Communication
- Cost
! Awareness, Desire, Knowledge, Ability, Reinforcement.

? How many steps does Kotter's change management model have?
= 8
= eight
! From urgency to anchoring in the culture.

? Which tool is part of **configuration management** in a software project?
+ a version control system (e.g. Git)
- Gantt chart
- power–interest grid
- SWOT
! It makes traceable which version is valid.
```
