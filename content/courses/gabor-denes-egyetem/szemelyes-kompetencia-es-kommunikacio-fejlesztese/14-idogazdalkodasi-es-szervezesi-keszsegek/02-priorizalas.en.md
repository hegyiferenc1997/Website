---
title: Prioritising
summary: The Eisenhower matrix (urgent–important), the Pareto principle (80/20), the ABC method, and a small Python program that sorts your to-dos.
minutes: 20
---

## What you will learn

- the **Eisenhower matrix**,
- the **Pareto principle** (80/20),
- the **ABC method**,
- how to **say no** to unimportant things.

## Urgent or important?

Attributed to US President Dwight D. Eisenhower: "What is important is seldom urgent, and what is urgent is seldom important."

- **Urgent**: demands immediate attention (ringing, flashing, due today).
- **Important**: contributes to your long-term goals.

## The Eisenhower matrix

```text
                  URGENT                     NOT URGENT
           ┌──────────────────────┬──────────────────────┐
 IMPORTANT │ 1. DO IT NOW         │ 2. SCHEDULE IT       │
           │ tomorrow's exam,     │ regular study,       │
           │ a production bug     │ portfolio project,   │
           │                      │ exercise, sleep      │
           ├──────────────────────┼──────────────────────┤
 NOT       │ 3. DELEGATE / SHORTEN│ 4. DROP IT           │
 IMPORTANT │ many notifications,  │ aimless scrolling,   │
           │ some meetings        │ an unneeded series   │
           └──────────────────────┴──────────────────────┘
```

**Quadrant 2** is the most important: if you give it enough time (regular study, health, relationships, growth), fewer things slip into quadrant 1 as firefighting.

## Try it: a small sorting program

```python run
# Sorting to-dos into the quadrants of the Eisenhower matrix.
todos = [
    ("submitting tomorrow's assignment", True, True),
    ("continuing the portfolio project", False, True),
    ("checking notifications in the group chat", True, False),
    ("browsing videos", False, False),
    ("weekly workout", False, True),
]

quadrants = {
    (True, True): "1. Do it now",
    (False, True): "2. Schedule it",
    (True, False): "3. Delegate / shorten",
    (False, False): "4. Drop it",
}

for name, urgent, important in todos:
    print(f"{quadrants[(urgent, important)]:<25} {name}")
```

Change the list to your own weekly to-dos!

## The Pareto principle (80/20)

From the observation of Italian economist Vilfredo Pareto: in many situations **about 80% of results come from about 20% of the effort**. It isn't an exact law of nature, but a common pattern.

- Most bugs are in a small part of the code.
- Users mainly use a small share of the features.
- A few basic concepts of the exam material are needed for most of the problems.

Ask: **which is the 20%** that brings the most results?

## The ABC method

Simple daily prioritisation:

- **A** – very important, must be done today (serious consequences if not),
- **B** – important, but can wait,
- **C** – would be nice, but no serious consequences if skipped.

Number the A tasks too (A1, A2…), and **start with A1** – not with the easy Cs just because ticking them off feels good.

## Saying no

Every "yes" is a "no" to something else. When a new request comes, ask:

- Where does it fall in the Eisenhower matrix?
- What do I drop instead?
- If it doesn't fit, give an **assertive no** (see topic 3), or offer another time.

## Summary

- Eisenhower: 1. do it, 2. schedule it, 3. delegate it, 4. drop it – quadrant 2 is the most important.
- Pareto: most of the results come from a small part of the effort.
- ABC: start with A1, not with the easy tasks.
- Every "yes" is a "no" to something else.

## Exercise

```quiz required
? Which quadrant of the Eisenhower matrix does regular weekly study for an exam two months away belong to?
- 1. urgent and important
+ 2. not urgent but important
- 3. urgent but not important
- 4. neither urgent nor important
! Important, but not pressing yet – schedule it.

? What should you do with quadrant 4 (neither urgent nor important) tasks?
- do them immediately
- schedule them
+ drop them or reduce them to a minimum
- delegate them to your manager
! E.g. aimless scrolling.

? Of an app's 50 features, most user time is spent on 10. Which principle does this illustrate?
- Parkinson's law
+ the Pareto principle
- SMART
- the Eisenhower principle
! Roughly an 80/20 ratio.

? In the ABC method, what should you start the day with?
- the easiest C task
- the most interesting B task
+ A1, the most important task
- checking emails
! The most important, not the easiest.
```
