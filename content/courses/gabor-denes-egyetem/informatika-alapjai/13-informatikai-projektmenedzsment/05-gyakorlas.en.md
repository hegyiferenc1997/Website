---
title: Practice – IT Project Management
summary: Review questions and a summary worksheet on the project triangle, planning and agile methods.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. Two weeks before the deadline the client asks for three new features, but deadline and budget stay. What do you suggest?</summary>

According to the project triangle this could only come at the expense of quality. Suggestion: prioritise the features; what is needed now goes in instead of something less important, the rest into a later release – or agree on more time or resources.

</details>

<details>
<summary>2. What is the difference between the sprint review and the retrospective?</summary>

The review is about the **product**: the finished increment is demonstrated and feedback is gathered. The retrospective is about the **team's work**: what went well, what to change.

</details>

<details>
<summary>3. A task takes 3 weeks, is not on the critical path and has 2 weeks of slack. What happens if it is 1 week late?</summary>

Nothing for the project end: it stays within its slack. (But afterwards it has only 1 week of slack left.)

</details>

```python run
# Ranking a risk matrix
risks = [
    ("key developer drops out", 2, 5),
    ("external API changes", 3, 3),
    ("late feedback", 4, 2),
    ("server failure at handover", 1, 4),
]
for name, prob, impact in sorted(risks, key=lambda r: r[1] * r[2], reverse=True):
    print(f"{prob * impact:2d}  {name}")
```

## Summary worksheet

```quiz required
? Which is **not** a characteristic of a project?
- one-off
- with a defined goal
- with a start and end
+ continuous, never-ending operation
! Ongoing operations are not a project.

? What is the chart called that shows tasks and their order on a timeline?
= Gantt
= Gantt chart
! Named after Henry Gantt.

? What is the highest risk score in the list above?
= 10
! 2 × 5 for the key developer dropping out.

? Which Scrum event aims to improve the team's way of working?
- sprint planning
- daily scrum
- sprint review
+ retrospective
! Retrospective.

? Which risk response is taking out insurance?
- avoid
- reduce
+ transfer
- accept
! Someone else bears part of the damage.

? What does the WIP limit restrict in Kanban?
+ how many tasks may be in a column at once
- the sprint length
- the team size
- the budget
! Work In Progress.
```
