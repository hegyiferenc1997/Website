---
title: Practice – Teamwork and Leadership Communication
summary: Review questions and a summary worksheet on team roles, leadership styles, feedback and delegation.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Think about a past team project: which Belbin roles did you fill, and which was missing from the team?</summary>

There is no single right answer. Look at what went well and what didn't: if everything slipped at the end, an implementer or completer finisher may have been missing; if you argued a lot but didn't reach decisions, a coordinator; if the solution lacked creativity, a plant.

</details>

<details>
<summary>2. Why is there no single best leadership style?</summary>

Because the effective style depends on the situation (crisis or calm development), the task, and the team member's competence and commitment. According to situational leadership, the same person needs different styles for different tasks.

</details>

<details>
<summary>3. Write SBI feedback for a teammate who regularly uploads their code at the last minute!</summary>

"In the last two sprints (S) your code went into the repo the night before the deadline (B). That left no time for review, and two bugs showed up at the demo (I). What do you think would help you upload earlier – maybe in smaller pieces?"

</details>

<details>
<summary>4. Why shouldn't you take back a delegated task at the first obstacle?</summary>

Because the colleague won't learn, and you signal that you don't trust them; next time they won't even try. Help with questions and resources instead, and let them find the solution.

</details>

## Summary worksheet

> You lead a four-person university project team: Anna is an experienced Python developer, Ben is a first-year just learning Git, Cecilia writes well but is unsure about presenting, David comes up with lots of ideas.

```quiz required
? Which Belbin role fits David best?
+ plant
- completer finisher
- implementer
- monitor evaluator
! Creative, new ideas.

? Ben has to set up the shared repo. Which situational leadership style fits him?
+ directing (precise steps, close follow-up)
- delegating
- laissez-faire
- none, he'll figure it out
! Beginner level in this task.

? Anna has to write the data processing module. Which style fits her?
- directing
- coaching
- supporting
+ delegating
! Experienced and confident in this task.

? Cecilia knows the material but is unsure about presenting. Which style fits her?
- directing
- delegating
+ supporting (encouragement, joint decisions)
- autocratic
! Capable but unsure → support.

? At the end of the project the client was satisfied thanks to David's idea. Which is the best SBI element for the **impact** part?
- "David is a creative person."
- "At yesterday's presentation…"
+ "…and the client said it was the best feature."
- "…you presented the new search…"
! The Impact is the consequence of the behaviour.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Payback of delegating.** Write the function `payback(own_time, training, review)` for a weekly recurring task: after how many weeks does delegating pay off (to 1 decimal)? If the weekly saving isn't positive, return `None`!

```python starter
def payback(own_time, training, review):
    return round(training / own_time, 1)
```

<details>
<summary>Solution</summary>

```python solution
def payback(own_time, training, review):
    saving = own_time - review               # what you gain each week
    if saving <= 0:
        return None
    return round(training / saving, 1)
```

</details>

```python test
assert payback(2, 6, 0.5) == 4.0
assert payback(3, 10, 1) == 5.0
assert payback(8, 10, 8) is None
print("All checks passed!")
```

**2.** **Missing roles.** Write the function `missing_roles(team, roles)`, which from a `{name: [strong roles]}` team and a list of roles returns in alphabetical order the roles nobody is strong in!

```python starter
def missing_roles(team, roles):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def missing_roles(team, roles):
    covered = {r for strengths in team.values() for r in strengths}   # what someone takes on
    return sorted(set(roles) - covered)
```

</details>

```python test
r = ["shaper", "implementer", "completer", "coordinator", "plant"]
t = {"Agi": ["plant"], "Dani": ["shaper", "plant"], "Emese": ["coordinator", "implementer"]}
assert missing_roles(t, r) == ["completer"]
assert missing_roles({}, ["a", "b"]) == ["a", "b"]
print("All checks passed!")
```

**3.** **Situational leadership.** Write the function `style(competence, commitment)` (1–5 scales): competence ≤ 2 and commitment ≥ 4 → `"S1"`; competence ≥ 4 and commitment ≥ 4 → `"S4"`; competence ≥ 4 and commitment ≤ 3 → `"S3"`; every other case → `"S2"`!

```python starter
def style(competence, commitment):
    return "S4" if competence >= 4 else "S1"
```

<details>
<summary>Solution</summary>

```python solution
def style(competence, commitment):
    if competence <= 2 and commitment >= 4:
        return "S1"                                 # enthusiastic beginner: directing
    if competence >= 4:
        return "S4" if commitment >= 4 else "S3"    # experienced: delegating or supporting
    return "S2"                                     # learning, disillusioned: coaching
```

</details>

```python test
assert style(1, 5) == "S1"
assert style(2, 2) == "S2"
assert style(4, 2) == "S3"
assert style(5, 5) == "S4"
assert style(3, 4) == "S2"
print("All checks passed!")
```

### Quick check questions

```quiz
? What are the three elements of the SBI model?
+ situation, behaviour, impact
- role, success, idea
- strategy, budget, schedule
- praise, criticism, praise
! A concrete situation, an observable behaviour, and its impact.

? A weekly task costs you 4 hours; training someone takes 9 hours, after which 1 hour of review a week stays with you. After how many weeks does delegating pay off?
= 3
! $9 / (4 - 1) = 3$ weeks.

? Which Belbin role is precise, looks for errors and finishes on time?
- plant
+ completer finisher
- resource investigator
- coordinator
! The completer finisher wraps up the work carefully.

? What is a one-on-one (1:1) meeting for?
- only for discussing a pay rise
+ a regular, confidential conversation about the team member's growth, problems and feedback
- for publicly evaluating the team
- for reading out the project status
! It's the team member's time, not the leader's.
```
