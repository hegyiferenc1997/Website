---
title: Practice – Time Management and Organisation
summary: Review questions and a summary worksheet on goal setting, prioritising and time-management techniques; making your own weekly plan.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Rewrite as a SMART goal: "I'll get better at English."</summary>

For example: "By 31 January I'll practise 20 minutes every weekday with a language app and read 4 English-language articles about software development." Specific, measurable, realistic, relevant and time-bound.

</details>

<details>
<summary>2. Why is quadrant 2 (not urgent but important) the most important in the Eisenhower matrix?</summary>

Because it contains the activities that serve your long-term goals (regular study, health, relationships, growth). If they are neglected, sooner or later they become urgent (studying all night before an exam), and you end up firefighting in quadrant 1, under stress.

</details>

<details>
<summary>3. Make a weekly plan with time blocking!</summary>

First enter the fixed times (classes, work), then the important quadrant 2 tasks in longer blocks (e.g. two 2-hour programming blocks), one or two short blocks for emails and messages, and rest, exercise, sleep. At the end of the week, check what happened and adjust the plan.

</details>

<details>
<summary>4. What would you advise a classmate who has been putting off starting a big assignment for a week?</summary>

Break it into small steps and write down the first 5-minute step (e.g. "create the project folder and the README"); use the 5-minute rule; put the phone away; work in a Pomodoro rhythm; ask if stuck; and set their own earlier interim deadlines.

</details>

## Summary worksheet

> It's Monday morning. Your to-dos: (a) a programming assignment due Wednesday, (b) a maths problem set for Friday, (c) 40 unread messages in the group chat, (d) your portfolio project, (e) a new season of a series.

```quiz required
? Which quadrant does the Wednesday assignment fall into on Monday morning?
+ 1. urgent and important
- 2. not urgent but important
- 3. urgent but not important
- 4. neither urgent nor important
! Important, with a close deadline.

? Which quadrant does the portfolio project fall into?
- 1. urgent and important
+ 2. not urgent but important
- 3. urgent but not important
- 4. neither urgent nor important
! Important in the long run, but no close deadline.

? What should you do with the 40 unread chat messages?
- read them all one by one right away, before the assignment
+ skim them in a short, dedicated time block, after your important tasks
- never read them
- reply to every one
! Shallow work – batch it.

? You plan 4 pomodoros for the assignment. How many minutes is that with breaks, if the 3 short breaks are 5 minutes each and you don't take a break after the fourth pomodoro?
= 115
! 4 · 25 + 3 · 5 = 115 minutes.

? Which technique helps most if starting the assignment is hard?
- wait until you feel like it
+ the 5-minute rule and writing down the first small step
- one more episode of the series
- reading all the chat messages
! Starting is the hardest part.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Correction factor.** Write the function `factor(log)`, which from a list of `(estimate, actual time)` pairs computes the median of the actual/estimate ratios (to 2 decimals)!

```python starter
def factor(log):
    return round(sum(a for _, a in log) / sum(e for e, _ in log), 2)
```

<details>
<summary>Solution</summary>

```python solution
from statistics import median

def factor(log):
    return round(median(a / e for e, a in log), 2)   # the median is less sensitive to outliers
```

</details>

```python test
assert factor([(2, 3), (4, 6), (5, 7.5)]) == 1.5
assert factor([(2, 3.5), (3, 4.5), (4, 6), (2, 2.5), (5, 9), (3, 4.5)]) == 1.5
assert factor([(1, 1), (1, 10), (1, 2)]) == 2.0
print("All checks passed!")
```

**2.** **Weekly capacity.** Write the function `plannable(fixed, reserve)`, which subtracts the sum of fixed times (`{activity: hours}`) from the 168 hours of a week, and sets aside a `reserve` share of what's left – returning the number of plannable hours (to 1 decimal)!

```python starter
def plannable(fixed, reserve):
    return round(168 - sum(fixed.values()) - reserve, 1)
```

<details>
<summary>Solution</summary>

```python solution
def plannable(fixed, reserve):
    free = 168 - sum(fixed.values())           # what's left after fixed times
    return round(free * (1 - reserve), 1)
```

</details>

```python test
assert plannable({"sleep": 52.5, "classes": 22, "other": 58}, 0.2) == 28.4
assert plannable({"everything": 138}, 0.2) == 24.0
assert plannable({}, 0) == 168.0
print("All checks passed!")
```

**3.** **Maximum lateness.** Write the function `edd_lateness(tasks)`, which takes `(name, duration, deadline)` triples, does them one after another sorted by deadline (starting at day 0), and returns the maximum lateness in days (0 if nothing is late)!

```python starter
def edd_lateness(tasks):
    time, late = 0, 0
    for _, length, deadline in tasks:
        time += length
        late = max(late, time - deadline)
    return late
```

<details>
<summary>Solution</summary>

```python solution
def edd_lateness(tasks):
    time, late = 0, 0
    for _, length, deadline in sorted(tasks, key=lambda t: t[2]):   # nearest deadline first
        time += length
        late = max(late, time - deadline)
    return late
```

</details>

```python test
t = [("essay", 4, 5), ("lab", 1, 7), ("docs", 3, 4), ("practice", 2, 9)]
assert edd_lateness(t) == 2
assert edd_lateness([("a", 1, 5), ("b", 1, 5)]) == 0
assert edd_lateness([("long", 5, 10), ("short", 1, 1)]) == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? What is Parkinson's law?
+ work expands to fill the time available
- the most important tasks should be done first
- every task takes twice as long
- 20% of the work brings 80% of the result
! That's why a shorter but realistic deadline helps.

? You plan 25 Pomodoro units (25 minutes of work + 5 minutes of break) for a week. How many hours is that in total, breaks included? (as a decimal)
= 12,5
= 12.5
! $25 \cdot 30 = 750$ minutes $= 12.5$ hours.

? Which is a SMART goal?
- "I'll get better at programming."
+ "By 30 November I'll solve all 20 exercises of the practice set."
- "I'll study a lot."
- "Someday I'll learn Docker."
! Specific, measurable, achievable, relevant and time-bound.

? Which quadrant of the Eisenhower matrix does a not urgent but important task (e.g. preparing for an exam weeks ahead) belong to?
- do it immediately
+ schedule it (give it a time slot)
- delegate it
- drop it
! This quadrant brings the most long-term value.
```
