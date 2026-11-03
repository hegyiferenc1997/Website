---
title: Overview of Project Management Software
summary: What PM software is for, the main tool groups (classic schedulers, agile tools, visual boards, work management platforms), well-known examples and view types: Gantt, board, list, timeline, calendar, dashboard.
minutes: 25
---

## What you will learn

- what we use **project management software** for,
- which **tool groups** exist and what each is for,
- the well-known **examples** (MS Project, Jira, Trello, Asana, GitHub Projects, monday.com, ClickUp, Notion),
- the **views** in which the same project can be shown.

## What is PM software for?

The methods of the previous topics (WBS, network diagram, Gantt chart, risk register, KPIs, sprint board) can be done on paper or in a spreadsheet. **Project management software** keeps them **in one place**, **shared** and **up to date**:

- **planning**: tasks, dependencies, schedule, milestones,
- **execution**: who is working on what, what state a task is in,
- **communication**: comments, notifications, files in one place (topic 13),
- **control**: progress, burndown, dashboards, reports (topic 9),
- **traceability**: who changed what and when (change management, topic 14).

> The tool **does not replace** the method. A badly decomposed project remains badly decomposed even in the most expensive software – it just looks nicer.

## Tool groups

| Group                         | Characteristics                                                  | Examples                                    |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **classic schedulers**        | Gantt, dependencies, critical path, resource levelling, baseline | MS Project, Primavera P6, ProjectLibre      |
| **agile development tools**   | backlog, sprints, story points, burndown, issue tracking         | Jira, Azure DevOps Boards, YouTrack, Linear |
| **visual (Kanban) boards**    | columns and cards, simple, quick to learn                        | Trello, GitHub Projects, Kanbanize          |
| **work management platforms** | many views, automation, cross-team work                          | Asana, monday.com, ClickUp, Wrike           |
| **knowledge base + tasks**    | documentation and simple databases in one place                  | Notion, Confluence                          |

### A few well-known tools in brief

- **Microsoft Project**: the tool of classic, waterfall-style planning. Strong in network planning, critical path, resource management and comparison against the **baseline** – good for EVM too (topic 9).
- **Jira** (Atlassian): one of the most widespread tools of agile software development. Scrum and Kanban boards, **backlog**, sprints, customisable **workflows**, issue tracking, burndown and velocity charts.
- **Trello**: Kanban boards with cards; very simple, ideal for small teams and personal use.
- **Asana**, **monday.com**, **ClickUp**: flexible work management with list, board, timeline and calendar views and automations.
- **GitHub Projects**: boards linked to the repository's **issues** and **pull requests** – developers can plan where the code lives.
- **Notion**, **Confluence**: documentation, minutes, project charter, decision log – the "memory of the project".

## Views: the same data, several pictures

| View                 | What is it for?                                               | Related topic |
| -------------------- | ------------------------------------------------------------- | ------------- |
| **Gantt / timeline** | schedule, dependencies, milestones, critical path             | topic 7       |
| **board (Kanban)**   | the flow of work through columns (To do → In progress → Done) | topic 11      |
| **list / backlog**   | tasks ordered by priority                                     | topics 8, 11  |
| **calendar**         | deadlines, holidays, events                                   | topics 9, 14  |
| **dashboard**        | KPIs, burndown, costs, risks at a glance                      | topics 8, 9   |

```text
 Board view:
 ┌─ To do ───────┐ ┌─ In progress ─┐ ┌─ Review ─────┐ ┌─ Done ───────┐
 │ Registration  │ │ Login         │ │ Database     │ │ Project      │
 │ Password reset│ │ (WIP ≤ 2)     │ │ schema       │ │ skeleton, CI │
 └───────────────┘ └───────────────┘ └──────────────┘ └──────────────┘
```

## Cloud or own server?

- **SaaS (cloud)**: quick start, no operations, subscription fee (often **per user per month**).
- **self-hosted** (on-premise): full control over the data, but it must be operated – e.g. for sensitive data or strict regulation (GDPR, data protection rules).

## Summary

- PM software keeps planning, execution, communication and control in one shared place.
- Groups: classic schedulers (MS Project), agile tools (Jira), Kanban boards (Trello, GitHub Projects), work management platforms (Asana, monday.com, ClickUp), knowledge bases (Notion, Confluence).
- Views: Gantt, board, list, calendar, dashboard.
- The tool does not replace the method.

## Lesson exercise

```quiz required
? A strictly scheduled, construction-like project has to track a critical path and a baseline. Which tool fits best?
+ Microsoft Project
- Trello
- Notion
- Slack
! A classic scheduler: Gantt, critical path, baseline.

? Which tool links tasks directly to the repository's issues and pull requests?
- MS Project
- Trello
+ GitHub Projects
- Confluence
! We can plan next to the code.

? Which view shows the **flow** of work through columns?
- Gantt chart
+ board (Kanban)
- calendar
- dashboard
! To do → In progress → Done.

? A SaaS tool costs 8 euros per user per month. What is the yearly cost for a team of 12, in euros?
= 1152
! 8 · 12 · 12.

? Which is true of PM software?
- a good tool makes up for missing planning
+ the tool supports the method but does not replace it
- it can only be used with the waterfall methodology
- it is only for large companies
! Bad decomposition stays bad in the best tool too.
```
