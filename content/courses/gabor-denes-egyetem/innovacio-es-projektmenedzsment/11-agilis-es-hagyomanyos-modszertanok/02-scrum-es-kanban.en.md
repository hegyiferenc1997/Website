---
title: Agile Methodologies – Scrum and Kanban
summary: Scrum's accountabilities, events and artifacts, how a sprint runs, story points, velocity and the burndown chart; the principles of Kanban, WIP limits and Little's law.
minutes: 30
---

## What you will learn

- how **Scrum** works (accountabilities, events, artifacts),
- what **story points**, **velocity** and the **burndown chart** are,
- how **Kanban** works and what a **WIP limit** is,
- what **Little's law** says.

## Scrum

**Scrum** (Ken Schwaber and Jeff Sutherland; the rule book is the **Scrum Guide**, latest 2020) is the most widespread agile framework. Work happens in fixed-length **sprints** of at most **one month** (often 2 weeks).

### Accountabilities (the Scrum team, about 10 people at most)

| Role              | Responsibility                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Product Owner** | maximising the value of the product; managing and ordering the **Product Backlog** |
| **Scrum Master**  | making Scrum work; removing impediments, supporting the team (servant leader)      |
| **Developers**    | creating a usable **Increment** every sprint                                       |

> There is **no project manager** role in Scrum: the traditional PM's duties are shared among the three roles.

### Events

```text
 ┌──────────────────────────── Sprint (≤ 1 month) ────────────────────────────┐
 │ Sprint      ┌ Daily ┐ ┌ Daily ┐ ┌ Daily ┐ …     Sprint       Sprint        │
 │ Planning  → │ Scrum │ │ Scrum │ │ Scrum │   →   Review     → Retrospective │
 │             └15 min ┘ └───────┘ └───────┘                                  │
 └────────────────────────────────────────────────────────────────────────────┘
```

1. **Sprint** – the "container" for all other events.
2. **Sprint Planning** – what and how will we build? It produces the **Sprint Goal** and the **Sprint Backlog**.
3. **Daily Scrum** – a daily check-in of at most **15 minutes** for the developers on progress towards the Sprint Goal.
4. **Sprint Review** – presenting the finished Increment to stakeholders, collecting feedback.
5. **Sprint Retrospective** – the team improves how it works (Kaizen, topic 5).

### Artifacts and their commitments

| Artifact            | Content                                              | Commitment             |
| ------------------- | ---------------------------------------------------- | ---------------------- |
| **Product Backlog** | everything needed for the product, ordered           | **Product Goal**       |
| **Sprint Backlog**  | items chosen for the sprint + the plan               | **Sprint Goal**        |
| **Increment**       | the finished, usable result at the end of the sprint | **Definition of Done** |

### Estimating and measuring

- **Story points**: an estimate of the **relative** size of user stories (often with Fibonacci numbers: 1, 2, 3, 5, 8, 13). In **planning poker** everyone shows their estimate at the same time, and large differences are discussed.
- **Velocity**: the number of story points completed in a sprint. If the last three sprints were 18, 22 and 20 points, average velocity is **20**, so a 120-point backlog takes about **6 sprints**.
- **Burndown chart**: the remaining work over the days of the sprint (or release) – ideally falling steadily to zero.

## Kanban

**Kanban** (Japanese for "card", from the Toyota Production System; applied to software by David J. Anderson) uses no sprints: work **flows continuously**. Its main practices:

1. **Visualise the work** – a Kanban board with columns (e.g. To do → In progress → Test → Done).
2. **Limit work in progress** (**WIP limit**) – e.g. at most 3 cards in "In progress".
3. **Manage flow** – measure lead time, resolve bottlenecks.
4. Make policies explicit, feedback loops, continuous improvement.

```text
 │ To do       │ In progress (WIP 3) │ Test (WIP 2)  │ Done        │
 │ [F] [G] [H] │ [C] [D] [E]         │ [B]           │ [A]         │
```

> The essence of WIP limits: **"Stop starting, start finishing!"** Less parallel work = shorter lead time, less context switching (Lean: motion and inventory waste).

### Little's law

> **average lead time = average WIP / average throughput**

Example: if on average 12 tasks are in progress and the team finishes 4 tasks a week, the average lead time of a task is 12 / 4 = **3 weeks**. Halving WIP (to 6) halves lead time (1.5 weeks).

## Summary

- Scrum: Product Owner, Scrum Master, Developers; sprint (≤ 1 month), planning, Daily Scrum (15 min), review, retrospective; Product Backlog, Sprint Backlog, Increment.
- Story points, planning poker, velocity, burndown chart.
- Kanban: visualise, WIP limit, manage flow.
- Little's law: lead time = WIP / throughput.

## Lesson exercise

```quiz required
? Which Scrum role is responsible for **ordering the Product Backlog**?
+ Product Owner
- Scrum Master
- Developers
- project manager
! The Product Owner maximises the value of the product.

? What is the maximum length of the Daily Scrum in minutes?
= 15
= 15 minutes
! A short daily check-in on the Sprint Goal.

? In the last three sprints the team completed 24, 30 and 27 story points. What is the average velocity?
= 27
! (24 + 30 + 27) / 3.

? At this velocity, how many sprints does a 135-point backlog need?
= 5
= 5 sprints
! 135 / 27.

? What does a **WIP limit** mean in Kanban?
- a limit on team size
+ a limit on the number of work items in progress in a column
- the length of a sprint
- the upper limit of the budget
! Work In Progress limit.

? On average 10 tasks are in progress, and the team finishes 5 tasks a week. According to Little's law, what is the average lead time in weeks?
= 2
= 2 weeks
! 10 / 5.
```
