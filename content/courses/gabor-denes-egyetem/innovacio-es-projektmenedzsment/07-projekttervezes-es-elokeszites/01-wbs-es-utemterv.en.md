---
title: Project Planning Methods – WBS and Schedule
summary: The work breakdown structure (WBS) and the 100% rule, work packages, the activity list, dependencies between activities (FS, SS, FF, SF) and building a Gantt chart.
minutes: 25
---

## What you will learn

- how to break a project down with a **work breakdown structure** (WBS),
- what the **100% rule** and a **work package** are,
- which **dependencies** can exist between activities,
- how a WBS becomes a **Gantt chart**.

## The planning steps

```text
 scope → WBS → activity list → dependencies → duration estimates
       → network diagram, critical path → Gantt chart → resource and cost plan
```

## Work breakdown structure (WBS)

The **WBS** (Work Breakdown Structure) breaks the **entire work** of the project hierarchically into smaller and smaller parts. The lowest level is the **work package**: a piece small enough that its time and cost can be estimated reliably and that can be assigned to one owner.

Example: a university course registration web app

```text
 1. Course registration system
 ├── 1.1 Project management
 │    ├── 1.1.1 Planning
 │    └── 1.1.2 Status reports
 ├── 1.2 Requirements
 │    ├── 1.2.1 Interviews with students and lecturers
 │    └── 1.2.2 Requirements specification
 ├── 1.3 Development
 │    ├── 1.3.1 Database
 │    ├── 1.3.2 Back end (API)
 │    └── 1.3.3 User interface
 ├── 1.4 Testing
 │    ├── 1.4.1 Automated tests
 │    └── 1.4.2 User acceptance test
 └── 1.5 Roll-out
      ├── 1.5.1 Deployment
      └── 1.5.2 Training, documentation
```

Rules:

- **100% rule**: the WBS contains **exactly 100%** of the project's work – nothing may be left out and nothing unnecessary may be added. Every parent is the sum of its children.
- **Deliverable-oriented, not activity-oriented**: elements are nouns (what must be produced), not verbs.
- **8/80 rule of thumb**: a work package should take at least 8 and at most 80 work hours.
- Every WBS element has a **WBS dictionary** entry: description, owner, acceptance criteria.

## Activity list and dependencies

Work packages are broken into **activities** (with verbs: "design the database schema"), and then we decide their order. The four dependency types:

| Type                      | Meaning                              | Example                                              |
| ------------------------- | ------------------------------------ | ---------------------------------------------------- |
| **FS** (finish-to-start)  | B can start only when A has finished | first development, then testing                      |
| **SS** (start-to-start)   | B can start when A has started       | writing documentation starts with development        |
| **FF** (finish-to-finish) | B can finish when A has finished     | testing can only close after development             |
| **SF** (start-to-finish)  | B can finish when A has started      | the old system may stop once the new one has started |

**FS** is the most common. A dependency may also have a **lag**: e.g. "+2 days for the paint to dry".

## Duration estimation

- **Analogous estimate**: based on a similar earlier project.
- **Parametric estimate**: from unit data (e.g. 1 screen = 3 days → 10 screens = 30 days).
- **Expert judgement** and the **Delphi method** (anonymous, multi-round expert consensus).
- **Three-point (PERT) estimate**: optimistic, most likely and pessimistic values – we calculate with it in topic 9.

## Gantt chart

Knowing the activities, dependencies and durations, we draw the **Gantt chart** (topic 6): bars are activities, arrows are dependencies, ◆ marks milestones. It is the best-known communication tool of a project because it shows at a glance what happens when.

## Summary

- The WBS breaks down the entire work of the project hierarchically; the lowest level is the work package.
- 100% rule: nothing left out, nothing unnecessary added.
- Dependencies: FS (most common), SS, FF, SF; they may have lags.
- Estimating: analogous, parametric, expert, three-point.
- A Gantt chart shows activities on a timeline.

## Lesson exercise

```quiz required
? What does the **100% rule** of the WBS say?
+ the WBS contains the entire work of the project, nothing left out and nothing unnecessary added
- the project must finish 100% on time
- every work package is 100 hours
- the budget must be used up to 100%
! Every parent is exactly the sum of its children.

? What is the element at the lowest level of the WBS called?
- milestone
+ work package
- sponsor
- sprint
! Work package: estimable, assignable to one owner.

? "Testing can start only when development has finished." What kind of dependency is this?
+ FS (finish-to-start)
- SS (start-to-start)
- FF (finish-to-finish)
- SF (start-to-finish)
! Finish-to-Start, the most common type.

? Parametric estimate: building 1 screen takes 3 days. How many days do 12 screens take?
= 36
= 36 days
! 12 · 3.

? According to the 8/80 rule, what is the maximum number of work hours for a work package?
= 80
= 80 hours
! At least 8, at most 80 hours.
```
