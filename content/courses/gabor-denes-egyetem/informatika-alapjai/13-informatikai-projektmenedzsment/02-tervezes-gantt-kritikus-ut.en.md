---
title: Planning – WBS, Gantt, Critical Path, Risk
summary: Work breakdown structure, dependencies, Gantt chart, computing the critical path and risk management.
minutes: 20
---

## What you will learn

- how to break a project into tasks (**WBS**),
- how to schedule with a **Gantt chart**, and what the **critical path** is,
- how to manage **risks**.

## Work breakdown structure (WBS)

A **WBS** (Work Breakdown Structure) breaks the project into smaller and smaller manageable parts, until every task can be **estimated** and assigned to **one owner**.

```text
 University timetable app
 ├── 1. Design
 │   ├── 1.1 Gathering requirements
 │   └── 1.2 Screen designs
 ├── 2. Development
 │   ├── 2.1 Database
 │   ├── 2.2 Back end
 │   └── 2.3 Mobile UI
 └── 3. Testing and handover
```

## Dependencies and the Gantt chart

Tasks have **dependencies**: the back end can only be finished after the database. A **Gantt chart** shows the tasks, their length and order on a timeline:

```text
 week:           1   2   3   4   5   6   7   8
 A Requirements ███
 B Designs          ███ ███
 C Database         ███ ███
 D Back end                 ███ ███ ███
 E UI                           ███ ███
 F Testing                              ███ ███
```

## Critical path

The **critical path** is the **longest** chain of dependent tasks from start to finish. It gives the project's minimum length: if a critical task is late, the whole project is late. Non-critical tasks have **slack** (they can slip a little).

| Task | Length (weeks) | Predecessor |
| ---- | -------------- | ----------- |
| A    | 1              | –           |
| B    | 2              | A           |
| C    | 2              | A           |
| D    | 3              | C           |
| E    | 2              | B           |
| F    | 2              | D, E        |

```python run
# Earliest finish for every task, then the critical path
tasks = {
    "A": (1, []), "B": (2, ["A"]), "C": (2, ["A"]),
    "D": (3, ["C"]), "E": (2, ["B"]), "F": (2, ["D", "E"]),
}
finish = {}
for name, (length, preds) in tasks.items():   # the order is already valid
    start = max((finish[p] for p in preds), default=0)
    finish[name] = start + length
print("Earliest finishes:", finish)
print("Project length:", max(finish.values()), "weeks")

# Critical path backwards: always follow the predecessor that finishes last
path, cur = [], "F"
while cur:
    path.append(cur)
    preds = tasks[cur][1]
    cur = max(preds, key=lambda p: finish[p]) if preds else None
print("Critical path:", " → ".join(reversed(path)))
```

The result: A → C → D → F, 8 weeks. The chain A → B → E → F is only 7 weeks, so B and E together have 1 week of slack.

## Risk management

A **risk** is a possible future event that threatens the project. A **risk matrix** ranks them by the product of **probability** and **impact**:

| Risk                           | Probability (1–5) | Impact (1–5) | Score | Response                         |
| ------------------------------ | ----------------- | ------------ | ----- | -------------------------------- |
| the key developer drops out    | 2                 | 5            | 10    | knowledge sharing, documentation |
| the external API changes       | 3                 | 3            | 9     | abstraction layer, monitoring    |
| the client gives feedback late | 4                 | 2            | 8     | fixed review meetings            |

Responses: **avoid**, **reduce**, **transfer** (e.g. insurance, contract), **accept**.

## Summary

- WBS: breaking the project into estimable tasks with owners.
- Gantt chart: tasks on a timeline; critical path: the longest dependent chain, which is the project's length.
- Risk = probability × impact; responses: avoid, reduce, transfer, accept.

## Exercise

```quiz required
? What does the abbreviation WBS stand for?
= Work Breakdown Structure
! Breaking the project into smaller tasks.

? How many weeks long is the lesson's example project?
= 8
! The critical path A → C → D → F: 1 + 2 + 3 + 2.

? What happens if a task on the **critical path** is one week late (and everything else is on plan)?
- Nothing, there is slack.
+ The whole project is one week late.
- The project becomes one week shorter.
- Only testing is skipped.
! Critical tasks have no slack.

? What is the risk score if the probability is 4 and the impact is 3?
= 12
! Score = probability × impact.
```
