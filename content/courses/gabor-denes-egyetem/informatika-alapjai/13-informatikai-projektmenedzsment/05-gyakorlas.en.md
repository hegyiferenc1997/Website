---
title: Practice – IT Project Management
summary: Review questions and a summary worksheet on the project triangle, planning and agile methods.
minutes: 45
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **PERT estimate.** Write the `pert(optimistic, likely, pessimistic)` function, which gives a task's expected duration with the PERT formula: $(o + 4m + p) / 6$, rounded to one decimal!

```python starter
def pert(optimistic, likely, pessimistic):
    return (optimistic + likely + pessimistic) / 3
```

<details>
<summary>Solution</summary>

```python solution
def pert(optimistic, likely, pessimistic):
    return round((optimistic + 4 * likely + pessimistic) / 6, 1)   # the most likely value with fourfold weight
```

</details>

```python test
assert pert(2, 4, 12) == 5.0
assert pert(1, 2, 3) == 2.0
assert pert(3, 5, 10) == 5.5
print("All checks passed!")
```

**2.** **Critical path.** Write the `project_length(tasks)` function, which, from a `{name: (duration, [prerequisites])}` dictionary, computes the project's earliest finish (in days)! A task can start when all its prerequisites are done.

```python starter
def project_length(tasks):
    return sum(d for d, _ in tasks.values())
```

<details>
<summary>Solution</summary>

```python solution
def project_length(tasks):
    finish = {}
    def done_at(name):
        if name not in finish:                         # compute every task only once
            duration, prereqs = tasks[name]
            finish[name] = max((done_at(p) for p in prereqs), default=0) + duration
        return finish[name]
    return max(done_at(n) for n in tasks)
```

</details>

```python test
t = {"design": (3, []), "backend": (5, ["design"]), "frontend": (4, ["design"]), "test": (2, ["backend", "frontend"])}
assert project_length(t) == 10
assert project_length({"a": (2, []), "b": (3, [])}) == 3
print("All checks passed!")
```

**3.** **Communication channels.** Write the `channels(team_size)` function, which tells how many two-person communication channels there are in an $n$-person team ($n(n-1)/2$)! This is one reason behind Brooks's observation: channels grow quadratically with headcount.

```python starter
def channels(team_size):
    return team_size
```

<details>
<summary>Solution</summary>

```python solution
def channels(team_size):
    return team_size * (team_size - 1) // 2   # every pair is one channel
```

</details>

```python test
assert channels(1) == 0
assert channels(5) == 10
assert channels(10) == 45
print("All checks passed!")
```

### Quick check questions

```quiz
? A task's optimistic estimate is 2, most likely 5, pessimistic 14 days. What is the PERT estimate (in days)?
= 6
! $(2 + 4 \cdot 5 + 14) / 6 = 36 / 6 = 6$.

? What is the critical path?
- the sequence of the cheapest tasks
+ the longest chain of dependent tasks, which determines when the project finishes
- the riskiest task
- management's approval route
! If anything on the critical path slips, the whole project slips.

? A team completed 18, 22 and 20 points in its last three sprints. The remaining work is 100 points. How many more sprints are needed (at average velocity)?
= 5
! Average: $60 / 3 = 20$ points/sprint, $100 / 20 = 5$.

? What does Brooks's law say?
- the more people, the faster the project
+ adding people to a late software project makes it even later
- a project always takes half the estimated time
- team size doesn't matter
! New people need training, and the number of communication channels grows.
```
