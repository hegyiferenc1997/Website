---
title: Deeper – Software Development in Numbers
summary: What a bug costs in different phases, waterfall versus iterative development in terms of delivered value, boundary-value testing and equivalence classes, measuring test coverage, and the steps of a CI pipeline by simulation – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- why finding a bug early is **cheaper** than finding it late,
- how waterfall and iterative development compare in terms of **delivered value**,
- how to choose **good test cases** (boundary values, equivalence classes),
- what **test coverage** measures, and what a **CI** pipeline does.

## 1. What does a bug cost?

A misunderstood requirement can be fixed with a conversation during planning. If it only turns up in the live system, it has to be redesigned, recoded, retested and released – and users suffer meanwhile. According to an often-quoted rule of thumb, the cost of a fix **multiplies** from phase to phase (the exact factor varies a lot between projects, but the trend is clear):

```python run
# Relative cost of fixing a bug by the phase it's found in (illustrative factors)
phases = ["requirements", "design", "coding", "testing", "production"]
factor = 3                                   # assumption: three times the cost per phase
base_hours = 1                               # 1 hour if found during requirements

for i, p in enumerate(phases):
    print(f"{p:<13} {base_hours * factor ** i:>4} hours")

# 40 bugs in a project: how much is saved if half are found already in design?
late = 40 * base_hours * factor ** 3                              # all found in testing
early = 20 * base_hours * factor ** 1 + 20 * base_hours * factor ** 3
print(f"\nall in testing: {late} hours, half already in design: {early} hours")
```

```plot
title: Relative cost of fixing a bug as a function of the phase number
x: 1, 5
y: 0, 100
param: s = 3, 1.5, 5, 0.5
f: s^(x - 1) # s times the cost per phase
```

That's why **code review**, **talking designs through together** and **automated tests** as early as possible pay off – they catch bugs at the start of the curve. With the slider you set the factor: even with a modest 1.5× growth, there's a fivefold difference between the first and last phases.

## 2. Waterfall or iterative? Delivered value

In the basic lesson we saw the two approaches. Let's look at them from the **client's viewpoint**: when do they get usable software? In a 10-month project, with waterfall everything arrives at the end; with iterative development they get one working part each month, the most important first:

```python run
# Value delivered per month: waterfall vs. iterative development (10 months, 10 features)
values = [30, 20, 12, 10, 8, 6, 5, 4, 3, 2]       # the features' value, in order of importance (100 total)

waterfall, iterative = [], []
for month in range(1, 11):
    waterfall.append(100 if month == 10 else 0)     # everything at the end
    iterative.append(sum(values[:month]))           # one feature a month, the most important first

print("month  waterfall  iterative")
for m, w, i in zip(range(1, 11), waterfall, iterative):
    print(f"{m:>5} {w:>10} {i:>10}")

# what if the project's money runs out in month 6?
print(f"\nstop after month 6: waterfall gives {waterfall[5]}%, iterative {iterative[5]}% of the value")
```

If the project is stopped early (money runs out, the market changes), with waterfall the client gets **nothing**, with iterative development 86% of the value by month 6. What's more, early feedback lets you **change direction** along the way. Waterfall has its place too: if requirements are stable and well known (e.g. a control system built to a standard, a system fixed in a contract), pre-planned steps are more predictable.

## 3. Good test cases: boundary values and equivalence classes

You can't try every input. Two proven ideas:

- **equivalence classes**: split the inputs into groups within which the program behaves "the same", and pick one case from each,
- **boundary-value analysis**: many bugs sit at the **boundaries** of the groups (`<` instead of `<=`), so always test the boundaries and their neighbours.

Example: a grade function turns a score (0–100) into a grade; below 50 it's a fail (1), from 50 a pass (2), …, from 85 excellent (5):

```python run
# Boundary-value testing: a deliberately buggy and a correct grade function
def grade_buggy(score):
    if score > 85: return 5                  # BUG: should be >=
    if score >= 70: return 4
    if score >= 60: return 3
    if score >= 50: return 2
    return 1

def grade(score):
    if not 0 <= score <= 100:
        raise ValueError("the score must be between 0 and 100")
    for limit, g in [(85, 5), (70, 4), (60, 3), (50, 2)]:
        if score >= limit:
            return g
    return 1

# test cases: every boundary, with one value below and above it
cases = [(0, 1), (49, 1), (50, 2), (59, 2), (60, 3), (69, 3), (70, 4), (84, 4), (85, 5), (100, 5)]
for f in (grade_buggy, grade):
    wrong = [(s, f(s), expected) for s, expected in cases if f(s) != expected]
    print(f"{f.__name__:<12} failing cases: {wrong}")

# invalid input is an equivalence class too
for bad in (-1, 101):
    try:
        grade(bad)
    except ValueError as e:
        print(f"{bad}: {e}")
```

An "average" test value (e.g. 90 or 75) would never have found the bug – but the **boundary value** 85 finds it immediately. The same thinking matters in security: attackers try exactly the edge cases (empty text, a negative number, a very long input).

## 4. Test coverage and CI

**Test coverage** measures what percentage of the code ran during the tests. A simple version: how many **branches** (the outcomes of each `if`) ran at least once?

```python run
# Measuring branch coverage by hand: which branch ran during the tests?
ran = set()

def shipping_fee(amount, express):
    if amount >= 20000:
        ran.add("free"); fee = 0
    else:
        ran.add("paid"); fee = 1500
    if express:
        ran.add("express"); fee += 2000
    else:
        ran.add("standard")
    return fee

assert shipping_fee(25000, False) == 0
assert shipping_fee(5000, False) == 1500
all_branches = {"free", "paid", "express", "standard"}
print(f"coverage: {len(ran)}/{len(all_branches)} branches, missed: {all_branches - ran}")
```

Coverage is a useful signal (a test certainly can't find a bug in what **doesn't** run during tests), but even 100% is no guarantee: a line that ran can still have wrong logic if the test doesn't check the result.

**CI** (continuous integration) means that for every uploaded change a sequence of steps runs automatically; if any step fails, the change can't get into the main branch:

```python run
# A CI pipeline simulation: steps run in order and stop at the first failure
def ci(change):
    steps = [
        ("format check", change["formatted"]),
        ("static analysis (lint)", change["lint_errors"] == 0),
        ("unit tests", change["failed_tests"] == 0),
        ("build", True),
    ]
    for name, ok in steps:
        print(f"  {'✓' if ok else '✗'} {name}")
        if not ok:
            return "REJECTED – fix it and upload again"
    return "green – ready for code review"

print("change 1:", ci({"formatted": True, "lint_errors": 0, "failed_tests": 2}))
print("change 2:", ci({"formatted": True, "lint_errors": 0, "failed_tests": 0}))
```

| Viewpoint     | What do testing and CI mean to them?                                          |
| ------------- | ----------------------------------------------------------------------------- |
| **developer** | fast feedback, bolder refactoring (the tests speak up if something breaks)    |
| **tester**    | the machine does routine checks, they can focus on edge cases and exploration |
| **client**    | fewer bugs in production, more predictable releases                           |
| **team lead** | an investment of time and money that pays off in later fixes                  |

## Summary

- The later a bug is found, the more expensive the fix; code review and early tests catch bugs at the start of the curve.
- Iterative development delivers value sooner and gives a usable result even if stopped early; waterfall is more predictable with stable requirements.
- Good test cases come from equivalence classes and boundary values.
- Test coverage is a signal, not a guarantee; CI checks every change automatically.

## Lesson exercise

```quiz required
? If fixing a bug gets three times more expensive per phase, how many times more expensive is it in phase 5 (production) than in phase 1?
= 81
! $3^4 = 81$.

? A function allows registration from age 18. Which is the best boundary-value test pair?
- 5 and 50
+ 17 and 18
- 0 and 100
- 25 and 30
! The bug is often at the boundary (`>` or `>=`).

? A function has 8 branches, and 6 ran during the tests. What is the branch coverage in percent?
= 75
! $6 / 8 = 75\%$.

? A project's money runs out halfway through. With which approach is the client more likely to get usable software?
- waterfall
+ iterative (agile), because by then they've received working parts, the most important first
- neither
- the same with both
! Iterative development delivers value continuously.

? What happens in a CI pipeline if the unit tests fail?
- the change automatically gets into the main branch
+ the pipeline stops, and the change can't get in until it's fixed
- the tests are deleted
- nothing
! CI filters out a faulty change before it gets in.
```
