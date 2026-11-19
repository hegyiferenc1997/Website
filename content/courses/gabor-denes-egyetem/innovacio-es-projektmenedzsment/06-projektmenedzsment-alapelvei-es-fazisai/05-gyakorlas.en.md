---
title: Practice – Project Management Basics
summary: Review questions and a summary worksheet for the sixth topic.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Is "maintaining the website" a project? And "redesigning the website"?</summary>

Maintenance is ongoing, repetitive operations, not a project. The redesign is a project: it is temporary, has a start and an end, and creates a unique result (the new website).

</details>

<details>
<summary>2. The client wants handover two weeks earlier. What options does the project manager have, based on the iron triangle?</summary>

Reduce scope (fewer features in the first delivery), increase cost (more people, overtime), or – worst – give up on quality (less testing). This must be decided together with the client.

</details>

<details>
<summary>3. Why must the project charter be approved?</summary>

Because it officially starts the project: it records the goal and the main constraints, and authorises the project manager to use resources. Without approval there is no clear mandate.

</details>

<details>
<summary>4. Why is risk highest at the start of a project, and yet why is it cheapest to change there?</summary>

At the start much is still unknown, so uncertainty is high. At the same time little work has been done, so changing a decision only affects the plans; no finished work has to be thrown away.

</details>

## Summary worksheet

```quiz required
? Which is **not** a characteristic of a project?
- temporary
- creates a unique result
+ repeats the same result again and again
- works with limited resources
! Repetition is a feature of ongoing operations.

? Which element of the iron triangle does the agile approach let **vary**?
- time
- cost
+ scope
- none
! Time (sprint) and cost (team) are fixed, scope is flexible.

? In which process group are lessons learned collected?
- initiating
- executing
- monitoring and controlling
+ closing
! Closing includes handover, closing contracts and recording lessons learned.

? Which process group includes handling change requests?
- initiating
- planning
+ monitoring and controlling
- closing
! Change control is part of controlling.

? Which organisation publishes the PMBOK Guide? (abbreviation)
= PMI
! Project Management Institute.

? Which PRINCE2 principle says the project must remain justified from a business point of view throughout?
+ continued business justification
- focus on products
- manage by exception
- learn from experience
! If the business case disappears, the project must be stopped.

? Which tool would you use to show activities on a **timeline**?
- RACI matrix
+ Gantt chart
- risk register
- Business Model Canvas
! Activities in rows, time horizontally.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Communication channels.** Write the function `channels(n)` (the number of channels in an `n`-person team) and the function `subteam_channels(sizes)`, which for sub-teams gives the sum of the internal channels and the channels between the sub-team leads!

```python starter
def channels(n):
    return n * (n - 1)

def subteam_channels(sizes):
    return sum(channels(s) for s in sizes)
```

<details>
<summary>Solution</summary>

```python solution
def channels(n):
    return n * (n - 1) // 2                # every pair is one channel

def subteam_channels(sizes):
    return sum(channels(s) for s in sizes) + channels(len(sizes))   # + the leads among themselves
```

</details>

```python test
assert channels(6) == 15
assert channels(12) == 66
assert subteam_channels([6, 6]) == 31
assert subteam_channels([4, 4, 4]) == 21
print("All checks passed!")
```

**2.** **Team size and duration.** Write the function `duration(work, n, loss)`: in how many weeks do `n` people finish a task of `work` person-weeks, if every additional member reduces everyone's efficiency by the ratio `loss` (to 1 decimal)? `shortest(work, loss, max_n)` should tell with how many people (between 1 and `max_n`) the project is shortest!

```python starter
def duration(work, n, loss):
    return round(work / n, 1)

def shortest(work, loss, max_n):
    return max_n
```

<details>
<summary>Solution</summary>

Beyond a point every new person takes away more through communication than they add – that's the essence of Brooks's law.

```python solution
def duration(work, n, loss):
    return round(work / (n * (1 - loss * (n - 1))), 1)   # effective capacity

def shortest(work, loss, max_n):
    valid = [n for n in range(1, max_n + 1) if 1 - loss * (n - 1) > 0]
    return min(valid, key=lambda n: work / (n * (1 - loss * (n - 1))))
```

</details>

```python test
assert duration(120, 10, 0.03) == 16.4
assert duration(60, 3, 0.05) == 22.2
assert shortest(120, 0.03, 30) == 17
assert shortest(120, 0.04, 30) == 13
print("All checks passed!")
```

**3.** **Early review.** Fixing a defect in the requirements phase costs `base` Ft, in testing 20 times as much. Write the function `total_cost(defects, base, filtered, review)`: a requirements review costing `review` Ft filters out the `filtered` share of the defects right at the start, and the rest we fix in testing. What is the total cost (rounded to a whole number)?

```python starter
def total_cost(defects, base, filtered, review):
    return round(review + defects * base * 20)
```

<details>
<summary>Solution</summary>

```python solution
def total_cost(defects, base, filtered, review):
    early = defects * filtered * base              # cheaply, in the requirements phase
    late = defects * (1 - filtered) * base * 20    # expensively, in testing
    return round(review + early + late)
```

</details>

```python test
assert total_cost(40, 50_000, 0.6, 600_000) == 17_800_000
assert total_cost(40, 50_000, 0, 0) == 40_000_000
assert total_cost(10, 20_000, 0.5, 100_000) == 2_200_000
print("All checks passed!")
```

### Quick check questions

```quiz
? What are the three corners of the project triangle?
+ scope, time, cost
- team, customer, sponsor
- planning, execution, closing
- risk, quality, communication
! If one changes, at least one other has to change too.

? What distinguishes a project from ongoing operations?
- a project is always more expensive
+ a project is unique and temporary: it has a start and an end
- a project has no team
- ongoing operations have a deadline
! Operations are repetitive; a project creates a one-off result.

? How many communication channels are there in an 8-person team?
= 28
! $\frac{8 \cdot 7}{2} = 28$.

? Which process group includes monitoring and controlling changes?
- initiating
- closing
+ monitoring and controlling
- planning
! This process group runs through the project's whole life cycle.
```
