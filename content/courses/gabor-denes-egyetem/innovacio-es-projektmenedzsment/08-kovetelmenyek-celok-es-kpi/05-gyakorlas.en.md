---
title: Practice – Requirements, Objectives, KPIs
summary: Review questions and a summary worksheet for the eighth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Write a user story and one acceptance criterion for the "pre-order" feature of a canteen app!</summary>

As a student, I want to pre-order my lunch so that I do not have to queue. Acceptance criterion: Given that it is before 11:00, when I choose a menu and pay, then I receive a confirmation with a pick-up code.

</details>

<details>
<summary>2. Rewrite as a SMART objective: "Customer service should be faster."</summary>

E.g.: "By 30 April 2027, reduce the average first response time to support tickets from 24 hours to under 4 hours, with the current headcount, by introducing an automatic ticket assignment system."

</details>

<details>
<summary>3. Why should non-functional requirements also be given as numbers?</summary>

Because only then can they be tested and accepted. "It should be fast" leads to arguments at handover; "respond within 1 s in 95% of cases" can be checked unambiguously.

</details>

<details>
<summary>4. Give a vanity metric for a mobile app and what you would replace it with!</summary>

The number of downloads is a vanity metric, because many downloaders never use the app. Instead: monthly active users (MAU), 30-day retention rate.

</details>

## Summary worksheet

```quiz required
? "The system must be available in English and Hungarian and store passwords encrypted." Which standard lists such quality characteristics?
- ISO 9001
+ ISO/IEC 25010
- PMBOK
- PRINCE2
! The software product quality model.

? In a MoSCoW prioritisation the total effort is 150 days. By the rule of thumb, at most how many days should go to "Must" requirements?
= 90
= 90 days
! 150 · 0.6.

? Which tool links requirements to test cases?
- Gantt chart
+ requirements traceability matrix
- SWOT
- Pareto chart
! Requirements Traceability Matrix.

? Which SMART criterion is missing from "Test coverage should reach 80%."?
- specific
- measurable
+ time-bound
- relevant
! It does not say by when.

? A KPI starts at 40, its target is 90 and its current value is 65. What percentage has been achieved?
= 50
= 50%
! (65 − 40) / (90 − 40) · 100.

? A satisfaction survey shows 35% promoters, 40% passives, 25% detractors. What is the NPS?
= 10
= +10
! 35 − 25.

? Which is a **lagging** indicator?
+ the number of customer complaints after release
- the share of code reviews during development
- the success rate of automated tests during the sprint
- the number of open risks during planning
! It shows the result already achieved, afterwards.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Achievability of a SMART goal.** Write the function `required_growth(start, goal, months)` (required monthly growth in %, to 1 decimal) and the function `achievable(start, goal, months, past)`, which returns `True` if the goal can be reached in `months` months with a monthly growth of `past` %!

```python starter
def required_growth(start, goal, months):
    return round(100 * (goal - start) / start / months, 1)

def achievable(start, goal, months, past):
    return past >= required_growth(start, goal, months)
```

<details>
<summary>Solution</summary>

Growth compounds: linear calculation overestimates the required rate (and underestimates what a constant rate can achieve).

```python solution
def required_growth(start, goal, months):
    return round(100 * ((goal / start) ** (1 / months) - 1), 1)   # compound growth inverted

def achievable(start, goal, months, past):
    return start * (1 + past / 100) ** months >= goal
```

</details>

```python test
assert required_growth(2000, 10_000, 12) == 14.4
assert required_growth(100, 400, 2) == 100.0
assert achievable(2000, 10_000, 12, 6.8) is False
assert achievable(1000, 1500, 12, 4) is True
print("All checks passed!")
```

**2.** **RAG status.** Write the function `kpi_status(actual, target, direction, tolerance=0.1)`! `direction` is `"up"` (more is better) or `"down"` (less is better). An achievement of 1 or more is `"GREEN"`, between `1 - tolerance` and 1 `"AMBER"`, below that `"RED"`.

```python starter
def kpi_status(actual, target, direction, tolerance=0.1):
    a = actual / target
    return "GREEN" if a >= 1 else "AMBER" if a >= 1 - tolerance else "RED"
```

<details>
<summary>Solution</summary>

```python solution
def kpi_status(actual, target, direction, tolerance=0.1):
    a = actual / target if direction == "up" else target / actual   # "down": divide the other way
    return "GREEN" if a >= 1 else "AMBER" if a >= 1 - tolerance else "RED"
```

</details>

```python test
assert kpi_status(4200, 4000, "up") == "GREEN"
assert kpi_status(1150, 1000, "down") == "RED"
assert kpi_status(1050, 1000, "down") == "AMBER"
assert kpi_status(3.7, 4.0, "up") == "AMBER"
print("All checks passed!")
```

**3.** **OKR score.** Write the function `okr_score(key_results)`, which from a list of `(baseline, achieved, target)` triples computes the average score (to 2 decimals): per key result, the share of the distance covered, clamped between 0 and 1!

```python starter
def okr_score(key_results):
    return round(sum(a / t for _, a, t in key_results) / len(key_results), 2)
```

<details>
<summary>Solution</summary>

```python solution
def okr_score(key_results):
    scores = [min(1.0, max(0.0, (a - b) / (t - b))) for b, a, t in key_results]
    return round(sum(scores) / len(scores), 2)
```

</details>

```python test
assert okr_score([(2000, 4200, 5000), (3.9, 4.4, 4.6), (20, 31, 40)]) == 0.67
assert okr_score([(20, 50, 60)]) == 0.75
assert okr_score([(0, 120, 100), (0, -10, 100)]) == 0.5
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is a non-functional requirement?
- the user can change their password
+ the page loads within 2 seconds
- the system produces a PDF invoice
- the admin can delete users
! A non-functional requirement describes how well the system should work.

? What does the "W" mean in MoSCoW?
- Want
+ Won't (this time): not delivered now
- Weekly
- Whole
! What's left out now may still come in later.

? A KPI's target is 50, the actual value is 40, more is better. What is the achievement in %?
= 80
! $40 / 50 = 0.8$.

? What's the difference between a leading and a lagging indicator?
+ a leading indicator predicts the result in advance, a lagging one measures it afterwards
- leading indicators are measured by leaders, lagging ones by the team
- there's no difference
- a lagging indicator is always financial
! E.g. the number of active users (leading) predicts revenue (lagging).
```
