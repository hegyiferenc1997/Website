---
title: Practice – PM Software and Summary
summary: Review questions and a summary worksheet for the fifteenth topic, with calculation exercises covering the whole course.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. A team of 4 students is working on a semester assignment. Which tool would you suggest, and why?</summary>

A simple Kanban board, e.g. Trello or GitHub Projects: free, quick to learn, and with GitHub Projects the tasks are linked directly to the code. MS Project or an over-configured Jira would be an unnecessary burden for a team this size.

</details>

<details>
<summary>2. Why is over-configuration dangerous when introducing a PM tool?</summary>

Because with too many states and mandatory fields the team stops updating the issues, so the tool shows an outdated picture of the project and management decides on bad data. Start simple and extend only when there is a real need.

</details>

<details>
<summary>3. After the new tool is introduced, management still asks for Excel reports. Which ADKAR step suffers, and what should be done?</summary>

Reinforcement: if the report is made the old way, it is not worth it for the team to keep the new tool up to date. Management should get its information from the tool's dashboard, and the old spreadsheets should be closed.

</details>

<details>
<summary>4. In the capstone project CPI = 0.8. Name two possible project manager decisions!</summary>

Reducing scope (postponing a feature to the next version) or requesting extra budget from the sponsor – both through the change control process. It is also worth investigating the cause of the overrun (e.g. underestimation, missing expertise).

</details>

## Summary worksheet

```quiz required
? Weights: features 0.6, cost 0.4. Tool "X" scores 3 and 5. What is its weighted score?
= 3.8
! 0.6 · 3 + 0.4 · 5 = 1.8 + 2.0.

? A tool costs 10 euros per user per month. What is the yearly licence cost for an organisation of 25, in euros?
= 3000
! 10 · 25 · 12.

? Which tool is rather the home of the project's **documentation** ("memory")?
- Trello
- MS Project
+ Confluence
- Jira
! A knowledge base: minutes, decision log, charter.

? How can the Definition of Done be automated in a Jira-like tool?
- with more mandatory fields on every issue
+ with a workflow rule: "Done" only after green tests and an approved code review
- by deleting issues at the end of the sprint
- by hiding the burndown chart
! A transition condition in the workflow.

? Activities: A 2 days; B 5 days (after A); C 3 days (after A); D 2 days (after B and C). How many days does the project take?
= 9
= 9 days
! A–B–D: 2 + 5 + 2.

? EV = 30, PV = 40. What is the SPI?
= 0.75
! EV / PV.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Tipping point.** Two tools' scores depend linearly on a criterion's weight `w`: $A(w) = a_0 + a_1 w$, $B(w) = b_0 + b_1 w$. Write the function `tipping_point(a0, a1, b0, b1)`, which tells at which `w` the two are equal (to 3 decimals); if the two lines are parallel, return `None`!

```python starter
def tipping_point(a0, a1, b0, b1):
    return round((b0 - a0) / (a1 + b1), 3)
```

<details>
<summary>Solution</summary>

```python solution
def tipping_point(a0, a1, b0, b1):
    if a1 == b1:
        return None                        # parallel lines: never equal (or always)
    return round((b0 - a0) / (a1 - b1), 3) # a0 + a1·w = b0 + b1·w
```

</details>

```python test
assert tipping_point(2.9, 2.1, 4.4, -1.4) == 0.429
assert tipping_point(3, 2, 4, -1) == 0.333
assert tipping_point(1, 1, 2, 1) is None
print("All checks passed!")
```

**2.** **Workflow check.** Write the function `first_illegal(history, transitions)`, which from a ticket's state history returns the first illegal transition as a `(from, to)` pair, or `None` if every transition is allowed!

```python starter
def first_illegal(history, transitions):
    return None
```

<details>
<summary>Solution</summary>

```python solution
def first_illegal(history, transitions):
    for src, dst in zip(history, history[1:]):   # consecutive state pairs
        if dst not in transitions[src]:
            return (src, dst)
    return None
```

</details>

```python test
transitions = {"New": {"In progress", "Rejected"}, "In progress": {"Review", "New"},
               "Review": {"Done", "In progress"}, "Done": set(), "Rejected": set()}
assert first_illegal(["New", "In progress", "Review", "Done"], transitions) is None
assert first_illegal(["New", "In progress", "Done"], transitions) == ("In progress", "Done")
assert first_illegal(["New", "Rejected", "In progress"], transitions) == ("Rejected", "In progress")
print("All checks passed!")
```

**3.** **Cycle time percentile.** Write the function `percentile(data, p)`: sort the data and return the `round(p · n)`-th element (counting from 1; `int(p * n + 0.5)`), and the function `mean_and_p85(data)`, which gives the pair `(mean to 1 decimal, 85th percentile)`!

```python starter
def percentile(data, p):
    return data[int(p * len(data) + 0.5) - 1]

def mean_and_p85(data):
    return (round(sum(data) / len(data), 1), percentile(data, 0.85))
```

<details>
<summary>Solution</summary>

```python solution
def percentile(data, p):
    ordered = sorted(data)                           # a percentile needs sorted data
    return ordered[int(p * len(ordered) + 0.5) - 1]

def mean_and_p85(data):
    return (round(sum(data) / len(data), 1), percentile(data, 0.85))
```

</details>

```python test
times = [5, 2, 10, 3, 3, 14, 4, 3, 6, 2]
assert mean_and_p85(times) == (5.2, 10)
assert percentile(list(range(20, 0, -1)), 0.85) == 17
assert percentile([5, 1, 3], 0.5) == 3
print("All checks passed!")
```

### Quick check questions

```quiz
? Which view shows tasks on a timeline, as bars, together with their dependencies?
+ Gantt view
- Kanban board
- list view
- calendar
! Gantt is the basic view of classic schedulers.

? What is the role of a pilot in introducing a new PM tool?
- rolling the tool out to the whole organisation at once
+ trying it with a smaller team, refining the rollout based on the experience
- deleting the old tool
- negotiating the tool's price
! What works in practice is revealed at low risk.

? Two tools: A = 2 + 3w, B = 3 + w. At which w are their scores equal? (as a decimal)
= 0,5
= 0.5
! $2 + 3w = 3 + w \Rightarrow w = 0.5$.

? The cycle times of 10 tickets, sorted: 1, 2, 2, 3, 3, 4, 4, 5, 8, 12. What is the 85th percentile (with the simple method)?
= 8
! Element $0.85 \cdot 10 = 8.5 \to 9$: 8.
```
