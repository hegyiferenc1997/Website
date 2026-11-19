---
title: Practice – Software Development
summary: Review questions and a summary worksheet on the life cycle, development models and testing.
minutes: 45
kind: practice
---

## Review questions

<details>
<summary>1. Write two functional and two non-functional requirements for a university canteen ordering app!</summary>

Functional: “A student can pre-order their lunches for the week.” “A canteen worker can see the list of the day's orders.” Non-functional: “It serves 2,000 simultaneous users at noon.” “It works on mobile and desktop and is accessible.”

</details>

<details>
<summary>2. Why is the waterfall model a poor fit for a new mobile app whose market is still uncertain?</summary>

Because user needs are discovered and change along the way; with waterfall they would only see the product at the end. With an agile method a testable version is made every two weeks, and the direction can change based on feedback.

</details>

<details>
<summary>3. What edge cases would you test for an `average(items)` function?</summary>

Empty list, one-element list, negative numbers, decimals, a very long list, and whether it modifies the input list.

</details>

```python run
# Let's test a function that finds the largest element, with edge cases too
def largest(items):
    if not items:
        return None
    m = items[0]
    for x in items:
        if x > m:
            m = x
    return m

assert largest([3, 9, 2]) == 9
assert largest([-5, -2, -8]) == -2   # only negatives
assert largest([7]) == 7             # one element
assert largest([]) is None           # empty list
print("All tests passed.")
```

## Summary worksheet

```quiz required
? What is the second phase of the SDLC after requirements?
- testing
+ design
- maintenance
- deployment
! Requirements → design → implementation → testing → deployment → maintenance.

? What is a 1–4 week development cycle in Scrum called?
= sprint
! At its end there is a testable product version.

? Which test level does the client perform?
- unit test
- integration test
- system test
+ acceptance test
! It checks whether they got what they asked for.

? What does the `largest` function above return for the list `[-5, -2, -8]`?
= -2
! Among the negative numbers, −2 is the largest.

? Which user story has the correct form?
+ As a student I want to download the notes so that I can study offline.
- The database should be PostgreSQL.
- The button should be blue.
- Let's write lots of code.
! Role – need – goal.

? What is the CD in CI/CD?
+ Continuous Delivery/Deployment
- compact disc
- code review
- central documentation
! The tested version can be released automatically.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Grade calculator with boundaries.** Write the `grade(points)` function (0–100 points): 5 from 85, 4 from 70, 3 from 60, 2 from 50, 1 below that! If the score is outside 0 to 100, raise a `ValueError`.

```python starter
def grade(points):
    if points > 85: return 5
    if points > 70: return 4
    if points > 60: return 3
    if points > 50: return 2
    return 1
```

<details>
<summary>Solution</summary>

```python solution
def grade(points):
    if not 0 <= points <= 100:
        raise ValueError("invalid score")
    for limit, g in [(85, 5), (70, 4), (60, 3), (50, 2)]:
        if points >= limit:                   # the boundary itself already gives the better grade
            return g
    return 1
```

</details>

```python test
for p, v in [(0, 1), (49, 1), (50, 2), (60, 3), (69, 3), (70, 4), (85, 5), (100, 5)]:
    assert grade(p) == v, f"{p} points should give {v}"
try:
    grade(101)
    assert False, "a ValueError was expected"
except ValueError:
    pass
print("All checks passed!")
```

**2.** **Cost of bugs.** Write the `fix_hours(bugs, factor)` function, which, from a `{phase number (from 1): number of bugs}` dictionary, computes the total fixing hours if a bug in phase 1 takes 1 hour and gets `factor` times more expensive with every phase!

```python starter
def fix_hours(bugs, factor):
    return sum(n * factor for n in bugs.values())
```

<details>
<summary>Solution</summary>

```python solution
def fix_hours(bugs, factor):
    return sum(n * factor ** (phase - 1) for phase, n in bugs.items())   # 1, f, f², ...
```

</details>

```python test
assert fix_hours({4: 40}, 3) == 1080
assert fix_hours({2: 20, 4: 20}, 3) == 600
assert fix_hours({1: 5, 5: 1}, 2) == 21
print("All checks passed!")
```

**3.** **Branch coverage.** Write the `coverage(all_branches, executed)` function, which, from two lists (the names of all branches and the names of branches executed during the tests – may repeat), gives the coverage in percent (to 1 decimal)!

```python starter
def coverage(all_branches, executed):
    return round(100 * len(executed) / len(all_branches), 1)
```

<details>
<summary>Solution</summary>

```python solution
def coverage(all_branches, executed):
    unique = set(executed) & set(all_branches)     # every branch counts only once
    return round(100 * len(unique) / len(all_branches), 1)
```

</details>

```python test
assert coverage(["a", "b", "c", "d"], ["a", "b", "a", "c"]) == 75.0
assert coverage(["a", "b", "c"], []) == 0.0
assert coverage(["x", "y", "z"], ["x", "y", "z", "x"]) == 100.0
print("All checks passed!")
```

### Quick check questions

```quiz
? Which is a non-functional requirement?
- "The user can change their password."
+ "The page loads within 2 seconds even with 1000 simultaneous users."
- "The system produces a PDF invoice."
- "The admin can delete a user."
! A non-functional requirement is about quality (speed, security).

? At most how many minutes is a Scrum sprint's daily meeting (daily)?
= 15
! A short meeting that can be held standing.

? What is a unit test?
+ an automatic check of a single small piece of code (e.g. a function) in isolation
- trying out the whole system with the client
- checking the code's formatting
- a load test of the server
! It's fast and shows exactly where the bug is.

? What does CD mean in CI/CD?
- code review
+ continuous delivery/deployment: a tested change can be released, or goes out, automatically
- coding standard
- central documentation
! CI checks, CD delivers.
```
