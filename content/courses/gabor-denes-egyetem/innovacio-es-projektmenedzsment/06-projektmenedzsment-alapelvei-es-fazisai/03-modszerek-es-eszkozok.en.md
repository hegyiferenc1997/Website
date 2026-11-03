---
title: Project Management Methods and Tools
summary: An overview map – methodologies (waterfall, agile, PRINCE2, hybrid) and the key tools (charter, WBS, Gantt, network diagram, RACI, risk register, Kanban board, earned value) by phase.
minutes: 15
---

## What you will learn

- the difference between a **methodology**, a **method** and a **tool**,
- the main **project management methodologies**,
- which **tool** is used in which phase – this lesson is the "map" for the rest of the course.

## Methodology, method, tool

- **Methodology**: the framework for running the whole project – roles, phases, rules (e.g. PRINCE2, Scrum).
- **Method / technique**: a way of solving a specific task (e.g. critical path calculation, PERT estimation).
- **Tool**: a document, diagram or software used to apply the method (e.g. Gantt chart, Jira).

## The main methodologies

| Methodology                 | Characteristic                                                 | When is it good?                                    |
| --------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| **waterfall** (traditional) | sequential phases, detailed up-front plan                      | stable, well-known requirements (e.g. construction) |
| **agile** (Scrum, Kanban)   | short iterations, continuous feedback, variable scope          | uncertain, changing requirements (e.g. software)    |
| **PRINCE2**                 | process- and product-focused, managed by stages                | large organisations, the public sector              |
| **hybrid**                  | a mix of both (e.g. a waterfall-like frame, agile development) | many real projects                                  |

Topic 11 compares the methodologies in detail.

## Tools by phase

| Phase                 | Tool                                                        | In detail    |
| --------------------- | ----------------------------------------------------------- | ------------ |
| initiating            | business case, **project charter**, stakeholder list        | topics 7, 13 |
| planning              | **WBS** (work breakdown structure)                          | topic 7      |
| planning              | **network diagram**, **critical path** (CPM), PERT estimate | topics 7, 9  |
| planning              | **Gantt chart** (timeline schedule), milestones             | topic 7      |
| planning              | **SMART goals**, **KPIs**, requirements list                | topic 8      |
| planning              | **RACI matrix** (responsibility matrix)                     | topic 12     |
| planning, controlling | **risk register**, probability–impact matrix                | topic 14     |
| executing             | **Kanban board**, sprint board, daily stand-up              | topic 11     |
| monitoring            | **earned value**, status report                             | topic 9      |
| closing               | acceptance record, **lessons learned**                      | topic 10     |
| throughout            | **project management software** (MS Project, Jira, Trello…) | topic 15     |

## A small taste: the Gantt chart

A **Gantt chart** (Henry Gantt, 1910s) shows activities in rows and time horizontally:

```text
 Activity           │ Week 1 │ Week 2 │ Week 3 │ Week 4 │
 ───────────────────┼────────┼────────┼────────┼────────┤
 Requirements       │████████│        │        │        │
 Design             │    ████│████    │        │        │
 Development        │        │    ████│████████│        │
 Testing            │        │        │    ████│████    │
 Handover ◆         │        │        │        │    ◆   │
```

The ◆ symbol is a **milestone**: an important event of zero duration (e.g. "handover").

## Summary

- Methodology = complete framework; method = a way of solving a task; tool = document, diagram, software.
- Main methodologies: waterfall, agile, PRINCE2, hybrid.
- Each phase has its typical tools; the following topics of the course cover them in detail.
- A Gantt chart shows activities on a timeline; a milestone is a zero-duration event.

## Lesson exercise

```quiz required
? Which is a **methodology** (not a tool)?
- Gantt chart
- RACI matrix
+ PRINCE2
- Jira
! PRINCE2 is a complete project management framework.

? Which tool breaks the whole work of the project down into smaller, manageable parts?
+ WBS (work breakdown structure)
- SWOT
- Pareto chart
- earned value
! Work Breakdown Structure.

? What is a **milestone** in a schedule?
- the longest activity
+ an important event of zero duration
- the project budget
- a team member's holiday
! E.g. "system handover".

? Which approach fits a software project with **uncertain, rapidly changing requirements** best?
- waterfall
+ agile
- neither
- only PRINCE2
! Short iterations and continuous feedback handle change.

? After whom is the timeline schedule chart named? (surname)
= Gantt
= Henry Gantt
! Henry Gantt, in the 1910s.
```
